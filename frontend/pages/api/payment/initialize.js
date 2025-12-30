const paymentGatewayService = require('../../../lib/paymentGateway');
const { pool } = require('../../../lib/database');
const { authenticateAdmin } = require('../../../lib/auth');

async function handler(req, res) {
  if (req.method === 'POST') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { email, amount, subscriptionId, invoiceId } = req.body;
        
        if (!email || !amount) {
          return res.status(400).json({ error: 'email and amount are required' });
        }

        // Generate reference
        const reference = `PAY_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // Initialize payment
        const payment = await paymentGatewayService.processPayment({
          email,
          amount: parseFloat(amount),
          reference,
          metadata: {
            subscriptionId,
            invoiceId
          }
        });

        if (payment.success) {
          // Create payment transaction record
          await pool.query(
            `INSERT INTO payment_transactions 
             (employee_id, amount, transaction_type, status, reference, payment_provider)
             VALUES ($1, $2, 'subscription', 'pending', $3, $4)
             RETURNING *`,
            [null, amount, reference, process.env.PAYMENT_PROVIDER || 'paystack']
          );

          res.json({ 
            success: true, 
            authorizationUrl: payment.authorizationUrl || payment.paymentLink,
            reference: payment.reference
          });
        } else {
          res.status(400).json({ error: payment.error || 'Payment initialization failed' });
        }
      } catch (e) {
        console.error('Error initializing payment:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

