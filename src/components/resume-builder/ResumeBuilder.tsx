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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-[1600px] px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="col-span-1 space-y-8">
            <div className="rounded-lg bg-white p-8 shadow">
              <h1 className="mb-6 text-3xl font-bold">Resume Builder</h1>
              <Form />
            </div>
          </div>
          <div className="col-span-1 lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
            <div className="h-full rounded-lg bg-white p-8 shadow">
              <Resume />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 