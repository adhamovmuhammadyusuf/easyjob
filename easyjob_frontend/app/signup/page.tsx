'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { register } from '@/lib/api/auth';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface SignupForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password2: string;
  user_type: 'job_seeker' | 'employer';
}

interface FormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  password2?: string;
  user_type?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState<SignupForm>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password2: '',
    user_type: searchParams.get('type') as 'job_seeker' | 'employer' || 'job_seeker',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    if (isAuthenticated) {
      const redirectTo = searchParams.get('from') || '/jobs';
      router.push(redirectTo);
    }
  }, [router, searchParams, isAuthenticated]);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // First name validation
    if (!form.first_name.trim()) {
      newErrors.first_name = 'First name is required';
      isValid = false;
    }

    // Last name validation
    if (!form.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!form.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
      isValid = false;
    } else if (!/(?=.*[a-z])/.test(form.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
      isValid = false;
    } else if (!/(?=.*[A-Z])/.test(form.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
      isValid = false;
    } else if (!/(?=.*\d)/.test(form.password)) {
      newErrors.password = 'Password must contain at least one number';
      isValid = false;
    }

    // Confirm password validation
    if (!form.password2) {
      newErrors.password2 = 'Please confirm your password';
      isValid = false;
    } else if (form.password !== form.password2) {
      newErrors.password2 = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await register({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        password2: form.password2,
        user_type: form.user_type
      });

      toast({
        title: "Success!",
        description: "Account created successfully. Please sign in.",
      });

      // Redirect to login page with success message
      const redirectTo = searchParams.get('from') || '/jobs';
      router.push(`/login?registered=true&from=${encodeURIComponent(redirectTo)}`);
    } catch (err: any) {
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'object') {
          errorMessage = Object.entries(data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
        } else {
          errorMessage = data;
        }
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your network.';
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg shadow-blue-100/50 sm:rounded-xl sm:px-10 border border-blue-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="user_type" className="block text-sm font-medium text-gray-700">
                Account Type
              </Label>
              <div className="mt-1">
                <Select
                  value={form.user_type}
                  onValueChange={(value: 'job_seeker' | 'employer') => 
                    setForm(prev => ({ ...prev, user_type: value }))
                  }
                >
                  <SelectTrigger className={`w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center ${
                    errors.user_type ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}>
                    <SelectValue placeholder="Select account type" className="text-gray-500" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md mt-1">
                    <SelectItem 
                      value="job_seeker" 
                      className="py-2 px-3 pl-6 text-gray-900 hover:bg-blue-50 hover:font-semibold cursor-pointer transition-all !text-gray-900"
                    >
                      Job Seeker
                    </SelectItem>
                    <SelectItem 
                      value="employer" 
                      className="py-2 px-3 pl-6 text-gray-900 hover:bg-blue-50 hover:font-semibold cursor-pointer transition-all !text-gray-900"
                    >
                      Employer
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.user_type && (
                  <p className="mt-1 text-sm text-red-600">{errors.user_type}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  First Name
                </Label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  value={form.first_name}
                  onChange={handleChange}
                  className={`mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400 ${
                    errors.first_name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="First name"
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Last Name
                </Label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  value={form.last_name}
                  onChange={handleChange}
                  className={`mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400 ${
                    errors.last_name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Last name"
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                className={`mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400 ${
                  errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={handleChange}
                  className={`mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400 pr-10 ${
                    errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password2" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password2"
                  name="password2"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={form.password2}
                  onChange={handleChange}
                  className={`mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400 pr-10 ${
                    errors.password2 ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password2 && (
                <p className="mt-1 text-sm text-red-600">{errors.password2}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-2 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </div>
              ) : (
                "Create account"
              )}
            </Button>

            <p className="text-xs text-center text-gray-500">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700 transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700 transition-colors">
                Privacy Policy
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}