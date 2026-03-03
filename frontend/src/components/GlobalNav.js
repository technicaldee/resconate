import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getToken, getEmployeeToken } from '../utils/api';

const GlobalNav = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Check if user is logged in
    const adminToken = getToken();
    const employeeToken = getEmployeeToken();
    setIsLoggedIn(!!(adminToken || employeeToken));

    return () => window.removeEventListener('scroll', handleScroll);
  }, [router.pathname]);

  const isActive = (path) => router.pathname === path;

  return (
    <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${isScrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'
      }`}>
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        {/* Core Link Back to Main */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center p-2 shadow-xl shadow-indigo-600/20">
            <img src="/RLogo.png" alt="Resconate Logo" className="w-full h-full object-contain brightness-0 invert" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter">Resconate Suite</span>
        </Link>

        {/* Dynamic Nav Links */}
        <nav className="hidden lg:flex items-center gap-10">
          <Link href="/hr" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isActive('/hr') ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}>People Hub</Link>
          <Link href="/d2e" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isActive('/d2e') ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}>Marketplace</Link>

          {isLoggedIn ? (
            <Link href="/hr/remote/dashboard" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isActive('/hr/remote/dashboard') ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}>Access Dashboard</Link>
          ) : (
            <Link href="/hr/remote/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">Client Entry</Link>
          )}
        </nav>

        {/* Primary CTA */}
        <Link href="/hr/lite/signup" className="px-6 py-3 bg-indigo-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
          Launch Lite Free
        </Link>
      </div>
    </header>
  );
};

export default GlobalNav;
