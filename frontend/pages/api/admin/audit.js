const { pool } = require('../../../lib/database');
const { authenticateAdmin } = require('../../../lib/auth');
const auditService = require('../../../lib/audit');

async function handler(req, res) {
  if (req.method === 'GET') {
    return authenticateAdmin(req, res, async () => {
      try {
        const { userId, userType, resourceType, limit = 100, offset = 0 } = req.query;
        
        const result = await auditService.getLogs({
          userId: userId ? parseInt(userId) : null,
          userType,
          resourceType,
          limit: parseInt(limit),
          offset: parseInt(offset)
        });

        if (result.success) {
          res.json({ success: true, data: result.data });
        } else {
          res.status(500).json({ error: result.error });
        }
      } catch (e) {
        console.error('Error fetching audit logs:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

