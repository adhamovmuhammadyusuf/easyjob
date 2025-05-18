'use client';

import React from 'react';
import { Search, MapPin, Briefcase } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onLocationChange?: (location: string) => void;
  onTypeChange?: (type: string) => void;
  variant?: 'light' | 'dark';
  placeholder?: string;
  initialValue?: string;
}

export function SearchBar({ 
  onSearch, 
  onLocationChange, 
  onTypeChange,
  variant = 'light',
  placeholder = "Kalit so'z orqali qidiring...",
  initialValue = ''
}: SearchBarProps) {  const bgColor = variant === 'dark' ? 'bg-white/90' : 'bg-gray-50';
  const textColor = 'text-gray-900';
  const iconColor = 'text-gray-400';
  const focusRing = 'focus:ring-blue-500';
  const focusBg = 'focus:bg-white';

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className={`grid grid-cols-1 ${onLocationChange || onTypeChange ? 'md:grid-cols-3' : ''} gap-3 ${variant === 'dark' ? 'bg-white/5' : 'bg-white'} p-2 rounded-2xl shadow-lg`}>
        {/* Search Input */}
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${iconColor} h-5 w-5`} />
          <input
            type="text"
            defaultValue={initialValue}
            placeholder={placeholder}
            className={`w-full pl-10 pr-4 py-3 ${bgColor} border-0 rounded-xl ${focusRing} ${focusBg} ${textColor} transition-all duration-200`}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        {/* Location Filter */}
        {onLocationChange && (
          <div className="relative">
            <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${iconColor} h-5 w-5`} />
            <select
              className={`w-full pl-10 pr-4 py-3 ${bgColor} border-0 rounded-xl ${focusRing} ${focusBg} ${textColor} transition-all duration-200 appearance-none cursor-pointer`}
              onChange={(e) => onLocationChange(e.target.value)}
            >
              <option value="">Barcha joylar</option>
              <option value="tashkent">Toshkent</option>
              <option value="andijan">Andijon</option>
              <option value="fergana">Farg'ona</option>
              <option value="namangan">Namangan</option>
              <option value="remote">Masofaviy</option>
            </select>
          </div>
        )}

        {/* Job Type Filter */}
        {onTypeChange && (
          <div className="relative">
            <Briefcase className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${iconColor} h-5 w-5`} />
            <select
              className={`w-full pl-10 pr-4 py-3 ${bgColor} border-0 rounded-xl ${focusRing} ${focusBg} ${textColor} transition-all duration-200 appearance-none cursor-pointer`}
              onChange={(e) => onTypeChange(e.target.value)}
            >
              <option value="">Barcha turlar</option>
              <option value="full_time">To'liq stavka</option>
              <option value="part_time">Yarim stavka</option>
              <option value="contract">Kontrakt</option>
              <option value="internship">Amaliyot</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
} 