'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { login, getAuthState } from '../../lib/api/auth';
import { useAuth } from '@/components/providers/auth-provider';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const { authLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const from = searchParams?.get('from') || '/dashboard';
  
  console.log('Login page - Redirect path after login will be:', from);
  // Check if user is already authenticated
  useEffect(() => {
    const { isAuthenticated } = getAuthState();
    console.log('Login page - Initial auth check:', { isAuthenticated, from });
    
    if (isAuthenticated) {
      console.log('Login page - User is already authenticated, redirecting to:', from);
      
      // Use window.location for a hard redirect
      window.location.href = from;
    }
  }, [from]);  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      console.log('Login page - Attempting login with:', { email });
      // Add a timeout to prevent hanging login attempts
      const loginPromise = login({ email, password });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Login request timed out')), 15000)
      );
      
      const { token, user } = await Promise.race([loginPromise, timeoutPromise]) as { token: string; user: any };
      console.log('Login page - Login successful, token received:', token ? 'valid token' : 'missing token');
      
      if (!token) {
        throw new Error('No authentication token received');
      }
      
      // Update auth state
      try {
        console.log('Login page - Updating auth state with user:', { id: user.id, email: user.email });
        authLogin(token, user);
      } catch (authError) {
        console.error('Login page - Error updating auth state:', authError);
        throw new Error('Error saving authentication state');
      }
      
      // Show success message
      setSuccess('Login successful! Redirecting...');
      
      // Use window.location for a hard redirect
      console.log('Login page - Scheduling redirect to:', from);
      setTimeout(() => {
        try {
          console.log('Login page - Redirecting now to:', from);
          window.location.href = from;
        } catch (redirectError) {
          console.error('Login page - Redirect error:', redirectError);
          // Try alternative navigation as fallback
          document.location.href = from;
        }
      }, 1000);
    } catch (error: any) {
      console.error('Login page - Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900">Sign in</h1>
          <p className="mt-2 text-center text-gray-600">
            Or <Link href="/signup" className="text-blue-600 hover:underline">create an account</Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 p-4 rounded-md text-green-700 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm">
              Redirect after login: <span className="font-medium">{from}</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}