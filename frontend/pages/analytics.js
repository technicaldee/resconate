import React from 'react';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import ScrollToTop from '../src/components/ScrollToTop';
import EnhancedAnalytics from '../src/components/EnhancedAnalytics';

export default function AnalyticsPage() {
  return (
    <div className="App">
      <Header />
      <main id="main-content">
        <EnhancedAnalytics />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export const dynamic = 'force-dynamic';




