const { pool } = require('../../../lib/database');
const { authenticateAdmin } = require('../../../lib/auth');

async function handler(req, res) {
  if (req.method === 'GET') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { month, year } = req.query;
        const targetMonth = month ? parseInt(month) : new Date().getMonth() + 1;
        const targetYear = year ? parseInt(year) : new Date().getFullYear();

        // Get compliance events for the month
        const result = await pool.query(
          `SELECT * FROM compliance_calendar_events 
           WHERE EXTRACT(MONTH FROM deadline_date) = $1 
           AND EXTRACT(YEAR FROM deadline_date) = $2
           ORDER BY deadline_date ASC`,
          [targetMonth, targetYear]
        );

        // Get upcoming deadlines (next 30 days)
        const upcomingResult = await pool.query(
          `SELECT * FROM compliance_calendar_events 
           WHERE deadline_date >= CURRENT_DATE 
           AND deadline_date <= CURRENT_DATE + INTERVAL '30 days'
           AND is_completed = FALSE
           ORDER BY deadline_date ASC`
        );

        res.json({
          success: true,
          data: {
            events: result.rows,
            upcoming: upcomingResult.rows
          }
        });
      } catch (error) {
        console.error('Compliance calendar error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else if (req.method === 'POST') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { title, description, deadline_date, frequency, priority, category } = req.body;

        if (!title || !deadline_date) {
          return res.status(400).json({ error: 'title and deadline_date are required' });
        }

        const result = await pool.query(
          `INSERT INTO compliance_calendar_events 
           (title, description, deadline_date, frequency, priority, category)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [title, description || null, deadline_date, frequency || 'monthly', priority || 'medium', category || null]
        );

        res.json({ success: true, data: result.rows[0] });
      } catch (error) {
        console.error('Compliance calendar create error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

