'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LockIcon, UnlockIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/lib/supabase';

interface ATSScoreProps {
  resumeId: string;
  isPremium: boolean;
  onUpgrade: () => void;
}

interface ScoreBreakdown {
  summary: number;
  skills: number;
  experience: number;
  keywords: number;
  suggestions: string[];
}

export function ATSScore({ resumeId, isPremium, onUpgrade }: ATSScoreProps) {
  const [score, setScore] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<ScoreBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const fetchScore = async () => {
    if (!isPremium || !session) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('ats_scores')
        .select('*')
        .eq('resume_id', resumeId)
        .single();

      if (error) throw error;

      if (data) {
        setScore(data.score);
        setBreakdown(data.breakdown);
      }
    } catch (error) {
      console.error('Error fetching ATS score:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isPremium) {
      fetchScore();
    }
  }, [isPremium, resumeId]);

  if (!isPremium) {
    return (
      <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <LockIcon className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">ATS Score</h3>
            </div>
            <button
              onClick={onUpgrade}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Unlock Premium
            </button>
          </div>
          
          <div className="mt-4">
            <div className="relative">
              {/* Blurred Preview */}
              <div className="filter blur-sm pointer-events-none">
                <div className="flex items-center justify-center h-32">
                  <div className="text-6xl font-bold text-gray-900">93</div>
                  <div className="ml-2 text-2xl text-gray-500">/ 100</div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-2 bg-gray-200 rounded-full" />
                  <div className="h-2 bg-gray-200 rounded-full" />
                  <div className="h-2 bg-gray-200 rounded-full" />
                </div>
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Unlock ATS Score to optimize your resume
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UnlockIcon className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-medium text-gray-900">ATS Score</h3>
          </div>
          {score !== null && (
            <div className="flex items-center space-x-1">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm text-green-600">Updated</span>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 space-y-4"
            >
              <div className="animate-pulse space-y-4">
                <div className="h-32 bg-gray-200 rounded" />
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded-full" />
                  <div className="h-2 bg-gray-200 rounded-full" />
                  <div className="h-2 bg-gray-200 rounded-full" />
                </div>
              </div>
            </motion.div>
          ) : score !== null ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4"
            >
              <div className="flex items-center justify-center h-32">
                <div className="text-6xl font-bold text-gray-900">{score}</div>
                <div className="ml-2 text-2xl text-gray-500">/ 100</div>
              </div>
              
              {breakdown && (
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Summary</span>
                      <span className="text-sm font-medium text-gray-900">{breakdown.summary}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-600 rounded-full"
                        style={{ width: `${breakdown.summary}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Skills Match</span>
                      <span className="text-sm font-medium text-gray-900">{breakdown.skills}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-600 rounded-full"
                        style={{ width: `${breakdown.skills}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Experience</span>
                      <span className="text-sm font-medium text-gray-900">{breakdown.experience}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-600 rounded-full"
                        style={{ width: `${breakdown.experience}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Keywords</span>
                      <span className="text-sm font-medium text-gray-900">{breakdown.keywords}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-600 rounded-full"
                        style={{ width: `${breakdown.keywords}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {breakdown?.suggestions && breakdown.suggestions.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900">Suggestions</h4>
                  <ul className="mt-2 space-y-2">
                    {breakdown.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                        <AlertCircleIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="mt-4 text-center text-gray-500">
              No score available. Update your resume to generate a score.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 