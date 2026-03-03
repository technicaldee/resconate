import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-950 px-6 pt-24 pb-12 border-t border-white/5 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 mb-24">

          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center p-3 group-hover:rotate-12 transition-transform duration-500 shadow-xl shadow-indigo-600/20">
                <img src="/RLogo.png" alt="Resconate Logo" className="w-full h-full object-contain brightness-0 invert" />
              </div>
              <span className="text-3xl font-black text-white tracking-tighter">Resconate</span>
            </Link>
            <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm">
              Nigeria's premiere Product and People Studio. We build high-velocity digital products and manage ambitious workforce operations.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                <i className="fab fa-linkedin-in"></i>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                <i className="fab fa-twitter"></i>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                <i className="fab fa-instagram"></i>
              </div>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">The Studio</h4>
            <nav className="flex flex-col gap-4">
              <Link href="/team" className="text-white font-bold text-sm hover:text-indigo-400 transition-colors">Our Workforce</Link>
              <Link href="/portfolio" className="text-white font-bold text-sm hover:text-indigo-400 transition-colors">Portfolio</Link>
              <Link href="/about" className="text-white font-bold text-sm hover:text-indigo-400 transition-colors">The Vision</Link>
              <Link href="/contact" className="text-white font-bold text-sm hover:text-indigo-400 transition-colors">Consultation</Link>
            </nav>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">People Suite</h4>
            <nav className="flex flex-col gap-4">
              <Link href="/hr" className="text-white font-bold text-sm hover:text-indigo-400 transition-colors">HR Selector</Link>
              <Link href="/hr/lite/signup" className="text-white font-bold text-sm hover:text-indigo-400 transition-colors">Launch Lite</Link>
              <Link href="/hr/remote/login" className="text-white font-bold text-sm hover:text-indigo-400 transition-colors">Professional Portal</Link>
              <Link href="/d2e" className="text-white font-bold text-sm hover:text-indigo-400 transition-colors">D2E Marketplace</Link>
            </nav>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Resources</h4>
            <nav className="flex flex-col gap-4">
              <Link href="/privacy" className="text-white font-bold text-sm hover:text-indigo-400 transition-colors">Privacy Hub</Link>
              <Link href="/terms" className="text-white font-bold text-sm hover:text-indigo-400 transition-colors">Terms of Work</Link>
              <Link href="/compliance" className="text-white font-bold text-sm hover:text-indigo-400 transition-colors">Statutory Rules</Link>
              <a href="mailto:admin@resconate.com" className="text-white font-bold text-sm hover:text-indigo-400 transition-colors">Direct Support</a>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-12 border-t border-white/5 opacity-40">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            &copy; {currentYear} Resconate Technologies. Built for Nigerian Expansion.
          </p>
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <span>Lagos, Nigeria</span>
            <span>London, UK</span>
            <span>Abu Dhabi, UAE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
