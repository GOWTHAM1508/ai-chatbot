import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const TypingIndicator = () => {
  const { theme, accessibilityMode } = useTheme();

  return (
    <div className="flex items-start space-x-3 mb-2">
      {/* AI Avatar */}
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center">
        <div className="w-4 h-4 text-white">🤖</div>
      </div>

      {/* Typing Indicator */}
      <div className="flex-1 min-w-0">
        {/* AI Label */}
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            AI Assistant
          </span>
        </div>

        {/* Typing Bubble */}
        <div className="inline-block p-3 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <div 
                className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <div 
                className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <div 
                className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
            <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-2">
              AI is thinking...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;

