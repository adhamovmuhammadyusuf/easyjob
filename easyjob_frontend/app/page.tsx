'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SearchBar } from '@/components/SearchBar';
import Categories from '@/components/Categories';
import { useRouter } from 'next/navigation';
import { Building2, MapPin, ChevronRight } from 'lucide-react';
import JobCard from '@/components/job-card';
import { Job, Company } from '@/lib/api/types';

export default function Home() {
  const router = useRouter();
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [popularCompanies, setPopularCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);        // Fetch featured jobs and popular companies
        const [jobsResponse, companiesResponse] = await Promise.all([
          fetch('http://localhost:8000/api/v1/vacancies/featured/'),
          fetch('http://localhost:8000/api/v1/companies/popular/')
        ]);

        const [jobs, companies] = await Promise.all([
          jobsResponse.json(),
          companiesResponse.json()
        ]);

        if (jobs.results) {
          setFeaturedJobs(jobs.results.slice(0, 6));
        } else {
          setFeaturedJobs([]);
        }
        if (companies.results) {
          setPopularCompanies(companies.results.slice(0, 4));
        } else {
          setPopularCompanies([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (query: string) => {
    router.push(`/jobs?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            O&apos;zingizga mos <span className="text-blue-200">ishni</span> toping
          </h1>
          <p className="text-xl mb-8">
            10,000+ vakansiyalar • 500+ kompaniyalar • 50+ yo&apos;nalishlar
          </p>
          <div className="max-w-2xl mx-auto">
            <SearchBar onSearch={handleSearch} variant="dark" />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <Categories />

      {/* Featured Jobs Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              So'nggi vakansiyalar
            </h2>
            <Link
              href="/jobs"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              Barchasi
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-md animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Companies Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Top kompaniyalar
            </h2>
            <Link
              href="/companies"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              Barchasi
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-md animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-gray-200 rounded-xl"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularCompanies.map((company) => (
                <Link
                  key={company.id}
                  href={`/companies/${company.id}`}
                  className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                      {company.logo ? (
                        <Image
                          src={company.logo}
                          alt={company.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-blue-50">
                          <Building2 className="h-8 w-8 text-blue-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {company.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{company.location}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Ish beruvchimisiz?</h2>
          <p className="text-gray-600 mb-6">
            EasyJob platformasida o&apos;z kompaniyangizni ro&apos;yxatdan o&apos;tkazing va eng yaxshi mutaxassislarni toping
          </p>
          <Link
            href="/signup?type=employer"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition inline-flex items-center"
          >
            Kompaniya sifatida ro&apos;yxatdan o&apos;tish
          </Link>
        </div>
      </section>
    </main>
  );
}