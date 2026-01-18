import React, { useEffect } from 'react';
import Head from 'next/head';
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
      <Head>
        <title>Resconate | Digital Human Resources Operations</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Resconate - Transform your HR operations and digital products with our modern ecosystem." />
      </Head>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}

export default MyApp;
