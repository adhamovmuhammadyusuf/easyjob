"use client"

import Link from "next/link"
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"
import { translations } from "@/lib/translations"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">EasyJob</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {translations.companyInfoText}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{translations.quickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/jobs" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {translations.browseJobs}
                </Link>
              </li>
              <li>
                <Link href="/companies" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {translations.companies}
                </Link>
              </li>
              <li>
                <Link href="/resumes" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {translations.createResume}
                </Link>
              </li>
              <li>
                <Link href="/applications" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {translations.myApplications}
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {translations.profile}
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{translations.forEmployers}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/register" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {translations.postJob}
                </Link>
              </li>
              <li>
                <Link href="/companies" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {translations.browseResumes}
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {translations.employerResources}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {translations.pricingPlans}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {translations.successStories}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2">{translations.contactUs}</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <p>Abdulla Qodiriy 11,</p>
                  <p>Tashkent, Uzbekistan</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a href="tel:+998337007817" className="text-gray-300 hover:text-white transition-colors text-sm">
                  +998 33 700 78 17
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <a
                  href="mailto:contact@easyjob.uz"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  contact@easyjob.uz
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">© {currentYear} EasyJob. {translations.allRightsReserved}</div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                {translations.privacyPolicy}
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                {translations.termsOfService}
              </Link>
              <Link href="/help" className="text-gray-400 hover:text-white transition-colors text-sm">
                {translations.helpCenter}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
