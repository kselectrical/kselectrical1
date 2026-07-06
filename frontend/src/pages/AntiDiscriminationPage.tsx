import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const AntiDiscriminationPage: React.FC = () => {
  const businessName = "KS Electrical and AC Services";
  const address = "Gaur City 1, Greater Noida West, Noida Extension, UP 201301";

  return (
    <>
      <Helmet>
        <title>Anti-Discrimination Policy | KS Electrical and AC Services</title>
        <meta name="description" content="Read our anti-discrimination policy. KS Electrical is committed to providing equal doorstep appliance repairs and electrical services without bias." />
        <link rel="canonical" href="https://www.kselectrical.in/anti-discrimination" />
      </Helmet>

      <Breadcrumbs items={[{ label: 'Anti-Discrimination Policy' }]} />

      <section className="max-w-4xl mx-auto px-6 py-12 text-left font-sans animate-in fade-in duration-200">
        <div className="border-b border-gray-150 pb-6 mb-8">
          <span className="text-[10px] text-brand-blue bg-blue-50 border border-blue-100 px-3 py-1 rounded-full font-black uppercase tracking-wider select-none">
            Equality & Inclusion Policy
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-none mt-3">
            Anti-Discrimination Policy
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm font-semibold mt-2">
            Last Updated: June 2026 • Official Guidelines for {businessName}
          </p>
        </div>

        <div className="space-y-8 text-gray-700 text-xs sm:text-sm leading-relaxed">
          <p>
            At <strong>{businessName}</strong>, we are committed to providing a safe, respectful, and inclusive environment for our residential clients, our HVAC engineers, electricians, and all operational staff. We believe that professional doorstep services should be built on mutual respect and dignity.
          </p>

          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-gray-900 font-black text-base uppercase tracking-tight border-l-4 border-brand-blue pl-3">
              1. Non-Discrimination Commitment
            </h2>
            <p>
              We provide doorstep appliance repairs and electrical installations to all customers without discrimination. We do not tolerate bias, prejudice, or exclusion based on:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 font-semibold text-gray-600">
              <li>Religion, creed, or spiritual belief.</li>
              <li>Gender, gender expression, or sexual orientation.</li>
              <li>Caste, race, color, ethnicity, or regional origin.</li>
              <li>Socioeconomic status, apartment size, or society location.</li>
              <li>Age, physical abilities, or marital status.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="text-gray-900 font-black text-base uppercase tracking-tight border-l-4 border-brand-blue pl-3">
              2. Zero-Tolerance for Harassment
            </h2>
            <p>
              We maintain a zero-tolerance policy for harassment of any kind. This policy applies to both:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li><strong>By Our Technicians:</strong> All technicians under our brand undergo strict vetting and code-of-conduct training. They are instructed to behave with utmost professionalism, politeness, and respect on customer premises.</li>
              <li><strong>Towards Our Technicians:</strong> We require customers to treat our visiting professionals with safety and respect. Technicians reserve the right to decline or halt a service immediately if they experience verbal abuse, threats, unsafe work environments, or discriminatory treatment.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-gray-900 font-black text-base uppercase tracking-tight border-l-4 border-brand-blue pl-3">
              3. Equal Opportunity & Fair Work Environment
            </h2>
            <p>
              Within our service dispatch system, we offer equal hiring and partnership opportunities to skilled technicians and assistants. All technician payouts, incentives, and safety measures are assigned based on skill, performance, and certification, with zero tolerance for bias.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="text-gray-900 font-black text-base uppercase tracking-tight border-l-4 border-brand-blue pl-3">
              4. Reporting & Resolution Process
            </h2>
            <p>
              If you believe you have experienced treatment contrary to this policy, either by one of our technicians or during interaction with our dispatch desk, we urge you to report the issue immediately.
            </p>
            <p className="font-semibold text-gray-600">
              How to file a report:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>Call our escalation desk directly at: <strong>+91 7895321472</strong></li>
              <li>Email us detailed feedback at: <strong>kselectrical004@gmail.com</strong></li>
            </ul>
            <p>
              We investigate all reports thoroughly and take immediate corrective measures, up to and including terminating the technician's contract or banning clients who violate safety guidelines.
            </p>
          </div>

          {/* Footer Info */}
          <div className="space-y-3 border-t border-gray-100 pt-6 font-semibold text-xs text-gray-500">
            <p>
              Helpline Escalation Support: <strong>+91 7895321472</strong> | Registered Address: {address}
            </p>
          </div>

        </div>
      </section>
    </>
  );
};

export default AntiDiscriminationPage;
