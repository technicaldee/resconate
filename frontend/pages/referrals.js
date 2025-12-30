import React from 'react';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import ScrollToTop from '../src/components/ScrollToTop';
import ReferralSystem from '../src/components/ReferralSystem';

export default function ReferralsPage() {
  return (
    <div className="App">
      <Header />
      <main id="main-content">
        <ReferralSystem />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export const dynamic = 'force-dynamic';




