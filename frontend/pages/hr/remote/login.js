import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import GlobalNav from '../../../src/components/GlobalNav';
import { apiUrl, apiFetch, setToken, clearTokens } from '../../../utils/api';

const HRLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiFetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.admin) {
            router.push('/hr/remote/dashboard');
          }
        }
      } catch (error) {
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
      const response = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success && data.token) {
        setToken(data.token, rememberMe);
        setSuccess('Authentication successful. Redirecting to Management Console...');
        setTimeout(() => {
          router.push('/hr/remote/dashboard');
        }, 1500);
      } else {
        setError(data.error || 'Invalid credentials provided');
      }
    } catch (error) {
      setError('A system error occurred. Please contact Resconate support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-display overflow-hidden relative">
      <GlobalNav />

      {/* Ambient background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-600/5 rounded-full blur-[150px] opacity-40"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24">
        <div className="w-full max-w-lg bg-slate-900/50 backdrop-blur-2xl border border-white/5 rounded-[48px] p-12 shadow-2xl shadow-black/80">

          <div className="text-center mb-12 space-y-3">
            <div className="w-16 h-16 bg-pink-600/10 rounded-3xl border border-pink-600/20 flex items-center justify-center mx-auto mb-6 text-pink-400">
              <span className="material-symbols-outlined text-3xl font-black">workspace_premium</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter">Professional Portal</h1>
            <p className="text-slate-500 font-medium text-sm">Managed Workforce Management & Client Console</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-4">Access ID</label>
              <div className="relative group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-pink-500/30 transition-all"
                  placeholder="Your registered username"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-700">account_circle</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-4">Passcode</label>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-pink-500/30 transition-all font-mono"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-700 hover:text-white transition-colors"
                >
                  {showPassword ? 'visibility_off' : 'visibility'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-5 h-5 rounded-md border border-white/10 flex items-center justify-center group-hover:bg-white/5 transition-all">
                  {rememberMe && <span className="w-2 h-2 rounded-full bg-pink-500 shadow-xl shadow-pink-500/50"></span>}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Stay signed in</span>
              </label>
              <Link href="/hr/remote/forgot" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Request Recovery</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-4 group"
            >
              {loading ? (
                <span className="flex items-center gap-2">Authenticating <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span></span>
              ) : (
                <>Enter Portal <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span></>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-8 p-4 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center gap-3 text-pink-400 text-[10px] font-black uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">block</span>
              {error}
            </div>
          )}

          {success && (
            <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">verified</span>
              {success}
            </div>
          )}
        </div>

        <p className="mt-12 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">&copy; Resconate Professional HR Infrastructure. Secure Gateway.</p>
      </main>
    </div>
  );
};

export default HRLogin;
export const dynamic = 'force-dynamic';
