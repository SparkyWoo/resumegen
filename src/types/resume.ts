export interface ResumeData {
  basics: {
    name: string;
    email: string;
    phone: string;
    location: string;
    url: string;
    summary: string;
  };
  work: WorkExperience[];
  education: Education[];
  projects: Project[];
  skills: string[];
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export interface Education {
  institution: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  score: string;
}

export interface Project {
  name: string;
  description: string;
  url: string;
  highlights: string[];
  keywords: string[];
  language?: string;
  stars?: number;
}

export interface FormSection<T> {
  data: T;
  onChange: (data: T) => void;
} 