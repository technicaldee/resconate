const { pool } = require('../../../lib/database');
const { authenticateAdmin } = require('../../../lib/auth');
const { validateJob } = require('../../../lib/validation');

async function handler(req, res) {
  if (req.method === 'GET') {
    return authenticateAdmin(req, res, async () => {
      try {
        const result = await pool.query('SELECT * FROM jobs ORDER BY posted_date DESC');
        res.json({ success: true, data: result.rows });
      } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else if (req.method === 'POST') {
    // Validate first
    const errors = validateJob(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: errors });
    }
    // Then authenticate and create
    return authenticateAdmin(req, res, async () => {
      try {
        const { title, department, location, employment_type, salary, description, requirements, benefits } = req.body;
        const result = await pool.query(
          'INSERT INTO jobs (title, department, location, employment_type, description, requirements, benefits, status, posted_date, salary) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
          [title, department, location, employment_type || null, description || null, requirements || null, JSON.stringify(benefits || []), 'active', new Date(), salary || null]
        );
        res.json({ success: true, data: result.rows[0] });
      } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

