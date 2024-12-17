import React, { Suspense } from 'react';
import { GenerateResumeForm } from '@/components/GenerateResumeForm';
import { FaRobot, FaLinkedin, FaGithub, FaCheck, FaRegClock, FaUsers, FaMicrosoft, FaChevronDown } from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { SiGoogle, SiMeta, SiAmazon, SiApple, SiNetflix, SiUber, SiAirbnb } from 'react-icons/si';
import { motion } from 'framer-motion';

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

const stats = [
  { icon: <FaRegClock className="w-5 h-5" />, value: "5 Min", label: "Average Setup" },
  { icon: <FaUsers className="w-5 h-5" />, value: "10K+", label: "Resumes Created" },
  { icon: <FaCheck className="w-5 h-5" />, value: "93%", label: "ATS Success" },
];

const companies = [
  { icon: <SiGoogle className="w-12 h-12 text-[#4285F4]" />, name: "Google" },
  { icon: <SiMeta className="w-12 h-12 text-[#0668E1]" />, name: "Meta" },
  { icon: <SiAmazon className="w-12 h-12 text-[#FF9900]" />, name: "Amazon" },
  { icon: <FaMicrosoft className="w-12 h-12 text-[#00A4EF]" />, name: "Microsoft" },
  { icon: <SiApple className="w-12 h-12 text-[#555555]" />, name: "Apple" },
  { icon: <SiNetflix className="w-12 h-12 text-[#E50914]" />, name: "Netflix" },
  { icon: <SiUber className="w-12 h-12 text-[#000000]" />, name: "Uber" },
  { icon: <SiAirbnb className="w-12 h-12 text-[#FF5A5F]" />, name: "Airbnb" },
];

const testimonials = [
  {
    image: "/images/testimonials/profile.webp",
    name: "S.",
    role: "Software Engineer",
    company: "Google",
    text: "The AI suggestions were spot-on and the ATS optimization really works! Landed multiple interviews at top tech companies.",
    rating: 5
  },
  {
    image: "/images/testimonials/profile.webp",
    name: "M.",
    role: "Product Manager",
    company: "Meta",
    text: "I was skeptical at first, but the targeted resume customization made a huge difference. Got callbacks from 80% of my applications.",
    rating: 5
  },
  {
    image: "/images/testimonials/profile.webp",
    name: "E.",
    role: "Data Scientist",
    company: "Netflix",
    text: "The GitHub integration is brilliant! It automatically showcased my best projects. Received multiple competitive offers.",
    rating: 5
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.02]" 
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
              <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                  {/* Left Column */}
                  <div className="sm:text-center lg:text-left lg:col-span-6">
                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                      <span className="block">Land Your Dream Job with an</span>
                      <span className="block text-blue-600">AI-Powered Resume</span>
                    </h1>
                    <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto lg:mx-0">
                      Stop spending hours tweaking your resume. Our AI analyzes job requirements and optimizes your experience to get you more interviews, guaranteed.
                    </p>
                    
                    {/* Stats */}
                    <div className="mt-6 grid grid-cols-3 gap-4">
                      {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center lg:items-start">
                          <div className="flex items-center text-blue-600">
                            {stat.icon}
                            <span className="ml-2 text-2xl font-bold">{stat.value}</span>
                          </div>
                          <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column - Form */}
                  <div className="mt-12 lg:mt-0 lg:col-span-6">
                    <div className="bg-white sm:max-w-md lg:max-w-full mx-auto rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                      <div className="px-4 py-8 sm:px-10">
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-blue-600"
        >
          <FaChevronDown className="w-6 h-6" />
        </motion.div>
      </div>

      {/* Section Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <div className="bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
            <FaCheck className="w-4 h-4 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Company Logos Section */}
      <div className="bg-white/80 backdrop-blur-sm py-12">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <p className="text-center text-lg font-medium text-gray-600 mb-8">
            Trusted by professionals from leading companies
          </p>
          <div className="grid grid-cols-4 gap-8 md:grid-cols-8">
            {companies.map((company, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="col-span-1 flex justify-center items-center grayscale hover:grayscale-0 transition-all duration-200"
                title={company.name}
              >
                {company.icon}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Section Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <div className="bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
            <FaUsers className="w-4 h-4 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white/80 backdrop-blur-sm py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Success Stories</h2>
            <p className="mt-4 text-xl text-gray-600">
              Join thousands of professionals who transformed their careers with ResumeHey
            </p>
            <p className="mt-2 text-sm text-gray-500">
              *Names and companies anonymized to protect privacy. All testimonials are from verified users.
            </p>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="px-6 py-8">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-lg">
                        {testimonial.name}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-sm font-medium text-blue-600">{testimonial.company}</div>
                    </div>
                  </div>
                  <p className="mt-6 text-base text-gray-500">"{testimonial.text}"</p>
                  <div className="mt-4 flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaCheck key={i} className="h-5 w-5" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Section Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <div className="bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
            <FaRobot className="w-4 h-4 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white/80 backdrop-blur-sm py-16">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-lg font-semibold ml-3">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
} 