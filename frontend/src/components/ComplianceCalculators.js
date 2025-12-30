import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

const ComplianceCalculators = () => {
  const [activeCalculator, setActiveCalculator] = useState('paye');
  const [salary, setSalary] = useState('');
  const [results, setResults] = useState({});

  // PAYE Calculator for Akwa Ibom State
  const calculatePAYE = (grossSalary) => {
    const salaryNum = parseFloat(grossSalary) || 0;
    // Akwa Ibom State PAYE rates (2024)
    let paye = 0;
    if (salaryNum > 300000) {
      paye = (salaryNum - 300000) * 0.24; // 24% for amounts above 300k
      paye += 300000 * 0.07; // 7% for first 300k
    } else {
      paye = salaryNum * 0.07; // 7% for amounts up to 300k
    }
    return {
      grossSalary: salaryNum,
      paye: Math.round(paye),
      netSalary: Math.round(salaryNum - paye),
      percentage: ((paye / salaryNum) * 100).toFixed(2)
    };
  };

  // NSITF Calculator (1% of gross salary)
  const calculateNSITF = (grossSalary) => {
    const salaryNum = parseFloat(grossSalary) || 0;
    const nsitf = salaryNum * 0.01;
    return {
      grossSalary: salaryNum,
      nsitf: Math.round(nsitf),
      netSalary: Math.round(salaryNum - nsitf),
      percentage: '1%'
    };
  };

  // ITF Calculator (1% of gross salary)
  const calculateITF = (grossSalary) => {
    const salaryNum = parseFloat(grossSalary) || 0;
    const itf = salaryNum * 0.01;
    return {
      grossSalary: salaryNum,
      itf: Math.round(itf),
      netSalary: Math.round(salaryNum - itf),
      percentage: '1%'
    };
  };

  // PenCom Calculator (8% employee, 10% employer)
  const calculatePenCom = (grossSalary) => {
    const salaryNum = parseFloat(grossSalary) || 0;
    const employeeContribution = salaryNum * 0.08;
    const employerContribution = salaryNum * 0.10;
    const totalContribution = employeeContribution + employerContribution;
    return {
      grossSalary: salaryNum,
      employeeContribution: Math.round(employeeContribution),
      employerContribution: Math.round(employerContribution),
      totalContribution: Math.round(totalContribution),
      netSalary: Math.round(salaryNum - employeeContribution)
    };
  };

  const handleCalculate = () => {
    if (!salary) return;
    
    const calculations = {
      paye: calculatePAYE(salary),
      nsitf: calculateNSITF(salary),
      itf: calculateITF(salary),
      pencom: calculatePenCom(salary)
    };
    setResults(calculations);
  };

  const calculators = [
    { id: 'paye', name: 'PAYE Tax', icon: '📊', color: 'from-blue-500 to-blue-700' },
    { id: 'nsitf', name: 'NSITF', icon: '🛡️', color: 'from-green-500 to-green-700' },
    { id: 'itf', name: 'ITF', icon: '🎓', color: 'from-purple-500 to-purple-700' },
    { id: 'pencom', name: 'PenCom', icon: '💰', color: 'from-amber-500 to-amber-700' }
  ];

  const complianceDeadlines = [
    { type: 'PAYE Remittance', date: '2025-01-10', status: 'upcoming', daysLeft: 17 },
    { type: 'NSITF Contribution', date: '2025-01-15', status: 'upcoming', daysLeft: 22 },
    { type: 'ITF Deduction', date: '2025-01-20', status: 'upcoming', daysLeft: 27 },
    { type: 'PenCom Remittance', date: '2025-01-07', status: 'due', daysLeft: 14 }
  ];

  return (
    <div className="compliance-calculators p-6 space-y-6" style={{ background: 'var(--dark-bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-ng text-3xl text-white mb-2">Nigerian Compliance Calculators</h1>
        <p className="text-ng-body text-gray-400">Calculate PAYE, NSITF, ITF, and PenCom for Akwa Ibom State</p>
      </div>

      {/* Calculator Selection */}
      <div className="card-ng">
        <h2 className="heading-ng text-xl text-white mb-4">Select Calculator</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {calculators.map((calc) => (
            <button
              key={calc.id}
              onClick={() => setActiveCalculator(calc.id)}
              className={`p-6 rounded-xl border-2 transition-all ${
                activeCalculator === calc.id
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="text-4xl mb-2">{calc.icon}</div>
              <div className="text-white font-semibold text-sm">{calc.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Calculator Input */}
      <div className="card-ng">
        <h2 className="heading-ng text-xl text-white mb-6">
          {calculators.find(c => c.id === activeCalculator)?.name} Calculator
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Gross Salary (₦)</label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Enter gross salary"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:border-green-500"
            />
          </div>
          <button onClick={handleCalculate} className="btn-ng-primary w-full">
            <i className="fas fa-calculator mr-2"></i>
            Calculate
          </button>
        </div>

        {/* Results */}
        {results[activeCalculator] && (
          <div className="mt-6 p-6 bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl">
            <h3 className="text-white font-semibold mb-4">Calculation Results</h3>
            {activeCalculator === 'paye' && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Gross Salary:</span>
                  <span className="text-white font-semibold">
                    <span className="currency">{results.paye.grossSalary.toLocaleString()}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">PAYE Tax ({results.paye.percentage}%):</span>
                  <span className="text-red-400 font-semibold">
                    <span className="currency">{results.paye.paye.toLocaleString()}</span>
                  </span>
                </div>
                <div className="ng-divider"></div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Net Salary:</span>
                  <span className="text-green-400 font-bold text-xl">
                    <span className="currency">{results.paye.netSalary.toLocaleString()}</span>
                  </span>
                </div>
              </div>
            )}
            {activeCalculator === 'nsitf' && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Gross Salary:</span>
                  <span className="text-white font-semibold">
                    <span className="currency">{results.nsitf.grossSalary.toLocaleString()}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">NSITF Contribution (1%):</span>
                  <span className="text-amber-400 font-semibold">
                    <span className="currency">{results.nsitf.nsitf.toLocaleString()}</span>
                  </span>
                </div>
                <div className="ng-divider"></div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Net Salary:</span>
                  <span className="text-green-400 font-bold text-xl">
                    <span className="currency">{results.nsitf.netSalary.toLocaleString()}</span>
                  </span>
                </div>
              </div>
            )}
            {activeCalculator === 'itf' && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Gross Salary:</span>
                  <span className="text-white font-semibold">
                    <span className="currency">{results.itf.grossSalary.toLocaleString()}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">ITF Deduction (1%):</span>
                  <span className="text-purple-400 font-semibold">
                    <span className="currency">{results.itf.itf.toLocaleString()}</span>
                  </span>
                </div>
                <div className="ng-divider"></div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Net Salary:</span>
                  <span className="text-green-400 font-bold text-xl">
                    <span className="currency">{results.itf.netSalary.toLocaleString()}</span>
                  </span>
                </div>
              </div>
            )}
            {activeCalculator === 'pencom' && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Gross Salary:</span>
                  <span className="text-white font-semibold">
                    <span className="currency">{results.pencom.grossSalary.toLocaleString()}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Employee Contribution (8%):</span>
                  <span className="text-blue-400 font-semibold">
                    <span className="currency">{results.pencom.employeeContribution.toLocaleString()}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Employer Contribution (10%):</span>
                  <span className="text-amber-400 font-semibold">
                    <span className="currency">{results.pencom.employerContribution.toLocaleString()}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Contribution:</span>
                  <span className="text-green-400 font-semibold">
                    <span className="currency">{results.pencom.totalContribution.toLocaleString()}</span>
                  </span>
                </div>
                <div className="ng-divider"></div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Net Salary:</span>
                  <span className="text-green-400 font-bold text-xl">
                    <span className="currency">{results.pencom.netSalary.toLocaleString()}</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Compliance Calendar */}
      <div className="card-ng">
        <h2 className="heading-ng text-xl text-white mb-6">Compliance Calendar</h2>
        <div className="space-y-3">
          {complianceDeadlines.map((deadline, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                deadline.status === 'due'
                  ? 'border-red-500/50 bg-red-500/10'
                  : 'border-gray-700 bg-gray-800/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold mb-1">{deadline.type}</div>
                  <div className="text-gray-400 text-sm">
                    Due: {new Date(deadline.date).toLocaleDateString('en-NG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`badge-ng ${
                    deadline.status === 'due' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'badge-ng-warning'
                  }`}>
                    {deadline.daysLeft} days left
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Reports */}
      <div className="card-ng">
        <h2 className="heading-ng text-xl text-white mb-4">Compliance Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors text-left">
            <div className="text-white font-semibold mb-1">Monthly Compliance Report</div>
            <div className="text-gray-400 text-sm">Generate comprehensive compliance report</div>
          </button>
          <button className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors text-left">
            <div className="text-white font-semibold mb-1">Auditor's Report</div>
            <div className="text-gray-400 text-sm">Export for external audit</div>
          </button>
        </div>
        <div className="mt-4 flex space-x-3">
          <button className="btn-ng-primary flex-1">
            <i className="fas fa-file-pdf mr-2"></i>
            Export PDF
          </button>
          <button className="btn-ng-gold flex-1">
            <i className="fas fa-file-excel mr-2"></i>
            Export Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceCalculators;

