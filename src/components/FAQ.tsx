'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiChevronDown, FiShield, FiClock, FiAward, FiSearch, FiRefreshCw, FiLock } from 'react-icons/fi';

const faqs = [
  {
    question: "How does ResumeHey's AI optimize my resume?",
    answer: "We use state-of-the-art AI models and prompts that have been meticulously refined with input from recruiting leaders at top companies. Our system analyzes job descriptions, identifies key requirements, and optimizes your experience to highlight relevant achievements. Each resume is tailored to pass ATS systems while maintaining a human touch that captures recruiters' attention.",
    icon: <FiAward className="w-6 h-6 text-blue-500" />
  },
  {
    question: "What makes ResumeHey different from other resume builders?",
    answer: "Unlike generic resume builders, ResumeHey combines advanced AI with real-world recruiting insights. We've analyzed thousands of successful applications and worked with industry recruiters to understand exactly what makes a resume stand out. Our AI doesn't just rewrite your resume – it strategically positions your experience to match what hiring managers are looking for.",
    icon: <FiSearch className="w-6 h-6 text-blue-500" />
  },
  {
    question: "Will my resume pass ATS (Applicant Tracking Systems)?",
    answer: "Yes! We understand the frustration of not hearing back from applications, which is why ATS optimization is at the core of our platform. Every resume is formatted using ATS-friendly templates and optimized with industry-standard keywords. Our system has been tested against major ATS platforms to ensure maximum compatibility.",
    icon: <FiRefreshCw className="w-6 h-6 text-blue-500" />
  },
  {
    question: "How long does it take to create a resume?",
    answer: "Most users complete their first resume in under 5 minutes. Simply upload your existing resume or connect LinkedIn, paste the job description, and our AI handles the rest. You can then make any adjustments to perfect your application.",
    icon: <FiClock className="w-6 h-6 text-blue-500" />
  },
  {
    question: "Can I customize my resume for different jobs?",
    answer: "Absolutely! We recommend tailoring your resume for each application. Our AI analyzes each job description individually to optimize your experience and skills for that specific role. This targeted approach significantly increases your chances of getting an interview.",
    icon: <FiShield className="w-6 h-6 text-blue-500" />
  },
  {
    question: "Is my information secure?",
    answer: "Yes, we take data security seriously. Your information is encrypted, never shared with third parties, and you can delete your data at any time. We only use your information to optimize your resume and improve our AI models.",
    icon: <FiLock className="w-6 h-6 text-blue-500" />
  }
];

function FAQItem({ question, answer, icon, index }: { question: string; answer: string; icon: React.ReactNode; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const itemId = `faq-${index}`;
  const answerId = `faq-answer-${index}`;

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative border-b border-gray-200 last:border-0">
      <button
        onClick={handleClick}
        className="relative z-20 flex items-center justify-between w-full py-6 text-left hover:bg-gray-50 transition-colors duration-150 px-4 rounded-lg select-none"
        aria-expanded={isOpen}
        aria-controls={answerId}
        id={itemId}
      >
        <div className="flex items-center gap-4">
          {icon}
          <span className="text-lg font-medium text-gray-900">{question}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <FiChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={answerId}
            role="region"
            aria-labelledby={itemId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="relative z-10 overflow-hidden bg-white"
          >
            <div className="pb-6 text-gray-600 leading-relaxed px-4 select-text">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  return (
    <section className="relative z-10 py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Everything you need to know about ResumeHey and our AI-powered resume optimization
          </p>
        </div>
        
        <div className="relative z-20 max-w-3xl mx-auto divide-y divide-gray-200 rounded-2xl bg-white shadow-xl p-8">
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} index={index} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Still have questions?{' '}
            <a 
              href="mailto:support@resumehey.com" 
              className="text-blue-600 hover:text-blue-500 font-medium transition-colors duration-150"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
} 