/**
 * Backend WhatsApp Service
 * Supports sending text messages via Twilio or WhatsApp Business API.
 */
const https = require('https');
const querystring = require('querystring');

class WhatsAppService {
  constructor() {
    this.twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    this.twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    this.twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;
    this.whatsappBusinessApiKey = process.env.WHATSAPP_BUSINESS_API_KEY;
    this.whatsappBusinessPhoneId = process.env.WHATSAPP_BUSINESS_PHONE_ID;
    this.provider = process.env.WHATSAPP_PROVIDER || 'twilio';
  }

  async sendViaTwilio(to, message, mediaUrl) {
    try {
      if (!this.twilioAccountSid || !this.twilioAuthToken || !this.twilioWhatsAppNumber) {
        throw new Error('Twilio credentials not configured');
      }

      const postDataObj = {
        From: `whatsapp:${this.twilioWhatsAppNumber}`,
        To: `whatsapp:${to}`,
        Body: message
      };
      if (mediaUrl) postDataObj.MediaUrl = mediaUrl;

      const postData = querystring.stringify(postDataObj);
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
              if (result.sid) resolve({ success: true, messageId: result.sid });
              else resolve({ success: false, error: result.message || 'Failed to send' });
            } catch (e) { reject(e); }
          });
        });
        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
      });
    } catch (err) {
      console.error('Twilio send error:', err);
      return { success: false, error: err.message };
    }
  }

  async sendViaWhatsAppBusiness(to, message, mediaUrl) {
    try {
      if (!this.whatsappBusinessApiKey || !this.whatsappBusinessPhoneId) throw new Error('WhatsApp Business API credentials not configured');
      // For simplicity, send as text + media url in the text body if mediaUrl provided.
      const fullMessage = mediaUrl ? `${message}\n\nReceipt: ${mediaUrl}` : message;

      const postData = JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body: fullMessage } });
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
            try { const result = JSON.parse(data); resolve({ success: true, data: result }); } catch (e) { reject(e); }
          });
        });
        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
      });
    } catch (err) {
      console.error('WhatsApp Business send error:', err);
      return { success: false, error: err.message };
    }
  }

  async sendMessage(to, message, mediaUrl) {
    let formattedTo = String(to).replace(/\D/g, '');
    if (formattedTo.startsWith('0')) formattedTo = '234' + formattedTo.substring(1);
    if (!formattedTo.startsWith('234')) formattedTo = '234' + formattedTo;

    if (this.provider === 'twilio') return this.sendViaTwilio(formattedTo, message, mediaUrl);
    if (this.provider === 'whatsapp_business') return this.sendViaWhatsAppBusiness(formattedTo, message, mediaUrl);
    return { success: false, error: 'No WhatsApp provider configured' };
  }
}

module.exports = new WhatsAppService();
