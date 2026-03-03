import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

const HRChoicePage = () => {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col font-display overflow-hidden relative">
            <Head>
                <title>HR Solutions | Resconate</title>
            </Head>
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Header */}
            <header className="relative z-10 p-8 flex items-center justify-between max-w-7xl mx-auto w-full">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-brand-gradient rounded-xl flex items-center justify-center p-2 group-hover:rotate-12 transition-transform">
                        <img src="/RLogo.png" alt="Resconate Logo" className="w-full h-full object-contain brightness-0 invert" />
                    </div>
                    <span className="text-2xl font-black text-white tracking-tighter">Resconate</span>
                </Link>
                <div className="hidden md:flex items-center gap-8">
                    <a href="#" className="text-slate-400 hover:text-white font-bold text-sm tracking-widest uppercase transition-colors">How it works</a>
                    <a href="#" className="text-slate-400 hover:text-white font-bold text-sm tracking-widest uppercase transition-colors">Pricing</a>
                    <Link href="/hr/lite/signup" className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Support</Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-7xl mx-auto w-full">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                        Service Selection
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">Choose Your Path to Mastery.</h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">Whether you're a micro-business owner or a scaling enterprise, we have the perfect HR experience for you.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl h-auto">
                    {/* Choice 1: HR Lite */}
                    <div className="group relative flex flex-col bg-slate-900/50 border border-white/5 rounded-[48px] p-10 hover:border-indigo-500/30 transition-all duration-700 hover:translate-y-[-8px] overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-indigo-500/10 transition-colors duration-700"></div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-16 h-16 bg-indigo-500/10 rounded-[24px] flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                    <span className="material-symbols-outlined text-4xl text-indigo-400 font-black">bolt</span>
                                </div>
                                <span className="px-4 py-1 bg-green-500/10 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-500/20">90 Days Free</span>
                            </div>

                            <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Resconate HR Lite</h2>
                            <p className="text-slate-400 font-medium leading-relaxed mb-10 flex-1">
                                Automated HR for Nigerian Micro-Businesses. From zero to fully structured in under 30 minutes. Conversational, WhatsApp-first, and effortless.
                            </p>

                            <ul className="space-y-4 mb-12">
                                {[
                                    'Automated Employment Contracts',
                                    'WhatsApp Onboarding Flow',
                                    'Nigerian Labor Law Compliant',
                                    'Zero Learning Curve Required'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-200">
                                        <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/20">
                                            <span className="material-symbols-outlined text-xs text-indigo-400 font-black">check</span>
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/hr/lite/signup"
                                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[24px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/20 group/btn transition-all"
                            >
                                Start Automating
                                <span className="material-symbols-outlined group-hover/btn:translate-x-2 transition-transform duration-500">arrow_forward</span>
                            </Link>
                        </div>
                    </div>

                    {/* Choice 2: Remote HR (Professional) */}
                    <div className="group relative flex flex-col bg-slate-900/50 border border-white/5 rounded-[48px] p-10 hover:border-pink-500/30 transition-all duration-700 hover:translate-y-[-8px] overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-pink-500/10 transition-colors duration-700"></div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-16 h-16 bg-pink-500/10 rounded-[24px] flex items-center justify-center border border-pink-500/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                                    <span className="material-symbols-outlined text-4xl text-pink-400 font-black">workspace_premium</span>
                                </div>
                                <span className="px-4 py-1 bg-pink-500/10 text-pink-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-pink-500/20">Enterprise Grade</span>
                            </div>

                            <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Professional Remote HR</h2>
                            <p className="text-slate-400 font-medium leading-relaxed mb-10 flex-1">
                                3rd Party Project Management for growing teams. Our experts handle your workforce as an extension of your company. Focus on scale; we handle the rest.
                            </p>

                            <ul className="space-y-4 mb-12">
                                {[
                                    'Dedicated HR Project Managers',
                                    'Full Recruitment Lifecycle',
                                    'Payroll & Tax Administration',
                                    'Performance & Scaling Support'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-200">
                                        <div className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0 border border-pink-500/20">
                                            <span className="material-symbols-outlined text-xs text-pink-400 font-black">verified</span>
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/hr/remote/login"
                                className="w-full py-5 bg-white text-slate-900 hover:bg-slate-100 rounded-[24px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-white/5 group/btn transition-all"
                            >
                                Contact Experts
                                <span className="material-symbols-outlined group-hover/btn:translate-x-2 transition-transform duration-500">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-20 flex flex-col md:flex-row items-center gap-8 opacity-40">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 md:mb-0">Trusted Infrastructure by</p>
                    <div className="flex flex-wrap justify-center gap-8 grayscale">
                        <img src="https://mono.co/images/logo-dark-v2.svg" className="h-4 brightness-200" alt="Mono" />
                        <img src="https://paystack.com/assets/img/login/paystack-logo.png" className="h-4 brightness-200" alt="Paystack" />
                        <span className="text-white font-black text-sm uppercase italic tracking-tighter">Cloaka Payments</span>
                    </div>
                </div>
            </main>

            <footer className="relative z-10 p-10 border-t border-white/5 text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">© 2024 Resconate Technologies. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default HRChoicePage;
