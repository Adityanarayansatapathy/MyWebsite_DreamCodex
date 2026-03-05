import React from 'react';
import { DreamCodexWebsite } from './components/DreamCodexWebsite';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from './components/ui/sonner';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <DreamCodexWebsite />
        <Toaster 
          position="top-right"
          expand={true}
          richColors={true}
          closeButton={true}
        />
      </ThemeProvider>
    </ErrorBoundary>
  );
}