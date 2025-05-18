import { useState, useEffect } from 'react';
import type { User } from '@/lib/api/types';
import { me, getAuthState, setAuthState, clearAuthState } from '@/lib/api/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const { user } = getAuthState();
    return user;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { token } = getAuthState();
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }
        
        const userData = await me();
        if (userData) {
          setAuthState(token, userData);
          setUser(userData);
        } else {
          clearAuthState();
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        clearAuthState();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, loading, isAuthenticated: !!user };
}
