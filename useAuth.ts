import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  personalityType: string;
  emotionalNeeds: string[];
  interests: string[];
  goals: string[];
  currentMood: string;
  sparkPoints: number;
  level: number;
  completedQuests: number;
  streak: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userStr = await AsyncStorage.getItem('user_data');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        apiService.setToken(token);
        setAuthState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        await AsyncStorage.setItem('auth_token', token);
        await AsyncStorage.setItem('user_data', JSON.stringify(user));
        
        apiService.setToken(token);
        setAuthState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
        
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    age: number;
    personalityType: string;
    emotionalNeeds: string[];
    interests: string[];
    goals: string[];
    currentMood: string;
  }) => {
    try {
      const response = await apiService.register(userData);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        await AsyncStorage.setItem('auth_token', token);
        await AsyncStorage.setItem('user_data', JSON.stringify(user));
        
        apiService.setToken(token);
        setAuthState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
        
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Registration failed' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      setAuthState(prev => ({ ...prev, user: updatedUser }));
      AsyncStorage.setItem('user_data', JSON.stringify(updatedUser));
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
    updateUser,
  };
}