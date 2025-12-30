import React, { useState, useEffect } from 'react';

const LeadCapture = () => {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [email, setEmail] = useState('');
  const [savings, setSavings] = useState({ employees: 10, hours: 20, cost: 50000 });

  useEffect(() => {
    // Show exit intent popup when user tries to leave
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !showExitIntent) {
        setShowExitIntent(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [showExitIntent]);

  const calculateSavings = () => {
    const hoursSaved = savings.employees * 2; // 2 hours per employee per month
    const costSaved = savings.employees * 5000; // ₦5,000 per employee
    return {
      hours: hoursSaved,
      cost: costSaved,
      roi: ((costSaved / 50000) * 100).toFixed(0)
    };
  };

  const savingsData = calculateSavings();

  return (
    <>
      {/* Book Demo Button - Prominent */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowDemoModal(true)}
          className="btn-ng-gold shadow-lg animate-pulse"
          style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
        >
          <i className="fas fa-calendar-check mr-2"></i>
          Book a Demo
        </button>
      </div>

      {/* Free Trial CTA */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-4 px-6 rounded-xl mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-lg mb-1">Start Your 14-Day Free Trial</div>
            <div className="text-green-100 text-sm">No credit card required • Full access • Cancel anytime</div>
          </div>
          <button
            onClick={() => setShowTrialModal(true)}
            className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
          >
            Start Free Trial
          </button>
        </div>
      </div>

      {/* Cost Savings Calculator */}
      <div className="card-ng mb-6">
        <h2 className="heading-ng text-2xl text-white mb-4">Calculate Your HR Cost Savings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Number of Employees</label>
            <input
              type="number"
              value={savings.employees}
              onChange={(e) => setSavings({ ...savings, employees: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Hours Spent on HR Tasks/Month</label>
            <input
              type="number"
              value={savings.hours}
              onChange={(e) => setSavings({ ...savings, hours: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Current HR Cost/Month (₦)</label>
            <input
              type="number"
              value={savings.cost}
              onChange={(e) => setSavings({ ...savings, cost: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
            />
          </div>
        </div>
        <div className="p-6 bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-gray-300 text-sm mb-1">Time Saved</div>
              <div className="text-green-400 text-2xl font-bold">{savingsData.hours} hrs</div>
            </div>
            <div>
              <div className="text-gray-300 text-sm mb-1">Cost Saved</div>
              <div className="text-green-400 text-2xl font-bold">
                <span className="currency">{savingsData.cost.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <div className="text-gray-300 text-sm mb-1">ROI</div>
              <div className="text-green-400 text-2xl font-bold">{savingsData.roi}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="card-ng">
        <h2 className="heading-ng text-2xl text-white mb-6 text-center">Manual HR vs Resconate</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
            <h3 className="text-red-400 font-bold text-lg mb-4">❌ Manual HR</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Hours of paperwork weekly</li>
              <li>• High error rates</li>
              <li>• Compliance risks</li>
              <li>• No real-time insights</li>
              <li>• Expensive HR staff</li>
            </ul>
          </div>
          <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
            <h3 className="text-green-400 font-bold text-lg mb-4">✅ Resconate</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Automated processes</li>
              <li>• 99.9% accuracy</li>
              <li>• Full compliance</li>
              <li>• Real-time analytics</li>
              <li>• Affordable pricing</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="card-ng max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-ng text-2xl text-white">Book a Demo</h2>
              <button onClick={() => setShowDemoModal(false)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Full Name</label>
                <input type="text" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Email</label>
                <input type="email" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Phone</label>
                <input type="tel" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Company Name</label>
                <input type="text" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Preferred Date & Time</label>
                <input type="datetime-local" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white" />
              </div>
              <button type="submit" className="btn-ng-primary w-full">
                Schedule Demo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Trial Modal */}
      {showTrialModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="card-ng max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-ng text-2xl text-white">Start Free Trial</h2>
              <button onClick={() => setShowTrialModal(false)} className="text-gray-400 hover:text-white">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="text-green-400 font-semibold mb-2">✓ 14-Day Free Trial Includes:</div>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Full platform access</li>
                <li>• Up to 10 employees</li>
                <li>• All core features</li>
                <li>• Email support</li>
                <li>• No credit card required</li>
              </ul>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Company Name</label>
                <input type="text" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Email</label>
                <input type="email" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Password</label>
                <input type="password" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white" />
              </div>
              <button type="submit" className="btn-ng-primary w-full">
                Start Free Trial
              </button>
              <p className="text-gray-400 text-xs text-center">
                By signing up, you agree to our Terms of Service
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Exit Intent Popup */}
      {showExitIntent && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="card-ng max-w-lg w-full border-2 border-gold-500">
            <button
              onClick={() => setShowExitIntent(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🎁</div>
              <h2 className="heading-ng text-2xl text-white mb-2">Wait! Special Offer</h2>
              <p className="text-gray-300">Get 20% off your first 3 months when you sign up today</p>
            </div>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
              <button className="btn-ng-gold w-full">
                Claim 20% Discount
              </button>
              <button
                onClick={() => setShowExitIntent(false)}
                className="w-full text-gray-400 hover:text-white text-sm"
              >
                No thanks, I'll pay full price
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeadCapture;

