import React, { useState, useEffect } from 'react';

const EmailCapturePopup = ({ onClose, resourceType = 'guide' }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const resources = {
    guide: {
      title: 'Get Your Free HR Compliance Guide',
      description: 'Download our complete guide to HR compliance in Akwa Ibom State',
      fileName: 'HR_Compliance_Guide_Akwa_Ibom.pdf'
    },
    checklist: {
      title: 'Get Your Payroll Processing Checklist',
      description: 'Download our comprehensive payroll processing checklist for Nigerian businesses',
      fileName: 'Payroll_Processing_Checklist.pdf'
    },
    handbook: {
      title: 'Get Your Employee Handbook Template',
      description: 'Download a ready-to-use employee handbook template',
      fileName: 'Employee_Handbook_Template.pdf'
    }
  };

  const currentResource = resources[resourceType] || resources.guide;

  useEffect(() => {
    // Show popup after 30 seconds or on scroll to 50%
    const timer = setTimeout(() => {
      // Popup is controlled by parent component
    }, 30000);

    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 50) {
        // Trigger popup (handled by parent)
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save email to database/newsletter
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          name,
          resourceType,
          source: 'email_capture_popup'
        })
      });

      if (response.ok) {
        setIsSuccess(true);
        // Trigger download or redirect to resource
        setTimeout(() => {
          window.open(`/resources/${currentResource.fileName}`, '_blank');
          if (onClose) onClose();
        }, 2000);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="bg-gray-900 rounded-xl shadow-2xl max-w-md w-full mx-4 border border-green-500/30 p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
          <p className="text-gray-400 mb-4">Your resource is downloading...</p>
          <p className="text-sm text-gray-500">Check your email for the download link</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl shadow-2xl max-w-md w-full mx-4 border border-green-500/30">
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">📥</div>
            <h2 className="text-2xl font-bold text-white mb-2">{currentResource.title}</h2>
            <p className="text-gray-400">{currentResource.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">Your Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-ng-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Downloading...' : 'Get Free Resource'}
            </button>

            <p className="text-xs text-gray-500 text-center">
              By submitting, you agree to receive occasional emails from Resconate. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailCapturePopup;

