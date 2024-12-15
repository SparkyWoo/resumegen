'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaLock } from 'react-icons/fa';

interface FormState {
  jobUrl: string;
  githubUsername: string;
  isLoading: boolean;
  error: string;
}

interface ResumeResponse {
  id: string;
  [key: string]: unknown;
}

interface UserData {
  name: string;
  email: string;
  githubUsername: string;
}

export function GenerateResumeForm(): JSX.Element {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const jobUrlFromParams = searchParams.get('jobUrl');
  
  const [formState, setFormState] = useState<FormState>({
    jobUrl: jobUrlFromParams || '',
    githubUsername: '',
    isLoading: false,
    error: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!session) return;
    
    setFormState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const userData: UserData = {
        name: session.user?.name || '',
        email: session.user?.email || '',
        githubUsername: formState.githubUsername
      };

      const response = await fetch('/api/generate/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobUrl: formState.jobUrl,
          userId: session.user?.id,
          userData
        }),
      });

      if (!response.ok) {
        const error = await response.json() as { details: string };
        throw new Error(error.details || 'Failed to generate resume');
      }

      const data = await response.json() as ResumeResponse;
      router.push(`/resume/${data.id}/builder`);
    } catch (error: unknown) {
      setFormState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Something went wrong'
      }));
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  };

  if (!session) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-blue-100">
          <FaLock className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign in Required</h3>
        <p className="text-gray-600 mb-4">
          Please sign in with LinkedIn using the button in the top navigation bar to generate your resume.
        </p>
        <p className="text-sm text-gray-500">
          We'll use your LinkedIn profile to pre-fill your professional experience.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="jobUrl" className="block text-sm font-medium text-gray-700">
          Job Posting URL
        </label>
        <input
          type="url"
          id="jobUrl"
          name="jobUrl"
          required
          placeholder="https://..."
          value={formState.jobUrl}
          onChange={handleInputChange}
          disabled={!!jobUrlFromParams && jobUrlFromParams.length > 0}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Paste a job posting URL from Lever or Greenhouse
        </p>
      </div>

      <div>
        <label htmlFor="githubUsername" className="block text-sm font-medium text-gray-700">
          GitHub Username (Optional)
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
            github.com/
          </span>
          <input
            type="text"
            id="githubUsername"
            name="githubUsername"
            value={formState.githubUsername}
            onChange={handleInputChange}
            placeholder="username"
            className="block w-full rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          We'll import your public repositories to showcase in your resume
        </p>
      </div>

      {formState.error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{formState.error}</div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={formState.isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {formState.isLoading ? 'Generating...' : 'Generate Resume'}
        </button>
      </div>
    </form>
  );
} 