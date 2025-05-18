import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { resumeAPI, jobAPI } from '../api';
import type { Resume, SavedJob } from '../api';
import { handleApiError } from '../utils/errorHandling';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    profile_image: null as File | null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Fetch user's resumes and saved jobs
        const [resumesData, savedJobsData] = await Promise.all([
          resumeAPI.getUserResumes(),
          jobAPI.getSavedJobs(),
        ]);
        
        setResumes(resumesData.results || []);
        setSavedJobs(savedJobsData.results || []);
      } catch (error) {
        const errorMessage = handleApiError(error, 'Failed to load your profile data');
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileData((prev) => ({
        ...prev,
        profile_image: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('first_name', profileData.first_name);
      formData.append('last_name', profileData.last_name);
      formData.append('phone_number', profileData.phone_number || '');
      
      if (profileData.profile_image) {
        formData.append('profile_image', profileData.profile_image);
      }

      await updateUser(formData);
      alert('Profile updated successfully');
    } catch (error) {
      const errorMessage = handleApiError(error, 'Failed to update profile');
      alert(errorMessage);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`${
                activeTab === 'profile'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Personal Information
            </button>
            <button
              onClick={() => setActiveTab('resumes')}
              className={`${
                activeTab === 'resumes'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Resumes
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`${
                activeTab === 'saved'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Saved Jobs
            </button>
          </nav>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'profile' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="first_name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        value={profileData.first_name}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="last_name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        value={profileData.last_name}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={profileData.email}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="phone_number"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone number
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="phone_number"
                        id="phone_number"
                        value={profileData.phone_number}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label
                      htmlFor="profile_image"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Profile picture
                    </label>
                    <div className="mt-2 flex items-center">
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                        {user?.profile_image ? (
                          <img
                            src={user.profile_image}
                            alt={user.first_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <svg
                            className="h-full w-full text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        )}
                      </div>
                      <input
                        type="file"
                        name="profile_image"
                        id="profile_image"
                        onChange={handleFileChange}
                        className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        accept="image/*"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-5">
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'resumes' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Resumes</h2>
              <a
                href="/resumes/create"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Upload New Resume
              </a>
            </div>

            {resumes.length > 0 ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {resumes.map((resume) => (
                    <li key={resume.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <svg
                                className="h-8 w-8 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <h3 className="text-sm font-medium text-gray-900">
                                {resume.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {new Date(resume.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex space-x-4">
                            <a
                              href={resume.file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                            >
                              View
                            </a>
                            <button
                              className="text-red-600 hover:text-red-900 text-sm font-medium"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this resume?')) {
                                  resumeAPI.deleteResume(String(resume.id))
                                    .then(() => {
                                      setResumes(resumes.filter(r => r.id !== resume.id));
                                    })
                                    .catch((error) => {
                                      const errorMessage = handleApiError(error, 'Failed to delete resume');
                                      alert(errorMessage);
                                    });
                                }
                              }}
                            >
                              Delete
                            </button>
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
                  No resumes uploaded
                </h3>
                <p className="text-gray-500 mb-6">
                  Upload a resume to easily apply for jobs
                </p>
                <a
                  href="/resumes/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Upload Resume
                </a>
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Saved Jobs</h2>

            {savedJobs.length > 0 ? (
              <div className="space-y-4">
                {savedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white shadow overflow-hidden sm:rounded-lg hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="px-4 py-5 sm:px-6">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            <a href={`/jobs/${job.id}`} className="hover:text-indigo-600">
                              {job.title}
                            </a>
                          </h3>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            {job.company_name} • {job.location}
                          </p>
                        </div>
                        <div>
                          <button
                            onClick={() => {
                              jobAPI.unsaveJob(String(job.id))
                                .then(() => {
                                  setSavedJobs(savedJobs.filter(j => j.id !== job.id));
                                })
                                .catch((error) => {
                                  const errorMessage = handleApiError(error, 'Failed to remove saved job');
                                  alert(errorMessage);
                                });
                            }}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <svg
                              className="h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
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

                      <div className="mt-4 text-sm text-gray-500 line-clamp-2">
                        {job.description}
                      </div>

                      <div className="mt-6 flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          Saved on {new Date(job.saved_at).toLocaleDateString()}
                        </div>
                        <a
                          href={`/jobs/${job.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          View Job
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No saved jobs
                </h3>
                <p className="text-gray-500 mb-6">
                  When you save jobs, they'll appear here for easy access
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

export default Profile;
