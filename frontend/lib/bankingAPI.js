/**
 * Banking API Integration Service
 * Supports Flutterwave and Paystack for bank account verification
 */

class BankingAPIService {
  constructor() {
    this.flutterwaveSecretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    this.paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    this.defaultProvider = process.env.BANKING_PROVIDER || 'flutterwave';
  }

  /**
   * Verify bank account using Flutterwave
   */
  async verifyAccountFlutterwave(accountNumber, bankCode) {
    try {
      if (!this.flutterwaveSecretKey) {
        throw new Error('Flutterwave secret key not configured');
      }

      const response = await fetch('https://api.flutterwave.com/v3/accounts/resolve', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.flutterwaveSecretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          account_number: accountNumber,
          account_bank: bankCode
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        return {
          success: true,
          accountNumber: data.data.account_number,
          accountName: data.data.account_name,
          bankCode: bankCode
        };
      } else {
        return { success: false, error: data.message || 'Account verification failed' };
      }
    } catch (error) {
      console.error('Flutterwave account verification error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify bank account using Paystack
   */
  async verifyAccountPaystack(accountNumber, bankCode) {
    try {
      if (!this.paystackSecretKey) {
        throw new Error('Paystack secret key not configured');
      }

      const response = await fetch('https://api.paystack.co/bank/resolve', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.paystackSecretKey}`
        },
        params: new URLSearchParams({
          account_number: accountNumber,
          bank_code: bankCode
        })
      });

      const data = await response.json();
      
      if (data.status) {
        return {
          success: true,
          accountNumber: data.data.account_number,
          accountName: data.data.account_name,
          bankCode: bankCode
        };
      } else {
        return { success: false, error: data.message || 'Account verification failed' };
      }
    } catch (error) {
      console.error('Paystack account verification error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify bank account (uses default provider)
   */
  async verifyAccount(accountNumber, bankCode) {
    if (this.defaultProvider === 'flutterwave') {
      return this.verifyAccountFlutterwave(accountNumber, bankCode);
    } else if (this.defaultProvider === 'paystack') {
      return this.verifyAccountPaystack(accountNumber, bankCode);
    } else {
      return { success: false, error: 'No banking provider configured' };
    }
  }

  /**
   * Get list of Nigerian banks
   */
  async getBanks() {
    try {
      if (this.defaultProvider === 'flutterwave' && this.flutterwaveSecretKey) {
        const response = await fetch('https://api.flutterwave.com/v3/banks/NG', {
          headers: {
            'Authorization': `Bearer ${this.flutterwaveSecretKey}`
          }
        });
        const data = await response.json();
        if (data.status === 'success') {
          return { success: true, banks: data.data };
        }
      } else if (this.defaultProvider === 'paystack' && this.paystackSecretKey) {
        const response = await fetch('https://api.paystack.co/bank', {
          headers: {
            'Authorization': `Bearer ${this.paystackSecretKey}`
          }
        });
        const data = await response.json();
        if (data.status) {
          return { success: true, banks: data.data };
        }
      }

      // Fallback: Return common Nigerian banks
      return {
        success: true,
        banks: [
          { code: '058', name: 'GTBank' },
          { code: '044', name: 'Access Bank' },
          { code: '057', name: 'Zenith Bank' },
          { code: '033', name: 'UBA' },
          { code: '050', name: 'Ecobank' },
          { code: '011', name: 'First Bank' }
        ]
      };
    } catch (error) {
      console.error('Get banks error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process bulk payment transfer
   */
  async processBulkTransfer(transfers) {
    try {
      if (this.defaultProvider === 'flutterwave' && this.flutterwaveSecretKey) {
        const response = await fetch('https://api.flutterwave.com/v3/bulk-transfers', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.flutterwaveSecretKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: 'Payroll Disbursement',
            bulk_data: transfers.map(t => ({
              bank_code: t.bankCode,
              account_number: t.accountNumber,
              amount: t.amount,
              currency: 'NGN',
              narration: `Payroll payment for ${t.employeeName}`,
              reference: t.reference
            }))
          })
        });

        const data = await response.json();
        if (data.status === 'success') {
          return { success: true, batchId: data.data.id, transfers: data.data };
        }
      }

      return { success: false, error: 'Bulk transfer not configured' };
    } catch (error) {
      console.error('Bulk transfer error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new BankingAPIService();

