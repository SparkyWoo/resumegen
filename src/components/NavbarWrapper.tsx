import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Navbar } from './Navbar';

export async function NavbarWrapper() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return <Navbar initialPremiumStatus={false} initialAtsScore={null} />;
  }

  // Get the current URL path
  const path = window.location.pathname;
  const matches = path.match(/\/resume\/([^\/]+)/);
  const resumeId = matches ? matches[1] : null;

  if (!resumeId) {
    return <Navbar initialPremiumStatus={false} initialAtsScore={null} />;
  }

  // Check premium status
  const { data: premiumFeature } = await supabase
    .from('premium_features')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('resume_id', resumeId)
    .eq('feature_type', 'premium')
    .eq('is_active', true)
    .single();

  // Get ATS score if premium
  let atsScore = null;
  if (premiumFeature) {
    const { data: atsData } = await supabase
      .from('ats_scores')
      .select('score')
      .eq('resume_id', resumeId)
      .single();

    if (atsData) {
      atsScore = atsData.score;
    }
  }

  return (
    <Navbar 
      initialPremiumStatus={!!premiumFeature} 
      initialAtsScore={atsScore}
    />
  );
} 