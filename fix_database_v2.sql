-- COMPREHENSIVE DATABASE FIX SCRIPT (VERSION 2)
-- This script will fix the type mismatch between auth.uid() (text) and user_id (uuid)

-- 1. First, drop all policies that depend on the columns
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                      policy_record.policyname, 
                      policy_record.schemaname, 
                      policy_record.tablename);
    END LOOP;
END $$;

-- 2. Check table column types and print them for debugging
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
        RAISE NOTICE 'Table: %, Column: %, Type: %', 
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

-- 4. Create a new users table with TEXT id if it doesn't exist
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'users'
  ) THEN
    -- Check if id column is UUID
    IF EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'users' 
      AND column_name = 'id' AND data_type = 'uuid'
    ) THEN
      -- Create new table with TEXT id
      CREATE TABLE public.users_new (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        stripe_customer_id TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Copy data with explicit cast
      INSERT INTO public.users_new (id, email, stripe_customer_id, created_at)
      SELECT id::text, email, stripe_customer_id, created_at
      FROM public.users
      ON CONFLICT (id) DO NOTHING;
      
      -- Drop old table and rename new one
      DROP TABLE public.users CASCADE;
      ALTER TABLE public.users_new RENAME TO users;
      
      RAISE NOTICE 'Converted users table from UUID to TEXT';
    ELSE
      RAISE NOTICE 'Users table already has TEXT id';
    END IF;
  ELSE
    -- Create users table if it doesn't exist
    CREATE TABLE public.users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      stripe_customer_id TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    RAISE NOTICE 'Created new users table with TEXT id';
  END IF;
END $$;

-- 5. Update other tables to use TEXT for user_id and resume_id
DO $$
BEGIN
  -- Check and update resumes table
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'resumes' 
    AND column_name = 'user_id' AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.resumes 
      ALTER COLUMN user_id TYPE TEXT USING user_id::text;
    RAISE NOTICE 'Converted resumes.user_id from UUID to TEXT';
  END IF;
  
  -- Check and update premium_features table
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'premium_features' 
    AND column_name = 'user_id' AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.premium_features 
      ALTER COLUMN user_id TYPE TEXT USING user_id::text;
    RAISE NOTICE 'Converted premium_features.user_id from UUID to TEXT';
  END IF;
  
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'premium_features' 
    AND column_name = 'resume_id' AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.premium_features 
      ALTER COLUMN resume_id TYPE TEXT USING resume_id::text;
    RAISE NOTICE 'Converted premium_features.resume_id from UUID to TEXT';
  END IF;
  
  -- Check and update ats_scores table
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'ats_scores' 
    AND column_name = 'resume_id' AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.ats_scores 
      ALTER COLUMN resume_id TYPE TEXT USING resume_id::text;
    RAISE NOTICE 'Converted ats_scores.resume_id from UUID to TEXT';
  END IF;
  
  -- Check and update interview_tips table
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'interview_tips' 
    AND column_name = 'resume_id' AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.interview_tips 
      ALTER COLUMN resume_id TYPE TEXT USING resume_id::text;
    RAISE NOTICE 'Converted interview_tips.resume_id from UUID to TEXT';
  END IF;
END $$;

-- 6. Re-add foreign key constraints
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

-- 7. Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ats_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_tips ENABLE ROW LEVEL SECURITY;

-- 8. Recreate policies with correct types
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

-- 9. Create function to sync auth users to public users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at)
  VALUES (NEW.id, NEW.email, NEW.created_at)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create trigger to call this function when a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. Sync existing auth users to public users
INSERT INTO public.users (id, email, created_at)
SELECT 
  id, 
  email, 
  created_at
FROM 
  auth.users
WHERE 
  NOT EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.users.id::text)
ON CONFLICT (id) DO NOTHING;

-- 12. Final check of column types
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
        RAISE NOTICE 'Table: %, Column: %, Type: %', 
            column_record.table_name, 
            column_record.column_name, 
            column_record.data_type;
    END LOOP;
END $$; 