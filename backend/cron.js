/**
 * Cron Jobs / Scheduled Tasks
 * Run this file using node-cron or similar scheduler
 * 
 * To run: node backend/cron.js
 * Or use: npm install -g node-cron && node-cron backend/cron.js
 * Or use PM2: pm2 start backend/cron.js --name resconate-cron
 */

const cron = require('node-cron');
const subscriptionManager = require('../frontend/lib/subscriptionManager');
const emailService = require('../frontend/lib/emailService');
const { pool } = require('../frontend/lib/database');

// Run every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  console.log('Running daily cron jobs...');
  
  try {
    // Process subscription auto-renewals
    await subscriptionManager.processAutoRenewal();
    
    // Send payment reminders
    await subscriptionManager.sendPaymentReminders();
    
    // Check and send compliance deadline reminders
    await checkComplianceDeadlines();
    
    console.log('Daily cron jobs completed');
  } catch (error) {
    console.error('Cron job error:', error);
  }
});

// Run every hour
cron.schedule('0 * * * *', async () => {
  console.log('Running hourly cron jobs...');
  
  try {
    // Check trial expirations
    await checkTrialExpirations();
    
    // Process email queue
    await processEmailQueue();
    
    console.log('Hourly cron jobs completed');
  } catch (error) {
    console.error('Cron job error:', error);
  }
});

/**
 * Check compliance deadlines and send reminders
 */
async function checkComplianceDeadlines() {
  try {
    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    const result = await pool.query(
      `SELECT * FROM compliance_calendar_events 
       WHERE deadline_date >= $1 
       AND deadline_date <= $2 
       AND is_completed = FALSE 
       AND reminder_sent = FALSE`,
      [today.toISOString().split('T')[0], sevenDaysFromNow.toISOString().split('T')[0]]
    );

    for (const event of result.rows) {
      const daysUntil = Math.ceil((new Date(event.deadline_date) - today) / (1000 * 60 * 60 * 24));
      
      // Send reminder to admin
      await emailService.sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@resconate.com',
        subject: `Compliance Deadline Reminder: ${event.title}`,
        html: `
          <h2>Compliance Deadline Reminder</h2>
          <p><strong>${event.title}</strong></p>
          <p>${event.description || ''}</p>
          <p><strong>Deadline:</strong> ${new Date(event.deadline_date).toLocaleDateString()}</p>
          <p><strong>Days Remaining:</strong> ${daysUntil}</p>
          <p><strong>Priority:</strong> ${event.priority}</p>
        `
      });

      // Mark reminder as sent
      await pool.query(
        'UPDATE compliance_calendar_events SET reminder_sent = TRUE WHERE id = $1',
        [event.id]
      );
    }
  } catch (error) {
    console.error('Compliance deadline check error:', error);
  }
}

/**
 * Check trial expirations
 */
async function checkTrialExpirations() {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Find trials expiring today
    const expiringTrials = await pool.query(
      `SELECT * FROM trial_subscriptions 
       WHERE trial_end_date = $1 
       AND is_active = TRUE 
       AND converted_to_paid = FALSE`,
      [today]
    );

    for (const trial of expiringTrials.rows) {
      // Send expiration email
      await emailService.sendEmail({
        to: trial.email,
        subject: 'Your Resconate Trial is Ending Today',
        html: `
          <h2>Your Trial is Ending Today</h2>
          <p>Hi there,</p>
          <p>Your 14-day free trial ends today. To continue using Resconate, please upgrade to a paid plan.</p>
          <p><a href="${process.env.APP_URL}/payment">Upgrade Now</a></p>
          <p>If you have any questions, contact us at support@resconate.com</p>
        `
      });

      // Deactivate trial
      await pool.query(
        'UPDATE trial_subscriptions SET is_active = FALSE WHERE id = $1',
        [trial.id]
      );
    }

    // Find trials expiring in 3 days
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    const threeDaysFromNowStr = threeDaysFromNow.toISOString().split('T')[0];

    const expiringSoonTrials = await pool.query(
      `SELECT * FROM trial_subscriptions 
       WHERE trial_end_date = $1 
       AND is_active = TRUE 
       AND converted_to_paid = FALSE`,
      [threeDaysFromNowStr]
    );

    for (const trial of expiringSoonTrials.rows) {
      await emailService.sendEmail({
        to: trial.email,
        subject: 'Your Resconate Trial Expires in 3 Days',
        html: `
          <h2>Trial Expiring Soon</h2>
          <p>Hi there,</p>
          <p>Your free trial expires in 3 days. Upgrade now to continue using Resconate without interruption.</p>
          <p><a href="${process.env.APP_URL}/payment">Upgrade Now</a></p>
        `
      });
    }
  } catch (error) {
    console.error('Trial expiration check error:', error);
  }
}

/**
 * Process email queue
 */
async function processEmailQueue() {
  try {
    const pendingEmails = await pool.query(
      `SELECT * FROM email_logs 
       WHERE status = 'pending' 
       ORDER BY created_at ASC 
       LIMIT 50`
    );

    for (const emailLog of pendingEmails.rows) {
      try {
        await emailService.sendEmail({
          to: emailLog.recipient_email,
          subject: emailLog.subject,
          text: emailLog.body || '',
          html: emailLog.html_body || emailLog.body || ''
        });

        await pool.query(
          `UPDATE email_logs 
           SET status = 'sent', sent_at = CURRENT_TIMESTAMP 
           WHERE id = $1`,
          [emailLog.id]
        );
      } catch (error) {
        await pool.query(
          `UPDATE email_logs 
           SET status = 'failed', error_message = $1 
           WHERE id = $2`,
          [error.message, emailLog.id]
        );
      }
    }
  } catch (error) {
    console.error('Email queue processing error:', error);
  }
}

// Keep the process running
console.log('Cron jobs started. Press Ctrl+C to stop.');
process.on('SIGINT', () => {
  console.log('Stopping cron jobs...');
  process.exit(0);
});

