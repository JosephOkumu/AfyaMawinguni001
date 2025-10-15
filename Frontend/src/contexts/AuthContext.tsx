import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { RegisterData, LoginData, AuthResponse } from '../services/authService';
import SecureStorage from '../utils/secureStorage';

// Type definitions for the auth context
interface User {
  id: number;
  name: string;
  email: string;
  user_type_id?: number;
  user_type?: {
    id: number;
    name: string;
    display_name: string;
  } | string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps your app and makes auth available to any child component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in when the app loads
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("🔐 Initializing authentication...");
        const token = SecureStorage.getToken();
        const storedUser = SecureStorage.getUser();
        
        console.log("🔐 Auth check:", {
          hasToken: !!token,
          tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
          hasStoredUser: !!storedUser,
          isAuthenticatedService: authService.isAuthenticated()
        });
        
        // Check for token in secure storage
        if (authService.isAuthenticated()) {
          const storedUserData = authService.getStoredUser();
          if (storedUserData) {
            console.log("🔐 Using stored user data:", storedUserData);
            setUser(storedUserData);
            setIsAuthenticated(true);
          } else {
            // If token exists but no user, fetch user data
            console.log("🔐 Fetching user data from API...");
            const userData = await authService.getCurrentUser();
            console.log("🔐 Fetched user data:", userData);
            setUser(userData);
            setIsAuthenticated(true);
          }
        } else {
          console.log("🔐 No valid authentication found");
        }
      } catch (err) {
        console.error("🚨 Authentication initialization error:", err);
        // If there's an error fetching user data, clear secure storage
        SecureStorage.clearAll();
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Register a new user
  const register = async (userData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      const token = response.access_token || response.token;
      setUser(response.user);
      setIsAuthenticated(true);
      if (token) {
        SecureStorage.setToken(token, 480); // 8 hours
        SecureStorage.setUser(response.user);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login an existing user
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login({ email, password });
      console.log('Login response:', response); // Debug login response
      setUser(response.user);
      setIsAuthenticated(true);
      
      // Token and user data already stored securely in authService.login()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout the current user
  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err: any) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
