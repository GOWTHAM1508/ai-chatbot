import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

// Action types
const ACTIONS = {
  ADD_MESSAGE: 'ADD_MESSAGE',
  UPDATE_MESSAGE: 'UPDATE_MESSAGE',
  SET_TYPING: 'SET_TYPING',
  CLEAR_CONVERSATION: 'CLEAR_CONVERSATION',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_ATTACHMENTS: 'SET_ATTACHMENTS',
  ADD_ATTACHMENT: 'ADD_ATTACHMENT',
  REMOVE_ATTACHMENT: 'REMOVE_ATTACHMENT'
};

// Initial state
const initialState = {
  messages: [],
  isTyping: false,
  error: null,
  attachments: [],
  socket: null,
  isConnected: false
};

// Reducer function
function chatReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        error: null
      };
    
    case ACTIONS.UPDATE_MESSAGE:
      return {
        ...state,
        messages: state.messages.map(msg => 
          msg.id === action.payload.id ? { ...msg, ...action.payload } : msg
        )
      };
    
    case ACTIONS.SET_TYPING:
      return {
        ...state,
        isTyping: action.payload
      };
    
    case ACTIONS.CLEAR_CONVERSATION:
      return {
        ...state,
        messages: [],
        attachments: [],
        error: null
      };
    
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    
    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case ACTIONS.SET_ATTACHMENTS:
      return {
        ...state,
        attachments: action.payload
      };
    
    case ACTIONS.ADD_ATTACHMENT:
      return {
        ...state,
        attachments: [...state.attachments, action.payload]
      };
    
    case ACTIONS.REMOVE_ATTACHMENT:
      return {
        ...state,
        attachments: state.attachments.filter(att => att.id !== action.payload)
      };
    
    default:
      return state;
  }
}

// Create context
const ChatContext = createContext();

// Provider component
export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000');
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to server');
      dispatch({ type: ACTIONS.SET_ERROR, payload: null });
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Connection lost. Trying to reconnect...' });
    });

    socket.on('chat_message', (data) => {
      if (data.type === 'ai') {
        dispatch({ type: ACTIONS.ADD_MESSAGE, payload: data });
        dispatch({ type: ACTIONS.SET_TYPING, payload: false });
      }
    });

    socket.on('user_typing', (data) => {
      // Handle other users typing (for multi-user scenarios)
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Connection error occurred' });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Add user message
  const addUserMessage = useCallback((content, type = 'text', metadata = {}) => {
    const message = {
      id: Date.now().toString(),
      content,
      type,
      sender: 'user',
      timestamp: new Date().toISOString(),
      metadata
    };

    dispatch({ type: ACTIONS.ADD_MESSAGE, payload: message });
    
    // Emit to server
    if (socketRef.current) {
      socketRef.current.emit('chat_message', {
        ...message,
        userId: socketRef.current.id
      });
    }

    return message;
  }, []);

  // Generate AI response
  const generateAIResponse = useCallback(async (userMessage, context = {}) => {
    try {
      dispatch({ type: ACTIONS.SET_TYPING, payload: true });
      dispatch({ type: ACTIONS.CLEAR_ERROR });

      // Simulate AI response generation
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      const aiMessage = {
        id: Date.now().toString(),
        content: generateMockAIResponse(userMessage),
        type: 'text',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        metadata: {
          context,
          model: 'mock-ai-v1.0'
        }
      };

      dispatch({ type: ACTIONS.ADD_MESSAGE, payload: aiMessage });
      dispatch({ type: ACTIONS.SET_TYPING, payload: false });

      // Emit to server
      if (socketRef.current) {
        socketRef.current.emit('chat_message', {
          ...aiMessage,
          userId: socketRef.current.id
        });
      }

      return aiMessage;
    } catch (error) {
      console.error('Failed to generate AI response:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to generate AI response' });
      dispatch({ type: ACTIONS.SET_TYPING, payload: false });
      toast.error('Failed to generate AI response');
      throw error;
    }
  }, []);

  // Mock AI response generator
  const generateMockAIResponse = (userMessage) => {
    const responses = [
      "That's an interesting point! I'd love to explore that further with you.",
      "I understand what you're saying. Let me think about this...",
      "That's a great question! Here's what I think about that topic.",
      "I appreciate you sharing that. It gives me a lot to consider.",
      "That's fascinating! I'd like to dive deeper into this conversation.",
      "You make an excellent observation. Let me add my perspective.",
      "I'm glad you brought that up. It's definitely worth discussing.",
      "That's a thoughtful comment. I have some ideas about that.",
      "I see what you mean. Let me share my thoughts on this.",
      "That's a compelling point. I'd like to explore it together."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Clear conversation
  const clearConversation = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_CONVERSATION });
    toast.success('Conversation cleared');
  }, []);

  // Export conversation
  const exportConversation = useCallback(() => {
    try {
      const conversationData = {
        messages: state.messages,
        timestamp: new Date().toISOString(),
        exportFormat: 'json'
      };

      const blob = new Blob([JSON.stringify(conversationData, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Conversation exported successfully');
    } catch (error) {
      console.error('Failed to export conversation:', error);
      toast.error('Failed to export conversation');
    }
  }, [state.messages]);

  // Search messages
  const searchMessages = useCallback((query) => {
    if (!query.trim()) return state.messages;
    
    const searchTerm = query.toLowerCase();
    return state.messages.filter(message => 
      message.content.toLowerCase().includes(searchTerm) ||
      message.metadata?.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }, [state.messages]);

  // Add attachment
  const addAttachment = useCallback((file) => {
    const attachment = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      timestamp: new Date().toISOString()
    };

    dispatch({ type: ACTIONS.ADD_ATTACHMENT, payload: attachment });
    toast.success(`File "${file.name}" attached`);
    return attachment;
  }, []);

  // Remove attachment
  const removeAttachment = useCallback((attachmentId) => {
    dispatch({ type: ACTIONS.REMOVE_ATTACHMENT, payload: attachmentId });
    toast.success('Attachment removed');
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  }, []);

  const value = {
    messages: state.messages,
    isTyping: state.isTyping,
    error: state.error,
    attachments: state.attachments,
    isConnected: state.isConnected,
    addUserMessage,
    generateAIResponse,
    clearConversation,
    exportConversation,
    searchMessages,
    addAttachment,
    removeAttachment,
    clearError
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

// Custom hook to use chat context
export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
