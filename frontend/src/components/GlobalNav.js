import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getToken, getEmployeeToken } from '../utils/api';

const GlobalNav = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by checking for any token
    const adminToken = getToken();
    const employeeToken = getEmployeeToken();
    setIsLoggedIn(!!(adminToken || employeeToken));
  }, [router.pathname]);

  const isActive = (path) => {
    return router.pathname === path;
  };

  return (
    <header className="global-nav">
      <div className="global-nav__container">
        <Link href="/" className="global-nav__brand">
          <img src="/resconate-logo.png" alt="Resconate Logo" />
          <span>Resconate HR Suite</span>
        </Link>
        <nav className="global-nav__links" aria-label="Resconate navigation">
          <Link href="/#home" className="global-nav__link">Main Site</Link>
          {isLoggedIn ? (
            <>
              <Link href="/hr-dashboard" className={`global-nav__link ${isActive('/hr-dashboard') ? 'active' : ''}`}>Dashboard</Link>
              <Link href="/analytics" className={`global-nav__link ${isActive('/analytics') ? 'active' : ''}`}>Analytics</Link>
              <Link href="/payment" className={`global-nav__link ${isActive('/payment') ? 'active' : ''}`}>Payment</Link>
              <Link href="/banking" className={`global-nav__link ${isActive('/banking') ? 'active' : ''}`}>Banking</Link>
              <Link href="/compliance-calculators" className={`global-nav__link ${isActive('/compliance-calculators') ? 'active' : ''}`}>Compliance</Link>
              <Link href="/resources" className={`global-nav__link ${isActive('/resources') ? 'active' : ''}`}>Resources</Link>
              <Link href="/help" className={`global-nav__link ${isActive('/help') ? 'active' : ''}`}>Help</Link>
            </>
          ) : (
            <Link href="/hr-login" className={`global-nav__link ${isActive('/hr-login') ? 'active' : ''}`}>HR Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default GlobalNav;


