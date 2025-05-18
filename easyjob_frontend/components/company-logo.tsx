import * as React from "react";
import { Building } from "lucide-react";

interface CompanyLogoProps {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-24 h-24",
};

const iconSizes = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

export function CompanyLogo({ src, alt, size = "md", className = "" }: CompanyLogoProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizes[size]} rounded-lg object-contain ${className}`}
      />
    );
  }

  return (
    <div className={`${sizes[size]} bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
      <Building className={`${iconSizes[size]} text-gray-400`} />
    </div>
  );
}
