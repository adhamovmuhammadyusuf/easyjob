"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Clock, Building2, Users, Briefcase } from "lucide-react"
import { apiClient } from "@/lib/api"
import { translations } from "@/lib/translations"
import { Badge } from "@/components/ui/badge"

interface Vacancy {
  id: number
  title: string
  company_name: string
  location: string
  job_type: string
  salary_min: number
  salary_max: number
  created_at: string
}

interface Company {
  id: number
  name: string
  location: string
  logo?: string
}

interface Category {
  id: number
  name: string
  vacancy_count: number
}

interface Stats {
  jobCount: number
  companyCount: number
  userCount: number
}

export default function HomePage() {
  const [featuredJobs, setFeaturedJobs] = useState<Vacancy[]>([])
  const [popularCompanies, setPopularCompanies] = useState<Company[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [stats, setStats] = useState<Stats>({
    jobCount: 0,
    companyCount: 0,
    userCount: 0,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsData, companiesData, categoriesData, jobStatsData, companyStatsData, userStatsData] =
          await Promise.all([
            apiClient.getFeaturedVacancies(),
            apiClient.getPopularCompanies(),
            apiClient.getCategories(),
            apiClient.getJobStats(),
            apiClient.getCompanyStats(),
            apiClient.getUserStats(),
          ])

        setFeaturedJobs(Array.isArray(jobsData) ? jobsData : jobsData.results || [])
        setPopularCompanies(Array.isArray(companiesData) ? companiesData : companiesData.results || [])
        setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.results || [])

        // Extract counts from API responses
        setStats({
          jobCount: jobStatsData.count || 0,
          companyCount: companyStatsData.count || 0,
          userCount: userStatsData.count || 0,
        })
      } catch (error) {
        console.error("Error fetching data:", error)
        // Set empty arrays and default stats as fallbacks
        setFeaturedJobs([])
        setPopularCompanies([])
        setCategories([])
        setStats({
          jobCount: 0,
          companyCount: 0,
          userCount: 0,
        })
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/api/categories/')
        setCategories(response.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/jobs?search=${encodeURIComponent(searchQuery)}`
    }
  }

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${Math.floor(count / 1000)}K+`
    }
    return `${count}+`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {translations.findDreamJob}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              {translations.discoverJobs}
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto flex gap-2">
              <Input
                type="text"
                placeholder={translations.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 h-12 text-gray-900"
              />
              <Button onClick={handleSearch} size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{formatCount(stats.jobCount)}</h3>
              <p className="text-gray-600">{translations.activeJobs}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{formatCount(stats.companyCount)}</h3>
              <p className="text-gray-600">{translations.companies}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{formatCount(stats.userCount)}</h3>
              <p className="text-gray-600">{translations.jobSeekers}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{translations.featuredJobs}</h2>
            <Button variant="outline" asChild>
              <Link href="/jobs">{translations.viewAllJobs}</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <CardDescription>{job.company_name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {job.job_type.replace("_", " ")}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()} {translations.currency}
                    </div>
                  </div>
                  <CardFooter>
                    <Button className="w-full mt-4" asChild>
                      <Link href={`/jobs/${job.id}`}>{translations.viewDetails}</Link>
                    </Button>
                  </CardFooter>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{translations.browseByCategory}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg animate-pulse bg-gray-100 h-24"
                />
              ))
            ) : (
              categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/jobs?category=${category.id}`}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.vacancy_count} ish</p>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Popular Companies */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{translations.popularCompanies}</h2>
            <Button variant="outline" asChild>
              <Link href="/companies">{translations.viewAllCompanies}</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCompanies.slice(0, 6).map((company) => (
              <Card key={company.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{company.name}</CardTitle>
                  <CardDescription>{company.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Building2 className="h-4 w-4 mr-1" />
                      {company.location}
                    </div>
                  </div>
                  <CardFooter>
                    <Button className="w-full mt-4" asChild>
                      <Link href={`/companies/${company.id}`}>{translations.viewDetails}</Link>
                    </Button>
                  </CardFooter>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
