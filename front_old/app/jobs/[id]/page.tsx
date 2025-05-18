'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Job, Company } from '../../../lib/api/types';
import { MapPin, Building2, Calendar, Clock, Briefcase, DollarSign, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Textarea } from "../../../components/ui/textarea";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardContent } from "../../../components/ui/card";
import { applyForJob } from '../../../lib/api/jobs';

const formatJobType = (type: string) => {
  const mapping: Record<string, string> = {
    'full_time': 'Full time',
    'part_time': 'Part time',
    'contract': 'Contract',
    'internship': 'Internship',
    'temporary': 'Temporary'
  };
  return mapping[type.toLowerCase()] || type;
};

export default function JobDetailsPage() {
  const params = useParams();
  const [vacancy, setVacancy] = useState<Job | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState('');

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get auth token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please login to view job details');
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };        // First get the specific vacancy
        const vacancyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/vacancies/${params.id}/`, {
          headers
        });
        if (!vacancyResponse.ok) {
          throw new Error('Failed to fetch job details');
        }
        const vacancy = await vacancyResponse.json();

        if (!vacancy) {
          throw new Error('Job posting not found');
        }
        setVacancy(vacancy);        // Then fetch company details
        const companyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/companies/${vacancy.company}/`, {
          headers
        });
        if (!companyResponse.ok) {
          throw new Error('Failed to fetch company details');
        }
        const companyData = await companyResponse.json();
        setCompany(companyData);
      } catch (err: any) {
        console.error('Error fetching job details:', err);
        setError(err.message || 'Failed to load job details');
        
        // If unauthorized, redirect to login
        if (err.message === 'Please login to view job details') {
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchJobDetails();
    }
  }, [params.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setResumeError('File size should not exceed 5MB');
        return;
      }

      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (allowedTypes.includes(file.type)) {
        setResume(file);
        setResumeError('');
      } else {
        setResumeError('Please upload a PDF or Word document');
      }
    }
  };

  const handleApply = async () => {
    try {
      setApplying(true);
      setError(null);
      setResumeError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      if (!resume) {
        setResumeError('Please upload your resume');
        setApplying(false);
        return;
      }

      if (!coverLetter.trim()) {
        setError('Please write a cover letter');
        setApplying(false);
        return;
      }

      // Upload the resume file
      const formData = new FormData();
      formData.append('file', resume);

      const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/upload/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload resume');
      }

      const { file_id } = await uploadResponse.json();

      // Apply for the job using the uploaded file ID
      await applyForJob(Number(params.id), {
        resume: file_id,
        cover_letter: coverLetter.trim()
      });

      setApplicationSuccess(true);
      setShowModal(false);
    } catch (err: any) {
      console.error('Error applying for job:', err);
      if (err.response?.status === 413) {
        setError('File size too large. Please upload a smaller file.');
      } else if (err.response?.status === 415) {
        setError('Invalid file type. Please upload a PDF or Word document.');
      } else {
        setError(err.response?.data?.message || 'Failed to apply for the position. Please try again.');
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse bg-white rounded-2xl shadow-lg p-8">
            <div className="space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-8 w-2/3" />
                <div className="flex space-x-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
              <Skeleton className="h-32 w-full" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Xatolik</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/jobs">
              <Button>Ishlar ro'yxatiga qaytish</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!vacancy || !company) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header with gradient background */}
          <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <h1 className="text-3xl font-bold mb-4">{vacancy.title}</h1>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href={`/companies/${company.id}`}
                  className="flex items-center text-blue-100 hover:text-white transition-colors"
                >
                  <Building2 className="h-5 w-5 mr-2" />
                  {company.name}
                </Link>
                <div className="flex items-center text-blue-100">
                  <MapPin className="h-5 w-5 mr-2" />
                  {vacancy.location}
                </div>
                <div className="flex items-center text-blue-100">
                  <Calendar className="h-5 w-5 mr-2" />
                  {format(new Date(vacancy.created_at), 'MMM d, yyyy')} da e'lon qilingan
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-blue-50 border-0">
                <CardContent className="p-4">
                  <div className="flex items-center text-blue-700 mb-1">
                    <Clock className="h-5 w-5 mr-2" />
                    Ish turi
                  </div>
                  <div className="font-semibold text-blue-900">{formatJobType(vacancy.job_type)}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-0">
                <CardContent className="p-4">
                  <div className="flex items-center text-green-700 mb-1">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Maosh
                  </div>
                  <div className="font-semibold text-green-900">{vacancy.salary_min} - {vacancy.salary_max}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50 border-0">
                <CardContent className="p-4">
                  <div className="flex items-center text-purple-700 mb-1">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Kompaniya hajmi
                  </div>
                  <div className="font-semibold text-purple-900">{company.employee_count} xodim</div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <div className="prose max-w-none mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ish tavsifi</h2>
              <div className="text-gray-600 whitespace-pre-wrap">{vacancy.description}</div>
            </div>

            {/* Company Section */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Kompaniya haqida</h2>
              <div className="flex items-start gap-6 mb-6">
                <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                  {company.logo ? (
                    <Image
                      src={company.logo}
                      alt={company.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-blue-50">
                      <Building2 className="h-10 w-10 text-blue-500" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{company.name}</h3>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {company.location}
                    </div>
                    {company.website && (
                      <a 
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Veb-saytga o'tish
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">{company.description}</p>
            </div>

            {/* Apply Button */}
            <div className="mt-8 flex flex-col items-center gap-4">
              {applicationSuccess ? (
                <div className="text-center p-6 bg-green-50 rounded-xl">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <div className="text-green-800 font-semibold mb-2">Ariza yuborildi!</div>
                  <p className="text-green-700">
                    Sizning arizangiz muvaffaqiyatli yuborildi. Kompaniya siz bilan bog'lanadi.
                  </p>
                </div>
              ) : (
                <Button 
                  size="lg" 
                  onClick={() => setShowModal(true)}
                  disabled={applying}
                  className="w-full md:w-auto px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Ariza topshirish
                </Button>
              )}
              {error && (
                <div className="text-red-600 text-center bg-red-50 p-4 rounded-lg w-full">
                  {error}
                </div>
              )}
            </div>

            {/* Application Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogContent className="sm:max-w-[600px] p-0 gap-0">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-white">
                      {vacancy.title} lavozimiga ariza
                    </DialogTitle>
                    <DialogDescription className="text-blue-100 mt-2">
                      Iltimos, arizangizni to'ldiring. Xatni yaxshilab yozing.
                    </DialogDescription>
                  </DialogHeader>
                </div>

                <div className="p-6 space-y-6">
                  <Card className="border-2 border-dashed border-gray-200 hover:border-blue-400 transition-colors">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <Input
                            id="resume"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <Label 
                            htmlFor="resume" 
                            className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-700"
                          >
                            <Upload className="h-6 w-6" />
                            Resume yuklash
                          </Label>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">Resume</h4>
                          <p className="text-sm text-gray-500">PDF yoki Word formatida yuklang</p>
                        </div>
                      </div>
                      {resume && (
                        <div className="text-sm text-green-600 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          {resume.name}
                        </div>
                      )}
                      {resumeError && (
                        <p className="text-sm text-red-600 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          {resumeError}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="coverLetter" className="text-lg font-medium text-gray-900">
                        Xat
                      </Label>
                      <span className="text-sm text-gray-500">
                        {coverLetter.length} / 2000 belgi
                      </span>
                    </div>
                    <Textarea
                      id="coverLetter"
                      placeholder="O'zingizni tanishtiring va nima uchun aynan siz bu lavozimga munosib ekanligingizni tushuntiring..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="h-48 resize-none border-2 focus:border-blue-400"
                      maxLength={2000}
                    />
                    <p className="text-sm text-gray-500 italic">
                      Maslahat: Tegishli tajribangizni va nima uchun bu lavozim sizni qiziqtirishini tushuntiring
                    </p>
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowModal(false)}
                      className="px-6"
                    >
                      Bekor qilish
                    </Button>
                    <Button 
                      onClick={handleApply} 
                      disabled={applying}
                      className="px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                      {applying ? 'Yuborilmoqda...' : 'Yuborish'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}