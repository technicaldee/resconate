import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

const CheckoutDetails = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [businessId, setBusinessId] = useState(null);
    const [planData, setPlanData] = useState({ name: 'Growth', price: '15,000' });

    useEffect(() => {
        const id = localStorage.getItem('hr_lite_business_id');
        if (!id) {
            router.push('/hr/lite/signup');
        } else {
            setBusinessId(id);
            // In a real app we'd fetch the current business profile here
            // For now we'll assume the state from earlier steps
        }
    }, []);

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/hr/lite/business/${businessId}/onboarding`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('hr_lite_token')}`
                },
                body: JSON.stringify({ onboarding_step: 5 }) // Ready for generation
            });
            const data = await res.json();

            if (data.success) {
                router.push('/hr/lite/onboarding/confirmation');
            } else {
                alert('Payment verification failed.');
            }
        } catch (err) {
            alert('An error occurred during payment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-cloaka-bg-light dark:bg-cloaka-bg-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
            <Head>
                <title>Checkout | Resconate HR Lite</title>
            </Head>
            <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
                <header className="flex items-center justify-between border-b border-solid border-slate-200 dark:border-slate-800 px-8 py-6 bg-white dark:bg-slate-900 shadow-sm relative z-10 font-black text-xs uppercase tracking-widest text-slate-400">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center">
                            <img src="/RLogo.png" alt="R" className="w-5 h-5 brightness-0 invert" />
                        </div>
                        <span>Resconate HR Lite</span>
                    </div>
                    <button onClick={() => router.back()} className="hover:text-slate-900 transition-colors">Go Back</button>
                </header>

                <main className="flex-1 flex justify-center py-12 px-4">
                    <div className="flex flex-col md:flex-row w-full max-w-6xl gap-12">
                        {/* Left: Summary */}
                        <div className="flex-1">
                            <div className="mb-10">
                                <h2 className="text-4xl font-black tracking-tighter mb-4 text-slate-900 dark:text-white">Review your subscription.</h2>
                                <p className="text-slate-500 font-medium text-lg leading-relaxed">No hidden fees. 90 days free for new businesses.</p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-10 shadow-2xl shadow-indigo-500/5">
                                <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-50 dark:border-slate-800">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
                                            <span className="material-symbols-outlined text-2xl font-black">rocket_launch</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black">{planData.name} Plan</h3>
                                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">HR & Payroll Automation</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-baseline gap-1 justify-end">
                                            <span className="text-3xl font-black">₦{planData.price}</span>
                                        </div>
                                        <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-1">per month</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-slate-400">Monthly subscription</span>
                                        <span>₦{planData.price}.00</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-slate-400">Platform setup fee</span>
                                        <span className="text-emerald-500">FREE</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-slate-400">90-Day Trial discount</span>
                                        <span className="text-emerald-500">- 100%</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-800">
                                    <span className="text-lg font-black tracking-tight">Total Due Now</span>
                                    <span className="text-4xl font-black text-indigo-500">₦0.00</span>
                                </div>

                                <div className="mt-8 flex gap-4 p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/20">
                                    <span className="material-symbols-outlined text-indigo-500 font-black">lock_person</span>
                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">"You will not be charged today. Your first payment of ₦{planData.price} will be processed automatically after your 90-day free trial on June 15, 2024."</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Form */}
                        <div className="w-full md:w-[450px]">
                            <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-10 shadow-2xl shadow-indigo-500/10 h-fit">
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="text-xl font-black">Payment Details</h3>
                                    <div className="flex gap-2">
                                        <img src="https://paystack.com/assets/img/login/paystack-logo.png" className="h-4 grayscale opacity-40" alt="Paystack" />
                                    </div>
                                </div>

                                <form className="space-y-6" onSubmit={handlePayment}>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cardholder Name</label>
                                        <input
                                            className="w-full rounded-2xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 font-bold text-sm focus:border-indigo-500 outline-none transition-all"
                                            placeholder="Full name as on card"
                                            type="text"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 relative">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                                        <input
                                            className="w-full rounded-2xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 font-bold text-sm focus:border-indigo-500 outline-none transition-all tracking-[0.2em]"
                                            placeholder="0000 0000 0000 0000"
                                            type="text"
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1 space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry</label>
                                            <input
                                                className="w-full rounded-2xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 font-bold text-sm focus:border-indigo-500 outline-none transition-all"
                                                placeholder="MM/YY"
                                                type="text"
                                                required
                                            />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CVV</label>
                                            <input
                                                className="w-full rounded-2xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 font-bold text-sm focus:border-indigo-500 outline-none transition-all"
                                                placeholder="***"
                                                type="password"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        className="w-full py-6 bg-cloaka-primary text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-cloaka-primary/30 hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4 group"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : 'Securely Activate Trial'}
                                        <span className="material-symbols-outlined text-lg font-black group-hover:rotate-12 transition-transform">verified_user</span>
                                    </button>
                                </form>

                                <div className="mt-12 flex justify-center grayscale opacity-30">
                                    <img src="https://mono.co/images/logo.svg" className="h-6" alt="Secure Gateway" />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CheckoutDetails;
