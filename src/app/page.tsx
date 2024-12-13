import React from 'react';
import { GenerateResumeForm } from '@/components/GenerateResumeForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-2">
          Generate Your Tailored Resume
        </h1>
        <p className="text-center text-gray-600 mb-8">
          60-second resume tailored to your dream job
        </p>
        <GenerateResumeForm />
      </div>
    </main>
  );
} 