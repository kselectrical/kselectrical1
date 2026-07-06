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
      <main className="w-full pt-[114px]">
        <Outlet />
      </main>
      <div className="reveal-section reveal-delay-6">
        <Footer businessConfig={businessConfig} />
      </div>
    </div>
  );
};

