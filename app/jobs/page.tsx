"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Clock } from "lucide-react"
import { apiClient } from "@/lib/api"
import { translations } from "@/lib/translations"
import { PaginatedResponse } from "@/lib/api"

interface Vacancy {
  id: number
  title: string
  company_name: string
  location: string
  job_type: string
  experience_level: string
  salary_min: number
  salary_max: number
  created_at: string
  skills_list: Array<{ id: number; name: string }>
}

interface Category {
  id: number
  name: string
}

export default function JobsPage() {
  const searchParams = useSearchParams()
  const [jobs, setJobs] = useState<Vacancy[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "")
  const [selectedJobType, setSelectedJobType] = useState("")
  const [selectedExperience, setSelectedExperience] = useState("")
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalJobs, setTotalJobs] = useState(0)

  useEffect(() => {
    fetchJobs()
    fetchCategories()
  }, [searchParams, currentPage])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (searchQuery) params.append("search", searchQuery)
      if (selectedCategory && selectedCategory !== "") params.append("category", selectedCategory)
      if (selectedJobType && selectedJobType !== "" && selectedJobType !== "all_types")
        params.append("job_type", selectedJobType)
      if (selectedExperience && selectedExperience !== "") params.append("experience_level", selectedExperience)
      params.append("page", currentPage.toString())

      const response: PaginatedResponse<Vacancy> = await apiClient.getVacancies(params)
      setJobs(Array.isArray(response.results) ? response.results : [])
      setTotalJobs(response.count)
      setTotalPages(Math.ceil(response.count / 10)) // Assuming PAGE_SIZE is 10
    } catch (error) {
      console.error("Error fetching jobs:", error)
      setJobs([])
      setTotalJobs(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data: PaginatedResponse<Category> = await apiClient.getCategories()
      setCategories(Array.isArray(data) ? data : data.results || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
      setCategories([])
    }
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.append("search", searchQuery)
    if (selectedCategory && selectedCategory !== "") params.append("category", selectedCategory)
    if (selectedJobType && selectedJobType !== "" && selectedJobType !== "all_types")
      params.append("job_type", selectedJobType)
    if (selectedExperience && selectedExperience !== "") params.append("experience_level", selectedExperience)
    params.append("page", currentPage.toString())

    const newUrl = `/jobs?${params.toString()}`;
    window.history.pushState({}, "", newUrl);
    fetchJobs();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <Input
                type="text"
                placeholder={translations.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder={translations.category} />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(categories) &&
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select value={selectedJobType} onValueChange={setSelectedJobType}>
              <SelectTrigger>
                <SelectValue placeholder={translations.jobType} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_types">{translations.any}</SelectItem>
                <SelectItem value="full_time">{translations.fullTime}</SelectItem>
                <SelectItem value="part_time">{translations.partTime}</SelectItem>
                <SelectItem value="contract">{translations.contract}</SelectItem>
                <SelectItem value="internship">{translations.internship}</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleSearch} className="w-full">
              <Search className="h-4 w-4 mr-2" />
              {translations.searchJobs}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory("")
                setSelectedJobType("")
                setSelectedExperience("")
                setSearchQuery("")
              }}
              className="w-full"
            >
              {translations.clearFilters}
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{loading ? "Yuklanmoqda..." : `${totalJobs} ${translations.allJobs}`}</h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {Array.isArray(jobs) &&
              jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          <Link href={`/jobs/${job.id}`} className="hover:text-blue-600">
                            {job.title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 mb-4">{job.company_name}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {job.job_type.replace(/_/g, " ") === "full time" ? translations.fullTime : job.job_type.replace(/_/g, " ") === "part time" ? translations.partTime : job.job_type.replace(/_/g, " ") === "contract" ? translations.contract : job.job_type.replace(/_/g, " ") === "internship" ? translations.internship : job.job_type.replace(/_/g, " ")}
                          </div>
                          <div className="flex items-center">
                            {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="secondary">{job.experience_level.replace(/_/g, " ") === "entry" ? translations.entry : job.experience_level.replace(/_/g, " ") === "mid" ? translations.mid : job.experience_level.replace(/_/g, " ") === "senior" ? translations.senior : job.experience_level.replace(/_/g, " ")}</Badge>
                          {Array.isArray(job.skills_list) &&
                            job.skills_list.slice(0, 3).map((skill) => (
                              <Badge key={skill.id} variant="outline">
                                {skill.name}
                              </Badge>
                            ))}
                          {Array.isArray(job.skills_list) && job.skills_list.length > 3 && (
                            <Badge variant="outline">+{job.skills_list.length - 3} {translations.more}</Badge>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-4">{formatDate(job.created_at) === "1 day ago" ? "1 kun oldin" : formatDate(job.created_at).includes("days ago") ? `${parseInt(formatDate(job.created_at))} kun oldin` : formatDate(job.created_at).includes("weeks ago") ? `${parseInt(formatDate(job.created_at))} hafta oldin` : formatDate(job.created_at).includes("months ago") ? `${parseInt(formatDate(job.created_at))} oy oldin` : formatDate(job.created_at)}</p>
                        <Button asChild>
                          <Link href={`/jobs/${job.id}`}>{translations.viewDetails}</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button
            variant="outline"
            onClick={() => {
              const newPage = Math.max(1, currentPage - 1);
              setCurrentPage(newPage);
              const params = new URLSearchParams(window.location.search);
              params.set("page", newPage.toString());
              window.history.pushState({}, "", `/jobs?${params.toString()}`);
            }}
            disabled={currentPage === 1}
          >
            {translations.previous}
          </Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i + 1}
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => {
                const newPage = i + 1;
                setCurrentPage(newPage);
                const params = new URLSearchParams(window.location.search);
                params.set("page", newPage.toString());
                window.history.pushState({}, "", `/jobs?${params.toString()}`);
              }}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              const newPage = Math.min(totalPages, currentPage + 1);
              setCurrentPage(newPage);
              const params = new URLSearchParams(window.location.search);
              params.set("page", newPage.toString());
              window.history.pushState({}, "", `/jobs?${params.toString()}`);
            }}
            disabled={currentPage === totalPages}
          >
            {translations.next}
          </Button>
        </div>
      </div>
    </div>
  )
}