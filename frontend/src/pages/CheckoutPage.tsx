import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { BookingForm } from '../components/BookingForm';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { MessageCircle, Phone, ChevronDown, ChevronUp, Zap, AlertCircle } from 'lucide-react';
import type { CartItem } from '../types';
import type { BusinessConfig } from '../data';
import type { BookingData } from '../firebase';
import { saveCustomerToCloud, getCustomerByPhoneFromDb, auth, isFirebaseConfigured } from '../firebase';
import { trackLeadEvent } from '../components/ScrollToTop';


interface CheckoutPageProps {
  cart: Record<string, CartItem>;
  onClearCart: () => void;
  selectedLocation: string;
  onSubmitBooking: (bookingDetails: Omit<BookingData, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  businessConfig: BusinessConfig;
}

const TIME_SLOTS_QUICK = [
  '09:00 AM – 12:00 PM (Morning)',
  '12:00 PM – 03:00 PM (Afternoon)',
  '03:00 PM – 06:00 PM (Evening)',
  '06:00 PM – 09:00 PM (Night Urgent)',
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cart,
  onClearCart,
  selectedLocation,
  onSubmitBooking,
  businessConfig
}) => {
  const navigate = useNavigate();
  const [showFullForm, setShowFullForm] = useState(false);

  // Quick booking state
  const [qName, setQName] = useState('');
  const [qPhone, setQPhone] = useState('');
  const [qAddress, setQAddress] = useState('');
  const [qSlot, setQSlot] = useState('');

  // Fix #2: Store fetched customer so handleWhatsAppBook can use it (was a closure race condition)
  const [fetchedCustomer, setFetchedCustomer] = useState<{ name?: string; address?: string } | null>(null);

  // Validation error state
  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  // Loading state — prevents double-submit and shows spinner until Firestore is done
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for scroll-to-field on validation error
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const cartItems = Object.values(cart);
  const serviceNames = cartItems.length > 0
    ? cartItems.map(i => i.serviceName).join(', ')
    : 'Home Service';

  // Auto-fill customer details from session or auth if available
  useEffect(() => {
    if (isFirebaseConfigured && auth && auth.currentUser) {
      const u = auth.currentUser;
      const phone = u.email && u.email.endsWith('@kselectrical.in') ? u.email.split('@')[0] : '';
      if (u.displayName) setQName(u.displayName);
      if (phone) setQPhone(phone);
    } else {
      const saved = localStorage.getItem('ks_customer_session');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.name) setQName(parsed.name);
          if (parsed.phone) setQPhone(parsed.phone);
          if (parsed.address) setQAddress(parsed.address);
        } catch {
          // ignore
        }
      }
    }
  }, []);

  // Handle phone input change with auto-lookup and instant server upload
  const handlePhoneChange = async (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 10);
    setQPhone(clean);
    if (phoneError) setPhoneError(false);

    if (clean.length === 10) {
      // Fix #2: Store fetched customer in state so handleWhatsAppBook can use it
      const existing = await getCustomerByPhoneFromDb(clean);
      if (existing) {
        setFetchedCustomer(existing);
        if (existing.name && !qName) setQName(existing.name);
        if (existing.address && !qAddress) setQAddress(existing.address);
      }

      // Immediately upload/sync customer to server database so the number is saved!
      saveCustomerToCloud({
        name: qName.trim() || existing?.name || 'Customer',
        phone: clean,
        address: qAddress.trim() || existing?.address || ''
      }).catch(console.warn);
    }
  };

  // Fix #8: Redirect to /services if cart is empty and user lands here directly
  useEffect(() => {
    if (cartItems.length === 0) {
      // Small delay so the page doesn't flash on slow networks
      const t = setTimeout(() => navigate('/services', { replace: true }), 800);
      return () => clearTimeout(t);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── WhatsApp booking handler ───────────────────────────────────────────────
  // Saves booking and customer to cloud Firestore FIRST, then opens WhatsApp.
  const handleWhatsAppBook = async () => {
    // Prevent double-submit while Firestore write is in progress
    if (isSubmitting) return;

    // Validate required fields
    let hasError = false;
    if (!qName.trim()) {
      setNameError(true);
      if (!hasError) nameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      hasError = true;
    } else {
      setNameError(false);
    }
    if (!qPhone.trim() || qPhone.length < 10) {
      setPhoneError(true);
      if (!hasError) phoneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      hasError = true;
    } else {
      setPhoneError(false);
    }
    if (hasError) return;

    // Show loading spinner — disable the button
    setIsSubmitting(true);

    // 1. Calculate price and compile items
    const cartSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const bookingItems = cartItems.length > 0 ? cartItems.map(item => ({
      serviceId: item.serviceId,
      serviceName: item.serviceName,
      price: item.price,
      quantity: item.quantity,
      brand: item.brand
    })) : [{
      serviceId: 'quick-service',
      serviceName: 'Doorstep Service (WhatsApp Inquiry)',
      price: 299,
      quantity: 1
    }];

    // 2. Build WhatsApp message (ready to use after save)
    const msg = `*Quick Booking – KS Electrical & AC Services*
──────────────────────────
*Name:* ${qName}
*Phone:* ${qPhone}
*Society / Flat:* ${qAddress || '(Not provided)'}
*Services:* ${serviceNames}
*Preferred Slot:* ${qSlot || '(Not selected)'}
──────────────────────────
Please dispatch a technician. Thank you!`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=919625724903&text=${encodeURIComponent(msg)}`;

    try {
      // 3. WAIT for Firestore writes to complete BEFORE opening WhatsApp
      //    so the network request is not cut mid-flight by navigation.
      await onSubmitBooking({
        customerName: qName.trim(),
        phone: qPhone.trim(),
        address: qAddress.trim() || 'Address to be confirmed on call',
        selectedLocation: selectedLocation || 'Noida Extension',
        dateTime: qSlot ? `Today (${qSlot})` : 'Immediate / Earliest Slot',
        urgency: 'ROUTINE',
        items: bookingItems,
        subtotal: cartSubtotal || 299
      });
      console.log('✅ Booking saved to Firestore successfully.');

      // 4. Sync customer record (use fetchedCustomer from state — fixes closure race condition)
      await saveCustomerToCloud({
        name: qName.trim() || fetchedCustomer?.name || 'Customer',
        phone: qPhone.trim(),
        address: qAddress.trim() || fetchedCustomer?.address || ''
      });
      console.log('✅ Customer record synced to Customers collection.');

      // 5. Fire GA4 lead event
      trackLeadEvent({
        method: 'whatsapp',
        service: serviceNames,
        page: window.location.pathname,
      });

      // 6. All data saved — NOW open WhatsApp safely
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    } catch (err) {
      console.error('❌ Booking save failed. WhatsApp NOT opened to prevent data loss:', err);
      // Optionally show user-friendly error here
    } finally {
      // Always reset loading state
      setIsSubmitting(false);
    }
  };

  // ── Call button handler ────────────────────────────────────────────────────
  const handleCallClick = () => {
    trackLeadEvent({
      method: 'call',
      service: serviceNames,
      page: window.location.pathname,
    });
  };



  return (
    <>
      <Helmet>
        <title>Book a Home Service | KS Electrical &amp; AC Services – Gaur City &amp; Greater Noida West</title>
        <meta name="description" content="Book a certified electrician, AC repair, RO service or appliance repair at your doorstep in Gaur City &amp; Greater Noida West. Quick WhatsApp booking available." />
        <link rel="canonical" href="https://www.kselectrical.in/checkout" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Breadcrumbs items={[{ label: 'Book a Service' }]} />

      {/* ── Quick 1-Step WhatsApp Booking ── */}
      <div className="bg-gradient-to-br from-emerald-50 to-white border-b border-emerald-100 py-10 px-4">
        <div className="max-w-xl mx-auto space-y-5">

          {/* Header */}
          <div className="text-center space-y-1">
            <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
              <Zap size={11} />
              Fastest Way to Book
            </span>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
              Quick 1-Step Booking
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Fill 4 fields &amp; tap WhatsApp — our operator calls to confirm. No registration needed.
            </p>
          </div>

          {/* Quick Form Card */}
          <div className="bg-white border border-emerald-200 rounded-2xl shadow-md p-5 space-y-4 text-left">

            {/* Name */}
            <div className="space-y-1" ref={nameRef as React.RefObject<HTMLDivElement>}>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={qName}
                onChange={e => { setQName(e.target.value); if (nameError) setNameError(false); }}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 transition-all ${
                  nameError
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-100 bg-red-50'
                    : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100'
                }`}
              />
              {nameError && (
                <p className="flex items-center gap-1 text-[10px] text-red-500 font-bold">
                  <AlertCircle size={11} /> Please enter your name to continue
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1" ref={phoneRef as React.RefObject<HTMLDivElement>}>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="e.g. 7895321472"
                value={qPhone}
                onChange={e => handlePhoneChange(e.target.value)}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 transition-all ${
                  phoneError
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-100 bg-red-50'
                    : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100'
                }`}
              />
              {phoneError && (
                <p className="flex items-center gap-1 text-[10px] text-red-500 font-bold">
                  <AlertCircle size={11} /> Please enter a valid 10-digit mobile number
                </p>
              )}
            </div>

            {/* Society / Flat */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">Society / Flat Number</label>
              <input
                type="text"
                placeholder="e.g. B-204, Gaur City 1, Sector 4"
                value={qAddress}
                onChange={e => setQAddress(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
            </div>

            {/* Preferred Time Slot */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">Preferred Time Slot</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TIME_SLOTS_QUICK.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setQSlot(slot)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-left cursor-pointer transition-all ${
                      qSlot === slot
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Services summary (read-only if cart has items) */}
            {cartItems.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Selected Services</span>
                {serviceNames}
              </div>
            )}

            {/* CTA Buttons */}
            {/* WhatsApp button — disabled while saving to Firestore to prevent race condition */}
            <button
              type="button"
              onClick={handleWhatsAppBook}
              disabled={isSubmitting}
              className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-black text-sm tracking-wide shadow-md transition-all cursor-pointer ${
                isSubmitting
                  ? 'bg-emerald-400 cursor-not-allowed opacity-80'
                  : 'bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white'
              }`}
            >
              {isSubmitting ? (
                <>
                  {/* Inline SVG spinner */}
                  <svg className="animate-spin h-4 w-4 text-white shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <span className="text-white">Saving Booking…</span>
                </>
              ) : (
                <>
                  <MessageCircle size={17} className="fill-white shrink-0" />
                  Book Instantly via WhatsApp
                </>
              )}
            </button>

            <a
              href={`tel:${businessConfig.contacts[0]}`}
              onClick={handleCallClick}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-sm transition-all cursor-pointer"
            >
              <Phone size={15} />
              Call Now: {businessConfig.contacts[0]}
            </a>

            {/* Trust badge */}
            <p className="text-center text-[10px] text-gray-400 font-semibold pt-1">
              🛡️ Technician at doorstep within 30–45 mins · Gaur City &amp; Gr. Noida West
            </p>
          </div>


          {/* Toggle to full form */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowFullForm(prev => !prev)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer underline-offset-2 hover:underline"
            >
              {showFullForm ? (
                <><ChevronUp size={14} /> Hide full scheduling form</>
              ) : (
                <><ChevronDown size={14} /> Prefer to schedule with date picker &amp; full details?</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Full Multi-step Booking Form (collapsible) ── */}
      {showFullForm && (
        <div className="bg-white py-12 border-b border-gray-100 text-center">
          <BookingForm
            cart={cart}
            onClearCart={onClearCart}
            selectedLocation={selectedLocation}
            onSubmitBooking={onSubmitBooking}
            businessConfig={businessConfig}
          />
        </div>
      )}
    </>
  );
};
export default CheckoutPage;
