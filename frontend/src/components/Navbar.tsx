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
      {/* Desktop and Mobile Navigation */}
      <nav className="fixed top-0 left-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/50 transition-all duration-300 backdrop-filter backdrop-filter-blur-sm">
        <div className="px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            {/* Logo & Brand Name */}
            <div
              onClick={handleLogoClick}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleLogoClick(); }}
              role="link"
              tabIndex={0}
              aria-label="KS Electrical & AC Services - Go to homepage"
              className="flex items-center space-x-3 flex-shrink-0"
            >
              <div className="flex h-10 md:h-12 items-center justify-center bg-transparent overflow-hidden shrink-0">
                <img
                  src="/log.webp"
                  alt="KS Electrical & AC Services Logo"
                  className="h-full w-auto max-w-[140px] md:max-w-[180px] object-contain"
                  loading="eager"
                  fetchPriority="high"
                  width={180}
                  height={48}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = '/log.png';
                  }}
                />
              </div>

              <div className="flex flex-col space-y-0.5">
                <span className="font-bold text-lg text-primary">KS Electrical</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">AC Services</span>
              </div>
            </div>

            {/* Navigation Links (Hidden on Mobile) */}
            <div className="hidden lg:flex flex-1 items-center justify-center space-x-6">
              <Link
                to="/"
                className={`${location.pathname === '/' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-primary'} transition-colors px-3 py-2 rounded-md text-sm font-medium`}
              >
                Home
              </Link>
              <Link
                to="/services"
                className={`${location.pathname.startsWith('/services') ? 'text-primary font-bold' : 'text-muted-foreground hover:text-primary'} transition-colors px-3 py-2 rounded-md text-sm font-medium`}
              >
                Services
              </Link>
              <Link
                to="/shop"
                className={`${location.pathname.startsWith('/shop') ? 'text-primary font-bold' : 'text-muted-foreground hover:text-primary'} transition-colors px-3 py-2 rounded-md text-sm font-medium`}
              >
                Shop
              </Link>
              <Link
                to="/book"
                className={`${location.pathname === '/book' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-primary'} transition-colors px-3 py-2 rounded-md text-sm font-medium`}
              >
                Book Service
              </Link>
              <a
                href={`tel:${businessConfig.contacts[0]}`}
                className="btn-cta text-sm px-4 py-2 flex items-center gap-2"
              >
                <Phone size={16} />
                <span>Call Us</span>
              </a>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Location Selector (Desktop) */}
              <div className="hidden lg:flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                    aria-expanded={showLocationDropdown}
                    aria-haspopup="listbox"
                    aria-label={`Selected location: ${selectedLocation}. Click to change`}
                    className="flex items-center gap-2 px-3 py-2 rounded-md border border-neutral-200/50 bg-background hover:bg-accent/50 text-sm font-medium transition-colors"
                  >
                    <MapPin size={16} className="text-muted-foreground" />
                    <span className="truncate max-w-[200px]">{selectedLocation}</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${showLocationDropdown ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {showLocationDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowLocationDropdown(false)}
                      />
                      <div className="absolute left-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg py-2 z-50 w-[200px]">
                        <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Select Service Location
                        </div>
                        {LOCATIONS.map((loc) => (
                          <button
                            key={loc}
                            onClick={() => {
                              setSelectedLocation(loc);
                              setShowLocationDropdown(false);
                            }}
                            className={`${selectedLocation === loc ? 'bg-primary/10 text-primary' : 'hover:bg-accent'} w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                          >
                            <span>{loc}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Cart Icon Badge */}
              <button
                onClick={onCartClick}
                aria-label={`Shopping Cart, ${cartCount} items`}
                className="relative flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200/50 bg-background hover:bg-accent/50 text-muted-foreground transition-colors"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-black">
                    {cartCount}
                  </div>
                )}
              </button>

              {/* Dedicated Admin & Staff Portal Button */}
              <button
                onClick={() => {
                  if (isLoggedIn && userRole === 'admin') {
                    onAdminPanelClick();
                  } else {
                    navigate('/admin/login');
                  }
                }}
                aria-label="Staff & Admin Panel Login"
                title="Staff & Admin Control Panel"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 border border-amber-500/30 text-xs font-black transition-colors cursor-pointer"
              >
                <ShieldCheck size={16} />
                <span>{isLoggedIn && userRole === 'admin' ? 'Admin Panel' : 'Staff / Admin'}</span>
              </button>

              {/* Customer Profile / Login */}
              {isLoggedIn && currentUser ? (
                <button
                  onClick={userRole === 'admin' ? onAdminPanelClick : onProfileClick}
                  aria-label={userRole === 'admin' ? "Go to Admin Panel" : `Dashboard for ${currentUser.name}`}
                  title={currentUser.name || 'My Profile'}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-black transition-colors cursor-pointer"
                >
                  <User size={16} />
                  <span>{currentUser.name ? currentUser.name.split(' ')[0] : 'Profile'}</span>
                </button>
              ) : (
                <button
                  onClick={onLoginClick}
                  aria-label="Login or Sign Up"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200/50 bg-background hover:bg-accent/50 text-muted-foreground transition-colors"
                >
                  <User size={20} />
                </button>
              )}

              {/* Mobile Menu Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Mobile Navigation Menu"
                className="lg:hidden flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200/50 bg-background hover:bg-accent/50 text-muted-foreground transition-colors"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE SLIDE-DOWN MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[72px] left-0 right-0 bottom-16 bg-white/98 backdrop-blur-xl p-5 z-40 overflow-y-auto shadow-2xl border-b border-neutral-200/80 transition-all duration-300">
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
    </>
  );
};

export default Navbar;