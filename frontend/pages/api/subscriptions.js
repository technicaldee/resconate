const { pool } = require('../../lib/database');
const { authenticateAdmin } = require('../../lib/auth');

async function handler(req, res) {
  if (req.method === 'GET') {
    return authenticateAdmin(req, res, async () => {
      try {
        const result = await pool.query('SELECT * FROM subscriptions ORDER BY created_at DESC');
        res.json({ success: true, data: result.rows });
      } catch (e) {
        console.error('Error fetching subscriptions:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else if (req.method === 'POST') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { company_name, plan_type, amount, billing_cycle, payment_method, payment_provider } = req.body;
        
        if (!plan_type || !amount) {
          return res.status(400).json({ error: 'plan_type and amount are required' });
        }

        // Calculate next billing date
        const nextBillingDate = new Date();
        if (billing_cycle === 'monthly') {
          nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        } else if (billing_cycle === 'yearly') {
          nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
        }

        const result = await pool.query(
          `INSERT INTO subscriptions 
           (company_name, plan_type, amount, billing_cycle, payment_method, payment_provider, next_billing_date, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
           RETURNING *`,
          [company_name || null, plan_type, amount, billing_cycle || 'monthly', payment_method || null, payment_provider || null, nextBillingDate]
        );

        res.json({ success: true, data: result.rows[0] });
      } catch (e) {
        console.error('Error creating subscription:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else if (req.method === 'PUT') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { id, status, auto_renewal, next_billing_date } = req.body;
        
        if (!id) {
          return res.status(400).json({ error: 'id is required' });
        }

        const result = await pool.query(
          `UPDATE subscriptions 
           SET status = COALESCE($1, status), 
               auto_renewal = COALESCE($2, auto_renewal),
               next_billing_date = COALESCE($3, next_billing_date),
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $4
           RETURNING *`,
          [status, auto_renewal, next_billing_date, id]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Subscription not found' });
        }

        res.json({ success: true, data: result.rows[0] });
      } catch (e) {
        console.error('Error updating subscription:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

