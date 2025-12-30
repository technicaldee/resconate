import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import ScrollToTop from '../src/components/ScrollToTop';
import DashboardManager from '../src/components/RBAC/DashboardManager';
import AdminUserManager from '../src/components/RBAC/AdminUserManager';
import { apiFetch } from '../utils/api';

const AdminRBACPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboards');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await apiFetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsAuthenticated(true);
          setIsSuperAdmin(data.admin.is_superadmin === true);
          
          if (!data.admin.is_superadmin) {
            // Redirect non-super admins
            router.push('/admin-dashboard');
          }
        }
      } else {
        router.push('/admin-dashboard');
      }
    } catch (error) {
      router.push('/admin-dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-4xl text-primary-500"></i>
      </div>
    );
  }

  if (!isAuthenticated || !isSuperAdmin) {
    return null; // Will redirect
  }

  return (
    <div className="App">
      <Header />
      <main id="main-content" className="min-h-screen bg-gray-900 pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">RBAC Management</h1>
            <p className="text-gray-400">Manage dashboards, admin users, and permissions</p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('dashboards')}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === 'dashboards'
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <i className="fas fa-tachometer-alt mr-2"></i>
              Dashboards
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === 'users'
                  ? 'text-primary-500 border-b-2 border-primary-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <i className="fas fa-users mr-2"></i>
              Admin Users
            </button>
          </div>

          {/* Content */}
          {activeTab === 'dashboards' && <DashboardManager />}
          {activeTab === 'users' && <AdminUserManager />}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default AdminRBACPage;

