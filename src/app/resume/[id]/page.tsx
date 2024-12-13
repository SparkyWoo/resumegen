import React from 'react';
import { supabase } from '@/lib/supabase';
import { Resume } from '@/types';
import { ResumePreview } from '@/components/ResumePreview';

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

export default async function ResumePage({ params }: Props) {
  const resume = await getResume(params.id);

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Your Generated Resume</h1>
        <ResumePreview 
          resume={resume} 
          onEdit={() => window.location.href = `/resume/${params.id}/edit`} 
        />
      </div>
    </main>
  );
} 