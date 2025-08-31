import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    // Chat settings
    chat: {
      autoScroll: true,
      showTimestamps: true,
      messageGrouping: true,
      typingIndicator: true,
      soundEffects: false,
      notificationSound: 'default',
    },
    
    // AI behavior settings
    ai: {
      responseSpeed: 'normal', // slow, normal, fast
      personalityLock: false,
      contextMemory: 10, // number of messages to remember
      creativeMode: false,
      professionalMode: false,
      empathyLevel: 0.8,
      humorLevel: 0.6,
    },
    
    // Interface settings
    interface: {
      compactMode: false,
      sidebarCollapsed: false,
      messageBubbleStyle: 'rounded', // rounded, square, minimal
      colorScheme: 'auto', // auto, light, dark
      fontSize: 'medium', // small, medium, large, xlarge
      lineHeight: 'comfortable', // tight, comfortable, relaxed
      showAvatars: true,
      showTypingSpeed: false,
    },
    
    // Accessibility settings
    accessibility: {
      highContrast: false,
      dyslexiaFriendly: false,
      reducedMotion: false,
      largeText: false,
      screenReader: false,
      keyboardNavigation: true,
      focusIndicators: true,
      colorBlindSupport: false,
    },
    
    // Privacy settings
    privacy: {
      dataRetention: 30, // days
      analytics: false,
      telemetry: false,
      conversationSharing: false,
      autoBackup: true,
      encryption: true,
      anonymousMode: false,
    },
    
    // Performance settings
    performance: {
      lowBandwidthMode: false,
      imageCompression: true,
      cacheSize: 100, // MB
      autoCleanup: true,
      backgroundSync: true,
      offlineMode: false,
    },
    
    // Integration settings
    integrations: {
      calendar: false,
      email: false,
      crm: false,
      payment: false,
      smartHome: false,
      socialMedia: false,
      weather: false,
      news: false,
    },
    
    // Language and localization
    localization: {
      language: 'en',
      region: 'US',
      timezone: 'auto',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      currency: 'USD',
      units: 'imperial', // imperial, metric
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('chatbotSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
        toast.error('Failed to load saved settings');
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    if (hasUnsavedChanges) {
      localStorage.setItem('chatbotSettings', JSON.stringify(settings));
      setHasUnsavedChanges(false);
    }
  }, [settings, hasUnsavedChanges]);

  // Update a specific setting
  const updateSetting = useCallback((category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Update multiple settings at once
  const updateMultipleSettings = useCallback((updates) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      Object.entries(updates).forEach(([category, categoryUpdates]) => {
        newSettings[category] = {
          ...newSettings[category],
          ...categoryUpdates,
        };
      });
      return newSettings;
    });
    setHasUnsavedChanges(true);
  }, []);

  // Reset settings to defaults
  const resetToDefaults = useCallback(() => {
    const defaultSettings = {
      chat: {
        autoScroll: true,
        showTimestamps: true,
        messageGrouping: true,
        typingIndicator: true,
        soundEffects: false,
        notificationSound: 'default',
      },
      ai: {
        responseSpeed: 'normal',
        personalityLock: false,
        contextMemory: 10,
        creativeMode: false,
        professionalMode: false,
        empathyLevel: 0.8,
        humorLevel: 0.6,
      },
      interface: {
        compactMode: false,
        sidebarCollapsed: false,
        messageBubbleStyle: 'rounded',
        colorScheme: 'auto',
        fontSize: 'medium',
        lineHeight: 'comfortable',
        showAvatars: true,
        showTypingSpeed: false,
      },
      accessibility: {
        highContrast: false,
        dyslexiaFriendly: false,
        reducedMotion: false,
        largeText: false,
        screenReader: false,
        keyboardNavigation: true,
        focusIndicators: true,
        colorBlindSupport: false,
      },
      privacy: {
        dataRetention: 30,
        analytics: false,
        telemetry: false,
        conversationSharing: false,
        autoBackup: true,
        encryption: true,
        anonymousMode: false,
      },
      performance: {
        lowBandwidthMode: false,
        imageCompression: true,
        cacheSize: 100,
        autoCleanup: true,
        backgroundSync: true,
        offlineMode: false,
      },
      integrations: {
        calendar: false,
        email: false,
        crm: false,
        payment: false,
        smartHome: false,
        socialMedia: false,
        weather: false,
        news: false,
      },
      localization: {
        language: 'en',
        region: 'US',
        timezone: 'auto',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        currency: 'USD',
        units: 'imperial',
      },
    };

    setSettings(defaultSettings);
    setHasUnsavedChanges(true);
    toast.success('Settings reset to defaults');
  }, []);

  // Export settings
  const exportSettings = useCallback(() => {
    const exportData = {
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chatbot-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Settings exported successfully');
  }, [settings]);

  // Import settings
  const importSettings = useCallback(async (file) => {
    setIsLoading(true);
    
    try {
      const text = await file.text();
      const imported = JSON.parse(text);
      
      if (imported.settings && imported.version) {
        setSettings(imported.settings);
        setHasUnsavedChanges(true);
        toast.success('Settings imported successfully');
      } else {
        throw new Error('Invalid settings file format');
      }
    } catch (error) {
      console.error('Failed to import settings:', error);
      toast.error('Failed to import settings. Please check the file format.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Apply accessibility settings
  const applyAccessibilitySettings = useCallback(() => {
    const { accessibility } = settings;
    const root = document.documentElement;
    
    // Apply high contrast
    if (accessibility.highContrast) {
      root.classList.add('high-contrast-mode');
    } else {
      root.classList.remove('high-contrast-mode');
    }
    
    // Apply dyslexia-friendly font
    if (accessibility.dyslexiaFriendly) {
      root.classList.add('dyslexia-mode');
    } else {
      root.classList.remove('dyslexia-mode');
    }
    
    // Apply reduced motion
    if (accessibility.reducedMotion) {
      root.style.setProperty('--reduced-motion', 'reduce');
    } else {
      root.style.removeProperty('--reduced-motion');
    }
    
    // Apply large text
    if (accessibility.largeText) {
      root.style.setProperty('--text-scale', '1.2');
    } else {
      root.style.removeProperty('--text-scale');
    }
    
    // Apply color blind support
    if (accessibility.colorBlindSupport) {
      root.classList.add('colorblind-support');
    } else {
      root.classList.remove('colorblind-support');
    }
  }, [settings.accessibility]);

  // Apply accessibility settings when they change
  useEffect(() => {
    applyAccessibilitySettings();
  }, [applyAccessibilitySettings]);

  // Get setting value with fallback
  const getSetting = useCallback((category, key, fallback = null) => {
    return settings[category]?.[key] ?? fallback;
  }, [settings]);

  // Check if a setting is enabled
  const isSettingEnabled = useCallback((category, key) => {
    return Boolean(settings[category]?.[key]);
  }, [settings]);

  // Save settings immediately
  const saveSettings = useCallback(() => {
    localStorage.setItem('chatbotSettings', JSON.stringify(settings));
    setHasUnsavedChanges(false);
    toast.success('Settings saved successfully');
  }, [settings]);

  // Discard unsaved changes
  const discardChanges = useCallback(() => {
    const savedSettings = localStorage.getItem('chatbotSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        setHasUnsavedChanges(false);
        toast.success('Changes discarded');
      } catch (error) {
        console.error('Failed to restore saved settings:', error);
        toast.error('Failed to restore saved settings');
      }
    }
  }, []);

  const value = {
    // State
    settings,
    isLoading,
    hasUnsavedChanges,
    
    // Actions
    updateSetting,
    updateMultipleSettings,
    resetToDefaults,
    exportSettings,
    importSettings,
    saveSettings,
    discardChanges,
    
    // Utilities
    getSetting,
    isSettingEnabled,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

