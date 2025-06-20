"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { translations } from "@/lib/translations"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
    user_type: "job_seeker",
    phone_number: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.password2) {
      setError(translations.passwordsDoNotMatch)
      setLoading(false)
      return
    }

    try {
      await register(formData)
      // Redirect based on user type
      if (formData.user_type === "employer") {
        router.push("/employer/company")
      } else {
        router.push("/")
      }
    } catch (error: any) {
      setError(error.message || translations.registrationFailed)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">{translations.signUp}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{translations.email}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder={translations.emailPlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="first_name">{translations.firstName}</Label>
              <Input
                id="first_name"
                name="first_name"
                type="text"
                required
                value={formData.first_name}
                onChange={handleChange}
                placeholder={translations.firstNamePlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">{translations.lastName}</Label>
              <Input
                id="last_name"
                name="last_name"
                type="text"
                required
                value={formData.last_name}
                onChange={handleChange}
                placeholder={translations.lastNamePlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">{translations.phoneNumber}</Label>
              <Input
                id="phone_number"
                name="phone_number"
                type="tel"
                required
                value={formData.phone_number}
                onChange={handleChange}
                placeholder={translations.phoneNumberPlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_type">{translations.userType}</Label>
              <Select
                value={formData.user_type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, user_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={translations.userType} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="job_seeker">{translations.jobSeeker}</SelectItem>
                  <SelectItem value="employer">{translations.employer}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{translations.password}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder={translations.passwordPlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password2">{translations.password}</Label>
              <Input
                id="password2"
                name="password2"
                type="password"
                required
                value={formData.password2}
                onChange={handleChange}
                placeholder={translations.passwordPlaceholder}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "..." : translations.signUp}
            </Button>

            <p className="text-center text-sm text-gray-600">
              {translations.haveAccount}{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-500">
                {translations.login}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
