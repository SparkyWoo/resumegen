'use client';

import { motion } from 'framer-motion';
import { FaChevronDown, FaCheck, FaUsers, FaRobot } from 'react-icons/fa';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSection({ children, className = '', delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCompanyLogo({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="col-span-1 flex justify-center items-center grayscale hover:grayscale-0 transition-all duration-200"
    >
      {children}
    </motion.div>
  );
}

export function ScrollIndicator() {
  return (
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-blue-600"
    >
      <FaChevronDown className="w-6 h-6" />
    </motion.div>
  );
}

export function SectionDivider({ icon }: { icon: 'check' | 'users' | 'robot' }) {
  const icons = {
    check: <FaCheck className="w-4 h-4 text-blue-600" />,
    users: <FaUsers className="w-4 h-4 text-blue-600" />,
    robot: <FaRobot className="w-4 h-4 text-blue-600" />
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-200" />
      </div>
      <div className="relative flex justify-center">
        <div className="bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
          {icons[icon]}
        </div>
      </div>
    </div>
  );
} 