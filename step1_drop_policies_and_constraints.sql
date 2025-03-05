-- Step 1: Drop all policies
-- This script will dynamically find and drop all policies on all tables
CREATE OR REPLACE FUNCTION drop_all_policies_on_table(table_name text)
RETURNS void AS $$
DECLARE
    policy_name text;
BEGIN
    FOR policy_name IN 
        SELECT policyname FROM pg_policies WHERE tablename = table_name
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_name, table_name);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Drop all policies on each table
SELECT drop_all_policies_on_table('users');
SELECT drop_all_policies_on_table('resumes');
SELECT drop_all_policies_on_table('premium_features');
SELECT drop_all_policies_on_table('ats_scores');
SELECT drop_all_policies_on_table('interview_tips');

-- Drop the function when done
DROP FUNCTION IF EXISTS drop_all_policies_on_table(text);

-- Step 2: Drop foreign key constraints
ALTER TABLE IF EXISTS public.resumes DROP CONSTRAINT IF EXISTS resumes_user_id_fkey;
ALTER TABLE IF EXISTS public.premium_features DROP CONSTRAINT IF EXISTS premium_features_user_id_fkey;
ALTER TABLE IF EXISTS public.premium_features DROP CONSTRAINT IF EXISTS premium_features_resume_id_fkey;
ALTER TABLE IF EXISTS public.ats_scores DROP CONSTRAINT IF EXISTS ats_scores_resume_id_fkey;
ALTER TABLE IF EXISTS public.interview_tips DROP CONSTRAINT IF EXISTS interview_tips_resume_id_fkey; 