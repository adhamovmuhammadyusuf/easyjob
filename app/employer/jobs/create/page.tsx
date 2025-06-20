"use client"

import type React from "react"
import { useState, useEffect } from "react"
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

export default function CreateJobPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([])
  const [skillSearch, setSkillSearch] = useState("")
  const [company, setCompany] = useState<any>(null)
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
    if (user && user.user_type === "employer") {
      fetchCategories()
      fetchSkills()
      checkCompanyProfile()
    }
  }, [user])

  const checkCompanyProfile = async () => {
    try {
      const data: { results: any[] } = await apiClient.getCompanies(new URLSearchParams({ owner: "me" })) as { results: any[] };
      console.log('Company data:', data)
      
      const companies = Array.isArray(data) ? data : data.results || []
      console.log('Companies array:', companies)
      
      if (companies.length === 0) {
        console.log('No companies found, redirecting to company profile page')
        router.push("/employer/company")
        return
      }
      
      const company = companies[0]
      console.log('Setting company:', company)
      
      if (!company || !company.id) {
        console.error('Invalid company data:', company)
        router.push("/employer/company")
        return
      }
      
      setCompany(company)
    } catch (error: any) {
      console.error("Error checking company profile:", error)
      if (error.response) {
        console.error('Error response:', error.response)
        console.error('Error data:', error.response.data)
      }
      router.push("/employer/company")
    }
  }

  const fetchCategories = async () => {
    try {
      const data: any = await apiClient.getCategories() as any;
      setCategories(Array.isArray(data) ? data : data.results || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
      // Set fallback categories
      setCategories([
        { id: 1, name: "Technology" },
        { id: 2, name: "Marketing" },
        { id: 3, name: "Design" },
        { id: 4, name: "Sales" },
        { id: 5, name: "Finance" },
      ])
    }
  }

  const fetchSkills = async () => {
    try {
      const data: any = await apiClient.getSkills(skillSearch) as any;
      setSkills(Array.isArray(data) ? data : data.results || [])
    } catch (error) {
      console.error("Error fetching skills:", error)
      // Set fallback skills
      setSkills([
        { id: 1, name: "JavaScript" },
        { id: 2, name: "React" },
        { id: 3, name: "Node.js" },
        { id: 4, name: "Python" },
        { id: 5, name: "TypeScript" },
        { id: 6, name: "SQL" },
        { id: 7, name: "AWS" },
        { id: 8, name: "Docker" },
      ])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Check if company exists
      if (!company || !company.id) {
        alert(translations.alertCreateCompanyProfile)
        router.push("/employer/company")
        return
      }

      // Validate required fields
      if (!formData.title.trim()) {
        alert(translations.alertJobTitleRequired)
        return
      }
      if (!formData.description.trim()) {
        alert(translations.alertJobDescriptionRequired)
        return
      }
      if (!formData.requirements.trim()) {
        alert(translations.alertJobRequirementsRequired)
        return
      }
      if (!formData.category) {
        alert(translations.alertJobCategoryRequired)
        return
      }
      if (!formData.experience_level) {
        alert(translations.alertExperienceLevelRequired)
        return
      }
      if (!formData.job_type) {
        alert(translations.alertJobTypeRequired)
        return
      }
      if (!formData.salary_min || !formData.salary_max) {
        alert(translations.alertSalaryRequired)
        return
      }
      if (!formData.location.trim()) {
        alert(translations.alertLocationRequired)
        return
      }
      if (selectedSkills.length === 0) {
        alert(translations.alertSkillRequired)
        return
      }

      const jobData = {
        ...formData,
        company: company.id,
        category: Number.parseInt(formData.category),
        salary_min: Number.parseFloat(formData.salary_min),
        salary_max: Number.parseFloat(formData.salary_max),
        skills: selectedSkills.map((skill) => skill.id),
      }

      console.log('Sending job data:', jobData)

      try {
        await apiClient.createJob(jobData)
        router.push("/employer/jobs")
      } catch (error: any) {
        console.error('Create job error:', error)
        console.error('Error response:', error.response)
        console.error('Error data:', error.response?.data)
        
        // Show specific error messages
        if (error.response?.data) {
          const errorData = error.response.data
          if (typeof errorData === 'object') {
            const errorMessages = Object.entries(errorData)
              .map(([field, message]) => `${field}: ${message}`)
              .join('\n')
            alert(errorMessages)
          } else {
            alert(errorData.detail || errorData.message || translations.alertFailedToCreateJob)
          }
        } else {
          alert(translations.alertFailedToCreateJobTryAgain)
        }
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error)
    } finally {
      setLoading(false)
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

  const filteredSkills = skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(skillSearch.toLowerCase()) && !selectedSkills.find((s) => s.id === skill.id),
  )

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{translations.createJobPageTitle}</h1>
            <p className="text-gray-600 mt-2">{translations.createJobPageDescription}</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/employer/jobs")}>
            {translations.backToJobs}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{translations.jobDetails}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title">{translations.jobTitle}</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder={translations.jobTitlePlaceholder}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">{translations.location}</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder={translations.locationPlaceholder}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">{translations.jobDescription}</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={translations.jobDescriptionPlaceholder}
                    required
                    className="min-h-[100px]"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="requirements">{translations.jobRequirements}</Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder={translations.jobRequirementsPlaceholder}
                    required
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <Label htmlFor="category">{translations.category}</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={translations.selectCategory} />
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
                  <Label htmlFor="experience_level">{translations.experienceLevel}</Label>
                  <Select
                    value={formData.experience_level}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, experience_level: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={translations.selectExperienceLevel} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">{translations.entryLevel}</SelectItem>
                      <SelectItem value="junior">{translations.junior}</SelectItem>
                      <SelectItem value="mid">{translations.midLevel}</SelectItem>
                      <SelectItem value="senior">{translations.seniorLevel}</SelectItem>
                      <SelectItem value="lead">{translations.lead}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="job_type">{translations.jobType}</Label>
                  <Select
                    value={formData.job_type}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, job_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={translations.selectJobType} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">{translations.fullTime}</SelectItem>
                      <SelectItem value="part_time">{translations.partTime}</SelectItem>
                      <SelectItem value="contract">{translations.contract}</SelectItem>
                      <SelectItem value="temporary">{translations.temporary}</SelectItem>
                      <SelectItem value="volunteer">{translations.volunteer}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="salary_min">{translations.minSalary}</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        id="salary_min"
                        name="salary_min"
                        placeholder={translations.minSalary}
                        value={formData.salary_min}
                        onChange={handleChange}
                        className="pr-12"
                      />
                      <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">
                        {translations.currency}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="salary_max">{translations.maxSalary}</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        id="salary_max"
                        name="salary_max"
                        placeholder={translations.maxSalary}
                        value={formData.salary_max}
                        onChange={handleChange}
                        className="pr-12"
                      />
                      <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">
                        {translations.currency}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="skills">{translations.skills}</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedSkills.map((skill) => (
                      <Badge key={skill.id} variant="secondary">
                        {skill.name}
                        <X onClick={() => removeSkill(skill.id)} className="ml-1 h-3 w-3 cursor-pointer" />
                      </Badge>
                    ))}
                  </div>
                  <Input
                    type="text"
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                    placeholder={translations.searchForSkills}
                  />
                  <div className="mt-2 max-h-40 overflow-y-auto border rounded-md">
                    {filteredSkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => addSkill(skill)}
                      >
                        {skill.name} ({translations.addSkill})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? translations.submitting : translations.postJob}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
