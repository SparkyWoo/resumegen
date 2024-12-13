'use client';

import React from 'react';
import { Resume } from '@/types';

interface Props {
  resume: Resume;
  onEdit: () => void;
}

export function ResumePreview({ resume, onEdit }: Props) {
  const { linkedin_data, github_data, job_data } = resume;
  const profile = linkedin_data.profile;

  return (
    <div className="bg-white shadow-lg rounded-lg p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold">
          {profile.localizedFirstName} {profile.localizedLastName}
        </h2>
        <p className="text-gray-600">{linkedin_data.email}</p>
      </div>

      {/* Experience */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Experience</h3>
        {linkedin_data.experience?.elements?.map((exp: any, i: number) => (
          <div key={i} className="mb-4">
            <h4 className="font-medium">{exp.title}</h4>
            <p className="text-gray-600">{exp.companyName}</p>
            <p className="text-sm text-gray-500">
              {exp.startDate.year} - {exp.endDate?.year || 'Present'}
            </p>
            <p className="mt-2">{exp.description}</p>
          </div>
        ))}
      </section>

      {/* GitHub Projects */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Projects</h3>
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

      {/* Skills (from job requirements) */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Relevant Skills</h3>
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
      </section>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Edit Resume
        </button>
      </div>
    </div>
  );
}