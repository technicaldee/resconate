import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import Link from 'next/link';

import { fetchMarketplaceTasks } from '../../src/utils/api';

export default function D2EMarketplace() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Real data fetch
    useEffect(() => {
        const loadTasks = async () => {
            setLoading(true);
            try {
                const result = await fetchMarketplaceTasks();
                if (result.success) {
                    const mapped = result.data.slice(0, 4).map(t => ({
                        id: t.id,
                        title: t.title,
                        reward: `₦${parseFloat(t.pay_per_slot).toLocaleString()}`,
                        type: t.type === 'FIXED' ? 'Fixed' : 'Competition',
                        skills: t.required_skills,
                        deadline: new Date(t.deadline).toLocaleDateString(),
                        slots: t.type === 'COMPETITION' ? 'Competition' : `${t.filled_slots}/${t.total_slots} filled`
                    }));
                    setTasks(mapped);
                }
            } catch (err) {
                console.error('Failed to fetch tasks', err);
            } finally {
                setLoading(false);
            }
        };
        loadTasks();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Head>
                <title>Resconate D2E Marketplace | Earn Money Completing Tasks</title>
                <meta name="description" content="Join the Resconate Do-to-Earn marketplace. Complete tasks, earn money, and grow your career." />
            </Head>

            <Header />

            <main className="pt-20">
                {/* Hero Section */}
                <section className="relative bg-indigo-900 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 opacity-90 z-0"></div>
                    <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 z-0"></div>

                    <div className="container mx-auto px-6 py-24 relative z-10 text-center md:text-left md:flex md:items-center md:justify-between">
                        <div className="md:w-1/2 mb-12 md:mb-0">
                            <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/30 border border-indigo-400/50 text-indigo-200 text-sm font-semibold mb-6">
                                🚀 New: Do-to-Earn Marketplace
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                                Turn Your Skills Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">Income</span>
                            </h1>
                            <p className="text-xl text-indigo-100 mb-8 max-w-lg">
                                The decentralized marketplace where you can earn by completing tasks, or get work done by a community of verified talent.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <Link href="/d2e/tasks" className="px-8 py-4 bg-white text-indigo-900 rounded-lg font-bold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                    Browse Tasks
                                </Link>
                                <Link href="/d2e/post-task" className="px-8 py-4 bg-transparent border-2 border-indigo-400/50 text-white rounded-lg font-bold hover:bg-indigo-900/50 transition-all">
                                    Post a Task
                                </Link>
                            </div>
                        </div>

                        {/* Hero Graphic / Stats Card */}
                        <div className="md:w-5/12 hidden md:block">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-2xl blur opacity-30 animate-pulse"></div>
                                <div className="relative bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">Latest Earnings</h3>
                                            <p className="text-slate-400 text-sm">Real-time payouts</p>
                                        </div>
                                        <div className="p-2 bg-green-500/20 rounded-lg">
                                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {[1, 2, 3].map((_, i) => (
                                            <div key={i} className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                                                    {['JD', 'AS', 'MK'][i]}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-white">Task Completed</p>
                                                    <p className="text-xs text-slate-400">Just now</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-green-400">+₦{(15000 - i * 2500).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-10 bg-white border-b border-gray-100">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { label: 'Active Tasks', value: '150+', icon: '📋' },
                                { label: 'Total Paid Out', value: '₦4.5M+', icon: '💰' },
                                { label: 'Verified Earners', value: '300+', icon: '✅' },
                                { label: 'Avg. Completion', value: '2 Days', icon: '⚡' },
                            ].map((stat, idx) => (
                                <div key={idx} className="text-center group hover:-translate-y-1 transition-transform">
                                    <div className="text-3xl mb-2">{stat.icon}</div>
                                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                    <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Latest Tasks Section */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Opportunities</h2>
                                <p className="text-lg text-gray-600">Find tasks that match your skills and start earning.</p>
                            </div>
                            <Link href="/d2e/tasks" className="hidden md:inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
                                View All Tasks <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </Link>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                                {tasks.map(task => (
                                    <Link href={`/d2e/tasks/${task.id}`} key={task.id} className="group block h-full">
                                        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all h-full flex flex-col">
                                            <div className="p-6 flex-1">
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${task.type === 'Competition' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {task.type}
                                                    </span>
                                                    <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-lg border border-green-100">
                                                        {task.reward}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                                    {task.title}
                                                </h3>
                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {task.skills.map(skill => (
                                                        <span key={skill} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    {task.deadline}
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                                    {task.slots}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        <div className="mt-12 text-center md:hidden">
                            <Link href="/d2e/tasks" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition">
                                View All Tasks
                            </Link>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Start Earning?</h2>
                                <p className="text-xl text-indigo-100 mb-10">
                                    Join thousands of skilled professionals in Nigeria using Resconate D2E to find flexible work and get paid instantly.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="/d2e/register" className="px-8 py-4 bg-white text-indigo-900 rounded-xl font-bold text-lg hover:shadow-xl hover:bg-gray-50 transition-all transform hover:-translate-y-1">
                                        Create Earner Account
                                    </Link>
                                    <Link href="/d2e/login" className="px-8 py-4 bg-indigo-800/50 border border-indigo-400/30 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-indigo-800/80 transition-all">
                                        Sign In
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
