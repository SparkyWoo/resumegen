import React from 'react';
import { supabase } from '@/lib/supabase';
import { Resume } from '@/types';
import dynamic from 'next/dynamic';

// Import open-resume editor dynamically to avoid SSR issues
const ResumeEditor = dynamic(
  () => import('@/components/ResumeEditor'),
  { ssr: false }
);

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

export default async function EditResumePage({ params }: Props) {
  const resume = await getResume(params.id);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <ResumeEditor 
          initialData={resume}
          onSave={async (data) => {
            // Save will be implemented in ResumeEditor component
          }}
        />
      </div>
    </main>
  );
} 