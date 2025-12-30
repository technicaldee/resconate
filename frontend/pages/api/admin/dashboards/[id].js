const { pool } = require('../../../../lib/database');
const { authenticateAdmin } = require('../../../../lib/auth');
const permissionService = require('../../../../lib/permissions');

async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    return authenticateAdmin(req, res, async () => {
      try {
        const adminId = req.admin.id;
        
        // Check if admin has access to this dashboard
        const hasAccess = await permissionService.hasDashboardAccess(adminId, parseInt(id));
        if (!hasAccess) {
          return res.status(403).json({ error: 'Access denied to this dashboard' });
        }

        const dashboardResult = await pool.query(
          'SELECT * FROM admin_dashboards WHERE id = $1',
          [id]
        );

        if (dashboardResult.rows.length === 0) {
          return res.status(404).json({ error: 'Dashboard not found' });
        }

        const features = await permissionService.getDashboardFeatures(adminId, parseInt(id));

        res.json({
          success: true,
          data: {
            ...dashboardResult.rows[0],
            features: features
          }
        });
      } catch (e) {
        console.error('Error fetching dashboard:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else if (req.method === 'PUT') {
    return authenticateAdmin(req, res, async () => {
      try {
        // Only super admin can update dashboards
        const isSuperAdmin = await permissionService.isSuperAdmin(req.admin.id);
        if (!isSuperAdmin) {
          return res.status(403).json({ error: 'Only super admin can update dashboards' });
        }

        const { name, slug, description, icon, layout_config, is_active } = req.body;

        const result = await pool.query(
          `UPDATE admin_dashboards 
           SET name = COALESCE($1, name),
               slug = COALESCE($2, slug),
               description = COALESCE($3, description),
               icon = COALESCE($4, icon),
               layout_config = COALESCE($5, layout_config),
               is_active = COALESCE($6, is_active),
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $7
           RETURNING *`,
          [name, slug, description, icon, layout_config, is_active, id]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Dashboard not found' });
        }

        res.json({ success: true, data: result.rows[0] });
      } catch (e) {
        if (e.code === '23505') {
          return res.status(400).json({ error: 'Dashboard with this slug already exists' });
        }
        console.error('Error updating dashboard:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else if (req.method === 'DELETE') {
    return authenticateAdmin(req, res, async () => {
      try {
        // Only super admin can delete dashboards
        const isSuperAdmin = await permissionService.isSuperAdmin(req.admin.id);
        if (!isSuperAdmin) {
          return res.status(403).json({ error: 'Only super admin can delete dashboards' });
        }

        const result = await pool.query(
          'DELETE FROM admin_dashboards WHERE id = $1 RETURNING *',
          [id]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Dashboard not found' });
        }

        res.json({ success: true, message: 'Dashboard deleted successfully' });
      } catch (e) {
        console.error('Error deleting dashboard:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

