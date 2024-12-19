'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FaLinkedin } from 'react-icons/fa';
import { ErrorBoundary } from 'react-error-boundary';
import { Logo } from './Logo';
import { useState, useEffect } from 'react';
import { ATSScore } from './premium/ATSScore';
import { InterviewTips } from './premium/InterviewTips';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

interface LoadingStateProps {
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ className = '' }) => (
  <div className={`h-8 w-24 bg-gray-200 animate-pulse rounded ${className}`} />
);

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => (
  <div className="flex items-center">
    <button
      onClick={resetErrorBoundary}
      className="text-sm text-red-600 hover:text-red-500"
    >
      Error loading auth state. Click to retry.
    </button>
  </div>
);

interface NavbarProps {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export function Navbar({ supabaseUrl, supabaseAnonKey }: NavbarProps): JSX.Element {
  const { data: session, status } = useSession();
  const [isPremium, setIsPremium] = useState(false);
  const [showInterviewTips, setShowInterviewTips] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const [supabase] = useState(() => createClient(supabaseUrl, supabaseAnonKey));

  const handleSignIn = async (): Promise<void> => {
    await signIn('linkedin');
  };

  const handleSignOut = async (): Promise<void> => {
    await signOut();
  };

  // Check premium status and fetch ATS score when session is available
  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!session?.user?.id || !resumeId) return;

      const { data: premiumFeature } = await supabase
        .from('premium_features')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('resume_id', resumeId)
        .eq('feature_type', 'premium')
        .eq('is_active', true)
        .single();

      setIsPremium(!!premiumFeature);

      if (premiumFeature) {
        // Fetch ATS score
        const { data: atsData } = await supabase
          .from('ats_scores')
          .select('score')
          .eq('resume_id', resumeId)
          .single();

        if (atsData) {
          setAtsScore(atsData.score);
        }
      }
    };

    // Extract resumeId from URL path
    const path = window.location.pathname;
    const matches = path.match(/\/resume\/([^\/]+)/);
    if (matches && matches[1]) {
      setResumeId(matches[1]);
    }

    checkPremiumStatus();
  }, [session?.user?.id, resumeId, supabase]);

  // Check for successful Stripe payment
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      // Refresh premium status
      const checkPremiumStatus = async () => {
        if (!session?.user?.id || !resumeId) return;
        const { data: premiumFeature } = await supabase
          .from('premium_features')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('resume_id', resumeId)
          .eq('feature_type', 'premium')
          .eq('is_active', true)
          .single();

        setIsPremium(!!premiumFeature);
      };

      checkPremiumStatus();
    }
  }, [searchParams, session?.user?.id, resumeId, supabase]);

  return (
    <nav className="bg-white shadow-sm fixed w-full z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Logo size={28} />
            </Link>
          </div>

          {/* Premium Features Section */}
          {isPremium && resumeId && (
            <div className="flex items-center space-x-4">
              {/* ATS Score Display */}
              {atsScore !== null && (
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                  atsScore >= 80 ? 'bg-green-100 text-green-800' :
                  atsScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  <span className="font-medium">ATS Score:</span>
                  <span>{atsScore}</span>
                </div>
              )}

              {/* Interview Tips Button */}
              <button
                onClick={() => setShowInterviewTips(true)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                Interview Tips
              </button>
            </div>
          )}

          {/* Auth section */}
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <div className="flex items-center">
              {status === 'loading' ? (
                <LoadingState />
              ) : session ? (
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <span className="text-gray-500">Signed in as</span>
                    <span className="ml-1 font-medium text-gray-900">{session.user?.name}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#0A66C2] hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A66C2]"
                >
                  <FaLinkedin className="mr-2 h-5 w-5" />
                  Sign in with LinkedIn
                </button>
              )}
            </div>
          </ErrorBoundary>
        </div>
      </div>

      {/* Interview Tips Modal */}
      {showInterviewTips && resumeId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Interview Tips</h2>
                <button
                  onClick={() => setShowInterviewTips(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <InterviewTips
                resumeId={resumeId}
                isPremium={isPremium}
                onUpgrade={() => {}} // Empty function since we're already premium
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 