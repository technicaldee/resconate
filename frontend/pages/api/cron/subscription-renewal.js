/**
 * Cron job endpoint for subscription auto-renewal
 * Should be called daily via cron or scheduled task
 */

const subscriptionManager = require('../../../lib/subscriptionManager');

async function handler(req, res) {
  // Secure cron endpoint (should use API key or IP whitelist in production)
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.CRON_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const result = await subscriptionManager.processAutoRenewal();
      res.json(result);
    } catch (error) {
      console.error('Subscription renewal cron error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

