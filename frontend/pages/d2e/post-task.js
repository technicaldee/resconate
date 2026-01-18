import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { apiFetch } from '../../src/utils/api';

export default function PostTask() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'FIXED',
        reward: '',
        slots: '',
        deadline: '',
        skills: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculateTotal = () => {
        const r = parseFloat(formData.reward) || 0;
        const s = parseInt(formData.slots) || 0;
        const subtotal = r * (formData.type === 'FIXED' ? s : 1);
        const fee = subtotal * 0.15; // 15% fee
        return { subtotal, fee, total: subtotal + fee };
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setStep(2); // Go to funding
    };

    const handleFund = async () => {
        setLoading(true);
        try {
            // In a real flow, this would create the task and return a payment URL
            // For now, we simulate and redirect
            const res = await apiFetch('/api/marketplace/tasks', {
                method: 'POST',
                body: JSON.stringify({
                    ...formData,
                    pay_per_slot: formData.reward,
                    total_slots: formData.slots,
                    required_skills: formData.skills.split(',').map(s => s.trim())
                })
            });
            const data = await res.json();
            if (data.success) {
                router.push('/d2e/poster/dashboard');
            } else {
                alert(data.error || 'Failed to post task');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const totals = calculateTotal();

    return (
        <div className="min-h-screen bg-d2e-bg-light dark:bg-d2e-bg-dark font-display text-slate-900 dark:text-white pb-32">
            <Head>
                <title>Post a Task - D2E</title>
            </Head>

            <nav className="sticky top-0 z-50 bg-d2e-bg-light/80 dark:bg-d2e-bg-dark/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button onClick={() => router.back()} className="flex size-10 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined">arrow_back_ios</span>
                    </button>
                    <h2 className="text-lg font-black uppercase tracking-widest text-center flex-1">Launch Campaign</h2>
                    <div className="size-10"></div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Progress Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`size-12 rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-500 ${step === 1 ? 'bg-d2e-primary text-d2e-bg-dark shadow-lg shadow-d2e-primary/20' : 'bg-d2e-primary/20 text-d2e-primary'}`}>01</div>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10"></div>
                        <div className={`size-12 rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-500 ${step === 2 ? 'bg-d2e-primary text-d2e-bg-dark shadow-lg shadow-d2e-primary/20' : 'bg-white/5 text-slate-400 border border-white/5'}`}>02</div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
                        Hire the <span className="text-d2e-primary">D2E Squad.</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Side: Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white dark:bg-d2e-surface-dark rounded-[2.5rem] p-8 md:p-12 border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-d2e-primary to-emerald-500"></div>

                            {step === 1 && (
                                <form onSubmit={handleCreate} className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Campaign Identity</label>
                                        <input
                                            name="title"
                                            type="text"
                                            required
                                            className="w-full bg-slate-50 dark:bg-d2e-bg-dark border border-slate-200 dark:border-white/5 rounded-2xl h-16 px-6 text-base font-bold focus:ring-2 focus:ring-d2e-primary/20 focus:border-d2e-primary outline-none transition-all dark:text-white"
                                            placeholder="e.g. Subscribe to YouTube Channel"
                                            value={formData.title}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Reward/Slot (₦)</label>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-d2e-primary font-black text-xl">₦</span>
                                                <input
                                                    name="reward"
                                                    type="number"
                                                    required
                                                    min="100"
                                                    className="w-full bg-slate-50 dark:bg-d2e-bg-dark border border-slate-200 dark:border-white/5 rounded-2xl h-16 pl-12 pr-6 text-2xl font-black focus:ring-2 focus:ring-d2e-primary/20 focus:border-d2e-primary outline-none transition-all dark:text-white"
                                                    placeholder="5000"
                                                    value={formData.reward}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Total Force (Slots)</label>
                                            <input
                                                name="slots"
                                                type="number"
                                                required
                                                min="1"
                                                className="w-full bg-slate-50 dark:bg-d2e-bg-dark border border-slate-200 dark:border-white/5 rounded-2xl h-16 px-6 text-2xl font-black focus:ring-2 focus:ring-d2e-primary/20 focus:border-d2e-primary outline-none transition-all dark:text-white"
                                                placeholder="10"
                                                value={formData.slots}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Industry Sector</label>
                                            <div className="relative">
                                                <select
                                                    name="type"
                                                    className="w-full bg-slate-50 dark:bg-d2e-bg-dark border border-slate-200 dark:border-white/5 rounded-2xl h-16 px-6 text-sm font-bold focus:ring-2 focus:ring-d2e-primary/20 focus:border-d2e-primary outline-none transition-all dark:text-white appearance-none"
                                                    value={formData.type}
                                                    onChange={handleChange}
                                                >
                                                    <option value="FIXED">Social Engagement</option>
                                                    <option value="FIXED">Market Research</option>
                                                    <option value="COMPETITION">Creative Bounty</option>
                                                </select>
                                                <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Expiry Protocol</label>
                                            <input
                                                name="deadline"
                                                type="date"
                                                required
                                                className="w-full bg-slate-50 dark:bg-d2e-bg-dark border border-slate-200 dark:border-white/5 rounded-2xl h-16 px-6 text-base font-bold focus:ring-2 focus:ring-d2e-primary/20 focus:border-d2e-primary outline-none transition-all dark:text-white"
                                                value={formData.deadline}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full h-18 bg-d2e-primary text-d2e-bg-dark font-black rounded-2xl shadow-xl shadow-d2e-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-xl uppercase tracking-widest hover:scale-[1.01]"
                                    >
                                        <span>Lock Parameters</span>
                                        <span className="material-symbols-outlined font-black text-2xl">arrow_forward</span>
                                    </button>
                                </form>
                            )}

                            {step === 2 && (
                                <div className="text-center py-4">
                                    <div className="mb-10">
                                        <div className="size-20 bg-d2e-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                            <span className="material-symbols-outlined !text-4xl text-d2e-primary">account_balance_wallet</span>
                                        </div>
                                        <h2 className="text-3xl font-black mb-2 tracking-tight">Activate Deployment</h2>
                                        <p className="text-slate-400 text-sm max-w-sm mx-auto font-medium">Secure the campaign budget in Resconate Escrow to unlock active earning immediately.</p>
                                    </div>

                                    <div className="space-y-4 mb-10">
                                        <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-d2e-bg-dark rounded-[2rem] border border-slate-100 dark:border-white/5">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Force Pay</span>
                                            <span className="text-xl font-black">₦{totals.subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-d2e-bg-dark rounded-[2rem] border border-slate-100 dark:border-white/5">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Fee (15%)</span>
                                            <span className="text-xl font-black text-amber-500">₦{totals.fee.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleFund}
                                        disabled={loading}
                                        className="w-full h-20 bg-white text-d2e-bg-dark font-black rounded-3xl shadow-2xl flex justify-center items-center gap-4 transition-all active:scale-[0.98] text-2xl uppercase tracking-[0.1em]"
                                    >
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-d2e-bg-dark border-t-transparent"></div>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined !text-3xl font-black">payments</span>
                                                <span>Deploy ₦{totals.total.toLocaleString()}</span>
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => setStep(1)}
                                        disabled={loading}
                                        className="mt-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-d2e-primary transition-all underline underline-offset-4"
                                    >
                                        Re-evaluate Parameters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Summary Card */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-gradient-to-br from-[#193322] to-d2e-bg-dark rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                <span className="material-symbols-outlined !text-8xl font-black">shield</span>
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-d2e-primary mb-6">Asset Allocation Summary</h4>
                                <div className="space-y-6">
                                    <div className="flex flex-col">
                                        <span className="text-4xl md:text-6xl font-black tracking-tighter mb-1">₦{totals.total.toLocaleString()}</span>
                                        <span className="text-[10px] font-bold uppercase text-white/40 italic">Total Escrow Deployment</span>
                                    </div>
                                    <div className="h-px bg-white/10"></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-white/40 text-[10px] font-black uppercase mb-1">Slots</p>
                                            <p className="text-xl font-black text-d2e-primary">{formData.slots || '0'}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/40 text-[10px] font-black uppercase mb-1">Sector</p>
                                            <p className="text-xl font-black text-d2e-primary">{formData.type}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-d2e-surface-dark rounded-[2rem] p-8 border border-slate-200 dark:border-white/5 space-y-6 shadow-sm">
                            <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-400 text-lg">verified</span>
                                Quality Control
                            </h4>
                            <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed font-medium">
                                Every submission is manually verified by our system. You only pay for successful, validated actions.
                            </p>
                            <div className="p-4 bg-slate-50 dark:bg-d2e-bg-dark rounded-2xl border border-slate-100 dark:border-white/5">
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-[11px] font-bold">
                                        <span className="size-1.5 rounded-full bg-d2e-primary"></span>
                                        Real-time tracking
                                    </li>
                                    <li className="flex items-center gap-3 text-[11px] font-bold">
                                        <span className="size-1.5 rounded-full bg-d2e-primary"></span>
                                        Anti-fraud algorithms
                                    </li>
                                    <li className="flex items-center gap-3 text-[11px] font-bold">
                                        <span className="size-1.5 rounded-full bg-d2e-primary"></span>
                                        Escrow protection
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
