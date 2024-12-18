import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/Providers';
import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://resumehey.com'),
  title: {
    default: 'ResumeHey - AI-Powered Resume Builder',
    template: '%s | ResumeHey'
  },
  description: 'Create an ATS-optimized resume in minutes with our AI-powered resume builder. Get more interviews with targeted resume optimization, ATS score analysis, and personalized interview tips.',
  keywords: ['resume builder', 'AI resume', 'ATS optimization', 'job application', 'career tools', 'interview tips', 'resume templates', 'professional resume'],
  authors: [{ name: 'ResumeHey Team' }],
  creator: 'ResumeHey',
  publisher: 'ResumeHey',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' }
    ]
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://resumehey.com',
    siteName: 'ResumeHey',
    title: 'ResumeHey - AI-Powered Resume Builder',
    description: 'Create an ATS-optimized resume in minutes with our AI-powered resume builder. Get more interviews with targeted resume optimization.',
    images: [
      {
        url: 'https://resumehey.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ResumeHey - AI Resume Builder'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResumeHey - AI-Powered Resume Builder',
    description: 'Create an ATS-optimized resume in minutes with our AI-powered resume builder.',
    images: ['https://resumehey.com/og-image.png'],
    creator: '@resumehey'
  },
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
    other: {
      'facebook-domain-verification': 'your-facebook-domain-verification'
    }
  },
  alternates: {
    canonical: 'https://resumehey.com',
    languages: {
      'en-US': 'https://resumehey.com',
    }
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  themeColor: '#ffffff',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'ResumeHey',
              applicationCategory: 'BusinessApplication',
              description: 'AI-powered resume builder with ATS optimization and interview tips',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD'
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '1250'
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
} 