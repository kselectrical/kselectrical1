import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, CheckCircle2, ShieldCheck, Zap, PhoneCall, 
  ArrowRight, Star, Clock, Sparkles, Building
} from 'lucide-react';
import { servicesData, businessConfig } from '../data';
import type { TechnicalService, CartItem } from '../types';

export interface AreaInfo {
  name: string;
  slug: string;
  tagline: string;
  landmarks: string[];
  postalCode: string;
  popularServices: string[];
}

const AREA_LIST: AreaInfo[] = [
  {
    name: 'Gaur City 1',
    slug: 'gaur-city-1',
    tagline: 'Avenues 1 to 7 & 1st Avenue Commercial Market',
    landmarks: ['1st Avenue', '4th Avenue', 'Gaur City Mall', 'Galaxy Plaza'],
    postalCode: '201301',
    popularServices: ['AC Service', 'Electrician', 'RO Service']
  },
  {
    name: 'Gaur City 2',
    slug: 'gaur-city-2',
    tagline: '10th, 11th, 12th, 14th, 16th Avenues & High Rise Societies',
    landmarks: ['14th Avenue', '16th Avenue', 'Gaur City Center', 'Galleria Market'],
    postalCode: '201301',
    popularServices: ['AC Repair', 'Washing Machine Repair', 'Electrician']
  },
  {
    name: 'Noida Extension',
    slug: 'noida-extension',
    tagline: 'Greater Noida West High-Rise Societies & Commercial Belt',
    landmarks: ['Char Murti Chowk', 'Ek Murti Chowk', 'Kisan Chowk', 'Noida Extension Mall'],
    postalCode: '201301',
    popularServices: ['AC Service', 'RO Filter Replacement', 'Electrician']
  },
  {
    name: 'Crossing Republik',
    slug: 'crossing-republik',
    tagline: 'NH-24 Crossings Township, Panchsheel & Supertech Societies',
    landmarks: ['Clement Town', 'Mahagun Mascot', 'Panchsheel Wellington', 'Crossings Galleria'],
    postalCode: '201016',
    popularServices: ['Electrician', 'AC Service', 'Geyser Service']
  },
  {
    name: 'Sector 4',
    slug: 'sector-4',
    tagline: 'Noida Extension Sector 4 Township & Residential Hub',
    landmarks: ['Gaur Saundaryam', 'Amrapali Dream Valley', 'La Residentia'],
    postalCode: '201306',
    popularServices: ['AC Repair', 'Electrician', 'Chimney Service']
  },
  {
    name: 'Sector 16B',
    slug: 'sector-16b',
    tagline: 'Sector 16B High Rise Townships & Commercial Market',
    landmarks: ['AJNARA Le Garden', 'Supertech Eco Village 3', 'Panchsheel Greens 2'],
    postalCode: '201306',
    popularServices: ['Electrician', 'RO Service', 'AC Installation']
  },
  {
    name: 'Pari Chowk',
    slug: 'pari-chowk',
    tagline: 'Greater Noida Central Commercial & Sector Hub',
    landmarks: ['Ansal Plaza', 'Jaypee Greens', 'Omega 1', 'Alpha 1 Metro Station'],
    postalCode: '201310',
    popularServices: ['Electrician', 'AC on Rent', 'Commercial Wiring']
  },
  {
    name: 'Bisrakh',
    slug: 'bisrakh',
    tagline: 'Bisrakh Jalalpur Township & Surrounding Societies',
    landmarks: ['Bisrakh Temple Road', 'Eco Village 1', 'Nirala Estate'],
    postalCode: '201306',
    popularServices: ['Electrician', 'Refrigerator Repair', 'Fan Service']
  },
  {
    name: 'Techzone 4',
    slug: 'techzone-4',
    tagline: 'IT Park, Eco Village 1 & Spring Elmas Belt',
    landmarks: ['Supertech Eco Village 1', 'Cherry County', 'Spring Elmas', 'Stellar Jeevan'],
    postalCode: '201306',
    popularServices: ['AC Service', 'Electrician', 'Washing Machine Repair']
  },
  {
    name: 'Ecotech',
    slug: 'ecotech',
    tagline: 'Ecotech Industrial & Commercial Zones Greater Noida',
    landmarks: ['Ecotech 2', 'Ecotech 3', 'Ecotech 12', 'Toy City'],
    postalCode: '201306',
    popularServices: ['Commercial Electrician', '3-Phase Wiring', 'AC Servicing']
  },
  {
    name: 'Greater Noida West',
    slug: 'greater-noida-west',
    tagline: 'Complete Greater Noida West Township & Sector Network',
    landmarks: ['Gaur City', 'Patwari', 'Shahberi', 'Surajpur'],
    postalCode: '201306',
    popularServices: ['AC Service', 'RO Service', 'Electrician']
  },
  {
    name: 'Ghaziabad',
    slug: 'ghaziabad',
    tagline: 'Indirapuram, Vaishali, Vasundhara & Vijay Nagar NCR',
    landmarks: ['Indirapuram Habitat Centre', 'Vaishali Metro', 'Vasundhara Sector 10'],
    postalCode: '201014',
    popularServices: ['Electrician', 'AC Service', 'Appliances Repair']
  }
];

interface AreaHubPageProps {
  onAddToCart?: (service: TechnicalService, brand?: string) => void;
  cart?: Record<string, CartItem>;
}

export const AreaHubPage: React.FC<AreaHubPageProps> = ({ onAddToCart }) => {
  const { areaSlug } = useParams<{ areaSlug?: string }>();
  const navigate = useNavigate();

  // Find active area if slug provided
  const currentArea = areaSlug 
    ? AREA_LIST.find(a => a.slug === areaSlug.toLowerCase())
    : null;

  // Render Individual Area Landing Page
  if (areaSlug && currentArea) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans pb-16">
        
        {/* Dynamic SEO JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": `KS Electrical & AC Services - ${currentArea.name}`,
              "description": `Certified doorstep electrician, AC repair, RO service, and appliance repair in ${currentArea.name}. Under 30-minute dispatch guaranteed.`,
              "telephone": "+91-9625724903",
              "areaServed": currentArea.name,
              "postalCode": currentArea.postalCode,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": currentArea.name,
                "addressRegion": "UP",
                "postalCode": currentArea.postalCode,
                "addressCountry": "IN"
              }
            })
          }}
        />

        {/* HERO SECTION FOR AREA */}
        <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-5xl mx-auto text-center space-y-5 relative z-10">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 size={14} className="text-emerald-400" />
              Verified Local Service Center in {currentArea.name}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Doorstep Electrician & AC Services in <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue-light via-blue-300 to-emerald-400">
                {currentArea.name}
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              {currentArea.tagline}. Certified technicians equipped with digital billing, genuine spare parts, and 30-day warranty.
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
              <span className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Clock size={13} className="text-amber-400" /> Under 30-Min Dispatch
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-400" /> 30-Day Warranty
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Star size={13} className="text-yellow-400 fill-yellow-400" /> 4.9★ Local Rating
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <Link
                to="/book"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-sm uppercase tracking-wider transition-all shadow-lg hover:scale-105"
              >
                <Zap size={16} />
                <span>Book Service Now</span>
              </Link>
              <a
                href={`tel:${businessConfig.contacts[0]}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-all"
              >
                <PhoneCall size={16} />
                <span>Call Technician</span>
              </a>
            </div>

          </div>
        </section>

        {/* LANDMARKS & COVERED SOCIETIES */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto -mt-6 relative z-20">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center">
                <Building size={20} />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                  Top Societies & Landmarks Covered in {currentArea.name}
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {currentArea.landmarks.map((landmark, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-xs font-bold">
                      📍 {landmark}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Link
              to="/we-serve"
              className="text-xs font-bold text-brand-blue hover:underline shrink-0"
            >
              View All Locations →
            </Link>
          </div>
        </section>

        {/* SERVICES CATALOG GRID */}
        <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Available Doorstep Services in {currentArea.name}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Select a service below to book certified technician visit in {currentArea.name}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {servicesData.map((svc) => (
              <div
                key={svc.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-brand-blue transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{svc.imageUrl ? '⚡' : '🔧'}</span>
                    <span className="px-2 py-0.5 bg-blue-50 text-brand-blue text-[10px] font-bold uppercase rounded">
                      {svc.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {svc.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {svc.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Inspection Rate</span>
                    <span className="text-base font-black text-slate-900">₹{svc.price}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {onAddToCart && (
                      <button
                        onClick={() => onAddToCart(svc)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        + Cart
                      </button>
                    )}
                    <button
                      onClick={() => navigate('/book')}
                      className="px-3.5 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    );
  }

  // Render MAIN AREA DIRECTORY HUB (`/we-serve`)
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      
      {/* Top Header */}
      <section className="bg-slate-900 text-white py-12 md:py-16 px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-extrabold text-xs uppercase tracking-wider">
          <Sparkles size={14} className="text-blue-400" />
          Coverage Area Network
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          We Serve (हमारे सर्विस एरिया)
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Select your area or residential sector below for instant 15-30 minute doorstep technician dispatch in Greater Noida West & NCR.
        </p>
      </section>

      {/* Interactive Location Checklist Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10 space-y-8">
        
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <MapPin size={22} className="text-brand-blue" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Click Any Location to View Services & Rates
              </h2>
            </div>
            <span className="hidden sm:inline-block text-xs font-bold text-slate-400">
              12 Primary Service Sectors
            </span>
          </div>

          {/* Area Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {AREA_LIST.map((area) => (
              <Link
                key={area.slug}
                to={`/we-serve/${area.slug}`}
                className="group p-5 bg-slate-50 hover:bg-blue-50/40 border border-slate-200 hover:border-brand-blue rounded-2xl transition-all duration-200 flex flex-col justify-between space-y-3 cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-sm">
                    <CheckCircle2 size={18} className="shrink-0" />
                    <span className="group-hover:text-brand-blue transition-colors">{area.name}</span>
                  </div>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {area.tagline}
                </p>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>Pin: {area.postalCode}</span>
                  <span className="text-brand-blue">View Page →</span>
                </div>
              </Link>
            ))}
          </div>

        </div>

      </section>

    </div>
  );
};

export default AreaHubPage;
