import React from 'react';
import { handleAnchorClick } from '../utils/scrollUtils';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter Plan',
      price: 'N20,000',
      period: '/month',
      features: [
        'Remote management of up to 10 employees',
        'Leave and attendance tracking handled for you',
        'Full payroll processing and payslip distribution',
        'Employee documentation managed by our team',
        'Monthly staff operations reports'
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
        'Unlimited employees—fully managed remotely',
        'End-to-end recruitment handled by our team',
        'Direct salary disbursements to staff accounts',
        'Performance reviews and growth planning',
        'Dedicated remote project manager assigned'
      ],
      icon: 'fas fa-star',
      iconClass: 'pricing-icon--pink',
      cta: 'Get Started',
      ctaClass: 'btn-primary',
      popular: true
    },
    {
      name: 'Enterprise Plan',
      price: 'Contact Us',
      period: '',
      features: [
        'Custom scope for complex organizations',
        'Multi-location staff management',
        'Integration with your business systems',
        'White-label staff portal options',
        'Dedicated account manager & priority support'
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
          <span className="section-eyebrow">Remote Team Management Plans</span>
          <h2 className="section-title">OUTSOURCE YOUR STAFF OPERATIONS</h2>
          <p className="section-lead">
            Choose the plan that fits your team size. Each plan includes a dedicated remote team managing all your staff operations.
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

