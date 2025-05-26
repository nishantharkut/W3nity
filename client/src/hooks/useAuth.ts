
import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error?: string;
}

// Mock user data for development
const mockUser: User = {
  id: '1',
  username: 'johndoe',
  email: 'john@example.com',
  avatar: undefined,
  bio: 'Full-stack developer passionate about Web3 and modern technologies.',
  skills: ['React', 'TypeScript', 'Node.js', 'Web3', 'Solidity'],
  rating: 4.8,
  reviewCount: 24,
  walletAddress: '0x742d35Cc6734C0532925a3b8D0a4E8a2c9e9e8d2',
  isVerified: true,
  joinedAt: new Date('2023-01-15'),
  location: 'San Francisco, CA'
};

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedAuth = localStorage.getItem('sparkverse-auth');
      if (storedAuth) {
        try {
          const parsed = JSON.parse(storedAuth);
          setAuthState({
            isAuthenticated: true,
            user: parsed.user,
            isLoading: false,
          });
        } catch (error) {
          console.error('Error parsing stored auth:', error);
          localStorage.removeItem('sparkverse-auth');
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock login validation
      if (email === 'demo@sparkverse.com' && password === 'demo123') {
        const authData = {
          user: mockUser,
          token: 'mock-jwt-token',
          expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        };

        localStorage.setItem('sparkverse-auth', JSON.stringify(authData));
        
        setAuthState({
          isAuthenticated: true,
          user: mockUser,
          isLoading: false,
        });

        return { success: true };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error: any) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: error.message || 'Login failed',
      });
      return { success: false, error: error.message };
    }
  }, []);

  const register = useCallback(async (userData: { 
    username: string; 
    email: string; 
    password: string; 
  }) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        ...mockUser,
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        joinedAt: new Date(),
        rating: 0,
        reviewCount: 0,
        skills: [],
      };

      const authData = {
        user: newUser,
        token: 'mock-jwt-token',
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };

      localStorage.setItem('sparkverse-auth', JSON.stringify(authData));
      
      setAuthState({
        isAuthenticated: true,
        user: newUser,
        isLoading: false,
      });

      return { success: true };
    } catch (error: any) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: error.message || 'Registration failed',
      });
      return { success: false, error: error.message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sparkverse-auth');
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
  };
};
