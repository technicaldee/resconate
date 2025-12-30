import React, { useState } from 'react';

const IndustryTemplates = () => {
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  const industries = [
    {
      id: 'schools',
      name: 'Schools & Education',
      icon: '🏫',
      color: 'from-blue-500 to-blue-700',
      description: 'Templates for educational institutions',
      features: [
        'Academic calendar integration',
        'Teacher performance tracking',
        'Student enrollment workflows',
        'Term-based payroll cycles'
      ],
      templates: [
        'School Employee Handbook',
        'Teacher Job Description',
        'Academic Staff Org Chart',
        'School Compliance Checklist'
      ]
    },
    {
      id: 'hotels',
      name: 'Hotels & Hospitality',
      icon: '🏨',
      color: 'from-amber-500 to-amber-700',
      description: 'Hospitality industry-specific templates',
      features: [
        'Shift scheduling templates',
        'Guest service standards',
        'Multi-location management',
        'Seasonal staffing patterns'
      ],
      templates: [
        'Hotel Staff Handbook',
        'Front Desk Job Description',
        'Hospitality Org Chart',
        'Hotel Compliance Checklist'
      ]
    },
    {
      id: 'oilgas',
      name: 'Oil & Gas Services',
      icon: '⛽',
      color: 'from-gray-600 to-gray-800',
      description: 'Energy sector compliance and workflows',
      features: [
        'Safety compliance tracking',
        'Field worker management',
        'Multi-state operations',
        'Regulatory reporting'
      ],
      templates: [
        'Oil & Gas Employee Handbook',
        'Field Worker Job Description',
        'Energy Sector Org Chart',
        'Oil & Gas Compliance Checklist'
      ]
    }
  ];

  return (
    <section className="section-shell py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16" data-animate="fade-up">
          <span className="section-eyebrow">Industry Templates</span>
          <h1 className="section-title">Pre-Built Templates Tailored for Your Industry</h1>
          <p className="section-lead max-w-3xl mx-auto">
            Get started quickly with industry-specific templates designed for Nigerian businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {industries.map((industry, index) => (
            <div
              key={industry.id}
              onClick={() => setSelectedIndustry(industry.id)}
              className={`service-card cursor-pointer transition-all ${
                selectedIndustry === industry.id 
                  ? 'border-2 border-indigo-500 shadow-lg shadow-indigo-500/20' 
                  : ''
              }`}
              data-animate="fade-up"
              style={{ '--animate-delay': `${index * 0.1}s` }}
            >
              <div className="text-6xl mb-4 text-center">{industry.icon}</div>
              <h3 className="service-title text-center mb-3">{industry.name}</h3>
              <p className="service-description text-center mb-4">{industry.description}</p>
              <div className="flex items-center justify-center text-indigo-400 text-sm font-medium group">
                View Templates
                <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
              </div>
            </div>
          ))}
        </div>

        {selectedIndustry && (
          <div className="service-card" data-animate="fade-up">
            <div className="flex items-center justify-between mb-8">
              <h2 className="section-title text-2xl">
                {industries.find(i => i.id === selectedIndustry)?.name} Templates
              </h2>
              <button
                onClick={() => setSelectedIndustry(null)}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="service-title mb-4">Key Features</h3>
                <ul className="space-y-3">
                  {industries.find(i => i.id === selectedIndustry)?.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <span className="text-indigo-400 mt-1"><i className="fas fa-check-circle"></i></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="service-title mb-4">Available Templates</h3>
                <div className="space-y-3">
                  {industries.find(i => i.id === selectedIndustry)?.templates.map((template, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-4 bg-gray-800/60 rounded-lg hover:bg-gray-800/80 transition-all border border-white/5 hover:border-indigo-500/50 group"
                    >
                      <div className="text-white font-medium mb-1 group-hover:text-indigo-400 transition-colors">{template}</div>
                      <div className="text-gray-400 text-xs flex items-center gap-2">
                        <i className="fas fa-download"></i>
                        Click to download
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
              <div className="flex items-start gap-4">
                <span className="text-indigo-400 text-xl">ℹ️</span>
                <div>
                  <div className="text-indigo-400 font-semibold mb-2">Industry-Specific Compliance</div>
                  <div className="text-gray-300 text-sm leading-relaxed">
                    These templates include compliance checklists specific to {industries.find(i => i.id === selectedIndustry)?.name.toLowerCase()} 
                    operations in Nigeria, including state-specific regulations.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default IndustryTemplates;

