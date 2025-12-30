/**
 * PDF Generation Service
 * Generates invoices, receipts, and reports as PDFs
 */

const fs = require('fs').promises;
const path = require('path');

class PDFGenerator {
  constructor() {
    this.outputDir = process.env.PDF_OUTPUT_DIR || './public/pdfs';
  }

  /**
   * Generate invoice PDF
   */
  async generateInvoice(invoiceData, subscriptionData) {
    try {
      // Ensure output directory exists
      await fs.mkdir(this.outputDir, { recursive: true });

      // For now, generate HTML that can be converted to PDF
      // In production, use pdfkit, puppeteer, or similar
      const html = this.generateInvoiceHTML(invoiceData, subscriptionData);
      
      const filename = `invoice_${invoiceData.invoice_number}.html`;
      const filepath = path.join(this.outputDir, filename);
      
      await fs.writeFile(filepath, html);

      // TODO: Convert HTML to PDF using puppeteer or similar
      // For now, return HTML file path
      return `/pdfs/${filename}`;
    } catch (error) {
      console.error('Invoice generation error:', error);
      throw error;
    }
  }

  /**
   * Generate receipt PDF
   */
  async generateReceipt(invoiceData, subscriptionData, paymentData) {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });

      const html = this.generateReceiptHTML(invoiceData, subscriptionData, paymentData);
      const filename = `receipt_${invoiceData.invoice_number}.html`;
      const filepath = path.join(this.outputDir, filename);
      
      await fs.writeFile(filepath, html);
      return `/pdfs/${filename}`;
    } catch (error) {
      console.error('Receipt generation error:', error);
      throw error;
    }
  }

  /**
   * Generate invoice HTML
   */
  generateInvoiceHTML(invoice, subscription) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoice.invoice_number}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    .header { border-bottom: 2px solid #6366F1; padding-bottom: 20px; margin-bottom: 30px; }
    .company-info { text-align: right; }
    .invoice-details { margin: 30px 0; }
    .invoice-details table { width: 100%; border-collapse: collapse; }
    .invoice-details td { padding: 10px; border-bottom: 1px solid #eee; }
    .invoice-details td:first-child { font-weight: bold; width: 30%; }
    .items-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
    .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    .items-table th { background-color: #6366F1; color: white; }
    .total { text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>INVOICE</h1>
    <div class="company-info">
      <h2>Resconate</h2>
      <p>HR Platform for Nigerian Businesses</p>
    </div>
  </div>

  <div class="invoice-details">
    <table>
      <tr>
        <td>Invoice Number:</td>
        <td>${invoice.invoice_number}</td>
      </tr>
      <tr>
        <td>Date:</td>
        <td>${new Date(invoice.created_at).toLocaleDateString()}</td>
      </tr>
      <tr>
        <td>Due Date:</td>
        <td>${new Date(invoice.due_date).toLocaleDateString()}</td>
      </tr>
      <tr>
        <td>Company:</td>
        <td>${subscription?.company_name || 'N/A'}</td>
      </tr>
    </table>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th>Description</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Subscription - ${subscription?.plan_type || 'Premium'} Plan</td>
        <td>₦${parseFloat(invoice.amount).toLocaleString()}</td>
      </tr>
    </tbody>
  </table>

  <div class="total">
    <p>Total: ₦${parseFloat(invoice.amount).toLocaleString()}</p>
  </div>

  <div class="footer">
    <p>Thank you for your business!</p>
    <p>For questions about this invoice, please contact support@resconate.com</p>
  </div>
</body>
</html>
    `;
  }

  /**
   * Generate receipt HTML
   */
  generateReceiptHTML(invoice, subscription, payment) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Receipt ${invoice.invoice_number}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    .header { border-bottom: 2px solid #16a34a; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #16a34a; }
    .status { background-color: #16a34a; color: white; padding: 5px 15px; border-radius: 5px; display: inline-block; }
    .company-info { text-align: right; }
    .receipt-details { margin: 30px 0; }
    .receipt-details table { width: 100%; border-collapse: collapse; }
    .receipt-details td { padding: 10px; border-bottom: 1px solid #eee; }
    .receipt-details td:first-child { font-weight: bold; width: 30%; }
    .total { text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold; color: #16a34a; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>RECEIPT</h1>
    <div class="company-info">
      <h2>Resconate</h2>
      <p>HR Platform for Nigerian Businesses</p>
    </div>
  </div>

  <div style="margin-bottom: 20px;">
    <span class="status">PAID</span>
  </div>

  <div class="receipt-details">
    <table>
      <tr>
        <td>Receipt Number:</td>
        <td>${invoice.invoice_number}</td>
      </tr>
      <tr>
        <td>Date Paid:</td>
        <td>${invoice.paid_date ? new Date(invoice.paid_date).toLocaleDateString() : new Date().toLocaleDateString()}</td>
      </tr>
      <tr>
        <td>Payment Reference:</td>
        <td>${invoice.payment_reference || payment?.reference || 'N/A'}</td>
      </tr>
      <tr>
        <td>Company:</td>
        <td>${subscription?.company_name || 'N/A'}</td>
      </tr>
    </table>
  </div>

  <div class="total">
    <p>Amount Paid: ₦${parseFloat(invoice.amount).toLocaleString()}</p>
  </div>

  <div class="footer">
    <p>Thank you for your payment!</p>
    <p>This is your official receipt for tax purposes.</p>
  </div>
</body>
</html>
    `;
  }

  /**
   * Generate compliance report PDF
   */
  async generateComplianceReport(reportData) {
    // TODO: Implement compliance report generation
    return '/pdfs/compliance_report.pdf';
  }

  /**
   * Generate reconciliation report PDF
   */
  async generateReconciliationReport(reportData) {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });

      const html = this.generateReconciliationHTML(reportData);
      const filename = `reconciliation_${reportData.period.startDate}_${reportData.period.endDate}.html`;
      const filepath = path.join(this.outputDir, filename);
      
      await fs.writeFile(filepath, html);
      return `/pdfs/${filename}`;
    } catch (error) {
      console.error('Reconciliation report generation error:', error);
      throw error;
    }
  }

  /**
   * Generate reconciliation report HTML
   */
  generateReconciliationHTML(reportData) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Payment Reconciliation Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    .header { border-bottom: 2px solid #6366F1; padding-bottom: 20px; margin-bottom: 30px; }
    .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 30px 0; }
    .summary-card { padding: 20px; background-color: #f5f5f5; border-radius: 8px; text-align: center; }
    .summary-value { font-size: 24px; font-weight: bold; color: #6366F1; }
    .summary-label { color: #666; margin-top: 5px; }
    table { width: 100%; border-collapse: collapse; margin: 30px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #6366F1; color: white; }
    .status-completed { color: #16a34a; font-weight: bold; }
    .status-pending { color: #f59e0b; font-weight: bold; }
    .status-failed { color: #ef4444; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Payment Reconciliation Report</h1>
    <p>Period: ${reportData.period.startDate} to ${reportData.period.endDate}</p>
    <p>Generated: ${new Date().toLocaleString()}</p>
  </div>

  <div class="summary">
    <div class="summary-card">
      <div class="summary-value">₦${parseFloat(reportData.summary.totalAmount).toLocaleString()}</div>
      <div class="summary-label">Total Amount</div>
    </div>
    <div class="summary-card">
      <div class="summary-value">${reportData.summary.totalCount}</div>
      <div class="summary-label">Total Transactions</div>
    </div>
    <div class="summary-card">
      <div class="summary-value">${reportData.summary.completed}</div>
      <div class="summary-label">Completed</div>
    </div>
    <div class="summary-card">
      <div class="summary-value">${reportData.summary.pending}</div>
      <div class="summary-label">Pending</div>
    </div>
  </div>

  <h2>Transactions</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Employee</th>
        <th>Account Number</th>
        <th>Bank</th>
        <th>Amount</th>
        <th>Status</th>
        <th>Reference</th>
      </tr>
    </thead>
    <tbody>
      ${reportData.transactions.map(t => `
        <tr>
          <td>${new Date(t.created_at).toLocaleDateString()}</td>
          <td>${t.employee_name || 'N/A'}</td>
          <td>${t.account_number || 'N/A'}</td>
          <td>${t.bank_name || 'N/A'}</td>
          <td>₦${parseFloat(t.amount).toLocaleString()}</td>
          <td class="status-${t.status}">${t.status.toUpperCase()}</td>
          <td>${t.reference || 'N/A'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>Summary by Bank</h2>
  <table>
    <thead>
      <tr>
        <th>Bank</th>
        <th>Count</th>
        <th>Total Amount</th>
      </tr>
    </thead>
    <tbody>
      ${Object.entries(reportData.byBank).map(([bank, data]) => `
        <tr>
          <td>${bank}</td>
          <td>${data.count}</td>
          <td>₦${parseFloat(data.amount).toLocaleString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>
    `;
  }
}

module.exports = new PDFGenerator();

