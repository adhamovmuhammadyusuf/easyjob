"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, User, Calendar, FileText, Building2 } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { translations } from "@/lib/translations"

interface Application {
  id: number
  user_name: string
  vacancy_title: string
  company_name: string
  resume_title: string
  status: string
  cover_letter: string
  created_at: string
  updated_at: string
  vacancy: {
    id: number
    title: string
  }
  user: {
    id: number
    email: string
    first_name: string
    last_name: string
  }
}

export default function EmployerApplicationsPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  useEffect(() => {
    if (user && user.user_type === "employer") {
      fetchApplications()
    }
  }, [user])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getApplications()
      setApplications(Array.isArray(data) ? data : data.results || [])
    } catch (error) {
      console.error("Error fetching applications:", error)
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (applicationId: number, newStatus: string) => {
    try {
      await apiClient.updateApplicationStatus(applicationId.toString(), newStatus)
      // Update local state
      setApplications((prev) => prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app)))
    } catch (error) {
      console.error("Error updating application status:", error)
      alert("Failed to update application status")
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      application.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.vacancy_title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || statusFilter === "all_statuses" || application.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!user || user.user_type !== "employer") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{translations.accessDenied}</h1>
          <p className="text-gray-600 mb-4">{translations.employerAccessDeniedDescription}</p>
          <Button asChild>
            <Link href="/">{translations.goHome}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{translations.jobApplications}</h1>
            <p className="text-gray-600">{translations.reviewManageApplications}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={translations.searchCandidateJobTitle}
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
                <SelectItem value="all_statuses">{translations.allStatuses}</SelectItem>
                <SelectItem value="pending">{translations.pending}</SelectItem>
                <SelectItem value="reviewing">{translations.reviewing}</SelectItem>
                <SelectItem value="shortlisted">{translations.shortlisted}</SelectItem>
                <SelectItem value="accepted">{translations.accepted}</SelectItem>
                <SelectItem value="rejected">{translations.rejected}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{translations.noApplicationsFound}</h3>
            <p className="text-gray-500">
              {applications.length === 0 ? translations.noOneAppliedYet : translations.tryAdjustingSearch}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((application) => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">{application.user_name}</h3>
                        <Badge className={getStatusColor(application.status)}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2" />
                          {translations.appliedFor}: {application.vacancy_title}
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          {translations.resume}: {application.resume_title}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {translations.applied}: {formatDate(application.created_at)}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">{translations.coverLetter}</h4>
                        <p className="text-gray-700 text-sm line-clamp-3">{application.cover_letter}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Select
                          value={application.status}
                          onValueChange={(value) => updateApplicationStatus(application.id, value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">{translations.pending}</SelectItem>
                            <SelectItem value="reviewing">{translations.reviewing}</SelectItem>
                            <SelectItem value="shortlisted">{translations.shortlisted}</SelectItem>
                            <SelectItem value="accepted">{translations.accepted}</SelectItem>
                            <SelectItem value="rejected">{translations.rejected}</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button variant="outline" size="sm">
                          {translations.contactCandidate}
                        </Button>

                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/jobs/${application.vacancy.id}`}>{translations.viewJob}</Link>
                        </Button>
                      </div>
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
