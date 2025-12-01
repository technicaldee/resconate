import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import GlobalNav from '../components/GlobalNav';
import { apiUrl, apiFetch, setEmployeeToken, clearTokens } from '../utils/api';

const EmployeeLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiFetch('/api/employee/me');
        if (response.ok) {
          router.push('/employee-portal');
        }
      } catch (error) {
        // User not logged in
        clearTokens();
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(apiUrl('/api/employee/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password, remember })
      });

      const data = await response.json();

      if (response.ok && data.success && data.token) {
        setEmployeeToken(data.token, remember);
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => router.push('/employee-portal'), 1000);
      } else {
        setError(data.error || data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-login-page">
      <GlobalNav />
      <main className="employee-login-main">
        <div className="employee-login-container">
          <div className="employee-login-card">
            <div className="employee-login-header">
              <img src="/resconate-logo.png" alt="Resconate" className="employee-login-logo" />
              <h2 className="employee-login-title">Employee Portal</h2>
              <p className="employee-login-subtitle">Access your HR dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="employee-login-form">
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  <i className="fas fa-user"></i> Username or Employee ID
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <i className="fas fa-lock"></i> Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-input password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div className="form-options">
                <div className="checkbox-group">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="form-checkbox"
                  />
                  <label htmlFor="remember" className="checkbox-label">
                    Remember me
                  </label>
                </div>
                <Link href="/hr-forgot" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-login"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {error && (
              <div className="alert alert-error">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                <i className="fas fa-check-circle"></i>
                {success}
              </div>
            )}

            <div className="employee-login-footer">
              <p className="footer-text">
                Need help? Contact{' '}
                <a href="mailto:resconate@gmail.com" className="footer-link">IT Support</a>
              </p>
              <p className="footer-copyright">
                © {new Date().getFullYear()} Resconate HR Platform. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeLogin;


