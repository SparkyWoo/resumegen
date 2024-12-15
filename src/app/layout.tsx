import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/Providers';
import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ResumeHey - AI-Powered Resume Builder',
  description: 'Create a professional resume tailored to your job application using AI and modern templates.',
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
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-16">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
} 