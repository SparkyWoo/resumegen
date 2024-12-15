export type Database = {
  public: {
    Tables: {
      resumes: {
        Row: {
          id: string;
          user_id: string;
          github_data: any;
          linkedin_data: any;
          job_data: {
            url: string;
            title: string;
            description: string;
            skills: string[];
            requirements?: string[];
          } | null;
          generated_content: any;
          created_at: string;
          name: string;
          email: string;
          phone: string;
          location: string;
          url: string;
          summary: string;
          work: any[];
          education: any[];
          skills: string[];
          projects: any[];
        };
      };
    };
  };
}; 