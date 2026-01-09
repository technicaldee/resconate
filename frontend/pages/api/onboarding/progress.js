const { pool } = require('../../../lib/database');
const { authenticateAdmin, authenticateEmployee } = require('../../../lib/auth');

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { userId, userType } = req.query;
      
      if (!userId || !userType) {
        return res.status(400).json({ error: 'userId and userType are required' });
      }

      const idColumn = userType === 'admin' ? 'admin_id' : 'employee_id';
      const idValue = parseInt(userId);

      const result = await pool.query(
        `SELECT * FROM onboarding_progress 
         WHERE ${idColumn} = $1 
         ORDER BY created_at ASC`,
        [idValue]
      );

      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Onboarding progress error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    // Authenticate based on userType
    const authMiddleware = req.body.userType === 'admin' ? authenticateAdmin : authenticateEmployee;
    
    return authMiddleware(req, res, async () => {
      try {
        const { userId, userType, stepKey, stepName, isCompleted, data } = req.body;
        
        if (!userId || !userType || !stepKey) {
          return res.status(400).json({ error: 'userId, userType, and stepKey are required' });
        }

        const idColumn = userType === 'admin' ? 'admin_id' : 'employee_id';
        const idValue = userType === 'admin' ? req.admin.id : req.employee.id;

        // Upsert progress
        const result = await pool.query(
          `INSERT INTO onboarding_progress 
           (${idColumn}, step_key, step_name, is_completed, completed_at, data)
           VALUES ($1, $2, $3, $4, CASE WHEN $4 THEN CURRENT_TIMESTAMP ELSE NULL END, $5)
           ON CONFLICT (${idColumn}, step_key) 
           DO UPDATE SET 
             is_completed = $4,
             completed_at = CASE WHEN $4 THEN CURRENT_TIMESTAMP ELSE NULL END,
             data = $5,
             updated_at = CURRENT_TIMESTAMP
           RETURNING *`,
          [idValue, stepKey, stepName || stepKey, isCompleted || false, JSON.stringify(data || {})]
        );

        res.json({ success: true, data: result.rows[0] });
      } catch (error) {
        console.error('Onboarding progress save error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

