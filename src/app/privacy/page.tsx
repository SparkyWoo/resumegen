import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - ResumeHey',
  description: 'Privacy policy and data handling practices for ResumeHey'
};

export default function PrivacyPolicy(): JSX.Element {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-blue max-w-none">
            <h2>Information We Collect</h2>
            <p>
              We collect information you provide directly to us when using ResumeHey:
            </p>
            <ul>
              <li>LinkedIn profile data (when you sign in)</li>
              <li>GitHub username and public repository data (optional)</li>
              <li>Job posting URLs you submit</li>
              <li>Resume content you generate and edit</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Generate and customize your resume</li>
              <li>Analyze job postings to provide relevant recommendations</li>
              <li>Improve our AI-powered resume generation</li>
              <li>Maintain and improve our services</li>
            </ul>

            <h2>Data Storage</h2>
            <p>
              Your data is stored securely in our database. We retain your data only as long as necessary to provide our services.
              You can request deletion of your data at any time.
            </p>

            <h2>Third-Party Services</h2>
            <p>
              We use the following third-party services:
            </p>
            <ul>
              <li>LinkedIn (for authentication and profile data)</li>
              <li>GitHub API (for repository data)</li>
              <li>Anthropic Claude (for AI-powered content generation)</li>
            </ul>

            <h2>Updates to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this privacy policy, please contact us through our GitHub repository.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 