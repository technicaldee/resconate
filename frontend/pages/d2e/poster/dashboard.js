import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { apiFetch } from '../../../src/utils/api';

export default function PosterDashboard() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const res = await apiFetch('/api/d2e/poster/stats');
                const statsData = await res.json();
                if (statsData.success) {
                    setData(statsData.data);
                }
            } catch (err) {
                console.error('Poster load error', err);
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

    const { wallet, activeTasks, pendingReview, recentTasks } = data || {
        wallet: { available_balance: 0 },
        activeTasks: 0,
        pendingReview: 0,
        recentTasks: []
    };

    return (
        <div className="bg-d2e-bg-light dark:bg-d2e-bg-dark font-display text-slate-900 dark:text-white antialiased min-h-screen pb-32">
            <Head>
                <title>Poster Dashboard - D2E</title>
            </Head>

            <nav className="sticky top-0 z-50 bg-d2e-bg-light/80 dark:bg-d2e-bg-dark/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="size-12 flex items-center justify-center rounded-2xl bg-d2e-primary shadow-lg shadow-d2e-primary/20">
                            <span className="material-symbols-outlined text-d2e-bg-dark font-black">campaign</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tight">Command Center</h2>
                            <p className="text-[10px] font-bold text-d2e-primary uppercase tracking-[0.2em]">Poster Portal</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="size-12 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-slate-50 transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <button className="size-12 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-slate-50 transition-colors">
                            <span className="material-symbols-outlined">settings</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left: Financial & Stats */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-gradient-to-br from-[#193322] to-d2e-bg-dark rounded-[2.5rem] p-10 shadow-2xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute -top-20 -right-20 size-64 bg-d2e-primary/10 rounded-full blur-[100px] group-hover:bg-d2e-primary/20 transition-all"></div>
                            <div className="relative z-10">
                                <p className="text-[#92c9a4] text-[10px] font-black uppercase tracking-[0.3em] mb-4">Escrow Reserve</p>
                                <h2 className="text-white text-5xl font-black tracking-tighter mb-10">₦{parseFloat(wallet.available_balance).toLocaleString()}</h2>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button className="flex-1 h-14 bg-d2e-primary text-d2e-bg-dark font-black rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-d2e-primary/20 uppercase tracking-widest text-xs">
                                        <span className="material-symbols-outlined text-xl">add_circle</span>
                                        Inject Funds
                                    </button>
                                    <button className="size-14 bg-white/5 text-white rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all">
                                        <span className="material-symbols-outlined">account_balance_wallet</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-d2e-surface-dark p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
                                <div className="size-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                                    <span className="material-symbols-outlined !text-2xl font-black">rocket_launch</span>
                                </div>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Active</p>
                                <h4 className="text-2xl font-black">{activeTasks} <span className="text-xs text-slate-400">Campaigns</span></h4>
                            </div>
                            <div className="bg-white dark:bg-d2e-surface-dark p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
                                <div className="size-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                                    <span className="material-symbols-outlined !text-2xl font-black">pending_actions</span>
                                </div>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Queue</p>
                                <h4 className="text-2xl font-black">{pendingReview} <span className="text-xs text-slate-400">Reviews</span></h4>
                            </div>
                        </div>
                    </div>

                    {/* Right: Campaigns */}
                    <div className="lg:col-span-8 space-y-8">
                        <Link href="/d2e/post-task" className="block group">
                            <div className="bg-d2e-primary/5 border-2 border-dashed border-d2e-primary/20 p-10 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-4 transition-all hover:bg-d2e-primary/10 hover:border-d2e-primary/40 cursor-pointer">
                                <div className="size-16 rounded-[1.5rem] bg-d2e-primary text-d2e-bg-dark flex items-center justify-center group-hover:scale-110 transition-all shadow-xl shadow-d2e-primary/20">
                                    <span className="material-symbols-outlined !text-3xl font-black">add</span>
                                </div>
                                <div>
                                    <h3 className="text-d2e-primary text-xl font-black uppercase tracking-widest">Post New Mission</h3>
                                    <p className="text-sm text-[#92c9a4] font-medium opacity-60">Deploy new tasks to the earner grid instantly</p>
                                </div>
                            </div>
                        </Link>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                    Deployment History
                                    <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-black text-slate-400 uppercase">{recentTasks.length} Units</span>
                                </h3>
                                <button className="text-d2e-primary text-xs font-black uppercase tracking-widest hover:underline underline-offset-4">Full Archive</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {recentTasks.length > 0 ? recentTasks.map((task) => (
                                    <div key={task.id} className="bg-white dark:bg-d2e-surface-dark border border-slate-100 dark:border-white/5 p-6 rounded-[2rem] flex flex-col justify-between gap-6 hover:shadow-xl transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="size-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                                                <div className="size-full bg-center bg-cover transition-transform group-hover:scale-110" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAnz5s8Tz_T3wRNoRzB8_k_GIsgE3W6_YfRIsXU7O-KjJvC6qfK3W_V6h88g2Yq_W7Q7W-X_Z-_T-X8Q=s160")' }}></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-black text-base leading-tight mb-2 truncate group-hover:text-d2e-primary transition-colors">{task.title}</h4>
                                                <div className="flex items-center gap-3">
                                                    <span className="px-2.5 py-1 rounded-lg bg-d2e-primary/10 text-d2e-primary text-[10px] font-black uppercase tracking-tighter">Active</span>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{task.filled}/{task.total} Slots Filled</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deployment Budget</span>
                                                <span className="text-xl font-black">₦{parseFloat(task.budget).toLocaleString()}</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 dark:bg-d2e-bg-dark rounded-full overflow-hidden p-0.5">
                                                <div className="h-full bg-d2e-primary rounded-full transition-all duration-1000 ease-out shadow-sm" style={{ width: `${(task.filled / task.total) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-20 bg-slate-50 dark:bg-d2e-surface-dark/40 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center text-center">
                                        <span className="material-symbols-outlined !text-5xl text-slate-200 mb-4">folder_open</span>
                                        <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No Active Deployments Found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Global Actions Nav */}
            <nav className="fixed bottom-0 left-0 right-0 h-24 bg-white/80 dark:bg-d2e-bg-dark/90 backdrop-blur-2xl border-t border-slate-200 dark:border-white/10 z-50">
                <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center lg:justify-center lg:gap-24">
                    {[
                        { icon: 'dashboard', label: 'Command', active: true },
                        { icon: 'assignment', label: 'Missions' },
                        { icon: 'group', label: 'Earner Grid' },
                        { icon: 'payments', label: 'Settlement' }
                    ].map((item, idx) => (
                        <div key={idx} className={`flex flex-col items-center gap-1.5 cursor-pointer transition-all ${item.active ? 'text-d2e-primary' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white hover:-translate-y-1'}`}>
                            <span className={`material-symbols-outlined !text-2xl ${item.active ? 'fill-1 font-black' : ''}`}>{item.icon}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                            {item.active && <div className="h-1.5 w-1.5 rounded-full bg-d2e-primary mt-0.5"></div>}
                        </div>
                    ))}
                </div>
            </nav>
        </div>
    );
}
