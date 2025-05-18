"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCompanies, Company, CompanyFilters } from '@/lib/api/companies';
import { Search, Building, Briefcase, Users } from 'lucide-react';

const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CompanyFilters>({
    page: 1,
    page_size: 12
  });
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);
        const { results, count } = await getCompanies(filters);
        setCompanies(results);
        setTotalCount(count);
      } catch (err: any) {
        setError(err.message || 'Failed to load companies');
        console.error('Error loading companies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [filters]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  if (loading && companies.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => setFilters(prev => ({ ...prev }))}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Qayta urinib ko'ring
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Kompaniya nomini qidirish..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={handleSearch}
          />
        </div>
        <select
          name="industry"
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onChange={handleFilterChange}
        >
          <option value="">Barcha sohalar</option>
          <option value="technology">Texnologiya</option>
          <option value="finance">Moliya</option>
          <option value="healthcare">Sog'liqni saqlash</option>
          <option value="education">Ta'lim</option>
        </select>
        <select
          name="location"
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onChange={handleFilterChange}
        >
          <option value="">Barcha joylar</option>
          <option value="tashkent">Toshkent</option>
          <option value="samarkand">Samarqand</option>
          <option value="bukhara">Buxoro</option>
        </select>
      </div>

      {/* Companies Grid */}
      {companies.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-xl font-bold mb-2">Kompaniyalar topilmadi</h3>
          <p className="text-gray-600">
            Boshqa kalit so'z yoki filtrlarni o'zgartirib ko'ring
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {companies.map((company) => (
            <Link href={`/companies/${company.id}`} key={company.id}>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex flex-col items-center text-center">
                  {company.logo ? (
                    <Image
                      src={company.logo}
                      alt={company.name}
                      width={80}
                      height={80}
                      className="rounded-full object-cover mb-4"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Building className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{company.name}</h3>                <p className="text-sm text-gray-600 mb-2">{company.location}</p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Briefcase className="w-3 h-3 mr-1" />
                    {company.vacancy_count || 0} vakansiya
                  </span>
                  {company.employee_count && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <Users className="w-3 h-3 mr-1" />
                      {company.employee_count} xodim
                    </span>
                  )}
                </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalCount > filters.page_size! && (
        <div className="mt-8 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page! - 1 }))}
              disabled={filters.page === 1}
              className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Oldingi
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page! + 1 }))}
              disabled={companies.length < filters.page_size!}
              className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Keyingi
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Companies;