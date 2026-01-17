import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { setEarnerToken } from '../../src/utils/api';

export default function EarnerRegister() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/d2e/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                })
            });
            const result = await response.json();
            if (result.success) {
                setEarnerToken(result.token, true);
                setStep(2);
            } else {
                setError(result.error || 'Registration failed');
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
                <title>Join D2E - Become an Earner</title>
            </Head>

            <div className="max-w-md w-full">
                <div className="mb-8 text-center">
                    <div className="h-16 w-16 bg-d2e-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-d2e-primary/20 shadow-inner">
                        <span className="material-symbols-outlined !text-4xl text-d2e-primary">person_add</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Join the Squad</h1>
                    <p className="text-slate-500 dark:text-gray-400">Start earning money by completing tasks.</p>
                </div>

                <div className="bg-white dark:bg-[#1a2e1e] p-8 rounded-[2rem] border border-slate-200 dark:border-gray-800 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-d2e-primary"></div>

                    {/* Progress Steps */}
                    <div className="flex gap-2 mb-8 justify-center">
                        <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-d2e-primary' : 'bg-slate-200 dark:bg-gray-800'}`}></div>
                        <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-d2e-primary' : 'bg-slate-200 dark:bg-gray-800'}`}></div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl text-center font-bold">
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <form onSubmit={handleRegister} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Full Name</label>
                                <input
                                    name="fullName"
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 dark:bg-d2e-bg-dark border border-slate-200 dark:border-gray-800 rounded-xl h-14 px-6 text-base focus:ring-2 focus:ring-d2e-primary focus:border-transparent outline-none transition-all dark:text-white"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-slate-50 dark:bg-d2e-bg-dark border border-slate-200 dark:border-gray-800 rounded-xl h-14 px-6 text-base focus:ring-2 focus:ring-d2e-primary focus:border-transparent outline-none transition-all dark:text-white"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Phone Number</label>
                                <input
                                    name="phone"
                                    type="tel"
                                    required
                                    className="w-full bg-slate-50 dark:bg-d2e-bg-dark border border-slate-200 dark:border-gray-800 rounded-xl h-14 px-6 text-base focus:ring-2 focus:ring-d2e-primary focus:border-transparent outline-none transition-all dark:text-white"
                                    placeholder="080 1234 5678"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Password</label>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        className="w-full bg-slate-50 dark:bg-d2e-bg-dark border border-slate-200 dark:border-gray-800 rounded-xl h-14 px-4 text-base focus:ring-2 focus:ring-d2e-primary focus:border-transparent outline-none transition-all dark:text-white"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Confirm</label>
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        className="w-full bg-slate-50 dark:bg-d2e-bg-dark border border-slate-200 dark:border-gray-800 rounded-xl h-14 px-4 text-base focus:ring-2 focus:ring-d2e-primary focus:border-transparent outline-none transition-all dark:text-white"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 mt-4 bg-d2e-primary hover:bg-d2e-primary/90 text-d2e-bg-dark font-black rounded-xl shadow-lg shadow-d2e-primary/20 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-d2e-bg-dark border-t-transparent"></div>
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <div className="text-center py-6">
                            <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined !text-4xl text-green-500">check_circle</span>
                            </div>
                            <h2 className="text-2xl font-black mb-2">Welcome! 🎉</h2>
                            <p className="text-slate-500 dark:text-gray-400 mb-8">Your account is ready. Let's get you verified to start earning.</p>

                            <Link href="/d2e/verification" className="block w-full h-14 bg-d2e-primary hover:bg-d2e-primary/90 text-d2e-bg-dark font-black rounded-xl shadow-lg shadow-d2e-primary/20 transition-all active:scale-[0.98] flex justify-center items-center">
                                Start Verification
                            </Link>

                            <Link href="/d2e/dashboard" className="block mt-4 text-slate-400 text-sm font-bold hover:text-d2e-primary transition-colors">
                                Skip for now
                            </Link>
                        </div>
                    )}
                </div>

                <p className="mt-8 text-center text-sm text-slate-600 dark:text-gray-400">
                    Already have an account? <Link href="/d2e/login" className="text-d2e-primary font-bold hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
