const { pool } = require('../../lib/database');
const { authenticateAdmin } = require('../../lib/auth');

async function handler(req, res) {
  if (req.method === 'GET') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { subscriptionId, status } = req.query;
        let query = `
          SELECT i.*, s.company_name, s.plan_type
          FROM invoices i
          LEFT JOIN subscriptions s ON i.subscription_id = s.id
          WHERE 1=1
        `;
        const params = [];
        let paramCount = 1;

        if (subscriptionId) {
          query += ` AND i.subscription_id = $${paramCount++}`;
          params.push(parseInt(subscriptionId));
        }

        if (status) {
          query += ` AND i.status = $${paramCount++}`;
          params.push(status);
        }

        query += ' ORDER BY i.created_at DESC';

        const result = await pool.query(query, params);
        res.json({ success: true, data: result.rows });
      } catch (e) {
        console.error('Error fetching invoices:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else if (req.method === 'POST') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { subscription_id, amount, due_date } = req.body;
        
        if (!subscription_id || !amount) {
          return res.status(400).json({ error: 'subscription_id and amount are required' });
        }

        // Generate invoice number
        const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        const result = await pool.query(
          `INSERT INTO invoices 
           (subscription_id, invoice_number, amount, due_date, status)
           VALUES ($1, $2, $3, $4, 'pending')
           RETURNING *`,
          [subscription_id, invoiceNumber, amount, due_date || null]
        );

        res.json({ success: true, data: result.rows[0] });
      } catch (e) {
        console.error('Error creating invoice:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

