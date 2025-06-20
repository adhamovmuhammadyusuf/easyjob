"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

interface JobDetails {
  id: number
  title: string
  description: string
  requirements: string
  category: {
    id: number
    name: string
  }
  experience_level: string
  job_type: string
  salary_min: number
  salary_max: number
  location: string
  is_active: boolean
  created_at: string
  updated_at: string
  company: {
    id: number
    name: string
  }
  skills: Array<{
    id: number
    name: string
  }>
}

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [job, setJob] = useState<JobDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user && user.user_type === "employer") {
      fetchJobDetails()
    }
  }, [user, params.id])

  const fetchJobDetails = async () => {
    try {
      setLoading(true)
      console.log('Fetching job details for ID:', params.id)
      const data = await apiClient.getVacancy(params.id)
      console.log('Job details:', data)
      setJob(data)
    } catch (error: any) {
      console.error('Error fetching job details:', error)
      if (error.response) {
        console.error('Error response:', error.response)
        console.error('Error data:', error.response.data)
      }
      setError("Failed to load job details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job?")) {
      return
    }

    try {
      await apiClient.deleteJob(params.id)
      router.push("/employer/jobs")
    } catch (error: any) {
      console.error('Error deleting job:', error)
      if (error.response) {
        console.error('Error response:', error.response)
        console.error('Error data:', error.response.data)
      }
      alert("Failed to delete job. Please try again.")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (!user || user.user_type !== "employer") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">This page is only accessible to employers.</p>
          <Button onClick={() => router.push("/")}>Go Home</Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push("/employer/jobs")}>Back to Jobs</Button>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/employer/jobs")}>Back to Jobs</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-600 mt-2">
              Posted on {formatDate(job.created_at)}
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => router.push(`/employer/jobs/${job.id}/edit`)}
            >
              Edit Job
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete Job
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="mt-1">{job.category.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Experience Level</p>
                  <p className="mt-1">{job.experience_level}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Job Type</p>
                  <p className="mt-1">{job.job_type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="mt-1">{job.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Salary Range</p>
                  <p className="mt-1">${job.salary_min} - ${job.salary_max}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge
                    className={job.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                  >
                    {job.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{job.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{job.requirements}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge key={skill.id} variant="secondary">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 