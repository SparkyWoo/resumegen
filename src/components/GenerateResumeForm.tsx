'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

export function GenerateResumeForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [jobUrl, setJobUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      signIn('linkedin');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobUrl,
          userId: session.user?.id,
          userData: {
            name: session.user?.name || '',
            email: session.user?.email || '',
          }
        }),
      });
      
      if (!response.ok) throw new Error('Failed to generate resume');
      
      const data = await response.json();
      router.push(`/resume/${data.id}/builder`);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Job Posting URL
        </label>
        <input
          type="url"
          required
          placeholder="https://..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={jobUrl}
          onChange={(e) => setJobUrl(e.target.value)}
        />
      </div>

      {session ? (
        <div className="flex items-center space-x-3 mb-4">
          {session.user?.image && (
            <img
              src={session.user.image}
              alt={session.user.name || ''}
              className="h-10 w-10 rounded-full"
            />
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
            <p className="text-sm text-gray-500">{session.user?.email}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center">
          You'll need to sign in with LinkedIn to generate your resume
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Generating...' : session ? 'Generate Resume' : 'Sign in with LinkedIn'}
      </button>
    </form>
  );
} 