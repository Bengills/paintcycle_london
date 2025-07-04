import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CookiePolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">PaintCycle Cookie Policy</h1>

      <div className="prose prose-emerald max-w-none">
        <p className="text-gray-600 mb-8">
          This Cookie Policy explains how PaintCycle ("we", "us", or "our") uses cookies and similar technologies when you visit our website or use our services (collectively, the "Platform"). It explains what cookies are, how we use them, and your choices regarding their use. By using the Platform, you consent to the use of cookies in accordance with this policy.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Cookies?</h2>
          <p className="text-gray-600 mb-4">
            Cookies are small text files that are placed on your device (e.g., computer, smartphone, or tablet) when you visit a website. They are widely used to make websites work more efficiently, improve user experience, and provide information to website owners.
          </p>
          <p className="text-gray-600 mb-2">Cookies can be:</p>
          <ul className="list-disc pl-6 text-gray-600">
            <li><strong>Session Cookies:</strong> Temporary cookies that are deleted when you close your browser.</li>
            <li><strong>Persistent Cookies:</strong> Cookies that remain on your device for a set period or until you delete them.</li>
            <li><strong>First-Party Cookies:</strong> Cookies set by the website you are visiting.</li>
            <li><strong>Third-Party Cookies:</strong> Cookies set by a domain other than the one you are visiting, often used for advertising or analytics.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Cookies</h2>
          <p className="text-gray-600 mb-4">We use cookies for the following purposes:</p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Essential Cookies</h3>
          <p className="text-gray-600 mb-4">
            These cookies are necessary for the Platform to function and cannot be switched off. They enable core features such as user authentication, account management, and security.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Performance and Analytics Cookies</h3>
          <p className="text-gray-600 mb-4">
            These cookies help us understand how visitors interact with the Platform by collecting information about page visits, traffic sources, and user behaviour. This data is used to improve the performance and functionality of the Platform.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Functionality Cookies</h3>
          <p className="text-gray-600 mb-4">
            These cookies allow the Platform to remember choices you make (e.g., language preferences or region) and provide enhanced, personalised features.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">2.4 Advertising Cookies (if applicable)</h3>
          <p className="text-gray-600">
            If we use advertising, these cookies may be used to deliver relevant ads, track ad performance, and measure the effectiveness of advertising campaigns.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Third-Party Cookies</h2>
          <p className="text-gray-600 mb-4">
            We may allow third-party service providers to place cookies on your device for purposes such as analytics, advertising, and social media integration. These providers have their own privacy policies and may use cookies to collect information about your online activities across different websites.
          </p>
          <p className="text-gray-600 mb-2">Examples of third-party cookies include:</p>
          <ul className="list-disc pl-6 text-gray-600">
            <li><strong>Google Analytics:</strong> To analyse website traffic and usage patterns.</li>
            <li><strong>Social Media Platforms:</strong> To enable social sharing and integration features.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Your Choices Regarding Cookies</h2>
          <p className="text-gray-600 mb-4">You have the following options to manage cookies:</p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Browser Settings</h3>
          <p className="text-gray-600 mb-2">Most web browsers allow you to control cookies through their settings. You can:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-4">
            <li>Block or delete cookies.</li>
            <li>Set your browser to notify you when a cookie is being placed on your device.</li>
          </ul>
          <p className="text-gray-600 mb-4">
            Please note that blocking or deleting cookies may affect the functionality of the Platform and your ability to use certain features.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Cookie Consent Banner</h3>
          <p className="text-gray-600 mb-4">
            When you first visit the Platform, you will be presented with a cookie consent banner. You can use this banner to accept or reject non-essential cookies.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 Opt-Out Tools</h3>
          <p className="text-gray-600 mb-2">For third-party cookies used for advertising or analytics, you can often opt out through the following:</p>
          <ul className="list-disc pl-6 text-gray-600">
            <li><strong>Your Online Choices (UK):</strong> Visit <a href="http://www.youronlinechoices.com/uk" className="text-emerald-600 hover:text-emerald-500" target="_blank" rel="noopener noreferrer">www.youronlinechoices.com/uk</a> to manage your preferences.</li>
            <li><strong>Google Analytics:</strong> Use the Google Analytics Opt-Out Browser Add-on.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Changes to This Cookie Policy</h2>
          <p className="text-gray-600">
            We may update this Cookie Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by posting the updated policy on the Platform or through other communication methods.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contact Us</h2>
          <p className="text-gray-600 mb-4">If you have any questions or concerns about this Cookie Policy or our use of cookies, please contact us at:</p>
          <p className="text-gray-600">Email: <a href="mailto:hello@paintcycle.uk" className="text-emerald-600 hover:text-emerald-500">hello@paintcycle.uk</a></p>
        </section>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            Thank you for using PaintCycle. By understanding and managing your cookie preferences, you can help us provide a better experience on our Platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;