'use client';

import React, { useEffect } from 'react';
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

  useEffect(() => {
    dispatch(initializeResume(initialData));
  }, [dispatch, initialData]);

  return (
    <main className="relative h-full w-full overflow-hidden bg-zinc-50">
      <div className="grid h-screen grid-cols-1 gap-0 lg:grid-cols-2">
        {/* Form Section */}
        <div className="h-full overflow-y-auto border-r border-zinc-200 bg-white px-6 scrollbar-thin scrollbar-track-zinc-100 scrollbar-thumb-zinc-300">
          <div className="mx-auto w-full max-w-3xl py-8">
            <h1 className="mb-8 text-3xl font-bold">Resume Builder</h1>
            <Form githubData={githubData} />
          </div>
        </div>

        {/* Preview Section */}
        <div className="relative h-screen overflow-hidden bg-zinc-100/50">
          <div className="absolute inset-0">
            <PDFViewer data={resume} />
          </div>
        </div>
      </div>
    </main>
  );
}; 