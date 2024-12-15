import React, { Suspense } from 'react';
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
        <Suspense fallback={
          <div className="space-y-6 bg-white p-8 rounded-lg shadow animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-20 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        }>
          <GenerateResumeForm />
        </Suspense>
      </div>
    </main>
  );
} 