import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { BookingForm } from '../components/BookingForm';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { MessageCircle, Phone, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import type { CartItem } from '../types';
import type { BusinessConfig } from '../data';
import type { BookingData } from '../firebase';

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
  const [showFullForm, setShowFullForm] = useState(false);

  // Quick booking state
  const [qName, setQName] = useState('');
  const [qPhone, setQPhone] = useState('');
  const [qAddress, setQAddress] = useState('');
  const [qSlot, setQSlot] = useState('');

  const cartItems = Object.values(cart);
  const serviceNames = cartItems.length > 0
    ? cartItems.map(i => i.serviceName).join(', ')
    : 'Home Service';

  const quickWhatsAppUrl = () => {
    const msg = `*Quick Booking – KS Electrical & AC Services*
──────────────────────────
*Name:* ${qName || '(Not provided)'}
*Phone:* ${qPhone || '(Not provided)'}
*Society / Flat:* ${qAddress || '(Not provided)'}
*Services:* ${serviceNames}
*Preferred Slot:* ${qSlot || '(Not selected)'}
──────────────────────────
Please dispatch a technician. Thank you!`;
    return `https://api.whatsapp.com/send?phone=919625724903&text=${encodeURIComponent(msg)}`;
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
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">Your Name</label>
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={qName}
                onChange={e => setQName(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">Mobile Number</label>
              <input
                type="tel"
                placeholder="e.g. 7895321472"
                value={qPhone}
                onChange={e => setQPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
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
            <a
              href={quickWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm tracking-wide shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <MessageCircle size={17} className="fill-white shrink-0" />
              Book Instantly via WhatsApp
            </a>

            <a
              href={`tel:${businessConfig.contacts[0]}`}
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
