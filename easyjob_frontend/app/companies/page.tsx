'use client';

import React, { useState, useEffect } from 'react';
import { getCompanies } from '@/lib/api/companies';
import { Company } from '@/lib/api/types';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Users, Building2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCompanies({ page, page_size: 12 });
        console.log('Response status:', response.status);
        console.log('Response text:', await response.text());
        setCompanies(response.results);
        setTotalPages(Math.ceil(response.count / 12));
      } catch (error: any) {
        console.error('Error fetching companies:', error);
        if (error.message.includes('Unauthorized')) {
          setError('Unauthorized access. Please sign in.');
        } else {
          setError('Kompaniyalarni yuklashda xatolik yuz berdi');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [page]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-lg animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gray-200 rounded-xl"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            {error.includes('Unauthorized') ? (
              <Link href="/login">
                <Button>Sign In</Button>
              </Link>
            ) : (
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Kompaniyalar</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Link 
              key={company.id} 
              href={`/companies/${company.id}`}
              className="block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 p-6 group"
            >
              <div className="flex items-center space-x-4 mb-4">
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
                  <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {company.name}
                  </h2>
                  <div className="flex items-center text-gray-500 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{company.location}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">{company.description}</p>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{company.employee_count} employees</span>
                </div>
                <div className="font-medium text-blue-600">
                  {company.vacancy_count} open positions
                </div>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 