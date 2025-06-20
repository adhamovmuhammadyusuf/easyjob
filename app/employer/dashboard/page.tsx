"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Users, Eye, Plus, TrendingUp } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { translations } from "@/lib/translations"
import { PaginatedResponse } from "@/lib/api"

interface DashboardStats {
  totalJobs: number
  activeJobs: number
  totalApplications: number
  pendingApplications: number
}

interface RecentJob {
  id: number
  title: string
  applications_count: number
  is_active: boolean
  created_at: string
}

interface RecentApplication {
  id: number
  user_name: string
  vacancy_title: string
  status: string
  created_at: string
}

export default function EmployerDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
  })
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([])
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [company, setCompany] = useState<any>(null)

  useEffect(() => {
    if (user && user.user_type === "employer") {
      checkCompanyProfile()
    }
  }, [user])

  useEffect(() => {
    if (user && user.user_type === "employer" && company) {
      fetchDashboardData()
    }
  }, [user, company])

  const checkCompanyProfile = async () => {
    try {
      const data = (await apiClient.getCompanies(new URLSearchParams({ owner: "me" }))) as PaginatedResponse<any>
      const companies = data.results || []
      setCompany(companies[0] || null)
    } catch (error) {
      console.error("Error checking company profile:", error)
      setCompany(null)
    }
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      if (!company || !company.id) {
        console.log("Company not found or ID is missing, skipping job fetch.");
        setLoading(false);
        return;
      }

      // Fetch employer's jobs and applications
      console.log('Fetching employer jobs...')
      const jobsData = (await apiClient.getEmployerJobs()) as PaginatedResponse<RecentJob>
      console.log('Jobs data:', jobsData)

      console.log('Fetching applications...')
      const applicationsData = (await apiClient.getApplications()) as PaginatedResponse<RecentApplication>
      console.log('Applications data:', applicationsData)

      if (!jobsData || !applicationsData) {
        console.error('No data received from API')
        return
      }

      const jobs = jobsData.results || []
      const applications = applicationsData.results || []

      console.log('Processed jobs:', jobs)
      console.log('Processed applications:', applications)

      // Calculate stats
      const activeJobs = jobs.filter((job: any) => job.is_active).length
      const pendingApps = applications.filter((app: any) => app.status === "pending").length

      setStats({
        totalJobs: jobs.length,
        activeJobs: activeJobs,
        totalApplications: applications.length,
        pendingApplications: pendingApps,
      })

      // Set recent data
      setRecentJobs(jobs.slice(0, 5))
      setRecentApplications(applications.slice(0, 5))
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error)
      if (error.response) {
        console.error('Error response:', error.response)
        console.error('Error data:', error.response.data)
      }
      // Show error message to user
      alert(translations.failedToLoadDashboardData)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "reviewing":
        return "bg-blue-100 text-blue-800"
      case "shortlisted":
        return "bg-green-100 text-green-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user || user.user_type !== "employer") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{translations.accessDenied}</h1>
          <p className="text-gray-600 mb-4">{translations.accessDeniedDescription}</p>
          <Button asChild>
            <Link href="/">{translations.goHome}</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{translations.welcomeToEasyJob}</h1>
            <p className="text-gray-600 mb-8">
              {translations.createCompanyProfileDescription}
            </p>
            <Button onClick={() => router.push("/employer/company")}>
              {translations.createCompanyProfile}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{translations.employerDashboard}</h1>
            <p className="text-gray-600">{translations.welcomeBack} {user.first_name}!</p>
          </div>
          <Button asChild>
            <Link href="/employer/jobs/create">
              <Plus className="h-4 w-4 mr-2" />
              {translations.postNewJob}
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{translations.totalJobs}</CardTitle>
              <Briefcase className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.totalJobs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{translations.activeJobs}</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.activeJobs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{translations.totalApplications}</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.totalApplications}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{translations.pendingReviews}</CardTitle>
              <Eye className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.pendingApplications}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Job Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">{translations.recentJobPosts}</CardTitle>
              <Button asChild variant="link">
                <Link href="/employer/jobs">{translations.viewAll}</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading recent job posts...</p>
              ) : recentJobs.length === 0 ? (
                <p>No recent job posts.</p>
              ) : (
                <div className="space-y-4">
                  {recentJobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between bg-gray-100 p-4 rounded-md"
                    >
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-gray-600">{job.applications_count} {translations.applications} | {formatDate(job.created_at)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={job.is_active ? "default" : "secondary"}>
                          {job.is_active ? translations.active : translations.inactive}
                        </Badge>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/employer/jobs/${job.id}`}>{translations.view}</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">{translations.recentApplications}</CardTitle>
              <Button asChild variant="link">
                <Link href="/employer/applications">{translations.viewAll}</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>{translations.loading} {translations.recentApplications.toLowerCase()}...</p>
              ) : recentApplications.length === 0 ? (
                <p>{translations.noApplicationsFound}</p>
              ) : (
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between bg-gray-100 p-4 rounded-md"
                    >
                      <div>
                        <p className="font-medium">{app.user_name}</p>
                        <p className="text-sm text-gray-600">{app.vacancy_title} | {formatDate(app.created_at)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getStatusColor(app.status)}>
                          {translations[app.status as keyof typeof translations] || app.status}
                        </Badge>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/employer/jobs/${app.id}/applications`}>{translations.review}</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
