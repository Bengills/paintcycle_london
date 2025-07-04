import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsAndConditionsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">PaintCycle Terms and Conditions</h1>

      <div className="prose prose-emerald max-w-none">
        <p className="text-gray-600 mb-8">
          Welcome to PaintCycle! These Terms and Conditions ("Terms") govern your use of the PaintCycle website and services (collectively, the "Platform"). By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree to these Terms, you may not use the Platform.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. About PaintCycle</h2>
          <p className="text-gray-600">
            PaintCycle is a platform that connects individuals who have unwanted paint with those who are looking for paint. Users can list unwanted paint for others to pick up and use, or browse and search for paint available in their area. PaintCycle does not manufacture, sell, or take ownership of any paint listed on the Platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility</h2>
          <p className="text-gray-600 mb-4">To use PaintCycle, you must:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Be at least 18 years old.</li>
            <li>Have the legal capacity to enter into a binding agreement.</li>
            <li>Comply with all applicable laws and regulations in your jurisdiction.</li>
          </ul>
          <p className="text-gray-600">
            By using the Platform, you represent and warrant that you meet these eligibility requirements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Listing Paint</h3>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>You may list unwanted paint on the Platform, provided that the paint is safe, legal, and accurately described.</li>
            <li>You must ensure that the paint is in usable condition and free from harmful substances or contaminants.</li>
            <li>You are responsible for providing accurate information about the paint, including its type, color, quantity, and condition.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Picking Up Paint</h3>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>If you pick up paint listed on the Platform, you do so at your own risk.</li>
            <li>You must verify the condition and suitability of the paint before accepting it.</li>
            <li>PaintCycle is not responsible for the quality, safety, or usability of any paint listed on the Platform.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Prohibited Activities</h3>
          <p className="text-gray-600 mb-2">You agree not to:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>List or request paint that is illegal, hazardous, or prohibited by law.</li>
            <li>Use the Platform for commercial purposes without prior written consent from PaintCycle.</li>
            <li>Misrepresent the condition or quality of any paint.</li>
            <li>Engage in any activity that disrupts or interferes with the Platform or its users.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. No Warranty</h2>
          <p className="text-gray-600 mb-2">PaintCycle provides the Platform on an "as-is" and "as-available" basis. We do not guarantee:</p>
          <ul className="list-disc pl-6 text-gray-600">
            <li>The accuracy, completeness, or reliability of any listings.</li>
            <li>The quality, safety, or legality of any paint listed on the Platform.</li>
            <li>That the Platform will be uninterrupted, secure, or error-free.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
          <p className="text-gray-600">
            To the fullest extent permitted by law, PaintCycle and its affiliates, officers, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or related to your use of the Platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Indemnification</h2>
          <p className="text-gray-600">
            You agree to indemnify and hold harmless PaintCycle and its affiliates from any claims, liabilities, damages, losses, or expenses, including reasonable attorneys' fees, arising out of or related to:
          </p>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Your use of the Platform.</li>
            <li>Your violation of these Terms.</li>
            <li>Your violation of any applicable laws or regulations.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
          <p className="text-gray-600">
            All content on the Platform, including text, graphics, logos, and software, is the property of PaintCycle or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without prior written consent from PaintCycle.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Privacy</h2>
          <p className="text-gray-600">
            Your use of the Platform is subject to our Privacy Policy, which explains how we collect, use, and protect your personal information. By using the Platform, you agree to the terms of the Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
          <p className="text-gray-600">
            PaintCycle reserves the right to suspend or terminate your access to the Platform at any time, with or without notice, for any reason, including but not limited to your violation of these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
          <p className="text-gray-600">
            PaintCycle may update these Terms from time to time. We will notify you of any material changes by posting the updated Terms on the Platform. Your continued use of the Platform after such changes constitutes your acceptance of the updated Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
          <p className="text-gray-600">
            These Terms are governed by and construed in accordance with the laws of the UK. Any disputes arising out of or related to these Terms or the Platform shall be resolved exclusively in the courts of the UK.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
          <p className="text-gray-600 mb-4">If you have any questions or concerns about these Terms, please contact us at:</p>
          <p className="text-gray-600">Email: hello@paintcycle.uk</p>
        </section>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            By using PaintCycle, you acknowledge that you have read, understood, and agree to these Terms and Conditions. Thank you for being part of our community and helping to reduce waste!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;