-- SCRIPT TO FIND AND FIX UUID = TEXT COMPARISON ISSUES

-- 1. First, find all policies that might have UUID = text comparisons
DO $$
DECLARE
    policy_record RECORD;
    policy_def TEXT;
BEGIN
    RAISE NOTICE 'Checking policies for UUID = text comparisons:';
    
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname, cmd, qual, with_check
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        RAISE NOTICE 'Policy: %.%.% (Command: %)', 
            policy_record.schemaname, 
            policy_record.tablename, 
            policy_record.policyname,
            policy_record.cmd;
            
        IF policy_record.qual IS NOT NULL THEN
            RAISE NOTICE 'USING expression: %', policy_record.qual;
        END IF;
        
        IF policy_record.with_check IS NOT NULL THEN
            RAISE NOTICE 'WITH CHECK expression: %', policy_record.with_check;
        END IF;
        
        -- Drop the policy so we can recreate it
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                      policy_record.policyname, 
                      policy_record.schemaname, 
                      policy_record.tablename);
    END LOOP;
END $$;

-- 2. Check column types in all tables
DO $$
DECLARE
    column_record RECORD;
BEGIN
    RAISE NOTICE 'Current column types:';
    FOR column_record IN 
        SELECT table_name, column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND (column_name = 'id' OR column_name = 'user_id' OR column_name = 'resume_id')
    LOOP
        RAISE NOTICE 'Table: %.% Type: %', 
            column_record.table_name, 
            column_record.column_name, 
            column_record.data_type;
    END LOOP;
END $$;

-- 3. Drop foreign key constraints
ALTER TABLE IF EXISTS public.resumes DROP CONSTRAINT IF EXISTS resumes_user_id_fkey;
ALTER TABLE IF EXISTS public.premium_features DROP CONSTRAINT IF EXISTS premium_features_user_id_fkey;
ALTER TABLE IF EXISTS public.premium_features DROP CONSTRAINT IF EXISTS premium_features_resume_id_fkey;
ALTER TABLE IF EXISTS public.ats_scores DROP CONSTRAINT IF EXISTS ats_scores_resume_id_fkey;
ALTER TABLE IF EXISTS public.interview_tips DROP CONSTRAINT IF EXISTS interview_tips_resume_id_fkey;

-- 4. Convert all UUID columns to TEXT
DO $$
BEGIN
    -- Users table
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'users' 
        AND column_name = 'id' AND data_type = 'uuid'
    ) THEN
        ALTER TABLE public.users ALTER COLUMN id TYPE TEXT USING id::text;
        RAISE NOTICE 'Converted users.id from UUID to TEXT';
    END IF;
    
    -- Resumes table
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'resumes' 
        AND column_name = 'user_id' AND data_type = 'uuid'
    ) THEN
        ALTER TABLE public.resumes ALTER COLUMN user_id TYPE TEXT USING user_id::text;
        RAISE NOTICE 'Converted resumes.user_id from UUID to TEXT';
    END IF;
    
    -- Premium features table
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'premium_features' 
        AND column_name = 'user_id' AND data_type = 'uuid'
    ) THEN
        ALTER TABLE public.premium_features ALTER COLUMN user_id TYPE TEXT USING user_id::text;
        RAISE NOTICE 'Converted premium_features.user_id from UUID to TEXT';
    END IF;
    
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'premium_features' 
        AND column_name = 'resume_id' AND data_type = 'uuid'
    ) THEN
        ALTER TABLE public.premium_features ALTER COLUMN resume_id TYPE TEXT USING resume_id::text;
        RAISE NOTICE 'Converted premium_features.resume_id from UUID to TEXT';
    END IF;
    
    -- ATS scores table
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'ats_scores' 
        AND column_name = 'resume_id' AND data_type = 'uuid'
    ) THEN
        ALTER TABLE public.ats_scores ALTER COLUMN resume_id TYPE TEXT USING resume_id::text;
        RAISE NOTICE 'Converted ats_scores.resume_id from UUID to TEXT';
    END IF;
    
    -- Interview tips table
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'interview_tips' 
        AND column_name = 'resume_id' AND data_type = 'uuid'
    ) THEN
        ALTER TABLE public.interview_tips ALTER COLUMN resume_id TYPE TEXT USING resume_id::text;
        RAISE NOTICE 'Converted interview_tips.resume_id from UUID to TEXT';
    END IF;
END $$;

-- 5. Re-add foreign key constraints
ALTER TABLE IF EXISTS public.resumes 
  ADD CONSTRAINT resumes_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.premium_features 
  ADD CONSTRAINT premium_features_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.premium_features 
  ADD CONSTRAINT premium_features_resume_id_fkey 
  FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.ats_scores 
  ADD CONSTRAINT ats_scores_resume_id_fkey 
  FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.interview_tips 
  ADD CONSTRAINT interview_tips_resume_id_fkey 
  FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE CASCADE;

-- 6. Recreate policies with explicit TEXT comparisons
-- Users table policies
CREATE POLICY users_select_own ON public.users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY users_update_own ON public.users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Resumes table policies
CREATE POLICY resumes_select_own ON public.resumes
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY resumes_insert_own ON public.resumes
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY resumes_update_own ON public.resumes
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY resumes_delete_own ON public.resumes
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Premium features table policies
CREATE POLICY premium_features_select_own ON public.premium_features
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY premium_features_insert_own ON public.premium_features
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY premium_features_update_own ON public.premium_features
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- ATS scores table policies
CREATE POLICY ats_scores_select_own ON public.ats_scores
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.resumes WHERE resumes.id::text = ats_scores.resume_id::text AND resumes.user_id::text = auth.uid()::text
  ));

CREATE POLICY ats_scores_insert_own ON public.ats_scores
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.resumes WHERE resumes.id::text = ats_scores.resume_id::text AND resumes.user_id::text = auth.uid()::text
  ));

CREATE POLICY ats_scores_update_own ON public.ats_scores
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.resumes WHERE resumes.id::text = ats_scores.resume_id::text AND resumes.user_id::text = auth.uid()::text
  ));

-- Interview tips table policies
CREATE POLICY interview_tips_select_own ON public.interview_tips
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.resumes WHERE resumes.id::text = interview_tips.resume_id::text AND resumes.user_id::text = auth.uid()::text
  ));

CREATE POLICY interview_tips_insert_own ON public.interview_tips
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.resumes WHERE resumes.id::text = interview_tips.resume_id::text AND resumes.user_id::text = auth.uid()::text
  ));

CREATE POLICY interview_tips_update_own ON public.interview_tips
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.resumes WHERE resumes.id::text = interview_tips.resume_id::text AND resumes.user_id::text = auth.uid()::text
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

-- 7. Final check of column types
DO $$
DECLARE
    column_record RECORD;
BEGIN
    RAISE NOTICE 'Final column types:';
    FOR column_record IN 
        SELECT table_name, column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND (column_name = 'id' OR column_name = 'user_id' OR column_name = 'resume_id')
    LOOP
        RAISE NOTICE 'Table: %.% Type: %', 
            column_record.table_name, 
            column_record.column_name, 
            column_record.data_type;
    END LOOP;
END $$; 