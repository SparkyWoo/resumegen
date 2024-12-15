'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaLock } from 'react-icons/fa';

export function GenerateResumeForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const jobUrlFromParams = searchParams.get('jobUrl');
  
  const [jobUrl, setJobUrl] = useState(jobUrlFromParams || '');
  const [githubUsername, setGithubUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobUrl,
          userId: session?.user?.id,
          userData: {
            name: session.user?.name || '',
            email: session.user?.email || '',
            githubUsername
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to generate resume');
      }

      const data = await response.json();
      router.push(`/resume/${data.id}/builder`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
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
          required
          placeholder="https://..."
          value={jobUrl}
          onChange={(e) => setJobUrl(e.target.value)}
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
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            placeholder="username"
            className="block w-full rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          We'll import your public repositories to showcase in your resume
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isLoading ? 'Generating...' : 'Generate Resume'}
        </button>
      </div>
    </form>
  );
} 