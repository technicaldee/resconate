import React, { useState } from 'react';

const LanguageToggle = () => {
  const [language, setLanguage] = useState('en');
  const [showDropdown, setShowDropdown] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ib', name: 'Ibibio', flag: '🇳🇬' }
  ];

  const translations = {
    en: {
      welcome: 'Welcome to Resconate',
      dashboard: 'Dashboard',
      employees: 'Employees',
      payroll: 'Payroll'
    },
    ib: {
      welcome: 'Nnoo na Resconate',
      dashboard: 'Dashboard',
      employees: 'Ndito',
      payroll: 'Ego ndito'
    }
  };

  return (
    <div className="language-toggle relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
      >
        <span className="text-xl">
          {languages.find(l => l.code === language)?.flag}
        </span>
        <span className="text-white text-sm">
          {languages.find(l => l.code === language)?.name}
        </span>
        <i className={`fas fa-chevron-${showDropdown ? 'up' : 'down'} text-gray-400 text-xs`}></i>
      </button>

      {showDropdown && (
        <div className="absolute top-full mt-2 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 min-w-[150px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setShowDropdown(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 transition-colors ${
                language === lang.code ? 'bg-green-500/20' : ''
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="text-white text-sm">{lang.name}</span>
              {language === lang.code && (
                <span className="text-green-400 ml-auto">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;

