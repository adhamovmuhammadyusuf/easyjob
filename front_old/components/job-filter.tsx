"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Briefcase, DollarSign, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobFilterProps {
  onFilterChange: (filters: { location: string; salary: string; job_type: string }) => void;
}

export default function JobFilter({ onFilterChange }: JobFilterProps) {
  const [location, setLocation] = React.useState("all");
  const [salary, setSalary] = React.useState("all");
  const [jobType, setJobType] = React.useState("all");

  const handleLocationChange = (value: string) => {
    setLocation(value);
    onFilterChange({
      location: value === 'all' ? '' : value,
      salary: salary === 'all' ? '' : salary,
      job_type: jobType === 'all' ? '' : jobType
    });
  };

  const handleSalaryChange = (value: string) => {
    setSalary(value);
    onFilterChange({
      location,
      salary: value === 'all' ? '' : value,
      job_type: jobType === 'all' ? '' : jobType
    });
  };

  const handleJobTypeChange = (value: string) => {
    setJobType(value);
    onFilterChange({
      location,
      salary: salary === 'all' ? '' : salary,
      job_type: value === 'all' ? '' : value
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-100/20 transition-all duration-300">
      <div className="px-6 py-5 border-b border-blue-50">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Filter Jobs
        </h3>
      </div>
      
      <div className="p-6 space-y-8">
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            Location
          </Label>
          <div className="relative">
            <Select value={location} onValueChange={handleLocationChange}>
              <SelectTrigger className="w-full bg-white border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/10 transition-all duration-200 focus:border-blue-500 focus:ring-blue-500 text-gray-900">
                <SelectValue placeholder="Select location" className="text-gray-900" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-100 shadow-lg rounded-lg">
                <SelectItem value="all" className="hover:bg-blue-50/80 transition-colors text-gray-900 data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-700">
                  All Locations
                </SelectItem>
                <SelectItem value="tashkent" className="hover:bg-blue-50/80 transition-colors text-gray-900 data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-700">
                  Tashkent
                </SelectItem>
                <SelectItem value="andijan" className="hover:bg-blue-50/80 transition-colors text-gray-900 data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-700">
                  Andijan
                </SelectItem>
                <SelectItem value="fergana" className="hover:bg-blue-50/80 transition-colors text-gray-900 data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-700">
                  Fergana
                </SelectItem>
                <SelectItem value="namangan" className="hover:bg-blue-50/80 transition-colors text-gray-900 data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-700">
                  Namangan
                </SelectItem>
                <SelectItem value="remote" className="hover:bg-blue-50/80 transition-colors text-gray-900 data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-700">
                  Remote
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-blue-500" />
            Salary Range
          </Label>
          <div className="relative">
            <Select value={salary} onValueChange={handleSalaryChange}>
              <SelectTrigger className="w-full bg-white border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/10 transition-all duration-200 focus:border-blue-500 focus:ring-blue-500 text-gray-900">
                <SelectValue placeholder="Select range" className="text-gray-900" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-100 shadow-lg rounded-lg">
                <SelectItem value="all" className="hover:bg-blue-50/80 transition-colors text-gray-900 data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-700">
                  All Ranges
                </SelectItem>
                <SelectItem value="0-5000000" className="hover:bg-blue-50/80 transition-colors text-gray-900 data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-700">
                  $0 - $50,000
                </SelectItem>
                <SelectItem value="50000-100000" className="hover:bg-blue-50/80 transition-colors text-gray-900 data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-700">
                  $50,000 - $100,000
                </SelectItem>
                <SelectItem value="100000+" className="hover:bg-blue-50/80 transition-colors text-gray-900 data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-700">
                  $100,000+
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-blue-500" />
            Job Type
          </Label>
          <div className="relative">
            <Select value={jobType} onValueChange={handleJobTypeChange}>
              <SelectTrigger className="w-full bg-white border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/10 transition-all duration-200 focus:border-blue-500 focus:ring-blue-500 text-gray-900">
                <SelectValue placeholder="Select type" className="text-gray-900" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-100 shadow-lg rounded-lg">
                <SelectItem value="all" className="hover:bg-blue-50/80 transition-colors data-[state=checked]:bg-blue-50">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    All Types
                  </div>
                </SelectItem>
                <SelectItem value="full_time" className="hover:bg-blue-50/80 transition-colors data-[state=checked]:bg-blue-50">
                  <div className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                    "bg-green-100 text-green-700 border border-green-200"
                  )}>
                    Full Time
                  </div>
                </SelectItem>
                <SelectItem value="part_time" className="hover:bg-blue-50/80 transition-colors data-[state=checked]:bg-blue-50">
                  <div className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                    "bg-blue-100 text-blue-700 border border-blue-200"
                  )}>
                    Part Time
                  </div>
                </SelectItem>
                <SelectItem value="contract" className="hover:bg-blue-50/80 transition-colors data-[state=checked]:bg-blue-50">
                  <div className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                    "bg-purple-100 text-purple-700 border border-purple-200"
                  )}>
                    Contract
                  </div>
                </SelectItem>
                <SelectItem value="internship" className="hover:bg-blue-50/80 transition-colors data-[state=checked]:bg-blue-50">
                  <div className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                    "bg-orange-100 text-orange-700 border border-orange-200"
                  )}>
                    Internship
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

