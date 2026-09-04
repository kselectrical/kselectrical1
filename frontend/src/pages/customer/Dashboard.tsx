import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Phone, Mail, MapPin, Clock, 
  FileText, ShieldCheck, History, BookOpen, LogOut, 
  CheckCircle, ClipboardList, ShieldAlert, ShoppingBag, Package, ZoomIn, X
} from 'lucide-react';
import type { BookingData } from '../../firebase';
import type { TechnicalService, ProductOrder } from '../../types';
import { saveCustomerToCloud, getOrdersByPhoneFromDb } from '../../firebase';

interface CustomerDashboardProps {
  currentUser: { name: string; email?: string; photoUrl: string; phone?: string; address?: string } | null;
  bookings: BookingData[];
  services: TechnicalService[];
  onLogout: () => void;
  onUpdateCurrentUser: (user: { name: string; email?: string; photoUrl: string; phone?: string; address?: string }) => void;
  handleGenerateInvoice: (booking: BookingData) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentUser,
  bookings,
  services,
  onLogout,
  onUpdateCurrentUser,
  handleGenerateInvoice
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'track' | 'orders' | 'history' | 'warranties' | 'profile'>('track');
  const [productOrders, setProductOrders] = useState<ProductOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [viewingScreenshot, setViewingScreenshot] = useState<string | null>(null);
  
  // Profile edit states initialized from currentUser
  const [editName, setEditName] = useState(() => currentUser?.name || "");
  const [editEmail, setEditEmail] = useState(() => currentUser?.email || "");
  const [editPhone, setEditPhone] = useState(() => currentUser?.phone || "");
  const [editAddress, setEditAddress] = useState(() => currentUser?.address || "");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const activePhone = (editPhone || currentUser?.phone || '').replace(/\D/g, '');
  const cleanPhone = activePhone.length >= 10 ? activePhone.slice(-10) : activePhone;

  useEffect(() => {
    if (cleanPhone) {
      let isMounted = true;
      getOrdersByPhoneFromDb(cleanPhone).then(orders => {
        if (isMounted) {
          setProductOrders(orders);
          setLoadingOrders(false);
        }
      });
      return () => { isMounted = false; };
    }
  }, [cleanPhone]);

  if (!currentUser) return null;
  
  // Filter bookings for this customer
  const customerBookings = bookings.filter(b => {
    const bPhone = b.phone ? b.phone.replace(/\D/g, '') : '';
    const bTen = bPhone.length >= 10 ? bPhone.slice(-10) : bPhone;
    const bEmail = (b.email || '').trim().toLowerCase();
    const cEmail = (currentUser.email || '').trim().toLowerCase();

    const phoneMatch = cleanPhone && bTen && bTen === cleanPhone;
    const emailMatch = cEmail && bEmail && bEmail === cEmail;
    return phoneMatch || emailMatch;
  });

  const activeBookings = customerBookings.filter(b => b.status === 'Pending');
  const pastBookings = customerBookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled');

  // Calculate Warranty items
  const warrantyItems = customerBookings
    .filter(b => b.status === 'Completed')
    .flatMap(b => {
      return b.items.map(item => {
        // Find catalog service to fetch warranty duration
        const catalogService = services.find(s => s.id === item.serviceId);
        const warrantyDays = catalogService?.warranty.toLowerCase().includes('90') ? 90 : 30;
        
        const bookingDate = new Date(b.createdAt || b.dateTime);
        const expiryDate = new Date(bookingDate.getTime() + warrantyDays * 24 * 60 * 60 * 1000);
        const today = new Date();
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const remainingDays = diffDays < 0 ? 0 : diffDays;
        const progress = Math.round((remainingDays / warrantyDays) * 100);

        return {
          id: b.id,
          serviceName: item.serviceName,
          brand: item.brand,
          bookedOn: bookingDate.toLocaleDateString('en-IN'),
          expiryDate: expiryDate.toLocaleDateString('en-IN'),
          remainingDays,
          progress,
          warrantyDays
        };
      });
    });

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawClean = editPhone.trim().replace(/\D/g, '');
    const validPhone = rawClean.length >= 10 ? rawClean.slice(-10) : rawClean;

    const updatedUser = {
      ...currentUser,
      name: editName,
      email: editEmail,
      phone: validPhone || currentUser.phone,
      address: editAddress
    };
    
    // Save in local state & localStorage session
    onUpdateCurrentUser(updatedUser);

    // Save in Firestore Cloud Customers collection
    const savePhone = validPhone || currentUser.phone;
    if (savePhone) {
      try {
        await saveCustomerToCloud({
          name: editName,
          phone: savePhone,
          photoUrl: currentUser.photoUrl
        });
      } catch (err) {
        console.warn("Could not save to Cloud store:", err);
      }
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-left pb-16">
      
      {/* Top Banner Branding */}
      <header className="bg-slate-900 text-white py-8 px-6 sm:px-12 select-none shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-brand-orange text-white font-black text-2xl flex items-center justify-center border-2 border-white/20 uppercase shadow-inner">
              {currentUser.name ? currentUser.name[0] : 'C'}
            </div>
            <div className="space-y-1">
              <h1 className="text-xl md:text-2xl font-black tracking-tight">{currentUser.name || 'Valued Customer'}</h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Account Control & Live Booking Track</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Link 
              to="/services" 
              className="bg-brand-orange hover:bg-brand-orange/90 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center space-x-1.5"
            >
              <BookOpen size={14} />
              <span>Book a Service</span>
            </Link>
            <button
              onClick={handleLogoutClick}
              className="px-4 py-2.5 border border-white/20 hover:bg-white/10 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column Sidebar Tabs */}
        <aside className="lg:col-span-1 space-y-2 bg-white border border-slate-200 p-5 rounded-3xl shadow-2xs h-fit select-none">
          <button
            onClick={() => setActiveTab('track')}
            className={`w-full text-left px-4 py-3 rounded-xl font-extrabold text-xs flex items-center space-x-3 transition-all ${
              activeTab === 'track' ? 'bg-blue-600 text-white shadow-md shadow-blue-100 scale-102' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Clock size={15} />
            <span>Track Live Bookings</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-3 rounded-xl font-extrabold text-xs flex items-center space-x-3 transition-all ${
              activeTab === 'orders' ? 'bg-blue-600 text-white shadow-md shadow-blue-100 scale-102' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ShoppingBag size={15} />
            <span>मेरे ऑर्डर्स (Store Orders)</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`w-full text-left px-4 py-3 rounded-xl font-extrabold text-xs flex items-center space-x-3 transition-all ${
              activeTab === 'history' ? 'bg-blue-600 text-white shadow-md shadow-blue-100 scale-102' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <History size={15} />
            <span>Service History & Invoices</span>
          </button>
          <button
            onClick={() => setActiveTab('warranties')}
            className={`w-full text-left px-4 py-3 rounded-xl font-extrabold text-xs flex items-center space-x-3 transition-all ${
              activeTab === 'warranties' ? 'bg-blue-600 text-white shadow-md shadow-blue-100 scale-102' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck size={15} />
            <span>Warranty Tracker</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-xl font-extrabold text-xs flex items-center space-x-3 transition-all ${
              activeTab === 'profile' ? 'bg-blue-600 text-white shadow-md shadow-blue-100 scale-102' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <User size={15} />
            <span>Profile Details</span>
          </button>
        </aside>

        {/* Right Column Content Area */}
        <main className="lg:col-span-3 space-y-6">
          
          {activeTab === 'track' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase">Track Active Request</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Real-time status of your pending bookings</p>
              </div>

              {activeBookings.length === 0 ? (
                <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <ClipboardList size={32} className="text-slate-300 mx-auto mb-3" />
                  <h4 className="text-sm font-black text-slate-800">No active bookings</h4>
                  <p className="text-xs text-slate-500 mt-1">Everything is in order! You don't have any pending service visits scheduled.</p>
                  <Link 
                    to="/services" 
                    className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-xs"
                  >
                    Explore Services
                  </Link>
                </div>
              ) : (
                <div className="space-y-8">
                  {activeBookings.map((bk) => (
                    <div key={bk.id} className="border border-slate-200 rounded-2xl p-6 space-y-6">
                      
                      {/* Booking Summary */}
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[9px] font-black bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                            ID: {bk.id}
                          </span>
                          <h4 className="text-xs font-extrabold text-slate-800 mt-2">
                            {bk.items.map(i => `${i.serviceName} x${i.quantity}`).join(', ')}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-bold block mt-1">
                            📍 {bk.address || 'Doorstep Visit'}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-slate-950 block">₹{bk.subtotal}</span>
                          <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider mt-0.5 block">
                            Slot: {bk.dateTime}
                          </span>
                        </div>
                      </div>

                      {/* Visual Stepper Progress Bar */}
                      <div className="relative pt-4 select-none">
                        
                        {/* Connecting Line */}
                        <div className="absolute top-[28px] left-[5%] right-[5%] h-1 bg-slate-100 -z-10 rounded-full" />
                        <div className="absolute top-[28px] left-[5%] w-[45%] h-1 bg-blue-500 -z-10 rounded-full animate-pulse" />

                        <div className="flex justify-between text-center">
                          
                          {/* Step 1 */}
                          <div className="flex flex-col items-center space-y-2 w-1/4">
                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white border-4 border-white shadow-md flex items-center justify-center text-xs font-black">
                              1
                            </div>
                            <span className="text-[9px] font-black text-slate-800 uppercase tracking-wider">Received</span>
                          </div>

                          {/* Step 2 */}
                          <div className="flex flex-col items-center space-y-2 w-1/4">
                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white border-4 border-white shadow-md flex items-center justify-center text-xs font-black animate-pulse">
                              2
                            </div>
                            <span className="text-[9px] font-black text-slate-800 uppercase tracking-wider">Assigned</span>
                          </div>

                          {/* Step 3 */}
                          <div className="flex flex-col items-center space-y-2 w-1/4">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 border-4 border-white shadow-xs flex items-center justify-center text-xs font-black">
                              3
                            </div>
                            <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider">In Progress</span>
                          </div>

                          {/* Step 4 */}
                          <div className="flex flex-col items-center space-y-2 w-1/4">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 border-4 border-white shadow-xs flex items-center justify-center text-xs font-black">
                              4
                            </div>
                            <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider">Completed</span>
                          </div>

                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase">मेरे प्रोडक्ट्स ऑर्डर्स (Store Orders)</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">KS Electrical Store से खरीदे गए सामान का स्टेटस</p>
                </div>
                <Link
                  to="/shop"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-3.5 py-2 rounded-xl transition-all shadow-xs"
                >
                  + Place New Order
                </Link>
              </div>

              {loadingOrders && (
                <div className="py-12 text-center text-slate-400 text-xs font-bold animate-pulse">
                  आपके ऑर्डर्स लोड हो रहे हैं...
                </div>
              )}

              {!loadingOrders && productOrders.length === 0 && (
                <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <Package size={32} className="text-slate-300 mx-auto mb-3" />
                  <h4 className="text-sm font-black text-slate-800">कोई ऑर्डर नहीं मिला</h4>
                  <p className="text-xs text-slate-500 mt-1">आपने अभी तक Store से कोई सामान नहीं मंगवाया है।</p>
                  <Link 
                    to="/shop" 
                    className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-xs"
                  >
                    Store पर जाएं
                  </Link>
                </div>
              )}

              {!loadingOrders && productOrders.length > 0 && (
                <div className="space-y-4">
                  {productOrders.map(order => (
                    <div key={order.id} className="border border-slate-200 rounded-2xl p-5 bg-white shadow-2xs space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div>
                          <span className="text-xs font-black text-blue-700 uppercase tracking-wider">#{order.id}</span>
                          <span className="text-[11px] text-slate-400 font-bold ml-2">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Confirmed' ? 'bg-indigo-100 text-indigo-800' :
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {order.status === 'Pending' ? 'ऑर्डर प्रोसेस में है (Pending)' :
                             order.status === 'Confirmed' ? 'कन्फर्म हो गया (Confirmed)' :
                             order.status === 'Shipped' ? 'रास्ते में है (Shipped)' :
                             order.status === 'Delivered' ? 'डिलीवर हो गया (Delivered)' : order.status}
                          </span>
                        </div>
                      </div>

                      {/* Expected Delivery & Payment Status Bar */}
                      <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs border border-slate-100">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">🚚 कब तक आएगा (Expected Delivery)</span>
                          <span className="font-extrabold text-slate-800">
                            {order.status === 'Delivered' ? '✅ सामान डिलीवर हो चुका है' :
                             order.status === 'Shipped' ? '🚚 आज या कल में डिलीवरी (On the Way)' :
                             '⏳ 24-48 घंटे (1-2 दिन में डिलीवरी संभावित)'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">💳 Payment Status</span>
                          <span className={`font-extrabold ${order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-700'}`}>
                            {order.paymentStatus === 'Paid' ? '✅ Paid (Payment Received)' : '💵 Cash on Delivery / Pay via UPI upon delivery'}
                          </span>
                        </div>
                      </div>

                      {/* Items list */}
                      <div className="space-y-2 divide-y divide-slate-50 text-xs">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="pt-2 flex items-center justify-between text-slate-800">
                            <div className="flex items-center gap-2">
                              <img src={it.imageUrl || '/log.webp'} alt={it.productName} className="w-8 h-8 object-contain rounded bg-slate-50 border p-1" />
                              <div>
                                <p className="font-bold">{it.productName}</p>
                                <p className="text-[10px] text-slate-400">Qty: {it.quantity} × ₹{it.price}</p>
                              </div>
                            </div>
                            <span className="font-black">₹{it.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Footer Details */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Delivery Address</span>
                          <span className="font-semibold text-slate-800">{order.address}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount</span>
                          <span className="text-sm font-black text-blue-700">₹{order.totalAmount}</span>
                        </div>
                      </div>

                      {/* Payment Screenshot Proof & UTR Transaction Details */}
                      <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50/80 rounded-xl p-3 space-y-2">
                        <div className="flex flex-wrap items-center justify-between text-xs gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-600">Payment Mode:</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              order.paymentMethod === 'UPI' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {order.paymentMethod === 'UPI' ? '💳 UPI / Scan & Pay' : '💵 Cash on Delivery'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-600">Status:</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              order.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {order.paymentStatus === 'Paid' ? '✅ Paid (भुगतान प्राप्त हुआ)' : '⏳ Pay on Delivery'}
                            </span>
                          </div>
                        </div>

                        {/* Transaction UTR ID */}
                        {order.upiTransactionId && (
                          <div className="text-xs text-slate-700 font-mono">
                            <span className="font-bold text-slate-500">UTR / Ref ID: </span>
                            <span className="font-black text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">{order.upiTransactionId}</span>
                          </div>
                        )}

                        {/* Screenshot Proof Preview Image */}
                        {order.screenshotUrl ? (
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => setViewingScreenshot(order.screenshotUrl || null)}
                              className="flex items-center gap-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 p-1.5 rounded-xl transition-all cursor-pointer group shadow-2xs"
                            >
                              <img 
                                src={order.screenshotUrl} 
                                alt="Payment Proof" 
                                className="w-11 h-11 object-cover rounded-lg border border-blue-300 group-hover:scale-105 transition-transform bg-white" 
                              />
                              <div className="text-left pr-2">
                                <span className="text-[11px] font-black text-blue-900 block leading-tight">
                                  📸 पेमेंट स्क्रीनशॉट प्रमाण
                                </span>
                                <span className="text-[9px] text-blue-600 font-bold block mt-0.5">🔍 क्लिक करके फुलस्क्रीन में देखें</span>
                              </div>
                            </button>
                          </div>
                        ) : (
                          order.paymentMethod === 'UPI' && (
                            <p className="text-[10px] text-amber-700 font-bold bg-amber-50 p-2 rounded-lg border border-amber-200">
                              ℹ️ इस UPI ऑर्डर के साथ कोई स्क्रीनशॉट संलग्न नहीं था।
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase">Service History & Invoices</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Logs of your completed domestic services</p>
              </div>

              {pastBookings.length === 0 ? (
                <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <ClipboardList size={32} className="text-slate-300 mx-auto mb-3" />
                  <h4 className="text-sm font-black text-slate-800">No completed services</h4>
                  <p className="text-xs text-slate-500 mt-1">Once you complete a service checkup with our technician, your logs will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastBookings.map((bk) => (
                    <div key={bk.id} className="border border-slate-200 rounded-2xl p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                          bk.status === 'Completed' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                        }`}>
                          {bk.status}
                        </span>
                        <h4 className="text-xs font-extrabold text-slate-800 pt-1">
                          {bk.items.map(i => `${i.serviceName} x${i.quantity}`).join(', ')}
                        </h4>
                        <span className="text-[9px] text-slate-450 font-bold block">
                          Booked: {new Date(bk.createdAt || bk.dateTime).toLocaleDateString('en-IN')} • ID: {bk.id}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <span className="text-sm font-black text-slate-950">₹{bk.subtotal}</span>
                        {bk.status === 'Completed' && (
                          <button
                            onClick={() => handleGenerateInvoice(bk)}
                            className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                          >
                            <FileText size={12} />
                            <span>Invoice</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'warranties' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase">Replaced Spares Warranty Tracker</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Active warranty periods on items replaced</p>
              </div>

              {warrantyItems.length === 0 ? (
                <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <ShieldAlert size={32} className="text-slate-300 mx-auto mb-3" />
                  <h4 className="text-sm font-black text-slate-800">No active warranties</h4>
                  <p className="text-xs text-slate-500 mt-1">Warranties are automatically registered when technical services are completed.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {warrantyItems.map((item, idx) => (
                    <div key={idx} className="border border-slate-250 rounded-2xl p-5 bg-slate-50/50 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-black text-slate-900 leading-snug max-w-[70%]">{item.serviceName}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                            item.remainingDays > 0 ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
                          }`}>
                            {item.remainingDays > 0 ? 'Active' : 'Expired'}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider block">
                          Booked: {item.bookedOn} • Expiry: {item.expiryDate}
                        </span>
                      </div>

                      <div className="mt-6 space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
                          <span className="text-slate-500">Coverage Duration</span>
                          <span className="text-blue-600">{item.remainingDays} days remaining</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden border border-slate-250 relative">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              item.remainingDays > 10 ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${item.progress}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase">Profile Details</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Manage your personal domestic account settings</p>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-4 text-xs font-bold text-slate-650 max-w-md">
                <div className="space-y-1.5">
                  <label className="block">Contact Mobile (10-Digit Mobile Number)</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      placeholder="Enter 10-digit mobile number"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-10 py-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block">Full Name</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-10 py-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block">Email Address</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-10 py-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block">Default Address</label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-3.5 text-slate-400" />
                    <textarea
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-slate-850 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {saveSuccess && (
                  <div className="flex items-center space-x-2 text-green-600 font-extrabold text-xs">
                    <CheckCircle size={14} />
                    <span>Profile saved successfully!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider py-2.5 px-6 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Profile
                </button>
              </form>
            </div>
          )}

        </main>

      </div>

      {/* Fullscreen Payment Screenshot Lightbox Modal */}
      {viewingScreenshot && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 cursor-pointer animate-fade-in"
          onClick={() => setViewingScreenshot(null)}
        >
          <div 
            className="bg-white rounded-3xl p-5 max-w-lg w-full text-center space-y-4 shadow-2xl relative animate-scale-up" 
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setViewingScreenshot(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 justify-center text-blue-700 font-black text-sm pt-1">
              <span>📸 पेमेंट स्क्रीनशॉट प्रमाण (Payment Proof)</span>
            </div>

            <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200 max-h-[70vh] overflow-auto flex items-center justify-center">
              <img 
                src={viewingScreenshot} 
                alt="Payment Proof Fullscreen" 
                className="max-w-full max-h-[65vh] object-contain rounded-xl shadow-md bg-white" 
              />
            </div>

            <div className="flex items-center justify-center gap-3 pt-1">
              <a
                href={viewingScreenshot}
                download="payment_screenshot.jpg"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <ZoomIn size={14} />
                <span>Open Original Size / Download Invoice</span>
              </a>

              <button
                type="button"
                onClick={() => setViewingScreenshot(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default CustomerDashboard;
