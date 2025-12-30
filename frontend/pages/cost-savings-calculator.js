import React from 'react';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import ScrollToTop from '../src/components/ScrollToTop';
import CostSavingsCalculator from '../src/components/CostSavingsCalculator';

export default function CostSavingsCalculatorPage() {
  return (
    <div className="App">
      <Header />
      <main id="main-content">
        <CostSavingsCalculator />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export const dynamic = 'force-dynamic';

