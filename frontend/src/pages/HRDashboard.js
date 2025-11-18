import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalNav from '../components/GlobalNav';
import { apiUrl } from '../utils/api';

const HRDashboard = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [analytics, setAnalytics] = useState({
    totalEmployees: 0,
    activeJobs: 0,
    pendingInterviews: 0,
    complianceScore: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        const response = await fetch(apiUrl('/api/auth/me'));
        if (!response.ok) {
          navigate('/hr-login');
        }
      } catch (error) {
        navigate('/hr-login');
      }
    };
    checkAuth();

    // Load analytics
    loadAnalytics();
  }, [navigate]);

  const loadAnalytics = async () => {
    try {
      // Placeholder - replace with actual API calls
      setAnalytics({
        totalEmployees: 150,
        activeJobs: 12,
        pendingInterviews: 8,
        complianceScore: 95
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      <GlobalNav />
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img src="/resconate-logo.png" alt="Resconate" className="h-8 w-auto" />
              <h1 className="ml-3 text-xl font-bold text-gray-900">HR as a Service Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span>Welcome, HR Admin</span>
              </div>
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors">
                <i className="fas fa-user-circle mr-2"></i>Profile
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <i className="fas fa-users text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalEmployees}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <i className="fas fa-briefcase text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.activeJobs}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <i className="fas fa-calendar-alt text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Interviews</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.pendingInterviews}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <i className="fas fa-chart-line text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.complianceScore}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {['employees', 'recruitment', 'payroll', 'performance', 'banking', 'compliance'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className={`fas fa-${tab === 'employees' ? 'users' : tab === 'recruitment' ? 'user-plus' : tab === 'payroll' ? 'money-bill-wave' : tab === 'performance' ? 'chart-bar' : tab === 'banking' ? 'university' : 'shield-alt'} mr-2`}></i>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="text-center py-12 text-gray-500">
            <i className="fas fa-cog fa-spin text-4xl mb-4"></i>
            <p>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} module coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;


