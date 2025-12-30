import React, { useState } from 'react';

const CostSavingsCalculator = () => {
  const [inputs, setInputs] = useState({
    employees: 10,
    monthlyPayroll: 5000000,
    hrStaff: 1,
    hrStaffSalary: 200000,
    manualHours: 40,
    hourlyRate: 5000
  });

  const [results, setResults] = useState(null);

  const calculateSavings = () => {
    // Time savings
    const manualTimePerMonth = inputs.manualHours * 4; // hours per month
    const timeCostPerMonth = manualTimePerMonth * inputs.hourlyRate;
    const timeCostPerYear = timeCostPerMonth * 12;

    // HR Staff cost
    const hrStaffCostPerYear = inputs.hrStaffSalary * 12 * inputs.hrStaff;

    // Error reduction savings (estimated 5% of payroll)
    const errorReductionSavings = inputs.monthlyPayroll * 0.05 * 12;

    // Compliance penalty avoidance (estimated)
    const complianceSavings = 500000; // Estimated annual savings from avoiding penalties

    // Total savings
    const totalTimeSavings = timeCostPerYear;
    const totalCostSavings = hrStaffCostPerYear + errorReductionSavings + complianceSavings;
    const totalSavings = totalTimeSavings + totalCostSavings;

    // Resconate cost (estimated based on employees)
    let resconateCost = 0;
    if (inputs.employees <= 10) {
      resconateCost = 50000 * 12; // Basic plan
    } else if (inputs.employees <= 50) {
      resconateCost = 100000 * 12; // Professional plan
    } else {
      resconateCost = 200000 * 12; // Enterprise plan
    }

    const netSavings = totalSavings - resconateCost;
    const roi = ((netSavings / resconateCost) * 100).toFixed(1);

    setResults({
      timeSavings: totalTimeSavings,
      costSavings: totalCostSavings,
      totalSavings,
      resconateCost,
      netSavings,
      roi,
      hoursSaved: manualTimePerMonth * 12,
      timeCostPerMonth
    });
  };

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="cost-savings-calculator p-8" style={{ background: 'var(--dark-bg)', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Calculate Your HR Cost Savings</h1>
          <p className="text-gray-400 text-lg">
            See how much time and money Resconate can save your business
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Input Section */}
          <div className="card-ng">
            <h2 className="heading-ng text-xl text-white mb-6">Your Current Setup</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Number of Employees</label>
                <input
                  type="number"
                  value={inputs.employees}
                  onChange={(e) => handleInputChange('employees', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Monthly Payroll (₦)</label>
                <input
                  type="number"
                  value={inputs.monthlyPayroll}
                  onChange={(e) => handleInputChange('monthlyPayroll', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">HR Staff Count</label>
                <input
                  type="number"
                  value={inputs.hrStaff}
                  onChange={(e) => handleInputChange('hrStaff', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Average HR Staff Salary (₦/month)</label>
                <input
                  type="number"
                  value={inputs.hrStaffSalary}
                  onChange={(e) => handleInputChange('hrStaffSalary', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Hours Spent on HR Tasks per Week</label>
                <input
                  type="number"
                  value={inputs.manualHours}
                  onChange={(e) => handleInputChange('manualHours', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Hourly Rate (₦)</label>
                <input
                  type="number"
                  value={inputs.hourlyRate}
                  onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                  min="0"
                />
              </div>

              <button
                onClick={calculateSavings}
                className="w-full btn-ng-primary py-4 text-lg font-semibold"
              >
                Calculate Savings
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="card-ng">
            <h2 className="heading-ng text-xl text-white mb-6">Your Savings</h2>
            
            {results ? (
              <div className="space-y-6">
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="text-green-400 text-sm mb-1">Annual Time Savings</div>
                  <div className="text-white text-2xl font-bold">
                    ₦{results.timeSavings.toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm mt-1">
                    {results.hoursSaved.toLocaleString()} hours saved per year
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="text-blue-400 text-sm mb-1">Annual Cost Savings</div>
                  <div className="text-white text-2xl font-bold">
                    ₦{results.costSavings.toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm mt-1">
                    From reduced errors, compliance, and HR staff costs
                  </div>
                </div>

                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <div className="text-purple-400 text-sm mb-1">Total Annual Savings</div>
                  <div className="text-white text-3xl font-bold">
                    ₦{results.totalSavings.toLocaleString()}
                  </div>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-gray-400 text-sm mb-1">Resconate Annual Cost</div>
                  <div className="text-white text-xl font-semibold">
                    ₦{results.resconateCost.toLocaleString()}
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 border-2 border-green-500/50 rounded-lg">
                  <div className="text-green-400 text-sm mb-1">Net Annual Savings</div>
                  <div className="text-white text-4xl font-bold mb-2">
                    ₦{results.netSavings.toLocaleString()}
                  </div>
                  <div className="text-green-400 text-lg font-semibold">
                    ROI: {results.roi}%
                  </div>
                </div>

                <button
                  onClick={() => window.location.href = '/hr-login'}
                  className="w-full btn-ng-primary py-4 text-lg font-semibold"
                >
                  Start Your Free Trial
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-gray-400">Enter your details and click "Calculate Savings" to see your potential savings</p>
              </div>
            )}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="card-ng mt-8">
          <h2 className="heading-ng text-xl text-white mb-6">Additional Benefits</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-white font-semibold mb-1">Faster Processing</div>
              <div className="text-gray-400 text-sm">Reduce payroll processing time by up to 80%</div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-white font-semibold mb-1">Compliance Guaranteed</div>
              <div className="text-gray-400 text-sm">Automatic Nigerian tax compliance calculations</div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-3xl mb-2">📈</div>
              <div className="text-white font-semibold mb-1">Better Insights</div>
              <div className="text-gray-400 text-sm">Real-time analytics and reporting</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostSavingsCalculator;

