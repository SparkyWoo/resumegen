import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions - ResumeHey',
  description: 'Terms and conditions for using ResumeHey'
};

export default function TermsAndConditions(): JSX.Element {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>
          
          <div className="prose prose-blue max-w-none">
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing and using ResumeHey, you accept and agree to be bound by these Terms and Conditions.
              If you do not agree to these terms, please do not use our service.
            </p>

            <h2>Use of Service</h2>
            <p>
              ResumeHey provides AI-powered resume generation services. You agree to:
            </p>
            <ul>
              <li>Provide accurate information when using our services</li>
              <li>Use the service for personal resume creation only</li>
              <li>Not attempt to reverse engineer or scrape our service</li>
              <li>Not use the service for any illegal purposes</li>
            </ul>

            <h2>User Content</h2>
            <p>
              You retain all rights to your personal information and content. By using our service, you grant us permission to:
            </p>
            <ul>
              <li>Process your data to generate resumes</li>
              <li>Store your information as described in our Privacy Policy</li>
              <li>Use anonymized data to improve our AI models</li>
            </ul>

            <h2>Third-Party Services</h2>
            <p>
              Our service integrates with third-party services including LinkedIn, GitHub, and Anthropic Claude.
              Your use of these services is subject to their respective terms and conditions.
            </p>

            <h2>Disclaimer</h2>
            <p>
              ResumeHey is provided "as is" without warranties of any kind. We do not guarantee:
            </p>
            <ul>
              <li>Job application success</li>
              <li>Continuous, uninterrupted service</li>
              <li>Perfect accuracy of AI-generated content</li>
            </ul>

            <h2>Limitation of Liability</h2>
            <p>
              ResumeHey shall not be liable for any indirect, incidental, special, consequential, or punitive damages
              resulting from your use or inability to use the service.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the service after changes
              constitutes acceptance of the new terms.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 