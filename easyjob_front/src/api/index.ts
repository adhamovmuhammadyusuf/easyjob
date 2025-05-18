import axios from 'axios';

// Define common interfaces
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  profile_image?: string;
  phone_number?: string;
}

export interface Job {
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
  is_active?: boolean;
  applications_count?: number;
}

export interface Company {
  id: number;
  name: string;
  location: string;
  logo?: string;
  description?: string;
  website?: string;
  user?: number;
}

export interface Resume {
  id: number;
  title: string;
  file: string;
  created_at: string;
  user?: number;
}

export interface Application {
  id: number;
  user_name: string;
  vacancy_id: number;
  vacancy_title: string;
  vacancy_location?: string;
  company_name: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  resume?: string;
}

export interface SavedJob extends Job {
  saved_at: string;
}

export interface ApiResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
}

// Create an axios instance with a base URL for our API
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add the token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Define API endpoints
export const authAPI = {
  login: async (credentials: { email: string; password: string }): Promise<{ access: string; refresh: string }> => {
    const response = await api.post('/token/', credentials);
    return response.data;
  },
  register: async (userData: any): Promise<User> => {
    const response = await api.post('/users/', userData);
    return response.data;
  },
  getProfile: async (): Promise<User> => {
    const response = await api.get('/users/me/');
    return response.data;
  },
  updateProfile: async (data: Partial<User> | FormData): Promise<User> => {
    const response = await api.patch('/users/me/', data);
    return response.data;
  },
};

export const jobAPI = {
  getJobs: async (params?: any): Promise<ApiResponse<Job>> => {
    const response = await api.get('/vacancies/', { params });
    return response.data;
  },
  getJobById: async (id: string): Promise<Job> => {
    const response = await api.get(`/vacancies/${id}/`);
    return response.data;
  },
  applyForJob: async (jobId: string, data: any): Promise<Application> => {
    const response = await api.post(`/applications/`, {
      vacancy: jobId,
      ...data,
    });
    return response.data;
  },
  getUserJobs: async (): Promise<ApiResponse<Job>> => {
    const response = await api.get('/vacancies/user/');
    return response.data;
  },
  getApplications: async (): Promise<ApiResponse<Application>> => {
    const response = await api.get('/applications/');
    return response.data;
  },
  getUserApplications: async (): Promise<ApiResponse<Application>> => {
    const response = await api.get('/applications/user/');
    return response.data;
  },
  getSavedJobs: async (): Promise<ApiResponse<SavedJob>> => {
    const response = await api.get('/saved-jobs/');
    return response.data;
  },
  saveJob: async (jobId: string): Promise<SavedJob> => {
    const response = await api.post('/saved-jobs/', { vacancy: jobId });
    return response.data;
  },
  unsaveJob: async (jobId: string): Promise<void> => {
    const response = await api.delete(`/saved-jobs/${jobId}/`);
    return response.data;
  },
};

export const companyAPI = {
  getCompanies: async (params?: any): Promise<ApiResponse<Company>> => {
    const response = await api.get('/companies/', { params });
    return response.data;
  },
  getCompanyById: async (id: string): Promise<Company> => {
    const response = await api.get(`/companies/${id}/`);
    return response.data;
  },
  createCompany: async (data: Partial<Company> | FormData): Promise<Company> => {
    const response = await api.post('/companies/', data);
    return response.data;
  },
  updateCompany: async (id: string, data: Partial<Company> | FormData): Promise<Company> => {
    const response = await api.patch(`/companies/${id}/`, data);
    return response.data;
  },
  getUserCompanies: async (): Promise<ApiResponse<Company>> => {
    const response = await api.get('/companies/user/');
    return response.data;
  },
};

export const categoryAPI = {
  getCategories: async () => {
    const response = await api.get('/categories/');
    return response.data;
  },
};

export const skillAPI = {
  getSkills: async () => {
    const response = await api.get('/skills/');
    return response.data;
  },
};

export const contactAPI = {
  sendMessage: async (data: any) => {
    const response = await api.post('/contacts/', data);
    return response.data;
  },
};

export const resumeAPI = {
  getResumes: async (): Promise<ApiResponse<Resume>> => {
    const response = await api.get('/resumes/');
    return response.data;
  },
  getUserResumes: async (): Promise<ApiResponse<Resume>> => {
    const response = await api.get('/resumes/user/');
    return response.data;
  },
  getResumeById: async (id: string): Promise<Resume> => {
    const response = await api.get(`/resumes/${id}/`);
    return response.data;
  },
  createResume: async (data: any): Promise<Resume> => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'file' && data[key]) {
        formData.append('file', data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });
    const response = await api.post('/resumes/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },  updateResume: async (id: string, data: any): Promise<Resume> => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'file' && data[key]) {
        formData.append('file', data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });
    const response = await api.patch(`/resumes/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  deleteResume: async (id: string): Promise<void> => {
    const response = await api.delete(`/resumes/${id}/`);
    return response.data;
  },
};

export default api;
