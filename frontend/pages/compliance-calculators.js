import React from 'react';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import ScrollToTop from '../src/components/ScrollToTop';
import ComplianceCalculatorsEnhanced from '../src/components/ComplianceCalculatorsEnhanced';

export default function ComplianceCalculatorsPage() {
  return (
    <div className="App">
      <Header />
      <main id="main-content">
        <ComplianceCalculatorsEnhanced />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export const dynamic = 'force-dynamic';




