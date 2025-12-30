import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import ScrollToTop from '../src/components/ScrollToTop';
import { apiUrl, apiFetch, setToken, clearTokens } from '../utils/api';

const AdminDashboardEnhanced = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState({
    totalEmployees: 0,
    activeJobs: 0,
    totalCandidates: 0,
    pendingInterviews: 0,
    complianceScore: 0,
    totalPayroll: 0,
    activeSubscriptions: 0
  });
  const [employees, setEmployees] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [settings, setSettings] = useState([]);
  const [onboardingTasks, setOnboardingTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadTabData();
    }
  }, [isAuthenticated, activeTab]);

  const checkAuth = async () => {
    try {
      const response = await apiFetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(data.success);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const loadTabData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'overview':
          await loadOverview();
          break;
        case 'users':
          await loadEmployees();
          break;
        case 'onboarding':
          await loadOnboarding();
          break;
        case 'jobs':
          await loadJobs();
          break;
        case 'candidates':
          await loadCandidates();
          break;
        case 'audit':
          await loadAuditLogs();
          break;
        case 'settings':
          await loadSettings();
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOverview = async () => {
    try {
      const [analyticsRes, employeesRes, jobsRes, candidatesRes] = await Promise.all([
        apiFetch('/api/analytics'),
        apiFetch('/api/employees'),
        apiFetch('/api/hr/jobs'),
        apiFetch('/api/recruitment/candidates')
      ]);

      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        if (data.success && data.data) {
          setAnalytics(data.data);
        }
      }
      if (employeesRes.ok) {
        const data = await employeesRes.json();
        setEmployees(data.data || []);
      }
      if (jobsRes.ok) {
        const data = await jobsRes.json();
        setJobs(data.data || []);
      }
      if (candidatesRes.ok) {
        const data = await candidatesRes.json();
        setCandidates(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load overview:', error);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await apiFetch('/api/employees');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load employees:', error);
    }
  };

  const loadJobs = async () => {
    try {
      const response = await apiFetch('/api/hr/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load jobs:', error);
    }
  };

  const loadCandidates = async () => {
    try {
      const response = await apiFetch('/api/recruitment/candidates');
      if (response.ok) {
        const data = await response.json();
        setCandidates(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load candidates:', error);
    }
  };

  const loadAuditLogs = async () => {
    try {
      const response = await apiFetch('/api/admin/audit?limit=50');
      if (response.ok) {
        const data = await response.json();
        setAuditLogs(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await apiFetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const loadOnboarding = async () => {
    // Mock onboarding tasks - in production, this would come from API
    setOnboardingTasks([
      { id: 1, employee: 'John Doe', task: 'Complete profile', status: 'pending', dueDate: '2025-01-05' },
      { id: 2, employee: 'Jane Smith', task: 'Submit documents', status: 'completed', dueDate: '2025-01-03' },
      { id: 3, employee: 'Mike Johnson', task: 'Bank account setup', status: 'in_progress', dueDate: '2025-01-07' }
    ]);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginForm)
      });

      const data = await response.json();

      if (data.success && data.token) {
        setToken(data.token, true);
        setIsAuthenticated(true);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    try {
      const response = await fetch(apiUrl(`/api/export/${type}`), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data');
    }
  };

  const filteredEmployees = employees.filter(emp =>
    searchQuery === '' ||
    emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employee_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-600 uppercase">Total Employees</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{analytics.totalEmployees}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-200">
              <i className="fas fa-users text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-green-600 uppercase">Active Jobs</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{analytics.activeJobs}</p>
            </div>
            <div className="p-3 rounded-full bg-green-200">
              <i className="fas fa-briefcase text-green-600 text-xl"></i>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-purple-600 uppercase">Candidates</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{candidates.length}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-200">
              <i className="fas fa-user-tie text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-5 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-amber-600 uppercase">Compliance Score</p>
              <p className="text-2xl font-bold text-amber-900 mt-1">{analytics.complianceScore}%</p>
            </div>
            <div className="p-3 rounded-full bg-amber-200">
              <i className="fas fa-shield-alt text-amber-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => handleExport('employees')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
          >
            <i className="fas fa-download"></i>
            <span className="text-sm font-medium">Export Employees</span>
          </button>
          <button
            onClick={() => router.push('/hr-dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
          >
            <i className="fas fa-tachometer-alt"></i>
            <span className="text-sm font-medium">HR Dashboard</span>
          </button>
          <button
            onClick={() => router.push('/analytics')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors"
          >
            <i className="fas fa-chart-bar"></i>
            <span className="text-sm font-medium">Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
          >
            <i className="fas fa-cog"></i>
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Recent Employees</h3>
            <button
              onClick={() => setActiveTab('users')}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {employees.slice(0, 5).map((emp) => (
              <div key={emp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                  <p className="text-xs text-gray-500">{emp.department || 'N/A'} • {emp.email}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${
                  emp.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {emp.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Active Job Postings</h3>
            <button
              onClick={() => setActiveTab('jobs')}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {jobs.filter(j => j.status === 'active').slice(0, 5).map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{job.title}</p>
                  <p className="text-xs text-gray-500">{job.department} • {job.location}</p>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Employee Management</h3>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleExport('employees')}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            <i className="fas fa-download mr-2"></i>
            Export CSV
          </button>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{emp.employee_id}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{emp.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{emp.email}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{emp.department || 'N/A'}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{emp.position || 'N/A'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded ${
                    emp.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOnboarding = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Onboarding Tasks</h3>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
          <i className="fas fa-plus mr-2"></i>
          New Task
        </button>
      </div>
      <div className="space-y-3">
        {onboardingTasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{task.employee}</p>
                <p className="text-xs text-gray-600 mt-1">{task.task}</p>
                <p className="text-xs text-gray-500 mt-1">Due: {formatDate(task.dueDate)}</p>
              </div>
              <span className={`px-3 py-1 text-xs rounded ${
                task.status === 'completed' ? 'bg-green-100 text-green-800' :
                task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Job Postings</h3>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
          <i className="fas fa-plus mr-2"></i>
          New Job
        </button>
      </div>
      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">{job.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{job.department} • {job.location}</p>
                <p className="text-xs text-gray-500 mt-1">Posted: {formatDate(job.posted_date)}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded ${
                job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {job.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCandidates = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Candidates</h3>
      <div className="space-y-3">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">{candidate.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{candidate.email}</p>
                {candidate.job_title && (
                  <p className="text-xs text-blue-600 mt-1">{candidate.job_title}</p>
                )}
              </div>
              <span className={`px-2 py-1 text-xs rounded ${
                candidate.status === 'hired' ? 'bg-green-100 text-green-800' :
                candidate.status === 'interview' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {candidate.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAudit = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Audit Logs</h3>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resource</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {auditLogs.slice(0, 50).map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-600">{formatDate(log.created_at)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{log.user_type}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{log.action}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {log.resource_type} {log.resource_id ? `#${log.resource_id}` : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-gray-900">System Settings</h3>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">{setting.setting_key}</p>
                <p className="text-xs text-gray-500">{setting.description || ''}</p>
              </div>
              <input
                type="text"
                defaultValue={setting.setting_value}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          {settings.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-8">No settings configured</p>
          )}
        </div>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
          Save Settings
        </button>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="App">
        <Header />
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
            <div className="text-center mb-6">
              <i className="fas fa-shield-alt text-4xl text-blue-600 mb-4"></i>
              <h2 className="text-xl font-bold text-gray-900">Admin Login</h2>
              <p className="text-sm text-gray-600 mt-2">Access the HR Platform Admin Dashboard</p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-2">Username or Email</label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-xs font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
                {error}
              </div>
            )}

            <div className="mt-6 text-center text-xs text-gray-600">
              <p>Default credentials: <strong>admin</strong> / <strong>admin123</strong></p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <main className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <i className="fas fa-users-cog text-xl text-blue-600 mr-3"></i>
                <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, Admin</span>
                <button
                  onClick={() => {
                    clearTokens();
                    setIsAuthenticated(false);
                    router.push('/');
                  }}
                  className="bg-red-600 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-red-700"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-6 overflow-x-auto">
              {['overview', 'users', 'onboarding', 'jobs', 'candidates', 'audit', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <i className={`fas fa-${tab === 'overview' ? 'chart-line' : tab === 'users' ? 'users' : tab === 'onboarding' ? 'user-plus' : tab === 'jobs' ? 'briefcase' : tab === 'candidates' ? 'user-tie' : tab === 'audit' ? 'history' : 'cog'} mr-2`}></i>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {loading && (
              <div className="text-center py-12">
                <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
                <p className="text-gray-600">Loading...</p>
              </div>
            )}
            {!loading && (
              <>
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'users' && renderUsers()}
                {activeTab === 'onboarding' && renderOnboarding()}
                {activeTab === 'jobs' && renderJobs()}
                {activeTab === 'candidates' && renderCandidates()}
                {activeTab === 'audit' && renderAudit()}
                {activeTab === 'settings' && renderSettings()}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default AdminDashboardEnhanced;

export const dynamic = 'force-dynamic';

