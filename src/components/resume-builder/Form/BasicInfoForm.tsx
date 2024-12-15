'use client';

import React, { useState, useEffect } from 'react';
import { ResumeState } from '@/lib/redux/resumeSlice';

interface Props {
  data: ResumeState['basics'];
  onChange: (data: ResumeState['basics']) => void;
  jobData?: {
    url: string;
    title: string;
    description: string;
    skills: string[];
    requirements?: string[];
  };
}

export const BasicInfoForm = ({ data, onChange, jobData }: Props) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (field: keyof ResumeState['basics']) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange({
      ...data,
      [field]: e.target.value
    });
  };

  const generateSummary = async (jobUrl: string) => {
    try {
      setIsGenerating(true);
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobUrl })
      });

      if (!response.ok) throw new Error('Failed to generate summary');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let summary = '';

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        summary += decoder.decode(value);
      }

      onChange({
        ...data,
        summary: summary.trim()
      });
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-generate summary when job data is available
  useEffect(() => {
    if (jobData?.url && !data.summary && !isGenerating) {
      generateSummary(jobData.url);
    }
  }, [jobData?.url, data.summary, isGenerating]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={data.name}
            onChange={handleChange('name')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={data.email}
            onChange={handleChange('email')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={data.phone}
            onChange={handleChange('phone')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            value={data.location}
            onChange={handleChange('location')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="City, State"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">Professional Summary</label>
          {isGenerating && (
            <span className="text-sm text-blue-600">Generating summary...</span>
          )}
        </div>
        <textarea
          value={data.summary}
          onChange={handleChange('summary')}
          rows={4}
          className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="A brief summary of your professional background and key strengths"
        />
      </div>
    </div>
  );
}; 