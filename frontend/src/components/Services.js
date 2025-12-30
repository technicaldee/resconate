import React, { useEffect } from 'react';
import Link from 'next/link';
import { handleAnchorClick } from '../utils/scrollUtils';

const Services = () => {
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

  const productStudioServices = [
    {
      icon: 'fas fa-lightbulb',
      iconClass: 'service-icon--indigo',
      title: 'Design-Led Product Development',
      description: 'Transform your vision into a market-ready product with our end-to-end product development service.',
      features: [
        'Leadership-aligned sprint cadences',
        'Concept-to-launch orchestration (0-6 weeks)',
        'Products ready from day one',
        'Brand, product, and growth crafted together'
      ]
    },
    {
      icon: 'fas fa-code',
      iconClass: 'service-icon--pink',
      title: 'Full-Stack Development & Engineering',
      description: 'Modern tech stack implementation with quality assurance and performance optimization.',
      features: [
        'Next.js, React, Node.js, PostgreSQL',
        'Quality assurance and comprehensive testing',
        'Performance optimization',
        'RESTful API development'
      ]
    },
    {
      icon: 'fas fa-rocket',
      iconClass: 'service-icon--emerald',
      title: 'Launch & Go-to-Market Services',
      description: 'Launch orchestration, brand positioning, and growth enablement programs.',
      features: [
        'Launch orchestration',
        'Brand positioning',
        'Market entry strategies',
        'Growth enablement programs'
      ]
    },
    {
      icon: 'fas fa-chart-line',
      iconClass: 'service-icon--amber',
      title: 'Continuous Partnership & Growth Support',
      description: 'We stay embedded with analytics, training, and ongoing momentum support.',
      features: [
        'Real-time dashboards and KPI tracking',
        'Growth & adoption programs',
        'Dedicated success pod in your timezone',
        'Lifecycle analytics and insights'
      ]
    }
  ];

  const hrServices = [
    {
      icon: 'fas fa-users',
      iconClass: 'service-icon--indigo',
      title: 'Employee Management',
      description: 'Centralized employee records with self-service portal.',
      badge: 'Core'
    },
    {
      icon: 'fas fa-briefcase',
      iconClass: 'service-icon--pink',
      title: 'Recruitment & Talent Acquisition',
      description: 'Job postings, candidate tracking, and interview scheduling.',
      badge: 'Core'
    },
    {
      icon: 'fas fa-calendar-alt',
      iconClass: 'service-icon--emerald',
      title: 'Leave Management',
      description: 'Self-service leave requests with automated approvals.',
      badge: 'Core'
    },
    {
      icon: 'fas fa-money-check-dollar',
      iconClass: 'service-icon--amber',
      title: 'Payroll Processing',
      description: 'Automated payroll with banking integration and payslip generation.',
      badge: 'Core'
    },
    {
      icon: 'fas fa-chart-bar',
      iconClass: 'service-icon--purple',
      title: 'Performance Management',
      description: 'Reviews, OKRs, surveys, and growth plans.',
      badge: 'Premium'
    },
    {
      icon: 'fas fa-university',
      iconClass: 'service-icon--blue',
      title: 'Banking Integration',
      description: 'Seamless payment processing with regional banks.',
      badge: 'Premium'
    },
    {
      icon: 'fas fa-shield-alt',
      iconClass: 'service-icon--red',
      title: 'Compliance Management',
      description: 'Local tax logic, benefits, and regulatory compliance.',
      badge: 'Premium'
    },
    {
      icon: 'fas fa-chart-pie',
      iconClass: 'service-icon--teal',
      title: 'Analytics & Reporting',
      description: 'Real-time dashboards and insights for data-driven decisions.',
      badge: 'Premium'
    },
    {
      icon: 'fas fa-file-alt',
      iconClass: 'service-icon--orange',
      title: 'Document Management',
      description: 'Secure document storage and organization.',
      badge: 'Core'
    },
    {
      icon: 'fas fa-user-circle',
      iconClass: 'service-icon--cyan',
      title: 'Role-Based Portals',
      description: 'Native-feeling experiences for HR admins and employees.',
      badge: 'Core'
    },
    {
      icon: 'fas fa-plug',
      iconClass: 'service-icon--indigo',
      title: 'API & Integrations',
      description: 'Connect to existing systems with comprehensive RESTful API.',
      badge: 'Enterprise'
    },
    {
      icon: 'fas fa-globe',
      iconClass: 'service-icon--green',
      title: 'Multi-Country Support',
      description: 'Scale across African markets with localized compliance.',
      badge: 'Enterprise'
    },
    {
      icon: 'fas fa-paint-brush',
      iconClass: 'service-icon--pink',
      title: 'White-Label Options',
      description: 'Brand it your way with customizable interface.',
      badge: 'Enterprise'
    }
  ];

  const stats = [
    { number: '80+', label: 'Launches Delivered', icon: 'fas fa-rocket' },
    { number: '45', label: 'Teams Running on Resconate', icon: 'fas fa-users' },
    { number: '6', label: 'Markets Supported', icon: 'fas fa-globe' }
  ];

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero section-shell py-20 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16" data-animate="fade-up">
            <span className="section-eyebrow">Our Services</span>
            <h1 className="services-hero-title">Transform Your Business with Resconate</h1>
            <p className="section-lead max-w-3xl mx-auto">
              We combine the power of a Product Studio for rapid product development and an HR Flow Platform 
              for seamless people operations—built specifically for African markets.
            </p>
          </div>

          {/* Stats */}
          <div className="services-stats-grid">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="services-stat-card"
                data-animate="fade-up"
                style={{ '--animate-delay': `${index * 0.1}s` }}
              >
                <div className="services-stat-icon">
                  <i className={stat.icon}></i>
                </div>
                <div className="services-stat-number">{stat.number}</div>
                <div className="services-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Studio Services */}
      <section className="section-shell py-20 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16" data-animate="fade-up">
            <span className="section-eyebrow">Product Studio</span>
            <h2 className="section-title">Build and Launch Products in 6 Weeks</h2>
            <p className="section-lead max-w-3xl mx-auto">
              From concept to launch, we handle strategy, design, engineering, and go-to-market—all in one integrated approach.
            </p>
          </div>

          <div className="services-grid services-grid--featured">
            {productStudioServices.map((service, index) => (
              <article 
                key={index} 
                className="service-card service-card--featured"
                data-animate="fade-up"
                style={{ '--animate-delay': `${index * 0.1}s` }}
              >
                <div className={`service-icon ${service.iconClass}`}>
                  <i className={service.icon}></i>
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, i) => (
                    <li key={i}>
                      <i className="fas fa-check service-check"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HR Flow Platform Services */}
      <section className="section-shell section-shell--gradient py-20 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16" data-animate="fade-up">
            <span className="section-eyebrow">HR Flow Platform</span>
            <h2 className="section-title">Complete HR Operations, Automated for African Markets</h2>
            <p className="section-lead max-w-3xl mx-auto">
              Our HR Flow platform is designed specifically for African businesses, with localized compliance, 
              banking integrations, and tax logic built-in from day one.
            </p>
          </div>

          <div className="services-grid">
            {hrServices.map((service, index) => (
              <article 
                key={index} 
                className="service-card"
                data-animate="fade-up"
                style={{ '--animate-delay': `${index * 0.05}s` }}
              >
                <div className="service-card-header">
                  <div className={`service-icon ${service.iconClass}`}>
                    <i className={service.icon}></i>
                  </div>
                  {service.badge && (
                    <span className={`service-badge service-badge--${service.badge.toLowerCase()}`}>
                      {service.badge}
                    </span>
                  )}
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="section-shell py-20 px-4 md:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="services-cta-card" data-animate="fade-up">
            <div className="services-cta-content">
              <h2 className="services-cta-title">Ready to Get Started?</h2>
              <p className="services-cta-description">
                Choose the plan that fits your team size and needs. All plans include our core HR management features.
              </p>
              <div className="services-cta-actions">
                <Link href="/#pricing" className="btn btn-primary">
                  View Pricing Plans
                </Link>
                <a 
                  href="#contact" 
                  className="btn btn-secondary"
                  onClick={(e) => handleAnchorClick(e, 'contact')}
                >
                  Book a Discovery Call
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;

