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
        <div className="bg-d2e-bg-light dark:bg-d2e-bg-dark font-display text-slate-900 dark:text-white antialiased min-h-screen pb-24">
            <Head>
                <title>Poster Dashboard - D2E</title>
            </Head>

            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-d2e-bg-light/80 dark:bg-d2e-bg-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 p-4">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <div className="size-10 flex items-center justify-center rounded-xl bg-d2e-primary/10">
                        <span className="material-symbols-outlined text-d2e-primary font-bold">campaign</span>
                    </div>
                    <h2 className="text-lg font-bold">Poster Dashboard</h2>
                    <div className="size-10 flex items-center justify-end">
                        <span className="material-symbols-outlined">more_vert</span>
                    </div>
                </div>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-6">
                {/* Wallet Balance Card */}
                <div className="bg-gradient-to-br from-[#193322] to-d2e-bg-dark rounded-[2rem] p-6 shadow-xl border border-white/5 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 size-40 bg-d2e-primary/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <p className="text-[#92c9a4] text-xs font-bold uppercase tracking-[0.2em] mb-2">Available Budget</p>
                        <h2 className="text-white text-4xl font-black tracking-tight mb-6">₦{parseFloat(wallet.available_balance).toLocaleString()}</h2>
                        <div className="flex gap-3">
                            <button className="flex-1 h-12 bg-d2e-primary text-d2e-bg-dark font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-d2e-primary/20">
                                <span className="material-symbols-outlined text-sm">add_circle</span>
                                <span>Fund Wallet</span>
                            </button>
                            <button className="size-12 bg-white/5 text-white rounded-xl flex items-center justify-center border border-white/10">
                                <span className="material-symbols-outlined">trending_up</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-[#1a2e1e] p-5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm">
                        <div className="size-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-3">
                            <span className="material-symbols-outlined">rocket_launch</span>
                        </div>
                        <p className="text-slate-500 dark:text-[#92c9a4] text-xs font-medium uppercase mb-1">Active</p>
                        <h4 className="text-xl font-bold">{activeTasks} Campaigns</h4>
                    </div>
                    <div className="bg-white dark:bg-[#1a2e1e] p-5 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm">
                        <div className="size-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center mb-3">
                            <span className="material-symbols-outlined">pending_actions</span>
                        </div>
                        <p className="text-slate-500 dark:text-[#92c9a4] text-xs font-medium uppercase mb-1">To Review</p>
                        <h4 className="text-xl font-bold">{pendingReview} Submissions</h4>
                    </div>
                </div>

                {/* Create Task Button */}
                <Link href="/d2e/post-task" className="block">
                    <div className="bg-d2e-primary/10 border border-dashed border-d2e-primary/30 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-2 group hover:bg-d2e-primary/20 transition-all cursor-pointer">
                        <div className="size-12 rounded-full bg-d2e-primary text-d2e-bg-dark flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined font-black">add</span>
                        </div>
                        <h3 className="text-d2e-primary font-bold">Post New Task</h3>
                        <p className="text-xs text-[#92c9a4] opacity-80">Describe your task and set a budget</p>
                    </div>
                </Link>

                {/* Campaign List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black">Recent Campaigns</h3>
                        <span className="text-d2e-primary text-sm font-bold">View All</span>
                    </div>

                    <div className="space-y-3">
                        {recentTasks.length > 0 ? recentTasks.map((task) => (
                            <div key={task.id} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-2xl flex items-center gap-4">
                                <div className="size-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center overflow-hidden">
                                    <div className="size-full bg-center bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAnz5s8Tz_T3wRNoRzB8_k_GIsgE3W6_YfRIsXU7O-KjJvC6qfK3W_V6h88g2Yq_W7Q7W-X_Z-_T-X8Q=s160")' }}></div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm leading-tight mb-1">{task.title}</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-20 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-d2e-primary" style={{ width: `${(task.filled / task.total) * 100}%` }}></div>
                                        </div>
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{task.filled}/{task.total} Slots Filled</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black">₦{parseFloat(task.budget).toLocaleString()}</p>
                                    <p className="text-[10px] text-d2e-primary font-bold uppercase">Active</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-slate-500 py-4 text-sm">No recent campaigns.</p>
                        )}
                    </div>
                </div>
            </main>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 dark:bg-d2e-bg-dark/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 px-6 flex justify-around items-center z-50">
                <div className="flex flex-col items-center gap-1 text-d2e-primary">
                    <span className="material-symbols-outlined fill-1">dashboard</span>
                    <span className="text-[10px] font-bold">Overview</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-slate-400">
                    <span className="material-symbols-outlined">assignment</span>
                    <span className="text-[10px] font-medium">My Tasks</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-slate-400">
                    <span className="material-symbols-outlined">group</span>
                    <span className="text-[10px] font-medium">Earners</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-slate-400">
                    <span className="material-symbols-outlined">account_balance_wallet</span>
                    <span className="text-[10px] font-medium">Billing</span>
                </div>
            </nav>
        </div>
    );
}
