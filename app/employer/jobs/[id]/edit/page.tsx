"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { translations } from "@/lib/translations"

interface Category {
  id: number
  name: string
}

interface Skill {
  id: number
  name: string
}

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
  skills_list: Array<{
    id: number
    name: string
  }>
}

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([])
  const [skillSearch, setSkillSearch] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    category: "",
    experience_level: "",
    job_type: "",
    salary_min: "",
    salary_max: "",
    location: "",
    is_active: true,
  })

  useEffect(() => {
    if (!authLoading && user && user.user_type === "employer") {
      fetchJobDetails()
      fetchCategories()
      fetchSkills()
    }
  }, [user, params.id, authLoading])

  const fetchJobDetails = async () => {
    try {
      setLoading(true)
      console.log('Fetching job details for ID:', params.id)
      const data = await apiClient.getVacancy(params.id)
      console.log('Job details:', data)
      
      setFormData({
        title: data.title || "",
        description: data.description || "",
        requirements: data.requirements || "",
        category: data.category?.id?.toString() || "",
        experience_level: data.experience_level || "",
        job_type: data.job_type || "",
        salary_min: data.salary_min?.toString() || "",
        salary_max: data.salary_max?.toString() || "",
        location: data.location || "",
        is_active: data.is_active ?? true,
      })
      
      setSelectedSkills(data.skills_list || [])
    } catch (error: any) {
      console.error('Error fetching job details:', error)
      if (error.response) {
        console.error('Error response:', error.response)
        console.error('Error data:', error.response.data)
      }
      alert("Failed to load job details. Please try again.")
      router.push("/employer/jobs")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await apiClient.getCategories()
      setCategories(Array.isArray(data) ? data : data.results || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchSkills = async () => {
    try {
      const data = await apiClient.getSkills(skillSearch)
      setSkills(Array.isArray(data) ? data : data.results || [])
    } catch (error) {
      console.error("Error fetching skills:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        alert("Job title is required")
        return
      }
      if (!formData.description.trim()) {
        alert("Job description is required")
        return
      }
      if (!formData.requirements.trim()) {
        alert("Job requirements are required")
        return
      }
      if (!formData.category) {
        alert("Job category is required")
        return
      }
      if (!formData.experience_level) {
        alert("Experience level is required")
        return
      }
      if (!formData.job_type) {
        alert("Job type is required")
        return
      }
      if (!formData.salary_min || !formData.salary_max) {
        alert("Both minimum and maximum salary are required")
        return
      }
      if (!formData.location.trim()) {
        alert("Job location is required")
        return
      }
      if (selectedSkills.length === 0) {
        alert("At least one skill is required")
        return
      }

      const jobData = {
        ...formData,
        category: Number.parseInt(formData.category),
        salary_min: Number.parseFloat(formData.salary_min),
        salary_max: Number.parseFloat(formData.salary_max),
        skills: selectedSkills.map((skill) => skill.id),
      }

      console.log('Updating job with data:', jobData)

      await apiClient.updateJob(params.id, jobData)
      router.push("/employer/jobs")
    } catch (error: any) {
      console.error('Update job error:', error)
      if (error.response) {
        console.error('Error response:', error.response)
        console.error('Error data:', error.response.data)
        
        // Show specific error messages
        if (error.response.data) {
          const errorData = error.response.data
          if (typeof errorData === 'object') {
            const errorMessages = Object.entries(errorData)
              .map(([field, message]) => `${field}: ${message}`)
              .join('\n')
            alert(errorMessages)
          } else {
            alert(errorData.detail || errorData.message || "Failed to update job")
          }
        } else {
          alert("Failed to update job. Please try again.")
        }
      }
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const addSkill = (skill: Skill) => {
    if (!selectedSkills.find((s) => s.id === skill.id)) {
      setSelectedSkills((prev) => [...prev, skill])
    }
    setSkillSearch("")
  }

  const removeSkill = (skillId: number) => {
    setSelectedSkills((prev) => prev.filter((skill) => skill.id !== skillId))
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
            <p className="text-gray-600 mt-2">Update your job posting details</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/employer/jobs")}>
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Senior Software Engineer"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the role and responsibilities..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="List the required qualifications and experience..."
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="experience_level">Experience Level</Label>
                  <Select
                    value={formData.experience_level}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, experience_level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry" key="entry">Entry Level</SelectItem>
                      <SelectItem value="mid" key="mid">Mid Level</SelectItem>
                      <SelectItem value="senior" key="senior">Senior Level</SelectItem>
                      <SelectItem value="lead" key="lead">Lead Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="job_type">Job Type</Label>
                  <Select
                    value={formData.job_type}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, job_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time" key="full_time">Full Time</SelectItem>
                      <SelectItem value="part_time" key="part_time">Part Time</SelectItem>
                      <SelectItem value="contract" key="contract">Contract</SelectItem>
                      <SelectItem value="internship" key="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="salary_min">Minimum Salary</Label>
                    <Input
                      id="salary_min"
                      name="salary_min"
                      type="number"
                      value={formData.salary_min}
                      onChange={handleChange}
                      placeholder="e.g. 50000"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="salary_max">Maximum Salary</Label>
                    <Input
                      id="salary_max"
                      name="salary_max"
                      type="number"
                      value={formData.salary_max}
                      onChange={handleChange}
                      placeholder="e.g. 100000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. New York, NY"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="skillSearch">Search Skills</Label>
                  <Input
                    id="skillSearch"
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                    placeholder="Search for skills..."
                  />
                  {skillSearch && (
                    <div className="mt-2 space-y-2">
                      {skills
                        .filter((skill) => !selectedSkills.find((s) => s.id === skill.id))
                        .map((skill) => (
                          <Badge
                            key={skill.id}
                            variant="secondary"
                            className="cursor-pointer hover:bg-gray-200"
                            onClick={() => addSkill(skill)}
                          >
                            {skill.name}
                          </Badge>
                        ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="skills">{translations.skills}</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedSkills.map((skill) => (
                      <Badge key={skill.id} variant="secondary">
                        {skill.name}
                        <X onClick={() => removeSkill(skill.id)} className="ml-1 h-3 w-3 cursor-pointer" />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/employer/jobs")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
} 