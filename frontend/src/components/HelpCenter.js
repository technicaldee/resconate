import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqCategories = [
    { id: 'all', name: 'All Questions', icon: '📚' },
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'payroll', name: 'Payroll', icon: '💰' },
    { id: 'compliance', name: 'Compliance', icon: '📋' },
    { id: 'employees', name: 'Employee Management', icon: '👥' },
    { id: 'billing', name: 'Billing & Payments', icon: '💳' },
    { id: 'technical', name: 'Technical Support', icon: '🔧' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I get started with Resconate?',
      answer: 'Getting started is easy! Sign up for a free 14-day trial at /hr-login. No credit card required. Once you create your account, you can add employees, set up payroll, and start using all features immediately. Our onboarding tutorial will guide you through the process.'
    },
    {
      id: 2,
      category: 'getting-started',
      question: 'Do I need technical expertise to use Resconate?',
      answer: 'Not at all! Resconate is designed to be intuitive and user-friendly. No technical training is required. If you can use email and basic software, you can use Resconate. We also provide video tutorials and a comprehensive help center.'
    },
    {
      id: 3,
      category: 'payroll',
      question: 'How does payroll processing work?',
      answer: 'Resconate automates your entire payroll process. Simply add employee details and salary information. The system automatically calculates PAYE, NSITF, ITF, PenCom, and other deductions based on Nigerian tax laws. You can process payroll in minutes instead of hours.'
    },
    {
      id: 4,
      category: 'payroll',
      question: 'Which Nigerian banks are supported for payroll disbursement?',
      answer: 'We support all major Nigerian banks including GTBank, Access Bank, Zenith Bank, UBA, First Bank, and more. You can verify bank accounts and process bulk payments directly through the platform.'
    },
    {
      id: 5,
      category: 'compliance',
      question: 'How does Resconate ensure compliance with Nigerian labor laws?',
      answer: 'Resconate has built-in compliance for all major Nigerian regulations including PAYE (state-specific calculations), NSITF, ITF, PenCom, and NHF. The system automatically calculates correct deductions and sends reminders for filing deadlines. You\'ll never miss a compliance deadline.'
    },
    {
      id: 6,
      category: 'compliance',
      question: 'Does Resconate support Akwa Ibom State PAYE calculations?',
      answer: 'Yes! Resconate supports state-specific PAYE calculations for Akwa Ibom State and all other Nigerian states. The system automatically applies the correct tax rates based on the employee\'s state of residence.'
    },
    {
      id: 7,
      category: 'compliance',
      question: 'What is NSITF and how is it calculated?',
      answer: 'NSITF (Nigeria Social Insurance Trust Fund) is a mandatory contribution for employers. It\'s calculated as 1% of total employee salaries. Resconate automatically calculates NSITF contributions and reminds you when remittances are due (15th of every month).'
    },
    {
      id: 8,
      category: 'compliance',
      question: 'What is ITF and when do I need to pay it?',
      answer: 'ITF (Industrial Training Fund) is a contribution required from employers with 5 or more employees. The contribution is 1% of total payroll. ITF is remitted quarterly (last day of each quarter). Resconate calculates this automatically and sends reminders.'
    },
    {
      id: 9,
      category: 'employees',
      question: 'How do I add employees to the system?',
      answer: 'You can add employees individually through the Employee Management section, or bulk import using a CSV file. For each employee, you\'ll need basic information like name, email, phone, bank details, and salary information.'
    },
    {
      id: 10,
      category: 'employees',
      question: 'Can employees access their own information?',
      answer: 'Yes! Employees can log in to their portal to view payslips, request leave, update personal information, and view their employment history. This reduces administrative burden on HR staff.'
    },
    {
      id: 11,
      category: 'billing',
      question: 'What payment methods do you accept?',
      answer: 'We accept card payments, bank transfers, and USSD payments through Paystack and Flutterwave. You can set up auto-renewal for your subscription to ensure uninterrupted service.'
    },
    {
      id: 12,
      category: 'billing',
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. Your subscription will remain active until the end of your current billing period.'
    },
    {
      id: 13,
      category: 'billing',
      question: 'Do you offer discounts for annual payments?',
      answer: 'Yes! We offer a 20% discount for annual subscriptions. Contact our sales team at sales@resconate.com to learn more about annual pricing.'
    },
    {
      id: 14,
      category: 'technical',
      question: 'Is my data secure?',
      answer: 'Absolutely. We use enterprise-grade security including SSL encryption, regular backups, and secure data centers. Your data is encrypted both in transit and at rest. We comply with Nigerian data protection regulations.'
    },
    {
      id: 15,
      category: 'technical',
      question: 'Can I access Resconate on mobile?',
      answer: 'Yes! Resconate is fully responsive and works on all devices including smartphones and tablets. We also offer a Progressive Web App (PWA) for offline access. You can access your HR dashboard from anywhere.'
    },
    {
      id: 16,
      category: 'technical',
      question: 'What if I need help or have questions?',
      answer: 'We offer multiple support channels: email support at support@resconate.com, WhatsApp chat (click the chat button), live chat on the website, and comprehensive documentation. Our support team is available Monday-Friday, 9 AM - 6 PM WAT.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="App">
      <Header />
      <main id="main-content" style={{ background: 'var(--dark-bg)', minHeight: '100vh' }}>
        <div className="help-center py-16 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-white mb-4">Help Center</h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Find answers to common questions or contact our support team
              </p>
            </div>

            {/* Search Bar */}
            <div className="card-ng mb-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for answers..."
                  className="w-full px-6 py-4 pl-12 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500 text-lg"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3">
                {faqCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      selectedCategory === category.id
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="space-y-4 mb-12">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map(faq => (
                  <FAQItem key={faq.id} faq={faq} />
                ))
              ) : (
                <div className="card-ng text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-white mb-2">No results found</h3>
                  <p className="text-gray-400">Try adjusting your search or category filter</p>
                </div>
              )}
            </div>

            {/* Contact Support */}
            <div className="card-ng bg-gradient-to-r from-green-500/20 to-blue-500/20 border-2 border-green-500/50">
              <div className="text-center py-8">
                <h3 className="text-3xl font-bold text-white mb-4">Still Need Help?</h3>
                <p className="text-gray-300 mb-6 text-lg">
                  Our support team is here to help you
                </p>
                <div className="flex justify-center space-x-4">
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '234XXXXXXXXXX'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ng-primary px-8 py-4 text-lg font-semibold"
                  >
                    💬 Chat on WhatsApp
                  </a>
                  <a
                    href="mailto:support@resconate.com"
                    className="btn-ng-secondary px-8 py-4 text-lg font-semibold"
                  >
                    📧 Email Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

const FAQItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="card-ng">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-start justify-between p-6"
      >
        <h3 className="text-xl font-semibold text-white pr-4">{faq.question}</h3>
        <svg
          className={`w-6 h-6 text-gray-400 flex-shrink-0 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-6">
          <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
        </div>
      )}
    </div>
  );
};

export default HelpCenter;

