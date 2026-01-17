import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../../src/components/Header';
import Footer from '../../../src/components/Footer';
import Link from 'next/link';

export default function PosterDashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock Data
        setTimeout(() => {
            setTasks([
                {
                    id: '1',
                    title: 'Design a Logo for Coffee Shop',
                    reward: 15000,
                    filled: 2,
                    total: 5,
                    status: 'Active',
                    submissions: 1 // 1 pending review
                },
                {
                    id: '2',
                    title: 'Translate Document (Hausa)',
                    reward: 10000,
                    filled: 0,
                    total: 1,
                    status: 'Draft',
                    submissions: 0
                }
            ]);
            setLoading(false);
        }, 800);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Head>
                <title>Poster Dashboard | Resconate D2E</title>
            </Head>
            <Header />

            <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">My Posted Tasks</h1>
                    <Link href="/d2e/post-task" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow transition-colors flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Create New Task
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-gray-500 text-sm font-medium mb-1">Total Spent</div>
                        <div className="text-2xl font-bold text-gray-900">₦125,000</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-gray-500 text-sm font-medium mb-1">Active Tasks</div>
                        <div className="text-2xl font-bold text-indigo-600">3</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-gray-500 text-sm font-medium mb-1">Pending Reviews</div>
                        <div className="text-2xl font-bold text-orange-500">5</div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 font-bold text-lg">Detailed Task List</div>

                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading your tasks...</div>
                    ) : tasks.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    <th className="px-6 py-4">Task Title</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Slots</th>
                                    <th className="px-6 py-4">Submissions</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {tasks.map(task => (
                                    <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{task.title}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${task.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {task.filled} / {task.total}
                                        </td>
                                        <td className="px-6 py-4">
                                            {task.submissions > 0 ? (
                                                <span className="flex items-center text-orange-600 font-medium text-sm">
                                                    <span className="w-2 h-2 rounded-full bg-orange-600 mr-2"></span>
                                                    {task.submissions} to review
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-sm">No submissions</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-indigo-600 font-medium text-sm hover:underline">Manage</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center">
                            <p className="text-gray-500 mb-4">You haven't posted any tasks yet.</p>
                            <Link href="/d2e/post-task" className="text-indigo-600 font-medium hover:underline">Draft your first task</Link>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
