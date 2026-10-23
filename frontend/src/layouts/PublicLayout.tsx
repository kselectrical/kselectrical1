import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import type { BusinessConfig } from '../data';

// Fix #1: Removed the duplicate WhatsApp+Call sticky bar that was added here.
// Navbar.tsx already renders its own md:hidden bottom navigation bar (Home/Services/Shop/Book/Call).
// Having both caused a triple-bar overlap bug on mobile. Navbar bar retained; this file is clean.
// Fix #9: handleAdminPanelClick now routes to /admin/dashboard (was /admin/catalog).

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

  // Fix #9: was '/admin/catalog', now '/admin/dashboard' for consistent post-login landing
  const handleAdminPanelClick = () => {
    navigate('/admin/dashboard');
  };

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
      {/* pt-14: compensates for fixed navbar height; pb-16 on mobile for Navbar's bottom nav bar */}
      <main className="w-full pt-14 pb-16 md:pb-0 min-h-[calc(100vh-56px)]">
        <Outlet />
      </main>
      <div className="reveal-section reveal-delay-6 pb-16 md:pb-0">
        <Footer businessConfig={businessConfig} />
      </div>
    </div>
  );
};
