'use client';

import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' }
    ]
  },
  {
    title: 'Open Source',
    links: [
      { label: 'GitHub', href: 'https://github.com/yourusername/resumehey' }
    ]
  }
];

export function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-base text-gray-600 hover:text-gray-900"
                    >
                      {link.href.startsWith('http') ? (
                        <span className="inline-flex items-center">
                          <FaGithub className="mr-2" />
                          {link.label}
                        </span>
                      ) : (
                        link.label
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-500 text-center">
            © {currentYear} ResumeHey. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 