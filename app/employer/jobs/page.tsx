"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Eye, Edit, Trash2, Calendar, MapPin, DollarSign, Building2, Users } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { translations } from "@/lib/translations"

interface Job {
  id: number
  title: string
  category: {
    id: number
    name: string
  }
  experience_level: string
  job_type: string
  location: string
  is_active: boolean
  created_at: string
  applications_count: number
  company: {
    id: number
    name: string
  }
  company_name: string
}

export default function JobsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [company, setCompany] = useState<any>(null)

  useEffect(() => {
    if (user && user.user_type === "employer") {
      checkCompanyProfile()
    }
  }, [user])

  useEffect(() => {
    if (user && user.user_type === "employer" && company) {
      fetchJobs()
    }
  }, [user, company])

  const checkCompanyProfile = async () => {
    try {
      const data = await apiClient.getCompanies()
      const companies = Array.isArray(data) ? data : data.results || []
      setCompany(companies[0] || null)
      console.log('checkCompanyProfile: Fetched company', companies[0]);
    } catch (error) {
      console.error("Error checking company profile:", error)
      setCompany(null)
    }
  }

  const fetchJobs = async () => {
    try {
      setLoading(true)
      console.log('Fetching employer jobs...')
      console.log('fetchJobs: Current company object', company);

      if (!company || !company.id) {
        console.log("Company not found or ID is missing, skipping job fetch.");
        setLoading(false);
        return;
      }

      const data = await apiClient.getEmployerJobs()
      console.log('Jobs data:', data)
      const jobsList = Array.isArray(data) ? data : data.results || []
      setJobs(jobsList)
    } catch (error: any) {
      console.error('Error fetching jobs:', error)
      if (error.response) {
        console.error('Error response:', error.response)
        console.error('Error data:', error.response.data)
      }
      setError("Failed to load jobs. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (jobId: number) => {
    if (!confirm(translations.confirmDeleteJob)) {
      return
    }

    try {
      console.log(`Attempting to delete job with ID: ${jobId}`);
      await apiClient.deleteJob(jobId.toString())
      console.log(`Job ${jobId} deleted successfully.`);
      fetchJobs() // Refresh the list
    } catch (error: any) {
      console.error('Error deleting job:', error)
      if (error.response) {
        console.error('Error response data:', error.response.data)
        console.error('Error response status:', error.response.status)
      }
      alert(translations.failedToDeleteJob)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      !statusFilter ||
      statusFilter === "all" ||
      (statusFilter === "active" && job.is_active) ||
      (statusFilter === "inactive" && !job.is_active)
    return matchesSearch && matchesStatus
  })

  if (!user || user.user_type !== "employer") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{translations.accessDenied}</h1>
          <p className="text-gray-600 mb-4">{translations.employerAccessDeniedDescription}</p>
          <Button onClick={() => router.push("/")}>{translations.goHome}</Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{translations.loading}</h1>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{translations.error}</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push("/employer/dashboard")}>{translations.backToDashboard}</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{translations.myJobs}</h1>
            <p className="text-gray-600 mt-2">{translations.manageJobPostings}</p>
          </div>
          <Button asChild>
            <Link href="/employer/jobs/create">
              <Plus className="h-4 w-4 mr-2" />
              {translations.postNewJob}
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={translations.searchJobTitles}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={translations.filterByStatus} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{translations.allJobs}</SelectItem>
                <SelectItem value="active">{translations.active}</SelectItem>
                <SelectItem value="inactive">{translations.inactive}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {jobs.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{translations.noJobsPostedYet}</h2>
              <p className="text-gray-600 mb-4">{translations.startPostingFirstJob}</p>
              <Button asChild>
                <Link href="/employer/jobs/create">
                  <Plus className="h-4 w-4 mr-2" />
                  {translations.postNewJob}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredJobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        <Link href={`/jobs/${job.id}`} className="hover:text-blue-600">
                          {job.title}
                        </Link>
                      </h2>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Building2 className="h-4 w-4 mr-2" />
                        {job.company && job.company.id ? (
                          <Link href={`/companies/${job.company.id}`} className="hover:text-blue-600">
                            {job.company_name}
                          </Link>
                        ) : (
                          <span>{job.company_name || 'N/A'}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary">{job.category.name}</Badge>
                        <Badge variant="secondary">{job.experience_level}</Badge>
                        <Badge variant="secondary">{job.job_type}</Badge>
                        <Badge
                          className={job.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                        >
                          {job.is_active ? translations.active : translations.inactive}
                        </Badge>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        {translations.posted}: {formatDate(job.created_at)}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/employer/jobs/${job.id}/applications`}>
                          <Users className="h-4 w-4 mr-2" />
                          {translations.applications} ({job.applications_count})
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/employer/jobs/${job.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          {translations.editJob}
                        </Link>
                      </Button>
                      <Button
                        variant="outline" size="sm" className="text-red-600 hover:text-red-800 border-red-600 hover:border-red-800"
                        onClick={() => handleDelete(job.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {translations.deleteJob}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
