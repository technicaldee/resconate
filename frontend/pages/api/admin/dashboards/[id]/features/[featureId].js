const { pool } = require('../../../../../../lib/database');
const { authenticateAdmin } = require('../../../../../../lib/auth');
const permissionService = require('../../../../../../lib/permissions');

async function handler(req, res) {
  const { id, featureId } = req.query;

  if (req.method === 'DELETE') {
    return authenticateAdmin(req, res, async () => {
      try {
        // Only super admin can delete features
        const isSuperAdmin = await permissionService.isSuperAdmin(req.admin.id);
        if (!isSuperAdmin) {
          return res.status(403).json({ error: 'Only super admin can delete features' });
        }

        const result = await pool.query(
          'DELETE FROM dashboard_features WHERE id = $1 AND dashboard_id = $2 RETURNING *',
          [featureId, id]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Feature not found' });
        }

        res.json({ success: true, message: 'Feature deleted successfully' });
      } catch (e) {
        console.error('Error deleting feature:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

