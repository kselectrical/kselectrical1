import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Phone, MapPin, ChevronDown, ShoppingCart, User } from 'lucide-react';
import type { BusinessConfig } from '../data';
import { getAssetPath } from '../firebase';

interface NavbarProps {
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  cartCount: number;
  onCartClick: () => void;
  isLoggedIn: boolean;
  userRole: 'customer' | 'admin' | null;
  currentUser: { name: string; email?: string; photoUrl: string; phone?: string } | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onAdminPanelClick: () => void;
  onProfileClick: () => void;
  businessConfig: BusinessConfig;
}

const LOCATIONS = [
  'H37, Block H, Saket, New Delhi',
  'Gaur City 1, Noida Extension, UP',
  'Gaur City 2, Noida Extension, UP',
  'Siddharth Vihar, Ghaziabad, UP',
  'Sector 62, Noida, UP'
];

export const Navbar: React.FC<NavbarProps> = ({
  selectedLocation,
  setSelectedLocation,
  cartCount,
  onCartClick,
  isLoggedIn,
  userRole,
  currentUser,
  onLoginClick,
  onAdminPanelClick,
  onProfileClick,
  businessConfig
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };



  return (
    <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-300 z-50 shadow-soft transition-all duration-300">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Name */}
          <div 
            onClick={handleLogoClick}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleLogoClick(); }}
            role="link"
            tabIndex={0}
            aria-label="KS Electrical & AC Services - Go to homepage"
            className="flex items-center space-x-2.5 cursor-pointer select-none shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 rounded-xl"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-slate-300 shadow-soft transition-transform hover:scale-105">
              <img 
                src={getAssetPath(businessConfig.logoUrl)} 
                alt="KS Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const fallbackSpan = document.createElement('span');
                    fallbackSpan.className = 'text-brand-blue font-extrabold text-sm';
                    fallbackSpan.innerText = 'KS';
                    parent.appendChild(fallbackSpan);
                  }
                }}
              />
            </div>
            
            <div className="flex flex-col text-left">
              <span className="font-sans font-black text-slate-900 tracking-tight text-base sm:text-lg leading-tight hover:text-brand-blue transition-colors">
                KS Electrical
              </span>
              <span className="font-sans text-[10px] text-slate-500 font-bold tracking-wide">
                And AC Services
              </span>
            </div>
          </div>

          {/* Center Column: Location Selector */}
          <div className="hidden md:flex items-center relative">
            {/* Location Selector Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                aria-expanded={showLocationDropdown}
                aria-haspopup="listbox"
                aria-label={`Selected location: ${selectedLocation}. Click to change`}
                className="h-10 flex items-center space-x-1.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-300 hover:border-slate-400 rounded-2xl text-xs font-semibold text-slate-700 select-none cursor-pointer transition-all duration-200 max-w-[200px] truncate shadow-sm"
              >
                <MapPin size={14} className="text-slate-400 shrink-0" />
                <span className="truncate">{selectedLocation}</span>
                <ChevronDown size={12} className="text-slate-400 shrink-0" />
              </button>

              {showLocationDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowLocationDropdown(false)}
                  />
                  <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-300 rounded-2xl shadow-dropdown z-50 py-1.5 font-sans text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 select-none">
                      Select Service Location
                    </div>
                    {LOCATIONS.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setShowLocationDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 hover:bg-slate-50 font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                          selectedLocation === loc ? 'text-brand-blue bg-blue-50/20 font-bold' : 'text-slate-700'
                        }`}
                      >
                        <span>{loc}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Quick Contacts, Nav Links, Utilities */}
          <div className="flex items-center space-x-5 shrink-0">
            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-3 mr-1">
              <Link 
                to="/services"
                className="flex items-center justify-center px-4 h-10 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-95 select-none"
              >
                Our Services
              </Link>
              <Link
                to="/ac-on-rent"
                className="flex items-center justify-center px-4 h-10 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-95 select-none"
              >
                AC on Rent
              </Link>
            </div>

            {/* Primary CTA: Call Now */}
            <a 
              href={`tel:${businessConfig.contacts[0]}`}
              className="flex items-center space-x-1.5 px-4 h-10 bg-brand-orange hover:bg-brand-orange-dark text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-95 select-none"
            >
              <Phone size={13} fill="currentColor" className="shrink-0" />
              <span className="hidden sm:inline">Call Now</span>
              <span className="sm:hidden">Call</span>
            </a>

            {/* Utility Group: Cart, Staff Portal, Login */}
            <div className="flex items-center space-x-2.5">
              {/* Cart Icon Badge */}
              <button
                onClick={onCartClick}
                aria-label={`Shopping Cart, ${cartCount} items`}
                className="relative h-10 w-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-700 transition-all duration-200 select-none cursor-pointer hover:scale-105 active:scale-95"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-orange text-white rounded-full flex items-center justify-center text-[9px] font-black shadow-md border border-white animate-in zoom-in duration-200">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Staff Portal Profile Icon */}
              <a 
                href="/admin/login"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-slate-200 hover:border-brand-blue overflow-hidden transition-all duration-200 select-none shadow-sm flex items-center justify-center shrink-0 hover:scale-105"
                title="Staff Portal"
              >
                <img 
                  src={getAssetPath('/profile.webp')} 
                  alt="Staff Portal" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getAssetPath('/profile.jpg');
                  }}
                />
              </a>

              {/* Customer Profile / Login */}
              {isLoggedIn && currentUser ? (
                <button
                  onClick={userRole === 'admin' ? onAdminPanelClick : onProfileClick}
                  aria-label={userRole === 'admin' ? "Go to Admin Panel" : `Dashboard for ${currentUser.name}`}
                  className="w-10 h-10 rounded-xl bg-brand-blue hover:bg-brand-blue-dark text-white font-extrabold text-xs flex items-center justify-center border border-blue-200 shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer select-none uppercase shrink-0"
                  title={userRole === 'admin' ? "Go to Admin Panel" : `Logged in as ${currentUser.name}`}
                >
                  {currentUser.name ? currentUser.name[0] : 'C'}
                </button>
              ) : (
                <button
                  onClick={onLoginClick}
                  aria-label="Login or Sign Up"
                  className="flex items-center space-x-1.5 px-4 h-10 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all duration-200 hover:scale-102 active:scale-98 cursor-pointer select-none shrink-0"
                >
                  <User size={13} className="shrink-0" />
                  <span className="hidden sm:inline">Login</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};
