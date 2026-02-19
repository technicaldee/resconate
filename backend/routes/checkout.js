const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const router = express.Router();
const multer = require('multer');
const whatsappService = require('../lib/whatsappService');

// prepare upload directory into frontend public so the file is accessible
const uploadsDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`)
});
const upload = multer({ storage });

// Create a payment intent (Stripe if configured, otherwise a mock response)
router.post('/create-payment-intent', async (req, res) => {
  const { amount, currency = 'ngn', name, email, plan } = req.body;
  try {
    if (process.env.STRIPE_SECRET) {
      const Stripe = require('stripe');
      const stripe = Stripe(process.env.STRIPE_SECRET);
      const numeric = Math.round((Number(String(amount).replace(/[^0-9.-]+/g, '')) || 0) * 100);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: numeric,
        currency,
        metadata: { name: name || '', email: email || '', plan: plan || '' }
      });
      return res.json({ clientSecret: paymentIntent.client_secret });
    }

    // Mock client secret for environments without Stripe configured
    const clientSecret = `pi_mock_${crypto.randomBytes(8).toString('hex')}`;
    return res.json({ clientSecret, mock: true });
  } catch (e) {
    console.error('create-payment-intent error:', e);
    return res.status(500).json({ error: 'Could not create payment intent' });
  }
});

// Transfer instructions: returns bank details and a reference
router.post('/transfer', async (req, res) => {
  const { amount, name, email, plan } = req.body;
  try {
    const reference = `TRF-${Date.now()}`;
    const bankDetails = {
      bank: process.env.BANK_NAME || 'Resconate Bank',
      account_number: process.env.BANK_ACCOUNT || '0123456789',
      account_name: process.env.BANK_ACCOUNT_NAME || 'Resconate Ltd',
      reference
    };

    // Persist a simple record locally for operator reconciliation (best-effort)
    try {
      const storagePath = path.join(__dirname, '..', 'payments.json');
      let payments = [];
      if (fs.existsSync(storagePath)) {
        payments = JSON.parse(fs.readFileSync(storagePath));
      }
      payments.push({ id: reference, amount, name, email, plan, method: 'transfer', created_at: new Date() });
      fs.writeFileSync(storagePath, JSON.stringify(payments, null, 2));
    } catch (e) {
      console.warn('Could not persist transfer record:', e);
    }

    return res.json({ success: true, bankDetails });
  } catch (e) {
    console.error('transfer error:', e);
    return res.status(500).json({ error: 'Could not create transfer instructions' });
  }
});

// Initialize a Flutterwave payment and return the payment link
router.post('/flutterwave/init', async (req, res) => {
  const { amount, currency = 'NGN', name, email, plan } = req.body;
  try {
    if (!process.env.FLW_SECRET_KEY) {
      return res.status(400).json({ error: 'FLW_SECRET_KEY not configured on server' });
    }

    const tx_ref = `flw_${Date.now()}`;
    const payload = {
      tx_ref,
      amount: String(amount).replace(/[^0-9.]/g, '') || '0',
      currency: currency || 'NGN',
      redirect_url: `${process.env.BACKEND_URL || ''}/api/checkout/flutterwave-callback`,
      customer: { email: email || '', name: name || '' },
      meta: { plan: plan || '' }
    };

    const fetch = require('node-fetch');
    const resp = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.FLW_SECRET_KEY}` },
      body: JSON.stringify(payload)
    });
    const data = await resp.json();
    if (!resp.ok) {
      console.error('Flutterwave init error', data);
      return res.status(500).json({ error: 'Could not initialize Flutterwave payment', details: data });
    }

    // Return the payment link to redirect the user
    return res.json({ link: data.data && data.data.link, data });
  } catch (e) {
    console.error('flutterwave init error:', e);
    return res.status(500).json({ error: 'Flutterwave initialization failed' });
  }
});

// Callback endpoint that Flutterwave will hit after payment
router.get('/flutterwave-callback', async (req, res) => {
  // Flutterwave will redirect users to this URL after payment completion.
  // You should verify the transaction server-side using the transaction id or tx_ref.
  // For now, show a simple message and log the query.
  console.log('Flutterwave callback query:', req.query);
  res.send('<html><body><h2>Payment processed — thank you. You can close this window.</h2></body></html>');
});

// Verify a Flutterwave transaction by transaction id
router.get('/flutterwave/verify/:id', async (req, res) => {
  const id = req.params.id;
  try {
    if (!process.env.FLW_SECRET_KEY) return res.status(400).json({ error: 'FLW_SECRET_KEY not configured' });
    const fetch = require('node-fetch');
    const resp = await fetch(`https://api.flutterwave.com/v3/transactions/${encodeURIComponent(id)}/verify`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}` }
    });
    const data = await resp.json();
    return res.json(data);
  } catch (e) {
    console.error('flutterwave verify error:', e);
    return res.status(500).json({ error: 'Verification failed' });
  }
});

// Upload transfer receipt and notify via WhatsApp
router.post('/transfer/upload', upload.single('receipt'), async (req, res) => {
  try {
    const { name, email, comment, amount, plan } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'Receipt file is required' });

    // Build publicly accessible URL for the uploaded file
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
    const fileUrl = `${backendUrl}/uploads/${file.filename}`;

    // Message to send to support WhatsApp number
    const supportNumber = process.env.SUPPORT_WHATSAPP_NUMBER || '08066023759';
    const message = `New transfer receipt uploaded\nName: ${name || 'N/A'}\nEmail: ${email || 'N/A'}\nPlan: ${plan || 'N/A'}\nAmount: ${amount || 'N/A'}\nComment: ${comment || ''}\nReceipt: ${fileUrl}`;

    // Attempt to send via configured WhatsApp provider (Twilio or WhatsApp Business)
    const result = await whatsappService.sendMessage(supportNumber, message, fileUrl);

    // Persist a lightweight record
    try {
      const storagePath = path.join(__dirname, '..', 'payments.json');
      let payments = [];
      if (fs.existsSync(storagePath)) payments = JSON.parse(fs.readFileSync(storagePath));
      payments.push({ id: `TRF-UP-${Date.now()}`, amount, name, email, plan, method: 'transfer_upload', file: file.filename, created_at: new Date(), whatsappResult: result });
      fs.writeFileSync(storagePath, JSON.stringify(payments, null, 2));
    } catch (e) {
      console.warn('Could not persist transfer upload record:', e);
    }

    return res.json({ success: true, message: 'Receipt uploaded and sent to support via WhatsApp', result });
  } catch (e) {
    console.error('transfer upload error:', e);
    return res.status(500).json({ error: 'Could not upload receipt' });
  }
});

module.exports = router;
