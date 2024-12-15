import React, { Suspense } from 'react';
import { GenerateResumeForm } from '@/components/GenerateResumeForm';
import { FaRobot, FaLinkedin, FaGithub, FaCheck } from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { SiGoogle, SiMeta, SiAmazon } from 'react-icons/si';

const features = [
  {
    icon: <FaLinkedin className="w-6 h-6 text-[#0A66C2]" />,
    title: "Smart Profile Integration",
    description: "Seamlessly combine your LinkedIn profile data with your existing resume for a complete professional story."
  },
  {
    icon: <FaRobot className="w-6 h-6 text-blue-500" />,
    title: "AI Resume Targeting",
    description: "Get 3x more interviews with AI that adapts your experience to match exactly what employers want."
  },
  {
    icon: <FaGithub className="w-6 h-6 text-gray-900" />,
    title: "Automatic GitHub Portfolio",
    description: "Stand out with a curated showcase of your best projects and contributions, perfectly formatted."
  },
  {
    icon: <HiOutlineDocumentText className="w-6 h-6 text-green-500" />,
    title: "93% ATS Success Rate",
    description: "Never get rejected by resume scanners again. Our format is tested with top ATS systems."
  }
];

const socialProof = [
  {
    icon: <SiGoogle className="w-8 h-8 text-[#4285F4]" />,
    name: "Google"
  },
  {
    icon: <SiMeta className="w-8 h-8 text-[#0668E1]" />,
    name: "Meta"
  },
  {
    icon: <SiAmazon className="w-8 h-8 text-[#FF9900]" />,
    name: "Amazon"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-8 mb-6">
            <div className="text-sm text-gray-600 mr-3">Used by employees at</div>
            {socialProof.map((company, index) => (
              <div key={index} className="flex items-center" title={company.name}>
                {company.icon}
              </div>
            ))}
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Create an Interview-Winning Resume<br />in Less Than 5 Minutes
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stop spending hours tweaking your resume. Our AI analyzes job requirements and optimizes your experience to get you more interviews, guaranteed.
          </p>
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              5-Minute Setup
            </div>
            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              4.9/5 rating from 1,000+ users
            </div>
          </div>
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
                <div className="text-blue-600 font-semibold mb-2">1. Upload Resume</div>
                <p className="text-gray-600 text-sm">Upload your current resume and connect LinkedIn to enrich your profile</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-blue-600 font-semibold mb-2">2. AI Analysis</div>
                <p className="text-gray-600 text-sm">Our AI combines and enhances your professional experience</p>
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
              Upload your resume, connect LinkedIn to enhance it, and paste any job URL. Our AI will create your perfect targeted resume instantly.
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