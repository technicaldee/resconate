import React, { useState, useEffect } from 'react';

const ExitIntentPopup = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e) => {
      // Detect when user moves mouse to top of screen (exit intent)
      if (e.clientY <= 0) {
        // Show popup - this is handled by parent component
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          source: 'exit_intent_popup',
          specialOffer: true
        })
      });

      if (response.ok) {
        setIsSuccess(true);
        // Store offer code in localStorage
        localStorage.setItem('special_offer_code', 'WELCOME20');
        setTimeout(() => {
          if (onClose) onClose();
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl shadow-2xl max-w-md w-full mx-4 border-2 border-green-500/50 p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">Special Offer Applied!</h2>
          <p className="text-gray-300 mb-4">Use code <span className="font-bold text-green-400">WELCOME20</span> for 20% off your first 3 months</p>
          <p className="text-sm text-gray-400">Check your email for details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl shadow-2xl max-w-md w-full mx-4 border-2 border-green-500/50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10"></div>
        
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center mb-6">
            <div className="text-6xl mb-4 animate-bounce">⏰</div>
            <h2 className="text-3xl font-bold text-white mb-2">Wait! Don't Go Yet!</h2>
            <p className="text-gray-300 text-lg mb-2">Get <span className="text-green-400 font-bold">20% OFF</span> your first 3 months</p>
            <p className="text-gray-400">Enter your email to claim this exclusive offer</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-gray-800 border-2 border-green-500/50 rounded-lg text-white focus:outline-none focus:border-green-500 text-center text-lg"
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Claiming Offer...' : 'Claim 20% OFF Now'}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Limited time offer. Valid for new customers only.
            </p>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <span className="mr-2">✓</span>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">✓</span>
                <span>14-day free trial</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentPopup;

