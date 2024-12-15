import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/Providers';
import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ResumeHey - AI-Powered Resume Builder',
  description: 'Create a tailored resume in seconds using AI and your LinkedIn profile',
  keywords: 'resume builder, AI resume, ATS friendly resume, job application, career tools, resume generator',
  openGraph: {
    title: 'ResumeHey - AI-Powered Resume Builder',
    description: 'Create an ATS-friendly resume in 60 seconds using AI',
    url: 'https://resumehey.com',
    siteName: 'ResumeHey',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResumeHey - AI-Powered Resume Builder',
    description: 'Create an ATS-friendly resume in 60 seconds using AI',
  },
  metadataBase: new URL('https://resumehey.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <div className="pt-16">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
} 