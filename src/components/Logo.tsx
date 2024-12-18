import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = '', size = 32 }: LogoProps): JSX.Element {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Main document shape */}
        <path
          d="M8 4C8 2.89543 8.89543 2 10 2H22C23.1046 2 24 2.89543 24 4V28C24 29.1046 23.1046 30 22 30H10C8.89543 30 8 29.1046 8 28V4Z"
          fill="#2563EB"  // Blue-600
        />
        {/* Folded corner */}
        <path
          d="M22 2L24 4H22V2Z"
          fill="#1D4ED8"  // Blue-700
        />
        {/* Lines representing text */}
        <rect x="11" y="8" width="10" height="2" rx="1" fill="white" opacity="0.9" />
        <rect x="11" y="12" width="7" height="2" rx="1" fill="white" opacity="0.7" />
        <rect x="11" y="16" width="10" height="2" rx="1" fill="white" opacity="0.9" />
        <rect x="11" y="20" width="8" height="2" rx="1" fill="white" opacity="0.7" />
        {/* Checkmark overlay */}
        <path
          d="M26 12L28 14L31 11"
          stroke="#10B981"  // Emerald-500
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
        ResumeHey
      </span>
    </div>
  );
} 