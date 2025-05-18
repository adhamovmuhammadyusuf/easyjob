'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Company, Vacancy } from '../../../lib/api/types';
import { getCompanyById, getCompanyVacancies } from '@/lib/api/companies';
import { MapPin, Globe, Users, Building2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const formatJobType = (type: string) => {
  const mapping: Record<string, string> = {
    'full_time': 'Full time',
    'part_time': 'Part time',
    'contract': 'Contract',
    'internship': 'Internship',
    'temporary': 'Temporary'
  };
  return mapping[type.toLowerCase()] || type;
};

export default function CompanyDetailsPage() {
  const params = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        const companyId = Number(params.id);
        const companyData = await getCompanyById(companyId);
        setCompany(companyData);
        
        const vacanciesData = await getCompanyVacancies(companyId);
        setVacancies(vacanciesData.results);
      } catch (err: any) {
        setError(err.message || 'Failed to load company details');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCompanyDetails();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="animate-pulse space-y-8">
            <div className="flex items-center space-x-6">
              <Skeleton className="h-32 w-32 rounded-xl" />
              <div className="space-y-4 flex-1">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex space-x-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
            <Skeleton className="h-32 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/companies">
            <Button>Back to Companies</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!company) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Company Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <div className="relative h-32 w-32 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
            {company.logo ? (
              <Image
                src={company.logo}
                alt={company.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Building2 className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
            
            <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-500" />
                <span>{company.location}</span>
              </div>
              {company.website && (
                <a 
                  href={company.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Globe className="h-5 w-5" />
                  <span>Website</span>
                </a>
              )}
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span>{company.employee_count} employees</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span>Joined {format(new Date(company.created_at), 'MMMM yyyy')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Company Description */}
        <div className="prose max-w-none mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About {company.name}</h2>
          <p className="text-gray-600 whitespace-pre-wrap">{company.description}</p>
        </div>

        {/* Company Vacancies */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Open Positions ({company.vacancy_count})
          </h2>
          
          {vacancies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vacancies.map((vacancy) => (
                <Link 
                  key={vacancy.id} 
                  href={`/jobs/${vacancy.id}`}
                  className="block bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-500 hover:shadow-md transition-all duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {vacancy.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {formatJobType(vacancy.job_type)}
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {vacancy.salary_range}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {vacancy.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {vacancy.location}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Open Positions
              </h3>
              <p className="text-gray-600">
                This company doesn't have any open positions at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}