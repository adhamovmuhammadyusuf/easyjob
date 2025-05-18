'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600';
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">EasyJob</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  pathname === '/' ? 'border-blue-500' : 'border-transparent'
                } ${isActive('/')}`}
              >
                Asosiy
              </Link>
              <Link 
                href="/jobs" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  pathname === '/jobs' ? 'border-blue-500' : 'border-transparent'
                } ${isActive('/jobs')}`}
              >
                Ishlar
              </Link>
              <Link 
                href="/companies" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                  pathname === '/companies' ? 'border-blue-500' : 'border-transparent'
                } ${isActive('/companies')}`}
              >
                Kompaniyalar
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Link 
              href="/login" 
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Kirish
            </Link>
            <Link 
              href="/signup" 
              className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              Ro'yxatdan o'tish
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
} 