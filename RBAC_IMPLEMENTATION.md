# RBAC (Role-Based Access Control) Implementation

## Overview
This document describes the comprehensive RBAC system implemented for the Resconate platform, allowing super admins to create custom dashboards, manage admin users, and assign granular permissions.

## Architecture

### Database Schema

1. **admin_dashboards** - Stores custom dashboard configurations
   - `id`, `name`, `slug`, `description`, `icon`, `layout_config`, `is_active`, `created_by`

2. **dashboard_features** - Features/modules within dashboards
   - `id`, `dashboard_id`, `feature_key`, `feature_name`, `component_path`, `icon`, `order_index`

3. **admin_dashboard_access** - Which admins can access which dashboards
   - `id`, `admin_id`, `dashboard_id`, `granted_by`, `granted_at`

4. **admin_feature_permissions** - Granular permissions for features
   - `id`, `admin_id`, `dashboard_id`, `feature_id`, `can_view`, `can_create`, `can_edit`, `can_delete`, `can_export`, `custom_permissions`

5. **admins** - Updated with `is_superadmin` flag
   - Super admin has access to everything and can manage all dashboards

### Permission System

#### Super Admin
- Has access to ALL dashboards and features
- Can create, edit, and delete dashboards
- Can create, edit, and delete admin users
- Can assign permissions to admin users
- Only user who can access RBAC Management page

#### Regular Admin
- Can only access dashboards explicitly assigned to them
- Can only see features they have permission to view
- Permissions are granular (view, create, edit, delete, export)
- Cannot modify other admins or dashboards

## Key Components

### Backend Services

1. **`lib/permissions.js`** - Core permission service
   - `isSuperAdmin(adminId)` - Check if admin is super admin
   - `hasDashboardAccess(adminId, dashboardId)` - Check dashboard access
   - `hasFeaturePermission(adminId, dashboardId, featureKey, permission)` - Check feature permission
   - `getAccessibleDashboards(adminId)` - Get all accessible dashboards
   - `getDashboardFeatures(adminId, dashboardId)` - Get features with permissions
   - `grantDashboardAccess()`, `revokeDashboardAccess()` - Manage access
   - `grantFeaturePermission()` - Manage feature permissions

2. **`lib/auth.js`** - Updated to include `is_superadmin` in JWT and responses

3. **`lib/database.js`** - Database schema for RBAC tables

### API Endpoints

1. **`/api/admin/dashboards`**
   - GET - List all accessible dashboards (filtered by permissions)
   - POST - Create dashboard (super admin only)

2. **`/api/admin/dashboards/[id]`**
   - GET - Get dashboard with features and permissions
   - PUT - Update dashboard (super admin only)
   - DELETE - Delete dashboard (super admin only)

3. **`/api/admin/dashboards/[id]/features`**
   - GET - Get features for dashboard
   - POST - Create feature (super admin only)

4. **`/api/admin/dashboards/[id]/features/[featureId]`**
   - DELETE - Delete feature (super admin only)

5. **`/api/admin/users`**
   - GET - List all admins (super admin only)
   - POST - Create admin user (super admin only)

6. **`/api/admin/users/[id]/permissions`**
   - GET - Get admin permissions
   - PUT - Update admin permissions (super admin only)

7. **`/api/auth/permissions`**
   - GET - Get current admin's permissions

### Frontend Components

1. **`pages/admin-rbac.js`** - RBAC Management page (super admin only)
   - Dashboard Management tab
   - Admin User Management tab

2. **`src/components/RBAC/DashboardManager.js`**
   - Create, edit, delete dashboards
   - Manage dashboard features

3. **`src/components/RBAC/FeatureManager.js`**
   - Add, remove features from dashboards
   - Configure feature properties

4. **`src/components/RBAC/AdminUserManager.js`**
   - Create admin users
   - Assign dashboard access
   - Configure feature permissions

5. **`pages/admin-dashboard/[slug].js`** - Dynamic custom dashboard page
   - Loads dashboard by slug
   - Renders features based on permissions

6. **`src/components/RBAC/DynamicDashboard.js`**
   - Renders custom dashboard
   - Shows only features user has access to
   - Respects permission levels (view, create, edit, delete, export)

7. **`pages/admin-dashboard.js`** - Updated main dashboard
   - Shows custom dashboards in navigation (if user has access)
   - Shows RBAC Management link (super admin only)
   - Links to custom dashboards

## Usage Guide

### For Super Admin

1. **Create a Dashboard**
   - Go to Admin Dashboard → RBAC Management
   - Click "Dashboards" tab
   - Click "Create Dashboard"
   - Fill in name, slug, description, icon
   - Save

2. **Add Features to Dashboard**
   - Click "Manage Features" on a dashboard
   - Click "Add Feature"
   - Configure feature (key, name, component path, icon, order)
   - Save

3. **Create Admin User**
   - Go to RBAC Management → Admin Users tab
   - Click "Create Admin"
   - Fill in username, email, password
   - Save

4. **Assign Permissions**
   - Click "Manage Permissions" on an admin user
   - Select dashboards to grant access
   - Configure feature permissions for each dashboard
   - Set view, create, edit, delete, export permissions
   - Save

### For Regular Admin

1. **Access Dashboards**
   - Log in to Admin Dashboard
   - See assigned dashboards in navigation
   - Click on dashboard to access
   - Only see features you have permission to view

2. **Using Features**
   - Permissions control what actions you can perform
   - View-only: Can see data but not modify
   - Create: Can add new records
   - Edit: Can modify existing records
   - Delete: Can remove records
   - Export: Can download data

## Permission Levels

- **view** - Can see the feature/data
- **create** - Can add new records
- **edit** - Can modify existing records
- **delete** - Can remove records
- **export** - Can download/export data

## Security

- All permission checks are server-side
- Middleware validates permissions on API routes
- Super admin bypasses all checks
- Regular admins only see what they're allowed to see
- Frontend hides UI elements based on permissions (UX), but backend enforces security

## Future Enhancements

1. **Dynamic Component Loading** - Load React components dynamically based on `component_path`
2. **Custom Permissions** - Support for custom permission types beyond CRUD
3. **Role Templates** - Pre-defined permission sets
4. **Audit Logging** - Track permission changes
5. **Permission Inheritance** - Hierarchy-based permissions
6. **Time-based Permissions** - Temporary access grants

---

*Last Updated: December 30, 2024*

