import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Search } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { ServiceGrid } from '../components/ServiceGrid';
import { Breadcrumbs } from '../components/Breadcrumbs';
import type { TechnicalService, CartItem } from '../types';
import type { BusinessConfig } from '../data';

interface ServicesPageProps {
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

export const ServicesPage: React.FC<ServicesPageProps> = ({
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  spellingCorrection,
  selectedCategory,
  setSelectedCategory,
  categories,
  filteredServices,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onProceedToCheckout,
  businessConfig
}) => {
  const siteDomain = "https://www.kselectrical.in";

  // Breadcrumb schema JSON-LD
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteDomain
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Our Services",
        "item": `${siteDomain}/services`
      }
    ]
  };

  // Service Catalog schema JSON-LD
  const serviceCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "KS Handyman & Appliance Repair Services Catalog",
    "description": "Upfront transparent rates, same-day scheduling, and certified technician dispatches in Noida, Greater Noida, and Ghaziabad.",
    "provider": {
      "@type": "LocalBusiness",
      "name": businessConfig.name,
      "image": `${siteDomain}/hero_technician.webp`,
      "telephone": `+91-${businessConfig.contacts[0]}`,
      "url": siteDomain
    },
    "areaServed": ["Noida", "Greater Noida", "Ghaziabad", "Noida Extension", "Gaur City"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Technical Repair Services Catalog",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Air Conditioner Services" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Washing Machine Services" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Refrigerator Services" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "RO Water Purifier Services" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Kitchen Chimney Services" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Electrical Services" } }
      ]
    }
  };

  return (
    <>
      <Helmet>
        <title>All Electrical, AC &amp; Home Services in Gaur City &amp; Greater Noida West | KS Electrical</title>
        <meta name="description" content="Book certified electricians, AC repair, RO service, fan repair &amp; all home appliance services at your doorstep in Gaur City, Greater Noida West &amp; Noida Extension. Transparent rates, same-day scheduling." />
        <link rel="canonical" href={`${siteDomain}/services`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteDomain}/services`} />
        <meta property="og:title" content="All Electrical, AC &amp; Home Services in Gaur City &amp; Greater Noida West | KS Electrical" />
        <meta property="og:description" content="Book certified electricians, AC repair, RO service &amp; all home appliance services in Gaur City, Greater Noida West &amp; Noida Extension. Upfront rates, same-day dispatch." />
        <meta property="og:image" content={`${siteDomain}/hero_technician.webp`} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="All Electrical, AC &amp; Home Services in Gaur City &amp; Greater Noida West | KS Electrical" />
        <meta name="twitter:description" content="Book certified electricians, AC jet cleaning, RO service &amp; appliance repair in Gaur City, Noida Extension &amp; Greater Noida West. Same-day technician dispatch." />
        <meta name="twitter:image" content={`${siteDomain}/hero_technician.webp`} />

        {/* JSON-LD Schemas */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(serviceCatalogSchema)}
        </script>
      </Helmet>

      <Breadcrumbs items={[{ label: 'Our Services' }]} />

      <main className="bg-gray-50 py-12 border-b border-gray-200 relative text-center">
        
        {/* Header Titles */}
        <div className="max-w-4xl mx-auto px-6 text-left mb-8">
          <h1 className="text-3xl font-black text-gray-900 leading-none">Our Handyman & Repair Services</h1>
          <p className="text-[10px] text-gray-555 font-bold uppercase tracking-wider mt-1.5">Upfront rates, same-day scheduling, and certified technicians</p>
        </div>

        {/* Services Page Search Bar Input */}
        <div className="w-full max-w-4xl mx-auto px-4 mb-6 relative">
          <div className="relative border border-slate-200 focus-within:border-brand-blue rounded-2xl bg-white shadow-xs focus-within:shadow-md transition-all flex items-center pr-3">
            <span className="pl-4 text-slate-400">
              <Search size={18} aria-hidden="true" />
            </span>
            <input
              type="text"
              aria-label="Search technical services"
              placeholder="Search for repair, installation, or maintenance services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onSearchSubmit(searchQuery);
                }
              }}
              className="w-full bg-white text-gray-800 text-sm font-semibold pl-3 pr-4 py-3.5 focus:outline-none rounded-2xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
                className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase cursor-pointer focus:outline-none focus:text-brand-orange"
              >
                Clear
              </button>
            )}
          </div>
          
          {spellingCorrection && (
            <p className="text-[11px] font-bold text-gray-500 mt-2 text-left pl-4">
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

        {/* Category Filter Buttons */}
        <SearchBar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />
        
        {/* Services Listing Empty State & Grid */}
        {filteredServices.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center space-y-4 shadow-sm max-w-lg mx-auto mt-6">
            <p className="text-gray-650 font-extrabold text-sm">No services found matching your criteria.</p>
            <p className="text-gray-400 text-xs">
              Try checking the spelling, using alternate words, or explore our popular categories:
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {['AC Service', 'Washing Machine Repair', 'Electrician', 'RO Service'].map((pop) => (
                <button
                  key={pop}
                  onClick={() => setSearchQuery(pop)}
                  className="bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-brand-orange text-slate-650 hover:text-brand-orange font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  {pop}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ServiceGrid 
            services={filteredServices} 
            selectedCategory={selectedCategory}
            cart={cart}
            onAddToCart={onAddToCart}
            onRemoveFromCart={onRemoveFromCart}
            onProceedToCheckout={onProceedToCheckout}
          />
        )}
      </main>
    </>
  );
};

export default ServicesPage;
