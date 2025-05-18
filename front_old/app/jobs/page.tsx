'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchBar } from '../../components/SearchBar';
import { getJobs } from '../../lib/api/jobs';
import type { Job } from '../../lib/api/types';
import JobCard from '../../components/job-card';
import JobFilter from '../../components/job-filter';
import SafeJobCard from '../../components/safe-job-card';

interface Category {
  id: number;
  name: string;
  icon: string;
  vacancy_count: number;
}

export default function JobsPage() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') ? Number(searchParams.get('category')) : undefined,
    location: searchParams.get('location') || '',
    job_type: searchParams.get('job_type') || '',
    salary_range: '',
  });
  useEffect(() => {    
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Jobs page - Fetching jobs with filters:', filters);
        
        try {
          // Add a timeout to abort the request if it takes too long
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
          
          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          };
          
          if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
              headers.Authorization = `Bearer ${token}`;
            }
          }
          
          // Convert category to number if it's a string
          const apiFilters = {
            ...filters,
            page: 1,
            page_size: 10
          };
          
          const queryParams = new URLSearchParams();
          Object.entries(apiFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              queryParams.append(key, value.toString());
            }
          });
            const queryString = queryParams.toString();
          const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/vacancies/${queryString ? `?${queryString}` : ''}`;
          
          console.log('Jobs page - API URL:', url);
          
          const response = await fetch(url, {
            headers,
            signal: controller.signal,
          }).finally(() => clearTimeout(timeoutId));
          
          console.log('Jobs page - Response status:', response.status);
          
          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }
          
          // Check response is valid JSON before parsing
          const contentType = response.headers.get('content-type') || '';
          if (!contentType.includes('application/json')) {
            console.error('Jobs page - Non-JSON response received:', contentType);
            const text = await response.text();
            console.error('Jobs page - Response text (first 150 chars):', text.substring(0, 150));
            throw new Error('Server returned non-JSON response');
          }
          
          const data = await response.json();
          console.log('Jobs page - Jobs data received:', {
            count: data.count,
            resultsCount: data.results?.length || 0
          });
          
          setJobs(data.results || []);
        } catch (apiError: any) {
          console.error('Jobs page - API error:', apiError);
          setJobs([]);
          
          if (apiError.name === 'SyntaxError' && apiError.message.includes('Unexpected token')) {
            setError('The server returned an invalid response. This might be a temporary issue with the API. Please try again later.');
          } else {
            setError(apiError.message || 'Failed to load jobs. The server might be down.');
          }
        }
      } catch (error: any) {
        console.error('Jobs page - Error in fetch function:', error);
        setJobs([]);
        setError('An unexpected error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters]);

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleFilterChange = (newFilters: { location: string; salary: string; job_type: string }) => {
    setFilters(prev => ({
      ...prev,
      location: newFilters.location,
      salary_range: newFilters.salary,
      job_type: newFilters.job_type
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Section */}      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Next Job</h1>
          <p className="text-blue-100 mb-8">Search through thousands of job listings</p>

          <div className="bg-white/95 p-4 rounded-lg shadow-md backdrop-blur-sm">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search by title, company, or keyword..."
              initialValue={filters.search}
              variant="light"
            />
          </div>
        </div>
      </section>

      {/* Filters and Jobs List */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <JobFilter onFilterChange={handleFilterChange} />
          </div>          {/* Jobs List */}
          <div className="lg:col-span-3">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg mb-6">
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}
            {loading ? (
              <div className="grid gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>            ) : jobs.length > 0 ? (
              <div className="grid gap-6">
                {jobs.map((job) => (
                  <SafeJobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Hech qanday ish topilmadi.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}