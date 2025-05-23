import React, { createContext, useState, useContext, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { apiService } from './apiService';

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
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Check if token is valid and not expired
  const isTokenValid = (token) => {
    if (!token) return false;
    
    try {
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('token');
      
      if (savedToken && isTokenValid(savedToken)) {
        setToken(savedToken);
        apiService.setAuthToken(savedToken);
        
        try {
          const response = await apiService.get('/auth/profile');
          setUser(response.user);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          logout();
        }
      } else {
        logout();
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiService.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response;

      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      apiService.setAuthToken(newToken);

      return { success: true, user: userData };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiService.post('/auth/register', userData);
      return { success: true, user: response.user };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    apiService.clearAuthToken();
  };

  const generateApiKey = async () => {
    try {
      const response = await apiService.post('/auth/generate-api-key');
      return { success: true, apiKey: response.apiKey };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to generate API key' 
      };
    }
  };

  const revokeApiKey = async () => {
    try {
      await apiService.delete('/auth/revoke-api-key');
      // Refresh user data
      const response = await apiService.get('/auth/profile');
      setUser(response.user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to revoke API key' 
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    generateApiKey,
    revokeApiKey,
    isAuthenticated: !!token && !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
