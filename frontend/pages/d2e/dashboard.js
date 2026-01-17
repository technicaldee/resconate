import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import Link from 'next/link';

import { apiFetch } from '../../src/utils/api';

export default function EarnerDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [activeTasks, setActiveTasks] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            try {
                // 1. Get Wallet Balance
                const walletRes = await apiFetch('/api/wallet/balance');
                const wallet = await walletRes.json();

                // 2. Get Transactions/History (optional for overview)
                // const transRes = await apiFetch('/api/wallet/transactions');

                if (wallet.success && wallet.data) {
                    setStats({
                        availableBalance: parseFloat(wallet.data.available_balance),
                        pendingBalance: parseFloat(wallet.data.pending_balance),
                        totalEarned: 0, // Would need an aggregation API
                        completedTasks: 0,
                        rating: 5.0,
                        squad: null
                    });
                }

                // 3. Get User info if not provided by context
                // ... (mocking name for now until main auth context is updated)
                setUser({ name: 'Verified Earner', initials: 'VE' });

                setLoading(false);
            } catch (err) {
                console.error('Failed to load dashboard', err);
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Head>
                <title>Earner Dashboard | Resconate D2E</title>
            </Head>
            <Header />

            <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar Nav */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-24">
                            <div className="flex items-center gap-3 mb-6 p-2">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                                    {user?.initials || '..'}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">{user?.name || 'Loading...'}</div>
                                    <div className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-block border border-green-100">Verified Earner</div>
                                </div>
                            </div>

                            <nav className="space-y-1">
                                {['Overview', 'My Tasks', 'Wallet', 'Profile', 'Squad Settings'].map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => setActiveTab(item.toLowerCase())}
                                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === item.toLowerCase()
                                            ? 'bg-indigo-50 text-indigo-700'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Dashboard Area */}
                    <div className="flex-1 space-y-8">

                        {/* Wallet Quick View */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Available Balance */}
                            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"></path></svg>
                                </div>
                                <div className="relative z-10">
                                    <div className="text-indigo-200 text-sm font-medium mb-1">Available Balance</div>
                                    <div className="text-3xl font-bold mb-4">
                                        {loading ? '...' : `₦${stats?.availableBalance.toLocaleString()}`}
                                    </div>
                                    <button className="bg-white text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-50 transition-colors">
                                        Withdraw Funds
                                    </button>
                                </div>
                            </div>

                            {/* Pending Balance */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="text-gray-500 text-sm font-medium mb-1">Pending Balance</div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">
                                    {loading ? '...' : `₦${stats?.pendingBalance.toLocaleString()}`}
                                </div>
                                <div className="text-xs text-gray-400">Held in escrow until approval</div>
                            </div>

                            {/* Stats */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-gray-500 text-sm">Tasks Completed</div>
                                    <div className="font-bold text-lg">{stats?.completedTasks}</div>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-gray-500 text-sm">Rating</div>
                                    <div className="font-bold text-lg text-orange-500 flex items-center">
                                        {stats?.rating} <span className="text-xs ml-1 text-gray-400">/ 5.0</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Active Tasks Section */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">In Progress</h2>
                            {loading ? (
                                <div className="h-24 bg-gray-100 rounded-xl animate-pulse"></div>
                            ) : activeTasks.length > 0 ? (
                                <div className="space-y-4">
                                    {activeTasks.map(task => (
                                        <div key={task.claimId} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center font-bold">
                                                    ⏳
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{task.title}</h3>
                                                    <div className="text-sm text-gray-500">
                                                        Due in <span className="text-orange-600 font-medium">{task.timeLeft}</span> • Pay: ₦{task.reward.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 w-full md:w-auto">
                                                <Link href={`/d2e/tasks/${task.id}`} className="flex-1 md:flex-none text-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700">
                                                    View Details
                                                </Link>
                                                <button className="flex-1 md:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors">
                                                    Submit Work
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                                    <p className="text-gray-500 mb-4">You don't have any active tasks.</p>
                                    <Link href="/d2e/tasks" className="text-indigo-600 font-medium hover:underline">Browse Marketplace</Link>
                                </div>
                            )}
                        </div>

                        {/* Recent History Stub */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</span>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</span>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</span>
                                </div>
                                {/* Mock Rows */}
                                {[1].map(i => (
                                    <div key={i} className="p-4 flex justify-between items-center text-sm border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                        <span className="text-gray-500">Oct 20, 2024</span>
                                        <span className="font-medium text-gray-900">Task Completed: Translation...</span>
                                        <span className="font-bold text-green-600">+₦10,000</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
