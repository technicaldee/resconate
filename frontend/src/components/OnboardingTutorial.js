import React, { useState, useEffect } from 'react';

const OnboardingTutorial = ({ userId, userType = 'admin', onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  const steps = userType === 'admin' ? [
    {
      key: 'welcome',
      title: 'Welcome to Resconate!',
      description: 'Let\'s get you started with a quick tour of the platform.',
      target: null,
      position: 'center'
    },
    {
      key: 'employees',
      title: 'Manage Employees',
      description: 'Add and manage your team members here. Click "Add Employee" to get started.',
      target: '[data-onboarding="employees"]',
      position: 'bottom'
    },
    {
      key: 'payroll',
      title: 'Process Payroll',
      description: 'Automatically calculate and process payroll with Nigerian tax compliance built-in.',
      target: '[data-onboarding="payroll"]',
      position: 'bottom'
    },
    {
      key: 'leave',
      title: 'Leave Management',
      description: 'Employees can request leave, and you can approve or reject requests here.',
      target: '[data-onboarding="leave"]',
      position: 'bottom'
    },
    {
      key: 'analytics',
      title: 'View Analytics',
      description: 'Track key HR metrics and insights on your dashboard.',
      target: '[data-onboarding="analytics"]',
      position: 'bottom'
    },
    {
      key: 'complete',
      title: 'You\'re All Set!',
      description: 'You\'ve completed the onboarding. Start managing your HR operations!',
      target: null,
      position: 'center'
    }
  ] : [
    {
      key: 'welcome',
      title: 'Welcome to Your Employee Portal!',
      description: 'Here\'s a quick guide to help you get started.',
      target: null,
      position: 'center'
    },
    {
      key: 'profile',
      title: 'Your Profile',
      description: 'View and update your personal information here.',
      target: '[data-onboarding="profile"]',
      position: 'bottom'
    },
    {
      key: 'payslips',
      title: 'View Payslips',
      description: 'Access your payslips and payment history here.',
      target: '[data-onboarding="payslips"]',
      position: 'bottom'
    },
    {
      key: 'leave',
      title: 'Request Leave',
      description: 'Submit leave requests and track their status here.',
      target: '[data-onboarding="leave"]',
      position: 'bottom'
    },
    {
      key: 'complete',
      title: 'You\'re Ready!',
      description: 'You now know how to use the employee portal.',
      target: null,
      position: 'center'
    }
  ];

  useEffect(() => {
    // Load completed steps from API
    const loadProgress = async () => {
      try {
        const response = await fetch(`/api/onboarding/progress?userId=${userId}&userType=${userType}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const completed = data.data.filter(s => s.is_completed).map(s => s.step_key);
            setCompletedSteps(completed);
            
            // Start from first incomplete step
            const firstIncomplete = steps.findIndex(s => !completed.includes(s.key));
            if (firstIncomplete >= 0) {
              setCurrentStep(firstIncomplete);
            } else {
              setIsVisible(false);
            }
          }
        }
      } catch (error) {
        console.error('Error loading onboarding progress:', error);
      }
    };

    if (userId) {
      loadProgress();
    }
  }, [userId, userType]);

  const handleNext = async () => {
    const step = steps[currentStep];
    
    // Mark step as completed
    if (userId && step) {
      try {
        await fetch('/api/onboarding/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            userType,
            stepKey: step.key,
            stepName: step.title,
            isCompleted: true
          })
        });
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }

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
    setIsVisible(false);
    if (onComplete) {
      onComplete();
    }
  };

  if (!isVisible || steps.length === 0) {
    return null;
  }

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl shadow-2xl max-w-md w-full mx-4 border-2 border-green-500/50 relative">
        {/* Progress Bar */}
        <div className="h-1 bg-gray-800">
          <div 
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">{isLastStep ? '🎉' : '📚'}</div>
            <h2 className="text-2xl font-bold text-white mb-2">{step.title}</h2>
            <p className="text-gray-400">{step.description}</p>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center space-x-2 mb-6">
            {steps.map((s, index) => (
              <div
                key={s.key}
                className={`h-2 w-2 rounded-full ${
                  index <= currentStep ? 'bg-green-500' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={handleSkip}
              className="flex-1 px-4 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Skip Tutorial
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
            >
              {isLastStep ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTutorial;
