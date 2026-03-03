import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

const PlanSelection = () => {
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

    const selectPlan = async (plan) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/hr/lite/business/${businessId}/onboarding`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('hr_lite_token')}`
                },
                body: JSON.stringify({ plan, onboarding_step: 2 })
            });
            const data = await res.json();
            if (data.success) {
                router.push('/hr/lite/onboarding/profile');
            } else {
                alert('Failed to save plan. Please try again.');
            }
        } catch (err) {
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-cloaka-bg-light dark:bg-cloaka-bg-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
            <Head>
                <title>Select Plan | Resconate HR Lite</title>
            </Head>
            <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
                <header className="flex items-center justify-between border-b border-solid border-slate-200 dark:border-slate-800 px-8 py-6 bg-white dark:bg-slate-900">
                    <div className="flex items-center gap-4 text-cloaka-primary">
                        <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center">
                            <img src="/RLogo.png" alt="R" className="w-5 h-5 brightness-0 invert" />
                        </div>
                        <h2 className="text-slate-900 dark:text-white text-lg font-black tracking-tighter">Resconate HR Lite</h2>
                    </div>
                </header>

                <main className="flex-1 flex flex-col items-center py-12 px-4 md:px-10">
                    <div className="max-w-5xl w-full">
                        <div className="text-center mb-16">
                            <h1 className="text-5xl font-black mb-6 tracking-tighter">Choose your path.</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl mx-auto">From side hustles to established SMEs, we have a tier that scales with your ambition.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    name: 'Starter',
                                    price: 'Free',
                                    desc: 'Ideal for solo entrepreneurs.',
                                    features: ['5 recipients', 'Basic analytics', 'Community support'],
                                    popular: false
                                },
                                {
                                    name: 'Growth',
                                    price: '₦15,000',
                                    desc: 'For growing teams of up to 50.',
                                    features: ['50 recipients', 'WhatsApp triggers', 'Priority support', 'Webhooks'],
                                    popular: true
                                },
                                {
                                    name: 'Scale',
                                    price: '₦35,000',
                                    desc: 'Unlimited power for large firms.',
                                    features: ['Unlimited recipients', 'Multi-admin access', 'Dedicated manager', 'Full API'],
                                    popular: false
                                }
                            ].map((p, i) => (
                                <div key={i} className={`flex flex-col relative p-8 rounded-[40px] border-2 transition-all group ${p.popular ? 'border-indigo-500 bg-white dark:bg-slate-900 shadow-2xl shadow-indigo-500/10 scale-105 z-10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700'}`}>
                                    {p.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">Most Popular</div>
                                    )}
                                    <div className="mb-8">
                                        <h3 className={`text-sm font-black uppercase tracking-widest mb-1 ${p.popular ? 'text-indigo-500' : 'text-slate-400'}`}>{p.name}</h3>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black tracking-tight">{p.price}</span>
                                            <span className="text-xs font-bold text-slate-400">/mo</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => selectPlan(p.name)}
                                        disabled={loading}
                                        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all mb-8 ${p.popular ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                    >
                                        {loading ? 'Processing...' : `Select ${p.name}`}
                                    </button>

                                    <div className="space-y-4">
                                        {p.features.map((f, j) => (
                                            <div key={j} className="flex items-center gap-3">
                                                <span className={`material-symbols-outlined text-xl ${p.popular ? 'text-indigo-500' : 'text-slate-300'}`}>check_circle</span>
                                                <span className="text-sm font-bold opacity-80">{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PlanSelection;
