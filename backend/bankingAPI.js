/**
 * Banking API Integration Service (Backend)
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

      const https = require('https');
      const querystring = require('querystring');

      const postData = JSON.stringify({
        account_number: accountNumber,
        account_bank: bankCode
      });

      const options = {
        hostname: 'api.flutterwave.com',
        path: '/v3/accounts/resolve',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.flutterwaveSecretKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            try {
              const result = JSON.parse(data);
              if (result.status === 'success') {
                resolve({
                  success: true,
                  accountNumber: result.data.account_number,
                  accountName: result.data.account_name,
                  bankCode: bankCode
                });
              } else {
                resolve({ success: false, error: result.message || 'Account verification failed' });
              }
            } catch (e) {
              reject(e);
            }
          });
        });

        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
      });
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

      const https = require('https');
      const querystring = require('querystring');

      const queryParams = querystring.stringify({
        account_number: accountNumber,
        bank_code: bankCode
      });

      const options = {
        hostname: 'api.paystack.co',
        path: `/bank/resolve?${queryParams}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.paystackSecretKey}`
        }
      };

      return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            try {
              const result = JSON.parse(data);
              if (result.status) {
                resolve({
                  success: true,
                  accountNumber: result.data.account_number,
                  accountName: result.data.account_name,
                  bankCode: bankCode
                });
              } else {
                resolve({ success: false, error: result.message || 'Account verification failed' });
              }
            } catch (e) {
              reject(e);
            }
          });
        });

        req.on('error', (e) => reject(e));
        req.end();
      });
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
      const https = require('https');

      if (this.defaultProvider === 'flutterwave' && this.flutterwaveSecretKey) {
        const options = {
          hostname: 'api.flutterwave.com',
          path: '/v3/banks/NG',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.flutterwaveSecretKey}`
          }
        };

        return new Promise((resolve, reject) => {
          const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
              try {
                const result = JSON.parse(data);
                if (result.status === 'success') {
                  resolve({ success: true, banks: result.data });
                } else {
                  resolve(this.getFallbackBanks());
                }
              } catch (e) {
                resolve(this.getFallbackBanks());
              }
            });
          });
          req.on('error', () => resolve(this.getFallbackBanks()));
          req.end();
        });
      } else if (this.defaultProvider === 'paystack' && this.paystackSecretKey) {
        const options = {
          hostname: 'api.paystack.co',
          path: '/bank',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.paystackSecretKey}`
          }
        };

        return new Promise((resolve, reject) => {
          const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
              try {
                const result = JSON.parse(data);
                if (result.status) {
                  resolve({ success: true, banks: result.data });
                } else {
                  resolve(this.getFallbackBanks());
                }
              } catch (e) {
                resolve(this.getFallbackBanks());
              }
            });
          });
          req.on('error', () => resolve(this.getFallbackBanks()));
          req.end();
        });
      }

      return this.getFallbackBanks();
    } catch (error) {
      console.error('Get banks error:', error);
      return this.getFallbackBanks();
    }
  }

  getFallbackBanks() {
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
  }

  /**
   * Process bulk payment transfer
   */
  async processBulkTransfer(transfers) {
    try {
      if (this.defaultProvider === 'flutterwave' && this.flutterwaveSecretKey) {
        const https = require('https');

        const postData = JSON.stringify({
          title: 'Payroll Disbursement',
          bulk_data: transfers.map(t => ({
            bank_code: t.bankCode,
            account_number: t.accountNumber,
            amount: t.amount,
            currency: 'NGN',
            narration: `Payroll payment for ${t.employeeName}`,
            reference: t.reference
          }))
        });

        const options = {
          hostname: 'api.flutterwave.com',
          path: '/v3/bulk-transfers',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.flutterwaveSecretKey}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        return new Promise((resolve, reject) => {
          const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
              try {
                const result = JSON.parse(data);
                if (result.status === 'success') {
                  resolve({ success: true, batchId: result.data.id, transfers: result.data });
                } else {
                  resolve({ success: false, error: result.message || 'Bulk transfer failed' });
                }
              } catch (e) {
                resolve({ success: false, error: e.message });
              }
            });
          });
          req.on('error', (e) => resolve({ success: false, error: e.message }));
          req.write(postData);
          req.end();
        });
      }

      return { success: false, error: 'Bulk transfer not configured' };
    } catch (error) {
      console.error('Bulk transfer error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new BankingAPIService();

