import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Star, ShieldCheck } from 'lucide-react';
import { servicesData } from '../data';
import type { BusinessConfig } from '../data';
import { getServiceSlugById } from '../serviceCatalog';

interface FooterProps {
  businessConfig: BusinessConfig;
}

export const Footer: React.FC<FooterProps> = ({ businessConfig }) => {

  // Extract all categories dynamically from servicesData
  const categories = Array.from(new Set(servicesData.map(s => s.category)));



  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 font-sans p-8 md:p-12 relative overflow-hidden select-none">
      
      {/* Decorative subtle ambient background glow */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Dynamic Complete Services Index - Always Visible */}
        <div className="border-b border-slate-800/80 pb-8 mb-8 text-left space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            <h5 className="text-white font-black uppercase tracking-wider text-xs">Our Services (हमारी सेवाएँ)</h5>
          </div>
          <div id="footer-services-list" className="bg-slate-900/20 border border-slate-800/70 rounded-[20px] p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 text-[10px] leading-relaxed font-semibold shadow-soft">
            {categories.map((catName) => {
              const catServices = servicesData.filter(s => s.category === catName);
              return (
                <div key={catName} className="space-y-2">
                  <h6 className="text-brand-orange font-extrabold uppercase tracking-wider text-[9px] border-b border-slate-900 pb-1">
                    {catName}
                  </h6>
                  <ul className="space-y-1.5 flex flex-col">
                    {catServices.map((svc) => (
                      <li key={svc.id}>
                        <Link 
                          to={`/services/${getServiceSlugById(svc.id) || svc.id}`}
                          className="text-slate-400 hover:text-white transition-all duration-200 hover:translate-x-0.5 block leading-tight"
                        >
                          {svc.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Three Explicit Columns Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
          
          {/* Column 1: About & Area */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-2xl bg-orange-500/10 text-brand-orange flex items-center justify-center border border-orange-500/20 shadow-sm">
                <ShieldCheck size={18} />
              </div>
              <h4 className="text-white font-black text-base tracking-wide uppercase">
                {businessConfig.name}
              </h4>
            </div>
            
            <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-sm">
              "{businessConfig.tagline || 'Powering Your Home, Safely'}" - Professional doorstep repair, installation, and general maintenance visits backed by certified technicians and transparent billing.
            </p>
            
            <div className="space-y-2 pt-2 border-t border-slate-800/60">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider block">
                Operational Coverage Areas:
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {['Gaur City 1', 'Gaur City 2', 'Noida Extension', 'Ghaziabad'].map((area, idx) => (
                  <span 
                    key={idx} 
                    className="bg-slate-800/80 text-slate-400 border border-slate-700 text-[10px] font-black px-2.5 py-1 rounded-full"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-black text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
              Quick Links (त्वरित लिंक्स)
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-xs font-semibold">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors hover:underline flex items-center">
                  <span className="w-1.5 h-1.5 bg-brand-orange rounded-full mr-2" />
                  <span>Home (होम)</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-400 hover:text-white transition-colors hover:underline flex items-center">
                  <span className="w-1.5 h-1.5 bg-brand-orange rounded-full mr-2" />
                  <span>Our Services (सेवाएं)</span>
                </Link>
              </li>
              <li>
                <Link to="/ac-on-rent" className="text-slate-400 hover:text-white transition-colors hover:underline flex items-center">
                  <span className="w-1.5 h-1.5 bg-brand-orange rounded-full mr-2" />
                  <span>AC on Rent (एसी किराए पर)</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors hover:underline flex items-center">
                  <span className="w-1.5 h-1.5 bg-brand-orange rounded-full mr-2" />
                  <span>About Us (हमारे बारे में)</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors hover:underline flex items-center">
                  <span className="w-1.5 h-1.5 bg-brand-orange rounded-full mr-2" />
                  <span>Contact Us (संपर्क करें)</span>
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-slate-400 hover:text-white transition-colors hover:underline flex items-center">
                  <span className="w-1.5 h-1.5 bg-brand-orange rounded-full mr-2" />
                  <span>Reviews (समीक्षाएं)</span>
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-400 hover:text-white transition-colors hover:underline flex items-center">
                  <span className="w-1.5 h-1.5 bg-brand-orange rounded-full mr-2" />
                  <span>FAQs (सामान्य प्रश्न)</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-slate-400 hover:text-white transition-colors hover:underline flex items-center">
                  <span className="w-1.5 h-1.5 bg-brand-orange rounded-full mr-2" />
                  <span>Privacy (गोपनीयता)</span>
                </Link>
              </li>
              <li>
                <Link to="/terms-and-cond" className="text-slate-400 hover:text-white transition-colors hover:underline flex items-center">
                  <span className="w-1.5 h-1.5 bg-brand-orange rounded-full mr-2" />
                  <span>Terms (नियम व शर्तें)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Trust */}
          <div className="space-y-4">
            <h4 className="text-white font-black text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
              Contact & Trust
            </h4>
            
            <div className="space-y-3 text-xs font-semibold">
              <div className="flex items-center space-x-3 text-slate-400">
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                  <MapPin size={13} />
                </div>
                <span className="leading-snug text-[11px]">
                  Gaur City 1, Greater Noida West, Noida Extension, UP 201301
                </span>
              </div>

              <div className="flex items-center space-x-3 text-slate-400">
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                  <Phone size={13} />
                </div>
                <div className="flex flex-col text-left">
                  <a href="tel:7895321472" className="hover:text-white transition-colors">
                    +91 7895321472
                  </a>
                  <a href="tel:9625724903" className="hover:text-white transition-colors">
                    +91 9625724903
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-slate-400">
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                  <Mail size={13} />
                </div>
                <a href="mailto:kselectrical004@gmail.com" className="hover:text-white transition-colors truncate">
                  kselectrical004@gmail.com
                </a>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/60 text-left space-y-4">
              <a 
                href={businessConfig.reviewLink || "https://reviewthis.biz/b4d5f51f"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 shadow-button hover:shadow-card-hover active:scale-95 cursor-pointer"
              >
                <Star size={13} fill="currentColor" />
                <span>Write Google Review</span>
              </a>
              
              <div className="pt-3 border-t border-slate-800/40 text-left space-y-1">
                <span className="text-[9px] text-brand-orange font-black uppercase tracking-wider block">
                  Our Top Service Areas:
                </span>
                <p className="text-[10px] text-slate-400 font-extrabold leading-relaxed">
                  Gaur City 1, Gaur City 2, Noida Extension, Sector 4, Greater Noida, Ghaziabad
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Corporate Copyright Notice Banner at the absolute bottom */}
        <div className="border-t border-slate-850 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-semibold select-none gap-4">
          <p className="text-center sm:text-left">
            © 2026 KS Electrical And AC Services. All Rights Reserved.
          </p>
          <div className="flex space-x-4 items-center">
            <span>Owner supervised service guarantee</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
