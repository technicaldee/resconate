const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const xlsx = require('xlsx');
const { pool } = require('../database');
const whatsappService = require('../services/whatsappService');
const pdfService = require('../services/pdfService');
const payoutService = require('../services/payoutService');
const webhookService = require('../services/webhookService');

const upload = multer({ storage: multer.memoryStorage() });

const JWT_SECRET = process.env.JWT_SECRET || 'resconate-secret';

/**
 * @openapi
 * /api/hr/lite/signup:
 *   post:
 *     summary: Register a new micro-business for HR Lite
 */
router.post('/signup', async (req, res) => {
    const { business_name, owner_email, password, owner_phone, owner_name } = req.body;

    if (!business_name || !owner_email || !password) {
        return res.status(400).json({ error: 'Business name, email and password are required' });
    }

    try {
        const password_hash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO businesses (business_name, owner_email, owner_phone, owner_name, status, onboarding_step) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [business_name, owner_email, owner_phone || null, owner_name || null, 'onboarding', 1]
        );

        const business = result.rows[0];

        // Trigger WhatsApp Welcome
        if (business.owner_phone) {
            await whatsappService.sendWelcome(business);
        }

        const token = jwt.sign({ businessId: business.id, role: 'business_owner' }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            success: true,
            token,
            business: {
                id: business.id,
                business_name: business.business_name,
                owner_email: business.owner_email,
                onboarding_step: business.onboarding_step
            }
        });

    } catch (e) {
        if (e.code === '23505') {
            return res.status(400).json({ error: 'Email already registered' });
        }
        console.error('Signup error:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @openapi
 * /api/hr/lite/business/:id/onboarding:
 *   put:
 *     summary: Update onboarding details for a business
 */
router.put('/business/:id/onboarding', async (req, res) => {
    const { business_type, employee_count, payment_frequency, funding_source, plan, onboarding_step } = req.body;

    try {
        const result = await pool.query(
            'UPDATE businesses SET business_type=COALESCE($1, business_type), employee_count=COALESCE($2, employee_count), payment_frequency=COALESCE($3, payment_frequency), funding_source=COALESCE($4, funding_source), plan=COALESCE($5, plan), onboarding_step=COALESCE($6, onboarding_step), updated_at=CURRENT_TIMESTAMP WHERE id=$7 RETURNING *',
            [business_type, employee_count, payment_frequency, funding_source, plan, onboarding_step, req.params.id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Business not found' });

        res.json({ success: true, data: result.rows[0] });
    } catch (e) {
        console.error('Onboarding update error:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @openapi
 * /api/hr/lite/business/:id/generate-handbook:
 *   post:
 *     summary: Finalize onboarding and generate handbook
 */
router.post('/business/:id/generate-handbook', async (req, res) => {
    try {
        const bResult = await pool.query('SELECT * FROM businesses WHERE id=$1', [req.params.id]);
        if (bResult.rows.length === 0) return res.status(404).json({ error: 'Business not found' });

        const business = bResult.rows[0];

        // 1. Generate PDF
        const pdfResult = await pdfService.generateStaffHandbook(business);

        // 2. Update business status
        await pool.query('UPDATE businesses SET status=$1, onboarding_step=$2 WHERE id=$3', ['active', 7, business.id]);

        // 3. Trigger WhatsApp notification
        if (business.owner_phone) {
            await whatsappService.sendHandbookReady(business);
        }

        res.json({
            success: true,
            handbookUrl: pdfResult.url,
            message: 'Handbook generated and WhatsApp notification sent.'
        });

    } catch (e) {
        console.error('Handbook generation error:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @openapi
 * /api/hr/lite/test/whatsapp:
 *   post:
 *     summary: Test WhatsApp service manually
 */
router.post('/test/whatsapp', async (req, res) => {
    const { phone, type } = req.body;
    try {
        const mockBusiness = { business_name: 'Test Business', owner_phone: phone, owner_name: 'Test Owner' };
        let result;
        if (type === 'welcome') result = await whatsappService.sendWelcome(mockBusiness);
        else result = await whatsappService.sendHandbookReady(mockBusiness);

        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * @openapi
 * /api/hr/lite/recipients:
 *   get:
 *     summary: Get all recipients for a business
 */
router.get('/recipients', async (req, res) => {
    const businessId = req.query.business_id; // For simplicity, though usually from token
    try {
        const result = await pool.query('SELECT * FROM hr_lite_recipients WHERE business_id = $1 ORDER BY created_at DESC', [businessId]);
        res.json({ success: true, data: result.rows });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * @openapi
 * /api/hr/lite/recipients:
 *   post:
 *     summary: Add a new recipient
 */
router.post('/recipients', async (req, res) => {
    const { business_id, name, email, phone } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO hr_lite_recipients (business_id, name, email, phone, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [business_id, name, email, phone, 'active']
        );
        const recipient = result.rows[0];

        // Webhook Trigger
        webhookService.triggerEvent(business_id, 'recipient.created', recipient);

        res.json({ success: true, data: recipient });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * @openapi
 * /api/hr/lite/recipients/:id:
 *   delete:
 *     summary: Delete a recipient
 */
router.delete('/recipients/:id', async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM hr_lite_recipients WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length > 0) {
            webhookService.triggerEvent(result.rows[0].business_id, 'recipient.deleted', { id: req.params.id });
        }
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * @openapi
 * /api/hr/lite/rules:
 *   get:
 *     summary: Get all rules for a business
 */
router.get('/rules', async (req, res) => {
    const businessId = req.query.business_id;
    try {
        const result = await pool.query('SELECT * FROM hr_lite_rules WHERE business_id = $1 ORDER BY created_at DESC', [businessId]);
        res.json({ success: true, data: result.rows });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * @openapi
 * /api/hr/lite/rules:
 *   post:
 *     summary: Add a new rule
 */
router.post('/rules', async (req, res) => {
    const { business_id, rule_name, trigger_condition, action_type } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO hr_lite_rules (business_id, rule_name, trigger_condition, action_type) VALUES ($1, $2, $3, $4) RETURNING *',
            [business_id, rule_name, trigger_condition, action_type]
        );
        res.json({ success: true, data: result.rows[0] });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * @openapi
 * /api/hr/lite/rules/:id:
 *   delete:
 *     summary: Delete a rule
 */
router.delete('/rules/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM hr_lite_rules WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * @openapi
 * /api/hr/lite/business/:id/stats:
 *   get:
 *     summary: Get dashboard stats for a business
 */
router.get('/business/:id/stats', async (req, res) => {
    const businessId = req.params.id;
    try {
        const recipientsResult = await pool.query('SELECT count(*) FROM hr_lite_recipients WHERE business_id = $1', [businessId]);
        const rulesResult = await pool.query('SELECT count(*) FROM hr_lite_rules WHERE business_id = $1', [businessId]);

        res.json({
            success: true,
            data: {
                total_recipients: parseInt(recipientsResult.rows[0].count),
                active_rules: parseInt(rulesResult.rows[0].count),
                tax_remitted: '₦0.00', // Placeholder
                success_rate: '100%' // Placeholder
            }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * @openapi
 * /api/hr/lite/recipients/bulk:
 *   post:
 *     summary: Bulk import recipients from CSV/Excel
 */
router.post('/recipients/bulk', upload.single('file'), async (req, res) => {
    const { business_id } = req.body;
    if (!req.file || !business_id) return res.status(400).json({ error: 'File and business ID required' });

    try {
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            for (const row of data) {
                // Mapping: Expecting "Name", "Email", "Phone" columns
                const name = row.Name || row.name || row.NAME;
                const email = row.Email || row.email || row.EMAIL;
                const phone = row.Phone || row.phone || row.PHONE || row.WhatsApp || row.whatsapp;

                if (name) {
                    await client.query(
                        'INSERT INTO hr_lite_recipients (business_id, name, email, phone, status) VALUES ($1, $2, $3, $4, $5)',
                        [business_id, name, email || null, phone || null, 'active']
                    );
                }
            }
            await client.query('COMMIT');
            res.json({ success: true, count: data.length });
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    } catch (e) {
        console.error('Bulk upload error:', e);
        res.status(500).json({ error: 'Failed to process file' });
    }
});

/**
 * @openapi
 * /api/hr/lite/webhooks:
 *   get:
 *     summary: Get all webhooks for a business
 */
router.get('/webhooks', async (req, res) => {
    const businessId = req.query.business_id;
    try {
        const result = await pool.query('SELECT * FROM hr_lite_webhooks WHERE business_id = $1 ORDER BY created_at DESC', [businessId]);
        res.json({ success: true, data: result.rows });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * @openapi
 * /api/hr/lite/webhooks:
 *   post:
 *     summary: Create a new webhook
 */
router.post('/webhooks', async (req, res) => {
    const { business_id, endpoint_url, event_types } = req.body;
    try {
        const secret_key = 'sk_' + Math.random().toString(36).substring(7);
        const result = await pool.query(
            'INSERT INTO hr_lite_webhooks (business_id, endpoint_url, event_types, secret_key, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [business_id, endpoint_url, JSON.stringify(event_types || ['payout.completed']), secret_key, 'active']
        );
        res.json({ success: true, data: result.rows[0] });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * @openapi
 * /api/hr/lite/webhooks/:id:
 *   delete:
 *     summary: Delete a webhook
 */
router.delete('/webhooks/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM hr_lite_webhooks WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * @openapi
 * /api/hr/lite/payouts:
 *   get:
 *     summary: Get all payout history for a business
 */
router.get('/payouts', async (req, res) => {
    const businessId = req.query.business_id;
    try {
        const result = await pool.query(
            'SELECT p.*, r.name as recipient_name FROM hr_lite_payouts p JOIN hr_lite_recipients r ON p.recipient_id = r.id WHERE p.business_id = $1 ORDER BY p.created_at DESC',
            [businessId]
        );
        res.json({ success: true, data: result.rows });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/**
 * @openapi
 * /api/hr/lite/payouts/run:
 *   post:
 *     summary: Run a single payout
 */
router.post('/payouts/run', async (req, res) => {
    const { business_id, recipient_id, amount, reason } = req.body;
    try {
        // 1. Initiate with financial service (Paystack mockup)
        const payout = await payoutService.initiateTransfer(`RCP_${recipient_id}`, amount, reason);

        // 2. Log in database
        const result = await pool.query(
            'INSERT INTO hr_lite_payouts (business_id, recipient_id, amount, status, transfer_code, reason) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [business_id, recipient_id, amount, payout.status, payout.transfer_code, reason || 'Monthly Salary']
        );

        // Webhook Trigger
        webhookService.triggerEvent(business_id, 'payout.initiated', result.rows[0]);

        res.json({ success: true, data: result.rows[0] });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
