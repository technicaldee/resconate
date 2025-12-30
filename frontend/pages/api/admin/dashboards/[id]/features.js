const { pool } = require('../../../../../lib/database');
const { authenticateAdmin } = require('../../../../../lib/auth');
const permissionService = require('../../../../../lib/permissions');

async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    return authenticateAdmin(req, res, async () => {
      try {
        const adminId = req.admin.id;
        const features = await permissionService.getDashboardFeatures(adminId, parseInt(id));
        res.json({ success: true, data: features });
      } catch (e) {
        console.error('Error fetching features:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else if (req.method === 'POST') {
    return authenticateAdmin(req, res, async () => {
      try {
        // Only super admin can create features
        const isSuperAdmin = await permissionService.isSuperAdmin(req.admin.id);
        if (!isSuperAdmin) {
          return res.status(403).json({ error: 'Only super admin can create features' });
        }

        const {
          feature_key,
          feature_name,
          feature_description,
          component_path,
          icon,
          order_index
        } = req.body;

        if (!feature_key || !feature_name) {
          return res.status(400).json({ error: 'feature_key and feature_name are required' });
        }

        const result = await pool.query(
          `INSERT INTO dashboard_features 
           (dashboard_id, feature_key, feature_name, feature_description, component_path, icon, order_index)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING *`,
          [id, feature_key, feature_name, feature_description || null, component_path || null, icon || null, order_index || 0]
        );

        res.status(201).json({ success: true, data: result.rows[0] });
      } catch (e) {
        if (e.code === '23505') {
          return res.status(400).json({ error: 'Feature with this key already exists in this dashboard' });
        }
        console.error('Error creating feature:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

