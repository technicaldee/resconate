import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { apiFetch } from '../../../src/utils/api';

export default function VerificationCenter() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await apiFetch('/api/d2e/me');
                const data = await res.json();
                if (data.success) {
                    setUser(data.earner);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-d2e-bg-light dark:bg-d2e-bg-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-d2e-primary"></div>
            </div>
        );
    }

    const verificationSteps = [
        {
            id: 'identity',
            title: 'Identity Verification',
            description: 'Verify your ID with NIN or BVN',
            icon: 'badge',
            status: user?.nin ? 'Completed' : 'Pending',
            link: '/d2e/verification/nin'
        },
        {
            id: 'bank',
            title: 'Bank Verification',
            description: 'Link your payout bank account',
            icon: 'account_balance',
            status: user?.bank_details ? 'Completed' : 'Pending',
            link: '/d2e/verification/bank'
        },
        {
            id: 'selfie',
            title: 'Selfie Verification',
            description: 'Face match for account safety',
            icon: 'face',
            status: 'Pending',
            link: '#'
        }
    ];

    return (
        <div className="bg-d2e-bg-light dark:bg-d2e-bg-dark text-slate-900 dark:text-white font-display min-h-screen pb-20">
            <Head>
                <title>Verification Center - D2E</title>
            </Head>

            <header className="sticky top-0 z-50 bg-d2e-bg-light/80 dark:bg-d2e-bg-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 p-4">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <button onClick={() => router.back()} className="flex items-center justify-center h-10 w-10">
                        <span className="material-symbols-outlined">arrow_back_ios</span>
                    </button>
                    <h2 className="text-lg font-bold">Verification Center</h2>
                    <div className="w-10"></div>
                </div>
            </header>

            <main className="max-w-md mx-auto p-4 pt-6">
                <div className="bg-gradient-to-br from-d2e-primary/20 to-emerald-500/10 rounded-2xl p-6 mb-8 border border-d2e-primary/20">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-16 w-16 rounded-full bg-d2e-primary flex items-center justify-center text-d2e-bg-dark">
                            <span className="material-symbols-outlined !text-3xl font-bold">verified</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Get Verified</h3>
                            <p className="text-sm text-slate-500 dark:text-gray-400">Complete verification to unlock higher withdrawal limits and premium tasks.</p>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-d2e-primary">
                            <span>Verification Progress</span>
                            <span>{user?.is_verified ? '100%' : '33%'}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-d2e-primary rounded-full transition-all duration-500" style={{ width: user?.is_verified ? '100%' : '33%' }}></div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {verificationSteps.map((step) => (
                        <Link href={step.link} key={step.id}>
                            <div className="flex items-center gap-4 bg-white dark:bg-[#1a2e1e] p-4 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm transition-transform active:scale-[0.98]">
                                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${step.status === 'Completed' ? 'bg-d2e-primary/10 text-d2e-primary' : 'bg-slate-100 dark:bg-gray-800 text-slate-401'}`}>
                                    <span className="material-symbols-outlined">{step.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">{step.title}</h4>
                                    <p className="text-xs text-slate-500 dark:text-gray-400">{step.description}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`text-[10px] font-bold uppercase ${step.status === 'Completed' ? 'text-d2e-primary' : 'text-amber-500'}`}>
                                        {step.status}
                                    </span>
                                    <span className="material-symbols-outlined text-gray-400 text-sm">chevron_right</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5">
                    <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-400 text-sm">info</span>
                        Why verify?
                    </h4>
                    <ul className="text-xs text-slate-500 dark:text-gray-400 space-y-2">
                        <li className="flex items-center gap-2">
                            <span className="h-1 w-1 bg-d2e-primary rounded-full"></span>
                            Unlock daily payouts and higher limits.
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="h-1 w-1 bg-d2e-primary rounded-full"></span>
                            Access exclusive "Verified Only" high-pay tasks.
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="h-1 w-1 bg-d2e-primary rounded-full"></span>
                            Earn the "Verified Earner" badge.
                        </li>
                    </ul>
                </div>
            </main>
        </div>
    );
}
