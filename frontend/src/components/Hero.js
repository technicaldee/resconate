import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center pt-20 px-6 overflow-hidden bg-slate-950">
      {/* Ambient Lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none opacity-60"
        style={{ transform: `translate(${-50 + mousePosition.x * 0.5}%, ${-50 + mousePosition.y * 0.5}%)` }}
      ></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl relative z-10 flex flex-col items-center text-center">
        {/* Badge Overlay */}
        <div
          className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12 animate-in fade-in zoom-in-90 duration-1000"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50 animate-pulse"></span>
          Unified Business Platform
        </div>

        {/* Main Headline */}
        <h1
          className="text-6xl md:text-[7rem] font-black text-white tracking-tighter leading-[0.85] mb-8 animate-in slide-in-from-bottom-8 duration-700"
        >
          Scale Smarter. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-400">Manage Faster.</span>
        </h1>

        {/* Description */}
        <p
          className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed mb-16 animate-in slide-in-from-bottom-12 duration-1000 opacity-80"
        >
          Resconate is a dual-core ecosystem bridging the gap between product innovation and human capital. We build and manage your internal operations, allowing you to focus on high-velocity growth.
        </p>

        {/* CTA GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl animate-in fade-in slide-in-from-bottom-20 duration-1000">
          <Link
            href="/hr"
            className="group relative flex items-center justify-between p-8 bg-white/5 border border-white/10 rounded-[40px] hover:border-indigo-500/30 hover:bg-white/10 transition-all duration-500 hover:translate-y-[-4px]"
          >
            <div className="text-left">
              <h3 className="text-xl font-black text-white mb-1 group-hover:text-indigo-400 transition-colors">People Studio</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Automated Lite or Remote Experts</p>
            </div>
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20 group-hover:rotate-12 transition-transform">
              <span className="material-symbols-outlined text-2xl font-black">groups_3</span>
            </div>
          </Link>

          <Link
            href="/d2e"
            className="group relative flex items-center justify-between p-8 bg-white/5 border border-white/10 rounded-[40px] hover:border-pink-500/30 hover:bg-white/10 transition-all duration-500 hover:translate-y-[-4px]"
          >
            <div className="text-left">
              <h3 className="text-xl font-black text-white mb-1 group-hover:text-pink-400 transition-colors">Execution Studio</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tasks Marketplace & D2E</p>
            </div>
            <div className="w-12 h-12 bg-pink-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-pink-600/20 group-hover:-rotate-12 transition-transform">
              <span className="material-symbols-outlined text-2xl font-black">rocket_launch</span>
            </div>
          </Link>
        </div>

        {/* Sub-Actions */}
        <div className="mt-12 flex flex-wrap justify-center gap-10 opacity-30 invert brightness-200">
          <img src="https://mono.co/images/logo-dark-v2.svg" className="h-4" alt="Mono" />
          <img src="https://paystack.com/assets/img/login/paystack-logo.png" className="h-4" alt="Paystack" />
        </div>
      </div>

      {/* Down Arrow Fade */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20 hover:opacity-100 transition-opacity cursor-pointer animate-bounce">
        <p className="text-[8px] font-black uppercase tracking-[0.5em] text-white">Scroll</p>
        <span className="material-symbols-outlined text-white">keyboard_double_arrow_down</span>
      </div>
    </section>
  );
};

export default Hero;
