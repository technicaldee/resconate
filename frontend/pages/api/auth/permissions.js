const { authenticateAdmin } = require('../../../lib/auth');
const permissionService = require('../../../lib/permissions');

async function handler(req, res) {
  if (req.method === 'GET') {
    return authenticateAdmin(req, res, async () => {
      try {
        const permissions = await permissionService.getAdminPermissions(req.admin.id);
        res.json({ success: true, data: permissions });
      } catch (e) {
        console.error('Error fetching permissions:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

