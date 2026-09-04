import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, User, MapPin, CheckCircle2, 
  Camera, X, ShieldCheck, 
  AlertCircle, ArrowRight, Check, Zap, MessageSquare, PhoneCall
} from 'lucide-react';
import { businessConfig } from '../data';
import { auth, isFirebaseConfigured, getCustomerByPhoneFromDb, saveBookingToCloud } from '../firebase';
import type { BookingData } from '../firebase';

const LOCATIONS = ['Greater Noida', 'Gaur City', 'Noida Extension', 'Ghaziabad', 'Delhi NCR'];

interface ServiceOption {
  id: string;
  name: string;
  category: string;
  icon: string;
  popular?: boolean;
}

const POPULAR_SERVICES: ServiceOption[] = [
  { id: 'ac-service', name: 'AC Service & Repair', category: 'AC Services', icon: '❄️', popular: true },
  { id: 'electrician-service', name: 'Electrician & Wiring', category: 'Electrical', icon: '🔌', popular: true },
  { id: 'ro-service', name: 'RO Water Purifier Service', category: 'RO Services', icon: '💧', popular: true },
  { id: 'washing-machine-repair', name: 'Washing Machine Repair', category: 'Appliances', icon: '🧺' },
  { id: 'refrigerator-repair', name: 'Refrigerator Repair', category: 'Appliances', icon: '🧊' },
  { id: 'geyser-service', name: 'Geyser Service & Install', category: 'Heating', icon: '♨️' },
  { id: 'chimney-service', name: 'Kitchen Chimney Service', category: 'Kitchen', icon: '🌬️' },
  { id: 'fan-service', name: 'Fan & Light Repair', category: 'Electrical', icon: '🌀' },
  { id: 'microwave-service', name: 'Microwave Oven Repair', category: 'Appliances', icon: '🍿' },
  { id: 'ac-on-rent', name: 'AC on Rent', category: 'AC Services', icon: '⚡' },
  { id: 'custom-service', name: 'Other / Custom Service', category: 'Other', icon: '⚙️' }
];

const TIME_SLOTS = [
  { label: 'Morning Slot', value: '09:00 AM - 12:00 PM', desc: 'Best for early visits' },
  { label: 'Afternoon Slot', value: '12:00 PM - 03:00 PM', desc: 'Standard mid-day slot' },
  { label: 'Evening Slot', value: '03:00 PM - 06:00 PM', desc: 'Popular after work' },
  { label: 'Night Urgent', value: '06:00 PM - 09:00 PM', desc: 'Emergency evening visit' }
];

const QUICK_PROBLEM_SUGGESTIONS = [
  'AC is not cooling properly',
  'Water leaking from unit',
  'Power tripping / socket burning',
  'Strange noise during operation',
  'New installation required',
  'Complete servicing & cleaning needed',
  'Filter replacement'
];

interface BookServicePageProps {
  onBookingComplete?: (booking: BookingData) => void;
}

export const BookServicePage: React.FC<BookServicePageProps> = ({ onBookingComplete }) => {
  // Form State initialized from active session if available
  const [name, setName] = useState(() => {
    if (isFirebaseConfigured && auth?.currentUser?.displayName) {
      return auth.currentUser.displayName;
    }
    const savedCust = localStorage.getItem('ks_customer_session');
    if (savedCust) {
      try {
        const parsed = JSON.parse(savedCust);
        return parsed.name || '';
      } catch {
        return '';
      }
    }
    return '';
  });

  const [phone, setPhone] = useState(() => {
    if (isFirebaseConfigured && auth?.currentUser?.email?.endsWith('@kselectrical.in')) {
      return auth.currentUser.email.split('@')[0];
    }
    const savedCust = localStorage.getItem('ks_customer_session');
    if (savedCust) {
      try {
        const parsed = JSON.parse(savedCust);
        return parsed.phone || '';
      } catch {
        return '';
      }
    }
    return '';
  });

  const [location, setLocation] = useState(LOCATIONS[0] || 'Greater Noida');
  const [address, setAddress] = useState(() => {
    const savedCust = localStorage.getItem('ks_customer_session');
    if (savedCust) {
      try {
        const parsed = JSON.parse(savedCust);
        return parsed.address || '';
      } catch {
        return '';
      }
    }
    return '';
  });

  const [selectedServices, setSelectedServices] = useState<string[]>(['ac-service']);
  const [customServiceName, setCustomServiceName] = useState('');
  
  // Generate 5 quick date choices (Today, Tomorrow, etc.)
  const [dateChips] = useState<{ label: string; value: string }[]>(() => {
    const list = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${weekdays[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
      const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      list.push({ label, value });
    }
    return list;
  });

  const [date, setDate] = useState(() => dateChips[0]?.value || '');
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0].value);
  const [problemDescription, setProblemDescription] = useState('');
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string | null>(null);

  // Status & Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<BookingData | null>(null);
  const [whatsappLink, setWhatsappLink] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle phone auto-lookup
  const handlePhoneChange = async (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 10);
    setPhone(clean);
    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));

    if (clean.length === 10) {
      const existing = await getCustomerByPhoneFromDb(clean);
      if (existing) {
        if (!name && existing.name) setName(existing.name);
        if (!address && existing.address) setAddress(existing.address);
      }
    }
  };

  // Toggle service selection
  const handleToggleService = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter(id => id !== serviceId));
      }
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
    if (errors.service) setErrors(prev => ({ ...prev, service: '' }));
  };

  // Image Upload Handling
  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, photo: 'Please upload a valid image file (JPG, PNG, WEBP).' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: 'Image size should be under 5MB.' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoBase64(reader.result as string);
      setPhotoFileName(file.name);
      setErrors(prev => ({ ...prev, photo: '' }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoBase64(null);
    setPhotoFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Form Validation
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = 'Please enter your full name.';
    
    if (!phone.trim()) {
      errs.phone = 'Mobile number is required.';
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (!address.trim()) errs.address = 'Doorstep service address is required.';
    
    if (selectedServices.length === 0) {
      errs.service = 'Please select at least one service.';
    } else if (selectedServices.includes('custom-service') && !customServiceName.trim()) {
      errs.service = 'Please specify your required custom service.';
    }

    if (!date) errs.date = 'Please select a preferred service date.';
    if (!timeSlot) errs.timeSlot = 'Please select a preferred time slot.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Form Submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Scroll to first error
      const firstErrKey = Object.keys(errors)[0];
      if (firstErrKey) {
        const el = document.getElementById(`field-${firstErrKey}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    // Compile service names list
    const chosenServiceNames = selectedServices.map(id => {
      if (id === 'custom-service') return customServiceName.trim() || 'Custom Service';
      const found = POPULAR_SERVICES.find(s => s.id === id);
      return found ? found.name : id;
    });

    const itemsForBooking = chosenServiceNames.map((svcName, idx) => ({
      serviceId: selectedServices[idx] || `svc-${idx}`,
      serviceName: svcName,
      price: 299, // Inspection base fee
      quantity: 1
    }));

    const bookingPayload: Omit<BookingData, 'id' | 'createdAt' | 'status'> = {
      customerName: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      selectedLocation: location,
      dateTime: `${date} (${timeSlot})`,
      items: itemsForBooking,
      subtotal: 299,
      problemDescription: problemDescription.trim() || undefined,
      photoBase64: photoBase64 || undefined
    };

    try {
      // 1. Save to Cloud / Firestore
      const savedResult = await saveBookingToCloud(bookingPayload);

      // Save customer session locally
      localStorage.setItem('ks_customer_session', JSON.stringify({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim()
      }));

      // 2. Sync to PHP server background endpoint if reachable
      try {
        const params = new URLSearchParams();
        params.append('customer_name', name.trim());
        params.append('phone', phone.trim());
        params.append('address', address.trim());
        params.append('area', location);
        params.append('service_type', chosenServiceNames.join(', '));
        params.append('preferred_date', date);
        params.append('preferred_time', timeSlot);
        params.append('problem_description', problemDescription.trim());

        fetch('/backend/create_booking.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params
        }).catch(() => {/* silent failover */});
      } catch (e) {
        console.warn("PHP sync skipped", e);
      }

      // 3. Build WhatsApp text link
      const textMessage = `*New Doorstep Booking Request - KS Electrical & AC Services*
---------------------------------------
*Booking Reference:* ${savedResult.id}
*Customer Name:* ${name.trim()}
*Mobile Number:* ${phone.trim()}
*Location:* ${location}

*Services Requested:*
${chosenServiceNames.map(s => `• ${s}`).join('\n')}

*Preferred Date:* ${date}
*Preferred Time Slot:* ${timeSlot}
*Doorstep Address:* ${address.trim()}

${problemDescription.trim() ? `*Problem Description:* ${problemDescription.trim()}\n` : ''}${photoBase64 ? '*Photo Attached:* Yes (Provided in Web Booking)\n' : ''}---------------------------------------
Please confirm technician dispatch. Thank you!`;

      const encodedText = encodeURIComponent(textMessage);
      const waUrl = `https://api.whatsapp.com/send?phone=919625724903&text=${encodedText}`;
      setWhatsappLink(waUrl);

      // 4. Update local state to show confirmation card
      setSubmittedBooking(savedResult);
      if (onBookingComplete) onBookingComplete(savedResult);
    } catch (err) {
      console.error("Booking error:", err);
      setErrors({ form: 'Failed to submit booking. Please try again or contact us directly on WhatsApp.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 md:py-14 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Top Header Banner */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-brand-blue font-bold text-xs uppercase tracking-wider shadow-sm">
            <Zap size={14} className="text-brand-orange animate-pulse" />
            Direct Doorstep Service Dispatch
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Book Service / Schedule Service
          </h1>

          <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Fill out your details below to schedule certified technician doorstep visit in Greater Noida & Delhi NCR.
          </p>
        </div>

        {/* Success Confirmation Modal / View */}
        <AnimatePresence>
          {submittedBooking ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-10 shadow-xl text-center space-y-6 max-w-2xl mx-auto relative overflow-hidden"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={44} />
              </div>

              <div>
                <span className="px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 font-extrabold text-xs tracking-wider uppercase border border-emerald-200">
                  Booking Confirmed #{submittedBooking.id}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                  Service Request Received!
                </h2>
                <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
                  Thank you, <strong className="text-slate-900">{submittedBooking.customerName}</strong>! Your doorstep service schedule is recorded under Booking ID <span className="font-mono font-bold text-brand-blue">{submittedBooking.id}</span>.
                </p>
              </div>

              {/* Booking Summary Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs sm:text-sm space-y-2.5">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Service Region:</span>
                  <span className="font-bold text-slate-800">{submittedBooking.selectedLocation}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Scheduled Date & Time:</span>
                  <span className="font-bold text-slate-800">{submittedBooking.dateTime}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Mobile Number:</span>
                  <span className="font-bold text-slate-800">+91 {submittedBooking.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block mb-1">Services:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {submittedBooking.items.map((it, idx) => (
                      <span key={idx} className="bg-white border border-slate-300 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700">
                        {it.serviceName}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Instant WhatsApp / Call CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-sm transition-all shadow-md hover:scale-[1.02] active:scale-95"
                >
                  <MessageSquare size={18} />
                  Send WhatsApp Confirmation
                </a>
                <a
                  href={`tel:${businessConfig.contacts[0]}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-extrabold text-sm transition-all shadow-md hover:scale-[1.02] active:scale-95"
                >
                  <PhoneCall size={18} />
                  Call Support (+91 96257 24903)
                </a>
              </div>

              <button
                type="button"
                onClick={() => setSubmittedBooking(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-semibold underline pt-2 cursor-pointer"
              >
                Book another service
              </button>
            </motion.div>
          ) : (
            /* Main Form Card */
            <form onSubmit={handleSubmitBooking} className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden p-6 sm:p-10 space-y-8">
              
              {errors.form && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-semibold">
                  <AlertCircle size={20} className="shrink-0" />
                  {errors.form}
                </div>
              )}

              {/* SECTION 1: Customer Contact Details */}
              <div id="field-name" className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-brand-blue flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Customer Information (आपकी जानकारी)
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="input-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Customer Name (नाम) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        id="input-name"
                        type="text"
                        placeholder="e.g. Ramesh Sharma"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                        }}
                        className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl font-semibold text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                          errors.name ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-brand-blue/30 focus:border-brand-blue'
                        }`}
                      />
                    </div>
                    {errors.name && <p className="text-xs font-medium text-red-500">{errors.name}</p>}
                  </div>

                  {/* Mobile Number Input */}
                  <div id="field-phone" className="space-y-1.5">
                    <label htmlFor="input-phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Mobile Number (मोबाइल नंबर) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-xs font-extrabold text-slate-500 select-none">
                        +91
                      </span>
                      <input
                        id="input-phone"
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl font-mono font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                          errors.phone ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-brand-blue/30 focus:border-brand-blue'
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-xs font-medium text-red-500">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* SECTION 2: Location & Address */}
              <div id="field-address" className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-brand-orange flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Location & Address (लोकेशन और पता)
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Location Area Selector */}
                  <div className="space-y-1.5 sm:col-span-1">
                    <label htmlFor="input-location" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Service Region (लोकेशन) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <select
                        id="input-location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-10 pr-8 py-3 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue cursor-pointer appearance-none"
                      >
                        {LOCATIONS.map((loc: string) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Full Street Address */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="input-address" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Full Address (पूरा पता) <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="input-address"
                      type="text"
                      placeholder="Flat No, Tower/House No, Landmark, Society/Block"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (errors.address) setErrors(prev => ({ ...prev, address: '' }));
                      }}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-xl font-semibold text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                        errors.address ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-brand-blue/30 focus:border-brand-blue'
                      }`}
                    />
                    {errors.address && <p className="text-xs font-medium text-red-500">{errors.address}</p>}
                  </div>
                </div>
              </div>

              {/* SECTION 3: Select Service Required */}
              <div id="field-service" className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                      Select Required Service (कौन-सी सर्विस चाहिए)
                    </h2>
                    <p className="text-slate-500 text-xs">Select one or multiple services needed for your visit</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {POPULAR_SERVICES.map((svc) => {
                    const isSelected = selectedServices.includes(svc.id);
                    return (
                      <button
                        type="button"
                        key={svc.id}
                        onClick={() => handleToggleService(svc.id)}
                        className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer relative ${
                          isSelected
                            ? 'bg-brand-blue/5 border-brand-blue ring-2 ring-brand-blue/30 text-brand-blue shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl select-none">{svc.icon}</span>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-brand-blue text-white' : 'border border-slate-300'
                          }`}>
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>
                        </div>
                        <div>
                          <span className="font-bold text-xs sm:text-sm line-clamp-2 block leading-snug">
                            {svc.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                            {svc.category}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Service Input if 'custom-service' selected */}
                {selectedServices.includes('custom-service') && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 animate-in fade-in duration-200">
                    <label htmlFor="input-custom-service" className="block text-xs font-extrabold text-amber-900 uppercase">
                      Specify Custom Requirement / Other Service Details
                    </label>
                    <input
                      id="input-custom-service"
                      type="text"
                      placeholder="e.g. Inverter Wiring, Submersible Motor Repair, Commercial Panel"
                      value={customServiceName}
                      onChange={(e) => setCustomServiceName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-amber-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>
                )}
                {errors.service && <p className="text-xs font-medium text-red-500">{errors.service}</p>}
              </div>

              {/* SECTION 4: Preferred Date & Time */}
              <div id="field-date" className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Preferred Date & Time (पसंदीदा तारीख और समय)
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Date Chips */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Select Date (तारीख) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {dateChips.map((chip) => (
                        <button
                          type="button"
                          key={chip.value}
                          onClick={() => {
                            setDate(chip.value);
                            if (errors.date) setErrors(prev => ({ ...prev, date: '' }));
                          }}
                          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all border cursor-pointer ${
                            date === chip.value
                              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {chip.label}
                        </button>
                      ))}
                      
                      {/* Standard Date Picker Input */}
                      <div className="relative inline-flex items-center">
                        <input
                          type="date"
                          value={date}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => {
                            setDate(e.target.value);
                            if (errors.date) setErrors(prev => ({ ...prev, date: '' }));
                          }}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                        />
                      </div>
                    </div>
                    {errors.date && <p className="text-xs font-medium text-red-500 mt-1">{errors.date}</p>}
                  </div>

                  {/* Time Slots Grid */}
                  <div id="field-timeSlot">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Select Time Slot (समय) <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {TIME_SLOTS.map((slot) => {
                        const isChosen = timeSlot === slot.value;
                        return (
                          <button
                            type="button"
                            key={slot.value}
                            onClick={() => {
                              setTimeSlot(slot.value);
                              if (errors.timeSlot) setErrors(prev => ({ ...prev, timeSlot: '' }));
                            }}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                              isChosen
                                ? 'bg-purple-50 border-purple-500 text-purple-900 font-bold ring-2 ring-purple-500/20'
                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 font-medium'
                            }`}
                          >
                            <div>
                              <span className="block text-xs font-bold">{slot.label}</span>
                              <span className="block text-xs text-slate-500 font-mono mt-0.5">{slot.value}</span>
                            </div>
                            <Clock size={16} className={isChosen ? 'text-purple-600' : 'text-slate-400'} />
                          </button>
                        );
                      })}
                    </div>
                    {errors.timeSlot && <p className="text-xs font-medium text-red-500 mt-1">{errors.timeSlot}</p>}
                  </div>
                </div>
              </div>

              {/* SECTION 5: Problem Description */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-sm">
                    5
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                      Problem Description (समस्या का विवरण)
                    </h2>
                    <p className="text-slate-500 text-xs">Help technician prepare appropriate tools & spare parts</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <textarea
                    id="input-problem"
                    rows={3}
                    placeholder="Describe the problem, symptoms, or special instructions (e.g. AC indoor unit flashing error E4, light switch sparking, water leaking)..."
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue resize-none"
                  />

                  {/* Quick Suggestion Pills */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Tap quick problem tags:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_PROBLEM_SUGGESTIONS.map((tag) => (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => {
                            setProblemDescription(prev => prev ? `${prev}, ${tag}` : tag);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 6: Photo Upload (Optional) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                      6
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                      Photo Upload (फोटो अपलोड)
                    </h2>
                  </div>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 uppercase tracking-wider">
                    Optional
                  </span>
                </div>

                <div className="space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageSelect(e.target.files[0]);
                      }
                    }}
                  />

                  {photoBase64 ? (
                    /* Image Preview Card */
                    <div className="relative border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-4 rounded-2xl flex items-center gap-4">
                      <img
                        src={photoBase64}
                        alt="Problem Preview"
                        className="w-20 h-20 object-cover rounded-xl border border-emerald-200 shadow-sm shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                          <CheckCircle2 size={14} /> Image Attached
                        </span>
                        <p className="text-xs font-semibold text-slate-700 truncate mt-0.5">
                          {photoFileName || 'problem-photo.jpg'}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Technician will review this photo before arriving.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="p-2 rounded-xl bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200 transition-colors cursor-pointer"
                        title="Remove photo"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    /* Upload Trigger Dropzone */
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-brand-blue bg-slate-50 hover:bg-blue-50/20 rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-400 group-hover:text-brand-blue group-hover:border-brand-blue flex items-center justify-center mx-auto mb-2 shadow-sm transition-colors">
                        <Camera size={22} />
                      </div>
                      <span className="block font-bold text-sm text-slate-800 group-hover:text-brand-blue transition-colors">
                        Upload photo of issue or appliance sticker
                      </span>
                      <span className="block text-xs text-slate-400 mt-1">
                        Supports JPG, PNG, WEBP up to 5MB (Optional)
                      </span>
                    </div>
                  )}
                  {errors.photo && <p className="text-xs font-medium text-red-500">{errors.photo}</p>}
                </div>
              </div>

              {/* Bottom Guarantee Banner */}
              <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center gap-3 text-xs text-slate-600">
                <ShieldCheck size={24} className="text-brand-blue shrink-0" />
                <div>
                  <span className="font-extrabold text-slate-900 block">KS Electrical 100% Doorstep Warranty</span>
                  <span>Free inspection consult, transparent rate card, and 30-day post-service warranty included.</span>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 sm:py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-base sm:text-lg tracking-wide shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Scheduling Service Visit...</span>
                    </div>
                  ) : (
                    <>
                      <span>✅ Book Now</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default BookServicePage;
