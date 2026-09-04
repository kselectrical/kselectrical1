import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Flame, Wrench, Droplets, Zap, ShieldCheck,
  Settings, Star, Clock,
  CheckCircle2, Wind, MapPin, User
} from 'lucide-react';
import { ServiceGrid } from '../components/ServiceGrid';
import { servicesData } from '../data';
import { getAssetPath } from '../firebase';
import type { TechnicalService, CartItem } from '../types';
import type { BusinessConfig } from '../data';

interface HomePageProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  spellingCorrection?: string | null;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  filteredServices: TechnicalService[];
  cart: Record<string, CartItem>;
  onAddToCart: (service: TechnicalService, brand?: string) => void;
  onRemoveFromCart: (serviceId: string, brand?: string) => void;
  onProceedToCheckout: () => void;
  businessConfig: BusinessConfig;
}

const HERO_REVIEWS = [
  {
    name: 'Rahul Sharma',
    location: 'Gaur City 2, 14th Avenue',
    service: 'AC Repair',
    rating: 5,
    text: 'Technician arrived within 20 minutes and fixed AC cooling perfectly!'
  },
  {
    name: 'Pooja Verma',
    location: 'Noida Extension, Eco Village',
    service: 'Washing Machine Repair',
    rating: 5,
    text: 'Honest diagnosis! Saved me from unnecessary drum replacement costs.'
  },
  {
    name: 'Jitesh Hassani',
    location: 'Gaur City 1, 4th Avenue',
    service: 'MCB & Wiring Upgrade',
    rating: 5,
    text: 'Very professional electrician. Fixed frequent tripping and earth leakages.'
  },
  {
    name: 'Dr. Shalini Mukherji',
    location: 'Sector 4, Greater Noida West',
    service: 'RO Filter Service',
    rating: 5,
    text: 'TDS adjusted from 1200 to 80 PPM. Water tastes fresh and pure now.'
  }
];



const HERO_QUICK_SERVICES = [
  { label: 'AC Repair', icon: <Wind size={18} className="text-cyan-400" />, path: '/services/ac-repair' },
  { label: 'Electrician', icon: <Zap size={18} className="text-yellow-400" />, path: '/services/mcb-upgrade' },
  { label: 'RO Service', icon: <Droplets size={18} className="text-blue-400" />, path: '/services/ro-service' },
  { label: 'Washing Machine', icon: <Wrench size={18} className="text-indigo-400" />, path: '/services/washing-machine-repair' },
  { label: 'Geyser Repair', icon: <Flame size={18} className="text-orange-400" />, path: '/services/geyser-service' },
  { label: 'Kitchen Chimney', icon: <Settings size={18} className="text-amber-400" />, path: '/services/chimney-service' },
  { label: 'Refrigerator', icon: <ShieldCheck size={18} className="text-teal-400" />, path: '/services/refrigerator-repair' },
  { label: 'Fan Repair', icon: <Settings size={18} className="text-emerald-400" />, path: '/services/fan-repair' }
];

export const HomePage: React.FC<HomePageProps> = ({
  searchQuery,
  setSearchQuery,
  spellingCorrection,
  setSelectedCategory,
  filteredServices,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onProceedToCheckout
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleSliderMove = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const container = sliderRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    let clientX: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      if (e.buttons !== 1) return; // only move when mouse button pressed
      clientX = e.clientX;
    }
    const pos = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 0), 100);
    setSliderPosition(pos);
  }, []);

  // Auto rotate customer reviews every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveReviewIdx((prev) => (prev + 1) % HERO_REVIEWS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Matching live search results for autocomplete dropdown
  const searchSuggestions = searchQuery.trim()
    ? servicesData.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  // suppress unused var — used in search dropdown if re-enabled
  void searchSuggestions;

  const categoryCards = [
    {
      title: 'RO Water Purifier',
      titleHindi: 'Pure & Safe Drinking Water',
      image: '/images/services/ro_service.webp',
      path: '/services/ro-service',
      startingPrice: '₹299',
      responseTime: '30 Min',
      desc: 'Complete RO repair, filter replacement, TDS tuning, leak fixing, and new water purifier installation.'
    },
    {
      title: 'Washing Machine',
      titleHindi: 'Laundry & Tub Deep Care',
      image: '/images/services/washing_machine.webp',
      path: '/services/washing-machine-repair',
      startingPrice: '₹349',
      responseTime: '45 Min',
      desc: 'Expert diagnostics for drum spinning failure, extreme vibrations, drain blockages, and tub deep jet cleaning.'
    },
    {
      title: 'Geyser Service',
      titleHindi: 'Instant Heating & Descaling',
      image: '/images/services/geyser.webp',
      path: '/services/geyser-service',
      startingPrice: '₹249',
      responseTime: '30 Min',
      desc: 'Professional geyser thermostat repair, tank leakage sealing, electrical shock checks, and chemical descaling.'
    },
    {
      title: 'AC Services',
      titleHindi: 'Jet Wash & Cooling Care',
      image: '/images/services/ac_service.webp',
      path: '/services/ac-repair',
      startingPrice: '₹399',
      responseTime: '30 Min',
      desc: 'High-pressure AC jet wash, cooling diagnostics, gas leakage welding, and R32/R22 gas refilling.'
    },
    {
      title: 'Refrigerator Repair',
      titleHindi: 'Compressor & Gas Charging',
      image: '/images/services/refrigerator.webp',
      path: '/services/refrigerator-repair',
      startingPrice: '₹299',
      responseTime: '45 Min',
      desc: 'Single & double door fridge repairs, compressor relay replacement, gas charging, and sanitizing deep cleans.'
    },
    {
      title: 'Kitchen Chimney',
      titleHindi: 'Suction & Degreasing Care',
      image: '/images/services/kitchen-chimney-repair-gaur-city.webp',
      path: '/services/chimney-service',
      startingPrice: '₹499',
      responseTime: '60 Min',
      desc: 'Suction power restoration, motor bearing lubrication, and caustic soda chemical filter degreasing.'
    },
    {
      title: 'Microwave Oven',
      titleHindi: 'Heating & Magnetron Care',
      image: '/images/services/microwave-repair-greater-noida.webp',
      path: '/services/microwave-service',
      startingPrice: '₹299',
      responseTime: '30 Min',
      desc: 'Fixing microwave non-heating, internal sparks, synchronous turntable motor failure, and radiation safety checks.'
    },
    {
      title: 'Electrician Services',
      titleHindi: 'Licensed Wiring & Repairs',
      image: '/images/services/electrician.webp',
      path: '/services/mcb-upgrade',
      startingPrice: '₹49',
      responseTime: '25 Min',
      desc: 'Residential wiring tracing, short circuit repair, smart MCB & distribution box upgrade, and inverter service.'
    },
    {
      title: 'Fan Services',
      titleHindi: 'Ceiling & Smart BLDC Fans',
      image: '/images/services/ceiling-fan-repair-greater-noida.webp',
      path: '/services/fan-repair',
      startingPrice: '₹99',
      responseTime: '30 Min',
      desc: 'Installing ceiling fans, decorative designer fans, and smart BLDC fans with remote pairing setup.'
    }
  ];

  const faqs = [
    { q: 'How quickly can a technician visit my home in Greater Noida West?', a: 'We typically assign and dispatch a certified technician within 15 to 30 minutes of booking for GaurCity 1, Gaur City 2, and Noida Extension.' },
    { q: 'Do you use genuine spare parts for repairs?', a: 'Yes, we source only 100% genuine, manufacturer-approved spare parts and provide a transparent bill for all replacements.' },
    { q: 'Is there a warranty on your doorstep services?', a: 'Absolutely. We offer a full 30-day doorstep service warranty. If the same issue recurs within 30 days, we fix it at zero cost.' },
    { q: 'How do I pay for the completed service?', a: 'You can pay securely via UPI, Google Pay, PhonePe, Paytm, Cash, or Credit/Debit Cards after the repair is completed to your satisfaction.' }
  ];

  const filteredFaqs = faqs;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  const activeReview = HERO_REVIEWS[activeReviewIdx];

  return (
    <>
      <Helmet>
        <title>Professional AC Repair, Electrician & Home Services in Greater Noida West | KS Electrical</title>
        <meta name="description" content="Book certified doorstep AC repair, RO service, electrician, washing machine & appliance repair in Greater Noida West, Gaur City 1 & 2, Noida Extension. 15-30 min dispatch, 30-day warranty." />
        <link rel="canonical" href="https://www.kselectrical.in/" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* PREMIUM HERO SECTION */}
      <section className="relative bg-gradient-to-b from-slate-50 to-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Shapes */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-[30%] -z-10 h-[600px] w-[600px] bg-gradient-to-br from-blue-500/5 to-transparent blur-3xl" />
          <div className="absolute bottom-0 right-[20%] -z-10 h-[500px] w-[500px] bg-gradient-to-tr from-orange-400/5 to-transparent blur-3xl" />
          <div className="absolute top-[30%] left-[10%] -z-10 h-[400px] w-[400px] bg-gradient-to-tr from-purple-500/3 to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT SECTION: Content */}
          <div className="lg:col-span-7 space-y-8">
            {/* Premium Badge */}
            <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-primary font-medium">Trusted Home Services Provider</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tighter mb-4">
              Professional Home Services<br/>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Delivered to Your Doorstep
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-gray-600 max-w-2xl">
              Get verified technicians for AC repair, electrical work, appliance service & more.
              Background-checked professionals with genuine parts & 30-day warranty.
            </p>


          </div>

          {/* RIGHT SECTION: Visual */}
          <div className="lg:col-span-5 flex flex-col items-center justify-start gap-4">
            {/* Hero Image */}
            <div className="relative w-full max-w-2xl aspect-video rounded-3xl overflow-hidden shadow-2xl bg-gray-50">
              <img
                src="/hero_technician.webp"
                alt="KS Electrical certified technician servicing home AC unit at customer doorstep"
                className="w-full h-full object-cover transition-transform duration-700"
                loading="eager"
                fetchPriority="high"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-50/80 via-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-white/80 backdrop-blur rounded-lg px-3 py-1.5 shadow-sm">
                <MapPin size={16} className="text-red-500" />
                <span className="text-sm font-medium text-gray-800">Serving Gaur City &amp; Noida Extension</span>
              </div>
            </div>

            {/* Special Offer Badge */}
            <div className="w-full flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md">
              <Flame size={16} className="text-white" />
              <span>Limited Offer: AC Jet Wash + Service from ₹499</span>
            </div>

            {/* Quick Service Chips */}
            <div className="w-full">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Popular Services</p>
              <div className="flex flex-wrap gap-2">
                {HERO_QUICK_SERVICES.map((svc, i) => (
                  <Link
                    key={i}
                    to={svc.path}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 text-xs font-medium hover:border-primary hover:text-primary transition-colors shadow-sm"
                  >
                    {svc.icon}
                    <span>{svc.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Customer Testimonial */}
            <div className="w-full bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <User size={20} className="text-gray-500" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-gray-900 text-sm">{activeReview.name}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>{activeReview.location}</span>
                    <span>•</span>
                    <span>{activeReview.service}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: activeReview.rating }).map((_, i) => (
                        <Star key={i} size={10} className="text-amber-400 fill-amber-400" />
                      ))}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic text-sm">"{activeReview.text}"</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                <CheckCircle2 size={13} className="text-green-500" />
                <span>Verified Buyer • Service Completed Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOUNDER & CHIEF TECHNICIAN GUARANTEE BANNER */}
        <div className="mt-8 sm:mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 text-white rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden group">
            {/* Subtle glowing ambient accent */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              {/* Left: Owner Profile Photo & Information */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5 shrink-0">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full border-2 border-brand-orange p-0.5 shadow-lg bg-slate-800 overflow-hidden">
                    <img
                      src={getAssetPath('/profile.webp')}
                      alt="Kaushindra Singh - Founder & Chief Technician KS Electrical"
                      className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getAssetPath('/log.webp');
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-slate-950 shadow-md" title="Verified Owner">
                    <CheckCircle2 size={14} className="fill-emerald-500 text-white" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="bg-brand-orange/20 text-brand-orange border border-brand-orange/30 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                      Founder &amp; Chief Technician Guarantee
                    </span>
                  </div>
                  <h3 className="text-white font-black text-xl sm:text-2xl tracking-tight">
                    Kaushindra Singh
                  </h3>
                  <p className="text-amber-400 font-extrabold text-xs sm:text-sm tracking-wide">
                    Founder &amp; Chief Technician
                  </p>
                  <p className="text-slate-400 text-xs font-semibold">
                    KS Electrical &amp; AC Services • Gaur City &amp; Noida Extension
                  </p>
                </div>
              </div>

              {/* Middle: Owner Guarantee Quote */}
              <div className="flex-1 max-w-2xl text-center md:text-left bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl">
                <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed italic">
                  "I personally guarantee 100% upfront pricing, genuine factory spare parts, and technician dispatch within 30 minutes in Gaur City &amp; Noida Extension — backed by our 30-Day Money-Back Warranty Cover."
                </p>
              </div>

              {/* Right: 3 Guarantee Pills */}
              <div className="flex flex-wrap md:flex-col items-center sm:items-start justify-center gap-2 shrink-0">
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-extrabold">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>30-Day Warranty</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3 py-1.5 rounded-full text-xs font-extrabold">
                  <Clock size={14} className="text-blue-400" />
                  <span>30-Min Dispatch</span>
                </div>
                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1.5 rounded-full text-xs font-extrabold">
                  <ShieldCheck size={14} className="text-amber-400" />
                  <span>100% Honest Rates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US — 4 PREMIUM TRUST CARDS */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 select-none">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[10px] text-orange-600 bg-orange-500/10 border border-orange-500/20 px-3.5 py-1.5 rounded-full font-black uppercase tracking-widest">
              Standard Operating Principles
            </span>
            <h2 className="text-slate-900 font-black text-2xl sm:text-3xl tracking-tight">
              Why Homeowners Trust KS Electrical & AC Services
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed">
              Every job is executed by trained local engineers following strict safety and transparent billing guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 hover:border-blue-500/30 hover:bg-blue-50/20 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-brand-blue flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
                👨‍🔧
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Background-Verified Technicians</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Dispatched from our local Greater Noida hub in full uniform with digital identity verification.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 hover:border-emerald-500/30 hover:bg-emerald-50/20 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
                ⚙️
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">100% Genuine OEM Spare Parts</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                We install only original factory capacitors, relays, copper coils, and brand-approved components.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 hover:border-orange-500/30 hover:bg-orange-50/20 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-brand-orange flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
                🏷️
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Transparent Upfront Pricing</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Fixed rate card handed over before work starts. Zero surprise charges or extra estimates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 hover:border-purple-500/30 hover:bg-purple-50/20 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
                🛡️
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">30-Day Doorstep Warranty</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Every repair and component replacement is fully guaranteed for 30 days post-service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Category Section */}
      <section className="bg-[#f8f9fa] py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10">

          {searchQuery ? (
            <div className="space-y-6 text-left">
              <div>
                <h2 className="text-slate-900 font-black text-2xl tracking-tight">Search Results ({filteredServices.length})</h2>
                <p className="text-xs text-slate-500 font-semibold mt-1">Showing matches for "{searchQuery}"</p>

                {spellingCorrection && (
                  <p className="text-xs font-bold text-slate-600 mt-2">
                    Did you mean:{" "}
                    <button
                      onClick={() => setSearchQuery(spellingCorrection)}
                      className="text-brand-orange hover:text-brand-orange-dark underline font-extrabold focus:outline-none cursor-pointer"
                    >
                      {spellingCorrection}
                    </button>
                    ?
                  </p>
                )}
              </div>

              {filteredServices.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto">
                  <p className="text-slate-700 font-extrabold text-sm">No services found matching your criteria.</p>
                  <p className="text-slate-500 text-xs">
                    Explore our popular service categories below:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {['AC Repair', 'Washing Machine Repair', 'Electrician', 'RO Service'].map((pop) => (
                      <button
                        key={pop}
                        onClick={() => setSearchQuery(pop)}
                        className="btn-chip"
                      >
                        {pop}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <ServiceGrid
                  services={filteredServices}
                  selectedCategory="ALL"
                  cart={cart}
                  onAddToCart={onAddToCart}
                  onRemoveFromCart={onRemoveFromCart}
                  onProceedToCheckout={onProceedToCheckout}
                />
              )}
            </div>
          ) : (
            <>
              {/* Category Header */}
              <div className="text-center space-y-2">
                <span className="text-[10px] text-blue-600 bg-blue-600/10 border border-blue-600/20 px-3.5 py-1.5 rounded-full font-black uppercase tracking-widest">
                  Certified Specialties
                </span>
                <h2 className="text-slate-900 font-black text-2xl sm:text-3xl tracking-tight">
                  Browse Doorstep Services By Category
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed">
                  Select a service category to view upfront rate cards and book your local technician.
                </p>
              </div>

              {/* Category Cards with Small Photo Thumbnails */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between text-left relative overflow-hidden group hover:border-blue-500/40 hover:shadow-lg transition-all"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        {/* Small Photo Thumbnail in place of SVG icon */}
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-xs overflow-hidden shrink-0">
                          <img
                            src={getAssetPath(card.image)}
                            alt={card.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = getAssetPath('/hero_technician.webp');
                            }}
                          />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 select-none">
                          {card.responseTime} Dispatch
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <h3 className="text-slate-900 font-black text-lg sm:text-xl">{card.title}</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wide leading-relaxed pb-0.5">{card.titleHindi}</p>
                      </div>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed pt-2 border-t border-slate-100 line-clamp-3">
                        {card.desc}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="block text-[9px] text-slate-400 font-black uppercase tracking-wider">Starting From</span>
                        <span className="block text-slate-900 font-black text-base mt-0.5">{card.startingPrice}</span>
                      </div>
                      <Link
                        to={card.path}
                        onClick={() => setSelectedCategory(card.title)}
                        className="btn-cta text-xs px-4 py-2.5"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )
        }
        </div>
      </section>

      {/* Before / After Slider Section */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 select-none">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 text-left space-y-4">
            <span className="text-[10px] text-blue-600 bg-blue-600/10 border border-blue-600/20 px-3.5 py-1.5 rounded-full font-black uppercase tracking-widest">
              Visual Quality Standard
            </span>
            <h2 className="text-slate-900 font-black text-2xl sm:text-3xl tracking-tight leading-tight">
              Deep Cleaning & Jet Wash Difference
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed">
              Drag the interactive slider to see the difference between a clogged, non-cooling AC coil and a deep-cleaned, pressure jet washed coil by KS Electrical.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-700 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
              <span>Restores 100% cooling & cuts power consumption up to 20%.</span>
            </div>
          </div>

          <div className="lg:col-span-7 flex justify-center">
            <div
              ref={sliderRef}
              className="relative w-full max-w-xl aspect-[16/10] rounded-3xl overflow-hidden border border-slate-300 shadow-2xl cursor-ew-resize select-none touch-none"
              onMouseMove={handleSliderMove}
              onTouchStart={handleSliderMove}
              onTouchMove={handleSliderMove}
            >
              {/* Before Image */}
              <img
                src="/ac_service_pro.webp"
                alt="Dirty split AC indoor unit filter clogged with dust before wet pressure jet wash service"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover select-none"
              />

              {/* After Image */}
              <div
                className="absolute inset-y-0 right-0 overflow-hidden select-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <img
                  src="/ro_service_pro.webp"
                  alt="Clean AC indoor cooling coil after deep jet wash service by KS Electrical"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover select-none"
                  style={{ width: '100%', maxWidth: 'none', transform: `translateX(-${sliderPosition}%)` }}
                />
              </div>

              {/* Slider Line */}
              <div
                className="absolute inset-y-0 w-1 bg-white shadow-xl pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-slate-300 shadow-md flex items-center justify-center pointer-events-none">
                  <span className="text-slate-500 text-xs font-black select-none">↔</span>
                </div>
              </div>

              {/* Labels */}
              <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md pointer-events-none">BEFORE</div>
              <div className="absolute top-3 right-3 bg-emerald-600/80 text-white text-[10px] font-bold px-2 py-1 rounded-md pointer-events-none">AFTER</div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-[#f8f9fa] py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[10px] text-blue-600 bg-blue-600/10 border border-blue-600/20 px-3.5 py-1.5 rounded-full font-black uppercase tracking-widest">
              Fast Execution Path
            </span>
            <h2 className="text-slate-900 font-black text-2xl sm:text-3xl tracking-tight">
              Simple 6-Step Booking to Service Execution
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed">
              Book a verified technician in less than 30 seconds with complete transparency.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 select-none">
            {[
              { step: '01', title: 'Book Service', desc: 'Select menu & submit phone.' },
              { step: '02', title: 'Tech Assigned', desc: 'Matched within 15 Min.' },
              { step: '03', title: 'Home Visit', desc: 'Technician arrives on time.' },
              { step: '04', title: 'Diagnostic Fix', desc: 'Transparent rate & fix.' },
              { step: '05', title: 'Easy Payment', desc: 'UPI, Cash or Card.' },
              { step: '06', title: '30-Day Cover', desc: 'Warranty active instantly.' }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-4 text-left flex flex-col justify-between h-36 hover:border-blue-500/30 transition-all shadow-xs"
              >
                <div className="text-brand-orange font-black text-base">{item.step}</div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900 leading-tight">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-normal mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-4xl mx-auto space-y-8 text-left">
          <div className="text-center space-y-2">
            <span className="text-[10px] text-orange-600 bg-orange-500/10 border border-orange-500/20 px-3.5 py-1.5 rounded-full font-black uppercase tracking-widest">
              Help Center
            </span>
            <h2 className="text-slate-900 font-black text-2xl sm:text-3xl tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed">
              Find quick answers to common questions about our doorstep repair services.
            </p>
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="border border-slate-200 rounded-2xl bg-slate-50/70 overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-slate-900 text-xs sm:text-sm flex items-center justify-between cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-slate-400 text-xs font-black">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-600 font-medium leading-relaxed border-t border-slate-200/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;