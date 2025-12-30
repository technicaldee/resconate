import React, { useState } from 'react';

const ReferralSystem = () => {
  const [referralLink, setReferralLink] = useState('https://resconate.com/signup?ref=ABC123XYZ');
  const [copied, setCopied] = useState(false);

  const referrals = [
    { name: 'John Doe', email: 'john@example.com', status: 'signed_up', reward: '1 month free', date: '2024-12-15' },
    { name: 'Jane Smith', email: 'jane@example.com', status: 'active', reward: '2 months free', date: '2024-12-10' },
    { name: 'Mike Johnson', email: 'mike@example.com', status: 'pending', reward: 'Pending', date: '2024-12-20' }
  ];

  const stats = {
    totalReferrals: 12,
    activeUsers: 8,
    pendingRewards: 2,
    totalEarned: '3 months free'
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="referral-system p-6" style={{ background: 'var(--dark-bg)', minHeight: '100vh' }}>
      <div className="mb-8">
        <h1 className="heading-ng text-3xl text-white mb-2">Referral Program</h1>
        <p className="text-ng-body text-gray-400">Earn free months by referring friends and colleagues</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card-ng text-center">
          <div className="text-3xl font-bold text-green-400 mb-1">{stats.totalReferrals}</div>
          <div className="text-gray-400 text-sm">Total Referrals</div>
        </div>
        <div className="card-ng text-center">
          <div className="text-3xl font-bold text-blue-400 mb-1">{stats.activeUsers}</div>
          <div className="text-gray-400 text-sm">Active Users</div>
        </div>
        <div className="card-ng text-center">
          <div className="text-3xl font-bold text-amber-400 mb-1">{stats.pendingRewards}</div>
          <div className="text-gray-400 text-sm">Pending</div>
        </div>
        <div className="card-ng text-center">
          <div className="text-3xl font-bold text-purple-400 mb-1">{stats.totalEarned}</div>
          <div className="text-gray-400 text-sm">Earned</div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="card-ng mb-8">
        <h2 className="heading-ng text-xl text-white mb-4">Your Referral Link</h2>
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
          />
          <button
            onClick={handleCopyLink}
            className="btn-ng-primary px-6"
          >
            {copied ? (
              <>
                <i className="fas fa-check mr-2"></i>
                Copied!
              </>
            ) : (
              <>
                <i className="fas fa-copy mr-2"></i>
                Copy
              </>
            )}
          </button>
        </div>
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="text-green-400 font-semibold mb-2">🎁 Referral Rewards</div>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• You get 1 month free when they sign up</li>
            <li>• You get 2 months free when they subscribe</li>
            <li>• They get 1 month free on signup</li>
            <li>• Maximum 12 months free per year</li>
          </ul>
        </div>
      </div>

      {/* Share Options */}
      <div className="card-ng mb-8">
        <h2 className="heading-ng text-xl text-white mb-4">Share Your Link</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'WhatsApp', icon: '💬', color: 'from-green-500 to-green-700' },
            { name: 'Email', icon: '📧', color: 'from-blue-500 to-blue-700' },
            { name: 'Twitter', icon: '🐦', color: 'from-sky-500 to-sky-700' },
            { name: 'LinkedIn', icon: '💼', color: 'from-blue-600 to-blue-800' }
          ].map((platform) => (
            <button
              key={platform.name}
              className={`p-4 rounded-xl bg-gradient-to-br ${platform.color} text-white hover:opacity-90 transition-opacity`}
            >
              <div className="text-3xl mb-2">{platform.icon}</div>
              <div className="font-semibold text-sm">{platform.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Referral History */}
      <div className="card-ng">
        <h2 className="heading-ng text-xl text-white mb-6">Referral History</h2>
        <div className="space-y-3">
          {referrals.map((referral, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {referral.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-semibold">{referral.name}</div>
                  <div className="text-gray-400 text-sm">{referral.email}</div>
                  <div className="text-gray-500 text-xs">{referral.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`badge-ng mb-2 ${
                  referral.status === 'active' ? 'badge-ng-success' :
                  referral.status === 'signed_up' ? 'badge-ng-warning' :
                  'bg-gray-500/20 text-gray-400 border-gray-500/30'
                }`}>
                  {referral.status.replace('_', ' ')}
                </div>
                <div className="text-green-400 font-semibold text-sm">{referral.reward}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shareable Graphics */}
      <div className="card-ng mt-8">
        <h2 className="heading-ng text-xl text-white mb-4">Shareable Graphics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-500 transition-colors">
              <div className="text-center">
                <div className="text-4xl mb-2">📱</div>
                <div className="text-white text-sm font-medium">Graphic {i}</div>
                <div className="text-gray-400 text-xs mt-1">Download</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReferralSystem;

