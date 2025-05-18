'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/api/types';
import { me, setAuthState, clearAuthState } from '../../lib/api/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  authLogin: (token: string, user: User) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  authLogin: () => {},
  logout: async () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();  const checkAuth = async () => {
    try {
      console.log('AuthProvider.checkAuth called');
      // Check for stored token first
      let token;
      try {
        token = localStorage.getItem('token');
      } catch (storageError) {
        console.error('Error accessing localStorage:', storageError);
        token = null;
      }
      
      if (!token) {
        console.log('No token found, skipping API call');
        clearAuthState();
        setUser(null);
        setLoading(false);
        return;
      }
      
      // Try to get user from API
      try {
        const currentUser = await me();
        if (currentUser) {
          console.log('User data retrieved:', currentUser);
          setUser(currentUser);
        } else {
          // If no user is returned, clear the auth state
          console.log('No user data returned, clearing auth state');
          clearAuthState();
          setUser(null);
        }
      } catch (apiError) {
        console.error('API error in auth check:', apiError);
        clearAuthState();
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearAuthState();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    checkAuth();

    // Listen for auth changes
    const handleAuthChange = () => {
      console.log('Auth change event detected');
      checkAuth();
    };

    window.addEventListener('auth-change', handleAuthChange);
    
    // Set up periodic token validation
    const intervalId = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token) {
        console.log('Periodic auth check');
        checkAuth();
      }
    }, 15 * 60 * 1000); // Check every 15 minutes
    
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      clearInterval(intervalId);
    };
  }, []);  const authLogin = (token: string, user: User) => {
    console.log('AuthProvider.authLogin called with:', { 
      token: token ? token.substring(0, 10) + '...' : 'missing',
      user
    });
    
    try {
      // Store auth state
      setAuthState(token, user);
      
      // Update local state
      setUser(user);
      
      // Trigger auth change event
      try {
        window.dispatchEvent(new Event('auth-change'));
      } catch (eventError) {
        console.error('Error dispatching auth-change event:', eventError);
      }
      
      console.log('Auth state updated, user set:', user?.email || 'unknown');
    } catch (error) {
      console.error('Error in authLogin:', error);
    }
  };
  const logout = async () => {
    try {
      console.log('AuthProvider.logout called');
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch (apiError) {
        console.error('Logout API call failed:', apiError);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      try {
        clearAuthState();
        setUser(null);
        router.push('/login');
      } catch (finalError) {
        console.error('Error in logout cleanup:', finalError);
        // Force a page reload as a last resort
        window.location.href = '/login';
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        authLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);