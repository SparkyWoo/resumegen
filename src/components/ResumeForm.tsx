'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

export function ResumeForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    githubUsername: '',
    jobUrl: '',
  });
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
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      router.push(`/resume/${data.id}`);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">GitHub Username</label>
        <input
          type="text"
          required
          value={formData.githubUsername}
          onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Job URL</label>
        <input
          type="url"
          required
          value={formData.jobUrl}
          onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
      >
        {!session ? 'Sign in with LinkedIn' : loading ? 'Generating...' : 'Generate Resume'}
      </button>
    </form>
  );
} 