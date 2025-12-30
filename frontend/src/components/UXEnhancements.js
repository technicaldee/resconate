import React, { useState, useEffect } from 'react';

// Onboarding Tutorial
export const OnboardingTutorial = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  const steps = [
    { title: 'Welcome to Resconate!', content: 'Let\'s take a quick tour of the platform', target: '#dashboard' },
    { title: 'Employee Management', content: 'Manage all your employees from one place', target: '#employees' },
    { title: 'Payroll Processing', content: 'Automated payroll with Nigerian bank integration', target: '#payroll' },
    { title: 'Compliance Tracking', content: 'Stay compliant with automated calculations', target: '#compliance' }
  ];

  if (!showTutorial) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="card-ng max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-400">Step {step + 1} of {steps.length}</div>
          <button onClick={() => { setShowTutorial(false); onComplete?.(); }} className="text-gray-400 hover:text-white">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <h2 className="heading-ng text-2xl text-white mb-4">{steps[step].title}</h2>
        <p className="text-gray-300 mb-6">{steps[step].content}</p>
        <div className="flex space-x-3">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="btn-ng-primary flex-1">
              Previous
            </button>
          )}
          {step < steps.length - 1 ? (
            <button onClick={() => setStep(step + 1)} className="btn-ng-primary flex-1">
              Next
            </button>
          ) : (
            <button onClick={() => { setShowTutorial(false); onComplete?.(); }} className="btn-ng-primary flex-1">
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Tooltip Component
export const Tooltip = ({ text, children, position = 'top' }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {show && (
        <div className={`absolute z-50 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl ${
          position === 'top' ? 'bottom-full mb-2' :
          position === 'bottom' ? 'top-full mt-2' :
          position === 'left' ? 'right-full mr-2' :
          'left-full ml-2'
        }`}>
          {text}
          <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
            position === 'top' ? 'top-full -mt-1 left-1/2 -translate-x-1/2' :
            position === 'bottom' ? 'bottom-full -mb-1 left-1/2 -translate-x-1/2' :
            position === 'left' ? 'left-full -ml-1 top-1/2 -translate-y-1/2' :
            'right-full -mr-1 top-1/2 -translate-y-1/2'
          }`}></div>
        </div>
      )}
    </div>
  );
};

// Help Center
export const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqs = [
    { category: 'getting-started', question: 'How do I add my first employee?', answer: 'Go to Employees tab and click Add Employee button...' },
    { category: 'payroll', question: 'How does PAYE calculation work?', answer: 'PAYE is calculated based on Akwa Ibom State tax rates...' },
    { category: 'compliance', question: 'What is NSITF?', answer: 'NSITF (Nigeria Social Insurance Trust Fund) is a 1% contribution...' },
    { category: 'billing', question: 'How do I update my payment method?', answer: 'Go to Payment & Billing section...' }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="help-center p-6" style={{ background: 'var(--dark-bg)', minHeight: '100vh' }}>
      <div className="mb-8">
        <h1 className="heading-ng text-3xl text-white mb-2">Help Center</h1>
        <p className="text-ng-body text-gray-400">Find answers to common questions</p>
      </div>

      <div className="card-ng mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help..."
            className="w-full px-4 py-3 pl-12 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>

      <div className="flex space-x-3 mb-6 overflow-x-auto">
        {['all', 'getting-started', 'payroll', 'compliance', 'billing'].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-green-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredFAQs.map((faq, index) => (
          <div key={index} className="card-ng">
            <div className="text-white font-semibold mb-2">{faq.question}</div>
            <div className="text-gray-300">{faq.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Live Chat Widget
export const LiveChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full shadow-lg flex items-center justify-center text-white text-2xl z-40 hover:scale-110 transition-transform"
      >
        {isOpen ? <i className="fas fa-times"></i> : <i className="fas fa-comments"></i>}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 left-6 w-80 h-96 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-40 flex flex-col">
          <div className="p-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-t-xl">
            <div className="text-white font-semibold">Chat with Us</div>
            <div className="text-green-100 text-xs">We typically reply in minutes</div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm">
                Start a conversation with our support team
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-2 rounded-lg ${
                  msg.sender === 'user' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-300'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-700 flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-green-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && input) {
                  setMessages([...messages, { sender: 'user', text: input }]);
                  setInput('');
                }
              }}
            />
            <button
              onClick={() => {
                if (input) {
                  setMessages([...messages, { sender: 'user', text: input }]);
                  setInput('');
                }
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// WhatsApp Integration
export const WhatsAppButton = ({ phone = '+2348066023759', message = 'Hello, I need help with Resconate' }) => {
  const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-24 w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg flex items-center justify-center text-white text-2xl z-40 hover:scale-110 transition-transform"
    >
      <i className="fab fa-whatsapp"></i>
    </a>
  );
};

