const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export interface ApiResponse<T> {
  data: T
  status: number
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  next?: string
  previous?: string
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
    console.log(`API Client Request: Checking token for ${endpoint}. Value:`, token);
    console.log('API Request - Endpoint:', endpoint)
    console.log('API Request - Token:', token ? 'Present' : 'Not Present')
    if (token) {
      console.log('API Request - First 10 chars of Token:', token.substring(0, 10))
    }

    const finalHeaders: HeadersInit = {
      // Start with headers passed in options, or an empty object if none
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      finalHeaders["Authorization"] = `Bearer ${token}`;
    }

    // If body is FormData, let the browser set Content-Type automatically
    // Otherwise, ensure Content-Type is application/json
    if (!(options.body instanceof FormData)) {
      finalHeaders["Content-Type"] = "application/json";
    }

    // Ensure options doesn't contain a headers property that would overwrite our finalHeaders
    const { headers: omittedHeaders, ...restOptions } = options;

    const config: RequestInit = {
      headers: finalHeaders, // Use our carefully constructed finalHeaders
      ...restOptions, // Spread the rest of the options
    };

    console.log('API Client Request - Final Headers (Auth):', (config.headers as Record<string, string>)["Authorization"]);

    // Add timeout to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...config,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.status === 204) {
        return {} as T; // Return an empty object for 204 No Content
      }

      if (response.status === 401 && typeof window !== "undefined") {
        // Try to refresh token
        try {
          await this.refreshToken()
          // Retry the request
          const retryResponse = await fetch(`${this.baseURL}${endpoint}`, {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          })

          if (!retryResponse.ok) {
            localStorage.removeItem("access_token")
            localStorage.removeItem("refresh_token")
            if (retryResponse.status === 401) {
              window.location.href = "/login"
            }
            throw new Error(`HTTP error! status: ${retryResponse.status}`)
          }

          return retryResponse.json()
        } catch (refreshError) {
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
          throw new Error("Authentication failed")
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("Request timeout: Server is taking too long to respond")
        }
        if (error.message.includes("fetch") || error.message.includes("NetworkError")) {
          throw new Error("Network error: Unable to connect to server. Please check your internet connection.")
        }
      }
      throw error
    }
  }

  async refreshToken(): Promise<void> {
    if (typeof window === "undefined") return

    const refreshToken = localStorage.getItem("refresh_token")
    if (!refreshToken) {
      throw new Error("No refresh token available")
    }

    const response = await fetch(`${this.baseURL}/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    if (response.ok) {
      const data = await response.json()
      localStorage.setItem("access_token", data.access)
    } else {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      throw new Error("Token refresh failed")
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await fetch(`${this.baseURL}/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      const data = await response.json()
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", data.access)
        localStorage.setItem("refresh_token", data.refresh)
      }
      return data
    } else {
      throw new Error("Login failed")
    }
  }

  async register(userData: any) {
    return this.request("/users/", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async getCurrentUser() {
    return this.request("/users/me/")
  }

  async updateCurrentUser(userData: FormData) {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    // Do NOT set Content-Type for FormData, browser sets it automatically with boundary
    const response = await fetch(`${this.baseURL}/users/me/`, {
      method: "PATCH",
      headers: headers,
      body: userData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error updating current user:', errorData);
      throw new Error(errorData.detail || errorData.message || "Failed to update user profile");
    }

    return response.json();
  }

  // Vacancy methods
  async getVacancies(params?: URLSearchParams): Promise<PaginatedResponse<any>> {
    const query = params ? `?${params.toString()}` : ""
    return this.request(`/vacancies/${query}`)
  }

  async getFeaturedVacancies() {
    return this.request("/vacancies/featured/")
  }

  async getVacancy(id: string) {
    try {
      console.log('Fetching vacancy with ID:', id)
      const response = await this.request(`/vacancies/${id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      console.log('Vacancy response:', response)
      return response
    } catch (error: any) {
      console.error('Error fetching vacancy:', error)
      if (error.response && error.response.status === 404) {
        console.log('Vacancy not found.');
        return null;
      }
      if (error.response) {
        console.error('Error response:', error.response)
        console.error('Error data:', error.response.data)
      }
      throw error
    }
  }

  async applyToVacancy(vacancyId: string, resumeId: string, coverLetter: string) {
    return this.request(`/vacancies/${vacancyId}/apply/`, {
      method: "POST",
      body: JSON.stringify({
        resume: resumeId,
        cover_letter: coverLetter,
      }),
    })
  }

  // Employer-specific vacancy methods
  async getEmployerJobs(): Promise<PaginatedResponse<any>> {
    return this.request("/vacancies/?my_jobs=true")
  }

  async createJob(jobData: any) {
    return this.request("/vacancies/", {
      method: "POST",
      body: JSON.stringify(jobData),
    })
  }

  async updateJob(jobId: string, jobData: any) {
    return this.request(`/vacancies/${jobId}/`, {
      method: "PATCH",
      body: JSON.stringify(jobData),
    })
  }

  async deleteJob(jobId: string) {
    return this.request(`/vacancies/${jobId}/`, {
      method: "DELETE",
    })
  }

  // Company methods
  async getCompanies(params?: URLSearchParams): Promise<PaginatedResponse<any>> {
    const query = params ? `?${params.toString()}` : ""
    return this.request(`/companies/${query}`)
  }

  async getPopularCompanies(): Promise<PaginatedResponse<any>> {
    return this.request("/companies/popular/")
  }

  async getCompany(id: string): Promise<any> {
    return this.request(`/companies/${id}/`)
  }

  // Company management methods (for employers)
  async getMyCompany(): Promise<any> {
    return this.request("/companies/me/")
  }

  async createCompany(companyData: FormData): Promise<any> {
    return this.request("/companies/", {
      method: "POST",
      body: companyData,
    })
  }

  async updateCompany(companyId: string, companyData: FormData) {
    return this.request(`/companies/${companyId}/`, {
      method: "PATCH",
      body: companyData,
    })
  }

  // Resume methods (Job Seekers only)
  async getResumes() {
    return this.request("/resumes/")
  }

  async createResume(formData: FormData) {
    if (typeof window === "undefined") throw new Error("Cannot upload files on server side")

    const token = localStorage.getItem("access_token")
    const response = await fetch(`${this.baseURL}/resumes/`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to create resume")
    }

    return response.json()
  }

  // Application methods
  async getApplications(): Promise<PaginatedResponse<any>> {
    return this.request("/applications/")
  }

  async updateApplicationStatus(applicationId: string, status: string) {
    return this.request(`/applications/${applicationId}/update_status/`, {
      method: "POST",
      body: JSON.stringify({ status }),
    })
  }

  // Categories and Skills
  async getCategories(): Promise<PaginatedResponse<any>> {
    return this.request("/categories/")
  }

  async getSkills(search?: string) {
    const query = search ? `?search=${search}` : ""
    return this.request(`/skills/${query}`)
  }

  // Contact
  async getContact() {
    return this.request("/contact/")
  }

  // Statistics methods
  async getJobStats() {
    return this.request("/vacancies/?page_size=1")
  }

  async getCompanyStats() {
    return this.request("/companies/?page_size=1")
  }

  async getUserStats() {
    return this.request("/users/?page_size=1")
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      return response.ok
    } catch (error) {
      return false
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
