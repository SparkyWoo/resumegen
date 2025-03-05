-- This script will dynamically find and drop all policies on all tables

-- First, create a function to drop all policies on a table
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