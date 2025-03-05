-- Drop foreign key constraints
ALTER TABLE IF EXISTS public.resumes DROP CONSTRAINT IF EXISTS resumes_user_id_fkey;
ALTER TABLE IF EXISTS public.premium_features DROP CONSTRAINT IF EXISTS premium_features_user_id_fkey;
ALTER TABLE IF EXISTS public.premium_features DROP CONSTRAINT IF EXISTS premium_features_resume_id_fkey;
ALTER TABLE IF EXISTS public.ats_scores DROP CONSTRAINT IF EXISTS ats_scores_resume_id_fkey;
ALTER TABLE IF EXISTS public.interview_tips DROP CONSTRAINT IF EXISTS interview_tips_resume_id_fkey;

-- Update column types
ALTER TABLE IF EXISTS public.users 
  ALTER COLUMN id TYPE TEXT;

ALTER TABLE IF EXISTS public.resumes 
  ALTER COLUMN user_id TYPE TEXT;

ALTER TABLE IF EXISTS public.premium_features 
  ALTER COLUMN user_id TYPE TEXT,
  ALTER COLUMN resume_id TYPE TEXT;

ALTER TABLE IF EXISTS public.ats_scores 
  ALTER COLUMN resume_id TYPE TEXT;

ALTER TABLE IF EXISTS public.interview_tips 
  ALTER COLUMN resume_id TYPE TEXT;

-- Re-add foreign key constraints
ALTER TABLE IF EXISTS public.resumes 
  ADD CONSTRAINT resumes_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.premium_features 
  ADD CONSTRAINT premium_features_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  ADD CONSTRAINT premium_features_resume_id_fkey 
  FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.ats_scores 
  ADD CONSTRAINT ats_scores_resume_id_fkey 
  FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.interview_tips 
  ADD CONSTRAINT interview_tips_resume_id_fkey 
  FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE CASCADE; 