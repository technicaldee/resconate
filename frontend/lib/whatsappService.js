/**
 * WhatsApp Notification Service
 * Sends notifications via WhatsApp using Twilio or similar service
 */

class WhatsAppService {
  constructor() {
    this.twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    this.twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    this.twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;
    this.whatsappBusinessApiKey = process.env.WHATSAPP_BUSINESS_API_KEY;
    this.whatsappBusinessPhoneId = process.env.WHATSAPP_BUSINESS_PHONE_ID;
    this.provider = process.env.WHATSAPP_PROVIDER || 'twilio';
  }

  /**
   * Send WhatsApp message using Twilio
   */
  async sendViaTwilio(to, message) {
    try {
      if (!this.twilioAccountSid || !this.twilioAuthToken || !this.twilioWhatsAppNumber) {
        throw new Error('Twilio credentials not configured');
      }

      const https = require('https');
      const querystring = require('querystring');

      const postData = querystring.stringify({
        From: `whatsapp:${this.twilioWhatsAppNumber}`,
        To: `whatsapp:${to}`,
        Body: message
      });

      const auth = Buffer.from(`${this.twilioAccountSid}:${this.twilioAuthToken}`).toString('base64');

      const options = {
        hostname: 'api.twilio.com',
        path: `/2010-04-01/Accounts/${this.twilioAccountSid}/Messages.json`,
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            try {
              const result = JSON.parse(data);
              if (result.sid) {
                resolve({ success: true, messageId: result.sid });
              } else {
                resolve({ success: false, error: result.message || 'Failed to send message' });
              }
            } catch (e) {
              reject(e);
            }
          });
        });

        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
      });
    } catch (error) {
      console.error('Twilio WhatsApp error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send WhatsApp message using WhatsApp Business API
   */
  async sendViaWhatsAppBusiness(to, message) {
    try {
      if (!this.whatsappBusinessApiKey || !this.whatsappBusinessPhoneId) {
        throw new Error('WhatsApp Business API credentials not configured');
      }

      const https = require('https');

      const postData = JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: message }
      });

      const options = {
        hostname: 'graph.facebook.com',
        path: `/v18.0/${this.whatsappBusinessPhoneId}/messages`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.whatsappBusinessApiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            try {
              const result = JSON.parse(data);
              if (result.messages && result.messages[0]) {
                resolve({ success: true, messageId: result.messages[0].id });
              } else {
                resolve({ success: false, error: result.error?.message || 'Failed to send message' });
              }
            } catch (e) {
              reject(e);
            }
          });
        });

        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
      });
    } catch (error) {
      console.error('WhatsApp Business API error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send WhatsApp message (uses configured provider)
   */
  async sendMessage(to, message) {
    // Format phone number (ensure it starts with country code)
    let formattedTo = to.replace(/\D/g, ''); // Remove non-digits
    if (!formattedTo.startsWith('234') && formattedTo.startsWith('0')) {
      formattedTo = '234' + formattedTo.substring(1);
    } else if (!formattedTo.startsWith('234')) {
      formattedTo = '234' + formattedTo;
    }

    if (this.provider === 'twilio') {
      return this.sendViaTwilio(formattedTo, message);
    } else if (this.provider === 'whatsapp_business') {
      return this.sendViaWhatsAppBusiness(formattedTo, message);
    } else {
      return { success: false, error: 'No WhatsApp provider configured' };
    }
  }

  /**
   * Send leave approval notification
   */
  async sendLeaveApprovalNotification(employeePhone, employeeName, leaveDetails) {
    const message = `Hello ${employeeName},\n\nYour leave request has been ${leaveDetails.status}.\n\nDetails:\n- Type: ${leaveDetails.leave_type}\n- Start: ${leaveDetails.start_date}\n- End: ${leaveDetails.end_date}\n- Days: ${leaveDetails.days_requested}\n\nThank you,\nResconate HR Team`;
    return this.sendMessage(employeePhone, message);
  }

  /**
   * Send payroll notification
   */
  async sendPayrollNotification(employeePhone, employeeName, payrollDetails) {
    const message = `Hello ${employeeName},\n\nYour payslip for ${payrollDetails.pay_period} is ready.\n\nNet Salary: ₦${parseFloat(payrollDetails.net_salary).toLocaleString()}\n\nView your payslip in the employee portal.\n\nThank you,\nResconate HR Team`;
    return this.sendMessage(employeePhone, message);
  }
}

module.exports = new WhatsAppService();
