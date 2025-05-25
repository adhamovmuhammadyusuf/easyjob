const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

interface ApiResponse<T> {
  data: T
  status: number
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("access_token")

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, config)

    if (response.status === 401) {
      // Try to refresh token
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
        window.location.href = "/login"
        throw new Error("Authentication failed")
      }

      return retryResponse.json()
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async refreshToken(): Promise<void> {
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
      localStorage.setItem("access_token", data.access)
      localStorage.setItem("refresh_token", data.refresh)
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

  // Vacancy methods
  async getVacancies(params?: URLSearchParams) {
    const query = params ? `?${params.toString()}` : ""
    return this.request(`/vacancies/${query}`)
  }

  async getFeaturedVacancies() {
    return this.request("/vacancies/featured/")
  }

  async getVacancy(id: string) {
    return this.request(`/vacancies/${id}/`)
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

  // Company methods
  async getCompanies(params?: URLSearchParams) {
    const query = params ? `?${params.toString()}` : ""
    return this.request(`/companies/${query}`)
  }

  async getPopularCompanies() {
    return this.request("/companies/popular/")
  }

  async getCompany(id: string) {
    return this.request(`/companies/${id}/`)
  }

  // Resume methods
  async getResumes() {
    return this.request("/resumes/")
  }

  async createResume(formData: FormData) {
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
  async getApplications() {
    return this.request("/applications/")
  }

  // Categories and Skills
  async getCategories() {
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
}

export const apiClient = new ApiClient(API_BASE_URL)
