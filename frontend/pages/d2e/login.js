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
        <div className="min-h-screen bg-d2e-bg-light dark:bg-d2e-bg-dark font-display flex flex-col items-center justify-center p-4">
            <Head>
                <title>Earner Login - D2E</title>
            </Head>

            <div className="max-w-md w-full">
                <div className="mb-10 text-center">
                    <div className="h-16 w-16 bg-d2e-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-d2e-primary/20 shadow-inner">
                        <span className="material-symbols-outlined !text-4xl text-d2e-primary">login</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-500 dark:text-gray-400">Sign in to continue your earning journey.</p>
                </div>

                <div className="bg-white dark:bg-[#1a2e1e] p-8 rounded-[2rem] border border-slate-200 dark:border-gray-800 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-d2e-primary"></div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl text-center font-bold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Email or Phone</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">alternate_email</span>
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 dark:bg-d2e-bg-dark border border-slate-200 dark:border-gray-800 rounded-xl h-14 pl-12 pr-6 text-base focus:ring-2 focus:ring-d2e-primary focus:border-transparent outline-none transition-all dark:text-white"
                                    placeholder="name@example.com"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2 ml-1">
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Password</label>
                                <Link href="#" className="text-xs text-d2e-primary font-bold hover:underline">Forgot?</Link>
                            </div>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full bg-slate-50 dark:bg-d2e-bg-dark border border-slate-200 dark:border-gray-800 rounded-xl h-14 pl-12 pr-6 text-base focus:ring-2 focus:ring-d2e-primary focus:border-transparent outline-none transition-all dark:text-white"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-d2e-primary hover:bg-d2e-primary/90 text-d2e-bg-dark font-black rounded-xl shadow-lg shadow-d2e-primary/20 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-d2e-bg-dark border-t-transparent"></div>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-sm text-slate-600 dark:text-gray-400">
                    Don't have an account? <Link href="/d2e/register" className="text-d2e-primary font-bold hover:underline">Register now</Link>
                </p>

                <div className="mt-12 flex justify-center">
                    <Link href="/" className="text-slate-400 dark:text-gray-600 text-xs flex items-center gap-1 hover:text-d2e-primary transition-colors">
                        <span className="material-symbols-outlined text-sm">home</span>
                        <span>Back to main site</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
