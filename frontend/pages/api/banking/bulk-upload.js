const { pool } = require('../../../lib/database');
const { authenticateAdmin } = require('../../../lib/auth');
const bankingAPI = require('../../../lib/bankingAPI');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

async function handler(req, res) {
  if (req.method === 'POST') {
    return authenticateAdmin(req, res, async () => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: 'CSV file is required' });
        }

        const filePath = req.file.path;
        const payments = [];

        // Read and parse CSV file
        await new Promise((resolve, reject) => {
          fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
              payments.push({
                employeeId: row.employee_id || row['Employee ID'],
                accountNumber: row.account_number || row['Account Number'],
                bankCode: row.bank_code || row['Bank Code'],
                amount: parseFloat(row.amount || row['Amount']),
                narration: row.narration || row['Narration'] || 'Payroll payment'
              });
            })
            .on('end', resolve)
            .on('error', reject);
        });

        if (payments.length === 0) {
          return res.status(400).json({ error: 'No valid payments found in CSV' });
        }

        // Process bulk payments
        const results = [];
        const batchId = `BATCH_${Date.now()}`;

        for (const payment of payments) {
          try {
            // Verify account
            const verification = await bankingAPI.verifyAccount({
              accountNumber: payment.accountNumber,
              bankCode: payment.bankCode
            });

            if (!verification.success) {
              results.push({
                ...payment,
                status: 'failed',
                error: 'Account verification failed'
              });
              continue;
            }

            // Process transfer
            const transfer = await bankingAPI.initiateTransfer({
              accountNumber: payment.accountNumber,
              bankCode: payment.bankCode,
              amount: payment.amount,
              narration: payment.narration,
              reference: `PAY_${Date.now()}_${payment.employeeId}`
            });

            // Save transaction
            await pool.query(
              `INSERT INTO payment_transactions 
               (employee_id, amount, transaction_type, status, reference, payment_provider, batch_id)
               VALUES ($1, $2, 'payroll', $3, $4, 'banking', $5)`,
              [
                payment.employeeId,
                payment.amount,
                transfer.success ? 'pending' : 'failed',
                transfer.reference || null,
                batchId
              ]
            );

            results.push({
              ...payment,
              status: transfer.success ? 'pending' : 'failed',
              reference: transfer.reference
            });
          } catch (error) {
            results.push({
              ...payment,
              status: 'error',
              error: error.message
            });
          }
        }

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        res.json({
          success: true,
          batchId,
          total: payments.length,
          successful: results.filter(r => r.status === 'pending').length,
          failed: results.filter(r => r.status === 'failed' || r.status === 'error').length,
          results
        });
      } catch (error) {
        console.error('Bulk upload error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Export handler with multer middleware
export default upload.single('file')(handler);

