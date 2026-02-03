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
      pill: 'Remote Team',
      pillClass: 'layer-pill--pink',
      time: 'Always-on',
      title: 'Your external staff management team',
      description: 'We operate as your 3rd party remote project management team—handling all internal staff activities and operations on your behalf.',
      link: '/hr-dashboard.html',
      linkText: 'See how we manage your team',
      external: true
    },
    {
      pill: 'Do-To-Earn',
      pillClass: 'layer-pill--emerald',
      time: 'Coming soon',
      title: 'Decentralized crowd work',
      description: 'A marketplace connecting businesses with verified talent for on-demand tasks and projects.',
      link: '/d2e',
      linkText: 'Learn more about Do-To-Earn',
      external: true
    }
  ];

  return (
    <section id="ecosystem" className="section-shell py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-5xl text-center section-heading" data-animate="fade-up">
        <span className="section-eyebrow">Experience Layers</span>
        <h2 className="section-title">Every journey is modular, but the experience stays seamless.</h2>
        <p className="section-lead">Our Product Studio and Remote Team Management services layer in as you grow—so product development and staff operations feel like one continuous story.</p>
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

