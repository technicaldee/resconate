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
            <h2 className="section-title">Your 3rd Party Project Management Team</h2>
            <p className="section-lead">We function as an external extension of your company—handling all staff operations, from recruitment to payroll, so you can focus on your core business.</p>
            <div className="platform-actions">
              <Link href="/hr-login" className="btn btn-primary">Access Your Portal</Link>
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

