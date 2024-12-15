import React, { Suspense } from 'react';
import { GenerateResumeForm } from '@/components/GenerateResumeForm';
import { FaRobot, FaLinkedin, FaGithub } from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';

const features = [
  {
    icon: <FaLinkedin className="w-6 h-6 text-[#0A66C2]" />,
    title: "Seamless LinkedIn Integration",
    description: "Import your entire professional history in one click - no manual copying needed"
  },
  {
    icon: <FaRobot className="w-6 h-6 text-blue-500" />,
    title: "AI-Powered Optimization",
    description: "Our AI analyzes job descriptions to tailor your resume with relevant skills and achievements"
  },
  {
    icon: <FaGithub className="w-6 h-6 text-gray-900" />,
    title: "GitHub Portfolio Integration",
    description: "Automatically showcase your best projects and contributions to demonstrate real-world impact"
  },
  {
    icon: <HiOutlineDocumentText className="w-6 h-6 text-green-500" />,
    title: "ATS-Optimized Format",
    description: "Engineered to pass Applicant Tracking Systems with perfect formatting and keyword optimization"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Land Your Dream Job with an AI-Powered Resume
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your career prospects in minutes. Our AI analyzes job postings to create perfectly tailored, ATS-optimized resumes that get you noticed.
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

        {/* Resume Improvement Section */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg shadow-sm border border-blue-100 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Already Have a Resume?</h2>
            <p className="text-xl text-gray-700 mb-6">
              Upload your existing resume and watch our AI transform it into a masterpiece
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-blue-600 font-semibold mb-2">1. Upload PDF</div>
                <p className="text-gray-600 text-sm">Simply upload your current resume in PDF format</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-blue-600 font-semibold mb-2">2. AI Analysis</div>
                <p className="text-gray-600 text-sm">Our AI extracts and enhances your experience</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-blue-600 font-semibold mb-2">3. Job Targeting</div>
                <p className="text-gray-600 text-sm">Content automatically aligns with job requirements</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">Get Started in Seconds</h2>
            <p className="text-gray-600">
              Connect with LinkedIn and paste any job URL. Our AI will analyze the requirements and create your perfect resume instantly.
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