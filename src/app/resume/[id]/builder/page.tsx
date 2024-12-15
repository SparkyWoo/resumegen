import React from 'react';
import { supabaseAdmin } from '@/lib/supabase';
import { Resume } from '@/types';
import { ResumeBuilderWrapper } from '@/components/resume-builder/ResumeBuilderWrapper';
import { ResumeState } from '@lib/redux/resumeSlice';

interface Props {
  params: {
    id: string;
  };
}

async function getResume(id: string) {
  console.log('Fetching resume with ID:', id);
  const { data, error } = await supabaseAdmin
    .from('resumes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching resume:', error);
    throw error;
  }
  
  if (!data) {
    console.error('No resume found with ID:', id);
    throw new Error('Resume not found');
  }

  console.log('Resume data:', data);
  return data as Resume;
}

function mapDatabaseToResumeState(resume: Resume): ResumeState {
  console.log('Mapping resume to state:', resume);
  const state = {
    basics: {
      name: resume.name || '',
      email: resume.email || '',
      phone: resume.phone || '',
      location: resume.location || '',
      url: resume.url || '',
      summary: resume.summary || ''
    },
    work: Array.isArray(resume.work) ? resume.work : [],
    education: Array.isArray(resume.education) ? resume.education : [],
    projects: Array.isArray(resume.projects) ? resume.projects : [],
    skills: Array.isArray(resume.skills) ? resume.skills : []
  };
  console.log('Mapped state:', state);
  return state;
}

export default async function ResumeBuilderPage({ params }: Props) {
  try {
    const resume = await getResume(params.id);
    const mappedData = mapDatabaseToResumeState(resume);

    if (!mappedData || !mappedData.basics) {
      throw new Error('Invalid resume data structure');
    }

    return (
      <main className="min-h-screen bg-gray-50">
        <ResumeBuilderWrapper 
          initialData={mappedData} 
          githubData={resume.github_data}
          jobData={resume.job_data}
        />
      </main>
    );
  } catch (error) {
    console.error('Error in ResumeBuilderPage:', error);
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Resume</h1>
          <p className="text-gray-600">Unable to load the resume. Please try again later.</p>
        </div>
      </main>
    );
  }
} 