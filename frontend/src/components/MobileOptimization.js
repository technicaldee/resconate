import React, { useState, useEffect } from 'react';

// PWA Install Prompt
export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 z-50 shadow-lg">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div>
          <div className="font-semibold mb-1">Install Resconate App</div>
          <div className="text-sm text-green-100">Get offline access and faster performance</div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowInstallPrompt(false)}
            className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            Later
          </button>
          <button
            onClick={handleInstall}
            className="px-4 py-2 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
};

// Mobile Menu
export const MobileMenu = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 md:hidden">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="text-white font-bold text-xl">Menu</div>
          <button onClick={onClose} className="text-white text-2xl">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

// Offline Indicator
export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-3 text-center z-50">
      <div className="flex items-center justify-center space-x-2">
        <i className="fas fa-wifi"></i>
        <span>You're offline. Some features may be limited.</span>
      </div>
    </div>
  );
};

// Performance Optimizer for Slow Connections
export const SlowConnectionOptimizer = () => {
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      setConnectionType(connection?.effectiveType || 'unknown');

      const updateConnection = () => {
        setConnectionType(connection?.effectiveType || 'unknown');
      };
      connection?.addEventListener('change', updateConnection);
      return () => connection?.removeEventListener('change', updateConnection);
    }
  }, []);

  const isSlowConnection = connectionType === 'slow-2g' || connectionType === '2g';

  if (!isSlowConnection) return null;

  return (
    <div className="fixed top-16 left-0 right-0 bg-amber-600 text-white p-2 text-center z-40 text-sm">
      <i className="fas fa-info-circle mr-2"></i>
      Slow connection detected. Optimizing for better performance...
    </div>
  );
};

// SMS Notification Settings
export const SMSNotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    payslip: true,
    leaveApproval: true,
    paymentDue: true,
    complianceDeadline: true
  });

  return (
    <div className="card-ng">
      <h3 className="heading-ng text-xl text-white mb-4">SMS Notifications</h3>
      <div className="space-y-3">
        {Object.entries(notifications).map(([key, value]) => (
          <label key={key} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800/70">
            <div>
              <div className="text-white font-medium capitalize mb-1">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="text-gray-400 text-sm">Receive SMS for {key}</div>
            </div>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
              className="w-5 h-5 text-green-500 rounded"
            />
          </label>
        ))}
      </div>
    </div>
  );
};

