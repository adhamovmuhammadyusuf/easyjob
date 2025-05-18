import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { jobAPI } from '../api';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyForm, setApplyForm] = useState({
    message: '',
    resume: null as File | null,
  });
  const [isApplying, setIsApplying] = useState(false);
  const [applyStatus, setApplyStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        if (id) {
          const jobData = await jobAPI.getJobById(id);
          setJob(jobData);
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleApplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setApplyForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setApplyForm((prev) => ({
        ...prev,
        resume: e.target.files![0],
      }));
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsApplying(true);
    setApplyStatus(null);

    try {
      await jobAPI.applyForJob(id, {
        message: applyForm.message,
        resume: applyForm.resume,
      });
      
      setApplyStatus({
        success: true,
        message: 'Your application has been submitted successfully!',
      });
      
      // Reset form
      setApplyForm({
        message: '',
        resume: null,
      });
    } catch (err: any) {
      console.error('Error applying for job:', err);
      setApplyStatus({
        success: false,
        message: err.response?.data?.detail || 'Failed to submit your application. Please try again.',
      });
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="bg-white min-h-screen px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-max mx-auto">
          <h2 className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">
            Error
          </h2>
          <p className="mt-2 text-base text-gray-500">
            {error || 'Job not found. It may have been removed or is no longer available.'}
          </p>
          <div className="mt-6">
            <a
              href="/jobs"
              className="text-base font-medium text-indigo-600 hover:text-indigo-500"
            >
              Go back to jobs<span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Job header */}
          <div className="px-6 py-8 border-b border-gray-200 sm:px-10">
            <div className="flex items-center">
              <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                {job.company?.logo ? (
                  <img
                    src={job.company.logo}
                    alt={job.company_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-medium text-gray-500">
                    {job.company_name?.charAt(0)}
                  </span>
                )}
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <p className="text-base text-gray-600">{job.company_name}</p>
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
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 lg:divide-x">
            {/* Main content */}
            <div className="lg:col-span-2 p-6 sm:p-10">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Job Description</h2>
                <div className="mt-4 prose prose-indigo max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: job.description }}></div>
              </div>

              <div className="mt-10">
                <h2 className="text-lg font-medium text-gray-900">Requirements</h2>
                <div className="mt-4 prose prose-indigo max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: job.requirements }}></div>
              </div>

              <div className="mt-10">
                <h2 className="text-lg font-medium text-gray-900">Responsibilities</h2>
                <div className="mt-4 prose prose-indigo max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: job.responsibilities }}></div>
              </div>

              {job.skills_list && job.skills_list.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-lg font-medium text-gray-900">Skills</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.skills_list.map((skill) => (
                      <span
                        key={skill.id}
                        className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 p-6 sm:p-10">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Job Details</h2>
                <dl className="mt-4 space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                    <dd className="mt-1 text-sm text-gray-900">{job.location}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Salary</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {job.salary_min && job.salary_max
                        ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
                        : 'Not specified'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Experience</dt>
                    <dd className="mt-1 text-sm text-gray-900">{job.experience}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Employment Type</dt>
                    <dd className="mt-1 text-sm text-gray-900">{job.job_type}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Posted On</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(job.created_at).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Application Deadline</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {job.deadline
                        ? new Date(job.deadline).toLocaleDateString()
                        : 'Not specified'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-10">
                <h2 className="text-lg font-medium text-gray-900">About the Company</h2>
                <div className="mt-4">
                  <p className="text-sm text-gray-700">
                    {job.company?.description || 'No company description available.'}
                  </p>
                </div>
                {job.company?.website && (
                  <div className="mt-4">
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Visit company website
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-10">
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => {
                    const applySection = document.getElementById('apply-section');
                    if (applySection) {
                      applySection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Apply for this job
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Application form */}
        <div id="apply-section" className="mt-12 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200 sm:px-10">
            <h2 className="text-2xl font-bold text-gray-900">Apply for this position</h2>
          </div>
          <div className="px-6 py-8 sm:px-10">
            {applyStatus && (
              <div
                className={`mb-6 rounded-md p-4 ${
                  applyStatus.success ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    {applyStatus.success ? (
                      <svg
                        className="h-5 w-5 text-green-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3
                      className={`text-sm font-medium ${
                        applyStatus.success ? 'text-green-800' : 'text-red-800'
                      }`}
                    >
                      {applyStatus.success ? 'Application Submitted' : 'Application Error'}
                    </h3>
                    <div
                      className={`mt-2 text-sm ${
                        applyStatus.success ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      <p>{applyStatus.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleApply}>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Cover Letter / Message
                </label>
                <div className="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Introduce yourself and explain why you're a good fit for this role"
                    value={applyForm.message}
                    onChange={handleApplyChange}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">Resume/CV</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="resume"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="resume"
                          name="resume"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC up to 10MB</p>
                    {applyForm.resume && (
                      <p className="text-sm text-indigo-600">{applyForm.resume.name}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isApplying}
                  className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isApplying ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
