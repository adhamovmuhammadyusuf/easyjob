"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Clock, DollarSign, Building2, Users, Briefcase } from "lucide-react"
import { apiClient } from "@/lib/api"

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

export default function HomePage() {
  const [featuredJobs, setFeaturedJobs] = useState<Vacancy[]>([])
  const [popularCompanies, setPopularCompanies] = useState<Company[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsData, companiesData, categoriesData] = await Promise.all([
          apiClient.getFeaturedVacancies(),
          apiClient.getPopularCompanies(),
          apiClient.getCategories(),
        ])
        setFeaturedJobs(jobsData)
        setPopularCompanies(companiesData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/jobs?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Find Your Dream Job</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover thousands of job opportunities from top companies
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto flex gap-2">
              <Input
                type="text"
                placeholder="Search for jobs, companies, or skills..."
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
              <h3 className="text-3xl font-bold text-gray-900 mb-2">1000+</h3>
              <p className="text-gray-600">Active Jobs</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">Companies</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">10K+</h3>
              <p className="text-gray-600">Job Seekers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Jobs</h2>
            <Button variant="outline" asChild>
              <Link href="/jobs">View All Jobs</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <p className="text-gray-600">{job.company_name}</p>
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
                      <DollarSign className="h-4 w-4 mr-1" />${job.salary_min.toLocaleString()} - $
                      {job.salary_max.toLocaleString()}
                    </div>
                  </div>
                  <Button className="w-full mt-4" asChild>
                    <Link href={`/jobs/${job.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Browse by Category</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 12).map((category) => (
              <Link
                key={category.id}
                href={`/jobs?category=${category.id}`}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center"
              >
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.vacancy_count} jobs</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Companies */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Popular Companies</h2>
            <Button variant="outline" asChild>
              <Link href="/companies">View All Companies</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {popularCompanies.map((company) => (
              <Link
                key={company.id}
                href={`/companies/${company.id}`}
                className="p-6 border rounded-lg hover:shadow-md transition-shadow text-center"
              >
                <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
                  {company.logo ? (
                    <img
                      src={company.logo || "/placeholder.svg"}
                      alt={company.name}
                      className="w-12 h-12 object-contain"
                    />
                  ) : (
                    <Building2 className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{company.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{company.location}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
