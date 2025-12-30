import React from 'react';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import ScrollToTop from '../src/components/ScrollToTop';
import PaymentIntegration from '../src/components/PaymentIntegration';

export default function PaymentPage() {
  return (
    <div className="App">
      <Header />
      <main id="main-content">
        <PaymentIntegration />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export const dynamic = 'force-dynamic';




