/**
 * Subscription Management Service
 * Handles auto-renewal, payment reminders, and subscription lifecycle
 */

const { pool } = require('./database');
const paymentGatewayService = require('./paymentGateway');
const emailService = require('./emailService');
const pdfGenerator = require('./pdfGenerator');

class SubscriptionManager {
  /**
   * Process subscription auto-renewal
   */
  async processAutoRenewal() {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Find subscriptions due for renewal today
      const result = await pool.query(
        `SELECT s.*, pt.email as customer_email, pt.company_name
         FROM subscriptions s
         LEFT JOIN payment_transactions pt ON s.id = pt.subscription_id
         WHERE s.next_billing_date = $1 
           AND s.auto_renewal = TRUE 
           AND s.status = 'active'`,
        [today]
      );

      const renewals = result.rows;
      const results = [];

      for (const subscription of renewals) {
        try {
          // Generate invoice
          const invoice = await this.createInvoice(subscription);
          
          // Process payment
          const paymentResult = await paymentGatewayService.processPayment({
            email: subscription.customer_email || 'customer@example.com',
            amount: subscription.amount,
            reference: `RENEW_${subscription.id}_${Date.now()}`,
            metadata: {
              subscriptionId: subscription.id,
              invoiceId: invoice.id
            }
          });

          if (paymentResult.success) {
            // Update subscription
            const nextBillingDate = this.calculateNextBillingDate(
              subscription.billing_cycle,
              new Date(subscription.next_billing_date)
            );

            await pool.query(
              `UPDATE subscriptions 
               SET next_billing_date = $1, updated_at = CURRENT_TIMESTAMP
               WHERE id = $2`,
              [nextBillingDate, subscription.id]
            );

            // Update invoice
            await pool.query(
              `UPDATE invoices 
               SET status = 'paid', paid_date = CURRENT_TIMESTAMP, payment_reference = $1
               WHERE id = $2`,
              [paymentResult.reference, invoice.id]
            );

            // Generate receipt
            await this.generateReceipt(invoice.id);

            results.push({ subscriptionId: subscription.id, status: 'success' });
          } else {
            // Payment failed - send notification
            await this.handlePaymentFailure(subscription, invoice);
            results.push({ subscriptionId: subscription.id, status: 'failed', error: paymentResult.error });
          }
        } catch (error) {
          console.error(`Error renewing subscription ${subscription.id}:`, error);
          results.push({ subscriptionId: subscription.id, status: 'error', error: error.message });
        }
      }

      return { success: true, results };
    } catch (error) {
      console.error('Auto-renewal processing error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send payment reminders
   */
  async sendPaymentReminders() {
    try {
      const today = new Date();
      const reminderDays = [7, 3, 1];

      for (const daysBefore of reminderDays) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + daysBefore);
        const targetDateStr = targetDate.toISOString().split('T')[0];

        // Find invoices due on target date that haven't been reminded
        const result = await pool.query(
          `SELECT i.*, s.company_name, s.customer_email
           FROM invoices i
           JOIN subscriptions s ON i.subscription_id = s.id
           WHERE i.due_date = $1 
             AND i.status = 'pending'
             AND NOT EXISTS (
               SELECT 1 FROM payment_reminders pr 
               WHERE pr.invoice_id = i.id AND pr.reminder_type = $2
             )`,
          [targetDateStr, `reminder_${daysBefore}d`]
        );

        for (const invoice of result.rows) {
          await this.sendReminderEmail(invoice, daysBefore);
          
          // Record reminder
          await pool.query(
            `INSERT INTO payment_reminders (subscription_id, invoice_id, reminder_type, days_before_due, status)
             VALUES ($1, $2, $3, $4, 'sent')
             ON CONFLICT DO NOTHING`,
            [invoice.subscription_id, invoice.id, `reminder_${daysBefore}d`, daysBefore]
          );
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Payment reminder error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create invoice for subscription
   */
  async createInvoice(subscription) {
    const invoiceNumber = `INV-${Date.now()}-${subscription.id}`;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); // 7 days to pay

    const result = await pool.query(
      `INSERT INTO invoices (subscription_id, invoice_number, amount, due_date, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING *`,
      [subscription.id, invoiceNumber, subscription.amount, dueDate.toISOString().split('T')[0]]
    );

    // Generate PDF invoice
    const pdfUrl = await this.generateInvoicePDF(result.rows[0]);
    if (pdfUrl) {
      await pool.query(
        `UPDATE invoices SET pdf_url = $1 WHERE id = $2`,
        [pdfUrl, result.rows[0].id]
      );
    }

    return { ...result.rows[0], pdf_url: pdfUrl };
  }

  /**
   * Generate invoice PDF
   */
  async generateInvoicePDF(invoice) {
    try {
      const subscription = await pool.query(
        'SELECT * FROM subscriptions WHERE id = $1',
        [invoice.subscription_id]
      );
      
      const subscriptionData = subscription.rows[0] || {};
      const pdfUrl = await pdfGenerator.generateInvoice(invoice, subscriptionData);
      return pdfUrl;
    } catch (error) {
      console.error('Invoice PDF generation error:', error);
      return `/invoices/${invoice.invoice_number}.pdf`;
    }
  }

  /**
   * Generate receipt PDF
   */
  async generateReceipt(invoiceId) {
    try {
      const invoiceResult = await pool.query('SELECT * FROM invoices WHERE id = $1', [invoiceId]);
      if (invoiceResult.rows.length === 0) return null;

      const invoice = invoiceResult.rows[0];
      const subscription = await pool.query(
        'SELECT * FROM subscriptions WHERE id = $1',
        [invoice.subscription_id]
      );
      
      const subscriptionData = subscription.rows[0] || {};
      const paymentResult = await pool.query(
        'SELECT * FROM payment_transactions WHERE reference = $1',
        [invoice.payment_reference]
      );
      const paymentData = paymentResult.rows[0] || {};

      const receiptUrl = await pdfGenerator.generateReceipt(invoice, subscriptionData, paymentData);
      
      await pool.query(
        `UPDATE invoices SET receipt_pdf_url = $1 WHERE id = $2`,
        [receiptUrl, invoiceId]
      );

      return receiptUrl;
    } catch (error) {
      console.error('Receipt generation error:', error);
      return `/receipts/${invoiceId}.pdf`;
    }
  }

  /**
   * Send reminder email
   */
  async sendReminderEmail(invoice, daysBefore) {
    const subject = `Payment Reminder: Invoice ${invoice.invoice_number} due in ${daysBefore} day(s)`;
    const message = `
      Dear Customer,
      
      This is a reminder that your invoice ${invoice.invoice_number} for ₦${invoice.amount.toLocaleString()} is due in ${daysBefore} day(s).
      
      Due Date: ${invoice.due_date}
      
      Please ensure payment is made to avoid service interruption.
      
      Thank you,
      Resconate Team
    `;

    await emailService.sendEmail({
      to: invoice.customer_email,
      subject,
      text: message,
      html: `<p>${message.replace(/\n/g, '<br>')}</p>`
    });
  }

  /**
   * Handle payment failure
   */
  async handlePaymentFailure(subscription, invoice) {
    // Send failure notification
    await emailService.sendEmail({
      to: subscription.customer_email,
      subject: 'Payment Failed - Subscription Renewal',
      text: `Your subscription renewal payment failed. Please update your payment method.`
    });

    // Update subscription status after grace period
    // This could be handled by a separate cron job
  }

  /**
   * Calculate next billing date
   */
  calculateNextBillingDate(billingCycle, currentDate) {
    const nextDate = new Date(currentDate);
    
    if (billingCycle === 'monthly') {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else if (billingCycle === 'yearly') {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    } else if (billingCycle === 'quarterly') {
      nextDate.setMonth(nextDate.getMonth() + 3);
    }

    return nextDate.toISOString().split('T')[0];
  }

  /**
   * Get upcoming payment reminders
   */
  async getUpcomingReminders(subscriptionId) {
    const result = await pool.query(
      `SELECT i.*, pr.reminder_type, pr.days_before_due, pr.status as reminder_status
       FROM invoices i
       LEFT JOIN payment_reminders pr ON i.id = pr.invoice_id
       WHERE i.subscription_id = $1 AND i.status = 'pending'
       ORDER BY i.due_date ASC`,
      [subscriptionId]
    );

    return result.rows;
  }
}

module.exports = new SubscriptionManager();

