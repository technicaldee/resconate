/**
 * SMS Notification Service
 * Sends SMS notifications using Twilio or similar service
 */

class SMSService {
  constructor() {
    this.twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    this.twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    this.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    this.provider = process.env.SMS_PROVIDER || 'twilio';
  }

  /**
   * Send SMS via Twilio
   */
  async sendViaTwilio(to, message) {
    try {
      if (!this.twilioAccountSid || !this.twilioAuthToken || !this.twilioPhoneNumber) {
        throw new Error('Twilio credentials not configured');
      }

      const https = require('https');
      const querystring = require('querystring');

      const postData = querystring.stringify({
        From: this.twilioPhoneNumber,
        To: to,
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
                resolve({ success: false, error: result.message || 'Failed to send SMS' });
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
      console.error('Twilio SMS error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send SMS (uses configured provider)
   */
  async sendSMS(to, message) {
    // Format phone number (ensure it starts with country code)
    let formattedTo = to.replace(/\D/g, ''); // Remove non-digits
    if (!formattedTo.startsWith('234') && formattedTo.startsWith('0')) {
      formattedTo = '234' + formattedTo.substring(1);
    } else if (!formattedTo.startsWith('234')) {
      formattedTo = '234' + formattedTo;
    }
    formattedTo = '+' + formattedTo;

    if (this.provider === 'twilio') {
      return this.sendViaTwilio(formattedTo, message);
    } else {
      return { success: false, error: 'No SMS provider configured' };
    }
  }

  /**
   * Send leave approval SMS
   */
  async sendLeaveApprovalSMS(employeePhone, employeeName, leaveDetails) {
    const message = `Hello ${employeeName}, Your leave request has been ${leaveDetails.status}. ${leaveDetails.leave_type} from ${leaveDetails.start_date} to ${leaveDetails.end_date}. - Resconate HR`;
    return this.sendSMS(employeePhone, message);
  }

  /**
   * Send payroll SMS
   */
  async sendPayrollSMS(employeePhone, employeeName, payrollDetails) {
    const message = `Hello ${employeeName}, Your payslip for ${payrollDetails.pay_period} is ready. Net Salary: ₦${parseFloat(payrollDetails.net_salary).toLocaleString()}. View in portal. - Resconate HR`;
    return this.sendSMS(employeePhone, message);
  }
}

module.exports = new SMSService();
