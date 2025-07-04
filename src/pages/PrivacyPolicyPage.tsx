import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">PaintCycle Privacy Policy</h1>

      <div className="prose prose-emerald max-w-none">
        <p className="text-gray-600 mb-8">
          Welcome to PaintCycle! This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our website and services (collectively, the "Platform"). By accessing or using the Platform, you agree to the terms of this Privacy Policy. If you do not agree with this policy, please do not use the Platform.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
          <p className="text-gray-600 mb-4">We may collect the following types of information when you use the Platform:</p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">1.1 Personal Information</h3>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, and password.</li>
            <li><strong>Profile Information:</strong> If you choose to complete your profile, we may collect additional information such as your location, profile picture, and preferences.</li>
            <li><strong>Listings and Requests:</strong> When you list paint or request paint, we collect details about the paint (e.g., type, colour, quantity) and your location.</li>
            <li><strong>Communications:</strong> If you contact us or other users through the Platform, we may collect the content of your messages.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">1.2 Usage Data</h3>
          <p className="text-gray-600 mb-2">We automatically collect information about your use of the Platform, including:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>IP address, browser type, and device information.</li>
            <li>Pages visited, time spent on the Platform, and interactions with features.</li>
            <li>Cookies and similar tracking technologies (see Section 5 for more details).</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">1.3 Location Data</h3>
          <p className="text-gray-600">
            If you enable location services, we may collect your precise or approximate location to help you find or list paint in your area.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 text-gray-600">
            <li>To provide, maintain, and improve the Platform.</li>
            <li>To facilitate connections between users listing and requesting paint.</li>
            <li>To communicate with you about your account, listings, requests, and updates to the Platform.</li>
            <li>To personalise your experience and show relevant content.</li>
            <li>To monitor and analyse usage trends and improve the functionality of the Platform.</li>
            <li>To comply with legal obligations and enforce our Terms and Conditions.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Share Your Information</h2>
          <p className="text-gray-600 mb-4">We may share your information in the following circumstances:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li><strong>With Other Users:</strong> When you list or request paint, we share relevant details (e.g., paint description, location) with other users to facilitate the exchange.</li>
            <li><strong>Service Providers:</strong> We may share information with third-party service providers who assist us in operating the Platform (e.g., hosting, analytics, customer support).</li>
            <li><strong>Legal Compliance:</strong> We may disclose information if required by law, to protect our rights, or to comply with a legal process.</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner.</li>
          </ul>
          <p className="text-gray-600">We do not sell your personal information to third parties.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Retention</h2>
          <p className="text-gray-600">
            We retain your personal information for as long as necessary to fulfil the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When your information is no longer needed, we will securely delete or anonymise it.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies and Tracking Technologies</h2>
          <p className="text-gray-600 mb-4">We use cookies and similar technologies to:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Enhance your experience on the Platform.</li>
            <li>Analyse usage patterns and improve functionality.</li>
            <li>Deliver targeted advertisements (if applicable).</li>
          </ul>
          <p className="text-gray-600">
            You can manage your cookie preferences through your browser settings. However, disabling cookies may affect your ability to use certain features of the Platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights and Choices</h2>
          <p className="text-gray-600 mb-4">Under UK data protection laws, you have the following rights regarding your personal information:</p>
          <ul className="list-disc pl-6 text-gray-600">
            <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
            <li><strong>Correction:</strong> Request that we correct or update inaccurate or incomplete information.</li>
            <li><strong>Deletion:</strong> Request that we delete your personal information, subject to legal obligations.</li>
            <li><strong>Restriction:</strong> Request that we restrict the processing of your personal information in certain circumstances.</li>
            <li><strong>Objection:</strong> Object to the processing of your personal information for specific purposes, such as direct marketing.</li>
            <li><strong>Data Portability:</strong> Request a copy of your personal information in a structured, commonly used, and machine-readable format.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Security</h2>
          <p className="text-gray-600">
            We take reasonable measures to protect your personal information from unauthorised access, use, or disclosure. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Links</h2>
          <p className="text-gray-600">
            The Platform may contain links to third-party websites or services. This Privacy Policy does not apply to those websites or services, and we are not responsible for their privacy practices. We encourage you to review the privacy policies of any third-party websites you visit.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
          <p className="text-gray-600">
            The Platform is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will take steps to delete it promptly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
          <p className="text-gray-600">
            We may update this Privacy Policy from time to time. If we make material changes, we will notify you by posting the updated policy on the Platform or through other communication methods. Your continued use of the Platform after such changes constitutes your acceptance of the updated Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
          <p className="text-gray-600 mb-4">If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
          <p className="text-gray-600">Email: <a href="mailto:hello@paintcycle.uk" className="text-emerald-600 hover:text-emerald-500">hello@paintcycle.uk</a></p>
        </section>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            Thank you for using PaintCycle and trusting us with your personal information. We are committed to protecting your privacy and ensuring a safe and enjoyable experience on our Platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;