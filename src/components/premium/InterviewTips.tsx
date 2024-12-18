'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LockIcon, UnlockIcon, ChevronDownIcon, CopyIcon, CheckIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';

interface InterviewTipsProps {
  resumeId: string;
  isPremium: boolean;
  onUpgrade: () => void;
}

interface TipSection {
  title: string;
  content: string[];
}

interface CompanyCulture {
  values: string[];
  mission: string;
  talkingPoints: string[];
}

interface RoleKeywords {
  technical: string[];
  soft: string[];
  examples: { [key: string]: string };
}

export function InterviewTips({ resumeId, isPremium, onUpgrade }: InterviewTipsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [companyCulture, setCompanyCulture] = useState<CompanyCulture | null>(null);
  const [roleKeywords, setRoleKeywords] = useState<RoleKeywords | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [copiedTip, setCopiedTip] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchTips = async () => {
    if (!isPremium || !session) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('interview_tips')
        .select('*')
        .eq('resume_id', resumeId)
        .single();

      if (error) throw error;

      if (data) {
        setCompanyCulture(data.company_culture);
        setRoleKeywords(data.role_keywords);
      }
    } catch (error) {
      console.error('Error fetching interview tips:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isPremium) {
      fetchTips();
    }
  }, [isPremium, resumeId]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTip(text);
      setTimeout(() => setCopiedTip(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (!isPremium) {
    return (
      <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <LockIcon className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Interview Tips</h3>
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
                <div className="space-y-4">
                  <div className="h-20 bg-gray-100 rounded p-4">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="mt-2 h-8 bg-gray-200 rounded" />
                  </div>
                  <div className="h-20 bg-gray-100 rounded p-4">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="mt-2 h-8 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Unlock Interview Tips to prepare effectively
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
            <h3 className="text-lg font-medium text-gray-900">Interview Tips</h3>
          </div>
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
                <div className="h-20 bg-gray-200 rounded" />
                <div className="h-20 bg-gray-200 rounded" />
                <div className="h-20 bg-gray-200 rounded" />
              </div>
            </motion.div>
          ) : companyCulture && roleKeywords ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 space-y-4"
            >
              {/* Company Culture Section */}
              <div className="rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'culture' ? null : 'culture')}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900">Company Culture</span>
                  <ChevronDownIcon
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedSection === 'culture' ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {expandedSection === 'culture' && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Company Values</h4>
                            <ul className="mt-2 space-y-2">
                              {companyCulture.values.map((value, index) => (
                                <li key={index} className="flex items-center justify-between text-sm text-gray-600 p-2 hover:bg-gray-50 rounded-md">
                                  <span>{value}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(value);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    {copiedTip === value ? (
                                      <CheckIcon className="w-4 h-4" />
                                    ) : (
                                      <CopyIcon className="w-4 h-4" />
                                    )}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Mission Statement</h4>
                            <p className="mt-2 text-sm text-gray-600">{companyCulture.mission}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Role Keywords Section */}
              <div className="rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'keywords' ? null : 'keywords')}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900">Role Keywords</span>
                  <ChevronDownIcon
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedSection === 'keywords' ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {expandedSection === 'keywords' && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Technical Skills</h4>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {roleKeywords.technical.map((skill, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Soft Skills</h4>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {roleKeywords.soft.map((skill, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Example Answers */}
              <div className="rounded-lg border border-gray-200">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'examples' ? null : 'examples')}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900">Example Answers</span>
                  <ChevronDownIcon
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedSection === 'examples' ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {expandedSection === 'examples' && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        <div className="space-y-4">
                          {Object.entries(roleKeywords.examples).map(([question, answer], index) => (
                            <div key={index} className="space-y-2">
                              <h4 className="text-sm font-medium text-gray-900">{question}</h4>
                              <div className="relative text-sm text-gray-600 p-3 bg-gray-50 rounded-md">
                                <p>{answer}</p>
                                <button
                                  onClick={() => copyToClipboard(answer)}
                                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                >
                                  {copiedTip === answer ? (
                                    <CheckIcon className="w-4 h-4" />
                                  ) : (
                                    <CopyIcon className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <div className="mt-4 text-center text-gray-500">
              No interview tips available. Update your resume to generate tips.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 