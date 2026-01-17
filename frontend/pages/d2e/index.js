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
                <div className="flex items-center p-4 justify-between max-w-md mx-auto">
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

            <main className="max-w-md mx-auto pb-24">
                {/* Search Bar */}
                <div className="px-4 py-4">
                    <label className="flex flex-col w-full">
                        <div className="flex w-full items-stretch rounded-xl h-12 bg-white dark:bg-d2e-accent-dark shadow-sm border border-slate-200 dark:border-transparent">
                            <div className="text-slate-400 dark:text-d2e-primary/70 flex items-center justify-center pl-4">
                                <span className="material-symbols-outlined">search</span>
                            </div>
                            <input
                                className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:outline-0 focus:ring-0 text-base font-normal placeholder:text-slate-400 dark:placeholder:text-[#92c9a4] px-3"
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
                <div className="flex gap-3 px-4 pb-4 overflow-x-auto no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                    <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-d2e-primary text-d2e-bg-dark px-4 font-semibold text-sm">
                        <span>All Tasks</span>
                    </button>
                    <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-d2e-accent-dark border border-slate-200 dark:border-transparent px-4 text-sm font-medium">
                        <span>Category</span>
                        <span className="material-symbols-outlined text-lg">keyboard_arrow_down</span>
                    </button>
                    <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-d2e-accent-dark border border-slate-200 dark:border-transparent px-4 text-sm font-medium">
                        <span>Pay Range</span>
                        <span className="material-symbols-outlined text-lg">keyboard_arrow_down</span>
                    </button>
                </div>

                {/* Task Feed */}
                <div className="flex flex-col gap-4 px-4">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-d2e-primary"></div>
                        </div>
                    ) : (
                        filteredTasks.map((task) => (
                            <div key={task.id} className="flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-d2e-surface-dark shadow-sm">
                                <div className="relative h-40 w-full">
                                    <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: `url(${task.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXZv9-K31v0HmrQTfn33ow6VviXqNKV6vlQNIJcfQXdc4KB8g2S9ksONzRsUgu2ef62DmZoXvgjElWlbSc2YYGWAbJQY90hQkkV6Lw-JPBRFus0Suj5JkCFo7tit9SyFOxpB6mIJH1e4shEmsatPdW8vbEShHGcthaxk2CPg-4hiX0EFlOQW1zAEX7lTIhacdh_nJVRavYV-vPUponxkWgAJJ7eSrsA2eXC4olCdc0batFu-XK776yhPnEwgvNWMLe6qHYysTh8A'})` }}>
                                    </div>
                                    {task.tag === 'URGENT' && (
                                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded">
                                            URGENT
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-lg font-bold leading-tight flex-1 pr-2">{task.title}</h3>
                                        <span className="text-d2e-primary font-bold text-lg">₦{parseFloat(task.pay_per_slot).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="size-5 rounded-full bg-slate-200 dark:bg-d2e-accent-dark flex items-center justify-center overflow-hidden">
                                            <div className="w-full h-full bg-center bg-cover" style={{ backgroundImage: `url(${task.poster_logo || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBgU5drl7WvvO4X8msgjd32xE4tywvYCJkfhyNt8GwaEzv484_LeknVHAef_cmOVaD4GlH16TO9ut5O6repfjIGbqRv7QU7SQhTEWksvPmJpoG78WGJr53YQKwqa08LPQ4U_AZagaAbKUmfNDxQ8o0gbP3JCkO8ToM1k9x7uK-Ak_r2JsTmhpUw6s4WoPE4fFTUN4x0l2IkSmzsHiVd0NuLAjlzUkodidDybXU5Ep5HMm76vCiTHKut4a5Mmsb4dA5Pm9xuq0vSQ'})` }}></div>
                                        </div>
                                        <p className="text-slate-500 dark:text-[#92c9a4] text-sm">{task.poster_name || 'Verified Poster'}</p>
                                    </div>
                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {task.required_skills && task.required_skills.map((skill, idx) => (
                                            <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-d2e-accent-dark text-slate-600 dark:text-slate-300 text-xs font-medium">{skill}</span>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                                <span className="material-symbols-outlined text-sm">groups</span>
                                                <span>{task.total_slots - task.filled_slots}/{task.total_slots} slots left</span>
                                            </div>
                                            <div className="w-24 h-1.5 bg-slate-200 dark:bg-d2e-accent-dark rounded-full overflow-hidden">
                                                <div
                                                    className="bg-d2e-primary h-full rounded-full"
                                                    style={{ width: `${(task.filled_slots / task.total_slots) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <Link href={`/d2e/tasks/${task.id}`}>
                                            <button className="h-9 px-5 bg-d2e-primary hover:bg-d2e-primary/90 text-d2e-bg-dark font-bold rounded-lg text-sm transition-colors">
                                                Apply Now
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-d2e-bg-dark/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 pb-6 pt-2">
                <div className="flex justify-around items-center max-w-md mx-auto">
                    <Link href="/d2e/dashboard" className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500">
                        <span className="material-symbols-outlined">home</span>
                        <span className="text-[10px] font-medium">Home</span>
                    </Link>
                    <Link href="/d2e" className="flex flex-col items-center gap-1 text-d2e-primary">
                        <span className="material-symbols-outlined fill-[1]">explore</span>
                        <span className="text-[10px] font-bold">Explore</span>
                    </Link>
                    <div className="relative -top-6">
                        <Link href="/d2e/post-task" className="size-14 bg-d2e-primary text-d2e-bg-dark rounded-full shadow-lg shadow-d2e-primary/20 flex items-center justify-center border-4 border-white dark:border-d2e-bg-dark">
                            <span className="material-symbols-outlined text-3xl font-bold">add</span>
                        </Link>
                    </div>
                    <Link href="/d2e/dashboard?tab=tasks" className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500">
                        <span className="material-symbols-outlined">assignment</span>
                        <span className="text-[10px] font-medium">Tasks</span>
                    </Link>
                    <Link href="/d2e/dashboard?tab=profile" className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500">
                        <span className="material-symbols-outlined">person</span>
                        <span className="text-[10px] font-medium">Profile</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
