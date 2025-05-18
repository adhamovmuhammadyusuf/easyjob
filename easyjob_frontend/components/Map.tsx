/// <reference types="google.maps" />
import React from 'react';
import { MapPin } from 'lucide-react';

interface MapProps {
  center: [number, number];
  zoom?: number;
  marker?: [number, number];
  className?: string;
}

export default function Map({ center, className = 'h-[400px]' }: MapProps) {
  const openInGoogleMaps = () => {
    const [lat, lng] = center;
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  return (
    <div 
      className={`${className} bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center cursor-pointer group`}
      onClick={openInGoogleMaps}
    >
      <div className="text-center group-hover:scale-105 transition-transform duration-200">
        <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-3" />
        <p className="text-sm text-gray-600 mb-2">Bizning manzilimiz</p>
        <p className="text-blue-600 font-medium">
          Google Maps orqali ko'rish
        </p>
      </div>
    </div>
  );
} 