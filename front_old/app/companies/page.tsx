'use client';

import { useState, useEffect } from 'react';
import { getCompanies } from '../../lib/api/companies';
import { type Company } from '../../lib/api/types';
import Link from 'next/link';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true);
        
        console.log('Fetching companies...');
        const response = await getCompanies({ page, page_size: 12 });
        console.log('Companies data:', response);
        
        if (response && response.results) {
          setCompanies(response.results);
          setTotalPages(Math.ceil((response.count || 0) / 12));
        } else {
          setCompanies([]);
          setTotalPages(0);
        }
        
        setError(null);
      } catch (error: any) {
        console.error('Error fetching companies:', error);
        setError('Failed to load companies. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, [page]);

  if (loading) {
    return <div className="p-8 text-center">Loading companies...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 font-bold mb-2">Error</div>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (companies.length === 0) {
    return <div className="p-8 text-center">No companies found.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Companies</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map(company => (
          <Link
            key={company.id}
            href={`/companies/${company.id}`}
            className="block p-4 border rounded shadow hover:shadow-md"
          >
            <div className="font-bold">{company.name}</div>
            <div className="text-sm text-gray-600">{company.location || 'No location specified'}</div>
            <div className="mt-2 text-sm">{company.description?.substring(0, 100) || 'No description available'}{company.description?.length > 100 ? '...' : ''}</div>
          </Link>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          
          <span>Page {page} of {totalPages}</span>
          
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}