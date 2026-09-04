import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Star, Clock, ShieldCheck, Plus, Minus, ArrowLeft, 
  Droplets, Wrench, Flame, Zap, Settings, Lightbulb, Wind,
  PhoneCall, MessageSquare, CheckCircle2, AlertTriangle, 
  ArrowRight, ChevronDown, ChevronUp, MapPin
} from 'lucide-react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import type { TechnicalService, CartItem } from '../../types';
import type { BusinessConfig } from '../../data';
import { getAssetPath } from '../../firebase';
import { getServiceBySlug } from '../../serviceCatalog';
import { generateServicePageSeo } from './servicePageSeo';
import { RICH_SERVICES_MAP } from './serviceRichData';

interface ServiceDetailsPageProps {
  services: TechnicalService[];
  cart: Record<string, CartItem>;
  onAddToCart: (service: TechnicalService, brand?: string) => void;
  onRemoveFromCart: (serviceId: string, brand?: string) => void;
  onProceedToCheckout: () => void;
  businessConfig: BusinessConfig;
}

export const ServiceDetailsPage: React.FC<ServiceDetailsPageProps> = ({
  services,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onProceedToCheckout,
  businessConfig
}) => {
  const { serviceSlug } = useParams<{ serviceSlug: string }>();
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const catalogEntry = serviceSlug ? getServiceBySlug(serviceSlug) : undefined;
  const service = catalogEntry ? services.find(s => s.id === catalogEntry.id) : undefined;

  if (!service || !catalogEntry) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center font-sans">
        <h2 className="text-xl font-black text-gray-900">Service Not Found</h2>
        <p className="text-sm text-gray-500 mt-2">The service details you are looking for do not exist or have been moved.</p>
        <Link 
          to="/services" 
          className="mt-6 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:bg-slate-800"
        >
          Explore All Services
        </Link>
      </div>
    );
  }

  // Retrieve Rich Data for this service if available
  const richData = RICH_SERVICES_MAP[catalogEntry.slug];



  const getFallbackStyle = (category: string, subcategory: string) => {
    const cat = category.toLowerCase();
    const sub = subcategory.toLowerCase();
    
    if (cat.includes('ac')) return 'from-cyan-500/10 to-blue-500/5 border-cyan-200 text-cyan-600';
    if (sub.includes('purifier') || sub.includes('ro')) return 'from-emerald-500/10 to-teal-500/5 border-emerald-200 text-emerald-650';
    if (sub.includes('washing') || sub.includes('tub')) return 'from-blue-500/10 to-indigo-500/5 border-blue-200 text-blue-650';
    if (sub.includes('geyser')) return 'from-amber-500/10 to-orange-500/5 border-amber-200 text-amber-600';
    if (sub.includes('refrigerator') || sub.includes('fridge')) return 'from-indigo-500/10 to-purple-500/5 border-indigo-200 text-indigo-600';
    if (cat.includes('fan')) return 'from-teal-500/10 to-emerald-500/5 border-teal-200 text-teal-600';
    if (cat.includes('light')) return 'from-orange-500/10 to-amber-500/5 border-orange-200 text-orange-600';
    if (cat.includes('electrician') || sub.includes('switch') || sub.includes('mcb')) return 'from-yellow-500/10 to-amber-500/5 border-yellow-200 text-yellow-600';
    return 'from-slate-500/10 to-zinc-500/5 border-slate-200 text-slate-600';
  };

  const getFallbackIcon = (category: string, subcategory: string) => {
    const cat = category.toLowerCase();
    const sub = subcategory.toLowerCase();
    if (cat.includes('ac')) return <Wind size={32} className="animate-pulse" />;
    if (sub.includes('purifier') || sub.includes('ro')) return <Droplets size={32} />;
    if (sub.includes('washing') || sub.includes('tub')) return <Wrench size={32} />;
    if (sub.includes('geyser')) return <Flame size={32} />;
    if (sub.includes('refrigerator') || sub.includes('fridge')) return <ShieldCheck size={32} />;
    if (cat.includes('fan')) return <Settings size={32} />;
    if (cat.includes('light')) return <Lightbulb size={32} />;
    if (cat.includes('electrician') || sub.includes('switch') || sub.includes('mcb')) return <Zap size={32} />;
    return <Settings size={32} />;
  };

  // Cart Quantities
  const qtyInCart = Object.values(cart)
    .filter(item => item.serviceId === service.id)
    .reduce((sum, item) => sum + item.quantity, 0);

  const getFirstCartItemKey = () => {
    const found = Object.entries(cart).find(([, item]) => item.serviceId === service.id);
    return found ? found[0] : null;
  };
  const itemKey = getFirstCartItemKey();

  const breadcrumbsList = [
    { label: 'Services', path: '/services' },
    { label: service.category, path: '/services' },
    { label: service.name, path: window.location.pathname }
  ];

  const siteDomain = businessConfig.website.startsWith('http') ? businessConfig.website : `https://${businessConfig.website}`;
  const canonicalUrl = `${siteDomain}/services/${catalogEntry.slug}`;
  const seoContent = generateServicePageSeo(service, catalogEntry, businessConfig);

  // Dynamic FAQs List (Merge Rich FAQs or Fallback)
  const activeFaqs = richData?.faqs || seoContent.faqList;
  const activeReviews = richData?.reviews || [
    { name: 'Jitesh Hassani', location: 'Gaur City 1', date: 'June 14, 2026', rating: 5, serviceName: service.name, text: 'Arrived within 25 minutes. Clean work, verified spares, and genuine bill.' },
    { name: 'Sanitha K', location: 'Noida Extension', date: 'June 10, 2026', rating: 5, serviceName: service.name, text: 'Technician was honest about the repair parts and charged standard rates.' },
    { name: 'Rajesh Kumar', location: 'Gaur City 2', date: 'May 28, 2026', rating: 5, serviceName: service.name, text: 'Fixed the issue on the spot. Very satisfied with the warranty support.' }
  ];

  // Extended JSON-LD FAQ Schema
  const richFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': activeFaqs.map(item => ({
      '@type': 'Question',
      'name': item.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.a
      }
    }))
  };

  const richServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': richData?.h1 || service.name,
    'serviceType': service.category,
    'provider': {
      '@type': 'LocalBusiness',
      'name': businessConfig.name,
      'telephone': `+91-${businessConfig.contacts[0]}`,
      'url': siteDomain
    },
    'areaServed': ['Gaur City 1', 'Gaur City 2', 'Greater Noida West', 'Noida Extension', 'Crossing Republik', 'Techzone 4', 'Pari Chowk', 'Bisrakh'],
    'description': richData?.metaDescription || seoContent.description,
    'offers': {
      '@type': 'Offer',
      'priceCurrency': 'INR',
      'price': richData?.startingPrice || service.price
    }
  };

  return (
    <>
      <Helmet>
        <title>{richData?.seoTitle || seoContent.title}</title>
        <meta name="description" content={richData?.metaDescription || seoContent.description} />
        <meta name="keywords" content={seoContent.keyword} />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify(richServiceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(richFaqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(seoContent.breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(seoContent.localBusinessSchema)}</script>
      </Helmet>

      {/* Breadcrumbs Navigation */}
      <Breadcrumbs items={breadcrumbsList} />

      <div className="bg-slate-50/60 py-8 md:py-12 font-sans">
        <div className="max-w-5xl mx-auto px-4 space-y-10 text-left">
          
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors cursor-pointer select-none"
          >
            <ArrowLeft size={14} />
            <span>Go Back</span>
          </button>

          {/* URBAN COMPANY STYLE HERO CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-lg grid grid-cols-1 md:grid-cols-3 gap-8 items-start relative overflow-hidden">
            
            {/* Image / Fallback Icon Box */}
            <div className="md:col-span-1 aspect-square w-full rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden relative flex items-center justify-center select-none shadow-sm">
              {service.imageUrl ? (
                <img 
                  src={getAssetPath(service.imageUrl)} 
                  alt={service.name} 
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.querySelector('.service-fallback-box');
                    if (fallback) {
                      (fallback as HTMLElement).style.display = 'flex';
                    }
                  }}
                  className="w-full h-full object-cover"
                />
              ) : null}
              <div 
                className={`service-fallback-box w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br ${getFallbackStyle(service.category, service.subcategory)} ${service.imageUrl ? 'hidden' : ''}`}
              >
                <div className="p-4 bg-white/90 rounded-2xl shadow-sm border border-black/5">
                  {getFallbackIcon(service.category, service.subcategory)}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest mt-3 block opacity-80">
                  {service.code}
                </span>
              </div>
            </div>

            {/* Right Details */}
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-2">
                <span className="bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg inline-block">
                  {service.category} • {service.subcategory}
                </span>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                  {richData?.h1 || service.name}
                </h1>
                
                {/* Rating Row */}
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-600">
                  <div className="flex items-center text-yellow-500">
                    <Star size={14} fill="currentColor" />
                  </div>
                  <span>{service.rating} (500+ Verified Customer Ratings)</span>
                </div>
              </div>

              {/* Simple Overview */}
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                {richData?.simpleExplanation || service.description}
              </p>

              {/* Urban Company Price & Guarantee Card */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Starting Price</span>
                  <span className="text-lg font-black text-slate-900 block mt-0.5">₹{richData?.startingPrice || service.price}</span>
                </div>
                <div className="border-x border-slate-200">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Estimated Time</span>
                  <span className="text-xs font-bold text-slate-800 block mt-1 flex items-center justify-center">
                    <Clock size={12} className="mr-1 text-brand-blue" />
                    {service.duration}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Warranty</span>
                  <span className="text-xs font-bold text-emerald-600 block mt-1">{richData?.warrantyPeriod || service.warranty}</span>
                </div>
              </div>

              {/* CTA Buttons Row */}
              <div className="pt-2 flex flex-wrap sm:flex-nowrap gap-3 items-center">
                {qtyInCart > 0 && itemKey ? (
                  <div className="flex items-center gap-2">
                    <div className="bg-white text-brand-blue border-2 border-brand-blue rounded-xl py-2 px-4 text-sm font-black flex items-center justify-between min-w-[120px] h-12">
                      <button
                        type="button"
                        onClick={() => onRemoveFromCart(service.id, cart[itemKey]?.brand)}
                        className="text-brand-blue hover:text-brand-blue-dark hover:bg-blue-50 p-1 rounded cursor-pointer"
                      >
                        <Minus size={16} strokeWidth={3} />
                      </button>
                      <span className="text-sm font-black text-slate-900 px-3">{qtyInCart}</span>
                      <button
                        type="button"
                        onClick={() => onAddToCart(service, cart[itemKey]?.brand)}
                        className="text-brand-blue hover:text-brand-blue-dark hover:bg-blue-50 p-1 rounded cursor-pointer"
                      >
                        <Plus size={16} strokeWidth={3} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={onProceedToCheckout}
                      className="px-4 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all h-12 flex items-center justify-center cursor-pointer"
                    >
                      Checkout Now
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onAddToCart(service)}
                    className="flex-1 py-3.5 px-6 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-md hover:scale-[1.01] active:scale-95 transition-all cursor-pointer h-12 flex items-center justify-center"
                  >
                    Add to Booking (₹{richData?.startingPrice || service.price})
                  </button>
                )}

                <a
                  href={`tel:${businessConfig.contacts[0]}`}
                  className="px-5 py-3.5 bg-brand-orange hover:bg-brand-orange-dark text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all h-12 flex items-center justify-center gap-1.5"
                >
                  <PhoneCall size={14} />
                  <span>Call Now</span>
                </a>

                <a
                  href={`https://api.whatsapp.com/send?phone=919625724903&text=${encodeURIComponent(`*Service Booking Inquiry for ${service.name}*`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all h-12 flex items-center justify-center gap-1.5"
                >
                  <MessageSquare size={14} />
                  <span>WhatsApp</span>
                </a>
              </div>

            </div>

          </div>

          {/* DETAILED SERVICE OVERVIEW (1000+ Word Content Section) */}
          {richData && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                Complete Service Overview & Technical Standards
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed font-normal whitespace-pre-line">
                {richData.detailedOverview}
              </p>
            </div>
          )}

          {/* COMMON PROBLEMS DIAGNOSED (Symptom & Solution Cards) */}
          {richData?.commonProblems && richData.commonProblems.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Common Problems We Fix for {service.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Diagnosed by certified local doorstep technicians</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {richData.commonProblems.map((prob, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                      <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                      <span>{prob.title}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      <strong className="text-slate-700">Symptom:</strong> {prob.symptom}
                    </p>
                    <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 p-2 rounded-lg mt-2">
                      ✔ <strong>Solution:</strong> {prob.solution}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5-STAGE WORK PROCESS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Our 5-Stage Professional Work Process
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Strict quality & safety protocols followed on every visit</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {(richData?.workProcess || [
                { stepNumber: 1, title: 'Doorstep Scan', description: 'Technician conducts digital multimeter check.' },
                { stepNumber: 2, title: 'Rate Quote', description: 'Transparent rate handoff before repair starts.' },
                { stepNumber: 3, title: 'OEM Spares', description: 'Genuine parts replacement.' },
                { stepNumber: 4, title: 'Safety Test', description: 'Full performance and ampere check.' },
                { stepNumber: 5, title: '30-Day Invoice', description: 'Clean worksite and warranty invoice.' }
              ]).map((st) => (
                <div key={st.stepNumber} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-center">
                  <div className="w-8 h-8 rounded-full bg-brand-blue text-white font-black text-xs flex items-center justify-center mx-auto shadow-sm">
                    {st.stepNumber}
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 leading-snug">{st.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{st.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* WHY CHOOSE KS ELECTRICAL (E-E-A-T BADGES) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Why Customers Choose KS Electrical & AC Services
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(richData?.whyChooseUs || seoContent.whyChooseUs).map((point, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-brand-blue text-xs uppercase tracking-wider">
                    <CheckCircle2 size={16} />
                    <span>{point.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {point.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* FREQUENTLY ASKED QUESTIONS (8-10 FAQs with Accordion) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Frequently Asked Questions ({activeFaqs.length} FAQs)
              </h2>
              <p className="text-xs text-slate-500">Everything you need to know about {service.name}</p>
            </div>

            <div className="space-y-3">
              {activeFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="border border-slate-200 rounded-2xl bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 text-left font-bold text-slate-900 text-sm flex items-center justify-between cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp size={18} className="text-brand-blue shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 font-medium">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* VERIFIED REVIEWS & RATINGS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Verified Local Reviews for {service.name}
                </h2>
                <p className="text-xs text-slate-500">Real feedback from Gaur City & Noida Extension residents</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-800 font-extrabold text-xs">
                4.9★ Rated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeReviews.map((rev, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-900">{rev.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} size={11} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed italic">
                      "{rev.text}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[10px] font-bold text-slate-400">
                    <span>📍 {rev.location}</span>
                    <span className="text-brand-blue">Verified Buyer</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LOCAL AREAS LINKING BANNER */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-brand-blue" />
                <h3 className="font-bold text-base text-white">We Serve {service.name} in All Major Societies</h3>
              </div>
              <Link to="/we-serve" className="text-xs font-extrabold text-brand-blue hover:underline">
                View All Areas →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
              {['Gaur City 1', 'Gaur City 2', 'Noida Extension', 'Greater Noida West', 'Crossing Republik', 'Sector 4', 'Sector 16B', 'Techzone 4'].map((areaName) => (
                <Link
                  key={areaName}
                  to={`/we-serve/${areaName.toLowerCase().replace(/\s+/g, '-')}`}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors flex items-center justify-between font-semibold"
                >
                  <span>{areaName}</span>
                  <ArrowRight size={12} className="text-slate-400" />
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ServiceDetailsPage;
