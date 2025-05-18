"use client";

import { useState, useEffect } from "react";
import { applyForJob } from "../lib/api/jobs";
import { useToast } from "../hooks/use-toast";
import { formatSalary } from "../lib/format";
import { getUserResumes } from "../lib/api/resumes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { useAuth } from "../hooks/use-auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Briefcase, MapPin, DollarSign, FileText, Calendar } from "lucide-react";
import { Label } from "../components/ui/label";
import Link from "next/link";
import { formatJobType, getJobTypeBadgeColor } from "../lib/format-job-type";
import ErrorBoundary from './error-boundary';

import { Job as ApiJob } from "../lib/api/types";

interface Job extends Omit<ApiJob, 'skills_list'> {
  // Extended to support both possible formats of skills_list
  skills_list: string[] | Array<{ id: number; name: string }>;
}

interface Resume {
  id: number;
  title: string;
}

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  // Use default values to avoid undefined errors
  const {
    title = 'Untitled Position',
    company_name = 'Unknown Company',
    description = '',
    salary_min = 0,
    salary_max = 0,
    location = 'Remote/Flexible',
    created_at = new Date().toISOString(),
    job_type = 'full_time',
    company_logo = '',
    category_name = '',
    skills_list = [],
    id = 0,
  } = job || {};

  // Safely get properties with fallbacks for undefined values
  const safeTitle = title || 'Untitled Position';
  const safeCompanyName = company_name || 'Unknown Company';
  const safeLocation = location || 'Remote/Flexible';
  const safeJobType = job_type || 'Full-time';
  const safeSkills = Array.isArray(skills_list) ? skills_list : [];
  
  // Format salary as a range if available
  const salaryText = (salary_min || salary_max) 
    ? formatSalary(salary_min, salary_max) 
    : 'Salary not specified';
  
  // Format created date
  const formattedDate = created_at 
    ? new Date(created_at).toLocaleDateString() 
    : 'Recently posted';

  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedResume, setSelectedResume] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userResumes, setUserResumes] = useState<Resume[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchResumes = async () => {
      if (!user) return;
      
      try {
        const response = await getUserResumes();
        if (response.results.length === 0) {
          toast({
            title: "Rezyume topilmadi",
            description: "Iltimos, avval rezyume yuklang.",
            variant: "destructive",
          });
          return;
        }
        setUserResumes(response.results);
      } catch (error: any) {
        console.error("Error fetching resumes:", error);
        let errorMessage = "Rezyumelarni yuklashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.";
        
        if (error.response?.status === 401) {
          errorMessage = "Rezyumelarni ko'rish uchun tizimga kirishingiz kerak.";
        } else if (error.response?.status === 404) {
          errorMessage = "Rezyumalar topilmadi.";
        }
        
        toast({
          title: "Xatolik",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    if (isDialogOpen) {
      fetchResumes();
    }
  }, [user]);

  const handleApply = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to apply for this position",
        variant: "destructive",
      });
      return;
    }

    if (!selectedResume) {
      toast({
        title: "Resume Required",
        description: "Please select a resume to apply",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsApplying(true);
      await applyForJob(job.id, {
        resume: selectedResume,
        cover_letter: coverLetter.trim()
      });

      setIsDialogOpen(false);
      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted.",
      });

      setCoverLetter("");
      setSelectedResume("");
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <ErrorBoundary fallback={
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-red-600">Error displaying job. Please try again later.</p>
      </div>
    }>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {company_logo ? (
                <img
                  src={company_logo}
                  alt={`${company_name} logo`}
                  className="w-12 h-12 rounded-lg object-contain border p-1"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div>
                <Link href={`/jobs/${job.id}`}>
                  <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    {safeTitle}
                  </h2>
                </Link>
                <p className="text-gray-600">{safeCompanyName}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                {safeLocation}
              </div>
              {(salary_min || salary_max) && (
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {salaryText}
                </div>
              )}
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                {formattedDate}
              </div>
            </div>

            <p className="text-gray-700 mb-4 line-clamp-2">{description}</p>          {safeSkills && safeSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.isArray(safeSkills) && safeSkills.map((skill, index) => (
                  <span
                    key={typeof skill === 'string' ? `skill-${index}` : skill.id}
                    className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                  >
                    {typeof skill === 'string' ? skill : skill.name}
                  </span>
                ))}
              </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Apply Now
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Apply for {safeTitle}</DialogTitle>
                  <DialogDescription>
                    Please complete your application below. Make sure to include a
                    compelling cover letter.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="resume">Select Resume</Label>
                    <Select
                      value={selectedResume}
                      onValueChange={setSelectedResume}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a resume" />
                      </SelectTrigger>
                      <SelectContent>
                        {userResumes.map((resume) => (
                          <SelectItem key={resume.id} value={resume.id.toString()}>
                            {resume.title}
                          </SelectItem>
                        ))}
                        {userResumes.length === 0 && (
                          <SelectItem value="" disabled>
                            No resumes available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <Link
                        href="/profile/resumes"
                        className="text-blue-600 hover:underline"
                      >
                        Upload a new resume
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cover_letter">Cover Letter</Label>
                    <Textarea
                      id="cover_letter"
                      placeholder="Write a compelling cover letter..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="min-h-[150px]"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    onClick={handleApply}
                    disabled={isApplying || !coverLetter || !selectedResume}
                    className="w-full"
                  >
                    {isApplying ? "Submitting..." : "Submit Application"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

