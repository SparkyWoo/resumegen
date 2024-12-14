'use client';

import React, { useEffect, useState } from 'react';
import { Resume } from '@/components/resume-builder/Resume';
import { Form } from '@/components/resume-builder/Form';
import { useAppDispatch, useAppSelector } from '@lib/redux/hooks';
import { initializeResume } from '@/lib/redux/resumeSlice';
import { ResumeState } from '@/lib/redux/resumeSlice';
import { PDFViewer } from './Resume/PDFViewer';

interface Props {
  initialData: ResumeState;
  githubData?: {
    repositories: Array<{
      name: string;
      description: string | null;
      language: string;
      stars: number;
      url: string;
    }>;
  };
}

export const ResumeBuilder = ({ initialData, githubData }: Props) => {
  const dispatch = useAppDispatch();
  const resume = useAppSelector(state => state.resume);
  const [activeSection, setActiveSection] = useState('basics');

  useEffect(() => {
    dispatch(initializeResume(initialData));
  }, [dispatch, initialData]);

  const sections = [
    { id: 'basics', label: 'Basic Info' },
    { id: 'work', label: 'Experience' },
    { id: 'education', label: 'Education' },
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

  return (
    <main className="relative h-full w-full overflow-hidden bg-zinc-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-zinc-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Resume Builder</h1>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Download PDF
          </button>
        </div>
        {/* Section Navigation */}
        <div className="flex gap-1 mt-4 border-b border-zinc-200">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-md ${
                activeSection === section.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid h-screen grid-cols-1 lg:grid-cols-2 pt-32">
        {/* Form Section */}
        <div className="h-full overflow-y-auto border-r border-zinc-200 bg-white px-6 scrollbar-thin scrollbar-track-zinc-100 scrollbar-thumb-zinc-300">
          <div className="mx-auto w-full max-w-3xl py-8">
            <Form 
              githubData={githubData} 
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>
        </div>

        {/* Preview Section - Always visible on large screens */}
        <div className="relative h-screen overflow-hidden bg-zinc-100/50 hidden lg:block">
          <div className="absolute inset-0">
            <PDFViewer data={resume} />
          </div>
        </div>
      </div>
    </main>
  );
}; 