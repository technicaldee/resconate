const { pool } = require('../../../lib/database');
const { authenticateAdmin } = require('../../../lib/auth');
const permissionService = require('../../../lib/permissions');
const bcrypt = require('bcryptjs');

async function handler(req, res) {
  if (req.method === 'GET') {
    return authenticateAdmin(req, res, async () => {
      try {
        const isSuperAdmin = await permissionService.isSuperAdmin(req.admin.id);
        if (!isSuperAdmin) {
          return res.status(403).json({ error: 'Only super admin can view all admins' });
        }

        const result = await pool.query(
          `SELECT 
             id, username, email, role, is_superadmin, created_at, updated_at,
             (SELECT COUNT(*) FROM admin_dashboard_access WHERE admin_id = admins.id) as dashboard_count
           FROM admins
           ORDER BY created_at DESC`
        );

        // Get dashboard access for each admin
        const adminsWithPermissions = await Promise.all(
          result.rows.map(async (admin) => {
            const dashboards = await permissionService.getAccessibleDashboards(admin.id);
            return {
              ...admin,
              dashboards: dashboards
            };
          })
        );

        res.json({ success: true, data: adminsWithPermissions });
      } catch (e) {
        console.error('Error fetching admins:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else if (req.method === 'POST') {
    return authenticateAdmin(req, res, async () => {
      try {
        // Only super admin can create admins
        const isSuperAdmin = await permissionService.isSuperAdmin(req.admin.id);
        if (!isSuperAdmin) {
          return res.status(403).json({ error: 'Only super admin can create admins' });
        }

        const { username, email, password, role, is_superadmin, dashboard_ids, feature_permissions } = req.body;

        if (!username || !email || !password) {
          return res.status(400).json({ error: 'username, email, and password are required' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create admin (can't create another super admin)
        const adminResult = await pool.query(
          `INSERT INTO admins (username, email, password_hash, role, is_superadmin)
           VALUES ($1, $2, $3, $4, FALSE)
           RETURNING id, username, email, role, is_superadmin, created_at`,
          [username, email, passwordHash, role || 'admin']
        );

        const newAdmin = adminResult.rows[0];

        // Grant dashboard access if specified
        if (dashboard_ids && Array.isArray(dashboard_ids) && dashboard_ids.length > 0) {
          for (const dashboardId of dashboard_ids) {
            await permissionService.grantDashboardAccess(newAdmin.id, dashboardId, req.admin.id);
          }
        }

        // Grant feature permissions if specified
        if (feature_permissions && typeof feature_permissions === 'object') {
          for (const [dashboardId, features] of Object.entries(feature_permissions)) {
            for (const [featureId, permissions] of Object.entries(features)) {
              await permissionService.grantFeaturePermission(
                newAdmin.id,
                parseInt(dashboardId),
                parseInt(featureId),
                permissions,
                req.admin.id
              );
            }
          }
        }

        res.status(201).json({ success: true, data: newAdmin });
      } catch (e) {
        if (e.code === '23505') {
          return res.status(400).json({ error: 'Username or email already exists' });
        }
        console.error('Error creating admin:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

