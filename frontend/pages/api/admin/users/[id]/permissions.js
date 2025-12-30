const { pool } = require('../../../../../lib/database');
const { authenticateAdmin } = require('../../../../../lib/auth');
const permissionService = require('../../../../../lib/permissions');

async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    return authenticateAdmin(req, res, async () => {
      try {
        const isSuperAdmin = await permissionService.isSuperAdmin(req.admin.id);
        if (!isSuperAdmin) {
          return res.status(403).json({ error: 'Only super admin can view permissions' });
        }

        const permissions = await permissionService.getAdminPermissions(parseInt(id));
        res.json({ success: true, data: permissions });
      } catch (e) {
        console.error('Error fetching permissions:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else if (req.method === 'PUT') {
    return authenticateAdmin(req, res, async () => {
      try {
        const isSuperAdmin = await permissionService.isSuperAdmin(req.admin.id);
        if (!isSuperAdmin) {
          return res.status(403).json({ error: 'Only super admin can update permissions' });
        }

        const { dashboard_ids, feature_permissions } = req.body;

        // Update dashboard access
        if (dashboard_ids !== undefined) {
          // Get current dashboards
          const currentDashboards = await permissionService.getAccessibleDashboards(parseInt(id));
          const currentDashboardIds = currentDashboards.map(d => d.id);

          // Remove access to dashboards not in new list
          for (const currentId of currentDashboardIds) {
            if (!dashboard_ids.includes(currentId)) {
              await permissionService.revokeDashboardAccess(parseInt(id), currentId);
            }
          }

          // Add access to new dashboards
          for (const dashboardId of dashboard_ids) {
            await permissionService.grantDashboardAccess(parseInt(id), dashboardId, req.admin.id);
          }
        }

        // Update feature permissions
        if (feature_permissions && typeof feature_permissions === 'object') {
          for (const [dashboardId, features] of Object.entries(feature_permissions)) {
            for (const [featureId, permissions] of Object.entries(features)) {
              await permissionService.grantFeaturePermission(
                parseInt(id),
                parseInt(dashboardId),
                parseInt(featureId),
                permissions,
                req.admin.id
              );
            }
          }
        }

        const updatedPermissions = await permissionService.getAdminPermissions(parseInt(id));
        res.json({ success: true, data: updatedPermissions });
      } catch (e) {
        console.error('Error updating permissions:', e);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;

