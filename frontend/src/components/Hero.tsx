import React from 'react';
import { Star, ShieldCheck, Home, Users } from 'lucide-react';
import { getAssetPath } from '../firebase';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  setSelectedCategory
}) => {
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    const element = document.getElementById('services');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="hero-critical-bg relative bg-slate-950 text-white pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-900 font-sans overflow-hidden">
      {/* Premium Background Gradient Glowing Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-3xl select-none pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl select-none pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Main Grid: Left side text, Right side promo cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center text-left">
          
          {/* Left: Heading, Subheading & Trust Indicators */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center space-x-1.5 bg-brand-orange/10 border border-brand-orange/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-brand-orange select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping shrink-0" />
              <span className="font-extrabold uppercase tracking-wider text-[10px]">Verified Home Services in Gaur City & Noida Extension</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.1] font-sans">
                AC, RO & Electrical <br />
                Services at Your Doorstep
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-xl font-medium leading-relaxed">
                Same-Day Service • Verified Technicians • Transparent Pricing • Genuine Spare Parts
              </p>
            </div>

            {/* Core Trust Indicators Grid - Glassmorphism style */}
            <div className="grid grid-cols-2 gap-4 max-w-md pt-2 select-none">
              <div className="flex items-center space-x-2.5 bg-slate-900/40 border border-slate-800/80 py-2.5 px-3.5 rounded-xl shadow-md backdrop-blur-md transition-all duration-300 hover:bg-slate-900/60 hover:border-slate-700/60">
                <div className="w-8 h-8 rounded-lg bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0">
                  <Star size={16} fill="#F97316" className="text-brand-orange" />
                </div>
                <div>
                  <span className="text-slate-100 font-extrabold text-sm block">4.9 Star Rating</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Google Review</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2.5 bg-slate-900/40 border border-slate-800/80 py-2.5 px-3.5 rounded-xl shadow-md backdrop-blur-md transition-all duration-300 hover:bg-slate-900/60 hover:border-slate-700/60">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Users size={16} />
                </div>
                <div>
                  <span className="text-slate-100 font-extrabold text-sm block">5000+ Services</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completed</span>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 bg-slate-900/40 border border-slate-800/80 py-2.5 px-3.5 rounded-xl shadow-md backdrop-blur-md transition-all duration-300 hover:bg-slate-900/60 hover:border-slate-700/60">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                  <Home size={16} />
                </div>
                <div>
                  <span className="text-slate-100 font-extrabold text-sm block">Same-Day</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Doorstep Visit</span>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 bg-slate-900/40 border border-slate-800/80 py-2.5 px-3.5 rounded-xl shadow-md backdrop-blur-md transition-all duration-300 hover:bg-slate-900/60 hover:border-slate-700/60">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <span className="text-slate-100 font-extrabold text-sm block">30-Day Cover</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Service Warranty</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Hero image + Promo Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Big Hero Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-800 h-48 sm:h-56 group">
              <img
                src={getAssetPath('/hero_technician.jpg')}
                alt="KS Electrical professional technician servicing AC"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                fetchPriority="high"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 text-left">
                <span className="bg-brand-orange text-white font-extrabold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded shadow-sm">
                  KS Electrical & AC Services
                </span>
                <p className="text-white text-xs font-bold mt-1 leading-tight">Same-Day Doorstep Service</p>
              </div>
            </div>

            {/* Two Promo Cards */}
            <div className="grid grid-cols-2 gap-4">
            
            {/* Promo Card 1: Super Saver */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 rounded-2xl p-5 text-left flex flex-col justify-between h-44 shadow-md relative overflow-hidden group select-none transition-premium hover:shadow-card hover:-translate-y-1 hover:border-brand-orange/30">
              <div className="space-y-2 relative z-10">
                <span className="bg-brand-orange text-white font-extrabold text-[8px] uppercase tracking-widest px-2 py-0.5 rounded shadow-xs">
                  Super Saver
                </span>
                <h3 className="text-white font-extrabold text-base tracking-tight leading-snug pt-1">
                  Repairs <br />from ₹49
                </h3>
                <p className="text-[9px] text-slate-400 font-semibold leading-normal">
                  Fuses, switches & diagnostics.
                </p>
              </div>
              
              <div className="absolute right-[-8px] bottom-[-8px] w-24 h-24 opacity-90 group-hover:scale-105 transition-transform duration-500 shrink-0">
                <img 
                  src={getAssetPath('/electric_switch.webp')} 
                  alt="Repair illustration" 
                  className="w-full h-full object-cover rounded-tl-3xl border border-slate-800 shadow-md"
                />
              </div>
            </div>

            {/* Promo Card 2: Safe & Verified */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 rounded-2xl p-5 text-left flex flex-col justify-between h-44 shadow-md relative overflow-hidden group select-none transition-premium hover:shadow-card hover:-translate-y-1 hover:border-blue-500/30">
              <div className="space-y-2 relative z-10">
                <span className="bg-blue-600 text-white font-extrabold text-[8px] uppercase tracking-widest px-2 py-0.5 rounded shadow-xs">
                  KS Certified
                </span>
                <h3 className="text-white font-extrabold text-base tracking-tight leading-snug pt-1">
                  Verified <br />Experts
                </h3>
                <p className="text-[9px] text-slate-400 font-semibold leading-normal">
                  Trained & background checked.
                </p>
              </div>

              <div className="absolute right-[-8px] bottom-[-8px] w-24 h-24 opacity-90 group-hover:scale-105 transition-transform duration-500 shrink-0">
                <img 
                  src={getAssetPath('/team_trust.jpg')} 
                  alt="Verified technician team" 
                  className="w-full h-full object-cover rounded-tl-3xl border border-slate-800 shadow-md"
                />
              </div>
            </div>

            </div>
          </div>

        </div>

        {/* Quick Links: Grid of category cards */}
        <div className="pt-8 border-t border-slate-900 text-left">
          <h3 className="font-extrabold text-slate-400 text-xs uppercase tracking-widest mb-5">
            Browse Core Specialties
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'AC Services', name: 'AC Services', desc: 'Gas leaks, jet cleaning & install', img: '/ac_service_pro.jpg', label: 'AC Services' },
              { id: 'Electrician Services', name: 'Electrician Services', desc: 'Wiring, MCBs, lighting fitting', img: '/electrician_pro.jpg', label: 'Electrician Services' },
              { id: 'Appliance Repair', name: 'RO & Appliance Repair', desc: 'RO servicing, fridges & geysers', img: '/ro_service_pro.jpg', label: 'RO & Appliance Repair' },
              { id: 'Home Installations', name: 'Home Installations', desc: 'Chimney wash, balcony nets, locks', img: '/washing_machine_pro.jpg', label: 'Home Installations' }
            ].map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCategoryClick(cat.id); } }}
                role="button"
                tabIndex={0}
                aria-label={`Browse ${cat.name} services`}
                className="group relative h-36 rounded-xl overflow-hidden border border-slate-900 cursor-pointer shadow-md hover:shadow-lg hover:border-brand-orange/30 hover:-translate-y-1 transition-premium active:scale-98 select-none focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
              >
                <img 
                  src={getAssetPath(cat.img)} 
                  alt={cat.name} 
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.55]"
                />
                {/* Category Dark overlay */}
                <div className="absolute inset-0 category-card-overlay" />
                <div className="absolute bottom-4 left-4 text-left right-4">
                  <span className="bg-brand-orange text-white font-black text-[7px] uppercase tracking-widest px-2 py-0.5 rounded block w-max mb-1.5 shadow-xs select-none">
                    {cat.label}
                  </span>
                  <span className="text-white text-xs sm:text-sm font-black leading-tight block">
                    {cat.name}
                  </span>
                  <span className="text-[9px] text-slate-300 font-semibold block leading-tight mt-1 truncate max-w-full">
                    {cat.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
export default Hero;
