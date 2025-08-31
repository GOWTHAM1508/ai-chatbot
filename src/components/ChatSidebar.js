import React, { useState, useCallback } from 'react';
import { 
  X, 
  Search, 
  Filter, 
  Download, 
  Trash2,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Clock,
  MessageSquare
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ChatSidebar = ({ 
  isOpen, 
  onClose, 
  messages, 
  attachments, 
  onSearch, 
  onClear, 
  onExport 
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('conversation');

  // Handle search
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    onSearch(searchQuery);
  }, [searchQuery, onSearch]);

  // Get file type icon
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (fileType.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (fileType.startsWith('audio/')) return <Music className="w-4 h-4" />;
    if (fileType.includes('pdf')) return <FileText className="w-4 h-4" />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <Archive className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 shadow-xl transform transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Chat Sidebar
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
          />
        </form>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-700">
        <button
          onClick={() => setActiveTab('conversation')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
            activeTab === 'conversation'
              ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Conversation
        </button>
        <button
          onClick={() => setActiveTab('attachments')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
            activeTab === 'attachments'
              ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          <Archive className="w-4 h-4 inline mr-2" />
          Files ({attachments.length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'conversation' ? (
          <div className="p-4">
            {/* Stats */}
            <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Total Messages
                </span>
                <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {messages.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  User Messages
                </span>
                <span className="text-sm text-neutral-900 dark:text-neutral-100">
                  {messages.filter(m => m.sender === 'user').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  AI Responses
                </span>
                <span className="text-sm text-neutral-900 dark:text-neutral-100">
                  {messages.filter(m => m.sender === 'ai').length}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={onClear}
                className="w-full flex items-center justify-center px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Conversation
              </button>
              
              <button
                onClick={onExport}
                className="w-full flex items-center justify-center px-4 py-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Chat
              </button>
            </div>

            {/* Recent Messages */}
            {messages.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-3">
                  Recent Messages
                </h3>
                <div className="space-y-2">
                  {messages.slice(-5).reverse().map((message) => (
                    <div
                      key={message.id}
                      className="p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg"
                    >
                      <div className="flex items-start space-x-2">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          message.sender === 'user' 
                            ? 'bg-blue-500' 
                            : 'bg-green-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                            {message.sender === 'user' ? 'You' : 'AI'} • {formatTimestamp(message.timestamp)}
                          </p>
                          <p className="text-sm text-neutral-900 dark:text-neutral-100 truncate">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4">
            {attachments.length === 0 ? (
              <div className="text-center py-8">
                <Archive className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <p className="text-neutral-500 dark:text-neutral-400">
                  No files attached yet
                </p>
                <p className="text-sm text-neutral-400 dark:text-neutral-500">
                  Files you share in chat will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-600"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {getFileIcon(attachment.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                          {attachment.name}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {formatFileSize(attachment.size)} • {formatTimestamp(attachment.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
