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
      icon: 'fas fa-pen-nib',
      iconClass: 'service-icon--purple',
      title: 'Writing & Content Services',
      description: 'Professional content creation and technical writing for your product and marketing needs.',
      features: [
        'Technical documentation and user guides',
        'Website copy and blog content',
        'Product descriptions and marketing materials',
        'SEO-optimized content strategy'
      ]
    },
    {
      icon: 'fas fa-shield-alt',
      iconClass: 'service-icon--red',
      title: 'Cybersecurity Services',
      description: 'Comprehensive security assessments and implementation to protect your digital assets.',
      features: [
        'Security audits and vulnerability assessments',
        'Penetration testing',
        'Security architecture design',
        'Compliance and data protection consulting'
      ]
    },
    {
      icon: 'fas fa-paint-brush',
      iconClass: 'service-icon--teal',
      title: 'UI/UX Design & Product Design',
      description: 'User-centered design that creates intuitive and engaging digital experiences.',
      features: [
        'User research and persona development',
        'Wireframing and prototyping',
        'Visual design systems',
        'Usability testing and optimization'
      ]
    },
    {
      icon: 'fas fa-palette',
      iconClass: 'service-icon--emerald',
      title: 'Graphics Design',
      description: 'Creative visual design that brings your brand identity to life across all platforms.',
      features: [
        'Brand identity and logo design',
        'Marketing collateral and social media graphics',
        'Infographics and data visualization',
        'Print and digital advertising design'
      ]
    },
    {
      icon: 'fas fa-chart-bar',
      iconClass: 'service-icon--amber',
      title: 'Data Analysis Services',
      description: 'Transform raw data into actionable insights to drive business decisions.',
      features: [
        'Business intelligence and analytics',
        'Data visualization and dashboard creation',
        'Predictive modeling and forecasting',
        'KPI tracking and performance metrics'
      ]
    },
    {
      icon: 'fas fa-rocket',
      iconClass: 'service-icon--cyan',
      title: 'Launch & Go-to-Market Services',
      description: 'Launch orchestration, brand positioning, and growth enablement programs.',
      features: [
        'Launch orchestration',
        'Brand positioning',
        'Market entry strategies',
        'Growth enablement programs'
      ]
    }
  ];

  const hrServices = [
    {
      icon: 'fas fa-users-cog',
      iconClass: 'service-icon--indigo',
      title: 'Remote Staff Operations',
      description: 'We handle all internal staff activities and day-to-day operations as your external team.',
      badge: 'Core'
    },
    {
      icon: 'fas fa-user-plus',
      iconClass: 'service-icon--pink',
      title: 'Recruitment & Onboarding',
      description: 'Full-cycle talent acquisition—from sourcing to onboarding—managed by our specialists.',
      badge: 'Core'
    },
    {
      icon: 'fas fa-calendar-check',
      iconClass: 'service-icon--emerald',
      title: 'Leave & Attendance Management',
      description: 'Comprehensive tracking and management of staff time-off and attendance records.',
      badge: 'Core'
    },
    {
      icon: 'fas fa-money-check-dollar',
      iconClass: 'service-icon--amber',
      title: 'Payroll Administration',
      description: 'Complete payroll processing including calculations, deductions, and disbursements.',
      badge: 'Core'
    },
    {
      icon: 'fas fa-chart-line',
      iconClass: 'service-icon--purple',
      title: 'Performance Tracking',
      description: 'Regular performance reviews and growth planning handled by our team.',
      badge: 'Premium'
    },
    {
      icon: 'fas fa-university',
      iconClass: 'service-icon--blue',
      title: 'Payment Processing',
      description: 'Secure salary disbursements through verified banking channels.',
      badge: 'Premium'
    },
    {
      icon: 'fas fa-shield-alt',
      iconClass: 'service-icon--red',
      title: 'Regulatory Compliance',
      description: 'All tax filings, pension, and statutory deductions handled on your behalf.',
      badge: 'Premium'
    },
    {
      icon: 'fas fa-file-alt',
      iconClass: 'service-icon--orange',
      title: 'Employee Documentation',
      description: 'Management of all employee contracts, records, and documentation.',
      badge: 'Core'
    },
    {
      icon: 'fas fa-user-circle',
      iconClass: 'service-icon--cyan',
      title: 'Staff Portal Access',
      description: 'Employee self-service portal managed and maintained by our team.',
      badge: 'Core'
    },
    {
      icon: 'fas fa-project-diagram',
      iconClass: 'service-icon--indigo',
      title: 'Project Coordination',
      description: 'Internal staff workflows and project management handled remotely.',
      badge: 'Premium'
    },
    {
      icon: 'fas fa-globe',
      iconClass: 'service-icon--green',
      title: 'Multi-Location Support',
      description: 'Manage staff across multiple offices or locations from our remote hub.',
      badge: 'Enterprise'
    },
    {
      icon: 'fas fa-headset',
      iconClass: 'service-icon--teal',
      title: 'Dedicated Account Manager',
      description: 'Your personal point of contact for all staff-related matters.',
      badge: 'Enterprise'
    }
  ];

  const d2eServices = [
    {
      icon: 'fas fa-users',
      iconClass: 'service-icon--indigo',
      title: 'Social Engagement Tasks',
      description: 'Complete social media tasks like subscriptions, follows, likes, and shares to earn rewards.',
      badge: 'Popular'
    },
    {
      icon: 'fas fa-poll',
      iconClass: 'service-icon--pink',
      title: 'Market Research',
      description: 'Participate in surveys, data collection, and research tasks for businesses.',
      badge: 'High Pay'
    },
    {
      icon: 'fas fa-paint-brush',
      iconClass: 'service-icon--emerald',
      title: 'Creative Bounties',
      description: 'Submit creative work including graphics, writing, and design tasks.',
      badge: 'Creative'
    },
    {
      icon: 'fas fa-mobile-alt',
      iconClass: 'service-icon--amber',
      title: 'App Testing',
      description: 'Test mobile and web applications, provide feedback and bug reports.',
      badge: 'Tech'
    },
    {
      icon: 'fas fa-language',
      iconClass: 'service-icon--purple',
      title: 'Translation & Localization',
      description: 'Translate content between languages and help businesses reach new markets.',
      badge: 'Language'
    },
    {
      icon: 'fas fa-search',
      iconClass: 'service-icon--teal',
      title: 'Data Verification',
      description: 'Verify and validate data, check information accuracy for companies.',
      badge: 'Entry'
    },
    {
      icon: 'fas fa-video',
      iconClass: 'service-icon--cyan',
      title: 'Content Creation',
      description: 'Create short videos, reviews, testimonials, and promotional content.',
      badge: 'Media'
    },
    {
      icon: 'fas fa-tasks',
      iconClass: 'service-icon--green',
      title: 'Micro-Tasks',
      description: 'Complete simple, quick tasks like categorization, tagging, and transcription.',
      badge: 'Quick'
    }
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
              We combine the power of a Product Studio for rapid product development with Remote Team Management services. 
              We act as your 3rd party project management team—handling all staff operations so you can focus on growth.
            </p>
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

      {/* Do-To-Earn Section */}
      <section className="section-shell section-shell--gradient py-20 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16" data-animate="fade-up">
            <span className="section-eyebrow">Do-To-Earn Marketplace</span>
            <h2 className="section-title">Complete Tasks, Earn Rewards</h2>
            <p className="section-lead max-w-3xl mx-auto">
              Join our decentralized crowd work platform and earn money by completing simple tasks for businesses worldwide. 
              From social media engagement to market research and creative work.
            </p>
          </div>

          <div className="services-grid">
            {d2eServices.map((service, index) => (
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
                    <span className={`service-badge service-badge--${service.badge.toLowerCase().replace(' ', '-')}`}>
                      {service.badge}
                    </span>
                  )}
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </article>
            ))}
          </div>

          <div className="text-center mt-12" data-animate="fade-up">
            <Link href="/d2e" className="btn btn-primary">
              Explore Do-To-Earn <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Remote Team Management Services */}
      <section className="section-shell py-20 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16" data-animate="fade-up">
            <span className="section-eyebrow">Remote Team Management</span>
            <h2 className="section-title">Your External Staff Management Partner</h2>
            <p className="section-lead max-w-3xl mx-auto">
              We function as your dedicated 3rd party remote project management team. From recruitment to payroll, 
              we handle all internal staff activities and operations on your behalf—built specifically for African businesses.
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
              <h2 className="services-cta-title">Ready to Outsource Your Staff Operations?</h2>
              <p className="services-cta-description">
                Let us handle your people operations. Choose the plan that fits your team size and get your dedicated remote management team.
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

