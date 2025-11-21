const { pool } = require('../../lib/database');
const { authenticateAdmin } = require('../../lib/auth');

async function handler(req, res) {
  if (req.method === 'GET') {
    return authenticateAdmin(req, res, async () => {
      try {
        const result = await pool.query('SELECT id, employee_id, name, email, department, position, salary, start_date, status FROM employees ORDER BY created_at DESC');
        res.json({ success: true, data: result.rows });
      } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else if (req.method === 'POST') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { employee_id, name, email, department, position, salary, phone, address, start_date } = req.body;
        if (!employee_id || !name || !email) {
          return res.status(400).json({ error: 'employee_id, name, and email are required' });
        }
        const result = await pool.query(
          'INSERT INTO employees (employee_id, name, email, department, position, salary, phone, address, start_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, employee_id, name, email, department, position, salary, start_date, status',
          [employee_id, name, email, department || null, position || null, salary || null, phone || null, address || null, start_date || null]
        );
        res.json({ success: true, data: result.rows[0] });
      } catch (e) {
        if (e.code === '23505') {
          return res.status(400).json({ error: 'Employee ID or email already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;


