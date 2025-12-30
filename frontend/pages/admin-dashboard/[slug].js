import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import ScrollToTop from '../../src/components/ScrollToTop';
import DynamicDashboard from '../../src/components/RBAC/DynamicDashboard';
import { apiFetch } from '../../utils/api';

const CustomAdminDashboard = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      loadDashboard();
    }
  }, [slug]);

  const loadDashboard = async () => {
    try {
      // Find dashboard by slug
      const dashboardsRes = await apiFetch('/api/admin/dashboards');
      const dashboardsData = await dashboardsRes.json();
      
      if (dashboardsData.success) {
        const foundDashboard = dashboardsData.data.find(d => d.slug === slug);
        if (foundDashboard) {
          // Load full dashboard with features
          const dashboardRes = await apiFetch(`/api/admin/dashboards/${foundDashboard.id}`);
          const dashboardData = await dashboardRes.json();
          if (dashboardData.success) {
            setDashboard(dashboardData.data);
          } else {
            setError('Dashboard not found');
          }
        } else {
          setError('Dashboard not found');
        }
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError('Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="App">
        <Header />
        <main className="min-h-screen bg-gray-900 pt-20 flex items-center justify-center">
          <i className="fas fa-spinner fa-spin text-4xl text-primary-500"></i>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="App">
        <Header />
        <main className="min-h-screen bg-gray-900 pt-20 flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
            <p className="text-white text-xl mb-4">{error || 'Dashboard not found'}</p>
            <button
              onClick={() => router.push('/admin-dashboard')}
              className="btn-ng-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <main className="min-h-screen bg-gray-900 pt-20 pb-12">
        <DynamicDashboard dashboard={dashboard} />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default CustomAdminDashboard;

