"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Download } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

interface Resume {
  id: number
  title: string
  file: string
  experience: string
  education: string
  skills_list: Array<{ id: number; name: string }>
  created_at: string
  updated_at: string
}

interface Skill {
  id: number
  name: string
}

export default function ResumesPage() {
  const { user } = useAuth()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    experience: "",
    education: "",
    skills: [] as number[],
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [skillSearch, setSkillSearch] = useState("")

  useEffect(() => {
    if (user) {
      fetchResumes()
      fetchSkills()
    }
  }, [user])

  const fetchResumes = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getResumes()
      setResumes(data.results || data)
    } catch (error) {
      console.error("Error fetching resumes:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSkills = async () => {
    try {
      const data = await apiClient.getSkills(skillSearch)
      setSkills(data.results || data)
    } catch (error) {
      console.error("Error fetching skills:", error)
    }
  }

  const handleCreateResume = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      alert("Please select a resume file")
      return
    }

    try {
      setCreating(true)
      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("experience", formData.experience)
      formDataToSend.append("education", formData.education)
      formDataToSend.append("file", selectedFile)

      formData.skills.forEach((skillId) => {
        formDataToSend.append("skills", skillId.toString())
      })

      await apiClient.createResume(formDataToSend)
      await fetchResumes()

      // Reset form
      setFormData({
        title: "",
        experience: "",
        education: "",
        skills: [],
      })
      setSelectedFile(null)
    } catch (error) {
      console.error("Error creating resume:", error)
      alert("Failed to create resume")
    } finally {
      setCreating(false)
    }
  }

  const toggleSkill = (skillId: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skillId) ? prev.skills.filter((id) => id !== skillId) : [...prev.skills, skillId],
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to manage your resumes</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Resume
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Resume</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreateResume} className="space-y-6">
                <div>
                  <Label htmlFor="title">Resume Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Software Developer Resume"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="file">Resume File (PDF)</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="experience">Experience</Label>
                  <Textarea
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
                    placeholder="Describe your work experience..."
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="education">Education</Label>
                  <Textarea
                    id="education"
                    value={formData.education}
                    onChange={(e) => setFormData((prev) => ({ ...prev, education: e.target.value }))}
                    placeholder="Describe your educational background..."
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label>Skills</Label>
                  <Input
                    placeholder="Search skills..."
                    value={skillSearch}
                    onChange={(e) => {
                      setSkillSearch(e.target.value)
                      fetchSkills()
                    }}
                    className="mb-3"
                  />
                  <div className="max-h-40 overflow-y-auto border rounded-md p-3">
                    <div className="grid grid-cols-2 gap-2">
                      {skills.map((skill) => (
                        <label key={skill.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.skills.includes(skill.id)}
                            onChange={() => toggleSkill(skill.id)}
                            className="rounded"
                          />
                          <span className="text-sm">{skill.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={creating} className="w-full">
                  {creating ? "Creating..." : "Create Resume"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
            <p className="text-gray-500 mb-4">Create your first resume to start applying for jobs</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Card key={resume.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{resume.title}</span>
                    <FileText className="h-5 w-5 text-gray-400" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Experience</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{resume.experience}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Education</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{resume.education}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {resume.skills_list.slice(0, 3).map((skill) => (
                          <Badge key={skill.id} variant="secondary" className="text-xs">
                            {skill.name}
                          </Badge>
                        ))}
                        {resume.skills_list.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{resume.skills_list.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">Created: {formatDate(resume.created_at)}</div>

                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" variant="outline" asChild className="flex-1">
                        <a href={resume.file} target="_blank" rel="noopener noreferrer">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </a>
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
