import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../../../src/components/Header';
import Footer from '../../../src/components/Footer';
import Link from 'next/link';

import { fetchMarketplaceTasks } from '../../../src/utils/api';

export default function BrowseTasks() {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        minPay: '',
        skills: [],
        type: 'All'
    });

    // Real data fetch
    useEffect(() => {
        const loadTasks = async () => {
            setLoading(true);
            try {
                const result = await fetchMarketplaceTasks({
                    minPay: filters.minPay,
                    type: filters.type
                });
                if (result.success) {
                    const mapped = result.data.map(t => ({
                        id: t.id,
                        title: t.title,
                        reward: parseFloat(t.pay_per_slot),
                        currency: '₦',
                        type: t.type === 'FIXED' ? 'Fixed' : 'Competition',
                        skills: t.required_skills,
                        deadline: new Date(t.deadline).toLocaleDateString(),
                        slots: { filled: t.filled_slots, total: t.total_slots },
                        description: t.description
                    }));
                    setTasks(mapped);
                    setFilteredTasks(mapped);
                }
            } catch (err) {
                console.error('Failed to fetch tasks', err);
            } finally {
                setLoading(false);
            }
        };
        loadTasks();
    }, [filters.minPay, filters.type]);

    // Local Search Filter
    useEffect(() => {
        let result = tasks;
        if (filters.search) {
            result = result.filter(t => t.title.toLowerCase().includes(filters.search.toLowerCase()));
        }
        setFilteredTasks(result);
    }, [filters.search, tasks]);

    const handleSearchChange = (e) => {
        setFilters({ ...filters, search: e.target.value });
    };

    const handleTypeChange = (e) => {
        setFilters({ ...filters, type: e.target.value });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head>
                <title>Browse Tasks | Resconate D2E</title>
            </Head>
            <Header />

            <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Filters Sidebar */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-bold text-gray-900">Filters</h2>
                                <button
                                    onClick={() => setFilters({ search: '', minPay: '', skills: [], type: 'All' })}
                                    className="text-xs text-indigo-600 hover:text-indigo-800"
                                >
                                    Reset
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Task Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Task Type</label>
                                    <select
                                        value={filters.type}
                                        onChange={handleTypeChange}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 text-sm"
                                    >
                                        <option value="All">All Types</option>
                                        <option value="Fixed">Fixed Pay</option>
                                        <option value="Competition">Competition</option>
                                    </select>
                                </div>

                                {/* Min Pay */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Pay (₦)</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 5000"
                                        value={filters.minPay}
                                        onChange={(e) => setFilters({ ...filters, minPay: e.target.value })}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 text-sm"
                                    />
                                </div>

                                {/* Categories / Skills (Simplified Checkboxes) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {['Writing', 'Design', 'Development', 'Testing', 'Translation', 'Marketing'].map(cat => (
                                            <label key={cat} className="flex items-center text-sm text-gray-600">
                                                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 mr-2 focus:ring-indigo-500" />
                                                {cat}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Search Top Bar */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={filters.search}
                                    onChange={handleSearchChange}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex items-center text-sm text-gray-500 whitespace-nowrap">
                                <span className="font-semibold text-gray-900 mr-1">{filteredTasks.length}</span> results found
                            </div>
                        </div>

                        {/* Tasks Grid */}
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>)}
                            </div>
                        ) : filteredTasks.length > 0 ? (
                            <div className="grid gap-4">
                                {filteredTasks.map(task => (
                                    <Link href={`/d2e/tasks/${task.id}`} key={task.id} className="block group">
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-indigo-200 transition-all">
                                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                            {task.title}
                                                        </h3>
                                                        {task.type === 'Competition' && (
                                                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">Competition</span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {task.skills.map(skill => (
                                                            <span key={skill} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded border border-gray-200">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 md:gap-1 min-w-[120px]">
                                                    <div className="text-xl font-bold text-green-600">
                                                        {task.currency}{task.reward.toLocaleString()}
                                                    </div>
                                                    <div className="text-xs text-gray-500 text-right">
                                                        {task.type === 'Competition'
                                                            ? `${task.slots.filled} participants`
                                                            : `${task.slots.total - task.slots.filled} spots left`
                                                        }
                                                    </div>
                                                    <div className="text-xs text-orange-500 font-medium flex items-center md:mt-2">
                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                        {task.deadline}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                                <div className="text-gray-400 mb-4 text-4xl">🔍</div>
                                <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
                                <p className="text-gray-500">Try adjusting your search or filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
