import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { handleAnchorClick } from '../utils/scrollUtils';

const Hero = () => {
  const statRefs = useRef([]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target.querySelector('[data-count]');
          if (counter && !counter.dataset.animated) {
            animateCounter(counter);
            counter.dataset.animated = 'true';
          }
        }
      });
    }, observerOptions);

    const currentRefs = statRefs.current;
    currentRefs.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const animateCounter = (element) => {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };

    updateCounter();
  };

  return (
    <section id="home" className="hero-section pt-36 md:pt-40 pb-24 px-4 md:px-8 relative overflow-hidden">
      <div className="hero__glow"></div>
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="hero__grid">
          <div className="hero__content" data-animate="fade-up">
            <span className="hero__badge">Product Studio × Remote Team Management</span>
            <h1 className="hero__title">
              Build magnetic products.<br />We manage your people operations.
            </h1>
            <p className="hero__subtitle">
              Resconate is your 3rd party remote project management team. We handle all staff and internal activities within your company—from recruitment to payroll—so you can focus on growth.
            </p>
            <div className="hero__actions">
              <a href="#contact" className="btn btn-primary" onClick={(e) => handleAnchorClick(e, 'contact')}>Book a Discovery Call</a>
              <Link href="/hr-login" className="btn btn-secondary">Launch HR Platform</Link>
            </div>
          </div>
          <div className="hero__visual" data-animate="fade-up" style={{ '--animate-delay': '0.15s' }}>
            <div className="hero__visual-card">
              <div className="hero__visual-header">
                <span>Studio sprint</span>
                <span className="hero__dot hero__dot--purple"></span>
                <span className="hero__dot hero__dot--pink"></span>
              </div>
              <ul className="hero__visual-list">
                <li>
                  <span>Map the story, ship in six weeks</span>
                  <i className="fas fa-arrow-right"></i>
                </li>
                <li>
                  <span>Embedded squads. Transparent KPIs.</span>
                  <i className="fas fa-arrow-right"></i>
                </li>
                <li>
                  <span>Brand, product, growth crafted together</span>
                  <i className="fas fa-arrow-right"></i>
                </li>
              </ul>
            </div>
            <div className="hero__visual-card hero__visual-card--accent">
              <h3>Remote Team Management</h3>
              <p>Your dedicated external HR team handling recruitment, payroll, compliance, and staff operations as a seamless extension of your business.</p>
              <a href="#hr-platform" className="hero__visual-link" onClick={(e) => handleAnchorClick(e, 'hr-platform')}>
                Explore services <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

