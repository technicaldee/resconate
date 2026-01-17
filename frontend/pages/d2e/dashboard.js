import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { apiFetch } from '../../src/utils/api';

export default function EarnerDashboard() {
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
                console.error('Dashboard load error', err);
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

    const { wallet, stats, claims } = data || {
        wallet: { available_balance: 0, pending_balance: 0 },
        stats: { inReview: 0, completed: 0 },
        claims: []
    };

    return (
        <div className="bg-d2e-bg-light dark:bg-d2e-bg-dark font-display text-slate-900 dark:text-white antialiased min-h-screen flex flex-col pb-20">
            <Head>
                <title>Earner Dashboard - D2E Marketplace</title>
            </Head>

            {/* TopAppBar */}
            <header className="sticky top-0 z-10 flex items-center bg-d2e-bg-light dark:bg-d2e-bg-dark p-4 pb-2 justify-between border-b border-gray-200 dark:border-gray-800">
                <div className="flex size-10 shrink-0 items-center">
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 border-2 border-d2e-primary"
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBsWlfQIUjQ-goR7jya0Em6bX2n5PNqBviF8xzzHBHaCP4Dg1I1dfoplx5qum79pdw46rmcfWtxPVud_yjDW_X1gcittdLNx8co4YqAopcD5HDtX-n7l6r3iPv5BWnGpZuJ62Sq1IllsDVRAqQCcFkEgHb96IeosZsdh7l3VjEPg1ii7xLvJPvRSiMULl5kae9DkerRfIYhGcwk8p4JEUmFlaPqkGmlu6_coqbPKBlM8c-2QWRd32fxFWcxcA6Qbarser8h5qVd3g")' }}
                    ></div>
                </div>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">Earner Dashboard</h2>
                <div className="flex w-10 items-center justify-end">
                    <button className="flex cursor-pointer items-center justify-center rounded-lg h-10 w-10 bg-transparent text-slate-900 dark:text-white">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-[430px] mx-auto w-full">
                {/* ProfileHeader */}
                <div className="flex p-4">
                    <div className="flex w-full flex-col gap-4">
                        <div className="flex gap-4">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-xl min-h-20 w-20 shadow-lg flex items-center justify-center text-white"
                                style={{ backgroundImage: 'linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)' }}
                            >
                                <span className="material-symbols-outlined !text-4xl text-white">military_tech</span>
                            </div>
                            <div className="flex flex-col justify-center">
                                <p className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-tight">Hi, {user?.full_name?.split(' ')[0] || 'Earner'}</p>
                                <p className="text-d2e-primary text-base font-semibold leading-normal">
                                    {user?.is_verified ? 'Verified Earner' : 'Standard Earner'}
                                </p>
                                <div className="mt-1 h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-800">
                                    <div className="h-full rounded-full bg-d2e-primary" style={{ width: user?.is_verified ? '100%' : '33%' }}></div>
                                </div>
                                <p className="text-slate-500 dark:text-gray-400 text-xs mt-1">
                                    {user?.is_verified ? 'Verification complete' : 'Verification progress: 33%'}
                                </p>
                            </div>
                        </div>
                        <Link href="/d2e/verification">
                            <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-d2e-primary/10 text-d2e-primary border border-d2e-primary/20 text-sm font-bold leading-normal tracking-tight w-full">
                                <span className="truncate">{user?.is_verified ? 'Tier Benefits' : 'Complete Verification'}</span>
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Stats Section (Earnings) */}
                <div className="flex flex-wrap gap-4 p-4">
                    <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-5 bg-white dark:bg-[#1a2e1e] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-d2e-primary text-sm">account_balance_wallet</span>
                            <p className="text-slate-500 dark:text-gray-400 text-sm font-medium leading-normal">Available Balance</p>
                        </div>
                        <p className="text-slate-900 dark:text-white tracking-tight text-2xl font-bold leading-tight">₦{parseFloat(wallet.available_balance).toLocaleString()}</p>
                    </div>
                    <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-5 bg-white dark:bg-[#1a2e1e] border border-gray-100 dark:border-gray-800 shadow-sm opacity-90">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400 text-sm">schedule</span>
                            <p className="text-slate-500 dark:text-gray-400 text-sm font-medium leading-normal">Pending Balance</p>
                        </div>
                        <p className="text-slate-600 dark:text-gray-300 tracking-tight text-2xl font-bold leading-tight">₦{parseFloat(wallet.pending_balance).toLocaleString()}</p>
                    </div>
                </div>

                {/* SingleButton (Quick Action) */}
                <div className="flex px-4 py-2">
                    <Link href="/d2e/wallet" className="w-full">
                        <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 bg-d2e-primary text-d2e-bg-dark gap-2 text-base font-bold leading-normal tracking-tight shadow-lg shadow-d2e-primary/20">
                            <span className="material-symbols-outlined">payments</span>
                            <span className="truncate">Withdraw to Wallet</span>
                        </button>
                    </Link>
                </div>

                {/* SectionHeader: In-Review Tasks */}
                <div className="flex items-center justify-between px-4 pb-1 pt-6">
                    <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">Active Claims</h2>
                    <Link href="/d2e/dashboard?tab=tasks" className="text-d2e-primary text-sm font-semibold">View All</Link>
                </div>

                {/* Custom Task List Components */}
                <div className="flex flex-col gap-3 p-4">
                    {claims.length > 0 ? claims.map((claim) => (
                        <div key={claim.id} className="flex items-center gap-4 rounded-xl p-4 bg-white dark:bg-[#1a2e1e] border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-d2e-primary/10 text-d2e-primary">
                                <span className="material-symbols-outlined">description</span>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-slate-900 dark:text-white font-semibold truncate text-sm">{claim.task_title}</p>
                                <p className="text-slate-500 dark:text-gray-400 text-xs">
                                    {claim.status === 'SUBMITTED' ? `Submitted ${new Date(claim.submitted_at).toLocaleDateString()}` : `Claimed ${new Date(claim.created_at).toLocaleDateString()}`}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${claim.status === 'APPROVED' ? 'bg-green-500/10 text-green-500' :
                                        claim.status === 'SUBMITTED' ? 'bg-amber-500/10 text-amber-500' :
                                            claim.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                                                'bg-blue-500/10 text-blue-500'
                                    }`}>
                                    {claim.status.replace('_', ' ')}
                                </span>
                                <p className="text-slate-900 dark:text-white font-bold text-sm">₦{parseFloat(claim.amount).toLocaleString()}</p>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-10 bg-white/5 rounded-xl border border-dashed border-gray-700">
                            <p className="text-slate-400 text-sm">No active claims yet.</p>
                            <Link href="/d2e/tasks" className="text-d2e-primary text-sm mt-2 block font-semibold hover:underline">Browse Tasks</Link>
                        </div>
                    )}
                </div>

                {/* Active Tasks Summary */}
                <div className="m-4 rounded-xl bg-gradient-to-r from-d2e-primary to-emerald-500 p-[1px]">
                    <div className="rounded-xl bg-white dark:bg-d2e-bg-dark p-4 flex justify-between items-center text-white">
                        <div>
                            <p className="text-slate-900 dark:text-white font-bold text-lg">Earn More</p>
                            <p className="text-slate-500 dark:text-gray-400 text-sm">Check out newly posted tasks in the marketplace</p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-d2e-primary text-d2e-bg-dark">
                            <span className="material-symbols-outlined">rocket_launch</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* iOS Style Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 flex h-16 items-center justify-around bg-white dark:bg-[#112217] border-t border-gray-200 dark:border-gray-800 px-6 pb-2 z-50">
                <Link href="/d2e/dashboard" className="flex flex-col items-center gap-1 text-d2e-primary">
                    <span className="material-symbols-outlined">grid_view</span>
                    <span className="text-[10px] font-bold">Home</span>
                </Link>
                <Link href="/d2e/tasks" className="flex flex-col items-center gap-1 text-gray-500">
                    <span className="material-symbols-outlined">shopping_bag</span>
                    <span className="text-[10px] font-medium">Market</span>
                </Link>
                <Link href="/d2e/wallet" className="flex flex-col items-center gap-1 text-gray-500">
                    <span className="material-symbols-outlined">account_balance_wallet</span>
                    <span className="text-[10px] font-medium">Wallet</span>
                </Link>
                <Link href="/d2e/dashboard?tab=profile" className="flex flex-col items-center gap-1 text-gray-500">
                    <span className="material-symbols-outlined">person</span>
                    <span className="text-[10px] font-medium">Profile</span>
                </Link>
            </nav>
        </div>
    );
}
