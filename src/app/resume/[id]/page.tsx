import React from 'react';
import { supabase } from '@/lib/supabase';
import { Resume } from '@/types';
import { ResumePreview } from '@/components/ResumePreview';
import { Metadata } from 'next';

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

export const metadata: Metadata = {
  title: 'Resume Builder - Create Professional Resumes | ResumeHey',
  description: 'Build your professional resume with our AI-powered resume builder. Get real-time ATS score analysis, keyword optimization, and tailored interview tips.',
  openGraph: {
    title: 'Resume Builder - Create Professional Resumes | ResumeHey',
    description: 'Build your professional resume with our AI-powered resume builder. Get real-time ATS score analysis and keyword optimization.',
    images: [
      {
        url: 'https://resumehey.com/resume-builder-og.png',
        width: 1200,
        height: 630,
        alt: 'ResumeHey Resume Builder'
      }
    ]
  },
  twitter: {
    title: 'Resume Builder - Create Professional Resumes | ResumeHey',
    description: 'Build your professional resume with our AI-powered resume builder.',
    images: ['https://resumehey.com/resume-builder-og.png']
  }
};

export default async function ResumePage({ params }: Props) {
  const resume = await getResume(params.id);

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Your Generated Resume</h1>
        <ResumePreview resume={resume} />
      </div>
    </main>
  );
} 