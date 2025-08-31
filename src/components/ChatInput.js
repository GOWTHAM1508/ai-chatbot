import React, { useState, useRef, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { 
  Send, 
  Paperclip, 
  Mic, 
  MicOff, 
  X, 
  FileText,
  Image,
  Video,
  Music,
  File,
  Smile
} from 'lucide-react';

const ChatInput = ({ 
  onSubmit, 
  isTyping = false, 
  attachments = [], 
  placeholder = "Type your message...",
  disabled = false 
}) => {
  const { theme, accessibilityMode } = useTheme();
  const { getSetting } = useSettings();
  
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;

    onSubmit(message.trim(), 'text');
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [message, onSubmit, disabled]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  const handleTextareaChange = useCallback((e) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
    }
  }, []);

  const handleFileUpload = useCallback((files) => {
    Array.from(files).forEach(file => {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      // Create file message
      onSubmit(`Uploaded: ${file.name}`, 'file', { file });
    });
    
    setShowFileUpload(false);
  }, [onSubmit]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const handleVoiceRecord = useCallback(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Voice recording is not supported in your browser');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      // Stop recording logic here
    } else {
      setIsRecording(true);
      // Start recording logic here
      
      // Simulate recording for demo
      setTimeout(() => {
        setIsRecording(false);
        onSubmit('Voice message recorded', 'voice');
      }, 3000);
    }
  }, [isRecording, onSubmit]);

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (type.startsWith('audio/')) return <Music className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const removeAttachment = useCallback((index) => {
    // Remove attachment logic here
    console.log('Remove attachment at index:', index);
  }, []);

  return (
    <div className="space-y-3">
      {/* Attachments Display */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((attachment, index) => (
            <div
              key={attachment.id}
              className="flex items-center space-x-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg"
            >
              {getFileIcon(attachment.type)}
              <span className="text-sm text-neutral-700 dark:text-neutral-300 truncate max-w-32">
                {attachment.name}
              </span>
              <button
                onClick={() => removeAttachment(index)}
                className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded transition-colors"
                aria-label="Remove attachment"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* File Upload Zone */}
      {showFileUpload && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
            dragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-neutral-300 dark:border-neutral-600'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Paperclip className="w-8 h-8 mx-auto mb-2 text-neutral-400" />
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
            Drag and drop files here, or click to browse
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
          >
            Choose Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          />
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        {/* File Upload Button */}
        <button
          type="button"
          onClick={() => setShowFileUpload(!showFileUpload)}
          className={`p-2 rounded-lg transition-colors ${
            showFileUpload
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
          }`}
          aria-label="Attach files"
          disabled={disabled}
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Voice Record Button */}
        <button
          type="button"
          onClick={handleVoiceRecord}
          className={`p-2 rounded-lg transition-colors ${
            isRecording
              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
          }`}
          aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
          disabled={disabled}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={`w-full px-4 py-3 pr-12 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              accessibilityMode.largeText ? 'text-lg' : 'text-base'
            }`}
            style={{
              fontFamily: accessibilityMode.dyslexiaFriendly ? 'OpenDyslexic, Arial, sans-serif' : 'inherit',
              lineHeight: accessibilityMode.largeText ? '1.6' : '1.4',
            }}
          />
          
          {/* Emoji Button */}
          <button
            type="button"
            className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            aria-label="Insert emoji"
            disabled={disabled}
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim() || disabled || isTyping}
          className={`p-3 rounded-xl transition-all ${
            message.trim() && !disabled && !isTyping
              ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'
          }`}
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="flex items-center justify-center space-x-2 py-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm text-red-600 dark:text-red-400 font-medium">
            Recording... Click to stop
          </span>
        </div>
      )}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span>AI is typing...</span>
        </div>
      )}

      {/* Character Count */}
      {getSetting('chat', 'showCharacterCount') && (
        <div className="text-xs text-neutral-500 dark:text-neutral-400 text-right">
          {message.length} characters
        </div>
      )}
    </div>
  );
};

export default ChatInput;

