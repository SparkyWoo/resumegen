'use client';

import React from 'react';
import { Resume } from '@/types';

interface Props {
  initialData: Resume;
  onSave: (data: Resume) => Promise<void>;
}

export default function ResumeEditor({ initialData, onSave }: Props) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Resume</h1>
      {/* TODO: Integrate open-resume editor here */}
      <pre>{JSON.stringify(initialData, null, 2)}</pre>
    </div>
  );
} 