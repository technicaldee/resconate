import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

const ComplianceCalculatorsEnhanced = () => {
  const [activeCalculator, setActiveCalculator] = useState('paye');
  const [salary, setSalary] = useState('');
  const [state, setState] = useState('akwa-ibom');
  const [results, setResults] = useState({});
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [autoCalculate, setAutoCalculate] = useState(true);

  // Nigerian States with their PAYE rates
  const nigerianStates = [
    { code: 'akwa-ibom', name: 'Akwa Ibom State', payeRate: 0.07, threshold: 300000 },
    { code: 'lagos', name: 'Lagos State', payeRate: 0.075, threshold: 300000 },
    { code: 'abuja', name: 'FCT Abuja', payeRate: 0.08, threshold: 300000 },
    { code: 'rivers', name: 'Rivers State', payeRate: 0.07, threshold: 300000 },
    { code: 'kano', name: 'Kano State', payeRate: 0.065, threshold: 300000 }
  ];

  // Enhanced PAYE Calculator with state-specific rates
  const calculatePAYE = (grossSalary, stateCode) => {
    const salaryNum = parseFloat(grossSalary) || 0;
    const stateInfo = nigerianStates.find(s => s.code === stateCode) || nigerianStates[0];
    
    let paye = 0;
    const threshold = stateInfo.threshold;
    const baseRate = stateInfo.payeRate;
    
    if (salaryNum > threshold) {
      // Progressive tax: base rate for threshold, higher rate for excess
      paye = threshold * baseRate;
      paye += (salaryNum - threshold) * (baseRate + 0.17); // Additional 17% for amounts above threshold
    } else {
      paye = salaryNum * baseRate;
    }
    
    // Personal relief (₦200,000 annually = ₦16,667 monthly)
    const personalRelief = 16667;
    paye = Math.max(0, paye - personalRelief);
    
    return {
      grossSalary: salaryNum,
      paye: Math.round(paye),
      netSalary: Math.round(salaryNum - paye),
      percentage: salaryNum > 0 ? ((paye / salaryNum) * 100).toFixed(2) : '0.00',
      state: stateInfo.name,
      personalRelief: personalRelief
    };
  };

  // NSITF Calculator (1% of gross salary, employer pays)
  const calculateNSITF = (grossSalary) => {
    const salaryNum = parseFloat(grossSalary) || 0;
    const nsitf = salaryNum * 0.01;
    return {
      grossSalary: salaryNum,
      nsitf: Math.round(nsitf),
      netSalary: Math.round(salaryNum), // Employee doesn't pay, employer does
      percentage: '1%',
      note: 'Employer contribution'
    };
  };

  // ITF Calculator (1% of gross salary, employer pays)
  const calculateITF = (grossSalary) => {
    const salaryNum = parseFloat(grossSalary) || 0;
    const itf = salaryNum * 0.01;
    return {
      grossSalary: salaryNum,
      itf: Math.round(itf),
      netSalary: Math.round(salaryNum), // Employee doesn't pay, employer does
      percentage: '1%',
      note: 'Employer contribution'
    };
  };

  // Enhanced PenCom Calculator (8% employee, 10% employer)
  const calculatePenCom = (grossSalary) => {
    const salaryNum = parseFloat(grossSalary) || 0;
    // Maximum contribution base (₦3,000,000 annually = ₦250,000 monthly)
    const maxContributionBase = Math.min(salaryNum, 250000);
    
    const employeeContribution = maxContributionBase * 0.08;
    const employerContribution = maxContributionBase * 0.10;
    const totalContribution = employeeContribution + employerContribution;
    
    return {
      grossSalary: salaryNum,
      contributionBase: maxContributionBase,
      employeeContribution: Math.round(employeeContribution),
      employerContribution: Math.round(employerContribution),
      totalContribution: Math.round(totalContribution),
      netSalary: Math.round(salaryNum - employeeContribution)
    };
  };

  // NHF Calculator (2.5% of gross salary, employee pays)
  const calculateNHF = (grossSalary) => {
    const salaryNum = parseFloat(grossSalary) || 0;
    const nhf = salaryNum * 0.025;
    return {
      grossSalary: salaryNum,
      nhf: Math.round(nhf),
      netSalary: Math.round(salaryNum - nhf),
      percentage: '2.5%'
    };
  };

  // Comprehensive calculation combining all deductions
  const calculateComprehensive = (grossSalary, stateCode) => {
    const paye = calculatePAYE(grossSalary, stateCode);
    const pencom = calculatePenCom(grossSalary);
    const nhf = calculateNHF(grossSalary);
    
    const totalDeductions = paye.paye + pencom.employeeContribution + nhf.nhf;
    const netSalary = grossSalary - totalDeductions;
    
    return {
      grossSalary,
      deductions: {
        paye: paye.paye,
        pencom: pencom.employeeContribution,
        nhf: nhf.nhf,
        total: totalDeductions
      },
      netSalary: Math.round(netSalary),
      breakdown: {
        paye,
        pencom,
        nhf
      }
    };
  };

  useEffect(() => {
    if (autoCalculate && salary) {
      handleCalculate();
    }
  }, [salary, state, activeCalculator, autoCalculate]);

  const handleCalculate = async () => {
    if (!salary) return;
    
    const salaryNum = parseFloat(salary);
    if (isNaN(salaryNum) || salaryNum <= 0) {
      alert('Please enter a valid salary amount');
      return;
    }
    
    const calculations = {
      paye: calculatePAYE(salary, state),
      nsitf: calculateNSITF(salary),
      itf: calculateITF(salary),
      pencom: calculatePenCom(salary),
      nhf: calculateNHF(salary),
      comprehensive: calculateComprehensive(salary, state)
    };
    
    setResults(calculations);
    
    // Save to calculation history
    const historyEntry = {
      id: Date.now(),
      salary: salaryNum,
      state: state,
      calculator: activeCalculator,
      result: calculations[activeCalculator],
      timestamp: new Date().toISOString()
    };
    
    setCalculationHistory(prev => [historyEntry, ...prev.slice(0, 9)]);
    
    // Save to API (if available)
    try {
      await apiFetch('/api/compliance/calculations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(historyEntry)
      });
    } catch (error) {
      // Silently fail - calculation still works
      console.log('Could not save calculation history');
    }
  };

  const calculators = [
    { id: 'paye', name: 'PAYE Tax', icon: '📊', description: 'Personal Income Tax' },
    { id: 'nsitf', name: 'NSITF', icon: '🛡️', description: 'Employee Compensation' },
    { id: 'itf', name: 'ITF', icon: '🎓', description: 'Industrial Training Fund' },
    { id: 'pencom', name: 'PenCom', icon: '💰', description: 'Pension Contribution' },
    { id: 'nhf', name: 'NHF', icon: '🏠', description: 'National Housing Fund' },
    { id: 'comprehensive', name: 'All Deductions', icon: '📋', description: 'Complete Breakdown' }
  ];

  const complianceDeadlines = [
    { type: 'PAYE Remittance', date: '2025-01-10', status: 'upcoming', daysLeft: 11 },
    { type: 'NSITF Contribution', date: '2025-01-15', status: 'upcoming', daysLeft: 16 },
    { id: 'itf', name: 'ITF', icon: '🎓', description: 'Industrial Training Fund' },
    { id: 'pencom', name: 'PenCom', icon: '💰', description: 'Pension Contribution' },
    { id: 'nhf', name: 'NHF', icon: '🏠', description: 'National Housing Fund' },
    { id: 'comprehensive', name: 'All Deductions', icon: '📋', description: 'Complete Breakdown' }
  ];

  return (
    <div className="compliance-calculators p-6 space-y-6" style={{ background: 'var(--dark-bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-ng text-3xl text-white mb-2">Nigerian Compliance Calculators</h1>
        <p className="text-ng-body text-gray-400">Calculate PAYE, NSITF, ITF, PenCom, and NHF with state-specific rates</p>
      </div>

      {/* Calculator Selection */}
      <div className="card-ng">
        <h2 className="heading-ng text-xl text-white mb-4">Select Calculator</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {calculators.map((calc) => (
            <button
              key={calc.id}
              onClick={() => setActiveCalculator(calc.id)}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                activeCalculator === calc.id
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="text-3xl mb-2">{calc.icon}</div>
              <div className="text-white font-semibold text-sm mb-1">{calc.name}</div>
              <div className="text-gray-400 text-xs">{calc.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Calculator Input */}
      <div className="card-ng">
        <h2 className="heading-ng text-xl text-white mb-6">
          {calculators.find(c => c.id === activeCalculator)?.name} Calculator
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Gross Salary (₦)</label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Enter gross salary"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:border-primary-500"
            />
          </div>
          {activeCalculator === 'paye' || activeCalculator === 'comprehensive' ? (
            <div>
              <label className="block text-gray-300 text-sm mb-2">State</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
              >
                {nigerianStates.map((s) => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </div>
          ) : null}
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoCalculate}
              onChange={(e) => setAutoCalculate(e.target.checked)}
              className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
            />
            <span className="text-gray-300 text-sm">Auto-calculate on input change</span>
          </label>
          <button 
            onClick={handleCalculate} 
            className="btn-ng-primary px-6"
            disabled={!salary}
          >
            <i className="fas fa-calculator mr-2"></i>
            Calculate
          </button>
        </div>

        {/* Results */}
        {results[activeCalculator] && (
          <div className="mt-6 p-6 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border border-primary-500/30 rounded-xl">
            <h3 className="text-white font-semibold mb-4">Calculation Results</h3>
            {/* Render results based on active calculator */}
            {activeCalculator === 'comprehensive' && results.comprehensive && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Gross Salary</div>
                    <div className="text-white text-2xl font-bold">
                      ₦{results.comprehensive.grossSalary.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Net Salary</div>
                    <div className="text-primary-400 text-2xl font-bold">
                      ₦{results.comprehensive.netSalary.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="ng-divider"></div>
                <div className="space-y-2">
                  <h4 className="text-white font-semibold mb-2">Deductions Breakdown</h4>
                  <div className="flex justify-between p-2 bg-gray-800/30 rounded">
                    <span className="text-gray-300">PAYE Tax:</span>
                    <span className="text-red-400 font-semibold">
                      ₦{results.comprehensive.deductions.paye.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-800/30 rounded">
                    <span className="text-gray-300">PenCom (8%):</span>
                    <span className="text-blue-400 font-semibold">
                      ₦{results.comprehensive.deductions.pencom.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-800/30 rounded">
                    <span className="text-gray-300">NHF (2.5%):</span>
                    <span className="text-purple-400 font-semibold">
                      ₦{results.comprehensive.deductions.nhf.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 bg-primary-500/20 rounded border border-primary-500/30">
                    <span className="text-white font-semibold">Total Deductions:</span>
                    <span className="text-primary-400 font-bold">
                      ₦{results.comprehensive.deductions.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {/* Other calculator results... */}
          </div>
        )}
      </div>

      {/* Calculation History */}
      {calculationHistory.length > 0 && (
        <div className="card-ng">
          <h2 className="heading-ng text-xl text-white mb-4">Recent Calculations</h2>
          <div className="space-y-2">
            {calculationHistory.map((entry) => (
              <div key={entry.id} className="p-3 bg-gray-800/50 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">₦{entry.salary.toLocaleString()}</div>
                  <div className="text-gray-400 text-xs">
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSalary(entry.salary.toString());
                    setState(entry.state);
                    setActiveCalculator(entry.calculator);
                  }}
                  className="text-primary-400 hover:text-primary-300 text-sm"
                >
                  Use Again
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
    </div>
  );
};

export default ComplianceCalculatorsEnhanced;

