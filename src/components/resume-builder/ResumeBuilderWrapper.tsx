'use client';

import { ResumeBuilder } from './ResumeBuilder';
import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';
import { ResumeState } from '@/lib/redux/resumeSlice';

interface Props {
  initialData: ResumeState;
  githubData: any;
  jobData: any;
}

export function ResumeBuilderWrapper({ initialData, githubData, jobData }: Props) {
  return (
    <Provider store={store}>
      <ResumeBuilder 
        initialData={initialData} 
        githubData={githubData}
        jobData={jobData}
      />
    </Provider>
  );
} 