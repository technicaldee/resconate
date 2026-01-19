import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { setEarnerToken } from '../../src/utils/api';

export default function EarnerLogin() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/d2e/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (result.success) {
                setEarnerToken(result.token, true);
                router.push('/d2e/dashboard');
            } else {
                setError(result.error || 'Invalid credentials');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-d2e-bg-dark font-display flex items-center justify-center p-6 relative overflow-hidden">
            <Head>
                <title>Earner Login - D2E</title>
            </Head>

            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-d2e-primary/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -ml-64 -mb-64"></div>

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                {/* Visual Side */}
                <div className="hidden lg:flex flex-col justify-center space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-d2e-primary/10 rounded-full border border-d2e-primary/20">
                            <span className="size-2 rounded-full bg-d2e-primary animate-pulse"></span>
                            <span className="text-[10px] font-black text-d2e-primary uppercase tracking-[0.2em]">Next-Gen Earning</span>
                        </div>
                        <h1 className="text-7xl font-black text-white tracking-tight leading-[0.9]">
                            Unlock your <br />
                            <span className="text-d2e-primary">Digital Potential.</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-lg leading-relaxed font-medium">
                            Join thousands of earners completing micro-tasks and building the future of decentralized work.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 max-w-md">
                        <div className="p-6 rounded-3xl bg-d2e-surface-dark border border-white/5 shadow-sm">
                            <span className="material-symbols-outlined text-d2e-primary text-3xl mb-3">bolt</span>
                            <h4 className="font-black text-lg mb-1">Fast Payouts</h4>
                            <p className="text-xs text-slate-400 leading-normal">Withdraw your earnings instantly to your local bank.</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-d2e-surface-dark border border-white/5 shadow-sm">
                            <span className="material-symbols-outlined text-d2e-primary text-3xl mb-3">verified</span>
                            <h4 className="font-black text-lg mb-1">Global Tasks</h4>
                            <p className="text-xs text-slate-400 leading-normal">Access exclusive opportunities from top brands.</p>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="flex justify-center lg:justify-end">
                    <div className="w-full max-w-[480px]">
                        <div className="mb-10 lg:hidden">
                            <div className="h-16 w-16 bg-d2e-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-d2e-primary/20 shadow-inner">
                                <span className="material-symbols-outlined !text-4xl text-d2e-primary">login</span>
                            </div>
                            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome Back</h1>
                            <p className="text-gray-400 font-medium">Sign in to continue your earning journey.</p>
                        </div>

                        <div className="bg-d2e-surface-dark p-8 md:p-12 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-d2e-primary to-emerald-500"></div>

                            {error && (
                                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-2xl text-center font-black uppercase tracking-widest animate-shake">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="space-y-8">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Identity Profile</label>
                                    <div className="relative group/input">
                                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-d2e-primary transition-colors">alternate_email</span>
                                        <input
                                            name="username"
                                            type="text"
                                            required
                                            className="w-full bg-d2e-bg-dark border border-white/5 rounded-2xl h-16 pl-14 pr-6 text-base font-bold focus:ring-2 focus:ring-d2e-primary/20 focus:border-d2e-primary outline-none transition-all text-white placeholder:text-white/10"
                                            placeholder="Email or Username"
                                            value={formData.username}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Key</label>
                                        <Link href="#" className="text-[10px] text-d2e-primary font-black uppercase tracking-widest hover:underline underline-offset-4 decoration-2">Forgot Key?</Link>
                                    </div>
                                    <div className="relative group/input">
                                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-d2e-primary transition-colors">lock</span>
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            className="w-full bg-d2e-bg-dark border border-white/5 rounded-2xl h-16 pl-14 pr-6 text-base font-bold focus:ring-2 focus:ring-d2e-primary/20 focus:border-d2e-primary outline-none transition-all text-white placeholder:text-white/10"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-16 bg-d2e-primary hover:bg-d2e-primary/90 text-d2e-bg-dark font-black rounded-2xl shadow-xl shadow-d2e-primary/20 transition-all active:scale-[0.98] flex justify-center items-center gap-3 text-lg uppercase tracking-widest group/btn"
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-6 w-6 border-3 border-d2e-bg-dark border-t-transparent"></div>
                                    ) : (
                                        <>
                                            <span>Enter System</span>
                                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        <p className="mt-8 text-center text-sm text-slate-600 dark:text-gray-400 font-bold">
                            New earner? <Link href="/d2e/register" className="text-d2e-primary font-black hover:underline underline-offset-4 decoration-2">Create Profile</Link>
                        </p>

                        <div className="mt-12 flex justify-center">
                            <Link href="/" className="px-6 py-2 bg-slate-100 dark:bg-white/5 rounded-full text-slate-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-d2e-primary hover:bg-d2e-primary/5 transition-all">
                                <span className="material-symbols-outlined text-sm">home</span>
                                <span>Main Interface</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
