"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, FileText, Briefcase, Building2, Plus, Users } from "lucide-react"
import { translations } from "@/lib/translations"

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              EasyJob
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link href="/jobs" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                {translations.jobs}
              </Link>
              <Link href="/companies" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                {translations.companies}
              </Link>
              {user && user.user_type === "job_seeker" && (
                <Link href="/resumes" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  {translations.myResumes}
                </Link>
              )}
              {user && user.user_type === "employer" && (
                <>
                  <Link
                    href="/employer/jobs"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                  >
                    {translations.myJobPosts}
                  </Link>
                  <Link
                    href="/employer/applications"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                  >
                    {translations.applications}
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <>
                {user.user_type === "employer" && (
                  <Button asChild className="mr-4">
                    <Link href="/employer/jobs/create">
                      <Plus className="h-4 w-4 mr-2" />
                      {translations.postJob}
                    </Link>
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profile_image || "/placeholder.svg"} alt={user.first_name} />
                        <AvatarFallback>
                          {user.first_name?.[0]}
                          {user.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        {translations.profile}
                      </Link>
                    </DropdownMenuItem>

                    {user.user_type === "job_seeker" ? (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/applications" className="flex items-center">
                            <Briefcase className="mr-2 h-4 w-4" />
                            {translations.myApplications}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/resumes" className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" />
                            {translations.myResumes}
                          </Link>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/employer/dashboard" className="flex items-center">
                            <Building2 className="mr-2 h-4 w-4" />
                            {translations.dashboard}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/employer/jobs" className="flex items-center">
                            <Briefcase className="mr-2 h-4 w-4" />
                            {translations.myJobPosts}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/employer/applications" className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            {translations.applications}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/employer/company" className="flex items-center">
                            <Building2 className="mr-2 h-4 w-4" />
                            {translations.companyProfile}
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      {translations.logout}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">{translations.login}</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">{translations.signUp}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
