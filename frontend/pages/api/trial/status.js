const { pool } = require('../../../lib/database');

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({ error: 'email is required' });
      }

      const result = await pool.query(
        'SELECT * FROM trial_subscriptions WHERE email = $1 ORDER BY created_at DESC LIMIT 1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.json({ success: true, data: null, hasTrial: false });
      }

      const trial = result.rows[0];
      const now = new Date();
      const endDate = new Date(trial.trial_end_date);
      const daysRemaining = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));
      const isActive = trial.is_active && endDate > now;

      res.json({
        success: true,
        data: {
          ...trial,
          daysRemaining,
          isActive,
          isExpired: endDate <= now
        },
        hasTrial: true
      });
    } catch (error) {
      console.error('Trial status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

