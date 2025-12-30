import React, { useState } from 'react';

const EnhancedTestimonials = () => {
  const [activeTab, setActiveTab] = useState('testimonials');

  const testimonials = [
    {
      name: 'Adaeze Nwosu',
      role: 'COO, Fintech Startup',
      company: 'Lagos',
      image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80',
      text: "Resconate moved us from idea to launch without breaking pace. The product landed polished and operations never skipped a beat.",
      rating: 5,
      metrics: { employees: 25, timeSaved: '15hrs/week', costSaved: '₦200k/month' }
    },
    {
      name: 'Derrick Adeyemi',
      role: 'People Lead, Growth Company',
      company: 'Abuja',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80',
      text: "Payroll, compliance, and reviews now feel automated. Their squad plugs in like our own people team, on call and proactive.",
      rating: 5,
      metrics: { employees: 45, timeSaved: '25hrs/week', costSaved: '₦350k/month' }
    },
    {
      name: 'Chioma Okonkwo',
      role: 'HR Director, Hospitality Group',
      company: 'Uyo, Akwa Ibom',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
      text: "The Nigerian compliance features are a game-changer. PAYE, NSITF, PenCom - all automated. We've never been more compliant.",
      rating: 5,
      metrics: { employees: 80, timeSaved: '40hrs/week', costSaved: '₦600k/month' }
    }
  ];

  const caseStudies = [
    {
      title: 'Hotel Chain Reduces HR Costs by 60%',
      company: 'Luxury Hotels Group',
      location: 'Lagos',
      challenge: 'Manual payroll processing for 150+ employees across 5 locations',
      solution: 'Automated payroll with Nigerian bank integration',
      results: [
        '60% reduction in HR processing time',
        '₦800k monthly cost savings',
        '100% compliance rate',
        'Zero payroll errors'
      ],
      image: '🏨'
    },
    {
      title: 'School System Streamlines Operations',
      company: 'Elite Education Group',
      location: 'Abuja',
      challenge: 'Complex leave management and performance tracking for 200+ staff',
      solution: 'Self-service portal with automated approvals',
      results: [
        '80% reduction in leave processing time',
        'Real-time performance insights',
        'Improved staff satisfaction',
        'Paperless operations'
      ],
      image: '🏫'
    },
    {
      title: 'Oil & Gas Company Achieves Full Compliance',
      company: 'Energy Solutions Ltd',
      location: 'Port Harcourt',
      challenge: 'Managing compliance across multiple states and regulations',
      solution: 'Automated compliance tracking and reporting',
      results: [
        '100% filing compliance',
        'Automated tax calculations',
        'Audit-ready reports',
        'Zero penalties'
      ],
      image: '⛽'
    }
  ];

  const trustBadges = [
    { icon: '🔒', text: 'SSL Secured' },
    { icon: '✅', text: 'GDPR Compliant' },
    { icon: '🏆', text: 'ISO Certified' },
    { icon: '💳', text: 'PCI DSS Level 1' }
  ];

  return (
    <div className="enhanced-testimonials p-6" style={{ background: 'var(--dark-bg)', minHeight: '100vh' }}>
      {/* Trusted By Counter */}
      <div className="text-center mb-12">
        <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-2">
          127+
        </div>
        <div className="text-white text-xl font-semibold mb-1">Nigerian Businesses Trust Resconate</div>
        <div className="text-gray-400">From startups to enterprises across 6 states</div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('testimonials')}
          className={`pb-4 px-6 font-semibold transition-colors ${
            activeTab === 'testimonials'
              ? 'text-green-400 border-b-2 border-green-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Testimonials
        </button>
        <button
          onClick={() => setActiveTab('cases')}
          className={`pb-4 px-6 font-semibold transition-colors ${
            activeTab === 'cases'
              ? 'text-green-400 border-b-2 border-green-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Case Studies
        </button>
        <button
          onClick={() => setActiveTab('trust')}
          className={`pb-4 px-6 font-semibold transition-colors ${
            activeTab === 'trust'
              ? 'text-green-400 border-b-2 border-green-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Trust & Security
        </button>
      </div>

      {/* Testimonials */}
      {activeTab === 'testimonials' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card-ng">
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  <div className="text-gray-500 text-xs">{testimonial.company}</div>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-amber-400">★</span>
                ))}
              </div>
              <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
              <div className="pt-4 border-t border-gray-700">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-green-400 font-bold">{testimonial.metrics.employees}</div>
                    <div className="text-gray-400 text-xs">Employees</div>
                  </div>
                  <div>
                    <div className="text-green-400 font-bold">{testimonial.metrics.timeSaved}</div>
                    <div className="text-gray-400 text-xs">Saved</div>
                  </div>
                  <div>
                    <div className="text-green-400 font-bold">{testimonial.metrics.costSaved}</div>
                    <div className="text-gray-400 text-xs">Saved</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Case Studies */}
      {activeTab === 'cases' && (
        <div className="space-y-6">
          {caseStudies.map((study, index) => (
            <div key={index} className="card-ng">
              <div className="flex items-start">
                <div className="text-6xl mr-6">{study.image}</div>
                <div className="flex-1">
                  <h3 className="heading-ng text-xl text-white mb-2">{study.title}</h3>
                  <div className="text-gray-400 text-sm mb-4">
                    {study.company} • {study.location}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="text-red-400 font-semibold mb-2">Challenge</div>
                      <p className="text-gray-300 text-sm">{study.challenge}</p>
                    </div>
                    <div>
                      <div className="text-green-400 font-semibold mb-2">Solution</div>
                      <p className="text-gray-300 text-sm">{study.solution}</p>
                    </div>
                  </div>
                  <div>
                    <div className="text-blue-400 font-semibold mb-3">Results</div>
                    <div className="grid grid-cols-2 gap-3">
                      {study.results.map((result, i) => (
                        <div key={i} className="flex items-center text-gray-300 text-sm">
                          <span className="text-green-400 mr-2">✓</span>
                          {result}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trust & Security */}
      {activeTab === 'trust' && (
        <div className="space-y-6">
          <div className="card-ng">
            <h3 className="heading-ng text-xl text-white mb-6">Security Certifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trustBadges.map((badge, index) => (
                <div key={index} className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <div className="text-white text-sm font-medium">{badge.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-ng">
            <h3 className="heading-ng text-xl text-white mb-4">As Seen In</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center opacity-60">
              <div className="text-center text-gray-400 font-semibold">TechCabal</div>
              <div className="text-center text-gray-400 font-semibold">BusinessDay</div>
              <div className="text-center text-gray-400 font-semibold">Nairametrics</div>
              <div className="text-center text-gray-400 font-semibold">The Guardian</div>
            </div>
          </div>

          <div className="card-ng">
            <h3 className="heading-ng text-xl text-white mb-4">Founder Story</h3>
            <div className="flex items-start">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-4xl mr-6">
                👨‍💼
              </div>
              <div className="flex-1">
                <p className="text-gray-300 mb-4 leading-relaxed">
                  "After years of struggling with manual HR processes in our own businesses, we built Resconate 
                  to solve the compliance and automation challenges facing Nigerian companies. We understand the 
                  unique needs of businesses in Akwa Ibom and across Nigeria."
                </p>
                <div className="text-white font-semibold">Inimfon Udoh</div>
                <div className="text-gray-400 text-sm">Founder & CEO, Resconate</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedTestimonials;

