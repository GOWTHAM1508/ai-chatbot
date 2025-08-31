import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatProvider } from './contexts/ChatContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import Settings from './components/Settings';
import Welcome from './components/Welcome';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simulate initialization time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check for saved preferences
        const savedTheme = localStorage.getItem('theme');
        const savedSettings = localStorage.getItem('chatbotSettings');
        
        if (savedTheme) {
          document.documentElement.setAttribute('data-theme', savedTheme);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('App initialization failed:', err);
        setError(err);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Handle global errors
  const handleGlobalError = useCallback((error, errorInfo) => {
    console.error('Global error:', error, errorInfo);
    setError(error);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🚨</div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Something went wrong
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Our AI is having a moment. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary onError={handleGlobalError}>
      <ThemeProvider>
        <SettingsProvider>
          <AuthProvider>
            <ChatProvider>
              <Router>
                <div className="App min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Welcome />} />
                      <Route path="/chat" element={<ChatInterface />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                  
                  {/* Global toast notifications */}
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: 'var(--neutral-100)',
                        color: 'var(--neutral-900)',
                        border: '1px solid var(--neutral-200)',
                      },
                      success: {
                        iconTheme: {
                          primary: 'var(--success)',
                          secondary: 'var(--neutral-50)',
                        },
                      },
                      error: {
                        iconTheme: {
                          primary: 'var(--error)',
                          secondary: 'var(--neutral-50)',
                        },
                      },
                    }}
                  />
                </div>
              </Router>
            </ChatProvider>
          </AuthProvider>
        </SettingsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

