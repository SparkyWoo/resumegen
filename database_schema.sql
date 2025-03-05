-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.resumes (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  url TEXT,
  summary TEXT,
  work JSONB,
  education JSONB,
  skills JSONB,
  projects JSONB,
  github_data JSONB,
  job_data JSONB,
  generated_content JSONB,
  linkedin_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.premium_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  resume_id TEXT REFERENCES public.resumes(id) ON DELETE CASCADE,
  feature_type TEXT,
  is_active BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ats_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id TEXT REFERENCES public.resumes(id) ON DELETE CASCADE,
  score INTEGER,
  breakdown JSONB,
  suggestions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.interview_tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id TEXT REFERENCES public.resumes(id) ON DELETE CASCADE,
  company_culture JSONB,
  role_keywords JSONB,
  talking_points JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ats_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_tips ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users table policies
CREATE POLICY users_select_own ON public.users
  FOR SELECT USING (auth.uid()::uuid = id);

CREATE POLICY users_update_own ON public.users
  FOR UPDATE USING (auth.uid()::uuid = id);

-- Resumes table policies
CREATE POLICY resumes_select_own ON public.resumes
  FOR SELECT USING (auth.uid()::uuid = user_id);

CREATE POLICY resumes_insert_own ON public.resumes
  FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);

CREATE POLICY resumes_update_own ON public.resumes
  FOR UPDATE USING (auth.uid()::uuid = user_id);

CREATE POLICY resumes_delete_own ON public.resumes
  FOR DELETE USING (auth.uid()::uuid = user_id);

-- Premium features table policies
CREATE POLICY premium_features_select_own ON public.premium_features
  FOR SELECT USING (auth.uid()::uuid = user_id);

CREATE POLICY premium_features_insert_own ON public.premium_features
  FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);

CREATE POLICY premium_features_update_own ON public.premium_features
  FOR UPDATE USING (auth.uid()::uuid = user_id);

-- ATS scores table policies
CREATE POLICY ats_scores_select_own ON public.ats_scores
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.resumes WHERE resumes.id = ats_scores.resume_id AND resumes.user_id = auth.uid()::uuid
  ));

CREATE POLICY ats_scores_insert_own ON public.ats_scores
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.resumes WHERE resumes.id = ats_scores.resume_id AND resumes.user_id = auth.uid()::uuid
  ));

CREATE POLICY ats_scores_update_own ON public.ats_scores
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.resumes WHERE resumes.id = ats_scores.resume_id AND resumes.user_id = auth.uid()::uuid
  ));

-- Interview tips table policies
CREATE POLICY interview_tips_select_own ON public.interview_tips
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.resumes WHERE resumes.id = interview_tips.resume_id AND resumes.user_id = auth.uid()::uuid
  ));

CREATE POLICY interview_tips_insert_own ON public.interview_tips
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.resumes WHERE resumes.id = interview_tips.resume_id AND resumes.user_id = auth.uid()::uuid
  ));

CREATE POLICY interview_tips_update_own ON public.interview_tips
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.resumes WHERE resumes.id = interview_tips.resume_id AND resumes.user_id = auth.uid()::uuid
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

-- Function to sync auth users to public users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at)
  VALUES (NEW.id, NEW.email, NEW.created_at)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call this function when a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 