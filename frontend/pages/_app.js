import React from 'react';
import { AppProps } from 'next/app';
import ErrorBoundary from '../src/components/ErrorBoundary';
import '../src/styles/index.css';

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}

export default MyApp;
