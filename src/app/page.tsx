import React, { Suspense } from 'react';
import { GenerateResumeForm } from '@/components/GenerateResumeForm';
import { FaRobot, FaLinkedin, FaGithub } from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';

const features = [
  {
    icon: <FaLinkedin className="w-6 h-6 text-[#0A66C2]" />,
    title: "LinkedIn Integration",
    description: "Import your professional experience directly from LinkedIn to save time"
  },
  {
    icon: <FaRobot className="w-6 h-6 text-blue-500" />,
    title: "AI-Powered Generation",
    description: "Automatically generate tailored skills and summaries based on job descriptions"
  },
  {
    icon: <FaGithub className="w-6 h-6 text-gray-900" />,
    title: "GitHub Integration",
    description: "Showcase your best projects and contributions from GitHub"
  },
  {
    icon: <HiOutlineDocumentText className="w-6 h-6 text-green-500" />,
    title: "ATS-Friendly Format",
    description: "Create resumes that pass Applicant Tracking Systems with our optimized templates"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Generate Your Perfect Resume
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Sign in with LinkedIn, paste a job posting URL, and let AI create a perfectly tailored resume in seconds.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                {feature.icon}
                <h3 className="text-lg font-semibold ml-3">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Form Section */}
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">Start with Your Dream Job</h2>
            <p className="text-gray-600">
              Sign in with LinkedIn and paste a job posting URL from Lever or Greenhouse. We'll analyze it to create your perfect resume.
            </p>
          </div>
          <Suspense fallback={
            <div className="space-y-6 animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-20 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          }>
            <GenerateResumeForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
} 