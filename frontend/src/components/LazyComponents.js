/**
 * Lazy-loaded components for code splitting
 */

import React from 'react';

// Lazy load heavy components
export const LazyAdminDashboard = React.lazy(() => import('../../pages/admin-dashboard'));
export const LazyHRDashboard = React.lazy(() => import('../../pages/hr-dashboard'));
export const LazyEmployeePortal = React.lazy(() => import('../../pages/employee-portal'));
export const LazyAnalytics = React.lazy(() => import('../components/EnhancedAnalytics'));
export const LazyComplianceCalculators = React.lazy(() => import('../components/ComplianceCalculators'));
export const LazyBankingIntegration = React.lazy(() => import('../components/BankingIntegration'));
export const LazyPaymentIntegration = React.lazy(() => import('../components/PaymentIntegration'));
export const LazyReferralSystem = React.lazy(() => import('../components/ReferralSystem'));

// Loading component
export const LazyLoading = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-900">
    <div className="text-center">
      <i className="fas fa-spinner fa-spin text-4xl text-primary-500 mb-4"></i>
      <p className="text-gray-400">Loading...</p>
    </div>
  </div>
);

// Suspense wrapper
export const withSuspense = (Component) => {
  return (props) => (
    <React.Suspense fallback={<LazyLoading />}>
      <Component {...props} />
    </React.Suspense>
  );
};

