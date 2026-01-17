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
        <div className="bg-d2e-bg-light dark:bg-d2e-bg-dark text-slate-900 dark:text-white transition-colors duration-300 min-h-screen">
            <Head>
                <title>My Wallet - D2E Marketplace</title>
            </Head>

            <div className="relative flex h-auto min-h-screen w-full flex-col max-w-[480px] mx-auto bg-d2e-bg-light dark:bg-d2e-bg-dark overflow-x-hidden border-x border-slate-200 dark:border-white/5 pb-20">
                {/* TopAppBar */}
                <div className="sticky top-0 z-50 flex items-center bg-d2e-bg-light/80 dark:bg-d2e-bg-dark/80 backdrop-blur-md p-4 pb-2 justify-between">
                    <button
                        onClick={() => router.back()}
                        className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center focus:outline-none"
                    >
                        <span className="material-symbols-outlined cursor-pointer">arrow_back_ios</span>
                    </button>
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center font-display">My Wallet</h2>
                    <div className="flex w-12 items-center justify-end">
                        <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent text-slate-900 dark:text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0 focus:outline-none">
                            <span className="material-symbols-outlined">settings</span>
                        </button>
                    </div>
                </div>

                {/* Wallet Balance Card */}
                <div className="p-4">
                    <div className="flex flex-col items-stretch justify-start rounded-xl shadow-lg bg-white dark:bg-[#193322] border border-slate-200 dark:border-white/5 overflow-hidden">
                        {/* Abstract Pattern Background */}
                        <div className="w-full h-24 bg-gradient-to-br from-d2e-primary/20 to-d2e-primary/5 relative">
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #13ec5b 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
                        </div>
                        <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 px-6 -mt-10 bg-white dark:bg-[#193322] rounded-t-2xl relative z-10">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-d2e-primary text-sm">verified_user</span>
                                <p className="text-slate-500 dark:text-[#92c9a4] text-xs font-semibold uppercase tracking-wider leading-normal font-display">
                                    {user?.is_verified ? 'KYC Level 2: Verified' : 'KYC Level 1: Pending Verification'}
                                </p>
                            </div>
                            <p className="text-slate-900 dark:text-white text-4xl font-bold leading-tight tracking-[-0.015em] font-display">₦{parseFloat(wallet.available_balance).toLocaleString()}</p>
                            <div className="flex items-center gap-3 justify-between mt-4">
                                <div className="flex flex-col">
                                    <p className="text-slate-500 dark:text-[#92c9a4] text-sm font-normal leading-normal font-display">Available Balance</p>
                                    <p className="text-slate-400 dark:text-[#92c9a4]/60 text-[10px] font-normal leading-normal font-display">Last sync: Just now</p>
                                </div>
                                <button className="flex min-w-[120px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-d2e-primary text-[#112217] text-sm font-bold leading-normal transition-transform active:scale-95 shadow-md shadow-d2e-primary/20">
                                    <span className="truncate">Withdraw</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bank Account Section */}
                <div className="px-4">
                    <div className="flex items-center justify-between pt-4 pb-2">
                        <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] font-display">Linked Bank Account</h3>
                        <Link href="/d2e/kyc/bank" className="text-d2e-primary text-sm font-medium cursor-pointer">Change</Link>
                    </div>
                    <div className="flex items-center gap-4 bg-white dark:bg-[#193322]/40 border border-slate-200 dark:border-white/5 rounded-xl px-4 min-h-[72px] py-2 justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-d2e-primary/10 rounded-lg flex items-center justify-center h-12 w-12 shrink-0">
                                <span className="material-symbols-outlined text-d2e-primary">account_balance</span>
                            </div>
                            <div className="flex flex-col justify-center">
                                <p className="text-slate-900 dark:text-white text-base font-semibold leading-normal line-clamp-1 font-display">Zenith Bank PLC</p>
                                <p className="text-slate-500 dark:text-[#92c9a4] text-sm font-normal leading-normal line-clamp-2 font-display">1234****890 • {user?.full_name || 'Olusegun J.'}</p>
                            </div>
                        </div>
                        <div className="shrink-0 text-slate-400 dark:text-white/40 flex size-7 items-center justify-center cursor-pointer">
                            <span className="material-symbols-outlined text-xl">edit</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3 px-4 py-6 overflow-x-auto no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 whitespace-nowrap">
                        <span className="material-symbols-outlined text-sm">add_circle</span>
                        <span className="text-sm font-medium">Top-up</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 whitespace-nowrap">
                        <span className="material-symbols-outlined text-sm">payments</span>
                        <span className="text-sm font-medium">Auto-payout</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 whitespace-nowrap">
                        <span className="material-symbols-outlined text-sm">receipt_long</span>
                        <span className="text-sm font-medium">Statements</span>
                    </button>
                </div>

                {/* Recent Transactions */}
                <div className="flex-1 bg-white dark:bg-[#152a1b] rounded-t-[2rem] mt-2 shadow-2xl">
                    <div className="flex items-center justify-between px-6 pt-6 pb-2 text-white">
                        <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] font-display">Recent Activity</h3>
                        <span className="material-symbols-outlined text-slate-400 dark:text-[#92c9a4]">tune</span>
                    </div>
                    {/* Transaction List */}
                    <div className="space-y-1 pb-20">
                        {claims.length > 0 ? claims.map((claim) => (
                            <div key={claim.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                                <div className={`rounded-full flex items-center justify-center h-12 w-12 shrink-0 ${claim.status === 'APPROVED' ? 'bg-d2e-primary/10' : 'bg-blue-500/10'}`}>
                                    <span className={`material-symbols-outlined ${claim.status === 'APPROVED' ? 'text-d2e-primary' : 'text-blue-500'}`}>
                                        {claim.status === 'APPROVED' ? 'task_alt' : 'schedule'}
                                    </span>
                                </div>
                                <div className="flex flex-col flex-1">
                                    <p className="text-slate-900 dark:text-white text-base font-semibold leading-normal font-display">{claim.task_title}</p>
                                    <p className="text-slate-500 dark:text-[#92c9a4] text-xs font-normal font-display">
                                        {new Date(claim.created_at).toLocaleDateString()} • {new Date(claim.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-d2e-primary text-base font-bold font-display">+₦{parseFloat(claim.amount).toLocaleString()}</p>
                                    <p className="text-[10px] text-d2e-primary/60 font-medium uppercase tracking-tighter">{claim.status}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-20 px-6">
                                <p className="text-slate-500 dark:text-slate-400">No transactions yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Navigation Bar (iOS Style) */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/90 dark:bg-d2e-bg-dark/90 backdrop-blur-lg border-t border-slate-200 dark:border-white/5 px-6 py-3 flex justify-between items-center z-50">
                <Link href="/d2e/dashboard" className="flex flex-col items-center gap-1 cursor-pointer">
                    <span className="material-symbols-outlined text-slate-400">home</span>
                    <span className="text-[10px] font-medium text-slate-400 font-display">Home</span>
                </Link>
                <Link href="/d2e/tasks" className="flex flex-col items-center gap-1 cursor-pointer">
                    <span className="material-symbols-outlined text-slate-400">explore</span>
                    <span className="text-[10px] font-medium text-slate-400 font-display">Tasks</span>
                </Link>
                <Link href="/d2e/wallet" className="flex flex-col items-center gap-1 cursor-pointer relative text-d2e-primary">
                    <div className="absolute -top-1 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-d2e-bg-dark"></div>
                    <span className="material-symbols-outlined">account_balance_wallet</span>
                    <span className="text-[10px] font-medium font-display">Wallet</span>
                </Link>
                <Link href="/d2e/dashboard?tab=profile" className="flex flex-col items-center gap-1 cursor-pointer">
                    <span className="material-symbols-outlined text-slate-400">person</span>
                    <span className="text-[10px] font-medium text-slate-400 font-display">Profile</span>
                </Link>
            </div>
        </div>
    );
}
