'use client';

import { ResumeBuilder } from './ResumeBuilder';
import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';
import { ResumeState } from '@/lib/redux/resumeSlice';

interface Props {
  initialData: ResumeState;
  resumeId: string;
  githubData: any;
  jobData: any;
}

export function ResumeBuilderWrapper({ initialData, resumeId, githubData, jobData }: Props) {
  return (
    <Provider store={store}>
      <ResumeBuilder 
        initialData={initialData} 
        resumeId={resumeId}
        githubData={githubData}
        jobData={jobData}
      />
    </Provider>
  );
} 