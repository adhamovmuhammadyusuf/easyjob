"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MapPin, Clock, Building2, Calendar } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { translations } from "@/lib/translations"

interface JobDetail {
  id: number
  title: string
  description: string
  requirements: string
  company_name: string
  location: string
  job_type: string
  experience_level: string
  salary_min: number
  salary_max: number
  created_at: string
  skills_list: Array<{ id: number; name: string }>
  company: {
    id: number
    name: string
    description: string
    logo?: string
    website?: string
  }
}

interface Resume {
  id: number
  title: string
}

export default function JobDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const [job, setJob] = useState<JobDetail | null>(null)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [selectedResume, setSelectedResume] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [applicationSuccess, setApplicationSuccess] = useState(false)

  useEffect(() => {
    fetchJobDetail()
    if (user) {
      fetchResumes()
    }
  }, [params.id, user])

  const fetchJobDetail = async () => {
    try {
      const data = await apiClient.getVacancy(params.id as string)
      setJob(data)
    } catch (error) {
      console.error("Error fetching job detail:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchResumes = async () => {
    try {
      const data = await apiClient.getResumes()
      setResumes(data.results || data)
    } catch (error) {
      console.error("Error fetching resumes:", error)
    }
  }

  const handleApply = async () => {
    if (!selectedResume || !coverLetter.trim()) {
      alert(translations.selectResumeAndCoverLetter)
      return
    }

    try {
      setApplying(true)
      await apiClient.applyToVacancy(params.id as string, selectedResume, coverLetter)
      setApplicationSuccess(true)
      setCoverLetter("")
      setSelectedResume("")
    } catch (error) {
      console.error("Error applying to job:", error)
      alert(translations.failedToSubmitApplication)
    } finally {
      setApplying(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
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

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{translations.jobNotFound}</h1>
          <Button asChild>
            <Link href="/jobs">{translations.backToJobs}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <div className="flex items-center text-lg text-gray-600 mb-4">
                  <Building2 className="h-5 w-5 mr-2" />
                  {job.company && job.company.id ? (
                    <Link href={`/companies/${job.company.id}`} className="hover:text-blue-600">
                      {job.company_name}
                    </Link>
                  ) : (
                    <span>{job.company_name || 'N/A'}</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {job.job_type.replace("_", " ") === "full_time" ? translations.fullTime : job.job_type.replace("_", " ") === "part_time" ? translations.partTime : job.job_type.replace("_", " ") === "contract" ? translations.contract : job.job_type.replace("_", " ") === "internship" ? translations.internship : job.job_type.replace("_", " ")}
                  </div>
                  <div className="flex items-center">
                    {job.salary_min.toLocaleString()} {translations.currency} - {job.salary_max.toLocaleString()} {translations.currency}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {translations.posted} {formatDate(job.created_at)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{job.experience_level.replace("_", " ") === "entry" ? translations.entry : job.experience_level.replace("_", " ") === "mid" ? translations.mid : job.experience_level.replace("_", " ") === "senior" ? translations.senior : job.experience_level.replace("_", " ")}</Badge>
                  {job.skills_list.map((skill) => (
                    <Badge key={skill.id} variant="outline">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="ml-8">
                {user ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg" className="w-full">
                        {translations.applyNow}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>{translations.applyForJob.replace("{jobTitle}", job.title)}</DialogTitle>
                      </DialogHeader>

                      {applicationSuccess ? (
                        <div className="text-center py-6">
                          <div className="text-green-600 text-lg font-semibold mb-2">{translations.applicationSubmitted}</div>
                          <p className="text-gray-600">
                            {translations.applicationSuccessMessage.replace("{companyName}", job.company_name)}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{translations.selectResume}</label>
                            <Select value={selectedResume} onValueChange={setSelectedResume}>
                              <SelectTrigger>
                                <SelectValue placeholder={translations.chooseResume} />
                              </SelectTrigger>
                              <SelectContent>
                                {resumes.length > 0 ? (
                                  resumes.map((resume) => (
                                    <SelectItem key={resume.id} value={resume.id.toString()}>
                                      {resume.title}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <p className="p-2 text-sm text-gray-500">{translations.noResumesFound}</p>
                                )}
                              </SelectContent>
                            </Select>
                            {resumes.length === 0 && (
                              <p className="text-sm text-gray-500 mt-1">
                                <Link href="/resumes" className="text-blue-600 hover:underline">
                                  {translations.createResumeFirst}
                                </Link>
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{translations.coverLetter}</label>
                            <Textarea
                              placeholder={translations.writeCoverLetter}
                              value={coverLetter}
                              onChange={(e) => setCoverLetter(e.target.value)}
                              rows={6}
                            />
                          </div>

                          <Button
                            onClick={handleApply}
                            disabled={applying || !selectedResume || !coverLetter.trim()}
                            className="w-full"
                          >
                            {applying ? translations.submitting : translations.submitApplication}
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button size="lg" className="w-full" asChild>
                    <Link href="/login">{translations.loginToApply}</Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Job Description and Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="md:col-span-2">
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>{translations.description}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: job.description }}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{translations.requirements}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: job.requirements }}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Company Info */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>{translations.aboutCompany.replace("{companyName}", job.company_name)}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    {job.company.logo && (
                      <img
                        src={job.company.logo}
                        alt={job.company.name}
                        className="w-24 h-24 object-contain mx-auto mb-4"
                      />
                    )}
                    <p className="text-gray-600 mb-4">{job.company.description}</p>
                    {job.company.website && (
                      <Button variant="outline" className="w-full mb-2" asChild>
                        <a href={job.company.website} target="_blank" rel="noopener noreferrer">
                          {translations.visitWebsite}
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/companies/${job.company.id}`}>{translations.viewCompanyProfile}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
