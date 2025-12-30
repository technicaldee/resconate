import React, { useState } from 'react';

const EnhancedAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const analytics = {
    employees: 45,
    activeJobs: 8,
    pendingInterviews: 12,
    complianceScore: 98,
    payrollProcessed: 450000,
    timeSaved: 120,
    costSaved: 350000
  };

  const trends = [
    { month: 'Oct', employees: 38, payroll: 380000 },
    { month: 'Nov', employees: 42, payroll: 420000 },
    { month: 'Dec', employees: 45, payroll: 450000 }
  ];

  const benchmarks = {
    yourCompany: {
      payrollAccuracy: 99.8,
      complianceRate: 98,
      avgProcessingTime: 2.5
    },
    industry: {
      payrollAccuracy: 95.2,
      complianceRate: 87,
      avgProcessingTime: 8.5
    }
  };

  return (
    <div className="enhanced-analytics p-6" style={{ background: 'var(--dark-bg)', minHeight: '100vh' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-ng text-3xl text-white mb-2">Analytics Dashboard</h1>
          <p className="text-ng-body text-gray-400">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex space-x-3">
          {['week', 'month', 'quarter', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card-ng">
          <div className="text-gray-400 text-sm mb-1">Total Employees</div>
          <div className="text-3xl font-bold text-white mb-2">{analytics.employees}</div>
          <div className="text-green-400 text-sm">↑ 12% from last month</div>
        </div>
        <div className="card-ng">
          <div className="text-gray-400 text-sm mb-1">Payroll Processed</div>
          <div className="text-3xl font-bold text-white mb-2">
            <span className="currency">{analytics.payrollProcessed.toLocaleString()}</span>
          </div>
          <div className="text-green-400 text-sm">↑ 7% from last month</div>
        </div>
        <div className="card-ng">
          <div className="text-gray-400 text-sm mb-1">Time Saved</div>
          <div className="text-3xl font-bold text-white mb-2">{analytics.timeSaved} hrs</div>
          <div className="text-green-400 text-sm">This month</div>
        </div>
        <div className="card-ng">
          <div className="text-gray-400 text-sm mb-1">Cost Saved</div>
          <div className="text-3xl font-bold text-white mb-2">
            <span className="currency">{analytics.costSaved.toLocaleString()}</span>
          </div>
          <div className="text-green-400 text-sm">ROI: 700%</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Employee Growth Chart */}
        <div className="card-ng">
          <h3 className="heading-ng text-lg text-white mb-4">Employee Growth</h3>
          <div className="space-y-3">
            {trends.map((trend, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-300 text-sm">{trend.month}</span>
                  <span className="text-white font-semibold">{trend.employees} employees</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                    style={{ width: `${(trend.employees / 50) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payroll Trends */}
        <div className="card-ng">
          <h3 className="heading-ng text-lg text-white mb-4">Payroll Trends</h3>
          <div className="space-y-3">
            {trends.map((trend, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-300 text-sm">{trend.month}</span>
                  <span className="text-white font-semibold">
                    <span className="currency">{trend.payroll.toLocaleString()}</span>
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                    style={{ width: `${(trend.payroll / 500000) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benchmarking */}
      <div className="card-ng mb-8">
        <h3 className="heading-ng text-xl text-white mb-6">How You Compare</h3>
        <div className="space-y-6">
          {[
            { label: 'Payroll Accuracy', your: benchmarks.yourCompany.payrollAccuracy, industry: benchmarks.industry.payrollAccuracy, unit: '%' },
            { label: 'Compliance Rate', your: benchmarks.yourCompany.complianceRate, industry: benchmarks.industry.complianceRate, unit: '%' },
            { label: 'Avg Processing Time', your: benchmarks.yourCompany.avgProcessingTime, industry: benchmarks.industry.avgProcessingTime, unit: 'hrs' }
          ].map((metric, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">{metric.label}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-green-400 font-semibold">
                    You: {metric.your}{metric.unit}
                  </span>
                  <span className="text-gray-500">
                    Industry: {metric.industry}{metric.unit}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="w-full bg-gray-800 rounded-full h-3 mb-1">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: `${metric.your}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="w-full bg-gray-800 rounded-full h-3 mb-1">
                    <div
                      className="bg-gray-600 h-3 rounded-full"
                      style={{ width: `${metric.industry}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="card-ng">
        <h3 className="heading-ng text-xl text-white mb-4">Export Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors text-left">
            <div className="text-red-400 text-2xl mb-2">📄</div>
            <div className="text-white font-semibold mb-1">PDF Report</div>
            <div className="text-gray-400 text-sm">Export as PDF</div>
          </button>
          <button className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors text-left">
            <div className="text-green-400 text-2xl mb-2">📊</div>
            <div className="text-white font-semibold mb-1">Excel Report</div>
            <div className="text-gray-400 text-sm">Export as Excel</div>
          </button>
          <button className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors text-left">
            <div className="text-blue-400 text-2xl mb-2">📧</div>
            <div className="text-white font-semibold mb-1">Email Report</div>
            <div className="text-gray-400 text-sm">Send via email</div>
          </button>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="card-ng mt-8">
        <h3 className="heading-ng text-xl text-white mb-4">ROI Calculator</h3>
        <div className="p-6 bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-gray-300 text-sm mb-2">Time Saved</div>
              <div className="text-green-400 text-3xl font-bold">{analytics.timeSaved} hrs</div>
              <div className="text-gray-400 text-xs mt-1">This month</div>
            </div>
            <div>
              <div className="text-gray-300 text-sm mb-2">Cost Saved</div>
              <div className="text-green-400 text-3xl font-bold">
                <span className="currency">{analytics.costSaved.toLocaleString()}</span>
              </div>
              <div className="text-gray-400 text-xs mt-1">This month</div>
            </div>
            <div>
              <div className="text-gray-300 text-sm mb-2">ROI</div>
              <div className="text-green-400 text-3xl font-bold">700%</div>
              <div className="text-gray-400 text-xs mt-1">Return on investment</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAnalytics;

