'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { FaLinkedin } from 'react-icons/fa';

interface FormData {
  name: string;
  email: string;
  githubUsername: string;
}

export function GenerateResumeForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const jobUrl = searchParams.get('jobUrl') || '';

  const [formData, setFormData] = useState<FormData>({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    githubUsername: ''
  });
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
          userData: formData
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
          disabled={!!jobUrl}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Paste a job posting URL from Lever or Greenhouse
        </p>
      </div>

      {session ? (
        <>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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
                value={formData.githubUsername}
                onChange={handleChange}
                placeholder="username"
                className="block w-full rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              We'll import your public repositories to showcase in your resume
            </p>
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">Sign in to generate your resume</p>
          <button
            type="button"
            onClick={() => signIn('linkedin')}
            className="inline-flex items-center rounded-md bg-[#0A66C2] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#004182] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A66C2]"
          >
            <FaLinkedin className="mr-2 h-5 w-5" />
            Sign in with LinkedIn
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {session && (
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Generating...' : 'Generate Resume'}
          </button>
        </div>
      )}
    </form>
  );
} 