import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

const OnboardingSuccess = () => {
    return (
        <div className="bg-cloaka-bg-light dark:bg-cloaka-bg-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
            <Head>
                <title>Success! | Resconate HR Lite</title>
            </Head>
            <main className="flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto min-h-screen">
                <div className="w-24 h-24 bg-brand-gradient rounded-3xl flex items-center justify-center animate-bounce mb-10 shadow-2xl shadow-indigo-500/20">
                    <span className="material-symbols-outlined text-5xl text-white font-black">celebration</span>
                </div>

                <h1 className="text-5xl font-black mb-6 tracking-tighter">You're all set, Acme!</h1>
                <p className="text-slate-600 dark:text-slate-400 text-xl font-medium max-w-2xl mb-12">
                    We've generated your Employment Contracts, Staff Handbook, and Leave Policy. They're already waiting in your dashboard.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
                    <div className="p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center group hover:border-cloaka-primary transition-all">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl font-black">file_download</span>
                        </div>
                        <h3 className="font-extrabold text-lg mb-2">Staff Handbook</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-6">Generated PDF • 1.2 MB</p>
                        <button className="text-cloaka-primary font-black text-xs uppercase tracking-widest underline decoration-2 underline-offset-4">Download Now</button>
                    </div>
                    <div className="p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center group hover:border-cloaka-primary transition-all">
                        <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl font-black">smart_display</span>
                        </div>
                        <h3 className="font-extrabold text-lg mb-2">Tutorial Video</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-6">3 Minute Onboarding</p>
                        <button className="text-cloaka-primary font-black text-xs uppercase tracking-widest underline decoration-2 underline-offset-4">Watch Now</button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                    <button
                        className="flex-1 bg-cloaka-primary text-white font-black py-5 rounded-2xl shadow-2xl shadow-cloaka-primary/30 group transition-all"
                        onClick={() => window.location.href = '/hr/lite/dashboard'}
                    >
                        Go to Dashboard
                    </button>
                    <button className="flex-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-100 dark:border-slate-800 font-black py-5 rounded-2xl transition-all">
                        Invite Employees
                    </button>
                </div>

                <p className="mt-12 text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em]">Ready to scale? We're with you.</p>
            </main>
        </div>
    );
};

export default OnboardingSuccess;
