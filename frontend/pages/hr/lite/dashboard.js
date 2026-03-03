import React, { useState, useEffect } from 'react';
import HRLiteLayout from '../../../src/components/HRLite/Layout';
import Head from 'next/head';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        total_recipients: 0,
        active_rules: 0,
        tax_remitted: '₦0.00',
        success_rate: '100%',
        total_payout_volume: '₦0.00'
    });
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [businessName, setBusinessName] = useState('Acme Solutions');

    const fetchData = async () => {
        const bid = localStorage.getItem('hr_lite_business_id');
        try {
            // 1. Fetch Stats
            const statsRes = await fetch(`/api/hr/lite/business/${bid}/stats`);
            const statsData = await statsRes.json();

            // 2. Fetch Payout History
            const payoutRes = await fetch(`/api/hr/lite/payouts?business_id=${bid}`);
            const payoutData = await payoutRes.json();

            if (statsData.success) {
                // Calculate volume from payouts
                const volume = payoutData.data.reduce((acc, p) => acc + parseFloat(p.amount), 0);
                setStats({
                    ...statsData.data,
                    total_payout_volume: `₦${volume.toLocaleString()}`
                });
            }
            if (payoutData.success) setPayouts(payoutData.data);
            setBusinessName(localStorage.getItem('hr_lite_business_name') || 'Acme Solutions');
        } catch (e) {
            console.error('Data fetch error:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <HRLiteLayout>
            <Head>
                <title>Dashboard | Resconate HR Lite</title>
            </Head>
            <div className="flex flex-col gap-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-cloaka-primary shadow-lg shadow-cloaka-primary/30"></span>
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Business Overview</p>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter">Welcome back, {businessName}.</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg font-medium max-w-2xl leading-relaxed">Everything is running smoothly. Your financial throughput and recipient directory are synchronized.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-cloaka-primary rounded-[40px] p-10 text-white shadow-2xl shadow-indigo-500/30 relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Total Recipient Volume</p>
                                    <h3 className="text-6xl font-black tracking-tighter">{stats.total_payout_volume}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold">NGN Payouts</span>
                                    </div>
                                </div>
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10">
                                    <span className="material-symbols-outlined text-3xl font-black">insights</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Active Staff</p>
                                    <p className="text-2xl font-black">{stats.total_recipients}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Active Rules</p>
                                    <p className="text-2xl font-black">{stats.active_rules}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Success Rate</p>
                                    <p className="text-2xl font-black">{stats.success_rate}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col group transition-all h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">Active Notifications</h3>
                            <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xs">0</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
                            <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300">
                                <span className="material-symbols-outlined text-4xl font-black">fact_check</span>
                            </div>
                            <p className="text-sm font-black text-slate-400">All systems operational</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-12">
                    <div className="xl:col-span-2 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xl font-black">Recent Payroll History</h3>
                            <button className="text-indigo-600 font-black text-xs uppercase tracking-widest underline decoration-2 underline-offset-4">Full Statement</button>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-50 dark:border-slate-800">
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Recipient</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Reason</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                        {loading ? (
                                            <tr><td colSpan="4" className="py-20 text-center font-black text-slate-300 uppercase animate-pulse">Syncing...</td></tr>
                                        ) : payouts.length === 0 ? (
                                            <tr><td colSpan="4" className="py-20 text-center font-black text-slate-300 uppercase">No history found</td></tr>
                                        ) : (
                                            payouts.map((p) => (
                                                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                                    <td className="px-10 py-6">
                                                        <p className="font-extrabold text-slate-900 dark:text-white capitalize">{p.recipient_name}</p>
                                                    </td>
                                                    <td className="px-10 py-6 text-sm font-bold text-slate-500 uppercase tracking-tighter">{p.reason}</td>
                                                    <td className="px-10 py-6 font-black text-slate-900 dark:text-white">₦{parseFloat(p.amount).toLocaleString()}</td>
                                                    <td className="px-10 py-6 text-right">
                                                        <span className="px-3 py-1.5 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase border border-green-100">{p.status}</span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[40px] p-10 text-white flex flex-col justify-between shadow-2xl">
                        <div>
                            <span className="bg-indigo-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-6 inline-block">Pro AI</span>
                            <h3 className="text-3xl font-black mb-4 leading-tight">Scale your team with confidence.</h3>
                            <p className="text-slate-400 font-medium text-sm">Automate your entire payroll. Use our AI-driven rule engine to ensure compliance with Nigerian labor laws.</p>
                        </div>
                        <button className="mt-8 w-full py-5 bg-white text-slate-900 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-white/10 hover:bg-indigo-50 transition-all">
                            View Plan Perks
                        </button>
                    </div>
                </div>
            </div>
        </HRLiteLayout>
    );
};

export default DashboardPage;
