import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { ServiceGrid } from '../../components/ServiceGrid';
import { HelpCircle, ChevronDown, ChevronUp, CheckCircle, ArrowRight, Shield, MessageCircle, PhoneCall } from 'lucide-react';
import type { TechnicalService, CartItem } from '../../types';
import type { BusinessConfig } from '../../data';
import { generateLocalContent, generateLocalSchemas } from './localSeoEngine';
import { generateServicePageSeo } from './servicePageSeo';

interface SEOOverride {
  title: string;
  description: string;
  keyword: string;
  heading: string;
  intro: string;
}

const getSEOContent = (
  serviceSlug: string,
  serviceName: string,
  cityName: string,
  businessName: string,
  overviewText: string
): SEOOverride => {
  const normCity = cityName ? cityName.trim() : '';
  const locationHeader = normCity ? `in ${normCity}` : 'in Greater Noida, Gaur City & Noida Extension';
  const displayCity = normCity || 'Greater Noida, Gaur City & Noida Extension';

  // Standardize slug
  let cleanSlug = serviceSlug.toLowerCase();
  if (cleanSlug === 'electrician-service') cleanSlug = 'electrician';

  // Local SEO enriched keywords list
  const keyword = `Electrician near me, AC repair in Gaur City, Best RO service Noida Extension, Greater Noida Electrician, ${serviceName} in Greater Noida, ${serviceName} Gaur City, home service ${displayCity}, ${serviceName} Noida Extension, Best ${serviceName} near me`;

  let title = `Best ${serviceName} ${locationHeader} | ${businessName}`;
  let description = `Professional ${serviceName.toLowerCase()} home service at the lowest price with 100% safety and warranty ${locationHeader}. सबसे कम दाम में पूरी गारंटी और सुरक्षा के साथ होम सर्विस।`;
  let heading = `Professional ${serviceName} ${locationHeader}`;
  let intro = overviewText;

  // Custom optimized texts based on slug
  if (cleanSlug === 'ac-service') {
    title = `Best AC Repair & Service in Greater Noida | ${businessName}`;
    description = `Professional AC service & repair in Greater Noida, Gaur City & Noida Extension at the lowest price with 100% safety and warranty. deep high-pressure jet washing and maintenance.`;
    heading = `Best AC Repair & Service in Greater Noida`;
    intro = `Looking for prompt AC service in Greater Noida? Our certified team is nearby to dispatch expert technicians to your home within 90 minutes. We offer deep high-pressure jet washing and general maintenance at transparent, upfront rates.`;
  } else if (cleanSlug === 'ac-repair') {
    title = `Expert AC Repair & Gas Charging in Greater Noida | ${businessName}`;
    description = `Professional AC Repair in Greater Noida, Gaur City & Noida Extension. Compressor diagnostics, copper pipe welding, gas leaks, and fan motor repairs with 30-day warranty.`;
    heading = `Expert AC Repair & Gas Charging in Greater Noida`;
    intro = `If your AC is not cooling properly, book expert AC repair in Greater Noida, Noida Extension & Gaur City. We resolve compressor faults, copper pipe welding, gas leaks, and fan motor issues with official 30-day warranty coverage.`;
  } else if (cleanSlug === 'ac-installation') {
    title = `Professional AC Installation in Noida Extension & Gaur City | ${businessName}`;
    description = `Professional Split & Window AC Installation in Noida Extension, Gaur City & Greater Noida at the lowest price with 100% safety and warranty. Bracket mounting, leak testing, and uninstallation.`;
    heading = `Professional AC Installation in Noida Extension & Gaur City`;
    intro = `Get seamless Split & Window AC installation in Greater Noida, Noida Extension & Gaur City by certified technicians. We handle bracket mounting, copper piping layout, insulation, and leak testing.`;
  } else if (cleanSlug === 'ro-service') {
    title = `Best RO Service & Water Purifier Repair in Greater Noida | ${businessName}`;
    description = `Professional RO Service in Greater Noida, Gaur City & Noida Extension. Filter replacement, membrane cleaning, TDS level tuning, and leak repairs with certified spares at lowest price.`;
    heading = `Best RO Service & Water Purifier Repair in Greater Noida`;
    intro = `Ensure safe drinking water for your family with our expert RO service in Greater Noida, Gaur City & Noida Extension. We clean filter housings, adjust TDS levels, flush the membrane, and verify UV/UF chamber performance.`;
  } else if (cleanSlug === 'electrician') {
    title = `Greater Noida's Most Trusted Electrical Service | ${businessName}`;
    description = `Professional Electrician Service in Greater Noida, Gaur City & Noida Extension. Short circuit detection, modular switch repair, MCB upgrades, and rewiring. Same day service.`;
    heading = `Greater Noida's Most Trusted Electrical Service`;
    intro = `For any urgent electrical faults, hire a safe, certified electrician in Greater Noida, Gaur City & Noida Extension. We handle short circuit troubleshooting, light fittings, geyser installations, and modular board repairs.`;
  } else if (cleanSlug === 'washing-machine-repair') {
    title = `Best Washing Machine Repair & Service in Greater Noida | ${businessName}`;
    description = `Professional Washing Machine Repair in Greater Noida, Gaur City & Noida Extension. Drum noise, spinning failure, drain issues, and tub deep cleaning with warranty.`;
    heading = `Washing Machine Repair & Service in Greater Noida`;
  } else if (cleanSlug === 'refrigerator-repair') {
    title = `Best Refrigerator Repair & Fridge Gas in Greater Noida | ${businessName}`;
    description = `Professional Refrigerator Repair in Greater Noida, Gaur City & Noida Extension. Single/double door fridge cooling fixes, compressor relay, and gas charging.`;
    heading = `Doorstep Refrigerator Repair in Greater Noida`;
  } else if (cleanSlug === 'chimney-service') {
    title = `Best Kitchen Chimney Service & Cleaning in Greater Noida | ${businessName}`;
    description = `Professional Kitchen Chimney Service in Greater Noida, Gaur City & Noida Extension. Deep baffle filter degreasing, motor check, and blower cleaning.`;
    heading = `Kitchen Chimney Service & Deep Cleaning in Greater Noida`;
  }

  return {
    title,
    description,
    keyword,
    heading,
    intro
  };
};

const getCityInternalLinks = (currentServiceSlug: string, currentCityName: string) => {
  const normCity = currentCityName.trim();
  if (normCity === 'Greater Noida, Gaur City & Noida Extension') {
    return [];
  }
  const citySlug = normCity.toLowerCase().replace(/\s+/g, '-');
  const linksList: { label: string; path: string }[] = [];

  const servicesList = [
    { slug: 'ac-service', label: 'AC Service' },
    { slug: 'ac-repair', label: 'AC Repair' },
    { slug: 'ac-installation', label: 'AC Installation' },
    { slug: 'ro-service', label: 'RO Service' },
    { slug: 'electrician-service', label: 'Electrician Service' },
    { slug: 'washing-machine-repair', label: 'Washing Machine Repair' },
    { slug: 'refrigerator-repair', label: 'Refrigerator Repair' },
    { slug: 'chimney-service', label: 'Chimney Service' },
    { slug: 'geyser-service', label: 'Geyser Service' },
    { slug: 'fan-service', label: 'Fan Service' },
    { slug: 'light-service', label: 'Light Service' },
    { slug: 'home-installations', label: 'Home Installations' },
    { slug: 'microwave-service', label: 'Microwave Service' }
  ];

  servicesList.forEach(service => {
    let cleanCurrentSlug = currentServiceSlug.toLowerCase();
    if (cleanCurrentSlug === 'electrician') cleanCurrentSlug = 'electrician-service';

    if (service.slug !== cleanCurrentSlug) {
      linksList.push({
        label: `${service.label} in ${normCity}`,
        path: `/services/${service.slug}/${citySlug}`
      });
    }
  });

  return linksList;
};

const getNearbyLocationLinks = (currentServiceSlug: string, currentCityName: string) => {
  const normCity = currentCityName.trim().toLowerCase().replace(/\s+/g, '-');
  
  const locations = [
    { slug: 'gaur-city-1', label: 'Gaur City 1' },
    { slug: 'gaur-city-2', label: 'Gaur City 2' },
    { slug: 'noida-extension', label: 'Noida Extension' },
    { slug: 'greater-noida-west', label: 'Greater Noida West' },
    { slug: 'indirapuram', label: 'Indirapuram' },
    { slug: 'vaishali', label: 'Vaishali' },
    { slug: 'vasundhara', label: 'Vasundhara' },
    { slug: 'raj-nagar-extension', label: 'Raj Nagar Extension' },
    { slug: 'crossings-republik', label: 'Crossings Republik' },
    { slug: 'noida-sector-62', label: 'Noida Sector 62' }
  ];

  return locations
    .filter(loc => loc.slug !== normCity)
    .slice(0, 4)
    .map(loc => ({
      label: `${loc.label}`,
      path: `/services/${currentServiceSlug}/${loc.slug}`
    }));
};

const getRelatedBlogLinks = (currentServiceSlug: string) => {
  const slug = currentServiceSlug.toLowerCase();
  if (slug.includes('ac')) {
    return [
      { label: 'Why AC Cooling Drops & Fixes', path: '/blog/why-ac-cooling-drops' },
      { label: 'How Often to Service Your AC', path: '/blog/how-often-should-we-do-ac-service' },
      { label: 'Summer AC Maintenance Tips', path: '/blog/summer-ac-maintenance-tips' }
    ];
  }
  if (slug.includes('ro-') || slug.includes('purifier')) {
    return [
      { label: 'RO Water Purifier Maintenance Guide', path: '/blog/ro-water-purifier-maintenance-guide' }
    ];
  }
  return [];
};

interface FAQ {
  q: string;
  a: string;
}

interface BaseServicePageProps {
  serviceSlug: string;
  serviceName: string;
  cityName?: string;
  overviewText: string;
  benefits: string[];
  processSteps: string[];
  faqs: FAQ[];
  catalogCategory: string;
  catalogSubcategory?: string;
  serviceIdPrefix?: string;
  services: TechnicalService[];
  cart: Record<string, CartItem>;
  onAddToCart: (service: TechnicalService, brand?: string) => void;
  onRemoveFromCart: (serviceId: string, brand?: string) => void;
  businessConfig: BusinessConfig;
}

const getBrandsForCategory = (slug: string, city: string) => {
  const normCity = city ? `in ${city}` : 'in Noida';
  const cleanSlug = slug.toLowerCase();
  const brands = cleanSlug.includes('ac')
    ? ['Voltas', 'Daikin', 'LG', 'Mitsubishi', 'Samsung', 'O General', 'Carrier', 'Hitachi', 'Lloyd', 'Godrej']
    : (cleanSlug.includes('ro-') || cleanSlug.includes('purifier'))
    ? ['Kent', 'Aquaguard', 'Pureit', 'Livpure', 'Eureka Forbes', 'Blue Star', 'AO Smith', 'Havells']
    : (cleanSlug.includes('washing') || cleanSlug.includes('machine'))
    ? ['LG', 'Samsung', 'IFB', 'Whirlpool', 'Bosch', 'Haier', 'Godrej', 'Panasonic']
    : (cleanSlug.includes('refrigerator') || cleanSlug.includes('fridge'))
    ? ['Samsung', 'LG', 'Whirlpool', 'Haier', 'Godrej', 'Bosch', 'Panasonic']
    : (cleanSlug.includes('electrician') || cleanSlug.includes('wiring') || cleanSlug.includes('switch') || cleanSlug.includes('mcb'))
    ? ['Havells', 'Anchor', 'Schneider', 'Legrand', 'L&T', 'Bajaj', 'Polycab', 'Anchor Roma']
    : ['Bajaj', 'Havells', 'V-Guard', 'Crompton', 'Usha', 'Orient', 'AO Smith', 'Philips'];

  return brands.map(b => `${b} Service & Repair ${normCity}`);
};

export const BaseServicePage: React.FC<BaseServicePageProps> = ({
  serviceSlug,
  serviceName,
  cityName,
  overviewText,
  benefits,
  processSteps,
  faqs,
  catalogCategory,
  catalogSubcategory,
  serviceIdPrefix,
  services,
  cart,
  onAddToCart,
  onRemoveFromCart,
  businessConfig
}) => {
  const navigate = useNavigate();
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Filter services belonging to this category and optional subcategory
  const activeCategoryServices = services.filter(s => {
    let matches = catalogSubcategory
      ? s.category === catalogCategory && s.subcategory === catalogSubcategory
      : s.category === catalogCategory;

    if (matches && serviceIdPrefix) {
      matches = s.id.startsWith(serviceIdPrefix);
    }
    return matches;
  });

  const displayCity = cityName || '';
  const locationSlug = cityName ? cityName.toLowerCase().replace(/\s+/g, '-') : '';

  // Local SEO Combinatorial Content Engine integration
  const localSEO = cityName ? generateLocalContent(serviceSlug, locationSlug, businessConfig) : null;

  const genericSeo = getSEOContent(serviceSlug, serviceName, displayCity, businessConfig.name, overviewText);
  const seo = localSEO 
    ? {
        title: localSEO.title,
        description: localSEO.description,
        keyword: localSEO.keyword,
        heading: localSEO.heading,
        intro: localSEO.intro
      }
    : genericSeo;

  const seoContent = generateServicePageSeo(
    { id: serviceSlug, name: serviceName, code: '', category: catalogCategory, subcategory: catalogSubcategory || '', description: overviewText, iconName: '', duration: '', rating: '4.9 ★', price: activeCategoryServices[0]?.price || 199, warranty: '30 Days Warranty', specifications: [], imageUrl: '' },
    { slug: serviceSlug, title: serviceName, category: catalogCategory, keywords: [serviceName.toLowerCase(), serviceSlug] },
    businessConfig
  );

  const activeBenefits = localSEO 
    ? localSEO.whyChooseUs.map(w => `${w.title}: ${w.desc}`) 
    : benefits;

  const activeSteps = localSEO 
    ? localSEO.processSteps.map(p => `${p.title}: ${p.desc}`) 
    : processSteps;

  const activeFaqs = localSEO 
    ? localSEO.faqs 
    : faqs;

  const siteDomain = businessConfig.website.startsWith('http') ? businessConfig.website : `https://${businessConfig.website}`;
  const canonicalUrl = `${siteDomain}${window.location.pathname.replace(/\/+$/, '')}`;

  // JSON-LD structured schemas
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "provider": {
      "@type": "LocalBusiness",
      "name": businessConfig.name,
      "image": `${siteDomain}${businessConfig.logoUrl}`,
      "telephone": `+91-${businessConfig.contacts[0]}`,
      "url": siteDomain
    },
    "areaServed": displayCity ? [displayCity] : businessConfig.serviceAreas,
    "description": seo.description,
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": activeCategoryServices.length > 0 ? Math.min(...activeCategoryServices.map(s => s.price)) : 199,
      "highPrice": activeCategoryServices.length > 0 ? Math.max(...activeCategoryServices.map(s => s.price)) : 1499,
      "offerCount": activeCategoryServices.length
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": activeFaqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": businessConfig.name,
    "image": `${siteDomain}${businessConfig.logoUrl}`,
    "telephone": `+91-${businessConfig.contacts[0]}`,
    "email": businessConfig.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Gaur City 1, Greater Noida West",
      "addressLocality": "Noida Extension",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "201301",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.5997,
      "longitude": 77.4526
    },
    "url": siteDomain,
    "priceRange": "₹99 - ₹4999",
    "areaServed": displayCity ? [displayCity] : businessConfig.serviceAreas
  };

  let categoryPath = `/services/${serviceSlug}`;
  if (serviceSlug === 'ac-repair' || serviceSlug === 'ac-installation') {
    categoryPath = '/services/ac-service';
  }

  const breadcrumbsList = [
    { label: 'Services', path: '/services' },
    { label: serviceName, path: categoryPath }
  ];

  if (displayCity && cityName) {
    breadcrumbsList.push({ label: cityName, path: window.location.pathname });
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbsList.map((item, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": item.label,
      "item": item.path ? `${siteDomain}${item.path}` : `${siteDomain}${window.location.pathname}`
    }))
  };

  const schemasObj = (cityName && localSEO) 
    ? generateLocalSchemas(serviceSlug, locationSlug, {
        name: businessConfig.name,
        contacts: businessConfig.contacts,
        email: businessConfig.email,
        website: businessConfig.website,
        logoUrl: businessConfig.logoUrl
      }, localSEO)
    : null;

  const finalServiceSchema = schemasObj ? schemasObj.serviceSchema : serviceSchema;
  const finalFaqSchema = schemasObj ? schemasObj.faqSchema : faqSchema;
  const finalLocalBusinessSchema = schemasObj ? schemasObj.localBusinessSchema : localBusinessSchema;
  const finalBreadcrumbSchema = schemasObj ? schemasObj.breadcrumbSchema : breadcrumbSchema;

  // Handle CTA Booking Action
  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keyword} />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">
          {JSON.stringify(finalServiceSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(finalFaqSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(finalLocalBusinessSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(finalBreadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(seoContent.serviceSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(seoContent.faqSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(seoContent.localBusinessSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(seoContent.breadcrumbSchema)}
        </script>
      </Helmet>

      {/* Breadcrumb path navigation */}
      <Breadcrumbs items={breadcrumbsList} />

      {/* Service Hero section */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b border-slate-900 text-white py-20 px-6 sm:px-12 text-left relative overflow-hidden font-sans">
        
        {/* Decorative premium ambient blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl select-none pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl select-none pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-3 py-1 rounded-full font-black uppercase tracking-wider select-none">
              Verified Doorstep Utility
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-black uppercase tracking-wider select-none">
              Starting from ₹{activeCategoryServices.length > 0 ? Math.min(...activeCategoryServices.map(s => s.price)) : 199}
            </span>
            <span className="text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full font-black uppercase tracking-wider select-none">
              30-Min Fast Dispatch
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none text-white">
            {seo.heading}
          </h1>
          <p className="text-sm sm:text-base text-slate-350 font-medium leading-relaxed max-w-2xl">
            {seo.intro}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 select-none">
            <a 
              href="#pricing"
              className="bg-brand-orange hover:bg-brand-orange-dark text-white rounded-xl px-5 py-3.5 text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer inline-flex items-center space-x-1.5 hover:shadow-lg hover:shadow-orange-950/20"
            >
              <span>View Service Rates</span>
              <ArrowRight size={13} />
            </a>
            <a 
              href={`https://wa.me/91${businessConfig.contacts[0]}?text=${encodeURIComponent(`Hello KS Electrical, I would like to book ${serviceName} at my doorstep in ${displayCity || 'Gaur City / Noida Extension'}. Please confirm technician availability.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-5 py-3.5 text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer inline-flex items-center space-x-1.5"
            >
              <MessageCircle size={14} />
              <span>Book via WhatsApp</span>
            </a>
            <a 
              href={`tel:${businessConfig.contacts[0]}`}
              className="bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl px-5 py-3.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer inline-flex items-center space-x-1.5"
            >
              <PhoneCall size={14} />
              <span>Call +91 {businessConfig.contacts[0]}</span>
            </a>
          </div>

          {/* Above-the-fold Trust Bar to stop Quick Back bounces */}
          <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] font-bold text-slate-400 border-t border-white/10">
            <span className="flex items-center gap-1.5 text-slate-350">
              <CheckCircle size={13} className="text-emerald-400 shrink-0" />
              Transparent Rates &amp; No Hidden Charges
            </span>
            <span className="flex items-center gap-1.5 text-slate-350">
              <Shield size={13} className="text-blue-400 shrink-0" />
              30-Day Service Guarantee
            </span>
            <span className="flex items-center gap-1.5 text-slate-350">
              <CheckCircle size={13} className="text-amber-400 shrink-0" />
              100% Genuine OEM Spares
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="bg-slate-50 py-16 border-b border-slate-200" id="pricing">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <div className="text-left">
            <h2 className="text-gray-900 font-black text-2xl tracking-tight leading-none">
              Affordable {serviceName} Rates {displayCity ? `in ${displayCity}` : 'in Greater Noida, Gaur City & Noida Extension'}
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">
              Select specific tasks to add to your service booking card
            </p>
          </div>

          <ServiceGrid 
            services={activeCategoryServices} 
            selectedCategory={catalogCategory}
            cart={cart}
            onAddToCart={onAddToCart}
            onRemoveFromCart={onRemoveFromCart}
            onProceedToCheckout={handleProceedToCheckout}
          />
        </div>
      </div>

      {/* Narrative Info Sections */}
      <div className="bg-white py-16 border-b border-gray-150 text-left font-sans">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Benefits */}
          <div className="space-y-6">
            <h2 className="text-gray-900 font-black text-2xl tracking-tight leading-none border-b border-gray-100 pb-3">
              Why Choose KS Electrical {displayCity ? `in ${displayCity}` : 'in Greater Noida, Gaur City & Noida Extension'}?
            </h2>
            <div className="space-y-4">
              {activeBenefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-900">{benefit.split(':')[0]}</h3>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{benefit.split(':')[1]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Process steps */}
          <div className="space-y-6">
            <h2 className="text-gray-900 font-black text-2xl tracking-tight leading-none border-b border-gray-100 pb-3">
              Our {serviceName} Service Process {displayCity ? `in ${displayCity}` : 'in Greater Noida'}
            </h2>
            <div className="space-y-5 relative pl-6 border-l-2 border-gray-150">
              {activeSteps.map((step, idx) => (
                <div key={idx} className="relative space-y-1">
                  <div className="absolute -left-[33px] top-0.5 w-5 h-5 rounded-full bg-blue-600 text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-white select-none">
                    {idx + 1}
                  </div>
                  <h3 className="font-extrabold text-sm text-gray-900">{step.split(':')[0]}</h3>
                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{step.split(':')[1]}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* FAQs Segment */}
      <div className="bg-gray-50 py-16 border-b border-gray-200 text-left font-sans">
        <div className="max-w-3xl mx-auto px-6 space-y-8 select-none">
          <div className="text-center sm:text-left">
            <h2 className="text-gray-900 font-black text-2xl tracking-tight leading-none">
              {serviceName} Service FAQs {displayCity ? `in ${displayCity}` : 'in Greater Noida'}
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">
              Common questions answered regarding {serviceName.toLowerCase()} repairs
            </p>
          </div>

          <div className="space-y-3">
            {activeFaqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              
              return (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:border-brand-orange/20 transition-all duration-200">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between px-5 py-4 font-bold text-gray-900 text-xs sm:text-sm hover:bg-gray-50/50 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 pr-4">
                      <HelpCircle size={16} className="text-brand-orange shrink-0" />
                      <span>{faq.q}</span>
                    </div>
                    {isOpen ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-gray-600 text-xs sm:text-sm leading-relaxed border-t border-gray-100 bg-gray-50/20 text-left animate-in fade-in slide-in-from-top-1 duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Local Neighborhood Insights & Detailed Overview */}
      {cityName && localSEO && (
        <div className="bg-white py-16 border-b border-slate-200 text-left font-sans select-none">
          <div className="max-w-4xl mx-auto px-6 space-y-10">
            
            {/* Neighborhood banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-gray-900 font-extrabold text-lg flex items-center space-x-2">
                <span>📍</span>
                <span>Serving {cityName} & Nearby Areas</span>
              </h3>
              <p className="text-xs text-gray-650 leading-relaxed font-medium">
                {localSEO.landmarksText} {localSEO.nearbySectorsText} {localSEO.societiesText}
              </p>
              
              {/* Google Maps Search Embed */}
              <div className="w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm relative select-none">
                <iframe 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(cityName + ' Noida Extension Uttar Pradesh')}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-56 border-none"
                  allowFullScreen
                  loading="lazy"
                  title={`Google Maps location for ${cityName}`}
                />
              </div>

              {/* Google Reviews & Local Trust Grid */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h4 className="text-slate-900 font-extrabold text-xs uppercase tracking-wider flex items-center space-x-1.5">
                    <span className="text-amber-500">⭐</span>
                    <span>Google Business Reviews ({cityName})</span>
                  </h4>
                  <span className="text-[10px] bg-green-50 text-green-700 font-black px-2 py-0.5 rounded uppercase">
                    4.9/5 Rating
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "Jitesh Hassani", text: `Very professional AC repair technician near ${cityName}. Arrived on time, completed the work efficiently.`, rating: 5, date: "2 weeks ago" },
                    { name: "Sanitha", text: `The service is excellent and so genuine in feedback. Guided us honestly regarding spare parts near ${cityName}.`, rating: 5, date: "1 month ago" }
                  ].map((r, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 space-y-1.5">
                      <div className="flex justify-between items-center text-[9px] font-bold text-slate-500">
                        <span className="text-slate-800 font-black">{r.name}</span>
                        <span>{r.date}</span>
                      </div>
                      <div className="flex text-amber-400 text-[10px]">
                        {"★".repeat(r.rating)}
                      </div>
                      <p className="text-[10px] text-slate-650 leading-relaxed font-medium">"{r.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed long-form narrative for search bots & users */}
            <div 
              className="prose prose-slate max-w-none text-xs sm:text-sm text-gray-600 leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: localSEO.longDescription }}
            />

          </div>
        </div>
      )}

      {/* Local Internal Links Cluster */}
      <div className="bg-white py-12 border-b border-gray-150 text-left font-sans select-none">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          
          {/* 1. Other Services in this location / General */}
          <div className="space-y-3">
            <h3 className="text-gray-900 font-extrabold text-lg">
              {displayCity ? `Other Doorstep Services in ${displayCity}` : "Other Doorstep Appliance & Repair Services"}
            </h3>
            <p className="text-xs text-gray-500 font-semibold">
              Find reliable certified technicians and transparent billing rates:
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1">
              {displayCity ? (
                getCityInternalLinks(serviceSlug, displayCity).map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.path}
                    className="bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 text-gray-700 hover:text-brand-orange rounded-xl px-4 py-2 text-xs font-black transition-all shadow-xs cursor-pointer"
                  >
                    {link.label}
                  </Link>
                ))
              ) : (
                [
                  { slug: 'ac-service', label: 'AC Service & Jet Wash' },
                  { slug: 'ro-service', label: 'RO Purifier Service' },
                  { slug: 'electrician-service', label: 'Electrician Doorstep Services' },
                  { slug: 'washing-machine-repair', label: 'Washing Machine Repair' },
                  { slug: 'refrigerator-repair', label: 'Refrigerator Repair' },
                  { slug: 'chimney-service', label: 'Kitchen Chimney Service' },
                  { slug: 'geyser-service', label: 'Geyser Repair & Service' },
                  { slug: 'home-installations', label: 'Home Installations & Pigeon Nets' },
                  { slug: 'microwave-service', label: 'Microwave Oven Repair' }
                ]
                  .filter(s => s.slug !== serviceSlug.toLowerCase() && (s.slug !== 'electrician-service' || serviceSlug.toLowerCase() !== 'electrician'))
                  .map((link, idx) => (
                    <Link
                      key={idx}
                      to={`/services/${link.slug}`}
                      className="bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 text-gray-700 hover:text-brand-orange rounded-xl px-4 py-2 text-xs font-black transition-all shadow-xs cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  ))
              )}
            </div>
          </div>

          {/* 2. Nearby locations for this service / General Locations Directory */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-gray-900 font-extrabold text-sm uppercase tracking-wider">
              {displayCity ? `${serviceName} Serviced Areas Nearby` : `${serviceName} Service Locations`}
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              {displayCity 
                ? "Get express 90-minute dispatch assignments to adjacent sectors and apartment complexes:"
                : "Get same-day certified technician dispatch across priority zones in Noida, Gaur City, and Ghaziabad:"
              }
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1">
              {displayCity ? (
                getNearbyLocationLinks(serviceSlug, displayCity).map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.path}
                    className="bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-600 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    {serviceName} in {link.label}
                  </Link>
                ))
              ) : (
                [
                  { slug: 'gaur-city-1', label: 'Gaur City 1' },
                  { slug: 'gaur-city-2', label: 'Gaur City 2' },
                  { slug: 'noida-extension', label: 'Noida Extension' },
                  { slug: 'greater-noida-west', label: 'Greater Noida West' },
                  { slug: 'indirapuram', label: 'Indirapuram' },
                  { slug: 'vaishali', label: 'Vaishali' },
                  { slug: 'vasundhara', label: 'Vasundhara' },
                  { slug: 'raj-nagar-extension', label: 'Raj Nagar Extension' },
                  { slug: 'crossings-republik', label: 'Crossings Republik' }
                ].map((link, idx) => (
                  <Link
                    key={idx}
                    to={`/services/${serviceSlug}/${link.slug}`}
                    className="bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-600 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    {serviceName} in {link.label}
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* 3. Related blogs for this service */}
          {getRelatedBlogLinks(serviceSlug).length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h3 className="text-gray-900 font-extrabold text-sm uppercase tracking-wider">
                Helpful Guides & Troubleshooting Tips
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Read expert advice from Kaushindra Singh to save on electricity bills and prevent faults:
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                {getRelatedBlogLinks(serviceSlug).map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.path}
                    className="bg-white hover:bg-orange-50 border border-slate-200 hover:border-brand-orange/30 p-3.5 rounded-xl shadow-3xs transition-all flex items-center space-x-2 text-xs font-extrabold text-slate-700 hover:text-brand-orange"
                  >
                    <span>📖</span>
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Brands We Serve Tag Cloud */}
      <div className="bg-slate-50 py-12 border-b border-slate-200 text-left font-sans select-none">
        <div className="max-w-4xl mx-auto px-6 space-y-4">
          <h3 className="text-gray-900 font-extrabold text-lg">
            Brands We Serve {displayCity ? `in ${displayCity}` : 'in Noida'}
          </h3>
          <p className="text-xs text-slate-500 font-semibold">
            We provide expert doorstep diagnostics, filter replacements, brand original spares, and repairs for all major appliance makes:
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {getBrandsForCategory(serviceSlug, displayCity).map((brandTag, idx) => (
              <span
                key={idx}
                className="bg-white border border-slate-200 text-slate-700 rounded-lg px-3 py-1.5 text-[10px] font-bold shadow-xs hover:border-brand-orange/30 hover:text-brand-orange hover:shadow-sm transition-all duration-150"
              >
                {brandTag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Explore Other Premium Services */}
      <div className="bg-white py-12 pb-28 md:pb-12 border-b border-slate-200 text-left font-sans select-none">
        <div className="max-w-4xl mx-auto px-6 space-y-5">
          <h3 className="text-gray-900 font-extrabold text-lg">
            Explore Other Premium Services
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'AC Service & Gas', path: '/services/ac-service', price: '₹299', icon: '❄️' },
              { label: 'RO Filter Service', path: '/services/ro-service', price: '₹299', icon: '💧' },
              { label: 'Certified Electrician', path: '/services/electrician-service', price: '₹49', icon: '⚡' },
              { label: 'Washing Machine', path: '/services/washing-machine-repair', price: '₹199', icon: '🧺' }
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className="flex items-center space-x-3 p-3.5 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-brand-orange/30 rounded-2xl shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg shrink-0">
                  {item.icon}
                </div>
                <div className="truncate text-left leading-tight">
                  <span className="text-[10px] font-black text-slate-800 block truncate">{item.label}</span>
                  <span className="text-[9px] text-slate-550 font-bold block mt-0.5">Starting from {item.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Google Ads CTA banner */}
      <div className="bg-slate-950 border-t border-slate-900 text-white py-16 px-6 text-center relative overflow-hidden select-none font-sans">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/10 to-blue-550/10 opacity-70" />
        <div className="max-w-2xl mx-auto space-y-5 relative z-10">
          <Shield className="mx-auto text-brand-orange animate-pulse" size={40} />
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-white">
            Ready to book your {serviceName.toLowerCase()}?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold leading-relaxed max-w-lg mx-auto">
            Book now and get dispatch assignments within 90 minutes. Backed by our official 30-Day Service Warranty cover.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                // Add a default item if cart is empty to help them check out
                if (activeCategoryServices.length > 0 && Object.keys(cart).length === 0) {
                  onAddToCart(activeCategoryServices[0]);
                }
                navigate('/checkout');
              }}
              className="w-full sm:w-auto bg-brand-orange hover:bg-brand-orange-dark text-white rounded-xl px-6 py-3.5 text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer inline-flex items-center justify-center space-x-1.5 hover:shadow-lg"
            >
              <span>Book Service Now</span>
              <ArrowRight size={13} />
            </button>

            <a
              href={`tel:${businessConfig.contacts[0]}`}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-850 text-white border border-slate-800 rounded-xl px-6 py-3.5 text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer inline-flex items-center justify-center space-x-1.5"
            >
              <PhoneCall size={13} className="text-blue-500" />
              <span>Call Helpline</span>
            </a>

            <a
              href={`https://wa.me/91${businessConfig.contacts[0]}?text=${encodeURIComponent(`Hi, I want to book ${serviceName} service ${displayCity ? `in ${displayCity}` : ''}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-3.5 text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer inline-flex items-center justify-center space-x-1.5"
            >
              <MessageCircle size={13} className="fill-white" />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </div>
      {/* ── Sticky Mobile Bottom CTA Bar ── */}
      {/* Visible only on mobile (md:hidden). Fixed to bottom of viewport. */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_12px_rgba(0,0,0,0.10)] px-3 pt-2.5 pb-3 font-sans">
        <div className="flex gap-2.5 mb-1.5">
          <a
            href={`tel:${businessConfig.contacts[0]}`}
            className="flex-1 flex items-center justify-center gap-1.5 bg-brand-blue hover:bg-blue-700 text-white rounded-xl py-3 text-xs font-black tracking-wide transition-all active:scale-95 shadow-md"
          >
            <PhoneCall size={14} />
            <span>📞 Call: {businessConfig.contacts[0]}</span>
          </a>
          <a
            href={`https://wa.me/91${businessConfig.contacts[0]}?text=${encodeURIComponent(`Hi KS Electrical, I want to book ${serviceName} at my doorstep in ${displayCity || 'Gaur City / Noida Extension'}. Please confirm availability.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-3 text-xs font-black tracking-wide transition-all active:scale-95 shadow-md"
          >
            <MessageCircle size={14} />
            <span>💬 WhatsApp Booking</span>
          </a>
        </div>
        <p className="text-center text-[9px] text-gray-500 font-semibold leading-none">
          Technician at doorstep within 30–45 mins · Gaur City &amp; Gr. Noida West
        </p>
      </div>
    </>
  );
};
