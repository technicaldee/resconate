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
        <div className="min-h-screen bg-d2e-bg-dark font-display flex items-center justify-center p-6 relative overflow-hidden">
            <Head>
                <title>Join D2E - Become an Earner</title>
            </Head>

            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-d2e-primary/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -ml-64 -mb-64"></div>

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

                {/* Visual Side */}
                <div className="hidden lg:flex flex-col justify-center space-y-10">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-d2e-primary/10 rounded-full border border-d2e-primary/20">
                            <span className="size-2 rounded-full bg-d2e-primary animate-pulse"></span>
                            <span className="text-[10px] font-black text-d2e-primary uppercase tracking-[0.2em]">Earner Recruitment</span>
                        </div>
                        <h1 className="text-6xl xl:text-7xl font-black text-white leading-[0.9] tracking-tighter">
                            Start Your <br />
                            <span className="text-d2e-primary">Digital Hustle</span> <br />
                            Today.
                        </h1>
                        <p className="text-xl text-gray-400 max-w-md font-medium leading-relaxed">
                            Join over 50,000+ active earners completing micro-tasks for global brands and local startups.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-3xl">
                            <span className="material-symbols-outlined text-d2e-primary !text-4xl mb-4">bolt</span>
                            <h4 className="text-white font-black uppercase text-xs tracking-widest mb-1">Fast Payouts</h4>
                            <p className="text-slate-400 text-xs">Direct to bank in 24 hours.</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-3xl">
                            <span className="material-symbols-outlined text-d2e-primary !text-4xl mb-4">public</span>
                            <h4 className="text-white font-black uppercase text-xs tracking-widest mb-1">Global Tasks</h4>
                            <p className="text-slate-400 text-xs">Access missions worldwide.</p>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="flex flex-col items-center lg:items-end">
                    <div className="w-full max-w-[520px] bg-d2e-surface-dark p-8 md:p-14 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-d2e-primary to-emerald-500"></div>

                        <div className="mb-10 lg:hidden">
                            <div className="h-20 w-20 bg-d2e-primary/10 rounded-3xl flex items-center justify-center mb-6 border border-d2e-primary/20 shadow-inner">
                                <span className="material-symbols-outlined !text-4xl text-d2e-primary">person_add</span>
                            </div>
                            <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">Join the Squad</h2>
                            <p className="text-gray-400 font-medium">Create your earner profile to get started.</p>
                        </div>

                        {/* Step Progress Indicator (Visual only) */}
                        <div className="flex gap-3 mb-12">
                            <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-d2e-primary box-shadow-d2e' : 'bg-white/5'}`}></div>
                            <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-d2e-primary box-shadow-d2e' : 'bg-white/5'}`}></div>
                        </div>

                        {error && (
                            <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-2xl text-center font-black uppercase tracking-widest animate-shake">
                                {error}
                            </div>
                        )}

                        {step === 1 ? (
                            <form onSubmit={handleRegister} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Identity</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-d2e-primary transition-colors">person</span>
                                        <input
                                            name="fullName"
                                            type="text"
                                            required
                                            className="w-full bg-d2e-bg-dark border border-white/5 rounded-2xl h-16 pl-14 pr-6 text-base font-bold focus:ring-2 focus:ring-d2e-primary/20 focus:border-d2e-primary outline-none transition-all text-white placeholder:text-white/10"
                                            placeholder="Johnathan Doe"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Communication Channel</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-d2e-primary transition-colors">alternate_email</span>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            className="w-full bg-d2e-bg-dark border border-white/5 rounded-2xl h-16 pl-14 pr-6 text-base font-bold focus:ring-2 focus:ring-d2e-primary/20 focus:border-d2e-primary outline-none transition-all text-white placeholder:text-white/10"
                                            placeholder="name@ecosystem.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Secure Passcode</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-d2e-primary transition-colors">lock_open</span>
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            className="w-full bg-slate-50 dark:bg-d2e-bg-dark border border-slate-200 dark:border-white/5 rounded-2xl h-16 pl-14 pr-14 text-base font-bold focus:ring-2 focus:ring-d2e-primary/20 focus:border-d2e-primary outline-none transition-all dark:text-white placeholder:text-slate-300 dark:placeholder:text-white/10"
                                            placeholder="••••••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-18 bg-d2e-primary hover:bg-d2e-primary/95 text-d2e-bg-dark font-black rounded-2xl shadow-2xl shadow-d2e-primary/20 transition-all active:scale-[0.98] flex justify-center items-center gap-4 text-lg uppercase tracking-widest disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-6 w-6 border-3 border-d2e-bg-dark border-t-transparent"></div>
                                    ) : (
                                        <>
                                            <span>Initialize Profile</span>
                                            <span className="material-symbols-outlined font-black">arrow_forward</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-6">
                                <div className="size-24 bg-d2e-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                                    <span className="material-symbols-outlined !text-5xl text-d2e-primary">verified</span>
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">Welcome Aboard! 🎉</h2>
                                <p className="text-slate-500 dark:text-gray-400 font-medium mb-12 leading-relaxed">
                                    Your gateway to the D2E ecosystem is active. Now, let's establish your security credentials.
                                </p>

                                <div className="space-y-4">
                                    <Link href="/d2e/verification" className="w-full h-18 bg-d2e-primary hover:bg-d2e-primary/90 text-d2e-bg-dark font-black rounded-2xl shadow-2xl shadow-d2e-primary/20 transition-all active:scale-[0.98] flex justify-center items-center text-lg uppercase tracking-widest">
                                        Commence Verification
                                    </Link>
                                    <Link href="/d2e/dashboard" className="w-full h-14 bg-white/5 border border-white/10 text-slate-400 font-black rounded-2xl flex justify-center items-center text-xs uppercase tracking-widest hover:text-white transition-colors">
                                        Enter Dashboard
                                    </Link>
                                </div>
                            </div>
                        )}

                        <div className="mt-12 text-center border-t border-slate-100 dark:border-white/5 pt-8">
                            <p className="text-slate-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">
                                Profile already active? <Link href="/d2e/login" className="text-d2e-primary hover:underline underline-offset-4 decoration-2">Secure Login</Link>
                            </p>
                        </div>
                    </div>

                    <Link href="/" className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-d2e-primary transition-colors">
                        <span className="material-symbols-outlined !text-sm">arrow_back</span>
                        Back to main portal
                    </Link>
                </div>
            </div>
        </div>
    );
}
