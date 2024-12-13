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
  user_id: string;
  github_data: {
    repositories: GitHubRepository[];
  };
  linkedin_data: {
    profile: LinkedInProfile;
    email: string;
    experience: {
      elements: LinkedInExperience[];
    };
  };
  job_data: {
    title: string;
    description: string;
    requirements: string[];
    skills: string[];
  };
  generated_content: any;
  created_at: string;
}

export interface Job {
  id: string;
  user_id: string;
  job_url: string;
  parsed_data: any;
  created_at: Date;
} 