import React, { useState } from 'react';
import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Settings, FolderOpen, Palette, Users, ShoppingBag, FileText, ArrowLeft, LogOut, Menu, X, TrendingUp } from 'lucide-react';
import type { BusinessConfig } from '../data';

interface AdminLayoutProps {
  isLoggedIn: boolean;
  userRole: 'customer' | 'admin' | null;
  onLogout: () => void;
  businessConfig: BusinessConfig;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  isLoggedIn,
  userRole,
  onLogout,
  businessConfig
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Route Guard Logic: redirect to admin login if not admin
  if (!isLoggedIn || userRole !== 'admin') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard Overview', icon: TrendingUp },
    { path: '/admin/catalog', label: 'Manage Service Rates', icon: Settings },
    { path: '/admin/categories', label: 'Manage Categories', icon: FolderOpen },
    { path: '/admin/branding', label: 'Branding Customizer', icon: Palette },
    { path: '/admin/customers', label: 'Customer Directory', icon: Users },
    { path: '/admin/requests', label: 'Customer Requests', icon: ShoppingBag },
    { path: '/admin/billbook', label: 'Bill Book', icon: FileText, isNew: true }
  ];

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay Backdrop with Blur */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs z-45 md:hidden transition-opacity duration-250"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar with tactile depth & clear boundaries */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-300 flex flex-col shrink-0 shadow-lg md:shadow-md transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Sidebar Header Branding - Highly structured */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div className="flex flex-col text-left truncate">
            <span className="text-slate-900 font-black text-sm tracking-tight truncate uppercase">
              {businessConfig.name}
            </span>
            <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-0.5">
              Admin Console
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-900 md:hidden rounded-lg hover:bg-slate-150 transition-colors cursor-pointer"
          >
            <X size={18} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Sidebar Navigation - Tactile tabs & glowing active states */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto bg-white">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === '/admin/billbook' && location.pathname.startsWith('/admin/billbook'));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`w-full text-left px-4 py-3 rounded-xl font-extrabold text-xs flex items-center justify-between transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer border ${
                  isActive
                    ? item.isNew
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-100 scale-[1.02] border-b-2 border-b-emerald-800'
                      : 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100 scale-[1.02] border-b-2 border-b-blue-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent hover:border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3 truncate mr-2">
                  <Icon size={15} className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.isNew && (
                  <span className={`font-extrabold text-[8px] px-2 py-0.5 rounded-full select-none shrink-0 ${
                    isActive ? 'bg-white text-emerald-700' : 'bg-emerald-500 text-white animate-pulse'
                  }`}>
                    NEW
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-2 select-none">
          <Link
            to="/"
            onClick={() => setIsSidebarOpen(false)}
            className="w-full text-left px-3 py-2.5 rounded-xl font-extrabold text-xs flex items-center space-x-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-950 transition-all border border-transparent hover:border-slate-200"
          >
            <ArrowLeft size={14} className="stroke-[2.5]" />
            <span>Return to Site</span>
          </Link>
          <button
            onClick={handleLogoutClick}
            className="w-full text-left px-3 py-2.5 rounded-xl font-extrabold text-xs flex items-center space-x-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer border border-transparent hover:border-red-100"
          >
            <LogOut size={14} className="stroke-[2.5]" />
            <span>Logout Account</span>
          </button>
        </div>

      </aside>

      {/* Admin Content Area Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Admin Top Header - Elevated card style with crisp bottom boundary */}
        <header className="bg-white border-b border-slate-250 h-16 px-4 md:px-8 flex items-center justify-between shrink-0 shadow-sm z-10 select-none">
          <div className="flex items-center space-x-3 text-left overflow-hidden mr-2">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-900 md:hidden rounded-lg hover:bg-slate-100 transition-colors focus:outline-none shrink-0 cursor-pointer border border-transparent active:scale-95"
              aria-label="Toggle Navigation Menu"
            >
              <Menu size={20} className="stroke-[2.5]" />
            </button>
            <div className="truncate">
              <h2 className="text-slate-900 font-black text-xs md:text-sm uppercase tracking-wide truncate">
                {navItems.find(item => location.pathname.startsWith(item.path))?.label || 'Administration Control'}
              </h2>
              <p className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 hidden sm:block truncate">
                Live pricing updates and database records synchronization
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4 shrink-0">
            <div className="text-right hidden sm:block">
              <span className="text-slate-800 font-black text-xs block">{businessConfig.owner}</span>
              <span className="text-[9px] text-slate-450 font-bold block">{businessConfig.email}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 border-2 border-blue-250 flex items-center justify-center text-brand-blue font-black shadow-inner shrink-0 select-none">
              A
            </div>
          </div>
        </header>

        {/* Dynamic Sub-Page Content - Rendered against high contrast gray background */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-slate-100">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  );
};
export default AdminLayout;
