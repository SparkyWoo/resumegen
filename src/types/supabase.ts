export type Database = {
  public: {
    Tables: {
      resumes: {
        Row: {
          id: string;
          user_id: string;
          github_data: any;
          linkedin_data: any;
          job_data: any;
          generated_content: any;
          created_at: string;
        };
      };
    };
  };
}; 