import React from 'react';
import Link from 'next/link';
import { handleAnchorClick } from '../utils/scrollUtils';

const HRPlatform = () => {
  const features = [
    {
      icon: 'fas fa-users-cog',
      iconClass: 'feature-icon--indigo',
      title: 'Remote Staff Management',
      description: 'We act as your external HR department, handling all employee-related operations and staff activities remotely.'
    },
    {
      icon: 'fas fa-money-check-dollar',
      iconClass: 'feature-icon--pink',
      title: 'Payroll & Compliance',
      description: 'Full payroll processing and regulatory compliance managed by our team on your behalf.'
    },
    {
      icon: 'fas fa-user-chart',
      iconClass: 'feature-icon--emerald',
      title: 'Talent Acquisition',
      description: 'End-to-end recruitment handled by our specialists—from job postings to onboarding.'
    },
    {
      icon: 'fas fa-briefcase',
      iconClass: 'feature-icon--amber',
      title: 'Project Management',
      description: 'Your dedicated project management team coordinating all internal staff operations and workflows.'
    }
  ];

  return (
    <section id="hr-platform" className="section-shell section-shell--gradient py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="platform-grid">
          <div className="platform-intro" data-animate="fade-up">
            <span className="section-eyebrow">Remote Team Management</span>
            <h2 className="section-title">Your Project Management Team</h2>
            <p className="section-lead">Choose the engagement model that fits your business scale. From full remote management to automated lightweight tools.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-indigo-500/30 transition-all group">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">bolt</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Resconate HR Lite</h3>
                <p className="text-slate-400 text-sm mb-6 font-medium">Automated, WhatsApp-first HR for micro-businesses. ZERO learning curve. 90 days free.</p>
                <Link href="/hr/lite/signup" className="text-indigo-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  Explore Lite <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
              <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-pink-500/30 transition-all group">
                <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">workspace_premium</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Professional Remote HR</h3>
                <p className="text-slate-400 text-sm mb-6 font-medium">Expert-led project management handling all staff operations as an extension of your company.</p>
                <Link href="/hr/remote/login" className="text-pink-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  Access Portal <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
            <div className="platform-actions mt-12">
              <a href="#contact" className="btn btn-ghost" onClick={(e) => handleAnchorClick(e, 'contact')}>Talk to our team</a>
            </div>
          </div>
          <div className="feature-grid">
            {features.map((feature, index) => (
              <article key={index} className="feature-card" data-animate="fade-up" style={{ '--animate-delay': `${(index + 1) * 0.05}s` }}>
                <div className={`feature-icon ${feature.iconClass}`}>
                  <i className={feature.icon}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HRPlatform;

