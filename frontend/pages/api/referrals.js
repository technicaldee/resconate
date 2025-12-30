const { pool } = require('../../lib/database');
const { authenticateAdmin } = require('../../lib/auth');

// Generate unique referral code
function generateReferralCode() {
  return Math.random().toString(36).substring(2, 9).toUpperCase() + 
         Math.random().toString(36).substring(2, 5).toUpperCase();
}

async function handler(req, res) {
  if (req.method === 'GET') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { referrerId } = req.query;
        let query = `
          SELECT r.*, e.name as referrer_name, e.email as referrer_email
          FROM referrals r
          LEFT JOIN employees e ON r.referrer_id = e.id
        `;
        const params = [];

        if (referrerId) {
          query += ' WHERE r.referrer_id = $1';
          params.push(parseInt(referrerId));
        }

        query += ' ORDER BY r.created_at DESC';

        const result = await pool.query(query, params);
        res.json({ success: true, data: result.rows });
      } catch (e) {
        console.error('Error fetching referrals:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else if (req.method === 'POST') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { referrer_id, referred_email, referred_name } = req.body;
        
        if (!referrer_id || !referred_email) {
          return res.status(400).json({ error: 'referrer_id and referred_email are required' });
        }

        // Generate unique referral code
        let referralCode = generateReferralCode();
        let exists = true;
        while (exists) {
          const check = await pool.query('SELECT id FROM referrals WHERE referral_code = $1', [referralCode]);
          if (check.rows.length === 0) {
            exists = false;
          } else {
            referralCode = generateReferralCode();
          }
        }

        const result = await pool.query(
          `INSERT INTO referrals (referrer_id, referred_email, referred_name, referral_code, status)
           VALUES ($1, $2, $3, $4, 'pending')
           RETURNING *`,
          [referrer_id, referred_email, referred_name || null, referralCode]
        );

        res.json({ success: true, data: result.rows[0] });
      } catch (e) {
        console.error('Error creating referral:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else if (req.method === 'PUT') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { id, status, reward_type, reward_amount } = req.body;
        
        if (!id || !status) {
          return res.status(400).json({ error: 'id and status are required' });
        }

        const result = await pool.query(
          `UPDATE referrals 
           SET status = $1, reward_type = $2, reward_amount = $3, updated_at = CURRENT_TIMESTAMP
           WHERE id = $4
           RETURNING *`,
          [status, reward_type || null, reward_amount || null, id]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Referral not found' });
        }

        res.json({ success: true, data: result.rows[0] });
      } catch (e) {
        console.error('Error updating referral:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

