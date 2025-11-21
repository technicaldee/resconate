const { pool } = require('../../lib/database');
const { authenticateAdmin } = require('../../lib/auth');

async function handler(req, res) {
  if (req.method === 'GET') {
    return authenticateAdmin(req, res, async () => {
      try {
        const result = await pool.query('SELECT * FROM compliance_records ORDER BY created_at DESC LIMIT 50');
        res.json({ success: true, data: result.rows });
      } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;


