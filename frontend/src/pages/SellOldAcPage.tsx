import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Phone, MessageSquare, Banknote, Clock, MapPin,
  Wrench, Truck, HelpCircle, ChevronDown, ChevronUp, AlertCircle, RefreshCw, CheckCircle2, ShieldCheck
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import type { BusinessConfig } from '../data';

interface SellOldAcPageProps {
  businessConfig?: BusinessConfig;
}

interface PriceGuideItem {
  type: string;
  condition: string;
  priceRange: string;
  note: string;
  popular?: boolean;
}

const PRICE_GUIDE: PriceGuideItem[] = [
  {
    type: 'Window AC (Scrap / Dead Compressor)',
    condition: 'Non-Working / Dead Compressor / Leaked Coil / Scrap',
    priceRange: '₹4,500 - ₹6,000',
    note: 'Valued by pure copper coil weight & salvageable parts'
  },
  {
    type: 'Window AC (Working Condition)',
    condition: 'Active Cooling / 1.5 Ton - 2.0 Ton / Normal Use',
    priceRange: '₹6,000 - ₹8,000',
    note: 'Higher buyback for copper condenser & 3★ / 5★ models',
    popular: true
  },
  {
    type: 'Split AC (Scrap / Non-Working)',
    condition: 'Indoor + Outdoor Unit / PCB Fault / Dead Compressor',
    priceRange: '₹4,500 - ₹6,500',
    note: 'Full buyback for outdoor unit copper condenser + indoor'
  },
  {
    type: 'Split AC (Working / Semi-Working)',
    condition: 'Functional Cooling / Dual Inverter or Non-Inverter',
    priceRange: '₹6,500 - ₹9,000',
    note: 'Top price for Daikin, Voltas, LG, Hitachi, Panasonic',
    popular: true
  },
  {
    type: 'Commercial / Cassette / Tower AC',
    condition: '2.0 Ton to 5.5 Ton Ductable / Cassette (Any Condition)',
    priceRange: '₹9,000 - ₹25,000+',
    note: 'Bulk scrap & buyback evaluation for offices & commercial spaces'
  }
];

const SOCIETIES_SERVED = [
  'Gaur City 1 (Avenue 1, 4, 6, 7)',
  'Gaur City 2 (10th, 11th, 12th, 14th, 16th Avenue)',
  'Cherry County & Ek Murti',
  'Supertech Eco Village 1, 2, 3',
  'Panchsheel Hynish & Greens',
  'Stellar Jeevan & Ace City',
  'Arihant Arden & Amrapali Dream Valley',
  'Techzone 4 & Greater Noida West',
  'Siddharth Vihar & Pratap Vihar',
  'Crossings Republik & NH-24',
  'Sector 62, 75, 76, 78, 121 Noida'
];

const FAQS = [
  {
    q: 'How much money will I get for my old or scrap AC?',
    a: 'We offer ₹4,500 to ₹8,000 for Window ACs and ₹4,500 to ₹9,000 for Split ACs depending on whether the unit is scrap/dead or in functional condition. Please note: The exact final price is determined only after our technician visits your doorstep and inspects the physical condition, copper coil weight, and compressor.'
  },
  {
    q: 'Why is the exact price finalized only after a doorstep visit?',
    a: 'Every air conditioner has varying internal conditions—such as copper vs. aluminium coils, compressor health, gas leakage, and outer body wear. While we provide an accurate estimated range over phone or WhatsApp photos, the fair and final price is confirmed in person after physical inspection so you get the maximum transparent value.'
  },
  {
    q: 'Do you charge any fee for AC uninstallation from the wall?',
    a: 'No, uninstallation is 100% FREE! Our experienced technicians safely dismount both indoor and outdoor units from your wall or balcony with zero labor charges and zero damage to your walls.'
  },
  {
    q: 'Do you buy completely dead, damaged, or burnt AC units?',
    a: 'Yes, absolutely! We purchase ACs in all conditions—including dead compressors, gas-leaked units, broken plastic casing, or burnt circuitry. We evaluate them according to their genuine copper scrap weight and metal content.'
  },
  {
    q: 'How fast can you arrive for pickup in Gaur City & Noida Extension?',
    a: 'Our doorstep team operates locally and typically arrives at your society within 30 to 45 minutes of booking confirmation.'
  },
  {
    q: 'When and how do I receive the payment?',
    a: 'Payment is made on-the-spot right before loading the AC. You can choose instant cash or direct online UPI transfer (Google Pay, PhonePe, Paytm, or IMPS).'
  },
  {
    q: 'How can I get an instant preliminary quote on WhatsApp?',
    a: 'Simply take clear photos of your AC (indoor unit and outdoor compressor unit) and send them to our WhatsApp at +91 7895321472. Our team will review the photos and send a preliminary quote within 5 minutes!'
  }
];

export const SellOldAcPage: React.FC<SellOldAcPageProps> = ({ businessConfig }) => {
  const primaryPhone = businessConfig?.contacts?.[0] || '7895321472';
  const whatsappPreFilled = encodeURIComponent('Hello KS Electrical, I have an old/scrap AC to sell. Please share estimated valuation and schedule an inspection visit.');
  const whatsappUrl = `https://wa.me/91${primaryPhone}?text=${whatsappPreFilled}`;

  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Schema.org Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: 'Old AC Buyback & AC Scrap Buyer Service',
        serviceType: 'Used Air Conditioner Buyback & Scrap Recycling',
        provider: {
          '@type': 'LocalBusiness',
          name: 'KS Electrical & AC Services',
          telephone: `+91-${primaryPhone}`,
          image: 'https://www.kselectrical.in/images/old-ac-scrap-buyer.webp',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Greater Noida West, Gaur City',
            addressRegion: 'Uttar Pradesh',
            addressCountry: 'IN'
          },
          priceRange: '₹4500 - ₹25000'
        },
        areaServed: [
          'Gaur City 1',
          'Gaur City 2',
          'Noida Extension',
          'Greater Noida West',
          'Ghaziabad',
          'Siddharth Vihar',
          'Noida Sector 62'
        ],
        description: 'Sell old, scrap, or working split and window air conditioners for best cash prices. Free doorstep uninstallation, 45-minute pickup in Gaur City & Greater Noida West.'
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map(faq => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a
          }
        }))
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Sell Old AC &amp; AC Scrap Buyer in Gaur City, Noida Extension | Instant Cash Buyback</title>
        <meta 
          name="description" 
          content="Sell your old, used, or dead scrap AC in Gaur City, Noida Extension & Greater Noida West. Window AC: ₹4,500-₹8,000, Split AC: ₹4,500-₹9,000. 100% Free uninstallation & instant spot cash/UPI payment." 
        />
        <meta 
          name="keywords" 
          content="sell old ac near me, ac scrap buyer gaur city, old ac price noida extension, purani ac buyer greater noida west, dead ac scrap rate, sell second hand ac, used split ac price, window ac scrap rate, ac kabadiwala" 
        />
        <link rel="canonical" href="https://www.kselectrical.in/sell-old-ac" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Breadcrumbs 
        items={[
          { label: 'Services', path: '/services' },
          { label: 'Sell Old AC / Scrap Buyer' }
        ]} 
      />

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans select-text">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-400 text-slate-950 text-[11px] font-black uppercase px-3 py-1 rounded-full tracking-wider inline-flex items-center gap-1.5 shadow-sm">
                  <Banknote size={14} />
                  <span>Top Market Buyback Value</span>
                </span>
                <span className="bg-white/10 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                  <Truck size={14} />
                  <span>Doorstep Pickup in 30-45 Min</span>
                </span>
              </div>

              {/* Main Headline */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  Sell Old or Scrap AC — <br />
                  <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                    Get Instant Best Cash at Doorstep
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
                  The most trusted <strong>AC scrap buyer &amp; used air conditioner buyback service</strong> in Gaur City, Noida Extension, and Greater Noida West. 
                  Whether your AC is dead, gas-leaked, compressor-failed, or fully functional — enjoy <strong>100% free uninstallation</strong> and <strong>instant spot payment</strong>.
                </p>
              </div>

              {/* Inspection Notice Highlight Card */}
              <div className="bg-amber-500/15 border border-amber-400/30 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle size={22} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <strong className="text-amber-300 block font-bold mb-0.5">Important Inspection Policy:</strong>
                  The exact final price is confirmed only after our technician performs a physical doorstep visit and inspects the condition of the copper coil, compressor, and components.
                </div>
              </div>

              {/* 3 Quick Benefit Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-2.5">
                  <Wrench size={20} className="text-amber-400 shrink-0" />
                  <div className="text-xs font-bold leading-snug">
                    <span>100% Free Dismount</span>
                    <span className="block text-[10px] text-slate-400 font-normal">₹0 wall uninstallation fee</span>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-2.5">
                  <Banknote size={20} className="text-emerald-400 shrink-0" />
                  <div className="text-xs font-bold leading-snug">
                    <span>Instant Spot Cash</span>
                    <span className="block text-[10px] text-slate-400 font-normal">Cash / UPI / GPay / IMPS</span>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-2.5">
                  <Clock size={20} className="text-blue-400 shrink-0" />
                  <div className="text-xs font-bold leading-snug">
                    <span>30-45 Min Dispatch</span>
                    <span className="block text-[10px] text-slate-400 font-normal">Fast local society arrival</span>
                  </div>
                </div>
              </div>

              {/* Direct Call & WhatsApp Action Box */}
              <div className="bg-gradient-to-r from-slate-800 to-blue-900/60 p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    ⚡ Get Valuation or Schedule Pickup:
                  </span>
                  <span className="text-[11px] text-slate-300 font-semibold">
                    Direct Line: +91 {primaryPhone}
                  </span>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-3">
                  <a
                    href={`tel:${primaryPhone}`}
                    className="flex-1 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black py-3.5 px-4 rounded-xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <Phone size={18} className="fill-slate-950" />
                    <span>Call Now: +91 {primaryPhone}</span>
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold py-3.5 px-4 rounded-xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <MessageSquare size={18} />
                    <span>Send Photos on WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Right Visual Image Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10 bg-slate-800 aspect-[4/3]">
                <img
                  src="/images/old-ac-scrap-buyer.webp"
                  alt="Sell Old Scrap AC in Gaur City Noida Extension - Buyback & Free Dismounting"
                  className="w-full h-full object-cover"
                  loading="eager"
                  width={600}
                  height={450}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/old-ac-scrap-buyer.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-red-400" />
                    <span className="text-xs font-bold text-white">Gaur City 1 &amp; 2, Greater Noida West</span>
                  </div>
                  <span className="text-xs font-black text-amber-400">Doorstep Pickup</span>
                </div>
              </div>

              {/* Instant WhatsApp Quote Hint */}
              <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 text-left">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
                  <RefreshCw size={20} />
                </div>
                <div className="text-xs text-slate-300">
                  <strong className="text-white">Pro-Tip:</strong> Take a photo of your indoor &amp; outdoor unit nameplates and send to WhatsApp for an immediate price estimate in 5 minutes!
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PRICE ESTIMATE GUIDE TABLE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-slate-200 font-sans text-left">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3.5 py-1 rounded-full">
              Estimated Rate Guide
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Old AC Buyback &amp; Scrap Rate List
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              We provide competitive market valuations based on unit tonnage, copper weight, and operational status.
            </p>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                    <th className="py-4 px-4 sm:px-6 font-black">AC Model &amp; Type</th>
                    <th className="py-4 px-4 sm:px-6 font-black">Condition Status</th>
                    <th className="py-4 px-4 sm:px-6 font-black text-amber-300">Estimated Buyback Price</th>
                    <th className="py-4 px-4 sm:px-6 font-black hidden md:table-cell">Valuation Factor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {PRICE_GUIDE.map((item, idx) => (
                    <tr 
                      key={idx} 
                      className={`hover:bg-blue-50/50 transition-colors ${item.popular ? 'bg-amber-50/30' : ''}`}
                    >
                      <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{item.type}</span>
                          {item.popular && (
                            <span className="text-[9px] bg-amber-500 text-white font-black px-2 py-0.5 rounded-full uppercase shrink-0">
                              High Demand
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-slate-600 font-medium">
                        {item.condition}
                      </td>
                      <td className="py-4 px-4 sm:px-6 font-black text-emerald-600 text-sm sm:text-base whitespace-nowrap">
                        {item.priceRange}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-slate-500 text-xs hidden md:table-cell">
                        {item.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Prominent Inspection Disclaimer Alert in Table Footer */}
            <div className="p-4 sm:p-5 bg-amber-50 border-t border-amber-200 text-xs sm:text-sm text-slate-800 space-y-2">
              <div className="flex items-start gap-2 text-amber-900 font-bold">
                <AlertCircle size={17} className="text-amber-600 shrink-0 mt-0.5" />
                <span>Notice: Exact price is determined only after our technician's physical doorstep inspection visit.</span>
              </div>
              <p className="text-slate-600 text-xs pl-6">
                Prices shown above are standard market estimation ranges. The exact final price depends on copper condenser weight, compressor running condition, age, and general physical condition. Wall uninstallation is always 100% free.
              </p>
              <div className="pt-2 pl-6 flex flex-wrap items-center gap-4">
                <a
                  href={`tel:${primaryPhone}`}
                  className="font-bold text-blue-700 hover:text-blue-800 underline inline-flex items-center gap-1.5"
                >
                  <Phone size={13} />
                  <span>Call for Doorstep Visit: +91 {primaryPhone}</span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-700 hover:text-emerald-800 underline inline-flex items-center gap-1.5"
                >
                  <MessageSquare size={13} />
                  <span>WhatsApp Photo for Quick Ballpark</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS — 4 SIMPLE STEPS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200 font-sans text-left">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-100 px-3.5 py-1 rounded-full">
              Hassle-Free 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              How to Sell Your Old AC in 4 Easy Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Zero hassle, zero wall damage, and maximum cash value with transparent doorstep inspection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group hover:border-blue-500/40 transition-all">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                1
              </span>
              <h3 className="font-extrabold text-base text-slate-900">Call or Send Photos</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Call us at <strong>+91 ${primaryPhone}</strong> or send quick photos of your AC unit on WhatsApp.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group hover:border-blue-500/40 transition-all">
              <span className="w-8 h-8 rounded-full bg-amber-500 text-white font-black text-sm flex items-center justify-center shadow-md">
                2
              </span>
              <h3 className="font-extrabold text-base text-slate-900">Doorstep Inspection</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Our technician visits your home in 30-45 min, inspects the copper condition, and confirms the best fair price.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group hover:border-blue-500/40 transition-all">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                3
              </span>
              <h3 className="font-extrabold text-base text-slate-900">100% Free Dismounting</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Our certified technicians safely dismount the AC from the wall with zero labor charge and zero wall damage.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group hover:border-blue-500/40 transition-all">
              <span className="w-8 h-8 rounded-full bg-purple-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                4
              </span>
              <h3 className="font-extrabold text-base text-slate-900">Instant Spot Payment</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Receive the full agreed payment immediately in Cash or online UPI before the unit leaves your premises.
              </p>
            </div>

          </div>

          {/* Quick CTA Button Row */}
          <div className="text-center pt-4">
            <a
              href={`tel:${primaryPhone}`}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-3.5 rounded-xl text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Phone size={16} />
              <span>Schedule Free Inspection Visit (+91 ${primaryPhone})</span>
            </a>
          </div>

        </div>
      </section>

      {/* LOCAL AREA & SOCIETY COVERAGE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white font-sans text-left">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/20">
              Service Areas Covered
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Societies &amp; Localities We Serve for AC Buyback
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              We provide rapid 30 to 45 minute doorstep inspection and pickup across Greater Noida West, Gaur City, and Noida Extension:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {SOCIETIES_SERVED.map((society, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2.5 hover:border-amber-400/40 transition-colors"
              >
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-slate-200">{society}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-amber-400" />
                <span>Verified Staff &amp; Society Gate Passes</span>
              </span>
              <p className="text-xs text-slate-300 font-medium">
                Our technicians carry official company IDs and uniform for smooth residential gate approval and building security clearance.
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow shrink-0 inline-flex items-center gap-1.5"
            >
              <MessageSquare size={14} />
              <span>Request Gate Pass / Schedule Visit</span>
            </a>
          </div>

        </div>
      </section>

      {/* FAQS SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200 font-sans text-left">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 bg-purple-100 px-3.5 py-1 rounded-full">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions (FAQs)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Clear answers regarding old AC valuation, scrap buyback, inspection policies, and doorstep pickup:
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle size={18} className="text-blue-600 shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    {isOpen ? <ChevronUp size={18} className="text-slate-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION BANNER */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white font-sans text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Get the Best Cash Value for Your Old AC Today
          </h2>
          <p className="text-xs sm:text-base text-blue-100 font-medium max-w-xl mx-auto">
            Doorstep inspection in 30-45 minutes with free wall dismounting and instant spot payment. Call or message us now!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={`tel:${primaryPhone}`}
              className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black px-6 py-3.5 rounded-xl text-sm shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Phone size={18} className="fill-slate-950" />
              <span>Call: +91 ${primaryPhone}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <MessageSquare size={18} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* STICKY BOTTOM ACTION BAR ON MOBILE */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[70] bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl p-2.5 px-3 flex items-center gap-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
        <a 
          href={`tel:${primaryPhone}`}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-3 px-2 rounded-xl shadow-sm text-xs sm:text-sm transition-all"
        >
          <Phone size={16} className="shrink-0" />
          <span>Call Now</span>
        </a>
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-3 px-2 rounded-xl shadow-sm text-xs sm:text-sm transition-all"
        >
          <MessageSquare size={16} className="shrink-0" />
          <span>WhatsApp Price</span>
        </a>
      </div>
    </>
  );
};

export default SellOldAcPage;
