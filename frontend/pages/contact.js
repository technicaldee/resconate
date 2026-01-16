import React, { useEffect, useState } from 'react';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import ScrollToTop from '../src/components/ScrollToTop';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceType: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Initialize animations
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    // For now, we'll just show a success message
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', company: '', serviceType: '', message: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="App">
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="contact-hero section-shell py-20 px-4 md:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16" data-animate="fade-up">
              <span className="section-eyebrow">Get In Touch</span>
              <h1 className="contact-title">Book a Delivery Call</h1>
              <p className="section-lead max-w-3xl mx-auto">
                Let's discuss how Resconate can help transform your HR operations and digital products.
                Schedule a call with our team to explore solutions tailored to your needs.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info Section */}
        <section className="contact-content-section section-shell py-20 px-4 md:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-12">
              {/* Contact Form */}
              <div className="contact-form-wrapper" data-animate="fade-up">
                <h2 className="contact-section-title">Schedule Your Call</h2>
                <p className="contact-section-lead mb-8">
                  Fill out the form below and we'll get back to you within one business day to schedule your delivery call.
                </p>

                {submitted && (
                  <div className="contact-success-message">
                    <i className="fas fa-check-circle"></i>
                    <span>Thank you! We'll be in touch soon to schedule your call.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-field">
                      <label htmlFor="name" className="form-label">
                        <i className="fas fa-user"></i>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="email" className="form-label">
                        <i className="fas fa-envelope"></i>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="phone" className="form-label">
                      <i className="fas fa-phone"></i>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="+234 806 602 3759"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="company" className="form-label">
                      <i className="fas fa-building"></i>
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Your Company"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="serviceType" className="form-label">
                      <i className="fas fa-list"></i>
                      How can we help? *
                    </label>
                    <div className="select-wrapper">
                      <select
                        id="serviceType"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        required
                        className="form-input form-select"
                      >
                        <option value="">Select a service...</option>
                        <option value="Social Media Management">Social Media Management</option>
                        <option value="HR Operations">HR Operations</option>
                        <option value="Digital Products">Digital Products</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Other">Other</option>
                      </select>
                      <i className="fas fa-chevron-down select-arrow"></i>
                    </div>
                  </div>

                  {formData.serviceType && (
                    <div className="form-field" data-animate="fade-up">
                      <label htmlFor="message" className="form-label">
                        <i className="fas fa-comment"></i>
                        Further Details *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="form-textarea"
                        rows="5"
                        placeholder="Please provide more details about your request..."
                      ></textarea>
                    </div>
                  )}

                  <button type="submit" className="contact-submit-btn">
                    <span>Request Delivery Call</span>
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="contact-info-wrapper" data-animate="fade-up" style={{ '--animate-delay': '0.1s' }}>
                <h2 className="contact-section-title">Other Ways to Reach Us</h2>
                <p className="contact-section-lead mb-8">
                  Prefer to reach out directly? Use any of the contact methods below.
                </p>

                <div className="contact-info-cards">
                  <div className="contact-info-card">
                    <div className="contact-info-icon email">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="contact-info-content">
                      <h3 className="contact-info-title">Email Us</h3>
                      <p className="contact-info-text">Send us an email anytime</p>
                      <a href="mailto:resconate@gmail.com" className="contact-info-link">
                        resconate@gmail.com
                        <i className="fas fa-external-link-alt"></i>
                      </a>
                    </div>
                  </div>

                  <div className="contact-info-card">
                    <div className="contact-info-icon phone">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div className="contact-info-content">
                      <h3 className="contact-info-title">Call Us</h3>
                      <p className="contact-info-text">Mon-Fri 9am-6pm WAT</p>
                      <a href="tel:+2348066023759" className="contact-info-link">
                        +234 806 602 3759
                        <i className="fas fa-external-link-alt"></i>
                      </a>
                    </div>
                  </div>

                  <div className="contact-info-card">
                    <div className="contact-info-icon whatsapp">
                      <i className="fab fa-whatsapp"></i>
                    </div>
                    <div className="contact-info-content">
                      <h3 className="contact-info-title">WhatsApp</h3>
                      <p className="contact-info-text">Start a quick chat</p>
                      <a
                        href="https://wa.me/2348066023759"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-info-link"
                      >
                        Start Chat
                        <i className="fas fa-external-link-alt"></i>
                      </a>
                    </div>
                  </div>

                  <div className="contact-info-card">
                    <div className="contact-info-icon location">
                      <i className="fas fa-location-dot"></i>
                    </div>
                    <div className="contact-info-content">
                      <h3 className="contact-info-title">Visit Us</h3>
                      <p className="contact-info-text">Our headquarters</p>
                      <p className="contact-info-address">
                        Plot 51 G-Line, Ewet Housing Estate<br />
                        Uyo, Akwa Ibom State<br />
                        Nigeria
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="contact-social-section">
                  <h3 className="contact-social-title">Follow Us</h3>
                  <div className="contact-social-links">
                    <a
                      href="https://www.linkedin.com/in/res-conate-ab643137b/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-social-link"
                      aria-label="LinkedIn"
                    >
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a
                      href="https://x.com/ResconateHR"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-social-link"
                      aria-label="X (Twitter)"
                    >
                      <i className="fab fa-x-twitter"></i>
                    </a>
                    <a
                      href="https://www.instagram.com/resconate"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-social-link"
                      aria-label="Instagram"
                    >
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a
                      href="https://www.facebook.com/resconate"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-social-link"
                      aria-label="Facebook"
                    >
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Contact;

export const dynamic = 'force-dynamic';














