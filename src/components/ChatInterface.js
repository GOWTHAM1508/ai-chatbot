import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import ChatSidebar from './ChatSidebar';
import TypingIndicator from './TypingIndicator';
import { 
  Menu, 
  X, 
  Search, 
  Filter, 
  Download, 
  Trash2,
  Settings,
  Bot,
  Sparkles
} from 'lucide-react';

const ChatInterface = () => {
  const {
    messages,
    isTyping,
    addUserMessage,
    generateAIResponse,
    clearConversation,
    exportConversation,
    searchMessages,
    attachments,
    error
  } = useChat();
  
  const { theme, accessibilityMode } = useTheme();
  const { getSetting } = useSettings();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState(messages);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
      setShowWelcome(false);
    }
  }, [messages, scrollToBottom]);

  // Filter messages based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = searchMessages(searchQuery);
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(messages);
    }
  }, [searchQuery, messages, searchMessages]);

  // Handle message selection
  const handleMessageSelect = useCallback((message) => {
    setSelectedMessage(message);
    // Scroll to selected message
    const messageElement = document.getElementById(`message-${message.id}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageElement.classList.add('ring-2', 'ring-primary-500');
      setTimeout(() => {
        messageElement.classList.remove('ring-2', 'ring-primary-500');
      }, 2000);
    }
  }, []);

  // Handle user message submission
  const handleMessageSubmit = useCallback(async (content, type = 'text', metadata = {}) => {
    if (!content.trim()) return;

    try {
      // Add user message
      const userMessage = addUserMessage(content, type, metadata);
      
      // Generate AI response
      await generateAIResponse(content, {
        messageType: type,
        metadata,
        timestamp: new Date(),
        userMessageId: userMessage.id
      });
    } catch (error) {
      console.error('Failed to process message:', error);
    }
  }, [addUserMessage, generateAIResponse]);

  // Handle conversation clear
  const handleClearConversation = useCallback(() => {
    if (window.confirm('Are you sure you want to clear the entire conversation? This action cannot be undone.')) {
      clearConversation();
      setShowWelcome(true);
    }
  }, [clearConversation]);

  // Handle conversation export
  const handleExportConversation = useCallback(() => {
    exportConversation();
  }, [exportConversation]);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen]);

  // Handle search
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (query.trim() && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      
      // Ctrl/Cmd + L for sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        toggleSidebar();
      }
      
      // Escape to close sidebar
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen, toggleSidebar]);

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Sidebar */}
      <ChatSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        messages={messages}
        attachments={attachments}
        onSearch={handleSearch}
        onClear={handleClearConversation}
        onExport={handleExportConversation}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 md:hidden"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  AI Chat
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {isTyping ? 'AI is typing...' : 'Ready to chat'}
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search messages (Ctrl+K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={handleClearConversation}
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
              aria-label="Clear conversation"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleExportConversation}
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200"
              aria-label="Export conversation"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{
            fontFamily: accessibilityMode.dyslexiaFriendly ? 'OpenDyslexic, Arial, sans-serif' : 'inherit',
            fontSize: accessibilityMode.largeText ? '1.1em' : 'inherit',
          }}
        >
          {/* Welcome Message */}
          {showWelcome && messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                Welcome to Your AI Companion! 🤖
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
                I'm here to help you with anything you need. Ask me questions, 
                have a conversation, or just say hello!
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                  ✨ Adaptive Intelligence
                </span>
                <span className="px-3 py-1 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 rounded-full">
                  🎯 Context Aware
                </span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                  🔒 Privacy First
                </span>
              </div>
            </div>
          )}

          {/* Messages */}
          {filteredMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isSelected={selectedMessage?.id === message.id}
              onSelect={() => handleMessageSelect(message)}
              showTimestamp={getSetting('chat', 'showTimestamps')}
              messageGrouping={getSetting('chat', 'messageGrouping')}
            />
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <TypingIndicator />
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4">
          <ChatInput
            onSubmit={handleMessageSubmit}
            isTyping={isTyping}
            attachments={attachments}
            placeholder="Type your message here..."
            disabled={isTyping}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

