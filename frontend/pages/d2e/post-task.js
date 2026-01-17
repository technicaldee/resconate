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
        <div className="min-h-screen bg-d2e-bg-light dark:bg-d2e-bg-dark font-display text-slate-900 dark:text-white pb-20">
            <Head>
                <title>Post a Task - D2E</title>
            </Head>

            <header className="sticky top-0 z-50 bg-d2e-bg-light/80 dark:bg-d2e-bg-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 p-4">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <button onClick={() => router.back()} className="flex items-center justify-center size-10">
                        <span className="material-symbols-outlined">arrow_back_ios</span>
                    </button>
                    <h2 className="text-lg font-bold">Post New Task</h2>
                    <div className="size-10"></div>
                </div>
            </header>

            <main className="max-w-md mx-auto p-4 pt-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-black tracking-tight mb-2">Hire the <br /><span className="text-d2e-primary text-4xl">D2E Squad</span></h1>
                    <p className="text-slate-500 dark:text-gray-400 text-sm">Fill in the details for your campaign.</p>
                </div>

                <div className="bg-white dark:bg-[#1a2e1e] rounded-3xl p-6 border border-slate-200 dark:border-gray-800 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-d2e-primary"></div>

                    {step === 1 && (
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Task Title</label>
                                <input
                                    name="title"
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 dark:bg-d2e-bg-dark border border-slate-200 dark:border-gray-800 rounded-xl h-14 px-6 text-base focus:ring-2 focus:ring-d2e-primary outline-none transition-all dark:text-white"
                                    placeholder="e.g. Subscribe to YouTube Channel"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Reward Per Slot (₦)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-d2e-primary font-bold">₦</span>
                                    <input
                                        name="reward"
                                        type="number"
                                        required
                                        min="100"
                                        className="w-full bg-slate-50 dark:bg-d2e-bg-dark border border-slate-200 dark:border-gray-800 rounded-xl h-14 pl-10 pr-6 text-xl font-bold focus:ring-2 focus:ring-d2e-primary outline-none transition-all dark:text-white"
                                        placeholder="5000"
                                        value={formData.reward}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Slots</label>
                                    <input
                                        name="slots"
                                        type="number"
                                        required
                                        min="1"
                                        className="w-full bg-slate-50 dark:bg-d2e-bg-dark border border-slate-200 dark:border-gray-800 rounded-xl h-14 px-6 text-base focus:ring-2 focus:ring-d2e-primary outline-none transition-all dark:text-white"
                                        placeholder="10"
                                        value={formData.slots}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Category</label>
                                    <select
                                        name="type"
                                        className="w-full bg-slate-50 dark:bg-d2e-bg-dark border border-slate-200 dark:border-gray-800 rounded-xl h-14 px-4 text-sm focus:ring-2 focus:ring-d2e-primary outline-none transition-all dark:text-white appearance-none"
                                        value={formData.type}
                                        onChange={handleChange}
                                    >
                                        <option value="FIXED">Social Media</option>
                                        <option value="FIXED">Surveys</option>
                                        <option value="COMPETITION">Creative</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Deadline Date</label>
                                <input
                                    name="deadline"
                                    type="date"
                                    required
                                    className="w-full bg-slate-50 dark:bg-d2e-bg-dark border border-slate-200 dark:border-gray-800 rounded-xl h-14 px-6 text-base focus:ring-2 focus:ring-d2e-primary outline-none transition-all dark:text-white"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="bg-d2e-bg-dark/50 p-4 rounded-2xl border border-white/5 flex justify-between items-center group">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-d2e-primary uppercase tracking-[0.2em] mb-1">Total Budget</span>
                                    <span className="text-xl font-black text-white group-hover:scale-105 transition-transform">₦{totals.total.toLocaleString()}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] text-[#92c9a4] block">Incl. 15% Fee</span>
                                    <span className="text-[10px] text-white/40">Secured in Escrow</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full h-16 bg-d2e-primary text-d2e-bg-dark font-black rounded-2xl shadow-lg shadow-d2e-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg"
                            >
                                <span>Continue</span>
                                <span className="material-symbols-outlined font-black">arrow_forward</span>
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <div className="text-center py-6">
                            <div className="mb-8">
                                <h2 className="text-2xl font-black mb-2">Fund Campaign</h2>
                                <p className="text-slate-400 text-sm px-4">Secure the task budget in escrow to activate your campaign instantly.</p>
                            </div>

                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-left mb-8 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Campaign Reward</span>
                                    <span>₦{totals.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Platform Fee</span>
                                    <span>₦{totals.fee.toLocaleString()}</span>
                                </div>
                                <div className="h-px bg-white/10 my-2"></div>
                                <div className="flex justify-between font-black text-xl">
                                    <span>Total Pay</span>
                                    <span className="text-d2e-primary">₦{totals.total.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleFund}
                                disabled={loading}
                                className="w-full h-16 bg-white text-d2e-bg-dark font-black rounded-2xl shadow-xl flex justify-center items-center gap-3 transition-all active:scale-[0.98]"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-d2e-bg-dark border-t-transparent"></div>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined font-black">payments</span>
                                        <span>Full Fund Escrow</span>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => setStep(1)}
                                disabled={loading}
                                className="mt-4 text-slate-400 font-bold hover:text-white transition-colors"
                            >
                                Edit Details
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
