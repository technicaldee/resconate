/**
 * Payment Gateway Integration Service
 * Supports Paystack and Flutterwave
 */

class PaymentGatewayService {
  constructor() {
    this.paystackPublicKey = process.env.PAYSTACK_PUBLIC_KEY;
    this.paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    this.flutterwavePublicKey = process.env.FLUTTERWAVE_PUBLIC_KEY;
    this.flutterwaveSecretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    this.defaultProvider = process.env.PAYMENT_PROVIDER || 'paystack';
  }

  /**
   * Initialize payment with Paystack
   */
  async initializePaystackPayment({ email, amount, reference, metadata = {}, paymentMethod = 'card' }) {
    try {
      if (!this.paystackSecretKey) {
        throw new Error('Paystack secret key not configured');
      }

      const paymentData = {
        email,
        amount: amount * 100, // Convert to kobo
        reference,
        metadata,
        callback_url: `${process.env.APP_URL}/payment/callback`
      };

      // Add payment method specific configuration
      if (paymentMethod === 'bank_transfer') {
        paymentData.channels = ['bank'];
      } else if (paymentMethod === 'ussd') {
        paymentData.channels = ['ussd'];
      } else {
        paymentData.channels = ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'];
      }

      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.paystackSecretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();
      
      if (data.status) {
        return {
          success: true,
          authorizationUrl: data.data.authorization_url,
          accessCode: data.data.access_code,
          reference: data.data.reference,
          paymentMethod: paymentMethod
        };
      } else {
        throw new Error(data.message || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('Paystack initialization error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Initialize USSD payment with Paystack
   */
  async initializePaystackUSSD({ email, amount, reference, metadata = {}, bankCode }) {
    try {
      if (!this.paystackSecretKey) {
        throw new Error('Paystack secret key not configured');
      }

      if (!bankCode) {
        throw new Error('Bank code is required for USSD payment');
      }

      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.paystackSecretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          amount: amount * 100,
          reference,
          metadata,
          channels: ['ussd'],
          ussd: {
            type: 'ussd',
            bank: bankCode
          }
        })
      });

      const data = await response.json();
      
      if (data.status) {
        return {
          success: true,
          authorizationUrl: data.data.authorization_url,
          accessCode: data.data.access_code,
          reference: data.data.reference,
          ussdCode: data.data.ussd_code || null,
          displayText: data.data.display_text || null
        };
      } else {
        throw new Error(data.message || 'USSD payment initialization failed');
      }
    } catch (error) {
      console.error('Paystack USSD initialization error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Initialize Bank Transfer payment with Paystack
   */
  async initializePaystackBankTransfer({ email, amount, reference, metadata = {} }) {
    try {
      if (!this.paystackSecretKey) {
        throw new Error('Paystack secret key not configured');
      }

      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.paystackSecretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          amount: amount * 100,
          reference,
          metadata,
          channels: ['bank']
        })
      });

      const data = await response.json();
      
      if (data.status) {
        // For bank transfer, we need to get account details
        const transferResponse = await fetch(`https://api.paystack.co/transferrecipient`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.paystackSecretKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: 'nuban',
            name: metadata.accountName || email,
            account_number: metadata.accountNumber,
            bank_code: metadata.bankCode,
            currency: 'NGN'
          })
        });

        const transferData = await transferResponse.json();

        return {
          success: true,
          authorizationUrl: data.data.authorization_url,
          accessCode: data.data.access_code,
          reference: data.data.reference,
          accountDetails: transferData.status ? {
            accountNumber: metadata.accountNumber,
            accountName: transferData.data?.name,
            bankName: metadata.bankName,
            bankCode: metadata.bankCode
          } : null
        };
      } else {
        throw new Error(data.message || 'Bank transfer initialization failed');
      }
    } catch (error) {
      console.error('Paystack Bank Transfer initialization error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify Paystack payment
   */
  async verifyPaystackPayment(reference) {
    try {
      if (!this.paystackSecretKey) {
        throw new Error('Paystack secret key not configured');
      }

      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.paystackSecretKey}`
        }
      });

      const data = await response.json();
      
      if (data.status && data.data.status === 'success') {
        return {
          success: true,
          amount: data.data.amount / 100, // Convert from kobo
          currency: data.data.currency,
          reference: data.data.reference,
          customer: data.data.customer,
          paidAt: data.data.paid_at
        };
      } else {
        return { success: false, error: 'Payment verification failed' };
      }
    } catch (error) {
      console.error('Paystack verification error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Initialize payment with Flutterwave
   */
  async initializeFlutterwavePayment({ email, amount, reference, metadata = {}, paymentMethod = 'card' }) {
    try {
      if (!this.flutterwaveSecretKey) {
        throw new Error('Flutterwave secret key not configured');
      }

      const paymentData = {
        tx_ref: reference,
        amount,
        currency: 'NGN',
        redirect_url: `${process.env.APP_URL}/payment/callback`,
        customer: {
          email,
          ...metadata
        },
        customizations: {
          title: 'Resconate Payment',
          description: 'Subscription payment'
        }
      };

      // Add payment method specific configuration
      if (paymentMethod === 'bank_transfer') {
        paymentData.payment_options = 'banktransfer';
      } else if (paymentMethod === 'ussd') {
        paymentData.payment_options = 'ussd';
      } else {
        paymentData.payment_options = 'card,ussd,banktransfer,account';
      }

      const response = await fetch('https://api.flutterwave.com/v3/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.flutterwaveSecretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        return {
          success: true,
          paymentLink: data.data.link,
          reference: reference,
          paymentMethod: paymentMethod
        };
      } else {
        throw new Error(data.message || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('Flutterwave initialization error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Initialize USSD payment with Flutterwave
   */
  async initializeFlutterwaveUSSD({ email, amount, reference, metadata = {}, bankCode }) {
    try {
      if (!this.flutterwaveSecretKey) {
        throw new Error('Flutterwave secret key not configured');
      }

      if (!bankCode) {
        throw new Error('Bank code is required for USSD payment');
      }

      const response = await fetch('https://api.flutterwave.com/v3/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.flutterwaveSecretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tx_ref: reference,
          amount,
          currency: 'NGN',
          redirect_url: `${process.env.APP_URL}/payment/callback`,
          customer: {
            email,
            ...metadata
          },
          payment_options: 'ussd',
          ussd: {
            type: 'ussd',
            order_ref: reference,
            account_number: metadata.accountNumber || null
          }
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        return {
          success: true,
          paymentLink: data.data.link,
          reference: reference,
          ussdCode: data.data.ussd_code || null,
          displayText: data.data.display_text || null
        };
      } else {
        throw new Error(data.message || 'USSD payment initialization failed');
      }
    } catch (error) {
      console.error('Flutterwave USSD initialization error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Initialize Bank Transfer payment with Flutterwave
   */
  async initializeFlutterwaveBankTransfer({ email, amount, reference, metadata = {} }) {
    try {
      if (!this.flutterwaveSecretKey) {
        throw new Error('Flutterwave secret key not configured');
      }

      const response = await fetch('https://api.flutterwave.com/v3/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.flutterwaveSecretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tx_ref: reference,
          amount,
          currency: 'NGN',
          redirect_url: `${process.env.APP_URL}/payment/callback`,
          customer: {
            email,
            ...metadata
          },
          payment_options: 'banktransfer'
        })
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        return {
          success: true,
          paymentLink: data.data.link,
          reference: reference,
          accountDetails: data.data.account_details || null
        };
      } else {
        throw new Error(data.message || 'Bank transfer initialization failed');
      }
    } catch (error) {
      console.error('Flutterwave Bank Transfer initialization error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify Flutterwave payment
   */
  async verifyFlutterwavePayment(transactionId) {
    try {
      if (!this.flutterwaveSecretKey) {
        throw new Error('Flutterwave secret key not configured');
      }

      const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.flutterwaveSecretKey}`
        }
      });

      const data = await response.json();
      
      if (data.status === 'success' && data.data.status === 'successful') {
        return {
          success: true,
          amount: data.data.amount,
          currency: data.data.currency,
          reference: data.data.tx_ref,
          customer: data.data.customer,
          paidAt: data.data.created_at
        };
      } else {
        return { success: false, error: 'Payment verification failed' };
      }
    } catch (error) {
      console.error('Flutterwave verification error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process payment (uses default provider)
   */
  async processPayment({ email, amount, reference, metadata = {}, paymentMethod = 'card' }) {
    if (this.defaultProvider === 'paystack') {
      if (paymentMethod === 'ussd') {
        return this.initializePaystackUSSD({ email, amount, reference, metadata, bankCode: metadata.bankCode });
      } else if (paymentMethod === 'bank_transfer') {
        return this.initializePaystackBankTransfer({ email, amount, reference, metadata });
      } else {
        return this.initializePaystackPayment({ email, amount, reference, metadata, paymentMethod });
      }
    } else if (this.defaultProvider === 'flutterwave') {
      if (paymentMethod === 'ussd') {
        return this.initializeFlutterwaveUSSD({ email, amount, reference, metadata, bankCode: metadata.bankCode });
      } else if (paymentMethod === 'bank_transfer') {
        return this.initializeFlutterwaveBankTransfer({ email, amount, reference, metadata });
      } else {
        return this.initializeFlutterwavePayment({ email, amount, reference, metadata, paymentMethod });
      }
    } else {
      return { success: false, error: 'No payment provider configured' };
    }
  }

  /**
   * Verify payment (uses default provider)
   */
  async verifyPayment(reference) {
    if (this.defaultProvider === 'paystack') {
      return this.verifyPaystackPayment(reference);
    } else if (this.defaultProvider === 'flutterwave') {
      return this.verifyFlutterwavePayment(reference);
    } else {
      return { success: false, error: 'No payment provider configured' };
    }
  }

  /**
   * Handle webhook from payment provider
   */
  async handleWebhook(provider, payload, signature) {
    try {
      if (provider === 'paystack') {
        // Verify Paystack webhook signature
        const crypto = require('crypto');
        const hash = crypto.createHmac('sha512', this.paystackSecretKey)
          .update(JSON.stringify(payload))
          .digest('hex');
        
        if (hash !== signature) {
          return { success: false, error: 'Invalid signature' };
        }

        // Process webhook
        if (payload.event === 'charge.success') {
          return {
            success: true,
            reference: payload.data.reference,
            status: 'success',
            amount: payload.data.amount / 100
          };
        }
      } else if (provider === 'flutterwave') {
        // Verify Flutterwave webhook
        if (payload.status === 'successful') {
          return {
            success: true,
            reference: payload.tx_ref,
            status: 'success',
            amount: payload.amount
          };
        }
      }

      return { success: false, error: 'Unknown webhook event' };
    } catch (error) {
      console.error('Webhook handling error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new PaymentGatewayService();

