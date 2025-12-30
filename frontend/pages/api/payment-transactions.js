const { pool } = require('../../lib/database');
const { authenticateAdmin } = require('../../lib/auth');

async function handler(req, res) {
  if (req.method === 'GET') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { employeeId, status, startDate, endDate } = req.query;
        let query = `
          SELECT pt.*, e.name as employee_name, e.employee_id, ba.bank_name, ba.account_number
          FROM payment_transactions pt
          LEFT JOIN employees e ON pt.employee_id = e.id
          LEFT JOIN bank_accounts ba ON pt.bank_account_id = ba.id
          WHERE 1=1
        `;
        const params = [];
        let paramCount = 1;

        if (employeeId) {
          query += ` AND pt.employee_id = $${paramCount++}`;
          params.push(parseInt(employeeId));
        }

        if (status) {
          query += ` AND pt.status = $${paramCount++}`;
          params.push(status);
        }

        if (startDate) {
          query += ` AND pt.created_at >= $${paramCount++}`;
          params.push(startDate);
        }

        if (endDate) {
          query += ` AND pt.created_at <= $${paramCount++}`;
          params.push(endDate);
        }

        query += ' ORDER BY pt.created_at DESC LIMIT 100';

        const result = await pool.query(query, params);
        res.json({ success: true, data: result.rows });
      } catch (e) {
        console.error('Error fetching payment transactions:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else if (req.method === 'POST') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { employee_id, bank_account_id, amount, transaction_type = 'payroll', payment_provider } = req.body;
        
        if (!employee_id || !amount) {
          return res.status(400).json({ error: 'employee_id and amount are required' });
        }

        // Generate reference
        const reference = `TXN${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        const result = await pool.query(
          `INSERT INTO payment_transactions 
           (employee_id, bank_account_id, amount, transaction_type, status, reference, payment_provider)
           VALUES ($1, $2, $3, $4, 'pending', $5, $6)
           RETURNING *`,
          [employee_id, bank_account_id || null, amount, transaction_type, reference, payment_provider || null]
        );

        res.json({ success: true, data: result.rows[0] });
      } catch (e) {
        console.error('Error creating payment transaction:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

