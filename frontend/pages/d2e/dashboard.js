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
            <div className="min-h-screen bg-d2e-bg-dark flex items-center justify-center">
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
        <div className="bg-d2e-bg-dark font-display text-white antialiased min-h-screen flex flex-col pb-24">
            <Head>
                <title>Earner Dashboard - D2E Marketplace</title>
            </Head>

            {/* TopAppBar */}
            <header className="sticky top-0 z-50 flex items-center bg-d2e-bg-dark/80 backdrop-blur-md p-4 justify-between border-b border-white/10">
                <div className="flex max-w-7xl mx-auto w-full items-center justify-between">
                    <div className="flex size-10 shrink-0 items-center">
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border-2 border-d2e-primary shadow-sm"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBsWlfQIUjQ-goR7jya0Em6bX2n5PNqBviF8xzzHBHaCP4Dg1I1dfoplx5qum79pdw46rmcfWtxPVud_yjDW_X1gcittdLNx8co4YqAopcD5HDtX-n7l6r3iPv5BWnGpZuJ62Sq1IllsDVRAqQCcFkEgHb96IeosZsdh7l3VjEPg1ii7xLvJPvRSiMULl5kae9DkerRfIYhGcwk8p4JEUmFlaPqkGmlu6_coqbPKBlM8c-2QWRd32fxFWcxcA6Qbarser8h5qVd3g")' }}
                        ></div>
                    </div>
                    <h2 className="text-white text-lg font-black leading-tight tracking-tight uppercase">Dashboard</h2>
                    <div className="flex w-10 items-center justify-end">
                        <button className="flex cursor-pointer items-center justify-center rounded-xl h-10 w-10 bg-d2e-surface-dark border border-white/5 shadow-sm text-white transition-transform active:scale-95">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile & Stats */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* ProfileHeader */}
                        <div className="bg-d2e-surface-dark rounded-3xl p-6 border border-white/5 shadow-sm">
                            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                                <div
                                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-2xl size-24 shadow-xl flex items-center justify-center text-white"
                                    style={{ backgroundImage: 'linear-gradient(135deg, #13ec5b 0%, #0a8a3a 100%)' }}
                                >
                                    <span className="material-symbols-outlined !text-5xl text-d2e-bg-dark">military_tech</span>
                                </div>
                                <div className="flex flex-col justify-center flex-1">
                                    <p className="text-white text-3xl font-black leading-tight tracking-tight mb-1">Hi, {user?.full_name?.split(' ')[0] || 'Earner'}</p>
                                    <p className="text-d2e-primary text-sm font-bold uppercase tracking-widest mb-4">
                                        {user?.is_verified ? 'Verified Premium Earner' : 'Standard Earner'}
                                    </p>
                                    <div className="w-full max-w-sm mx-auto md:mx-0">
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-tighter text-gray-400 mb-2">
                                            <span>Verification Progress</span>
                                            <span>{user?.is_verified ? '100%' : '33%'}</span>
                                        </div>
                                        <div className="h-3 w-full rounded-full bg-d2e-accent-dark overflow-hidden">
                                            <div className="h-full rounded-full bg-gradient-to-r from-d2e-primary to-emerald-400 transition-all duration-1000" style={{ width: user?.is_verified ? '100%' : '33%' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-auto self-stretch flex md:items-center">
                                    <Link href="/d2e/verification" className="w-full">
                                        <button className="flex w-full md:min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-12 px-6 bg-d2e-primary/10 text-d2e-primary border border-d2e-primary/20 text-sm font-black uppercase tracking-wider hover:bg-d2e-primary hover:text-d2e-bg-dark transition-all">
                                            <span>{user?.is_verified ? 'Tier Benefits' : 'Complete KYC'}</span>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-4 rounded-3xl p-8 bg-d2e-surface-dark border border-white/5 shadow-sm group hover:border-d2e-primary/30 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="size-12 rounded-2xl bg-d2e-primary/10 text-d2e-primary flex items-center justify-center">
                                        <span className="material-symbols-outlined !text-2xl">account_balance_wallet</span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available</span>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm font-bold uppercase tracking-tighter mb-1">Balance</p>
                                    <p className="text-white tracking-tight text-4xl font-black">₦{parseFloat(wallet.available_balance).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 rounded-3xl p-8 bg-d2e-surface-dark border border-white/5 shadow-sm group hover:border-white/20 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="size-12 rounded-2xl bg-d2e-accent-dark text-gray-400 flex items-center justify-center">
                                        <span className="material-symbols-outlined !text-2xl">schedule</span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pending</span>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm font-bold uppercase tracking-tighter mb-1">Locked Funds</p>
                                    <p className="text-gray-300 tracking-tight text-4xl font-black">₦{parseFloat(wallet.pending_balance).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Action */}
                        <Link href="/d2e/wallet" className="block">
                            <button className="flex w-full cursor-pointer items-center justify-center rounded-2xl h-16 px-8 bg-d2e-primary text-d2e-bg-dark gap-3 text-lg font-black uppercase tracking-widest shadow-xl shadow-d2e-primary/20 hover:scale-[1.01] transition-transform active:scale-[0.99]">
                                <span className="material-symbols-outlined font-black">payments</span>
                                <span>Go to Wallet</span>
                            </button>
                        </Link>
                    </div>

                    {/* Right Column: Active Claims */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-white text-2xl font-black leading-tight tracking-tight uppercase">Active Claims</h2>
                            <Link href="/d2e/dashboard?tab=tasks" className="text-d2e-primary text-xs font-black uppercase tracking-widest border-b-2 border-d2e-primary/30 hover:border-d2e-primary pb-0.5 transition-all">View All</Link>
                        </div>

                        <div className="flex flex-col gap-4">
                            {claims.length > 0 ? claims.map((claim) => (
                                <div key={claim.id} className="flex items-center gap-4 rounded-2xl p-5 bg-d2e-surface-dark border border-white/5 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-d2e-primary/10 text-d2e-primary">
                                        <span className="material-symbols-outlined">description</span>
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-white font-bold truncate text-sm mb-0.5">{claim.task_title}</p>
                                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">
                                            {claim.status === 'SUBMITTED' ? `Sent ${new Date(claim.submitted_at).toLocaleDateString()}` : `Claimed ${new Date(claim.created_at).toLocaleDateString()}`}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${claim.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500' :
                                            claim.status === 'SUBMITTED' ? 'bg-amber-500/10 text-amber-500' :
                                                claim.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                                                    'bg-blue-500/10 text-blue-500'
                                            }`}>
                                            {claim.status.replace('_', ' ')}
                                        </span>
                                        <p className="text-white font-black text-sm">₦{parseFloat(claim.amount).toLocaleString()}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-16 px-6 bg-d2e-surface-dark rounded-3xl border-2 border-dashed border-white/5">
                                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">work_off</span>
                                    <p className="text-slate-500 font-bold mb-6">No active claims yet.</p>
                                    <Link href="/d2e/tasks" className="block mx-auto max-w-[200px]">
                                        <button className="w-full h-10 bg-d2e-primary text-d2e-bg-dark text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-d2e-primary/10">Browse Tasks</button>
                                    </Link>
                                </div>
                            )}

                            {/* Promotional Card */}
                            <div className="rounded-3xl bg-gradient-to-br from-d2e-primary to-emerald-600 p-8 text-d2e-bg-dark relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 transform scale-150 rotate-12 group-hover:rotate-45 transition-transform duration-500">
                                    <span className="material-symbols-outlined !text-9xl font-black">rocket_launch</span>
                                </div>
                                <div className="relative z-10">
                                    <p className="font-black text-2xl mb-2 leading-tight uppercase">Earn More Faster</p>
                                    <p className="text-d2e-bg-dark/80 text-sm font-bold leading-relaxed mb-6">Explore newly posted tasks with higher rewards and fewer slots remaining.</p>
                                    <Link href="/d2e/tasks">
                                        <button className="h-11 px-6 bg-d2e-bg-dark text-d2e-primary font-black uppercase tracking-widest rounded-xl text-xs hover:bg-black transition-colors">Start Earning</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* iOS Style Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 flex h-20 items-center justify-around bg-white/90 dark:bg-[#112217]/95 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 px-8 pb-4 z-50">
                <div className="flex max-w-lg mx-auto w-full justify-around items-center">
                    <Link href="/d2e/dashboard" className="flex flex-col items-center gap-1.5 text-d2e-primary">
                        <span className="material-symbols-outlined fill-[1]">grid_view</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Home</span>
                    </Link>
                    <Link href="/d2e/tasks" className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-d2e-primary transition-colors">
                        <span className="material-symbols-outlined">shopping_bag</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Market</span>
                    </Link>
                    <Link href="/d2e/wallet" className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-d2e-primary transition-colors">
                        <span className="material-symbols-outlined">account_balance_wallet</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Wallet</span>
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
