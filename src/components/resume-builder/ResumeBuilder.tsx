'use client';

import React, { useEffect, useState } from 'react';
import { Resume } from '@/components/resume-builder/Resume';
import { Form } from '@/components/resume-builder/Form';
import { useAppDispatch, useAppSelector } from '@lib/redux/hooks';
import { initializeResume } from '@/lib/redux/resumeSlice';
import { ResumeState } from '@/lib/redux/resumeSlice';
import { PDFViewer } from './Resume/PDFViewer';
import { Logo } from '@/components/Logo';
import Link from 'next/link';
import { FaDownload } from 'react-icons/fa';
import { ATSScore } from '@/components/premium/ATSScore';
import { InterviewTips } from '@/components/premium/InterviewTips';
import { PaymentModal } from '@/components/premium/PaymentModal';
import { useSession } from 'next-auth/react';

interface Props {
  initialData: ResumeState;
  resumeId: string;
  githubData?: {
    repositories: Array<{
      name: string;
      description: string | null;
      language: string;
      stars: number;
      url: string;
    }>;
  };
  jobData?: {
    url: string;
    title: string;
    description: string;
    skills: string[];
    requirements?: string[];
  };
}

export const ResumeBuilder = ({ initialData, resumeId, githubData, jobData }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const resume = useAppSelector(state => state.resume);
  const [activeSection, setActiveSection] = useState('basics');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    dispatch(initializeResume(initialData));
  }, [dispatch, initialData]);

  const sections = [
    { id: 'basics', label: 'Basic Info' },
    { id: 'work', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownload = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    
    try {
      // Call the PDF viewer's download function
      await (window as any).downloadResumePDF();
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      // Add a small delay before resetting state to show the animation
      setTimeout(() => {
        setIsDownloading(false);
      }, 300);
    }
  };

  const handleUpgrade = async () => {
    if (!session?.user) return;

    setPaymentError(null);
    
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeId,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setPaymentError(data.error);
        setIsPaymentModalOpen(true);
        return;
      }

      setClientSecret(data.clientSecret);
      setIsPaymentModalOpen(true);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setPaymentError('Failed to initialize payment. Please try again later.');
      setIsPaymentModalOpen(true);
    }
  };

  return (
    <main className="h-screen w-full bg-zinc-50">
      {/* Fixed Header */}
      <nav className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <Logo size={28} />
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* Premium Features Button */}
              <button
                onClick={handleUpgrade}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="mr-2">✨</span>
                Unlock Premium Features
              </button>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
                  isDownloading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                <FaDownload className={`mr-2 h-4 w-4 ${isDownloading ? 'animate-bounce' : ''}`} />
                {isDownloading ? 'Preparing...' : 'Download PDF'}
              </button>
            </div>
          </div>

          {/* Section Navigation */}
          <div className="flex gap-1 -mb-px">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  activeSection === section.id
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="grid h-[calc(100vh-116px)] grid-cols-1 lg:grid-cols-2 mt-[116px]">
        {/* Form Section */}
        <div className="overflow-y-auto border-r border-zinc-200 bg-white px-6">
          <div className="mx-auto w-full max-w-3xl py-8">
            <Form 
              githubData={githubData} 
              jobData={jobData}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>
        </div>

        {/* Preview Section - Always visible on large screens */}
        <div className="sticky top-[116px] h-[calc(100vh-116px)] overflow-hidden bg-zinc-100/50 hidden lg:block">
          <PDFViewer data={resume} />
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setPaymentError(null);
        }}
        clientSecret={clientSecret}
        error={paymentError}
      />
    </main>
  );
}; 