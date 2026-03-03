import React, { useEffect } from 'react';
import Head from 'next/head';
import Header from '../src/components/Header';
import Hero from '../src/components/Hero';
import HRPlatform from '../src/components/HRPlatform';
import Ecosystem from '../src/components/Ecosystem';
import Contact from '../src/components/Contact';
import Footer from '../src/components/Footer';

export const dynamic = 'force-dynamic';

const Home = () => {
  useEffect(() => {
    // Advanced Animation Observer
    const animatedElements = document.querySelectorAll('[data-animate]');
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
    return () => animatedElements.forEach(el => observer.unobserve(el));
  }, []);

  return (
    <div className="bg-slate-950 min-h-screen text-white font-displaySelection selection:bg-indigo-500 selection:text-white">
      <Head>
        <title>Resconate | Product & People Studio for High-Velocity Teams</title>
        <meta name="description" content="Resconate is a dual-core ecosystem for product innovation and workforce operations. Automated HR for micro-businesses and professional remote management for scaling teams." />
      </Head>

      <Header />

      <main>
        {/* HERO: The Architectural Entrance */}
        <Hero />

        {/* HR PLATFORM: Choose your Workforce Path */}
        <section className="relative z-10 transition-all duration-700">
          <HRPlatform />
        </section>

        {/* ECOSYSTEM: The Professional Refinery */}
        <section className="relative z-10">
          <Ecosystem />
        </section>

        {/* CONTACT: Join the Expansion */}
        <section className="relative z-10 py-24 bg-slate-950">
          <Contact />
        </section>
      </main>

      {/* FOOTER: The Anchor */}
      <Footer />

      {/* Global Aesthetics Overlay */}
      <style jsx global>{`
        .visible {
           opacity: 1 !important;
           transform: translateY(0) !important;
        }
        
        [data-animate] {
           opacity: 0;
           transform: translateY(20px);
           transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        ::selection {
           background: #4f46e5;
           color: #fff;
        }
      `}</style>
    </div>
  );
};

export default Home;
