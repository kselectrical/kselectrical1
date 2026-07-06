import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const PrivacyPage: React.FC = () => {
  const businessName = "KS Electrical and AC Services";
  const address = "Gaur City 1, Greater Noida West, Noida Extension, UP 201301";

  return (
    <>
      <Helmet>
        <title>Privacy Policy | KS Electrical and AC Services</title>
        <meta name="description" content="Read our privacy policy to understand how we secure and use your phone number and address details for scheduling dispatch bookings." />
        <link rel="canonical" href="https://www.kselectrical.in/privacy-policy" />
      </Helmet>

      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      <section className="max-w-4xl mx-auto px-6 py-12 text-left font-sans animate-in fade-in duration-200">
        <div className="border-b border-gray-150 pb-6 mb-8">
          <span className="text-[10px] text-brand-blue bg-blue-50 border border-blue-100 px-3 py-1 rounded-full font-black uppercase tracking-wider select-none">
            Data Security & Trust
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-none mt-3">
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm font-semibold mt-2">
            Last Updated: June 2026 • Official Data Guidelines for {businessName}
          </p>
        </div>

        <div className="space-y-8 text-gray-700 text-xs sm:text-sm leading-relaxed">
          <p>
            At <strong>{businessName}</strong>, we respect your privacy and are committed to safeguarding the personal details you share with us. This policy details how we collect, store, and utilize your name, contact phone numbers, and home addresses for scheduling doorstep technician dispatches.
          </p>

          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-gray-900 font-black text-base uppercase tracking-tight border-l-4 border-brand-blue pl-3">
              1. Information We Collect
            </h2>
            <p>
              When you submit a service booking request on our website, call our dispatch line, or message our operators on WhatsApp, we gather basic information to fulfill your repair request:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 font-semibold text-gray-600">
              <li><strong>Contact Details:</strong> Your name, primary phone number, and alternate mobile numbers (used for dispatch coordination).</li>
              <li><strong>Location Details:</strong> Your flat/society address, block details, and society name (used by technicians to navigate to your site).</li>
              <li><strong>Service Data:</strong> Appliance specifications, repair history, and invoice records generated under our billing system.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="text-gray-900 font-black text-base uppercase tracking-tight border-l-4 border-brand-blue pl-3">
              2. How We Use Your Information
            </h2>
            <p>
              Your personal data is strictly utilized for operational service dispatches and client updates:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 font-semibold text-gray-600">
              <li>To dispatch the assigned AC engineer or electrician to your exact home address.</li>
              <li>To call you for slot verification, arrival coordination, and post-service warranty updates.</li>
              <li>To generate official digital invoices on our billing portal and coordinate payments.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-gray-900 font-black text-base uppercase tracking-tight border-l-4 border-brand-blue pl-3">
              3. Data Security & Retention
            </h2>
            <p>
              All customer bookings and billing records are stored securely in our private databases (both on our live server and Google Firestore). We employ standard SSL/TLS encryption for data transmission. We never rent, share, or sell your name, phone number, or address to third-party telemarketers or external advertising companies. 
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="text-gray-900 font-black text-base uppercase tracking-tight border-l-4 border-brand-blue pl-3">
              4. Anti-Discrimination Policy
            </h2>
            <p id="anti-discrimination">
              In accordance with our core values, we treat all customers with utmost respect. Our dispatch teams, HVAC technicians, and electrical professionals serve all residential clients equally, without discrimination based on religion, gender, caste, race, or regional origin.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3 border-t border-gray-100 pt-6 font-semibold text-xs text-gray-500">
            <p>
              If you wish to update or delete your contact records from our active billing database, please contact our helpline:
            </p>
            <p>
              Helpline Support: <strong>+91 7895321472</strong> | Office Address: {address}
            </p>
          </div>

        </div>
      </section>
    </>
  );
};
export default PrivacyPage;
