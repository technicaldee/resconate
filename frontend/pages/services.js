import React from 'react';
import Header from '../src/components/Header';
import Services from '../src/components/Services';
import Footer from '../src/components/Footer';
import ScrollToTop from '../src/components/ScrollToTop';

const ServicesPage = () => {
  return (
    <div className="App">
      <Header />
      <main id="main-content">
        <Services />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default ServicesPage;

export const dynamic = 'force-dynamic';

