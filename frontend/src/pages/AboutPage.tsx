import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Shield, 
  ShieldCheck, 
  Heart, 
  Phone, 
  MapPin, 
  Wrench, 
  Sparkles, 
  UserCheck, 
  Zap, 
  CheckCircle2, 
  Lock, 
  Star
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const AboutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'story' | 'services' | 'process' | 'areas' | 'why'>('story');

  const stats = [
    { label: 'Happy Customers Serviced', value: '10,000+' },
    { label: 'Verified Service Pros', value: '100%' },
    { label: 'Completed Doorstep Jobs', value: '15,000+' },
    { label: 'Average Customer Rating', value: '4.9 ★' },
  ];

  const valueCards = [
    {
      icon: <ShieldCheck size={28} className="text-brand-blue" />,
      title: 'Certified & Verified Experts',
      desc: 'Every single technician in the KS team undergoes rigorous technical assessments, practical examinations, and background verifications. We only dispatch specialists certified for your specific job.',
      color: 'bg-blue-50 border-blue-100'
    },
    {
      icon: <Shield size={28} className="text-emerald-600" />,
      title: '100% Upfront Transparent Billing',
      desc: 'Say goodbye to hidden fees and sudden surcharges. We share clear itemized price configurations before starting any repair work, using Vyapar-style billing and invoice generation.',
      color: 'bg-emerald-50 border-emerald-100'
    },
    {
      icon: <Heart size={28} className="text-red-500" />,
      title: '30-Day Hassle-Free Warranty',
      desc: 'All repairs, installations, and maintenance works come with a comprehensive 30-day warranty program. If the same issue crops up within 30 days, we fix it absolutely free of charge.',
      color: 'bg-red-50 border-red-100'
    }
  ];

  const serviceCategories = [
    {
      title: 'Air Conditioning Services (AC Services & Rental)',
      items: [
        'Split & Window AC Installation & Mounting with precision alignment.',
        'Safe AC Uninstallation and copper pipe sealing for relocation.',
        'High-Pressure Jet Washing & deep coil foaming service to restore cooling efficiency.',
        'AC Gas Refill and Leakage Repair (R32, R410a, R22) with electronic leak detectors.',
        'Split & Window AC Rental program with flexible leasing plans in Gaur City & Noida Extension.'
      ],
      icon: <Zap className="text-brand-orange" size={20} />
    },
    {
      title: 'Electrical Diagnostics & Maintenance',
      items: [
        'Ceiling Fan & BLDC Smart Fan Installation and speed alignment.',
        'Fancy Lights, Panel Lights, Chandeliers, and Wall Sconce mounting.',
        'Main Switchboard, MCB, and Distribution Box (DB) upgrades to prevent short circuits.',
        'Doorbell and smart home camera repair and installation.',
        'Inverter battery water topping, charging checkup, and home backup setup.'
      ],
      icon: <Zap className="text-brand-orange" size={20} />
    },
    {
      title: 'RO Water Purifier Services',
      items: [
        'Multi-stage RO Filter and Membrane replacement (Sediment, Carbon, RO Membrane).',
        'Water testing (TDS alignment, pH balance, and flow rate calibration).',
        'Automatic cut-off valve repair, booster pump check, and adapter replacement.',
        'Leaking pipe connector repair and deep chamber sanitization.'
      ],
      icon: <Zap className="text-brand-orange" size={20} />
    },
    {
      title: 'Home Appliances & Auxiliary Services',
      items: [
        'Washing Machine (Front Load/Top Load) drum descaling, drain repair, and vibration reduction.',
        'Single & Double Door Refrigerator gas charging, compressor relay swap, and defrost diagnostics.',
        'Microwave Oven heating coil swap, turntable motor repairs, and radiation checks.',
        'Kitchen Chimney caustic soda boil-wash filter degreasing and suction tuning.',
        'Balcony Pigeon Net Installation using high-strength UV-stabilized HDPE nylon nets.'
      ],
      icon: <Zap className="text-brand-orange" size={20} />
    }
  ];

  const steps = [
    {
      num: '01',
      title: 'Online Slot Booking',
      desc: 'Choose your desired service, pick a date & time slot that fits your schedule, and complete booking instantly through our Firestore-synced customer dashboard.'
    },
    {
      num: '02',
      title: 'Technician Assignment',
      desc: 'Our dispatch system matches your request with the closest certified expert technician in your area (e.g. Gaur City or Noida Extension) to ensure under-30-min response.'
    },
    {
      num: '03',
      title: 'Doorstep Diagnostics',
      desc: 'The technician arrives in full safety gear, diagnoses the issue using professional tools (multimeters, pressure gauges), and provides an itemized cost estimate.'
    },
    {
      num: '04',
      title: 'Precision Repair & QC',
      desc: 'Upon your approval, the technician completes the repair using 100% genuine spare parts, performs a Quality Control test, and cleans up the work area.'
    },
    {
      num: '05',
      title: 'Invoice & Warranty Active',
      desc: 'Pay securely online or offline. A Vyapar-style GST invoice is generated instantly and emailed to you. Your 30-Day official service warranty is activated immediately.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - KS Electrical & AC Services | Gaur City & Noida Extension</title>
        <meta name="description" content="Discover the story of KS Electrical & AC Services. Serving Gaur City, Noida Extension, Greater Noida West, and Ghaziabad with certified technicians, transparent billing, and 30-day warranty. Read about our mission, history, and comprehensive home services." />
        <link rel="canonical" href="https://www.kselectrical.in/about" />
      </Helmet>

      <Breadcrumbs items={[{ label: 'About Us' }]} />

      <section className="bg-white text-left font-sans leading-relaxed">
        
        {/* Hero Banner Section */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-brand-blue text-white overflow-hidden py-20 px-6 sm:px-12 text-center lg:text-left">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent opacity-70 pointer-events-none"></div>
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/20 text-brand-orange border border-brand-orange/30 rounded-full text-xs font-extrabold uppercase tracking-widest">
                <Sparkles size={12} className="animate-pulse" /> Established 2021
              </span>
              <h1 className="text-white font-black text-3xl sm:text-5xl tracking-tight leading-tight">
                Empowering Gaur City & Noida Extension with Trusted Doorstep Services
              </h1>
              <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed max-w-2xl">
                For over 5 years, KS Electrical & AC Services has been redefining home maintenance. We bridge the gap between unorganized local labor and expensive agency costs by deploying verified, certified service technicians with 100% upfront transparent pricing.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
                <a 
                  href="tel:+917895321472" 
                  className="px-6 py-3 bg-brand-orange hover:bg-brand-orange-dark text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-lg shadow-orange-500/20 hover:scale-[1.02] flex items-center gap-2"
                >
                  <Phone size={14} fill="currentColor" /> Call Booking Desk
                </a>
                <a 
                  href="/services" 
                  className="px-6 py-3 bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200"
                >
                  Explore Services
                </a>
              </div>
            </div>
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-center space-y-2">
                  <span className="text-2xl sm:text-3xl font-black text-brand-orange block">{stat.value}</span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider block leading-tight">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="sticky top-[72px] z-30 bg-slate-50 border-y border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 overflow-x-auto scrollbar-none flex space-x-1 sm:space-x-2 py-3">
            {([
              { id: 'story', label: 'Our Story & Mission' },
              { id: 'services', label: 'Detailed Services' },
              { id: 'process', label: 'How We Work' },
              { id: 'areas', label: 'Service Coverage Areas' },
              { id: 'why', label: 'The KS Advantage' }
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 whitespace-nowrap select-none cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-brand-blue text-white shadow-button'
                    : 'text-slate-600 hover:text-slate-900 bg-transparent hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Contents Container */}
        <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">
          
          {/* TAB 1: OUR STORY & MISSION */}
          {activeTab === 'story' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-gray-900 font-black text-2xl sm:text-3xl tracking-tight">
                    The Story of KS Electrical & AC Services
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    It all began in early 2021. Noida Extension (Greater Noida West) was developing at an unprecedented rate, with tens of thousands of families moving into newly constructed high-rise apartments in Gaur City 1, Gaur City 2, Crossing Republik, and nearby sectors. However, the region faced a massive challenge: <strong>a complete lack of reliable, professional home maintenance experts.</strong>
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Locating a local electrician, AC repair technician, or plumber involved roaming through sector markets, bargaining over arbitrary prices, and dealing with unsafe, unverified workers who vanished if the repair broke down the next day.
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Seeing this struggle, our founder started KS Electrical & AC Services. The vision was simple: <strong>provide transparent, safe, and professional technician services directly to apartment doorsteps at fixed, fair prices.</strong> Starting with a small team of just two technicians, we have grown into a network of over 25+ background-verified professionals serving Gaur City and Greater Noida West, backed by custom digital booking and automated invoicing.
                  </p>
                </div>
                <div className="bg-gradient-to-tr from-brand-blue to-indigo-800 p-8 rounded-3xl text-white space-y-6 relative overflow-hidden shadow-dropdown">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl transform translate-x-12 -translate-y-12"></div>
                  <h3 className="font-extrabold text-lg sm:text-xl">Our Brand Promise</h3>
                  <div className="space-y-4 text-xs sm:text-sm font-medium">
                    <div className="flex gap-3">
                      <CheckCircle2 size={18} className="text-brand-orange shrink-0" />
                      <span><strong>Always Safe:</strong> Every staff member is verified by police records.</span>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle2 size={18} className="text-brand-orange shrink-0" />
                      <span><strong>Always Fair:</strong> Real upfront quotes. No random surcharges.</span>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle2 size={18} className="text-brand-orange shrink-0" />
                      <span><strong>Always Accountable:</strong> Full 30-Day official warranty on jobs.</span>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle2 size={18} className="text-brand-orange shrink-0" />
                      <span><strong>Always Digital:</strong> Paperless booking updates, digital billing.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Core Values Section */}
              <div className="space-y-6 pt-6">
                <h3 className="text-gray-900 font-extrabold text-xl text-center md:text-left">
                  Our Non-Negotiable Core Values
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {valueCards.map((card, idx) => (
                    <div key={idx} className={`p-6 rounded-2xl border ${card.color} space-y-4 shadow-sm`}>
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        {card.icon}
                      </div>
                      <h4 className="font-black text-sm text-gray-900">{card.title}</h4>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">{card.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED SERVICES DESCRIPTION */}
          {activeTab === 'services' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <div className="space-y-4 text-center md:text-left">
                <h2 className="text-gray-900 font-black text-2xl sm:text-3xl tracking-tight">
                  Comprehensive Home Maintenance Portfolio
                </h2>
                <p className="text-gray-500 text-sm max-w-2xl">
                  We are a dual-licensed provider of high-grade home repair utilities. From light bulb swaps to heavy split AC gas charging and water filtration membrane configuration, we cover it all.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {serviceCategories.map((cat, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-2xl space-y-4">
                    <h3 className="text-gray-900 font-extrabold text-base flex items-center gap-2.5 border-b border-slate-200 pb-3">
                      {cat.icon}
                      <span>{cat.title}</span>
                    </h3>
                    <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                      {cat.items.map((item, iIdx) => (
                        <li key={iIdx} className="flex gap-2 items-start">
                          <span className="w-1.5 h-1.5 bg-brand-orange rounded-full mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: OUR WORK PROCESS */}
          {activeTab === 'process' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <div className="space-y-4 text-center md:text-left">
                <h2 className="text-gray-900 font-black text-2xl sm:text-3xl tracking-tight">
                  How We Ensure High-Quality Execution
                </h2>
                <p className="text-gray-500 text-sm max-w-2xl">
                  We follow a standardized, modern procedure for every service request. Our technical workflow prevents communication gaps, hidden charges, and poor repair jobs.
                </p>
              </div>

              <div className="relative pl-6 border-l-2 border-slate-200 space-y-10 ml-4 max-w-3xl">
                {steps.map((step, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-11 top-0 w-8 h-8 rounded-full bg-brand-blue border-4 border-white text-white font-extrabold text-xs flex items-center justify-center shadow-md">
                      {step.num}
                    </span>
                    <div className="space-y-1">
                      <h3 className="text-gray-900 font-black text-sm uppercase tracking-wider">{step.title}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm font-medium leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AREAS WE SERVE */}
          {activeTab === 'areas' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <div className="space-y-4 text-center md:text-left">
                <h2 className="text-gray-900 font-black text-2xl sm:text-3xl tracking-tight">
                  Service Coverage & Regional Locations
                </h2>
                <p className="text-gray-500 text-sm max-w-2xl">
                  KS Electrical & AC Services operates fully in Noida Extension, Gaur City, Greater Noida West, and Ghaziabad. We guarantee under-30-minute technician dispatch in all major townships.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Location Card 1 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <MapPin className="text-brand-orange shrink-0" size={20} />
                    <h3 className="text-gray-900 font-black text-sm uppercase tracking-wider">Gaur City 1 & 2</h3>
                  </div>
                  <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                    Full service availability across all residential phases and commercial zones:
                  </p>
                  <ul className="text-[11px] text-gray-600 font-medium grid grid-cols-2 gap-2">
                    <li>1st Avenue</li>
                    <li>4th Avenue</li>
                    <li>5th Avenue</li>
                    <li>6th Avenue</li>
                    <li>10th Avenue</li>
                    <li>11th Avenue</li>
                    <li>12th Avenue</li>
                    <li>14th Avenue</li>
                    <li>Gaur Sportswood</li>
                    <li>Gaur City Center</li>
                  </ul>
                </div>

                {/* Location Card 2 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <MapPin className="text-brand-orange shrink-0" size={20} />
                    <h3 className="text-gray-900 font-black text-sm uppercase tracking-wider">Noida Extension</h3>
                  </div>
                  <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                    Immediate technician dispatch covering all major housing societies and sectors:
                  </p>
                  <ul className="text-[11px] text-gray-600 font-medium grid grid-cols-2 gap-2">
                    <li>Sector 1</li>
                    <li>Sector 2</li>
                    <li>Sector 4</li>
                    <li>Sector 16B</li>
                    <li>Eco Village 1</li>
                    <li>Eco Village 2</li>
                    <li>Eco Village 3</li>
                    <li>Cherry County</li>
                    <li>Nirala Estate</li>
                    <li>Panchsheel Greens</li>
                  </ul>
                </div>

                {/* Location Card 3 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <MapPin className="text-brand-orange shrink-0" size={20} />
                    <h3 className="text-gray-900 font-black text-sm uppercase tracking-wider">Ghaziabad West</h3>
                  </div>
                  <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                    Extending our quick doorstep services to adjacent communities and sectors:
                  </p>
                  <ul className="text-[11px] text-gray-600 font-medium grid grid-cols-2 gap-2">
                    <li>Crossing Republik</li>
                    <li>Pratap Vihar</li>
                    <li>Siddharth Vihar</li>
                    <li>Gaur City Mall Area</li>
                    <li>Shahberi</li>
                    <li>Noida Sector 121</li>
                    <li>Noida Sector 122</li>
                    <li>Noida Sector 119</li>
                  </ul>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: THE KS ADVANTAGE */}
          {activeTab === 'why' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <div className="space-y-4 text-center md:text-left">
                <h2 className="text-gray-900 font-black text-2xl sm:text-3xl tracking-tight">
                  Why Customers Choose Us Over Others
                </h2>
                <p className="text-gray-500 text-sm max-w-2xl">
                  We are not just a booking portal. We take full responsibility for the quality of the service, from start to finish.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0 shadow-sm">
                      <UserCheck size={20} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-sm text-gray-900">Direct Responsibility</h3>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">
                        Unlike aggregators, we are a direct service company. Our technician staff is accountable to our strict quality code. If something goes wrong, we resolve it within 24 hours.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center shrink-0 shadow-sm">
                      <Wrench size={20} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-sm text-gray-900">100% Genuine Spare Parts</h3>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">
                        Whether it is an AC compressor relay, water filter membrane, or copper pipes, we only use genuine parts from authorized distributors.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                      <Lock size={20} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-sm text-gray-900">Advanced Safety Standards</h3>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">
                        Safety is our top priority. Our staff utilizes insulated gloves, safety goggles, and advanced testers (like digital clamp meters) to verify wiring safety before starting work.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl space-y-6 text-center shadow-sm">
                  <Star size={44} fill="#F97316" className="text-brand-orange mx-auto animate-pulse" />
                  <div className="space-y-2">
                    <span className="text-2xl font-black text-slate-800">Average 4.9 Star Rating</span>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Reviewed by over 1,200 verified homeowners in Gaur City 1, Gaur City 2, Crossing Republik, and Noida Extension.
                    </p>
                  </div>
                  <div className="border-t border-slate-200 pt-6">
                    <a 
                      href="/reviews" 
                      className="inline-block text-xs font-black text-brand-blue hover:text-brand-blue-dark uppercase tracking-wider underline hover:no-underline"
                    >
                      Read verified customer reviews &rarr;
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Detailed SEO Location Block - Keyword rich footer for local SEO mapping */}
        <div className="bg-slate-50 border-t border-slate-200 py-16 px-6 sm:px-12">
          <div className="max-w-6xl mx-auto space-y-8 text-xs sm:text-sm text-slate-500 font-medium">
            <h3 className="text-slate-800 font-black text-sm uppercase tracking-wider">
              Local SEO Citations & Covered Apartment Complexes
            </h3>
            <p className="leading-relaxed">
              Our technicians regularly visit major residential complexes in the Noida Extension region for prompt support. We serve homeowners and tenants in 
              <strong> Gaur City 1</strong> (1st Avenue, 2nd Avenue, 3rd Avenue, 4th Avenue, 5th Avenue, 6th Avenue, Gaur City Center, Galaxy Plaza), 
              <strong> Gaur City 2</strong> (10th Avenue, 11th Avenue, 12th Avenue, 14th Avenue, 16th Avenue, 14th Avenue Highrise, Gaur City Galleria), 
              <strong> Crossing Republik</strong> (Gaur Global Village, Panchsheel Wellington, Saviour Greenisle, GH.7, Supertech Livingston), 
              <strong> Greater Noida West</strong> (Eco Village 1, Eco Village 2, Eco Village 3, Cherry County, Nirala Estate, Patwari, La Galleria, Spring Elmas, Panchsheel Greens, Apex Golf Avenue, Stellar Jeevan, Palm Olympia, Express Astra), and surrounding communities.
            </p>
            <p className="leading-relaxed">
              If you search for <em>"Electrician near me in Gaur City"</em>, <em>"AC repair in Noida Extension"</em>, <em>"Water purifier RO service in Greater Noida West"</em>, <em>"Washing machine repair in Gaur City 2"</em>, <em>"Chimney cleaning service in Noida Extension"</em>, or <em>"Split AC on rent in Noida Extension"</em>, our doorstep services are designed to match your expectations with swift dispatch, licensed technicians, and transparent billing.
            </p>
          </div>
        </div>

      </section>
    </>
  );
};
