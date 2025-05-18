import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { companyAPI, jobAPI } from '../api';

interface Job {
  id: number;
  title: string;
  description: string;
  category_name: string;
  job_type: string;
  experience: string;
  location: string;
  created_at: string;
  company: number;
  company_name: string;
}

const CompanyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<any>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        if (id) {
          const [companyData, jobsData] = await Promise.all([
            companyAPI.getCompanyById(id),
            jobAPI.getJobs({ company: id }),
          ]);
          setCompany(companyData);
          setJobs(jobsData.results || []);
        }
      } catch (err) {
        console.error('Error fetching company details:', err);
        setError('Failed to load company details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="bg-white min-h-screen px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-max mx-auto">
          <h2 className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">
            Error
          </h2>
          <p className="mt-2 text-base text-gray-500">
            {error || 'Company not found. It may have been removed or is no longer available.'}
          </p>
          <div className="mt-6">
            <a
              href="/companies"
              className="text-base font-medium text-indigo-600 hover:text-indigo-500"
            >
              Go back to companies<span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Company header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex-shrink-0 flex items-center justify-center h-24 w-24 rounded-md bg-gray-100 text-indigo-500 text-2xl font-bold overflow-hidden">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{company.name.charAt(0)}</span>
              )}
            </div>
            <div className="mt-4 md:mt-0 md:ml-6">
              <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <svg
                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                {company.location}
              </div>
              {company.website && (
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <svg
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    {company.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* About section */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About {company.name}</h2>
              <div className="prose max-w-none text-gray-500">
                <p>{company.description}</p>
              </div>
            </div>

            {/* Jobs section */}
            <div className="mt-8 bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Open Positions at {company.name}
              </h2>

              {jobs.length > 0 ? (
                <div className="space-y-6">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-indigo-500 transition-colors duration-200"
                    >
                      <a href={`/jobs/${job.id}`} className="block">
                        <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {job.category_name}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {job.job_type}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {job.experience}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <svg
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {job.location}
                        </div>
                        <div className="mt-2 text-sm text-gray-500 line-clamp-2">
                          {job.description}
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="text-xs text-gray-500">
                            Posted on {new Date(job.created_at).toLocaleDateString()}
                          </div>
                          <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                            View Job
                          </span>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No open positions at this time</p>
                </div>
              )}
            </div>
          </div>

          {/* Company info sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Company Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Founded</h3>
                  <p className="mt-1 text-base text-gray-900">
                    {company.founded_year || 'Not specified'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Industry</h3>
                  <p className="mt-1 text-base text-gray-900">
                    {company.industry || 'Not specified'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Company Size</h3>
                  <p className="mt-1 text-base text-gray-900">
                    {company.size || 'Not specified'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Headquarters</h3>
                  <p className="mt-1 text-base text-gray-900">{company.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                  <p className="mt-1 text-base text-gray-900">
                    {new Date(company.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="mt-8 bg-indigo-700 shadow rounded-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Interested in joining {company.name}?</h2>
              <p className="text-indigo-100 mb-6">
                Check out their open positions and apply today!
              </p>
              <a
                href="#jobs"
                className="w-full block text-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50"
              >
                View Open Positions
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
