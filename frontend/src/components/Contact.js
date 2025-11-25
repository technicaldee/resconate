import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="section-shell py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-4xl cta-shell">
        <div className="cta-content" data-animate="fade-up">
          <span className="section-eyebrow">Next Step</span>
          <h2 className="section-title">Let's choreograph your next product and people milestone.</h2>
          <p className="section-lead">Share the momentum you need and we'll circle back within one business day.</p>
          <div className="cta-actions">
            <a href="mailto:resconate@gmail.com" className="btn btn-primary">Email Us</a>
            <a href="https://wa.me/2349072415907" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">Start WhatsApp Chat</a>
          </div>
        </div>
        <div className="contact-card" data-animate="fade-up" style={{ '--animate-delay': '0.1s' }}>
          <div className="contact-row">
            <i className="fas fa-envelope"></i>
            <div>
              <span className="contact-label">Email</span>
              <a href="mailto:resconate@gmail.com">resconate@gmail.com</a>
            </div>
          </div>
          <div className="contact-row">
            <i className="fas fa-phone"></i>
            <div>
              <span className="contact-label">Phone</span>
              <a href="tel:+2348066023759">+234 806 602 3759</a>
            </div>
          </div>
          <div className="contact-row">
            <i className="fas fa-location-dot"></i>
            <div>
              <span className="contact-label">HQ</span>
              <p>Plot 51 G-Line, Ewet Housing Estate, Uyo, Nigeria</p>
            </div>
          </div>
          <div className="contact-socials">
            <a href="https://www.linkedin.com/in/inimfon-udoh-b5b569222/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://www.instagram.com/resconate" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.facebook.com/resconate" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

