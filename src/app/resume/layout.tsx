import React from 'react';

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <nav className="flex justify-between items-center">
            <a href="/" className="text-xl font-bold text-indigo-600">
              InstantResume
            </a>
            <div className="flex gap-4">
              <a href="/pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </a>
              <a href="/login" className="text-gray-600 hover:text-gray-900">
                Login
              </a>
            </div>
          </nav>
        </div>
      </header>
      {children}
    </>
  );
} 