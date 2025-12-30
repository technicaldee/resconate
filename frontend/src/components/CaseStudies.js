import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

const CaseStudies = () => {
  const caseStudies = [
    {
      id: 1,
      company: "Akpan's Restaurant",
      industry: 'Hospitality',
      location: 'Uyo, Akwa Ibom',
      employees: 50,
      challenge: 'Spending 2 full days every month processing payroll manually, with frequent calculation errors and compliance concerns.',
      solution: 'Implemented Resconate for automated payroll processing with Nigerian tax compliance built-in.',
      results: [
        { metric: 'Time Saved', value: '95%', description: 'From 16 hours to 30 minutes per month' },
        { metric: 'Error Reduction', value: '100%', description: 'Zero calculation errors since implementation' },
        { metric: 'Cost Savings', value: '₦600,000/year', description: 'Reduced HR processing costs' },
        { metric: 'Compliance', value: '100%', description: 'Never missed a filing deadline' }
      ],
      testimonial: "Resconate transformed how we handle HR. What used to take days now takes minutes, and we've never been more compliant.",
      author: 'Mr. Akpan',
      role: 'Owner'
    },
    {
      id: 2,
      company: 'Uyo Tech Solutions',
      industry: 'Technology',
      location: 'Uyo, Akwa Ibom',
      employees: 25,
      challenge: 'Growing team needed scalable HR solution. Manual processes couldn\'t keep up with rapid hiring.',
      solution: 'Deployed Resconate for employee management, leave tracking, and automated compliance.',
      results: [
        { metric: 'Onboarding Time', value: '80% faster', description: 'New employee setup in minutes' },
        { metric: 'Leave Management', value: '100% digital', description: 'No more paper forms' },
        { metric: 'Employee Satisfaction', value: '+40%', description: 'Self-service portal improved experience' },
        { metric: 'Compliance Score', value: '100%', description: 'Perfect compliance record' }
      ],
      testimonial: 'Resconate scaled with us perfectly. As we grew from 10 to 25 employees, the platform handled everything seamlessly.',
      author: 'Sarah Johnson',
      role: 'HR Manager'
    },
    {
      id: 3,
      company: 'Heritage School',
      industry: 'Education',
      location: 'Port Harcourt, Rivers',
      employees: 80,
      challenge: 'Complex payroll with multiple pay scales, allowances, and compliance requirements for educational staff.',
      solution: 'Customized Resconate setup for education sector with industry-specific templates.',
      results: [
        { metric: 'Payroll Accuracy', value: '100%', description: 'Zero errors in 12 months' },
        { metric: 'Processing Time', value: '90% reduction', description: 'From 3 days to 2 hours' },
        { metric: 'Cost Savings', value: '₦1.2M/year', description: 'Reduced administrative overhead' },
        { metric: 'Staff Satisfaction', value: '95%', description: 'Timely and accurate payments' }
      ],
      testimonial: 'Resconate understands the unique needs of schools. The education templates saved us months of setup time.',
      author: 'Dr. Emmanuel',
      role: 'Administrator'
    },
    {
      id: 4,
      company: 'Coastal Logistics Ltd',
      industry: 'Logistics',
      location: 'Lagos',
      employees: 120,
      challenge: 'Managing payroll for field workers across multiple locations with varying schedules and allowances.',
      solution: 'Implemented Resconate with mobile access for field workers and automated location-based calculations.',
      results: [
        { metric: 'Multi-location Support', value: '5 locations', description: 'Centralized management' },
        { metric: 'Mobile Access', value: '100%', description: 'Field workers access payslips on mobile' },
        { metric: 'Compliance', value: '100%', description: 'All locations compliant' },
        { metric: 'Time Savings', value: '85%', description: 'Reduced administrative burden' }
      ],
      testimonial: 'Managing 120 employees across 5 locations used to be a nightmare. Resconate made it simple and efficient.',
      author: 'Chinedu Okoro',
      role: 'Operations Manager'
    }
  ];

  return (
    <div className="App">
      <Header />
      <main id="main-content" style={{ background: 'var(--dark-bg)', minHeight: '100vh' }}>
        <div className="case-studies-page py-16 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-white mb-4">Success Stories</h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                See how Nigerian businesses are transforming their HR operations with Resconate
              </p>
            </div>

            {/* Case Studies */}
            <div className="space-y-8">
              {caseStudies.map(study => (
                <div key={study.id} className="card-ng">
                  <div className="mb-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-2">{study.company}</h2>
                        <div className="flex items-center space-x-4 text-gray-400">
                          <span>{study.industry}</span>
                          <span>•</span>
                          <span>{study.location}</span>
                          <span>•</span>
                          <span>{study.employees} employees</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">The Challenge</h3>
                      <p className="text-gray-300 leading-relaxed">{study.challenge}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">The Solution</h3>
                      <p className="text-gray-300 leading-relaxed">{study.solution}</p>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Results</h3>
                    <div className="grid md:grid-cols-4 gap-4">
                      {study.results.map((result, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg"
                        >
                          <div className="text-3xl font-bold text-green-400 mb-1">{result.value}</div>
                          <div className="text-white font-semibold text-sm mb-1">{result.metric}</div>
                          <div className="text-gray-400 text-xs">{result.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="p-6 bg-gray-800/50 rounded-lg border-l-4 border-green-500">
                    <p className="text-gray-300 text-lg italic mb-4">"{study.testimonial}"</p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-bold text-xl mr-3">
                        {study.author.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-semibold">{study.author}</div>
                        <div className="text-gray-400 text-sm">{study.role}, {study.company}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="card-ng mt-12 bg-gradient-to-r from-green-500/20 to-blue-500/20 border-2 border-green-500/50 text-center">
              <h3 className="text-3xl font-bold text-white mb-4">Ready to Write Your Success Story?</h3>
              <p className="text-gray-300 mb-6 text-lg">
                Join hundreds of Nigerian businesses using Resconate to transform their HR operations
              </p>
              <div className="flex justify-center space-x-4">
                <a href="/hr-login" className="btn-ng-primary px-8 py-4 text-lg font-semibold">
                  Start Free Trial
                </a>
                <a href="/contact" className="btn-ng-secondary px-8 py-4 text-lg font-semibold">
                  Book a Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default CaseStudies;

