import React from 'react';
import { handleAnchorClick } from '../utils/scrollUtils';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter Plan',
      price: 'N20,000',
      period: '/month',
      features: [
        'Manage up to 10 employees',
        'Staff can request and track their own leave',
        'Process payroll and generate payslips automatically',
        'Store employee documents securely online',
        'View basic reports on your team'
      ],
      icon: 'fas fa-rocket',
      iconClass: 'pricing-icon--indigo',
      cta: 'Get Started',
      ctaClass: 'btn-secondary'
    },
    {
      name: 'Premium Plan',
      price: 'N50,000',
      period: '/month',
      features: [
        'Unlimited employees with full automation',
        'Post jobs, track candidates & schedule interviews',
        'Connect to your bank for seamless payments',
        'Advanced performance tracking with goals & surveys',
        'Dedicated support team in your timezone'
      ],
      icon: 'fas fa-star',
      iconClass: 'pricing-icon--pink',
      cta: 'Get Started',
      ctaClass: 'btn-primary',
      popular: true
    },
    {
      name: 'Custom Plan',
      price: 'Contact Us',
      period: '',
      features: [
        'Choose exactly what you need',
        'Multi-location & multi-country support',
        'Connect to your existing business systems',
        'White-label with your company branding',
        'Dedicated account manager & on-site training'
      ],
      icon: 'fas fa-cog',
      iconClass: 'pricing-icon--emerald',
      cta: 'Contact Us',
      ctaClass: 'btn-ghost'
    }
  ];

  return (
    <section id="pricing" className="section-shell section-shell--gradient py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="section-heading text-center mb-16" data-animate="fade-up">
          <span className="section-eyebrow">Pricing Tiers</span>
          <h2 className="section-title">RESCONATE HR PLATFORM PRICING TIERS</h2>
          <p className="section-lead">
            Choose the plan that fits your team size and needs. All plans include our core HR management features.
          </p>
        </div>
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <article 
              key={index} 
              className={`pricing-card ${plan.popular ? 'pricing-card--popular' : ''}`}
              data-animate="fade-up" 
              style={{ '--animate-delay': `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="pricing-badge">Most Popular</div>
              )}
              <div className={`pricing-icon ${plan.iconClass}`}>
                <i className={plan.icon}></i>
              </div>
              <h3 className="pricing-name">{plan.name}</h3>
              <div className="pricing-price">
                <span className="pricing-amount">{plan.price}</span>
                {plan.period && <span className="pricing-period">{plan.period}</span>}
              </div>
              <ul className="pricing-features">
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <i className="fas fa-check pricing-check"></i>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a 
                href={plan.cta === 'Contact Us' ? '#contact' : '/hr-login'} 
                className={`btn ${plan.ctaClass} pricing-cta`}
                onClick={plan.cta === 'Contact Us' ? (e) => handleAnchorClick(e, 'contact') : undefined}
              >
                {plan.cta}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

