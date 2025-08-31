import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState({
    id: null,
    username: '',
    email: '',
    avatar: null,
    preferences: {},
    stats: {
      conversations: 0,
      messages: 0,
      totalTime: 0,
      lastActive: null,
    },
    settings: {
      notifications: true,
      privacy: 'public',
      language: 'en',
      timezone: 'auto',
    },
  });

  // Initialize authentication from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = localStorage.getItem('chatbotUser');
        const savedSession = localStorage.getItem('chatbotSession');
        
        if (savedUser && savedSession) {
          const userData = JSON.parse(savedUser);
          const sessionData = JSON.parse(savedSession);
          
          // Check if session is still valid
          if (sessionData.expiresAt > Date.now()) {
            setUser(userData);
            setSession(sessionData);
            setIsAuthenticated(true);
            await loadUserProfile(userData.id);
          } else {
            // Session expired, clear storage
            localStorage.removeItem('chatbotUser');
            localStorage.removeItem('chatbotSession');
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Clear corrupted data
        localStorage.removeItem('chatbotUser');
        localStorage.removeItem('chatbotSession');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Load user profile
  const loadUserProfile = useCallback(async (userId) => {
    try {
      // In a real app, this would fetch from your backend
      // For now, we'll create a default profile
      const defaultProfile = {
        id: userId,
        username: user?.username || 'User',
        email: user?.email || '',
        avatar: null,
        preferences: {
          theme: 'auto',
          notifications: true,
          privacy: 'public',
          language: 'en',
          timezone: 'auto',
        },
        stats: {
          conversations: 0,
          messages: 0,
          totalTime: 0,
          lastActive: new Date(),
        },
        settings: {
          notifications: true,
          privacy: 'public',
          language: 'en',
          timezone: 'auto',
        },
      };

      setUserProfile(defaultProfile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      toast.error('Failed to load user profile');
    }
  }, [user]);

  // Sign up
  const signUp = useCallback(async (userData) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would send data to your backend
      // For now, we'll simulate the signup process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: uuidv4(),
        username: userData.username,
        email: userData.email,
        createdAt: new Date(),
      };

      const newSession = {
        id: uuidv4(),
        userId: newUser.id,
        token: uuidv4(),
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
        createdAt: new Date(),
      };

      setUser(newUser);
      setSession(newSession);
      setIsAuthenticated(true);
      
      // Save to localStorage
      localStorage.setItem('chatbotUser', JSON.stringify(newUser));
      localStorage.setItem('chatbotSession', JSON.stringify(newSession));
      
      // Load user profile
      await loadUserProfile(newUser.id);
      
      toast.success('Account created successfully!');
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Signup failed:', error);
      toast.error('Failed to create account. Please try again.');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [loadUserProfile]);

  // Sign in
  const signIn = useCallback(async (credentials) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would validate against your backend
      // For now, we'll simulate the signin process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any credentials
      const existingUser = {
        id: uuidv4(),
        username: credentials.username || 'DemoUser',
        email: credentials.email || 'demo@example.com',
        createdAt: new Date(),
      };

      const newSession = {
        id: uuidv4(),
        userId: existingUser.id,
        token: uuidv4(),
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
        createdAt: new Date(),
      };

      setUser(existingUser);
      setSession(newSession);
      setIsAuthenticated(true);
      
      // Save to localStorage
      localStorage.setItem('chatbotUser', JSON.stringify(existingUser));
      localStorage.setItem('chatbotSession', JSON.stringify(newSession));
      
      // Load user profile
      await loadUserProfile(existingUser.id);
      
      toast.success('Signed in successfully!');
      return { success: true, user: existingUser };
    } catch (error) {
      console.error('Signin failed:', error);
      toast.error('Failed to sign in. Please check your credentials.');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [loadUserProfile]);

  // Sign out
  const signOut = useCallback(() => {
    setUser(null);
    setSession(null);
    setIsAuthenticated(false);
    setUserProfile({
      id: null,
      username: '',
      email: '',
      avatar: null,
      preferences: {},
      stats: {
        conversations: 0,
        messages: 0,
        totalTime: 0,
        lastActive: null,
      },
      settings: {
        notifications: true,
        privacy: 'public',
        language: 'en',
        timezone: 'auto',
      },
    });
    
    // Clear localStorage
    localStorage.removeItem('chatbotUser');
    localStorage.removeItem('chatbotSession');
    
    toast.success('Signed out successfully');
  }, []);

  // Update user profile
  const updateUserProfile = useCallback(async (updates) => {
    try {
      const updatedProfile = { ...userProfile, ...updates };
      setUserProfile(updatedProfile);
      
      // In a real app, this would save to your backend
      // For now, we'll just update local state
      
      toast.success('Profile updated successfully');
      return { success: true, profile: updatedProfile };
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
      return { success: false, error: error.message };
    }
  }, [userProfile]);

  // Update user preferences
  const updateUserPreferences = useCallback(async (preferences) => {
    try {
      const updatedProfile = {
        ...userProfile,
        preferences: { ...userProfile.preferences, ...preferences },
      };
      setUserProfile(updatedProfile);
      
      toast.success('Preferences updated successfully');
      return { success: true, preferences: updatedProfile.preferences };
    } catch (error) {
      console.error('Failed to update preferences:', error);
      toast.error('Failed to update preferences');
      return { success: false, error: error.message };
    }
  }, [userProfile]);

  // Update user settings
  const updateUserSettings = useCallback(async (settings) => {
    try {
      const updatedProfile = {
        ...userProfile,
        settings: { ...userProfile.settings, ...settings },
      };
      setUserProfile(updatedProfile);
      
      toast.success('Settings updated successfully');
      return { success: true, settings: updatedProfile.settings };
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast.error('Failed to update settings');
      return { success: false, error: error.message };
    }
  }, [userProfile]);

  // Update user stats
  const updateUserStats = useCallback((stats) => {
    setUserProfile(prev => ({
      ...prev,
      stats: { ...prev.stats, ...stats },
    }));
  }, []);

  // Refresh session
  const refreshSession = useCallback(async () => {
    if (!session) return false;
    
    try {
      // In a real app, this would validate with your backend
      const newSession = {
        ...session,
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
      };
      
      setSession(newSession);
      localStorage.setItem('chatbotSession', JSON.stringify(newSession));
      
      return true;
    } catch (error) {
      console.error('Failed to refresh session:', error);
      return false;
    }
  }, [session]);

  // Check if session is expired
  const isSessionExpired = useCallback(() => {
    if (!session) return true;
    return session.expiresAt < Date.now();
  }, [session]);

  // Get user avatar
  const getUserAvatar = useCallback(() => {
    if (userProfile.avatar) {
      return userProfile.avatar;
    }
    
    // Generate default avatar based on username
    const initials = userProfile.username
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    return `https://ui-avatars.com/api/?name=${initials}&background=0ea5e9&color=fff&size=128`;
  }, [userProfile]);

  // Delete account
  const deleteAccount = useCallback(async () => {
    try {
      // In a real app, this would delete from your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      signOut();
      toast.success('Account deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Failed to delete account:', error);
      toast.error('Failed to delete account');
      return { success: false, error: error.message };
    }
  }, [signOut]);

  // Check authentication status
  useEffect(() => {
    if (session && isSessionExpired()) {
      toast.error('Session expired. Please sign in again.');
      signOut();
    }
  }, [session, isSessionExpired, signOut]);

  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    session,
    userProfile,
    
    // Actions
    signUp,
    signIn,
    signOut,
    updateUserProfile,
    updateUserPreferences,
    updateUserSettings,
    updateUserStats,
    refreshSession,
    deleteAccount,
    
    // Utilities
    isSessionExpired,
    getUserAvatar,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

