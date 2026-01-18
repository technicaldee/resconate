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
        <div className="bg-d2e-bg-light dark:bg-d2e-bg-dark text-slate-900 dark:text-white font-display min-h-screen pb-32">
            <Head>
                <title>Verification Center - D2E</title>
            </Head>

            <nav className="sticky top-0 z-50 bg-d2e-bg-light/80 dark:bg-d2e-bg-dark/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button onClick={() => router.back()} className="flex size-10 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined">arrow_back_ios</span>
                    </button>
                    <h2 className="text-lg font-black uppercase tracking-widest text-center flex-1">Security Prototypes</h2>
                    <div className="w-10"></div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Left: Status Summary */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-gradient-to-br from-d2e-primary to-emerald-600 rounded-[2.5rem] p-10 text-d2e-bg-dark shadow-2xl relative overflow-hidden group">
                            <div className="absolute -right-10 -bottom-10 size-64 bg-black/5 rounded-full blur-3xl group-hover:bg-black/10 transition-colors"></div>

                            <div className="relative z-10">
                                <div className="size-20 bg-d2e-bg-dark rounded-3xl flex items-center justify-center mb-8 shadow-xl">
                                    <span className="material-symbols-outlined !text-4xl text-d2e-primary animate-pulse">verified_user</span>
                                </div>
                                <h3 className="text-4xl font-black mb-4 tracking-tighter leading-none">Verify your <br />Digital Identity.</h3>
                                <p className="text-d2e-bg-dark/70 text-base font-bold mb-10 leading-relaxed">
                                    Complete the security protocols to unlock premium withdrawal channels and elite-tier missions.
                                </p>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-d2e-bg-dark/60">
                                        <span>System Integration</span>
                                        <span>{user?.is_verified ? '100%' : '33%'} Complete</span>
                                    </div>
                                    <div className="h-4 w-full bg-d2e-bg-dark/10 rounded-full overflow-hidden p-1">
                                        <div className="h-full bg-d2e-bg-dark rounded-full transition-all duration-1000 ease-out" style={{ width: user?.is_verified ? '100%' : '33%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-d2e-surface-dark rounded-3xl p-8 border border-slate-100 dark:border-white/5 space-y-6 shadow-sm">
                            <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500">info</span>
                                Verification Benefits
                            </h4>
                            <div className="space-y-4">
                                {[
                                    { icon: 'payouts', label: 'Instant Daily Payouts', desc: 'No more waiting for weekly cycles.' },
                                    { icon: 'star', label: 'Elite Tier Access', desc: 'Unlock tasks with 5x higher rewards.' },
                                    { icon: 'shield_person', label: 'Priority Support', desc: 'Dedicated security desk for your account.' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="size-10 rounded-xl bg-slate-50 dark:bg-d2e-bg-dark flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-d2e-primary text-xl">{item.icon}</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest">{item.label}</p>
                                            <p className="text-[11px] text-slate-400 font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Steps */}
                    <div className="lg:col-span-7 space-y-4">
                        <h3 className="text-xl font-black uppercase tracking-tight mb-6 ml-2">Verification Protocols</h3>
                        <div className="space-y-4">
                            {verificationSteps.map((step) => (
                                <Link href={step.link} key={step.id} className="block group">
                                    <div className="flex items-center gap-6 bg-white dark:bg-d2e-surface-dark p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-sm group-hover:border-d2e-primary/30 transition-all group-active:scale-[0.98]">
                                        <div className={`size-16 rounded-2xl flex items-center justify-center transition-all ${step.status === 'Completed' ? 'bg-d2e-primary/10 text-d2e-primary shadow-lg shadow-d2e-primary/5' : 'bg-slate-50 dark:bg-d2e-bg-dark text-slate-400'}`}>
                                            <span className="material-symbols-outlined !text-3xl">{step.icon}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-lg mb-1">{step.title}</h4>
                                            <p className="text-sm text-slate-400 font-medium">{step.description}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-3">
                                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${step.status === 'Completed' ? 'bg-d2e-primary/10 text-d2e-primary' : 'bg-amber-500/10 text-amber-500'}`}>
                                                {step.status}
                                            </div>
                                            <span className="material-symbols-outlined text-slate-300 group-hover:text-d2e-primary transition-colors">arrow_forward</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-12 p-10 bg-slate-50 dark:bg-d2e-surface-dark/40 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/10 text-center">
                            <span className="material-symbols-outlined text-4xl text-slate-200 mb-4">help</span>
                            <h4 className="text-base font-black uppercase tracking-widest mb-2">Need Assistance?</h4>
                            <p className="text-sm text-slate-400 max-w-sm mx-auto font-medium">If you're having trouble with identity verification, please contact our security dispatch.</p>
                            <button className="mt-6 px-8 h-12 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-d2e-primary transition-all">Open Security Ticket</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
