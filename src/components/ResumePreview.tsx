'use client';

import React from 'react';
import { Resume } from '@/types';
import { useRouter } from 'next/navigation';

interface Props {
  resume: Resume;
}

export function ResumePreview({ resume }: Props) {
  const router = useRouter();
  const { linkedin_data, github_data, job_data } = resume;

  return (
    <div className="bg-white shadow-lg rounded-lg p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold">
          Resume Preview
        </h2>
      </div>

      {/* GitHub Section */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4">GitHub Projects</h3>
        {github_data.repositories.map((repo: any, i: number) => (
          <div key={i} className="mb-4">
            <h4 className="font-medium">{repo.name}</h4>
            <p className="text-sm text-gray-600">{repo.description}</p>
            <div className="mt-1 flex gap-2 text-sm">
              <span className="text-gray-500">{repo.language}</span>
              <span className="text-gray-500">⭐ {repo.stars}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Job Details */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Job Match</h3>
        <div className="mb-4">
          <h4 className="font-medium">Position</h4>
          <p>{job_data.title}</p>
        </div>
        <div className="mb-4">
          <h4 className="font-medium">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {job_data.skills.map((skill: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => router.push(`/resume/${resume.id}/edit`)}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Edit Resume
        </button>
      </div>
    </div>
  );
}