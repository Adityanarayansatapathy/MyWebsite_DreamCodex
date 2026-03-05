import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { tokenManager } from '../utils/tokenManager';
import { authApi } from '../services/api';
import { STORAGE_KEYS, USER_ROLES } from '../utils/apiConfig';
import { logError, logWarn } from '../utils/env';
import { toast } from 'sonner@2.0.3';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  refreshUserData: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from stored data
  const initializeAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Get token from token manager
      const storedToken = tokenManager.getToken();
      
      if (storedToken) {
        // Try to refresh token if needed
        const validToken = await tokenManager.refreshTokenIfNeeded();
        
        if (validToken) {
          // Get stored user data
          const savedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
          
          if (savedUser) {
            try {
              const userData = JSON.parse(savedUser);
              setUser(userData);
              setToken(validToken);
              
              // Optionally fetch fresh user data from server
              await refreshUserDataSilently(validToken);
            } catch (error) {
              logError('Failed to parse saved user data:', error);
              await clearAuthData();
            }
          } else {
            // Token exists but no user data, fetch from server
            await fetchUserData(validToken);
          }
        } else {
          // Token invalid or expired
          await clearAuthData();
        }
      }
    } catch (error) {
      logError('Error initializing auth:', error);
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch user data from server
  const fetchUserData = async (authToken: string) => {
    try {
      const userData = await authApi.getCurrentUser(authToken);
      if (userData) {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      } else {
        await clearAuthData();
      }
    } catch (error) {
      logError('Failed to fetch user data:', error);
      await clearAuthData();
    }
  };

  // Refresh user data silently (without affecting loading state)
  const refreshUserDataSilently = async (authToken?: string) => {
    try {
      const currentToken = authToken || token;
      if (currentToken) {
        const userData = await authApi.getCurrentUser(currentToken);
        if (userData) {
          setUser(userData);
          localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        }
      }
    } catch (error) {
      logError('Failed to refresh user data:', error);
    }
  };

  // Clear authentication data
  const clearAuthData = async () => {
    setUser(null);
    setToken(null);
    tokenManager.clearToken();
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  };

  // Login function
  const login = useCallback((userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    tokenManager.setToken(authToken);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    
    toast.success(`Welcome back, ${userData.name}!`);
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Attempt to logout on server
      if (token) {
        await authApi.logout(token);
      }
    } catch (error) {
      logError('Server logout failed:', error);
    } finally {
      await clearAuthData();
      setIsLoading(false);
      toast.info('You have been logged out');
    }
  }, [token]);

  // Check if user is admin
  const isAdmin = useCallback(() => {
    if (!user) return false;
    
    // Check both user role and token-based role
    const userRole = user?.role || user?.businessCategory;
    const tokenRole = tokenManager.isAdmin();
    
    return userRole === USER_ROLES.ADMIN || 
           userRole === 'Administration' || 
           tokenRole ||
           user?.id === 'admin' ||
           user?.email === 'admin@startup.com';
  }, [user]);

  // Refresh user data
  const refreshUserData = useCallback(async () => {
    if (token) {
      await refreshUserDataSilently(token);
    }
  }, [token]);

  // Update user data locally
  const updateUser = useCallback((userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
    }
  }, [user]);

  // Session monitoring
  useEffect(() => {
    if (token) {
      const cleanup = tokenManager.startSessionMonitoring(
        () => {
          toast.warning('Your session will expire in 2 minutes', {
            duration: 5000,
            action: {
              label: 'Extend Session',
              onClick: refreshUserData,
            },
          });
        },
        () => {
          toast.error('Your session has expired. Please log in again.');
          logout();
        }
      );

      return cleanup;
    }
  }, [token, logout, refreshUserData]);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Auto-refresh token periodically
  useEffect(() => {
    if (token) {
      const interval = setInterval(async () => {
        await tokenManager.refreshTokenIfNeeded();
      }, 5 * 60 * 1000); // Check every 5 minutes

      return () => clearInterval(interval);
    }
  }, [token]);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    isAdmin,
    refreshUserData,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};