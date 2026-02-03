const { pool } = require('../../../lib/database');
const emailService = require('../../../lib/emailService');

async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, email, phone, company, employees, preferredDate, preferredTime, message } = req.body;

      if (!name || !email || !phone || !company || !employees || !preferredDate || !preferredTime) {
        return res.status(400).json({ error: 'All required fields must be provided' });
      }

      // Save demo request to database
      const result = await pool.query(
        `INSERT INTO demo_requests 
         (name, email, phone, company, employees, preferred_date, preferred_time, message, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
         RETURNING *`,
        [name, email, phone, company, employees, preferredDate, preferredTime, message || null]
      );

      // Send confirmation email to customer
      await emailService.sendEmail({
        to: email,
        subject: 'Demo Request Received - Resconate',
        html: `
          <h2>Thank you for requesting a demo!</h2>
          <p>Hi ${name},</p>
          <p>We've received your demo request and our team will contact you within 24 hours to schedule your personalized demo.</p>
          <p><strong>Your Details:</strong></p>
          <ul>
            <li>Company: ${company}</li>
            <li>Employees: ${employees}</li>
            <li>Preferred Date: ${preferredDate}</li>
            <li>Preferred Time: ${preferredTime}</li>
          </ul>
          <p>If you have any questions, feel free to reply to this email or contact us at admin@resconate.com</p>
          <p>Best regards,<br>Resconate Team</p>
        `
      });

      // Notify admin team
      await emailService.sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@resconate.com',
        subject: 'New Demo Request - Resconate',
        html: `
          <h2>New Demo Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Employees:</strong> ${employees}</p>
          <p><strong>Preferred Date:</strong> ${preferredDate}</p>
          <p><strong>Preferred Time:</strong> ${preferredTime}</p>
          ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
        `
      });

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Demo request error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

