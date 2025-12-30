const bankingAPIService = require('../../../lib/bankingAPI');
const { pool } = require('../../../lib/database');
const { authenticateAdmin } = require('../../../lib/auth');

async function handler(req, res) {
  if (req.method === 'POST') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { accountNumber, bankCode, accountId } = req.body;
        
        if (!accountNumber || !bankCode) {
          return res.status(400).json({ error: 'accountNumber and bankCode are required' });
        }

        // Verify account via banking API
        const verification = await bankingAPIService.verifyAccount(accountNumber, bankCode);

        if (verification.success) {
          // Update bank account record
          if (accountId) {
            await pool.query(
              `UPDATE bank_accounts 
               SET account_name = $1, 
                   is_verified = TRUE, 
                   verification_date = CURRENT_TIMESTAMP,
                   updated_at = CURRENT_TIMESTAMP
               WHERE id = $2`,
              [verification.accountName, accountId]
            );
          }

          res.json({ 
            success: true, 
            accountName: verification.accountName,
            accountNumber: verification.accountNumber
          });
        } else {
          res.status(400).json({ error: verification.error || 'Account verification failed' });
        }
      } catch (e) {
        console.error('Error verifying bank account:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

