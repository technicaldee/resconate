import React from 'react';
import Link from 'next/link';

const Ecosystem = () => {
  return (
    <section id="ecosystem" className="relative py-24 px-6 bg-slate-950 overflow-hidden border-t border-white/5">
      <div className="container mx-auto max-w-7xl relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-[10px] font-black uppercase tracking-[0.35em] mb-4">
              <span className="w-2 h-2 rounded-full bg-amber-500 shadow-xl shadow-amber-500/50"></span>
              The Refinery
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.95]">Execution Beyond Management.</h2>
            <p className="text-slate-400 text-lg font-medium opacity-70">Resconate isn't just about people ops. We are a refinery for professional time and high-end digital products.</p>
          </div>
          <Link href="/about" className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all opacity-40 hover:opacity-100">Our Workflow Philosophy</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Execution Studio (D2E) */}
          <div className="group relative bg-slate-900 border border-white/5 rounded-[40px] p-10 hover:border-amber-500/20 transition-all overflow-hidden h-full flex flex-col justify-between">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-600/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-amber-600/10 transition-colors"></div>

            <div>
              <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400 mb-8 group-hover:rotate-12 transition-transform shadow-2xl">
                <span className="material-symbols-outlined text-2xl font-black">currency_exchange</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Do-To-Earn</h3>
              <p className="text-slate-500 font-medium leading-relaxed text-sm mb-12">Monetize your professional time. Our 2-sided marketplace allows verified specialists to pick up high-intent tasks from our client network.</p>
            </div>

            <Link href="/d2e" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 hover:gap-5 transition-all">Launch Marketplace <span className="material-symbols-outlined text-sm">arrow_forward_ios</span></Link>
          </div>

          {/* Product Studio */}
          <div className="group relative bg-slate-900 border border-white/5 rounded-[40px] p-10 hover:border-indigo-500/20 transition-all overflow-hidden h-full flex flex-col justify-between">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-indigo-600/10 transition-colors"></div>

            <div>
              <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-8 group-hover:scale-110 transition-transform shadow-2xl">
                <span className="material-symbols-outlined text-2xl font-black">palette</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Product Design</h3>
              <p className="text-slate-500 font-medium leading-relaxed text-sm mb-12">We don't just manage teams, we build tools. Our design studio crafts world-class digital experiences for high-velocity startups.</p>
            </div>

            <Link href="/portfolio" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 hover:gap-5 transition-all">View Portforlio <span className="material-symbols-outlined text-sm">arrow_forward_ios</span></Link>
          </div>

          {/* Infrastructure (Cloaka) */}
          <div className="group relative bg-slate-900 border border-white/5 rounded-[40px] p-10 hover:border-emerald-500/20 transition-all overflow-hidden h-full flex flex-col justify-between">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-600/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-emerald-600/10 transition-colors"></div>

            <div>
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-8 group-hover:-rotate-12 transition-transform shadow-2xl">
                <span className="material-symbols-outlined text-2xl font-black">hub</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-3">The Hub</h3>
              <p className="text-slate-500 font-medium leading-relaxed text-sm mb-12">Integrated financial infrastructure via the Cloaka Finance team. One single dashboard for payroll, taxes, and vendor disbursements.</p>
            </div>

            <Link href="/hr/lite/signup" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 hover:gap-5 transition-all">Access Suite <span className="material-symbols-outlined text-sm">arrow_forward_ios</span></Link>
          </div>
        </div>

        <div className="mt-20 p-12 bg-white/5 border border-white/5 rounded-[48px] flex flex-col md:flex-row items-center justify-between gap-12 group">
          <div className="space-y-4 max-w-xl">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 block">Future of Work Hub</span>
            <h3 className="text-3xl font-black text-white leading-tight tracking-tight">One Identity. <br /><span className="text-indigo-500 group-hover:animate-pulse">Limitless Scale.</span></h3>
            <p className="text-slate-400 font-medium text-sm leading-relaxed opacity-60">Whether you use our automated Lite tools or our professional remote teams, you gain access to the entire Resconate refinery of specialists and tools.</p>
          </div>
          <Link href="/contact" className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all shrink-0">Engage Studio</Link>
        </div>
      </div>
    </section>
  );
};

export default Ecosystem;
