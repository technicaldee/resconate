const permissionService = require('../../../lib/permissions');

/**
 * Middleware to check if admin has permission for a feature
 */
const checkPermission = (permission = 'view') => {
  return async (req, res, next) => {
    try {
      const adminId = req.admin?.id;
      if (!adminId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Super admin bypasses all permission checks
      const isSuperAdmin = await permissionService.isSuperAdmin(adminId);
      if (isSuperAdmin) {
        return next();
      }

      // Get dashboard ID and feature key from request
      const dashboardId = req.query.dashboard_id || req.body.dashboard_id || req.params.dashboard_id;
      const featureKey = req.query.feature_key || req.body.feature_key || req.params.feature_key;

      if (!dashboardId || !featureKey) {
        // If no specific feature check, just check if admin is authenticated
        return next();
      }

      const hasPermission = await permissionService.hasFeaturePermission(
        adminId,
        parseInt(dashboardId),
        featureKey,
        permission
      );

      if (!hasPermission) {
        return res.status(403).json({ error: 'Permission denied' });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};

/**
 * Middleware to check dashboard access
 */
const checkDashboardAccess = async (req, res, next) => {
  try {
    const adminId = req.admin?.id;
    if (!adminId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Super admin bypasses all checks
    const isSuperAdmin = await permissionService.isSuperAdmin(adminId);
    if (isSuperAdmin) {
      return next();
    }

    const dashboardId = req.query.dashboard_id || req.body.dashboard_id || req.params.dashboard_id || req.params.id;
    const dashboardSlug = req.query.dashboard_slug || req.params.slug;

    if (dashboardId) {
      const hasAccess = await permissionService.hasDashboardAccess(adminId, parseInt(dashboardId));
      if (!hasAccess) {
        return res.status(403).json({ error: 'Dashboard access denied' });
      }
    } else if (dashboardSlug) {
      const hasAccess = await permissionService.hasDashboardAccessBySlug(adminId, dashboardSlug);
      if (!hasAccess) {
        return res.status(403).json({ error: 'Dashboard access denied' });
      }
    }

    next();
  } catch (error) {
    console.error('Dashboard access check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  checkPermission,
  checkDashboardAccess
};

