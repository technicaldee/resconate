const { pool } = require('../../../lib/database');
const { authenticateAdmin } = require('../../../lib/auth');

async function handler(req, res) {
  if (req.method === 'POST') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { salary, state, calculator, result } = req.body;
        
        // Store calculation history
        await pool.query(
          `INSERT INTO compliance_calculations 
           (salary, state, calculator_type, calculation_result, created_by)
           VALUES ($1, $2, $3, $4, $5)`,
          [salary, state, calculator, JSON.stringify(result), req.admin.id]
        );

        res.json({ success: true });
      } catch (e) {
        console.error('Error saving calculation:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else if (req.method === 'GET') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { limit = 50 } = req.query;
        const result = await pool.query(
          `SELECT * FROM compliance_calculations 
           ORDER BY created_at DESC 
           LIMIT $1`,
          [parseInt(limit)]
        );
        res.json({ success: true, data: result.rows });
      } catch (e) {
        console.error('Error fetching calculations:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

