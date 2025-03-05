-- Step 3: Update column types
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