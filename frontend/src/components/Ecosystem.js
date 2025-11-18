import React from 'react';
import { handleAnchorClick } from '../utils/scrollUtils';

const Ecosystem = () => {
  const layers = [
    {
      pill: 'Studio',
      pillClass: '',
      time: '0 → 6 weeks',
      title: 'Concept to launch orchestration',
      description: 'Branding, UX, engineering, QA, and GTM moments woven into one launch narrative.',
      link: '#agency-services',
      linkText: 'See how we work'
    },
    {
      pill: 'People',
      pillClass: 'layer-pill--pink',
      time: 'Always-on',
      title: 'HR cockpit for African teams',
      description: 'Role-based portals, smart approvals, and compliance automation that feels effortless.',
      link: '/hr-dashboard.html',
      linkText: 'Peek inside the suite',
      external: true
    },
    {
      pill: 'Support',
      pillClass: 'layer-pill--emerald',
      time: 'Ongoing',
      title: 'Growth & adoption programs',
      description: 'Change enablement, training, and analytics sprints keep momentum alive after launch.',
      link: '#contact',
      linkText: 'Schedule a working session'
    }
  ];

  return (
    <section id="ecosystem" className="section-shell py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-5xl text-center section-heading" data-animate="fade-up">
        <span className="section-eyebrow">Experience Layers</span>
        <h2 className="section-title">Every journey is modular, but the experience stays seamless.</h2>
        <p className="section-lead">Our studio and HR teams layer in as you grow—so vision, delivery, and adoption feel like one continuous story.</p>
      </div>
      <div className="container mx-auto max-w-6xl layer-grid">
        {layers.map((layer, index) => (
          <article key={index} className="layer-card" data-animate="fade-up" style={{ '--animate-delay': `${index * 0.12}s` }}>
            <div className="layer-meta">
              <span className={`layer-pill ${layer.pillClass}`}>{layer.pill}</span>
              <span className="layer-time">{layer.time}</span>
            </div>
            <h3>{layer.title}</h3>
            <p>{layer.description}</p>
            {layer.external ? (
              <a href={layer.link} className="layer-link" target="_blank" rel="noopener noreferrer">
                {layer.linkText} <i className="fas fa-arrow-right"></i>
              </a>
            ) : (
              <a href={layer.link} className="layer-link" onClick={(e) => handleAnchorClick(e, layer.link.replace('#', ''))}>
                {layer.linkText} <i className="fas fa-arrow-right"></i>
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default Ecosystem;

