import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [accessibilityMode, setAccessibilityMode] = useState({
    highContrast: false,
    dyslexiaFriendly: false,
    reducedMotion: false,
    largeText: false,
  });

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedAccessibility = localStorage.getItem('accessibilitySettings');
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
    
    if (savedAccessibility) {
      try {
        setAccessibilityMode(JSON.parse(savedAccessibility));
      } catch (error) {
        console.error('Failed to parse accessibility settings:', error);
      }
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Apply accessibility settings
  useEffect(() => {
    const root = document.documentElement;
    
    if (accessibilityMode.highContrast) {
      root.classList.add('high-contrast-mode');
    } else {
      root.classList.remove('high-contrast-mode');
    }
    
    if (accessibilityMode.dyslexiaFriendly) {
      root.classList.add('dyslexia-mode');
    } else {
      root.classList.remove('dyslexia-mode');
    }
    
    if (accessibilityMode.reducedMotion) {
      root.style.setProperty('--reduced-motion', 'reduce');
    } else {
      root.style.removeProperty('--reduced-motion');
    }
    
    if (accessibilityMode.largeText) {
      root.style.setProperty('--text-scale', '1.2');
    } else {
      root.style.removeProperty('--text-scale');
    }
    
    localStorage.setItem('accessibilitySettings', JSON.stringify(accessibilityMode));
  }, [accessibilityMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const updateAccessibilityMode = (newSettings) => {
    setAccessibilityMode(prev => ({ ...prev, ...newSettings }));
  };

  const resetAccessibilitySettings = () => {
    setAccessibilityMode({
      highContrast: false,
      dyslexiaFriendly: false,
      reducedMotion: false,
      largeText: false,
    });
  };

  const value = {
    theme,
    accessibilityMode,
    toggleTheme,
    updateAccessibilityMode,
    resetAccessibilitySettings,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

