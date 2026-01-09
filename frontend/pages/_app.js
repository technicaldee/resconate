import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import ErrorBoundary from '../src/components/ErrorBoundary';
import '../src/styles/index.css';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Register service worker for PWA
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered:', registration);
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}

export default MyApp;
