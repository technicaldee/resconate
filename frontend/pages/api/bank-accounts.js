const { pool } = require('../../lib/database');
const { authenticateAdmin } = require('../../lib/auth');

async function handler(req, res) {
  if (req.method === 'GET') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { employeeId } = req.query;
        let query = `
          SELECT ba.*, e.name as employee_name, e.employee_id
          FROM bank_accounts ba
          LEFT JOIN employees e ON ba.employee_id = e.id
        `;
        const params = [];

        if (employeeId) {
          query += ' WHERE ba.employee_id = $1';
          params.push(parseInt(employeeId));
        }

        query += ' ORDER BY ba.created_at DESC';

        const result = await pool.query(query, params);
        res.json({ success: true, data: result.rows });
      } catch (e) {
        console.error('Error fetching bank accounts:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else if (req.method === 'POST') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { employee_id, bank_name, bank_code, account_number, account_name } = req.body;
        
        if (!employee_id || !bank_name || !account_number) {
          return res.status(400).json({ error: 'employee_id, bank_name, and account_number are required' });
        }

        // Verify account (in production, this would call bank API)
        const isVerified = false; // Placeholder

        const result = await pool.query(
          `INSERT INTO bank_accounts 
           (employee_id, bank_name, bank_code, account_number, account_name, is_verified)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [employee_id, bank_name, bank_code || null, account_number, account_name || null, isVerified]
        );

        res.json({ success: true, data: result.rows[0] });
      } catch (e) {
        console.error('Error creating bank account:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else if (req.method === 'PUT') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { id, is_verified } = req.body;
        
        if (!id) {
          return res.status(400).json({ error: 'id is required' });
        }

        const result = await pool.query(
          `UPDATE bank_accounts 
           SET is_verified = $1, verification_date = CASE WHEN $1 THEN CURRENT_TIMESTAMP ELSE NULL END, updated_at = CURRENT_TIMESTAMP
           WHERE id = $2
           RETURNING *`,
          [is_verified, id]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Bank account not found' });
        }

        res.json({ success: true, data: result.rows[0] });
      } catch (e) {
        console.error('Error updating bank account:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

