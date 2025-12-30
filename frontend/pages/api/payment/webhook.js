const paymentGatewayService = require('../../../lib/paymentGateway');
const { pool } = require('../../../lib/database');

async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const provider = req.query.provider || 'paystack';
      const signature = req.headers['x-paystack-signature'] || req.headers['x-flutterwave-signature'];
      
      const result = await paymentGatewayService.handleWebhook(
        provider,
        req.body,
        signature
      );

      if (result.success) {
        // Update payment transaction status
        await pool.query(
          `UPDATE payment_transactions 
           SET status = 'completed', 
               processed_at = CURRENT_TIMESTAMP,
               provider_reference = $1
           WHERE reference = $2`,
          [req.body.data?.reference || req.body.tx_ref, result.reference]
        );

        // Update invoice status if applicable
        if (req.body.data?.metadata?.invoice_id) {
          await pool.query(
            `UPDATE invoices 
             SET status = 'paid', 
                 paid_date = CURRENT_TIMESTAMP,
                 payment_reference = $1
             WHERE id = $2`,
            [result.reference, req.body.data.metadata.invoice_id]
          );
        }
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).json({ error: 'Webhook processing failed' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

