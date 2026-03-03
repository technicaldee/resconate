import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

const CheckoutConfirmation = () => {
    const router = useRouter();
    const [generating, setGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [businessId, setBusinessId] = useState(null);

    useEffect(() => {
        const id = localStorage.getItem('hr_lite_business_id');
        if (id) setBusinessId(id);
    }, []);

    const handleGenerate = async () => {
        if (!businessId) {
            alert('Business context lost. Please return to signup.');
            return;
        }

        setGenerating(true);

        // Progress simulation for UI feel
        const interval = setInterval(() => {
            setProgress(prev => (prev < 90 ? prev + 10 : prev));
        }, 500);

        try {
            const res = await fetch(`/api/hr/lite/business/${businessId}/generate-handbook`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();

            clearInterval(interval);
            setProgress(100);

            if (data.success) {
                setTimeout(() => {
                    localStorage.setItem('hr_lite_handbook_url', data.handbookUrl);
                    router.push('/hr/lite/onboarding/success');
                }, 800);
            } else {
                alert('Generation failed: ' + data.error);
                setGenerating(false);
            }
        } catch (err) {
            clearInterval(interval);
            alert('An error occurred during generation.');
            setGenerating(false);
        }
    };

    return (
        <div className="bg-cloaka-bg-light dark:bg-cloaka-bg-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
            <Head>
                <title>Finalizing Setup | Resconate HR Lite</title>
            </Head>
            <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
                <header className="flex items-center justify-between border-b border-solid border-slate-200 dark:border-slate-800 px-8 lg:px-40 py-6 bg-white dark:bg-slate-900 shadow-sm relative z-10 font-black text-xs uppercase tracking-widest text-slate-400">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center">
                            <img src="/RLogo.png" alt="R" className="w-5 h-5 brightness-0 invert" />
                        </div>
                        <span>Resconate HR Lite</span>
                    </div>
                </header>

                <main className="flex flex-1 items-center justify-center py-10 px-4">
                    <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 p-12 shadow-2xl shadow-indigo-500/10 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>

                        {!generating ? (
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-3xl flex items-center justify-center mb-10 transition-all hover:scale-110">
                                    <span className="material-symbols-outlined text-5xl font-black">award_star</span>
                                </div>
                                <h1 className="text-5xl font-black mb-6 tracking-tighter">Payment Received!</h1>
                                <p className="text-slate-600 dark:text-slate-400 text-xl font-medium max-w-md mx-auto leading-relaxed mb-12">
                                    Your account is now active. The final step is to generate your automated HR assets.
                                </p>

                                <div className="w-full p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 mb-12 text-left space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-2">Automated Assets Pending</h3>
                                    <div className="flex items-center gap-4 text-sm font-bold">
                                        <span className="material-symbols-outlined text-green-500">check_circle</span>
                                        <span>Staff Handbook (Personalized)</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm font-bold">
                                        <span className="material-symbols-outlined text-green-500">check_circle</span>
                                        <span>Standard Employment Contract</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm font-bold">
                                        <span className="material-symbols-outlined text-green-500">check_circle</span>
                                        <span>Leave & Absence Policy</span>
                                    </div>
                                </div>

                                <button
                                    className="w-full bg-cloaka-primary text-white font-black py-6 rounded-2xl shadow-2xl shadow-cloaka-primary/30 flex items-center justify-center gap-3 group transition-all"
                                    onClick={handleGenerate}
                                >
                                    Generate Handbook & Finish
                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform font-black">auto_awesome</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-center py-12">
                                <div className="w-32 h-32 relative mb-12">
                                    <div className="absolute inset-0 border-8 border-indigo-100 dark:border-slate-800 rounded-full"></div>
                                    <div
                                        className="absolute inset-0 border-8 border-indigo-500 rounded-full transition-all duration-500"
                                        style={{ clipPath: `inset(0 0 0 ${100 - progress}%)` }}
                                    ></div>
                                    <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-indigo-500">
                                        {progress}%
                                    </div>
                                </div>
                                <h1 className="text-4xl font-black mb-4 tracking-tight">Generating your assets...</h1>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">Please don't close this window. We're personalizing your handbook and setting up your WhatsApp triggers.</p>

                                <div className="mt-12 w-full max-w-xs space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <span>Status</span>
                                        <span className="text-indigo-500">Processing</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CheckoutConfirmation;
