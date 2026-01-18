import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { apiFetch } from '../../src/utils/api';

export default function MyWallet() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const userRes = await apiFetch('/api/d2e/me');
                const userData = await userRes.json();
                if (userData.success) {
                    setUser(userData.earner);
                }

                const statsRes = await apiFetch('/api/d2e/stats');
                const statsData = await statsRes.json();
                if (statsData.success) {
                    setData(statsData.data);
                }
            } catch (err) {
                console.error('Wallet load error', err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-d2e-bg-light dark:bg-d2e-bg-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-d2e-primary"></div>
            </div>
        );
    }

    const { wallet, claims } = data || { wallet: { available_balance: 0, pending_balance: 0 }, claims: [] };

    return (
        <div className="bg-d2e-bg-light dark:bg-d2e-bg-dark text-slate-900 dark:text-white transition-colors duration-300 min-h-screen pb-24">
            <Head>
                <title>My Wallet - D2E Marketplace</title>
            </Head>

            {/* TopAppBar */}
            <div className="sticky top-0 z-50 bg-d2e-bg-light/80 dark:bg-d2e-bg-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="text-slate-900 dark:text-white flex size-10 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus:outline-none"
                    >
                        <span className="material-symbols-outlined cursor-pointer">arrow_back_ios</span>
                    </button>
                    <h2 className="text-slate-900 dark:text-white text-lg font-black uppercase tracking-widest text-center flex-1">My Wallet</h2>
                    <div className="flex w-10 items-center justify-end">
                        <button className="flex size-10 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus:outline-none">
                            <span className="material-symbols-outlined">settings</span>
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Balance & Bank Info */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* Wallet Balance Card */}
                        <div className="flex flex-col items-stretch justify-start rounded-[2.5rem] shadow-2xl shadow-d2e-primary/10 bg-white dark:bg-d2e-surface-dark border border-slate-200 dark:border-white/5 overflow-hidden group">
                            <div className="w-full h-32 bg-gradient-to-br from-d2e-primary/30 to-emerald-500/10 relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #13ec5b 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                                <div className="absolute -right-8 -top-8 size-32 bg-d2e-primary/10 rounded-full blur-3xl group-hover:bg-d2e-primary/20 transition-colors"></div>
                            </div>
                            <div className="flex w-full flex-col items-stretch justify-center gap-2 py-8 px-8 -mt-12 bg-white dark:bg-d2e-surface-dark rounded-t-[2.5rem] relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="size-6 rounded-full bg-d2e-primary/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-d2e-primary text-[10px] font-black">verified</span>
                                    </div>
                                    <p className="text-d2e-primary text-[10px] font-black uppercase tracking-widest leading-normal">
                                        {user?.is_verified ? 'Verified Premium Wallet' : 'KYC Level 1: Pending'}
                                    </p>
                                </div>
                                <div className="flex flex-col mb-6">
                                    <p className="text-slate-400 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Available Funds</p>
                                    <p className="text-slate-900 dark:text-white text-5xl font-black leading-tight tracking-tighter">₦{parseFloat(wallet.available_balance).toLocaleString()}</p>
                                </div>
                                <button className="flex w-full cursor-pointer items-center justify-center rounded-2xl h-14 px-8 bg-d2e-primary text-d2e-bg-dark text-base font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-xl shadow-d2e-primary/30 hover:shadow-d2e-primary/50">
                                    <span>Withdraw Funds</span>
                                </button>
                            </div>
                        </div>

                        {/* Bank Account Section */}
                        <div className="bg-white dark:bg-d2e-surface-dark rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-slate-900 dark:text-white text-base font-black uppercase tracking-widest">Linked Bank</h3>
                                <Link href="/d2e/verification/bank" className="text-d2e-primary text-[10px] font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Change</Link>
                            </div>
                            <div className="flex items-center gap-5 bg-slate-50 dark:bg-d2e-accent-dark/40 rounded-2xl p-5 justify-between group hover:bg-slate-100 dark:hover:bg-d2e-accent-dark/60 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="bg-d2e-primary/10 rounded-xl flex items-center justify-center size-14 shrink-0 transition-transform group-hover:rotate-12">
                                        <span className="material-symbols-outlined text-d2e-primary text-3xl">account_balance</span>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <p className="text-slate-900 dark:text-white text-lg font-black leading-tight mb-0.5">Zenith Bank PLC</p>
                                        <p className="text-slate-500 dark:text-gray-400 text-xs font-bold font-mono tracking-wider italic">1234****890 • {user?.full_name?.toUpperCase() || 'OLUSEGUN J.'}</p>
                                    </div>
                                </div>
                                <div className="shrink-0 text-slate-300 dark:text-white/20 hover:text-d2e-primary transition-colors cursor-pointer">
                                    <span className="material-symbols-outlined">edit_square</span>
                                </div>
                            </div>
                        </div>

                        {/* Fast Actions */}
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                            {[
                                { icon: 'add_circle', label: 'Top-up' },
                                { icon: 'payments', label: 'Auto-pay' },
                                { icon: 'receipt_long', label: 'Reports' }
                            ].map((action, idx) => (
                                <button key={idx} className="flex-1 flex flex-col items-center gap-3 p-5 rounded-3xl bg-white dark:bg-d2e-surface-dark border border-slate-200 dark:border-white/5 shadow-sm hover:border-d2e-primary/40 transition-all group">
                                    <div className="size-10 rounded-xl bg-slate-50 dark:bg-d2e-accent-dark flex items-center justify-center text-slate-500 dark:text-gray-400 group-hover:bg-d2e-primary/10 group-hover:text-d2e-primary transition-colors">
                                        <span className="material-symbols-outlined text-xl">{action.icon}</span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Recent Activity */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-slate-900 dark:text-white text-2xl font-black uppercase tracking-tight">Recent Activity</h3>
                            <button className="size-10 rounded-xl bg-white dark:bg-d2e-surface-dark border border-slate-100 dark:border-white/5 shadow-sm flex items-center justify-center text-slate-400 hover:text-d2e-primary transition-colors">
                                <span className="material-symbols-outlined">tune</span>
                            </button>
                        </div>

                        <div className="bg-white dark:bg-d2e-surface-dark rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
                            {claims.length > 0 ? (
                                <div className="divide-y divide-slate-50 dark:divide-white/5">
                                    {claims.map((claim) => (
                                        <div key={claim.id} className="flex items-center gap-5 p-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                                            <div className={`rounded-2xl flex items-center justify-center size-14 shrink-0 transition-all group-hover:scale-110 ${claim.status === 'APPROVED' ? 'bg-d2e-primary/10 shadow-lg shadow-d2e-primary/5' : 'bg-amber-500/10'}`}>
                                                <span className={`material-symbols-outlined text-2xl ${claim.status === 'APPROVED' ? 'text-d2e-primary' : 'text-amber-500'}`}>
                                                    {claim.status === 'APPROVED' ? 'check_circle' : 'hourglass_top'}
                                                </span>
                                            </div>
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <p className="text-slate-900 dark:text-white text-base font-black leading-tight mb-1 truncate">{claim.task_title}</p>
                                                <p className="text-slate-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                                    {new Date(claim.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(claim.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-d2e-primary text-lg font-black tracking-tight">+₦{parseFloat(claim.amount).toLocaleString()}</p>
                                                <p className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md inline-block ${claim.status === 'APPROVED' ? 'bg-d2e-primary/10 text-d2e-primary' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                                                    {claim.status}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-32 px-10">
                                    <div className="size-20 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-6">
                                        <span className="material-symbols-outlined text-4xl text-slate-200">receipt_long</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-gray-400 font-bold text-lg mb-2">No Transactions Yet</p>
                                    <p className="text-slate-400 dark:text-gray-500 text-sm max-w-xs mx-auto">Start completing tasks from the marketplace to earn and fill your wallet!</p>
                                    <Link href="/d2e/tasks">
                                        <button className="mt-8 h-10 px-8 bg-d2e-primary text-d2e-bg-dark text-xs font-black uppercase tracking-widest rounded-xl">Go Explore</button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Sticky Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 dark:bg-[#112217]/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 px-8 pb-4 z-50">
                <div className="max-w-lg mx-auto w-full h-full flex justify-between items-center">
                    <Link href="/d2e/dashboard" className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-d2e-primary transition-colors">
                        <span className="material-symbols-outlined">home</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
                    </Link>
                    <Link href="/d2e/tasks" className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-d2e-primary transition-colors">
                        <span className="material-symbols-outlined">explore</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Market</span>
                    </Link>
                    <Link href="/d2e/wallet" className="flex flex-col items-center gap-1.5 text-d2e-primary">
                        <span className="material-symbols-outlined fill-[1]">account_balance_wallet</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Wallet</span>
                    </Link>
                    <Link href="/d2e/dashboard?tab=profile" className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-d2e-primary transition-colors">
                        <span className="material-symbols-outlined">person</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Profile</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
