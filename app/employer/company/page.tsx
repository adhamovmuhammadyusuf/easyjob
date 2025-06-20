"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Globe, MapPin, Users, Briefcase, Edit, Save, X, Calendar } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { translations } from "@/lib/translations"

interface CompanyProfile {
  id: number
  name: string
  description: string
  website?: string
  logo?: string
  location: string
  founded_year?: number
  company_size?: string
  industry?: string
  created_at: string
  updated_at: string
  vacancies_count?: number
}

export default function CompanyProfilePage() {
  const { user } = useAuth()
  const [company, setCompany] = useState<CompanyProfile | null>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    founded_year: "",
    company_size: "",
    industry: "",
  })
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null)

  useEffect(() => {
    if (user && user.user_type === "employer") {
      fetchCompanyProfile()
    }
  }, [user])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedLogoFile(e.target.files[0])
    }
  }

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true)
      // Try to get the company profile for the current user
      const data: { results: CompanyProfile[] } = await apiClient.getCompanies(new URLSearchParams({ owner: "me" })) as { results: CompanyProfile[] };
      const companies = Array.isArray(data) ? data : data.results || []

      if (companies.length > 0) {
        const companyData = companies[0]
        console.log('Fetched company data:', companyData);
        console.log('Fetched company ID:', companyData.id);
        setCompany(companyData)
        setFormData({
          name: companyData.name || "",
          description: companyData.description || "",
          website: companyData.website || "",
          location: companyData.location || "",
          founded_year: companyData.founded_year?.toString() || "",
          company_size: companyData.company_size || "",
          industry: companyData.industry || "",
        })
      }
    } catch (error) {
      console.error("Error fetching company profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      // Validate required fields
      if (!formData.name.trim()) {
        alert("Company name is required")
        return
      }
      if (!formData.description.trim()) {
        alert("Company description is required")
        return
      }
      if (!formData.location.trim()) {
        alert("Company location is required")
        return
      }

      const updateData = new FormData()
      updateData.append("name", formData.name)
      updateData.append("description", formData.description)
      updateData.append("website", formData.website)
      updateData.append("location", formData.location)
      if (formData.founded_year) {
        updateData.append("founded_year", formData.founded_year)
      }
      updateData.append("company_size", formData.company_size)
      updateData.append("industry", formData.industry)

      if (selectedLogoFile) {
        updateData.append("logo", selectedLogoFile)
      }

      console.log('Sending data:', updateData)

      if (company?.id) {
        // Update existing company
        const updatedCompany: CompanyProfile = await apiClient.updateCompany(company.id.toString(), updateData) as CompanyProfile;
        console.log('Updated company response:', updatedCompany);
        console.log('Updated company ID:', updatedCompany.id);
        setCompany(updatedCompany)
      } else {
        // Create new company
        try {
          const newCompany: CompanyProfile = await apiClient.createCompany(updateData) as CompanyProfile;
          console.log('New company created response:', newCompany);
          console.log('New company ID:', newCompany.id);
          setCompany(newCompany)
        } catch (error: any) {
          console.error('Create company error:', error)
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
              alert(errorData.detail || errorData.message || translations.failedToCreateCompany)
            }
          } else {
            alert(translations.failedToCreateCompany)
          }
          throw error
        }
      }

      setEditing(false)
    } catch (error: any) {
      console.error("Error saving company profile:", error)
      console.error("Error details:", error.response?.data)
      console.error("Error status:", error.response?.status)
      alert(translations.failedToSaveCompanyProfile)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (company) {
      setFormData({
        name: company.name || "",
        description: company.description || "",
        website: company.website || "",
        location: company.location || "",
        founded_year: company.founded_year?.toString() || "",
        company_size: company.company_size || "",
        industry: company.industry || "",
      })
    }
    setEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (!user || user.user_type !== "employer") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{translations.accessDenied}</h1>
          <p className="text-gray-600 mb-4">{translations.employerAccessDeniedDescription}</p>
          <Button onClick={() => window.history.back()}>{translations.goBack}</Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{translations.companyProfilePageTitle}</h1>
            <p className="text-gray-600">{translations.companyProfilePageDescription}</p>
          </div>
          {!editing && (
            <Button onClick={() => setEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              {company ? translations.editProfile : translations.createCompanyProfile}
            </Button>
          )}
        </div>

        {!company && !editing && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="text-center">
                <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">{translations.welcomeToEasyJob}</h2>
                <p className="text-gray-600 mb-4">
                  {translations.createCompanyProfileDescription}
                </p>
                <Button onClick={() => setEditing(true)}>
                  {translations.createCompanyProfile}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {(company || editing) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editing ? translations.editProfile : translations.companyInfo}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">{translations.companyName}</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      readOnly={!editing}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">{translations.website}</Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      readOnly={!editing}
                      placeholder={translations.websitePlaceholder}
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="description">{translations.companyDescription}</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      readOnly={!editing}
                      required
                      placeholder={translations.companyDescriptionPlaceholder}
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">{translations.location}</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      readOnly={!editing}
                      required
                      placeholder={translations.locationPlaceholder}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="founded_year">{translations.foundedYear}</Label>
                    <Input
                      id="founded_year"
                      name="founded_year"
                      value={formData.founded_year}
                      onChange={handleChange}
                      readOnly={!editing}
                      type="number"
                      placeholder={translations.foundedYearPlaceholder}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company_size">{translations.companySize}</Label>
                    {editing ? (
                      <Select
                        value={formData.company_size}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, company_size: value }))}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder={translations.selectCompanySize} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">{translations.size1_10}</SelectItem>
                          <SelectItem value="11-50">{translations.size11_50}</SelectItem>
                          <SelectItem value="51-200">{translations.size51_200}</SelectItem>
                          <SelectItem value="201-500">{translations.size201_500}</SelectItem>
                          <SelectItem value="501-1000">{translations.size501_1000}</SelectItem>
                          <SelectItem value="1000+">{translations.size5000Plus}</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input value={formData.company_size || "N/A"} readOnly className="mt-1" />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="industry">{translations.industry}</Label>
                    {editing ? (
                      <Select
                        value={formData.industry}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, industry: value }))}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder={translations.selectIndustry} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technology">{translations.technology}</SelectItem>
                          <SelectItem value="Finance">{translations.finance}</SelectItem>
                          <SelectItem value="Healthcare">{translations.healthcare}</SelectItem>
                          <SelectItem value="Education">{translations.education}</SelectItem>
                          <SelectItem value="Marketing">{translations.marketing}</SelectItem>
                          <SelectItem value="Design">{translations.design}</SelectItem>
                          <SelectItem value="Manufacturing">{translations.manufacturing}</SelectItem>
                          <SelectItem value="Retail">{translations.retail}</SelectItem>
                          <SelectItem value="Food Service">{translations.foodService}</SelectItem>
                          <SelectItem value="Media">{translations.media}</SelectItem>
                          <SelectItem value="Construction">{translations.construction}</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input value={formData.industry || "N/A"} readOnly className="mt-1" />
                    )}
                  </div>
                  {editing && (
                    <div>
                      <Label htmlFor="logo">{translations.logo}</Label>
                      <Input id="logo" type="file" accept="image/*" onChange={handleLogoChange} className="mt-1" />
                      <p className="text-xs text-gray-500 mt-1">{translations.uploadLogo}</p>
                    </div>
                  )}
                </div>
                {editing && (
                  <div className="mt-6 flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      {translations.cancel}
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? translations.saving : translations.saveChanges}
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        )}

        {company && !editing && (
          <Card>
            <CardHeader>
              <CardTitle>{translations.companyDetails}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-gray-500" />
                <span>{translations.industry}: {company.industry || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-500" />
                <span>{translations.employeeCount}: {company.company_size || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span>{translations.founded}: {company.founded_year || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-gray-500" />
                <span>{translations.activeVacancies}: {company.vacancies_count || 0}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
