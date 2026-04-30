import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="pt-32 pb-16 px-4 bg-white text-zinc-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-sm text-zinc-600 mb-8">Last Updated: March 30, 2026</p>

        <div className="space-y-6 text-zinc-800 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 mb-3">1. Introduction</h2>
            <p>
              Cupping Connect Platform ("we," "us," or "our") operates as a marketplace platform connecting customers with professional cupping practitioners. This Privacy Policy explains how we collect, use, and protect your information when you use our platform to set appointments and process payments.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 mb-3">2. Information We Collect</h2>
            <p>We collect information necessary to provide our marketplace services:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Customers:</strong> Name, contact information, and appointment details.</li>
              <li><strong>Practitioners:</strong> Name, contact information, professional credentials, and banking information required for payouts.</li>
              <li><strong>Payment Information:</strong> We support card payments only. Payment details are processed securely through our third-party payment processors. We do not store full credit card numbers on our servers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 mb-3">3. Practitioner Banking Information</h2>
            <p>
              To receive payments for services rendered, practitioners are required to provide and maintain accurate banking information. This information is collected and stored securely. We use this data solely for the purpose of facilitating payouts to practitioners for completed appointments.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 mb-3">4. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Facilitate the connection between customers and practitioners.</li>
              <li>Manage appointment scheduling.</li>
              <li>Process secure online card payments.</li>
              <li><strong>Platform Fees and Payouts:</strong> To maintain and operate Cupping Connect, we apply the following fee structure to every completed session:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Cupping Connect collects an 8% fee from the customer on top of the session cost.</li>
                  <li>Cupping Connect deducts an 8% fee from the Practitioner's session rate.</li>
                  <li>The remainder of the session rate goes directly to the selected Practitioner.</li>
                </ul>
              </li>
              <li>Facilitate payouts to practitioners.</li>
              <li>Communicate with you regarding your account, appointments, or platform updates.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 mb-3">5. Information Sharing</h2>
            <p>
              We do not sell your personal information. We share information only as necessary to provide our services:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Between Users:</strong> Customers' contact details are shared with practitioners for appointment purposes, and practitioners' professional details are shared with customers.</li>
              <li><strong>Payment Processors:</strong> Necessary payment data is shared with our secure third-party payment processors to facilitate transactions.</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 mb-3">6. Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal and financial information. While we strive to use commercially acceptable means to protect your data, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 mb-3">7. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 mb-3">8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through the support channels provided on our platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
