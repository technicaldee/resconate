import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { handleAnchorClick } from '../utils/scrollUtils';
import LanguageToggle from './LanguageToggle';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const mobileMenu = document.getElementById('mobile-menu');
      const hamburgerButton = document.querySelector('.header__mobile-toggle');
      
      if (isMobileMenuOpen && 
          mobileMenu && 
          !mobileMenu.contains(event.target) && 
          hamburgerButton && 
          !hamburgerButton.contains(event.target)) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header__container">
          <button 
            className="header__mobile-toggle" 
            aria-label="Open mobile menu"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
          >
            <i className="fas fa-bars"></i>
          </button>
          <a href="#home" className="header__brand" onClick={(e) => handleAnchorClick(e, 'home')}>
            <img src="/resconate-logo.png" alt="Resconate Logo" className="header__logo" />
            <span>Resconate</span>
          </a>
          <nav className="header__nav" aria-label="Primary navigation">
            <ul className="header__nav-list">
              <li><a href="#home" className="header__nav-link" onClick={(e) => handleAnchorClick(e, 'home')}>Overview</a></li>
              <li><Link href="/services" className="header__nav-link">Services</Link></li>
              <li><a href="#agency-services" className="header__nav-link" onClick={(e) => handleAnchorClick(e, 'agency-services')}>Value</a></li>
              <li><a href="#hr-platform" className="header__nav-link" onClick={(e) => handleAnchorClick(e, 'hr-platform')}>Solutions</a></li>
              <li><a href="#proof" className="header__nav-link" onClick={(e) => handleAnchorClick(e, 'proof')}>Proof</a></li>
              <li><Link href="/team" className="header__nav-link">Team</Link></li>
              <li><a href="#contact" className="header__nav-link" onClick={(e) => handleAnchorClick(e, 'contact')}>Contact</a></li>
            </ul>
          </nav>
          <div className="header__actions">
            <div className="hidden md:block mr-4">
              <LanguageToggle />
            </div>
            <Link href="/hr-login" className="btn btn-primary header__cta hidden md:inline-flex" data-analytics="header-cta-hr-login">
              Launch HR Portal
            </Link>
            <Link href="/contact" className="btn btn-secondary header__cta hidden md:inline-flex" data-analytics="header-cta-contact">
              Book a Delivery Call
            </Link>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu__backdrop" onClick={closeMobileMenu}></div>
        <div className="mobile-menu__sidebar">
          <button 
            className="mobile-menu__close" 
            aria-label="Close mobile menu"
            onClick={closeMobileMenu}
          >
            <i className="fas fa-times"></i>
          </button>
          <div className="mobile-menu__content">
            <nav className="mobile-menu__nav">
              <ul className="mobile-menu__nav-list">
                <li><a href="#home" className="mobile-menu__nav-link" onClick={(e) => { handleAnchorClick(e, 'home'); closeMobileMenu(); }}>Overview</a></li>
                <li><Link href="/services" className="mobile-menu__nav-link" onClick={closeMobileMenu}>Services</Link></li>
                <li><a href="#agency-services" className="mobile-menu__nav-link" onClick={(e) => { handleAnchorClick(e, 'agency-services'); closeMobileMenu(); }}>Value</a></li>
                <li><a href="#hr-platform" className="mobile-menu__nav-link" onClick={(e) => { handleAnchorClick(e, 'hr-platform'); closeMobileMenu(); }}>Solutions</a></li>
                <li><a href="#proof" className="mobile-menu__nav-link" onClick={(e) => { handleAnchorClick(e, 'proof'); closeMobileMenu(); }}>Proof</a></li>
                <li><Link href="/team" className="mobile-menu__nav-link" onClick={closeMobileMenu}>Team</Link></li>
                <li><a href="#contact" className="mobile-menu__nav-link" onClick={(e) => { handleAnchorClick(e, 'contact'); closeMobileMenu(); }}>Contact</a></li>
              </ul>
            </nav>
            <div className="mobile-menu__actions">
              <Link href="/hr-login" className="btn btn-primary w-full mb-3" data-analytics="mobile-menu-hr-login" onClick={closeMobileMenu}>
                Launch HR Portal
              </Link>
              <Link href="/employee-login" className="btn btn-secondary w-full" data-analytics="mobile-menu-employee-login" onClick={closeMobileMenu}>
                Employee Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

