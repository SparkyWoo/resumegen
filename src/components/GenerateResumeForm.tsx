'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { FaLinkedin } from 'react-icons/fa';

interface FormData {
  githubUsername: string;
}

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
    if (!session) {
      signIn('linkedin', { 
        callbackUrl: `${window.location.origin}/?jobUrl=${encodeURIComponent(jobUrl)}`
      });
      return;
    }
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
      router.push(`/resume/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

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
          disabled={!!jobUrlFromParams}
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
          className="inline-flex items-center rounded-md bg-[#0A66C2] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#004182] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A66C2]"
        >
          {isLoading ? (
            'Generating...'
          ) : session ? (
            'Generate Resume'
          ) : (
            <>
              <FaLinkedin className="mr-2 h-5 w-5" />
              Sign in with LinkedIn
            </>
          )}
        </button>
      </div>
    </form>
  );
} 