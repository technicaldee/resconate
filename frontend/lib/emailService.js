const { pool } = require('./database');

/**
 * Enhanced Email Service with SendGrid and Mailgun integration
 */
class EmailService {
  constructor() {
    this.provider = process.env.EMAIL_PROVIDER || 'smtp';
    this.apiKey = process.env.EMAIL_API_KEY;
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@resconate.com';
    this.fromName = process.env.FROM_NAME || 'Resconate';
    this.sendGridApiKey = process.env.SENDGRID_API_KEY;
    this.mailgunApiKey = process.env.MAILGUN_API_KEY;
    this.mailgunDomain = process.env.MAILGUN_DOMAIN;
  }

  async sendEmail({ to, subject, html, text, type = 'general', attachments = [] }) {
    try {
      // Log email attempt
      const logResult = await pool.query(
        `INSERT INTO email_logs (recipient_email, subject, email_type, status)
         VALUES ($1, $2, $3, 'pending')
         RETURNING id`,
        [to, subject, type]
      );

      const logId = logResult.rows[0]?.id;
      let result;

      // Send via configured provider
      if (this.provider === 'sendgrid' && this.sendGridApiKey) {
        result = await this.sendViaSendGrid({ to, subject, html, text, attachments });
      } else if (this.provider === 'mailgun' && this.mailgunApiKey) {
        result = await this.sendViaMailgun({ to, subject, html, text, attachments });
      } else {
        // Fallback: log only (for development)
        console.log(`[EMAIL] To: ${to}, Subject: ${subject}`);
        result = { success: true, message: 'Email logged (development mode)' };
      }

      // Update log as sent
      if (logId && result.success) {
        await pool.query(
          `UPDATE email_logs SET status = 'sent', sent_at = CURRENT_TIMESTAMP WHERE id = $1`,
          [logId]
        );
      }

      return { success: true, logId, ...result };
    } catch (error) {
      console.error('Email sending error:', error);
      
      // Update log with error
      if (logId) {
        await pool.query(
          `UPDATE email_logs SET status = 'failed', error_message = $1 WHERE id = $2`,
          [error.message, logId]
        );
      }

      return { success: false, error: error.message };
    }
  }

  async sendViaSendGrid({ to, subject, html, text, attachments }) {
    try {
      // SendGrid integration
      if (!this.sendGridApiKey) {
        throw new Error('SendGrid API key not configured');
      }

      // Dynamic import for SendGrid
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(this.sendGridApiKey);

      const msg = {
        to,
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject,
        text,
        html,
        ...(attachments.length > 0 && { attachments })
      };

      await sgMail.send(msg);
      return { success: true, provider: 'sendgrid' };
    } catch (error) {
      console.error('SendGrid error:', error);
      throw error;
    }
  }

  async sendViaMailgun({ to, subject, html, text, attachments }) {
    try {
      // Mailgun integration
      if (!this.mailgunApiKey || !this.mailgunDomain) {
        throw new Error('Mailgun API key or domain not configured');
      }

      const formData = require('form-data');
      const Mailgun = require('mailgun.js');
      const mailgun = new Mailgun(formData);
      const mg = mailgun.client({
        username: 'api',
        key: this.mailgunApiKey
      });

      const messageData = {
        from: `${this.fromName} <${this.fromEmail}>`,
        to: [to],
        subject,
        text,
        html,
        ...(attachments.length > 0 && {
          attachment: attachments.map(att => ({
            filename: att.filename,
            data: att.content
          }))
        })
      };

      await mg.messages.create(this.mailgunDomain, messageData);
      return { success: true, provider: 'mailgun' };
    } catch (error) {
      console.error('Mailgun error:', error);
      throw error;
    }
  }

  // Template methods with enhanced templates
  async sendWelcomeEmail(employee) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6366F1 0%, #EC4899 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #6366F1; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Resconate!</h1>
          </div>
          <div class="content">
            <h2>Hello ${employee.name}!</h2>
            <p>Your employee account has been successfully created.</p>
            <p><strong>Employee ID:</strong> ${employee.employee_id}</p>
            <p><strong>Email:</strong> ${employee.email}</p>
            <p>You can now access your employee portal and manage your HR information.</p>
            <a href="${process.env.APP_URL}/employee-login" class="button">Access Employee Portal</a>
            <p style="margin-top: 30px; font-size: 12px; color: #666;">
              If you have any questions, please contact your HR department.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    return this.sendEmail({
      to: employee.email,
      subject: 'Welcome to Resconate - Your Account is Ready!',
      html,
      type: 'welcome'
    });
  }

  async sendLeaveNotification(leaveRequest, approverEmail) {
    const statusText = leaveRequest.status === 'approved' ? 'Approved' : 
                      leaveRequest.status === 'rejected' ? 'Rejected' : 'Pending';
    const statusColor = leaveRequest.status === 'approved' ? '#10B981' : 
                       leaveRequest.status === 'rejected' ? '#EF4444' : '#F59E0B';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${statusColor};">Leave Request ${statusText}</h2>
        <p><strong>Employee:</strong> ${leaveRequest.employee_name}</p>
        <p><strong>Type:</strong> ${leaveRequest.leave_type}</p>
        <p><strong>Dates:</strong> ${leaveRequest.start_date} to ${leaveRequest.end_date}</p>
        <p><strong>Days:</strong> ${leaveRequest.days_requested}</p>
        ${leaveRequest.reason ? `<p><strong>Reason:</strong> ${leaveRequest.reason}</p>` : ''}
        <p><a href="${process.env.APP_URL}/hr-dashboard">View in Dashboard</a></p>
      </div>
    `;

    return this.sendEmail({
      to: approverEmail,
      subject: `Leave Request ${statusText} - ${leaveRequest.employee_name}`,
      html,
      type: 'leave_notification'
    });
  }

  async sendPayrollNotification(employee, payroll) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Payslip Available</h2>
        <p>Dear ${employee.name},</p>
        <p>Your payslip for the period <strong>${payroll.pay_period_start}</strong> to <strong>${payroll.pay_period_end}</strong> is now available.</p>
        <div style="background: #f0f0f0; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Net Salary:</strong> ₦${parseFloat(payroll.net_salary).toLocaleString()}</p>
          <p><strong>Gross Salary:</strong> ₦${parseFloat(payroll.gross_salary).toLocaleString()}</p>
        </div>
        <p><a href="${process.env.APP_URL}/employee-portal" style="display: inline-block; padding: 10px 20px; background: #6366F1; color: white; text-decoration: none; border-radius: 5px;">View Payslip</a></p>
      </div>
    `;

    return this.sendEmail({
      to: employee.email,
      subject: 'Payslip Available - Resconate',
      html,
      type: 'payroll_notification'
    });
  }

  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your Resconate account.</p>
        <p>Click the button below to reset your password:</p>
        <p><a href="${resetUrl}" style="display: inline-block; padding: 12px 30px; background: #6366F1; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p style="color: #666; font-size: 12px;">This link will expire in 1 hour.</p>
        <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Password Reset Request - Resconate',
      html,
      type: 'password_reset'
    });
  }

  async sendPerformanceReviewNotification(employee, review) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Performance Review Available</h2>
        <p>Dear ${employee.name},</p>
        <p>Your performance review for the period <strong>${review.review_period_start}</strong> to <strong>${review.review_period_end}</strong> is now available.</p>
        <div style="background: #f0f0f0; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Rating:</strong> ${review.rating}/5</p>
        </div>
        <p><a href="${process.env.APP_URL}/employee-portal" style="display: inline-block; padding: 10px 20px; background: #6366F1; color: white; text-decoration: none; border-radius: 5px;">View Review</a></p>
      </div>
    `;

    return this.sendEmail({
      to: employee.email,
      subject: 'Performance Review Available - Resconate',
      html,
      type: 'performance_review'
    });
  }

  // Email queue processing
  async processEmailQueue() {
    try {
      const pendingEmails = await pool.query(
        `SELECT * FROM email_logs WHERE status = 'pending' ORDER BY created_at ASC LIMIT 50`
      );

      for (const email of pendingEmails.rows) {
        // Process each pending email
        // This would fetch email details and send
      }
    } catch (error) {
      console.error('Email queue processing error:', error);
    }
  }
}

module.exports = new EmailService();

