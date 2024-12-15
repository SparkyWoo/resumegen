import React from 'react';
import { supabase } from '@/lib/supabase';
import { Resume } from '@/types';
import { ResumeBuilder } from '@/components/resume-builder/ResumeBuilder';
import { ResumeState } from '@lib/redux/resumeSlice';

interface Props {
  params: {
    id: string;
  };
}

async function getResume(id: string) {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Resume;
}

function mapDatabaseToResumeState(resume: Resume): ResumeState {
  return {
    basics: {
      name: resume.name || '',
      email: resume.email || '',
      phone: resume.phone || '',
      location: resume.location || '',
      url: resume.url || '',
      summary: resume.summary || ''
    },
    work: resume.work || [],
    education: resume.education || [],
    projects: resume.projects || [],
    skills: resume.skills || []
  };
}

export default async function ResumeBuilderPage({ params }: Props) {
  const resume = await getResume(params.id);

  return (
    <main className="min-h-screen bg-gray-50">
      <ResumeBuilder 
        initialData={mapDatabaseToResumeState(resume)} 
        githubData={resume.github_data}
        jobData={resume.job_data}
      />
    </main>
  );
} 