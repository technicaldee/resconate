import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiFetch } from '../../utils/api';
import FeatureManager from './FeatureManager';

const DashboardManager = () => {
  const router = useRouter();
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingDashboard, setEditingDashboard] = useState(null);
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'fas fa-tachometer-alt',
    is_active: true
  });

  useEffect(() => {
    // Check if dashboard ID is in query params
    const dashboardId = router.query.dashboard;
    if (dashboardId) {
      const dashboard = dashboards.find(d => d.id === parseInt(dashboardId));
      if (dashboard) {
        setSelectedDashboard(dashboard);
      }
    }
  }, [router.query, dashboards]);

  useEffect(() => {
    loadDashboards();
  }, []);

  const loadDashboards = async () => {
    setLoading(true);
    try {
      const response = await apiFetch('/api/admin/dashboards');
      const data = await response.json();
      if (data.success) {
        setDashboards(data.data);
      }
    } catch (error) {
      console.error('Error loading dashboards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingDashboard 
        ? `/api/admin/dashboards/${editingDashboard.id}`
        : '/api/admin/dashboards';
      
      const method = editingDashboard ? 'PUT' : 'POST';
      
      const response = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        await loadDashboards();
        setShowModal(false);
        resetForm();
      } else {
        alert(data.error || 'Error saving dashboard');
      }
    } catch (error) {
      console.error('Error saving dashboard:', error);
      alert('Error saving dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this dashboard? This will also remove all associated permissions.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch(`/api/admin/dashboards/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        await loadDashboards();
      } else {
        alert(data.error || 'Error deleting dashboard');
      }
    } catch (error) {
      console.error('Error deleting dashboard:', error);
      alert('Error deleting dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (dashboard) => {
    setEditingDashboard(dashboard);
    setFormData({
      name: dashboard.name,
      slug: dashboard.slug,
      description: dashboard.description || '',
      icon: dashboard.icon || 'fas fa-tachometer-alt',
      is_active: dashboard.is_active
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingDashboard(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: 'fas fa-tachometer-alt',
      is_active: true
    });
  };

  const generateSlug = (name) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  if (selectedDashboard) {
    return (
      <div className="rbac-dashboard-manager">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedDashboard(null)}
              className="btn-ng-secondary"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Dashboards
            </button>
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedDashboard.name}</h2>
              <p className="text-gray-400">{selectedDashboard.slug}</p>
            </div>
          </div>
        </div>
        <FeatureManager dashboardId={selectedDashboard.id} />
      </div>
    );
  }

  return (
    <div className="rbac-dashboard-manager">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Dashboard Management</h2>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="btn-ng-primary"
        >
          <i className="fas fa-plus mr-2"></i>
          Create Dashboard
        </button>
      </div>

      {loading && !dashboards.length ? (
        <div className="text-center py-12">
          <i className="fas fa-spinner fa-spin text-4xl text-primary-500"></i>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboards.map((dashboard) => (
            <div key={dashboard.id} className="card-ng">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <i className={`${dashboard.icon || 'fas fa-tachometer-alt'} text-2xl text-primary-500`}></i>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{dashboard.name}</h3>
                    <p className="text-sm text-gray-400">{dashboard.slug}</p>
                  </div>
                </div>
                <span className={`badge-ng ${dashboard.is_active ? 'badge-ng-success' : 'badge-ng-secondary'}`}>
                  {dashboard.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              {dashboard.description && (
                <p className="text-gray-300 mb-4 text-sm">{dashboard.description}</p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <span>
                  <i className="fas fa-cube mr-1"></i>
                  {dashboard.feature_count || 0} Features
                </span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(dashboard)}
                  className="btn-ng-secondary flex-1 text-sm"
                >
                  <i className="fas fa-edit mr-1"></i>
                  Edit
                </button>
                <button
                  onClick={() => setSelectedDashboard(dashboard)}
                  className="btn-ng-primary flex-1 text-sm"
                >
                  <i className="fas fa-cog mr-1"></i>
                  Manage Features
                </button>
                <button
                  onClick={() => handleDelete(dashboard.id)}
                  className="btn-ng-danger flex-1 text-sm"
                >
                  <i className="fas fa-trash mr-1"></i>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingDashboard ? 'Edit Dashboard' : 'Create Dashboard'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: editingDashboard ? formData.slug : generateSlug(e.target.value)
                    });
                  }}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  required
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  title="Slug must be lowercase alphanumeric with hyphens"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Icon (FontAwesome class)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="fas fa-tachometer-alt"
                />
              </div>

              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-gray-300">Active</span>
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="btn-ng-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-ng-primary flex-1"
                >
                  {loading ? 'Saving...' : editingDashboard ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardManager;

