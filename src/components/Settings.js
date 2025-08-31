import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Palette,
  Accessibility,
  Shield,
  Zap,
  User,
  Save,
  RotateCcw,
  Download,
  Upload,
  Check,
  X
} from 'lucide-react';

const Settings = () => {
  const { theme, toggleTheme, accessibilityMode, updateAccessibilityMode } = useTheme();
  const { 
    settings, 
    updateSetting, 
    resetToDefaults, 
    exportSettings, 
    importSettings,
    hasUnsavedChanges,
    saveSettings,
    discardChanges
  } = useSettings();
  const { user, isAuthenticated, signOut, userProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState('appearance');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
    { id: 'chat', label: 'Chat', icon: Zap },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'account', label: 'Account', icon: User },
  ];

  const handleSettingChange = (category, key, value) => {
    updateSetting(category, key, value);
  };

  const handleAccessibilityChange = (key, value) => {
    updateAccessibilityMode({ [key]: value });
  };

  const handleImportSettings = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await importSettings(file);
    }
  };

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Theme Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">
              Color Scheme
            </label>
            <div className="flex space-x-2">
              {['auto', 'light', 'dark'].map((scheme) => (
                <button
                  key={scheme}
                  onClick={() => handleSettingChange('interface', 'colorScheme', scheme)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    settings.interface.colorScheme === scheme
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                  }`}
                >
                  {scheme === 'auto' && <Monitor className="w-4 h-4 inline mr-2" />}
                  {scheme === 'light' && <Sun className="w-4 h-4 inline mr-2" />}
                  {scheme === 'dark' && <Moon className="w-4 h-4 inline mr-2" />}
                  {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">
              Font Size
            </label>
            <select
              value={settings.interface.fontSize}
              onChange={(e) => handleSettingChange('interface', 'fontSize', e.target.value)}
              className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="xlarge">Extra Large</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccessibilityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Accessibility Options
        </h3>
        <div className="space-y-3">
          {[
            { key: 'highContrast', label: 'High Contrast Mode', description: 'Increase contrast for better visibility' },
            { key: 'dyslexiaFriendly', label: 'Dyslexia-Friendly Font', description: 'Use OpenDyslexic font family' },
            { key: 'largeText', label: 'Large Text', description: 'Increase text size for better readability' },
            { key: 'reducedMotion', label: 'Reduced Motion', description: 'Minimize animations and transitions' },
          ].map(({ key, label, description }) => (
            <label key={key} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={accessibilityMode[key]}
                onChange={(e) => handleAccessibilityChange(key, e.target.checked)}
                className="mt-1 w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              />
              <div>
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {label}
                </span>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderChatTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Chat Behavior
        </h3>
        <div className="space-y-3">
          {[
            { key: 'autoScroll', label: 'Auto-scroll to Bottom', description: 'Automatically scroll to new messages' },
            { key: 'showTimestamps', label: 'Show Timestamps', description: 'Display message timestamps' },
            { key: 'typingIndicator', label: 'Typing Indicator', description: 'Show when AI is typing' },
            { key: 'soundEffects', label: 'Sound Effects', description: 'Play sounds for notifications' },
          ].map(({ key, label, description }) => (
            <label key={key} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.chat[key]}
                onChange={(e) => handleSettingChange('chat', key, e.target.checked)}
                className="mt-1 w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              />
              <div>
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {label}
                </span>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Privacy & Security
        </h3>
        <div className="space-y-3">
          {[
            { key: 'analytics', label: 'Analytics', description: 'Allow anonymous usage analytics' },
            { key: 'autoBackup', label: 'Auto Backup', description: 'Automatically backup conversations' },
            { key: 'encryption', label: 'Encryption', description: 'Encrypt all messages and data' },
          ].map(({ key, label, description }) => (
            <label key={key} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy[key]}
                onChange={(e) => handleSettingChange('privacy', key, e.target.checked)}
                className="mt-1 w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              />
              <div>
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {label}
                </span>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAccountTab = () => (
    <div className="space-y-6">
      {isAuthenticated ? (
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Account Information
          </h3>
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
            <p className="font-medium text-neutral-900 dark:text-neutral-100">
              {userProfile.username || 'User'}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {userProfile.email || 'user@example.com'}
            </p>
          </div>
          <button
            onClick={signOut}
            className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Sign in to your account
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">
            Create an account to save your preferences
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Sign In / Sign Up
          </button>
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appearance':
        return renderAppearanceTab();
      case 'accessibility':
        return renderAccessibilityTab();
      case 'chat':
        return renderChatTab();
      case 'privacy':
        return renderPrivacyTab();
      case 'account':
        return renderAccountTab();
      default:
        return renderAppearanceTab();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Settings
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Customize your AI chatbot experience
          </p>
        </div>

        {/* Settings Container */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar */}
            <div className="lg:w-64 border-b lg:border-b-0 lg:border-r border-neutral-200 dark:border-neutral-700">
              <nav className="p-4">
                <ul className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <li key={tab.id}>
                        <button
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === tab.id
                              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{tab.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              {renderTabContent()}

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700 flex flex-wrap items-center justify-between gap-4">
                <div className="flex space-x-3">
                  <button
                    onClick={resetToDefaults}
                    className="px-4 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors flex items-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset to Defaults</span>
                  </button>
                  
                  <button
                    onClick={exportSettings}
                    className="px-4 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Settings</span>
                  </button>
                  
                  <label className="px-4 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors flex items-center space-x-2 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Import Settings</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportSettings}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex space-x-3">
                  {hasUnsavedChanges && (
                    <button
                      onClick={discardChanges}
                      className="px-4 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Discard Changes</span>
                    </button>
                  )}
                  
                  <button
                    onClick={saveSettings}
                    disabled={!hasUnsavedChanges}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                      hasUnsavedChanges
                        ? 'bg-primary-500 text-white hover:bg-primary-600'
                        : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Sign In
              </h3>
              <button
                onClick={() => setShowAuthModal(false)}
                className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
