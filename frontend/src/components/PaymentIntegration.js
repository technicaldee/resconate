import React, { useState } from 'react';

const PaymentIntegration = () => {
  const [selectedProvider, setSelectedProvider] = useState('paystack');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [subscriptionStatus, setSubscriptionStatus] = useState('active');
  const [showInvoice, setShowInvoice] = useState(false);

  const paymentProviders = [
    { id: 'paystack', name: 'Paystack', icon: '💳', color: 'from-green-500 to-green-700' },
    { id: 'flutterwave', name: 'Flutterwave', icon: '🌊', color: 'from-blue-500 to-purple-600' }
  ];

  const paymentMethods = [
    { id: 'card', name: 'Card Payment', icon: '💳' },
    { id: 'bank', name: 'Bank Transfer', icon: '🏦' },
    { id: 'ussd', name: 'USSD', icon: '📱' }
  ];

  const invoices = [
    { id: 1, date: '2024-12-01', amount: 50000, status: 'paid', plan: 'Premium' },
    { id: 2, date: '2024-11-01', amount: 50000, status: 'paid', plan: 'Premium' },
    { id: 3, date: '2024-10-01', amount: 50000, status: 'paid', plan: 'Premium' }
  ];

  const upcomingPayment = {
    date: '2025-01-01',
    amount: 50000,
    daysUntil: 8
  };

  return (
    <div className="payment-integration p-6 space-y-6" style={{ background: 'var(--dark-bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-ng text-3xl text-white mb-2">Payment & Billing</h1>
          <p className="text-ng-body text-gray-400">Manage subscriptions and payment methods</p>
        </div>
        <div className="badge-ng badge-ng-success">
          <span className="mr-2">●</span>
          Auto-renewal Active
        </div>
      </div>

      {/* Payment Provider Selection */}
      <div className="card-ng">
        <h2 className="heading-ng text-xl text-white mb-4">Payment Provider</h2>
        <div className="grid grid-cols-2 gap-4">
          {paymentProviders.map((provider) => (
            <button
              key={provider.id}
              onClick={() => setSelectedProvider(provider.id)}
              className={`p-6 rounded-xl border-2 transition-all ${
                selectedProvider === provider.id
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="text-4xl mb-2">{provider.icon}</div>
              <div className="text-white font-semibold">{provider.name}</div>
              {selectedProvider === provider.id && (
                <div className="mt-2 text-green-400 text-sm">✓ Selected</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="card-ng">
        <h2 className="heading-ng text-xl text-white mb-4">Payment Methods</h2>
        <div className="grid grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                paymentMethod === method.id
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="text-2xl mb-2">{method.icon}</div>
              <div className="text-white text-sm font-medium">{method.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Subscription Status */}
      <div className="card-ng">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="heading-ng text-xl text-white mb-2">Current Subscription</h2>
            <p className="text-gray-400">Premium Plan - ₦50,000/month</p>
          </div>
          <div className="badge-ng badge-ng-success">Active</div>
        </div>

        {/* Upcoming Payment Alert */}
        {upcomingPayment.daysUntil <= 7 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-amber-400 font-semibold mb-1">
                  Payment Due in {upcomingPayment.daysUntil} days
                </div>
                <div className="text-gray-300 text-sm">
                  Next payment: {new Date(upcomingPayment.date).toLocaleDateString()} - 
                  <span className="currency ml-1">{upcomingPayment.amount.toLocaleString()}</span>
                </div>
              </div>
              <button className="btn-ng-primary">Pay Now</button>
            </div>
          </div>
        )}

        {/* Auto-renewal Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div>
            <div className="text-white font-semibold">Auto-renewal</div>
            <div className="text-gray-400 text-sm">Automatically charge your payment method</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={subscriptionStatus === 'active'}
              onChange={(e) => setSubscriptionStatus(e.target.checked ? 'active' : 'paused')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
      </div>

      {/* Payment History */}
      <div className="card-ng">
        <div className="flex items-center justify-between mb-6">
          <h2 className="heading-ng text-xl text-white">Payment History</h2>
          <button
            onClick={() => setShowInvoice(!showInvoice)}
            className="text-green-400 hover:text-green-300 text-sm font-medium"
          >
            {showInvoice ? 'Hide' : 'View All'} Invoices
          </button>
        </div>

        <div className="space-y-3">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-green-400 text-xl">📄</span>
                </div>
                <div>
                  <div className="text-white font-semibold">{invoice.plan} Plan</div>
                  <div className="text-gray-400 text-sm">
                    {new Date(invoice.date).toLocaleDateString('en-NG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-white font-semibold">
                    <span className="currency">{invoice.amount.toLocaleString()}</span>
                  </div>
                  <div className="badge-ng badge-ng-success text-xs mt-1">
                    {invoice.status}
                  </div>
                </div>
                <button className="text-green-400 hover:text-green-300">
                  <i className="fas fa-download"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Reminders */}
      <div className="card-ng">
        <h2 className="heading-ng text-xl text-white mb-4">Payment Reminders</h2>
        <div className="space-y-3">
          {[7, 3, 1].map((days) => (
            <label key={days} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800/70">
              <div>
                <div className="text-white font-medium">{days} days before due date</div>
                <div className="text-gray-400 text-sm">Email & SMS notification</div>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-green-500 rounded" />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentIntegration;

