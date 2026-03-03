const axios = require('axios');
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET || 'sk_test_mock_payout_key';

/**
 * Payout Service handles all financial disbursements for HR Lite.
 * It integrates with Paystack to allow businesses to pay employees directly.
 */
class PayoutService {
    /**
     * Initialize a single transfer
     */
    async initiateTransfer(recipient_code, amount, reason = 'Salary Payment') {
        try {
            // In a real scenario, we'd use axios.post('https://api.paystack.co/transfer', ...)
            console.log(`[PAYOUT] Initiating transfer of ₦${amount} to ${recipient_code} for ${reason}`);

            // Mock success response
            return {
                success: true,
                transfer_code: 'TRF_' + Math.random().toString(36).substring(7),
                status: 'pending'
            };
        } catch (e) {
            console.error('Transfer initiation failed:', e);
            throw new Error('Payout failed: ' + e.message);
        }
    }

    /**
     * Create a transfer recipient on Paystack
     */
    async createRecipient(business_name, account_number, bank_code) {
        try {
            console.log(`[PAYOUT] Creating recipient: ${business_name} (${account_number} at ${bank_code})`);

            // Mock success response
            return {
                success: true,
                recipient_code: 'RCP_' + Math.random().toString(36).substring(7)
            };
        } catch (e) {
            console.error('Recipient creation failed:', e);
            throw new Error('Could not register bank account.');
        }
    }

    /**
     * Bulk Payout Logic
     */
    async processBulkPayout(recipients) {
        const results = [];
        for (const r of recipients) {
            try {
                const res = await this.initiateTransfer(r.recipient_code, r.amount, r.reason);
                results.push({ id: r.id, success: true, ...res });
            } catch (err) {
                results.push({ id: r.id, success: false, error: err.message });
            }
        }
        return results;
    }
}

module.exports = new PayoutService();
