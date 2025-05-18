import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { companyAPI, jobAPI } from '../api';
import type { Company, Job, Application } from '../api';
import { handleApiError } from '../utils/errorHandling';

const Dashboard = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        if (user?.user_type === 'employer') {
          // For employers, fetch their companies and jobs
          const [companiesData, jobsData, applicationsData] = await Promise.all([
            companyAPI.getUserCompanies(),
            jobAPI.getUserJobs(),
            jobAPI.getApplications(),
          ]);
          
          setCompanies(companiesData.results || []);
          setJobs(jobsData.results || []);
          setApplications(applicationsData.results || []);
        } else {
          // For job seekers, fetch their applications
          const applicationsData = await jobAPI.getUserApplications();
          setApplications(applicationsData.results || []);
        }
      } catch (error) {
        const errorMessage = handleApiError(error, 'Error fetching dashboard data');
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {user?.user_type === 'employer' ? (
          <>
            {/* Tabs for employer dashboard */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`${
                    activeTab === 'jobs'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Jobs
                </button>
                <button
                  onClick={() => setActiveTab('companies')}
                  className={`${
                    activeTab === 'companies'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Companies
                </button>
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`${
                    activeTab === 'applications'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Applications
                </button>
              </nav>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'jobs' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Your Job Listings</h2>
                  <a
                    href="/jobs/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Post New Job
                  </a>
                </div>

                {jobs.length > 0 ? (
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {jobs.map((job) => (
                        <li key={job.id}>
                          <a href={`/jobs/${job.id}`} className="block hover:bg-gray-50">
                            <div className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <p className="text-sm font-medium text-indigo-600 truncate">
                                    {job.title}
                                  </p>
                                  <div className="ml-2 flex-shrink-0 flex">
                                    <p
                                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        job.is_active
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-red-100 text-red-800'
                                      }`}
                                    >
                                      {job.is_active ? 'Active' : 'Inactive'}
                                    </p>
                                  </div>
                                </div>
                                <div className="ml-2 flex-shrink-0 flex">
                                  <p className="text-sm text-gray-500">
                                    {job.applications_count || 0} applications
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                  <p className="flex items-center text-sm text-gray-500">
                                    {job.category_name}
                                  </p>
                                  <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                    {job.location}
                                  </p>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                  <p>
                                    Posted on{' '}
                                    {new Date(job.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No jobs posted yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Get started by creating your first job listing
                    </p>
                    <a
                      href="/jobs/create"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Post a Job
                    </a>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'companies' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Your Companies</h2>
                  <a
                    href="/companies/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Company
                  </a>
                </div>

                {companies.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {companies.map((company) => (
                      <div
                        key={company.id}
                        className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
                      >
                        <div className="px-4 py-5 sm:px-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-700 text-xl font-bold">
                              {company.logo ? (
                                <img
                                  src={company.logo}
                                  alt={company.name}
                                  className="h-10 w-10 rounded-full"
                                />
                              ) : (
                                company.name.charAt(0)
                              )}
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-medium text-gray-900">
                                {company.name}
                              </h3>
                              <p className="text-sm text-gray-500">{company.location}</p>
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex justify-between text-sm">
                            <a
                              href={`/companies/${company.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View Details
                            </a>
                            <a
                              href={`/companies/${company.id}/edit`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No companies added yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Add your company to start posting jobs
                    </p>
                    <a
                      href="/companies/create"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Add Company
                    </a>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'applications' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Job Applications
                </h2>

                {applications.length > 0 ? (
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {applications.map((application) => (
                        <li key={application.id}>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <p className="text-sm font-medium text-indigo-600 truncate">
                                  {application.user_name} - {application.vacancy_title}
                                </p>
                                <div className="ml-2 flex-shrink-0 flex">
                                  <p
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      application.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : application.status === 'accepted'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {application.status}
                                  </p>
                                </div>
                              </div>
                              <div className="ml-2 flex-shrink-0 flex space-x-2">
                                <a
                                  href={`/applications/${application.id}`}
                                  className="text-sm text-indigo-600 hover:text-indigo-900"
                                >
                                  View Details
                                </a>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                {application.resume && (
                                  <a
                                    href={application.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-indigo-600 hover:text-indigo-900"
                                  >
                                    View Resume
                                  </a>
                                )}
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <p>
                                  Applied on{' '}
                                  {new Date(application.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No applications yet
                    </h3>
                    <p className="text-gray-500">
                      When job seekers apply to your jobs, they'll appear here
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          // For job seekers
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Applications</h2>

            {applications.length > 0 ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {applications.map((application) => (
                    <li key={application.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <a
                              href={`/jobs/${application.vacancy_id}`}
                              className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                            >
                              {application.vacancy_title}
                            </a>
                            <p className="text-sm text-gray-500">
                              {application.company_name}
                            </p>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                application.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : application.status === 'accepted'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {application.status}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {application.vacancy_location}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>
                              Applied on{' '}
                              {new Date(application.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No applications yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Start applying to jobs to track your applications here
                </p>
                <a
                  href="/jobs"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Browse Jobs
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
