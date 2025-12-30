const { pool } = require('../../../lib/database');
const { authenticateAdmin } = require('../../../lib/auth');
const pdfGenerator = require('../../../lib/pdfGenerator');

async function handler(req, res) {
  if (req.method === 'GET') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { startDate, endDate, format = 'json' } = req.query;

        if (!startDate || !endDate) {
          return res.status(400).json({ error: 'startDate and endDate are required' });
        }

        // Get all transactions in date range
        const transactionsResult = await pool.query(
          `SELECT pt.*, e.name as employee_name, e.account_number, e.bank_name
           FROM payment_transactions pt
           LEFT JOIN employees e ON pt.employee_id = e.id
           WHERE pt.created_at >= $1 AND pt.created_at <= $2
           AND pt.transaction_type = 'payroll'
           ORDER BY pt.created_at DESC`,
          [startDate, endDate]
        );

        const transactions = transactionsResult.rows;

        // Calculate totals
        const totals = {
          totalAmount: transactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0),
          totalCount: transactions.length,
          completed: transactions.filter(t => t.status === 'completed').length,
          pending: transactions.filter(t => t.status === 'pending').length,
          failed: transactions.filter(t => t.status === 'failed').length
        };

        // Group by status
        const byStatus = {
          completed: transactions.filter(t => t.status === 'completed'),
          pending: transactions.filter(t => t.status === 'pending'),
          failed: transactions.filter(t => t.status === 'failed')
        };

        // Group by bank
        const byBank = {};
        transactions.forEach(t => {
          const bank = t.bank_name || 'Unknown';
          if (!byBank[bank]) {
            byBank[bank] = { count: 0, amount: 0, transactions: [] };
          }
          byBank[bank].count++;
          byBank[bank].amount += parseFloat(t.amount || 0);
          byBank[bank].transactions.push(t);
        });

        const reportData = {
          period: { startDate, endDate },
          summary: totals,
          byStatus,
          byBank,
          transactions
        };

        if (format === 'pdf') {
          // Generate PDF report
          const pdfUrl = await pdfGenerator.generateReconciliationReport(reportData);
          res.json({ success: true, pdfUrl, data: reportData });
        } else if (format === 'excel') {
          // Generate Excel (CSV for now)
          const csv = generateCSV(reportData);
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', `attachment; filename=reconciliation_${startDate}_${endDate}.csv`);
          res.send(csv);
        } else {
          res.json({ success: true, data: reportData });
        }
      } catch (error) {
        console.error('Reconciliation error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function generateCSV(reportData) {
  let csv = 'Date,Employee,Account Number,Bank,Amount,Status,Reference\n';
  
  reportData.transactions.forEach(t => {
    csv += `${t.created_at},${t.employee_name || 'N/A'},${t.account_number || 'N/A'},${t.bank_name || 'N/A'},${t.amount},${t.status},${t.reference || 'N/A'}\n`;
  });

  csv += `\nSummary\n`;
  csv += `Total Amount,${reportData.summary.totalAmount}\n`;
  csv += `Total Count,${reportData.summary.totalCount}\n`;
  csv += `Completed,${reportData.summary.completed}\n`;
  csv += `Pending,${reportData.summary.pending}\n`;
  csv += `Failed,${reportData.summary.failed}\n`;

  return csv;
}

export default handler;

