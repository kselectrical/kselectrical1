import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import type { BusinessConfig } from '../data';

interface PublicLayoutProps {
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  cartCount: number;
  isLoggedIn: boolean;
  userRole: 'customer' | 'admin' | null;
  currentUser: { name: string; email?: string; photoUrl: string; phone?: string } | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onProfileClick: () => void;
  businessConfig: BusinessConfig;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({
  selectedLocation,
  setSelectedLocation,
  cartCount,
  isLoggedIn,
  userRole,
  currentUser,
  onLoginClick,
  onLogoutClick,
  onProfileClick,
  businessConfig
}) => {
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate('/checkout');
  };

  const handleAdminPanelClick = () => {
    navigate('/admin/catalog');
  };

  const waText = encodeURIComponent('Hi, mujhe service book karni hai. Kripya availability confirm karein.');

  return (
    <div className="relative min-h-screen bg-white text-gray-800 font-sans selection:bg-blue-150 selection:text-brand-blue-dark">
      <Navbar 
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        cartCount={cartCount}
        onCartClick={handleCartClick}
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        currentUser={currentUser}
        onLoginClick={onLoginClick}
        onLogoutClick={onLogoutClick}
        onAdminPanelClick={handleAdminPanelClick}
        onProfileClick={onProfileClick}
        businessConfig={businessConfig}
      />
      {/* pt-14: compensates for fixed navbar height; pb-20 on mobile to clear the sticky bottom bar */}
      <main className="w-full pt-14 pb-20 md:pb-0 min-h-[calc(100vh-56px)]">
        <Outlet />
      </main>
      <div className="reveal-section reveal-delay-6 pb-16 md:pb-0">
        <Footer businessConfig={businessConfig} />
      </div>

      {/* ── Point 2: Global Mobile Sticky Bottom Bar ──
          Visible only on mobile (md:hidden). Fixed at viewport bottom on ALL public pages.
          WhatsApp pre-fills "Hi, mujhe service book karni hai" in Hindi for instant context.
          z-[60] to stay above all other fixed elements. */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.12)] px-3 pt-2.5 pb-[env(safe-area-inset-bottom,10px)] font-sans">
        <div className="flex gap-2.5 mb-1">
          {/* WhatsApp — green, pre-fills Hindi message */}
          <a
            href={`https://wa.me/91${businessConfig.contacts[0]}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-xl py-3 text-xs font-black tracking-wide transition-all active:scale-95 shadow-md"
            aria-label="Chat on WhatsApp"
          >
            {/* WhatsApp SVG icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>WhatsApp</span>
          </a>

          {/* Call Now — blue */}
          <a
            href={`tel:${businessConfig.contacts[0]}`}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-xs font-black tracking-wide transition-all active:scale-95 shadow-md"
            aria-label={`Call ${businessConfig.contacts[0]}`}
          >
            {/* Phone SVG icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden="true">
              <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
            </svg>
            <span>Call Now</span>
          </a>
        </div>
        <p className="text-center text-[9px] text-gray-400 font-semibold leading-none pb-0.5">
          Gaur City &amp; Greater Noida West · Technician in 30–45 mins
        </p>
      </div>
    </div>
  );
};

