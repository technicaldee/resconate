const { pool } = require('../../../lib/database');
const { authenticateAdmin } = require('../../../lib/auth');

async function handler(req, res) {
  if (req.method === 'GET') {
    return authenticateAdmin(req, res, async () => {
      try {
        const result = await pool.query('SELECT * FROM system_settings ORDER BY setting_key');
        res.json({ success: true, data: result.rows });
      } catch (e) {
        console.error('Error fetching settings:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else if (req.method === 'POST') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { setting_key, setting_value, setting_type = 'string', description } = req.body;
        
        if (!setting_key || setting_value === undefined) {
          return res.status(400).json({ error: 'setting_key and setting_value are required' });
        }

        const result = await pool.query(
          `INSERT INTO system_settings (setting_key, setting_value, setting_type, description)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (setting_key) 
           DO UPDATE SET setting_value = $2, setting_type = $3, description = $4, updated_at = CURRENT_TIMESTAMP
           RETURNING *`,
          [setting_key, setting_value, setting_type, description || null]
        );

        res.json({ success: true, data: result.rows[0] });
      } catch (e) {
        console.error('Error updating setting:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

