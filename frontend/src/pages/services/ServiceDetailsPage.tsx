import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Star, Clock, ShieldCheck, Plus, Minus, ArrowLeft, 
  Droplets, Wrench, Flame, Zap, Settings, Lightbulb, Wind 
} from 'lucide-react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import type { TechnicalService, CartItem } from '../../types';
import type { BusinessConfig } from '../../data';
import { getAssetPath } from '../../firebase';
import { getServiceBySlug } from '../../serviceCatalog';
import { generateServicePageSeo } from './servicePageSeo';

interface ServiceDetailsPageProps {
  services: TechnicalService[];
  cart: Record<string, CartItem>;
  onAddToCart: (service: TechnicalService, brand?: string) => void;
  onRemoveFromCart: (serviceId: string, brand?: string) => void;
  onProceedToCheckout: () => void;
  businessConfig: BusinessConfig;
}

const REVIEWS = [
  {
    name: 'Jitesh Hassani',
    date: 'May 30, 2026',
    rating: 5,
    service: 'For Home Service Repair',
    text: 'Very professional and knowledgeable technician. Arrived on time, completed the work efficiently, and ensured everything was working perfectly. Highly satisfied.'
  },
  {
    name: 'Sanitha',
    date: 'May 28, 2026',
    rating: 5,
    service: 'For Appliance Diagnostics & Repair',
    text: 'The service is excellent and so genuine in feedback. The technician guided us honestly regarding spare parts and repairs that were not required, saving us money. Really appreciate his work ethic and morals.'
  },
  {
    name: 'Rajesh Kumar',
    date: 'May 15, 2026',
    rating: 5,
    service: 'For AC Maintenance & Gas Check',
    text: 'Amazing experience! He diagnosed the leakage quickly and fixed it right away. The cooling is back to normal now. Professional behaviour throughout.'
  }
];

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

  const catalogEntry = serviceSlug ? getServiceBySlug(serviceSlug) : undefined;
  const service = catalogEntry ? services.find(s => s.id === catalogEntry.id) : undefined;

  if (!service || !catalogEntry) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center font-sans">
        <h2 className="text-xl font-black text-gray-900">Service Not Found</h2>
        <p className="text-sm text-gray-500 mt-2">The service details you are looking for do not exist or have been moved.</p>
        <Link 
          to="/" 
          className="mt-6 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:bg-slate-800"
        >
          Go Back Home
        </Link>
      </div>
    );
  }

  // Count image occurrences across the entire catalog to identify duplicates dynamically
  const imageUrlCounts: Record<string, number> = {};
  services.forEach(s => {
    if (s.imageUrl) {
      imageUrlCounts[s.imageUrl] = (imageUrlCounts[s.imageUrl] || 0) + 1;
    }
  });

  const isUniqueImage = service.imageUrl && imageUrlCounts[service.imageUrl] === 1;

  const getFallbackStyle = (category: string, subcategory: string) => {
    const cat = category.toLowerCase();
    const sub = subcategory.toLowerCase();
    
    if (cat.includes('ac')) {
      return 'from-cyan-500/10 to-blue-500/5 border-cyan-200 text-cyan-600';
    }
    if (sub.includes('purifier') || sub.includes('ro')) {
      return 'from-emerald-500/10 to-teal-500/5 border-emerald-200 text-emerald-650';
    }
    if (sub.includes('washing') || sub.includes('tub')) {
      return 'from-blue-500/10 to-indigo-500/5 border-blue-200 text-blue-650';
    }
    if (sub.includes('geyser')) {
      return 'from-amber-500/10 to-orange-500/5 border-amber-200 text-amber-600';
    }
    if (sub.includes('refrigerator') || sub.includes('fridge')) {
      return 'from-indigo-500/10 to-purple-500/5 border-indigo-200 text-indigo-600';
    }
    if (cat.includes('fan')) {
      return 'from-teal-500/10 to-emerald-500/5 border-teal-200 text-teal-600';
    }
    if (cat.includes('light')) {
      return 'from-orange-500/10 to-amber-500/5 border-orange-200 text-orange-600';
    }
    if (cat.includes('electrician') || sub.includes('switch') || sub.includes('mcb')) {
      return 'from-yellow-500/10 to-amber-500/5 border-yellow-200 text-yellow-600';
    }
    return 'from-slate-500/10 to-zinc-500/5 border-slate-200 text-slate-600';
  };

  const getFallbackIcon = (category: string, subcategory: string) => {
    const cat = category.toLowerCase();
    const sub = subcategory.toLowerCase();
    
    if (cat.includes('ac')) {
      return <Wind size={32} className="animate-pulse" />;
    }
    if (sub.includes('purifier') || sub.includes('ro')) {
      return <Droplets size={32} />;
    }
    if (sub.includes('washing') || sub.includes('tub')) {
      return <Wrench size={32} />;
    }
    if (sub.includes('geyser')) {
      return <Flame size={32} />;
    }
    if (sub.includes('refrigerator') || sub.includes('fridge')) {
      return <ShieldCheck size={32} />;
    }
    if (cat.includes('fan')) {
      return <Settings size={32} />;
    }
    if (cat.includes('light')) {
      return <Lightbulb size={32} />;
    }
    if (cat.includes('electrician') || sub.includes('switch') || sub.includes('mcb')) {
      return <Zap size={32} />;
    }
    return <Settings size={32} />;
  };

  // Get service quantity in cart
  const qtyInCart = Object.values(cart)
    .filter(item => item.serviceId === service.id)
    .reduce((sum, item) => sum + item.quantity, 0);

  const getFirstCartItemKey = () => {
    const found = Object.entries(cart).find(([, item]) => item.serviceId === service.id);
    return found ? found[0] : null;
  };

  const itemKey = getFirstCartItemKey();

  const handleAddToCartClick = () => {
    onAddToCart(service);
  };

  const breadcrumbsList = [
    { label: 'Services', path: '/services' },
    { label: service.category, path: '/' }, // Goes back to categories explorer on homepage
    { label: service.name, path: window.location.pathname }
  ];

  const siteDomain = businessConfig.website.startsWith('http') ? businessConfig.website : `https://${businessConfig.website}`;
  const canonicalUrl = `${siteDomain}/services/${catalogEntry?.slug}`;
  const seoContent = catalogEntry ? generateServicePageSeo(service, catalogEntry, businessConfig) : null;

  return (
    <>
      <Helmet>
        <title>{seoContent?.title ?? `${service.name} Service & Repair | ${businessConfig.name}`}</title>
        <meta name="description" content={seoContent?.description ?? service.description} />
        <meta name="keywords" content={seoContent?.keyword} />
        <link rel="canonical" href={canonicalUrl} />
        {seoContent && (
          <>
            <script type="application/ld+json">{JSON.stringify(seoContent.serviceSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(seoContent.faqSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(seoContent.breadcrumbSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(seoContent.localBusinessSchema)}</script>
          </>
        )}
      </Helmet>

      {/* Breadcrumb path navigation */}
      <Breadcrumbs items={breadcrumbsList} />

      <div className="bg-slate-50 py-10 font-sans">
        <div className="max-w-4xl mx-auto px-4 space-y-8 text-left">
          
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors cursor-pointer select-none"
          >
            <ArrowLeft size={14} />
            <span>Go Back</span>
          </button>

          {/* Main Service Card Container */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md grid grid-cols-1 md:grid-cols-3 gap-8 items-start relative overflow-hidden">
            
            {/* Left Column: Image or Gradient Fill Fallback */}
            <div className="md:col-span-1 aspect-square w-full rounded-2xl bg-slate-50 border border-slate-150 overflow-hidden relative flex items-center justify-center select-none shadow-xs">
              {isUniqueImage ? (
                <img 
                  src={getAssetPath(service.imageUrl)} 
                  alt={service.name} 
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const fallback = parent.querySelector('.image-fallback-fill-page');
                      if (fallback) fallback.classList.remove('hidden');
                    }
                  }}
                />
              ) : null}

              {/* Beautiful Fallback Fill */}
              <div className={`image-fallback-fill-page w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br ${getFallbackStyle(service.category, service.subcategory)} ${isUniqueImage ? 'hidden absolute inset-0' : ''}`}>
                <div className="p-3 bg-white/85 rounded-xl shadow-xs border border-black/5">
                  {getFallbackIcon(service.category, service.subcategory)}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest mt-3 block opacity-85 leading-none">
                  {service.code}
                </span>
              </div>
            </div>

            {/* Right Column: Detailed Info & Booking */}
            <div className="md:col-span-2 space-y-5">
              <div className="space-y-2">
                <span className="bg-blue-500/10 border border-blue-500/20 text-brand-blue text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md inline-block select-none">
                  {service.category} • {service.subcategory}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  {service.name}
                </h1>
                
                {/* Rating Row */}
                <div className="flex items-center space-x-1.5 text-xs text-gray-500 font-bold select-none">
                  <div className="flex items-center text-yellow-500">
                    <Star size={12} fill="currentColor" />
                  </div>
                  <span>{service.rating}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-semibold">
                {service.description}
              </p>

              {/* Price, Duration & Warranty Details */}
              <div className="grid grid-cols-3 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4 text-center select-none font-sans">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wide block">Price Rate</span>
                  <span className="text-sm font-black text-gray-900 block">₹{service.price}</span>
                </div>
                <div className="space-y-0.5 border-x border-slate-200">
                  <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wide block">Duration</span>
                  <span className="text-sm font-bold text-gray-750 block flex items-center justify-center">
                    <Clock size={11} className="mr-1 text-brand-blue" />
                    {service.duration}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wide block">Warranty</span>
                  <span className="text-xs font-bold text-green-600 block">{service.warranty}</span>
                </div>
              </div>

              {/* Booking Controls */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between select-none">
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-gray-400 font-bold uppercase">Estimated Bill</span>
                  <span className="text-xl font-black text-brand-blue leading-tight">₹{service.price * (qtyInCart || 1)}</span>
                </div>

                <div className="flex gap-3">
                  {qtyInCart > 0 && itemKey ? (
                    <div className="bg-white text-brand-blue border-2 border-brand-blue shadow-sm rounded-xl py-2 px-4 text-sm font-black flex items-center justify-between min-w-[120px] h-11">
                      <button
                        type="button"
                        onClick={() => onRemoveFromCart(service.id, cart[itemKey]?.brand)}
                        className="text-brand-blue hover:text-brand-blue-dark hover:bg-blue-50 p-1 rounded cursor-pointer transition-colors"
                      >
                        <Minus size={14} strokeWidth={3} />
                      </button>
                      <span className="text-sm font-black text-gray-800 px-3">{qtyInCart}</span>
                      <button
                        type="button"
                        onClick={() => onAddToCart(service, cart[itemKey]?.brand)}
                        className="text-brand-blue hover:text-brand-blue-dark hover:bg-blue-50 p-1 rounded cursor-pointer transition-colors"
                      >
                        <Plus size={14} strokeWidth={3} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAddToCartClick}
                      className="bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl px-6 py-3 text-xs font-black uppercase tracking-wider shadow-sm transition-all active:scale-95 cursor-pointer h-11 flex items-center justify-center"
                    >
                      Add to Booking
                    </button>
                  )}
                  
                  {qtyInCart > 0 && (
                    <button
                      type="button"
                      onClick={onProceedToCheckout}
                      className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 py-3 text-xs font-black uppercase tracking-wider shadow-sm transition-all active:scale-95 cursor-pointer h-11 flex items-center justify-center"
                    >
                      Checkout Now
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>

          {seoContent && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm text-left space-y-6">
              <h2 className="text-gray-900 font-black text-lg sm:text-xl tracking-tight">
                Local Service Coverage & Areas We Serve
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {seoContent.intro} {seoContent.localHighlights}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {seoContent.areasServed.map((area, idx) => (
                  <Link
                    key={idx}
                    to={area.path}
                    className="bg-white hover:bg-orange-50 border border-slate-200 hover:border-brand-orange/30 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-wide text-slate-800 transition-all"
                  >
                    {area.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {seoContent && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md text-left space-y-6">
              <h2 className="text-gray-900 font-black text-lg sm:text-xl uppercase tracking-wider border-b border-slate-100 pb-2">
                Related Services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {seoContent.relatedServices.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.path}
                    className="group block rounded-3xl border border-slate-200 p-5 bg-slate-50 hover:bg-slate-100 transition-all shadow-sm"
                  >
                    <span className="text-xs text-slate-500 uppercase tracking-[0.24em] font-bold">Related</span>
                    <p className="mt-3 text-sm font-black text-gray-900 leading-tight group-hover:text-brand-blue">
                      {item.label}
                    </p>
                    <span className="mt-4 inline-flex items-center text-[10px] font-black uppercase tracking-widest text-brand-orange">
                      View Service →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {seoContent && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md text-left space-y-6">
              <h2 className="text-gray-900 font-black text-lg sm:text-xl uppercase tracking-wider border-b border-slate-100 pb-2">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {seoContent.faqList.map((faq, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <h3 className="text-sm font-black text-gray-900 leading-tight">{faq.q}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mt-2">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Service Process Flow */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md text-left space-y-6">
            <h2 className="text-gray-900 font-black text-lg sm:text-xl uppercase tracking-wider border-b border-slate-100 pb-2">
              Our Professional Process
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 select-none">
              {[
                { step: '1', title: 'Doorstep Visit & Scan', desc: 'Technician arrives on-site and conducts safety diagnostics.' },
                { step: '2', title: 'Approved Quote', desc: 'Work begins only after you approve our transparent rate chart.' },
                { step: '3', title: 'Repair & OEM Spares', desc: 'Faulty parts replaced with genuine, branded, safety spares.' },
                { step: '4', title: 'Sanitize & Warranty', desc: 'Clean work area and activate the 30-Day Service Guarantee.' }
              ].map((proc, idx) => (
                <div key={idx} className="space-y-2 border border-slate-150 p-4 rounded-xl bg-slate-50/50">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                    {proc.step}
                  </div>
                  <h3 className="font-extrabold text-xs text-gray-900 leading-tight">{proc.title}</h3>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{proc.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Customer Reviews */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md text-left space-y-6">
            <h2 className="text-gray-900 font-black text-lg sm:text-xl uppercase tracking-wider border-b border-slate-100 pb-2">
              Verified Customer Reviews
            </h2>
            
            {/* Star Rating Breakdown summary */}
            <div className="flex items-center space-x-6 select-none bg-slate-50 p-5 rounded-xl border border-slate-200">
              <div className="text-center">
                <span className="text-3xl sm:text-4xl font-black text-gray-900 leading-none">4.9</span>
                <span className="text-xs text-gray-400 block font-bold mt-1">out of 5</span>
              </div>
              <div className="flex-1 space-y-1">
                {[
                  { star: 5, pct: '85%' },
                  { star: 4, pct: '11%' },
                  { star: 3, pct: '3%' },
                  { star: 2, pct: '1%' },
                  { star: 1, pct: '0%' }
                ].map((row) => (
                  <div key={row.star} className="flex items-center text-[10px] sm:text-xs font-bold text-gray-500">
                    <span className="w-2.5">{row.star}</span>
                    <Star size={8} fill="currentColor" className="text-yellow-500 ml-0.5 mr-2" />
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-800 rounded-full" style={{ width: row.pct }} />
                    </div>
                    <span className="w-8 text-right ml-2 text-gray-400">{row.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Reviews Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {REVIEWS.map((rev, idx) => (
                <div key={idx} className="border border-slate-200 p-4 rounded-xl flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-gray-900">{rev.name}</span>
                      <span className="text-gray-400 text-[10px] font-semibold">{rev.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} size={9} fill="currentColor" className="text-yellow-500" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 font-semibold leading-relaxed italic">
                      "{rev.text}"
                    </p>
                  </div>
                  <span className="text-[9px] text-brand-blue bg-blue-50/55 border border-blue-100 px-2 py-0.5 rounded font-black self-start uppercase">
                    {rev.service}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ServiceDetailsPage;
