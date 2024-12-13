'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export function GenerateResumeForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    githubUsername: '',
    jobUrl: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/generate/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed to generate resume');
      
      const data = await response.json();
      router.push(`/resume/${data.id}`);
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
          GitHub Username
        </label>
        <input
          type="text"
          required
          placeholder="e.g. johndoe"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          value={formData.githubUsername}
          onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Job Posting URL
        </label>
        <input
          type="url"
          required
          placeholder="https://..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          value={formData.jobUrl}
          onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Resume'}
      </button>
    </form>
  );
} 