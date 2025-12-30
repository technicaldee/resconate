import React from 'react';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import ScrollToTop from '../src/components/ScrollToTop';
import ComplianceCalendar from '../src/components/ComplianceCalendar';

export default function ComplianceCalendarPage() {
  return (
    <div className="App">
      <Header />
      <main id="main-content">
        <ComplianceCalendar />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export const dynamic = 'force-dynamic';

