import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { fetchMarketplaceTasks } from '../../src/utils/api';

export default function ExploreTasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadTasks = async () => {
            setLoading(true);
            try {
                const result = await fetchMarketplaceTasks();
                if (result.success) {
                    setTasks(result.data);
                }
            } catch (err) {
                console.error('Failed to fetch tasks', err);
            } finally {
                setLoading(false);
            }
        };
        loadTasks();
    }, []);

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.required_skills && task.required_skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    return (
        <div className="bg-d2e-bg-light dark:bg-d2e-bg-dark text-slate-900 dark:text-white font-display min-h-screen">
            <Head>
                <title>Explore Tasks - D2E Marketplace</title>
            </Head>

            {/* Sticky Top Bar */}
            <header className="sticky top-0 z-50 bg-d2e-bg-light/80 dark:bg-d2e-bg-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center p-4 justify-between max-w-7xl mx-auto">
                    <div className="flex size-10 shrink-0 items-center overflow-hidden rounded-full border border-d2e-primary/20">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover w-full h-full" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC1b69F4bvj4vw9QsYNJ1w1lk0GvAfFG7tjlxLrmI-baqIUpodyGOu2eZioiBpg64CkDWMoChk0HdXexEvVGK6yrE0wRNmxMKDxBVV_vbUhAO6YbngG-Rq0pWmwEXwyKHPObYugNjx2S4DA4vf6mSvQTLABTQN5qT8G3sjb6vbEN4pdP9l3aG84Qcw0YvEIMsarwbMwdLVODefLoOYSzwYwZzw-sAMr1nI3qWxwp4zAXK4NB7ySz2drytYFe4aVeJ82pcRMKXokcg")' }}>
                        </div>
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">Explore Tasks</h2>
                    <div className="flex w-10 items-center justify-end">
                        <button className="flex cursor-pointer items-center justify-center rounded-lg h-10 w-10 bg-transparent hover:bg-d2e-primary/10 transition-colors">
                            <span className="material-symbols-outlined text-2xl">notifications</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto pb-32">
                {/* Search Bar & Filters */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 px-4 py-6">
                    <div className="flex-1">
                        <label className="flex flex-col w-full">
                            <div className="flex w-full items-stretch rounded-xl h-12 bg-white dark:bg-d2e-surface-dark shadow-sm border border-slate-200 dark:border-white/5">
                                <div className="text-slate-400 dark:text-d2e-primary/70 flex items-center justify-center pl-4">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <input
                                    className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:outline-0 focus:ring-0 text-base font-normal placeholder:text-slate-400 dark:placeholder:text-[#92c9a4] px-3 transition-colors"
                                    placeholder="Search tasks, skills, or companies..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button className="flex items-center justify-center pr-4 text-d2e-primary">
                                    <span className="material-symbols-outlined">tune</span>
                                </button>
                            </div>
                        </label>
                    </div>

                    {/* Filter Chips */}
                    <div className="flex gap-3 overflow-x-auto no-scrollbar py-1" style={{ scrollbarWidth: 'none' }}>
                        <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-d2e-primary text-d2e-bg-dark px-5 font-bold text-sm shadow-md shadow-d2e-primary/20">
                            <span>All Tasks</span>
                        </button>
                        <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-d2e-surface-dark border border-slate-200 dark:border-white/5 px-5 text-sm font-semibold">
                            <span>Category</span>
                            <span className="material-symbols-outlined text-lg">keyboard_arrow_down</span>
                        </button>
                        <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-d2e-surface-dark border border-slate-200 dark:border-white/5 px-5 text-sm font-semibold">
                            <span>Pay Range</span>
                            <span className="material-symbols-outlined text-lg">keyboard_arrow_down</span>
                        </button>
                    </div>
                </div>

                {/* Task Feed */}
                <div className="px-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-d2e-primary"></div>
                            <p className="text-slate-500 font-medium">Loading marketplace tasks...</p>
                        </div>
                    ) : filteredTasks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTasks.map((task) => (
                                <div key={task.id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-d2e-surface-dark shadow-sm hover:shadow-xl hover:shadow-d2e-primary/5 transition-all duration-300 group">
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <div className="absolute inset-0 bg-center bg-cover transform group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: `url(${task.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXZv9-K31v0HmrQTfn33ow6VviXqNKV6vlQNIJcfQXdc4KB8g2S9ksONzRsUgu2ef62DmZoXvgjElWlbSc2YYGWAbJQY90hQkkV6Lw-JPBRFus0Suj5JkCFo7tit9SyFOxpB6mIJH1e4shEmsatPdW8vbEShHGcthaxk2CPg-4hiX0EFlOQW1zAEX7lTIhacdh_nJVRavYV-vPUponxkWgAJJ7eSrsA2eXC4olCdc0batFu-XK776yhPnEwgvNWMLe6qHYysTh8A'})` }}>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        {task.tag === 'URGENT' && (
                                            <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg tracking-wider">
                                                URGENT
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-d2e-primary border border-d2e-primary/20">
                                            ₦{parseFloat(task.pay_per_slot).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-bold leading-tight group-hover:text-d2e-primary transition-colors">{task.title}</h3>
                                        </div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="size-6 rounded-full bg-slate-200 dark:bg-d2e-accent-dark flex items-center justify-center overflow-hidden border border-white/10">
                                                <div className="w-full h-full bg-center bg-cover" style={{ backgroundImage: `url(${task.poster_logo || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBgU5drl7WvvO4X8msgjd32xE4tywvYCJkfhyNt8GwaEzv484_LeknVHAef_cmOVaD4GlH16TO9ut5O6repfjIGbqRv7QU7SQhTEWksvPmJpoG78WGJr53YQKwqa08LPQ4U_AZagaAbKUmfNDxQ8o0gbP3JCkO8ToM1k9x7uK-Ak_r2JsTmhpUw6s4WoPE4fFTUN4x0l2IkSmzsHiVd0NuLAjlzUkodidDybXU5Ep5HMm76vCiTHKut4a5Mmsb4dA5Pm9xuq0vSQ'})` }}></div>
                                            </div>
                                            <p className="text-slate-500 dark:text-[#92c9a4] text-xs font-medium">{task.poster_name || 'Verified Poster'}</p>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-6 min-h-[50px]">
                                            {task.required_skills && task.required_skills.slice(0, 3).map((skill, idx) => (
                                                <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-d2e-accent-dark text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider">{skill}</span>
                                            ))}
                                            {task.required_skills?.length > 3 && (
                                                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-d2e-accent-dark text-slate-400 text-[10px] font-bold">+{task.required_skills.length - 3}</span>
                                            )}
                                        </div>

                                        <div className="mt-auto pt-5 border-t border-slate-100 dark:border-white/5">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex flex-col gap-1.5 flex-1 pr-4">
                                                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                                                        <span>Progress</span>
                                                        <span>{Math.round((task.filled_slots / task.total_slots) * 100)}%</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-slate-100 dark:bg-d2e-accent-dark rounded-full overflow-hidden">
                                                        <div
                                                            className="bg-gradient-to-r from-d2e-primary to-emerald-400 h-full rounded-full transition-all duration-1000"
                                                            style={{ width: `${(task.filled_slots / task.total_slots) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <Link href={`/d2e/tasks/${task.id}`} className="block">
                                                <button className="w-full h-11 bg-d2e-primary hover:bg-d2e-primary/90 text-d2e-bg-dark font-black rounded-xl text-sm transition-all transform active:scale-[0.98] shadow-lg shadow-d2e-primary/10 uppercase tracking-wider">
                                                    Apply Now
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-d2e-accent-dark mb-4">search_off</span>
                            <h3 className="text-xl font-bold mb-2">No tasks found</h3>
                            <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-d2e-bg-dark/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 pb-6 pt-3">
                <div className="flex justify-around items-center max-w-lg mx-auto px-4">
                    <Link href="/d2e/dashboard" className="flex flex-col items-center gap-1.5 text-slate-400 dark:text-slate-500 hover:text-d2e-primary transition-colors">
                        <span className="material-symbols-outlined">home</span>
                        <span className="text-[10px] font-bold uppercase tracking-tight">Home</span>
                    </Link>
                    <Link href="/d2e" className="flex flex-col items-center gap-1.5 text-d2e-primary">
                        <span className="material-symbols-outlined fill-[1]">explore</span>
                        <span className="text-[10px] font-bold uppercase tracking-tight">Explore</span>
                    </Link>
                    <div className="relative -top-8">
                        <Link href="/d2e/post-task" className="size-16 bg-d2e-primary text-d2e-bg-dark rounded-2xl shadow-xl shadow-d2e-primary/30 flex items-center justify-center border-4 border-white dark:border-d2e-bg-dark transform hover:rotate-90 transition-transform duration-300">
                            <span className="material-symbols-outlined text-3xl font-black">add</span>
                        </Link>
                    </div>
                    <Link href="/d2e/dashboard?tab=tasks" className="flex flex-col items-center gap-1.5 text-slate-400 dark:text-slate-500 hover:text-d2e-primary transition-colors">
                        <span className="material-symbols-outlined">assignment</span>
                        <span className="text-[10px] font-bold uppercase tracking-tight">Tasks</span>
                    </Link>
                    <Link href="/d2e/dashboard?tab=profile" className="flex flex-col items-center gap-1.5 text-slate-400 dark:text-slate-500 hover:text-d2e-primary transition-colors">
                        <span className="material-symbols-outlined">person</span>
                        <span className="text-[10px] font-bold uppercase tracking-tight">Profile</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
