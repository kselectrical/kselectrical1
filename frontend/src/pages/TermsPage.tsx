import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const TermsPage: React.FC = () => {
  const businessName = "KS Electrical and AC Services";
  const address = "Gaur City 1, Greater Noida West, Noida Extension, UP 201301";
  
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | KS Electrical and AC Services</title>
        <meta name="description" content="Official Terms of Service for booking AC jet cleaning, RO repairs, electrician visits, and balcony pigeon net installation with KS Electrical." />
        <link rel="canonical" href="https://www.kselectrical.in/terms-and-cond" />
      </Helmet>

      <Breadcrumbs items={[{ label: 'Terms and Conditions' }]} />

      <section className="max-w-4xl mx-auto px-6 py-12 text-left font-sans animate-in fade-in duration-200">
        <div className="border-b border-gray-150 pb-6 mb-8">
          <span className="text-[10px] text-brand-blue bg-blue-50 border border-blue-100 px-3 py-1 rounded-full font-black uppercase tracking-wider select-none">
            User Agreement & Service Clauses
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-none mt-3">
            Terms of Service & Warranty Conditions
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm font-semibold mt-2">
            Last Updated: June 2026 • Official Operating Rules for {businessName}
          </p>
        </div>

        <div className="space-y-8 text-gray-700 text-xs sm:text-sm leading-relaxed">
          <p>
            Welcome to <strong>{businessName}</strong>. By scheduling doorstep servicing, booking technician visits, or purchasing spare parts through our website or helpline, you agree to comply with the terms, conditions, and warranty bounds detailed below.
          </p>
          
          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-gray-900 font-black text-base uppercase tracking-tight border-l-4 border-brand-blue pl-3">
              1. Doorstep Service Scope & Operations
            </h2>
            <p>
              We provide expert technician visits and repairs for residential household utilities. The scope of our core services includes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 font-semibold text-gray-600">
              <li><strong>AC Services:</strong> Split and Window AC high-pressure wet jet cleaning, gas charging (R32, R22, R410A), copper pipe installation, capacitor/fan motor replacement, and dismantling.</li>
              <li><strong>RO Water Purifiers:</strong> Sediment/Carbon pre-filter cartridge changes, membrane flushing, booster pump repairs, SV (Solenoid Valve) installation, and TDS calibration.</li>
              <li><strong>Electrician Visits:</strong> Short-circuit diagnostics, modular switches, DB box MCB replacements, false ceiling wiring, geyser repair, fan winding repair, and kitchen chimney servicing.</li>
              <li><strong>Balcony Pigeon Netting:</strong> Custom layout of heavy-duty HDPE nylon nets (rustproof wire rope and steel anchors) to secure open balconies.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="text-gray-900 font-black text-base uppercase tracking-tight border-l-4 border-brand-blue pl-3">
              2. Scheduling, Site Access & Technician Safety
            </h2>
            <p>
              Our operations dispatch certified technicians to residential societies in Gaur City 1, Gaur City 2, Noida Extension, Noida, and Ghaziabad within the requested time slots.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li><strong>Workplace Access:</strong> Customers must ensure the technician is given safe, clear, and unhindered access to the appliances. An adult (above 18 years) must be present at all times.</li>
              <li><strong>Technician Safety:</strong> We maintain a zero-tolerance policy for abuse, threats, or harassment of our technicians. Technicians reserve the right to cease service if the environment is unsafe.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-gray-900 font-black text-base uppercase tracking-tight border-l-4 border-brand-blue pl-3">
              3. Pricing, Diagnostic Fees & Spare Parts Billing
            </h2>
            <p>
              To maintain fair and upfront transaction records, we enforce clear pricing policies:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 font-semibold text-gray-600">
              <li><strong>Visitation & Diagnostic Fee:</strong> If a technician visits your home and diagnoses the issue, but you decide not to proceed with the repair job, a standard fee of <strong>₹99</strong> is payable for transit and diagnosis.</li>
              <li><strong>Spare Parts & Materials:</strong> The cost of replacement spares (such as capacitors, filters, RO membrane, MCBs, wires, copper piping, brackets, etc.) is NOT included in the base labor service fee. They will be billed extra based on standard rates.</li>
              <li><strong>Invoices & Taxes:</strong> Every completed job receives a digital tax invoice. Local residential invoicing is subject to standard GST (18%) where applicable.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="text-gray-900 font-black text-base uppercase tracking-tight border-l-4 border-brand-blue pl-3">
              4. 30-Day Service & Replaced Spares Warranty
            </h2>
            <p>
              We stand behind the quality of our craftsmanship with our official doorstep warranty program:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li><strong>30-Day Warranty:</strong> We provide a 30-day warranty on the specific spare part replaced and the specific labor job performed.</li>
              <li><strong>AC Installation Warranty:</strong> A special 90-day warranty is provided on Split and Window AC wall mounting to ensure secure layouts.</li>
              <li><strong>Warranty Void Clauses:</strong> The warranty is immediately voided if the appliance is opened, repaired, or modified by any third-party technician or by the customer within the warranty period. The warranty does not cover issues resulting from voltage spikes or water damage.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h2 className="text-gray-900 font-black text-base uppercase tracking-tight border-l-4 border-brand-blue pl-3">
              5. Customer Site Electrical Load & Safety Checks
            </h2>
            <p>
              For high-power home appliances (ACs, geysers, induction cooktops), the customer is responsible for ensuring that the home's electrical wiring, socket load capacity, and earthing system are fully functional. {businessName} is not liable for any household wiring failures or damages caused by pre-existing voltage fluctuations.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-3 border-t border-gray-100 pt-6 font-semibold text-xs text-gray-500">
            <p>
              Registered Business Office: <strong>{businessName}</strong>, {address}
            </p>
            <p>
              For support queries, invoice claims, or warranty service requests, please contact our dispatch desk at <strong>+91 7895321472</strong> or email <strong>kselectrical004@gmail.com</strong>.
            </p>
          </div>

        </div>
      </section>
    </>
  );
};

export default TermsPage;
