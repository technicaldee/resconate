import React from 'react';
import Link from 'next/link';

const HRPlatform = () => {
  return (
    <section id="hr-platform" className="relative py-24 px-6 bg-slate-950 overflow-hidden border-t border-white/5">
      <div className="container mx-auto max-w-7xl relative z-10 flex flex-col items-center">

        {/* Section Header */}
        <div className="text-center mb-16 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-[0.35em] mb-4 shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50"></span>
            Service Architecture
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.95]">Your Workforce, Reimagined.</h2>
          <p className="text-slate-400 text-lg font-medium max-w-xl mx-auto opacity-70">Whether you are a micro-business owner or a scaling enterprise, our dual-tier strategy ensures you stay lean and compliant.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full h-auto">
          {/* CHOICE 1: HR LITE */}
          <div className="group relative flex flex-col bg-slate-900 border border-white/5 rounded-[48px] p-12 hover:border-indigo-500/30 transition-all duration-700 hover:translate-y-[-8px] overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full -mr-40 -mt-40 blur-[100px] pointer-events-none group-hover:bg-indigo-600/15 transition-colors duration-700"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-12">
                <div className="w-20 h-20 bg-indigo-600/10 rounded-3xl flex items-center justify-center border border-indigo-600/20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-2xl">
                  <span className="material-symbols-outlined text-4xl text-indigo-400 font-black">electric_bolt</span>
                </div>
                <span className="px-5 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20 shadow-xl shadow-emerald-500/5 animate-pulse">90 Days Free</span>
              </div>

              <h3 className="text-4xl font-black text-white mb-4 tracking-tighter">Resconate HR Lite</h3>
              <p className="text-slate-400 font-medium leading-[1.8] mb-12 opacity-80">
                Perfect for micro-businesses looking to formalize operations instantly. Conversational, WhatsApp-first, and zero learning curve.
              </p>

              <div className="space-y-5 mb-16">
                {[
                  'AI-Powered Employment Contracts',
                  'WhatsApp Onboarding for Staff',
                  'Automated Digital Handbooks',
                  'Nigerian Labor Market Compliance'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-xs font-black text-white/90 uppercase tracking-widest">
                    <div className="w-6 h-6 rounded-lg bg-indigo-600/20 flex items-center justify-center border border-indigo-600/20 shadow-2xl">
                      <span className="material-symbols-outlined text-sm text-indigo-400 font-black">done_all</span>
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              <Link
                href="/hr"
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/20 transition-all hover:scale-[1.02]"
              >
                Start Automating
                <span className="material-symbols-outlined group-hover:translate-x-3 transition-transform duration-500">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* CHOICE 2: REMOTE TEAM */}
          <div className="group relative flex flex-col bg-slate-900 border border-white/5 rounded-[48px] p-12 hover:border-pink-500/30 transition-all duration-700 hover:translate-y-[-8px] overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-pink-600/10 rounded-full -mr-40 -mt-40 blur-[100px] pointer-events-none group-hover:bg-pink-600/15 transition-colors duration-700"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-12">
                <div className="w-20 h-20 bg-pink-600/10 rounded-3xl flex items-center justify-center border border-pink-600/20 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 shadow-2xl">
                  <span className="material-symbols-outlined text-4xl text-pink-400 font-black">workspace_premium</span>
                </div>
                <span className="px-5 py-1.5 bg-pink-500/10 text-pink-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-pink-500/20 shadow-xl shadow-pink-500/5">Enterprise Level</span>
              </div>

              <h3 className="text-4xl font-black text-white mb-4 tracking-tighter">Professional Remote HR</h3>
              <p className="text-slate-400 font-medium leading-[1.8] mb-12 opacity-80">
                For scaling teams that need a dedicated external project management team to handle all workforce operations.
              </p>

              <div className="space-y-5 mb-16">
                {[
                  'Dedicated HR Project Managers',
                  'Full Recruitment Lifecycle (Recruited by Resconate)',
                  'Payroll, Tax & HMO Administration',
                  'Employee Performance Management'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-xs font-black text-white/90 uppercase tracking-widest">
                    <div className="w-6 h-6 rounded-lg bg-pink-600/20 flex items-center justify-center border border-pink-600/20 shadow-2xl">
                      <span className="material-symbols-outlined text-sm text-pink-400 font-black">verified</span>
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              <Link
                href="/hr/remote/login"
                className="w-full py-5 bg-white text-slate-950 hover:bg-slate-100 rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl transition-all hover:scale-[1.02]"
              >
                Contact Experts
                <span className="material-symbols-outlined group-hover:translate-x-3 transition-transform duration-500 text-pink-600">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Optional help hint */}
        <p className="mt-12 text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-60">Not sure which path to choose? <a href="/contact" className="text-white underline decoration-indigo-500 decoration-4 underline-offset-4">Talk to an advisor.</a></p>
      </div>
    </section>
  );
};

export default HRPlatform;
