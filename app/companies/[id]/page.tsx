"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Globe, Calendar, Briefcase } from "lucide-react"
import { apiClient } from "@/lib/api"
import { translations } from "@/lib/translations"

interface CompanyDetail {
  id: number
  name: string
  description: string
  website?: string
  logo?: string
  location: string
  created_at: string
  updated_at: string
}

interface Vacancy {
  id: number
  title: string
  location: string
  job_type: string
  experience_level: string
  salary_min: number
  salary_max: number
  created_at: string
  skills_list: Array<{ id: number; name: string }>
}

export default function CompanyDetailPage() {
  const params = useParams()
  const [company, setCompany] = useState<CompanyDetail | null>(null)
  const [jobs, setJobs] = useState<Vacancy[]>([])
  const [loading, setLoading] = useState(true)
  const [jobsLoading, setJobsLoading] = useState(true)

  useEffect(() => {
    fetchCompanyDetail()
    fetchCompanyJobs()
  }, [params.id])

  const fetchCompanyDetail = async () => {
    try {
      const data = await apiClient.getCompany(params.id as string)
      setCompany(data)
    } catch (error) {
      console.error("Error fetching company detail:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanyJobs = async () => {
    try {
      const searchParams = new URLSearchParams()
      searchParams.append("company", params.id as string)
      const data = await apiClient.getVacancies(searchParams)
      setJobs(Array.isArray(data) ? data : data.results || [])
    } catch (error) {
      console.error("Error fetching company jobs:", error)
      setJobs([])
    } finally {
      setJobsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{translations.companyNotFound}</h1>
          <Button asChild>
            <Link href="/companies">{translations.backToCompanies}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Company Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {company.logo ? (
                  <img
                    src={company.logo || "/placeholder.svg"}
                    alt={company.name}
                    className="w-20 h-20 object-contain"
                  />
                ) : (
                  <Building2 className="h-12 w-12 text-gray-400" />
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {company.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {translations.founded} {formatDate(company.created_at)}
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    {jobs.length} {translations.openPositions}
                  </div>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">{company.description}</p>

                <div className="flex space-x-4">
                  {company.website && (
                    <Button variant="outline" asChild>
                      <a href={company.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        {translations.visitWebsite}
                      </a>
                    </Button>
                  )}
                  <Button asChild>
                    <Link href={`/jobs?company=${company.id}`}>{translations.viewAllJobs}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Jobs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{translations.openPositions} ({jobs.length})</span>
              {jobs.length > 0 && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/jobs?company=${company.id}`}>{translations.viewAll}</Link>
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {jobsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse border rounded-lg p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex space-x-4">
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{translations.noOpenPositions}</h3>
                <p className="text-gray-500">{translations.noOpenPositionsDesc}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          <Link href={`/jobs/${job.id}`} className="hover:text-blue-600">
                            {job.title}
                          </Link>
                        </h3>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            {job.job_type.replace("_", " ")}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />${job.salary_min.toLocaleString()} - $
                            {job.salary_max.toLocaleString()}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{job.experience_level.replace("_", " ")}</Badge>
                          {job.skills_list.slice(0, 3).map((skill) => (
                            <Badge key={skill.id} variant="outline">
                              {skill.name}
                            </Badge>
                          ))}
                          {job.skills_list.length > 3 && (
                            <Badge variant="outline">+{job.skills_list.length - 3} more</Badge>
                          )}
                        </div>
                      </div>

                      <div className="ml-4">
                        <Button size="sm" asChild>
                          <Link href={`/jobs/${job.id}`}>{translations.viewDetails}</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {jobs.length > 5 && (
                  <div className="text-center pt-4">
                    <Button variant="outline" asChild>
                      <Link href={`/jobs?company=${company.id}`}>{translations.viewAllPositions}</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}