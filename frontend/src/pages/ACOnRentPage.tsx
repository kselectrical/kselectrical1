import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { CheckCircle, Phone, MessageCircle, Snowflake, ShieldCheck, Clock, Wrench, Building2 } from 'lucide-react';
import type { BusinessConfig } from '../data';

interface ACOnRentPageProps {
  businessConfig: BusinessConfig;
}

export const ACOnRentPage: React.FC<ACOnRentPageProps> = ({ businessConfig }) => {
  const phone = businessConfig.contacts[0];
  const whatsappMsg = encodeURIComponent('Hello, I want to know about AC on Rent in Gaur City / Noida Extension.');
  const whatsappUrl = `https://wa.me/91${phone}?text=${whatsappMsg}`;

  const features = [
    { icon: <Snowflake size={22} className="text-blue-500" />, title: 'Split & Window AC', desc: 'Both split and window AC units available for residential and office use.' },
    { icon: <Clock size={22} className="text-brand-orange" />, title: 'Same-Day Setup', desc: 'Fast installation on the same day of booking in Gaur City & Noida Extension.' },
    { icon: <ShieldCheck size={22} className="text-emerald-500" />, title: 'Certified Technicians', desc: 'All installations done by trained, verified AC technicians.' },
    { icon: <Wrench size={22} className="text-purple-500" />, title: 'Regular Maintenance', desc: 'Scheduled servicing and filter cleaning included in rental plan.' },
    { icon: <Building2 size={22} className="text-slate-500" />, title: 'Home & Office', desc: 'Suitable for flats, villas, offices, shops and commercial spaces.' },
    { icon: <CheckCircle size={22} className="text-brand-blue" />, title: 'No Hidden Charges', desc: 'Transparent pricing with clear rental terms before booking.' },
  ];

  const faqs = [
    { q: 'Which areas do you serve for AC on Rent?', a: 'We serve Gaur City 1, Gaur City 2, Greater Noida West, Noida Extension, Ace City, Fusion Homes, Eco Village and nearby societies.' },
    { q: 'What types of AC are available on rent?', a: 'We offer both split AC and window AC on rent depending on your room size and installation requirements.' },
    { q: 'Is installation included in the rent?', a: 'Yes, professional installation by our certified technician is included with the rental service.' },
    { q: 'Is maintenance covered during the rental period?', a: 'Yes, regular maintenance visits and filter cleaning are included as part of the rental plan.' },
    { q: 'How do I book an AC on rent?', a: 'Simply call us or message on WhatsApp. Our team will visit for a quick inspection and same-day setup.' },
    { q: 'Can I extend the rental duration?', a: 'Yes, rental duration can be extended based on availability and mutual agreement.' },
    { q: 'What if the AC breaks down during the rental?', a: 'Call our helpline and we will dispatch a technician for inspection and repair at no extra charge.' },
    { q: 'Is a security deposit required?', a: 'A refundable security deposit may be applicable. Full details are shared before booking.' },
  ];

  return (
    <>
      <Helmet>
        <title>AC on Rent in Gaur City &amp; Noida Extension | KS Electrical And AC Services</title>
        <meta name="description" content="Rent split or window AC in Gaur City, Greater Noida West and Noida Extension. Fast same-day installation, regular maintenance, certified technicians. Call now." />
        <meta name="keywords" content="AC on Rent, AC Rental Gaur City, AC on Rent Noida Extension, Split AC Rental Greater Noida, Window AC on Rent" />
        <link rel="canonical" href="https://kselectrical.in/ac-on-rent" />
        <meta property="og:title" content="AC on Rent in Gaur City & Noida Extension | KS Electrical" />
        <meta property="og:description" content="Rent split or window AC with same-day installation in Gaur City & Noida Extension." />
        <meta property="og:url" content="https://kselectrical.in/ac-on-rent" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'AC on Rent',
          serviceType: 'AC Rental Service',
          provider: { '@type': 'LocalBusiness', name: businessConfig.name, telephone: `+91${phone}`, url: 'https://kselectrical.in' },
          areaServed: ['Gaur City', 'Noida Extension', 'Greater Noida West', 'Greater Noida'],
          description: 'Rent split or window AC with professional installation and maintenance in Gaur City and Noida Extension.'
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
        })}</script>
      </Helmet>

      <Breadcrumbs items={[{ label: 'AC on Rent', path: '/ac-on-rent' }]} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 text-left space-y-6">
          <span className="text-[10px] text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-3 py-1 rounded-full font-black uppercase tracking-wider select-none">
            Premium AC Rental Service
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            AC on Rent in Gaur City &amp; Noida Extension
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-2xl">
            Get premium Split or Window AC on rent with same-day installation, regular maintenance, and trusted certified technicians — directly at your doorstep in Gaur City, Greater Noida West, and Noida Extension.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center space-x-2 bg-brand-orange hover:bg-brand-orange-dark text-white rounded-xl px-6 py-3.5 text-xs font-black uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Phone size={14} fill="currentColor" />
              <span>Call Now: {phone}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-3.5 text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              <MessageCircle size={14} />
              <span>WhatsApp Enquiry</span>
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-50 py-16 px-6 border-b border-slate-200">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-left">
            <h2 className="text-gray-900 font-black text-2xl tracking-tight">Why Choose KS Electrical for AC Rental?</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">Fast setup · Clean installation · Local trusted team</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((item, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-brand-orange/30 hover:shadow-md transition-all">
                <div className="flex items-center space-x-3 mb-3">
                  {item.icon}
                  <h3 className="font-extrabold text-sm text-slate-900">{item.title}</h3>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="bg-white py-16 px-6 border-b border-slate-100">
        <div className="max-w-5xl mx-auto space-y-6 text-left">
          <h2 className="text-gray-900 font-black text-2xl tracking-tight">Areas We Serve</h2>
          <p className="text-slate-500 text-sm font-medium">AC on Rent available across major localities in Greater Noida and Noida Extension:</p>
          <div className="flex flex-wrap gap-2.5 pt-1">
            {['Gaur City 1', 'Gaur City 2', 'Greater Noida West', 'Noida Extension', 'Ace City', 'Fusion Homes', 'Eco Village', 'Cherry County', 'Nirala Estate', 'Techzone IV', 'Siddharth Vihar', 'Crossings Republik'].map((area, i) => (
              <span key={i} className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2 text-xs font-bold hover:border-brand-orange/40 hover:text-brand-orange transition-all">
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-50 py-16 px-6 border-b border-slate-200">
        <div className="max-w-4xl mx-auto space-y-8 text-left">
          <h2 className="text-gray-900 font-black text-2xl tracking-tight">How AC Rental Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { step: '01', title: 'Call / WhatsApp', desc: 'Contact us with your location and AC requirement.' },
              { step: '02', title: 'Site Inspection', desc: 'Our team visits for a quick inspection of the room and power supply.' },
              { step: '03', title: 'Same-Day Install', desc: 'Certified technician installs the AC unit cleanly and safely.' },
              { step: '04', title: 'Ongoing Support', desc: 'Regular maintenance and support throughout the rental period.' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left">
                <div className="text-3xl font-black text-brand-orange/20 mb-2">{item.step}</div>
                <h3 className="font-extrabold text-sm text-slate-900 mb-1">{item.title}</h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16 px-6 border-b border-slate-100">
        <div className="max-w-3xl mx-auto space-y-6 text-left">
          <h2 className="text-gray-900 font-black text-2xl tracking-tight">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h3 className="font-extrabold text-sm text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-[12px] text-slate-600 font-medium leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="bg-slate-50 py-12 px-6 border-b border-slate-200">
        <div className="max-w-4xl mx-auto space-y-4 text-left">
          <h3 className="text-gray-900 font-extrabold text-lg">Related Services</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'AC Service & Repair', path: '/services/ac-service' },
              { label: 'AC Installation', path: '/services/ac-service' },
              { label: 'Electrician Service', path: '/services/electrician-service' },
              { label: 'All Services', path: '/services' },
            ].map((link, i) => (
              <Link key={i} to={link.path} className="bg-white border border-slate-200 hover:border-brand-orange/40 hover:text-brand-orange text-slate-700 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-sm">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-slate-950 text-white py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/10 to-blue-500/10 opacity-60" />
        <div className="max-w-2xl mx-auto space-y-5 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Ready to Rent an AC Today?</h2>
          <p className="text-sm text-slate-400 font-semibold leading-relaxed">
            Same-day delivery and installation in Gaur City & Greater Noida West. Call now or WhatsApp for instant booking.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
            <a
              href={`tel:${phone}`}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-brand-orange hover:bg-brand-orange-dark text-white rounded-xl px-6 py-3.5 text-xs font-black uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Phone size={13} fill="currentColor" />
              <span>Call {phone}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-3.5 text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              <MessageCircle size={13} />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default ACOnRentPage;
