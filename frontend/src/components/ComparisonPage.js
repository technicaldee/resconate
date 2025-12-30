import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

const ComparisonPage = () => {
  const features = [
    {
      feature: 'Payroll Processing',
      manual: { time: '8-12 hours', cost: '₦50,000+', errors: 'High risk', compliance: 'Manual' },
      resconate: { time: '30 minutes', cost: 'Included', errors: 'Zero errors', compliance: 'Automatic' }
    },
    {
      feature: 'Tax Calculations',
      manual: { time: '4-6 hours', cost: '₦30,000+', errors: 'Common mistakes', compliance: 'Manual calculation' },
      resconate: { time: 'Automatic', cost: 'Included', errors: 'Zero errors', compliance: 'Built-in compliance' }
    },
    {
      feature: 'Leave Management',
      manual: { time: '2-3 hours', cost: 'Time cost', errors: 'Tracking issues', compliance: 'Spreadsheet' },
      resconate: { time: '5 minutes', cost: 'Included', errors: 'Real-time tracking', compliance: 'Automated system' }
    },
    {
      feature: 'Employee Records',
      manual: { time: 'Ongoing', cost: 'Storage costs', errors: 'Lost files', compliance: 'Paper files' },
      resconate: { time: 'Instant access', cost: 'Included', errors: 'Cloud backup', compliance: 'Digital records' }
    },
    {
      feature: 'Compliance Reporting',
      manual: { time: '10-15 hours', cost: '₦100,000+', errors: 'Missing deadlines', compliance: 'Manual filing' },
      resconate: { time: 'Automatic', cost: 'Included', errors: 'Never miss deadlines', compliance: 'Auto-reminders' }
    },
    {
      feature: 'Analytics & Reports',
      manual: { time: '6-8 hours', cost: 'Time cost', errors: 'Inaccurate data', compliance: 'Basic charts' },
      resconate: { time: 'Real-time', cost: 'Included', errors: '100% accurate', compliance: 'Advanced analytics' }
    }
  ];

  return (
    <div className="App">
      <Header />
      <main id="main-content" style={{ background: 'var(--dark-bg)', minHeight: '100vh' }}>
        <div className="comparison-page py-16 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-white mb-4">Manual HR vs Resconate</h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                See how Resconate compares to manual HR processes. Save time, reduce costs, and eliminate errors.
              </p>
            </div>

            {/* Comparison Table */}
            <div className="card-ng overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-6 text-white font-semibold">Feature</th>
                    <th className="text-center py-4 px-6 text-white font-semibold bg-red-500/10">Manual HR</th>
                    <th className="text-center py-4 px-6 text-white font-semibold bg-green-500/10">Resconate</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((item, index) => (
                    <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="py-4 px-6 text-white font-medium">{item.feature}</td>
                      <td className="py-4 px-6 text-center">
                        <div className="space-y-2">
                          <div className="text-red-400 text-sm">⏱️ {item.manual.time}</div>
                          <div className="text-red-400 text-sm">💰 {item.manual.cost}</div>
                          <div className="text-red-400 text-sm">⚠️ {item.manual.errors}</div>
                          <div className="text-red-400 text-sm">📋 {item.manual.compliance}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="space-y-2">
                          <div className="text-green-400 text-sm font-semibold">⚡ {item.resconate.time}</div>
                          <div className="text-green-400 text-sm font-semibold">✅ {item.resconate.cost}</div>
                          <div className="text-green-400 text-sm font-semibold">✓ {item.resconate.errors}</div>
                          <div className="text-green-400 text-sm font-semibold">🚀 {item.resconate.compliance}</div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="card-ng border-2 border-red-500/30">
                <h3 className="text-2xl font-bold text-white mb-4">Manual HR Challenges</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">✗</span>
                    <span>Time-consuming processes (40+ hours/month)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">✗</span>
                    <span>High error rates leading to compliance issues</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">✗</span>
                    <span>Expensive HR staff costs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">✗</span>
                    <span>Risk of missing compliance deadlines</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-2">✗</span>
                    <span>Difficult to scale as business grows</span>
                  </li>
                </ul>
              </div>

              <div className="card-ng border-2 border-green-500/30">
                <h3 className="text-2xl font-bold text-white mb-4">Resconate Benefits</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>80% time savings on HR tasks</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Zero calculation errors with automated compliance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Affordable pricing starting at ₦50,000/month</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Automatic compliance reminders and filing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Scales effortlessly with your business</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* ROI Calculator CTA */}
            <div className="card-ng mt-12 bg-gradient-to-r from-green-500/20 to-blue-500/20 border-2 border-green-500/50 text-center">
              <h3 className="text-3xl font-bold text-white mb-4">Calculate Your Savings</h3>
              <p className="text-gray-300 mb-6 text-lg">
                See exactly how much time and money Resconate can save your business
              </p>
              <a
                href="/cost-savings-calculator"
                className="inline-block btn-ng-primary px-8 py-4 text-lg font-semibold"
              >
                Calculate Your Savings Now
              </a>
            </div>

            {/* Testimonial */}
            <div className="card-ng mt-12">
              <div className="flex items-start space-x-4">
                <div className="text-5xl">💬</div>
                <div>
                  <p className="text-gray-300 text-lg italic mb-4">
                    "We used to spend 2 full days every month processing payroll manually. 
                    With Resconate, it takes 30 minutes. The time savings alone paid for the platform in the first month."
                  </p>
                  <div className="text-white font-semibold">— Akpan's Restaurant, Uyo</div>
                  <div className="text-gray-400 text-sm">50 employees, using Resconate for 6 months</div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center mt-12">
              <h3 className="text-3xl font-bold text-white mb-4">Ready to Make the Switch?</h3>
              <p className="text-gray-400 mb-6 text-lg">Start your 14-day free trial today. No credit card required.</p>
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

export default ComparisonPage;

