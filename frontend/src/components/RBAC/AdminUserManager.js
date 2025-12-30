import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

const AdminUserManager = () => {
  const [admins, setAdmins] = useState([]);
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin'
  });
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [adminsRes, dashboardsRes] = await Promise.all([
        apiFetch('/api/admin/users'),
        apiFetch('/api/admin/dashboards')
      ]);

      const adminsData = await adminsRes.json();
      const dashboardsData = await dashboardsRes.json();

      if (adminsData.success) setAdmins(adminsData.data);
      if (dashboardsData.success) setDashboards(dashboardsData.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiFetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        await loadData();
        setShowModal(false);
        setFormData({ username: '', email: '', password: '', role: 'admin' });
      } else {
        alert(data.error || 'Error creating admin');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      alert('Error creating admin');
    } finally {
      setLoading(false);
    }
  };

  const handleManagePermissions = async (admin) => {
    setSelectedAdmin(admin);
    
    // Load current permissions
    try {
      const response = await apiFetch(`/api/admin/users/${admin.id}/permissions`);
      const data = await response.json();
      if (data.success) {
        // Build permissions structure
        const perms = {};
        const currentDashboardIds = data.data.dashboards.map(d => d.id);
        
        // Initialize with current dashboard access
        currentDashboardIds.forEach(dashboardId => {
          perms[dashboardId] = {};
          const dashboard = data.data.dashboards.find(d => d.id === dashboardId);
          if (dashboard && dashboard.features) {
            dashboard.features.forEach(feature => {
              perms[dashboardId][feature.id] = {
                can_view: feature.permissions?.can_view || false,
                can_create: feature.permissions?.can_create || false,
                can_edit: feature.permissions?.can_edit || false,
                can_delete: feature.permissions?.can_delete || false,
                can_export: feature.permissions?.can_export || false
              };
            });
          }
        });

        // Add all available dashboards
        dashboards.forEach(dashboard => {
          if (!perms[dashboard.id]) {
            perms[dashboard.id] = {};
          }
        });

        setPermissions(perms);
        setShowPermissionsModal(true);
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
      alert('Error loading permissions');
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedAdmin) return;

    setLoading(true);
    try {
      // Get selected dashboard IDs
      const dashboardIds = Object.keys(permissions).filter(id => {
        const dashboard = dashboards.find(d => d.id === parseInt(id));
        return dashboard && permissions[id]._selected; // Using _selected flag
      }).map(id => parseInt(id));

      // Build feature_permissions object
      const featurePermissions = {};
      Object.keys(permissions).forEach(dashboardId => {
        if (dashboardIds.includes(parseInt(dashboardId))) {
          featurePermissions[dashboardId] = {};
          Object.keys(permissions[dashboardId]).forEach(featureId => {
            if (featureId !== '_selected') {
              featurePermissions[dashboardId][featureId] = permissions[dashboardId][featureId];
            }
          });
        }
      });

      const response = await apiFetch(`/api/admin/users/${selectedAdmin.id}/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dashboard_ids: dashboardIds,
          feature_permissions: featurePermissions
        })
      });

      const data = await response.json();
      if (data.success) {
        await loadData();
        setShowPermissionsModal(false);
        setSelectedAdmin(null);
        setPermissions({});
      } else {
        alert(data.error || 'Error saving permissions');
      }
    } catch (error) {
      console.error('Error saving permissions:', error);
      alert('Error saving permissions');
    } finally {
      setLoading(false);
    }
  };

  const toggleDashboard = (dashboardId) => {
    setPermissions(prev => ({
      ...prev,
      [dashboardId]: {
        ...prev[dashboardId],
        _selected: !prev[dashboardId]?._selected
      }
    }));
  };

  const updateFeaturePermission = (dashboardId, featureId, permission, value) => {
    setPermissions(prev => ({
      ...prev,
      [dashboardId]: {
        ...prev[dashboardId],
        [featureId]: {
          ...prev[dashboardId]?.[featureId] || {},
          [permission]: value
        }
      }
    }));
  };

  return (
    <div className="rbac-admin-user-manager">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Admin User Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="btn-ng-primary"
        >
          <i className="fas fa-plus mr-2"></i>
          Create Admin
        </button>
      </div>

      {loading && !admins.length ? (
        <div className="text-center py-12">
          <i className="fas fa-spinner fa-spin text-4xl text-primary-500"></i>
        </div>
      ) : (
        <div className="card-ng">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-300">Username</th>
                <th className="text-left py-3 px-4 text-gray-300">Email</th>
                <th className="text-left py-3 px-4 text-gray-300">Role</th>
                <th className="text-left py-3 px-4 text-gray-300">Dashboards</th>
                <th className="text-left py-3 px-4 text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-white">{admin.username}</span>
                      {admin.is_superadmin && (
                        <span className="badge-ng badge-ng-primary">Super Admin</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{admin.email}</td>
                  <td className="py-3 px-4 text-gray-300">{admin.role}</td>
                  <td className="py-3 px-4 text-gray-300">
                    {admin.dashboard_count || 0} dashboard(s)
                  </td>
                  <td className="py-3 px-4">
                    {!admin.is_superadmin && (
                      <button
                        onClick={() => handleManagePermissions(admin)}
                        className="btn-ng-secondary text-sm"
                      >
                        <i className="fas fa-key mr-1"></i>
                        Manage Permissions
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Create Admin User</h3>
            
            <form onSubmit={handleCreateAdmin}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  required
                  minLength={8}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-ng-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-ng-primary flex-1"
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && selectedAdmin && (
        <PermissionsModal
          admin={selectedAdmin}
          dashboards={dashboards}
          permissions={permissions}
          onClose={() => { setShowPermissionsModal(false); setSelectedAdmin(null); setPermissions({}); }}
          onSave={handleSavePermissions}
          onToggleDashboard={toggleDashboard}
          onUpdateFeaturePermission={updateFeaturePermission}
          loading={loading}
        />
      )}
    </div>
  );
};

const PermissionsModal = ({ admin, dashboards, permissions, onClose, onSave, onToggleDashboard, onUpdateFeaturePermission, loading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-4">
          Manage Permissions: {admin.username}
        </h3>

        <div className="space-y-4">
          {dashboards.map((dashboard) => {
            const isSelected = permissions[dashboard.id]?._selected;
            const dashboardFeatures = permissions[dashboard.id] || {};
            
            return (
              <div key={dashboard.id} className="card-ng">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleDashboard(dashboard.id)}
                      className="w-5 h-5 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                    />
                    <i className={`${dashboard.icon || 'fas fa-tachometer-alt'} text-xl text-primary-500`}></i>
                    <div>
                      <h4 className="text-white font-semibold">{dashboard.name}</h4>
                      <p className="text-sm text-gray-400">{dashboard.description}</p>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="ml-8 mt-4 space-y-3">
                    <p className="text-sm text-gray-400 mb-2">Feature Permissions:</p>
                    {/* Note: Features would need to be loaded from API */}
                    <div className="text-sm text-gray-500 italic">
                      Feature permissions will be configured after features are added to the dashboard.
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="btn-ng-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={loading}
            className="btn-ng-primary flex-1"
          >
            {loading ? 'Saving...' : 'Save Permissions'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManager;

