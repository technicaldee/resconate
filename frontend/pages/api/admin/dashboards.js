const { pool } = require('../../../lib/database');
const { authenticateAdmin } = require('../../../lib/auth');
const permissionService = require('../../../lib/permissions');

async function handler(req, res) {
  if (req.method === 'GET') {
    return authenticateAdmin(req, res, async () => {
      try {
        const adminId = req.admin.id;
        const dashboards = await permissionService.getAccessibleDashboards(adminId);
        res.json({ success: true, data: dashboards });
      } catch (e) {
        console.error('Error fetching dashboards:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else if (req.method === 'POST') {
    return authenticateAdmin(req, res, async () => {
      try {
        // Only super admin can create dashboards
        const isSuperAdmin = await permissionService.isSuperAdmin(req.admin.id);
        if (!isSuperAdmin) {
          return res.status(403).json({ error: 'Only super admin can create dashboards' });
        }

        const { name, slug, description, icon, layout_config } = req.body;

        if (!name || !slug) {
          return res.status(400).json({ error: 'name and slug are required' });
        }

        // Validate slug format
        const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        if (!slugRegex.test(slug)) {
          return res.status(400).json({ error: 'slug must be lowercase alphanumeric with hyphens' });
        }

        const result = await pool.query(
          `INSERT INTO admin_dashboards (name, slug, description, icon, layout_config, created_by)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [name, slug, description || null, icon || null, layout_config || {}, req.admin.id]
        );

        res.status(201).json({ success: true, data: result.rows[0] });
      } catch (e) {
        if (e.code === '23505') { // Unique violation
          return res.status(400).json({ error: 'Dashboard with this slug already exists' });
        }
        console.error('Error creating dashboard:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

