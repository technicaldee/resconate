const { pool } = require('../../../lib/database');
const emailService = require('../../../lib/emailService');

async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, companyName, name } = req.body;

      if (!email || !companyName) {
        return res.status(400).json({ error: 'email and companyName are required' });
      }

      // Check if trial already exists
      const existingTrial = await pool.query(
        'SELECT * FROM trial_subscriptions WHERE email = $1',
        [email]
      );

      if (existingTrial.rows.length > 0) {
        const trial = existingTrial.rows[0];
        if (trial.is_active && new Date(trial.trial_end_date) > new Date()) {
          return res.json({ 
            success: true, 
            data: trial,
            message: 'Trial already active'
          });
        }
      }

      // Create new trial (14 days)
      const trialStartDate = new Date();
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14);

      const result = await pool.query(
        `INSERT INTO trial_subscriptions 
         (email, company_name, trial_start_date, trial_end_date, is_active)
         VALUES ($1, $2, $3, $4, TRUE)
         RETURNING *`,
        [email, companyName, trialStartDate.toISOString().split('T')[0], trialEndDate.toISOString().split('T')[0]]
      );

      const trial = result.rows[0];

      // Send welcome email
      await emailService.sendEmail({
        to: email,
        subject: 'Welcome to Resconate - Your 14-Day Free Trial',
        html: `
          <h2>Welcome to Resconate!</h2>
          <p>Hi ${name || 'there'},</p>
          <p>Your 14-day free trial has started. You now have full access to all Resconate features.</p>
          <p><strong>Trial Details:</strong></p>
          <ul>
            <li>Start Date: ${trialStartDate.toLocaleDateString()}</li>
            <li>End Date: ${trialEndDate.toLocaleDateString()}</li>
            <li>Days Remaining: 14</li>
          </ul>
          <p>Get started by logging in at <a href="${process.env.APP_URL}/hr-login">${process.env.APP_URL}/hr-login</a></p>
          <p>If you have any questions, feel free to contact us at support@resconate.com</p>
          <p>Best regards,<br>Resconate Team</p>
        `
      });

      res.json({ success: true, data: trial });
    } catch (error) {
      console.error('Trial start error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

