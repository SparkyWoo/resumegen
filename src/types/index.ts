export interface User {
  id: string;
  email: string;
  created_at: Date;
  subscription_status: 'free' | 'pro';
}

interface LinkedInProfile {
  id: string;
  localizedFirstName: string;
  localizedLastName: string;
  profilePicture?: {
    displayImage: string;
  };
}

interface LinkedInExperience {
  title: string;
  companyName: string;
  startDate: {
    year: number;
    month: number;
  };
  endDate?: {
    year: number;
    month: number;
  };
  description?: string;
}

interface GitHubRepository {
  name: string;
  description: string | null;
  language: string;
  stars: number;
  url: string;
}

export interface Resume {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  url: string;
  summary: string;
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
  github_data?: {
    repositories: Array<{
      name: string;
      description: string | null;
      language: string;
      stars: number;
      url: string;
    }>;
  };
  linkedin_data?: {
    // ... LinkedIn fields
  };
  job_data?: {
    title: string;
    description: string;
    skills: string[];
  };
}

export interface Job {
  id: string;
  user_id: string;
  job_url: string;
  parsed_data: any;
  created_at: Date;
} 