import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { fetchTaskById, claimTask } from '../../../src/utils/api';

export default function TaskDetails() {
    const router = useRouter();
    const { id } = router.query;
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [claiming, setClaiming] = useState(false);
    const [isClaimed, setIsClaimed] = useState(false);

    useEffect(() => {
        if (!id) return;
        const loadTask = async () => {
            setLoading(true);
            try {
                const result = await fetchTaskById(id);
                if (result.success) {
                    setTask(result.data);
                }
            } catch (err) {
                console.error('Failed to fetch task', err);
            } finally {
                setLoading(false);
            }
        };
        loadTask();
    }, [id]);

    const handleClaim = async () => {
        if (!task || isClaimed) return;
        setClaiming(true);
        try {
            // In a real app, earnerId would come from an auth context
            const earnerId = 1; // placeholder
            const result = await claimTask(task.id, earnerId);
            if (result.success) {
                setIsClaimed(true);
                alert('Task claimed successfully!');
            } else {
                alert(result.error || 'Failed to claim task');
            }
        } catch (err) {
            console.error('Claim error', err);
            alert('An error occurred while claiming the task.');
        } finally {
            setClaiming(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-d2e-bg-light dark:bg-d2e-bg-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-d2e-primary"></div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="min-h-screen bg-d2e-bg-light dark:bg-d2e-bg-dark flex flex-col items-center justify-center text-white p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Task Not Found</h1>
                <Link href="/d2e/tasks" className="text-d2e-primary hover:underline">Back to Explore</Link>
            </div>
        );
    }

    return (
        <div className="bg-d2e-bg-light dark:bg-d2e-bg-dark text-slate-900 dark:text-white font-display min-h-screen">
            <Head>
                <title>{task.title} - D2E Marketplace</title>
            </Head>

            {/* Top App Bar */}
            <nav className="sticky top-0 z-50 bg-d2e-bg-light/80 dark:bg-d2e-bg-dark/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center p-4 justify-between max-w-lg mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="flex size-10 shrink-0 items-center justify-center cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-2xl">arrow_back_ios</span>
                    </button>
                    <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">Task Details</h2>
                    <div className="flex w-10 items-center justify-end">
                        <button className="flex cursor-pointer items-center justify-center h-10 w-10 bg-transparent text-white focus:outline-none">
                            <span className="material-symbols-outlined text-2xl">share</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-lg mx-auto pb-32">
                {/* Hero Section */}
                <div className="px-4 pt-4">
                    <div
                        className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-xl min-h-[220px] relative"
                        style={{ backgroundImage: `url(${task.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqFPgx0jIORbV7RAl8lShdOBFXdb3Q0wXfvN1La3Vlyzw-hkI-KSh_Lkz7gDmmwVTPqVEmubdO6P4H7Z_KEGsHUNJ9EPqFpV3luRHZJ2AbG2wSenGkHc0UH-WadHhVrP2KWaEJkza2X_hk9JYifF4bOb_IKTIshNJSLXgXJi5tDd1CZAILoVDTmtuVDoyPnClk034fzDLWN6-R62__uWCRB3n0ThDCBhFG-yZU5jsD-HO1w14UIvbpwKeB3HxnnpqIfsay4jsMfg'})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-d2e-bg-dark/90 to-transparent"></div>
                        <div className="relative p-5">
                            <div className="inline-flex items-center gap-2 bg-d2e-primary/20 border border-d2e-primary/30 px-3 py-1 rounded-full mb-3">
                                <span className="w-2 h-2 rounded-full bg-d2e-primary animate-pulse"></span>
                                <span className="text-xs font-bold text-d2e-primary uppercase tracking-wider">Live Task</span>
                            </div>
                            <h1 className="text-white text-2xl font-extrabold leading-tight">{task.title}</h1>
                        </div>
                    </div>
                </div>

                {/* Reward & Deadline */}
                <div className="flex items-center justify-between px-4 py-6">
                    <div className="flex flex-col">
                        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Payout</span>
                        <h1 className="text-d2e-primary tracking-tight text-[36px] font-black leading-none">₦{parseFloat(task.pay_per_slot).toLocaleString()}</h1>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-end">
                        <div className="flex items-center gap-1.5 text-orange-400 mb-1">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            <span className="text-xs font-bold uppercase tracking-tighter">Deadline</span>
                        </div>
                        <span className="text-white font-mono text-lg font-bold">{new Date(task.deadline).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Category Chips */}
                <div className="flex gap-2 px-4 pb-6 overflow-x-auto no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                    <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-d2e-primary/10 border border-d2e-primary/20 px-4">
                        <span className="material-symbols-outlined text-d2e-primary text-lg">verified_user</span>
                        <p className="text-d2e-primary text-sm font-semibold">{task.type}</p>
                    </div>
                    <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white/5 border border-white/10 px-4">
                        <p className="text-white/80 text-sm font-medium">Verified Poster</p>
                    </div>
                    <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white/5 border border-white/10 px-4">
                        <p className="text-white/80 text-sm font-medium">Remote</p>
                    </div>
                </div>

                {/* Description */}
                <div className="px-4 pb-8">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <span className="w-1 h-5 bg-d2e-primary rounded-full"></span>
                        Description
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                        {task.description}
                    </p>
                </div>

                {/* Requirements */}
                <div className="px-4 pb-8">
                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <span className="w-1 h-5 bg-d2e-primary rounded-full"></span>
                        Requirements
                    </h3>
                    <ul className="space-y-3">
                        {task.required_skills && task.required_skills.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <div className="mt-1 bg-d2e-primary/20 p-0.5 rounded-full">
                                    <span className="material-symbols-outlined text-d2e-primary text-[16px] block">check</span>
                                </div>
                                <span className="text-sm text-slate-300">{req}</span>
                            </li>
                        ))}
                        {(!task.required_skills || task.required_skills.length === 0) && (
                            <li className="text-sm text-slate-400">No specific requirements mentioned.</li>
                        )}
                    </ul>
                </div>

                {/* About the Poster */}
                <div className="px-4 pb-8">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">About the Poster</h3>
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-full bg-d2e-primary/20 border-2 border-d2e-primary flex items-center justify-center overflow-hidden text-d2e-primary text-3xl font-bold">
                                {task.poster_name ? task.poster_name.charAt(0) : <span className="material-symbols-outlined">corporate_fare</span>}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-1">
                                    <h4 className="font-bold text-white text-lg">{task.poster_name || 'FintechX Solutions'}</h4>
                                    <span className="material-symbols-outlined text-blue-400 text-lg fill-1">verified</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex text-yellow-500">
                                        <span className="material-symbols-outlined text-[16px] fill-1">star</span>
                                        <span className="material-symbols-outlined text-[16px] fill-1">star</span>
                                        <span className="material-symbols-outlined text-[16px] fill-1">star</span>
                                        <span className="material-symbols-outlined text-[16px] fill-1">star</span>
                                        <span className="material-symbols-outlined text-[16px] fill-1">star_half</span>
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">4.8 (120 tasks)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-d2e-bg-light/95 dark:bg-d2e-bg-dark/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 z-50">
                <div className="max-w-lg mx-auto flex items-center gap-4">
                    <div className="flex flex-col flex-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Available Slots</span>
                        <div className="flex items-center gap-1.5">
                            <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-orange-500"
                                    style={{ width: `${((task.total_slots - task.filled_slots) / task.total_slots) * 100}%` }}
                                ></div>
                            </div>
                            <span className="text-xs font-bold text-orange-500">{task.total_slots - task.filled_slots}/{task.total_slots} left</span>
                        </div>
                    </div>
                    <button
                        onClick={handleClaim}
                        disabled={claiming || isClaimed || (task.total_slots - task.filled_slots) <= 0}
                        className={`flex-[1.5] ${isClaimed ? 'bg-gray-500' : 'bg-d2e-primary hover:bg-d2e-primary/90'} text-black h-14 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50`}
                    >
                        <span className="font-black text-lg">{claiming ? 'Claiming...' : isClaimed ? 'Claimed' : 'Claim Task'}</span>
                        <span className="material-symbols-outlined font-bold">arrow_forward</span>
                    </button>
                </div>
                {/* iOS Home Indicator Safe Area */}
                <div className="h-6"></div>
            </div>
        </div>
    );
}
