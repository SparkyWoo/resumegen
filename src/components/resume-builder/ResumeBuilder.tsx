'use client';

import React, { useEffect } from 'react';
import { Resume } from '@/components/resume-builder/Resume';
import { Form } from '@/components/resume-builder/Form';
import { useAppDispatch } from '@lib/redux/hooks';
import { initializeResume } from '@/lib/redux/resumeSlice';
import { ResumeState } from '@/lib/redux/resumeSlice';

interface Props {
  initialData: ResumeState;
}

export const ResumeBuilder = ({ initialData }: Props) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeResume(initialData));
  }, [dispatch, initialData]);

  return (
    <main className="relative h-full w-full overflow-hidden bg-zinc-50">
      <div className="grid h-[100vh] grid-cols-1 gap-0 lg:grid-cols-2">
        {/* Form Section */}
        <div className="h-full overflow-y-auto border-r border-zinc-200 bg-white px-6 scrollbar-thin scrollbar-track-zinc-100 scrollbar-thumb-zinc-300">
          <div className="mx-auto w-full max-w-3xl py-8">
            <h1 className="mb-8 text-3xl font-bold">Resume Builder</h1>
            <Form />
          </div>
        </div>

        {/* Preview Section */}
        <div className="relative h-full overflow-hidden bg-zinc-100/50">
          <div className="absolute inset-0 overflow-y-auto p-6 scrollbar-thin scrollbar-track-zinc-100 scrollbar-thumb-zinc-300">
            <div className="mx-auto w-full max-w-3xl">
              <Resume />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}; 