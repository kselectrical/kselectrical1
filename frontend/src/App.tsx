import React, { useState, useEffect, Suspense, lazy, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { 
  loadServicesFromDb, getBookingsFromCloud, saveBookingToCloud,
  loadBusinessConfigFromDb, saveCustomerToCloud, getCustomersFromFirestore,
  getInvoicesFromCloud, signOutUser, auth, isFirebaseConfigured, isAdminEmail,
  runMigrationToFirestore, loadCategoriesFromDb, saveAdminLogToCloud, getAssetPath,
  db, getBookingsForCustomerFromCloud
} from './firebase';
import { servicesData, businessConfig } from './data';
import { serviceCatalog } from './serviceCatalog';
import { getSearchSuggestions, getUniqueSuggestionSlug } from './searchUtils';
import type { TechnicalService, CartItem } from './types';
import type { BookingData, CustomerUser } from './firebase';
import type { BusinessConfig } from './data';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Shared Components
import { LoginModal } from './components/LoginModal';
import { CustomerProfileModal } from './components/CustomerProfileModal';

// Pages - Lazy loaded
const HomePage = lazy(() => import('./pages/HomePage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const FAQPage = lazy(() => import('./pages/FAQPage').then(m => ({ default: m.FAQPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));
const ACOnRentPage = lazy(() => import('./pages/ACOnRentPage').then(m => ({ default: m.ACOnRentPage })));
const LocalLandingPage = lazy(() => import('./pages/LocalLandingPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));
const BlogPage = lazy(() => import('./pages/BlogPage').then(m => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage').then(m => ({ default: m.BlogPostPage })));
const CareersPage = lazy(() => import('./pages/CareersPage').then(m => ({ default: m.CareersPage })));
const AntiDiscriminationPage = lazy(() => import('./pages/AntiDiscriminationPage').then(m => ({ default: m.AntiDiscriminationPage })));

// Service Pages - Lazy loaded
const ACService = lazy(() => import('./pages/services/ACService'));
const ROService = lazy(() => import('./pages/services/ROService'));
const ElectricianService = lazy(() => import('./pages/services/ElectricianService'));
const WashingMachineRepair = lazy(() => import('./pages/services/WashingMachineRepair'));
const RefrigeratorRepair = lazy(() => import('./pages/services/RefrigeratorRepair'));
const ChimneyService = lazy(() => import('./pages/services/ChimneyService'));
const GeyserService = lazy(() => import('./pages/services/GeyserService'));
const FanService = lazy(() => import('./pages/services/FanService'));
const LightService = lazy(() => import('./pages/services/LightService'));
const HomeInstallations = lazy(() => import('./pages/services/HomeInstallations'));
const MicrowaveService = lazy(() => import('./pages/services/MicrowaveService'));
const ServiceDetailsPage = lazy(() => import('./pages/services/ServiceDetailsPage'));

// Admin Dashboard Pages - Lazy loaded
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const CustomerDashboard = lazy(() => import('./pages/customer/Dashboard'));
const TechnicianDashboard = lazy(() => import('./pages/technician/Dashboard'));
const Catalog = lazy(() => import('./pages/admin/Catalog'));
const Categories = lazy(() => import('./pages/admin/Categories'));
const Branding = lazy(() => import('./pages/admin/Branding'));
const Customers = lazy(() => import('./pages/admin/Customers'));
const Requests = lazy(() => import('./pages/admin/Requests'));
const BillBook = lazy(() => import('./pages/admin/BillBook'));
const CreateManualInvoice = lazy(() => import('./pages/admin/CreateManualInvoice'));

// Ambient Loading Screen Placeholder
// Ambient Isolated Sub-components for CPU-efficient DOM updates
const ServiceCycler: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const services = [
    { label: 'AC Repair & Service', icon: '❄️' },
    { label: 'RO Water Purifier', icon: '💧' },
    { label: 'Certified Electrician', icon: '⚡' },
    { label: 'Washing Machine Repair', icon: '🧺' },
    { label: 'Geyser Repair & Service', icon: '🔥' },
    { label: 'Kitchen Chimney Service', icon: '🍳' },
    { label: 'Home Electrical Services', icon: '🏠' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx(prev => (prev + 1) % services.length);
    }, 650);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center space-x-2.5 bg-slate-50 border border-slate-200 px-4 py-2 rounded-2xl shadow-2xs animate-slide-up">
      <span className="text-lg animate-bounce">{services[idx].icon}</span>
      <span className="text-xs font-black text-slate-800 tracking-wide uppercase transition-all duration-300">
        {services[idx].label}
      </span>
    </div>
  );
};

const MessageCycler: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const messages = [
    "Preparing your local technician...",
    "Finding nearby service experts...",
    "Checking service availability...",
    "Loading trusted home services...",
    "Almost ready..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx(prev => (prev + 1) % messages.length);
    }, 900);
    return () => clearInterval(timer);
  }, []);

  return (
    <p className="text-xs font-bold text-slate-500 animate-pulse transition-all duration-300">
      {messages[idx]}
    </p>
  );
};

const LoadingSpinner: React.FC = () => {
  const [shouldRender, setShouldRender] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer showing the loading screen by 180ms to avoid flickers on fast connections
    const renderTimer = setTimeout(() => {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setMounted(true);
      });
    }, 180);

    // Show skeleton UI after branding showtime (300ms since start of render)
    const skeletonTimer = setTimeout(() => {
      setShowSkeleton(true);
    }, 480);

    return () => {
      clearTimeout(renderTimer);
      clearTimeout(skeletonTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none overflow-hidden relative">
      {/* Step 1: Branding Fade-In (Shown initially, fades out when skeleton takes over) */}
      {!showSkeleton ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-50 transition-opacity duration-300">
          <div className="flex flex-col items-center text-center space-y-4 animate-fade-in">
            {/* Branded Premium Shield Icon */}
            <div className="w-16 h-16 rounded-3xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20 shadow-md">
              <span className="text-3xl text-brand-orange font-black">KS</span>
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-black tracking-tight text-slate-900">KS Electrical & AC Services</h2>
              <p className="text-xs text-slate-550 font-bold tracking-wider uppercase">Professional Home Appliance Services</p>
            </div>
          </div>
        </div>
      ) : (
        /* Step 2 & 3: Skeleton UI & Cycling Services Loader */
        <div className="w-full flex-1 flex flex-col animate-fade-in">
          
          {/* Header Skeleton */}
          <header className="h-[72px] border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-slate-200 animate-pulse" />
              <div className="w-24 h-4 bg-slate-200 rounded-md animate-pulse" />
            </div>
            <div className="hidden md:flex space-x-6">
              <div className="w-16 h-3 bg-slate-200 rounded-md animate-pulse" />
              <div className="w-16 h-3 bg-slate-200 rounded-md animate-pulse" />
              <div className="w-16 h-3 bg-slate-200 rounded-md animate-pulse" />
            </div>
            <div className="w-20 h-8 bg-slate-200 rounded-xl animate-pulse" />
          </header>

          {/* Body Skeleton */}
          <div className="flex-1 max-w-4xl w-full mx-auto p-6 space-y-8 overflow-y-auto">
            
            {/* Hero Banner Skeleton */}
            <div className="w-full h-48 sm:h-64 rounded-3xl bg-slate-200/80 relative overflow-hidden flex flex-col justify-end p-6 space-y-3">
              {/* Shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              <div className="w-2/3 h-6 bg-slate-300 rounded-lg" />
              <div className="w-1/2 h-4 bg-slate-300 rounded-md" />
            </div>

            {/* Search Bar Skeleton */}
            <div className="max-w-xl mx-auto w-full h-12 rounded-2xl bg-white border border-slate-200 flex items-center px-4 space-x-3 shadow-xs">
              <div className="w-4 h-4 rounded-full bg-slate-200" />
              <div className="flex-1 h-3 bg-slate-100 rounded-md" />
            </div>

            {/* Categories Circle Skeletons */}
            <div className="space-y-3">
              <div className="w-32 h-4 bg-slate-200 rounded-md" />
              <div className="flex justify-between sm:justify-start sm:space-x-8">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-slate-200/80 animate-pulse" />
                    <div className="w-10 h-2.5 bg-slate-200 rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            {/* Service Cards Skeletons */}
            <div className="space-y-4">
              <div className="w-40 h-4 bg-slate-200 rounded-md" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-2xs">
                    <div className="w-full h-24 bg-slate-100 rounded-xl" />
                    <div className="w-3/4 h-3 bg-slate-200 rounded-md" />
                    <div className="w-1/2 h-2.5 bg-slate-100 rounded-md" />
                    <div className="flex justify-between items-center pt-2">
                      <div className="w-12 h-4 bg-slate-200 rounded-md" />
                      <div className="w-16 h-7 bg-slate-200 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Step 3 & 4: Active Service cycling, Dynamic status messaging, & Progress bar */}
          <div className="border-t border-slate-200 bg-white p-6 shrink-0 relative flex flex-col items-center space-y-4 shadow-lg z-40">
            
            {/* Dynamic messaging & icon cycling */}
            <ServiceCycler />

            {/* Friendly loading status */}
            <div className="text-center space-y-1">
              <MessageCycler />
            </div>

            {/* Custom Modern Progress Bar - Asymptotic CSS Width Transition */}
            <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 relative">
              <div 
                className="h-full bg-brand-orange transition-all duration-[8000ms] ease-out" 
                style={{ width: mounted ? '92%' : '0%' }} 
              />
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

const LegacyServiceDetailsRedirect: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!serviceId) {
      navigate('/404', { replace: true });
      return;
    }

    const target = serviceCatalog.find((item) => item.id === serviceId);
    if (target) {
      navigate(`/services/${target.slug}`, { replace: true });
    } else {
      navigate('/404', { replace: true });
    }
  }, [serviceId, navigate]);

  return null;
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // General App State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('Gaur City 1, Noida Extension, UP');
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  
  // Dynamic Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('ks_auth_session');
    return saved ? JSON.parse(saved).isLoggedIn : false;
  });
  const [userRole, setUserRole] = useState<'customer' | 'admin' | null>(() => {
    const saved = localStorage.getItem('ks_auth_session');
    return saved ? JSON.parse(saved).userRole : null;
  });
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; photoUrl: string; phone?: string } | null>(() => {
    const saved = localStorage.getItem('ks_auth_session');
    return saved ? JSON.parse(saved).currentUser : null;
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loginTriggerSource, setLoginTriggerSource] = useState<'navbar' | 'checkout' | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Sync / Real-time Datastores State
  const [services, setServices] = useState<TechnicalService[]>(servicesData);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [businessConfigState, setBusinessConfigState] = useState<BusinessConfig>(businessConfig);
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const handleUpdateBookingStatus = async (bookingId: string, status: 'Pending' | 'Completed' | 'Cancelled') => {
    setBookings(prevBookings => 
      prevBookings.map(b => b.id === bookingId ? { ...b, status } : b)
    );
    if (db) {
      try {
        const bookingDocRef = doc(db, 'bookings', bookingId);
        await updateDoc(bookingDocRef, { status });
      } catch (err) {
        try {
          const invoiceDocRef = doc(db, 'invoices', bookingId);
          await updateDoc(invoiceDocRef, { status });
        } catch (e) {
          console.warn("Could not sync booking status to Firestore:", e);
        }
      }
    }
  };

  // Scroll to top automatically on route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Dedicated redirect for billing subdomain to Staff Portal
  useEffect(() => {
    if (window.location.hostname === 'billing.kselectrical.in' && !location.pathname.startsWith('/admin')) {
      navigate('/admin/login');
    }
  }, [location.pathname, navigate]);

  // Async load public data from Firestore database on mount
  useEffect(() => {
    const loadInitialData = async () => {
      setIsDataLoading(true);
      try {
        // 1. Run migration first
        await runMigrationToFirestore();

        // 2. Load categories
        await loadCategoriesFromDb();

        const srvs = await loadServicesFromDb(servicesData);
        setServices(srvs);

        const config = await loadBusinessConfigFromDb(businessConfig);
        setBusinessConfigState(config);
      } catch (e) {
        console.error("Error loading initial public data from Firestore:", e);
      } finally {
        setIsDataLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Async load authenticated data (bookings, invoices, customers) once auth resolves
  useEffect(() => {
    const loadAuthData = async () => {
      if (isAuthLoading) return;

      if (isLoggedIn && currentUser && userRole) {
        try {
          if (userRole === 'admin') {
            // Admin: Load everything
            const bks = await getBookingsFromCloud();
            const invs = await getInvoicesFromCloud();
            
            const getSafeSortDate = (val: any): Date => {
              if (!val) return new Date(0);
              if (typeof val === 'object' && val !== null && 'toDate' in val && typeof val.toDate === 'function') {
                return val.toDate();
              }
              if (typeof val === 'object' && val !== null && 'seconds' in val && typeof val.seconds === 'number') {
                return new Date(val.seconds * 1000);
              }
              const d = new Date(val);
              return isNaN(d.getTime()) ? new Date(0) : d;
            };

            const combined = [...(bks || []), ...(invs || [])].sort(
              (a, b) => getSafeSortDate(b.createdAt).getTime() - getSafeSortDate(a.createdAt).getTime()
            );
            setBookings(combined);

            const custs = await getCustomersFromFirestore();
            setCustomers(custs);
          } else if (userRole === 'customer') {
            // Customer: Load only their specific bookings
            const customerBookings = await getBookingsForCustomerFromCloud(
              currentUser.phone || '',
              currentUser.email || ''
            );
            setBookings(customerBookings);
            setCustomers([]); // Customers don't read customer directory
          }
        } catch (err) {
          console.error("Error loading authenticated data from Firestore:", err);
        }
      } else {
        // Guest: Load mock/local data only if Firebase is not active
        if (!isFirebaseConfigured) {
          const bks = await getBookingsFromCloud();
          setBookings(bks);
          const custs = await getCustomersFromFirestore();
          setCustomers(custs);
        } else {
          // Firebase active guest: reset states to empty array, no queries to restricted tables!
          setBookings([]);
          setCustomers([]);
        }
      }
    };

    loadAuthData();
  }, [isLoggedIn, currentUser, userRole, isAuthLoading]);

  // Monitor Authentication Session Status dynamically (Admins Google OAuth & Customers Phone Login)
  useEffect(() => {
    let unsubscribe = () => {};
    if (isFirebaseConfigured && auth) {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setIsAuthLoading(true);
        try {
          if (firebaseUser) {
            const email = firebaseUser.email || '';
            const name = firebaseUser.displayName || 'User';
            const photoUrl = firebaseUser.photoURL || '/profile.webp';
            
            const saved = localStorage.getItem('ks_auth_session');
            let parsed = null;
            try {
              parsed = saved ? JSON.parse(saved) : null;
            } catch (e) {
              console.warn("Stale session parse failed:", e);
            }
            
            // Check if they are admin: either they have a registered admin email, or they are an anonymous backup admin
            const isBackupAdminSession = firebaseUser.isAnonymous && parsed && parsed.userRole === 'admin';
            const isAdmin = isBackupAdminSession || (await isAdminEmail(email));
            
            let role: 'customer' | 'admin' = 'customer';
            let activeUser;
            if (isAdmin) {
              role = 'admin';
              activeUser = parsed?.currentUser || { name, email, photoUrl };
              setIsLoggedIn(true);
              setUserRole('admin');
              setCurrentUser(activeUser);
              if (email) {
                await saveAdminLogToCloud(email, 'admin_refresh');
              }
            } else {
              // It is a customer
              role = 'customer';
              const phone = email.endsWith('@kselectrical.in') ? email.split('@')[0] : '';
              activeUser = { name, email, photoUrl, phone };
              setIsLoggedIn(true);
              setUserRole('customer');
              setCurrentUser(activeUser);
            }
            localStorage.setItem('ks_auth_session', JSON.stringify({
              isLoggedIn: true,
              userRole: role,
              currentUser: activeUser,
              isBackupAdmin: isBackupAdminSession || (parsed?.isBackupAdmin ?? false)
            }));
          } else {
            const saved = localStorage.getItem('ks_auth_session');
            let parsed = null;
            try {
              parsed = saved ? JSON.parse(saved) : null;
            } catch (e) {
              console.warn("Stale session parse failed:", e);
            }
            if (parsed && parsed.isBackupAdmin) {
              // Only allow client-side admin session bypass if running in local fallback mode (Firebase not active)
              if (!isFirebaseConfigured) {
                setIsLoggedIn(true);
                setUserRole('admin');
                setCurrentUser(parsed.currentUser);
              } else {
                setIsLoggedIn(false);
                setUserRole(null);
                setCurrentUser(null);
                localStorage.removeItem('ks_auth_session');
              }
            } else {
              setIsLoggedIn(false);
              setUserRole(null);
              setCurrentUser(null);
              localStorage.removeItem('ks_auth_session');
            }
          }
        } catch (authErr) {
          console.error("Auth state handling error:", authErr);
        } finally {
          setIsAuthLoading(false);
        }
      });
    } else {
      // For local fallback mode, check if there is a local session
      const saved = localStorage.getItem('ks_auth_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        setIsLoggedIn(parsed.isLoggedIn);
        setUserRole(parsed.userRole);
        setCurrentUser(parsed.currentUser);
      }
      setTimeout(() => {
        setIsAuthLoading(false);
      }, 50);
    }
    return () => unsubscribe();
  }, []);

  // Extracted lists
  const categories = Array.from(new Set(services.map((s) => s.category)));

  const searchSuggestions = useMemo(() => {
    if (!searchQuery) return [];
    return getSearchSuggestions(searchQuery, serviceCatalog)
      .filter((service) => selectedCategory === 'ALL' || service.category === selectedCategory);
  }, [searchQuery, selectedCategory]);

  const filteredServices = useMemo(() => {
    if (!searchQuery) {
      return services.filter(service => 
        selectedCategory === 'ALL' || service.category === selectedCategory
      );
    }

    return searchSuggestions
      .map((matchedService) => services.find((service) => service.id === matchedService.id))
      .filter((service): service is TechnicalService => Boolean(service));
  }, [services, searchQuery, selectedCategory, searchSuggestions]);

  const handleSearchSubmit = (query: string) => {
    const slug = getUniqueSuggestionSlug(query, serviceCatalog);
    if (slug) {
      navigate(`/services/${slug}`);
    } else {
      navigate('/services');
    }
  };

  const spellingCorrection = null;

  // Cart Functions
  const handleAddToCart = (service: TechnicalService, brand?: string) => {
    const key = service.id + (brand ? `-${brand}` : '');
    setCart((prev) => {
      const existing = prev[key];
      if (existing) {
        return {
          ...prev,
          [key]: { ...existing, quantity: existing.quantity + 1 }
        };
      }
      return {
        ...prev,
        [key]: {
          serviceId: service.id,
          serviceName: service.name,
          price: service.price,
          quantity: 1,
          brand
        }
      };
    });
  };

  const handleRemoveFromCart = (serviceId: string, brand?: string) => {
    const key = serviceId + (brand ? `-${brand}` : '');
    setCart((prev) => {
      const existing = prev[key];
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return {
        ...prev,
        [key]: { ...existing, quantity: existing.quantity - 1 }
      };
    });
  };

  const handleClearCart = () => {
    setCart({});
  };

  // Auth Callbacks
  const handleProceedToCheckout = () => {
    if (!isLoggedIn) {
      setLoginTriggerSource('checkout');
      setShowLoginModal(true);
    } else {
      navigate('/checkout');
    }
  };

  const handleLoginSuccess = (
    role: 'customer' | 'admin', 
    user?: { name: string; email: string; photoUrl: string; phone?: string },
    isBackupAdmin: boolean = false
  ) => {
    setIsLoggedIn(true);
    setUserRole(role);
    
    // Create admin user object if missing
    const activeUser = user || (role === 'admin' ? {
      name: 'Kaushindra Singh',
      email: 'kaushindrasingh04@gmail.com',
      photoUrl: '/profile.webp'
    } : undefined);

    if (activeUser) {
      setCurrentUser(activeUser);
      // Persist local backup session or regular session
      localStorage.setItem('ks_auth_session', JSON.stringify({
        isLoggedIn: true,
        userRole: role,
        currentUser: activeUser,
        isBackupAdmin: isBackupAdmin
      }));

      if (role === 'admin') {
        saveAdminLogToCloud(activeUser.email, 'admin_login');
      } else if (role === 'customer' && activeUser && activeUser.phone) {
        saveCustomerToCloud({
          name: activeUser.name,
          phone: activeUser.phone,
          photoUrl: activeUser.photoUrl
        }).then(() => {
          getCustomersFromFirestore().then(setCustomers);
        });
      }
    }
    
    // Close modal immediately and run navigation check
    setShowLoginModal(false);
    setTimeout(() => {
      if (role === 'admin') {
        navigate('/admin/catalog');
      } else if (loginTriggerSource === 'checkout') {
        navigate('/checkout');
      }
      setLoginTriggerSource(null);
    }, 100);
  };

  const handleLogout = async () => {
    const activeEmail = currentUser?.email || 'kaushindrasingh04@gmail.com';
    if (userRole === 'admin') {
      await saveAdminLogToCloud(activeEmail, 'admin_logout');
    }
    await signOutUser();
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentUser(null);
    localStorage.removeItem('ks_auth_session');
    navigate('/');
  };

  const handleBookingSubmit = async (bookingDetails: Omit<BookingData, 'id' | 'createdAt' | 'status'>) => {
    const saved = await saveBookingToCloud(bookingDetails);
    setBookings(prev => [saved, ...prev]);
  };

  // Tax Invoice PDF Generation Logic
  const handleGenerateInvoice = (booking: BookingData) => {
    const escapeHtml = (unsafe: string): string => {
      if (!unsafe) return '';
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    const getSafeInvoiceDate = (val: any): Date => {
      if (!val) return new Date();
      if (typeof val === 'object' && val !== null && 'toDate' in val && typeof val.toDate === 'function') {
        return val.toDate();
      }
      if (typeof val === 'object' && val !== null && 'seconds' in val && typeof val.seconds === 'number') {
        return new Date(val.seconds * 1000);
      }
      const d = new Date(val);
      return isNaN(d.getTime()) ? new Date() : d;
    };
    const invoiceDate = getSafeInvoiceDate(booking.createdAt);

    let iframe = document.getElementById('print-invoice-iframe') as HTMLIFrameElement;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'print-invoice-iframe';
      iframe.style.position = 'absolute';
      iframe.style.width = '0px';
      iframe.style.height = '0px';
      iframe.style.border = 'none';
      iframe.style.left = '-9999px';
      iframe.style.top = '-9999px';
      document.body.appendChild(iframe);
    }

    // Dynamic tax calculations based on individual item GST rates
    const validItems = (booking.items || []).filter(Boolean);
    let totalBase = 0;
    let totalGst = 0;
    validItems.forEach(item => {
      const itemTotal = item.price * item.quantity;
      const rate = (item as any).gstRate ?? 18;
      const base = itemTotal / (1 + (rate / 100));
      const gst = itemTotal - base;
      totalBase += base;
      totalGst += gst;
    });

    const totalAmount = booking.subtotal;
    const baseAmount = Math.round(totalBase);
    const cgst = Math.round(totalGst / 2);
    const sgst = Math.round(totalGst - cgst);

    const itemsRows = validItems.map((item, idx) => {
      const rate = (item as any).gstRate ?? 18;
      return `
        <tr style="font-size: 9.5px;">
          <td style="padding: 4px 6px; border-bottom: 1px solid #e5e7eb; text-align: center; font-weight: bold; color: #4b5563;">${idx + 1}</td>
          <td style="padding: 4px 6px; border-bottom: 1px solid #e5e7eb; text-align: left;">
            <div style="font-weight: 800; color: #111827;">${escapeHtml(item.serviceName)}</div>
            ${item.brand ? `<span style="font-size: 7.5px; background: #eff6ff; color: #2563eb; padding: 1px 4px; border: 1px solid #bfdbfe; border-radius: 3px; display: inline-block; margin-top: 1px; font-weight: 800; text-transform: uppercase;">${escapeHtml(item.brand)}</span>` : ''}
          </td>
          <td style="padding: 4px 6px; border-bottom: 1px solid #e5e7eb; text-align: center; font-weight: bold; color: #111827;">${item.quantity}</td>
          <td style="padding: 4px 6px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: #111827;">₹${item.price.toLocaleString('en-IN')}</td>
          <td style="padding: 4px 6px; border-bottom: 1px solid #e5e7eb; text-align: center; font-weight: bold; color: #2563eb;">${rate}%</td>
          <td style="padding: 4px 6px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 900; color: #1e3a8a;">₹ ${(item.price * item.quantity).toLocaleString('en-IN')}</td>
        </tr>
      `;
    }).join('');

    const stampClass = booking.status === 'Completed' ? 'stamp' : booking.status === 'Cancelled' ? 'stamp-cancelled' : 'stamp-pending';
    const stampLabel = booking.status === 'Completed' ? 'PAID' : booking.status === 'Cancelled' ? 'CANCELLED' : 'PENDING';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${escapeHtml(booking.id)}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playball&display=swap');
            @page {
              size: A4;
              margin: 0; /* Suppresses browser default headers and URL footers completely */
            }
            body {
              font-family: 'Inter', sans-serif;
              color: #1f2937;
              margin: 0;
              padding: 14mm 16mm 14mm 16mm; /* Reconstructs elegant page margins in print layout */
              line-height: 1.3;
              background: #fff;
              font-size: 10.5px;
              box-sizing: border-box;
            }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .no-print { display: none; }
            }
            .header-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #2563eb; padding-bottom: 12px; margin-bottom: 15px; position: relative; }
            .details-text { font-size: 9.5px; color: #4b5563; font-weight: 500; margin: 2px 0; }
            .info-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 15px; }
            .card-block { border: 1px solid #e5e7eb; padding: 10px 12px; border-radius: 8px; background: #f9fafb; text-align: left; }
            .section-title { font-size: 8px; font-weight: 900; color: #9ca3af; text-transform: uppercase; margin-bottom: 6px; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px; letter-spacing: 0.05em; }
            .card-bold { font-size: 11.5px; font-weight: 800; color: #111827; margin-bottom: 4px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
            th { background: #1f2937; color: white; padding: 8px 6px; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; }
            
            .summary-payment-wrapper { display: flex; justify-content: space-between; margin-bottom: 15px; gap: 25px; align-items: start; }
            .payment-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 12px; background: #f9fafb; flex: 1; text-align: left; }
            .totals-container { width: 280px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 12px; background: #f9fafb; }
            .totals-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 10.5px; font-weight: 650; color: #4b5563; }
            .totals-final { border-top: 2px solid #2563eb; padding-top: 6px; margin-top: 4px; font-size: 13px; font-weight: 900; color: #1e3a8a; }
            
            .signature-section { display: flex; justify-content: space-between; align-items: end; margin-top: 20px; }
            
            /* Stamp Styles */
            .stamp {
              position: absolute;
              top: 5px;
              right: 200px;
              border: 3px double #10b981;
              color: #10b981;
              font-size: 13px;
              font-weight: 900;
              text-transform: uppercase;
              padding: 4px 10px;
              border-radius: 6px;
              transform: rotate(-8deg);
              letter-spacing: 1px;
              background: rgba(16, 185, 129, 0.05);
              box-shadow: 0 0 0 1.5px #10b981;
            }
            .stamp-pending {
              position: absolute;
              top: 5px;
              right: 200px;
              border: 3px double #d97706;
              color: #d97706;
              font-size: 13px;
              font-weight: 900;
              text-transform: uppercase;
              padding: 4px 10px;
              border-radius: 6px;
              transform: rotate(-8deg);
              letter-spacing: 1px;
              background: rgba(217, 119, 6, 0.05);
              box-shadow: 0 0 0 1.5px #d97706;
            }
            .stamp-cancelled {
              position: absolute;
              top: 5px;
              right: 200px;
              border: 3px double #dc2626;
              color: #dc2626;
              font-size: 13px;
              font-weight: 900;
              text-transform: uppercase;
              padding: 4px 10px;
              border-radius: 6px;
              transform: rotate(-8deg);
              letter-spacing: 1px;
              background: rgba(220, 38, 38, 0.05);
              box-shadow: 0 0 0 1.5px #dc2626;
            }
          </style>
        </head>
        <body>
          <div class="header-bar" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #2563eb; padding-bottom: 12px; margin-bottom: 15px; position: relative;">
            <div style="display: flex; gap: 14px; text-align: left; max-width: 65%;">
              <div style="width: 52px; height: 52px; border-radius: 50%; overflow: hidden; border: 1.5px solid #2563eb; display: flex; align-items: center; justify-content: center; background: #f9fafb; flex-shrink: 0; margin-top: 2px;">
                <img src="${getAssetPath(businessConfigState.logoUrl)}" alt="${escapeHtml(businessConfigState.name)} Logo" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; var s=document.createElement('span'); s.innerText='KS'; s.style.fontWeight='900'; s.style.color='#2563eb'; s.style.fontSize='16px'; this.parentElement.appendChild(s);" />
              </div>
              <div>
                <div style="font-size: 20px; font-weight: 900; color: #1e3a8a; letter-spacing: -0.025em; line-height: 1.1;">${escapeHtml(businessConfigState.name)}</div>
                <div style="font-size: 8px; color: #3b82f6; font-weight: 800; text-transform: uppercase; margin-top: 1px; letter-spacing: 0.8px;">${escapeHtml(businessConfigState.tagline)}</div>
                <div style="font-size: 8.5px; color: #4b5563; font-weight: 600; margin-top: 3px; line-height: 1.3;">
                  📍 Gaur City 1, Greater Noida West, Noida Extension, UP 201301
                </div>
                <div style="font-size: 8.5px; color: #1f2937; font-weight: 700; margin-top: 4px; display: flex; flex-wrap: wrap; gap: 8px; line-height: 1.3;">
                  <span>📞 <strong>Contact:</strong> +91 ${escapeHtml(businessConfigState.contacts[0])} / +91 ${escapeHtml(businessConfigState.contacts[1])}</span>
                  <span>📧 <strong>Email:</strong> ${escapeHtml(businessConfigState.email)}</span>
                  <span>🌐 <strong>Web:</strong> ${escapeHtml(businessConfigState.website)}</span>
                </div>
              </div>
            </div>
            
            <div class="${stampClass}">${stampLabel}</div>
            
            <div class="invoice-details" style="text-align: right; max-width: 30%;">
              <div class="invoice-title" style="font-size: 20px; font-weight: 900; color: #111827; text-transform: uppercase; letter-spacing: 0.05em; line-height: 1;">Tax Invoice</div>
              <div class="invoice-id" style="font-size: 10px; font-weight: 800; color: #2563eb; margin-top: 3px;">INVOICE ID: ${escapeHtml(booking.id)}</div>
              <div class="details-text" style="margin-top: 3px; font-size: 9px; color: #4b5563; font-weight: 650; text-align: right;">Date: ${invoiceDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>

          <div class="info-grid">
            <div class="card-block" style="border-left: 3px solid #2563eb;">
              <div class="section-title">Bill To (Customer Details)</div>
              <div class="card-bold">${escapeHtml(booking.customerName)}</div>
              <div class="details-text">📞 <strong>Contact:</strong> +91 ${escapeHtml(booking.phone)}</div>
              <div class="details-text">📍 <strong>Address:</strong> ${escapeHtml(booking.address)}</div>
            </div>
            <div class="card-block">
              <div class="section-title">Invoice & Schedule Details</div>
              <div class="details-text"><strong>Invoice Number:</strong> ${escapeHtml(booking.id)}</div>
              <div class="details-text"><strong>Billing Date:</strong> ${invoiceDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div class="details-text"><strong>Schedule Slot:</strong> ${escapeHtml(booking.dateTime)}</div>
              <div class="details-text"><strong>Service Status:</strong> ${escapeHtml(booking.status === 'Completed' ? 'Completed & Handed Over' : booking.status)}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 8%; text-align: center; padding: 8px 6px;">S.No</th>
                <th style="width: 48%; text-align: left; padding: 8px 6px;">Job / Service Description</th>
                <th style="width: 10%; text-align: center; padding: 8px 6px;">Qty</th>
                <th style="width: 14%; text-align: right; padding: 8px 6px;">Rate</th>
                <th style="width: 8%; text-align: center; padding: 8px 6px;">GST</th>
                <th style="width: 12%; text-align: right; padding: 8px 6px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <div class="summary-payment-wrapper">
            <div class="payment-card" style="flex: 1; min-height: 80px; padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb; text-align: left;">
              <div class="section-title" style="font-size: 8.5px; font-weight: 900; color: #475569; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px; margin-bottom: 6px; text-transform: uppercase;">Terms & Conditions / Warranty (नियम, शर्तें एवं वारंटी)</div>
              <div style="font-size: 8.5px; color: #4b5563; line-height: 1.45; white-space: pre-line; font-weight: 550;">${escapeHtml(booking.termsAndConditions || `1. 30-Day doorstep warranty applies on AC repairs.\n2. Kindly check all fittings and cooling before final handoff.\n3. Physical damage or third-party repair voids warranty.`)}</div>
            </div>
            
            <div class="totals-container">
              <div class="totals-row">
                <span>Taxable Value (Base):</span>
                <span>₹${baseAmount.toLocaleString('en-IN')}</span>
              </div>
              <div class="totals-row">
                <span>CGST (Central Tax):</span>
                <span>₹${cgst.toLocaleString('en-IN')}</span>
              </div>
              <div class="totals-row">
                <span>SGST (State Tax):</span>
                <span>₹${sgst.toLocaleString('en-IN')}</span>
              </div>
              <div class="totals-row totals-final">
                <span>Grand Total:</span>
                <span>₹${totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div class="signature-section" style="display: flex; justify-content: flex-end; align-items: end; margin-top: 15px;">
            <div style="text-align: center; width: 160px; padding-top: 5px;">
              <div style="font-family: 'Playball', 'Brush Script MT', cursive; font-size: 20px; color: #1e3a8a; line-height: 1; margin-bottom: 2px; transform: rotate(-3deg); display: inline-block;">Kaushindra Singh</div>
              <div style="border-top: 1px solid #9ca3af; margin-top: 4px; padding-top: 3px; font-size: 8px; font-weight: 800; color: #4b5563; text-transform: uppercase; letter-spacing: 0.5px;">Authorized Signatory</div>
            </div>
          </div>
        </body>
      </html>
    `;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();
      
      setTimeout(() => {
        if (iframe.contentWindow) {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        }
      }, 500);
    }
  };

  // Cart totals
  const cartItems = Object.values(cart);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Cart checkout bar visibility checks
  const showMobileCartBar = cartCount > 0 && !location.pathname.startsWith('/admin') && location.pathname !== '/checkout';

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-brand-blue rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-bold text-gray-550 uppercase tracking-widest animate-pulse">Initializing Security Gate...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public customer pages layout */}
          <Route element={
            <PublicLayout 
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              cartCount={cartCount}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
              currentUser={currentUser}
              onLoginClick={() => { setLoginTriggerSource('navbar'); setShowLoginModal(true); }}
              onLogoutClick={handleLogout}
              onProfileClick={() => navigate('/customer/dashboard')}
              businessConfig={businessConfigState}
            />
          }>
            {/* Redirect index.html to / */}
            <Route path="/index.html" element={<Navigate to="/" replace />} />
            <Route path="/services/ac-repair" element={<Navigate to="/services/ac-service" replace />} />
            <Route path="/services/ac-installation" element={<Navigate to="/services/ac-service" replace />} />

            <Route path="/" element={
              <HomePage 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                spellingCorrection={spellingCorrection}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                filteredServices={filteredServices}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                onProceedToCheckout={handleProceedToCheckout}
                onSearchSubmit={handleSearchSubmit}
                businessConfig={businessConfigState}
              />
            } />
            
            <Route path="/services" element={
              <ServicesPage 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                spellingCorrection={spellingCorrection}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                filteredServices={filteredServices}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                onProceedToCheckout={handleProceedToCheckout}
                onSearchSubmit={handleSearchSubmit}
                businessConfig={businessConfigState}
              />
            } />

            {/* Service Pages */}
            <Route path="/ac-on-rent" element={
              <ACOnRentPage businessConfig={businessConfigState} />
            } />
            <Route path="/services/ac-service" element={
              <ACService 
                services={services}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                businessConfig={businessConfigState}
              />
            } />
            <Route path="/services/ro-service" element={
              <ROService 
                services={services}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                businessConfig={businessConfigState}
              />
            } />
            <Route path="/services/electrician-service" element={
              <ElectricianService 
                services={services}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                businessConfig={businessConfigState}
              />
            } />
            <Route path="/services/washing-machine-repair" element={
              <WashingMachineRepair 
                services={services}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                businessConfig={businessConfigState}
              />
            } />
            <Route path="/services/refrigerator-repair" element={
              <RefrigeratorRepair 
                services={services}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                businessConfig={businessConfigState}
              />
            } />
            <Route path="/services/chimney-service" element={
              <ChimneyService 
                services={services}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                businessConfig={businessConfigState}
              />
            } />
            <Route path="/services/geyser-service" element={
              <GeyserService 
                services={services}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                businessConfig={businessConfigState}
              />
            } />
            <Route path="/services/fan-service" element={
              <FanService 
                services={services}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                businessConfig={businessConfigState}
              />
            } />
            <Route path="/services/light-service" element={
              <LightService 
                services={services}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                businessConfig={businessConfigState}
              />
            } />
            <Route path="/services/home-installations" element={
              <HomeInstallations 
                services={services}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                businessConfig={businessConfigState}
              />
            } />
            <Route path="/services/microwave-service" element={
              <MicrowaveService 
                services={services}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                businessConfig={businessConfigState}
              />
            } />
            <Route path="/services/details/:serviceId" element={<LegacyServiceDetailsRedirect />} />
            <Route path="/services/:serviceSlug" element={
              <ServiceDetailsPage 
                services={services}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                onProceedToCheckout={handleProceedToCheckout}
                businessConfig={businessConfigState}
              />
            } />

            {/* Checkout Page */}
            <Route path="/checkout" element={
              <CheckoutPage 
                cart={cart}
                onClearCart={handleClearCart}
                selectedLocation={selectedLocation}
                onSubmitBooking={handleBookingSubmit}
                businessConfig={businessConfigState}
              />
            } />

            <Route path="/customer/dashboard" element={
              <CustomerDashboard 
                currentUser={currentUser}
                bookings={bookings}
                services={services}
                onLogout={handleLogout}
                onUpdateCurrentUser={setCurrentUser}
                handleGenerateInvoice={handleGenerateInvoice}
              />
            } />

            <Route path="/technician/dashboard" element={
              <TechnicianDashboard 
                bookings={bookings}
                onUpdateBookingStatus={handleUpdateBookingStatus}
              />
            } />

            {/* Informational Pages */}
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage businessConfig={businessConfigState} />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/privacy-policy" element={<PrivacyPage />} />
            <Route path="/terms-and-cond" element={<TermsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/anti-discrimination" element={<AntiDiscriminationPage />} />

            {/* Dynamic Local City SEO Landing Page */}
            <Route path="/services/:serviceSlug/:locationSlug" element={
              <LocalLandingPage 
                services={services}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                businessConfig={businessConfigState}
              />
            } />

            {/* Custom 404 Route */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Standalone Admin Login Page */}
          <Route path="/admin/login" element={
            <Login 
              isLoggedIn={isLoggedIn}
              userRole={userRole}
              onLoginSuccess={handleLoginSuccess}
            />
          } />

          {/* Admin Layout Scope */}
          <Route element={
            <AdminLayout 
              isLoggedIn={isLoggedIn}
              userRole={userRole}
              onLogout={handleLogout}
              businessConfig={businessConfigState}
            />
          }>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={
              <Dashboard 
                bookings={bookings}
                customers={customers}
                businessConfig={businessConfigState}
              />
            } />

            <Route path="/admin/catalog" element={
              <Catalog 
                services={services}
                onUpdateServices={setServices}
              />
            } />
            <Route path="/admin/categories" element={
              <Categories 
                services={services}
                onUpdateServices={setServices}
              />
            } />
            <Route path="/admin/branding" element={
              <Branding 
                businessConfig={businessConfigState}
                onUpdateBusinessConfig={setBusinessConfigState}
              />
            } />
            <Route path="/admin/customers" element={
              <Customers 
                customers={customers}
              />
            } />
            <Route path="/admin/requests" element={
              <Requests 
                bookings={bookings}
                onUpdateBookings={setBookings}
                handleGenerateInvoice={handleGenerateInvoice}
              />
            } />
            <Route path="/admin/billbook" element={
              <BillBook 
                bookings={bookings}
                onUpdateBookings={setBookings}
                handleGenerateInvoice={handleGenerateInvoice}
                isDataLoading={isDataLoading}
              />
            } />
            <Route path="/admin/billbook/create" element={
              <CreateManualInvoice 
                services={services}
                bookings={bookings}
                onUpdateBookings={setBookings}
                businessConfig={businessConfigState}
                handleGenerateInvoice={handleGenerateInvoice}
              />
            } />
          </Route>
        </Routes>
      </Suspense>

      {/* Phone Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Customer Profile Modal */}
      <CustomerProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentUser={currentUser}
        bookings={bookings}
        onLogout={handleLogout}
      />

      {/* Mobile Sticky Bottom Checkout Bar */}
      {showMobileCartBar && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-3.5 px-5 flex items-center justify-between z-45 shadow-lg md:hidden animate-in slide-in-from-bottom duration-250 font-sans select-none">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
              <ShoppingCart size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-gray-900 leading-tight">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} • ₹{cartSubtotal}
              </span>
              <span className="text-[9px] text-green-600 font-bold leading-tight mt-0.5">
                Free visitation included
              </span>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleProceedToCheckout}
            className="bg-brand-blue hover:bg-brand-blue-dark text-white rounded-lg py-2 px-4 text-xs font-black uppercase tracking-wider flex items-center space-x-1 shadow-sm transition-all cursor-pointer active:scale-95 text-center"
          >
            <span>Proceed</span>
            <ArrowRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
