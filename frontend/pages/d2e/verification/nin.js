import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { apiFetch } from '../../../src/utils/api';

export default function NINVerification() {
    const router = useRouter();
    const [nin, setNin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (nin.length !== 11) {
            setError('NIN must be 11 digits long.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            // In a real app, this would hit an identity verification service
            const res = await apiFetch('/api/d2e/verify-nin', {
                method: 'POST',
                body: JSON.stringify({ nin })
            });
            const data = await res.json();
            if (data.success) {
                alert('NIN submitted for verification!');
                router.push('/d2e/verification');
            } else {
                setError(data.error || 'Failed to verify NIN');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-d2e-bg-light dark:bg-d2e-bg-dark text-slate-900 dark:text-white font-display min-h-screen">
            <Head>
                <title>NIN Verification - D2E</title>
            </Head>

            <nav className="sticky top-0 z-50 bg-d2e-bg-light/80 dark:bg-d2e-bg-dark/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button onClick={() => router.back()} className="flex size-10 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined">arrow_back_ios</span>
                    </button>
                    <h2 className="text-lg font-black uppercase tracking-widest text-center flex-1">Identity Protocol</h2>
                    <div className="w-10"></div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-center">
                    <div className="w-full max-w-2xl">
                        <div className="bg-white dark:bg-d2e-surface-dark rounded-[3rem] p-8 md:p-16 border border-slate-200 dark:border-white/5 shadow-2xl relative overflow-hidden text-center">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-d2e-primary to-emerald-500"></div>

                            <div className="mb-12">
                                <div className="size-24 bg-d2e-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transition-transform hover:scale-110">
                                    <span className="material-symbols-outlined !text-5xl text-d2e-primary">fingerprint</span>
                                </div>
                                <h3 className="text-4xl font-black mb-4 tracking-tighter">Secure Identity.</h3>
                                <p className="text-slate-500 dark:text-gray-400 text-base font-medium max-w-sm mx-auto">
                                    Input your 11-digit National Identification Number. We use enterprise-grade encryption for all government ID processing.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-10">
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Government Identifier (NIN)</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={11}
                                            placeholder="0000 0000 000"
                                            className="w-full bg-slate-50 dark:bg-d2e-bg-dark border-2 border-slate-100 dark:border-white/5 rounded-[2rem] h-20 text-center text-3xl font-black tracking-[0.3em] focus:ring-4 focus:ring-d2e-primary/10 focus:border-d2e-primary outline-none transition-all dark:text-white placeholder:opacity-10"
                                            value={nin}
                                            onChange={(e) => setNin(e.target.value.replace(/\D/g, ''))}
                                            required
                                        />
                                    </div>
                                    {error && (
                                        <p className="text-red-500 text-xs font-black uppercase tracking-widest animate-bounce">
                                            {error}
                                        </p>
                                    )}
                                </div>

                                <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex gap-4 text-left">
                                    <span className="material-symbols-outlined text-amber-500 shrink-0">security</span>
                                    <p className="text-[11px] text-amber-700 dark:text-amber-400 font-bold leading-relaxed">
                                        PRIVACY NOTICE: Your National Identification Number is verified against our secure identity provider and is never stored in its plain-text form on our servers.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || nin.length !== 11}
                                    className="w-full h-20 bg-d2e-primary hover:bg-d2e-primary/95 text-d2e-bg-dark font-black rounded-[2rem] shadow-2xl shadow-d2e-primary/20 transition-all active:scale-[0.98] disabled:opacity-30 text-xl uppercase tracking-widest group"
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-d2e-bg-dark border-t-transparent mx-auto"></div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-3">
                                            <span>Initialize Validation</span>
                                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                        </div>
                                    )}
                                </button>
                            </form>

                            <div className="mt-12 pt-12 border-t border-slate-100 dark:border-white/5">
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                    Lost your NIN? <a href="#" className="text-d2e-primary hover:underline underline-offset-4 decoration-2 transition-all">Request Retrieval Guide</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
