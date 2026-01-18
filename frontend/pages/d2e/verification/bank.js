import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { apiFetch } from '../../../src/utils/api';

export default function BankKYC() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        bankName: '',
        accountNumber: '',
        accountName: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await apiFetch('/api/d2e/bank-details', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                alert('Bank details updated successfully!');
                router.push('/d2e/verification');
            } else {
                alert(data.error || 'Failed to update bank details');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-d2e-bg-light dark:bg-d2e-bg-dark text-slate-900 dark:text-white font-display min-h-screen">
            <Head>
                <title>Bank Details KYC - D2E</title>
            </Head>

            <nav className="sticky top-0 z-50 bg-d2e-bg-light/80 dark:bg-d2e-bg-dark/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button onClick={() => router.back()} className="flex size-10 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined">arrow_back_ios</span>
                    </button>
                    <h2 className="text-lg font-black uppercase tracking-widest text-center flex-1">Payout Protocol</h2>
                    <div className="w-10"></div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-center">
                    <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                        {/* Information Side */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">Where should we <br /><span className="text-d2e-primary">send your funds?</span></h3>
                                <p className="text-slate-500 dark:text-gray-400 text-lg font-medium leading-relaxed">
                                    Configure your primary withdrawal channel. Ensure all details exactly match your government-issued identity documents.
                                </p>
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-8 space-y-4">
                                <div className="size-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <span className="material-symbols-outlined text-white">bolt</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-widest mb-1">Instant Settlement</h4>
                                    <p className="text-xs text-blue-800 dark:text-blue-300 font-medium leading-normal opacity-80">
                                        Once your account is linked, withdrawals are processed through our high-speed settlement layer, reaching your bank in seconds.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Side */}
                        <div className="bg-white dark:bg-d2e-surface-dark rounded-[2.5rem] p-8 md:p-12 border border-slate-200 dark:border-white/5 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-d2e-primary to-emerald-500"></div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-2 relative">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Settlement Bank</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-d2e-primary transition-colors">account_balance</span>
                                        <select
                                            name="bankName"
                                            className="w-full bg-slate-50 dark:bg-d2e-bg-dark border border-slate-200 dark:border-white/5 rounded-2xl h-16 pl-14 pr-6 text-base font-bold focus:ring-2 focus:ring-d2e-primary/20 focus:border-d2e-primary outline-none transition-all appearance-none dark:text-white"
                                            value={formData.bankName}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="" disabled>Select Sector Bank</option>
                                            <option value="access">Access Bank</option>
                                            <option value="gtbank">GTBank</option>
                                            <option value="kuda">Kuda Bank</option>
                                            <option value="opay">OPay</option>
                                            <option value="palmpay">PalmPay</option>
                                            <option value="zenith">Zenith Bank</option>
                                            <option value="uab">UBA</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Channel ID (Account No.)</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-d2e-primary transition-colors">pin</span>
                                        <input
                                            type="text"
                                            name="accountNumber"
                                            inputMode="numeric"
                                            maxLength={10}
                                            placeholder="0123456789"
                                            className="w-full bg-slate-50 dark:bg-d2e-bg-dark border border-slate-200 dark:border-white/5 rounded-2xl h-16 pl-14 pr-6 text-xl font-black tracking-[0.3em] focus:ring-2 focus:ring-d2e-primary/20 focus:border-d2e-primary outline-none transition-all dark:text-white placeholder:tracking-normal placeholder:opacity-20"
                                            value={formData.accountNumber}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Account Holder Name</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-d2e-primary transition-colors">person</span>
                                        <input
                                            type="text"
                                            name="accountName"
                                            placeholder="AS WRITTEN ON ACCOUNT"
                                            className="w-full bg-slate-50 dark:bg-d2e-bg-dark border border-slate-200 dark:border-white/5 rounded-2xl h-16 pl-14 pr-6 text-base font-black uppercase focus:ring-2 focus:ring-d2e-primary/20 focus:border-d2e-primary outline-none transition-all dark:text-white placeholder:opacity-20"
                                            value={formData.accountName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-3 flex items-center gap-1.5 font-bold italic">
                                        <span className="material-symbols-outlined text-[12px]">info</span>
                                        Identity must match your Resconate Profile
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !formData.accountNumber || !formData.bankName}
                                    className="w-full h-18 bg-d2e-primary hover:bg-d2e-primary/90 text-d2e-bg-dark font-black rounded-2xl shadow-xl shadow-d2e-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg uppercase tracking-widest disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-6 w-6 border-3 border-d2e-bg-dark border-t-transparent"></div>
                                    ) : (
                                        <>
                                            <span>Authorize Account</span>
                                            <span className="material-symbols-outlined font-black">arrow_forward</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
