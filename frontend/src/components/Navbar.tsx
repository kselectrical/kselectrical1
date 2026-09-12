import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Phone, MapPin, ChevronDown, ShoppingCart, User,
  ShoppingBag, Menu, X, Home, Wrench, Calendar, ShieldCheck
} from 'lucide-react';
import type { BusinessConfig } from '../data';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Desktop and Mobile Navigation - Slim & Compact Single Row */}
      <nav className="fixed top-0 left-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/70 shadow-xs transition-all duration-200">
        <div className="px-3 sm:px-5 lg:px-6 mx-auto max-w-7xl">
          <div className="flex items-center justify-between h-14 gap-2 sm:gap-4">
            
            {/* Logo & Brand Name (Compact) */}
            <div
              onClick={handleLogoClick}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleLogoClick(); }}
              role="link"
              tabIndex={0}
              aria-label="KS Electrical & AC Services - Go to homepage"
              className="flex items-center gap-2 flex-shrink-0 cursor-pointer select-none"
            >
              <div className="flex h-8 items-center justify-center bg-transparent overflow-hidden shrink-0">
                <img
                  src="/log.webp"
                  alt="KS Electrical Logo"
                  className="h-full w-auto max-w-[120px] object-contain"
                  loading="eager"
                  fetchPriority="high"
                  width={120}
                  height={32}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = '/log.png';
                  }}
                />
              </div>

              <div className="flex flex-col leading-tight">
                <span className="font-extrabold text-sm sm:text-base text-primary tracking-tight">KS Electrical</span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">AC Services</span>
              </div>
            </div>

            {/* Navigation Links (Desktop — Clean Single Row, No Duplicated CTA) */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              <Link
                to="/"
                className={`${location.pathname === '/' ? 'text-primary font-bold bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'} transition-colors px-2.5 py-1.5 rounded-md text-xs font-semibold`}
              >
                Home
              </Link>
              <Link
                to="/services"
                className={`${location.pathname.startsWith('/services') ? 'text-primary font-bold bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'} transition-colors px-2.5 py-1.5 rounded-md text-xs font-semibold`}
              >
                Services
              </Link>
              <Link
                to="/sell-old-ac"
                className={`${location.pathname === '/sell-old-ac' ? 'text-amber-700 font-bold bg-amber-100 border border-amber-200' : 'text-amber-700 bg-amber-50 hover:bg-amber-100/70 border border-amber-200/70'} transition-all px-2.5 py-1.5 rounded-md text-xs font-bold flex items-center gap-1`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 animate-pulse" />
                <span>Sell Old AC</span>
              </Link>
              <Link
                to="/shop"
                className={`${location.pathname.startsWith('/shop') ? 'text-primary font-bold bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'} transition-colors px-2.5 py-1.5 rounded-md text-xs font-semibold`}
              >
                Shop
              </Link>
              <Link
                to="/book"
                className={`${location.pathname === '/book' ? 'text-primary font-bold bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'} transition-colors px-2.5 py-1.5 rounded-md text-xs font-semibold`}
              >
                Book Service
              </Link>
            </div>

            {/* Right Side Actions — Unified, Compact & Sleek (h-8 height) */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* Location Selector (Desktop) */}
              <div className="hidden lg:block relative">
                <button
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  aria-expanded={showLocationDropdown}
                  aria-haspopup="listbox"
                  aria-label={`Location: ${selectedLocation}`}
                  className="h-8 flex items-center gap-1.5 px-2 rounded-md border border-neutral-200/80 bg-background hover:bg-accent/50 text-xs font-medium text-muted-foreground transition-colors cursor-pointer"
                >
                  <MapPin size={13} className="text-muted-foreground shrink-0" />
                  <span className="truncate max-w-[110px] xl:max-w-[140px] text-[11px]">{selectedLocation.split(',')[0]}</span>
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 shrink-0 ${showLocationDropdown ? 'rotate-180' : ''}`}
                  />
                </button>

                {showLocationDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowLocationDropdown(false)}
                    />
                    <div className="absolute right-0 mt-1 w-56 bg-popover border border-border rounded-lg shadow-lg py-1.5 z-50">
                      <div className="px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Select Location
                      </div>
                      {LOCATIONS.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => {
                            setSelectedLocation(loc);
                            setShowLocationDropdown(false);
                          }}
                          className={`${selectedLocation === loc ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-accent'} w-full text-left px-3 py-1.5 rounded-md text-xs font-medium transition-colors`}
                        >
                          <span>{loc}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Single Unified Call CTA Button (Desktop & Tablet) */}
              <a
                href={`tel:${businessConfig.contacts[0]}`}
                aria-label={`Call ${businessConfig.contacts[0]}`}
                title={`Call ${businessConfig.contacts[0]}`}
                className="h-8 flex items-center gap-1.5 px-2.5 sm:px-3 rounded-md bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
              >
                <Phone size={13} className="fill-white shrink-0" />
                <span className="hidden sm:inline">+91 {businessConfig.contacts[0]}</span>
                <span className="sm:hidden">Call</span>
              </a>

              {/* Cart Icon Badge */}
              <button
                onClick={onCartClick}
                aria-label={`Shopping Cart, ${cartCount} items`}
                className="relative h-8 w-8 flex items-center justify-center rounded-md border border-neutral-200/80 bg-background hover:bg-accent/50 text-muted-foreground transition-colors shrink-0"
              >
                <ShoppingCart size={15} />
                {cartCount > 0 && (
                  <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-black">
                    {cartCount}
                  </div>
                )}
              </button>

              {/* Admin & Staff Portal Button (Compact) */}
              <button
                onClick={() => {
                  if (isLoggedIn && userRole === 'admin') {
                    onAdminPanelClick();
                  } else {
                    navigate('/admin/login');
                  }
                }}
                aria-label="Admin Panel Login"
                title="Staff & Admin Panel"
                className="hidden sm:flex h-8 items-center gap-1 px-2 rounded-md border border-neutral-200/80 bg-background hover:bg-accent/50 text-muted-foreground hover:text-foreground text-xs font-semibold transition-colors cursor-pointer shrink-0"
              >
                <ShieldCheck size={14} className="text-slate-500" />
                <span className="hidden xl:inline text-[11px]">Admin</span>
              </button>

              {/* Customer Profile / Login */}
              {isLoggedIn && currentUser ? (
                <button
                  onClick={userRole === 'admin' ? onAdminPanelClick : onProfileClick}
                  aria-label={userRole === 'admin' ? "Go to Admin Panel" : `Dashboard for ${currentUser.name}`}
                  title={currentUser.name || 'My Profile'}
                  className="h-8 flex items-center gap-1 px-2 rounded-md border border-neutral-200/80 bg-background hover:bg-accent/50 text-foreground text-xs font-semibold transition-colors cursor-pointer shrink-0"
                >
                  <User size={14} />
                  <span className="text-[11px] max-w-[65px] truncate">{currentUser.name ? currentUser.name.split(' ')[0] : 'User'}</span>
                </button>
              ) : (
                <button
                  onClick={onLoginClick}
                  aria-label="Login or Sign Up"
                  title="Login"
                  className="h-8 w-8 flex items-center justify-center rounded-md border border-neutral-200/80 bg-background hover:bg-accent/50 text-muted-foreground transition-colors shrink-0"
                >
                  <User size={15} />
                </button>
              )}

              {/* Mobile Menu Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Mobile Navigation Menu"
                className="lg:hidden h-8 w-8 flex items-center justify-center rounded-md border border-neutral-200/80 bg-background hover:bg-accent/50 text-muted-foreground transition-colors shrink-0"
              >
                {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE SLIDE-DOWN MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[56px] left-0 right-0 bottom-16 bg-white/98 backdrop-blur-xl p-5 z-40 overflow-y-auto shadow-2xl border-b border-neutral-200/80 transition-all duration-300">
          <div className="space-y-4">
            <div className="border-b pb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-primary">KS Electrical</h3>
                <button onClick={closeMobileMenu} className="text-muted-foreground hover:text-primary">
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">{selectedLocation}</p>
            </div>

            <nav className="space-y-2">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/50 transition-colors"
              >
                <Home size={20} />
                <span>Home</span>
              </Link>
              <Link
                to="/services"
                onClick={closeMobileMenu}
                className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/50 transition-colors"
              >
                <Wrench size={20} />
                <span>Our Services</span>
              </Link>
              <Link
                to="/sell-old-ac"
                onClick={closeMobileMenu}
                className="flex w-full items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">♻️</span>
                  <span>Sell Old AC / Scrap</span>
                </div>
                <span className="text-[10px] bg-amber-500 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Top Cash</span>
              </Link>
              <Link
                to="/shop"
                onClick={closeMobileMenu}
                className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/50 transition-colors"
              >
                <ShoppingBag size={20} />
                <span>Shop</span>
              </Link>
              <Link
                to="/book"
                onClick={closeMobileMenu}
                className="flex w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/50 transition-colors"
              >
                <Calendar size={20} />
                <span>Book Service</span>
              </Link>
              <Link
                to="/we-serve"
                onClick={closeMobileMenu}
                className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/50 transition-colors"
              >
                <MapPin size={20} />
                <span>We Serve Areas</span>
              </Link>
              <Link
                to="/about"
                onClick={closeMobileMenu}
                className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent/50 transition-colors"
              >
                <User size={20} />
                <span>About Us</span>
              </Link>
              <button
                onClick={() => {
                  closeMobileMenu();
                  if (isLoggedIn && userRole === 'admin') {
                    onAdminPanelClick();
                  } else {
                    navigate('/admin/login');
                  }
                }}
                className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-bold text-amber-600 bg-amber-500/10 hover:bg-amber-500/20 transition-colors text-left"
              >
                <ShieldCheck size={20} />
                <span>{isLoggedIn && userRole === 'admin' ? 'Admin Panel' : 'Staff & Admin Login'}</span>
              </button>
            </nav>

            <div className="border-t pt-4">
              <div className="flex items-center gap-3">
                <a
                  href={`tel:${businessConfig.contacts[0]}`}
                  className="flex-1 flex items-center justify-center px-3 py-2 rounded-md border border-muted-background/50 bg-background hover:bg-accent/50 text-sm font-medium"
                >
                  <Phone size={20} />
                  <span>Call Now</span>
                </a>
                <button
                  onClick={onLoginClick}
                  className="flex-1 flex items-center justify-center px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
                >
                  {isLoggedIn ? (userRole === 'admin' ? 'Admin Panel' : 'Profile') : 'Login'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE STICKY BOTTOM NAVIGATION BAR */}
      {!location.pathname.startsWith('/blog/') && !location.pathname.startsWith('/sell-old-ac') && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-muted-background/50 px-4 py-3 z-50">
          <div className="flex justify-around">
            <Link
              to="/"
              className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-md ${
                location.pathname === '/' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'
              } transition-colors text-xs`}
            >
              <Home size={20} />
              <span>Home</span>
            </Link>

            <Link
              to="/services"
              className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-md ${
                location.pathname.startsWith('/services') ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'
              } transition-colors text-xs`}
            >
              <Wrench size={20} />
              <span>Services</span>
            </Link>

            <Link
              to="/shop"
              className="flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-xs"
            >
              <ShoppingBag size={20} />
              <span>Shop</span>
            </Link>

            <Link
              to="/book"
              className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-md ${
                location.pathname === '/book' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'
              } transition-colors text-xs`}
            >
              <Calendar size={20} />
              <span>Book</span>
            </Link>

            <a
              href={`tel:${businessConfig.contacts[0]}`}
              className="flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-md hover:text-primary transition-colors text-xs"
            >
              <Phone size={20} />
              <span>Call</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;