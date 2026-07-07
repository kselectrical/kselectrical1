import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Wrench, ChevronRight, Sparkles } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface DirectoryItem {
  name: string;
  slug: string;
}

const LOCATIONS: DirectoryItem[] = [
  { name: 'Gaur City 1', slug: 'gaur-city-1' },
  { name: 'Gaur City 2', slug: 'gaur-city-2' },
  { name: 'Noida Extension', slug: 'noida-extension' },
  { name: 'Greater Noida West', slug: 'greater-noida-west' },
  { name: 'Ghaziabad', slug: 'ghaziabad' },
  { name: 'Crossing Republik', slug: 'crossing-republik' }
];

const SERVICES: DirectoryItem[] = [
  { name: 'AC Service & Jet Wash', slug: 'ac-service' },
  { name: 'AC Repair & Diagnostics', slug: 'ac-repair' },
  { name: 'AC Installation & Mounting', slug: 'ac-installation' },
  { name: 'RO Water Purifier Service', slug: 'ro-service' },
  { name: 'Electrician Doorstep Services', slug: 'electrician' },
  { name: 'Washing Machine Repair', slug: 'washing-machine-repair' },
  { name: 'Refrigerator Gas & Repair', slug: 'refrigerator-repair' },
  { name: 'Kitchen Chimney Service', slug: 'chimney-service' },
  { name: 'Geyser Repair & Service', slug: 'geyser-service' },
  { name: 'Ceiling & BLDC Fan Service', slug: 'fan-service' },
  { name: 'Lights & Panel Fittings', slug: 'light-service' },
  { name: 'Home Installations & Pigeon Nets', slug: 'home-installations' },
  { name: 'Microwave Oven Repair', slug: 'microwave-service' }
];

export const LocalDirectoryPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Local Service Areas Directory | KS Electrical & AC Services</title>
        <meta name="description" content="Browse our complete directory of local service areas and doorstep home maintenance utilities. Serving Gaur City, Noida Extension, Greater Noida West, and Ghaziabad." />
        <link rel="canonical" href="https://www.kselectrical.in/local-landing" />
      </Helmet>

      <Breadcrumbs items={[{ label: 'Local Directory' }]} />

      <section className="max-w-6xl mx-auto px-6 py-12 text-left font-sans">
        
        {/* Header Section */}
        <div className="mb-10 text-center sm:text-left space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-brand-blue border border-blue-100 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Sparkles size={12} className="text-brand-blue" /> Service Directory
          </span>
          <h1 className="text-gray-900 font-black text-3xl sm:text-4xl tracking-tight leading-none">
            Our Local Service Areas
          </h1>
          <p className="text-gray-500 text-sm sm:text-base font-semibold leading-relaxed max-w-3xl">
            Choose your specific service category and location below to view customized pricing, local technician availability, and verified customer reviews in your residential complex.
          </p>
        </div>

        {/* Directory Locations Loop */}
        <div className="space-y-12">
          {LOCATIONS.map((loc) => (
            <div key={loc.slug} className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
              
              {/* Location Heading */}
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/10">
                  <MapPin size={20} />
                </div>
                <div>
                  <h2 className="text-gray-950 font-black text-lg sm:text-xl leading-tight">
                    Doorstep Services in {loc.name}
                  </h2>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Under 30-Min technician dispatch guaranteed
                  </span>
                </div>
              </div>

              {/* Services Grid for Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SERVICES.map((srv) => (
                  <Link
                    key={srv.slug}
                    to={`/services/${srv.slug}/${loc.slug}`}
                    className="group bg-white border border-slate-200 hover:border-brand-blue p-4 rounded-2xl flex items-center justify-between transition-all duration-200 hover:shadow-sm hover:scale-[1.01] cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-blue-50 group-hover:text-brand-blue group-hover:border-blue-100 transition-colors shrink-0">
                        <Wrench size={14} />
                      </div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 truncate leading-tight">
                        {srv.name}
                      </span>
                    </div>
                    <ChevronRight size={14} className="text-slate-400 group-hover:text-brand-blue group-hover:transform group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                ))}
              </div>

            </div>
          ))}
        </div>

      </section>
    </>
  );
};

export default LocalDirectoryPage;
