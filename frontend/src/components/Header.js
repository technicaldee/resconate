import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 py-6 ${isScrolled ? 'bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 py-4' : 'bg-transparent'
        }`}>
        <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center p-2 group-hover:rotate-12 transition-transform duration-500 shadow-xl shadow-indigo-600/20">
              <img src="/RLogo.png" alt="Resconate Logo" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <span className="text-xl font-black text-white tracking-tighter">Resconate</span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-10">
            <div className="group relative">
              <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-1.5 hover:text-white transition-colors">
                Services <span className="material-symbols-outlined text-xs">keyboard_arrow_down</span>
              </button>
              {/* Dropdown */}
              <div className="absolute top-full -left-4 pt-6 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 w-72 shadow-2xl shadow-indigo-500/10">
                  <Link href="/hr" className="block group/item p-4 rounded-2xl hover:bg-white/5 transition-all">
                    <p className="text-white font-black text-xs uppercase tracking-widest mb-1 flex items-center gap-2">
                      HR Selection <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
                    </p>
                    <p className="text-slate-400 text-[10px] font-medium leading-relaxed">Choose between Lite automation or Professional remote team management.</p>
                  </Link>
                  <Link href="/d2e" className="block group/item p-4 rounded-2xl hover:bg-white/5 transition-all mt-2">
                    <p className="text-white font-black text-xs uppercase tracking-widest mb-1">Do-To-Earn Marketplace</p>
                    <p className="text-slate-400 text-[10px] font-medium leading-relaxed">Monetize your professional time and skills on our verified task platform.</p>
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/team" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">Our Collective</Link>
            <Link href="/about" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">Studio Vision</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/hr/lite/signup" className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
              Launch Lite
            </Link>
            <Link href="/hr/remote/login" className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all">
              Client Portal
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white"
            >
              <span className="material-symbols-outlined">menu_open</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[110] lg:hidden">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={closeMobileMenu}></div>
          <div className="absolute top-0 right-0 w-80 h-full bg-slate-900 border-l border-white/10 p-10 flex flex-col justify-between animate-in slide-in-from-right duration-500">
            <div className="space-y-12">
              <button onClick={closeMobileMenu} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
              <nav className="flex flex-col gap-8">
                <Link href="/hr" onClick={closeMobileMenu} className="text-3xl font-black text-white tracking-tighter">HR Solutions</Link>
                <Link href="/d2e" onClick={closeMobileMenu} className="text-3xl font-black text-white tracking-tighter">Do To Earn</Link>
                <Link href="/team" onClick={closeMobileMenu} className="text-3xl font-black text-white tracking-tighter">The Team</Link>
                <Link href="/contact" onClick={closeMobileMenu} className="text-3xl font-black text-white tracking-tighter">Contact</Link>
              </nav>
            </div>
            <div className="space-y-4">
              <Link href="/hr/lite/signup" onClick={closeMobileMenu} className="block w-full py-5 bg-indigo-600 text-white text-center rounded-2xl font-black text-xs uppercase tracking-widest">Signup for Lite</Link>
              <Link href="/hr/remote/login" onClick={closeMobileMenu} className="block w-full py-5 border border-white/10 text-white text-center rounded-2xl font-black text-xs uppercase tracking-widest">Remote Login</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
