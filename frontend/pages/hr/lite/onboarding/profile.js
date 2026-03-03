import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

const BusinessProfile = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [businessId, setBusinessId] = useState(null);
    const [formData, setFormData] = useState({
        business_type: '',
        employee_count: '',
        payment_frequency: ''
    });

    useEffect(() => {
        const id = localStorage.getItem('hr_lite_business_id');
        if (!id) {
            router.push('/hr/lite/signup');
        } else {
            setBusinessId(id);
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/hr/lite/business/${businessId}/onboarding`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('hr_lite_token')}`
                },
                body: JSON.stringify({
                    ...formData,
                    employee_count: parseInt(formData.employee_count) || 0,
                    onboarding_step: 3
                })
            });
            const data = await res.json();

            if (data.success) {
                router.push('/hr/lite/onboarding/funding');
            } else {
                alert('Save failed: ' + data.error);
            }
        } catch (err) {
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-cloaka-bg-light dark:bg-cloaka-bg-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
            <Head>
                <title>Business Profile | Resconate HR Lite</title>
            </Head>
            <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
                <header className="flex items-center justify-between border-b border-solid border-slate-200 dark:border-slate-800 px-8 py-6 bg-white dark:bg-slate-900 font-black text-xs uppercase tracking-widest text-slate-400">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center">
                            <img src="/RLogo.png" alt="R" className="w-5 h-5 brightness-0 invert" />
                        </div>
                        <span>Resconate HR Lite</span>
                    </div>
                </header>

                <main className="flex-1 flex justify-center py-12 px-4 md:px-10">
                    <div className="flex flex-col w-full max-w-xl">
                        <div className="mb-12">
                            <h1 className="text-4xl font-black mb-3 tracking-tighter">Tell us about your team.</h1>
                            <p className="text-slate-500 font-medium text-lg leading-relaxed">We'll use this to customize your Staff Handbook and tax rules.</p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-10 shadow-2xl shadow-indigo-500/5">
                            <form className="space-y-8" onSubmit={handleSave}>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Sector</label>
                                    <select
                                        name="business_type"
                                        required
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all font-bold text-sm"
                                    >
                                        <option value="" disabled selected>Select industry</option>
                                        <option value="retail">Retail & Commerce</option>
                                        <option value="logistics">Logistics & Delivery</option>
                                        <option value="tech">Technology & Creative</option>
                                        <option value="service">Personal Services (Salons, etc)</option>
                                        <option value="manufacturing">Manufacturing</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Approximate Team Size</label>
                                    <select
                                        name="employee_count"
                                        required
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all font-bold text-sm"
                                    >
                                        <option value="" disabled selected>Select size</option>
                                        <option value="5">1 - 5 staff</option>
                                        <option value="20">6 - 20 staff</option>
                                        <option value="50">21 - 50 staff</option>
                                        <option value="100">51+ staff</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payroll Cycle</label>
                                    <select
                                        name="payment_frequency"
                                        required
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all font-bold text-sm"
                                    >
                                        <option value="" disabled selected>Select frequency</option>
                                        <option value="weekly">Weekly (Every Friday)</option>
                                        <option value="bi-weekly">Bi-Weekly</option>
                                        <option value="monthly">Monthly (25th - 30th)</option>
                                    </select>
                                </div>

                                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                                    <button
                                        type="button"
                                        onClick={() => router.back()}
                                        className="flex-1 py-5 rounded-2xl border-2 border-slate-50 dark:border-slate-800 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-5 rounded-2xl bg-cloaka-primary text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-cloaka-primary/30 hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? 'Saving...' : 'Set Funding Source'}
                                        <span className="material-symbols-outlined text-lg font-black">arrow_forward</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default BusinessProfile;
