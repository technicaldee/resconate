const axios = require('axios');

class WhatsAppService {
    constructor() {
        this.apiUrl = process.env.WHATSAPP_API_URL || 'https://api.whatsapp-mock.resconate.com';
        this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
        this.isMock = !process.env.WHATSAPP_ACCESS_TOKEN;
    }

    /**
     * Send a template message to a user.
     * @param {string} to Phone number in international format (e.g. 2348000000000)
     * @param {string} templateName Template name (e.g. 'onboarding_welcome')
     * @param {Array} parameters Optional parameters for the template
     */
    async sendTemplateMessage(to, templateName, parameters = []) {
        if (this.isMock) {
            console.log(`[WhatsAppService MOCK] Sending template '${templateName}' to ${to} with params:`, parameters);
            return { success: true, message_id: `mock_${Date.now()}` };
        }

        try {
            const response = await axios.post(`${this.apiUrl}/messages`, {
                messaging_product: 'whatsapp',
                to,
                type: 'template',
                template: {
                    name: templateName,
                    language: { code: 'en_US' },
                    components: [
                        {
                            type: 'body',
                            parameters: parameters.map(p => ({ type: 'text', text: p }))
                        }
                    ]
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            return { success: true, data: response.data };
        } catch (error) {
            console.error('WhatsApp Error:', error.response ? error.response.data : error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Onboarding welcome trigger
     */
    async sendWelcome(business) {
        return this.sendTemplateMessage(
            business.owner_phone,
            'hr_lite_welcome',
            [business.business_name, 'Cloaka Cloud Wallet']
        );
    }

    /**
     * Send staff handbook ready notification
     */
    async sendHandbookReady(business) {
        return this.sendTemplateMessage(
            business.owner_phone,
            'hr_lite_handbook_ready',
            [business.business_name]
        );
    }

    /**
     * Send payment rule trigger alert
     */
    async sendPaymentTriggerAlert(business, ruleName, recipientName) {
        return this.sendTemplateMessage(
            business.owner_phone,
            'hr_lite_payment_alert',
            [ruleName, recipientName]
        );
    }
}

module.exports = new WhatsAppService();
