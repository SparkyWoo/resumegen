-- First, drop all policies that depend on the columns we want to alter
DROP POLICY IF EXISTS users_select_own ON public.users;
DROP POLICY IF EXISTS users_update_own ON public.users;
DROP POLICY IF EXISTS resumes_select_own ON public.resumes;
DROP POLICY IF EXISTS resumes_insert_own ON public.resumes;
DROP POLICY IF EXISTS resumes_update_own ON public.resumes;
DROP POLICY IF EXISTS resumes_delete_own ON public.resumes;
DROP POLICY IF EXISTS premium_features_select_own ON public.premium_features;
DROP POLICY IF EXISTS premium_features_insert_own ON public.premium_features;
DROP POLICY IF EXISTS premium_features_update_own ON public.premium_features;
DROP POLICY IF EXISTS ats_scores_select_own ON public.ats_scores;
DROP POLICY IF EXISTS ats_scores_insert_own ON public.ats_scores;
DROP POLICY IF EXISTS ats_scores_update_own ON public.ats_scores;
DROP POLICY IF EXISTS interview_tips_select_own ON public.interview_tips;
DROP POLICY IF EXISTS interview_tips_insert_own ON public.interview_tips;
DROP POLICY IF EXISTS interview_tips_update_own ON public.interview_tips;
DROP POLICY IF EXISTS service_role_all_resumes ON public.resumes;
DROP POLICY IF EXISTS service_role_all_premium_features ON public.premium_features;
DROP POLICY IF EXISTS service_role_all_ats_scores ON public.ats_scores;
DROP POLICY IF EXISTS service_role_all_interview_tips ON public.interview_tips;
DROP POLICY IF EXISTS "Users can view their own resumes" ON public.resumes;
DROP POLICY IF EXISTS "Users can update their own resumes" ON public.resumes;
DROP POLICY IF EXISTS "Users can insert their own resumes" ON public.resumes;
DROP POLICY IF EXISTS "Service role can manage all resumes" ON public.resumes;
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Users can view their own premium features" ON public.premium_features;
DROP POLICY IF EXISTS "Service role can manage all premium features" ON public.premium_features;
DROP POLICY IF EXISTS "Users can view ats scores for their resumes" ON public.ats_scores;
DROP POLICY IF EXISTS "Service role can manage all ats scores" ON public.ats_scores;
DROP POLICY IF EXISTS "Users can view interview tips for their resumes" ON public.interview_tips;
DROP POLICY IF EXISTS "Service role can manage all interview tips" ON public.interview_tips;

-- Then, drop foreign key constraints
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

-- Recreate policies
-- Users table policies
CREATE POLICY users_select_own ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY users_update_own ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Resumes table policies
CREATE POLICY resumes_select_own ON public.resumes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY resumes_insert_own ON public.resumes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY resumes_update_own ON public.resumes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY resumes_delete_own ON public.resumes
  FOR DELETE USING (auth.uid() = user_id);

-- Premium features table policies
CREATE POLICY premium_features_select_own ON public.premium_features
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY premium_features_insert_own ON public.premium_features
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY premium_features_update_own ON public.premium_features
  FOR UPDATE USING (auth.uid() = user_id);

-- ATS scores table policies
CREATE POLICY ats_scores_select_own ON public.ats_scores
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.resumes WHERE resumes.id = ats_scores.resume_id AND resumes.user_id = auth.uid()
  ));

CREATE POLICY ats_scores_insert_own ON public.ats_scores
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.resumes WHERE resumes.id = ats_scores.resume_id AND resumes.user_id = auth.uid()
  ));

CREATE POLICY ats_scores_update_own ON public.ats_scores
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.resumes WHERE resumes.id = ats_scores.resume_id AND resumes.user_id = auth.uid()
  ));

-- Interview tips table policies
CREATE POLICY interview_tips_select_own ON public.interview_tips
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.resumes WHERE resumes.id = interview_tips.resume_id AND resumes.user_id = auth.uid()
  ));

CREATE POLICY interview_tips_insert_own ON public.interview_tips
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.resumes WHERE resumes.id = interview_tips.resume_id AND resumes.user_id = auth.uid()
  ));

CREATE POLICY interview_tips_update_own ON public.interview_tips
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.resumes WHERE resumes.id = interview_tips.resume_id AND resumes.user_id = auth.uid()
  ));

-- Service role policies
CREATE POLICY service_role_all_resumes ON public.resumes
  FOR ALL USING (auth.jwt() ? 'service_role'::text);

CREATE POLICY service_role_all_premium_features ON public.premium_features
  FOR ALL USING (auth.jwt() ? 'service_role'::text);

CREATE POLICY service_role_all_ats_scores ON public.ats_scores
  FOR ALL USING (auth.jwt() ? 'service_role'::text);

CREATE POLICY service_role_all_interview_tips ON public.interview_tips
  FOR ALL USING (auth.jwt() ? 'service_role'::text); 