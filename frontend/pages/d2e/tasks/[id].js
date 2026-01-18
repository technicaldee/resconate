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
        <div className="bg-d2e-bg-light dark:bg-d2e-bg-dark text-slate-900 dark:text-white font-display min-h-screen pb-32">
            <Head>
                <title>{task.title} - D2E Marketplace</title>
            </Head>

            {/* Top App Bar */}
            <nav className="sticky top-0 z-50 bg-d2e-bg-light/80 dark:bg-d2e-bg-dark/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex size-10 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus:outline-none"
                    >
                        <span className="material-symbols-outlined text-2xl">arrow_back_ios</span>
                    </button>
                    <h2 className="text-lg font-black uppercase tracking-widest text-center flex-1">Task Details</h2>
                    <div className="flex w-10 items-center justify-end">
                        <button className="flex size-10 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus:outline-none">
                            <span className="material-symbols-outlined text-2xl">share</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: Task Info */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Hero Section */}
                        <div className="relative rounded-[2.5rem] overflow-hidden group shadow-2xl">
                            <div
                                className="w-full bg-center bg-no-repeat bg-cover aspect-video flex flex-col justify-end min-h-[300px] md:min-h-[450px] transform group-hover:scale-105 transition-transform duration-700"
                                style={{ backgroundImage: `url(${task.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqFPgx0jIORbV7RAl8lShdOBFXdb3Q0wXfvN1La3Vlyzw-hkI-KSh_Lkz7gDmmwVTPqVEmubdO6P4H7Z_KEGsHUNJ9EPqFpV3luRHZJ2AbG2wSenGkHc0UH-WadHhVrP2KWaEJkza2X_hk9JYifF4bOb_IKTIshNJSLXgXJi5tDd1CZAILoVDTmtuVDoyPnClk034fzDLWN6-R62__uWCRB3n0ThDCBhFG-yZU5jsD-HO1w14UIvbpwKeB3HxnnpqIfsay4jsMfg'})` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-d2e-bg-dark via-d2e-bg-dark/20 to-transparent"></div>
                                <div className="relative p-8 md:p-12">
                                    <div className="inline-flex items-center gap-2 bg-d2e-primary/20 backdrop-blur-md border border-d2e-primary/30 px-4 py-1.5 rounded-full mb-6">
                                        <span className="w-2.5 h-2.5 rounded-full bg-d2e-primary animate-pulse shadow-lg shadow-d2e-primary/50"></span>
                                        <span className="text-xs font-black text-d2e-primary uppercase tracking-widest">Active Opportunity</span>
                                    </div>
                                    <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tighter mb-4">{task.title}</h1>
                                    <div className="flex flex-wrap gap-3">
                                        {task.required_skills?.slice(0, 3).map((skill, i) => (
                                            <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest text-white/80 border border-white/5">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="bg-white dark:bg-d2e-surface-dark rounded-[2.5rem] p-8 md:p-12 border border-slate-200 dark:border-white/5 space-y-12 shadow-sm">
                            {/* Description */}
                            <section>
                                <h3 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                                    <span className="size-8 rounded-xl bg-d2e-primary/10 text-d2e-primary flex items-center justify-center">
                                        <span className="material-symbols-outlined !text-lg">description</span>
                                    </span>
                                    The Mission
                                </h3>
                                <div className="prose dark:prose-invert prose-slate max-w-none">
                                    <p className="text-slate-600 dark:text-gray-300 leading-relaxed text-base md:text-lg">
                                        {task.description}
                                    </p>
                                </div>
                            </section>

                            {/* Requirements */}
                            <section>
                                <h3 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                                    <span className="size-8 rounded-xl bg-d2e-primary/10 text-d2e-primary flex items-center justify-center">
                                        <span className="material-symbols-outlined !text-lg">terminal</span>
                                    </span>
                                    Execution Specs
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {task.required_skills?.map((req, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-d2e-accent-dark/30 rounded-2xl border border-transparent hover:border-d2e-primary/20 transition-all">
                                            <div className="size-10 rounded-xl bg-d2e-primary/20 flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-d2e-primary !text-xl">check</span>
                                            </div>
                                            <span className="text-sm font-bold text-slate-700 dark:text-gray-300 italic">"{req}"</span>
                                        </div>
                                    ))}
                                    {(!task.required_skills || task.required_skills.length === 0) && (
                                        <p className="text-slate-400 italic">Standard execution protocol applies.</p>
                                    )}
                                </div>
                            </section>

                            {/* About the Poster */}
                            <section className="pt-8 border-t border-slate-100 dark:border-white/5">
                                <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                                    <div className="size-20 rounded-[1.5rem] bg-gradient-to-br from-d2e-primary to-emerald-600 flex items-center justify-center text-d2e-bg-dark text-4xl font-black shadow-lg">
                                        {task.poster_name ? task.poster_name.charAt(0) : 'P'}
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                            <h4 className="font-black text-slate-900 dark:text-white text-2xl tracking-tight">{task.poster_name || 'Anonymous Poster'}</h4>
                                            <span className="material-symbols-outlined text-blue-500 fill-1">verified</span>
                                        </div>
                                        <div className="flex items-center justify-center md:justify-start gap-3">
                                            <div className="flex text-amber-400">
                                                {[1, 2, 3, 4, 5].map(s => <span key={s} className="material-symbols-outlined !text-[16px] fill-1">star</span>)}
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Elite Verified Entity</span>
                                        </div>
                                    </div>
                                    <button className="h-10 px-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">Contact Entity</button>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Right Column: Reward & Claim (Sticky) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                        {/* Payout Card */}
                        <div className="bg-white dark:bg-d2e-surface-dark rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/5 shadow-2xl shadow-d2e-primary/5">
                            <div className="flex flex-col items-center text-center mb-8">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Network Payout</span>
                                <h2 className="text-d2e-primary text-6xl font-black tracking-tighter mb-4">₦{parseFloat(task.pay_per_slot).toLocaleString()}</h2>
                                <div className="px-4 py-1.5 bg-d2e-primary/10 rounded-full border border-d2e-primary/20">
                                    <span className="text-[10px] font-black text-d2e-primary uppercase tracking-widest">Per Successful execution</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-d2e-accent-dark/40 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-orange-400">event_available</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Deadline</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-900 dark:text-white">{new Date(task.deadline).toLocaleDateString()}</span>
                                </div>
                                <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-d2e-accent-dark/40 rounded-2xl">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-d2e-primary">groups</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Available Slots</span>
                                        </div>
                                        <span className="text-sm font-black text-d2e-primary">{task.total_slots - task.filled_slots}/{task.total_slots}</span>
                                    </div>
                                    <div className="h-2 w-full bg-white dark:bg-black/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-d2e-primary to-emerald-400" style={{ width: `${(task.filled_slots / task.total_slots) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleClaim}
                                disabled={claiming || isClaimed || (task.total_slots - task.filled_slots) <= 0}
                                className={`w-full h-16 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl ${isClaimed ? 'bg-slate-200 dark:bg-white/5 text-slate-400 cursor-not-allowed' : 'bg-d2e-primary hover:bg-d2e-primary hover:scale-[1.02] text-d2e-bg-dark shadow-d2e-primary/20'}`}
                            >
                                <span className="font-black text-lg uppercase tracking-widest">{claiming ? 'Processing...' : isClaimed ? 'Access Granted' : 'Claim Task'}</span>
                                {!isClaimed && <span className="material-symbols-outlined font-black">bolt</span>}
                            </button>
                        </div>

                        {/* Additional Info Cards */}
                        <div className="rounded-[2rem] bg-gradient-to-br from-indigo-600 to-purple-800 p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <span className="material-symbols-outlined !text-7xl font-black">security</span>
                            </div>
                            <h4 className="font-black text-lg mb-2 uppercase tracking-tight">Secured Opportunity</h4>
                            <p className="text-white/70 text-sm leading-relaxed mb-4">This task is backed by Resconate Escrow. Your payout is guaranteed upon successful verification.</p>
                            <Link href="/help" className="text-xs font-black uppercase tracking-widest border-b border-white/30 pb-0.5 hover:border-white transition-all">Learn More</Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
