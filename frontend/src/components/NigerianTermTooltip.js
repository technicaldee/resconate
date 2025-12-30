import React, { useState } from 'react';

const NigerianTermTooltip = ({ term, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const termDefinitions = {
    'PAYE': 'Pay As You Earn - A tax deducted from employee salaries by employers and remitted to the Federal Inland Revenue Service (FIRS)',
    'NSITF': 'Nigeria Social Insurance Trust Fund - A mandatory 1% contribution from employers for employee social security benefits',
    'ITF': 'Industrial Training Fund - A 1% contribution from employers with 5+ employees, remitted quarterly for workforce development',
    'PenCom': 'Pension Commission - Regulates pension contributions. Employers must remit 8% of employee salary (employee contributes 8%)',
    'NHF': 'National Housing Fund - A 2.5% contribution from employees earning above ₦30,000 monthly for housing development',
    'FIRS': 'Federal Inland Revenue Service - The government agency responsible for tax collection in Nigeria',
    'Akwa Ibom State': 'One of Nigeria\'s 36 states. Resconate supports state-specific PAYE calculations for all states',
    'USSD': 'Unstructured Supplementary Service Data - A payment method using mobile phone codes (e.g., *737#)',
    'Bank Transfer': 'Direct transfer from bank account to bank account, commonly used in Nigeria for payments'
  };

  const definition = termDefinitions[term] || `Term: ${term}`;

  return (
    <span
      className="relative inline-block cursor-help border-b border-dashed border-green-400 text-green-400"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children || term}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-2xl border border-green-500/30 z-50">
          <div className="font-semibold text-green-400 mb-1">{term}</div>
          <div className="text-gray-300">{definition}</div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </span>
  );
};

export default NigerianTermTooltip;

