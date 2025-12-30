import React, { useEffect } from 'react';
import Header from '../src/components/Header';
import IndustryTemplates from '../src/components/IndustryTemplates';
import Footer from '../src/components/Footer';
import ScrollToTop from '../src/components/ScrollToTop';

export default function TemplatesPage() {
  useEffect(() => {
    // Initialize animations for elements with data-animate attribute
    const animatedElements = document.querySelectorAll('[data-animate]');
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => {
      observer.observe(el);
    });

    return () => {
      animatedElements.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="App">
      <Header />
      <main id="main-content">
        <IndustryTemplates />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export const dynamic = 'force-dynamic';




