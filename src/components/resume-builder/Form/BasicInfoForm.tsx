'use client';

import React from 'react';
import { ResumeState } from '@/lib/redux/resumeSlice';

interface Props {
  data: ResumeState['basics'];
  onChange: (data: ResumeState['basics']) => void;
}

export const BasicInfoForm = ({ data, onChange }: Props) => {
  const handleChange = (field: keyof ResumeState['basics']) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange({
      ...data,
      [field]: e.target.value
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Basic Information</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
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
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Summary</label>
        <textarea
          value={data.summary}
          onChange={handleChange('summary')}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
    </div>
  );
}; 