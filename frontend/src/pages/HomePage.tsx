import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Clock, Flame, Wrench, Droplets, Zap, Shield, 
  Settings, BookOpen, Calendar, Phone, MessageSquare, 
  Search, ChevronDown, ChevronUp, ChevronRight, Star
} from 'lucide-react';
import { ServiceGrid } from '../components/ServiceGrid';
import { blogPostsData } from '../blogData';
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

export const HomePage: React.FC<HomePageProps> = ({
  searchQuery,
  setSearchQuery,
  spellingCorrection,
  setSelectedCategory,
  filteredServices,
  cart,
  onSearchSubmit,
  onAddToCart,
  onRemoveFromCart,
  onProceedToCheckout,
  businessConfig
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeGalleryFilter, setActiveGalleryFilter] = useState('ALL');
  const [showRecentSearch, setShowRecentSearch] = useState(false);

  const popularSearches = ['Split AC Jet Cleaning', 'RO Membrane Replacement', 'MCB Tripping Repair', 'Balcony Pigeon Netting'];
  const recentSearches = ['Washing Machine Drum Fix', 'Double Door Fridge Gas Charging'];

  const categoryCards = [
    {
      title: 'RO Water Purifier',
      titleHindi: 'आरओ वाटर प्यूरीफायर',
      icon: <Droplets className="text-blue-500 w-6 h-6" />,
      path: '/services/ro-service',
      startingPrice: '₹299',
      responseTime: '30 Min',
      desc: 'Complete RO repair, filter replacement, TDS tuning, leak fixing, and new water purifier installation.'
    },
    {
      title: 'Washing Machine',
      titleHindi: 'वाशिंग मशीन सर्विस',
      icon: <Wrench className="text-blue-500 w-6 h-6" />,
      path: '/services/washing-machine-repair',
      startingPrice: '₹349',
      responseTime: '45 Min',
      desc: 'Expert diagnostics for drum spinning failure, extreme vibrations, drain blockages, and tub deep jet cleaning.'
    },
    {
      title: 'Geyser Service',
      titleHindi: 'गीजर मरम्मत व सर्विस',
      icon: <Flame className="text-orange-500 w-6 h-6" />,
      path: '/services/geyser-service',
      startingPrice: '₹249',
      responseTime: '30 Min',
      desc: 'Professional geyser thermostat repair, tank leakage sealing, electrical shock checks, and chemical descaling.'
    },
    {
      title: 'AC Services',
      titleHindi: 'एसी सर्विस व रिपेयर',
      icon: <Flame className="text-cyan-500 w-6 h-6" />,
      path: '/services/ac-service',
      startingPrice: '₹399',
      responseTime: '30 Min',
      desc: 'High-pressure AC jet wash, cooling diagnostics, gas leakage welding, and R32/R22 gas refilling.'
    },
    {
      title: 'Refrigerator Repair',
      titleHindi: 'रेफ्रिजरेटर मरम्मत',
      icon: <Shield className="text-blue-500 w-6 h-6" />,
      path: '/services/refrigerator-repair',
      startingPrice: '₹299',
      responseTime: '45 Min',
      desc: 'Single & double door fridge repairs, compressor relay replacement, gas charging, and sanitizing deep cleans.'
    },
    {
      title: 'Kitchen Chimney',
      titleHindi: 'किचन चिमनी सर्विस',
      icon: <Settings className="text-orange-500 w-6 h-6" />,
      path: '/services/chimney-service',
      startingPrice: '₹499',
      responseTime: '60 Min',
      desc: 'Suction power restoration, motor bearing lubrication, and caustic soda chemical filter degreasing.'
    },
    {
      title: 'Microwave Oven',
      titleHindi: 'माइक्रोवेव रिपेयर',
      icon: <Settings className="text-purple-500 w-6 h-6" />,
      path: '/services/microwave-service',
      startingPrice: '₹299',
      responseTime: '30 Min',
      desc: 'Fixing microwave non-heating, internal sparks, synchronous turntable motor failure, and radiation safety checks.'
    },
    {
      title: 'Electrician Services',
      titleHindi: 'बिजली मरम्मत व फिटिंग',
      icon: <Zap className="text-yellow-500 w-6 h-6" />,
      path: '/services/electrician-service',
      startingPrice: '₹49',
      responseTime: '25 Min',
      desc: 'Residential wiring tracing, short circuit repair, smart MCB & distribution box upgrade, and inverter service.'
    },
    {
      title: 'Fan Services',
      titleHindi: 'पंखे की फिटिंग व रिपेयर',
      icon: <Settings className="text-emerald-500 w-6 h-6" />,
      path: '/services/fan-service',
      startingPrice: '₹99',
      responseTime: '30 Min',
      desc: 'Installing ceiling fans, decorative designer fans, and smart BLDC fans with remote pairing setup.'
    },
    {
      title: 'Light Services',
      titleHindi: 'लाइटींग व झूमर फिटिंग',
      icon: <Flame className="text-yellow-500 w-6 h-6" />,
      path: '/services/light-service',
      startingPrice: '₹99',
      responseTime: '35 Min',
      desc: 'Installing false ceiling recessed LED panels, wall sconces, tube lights, and heavy decorative chandeliers.'
    },
    {
      title: 'Home Installations',
      titleHindi: 'होम इंस्टॉलेशन व अन्य कार्य',
      icon: <Shield className="text-slate-500 w-6 h-6" />,
      path: '/services/home-installations',
      startingPrice: '₹149',
      responseTime: '40 Min',
      desc: 'Balcony pigeon net installation, tap leak repair, sink plumbing, cupboard hinge alignment, and locks replacement.'
    }
  ];

  const serviceExpert = {
    name: 'Kaushindra Singh',
    role: 'Chief Electrical & AC Technician',
    experience: '12+ Years Experience',
    expertise: 'Electrical Services, Air Conditioner Repair, RO Systems & Home Appliances',
    certification: 'Experienced Field Technician | Quality Service | Customer Satisfaction',
    rating: '4.9 / 5.0',
    badge: '12+ Years Experience',
    img: '/profile.webp'
  };

  const galleryItems = [
    { title: 'Split AC Cleaning', category: 'AC', img: '/ac_service_pro.jpg' },
    { title: 'RO Filtration Service', category: 'RO', img: '/ro_service_pro.jpg' },
    { title: 'Smart MCB Upgrade', category: 'Electrical', img: '/electrician_pro.jpg' },
    { title: 'Heavy Chandelier Installation', category: 'Electrical', img: '/washing_machine_pro.jpg' }
  ];

  const filteredGallery = activeGalleryFilter === 'ALL' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeGalleryFilter);

  const faqs = [
    { q: 'How quickly can a technician visit my home?', a: 'We typically assign and dispatch a certified technician within 30 to 45 minutes of booking for Gaur City and Noida Extension locations.' },
    { q: 'Do you use genuine spare parts for repairs?', a: 'Yes, we source only 100% genuine, manufacturer-approved spare parts and provide a transparent bill for all replacements.' },
    { q: 'Is there a warranty on your doorstep services?', a: 'Absolutely. We offer a full 30-day service warranty. If the same issue recurs within 30 days, we fix it at zero cost.' },
    { q: 'How do I pay for the completed service?', a: 'You can pay securely via UPI, Google Pay, PhonePe, Paytm, Cash, or Credit/Debit Cards after the repair is completed to your satisfaction.' }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(faqSearchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(faqSearchQuery.toLowerCase())
  );



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



  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <>
      <Helmet>
        <title>KS Electrical & AC Services | Professional Home Appliance Repair in Noida</title>
        <meta name="description" content="Book certified same-day AC service, RO filter replacement, electrician, washing machine repair, refrigerator maintenance & chimney cleaning in Noida, Greater Noida & Ghaziabad. 4.9★ rated, 5000+ jobs completed." />
        <link rel="canonical" href="https://www.kselectrical.in/" />
        <meta property="og:title" content="KS Electrical & AC Services | Professional Doorstep Repair" />
        <meta property="og:description" content="Certified same-day AC repair, RO service, electrician & appliance repair in Noida, Greater Noida & Ghaziabad. 4.9★ on Google, 5000+ satisfied customers." />
        <meta property="og:image" content="https://www.kselectrical.in/hero_technician.jpg" />
        <meta property="og:url" content="https://www.kselectrical.in/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="KS Electrical & AC Services | Doorstep Repair" />
        <meta name="twitter:description" content="Same-day AC, RO, electrician & appliance repair in Noida, Greater Noida. Verified technicians. 4.9★ rated." />
        <meta name="twitter:image" content="https://www.kselectrical.in/hero_technician.jpg" />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-[#08182D] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans border-b border-slate-900">
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none select-none" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#F97316]/5 rounded-full blur-[120px] pointer-events-none select-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full text-xs font-black text-blue-400 select-none">
              <span className="w-2 h-2 rounded-full bg-[#F97316] animate-ping" />
              <span className="uppercase tracking-widest text-[9px]">Emergency Household Repairs Dispatch</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-white">
                Premium Home Services <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-[#F97316]">
                  At Your Doorstep
                </span>
              </h1>
              <p className="text-slate-350 text-sm sm:text-base max-w-xl font-medium leading-relaxed">
                Experience premium convenience similar to top international startups. Certified mechanics, upfront flat prices, and genuine spare parts.
              </p>
            </div>

            {/* Premium Search Component */}
            <div className="relative max-w-lg select-none" role="search">
              <div className="flex items-center bg-white border border-slate-300 rounded-[20px] shadow-search overflow-hidden p-1.5 focus-within:ring-4 focus-within:ring-blue-100 transition-all duration-200">
                <Search className="text-slate-400 w-5 h-5 ml-3.5 shrink-0" aria-hidden="true" />
                <input
                  id="service-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      onSearchSubmit(searchQuery);
                    }
                  }}
                  onFocus={() => setShowRecentSearch(true)}
                  onBlur={() => setTimeout(() => setShowRecentSearch(false), 200)}
                  placeholder="Search for RO service, AC repair, Electrician..."
                  aria-label="Search for home appliance repair services"
                  aria-autocomplete="list"
                  aria-controls="search-suggestions"
                  className="w-full text-slate-800 text-sm font-semibold px-3 py-2.5 bg-transparent focus:outline-none placeholder-slate-400"
                  autoComplete="off"
                />
              </div>

              {/* Autocomplete Dropdown */}
              {showRecentSearch && !searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-300 rounded-[20px] shadow-dropdown p-4 z-30 animate-in fade-in slide-in-from-top-2 duration-150 text-left">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Popular Searches</h4>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSearchQuery(item)}
                            className="bg-slate-50 hover:bg-blue-50 border border-slate-300 hover:border-blue-300 text-slate-600 hover:text-blue-600 rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-200 cursor-pointer"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Recent Searches</h4>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSearchQuery(item)}
                            className="bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-600 rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-200 cursor-pointer"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Core Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 select-none">
              <div className="text-left">
                <span className="block text-2xl sm:text-3xl font-black text-[#F97316]">5000+</span>
                <span className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">Jobs Completed</span>
              </div>
              <div className="text-left">
                <span className="block text-2xl sm:text-3xl font-black text-white">100%</span>
                <span className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">Verified Pros</span>
              </div>
              <div className="text-left">
                <span className="block text-2xl sm:text-3xl font-black text-emerald-400">4.9★</span>
                <span className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">Google Rating</span>
              </div>
              <div className="text-left">
                <span className="block text-2xl sm:text-3xl font-black text-blue-400">30 Min</span>
                <span className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">Response Time</span>
              </div>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <Link
                to="/services"
                className="inline-flex items-center justify-center rounded-2xl bg-brand-orange px-5 py-3 text-sm font-black text-white transition hover:bg-orange-500 shadow-sm"
              >
                Our Services
              </Link>
              <Link
                to="/ac-on-rent"
                className="inline-flex items-center justify-center rounded-2xl bg-brand-orange px-5 py-3 text-sm font-black text-white transition hover:bg-orange-500 shadow-sm"
              >
                AC on Rent
              </Link>
              <a
                href={`tel:${businessConfig.contacts[0]}`}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-900 transition hover:bg-slate-100 shadow-sm"
              >
                Call Now
              </a>
              <a
                href={businessConfig.reviewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-900 transition hover:bg-slate-100 shadow-sm"
              >
                <Star size={14} className="fill-amber-400 text-amber-400 shrink-0" />
                <span>Google Review</span>
              </a>
            </div>
          </div>

          {/* Right Column (Banner Illustration) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-[#0c223c] p-2 aspect-[4/3] w-full max-w-md group">
              <img
                src="/hero_technician.jpg"
                alt="KS Electrical certified technician servicing home AC unit at customer doorstep"
                width={800}
                height={600}
                className="w-full h-full object-cover rounded-2xl group-hover:scale-103 transition-transform duration-700 brightness-95"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08182D]/90 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 text-left">
                <span className="bg-[#F97316] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded shadow-md">
                  Premium Standard
                </span>
                <p className="text-white font-extrabold text-base mt-2">Professional Doorstep Diagnostic & Repair</p>
                <p className="text-slate-350 text-xs mt-0.5 font-medium">Equipped with advanced calibrations & calibration tools.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Category Section */}
      <section className="bg-[#f8f9fa] py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {searchQuery ? (
            <div className="space-y-6 text-left">
              <div>
                <h2 className="text-gray-900 font-black text-2xl tracking-tight">Search Results ({filteredServices.length})</h2>
                <p className="text-xs text-gray-500 font-semibold mt-1">Showing matches for "{searchQuery}"</p>
                
                {spellingCorrection && (
                  <p className="text-xs font-bold text-gray-600 mt-2">
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
                <div className="ui-card p-8 text-center space-y-4 max-w-lg mx-auto mt-6">
                  <p className="text-gray-650 font-extrabold text-sm">No services found matching your criteria.</p>
                  <p className="text-gray-400 text-xs">
                    Try checking the spelling, using alternate words, or explore our popular categories below:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {['AC Service', 'Washing Machine Repair', 'Electrician', 'RO Service'].map((pop) => (
                      <button
                        key={pop}
                        onClick={() => setSearchQuery(pop)}
                        className="bg-slate-50 hover:bg-orange-50 border border-slate-300 hover:border-brand-orange text-slate-700 hover:text-brand-orange font-semibold px-3 py-1.5 rounded-full text-xs transition-all duration-200 cursor-pointer"
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
              <div className="text-center space-y-3">
                <span className="text-[10px] text-blue-600 bg-blue-600/10 border border-blue-600/20 px-3.5 py-1.5 rounded-full font-black uppercase tracking-widest">
                  Certified Core Specialties
                </span>
                <h2 className="text-slate-900 font-black text-3xl sm:text-4xl tracking-tight">
                  Browse Services By Category
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed">
                  Select a category to explore upfront price structures and customize your booking.
                </p>
              </div>

              {/* Redesigned Premium Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="ui-card ui-card-hover p-6 flex flex-col justify-between text-left relative overflow-hidden group hover:border-blue-500/30"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center shadow-xs">
                          {card.icon}
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-blue-50 text-blue-600 border border-blue-100 select-none">
                          {card.responseTime} Dispatch
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-slate-900 font-black text-lg sm:text-xl">{card.title}</h3>
                        <p className="text-xs text-slate-400 font-extrabold tracking-wide uppercase">{card.titleHindi}</p>
                      </div>

                      <p className="text-xs text-slate-500 font-semibold leading-relaxed pt-2 border-t border-slate-100 line-clamp-3">
                        {card.desc}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="block text-[9px] text-slate-450 font-black uppercase tracking-wider">Starting From</span>
                        <span className="block text-slate-900 font-black text-base mt-0.5">{card.startingPrice}</span>
                      </div>
                      <Link
                        to={card.path}
                        onClick={() => setSelectedCategory(card.title)}
                        className="bg-slate-900 hover:bg-[#F97316] text-white rounded-2xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 select-none hover:-translate-y-0.5 cursor-pointer shadow-button active:scale-95"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

            </>
          )}

        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] text-orange-600 bg-orange-500/10 border border-orange-500/20 px-3.5 py-1.5 rounded-full font-black uppercase tracking-widest">
              Quality Assurance
            </span>
            <h2 className="text-slate-900 font-black text-3xl sm:text-4xl tracking-tight">
              Why Noida Trusts KS Electrical
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed">
              We focus on premium delivery standards, background checking, and customer delight.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 select-none">
            {[
              { title: 'Verified Engineers', desc: 'Trained technical pros with strict verification.', icon: '👨‍🔧' },
              { title: 'Genuine Spare Parts', desc: '100% brand-approved authentic spares.', icon: '⚙️' },
              { title: 'Transparent Pricing', desc: 'Upfront flat prices matching our catalog.', icon: '🏷️' },
              { title: '30-Day Covered Warranty', desc: 'Full warranty for ultimate peace of mind.', icon: '🛡️' }
            ].map((item, idx) => (
              <div
                key={idx}
                className="ui-card ui-card-hover bg-slate-50/80 p-6 text-left space-y-4"
              >
                <div className="text-3xl">{item.icon}</div>
                <div className="space-y-1">
                  <h4 className="text-slate-900 font-extrabold text-sm sm:text-base">{item.title}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After Slider Section */}
      <section className="bg-[#f8f9fa] py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200 select-none">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 text-left space-y-6">
            <span className="text-[10px] text-blue-600 bg-blue-600/10 border border-blue-600/20 px-3.5 py-1.5 rounded-full font-black uppercase tracking-widest">
              Visual Diagnostics
            </span>
            <h2 className="text-slate-900 font-black text-3xl sm:text-4xl tracking-tight leading-tight">
              Appliance Service Quality Comparison
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed">
              Drag the interactive slider to see the difference between a dirty, non-cooling AC evaporator coil and a clean, chemically serviced KS Electrical coil.
            </p>
            <div className="flex items-center space-x-3.5 text-xs text-slate-650 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
              <span>Restores 100% cooling & airflow efficiency.</span>
            </div>
          </div>

          <div className="lg:col-span-7 flex justify-center">
            <div 
              className="relative w-full max-w-xl aspect-[16/10] rounded-2xl overflow-hidden border border-slate-350 shadow-2xl cursor-ew-resize select-none"
              onMouseMove={handleSliderMove}
              onTouchMove={handleSliderMove}
            >
              {/* Before Image */}
              <img 
                src="/ac_service_pro.jpg" 
                alt="Before repair service" 
                className="absolute inset-0 w-full h-full object-cover select-none"
              />
              
              {/* After Image */}
              <div 
                className="absolute inset-y-0 right-0 overflow-hidden select-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <img 
                  src="/ro_service_pro.jpg" 
                  alt="After repair service" 
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
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] text-blue-600 bg-blue-600/10 border border-blue-600/20 px-3.5 py-1.5 rounded-full font-black uppercase tracking-widest">
              Execution Path
            </span>
            <h2 className="text-slate-900 font-black text-3xl sm:text-4xl tracking-tight">
              How It Works
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed">
              Book a verified mechanic in less than 30 seconds with 6 simple stages.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 select-none">
            {[
              { step: '01', title: 'Book Service', desc: 'Select menu & submit phone.' },
              { step: '02', title: 'Technician Match', desc: 'Assigned within 15 Min.' },
              { step: '03', title: 'Visits Home', desc: 'Technician arrives on time.' },
              { step: '04', title: 'Repairs Unit', desc: 'Diagnosis & replacement.' },
              { step: '05', title: 'Easy Payment', desc: 'UPI, Cash or card.' },
              { step: '06', title: '30-Day Cover', desc: 'Warranty active instantly.' }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#f8f9fa] border border-slate-200 rounded-2xl p-5 text-left flex flex-col justify-between h-40 hover:border-blue-500/20 transition-all"
              >
                <span className="text-xs font-black text-blue-600 bg-blue-50 border border-blue-100 rounded-md px-2 py-0.5 w-max select-none">
                  {item.step}
                </span>
                <div className="space-y-1 pt-4">
                  <h4 className="text-slate-900 font-extrabold text-sm">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certified Technicians Section */}
      <section className="bg-[#f8f9fa] py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] text-orange-600 bg-orange-500/10 border border-orange-500/20 px-3.5 py-1.5 rounded-full font-black uppercase tracking-widest">
              Trained Specialists
            </span>
            <h2 className="text-slate-900 font-black text-3xl sm:text-4xl tracking-tight">
              Meet Your Service Expert
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed">
              Professional doorstep repair services with 12+ years of practical experience in Electrical, AC, RO, Washing Machine and Home Appliance repairs.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/10 rounded-[1.5rem] p-8 sm:p-10">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="w-full lg:w-1/3 flex flex-col justify-center items-center">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-[1.5rem] bg-slate-100 border border-slate-200 overflow-hidden shadow-sm shadow-slate-200/70">
                    <img
                      src={serviceExpert.img}
                      alt={serviceExpert.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-slate-900 font-black text-lg sm:text-xl mt-4 text-center">
                    {serviceExpert.name}
                  </h4>
                </div>
                <div className="w-full lg:w-2/3 space-y-6 text-center lg:text-left">
                  <div className="space-y-3">
                    <h3 className="text-slate-900 font-black text-3xl sm:text-4xl tracking-tight">
                      Meet Your Service Expert
                    </h3>
                    <p className="text-slate-500 text-sm sm:text-base font-semibold max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                      Professional doorstep repair services with 12+ years of practical experience in Electrical, AC, RO, Washing Machine and Home Appliance repairs.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500 font-semibold">
                        Designation
                      </p>
                      <p className="text-slate-900 font-black text-base mt-2">
                        {serviceExpert.role}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500 font-semibold">
                        Experience
                      </p>
                      <p className="text-slate-900 font-black text-base mt-2">
                        {serviceExpert.badge}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500 font-semibold">
                      Expertise
                    </p>
                    <p className="text-slate-900 font-semibold text-sm sm:text-base mt-2 leading-relaxed">
                      {serviceExpert.expertise}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500 font-semibold">
                        Certification
                      </p>
                      <p className="text-slate-900 font-semibold text-sm sm:text-base mt-2 leading-relaxed">
                        {serviceExpert.certification}
                      </p>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-[#F97316] font-black text-sm">
                      <span className="text-2xl">⭐</span>
                      <span>{serviceExpert.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cities / Areas Covered */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] text-blue-600 bg-blue-600/10 border border-blue-600/20 px-3.5 py-1.5 rounded-full font-black uppercase tracking-widest">
              Geographical Reach
            </span>
            <h2 className="text-slate-900 font-black text-3xl sm:text-4xl tracking-tight">
              Service Locations
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed">
              We provide swift doorstep appliance repair visits across Noida and Ghaziabad extension areas.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 select-none">
            {[
              { name: 'Noida', desc: 'Sectors 12-150' },
              { name: 'Greater Noida', desc: 'Gamma, Alpha, Delta' },
              { name: 'Ghaziabad', desc: 'Indirapuram, Vasundhara' },
              { name: 'Noida Extension', desc: 'Gaur City 1 & 2' },
              { name: 'Delhi NCR', desc: 'Selected sectors' }
            ].map((loc, idx) => (
              <div
                key={idx}
                className="bg-[#f8f9fa] border border-slate-200 rounded-2xl p-5 text-left hover:border-[#F97316]/20 transition-all"
              >
                <h4 className="text-slate-900 font-extrabold text-sm sm:text-base">{loc.name}</h4>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">{loc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Image Gallery */}
      <section className="bg-[#f8f9fa] py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] text-orange-600 bg-orange-500/10 border border-orange-500/20 px-3.5 py-1.5 rounded-full font-black uppercase tracking-widest">
              Work Portfolio
            </span>
            <h2 className="text-slate-900 font-black text-3xl sm:text-4xl tracking-tight">
              Doorstep Service Gallery
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed">
              Real snapshots of repair jobs completed in Gaur City and Noida Extension.
            </p>
          </div>

          {/* Filters */}
          <div className="flex justify-center space-x-2.5 select-none">
            {['ALL', 'AC', 'RO', 'Electrical'].map((filter, idx) => (
              <button
                key={idx}
                onClick={() => setActiveGalleryFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeGalleryFilter === filter 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white border border-slate-250 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filteredGallery.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-[4/3] w-full bg-slate-50 overflow-hidden relative border-b border-slate-150">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 text-left">
                  <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded select-none">
                    {item.category}
                  </span>
                  <h4 className="text-slate-900 font-extrabold text-xs sm:text-sm mt-2">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] text-blue-600 bg-blue-600/10 border border-blue-600/20 px-3.5 py-1.5 rounded-full font-black uppercase tracking-widest">
              Information Portal
            </span>
            <h2 className="text-slate-900 font-black text-3xl sm:text-4xl tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed">
              Find quick answers to common queries regarding diagnostic visits and charges.
            </p>
          </div>

          {/* FAQ Search */}
          <div className="relative select-none">
            <div className="flex items-center bg-[#f8f9fa] border border-slate-200 rounded-xl p-1 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <Search className="text-slate-400 w-4 h-4 ml-3.5 shrink-0" />
              <input
                type="text"
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                placeholder="Search FAQs..."
                className="w-full text-slate-800 text-xs font-semibold px-3 py-2 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full px-6 py-4.5 text-left flex justify-between items-center bg-white hover:bg-slate-50 transition-colors focus:outline-none"
                >
                  <span className="text-slate-900 font-extrabold text-sm sm:text-base leading-snug">{faq.q}</span>
                  {openFaqIndex === idx 
                    ? <ChevronUp size={16} className="text-slate-500 shrink-0 ml-4" /> 
                    : <ChevronDown size={16} className="text-slate-500 shrink-0 ml-4" />
                  }
                </button>
                {openFaqIndex === idx && (
                  <div className="px-6 pb-5 pt-1 text-left bg-white text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold border-t border-slate-100 animate-in slide-in-from-top-1 duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* View More FAQs Button */}
          <div className="text-center pt-4 select-none">
            <Link
              to="/faq"
              className="inline-flex items-center justify-center px-6 h-12 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <span>More FAQs</span>
              <ChevronRight size={13} className="ml-1.5 shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blogs / Maintenance Guides */}
      <section className="bg-[#f8f9fa] py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200" id="blogs">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center sm:text-left space-y-3">
            <span className="text-[10px] text-orange-600 bg-orange-500/10 border border-orange-500/20 px-3.5 py-1.5 rounded-full font-black uppercase tracking-widest">
              Knowledge Hub
            </span>
            <h2 className="text-slate-900 font-black text-3xl sm:text-4xl tracking-tight">
              Maintenance Blogs & Guides
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-xl leading-relaxed">
              Read simple diagnostic tips from Kaushindra Singh to save on electricity bills and prevent appliance breakdowns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPostsData.slice(0, 3).map((blog, idx) => (
              <article
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left"
              >
                <div className="aspect-video w-full bg-slate-100 relative overflow-hidden border-b border-slate-150">
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = '/svc_ac_repair.jpg'; }}
                  />
                  <span className="absolute top-3 left-3 bg-[#F97316] text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm border border-orange-400">
                    {blog.category}
                  </span>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-[9px] text-slate-400 font-black uppercase tracking-wider">
                      <span className="flex items-center"><Calendar size={10} className="mr-1" />{blog.publishDate}</span>
                      <span className="flex items-center"><Clock size={10} className="mr-1" />{blog.readTime}</span>
                    </div>
                    <h3 className="text-slate-900 font-extrabold text-sm sm:text-base leading-snug line-clamp-2">{blog.title}</h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-3">{blog.excerpt}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 select-none">
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="w-full bg-slate-50 hover:bg-orange-50 text-slate-800 hover:text-[#F97316] border border-slate-250 hover:border-orange-300 rounded-xl py-2.5 text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <BookOpen size={12} />
                      <span>Read Article</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* SEO Directory - 1000+ Troubleshooting Guides Index Links */}
          <div className="mt-16 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 text-left">
            <div className="border-b border-slate-150 pb-4">
              <h3 className="text-slate-950 font-black text-lg tracking-tight">
                Appliance Care & Maintenance Index (1000+ Guides)
              </h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
                Direct links to our complete troubleshooting encyclopedia
              </p>
            </div>
            
            <div className="max-h-80 overflow-y-auto pr-2 space-y-4 no-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {blogPostsData.map((blog) => (
                  <Link
                    key={blog.slug}
                    to={`/blog/${blog.slug}`}
                    className="text-xs font-bold text-slate-500 hover:text-brand-orange hover:underline truncate"
                    title={blog.title}
                  >
                    • {blog.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Large CTA Section */}
      <section className="bg-[#08182D] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-900 select-none">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="space-y-4">
            <span className="bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded shadow-md">
              Fast Track Dispatch
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Need Appliance Repairs Today?
            </h2>
            <p className="text-slate-350 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed">
              Book a verified engineer in under 30 seconds. No advance deposit required. Pay only after the diagnostic repairs are done.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href={`tel:${businessConfig.contacts[0]}`}
              className="w-full sm:w-auto bg-[#F97316] hover:bg-[#F97316]/90 text-white rounded-xl px-8 py-4 text-xs font-black uppercase tracking-widest transition-all shadow-lg hover:scale-102 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Phone size={14} />
              <span>Call +91 {businessConfig.contacts[0]}</span>
            </a>
            <a
              href={`https://wa.me/91${businessConfig.contacts[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 py-4 text-xs font-black uppercase tracking-widest transition-all shadow-lg hover:scale-102 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <MessageSquare size={14} />
              <span>WhatsApp Dispatch</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
