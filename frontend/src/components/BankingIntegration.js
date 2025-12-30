import React, { useState } from 'react';

const BankingIntegration = () => {
  const [selectedBank, setSelectedBank] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const nigerianBanks = [
    { id: 'gtb', name: 'GTBank', code: '058', color: 'from-orange-500 to-orange-700', logo: '🏦' },
    { id: 'access', name: 'Access Bank', code: '044', color: 'from-red-500 to-red-700', logo: '🏛️' },
    { id: 'zenith', name: 'Zenith Bank', code: '057', color: 'from-blue-500 to-blue-700', logo: '💼' },
    { id: 'uba', name: 'UBA', code: '033', color: 'from-green-500 to-green-700', logo: '🏢' }
  ];

  const payrollTransactions = [
    { id: 1, employee: 'John Doe', amount: 150000, bank: 'GTBank', account: '0123456789', status: 'completed', date: '2024-12-20' },
    { id: 2, employee: 'Jane Smith', amount: 120000, bank: 'Access Bank', account: '9876543210', status: 'pending', date: '2024-12-20' },
    { id: 3, employee: 'Mike Johnson', amount: 180000, bank: 'Zenith Bank', account: '5555555555', status: 'failed', date: '2024-12-19' }
  ];

  const handleBulkUpload = () => {
    // Simulate bulk payment upload
    alert('Bulk payment upload feature - CSV file upload would be implemented here');
  };

  const handleAccountVerification = async (bankId) => {
    setSelectedBank(bankId);
    // Account verification would be handled via API
    // The form below allows input of account number for verification
  };

  const handleVerifyAccount = async (accountNumber, accountName) => {
    if (!accountNumber || accountNumber.length < 10) {
      alert('Please enter a valid 10-digit account number');
      return;
    }

    try {
      const response = await fetch('/api/bank-accounts/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          accountNumber,
          bankCode: nigerianBanks.find(b => b.id === selectedBank)?.code,
          accountName
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`Account verified: ${data.accountName}`);
        setSelectedBank(null);
      } else {
        alert(`Verification failed: ${data.error}`);
      }
    } catch (error) {
      alert('Error verifying account. Please try again.');
    }
  };

  return (
    <div className="banking-integration p-6 space-y-6" style={{ background: 'var(--dark-bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-ng text-3xl text-white mb-2">Nigerian Banking Integration</h1>
          <p className="text-ng-body text-gray-400">Connect banks and manage payroll disbursements</p>
        </div>
        <button className="btn-ng-primary" onClick={handleBulkUpload}>
          <i className="fas fa-upload mr-2"></i>
          Bulk Payment Upload
        </button>
      </div>

      {/* Connected Banks */}
      <div className="card-ng">
        <h2 className="heading-ng text-xl text-white mb-6">Connected Banks</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {nigerianBanks.map((bank) => (
            <div
              key={bank.id}
              className="relative p-6 rounded-xl border-2 border-gray-700 hover:border-green-500 transition-all cursor-pointer group"
              onClick={() => handleAccountVerification(bank.id)}
            >
              <div className="text-5xl mb-3">{bank.logo}</div>
              <div className="text-white font-semibold mb-1">{bank.name}</div>
              <div className="text-gray-400 text-sm">Code: {bank.code}</div>
              <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-start">
            <span className="text-blue-400 mr-3">ℹ️</span>
            <div>
              <div className="text-blue-400 font-semibold mb-1">Bank Account Verification</div>
              <div className="text-gray-300 text-sm">
                Click on any bank to verify employee account numbers. This ensures accurate payroll disbursements.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payroll Disbursement Dashboard */}
      <div className="card-ng">
        <div className="flex items-center justify-between mb-6">
          <h2 className="heading-ng text-xl text-white">Payroll Disbursement</h2>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-gray-400 text-sm">Total This Month</div>
              <div className="text-white text-xl font-bold">
                <span className="currency">{(450000).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Status Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="text-green-400 text-2xl font-bold mb-1">12</div>
            <div className="text-gray-300 text-sm">Completed</div>
          </div>
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="text-amber-400 text-2xl font-bold mb-1">3</div>
            <div className="text-gray-300 text-sm">Pending</div>
          </div>
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="text-red-400 text-2xl font-bold mb-1">1</div>
            <div className="text-gray-300 text-sm">Failed</div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {payrollTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  transaction.status === 'completed' ? 'bg-green-500/20' :
                  transaction.status === 'pending' ? 'bg-amber-500/20' :
                  'bg-red-500/20'
                }`}>
                  <span className="text-2xl">
                    {transaction.status === 'completed' ? '✓' :
                     transaction.status === 'pending' ? '⏳' : '✗'}
                  </span>
                </div>
                <div>
                  <div className="text-white font-semibold">{transaction.employee}</div>
                  <div className="text-gray-400 text-sm">
                    {transaction.bank} • {transaction.account}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-white font-semibold">
                    <span className="currency">{transaction.amount.toLocaleString()}</span>
                  </div>
                  <div className={`badge-ng text-xs mt-1 ${
                    transaction.status === 'completed' ? 'badge-ng-success' :
                    transaction.status === 'pending' ? 'badge-ng-warning' :
                    'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {transaction.status}
                  </div>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Reconciliation */}
      <div className="card-ng">
        <h2 className="heading-ng text-xl text-white mb-4">Payment Reconciliation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <div className="text-gray-400 text-sm mb-2">Last Reconciliation</div>
            <div className="text-white font-semibold mb-1">December 20, 2024</div>
            <div className="text-green-400 text-sm">✓ All transactions matched</div>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <div className="text-gray-400 text-sm mb-2">Next Reconciliation</div>
            <div className="text-white font-semibold mb-1">January 5, 2025</div>
            <div className="text-gray-400 text-sm">Scheduled automatically</div>
          </div>
        </div>
        <button className="btn-ng-primary mt-4 w-full">
          <i className="fas fa-file-export mr-2"></i>
          Generate Reconciliation Report
        </button>
      </div>

      {/* Bank Account Verification Feature */}
      {selectedBank && (
        <div className="card-ng border-2 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="heading-ng text-lg text-white">
              Verify {nigerianBanks.find(b => b.id === selectedBank)?.name} Account
            </h3>
            <button
              onClick={() => setSelectedBank(null)}
              className="text-gray-400 hover:text-white"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Account Number</label>
              <input
                type="text"
                placeholder="Enter 10-digit account number"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Account Name</label>
              <input
                type="text"
                placeholder="Account holder name"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <button 
              className="btn-ng-primary w-full"
              onClick={() => {
                const accountNumber = document.querySelector('input[placeholder="Enter 10-digit account number"]')?.value;
                const accountName = document.querySelector('input[placeholder="Account holder name"]')?.value;
                handleVerifyAccount(accountNumber, accountName);
              }}
            >
              <i className="fas fa-check-circle mr-2"></i>
              Verify Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankingIntegration;

