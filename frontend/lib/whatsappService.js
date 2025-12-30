/**
 * WhatsApp Notification Service
 * Sends notifications via WhatsApp for payslips, leave approvals, etc.
 */

class WhatsAppService {
  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL || 'https://api.whatsapp.com/send';
    this.businessPhone = process.env.WHATSAPP_BUSINESS_PHONE || '234XXXXXXXXXX';
  }

  /**
   * Send payslip notification via WhatsApp
   */
  async sendPayslipNotification(employeePhone, employeeName, payslipUrl) {
    try {
      const message = `Hello ${employeeName},\n\nYour payslip for this month is ready!\n\nView it here: ${payslipUrl}\n\nThank you,\nResconate HR Team`;

      const whatsappUrl = this.buildWhatsAppUrl(employeePhone, message);
      
      // In production, you would use WhatsApp Business API
      // For now, return the URL that can be opened
      return {
        success: true,
        url: whatsappUrl,
        message: 'WhatsApp notification ready to send'
      };
    } catch (error) {
      console.error('WhatsApp payslip notification error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send leave approval notification
   */
  async sendLeaveApprovalNotification(employeePhone, employeeName, leaveDetails) {
    try {
      const message = `Hello ${employeeName},\n\nYour leave request has been ${leaveDetails.status}!\n\nDetails:\n- Type: ${leaveDetails.type}\n- Start: ${leaveDetails.startDate}\n- End: ${leaveDetails.endDate}\n- Days: ${leaveDetails.days}\n\nThank you,\nResconate HR Team`;

      const whatsappUrl = this.buildWhatsAppUrl(employeePhone, message);
      
      return {
        success: true,
        url: whatsappUrl,
        message: 'WhatsApp notification ready to send'
      };
    } catch (error) {
      console.error('WhatsApp leave approval notification error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send critical notification
   */
  async sendCriticalNotification(phone, message) {
    try {
      const whatsappUrl = this.buildWhatsAppUrl(phone, message);
      
      return {
        success: true,
        url: whatsappUrl,
        message: 'WhatsApp notification ready to send'
      };
    } catch (error) {
      console.error('WhatsApp critical notification error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Build WhatsApp URL
   */
  buildWhatsAppUrl(phone, message) {
    // Remove any non-digit characters from phone
    const cleanPhone = phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }

  /**
   * Send bulk notification (for multiple employees)
   */
  async sendBulkNotification(phoneNumbers, message) {
    const results = [];
    
    for (const phone of phoneNumbers) {
      const result = await this.sendCriticalNotification(phone, message);
      results.push({ phone, ...result });
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return {
      success: true,
      results,
      totalSent: results.filter(r => r.success).length,
      totalFailed: results.filter(r => !r.success).length
    };
  }
}

module.exports = new WhatsAppService();

