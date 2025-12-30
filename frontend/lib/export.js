/**
 * Export utilities for CSV and Excel generation
 */

class ExportService {
  /**
   * Convert array of objects to CSV string
   */
  toCSV(data, headers = null) {
    if (!data || data.length === 0) {
      return '';
    }

    // Use provided headers or extract from first object
    const csvHeaders = headers || Object.keys(data[0]);
    
    // Create header row
    const headerRow = csvHeaders.map(h => `"${h}"`).join(',');
    
    // Create data rows
    const dataRows = data.map(row => {
      return csvHeaders.map(header => {
        const value = row[header];
        // Handle null/undefined
        if (value === null || value === undefined) {
          return '""';
        }
        // Handle objects/arrays
        if (typeof value === 'object') {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        // Escape quotes and wrap in quotes
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',');
    });

    return [headerRow, ...dataRows].join('\n');
  }

  /**
   * Download CSV file
   */
  downloadCSV(data, filename, headers = null) {
    const csv = this.toCSV(data, headers);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Export employees to CSV
   */
  exportEmployees(employees) {
    const headers = ['Employee ID', 'Name', 'Email', 'Department', 'Position', 'Salary', 'Phone', 'Status', 'Start Date'];
    const data = employees.map(emp => ({
      'Employee ID': emp.employee_id,
      'Name': emp.name,
      'Email': emp.email,
      'Department': emp.department || '',
      'Position': emp.position || '',
      'Salary': emp.salary || '',
      'Phone': emp.phone || '',
      'Status': emp.status,
      'Start Date': emp.start_date || ''
    }));
    
    this.downloadCSV(data, `employees_${new Date().toISOString().split('T')[0]}.csv`, headers);
  }

  /**
   * Export payroll to CSV
   */
  exportPayroll(payrollData) {
    const headers = ['Employee ID', 'Employee Name', 'Pay Period Start', 'Pay Period End', 'Gross Salary', 'Deductions', 'Net Salary', 'Status'];
    const data = payrollData.map(p => ({
      'Employee ID': p.employee_id || '',
      'Employee Name': p.employee_name || '',
      'Pay Period Start': p.pay_period_start,
      'Pay Period End': p.pay_period_end,
      'Gross Salary': p.gross_salary || '',
      'Deductions': typeof p.deductions === 'string' ? p.deductions : JSON.stringify(p.deductions || []),
      'Net Salary': p.net_salary || '',
      'Status': p.status
    }));
    
    this.downloadCSV(data, `payroll_${new Date().toISOString().split('T')[0]}.csv`, headers);
  }

  /**
   * Export compliance records to CSV
   */
  exportCompliance(complianceData) {
    const headers = ['Record Type', 'Employee ID', 'Employee Name', 'Compliance Date', 'Score', 'Notes', 'Created At'];
    const data = complianceData.map(c => ({
      'Record Type': c.record_type,
      'Employee ID': c.employee_id || '',
      'Employee Name': c.employee_name || '',
      'Compliance Date': c.compliance_date || '',
      'Score': c.score || '',
      'Notes': c.notes || '',
      'Created At': c.created_at
    }));
    
    this.downloadCSV(data, `compliance_${new Date().toISOString().split('T')[0]}.csv`, headers);
  }

  /**
   * Generate PDF report (requires PDF library)
   */
  async generatePDFReport(data, title, columns) {
    // This would integrate with a PDF library like jsPDF or PDFKit
    // For now, return a placeholder
    console.log(`Generating PDF report: ${title}`);
    return { success: true, message: 'PDF generation requires PDF library integration' };
  }
}

module.exports = new ExportService();

