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

            <header className="sticky top-0 z-50 bg-d2e-bg-light/80 dark:bg-d2e-bg-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 p-4">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <button onClick={() => router.back()} className="flex items-center justify-center h-10 w-10">
                        <span className="material-symbols-outlined">arrow_back_ios</span>
                    </button>
                    <h2 className="text-lg font-bold">Payout Details</h2>
                    <div className="w-10"></div>
                </div>
            </header>

            <main className="max-w-md mx-auto p-4 pt-10">
                <div className="mb-8">
                    <h3 className="text-2xl font-black tracking-tight mb-2">Where should we <br /><span className="text-d2e-primary">send your money?</span></h3>
                    <p className="text-slate-500 dark:text-gray-400 text-sm">Add your local bank account details carefully. This is where your task earnings will be sent.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Select Bank</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#92c9a4]">account_balance</span>
                                <select
                                    name="bankName"
                                    className="w-full bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-gray-800 rounded-xl h-14 pl-12 pr-6 text-base focus:ring-2 focus:ring-d2e-primary focus:border-transparent outline-none transition-all appearance-none"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select your bank</option>
                                    <option value="access">Access Bank</option>
                                    <option value="gtbank">Guaranty Trust Bank (GTB)</option>
                                    <option value="kuda">Kuda Microfinance Bank</option>
                                    <option value="opay">OPay</option>
                                    <option value="palmpay">PalmPay</option>
                                    <option value="zenith">Zenith Bank</option>
                                    <option value="uab">United Bank for Africa (UBA)</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                            </div>
                        </div>

                        <div className="relative group">
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Account Number</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#92c9a4]">pin</span>
                                <input
                                    type="text"
                                    name="accountNumber"
                                    inputMode="numeric"
                                    maxLength={10}
                                    placeholder="0123456789"
                                    className="w-full bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-gray-800 rounded-xl h-14 pl-12 pr-6 text-base tracking-widest focus:ring-2 focus:ring-d2e-primary focus:border-transparent outline-none transition-all"
                                    value={formData.accountNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Account Name</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#92c9a4]">person</span>
                                <input
                                    type="text"
                                    name="accountName"
                                    placeholder="FULL NAME ON BANK"
                                    className="w-full bg-white dark:bg-[#1a2e1e] border border-slate-200 dark:border-gray-800 rounded-xl h-14 pl-12 pr-6 text-base uppercase focus:ring-2 focus:ring-d2e-primary focus:border-transparent outline-none transition-all"
                                    value={formData.accountName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 ml-1 italic">* Must match the name on your profile</p>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading || !formData.accountNumber || !formData.bankName}
                            className="w-full h-14 bg-d2e-primary hover:bg-d2e-primary/90 text-d2e-bg-dark font-black rounded-xl shadow-lg shadow-d2e-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-d2e-bg-dark border-t-transparent"></div>
                            ) : (
                                <>
                                    <span>Verify Account</span>
                                    <span className="material-symbols-outlined font-bold">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                    <div className="flex gap-3">
                        <span className="material-symbols-outlined text-blue-400">info</span>
                        <div>
                            <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-tight">Daily Withdrawals</h4>
                            <p className="text-[11px] text-gray-400 leading-normal">
                                Once verified, you can withdraw your task earnings daily to this bank account instantly.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
