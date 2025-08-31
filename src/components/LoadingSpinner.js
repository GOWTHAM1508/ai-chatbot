import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  text = 'Loading...', 
  variant = 'primary',
  showText = true,
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16',
  };

  const variantClasses = {
    primary: 'border-primary-200 border-t-primary-500',
    secondary: 'border-secondary-200 border-t-secondary-500',
    neutral: 'border-neutral-200 border-t-neutral-500',
    white: 'border-white/20 border-t-white',
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        {/* Main spinner */}
        <div
          className={`
            ${sizeClasses[size]} 
            ${variantClasses[variant]}
            border-2 rounded-full animate-spin
          `}
          role="status"
          aria-label="Loading"
        />
        
        {/* Pulsing ring effect for larger sizes */}
        {(size === 'large' || size === 'xlarge') && (
          <div
            className={`
              ${sizeClasses[size]} 
              ${variantClasses[variant]}
              border-2 rounded-full absolute inset-0
              animate-ping opacity-20
            `}
          />
        )}
        
        {/* Center dot for larger sizes */}
        {(size === 'large' || size === 'xlarge') && (
          <div
            className={`
              w-2 h-2 
              ${variantClasses[variant].split(' ')[1].replace('border-t-', 'bg-')}
              rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
              animate-pulse
            `}
          />
        )}
      </div>
      
      {/* Loading text */}
      {showText && text && (
        <div className="mt-4 text-center">
          <p className={`${textSizes[size]} text-neutral-600 dark:text-neutral-400 font-medium`}>
            {text}
          </p>
          
          {/* Animated dots */}
          <div className="flex justify-center mt-2 space-x-1">
            <div className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
      
      {/* Screen reader text */}
      <span className="sr-only">Loading, please wait</span>
    </div>
  );
};

// Full screen loading overlay
export const LoadingOverlay = ({ 
  text = 'Loading your AI companion...',
  variant = 'primary',
  className = '' 
}) => {
  return (
    <div className={`fixed inset-0 bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-sm z-50 flex items-center justify-center ${className}`}>
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-2xl border border-neutral-200 dark:border-neutral-700">
        <LoadingSpinner 
          size="xlarge" 
          text={text} 
          variant={variant}
          showText={true}
        />
      </div>
    </div>
  );
};

// Inline loading spinner
export const InlineSpinner = ({ 
  size = 'small', 
  variant = 'primary',
  className = '' 
}) => {
  return (
    <LoadingSpinner 
      size={size} 
      variant={variant}
      showText={false}
      className={className}
    />
  );
};

// Page loading spinner
export const PageSpinner = ({ 
  text = 'Preparing your experience...',
  variant = 'primary',
  className = '' 
}) => {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 ${className}`}>
      <div className="text-center">
        {/* Logo or icon */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">🤖</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Next-Gen AI Chatbot
          </h1>
        </div>
        
        {/* Loading spinner */}
        <LoadingSpinner 
          size="large" 
          text={text} 
          variant={variant}
          showText={true}
        />
        
        {/* Additional info */}
        <div className="mt-8 text-sm text-neutral-500 dark:text-neutral-400">
          <p>Powered by advanced AI technology</p>
          <p className="mt-1">Creating a unique conversational experience</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

