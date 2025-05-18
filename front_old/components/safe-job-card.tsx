'use client';

import React from 'react';
import JobCard from './job-card';
import { Job } from '../lib/api/types';

interface JobCardProps {
  job: Job;
}

const SafeJobCard = ({ job }: JobCardProps) => {
  try {
    // Safety checks for undefined values
    if (!job) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500">Job information unavailable</p>
        </div>
      );
    }    // Create a safe job object with fallbacks
    const safeJob = {
      ...job,
      id: job.id || 0,
      title: job.title || 'Untitled Position',
      company_name: job.company_name || 'Unknown Company',
      description: job.description || '',
      location: job.location || 'Remote/Flexible',
      created_at: job.created_at || new Date().toISOString(),
      job_type: job.job_type || 'Full-time',
      salary_min: job.salary_min || 0,
      salary_max: job.salary_max || 0,
      company_logo: job.company_logo || '',
      category_name: job.category_name || '',
      skills_list: Array.isArray(job.skills_list) ? job.skills_list : []
    };
    
    // Render the JobCard with safe values
    return <JobCard job={safeJob} />;
  } catch (error) {
    console.error('Error rendering JobCard:', error);
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-red-600">Error displaying job. Please try again later.</p>
      </div>
    );
  }
};

export default SafeJobCard;