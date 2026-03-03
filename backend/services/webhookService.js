const axios = require('axios');
const crypto = require('crypto');
const { pool } = require('../database');

/**
 * Webhook Service handles the dispatching of events to external systems.
 * It ensures data integrity via HMAC signing.
 */
class WebhookService {
    /**
     * Trigger a specific event for a business
     */
    async triggerEvent(businessId, eventType, payload) {
        try {
            // 1. Fetch active webhooks for this business that are subscribed to this event
            const result = await pool.query(
                'SELECT * FROM hr_lite_webhooks WHERE business_id = $1 AND status = $2',
                [businessId, 'active']
            );

            const webhooks = result.rows;

            for (const webhook of webhooks) {
                // Filter by event type if configured (event_types is JSONB)
                const subscribedEvents = webhook.event_types || [];
                if (subscribedEvents.length > 0 && !subscribedEvents.includes(eventType) && !subscribedEvents.includes('*')) {
                    continue;
                }

                this.dispatch(webhook, eventType, payload);
            }
        } catch (e) {
            console.error('Webhook trigger error:', e);
        }
    }

    /**
     * Internal: Dispatch the actual POST request
     */
    async dispatch(webhook, eventType, payload) {
        const timestamp = Date.now();
        const data = JSON.stringify({
            event: eventType,
            timestamp,
            data: payload
        });

        // Generate HMAC signature for security
        const signature = crypto
            .createHmac('sha256', webhook.secret_key || 'resconate-fallback-secret')
            .update(data)
            .digest('hex');

        try {
            console.log(`[WEBHOOK] Dispatching ${eventType} to ${webhook.endpoint_url}`);
            await axios.post(webhook.endpoint_url, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Resconate-Signature': signature,
                    'X-Resconate-Timestamp': timestamp
                },
                timeout: 5000 // 5 second timeout
            });
        } catch (e) {
            console.error(`[WEBHOOK] Failed to dispatch to ${webhook.endpoint_url}:`, e.message);
            // In a real scenario, we'd log this in a 'webhook_logs' table for retries
        }
    }
}

module.exports = new WebhookService();
