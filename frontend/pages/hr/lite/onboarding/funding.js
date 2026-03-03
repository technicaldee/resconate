import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

const ConnectFundingSource = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [businessId, setBusinessId] = useState(null);

    useEffect(() => {
        const id = localStorage.getItem('hr_lite_business_id');
        if (!id) {
            router.push('/hr/lite/signup');
        } else {
            setBusinessId(id);
        }
    }, []);

    const selectFunding = async (source) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/hr/lite/business/${businessId}/onboarding`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('hr_lite_token')}`
                },
                body: JSON.stringify({ funding_source: source, onboarding_step: 4 })
            });
            const data = await res.json();
            if (data.success) {
                router.push('/hr/lite/onboarding/checkout');
            } else {
                alert('Failed to save funding source.');
            }
        } catch (err) {
            alert('An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-cloaka-bg-light dark:bg-cloaka-bg-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
            <Head>
                <title>Connect Funding Source | Resconate HR Lite</title>
            </Head>
            <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
                <header className="flex items-center justify-between border-b border-solid border-slate-200 dark:border-slate-800 px-8 py-6 bg-white dark:bg-slate-900 font-black text-xs uppercase tracking-widest text-slate-400">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center">
                            <img src="/RLogo.png" alt="R" className="w-5 h-5 brightness-0 invert" />
                        </div>
                        <span>Resconate HR Lite</span>
                    </div>
                </header>

                <main className="flex-1 flex justify-center py-12 px-4 md:px-10">
                    <div className="flex flex-col w-full max-w-xl">
                        <div className="mb-12">
                            <h1 className="text-4xl font-black mb-3 tracking-tighter">Connect your funding.</h1>
                            <p className="text-slate-500 font-medium text-lg leading-relaxed">Choose how you want to fund your payroll. We support 20+ Nigerian banks and instant virtual accounts.</p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => selectFunding('Bank Account')}
                                disabled={loading}
                                className="w-full group flex items-center justify-between p-8 bg-white dark:bg-slate-900 rounded-[40px] border-2 border-slate-100 dark:border-slate-800 hover:border-indigo-500 transition-all shadow-sm hover:shadow-2xl relative overflow-hidden"
                            >
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <span className="material-symbols-outlined text-3xl font-black">account_balance</span>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-black text-xl">Bank Account</h3>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Verify via Mono</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 group-hover:text-indigo-500 transition-all font-black">arrow_forward</span>
                            </button>

                            <button
                                onClick={() => selectFunding('Cloaka Wallet')}
                                disabled={loading}
                                className="w-full group flex items-center justify-between p-8 bg-white dark:bg-slate-900 rounded-[40px] border-2 border-slate-100 dark:border-slate-800 hover:border-indigo-500 transition-all shadow-sm hover:shadow-2xl relative overflow-hidden"
                            >
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                        <span className="material-symbols-outlined text-3xl font-black">account_balance_wallet</span>
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-black text-xl">Cloaka Wallet</h3>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Instant Activation</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 group-hover:text-emerald-500 transition-all font-black">arrow_forward</span>
                            </button>
                        </div>

                        <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                            <div className="flex gap-4">
                                <span className="material-symbols-outlined text-slate-400 mt-1">admin_panel_settings</span>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium italic">"Connecting your account doesn't allow us to initiate transactions without your explicit approval. We use bank-grade security protocols."</p>
                            </div>
                        </div>

                        <div className="mt-12 flex justify-between items-center px-4">
                            <button onClick={() => router.back()} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Go Back</button>
                            <button onClick={() => selectFunding('Deferred')} className="text-xs font-black uppercase tracking-widest text-indigo-500 hover:underline">Skip for now</button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ConnectFundingSource;
