import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Resume } from '@/types';

export interface ResumeState {
  basics: {
    name: string;
    email: string;
    phone: string;
    location: string;
    url: string;
    summary: string;
    profiles?: Array<{
      network: string;
      username: string;
    }>;
  };
  work: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    highlights: string[];
  }>;
  education: Array<{
    institution: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate: string;
    score: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    url: string;
    highlights: string[];
  }>;
  skills: string[];
}

const initialState: ResumeState = {
  basics: {
    name: '',
    email: '',
    phone: '',
    location: '',
    url: '',
    summary: ''
  },
  work: [],
  education: [],
  projects: [],
  skills: []
};

export const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    updateBasics: (state, action: PayloadAction<ResumeState['basics']>) => {
      state.basics = action.payload;
    },
    updateWork: (state, action: PayloadAction<ResumeState['work']>) => {
      state.work = action.payload;
    },
    updateEducation: (state, action: PayloadAction<ResumeState['education']>) => {
      state.education = action.payload;
    },
    updateProjects: (state, action: PayloadAction<ResumeState['projects']>) => {
      state.projects = action.payload;
    },
    updateSkills: (state, action: PayloadAction<ResumeState['skills']>) => {
      state.skills = action.payload;
    },
    initializeResume: (state, action: PayloadAction<ResumeState>) => {
      return action.payload;
    }
  }
});

export const { updateBasics, updateWork, updateEducation, updateProjects, updateSkills, initializeResume } = resumeSlice.actions;

export default resumeSlice.reducer; 