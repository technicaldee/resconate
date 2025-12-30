import React, { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ValueProposition from '../components/ValueProposition';
import HRPlatform from '../components/HRPlatform';
import Ecosystem from '../components/Ecosystem';
import Proof from '../components/Proof';
import Pricing from '../components/Pricing';
import EnhancedTestimonials from '../components/EnhancedTestimonials';
import LeadCapture from '../components/LeadCapture';
import IndustryTemplates from '../components/IndustryTemplates';
import ResourceLibrary from '../components/ResourceLibrary';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import { LiveChatWidget, WhatsAppButton } from '../components/UXEnhancements';
import { PWAInstallPrompt, OfflineIndicator, SlowConnectionOptimizer } from '../components/MobileOptimization';
import LanguageToggle from '../components/LanguageToggle';

const Home = () => {
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
      <a href="#home" className="skip-link">Skip to main content</a>
      <Header />
      <main id="main-content">
        <Hero />
        <ValueProposition />
        <HRPlatform />
        <Ecosystem />
        <EnhancedTestimonials />
        <Pricing />
        <IndustryTemplates />
        <ResourceLibrary />
        <LeadCapture />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
      <PWAInstallPrompt />
      <OfflineIndicator />
      <SlowConnectionOptimizer />
      <LiveChatWidget />
      <WhatsAppButton />
    </div>
  );
};

export default Home;


