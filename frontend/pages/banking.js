import React from 'react';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import ScrollToTop from '../src/components/ScrollToTop';
import BankingIntegration from '../src/components/BankingIntegration';

export default function BankingPage() {
  return (
    <div className="App">
      <Header />
      <main id="main-content">
        <BankingIntegration />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export const dynamic = 'force-dynamic';




