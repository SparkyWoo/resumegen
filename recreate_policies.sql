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