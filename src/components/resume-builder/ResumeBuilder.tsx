'use client';

import React, { useEffect } from 'react';
import { Resume } from '@/components/resume-builder/Resume';
import { Form } from '@/components/resume-builder/Form';
import { useAppDispatch } from '@lib/redux/hooks';
import { initializeResume } from '@lib/redux/resumeSlice';
import { ResumeState } from '@lib/redux/resumeSlice';

interface Props {
  initialData: ResumeState;
  githubData?: {
    repositories: Array<{
      name: string;
      description: string;
      url: string;
      language: string;
      stars: number;
      topics: string[];
    }>;
  };
  jobData?: {
    skills: string[];
  };
}

export const ResumeBuilder = ({ initialData, githubData, jobData }: Props) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize store with initial data
    dispatch(initializeResume(initialData));
  }, [initialData]);

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div className="col-span-1">
        <Form githubData={githubData} jobData={jobData} />
      </div>
      <div className="col-span-1">
        <Resume />
      </div>
    </div>
  );
}; 