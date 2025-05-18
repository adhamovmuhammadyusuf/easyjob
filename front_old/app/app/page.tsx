'use client';

import React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { SearchBar } from '../components/SearchBar';
import Categories from '../components/Categories';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

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

      {/* CTA Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ish beruvchimisiz?</h2>
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