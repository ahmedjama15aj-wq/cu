import React from 'react';

export const TermsOfService: React.FC = () => {
  return (
    <div className="pt-32 pb-16 px-4 bg-white text-zinc-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-sm text-zinc-600 mb-8">Last Updated: March 30, 2026</p>

        <div className="space-y-6 text-zinc-800 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Cupping Connect platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 mb-3">2. Marketplace Services</h2>
            <p>
              Cupping Connect is a marketplace platform that connects customers seeking wet cupping (Hijamah) therapy with independent practitioners. We do not provide medical services. Practitioners are independent contractors, not employees of Cupping Connect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 mb-3">3. Appointments and Bookings</h2>
            <p>
              Users are responsible for scheduling appointments through the platform. By booking an appointment, you agree to the practitioner's policies and fees.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 mb-3">4. Platform Fees and Payouts</h2>
            <p>
              To maintain and operate Cupping Connect, we apply the following fee structure to every completed session:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Cupping Connect collects an 8% fee from the customer on top of the session cost.</li>
              <li>Cupping Connect deducts an 8% fee from the Practitioner's session rate.</li>
              <li>The remainder of the session rate goes directly to the selected Practitioner.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 mb-3">5. Practitioner Obligations</h2>
            <p>
              Practitioners must maintain accurate professional credentials and banking information on the platform. Failure to provide accurate banking information may result in delayed payouts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 mb-3">6. Medical Disclaimer</h2>
            <p>
              Cupping therapy is a complementary therapeutic practice. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 mb-3">7. Limitation of Liability</h2>
            <p>
              Cupping Connect is not responsible for the acts, omissions, or services provided by practitioners. We are not liable for any damages or injuries resulting from the use of our platform or the services provided by practitioners.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 mb-3">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. Continued use of the platform after changes constitutes acceptance of the new terms.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 mb-3">9. Contact Support</h2>
            <p>
              For any questions regarding these Terms of Service, please contact our support team at: <a href="mailto:Support@cuppingconnect@gmail.com" className="text-teal-600 font-bold hover:underline">Support@cuppingconnect@gmail.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
