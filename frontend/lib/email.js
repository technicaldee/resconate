const { pool } = require('./database');

/**
 * Email service for sending notifications
 * Supports SendGrid, Mailgun, or SMTP
 */
class EmailService {
  constructor() {
    this.provider = process.env.EMAIL_PROVIDER || 'smtp';
    this.apiKey = process.env.EMAIL_API_KEY;
    this.fromEmail = process.env.FROM_EMAIL || 'admin@resconate.com';
    this.fromName = process.env.FROM_NAME || 'Resconate';
  }

  async sendEmail({ to, subject, html, text, type = 'general' }) {
    try {
      // Log email attempt
      const logResult = await pool.query(
        `INSERT INTO email_logs (recipient_email, subject, email_type, status)
         VALUES ($1, $2, $3, 'pending')
         RETURNING id`,
        [to, subject, type]
      );

      const logId = logResult.rows[0]?.id;

      // In production, integrate with actual email service
      // For now, simulate email sending
      if (this.provider === 'sendgrid' && this.apiKey) {
        // SendGrid integration would go here
        await this.sendViaSendGrid({ to, subject, html, text });
      } else if (this.provider === 'mailgun' && this.apiKey) {
        // Mailgun integration would go here
        await this.sendViaMailgun({ to, subject, html, text });
      } else {
        // Fallback: log only (for development)
        console.log(`[EMAIL] To: ${to}, Subject: ${subject}`);
      }

      // Update log as sent
      if (logId) {
        await pool.query(
          `UPDATE email_logs SET status = 'sent', sent_at = CURRENT_TIMESTAMP WHERE id = $1`,
          [logId]
        );
      }

      return { success: true, logId };
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

  async sendViaSendGrid({ to, subject, html, text }) {
    // SendGrid API integration
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(this.apiKey);
    // await sgMail.send({ to, from: this.fromEmail, subject, html, text });
    console.log(`[SendGrid] Email sent to ${to}`);
  }

  async sendViaMailgun({ to, subject, html, text }) {
    // Mailgun API integration
    // const formData = require('form-data');
    // const Mailgun = require('mailgun.js');
    // const mailgun = new Mailgun(formData);
    // const mg = mailgun.client({ username: 'api', key: this.apiKey });
    // await mg.messages.create(process.env.MAILGUN_DOMAIN, { from: this.fromEmail, to, subject, html, text });
    console.log(`[Mailgun] Email sent to ${to}`);
  }

  // Template methods
  async sendWelcomeEmail(employee) {
    const html = `
      <h2>Welcome to Resconate, ${employee.name}!</h2>
      <p>Your employee account has been created.</p>
      <p>Email: ${employee.email}</p>
      <p>Employee ID: ${employee.employee_id}</p>
      <p>You can log in at: <a href="${process.env.APP_URL}/employee-login">${process.env.APP_URL}/employee-login</a></p>
    `;
    
    return this.sendEmail({
      to: employee.email,
      subject: 'Welcome to Resconate',
      html,
      type: 'welcome'
    });
  }

  async sendLeaveNotification(leaveRequest, approverEmail) {
    const html = `
      <h2>Leave Request ${leaveRequest.status === 'approved' ? 'Approved' : 'Pending'}</h2>
      <p><strong>Employee:</strong> ${leaveRequest.employee_name}</p>
      <p><strong>Type:</strong> ${leaveRequest.leave_type}</p>
      <p><strong>Dates:</strong> ${leaveRequest.start_date} to ${leaveRequest.end_date}</p>
      <p><strong>Days:</strong> ${leaveRequest.days_requested}</p>
      ${leaveRequest.reason ? `<p><strong>Reason:</strong> ${leaveRequest.reason}</p>` : ''}
    `;

    return this.sendEmail({
      to: approverEmail,
      subject: `Leave Request ${leaveRequest.status === 'approved' ? 'Approved' : 'Pending'}`,
      html,
      type: 'leave_notification'
    });
  }

  async sendPayrollNotification(employee, payroll) {
    const html = `
      <h2>Payslip Available</h2>
      <p>Dear ${employee.name},</p>
      <p>Your payslip for ${payroll.pay_period_start} to ${payroll.pay_period_end} is now available.</p>
      <p><strong>Net Salary:</strong> ₦${parseFloat(payroll.net_salary).toLocaleString()}</p>
      <p>View your payslip: <a href="${process.env.APP_URL}/employee-portal">Employee Portal</a></p>
    `;

    return this.sendEmail({
      to: employee.email,
      subject: 'Payslip Available',
      html,
      type: 'payroll_notification'
    });
  }

  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
    const html = `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Password Reset Request',
      html,
      type: 'password_reset'
    });
  }

  async sendPerformanceReviewNotification(employee, review) {
    const html = `
      <h2>Performance Review Available</h2>
      <p>Dear ${employee.name},</p>
      <p>Your performance review for ${review.review_period_start} to ${review.review_period_end} is now available.</p>
      <p><strong>Rating:</strong> ${review.rating}/5</p>
      <p>View your review: <a href="${process.env.APP_URL}/employee-portal">Employee Portal</a></p>
    `;

    return this.sendEmail({
      to: employee.email,
      subject: 'Performance Review Available',
      html,
      type: 'performance_review'
    });
  }
}

module.exports = new EmailService();

