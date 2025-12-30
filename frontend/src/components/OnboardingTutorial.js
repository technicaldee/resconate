import React, { useState, useEffect } from 'react';

const OnboardingTutorial = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    {
      title: 'Welcome to Resconate!',
      description: 'Your complete HR management platform for Nigerian businesses. Let\'s get you started.',
      target: null,
      position: 'center'
    },
    {
      title: 'Employee Management',
      description: 'Add and manage your employees here. Track their information, roles, and status.',
      target: '#employee-management',
      position: 'bottom'
    },
    {
      title: 'Payroll Processing',
      description: 'Process payroll with Nigerian tax compliance built-in. Calculate PAYE, NSITF, and more automatically.',
      target: '#payroll',
      position: 'bottom'
    },
    {
      title: 'Leave Management',
      description: 'Employees can request leave, and you can approve or reject requests from here.',
      target: '#leave-management',
      position: 'bottom'
    },
    {
      title: 'Compliance Calculators',
      description: 'Use our calculators to ensure you\'re compliant with Nigerian labor laws.',
      target: '#compliance',
      position: 'bottom'
    },
    {
      title: 'Analytics Dashboard',
      description: 'View insights about your workforce, payroll costs, and compliance status.',
      target: '#analytics',
      position: 'bottom'
    }
  ];

  useEffect(() => {
    // Check if user has completed onboarding before
    const hasCompleted = localStorage.getItem('onboarding_completed');
    if (hasCompleted === 'true') {
      setIsVisible(false);
      return;
    }

    // Highlight current step target
    if (steps[currentStep].target) {
      const element = document.querySelector(steps[currentStep].target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.style.transition = 'all 0.3s';
        element.style.boxShadow = '0 0 0 4px rgba(34, 197, 94, 0.5)';
      }
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative bg-gray-900 rounded-xl shadow-2xl max-w-md w-full mx-4 border border-green-500/30">
        {/* Progress Bar */}
        <div className="h-1 bg-gray-800">
          <div 
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">👋</div>
            <h2 className="text-2xl font-bold text-white mb-2">{currentStepData.title}</h2>
            <p className="text-gray-400">{currentStepData.description}</p>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center space-x-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-green-500 w-8'
                    : index < currentStep
                    ? 'bg-green-500/50 w-2'
                    : 'bg-gray-700 w-2'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={handleSkip}
              className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Skip Tutorial
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleComplete}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default OnboardingTutorial;

