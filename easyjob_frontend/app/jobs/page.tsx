'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchBar } from '@/components/SearchBar';
import { getJobs } from '@/lib/api/jobs';
import JobCard from '@/components/job-card';
import JobFilter from '@/components/job-filter';

interface Job {
  id: number;
  title: string;
  company_name: string;
  description: string;
  salary_range: string;
  location: string;
  created_at: string;
  job_type: string;
  company_logo?: string;
  category_name: string;
  skills_list: Array<{ id: number; name: string }>;
}

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
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    job_type: searchParams.get('job_type') || '',
    salary_range: '',
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await getJobs(filters);
        setJobs(response.results);
      } catch (error) {
        console.error('Error fetching jobs:', error);
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
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <div className="grid gap-6">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
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