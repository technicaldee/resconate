/**
 * SMS Notification Service
 * Sends SMS alerts for critical notifications
 * Supports multiple SMS providers (Twilio, Termii, etc.)
 */

class SMSService {
  constructor() {
    this.provider = process.env.SMS_PROVIDER || 'termii';
    this.apiKey = process.env.SMS_API_KEY;
    this.senderId = process.env.SMS_SENDER_ID || 'RESCONATE';
  }

  /**
   * Send SMS via Termii
   */
  async sendViaTermii(phone, message) {
    try {
      if (!this.apiKey) {
        throw new Error('SMS API key not configured');
      }

      const response = await fetch('https://api.termii.com/api/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: phone,
          from: this.senderId,
          sms: message,
          type: 'plain',
          channel: 'generic',
          api_key: this.apiKey
        })
      });

      const data = await response.json();

      if (data.code === 'ok') {
        return { success: true, messageId: data.messageId };
      } else {
        throw new Error(data.message || 'SMS sending failed');
      }
    } catch (error) {
      console.error('Termii SMS error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send SMS via Twilio
   */
  async sendViaTwilio(phone, message) {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const fromNumber = process.env.TWILIO_PHONE_NUMBER;

      if (!accountSid || !authToken || !fromNumber) {
        throw new Error('Twilio credentials not configured');
      }

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`
          },
          body: new URLSearchParams({
            To: phone,
            From: fromNumber,
            Body: message
          })
        }
      );

      const data = await response.json();

      if (data.sid) {
        return { success: true, messageId: data.sid };
      } else {
        throw new Error(data.message || 'SMS sending failed');
      }
    } catch (error) {
      console.error('Twilio SMS error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send SMS (uses configured provider)
   */
  async sendSMS(phone, message) {
    // Clean phone number (remove non-digits, ensure country code)
    const cleanPhone = this.cleanPhoneNumber(phone);

    if (this.provider === 'termii') {
      return this.sendViaTermii(cleanPhone, message);
    } else if (this.provider === 'twilio') {
      return this.sendViaTwilio(cleanPhone, message);
    } else {
      return { success: false, error: 'SMS provider not configured' };
    }
  }

  /**
   * Send payment reminder SMS
   */
  async sendPaymentReminder(phone, customerName, amount, dueDate) {
    const message = `Hello ${customerName}, this is a reminder that your Resconate subscription payment of ₦${amount.toLocaleString()} is due on ${dueDate}. Please ensure payment to avoid service interruption. Thank you!`;
    return this.sendSMS(phone, message);
  }

  /**
   * Send critical alert SMS
   */
  async sendCriticalAlert(phone, alertMessage) {
    const message = `🚨 RESCONATE ALERT: ${alertMessage}`;
    return this.sendSMS(phone, message);
  }

  /**
   * Send payslip notification SMS
   */
  async sendPayslipNotification(phone, employeeName, payslipUrl) {
    const message = `Hello ${employeeName}, your payslip is ready! View it here: ${payslipUrl}`;
    return this.sendSMS(phone, message);
  }

  /**
   * Clean phone number
   */
  cleanPhoneNumber(phone) {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');

    // Add country code if missing (assume Nigeria +234)
    if (!cleaned.startsWith('234') && cleaned.length === 10) {
      cleaned = '234' + cleaned;
    }

    return cleaned;
  }

  /**
   * Send bulk SMS
   */
  async sendBulkSMS(phoneNumbers, message) {
    const results = [];

    for (const phone of phoneNumbers) {
      const result = await this.sendSMS(phone, message);
      results.push({ phone, ...result });

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return {
      success: true,
      results,
      totalSent: results.filter(r => r.success).length,
      totalFailed: results.filter(r => !r.success).length
    };
  }
}

module.exports = new SMSService();

