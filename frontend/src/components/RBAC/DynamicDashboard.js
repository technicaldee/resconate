import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiFetch } from '../../utils/api';

const DynamicDashboard = ({ dashboard }) => {
  const router = useRouter();
  const [activeFeature, setActiveFeature] = useState(null);
  const [featureData, setFeatureData] = useState({});

  useEffect(() => {
    if (dashboard && dashboard.features && dashboard.features.length > 0) {
      setActiveFeature(dashboard.features[0].feature_key);
    }
  }, [dashboard]);

  const handleFeatureClick = (feature) => {
    // Check if user has view permission
    if (feature.permissions && !feature.permissions.can_view) {
      alert('You do not have permission to view this feature');
      return;
    }
    setActiveFeature(feature.feature_key);
  };

  const renderFeatureContent = () => {
    if (!activeFeature || !dashboard.features) return null;

    const feature = dashboard.features.find(f => f.feature_key === activeFeature);
    if (!feature) return null;

    // Here you would dynamically load the component based on feature.component_path
    // For now, we'll render a placeholder
    return (
      <div className="card-ng">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{feature.feature_name}</h2>
            {feature.feature_description && (
              <p className="text-gray-400 mt-1">{feature.feature_description}</p>
            )}
          </div>
          <div className="flex space-x-2">
            {feature.permissions?.can_export && (
              <button className="btn-ng-secondary">
                <i className="fas fa-download mr-2"></i>
                Export
              </button>
            )}
            {feature.permissions?.can_create && (
              <button className="btn-ng-primary">
                <i className="fas fa-plus mr-2"></i>
                Create
              </button>
            )}
          </div>
        </div>

        <div className="text-center py-12 text-gray-400">
          <i className="fas fa-cube text-4xl mb-4"></i>
          <p>Feature component: {feature.component_path || 'Default component'}</p>
          <p className="text-sm mt-2">This feature will be dynamically loaded based on the component path.</p>
          <p className="text-sm mt-4 text-gray-500">
            Permissions: View: {feature.permissions?.can_view ? '✓' : '✗'}, 
            Create: {feature.permissions?.can_create ? '✓' : '✗'}, 
            Edit: {feature.permissions?.can_edit ? '✓' : '✗'}, 
            Delete: {feature.permissions?.can_delete ? '✓' : '✗'}
          </p>
        </div>
      </div>
    );
  };

  if (!dashboard) return null;

  return (
    <div className="dynamic-dashboard container mx-auto px-4 py-8">
      {/* Dashboard Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <i className={`${dashboard.icon || 'fas fa-tachometer-alt'} text-4xl text-primary-500`}></i>
            <div>
              <h1 className="text-3xl font-bold text-white">{dashboard.name}</h1>
              {dashboard.description && (
                <p className="text-gray-400 mt-1">{dashboard.description}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => router.push('/admin-dashboard')}
            className="btn-ng-secondary"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Main Dashboard
          </button>
        </div>
      </div>

      {/* Feature Navigation */}
      {dashboard.features && dashboard.features.length > 0 && (
        <div className="mb-6">
          <nav className="flex space-x-2 overflow-x-auto pb-2">
            {dashboard.features.map((feature) => {
              const isActive = activeFeature === feature.feature_key;
              const hasAccess = feature.permissions?.can_view !== false;
              
              if (!hasAccess) return null;

              return (
                <button
                  key={feature.id}
                  onClick={() => handleFeatureClick(feature)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <i className={`${feature.icon || 'fas fa-circle'} mr-2`}></i>
                  {feature.feature_name}
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Feature Content */}
      {renderFeatureContent()}
    </div>
  );
};

export default DynamicDashboard;

