'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FaLinkedin } from 'react-icons/fa';
import { ErrorBoundary } from 'react-error-boundary';
import { Logo } from './Logo';

interface LoadingStateProps {
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ className = '' }) => (
  <div className={`h-8 w-24 bg-gray-200 animate-pulse rounded ${className}`} />
);

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => (
  <div className="flex items-center">
    <button
      onClick={resetErrorBoundary}
      className="text-sm text-red-600 hover:text-red-500"
    >
      Error loading auth state. Click to retry.
    </button>
  </div>
);

export function Navbar(): JSX.Element {
  const { data: session, status } = useSession();

  const handleSignIn = async (): Promise<void> => {
    await signIn('linkedin');
  };

  const handleSignOut = async (): Promise<void> => {
    await signOut();
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Logo size={28} />
            </Link>
          </div>

          {/* Auth section */}
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <div className="flex items-center">
              {status === 'loading' ? (
                <LoadingState />
              ) : session ? (
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <span className="text-gray-500">Signed in as</span>
                    <span className="ml-1 font-medium text-gray-900">{session.user?.name}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#0A66C2] hover:bg-[#004182] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A66C2]"
                >
                  <FaLinkedin className="mr-2 h-5 w-5" />
                  Sign in with LinkedIn
                </button>
              )}
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </nav>
  );
} 