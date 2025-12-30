/**
 * RBAC Permission System
 * Handles role-based access control for admin dashboards and features
 */

const { pool } = require('./database');

class PermissionService {
  /**
   * Check if admin is super admin
   */
  async isSuperAdmin(adminId) {
    try {
      const result = await pool.query(
        'SELECT is_superadmin FROM admins WHERE id = $1',
        [adminId]
      );
      return result.rows[0]?.is_superadmin === true;
    } catch (error) {
      console.error('Error checking super admin:', error);
      return false;
    }
  }

  /**
   * Check if admin has access to a dashboard
   */
  async hasDashboardAccess(adminId, dashboardId) {
    try {
      // Super admin has access to all dashboards
      const isSuper = await this.isSuperAdmin(adminId);
      if (isSuper) return true;

      const result = await pool.query(
        `SELECT id FROM admin_dashboard_access 
         WHERE admin_id = $1 AND dashboard_id = $2`,
        [adminId, dashboardId]
      );
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking dashboard access:', error);
      return false;
    }
  }

  /**
   * Check if admin has access to a dashboard by slug
   */
  async hasDashboardAccessBySlug(adminId, dashboardSlug) {
    try {
      const isSuper = await this.isSuperAdmin(adminId);
      if (isSuper) return true;

      const result = await pool.query(
        `SELECT ada.id FROM admin_dashboard_access ada
         JOIN admin_dashboards ad ON ada.dashboard_id = ad.id
         WHERE ada.admin_id = $1 AND ad.slug = $2 AND ad.is_active = TRUE`,
        [adminId, dashboardSlug]
      );
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking dashboard access by slug:', error);
      return false;
    }
  }

  /**
   * Check if admin has permission for a feature
   */
  async hasFeaturePermission(adminId, dashboardId, featureKey, permission = 'view') {
    try {
      // Super admin has all permissions
      const isSuper = await this.isSuperAdmin(adminId);
      if (isSuper) return true;

      // Check dashboard access first
      const hasAccess = await this.hasDashboardAccess(adminId, dashboardId);
      if (!hasAccess) return false;

      // Check specific feature permission
      const permissionMap = {
        view: 'can_view',
        create: 'can_create',
        edit: 'can_edit',
        delete: 'can_delete',
        export: 'can_export'
      };

      const permissionField = permissionMap[permission] || 'can_view';

      const result = await pool.query(
        `SELECT afp.${permissionField} FROM admin_feature_permissions afp
         JOIN dashboard_features df ON afp.feature_id = df.id
         WHERE afp.admin_id = $1 
           AND afp.dashboard_id = $2 
           AND df.feature_key = $3
           AND df.is_active = TRUE`,
        [adminId, dashboardId, featureKey]
      );

      if (result.rows.length === 0) {
        // No specific permission set, check if they have dashboard access (default view only)
        return permission === 'view';
      }

      return result.rows[0][permissionField] === true;
    } catch (error) {
      console.error('Error checking feature permission:', error);
      return false;
    }
  }

  /**
   * Get all dashboards accessible to an admin
   */
  async getAccessibleDashboards(adminId) {
    try {
      const isSuper = await this.isSuperAdmin(adminId);
      
      let query;
      if (isSuper) {
        // Super admin sees all dashboards
        query = `
          SELECT ad.*, COUNT(df.id) as feature_count
          FROM admin_dashboards ad
          LEFT JOIN dashboard_features df ON ad.id = df.dashboard_id AND df.is_active = TRUE
          WHERE ad.is_active = TRUE
          GROUP BY ad.id
          ORDER BY ad.name ASC
        `;
        const result = await pool.query(query);
        return result.rows;
      } else {
        // Regular admin sees only assigned dashboards
        query = `
          SELECT ad.*, COUNT(df.id) as feature_count
          FROM admin_dashboards ad
          JOIN admin_dashboard_access ada ON ad.id = ada.dashboard_id
          LEFT JOIN dashboard_features df ON ad.id = df.dashboard_id AND df.is_active = TRUE
          WHERE ada.admin_id = $1 AND ad.is_active = TRUE
          GROUP BY ad.id
          ORDER BY ad.name ASC
        `;
        const result = await pool.query(query, [adminId]);
        return result.rows;
      }
    } catch (error) {
      console.error('Error getting accessible dashboards:', error);
      return [];
    }
  }

  /**
   * Get all features for a dashboard with admin permissions
   */
  async getDashboardFeatures(adminId, dashboardId) {
    try {
      const isSuper = await this.isSuperAdmin(adminId);
      const hasAccess = isSuper || await this.hasDashboardAccess(adminId, dashboardId);
      
      if (!hasAccess) return [];

      let query;
      if (isSuper) {
        // Super admin has all permissions
        query = `
          SELECT 
            df.*,
            '{"can_view": true, "can_create": true, "can_edit": true, "can_delete": true, "can_export": true}'::jsonb as permissions
          FROM dashboard_features df
          WHERE df.dashboard_id = $1 AND df.is_active = TRUE
          ORDER BY df.order_index ASC, df.feature_name ASC
        `;
        const result = await pool.query(query, [dashboardId]);
        return result.rows.map(row => ({
          ...row,
          permissions: JSON.parse(row.permissions)
        }));
      } else {
        // Regular admin gets their specific permissions
        query = `
          SELECT 
            df.*,
            COALESCE(
              jsonb_build_object(
                'can_view', COALESCE(afp.can_view, TRUE),
                'can_create', COALESCE(afp.can_create, FALSE),
                'can_edit', COALESCE(afp.can_edit, FALSE),
                'can_delete', COALESCE(afp.can_delete, FALSE),
                'can_export', COALESCE(afp.can_export, FALSE),
                'custom_permissions', COALESCE(afp.custom_permissions, '{}'::jsonb)
              ),
              '{"can_view": true, "can_create": false, "can_edit": false, "can_delete": false, "can_export": false}'::jsonb
            ) as permissions
          FROM dashboard_features df
          LEFT JOIN admin_feature_permissions afp ON df.id = afp.feature_id 
            AND afp.admin_id = $1 AND afp.dashboard_id = $2
          WHERE df.dashboard_id = $2 AND df.is_active = TRUE
          ORDER BY df.order_index ASC, df.feature_name ASC
        `;
        const result = await pool.query(query, [adminId, dashboardId]);
        return result.rows.map(row => ({
          ...row,
          permissions: typeof row.permissions === 'string' 
            ? JSON.parse(row.permissions) 
            : row.permissions
        }));
      }
    } catch (error) {
      console.error('Error getting dashboard features:', error);
      return [];
    }
  }

  /**
   * Grant dashboard access to an admin
   */
  async grantDashboardAccess(adminId, dashboardId, grantedBy) {
    try {
      await pool.query(
        `INSERT INTO admin_dashboard_access (admin_id, dashboard_id, granted_by)
         VALUES ($1, $2, $3)
         ON CONFLICT (admin_id, dashboard_id) DO NOTHING`,
        [adminId, dashboardId, grantedBy]
      );
      return { success: true };
    } catch (error) {
      console.error('Error granting dashboard access:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Revoke dashboard access from an admin
   */
  async revokeDashboardAccess(adminId, dashboardId) {
    try {
      await pool.query(
        `DELETE FROM admin_dashboard_access 
         WHERE admin_id = $1 AND dashboard_id = $2`,
        [adminId, dashboardId]
      );
      return { success: true };
    } catch (error) {
      console.error('Error revoking dashboard access:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Grant feature permissions to an admin
   */
  async grantFeaturePermission(adminId, dashboardId, featureId, permissions, grantedBy) {
    try {
      const {
        can_view = true,
        can_create = false,
        can_edit = false,
        can_delete = false,
        can_export = false,
        custom_permissions = {}
      } = permissions;

      await pool.query(
        `INSERT INTO admin_feature_permissions 
         (admin_id, dashboard_id, feature_id, can_view, can_create, can_edit, can_delete, can_export, custom_permissions, granted_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (admin_id, dashboard_id, feature_id) 
         DO UPDATE SET 
           can_view = EXCLUDED.can_view,
           can_create = EXCLUDED.can_create,
           can_edit = EXCLUDED.can_edit,
           can_delete = EXCLUDED.can_delete,
           can_export = EXCLUDED.can_export,
           custom_permissions = EXCLUDED.custom_permissions`,
        [adminId, dashboardId, featureId, can_view, can_create, can_edit, can_delete, can_export, JSON.stringify(custom_permissions), grantedBy]
      );
      return { success: true };
    } catch (error) {
      console.error('Error granting feature permission:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get admin's full permission set
   */
  async getAdminPermissions(adminId) {
    try {
      const isSuper = await this.isSuperAdmin(adminId);
      
      const dashboards = await this.getAccessibleDashboards(adminId);
      const permissions = {};

      for (const dashboard of dashboards) {
        const features = await this.getDashboardFeatures(adminId, dashboard.id);
        permissions[dashboard.id] = {
          dashboard: dashboard,
          features: features
        };
      }

      return {
        isSuperAdmin: isSuper,
        dashboards: dashboards,
        permissions: permissions
      };
    } catch (error) {
      console.error('Error getting admin permissions:', error);
      return {
        isSuperAdmin: false,
        dashboards: [],
        permissions: {}
      };
    }
  }
}

module.exports = new PermissionService();

