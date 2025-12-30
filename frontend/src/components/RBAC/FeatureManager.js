import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

const FeatureManager = ({ dashboardId }) => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [formData, setFormData] = useState({
    feature_key: '',
    feature_name: '',
    feature_description: '',
    component_path: '',
    icon: 'fas fa-circle',
    order_index: 0
  });

  useEffect(() => {
    if (dashboardId) {
      loadFeatures();
    }
  }, [dashboardId]);

  const loadFeatures = async () => {
    setLoading(true);
    try {
      const response = await apiFetch(`/api/admin/dashboards/${dashboardId}/features`);
      const data = await response.json();
      if (data.success) {
        setFeatures(data.data.sort((a, b) => a.order_index - b.order_index));
      }
    } catch (error) {
      console.error('Error loading features:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = `/api/admin/dashboards/${dashboardId}/features`;
      
      const response = await apiFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        await loadFeatures();
        setShowModal(false);
        resetForm();
      } else {
        alert(data.error || 'Error saving feature');
      }
    } catch (error) {
      console.error('Error saving feature:', error);
      alert('Error saving feature');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this feature? This will also remove all associated permissions.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch(`/api/admin/dashboards/${dashboardId}/features/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        await loadFeatures();
      } else {
        alert(data.error || 'Error deleting feature');
      }
    } catch (error) {
      console.error('Error deleting feature:', error);
      alert('Error deleting feature');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingFeature(null);
    setFormData({
      feature_key: '',
      feature_name: '',
      feature_description: '',
      component_path: '',
      icon: 'fas fa-circle',
      order_index: 0
    });
  };

  return (
    <div className="feature-manager">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Dashboard Features</h3>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="btn-ng-primary text-sm"
        >
          <i className="fas fa-plus mr-2"></i>
          Add Feature
        </button>
      </div>

      {loading && !features.length ? (
        <div className="text-center py-8">
          <i className="fas fa-spinner fa-spin text-2xl text-primary-500"></i>
        </div>
      ) : (
        <div className="space-y-2">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <i className={`${feature.icon || 'fas fa-circle'} text-primary-500`}></i>
                <div>
                  <div className="text-white font-medium">{feature.feature_name}</div>
                  <div className="text-sm text-gray-400">{feature.feature_key}</div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(feature.id)}
                className="btn-ng-danger text-sm"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
          {features.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No features added yet. Add features to enable granular permissions.
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Add Feature</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Feature Key</label>
                <input
                  type="text"
                  value={formData.feature_key}
                  onChange={(e) => setFormData({ ...formData, feature_key: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  required
                  placeholder="employees"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Feature Name</label>
                <input
                  type="text"
                  value={formData.feature_name}
                  onChange={(e) => setFormData({ ...formData, feature_name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  required
                  placeholder="Employee Management"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.feature_description}
                  onChange={(e) => setFormData({ ...formData, feature_description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  rows="2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Component Path (optional)</label>
                <input
                  type="text"
                  value={formData.component_path}
                  onChange={(e) => setFormData({ ...formData, component_path: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="/components/EmployeeManagement"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Icon (FontAwesome class)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="fas fa-users"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Order Index</label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  min="0"
                />
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
                  {loading ? 'Adding...' : 'Add Feature'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureManager;

