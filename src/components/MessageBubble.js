import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  MoreVertical, 
  Pin, 
  Download,
  User,
  Bot,
  FileText,
  Image,
  Video,
  Music,
  File,
  Check
} from 'lucide-react';

const MessageBubble = ({ 
  message, 
  isSelected, 
  onSelect, 
  showTimestamp = true,
  messageGrouping = true 
}) => {
  const { theme, accessibilityMode } = useTheme();
  const { getSetting } = useSettings();
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);

  const isUser = message.type === 'user';
  const isAI = message.type === 'ai';
  const isSystem = message.type === 'system';

  const getMessageIcon = () => {
    if (isUser) return <User className="w-4 h-4" />;
    if (isAI) return <Bot className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (type.startsWith('audio/')) return <Music className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const handleFeedback = (type) => {
    // Handle feedback (thumbs up/down)
    console.log(`Feedback: ${type} for message ${message.id}`);
  };

  const handlePin = () => {
    // Handle pinning message
    console.log(`Pin message ${message.id}`);
  };

  const handleDownload = () => {
    // Handle file download
    if (message.metadata?.file) {
      const url = URL.createObjectURL(message.metadata.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = message.metadata.file.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const renderMessageContent = () => {
    switch (message.messageType) {
      case 'text':
        return (
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        );
      
      case 'voice':
        return (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-primary-500 rounded-full animate-pulse" />
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              Voice message: {message.content}
            </span>
          </div>
        );
      
      case 'file':
        return (
          <div className="flex items-center space-x-3 p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
            {getFileIcon(message.metadata?.file?.type || 'application/octet-stream')}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                {message.metadata?.file?.name || 'File'}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {message.metadata?.file?.size ? 
                  `${(message.metadata.file.size / 1024 / 1024).toFixed(2)} MB` : 
                  'Unknown size'
                }
              </p>
            </div>
            <button
              onClick={handleDownload}
              className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded transition-colors"
              aria-label="Download file"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        );
      
      case 'system':
        return (
          <div className="text-sm text-neutral-500 dark:text-neutral-400 italic">
            {message.content}
          </div>
        );
      
      default:
        return (
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        );
    }
  };

  const renderPersonalityIndicator = () => {
    if (!isAI || !message.personality) return null;
    
    const personalityColors = {
      friendly: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      professional: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      creative: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      empathetic: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
    };

    return (
      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${personalityColors[message.personality] || personalityColors.friendly}`}>
        {message.personality}
      </span>
    );
  };

  return (
    <div
      id={`message-${message.id}`}
      className={`group relative ${
        isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : ''
      }`}
      onClick={onSelect}
    >
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className={`flex items-start space-x-3 max-w-3xl ${
          isUser ? 'flex-row-reverse space-x-reverse' : ''
        }`}>
          {/* Avatar */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser 
              ? 'bg-gradient-to-br from-blue-400 to-purple-500' 
              : 'bg-gradient-to-br from-primary-400 to-secondary-500'
          }`}>
            {getMessageIcon()}
          </div>

          {/* Message Content */}
          <div className={`flex-1 min-w-0 ${
            isUser ? 'text-right' : 'text-left'
          }`}>
            {/* Message Header */}
            <div className={`flex items-center space-x-2 mb-1 ${
              isUser ? 'justify-end' : 'justify-start'
            }`}>
              {!isUser && (
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  AI Assistant
                </span>
              )}
              
              {showTimestamp && (
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {formatTimestamp(message.timestamp)}
                </span>
              )}
              
              {message.pinned && (
                <Pin className="w-3 h-3 text-neutral-400" />
              )}
            </div>

            {/* Message Bubble */}
            <div className={`inline-block p-3 rounded-2xl max-w-full ${
              isUser
                ? 'bg-primary-500 text-white'
                : isSystem
                ? 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700'
            } ${messageGrouping ? 'shadow-sm' : 'shadow-md'}`}>
              {renderMessageContent()}
              
              {/* Personality Indicator */}
              {renderPersonalityIndicator()}
            </div>

            {/* Message Actions */}
            <div className={`flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity ${
              isUser ? 'justify-end' : 'justify-start'
            }`}>
              <button
                onClick={handleCopy}
                className={`p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors ${
                  copied ? 'text-green-500' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                }`}
                aria-label="Copy message"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </button>
              
              {isAI && (
                <>
                  <button
                    onClick={() => handleFeedback('up')}
                    className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-400 hover:text-green-500 transition-colors"
                    aria-label="Thumbs up"
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  
                  <button
                    onClick={() => handleFeedback('down')}
                    className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-400 hover:text-red-500 transition-colors"
                    aria-label="Thumbs down"
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                </>
              )}
              
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                aria-label="More actions"
              >
                <MoreVertical className="w-3 h-3" />
              </button>
            </div>

            {/* More Actions Menu */}
            {showActions && (
              <div className={`absolute z-10 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 ${
                isUser ? 'right-0' : 'left-0'
              }`}>
                <button
                  onClick={handlePin}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  <Pin className="w-4 h-4" />
                  <span>{message.pinned ? 'Unpin' : 'Pin'} message</span>
                </button>
                
                {message.metadata?.file && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download file</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;

