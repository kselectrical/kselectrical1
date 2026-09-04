import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Phone, MapPin, CheckCircle2, ArrowRight, ArrowLeft, ShieldAlert, Wrench } from 'lucide-react';
import type { CartItem } from '../types';
import type { BusinessConfig } from '../data';
import { auth, isFirebaseConfigured, getCustomerByPhoneFromDb } from '../firebase';

interface BookingFormProps {
  cart: Record<string, CartItem>;
  onClearCart: () => void;
  selectedLocation: string;
  onSubmitBooking: (booking: {
    customerName: string;
    phone: string;
    address: string;
    selectedLocation: string;
    dateTime: string;
    items: {
      serviceId: string;
      serviceName: string;
      price: number;
      quantity: number;
      brand?: string;
    }[];
    subtotal: number;
  }) => void;
  businessConfig: BusinessConfig;
}

interface FormState {
  urgency: 'ROUTINE' | 'EMERGENCY';
  date: string;
  timeSlot: string;
  name: string;
  phone: string;
  address: string;
}

const TIME_SLOTS = [
  '09:00 AM - 12:00 PM (Morning)',
  '12:00 PM - 03:00 PM (Afternoon)',
  '03:00 PM - 06:00 PM (Evening)',
  '06:00 PM - 09:00 PM (Night Urgent)'
];

export const BookingForm: React.FC<BookingFormProps> = ({
  cart,
  onClearCart,
  selectedLocation,
  onSubmitBooking,
  businessConfig
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormState>({
    urgency: 'ROUTINE',
    date: '',
    timeSlot: '',
    name: '',
    phone: '',
    address: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [datesArray] = useState<{ label: string; value: string }[]>(() => {
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
  const [dispatchId, setDispatchId] = useState<number>(0);

  // Restore customer session details on mount
  useEffect(() => {
    setTimeout(() => {
      if (isFirebaseConfigured && auth && auth.currentUser) {
        const user = auth.currentUser;
        const email = user.email || '';
        const phone = email.endsWith('@kselectrical.in') ? email.split('@')[0] : '';
        setFormData(prev => ({
          ...prev,
          name: user.displayName || '',
          phone: phone || ''
        }));
      } else {
        const savedCustomer = localStorage.getItem('ks_customer_session');
        if (savedCustomer) {
          try {
            const parsed = JSON.parse(savedCustomer);
            setFormData(prev => ({
              ...prev,
              name: parsed.name || '',
              phone: parsed.phone || ''
            }));
          } catch (e) {
            console.error("Error reading customer session in BookingForm:", e);
          }
        }
      }
    }, 0);
  }, []);

  const handlePhoneInputChange = async (val: string) => {
    const clean = val.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, phone: clean }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));

    if (clean.length === 10) {
      const existing = await getCustomerByPhoneFromDb(clean);
      if (existing) {
        setFormData(prev => ({
          ...prev,
          name: prev.name.trim() ? prev.name : (existing.name || prev.name),
          address: prev.address.trim() ? prev.address : (existing.address || prev.address)
        }));
      }
    }
  };

  const cartItems = Object.values(cart);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const finalCalculatedPrice = cartSubtotal + (formData.urgency === 'EMERGENCY' ? 150 : 0);

  // Real-time validations
  const validateStep1 = () => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (cartItems.length === 0) {
      errs.urgency = 'Please select at least one service above to proceed.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!formData.date) {
      errs.date = 'Please select a booking date.';
    }
    if (!formData.timeSlot) {
      errs.timeSlot = 'Please select a preferred arrival slot.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    
    if (!formData.name.trim()) {
      errs.name = 'Name field is required.';
    }
    
    if (!formData.phone.trim()) {
      errs.phone = 'Mobile number is required.';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s+/g, ''))) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (!formData.address.trim()) {
      errs.address = 'Doorstep service address is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep3()) {
      setDispatchId(Math.floor(Math.random() * 89999 + 10000));
      setStep(4);

      // Compile cart item details into a list string
      const cartItemsListText = cartItems.map((item, idx) => {
        const brandText = item.brand ? ` [${item.brand}]` : '';
        return `${idx + 1}. ${item.serviceName}${brandText} x ${item.quantity} (₹${item.price * item.quantity})`;
      }).join('\n');

      // Compile WhatsApp message
      const textMessage = `*New Doorstep Booking Request - KS Electrical & AC Services*
---------------------------------------
*Customer Name:* ${formData.name}
*Mobile Number:* ${formData.phone}
*Service Region:* ${selectedLocation}

*Services Requested:*
${cartItemsListText}

*Service Urgency:* ${formData.urgency}
*Scheduled Date:* ${formData.date}
*Preferred Slot:* ${formData.timeSlot}
*Home Address:* ${formData.address}

*Estimated Total Price:* ₹${finalCalculatedPrice}
---------------------------------------
Please dispatch a technician. Thank you!`;

      const encodedText = encodeURIComponent(textMessage);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=919625724903&text=${encodedText}`;
      
      // Save details to dynamic store
      onSubmitBooking({
        customerName: formData.name,
        phone: formData.phone,
        address: formData.address,
        selectedLocation: selectedLocation,
        dateTime: `${formData.date} at ${formData.timeSlot.split('(')[0].trim()}`,
        items: cartItems.map(item => ({
          serviceId: item.serviceId,
          serviceName: item.serviceName,
          price: item.price,
          quantity: item.quantity,
          brand: item.brand
        })),
        subtotal: finalCalculatedPrice
      });

      // Sync booking request to the remote PHP server database
      const serviceTypeString = cartItems.map(item => {
        const brandText = item.brand ? ` [${item.brand}]` : '';
        return `${item.serviceName}${brandText} (x${item.quantity})`;
      }).join(', ');

      const bookingParams = new URLSearchParams();
      bookingParams.append('customer_name', formData.name);
      bookingParams.append('phone', formData.phone);
      bookingParams.append('alternate_phone', '');
      bookingParams.append('service_type', serviceTypeString);
      bookingParams.append('address', formData.address);
      bookingParams.append('area', selectedLocation);
      bookingParams.append('preferred_date', formData.date);
      bookingParams.append('preferred_time', formData.timeSlot);
      bookingParams.append('subtotal', String(finalCalculatedPrice));
      bookingParams.append('items_json', JSON.stringify(cartItems.map(item => ({
        serviceId: item.serviceId,
        serviceName: item.serviceName,
        price: item.price,
        quantity: item.quantity,
        brand: item.brand
      }))));



      // Auto redirect to WhatsApp
      window.open(whatsappUrl, '_blank');
      // Clear global cart state
      onClearCart();
    }
  };

  const handleReset = () => {
    setStep(1);
    setFormData({
      urgency: 'ROUTINE',
      date: '',
      timeSlot: '',
      name: '',
      phone: '',
      address: ''
    });
    setErrors({});
  };

  return (
    <section id="booking" className="max-w-3xl mx-auto px-4 py-12 scroll-mt-24">
      
      {/* Title */}
      <div className="text-center mb-8 space-y-2">
        <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-gray-900 tracking-tight">
          Complete Doorstep Booking
        </h2>
        <p className="text-gray-500 max-w-md mx-auto text-sm">
          Provide your details below to schedule the technician visit and generate your WhatsApp confirmation receipt.
        </p>
      </div>

      {/* Main Multi-step Card */}
      <div className="bg-white border border-slate-300 rounded-[20px] p-6 sm:p-8 shadow-card relative overflow-hidden">
        
        {/* Step Indicator Header */}
        {step < 4 && (
          <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4 font-sans text-xs text-slate-500 font-semibold select-none">
            <div className="flex items-center space-x-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${
                step >= 1 ? 'border-brand-blue text-brand-blue bg-blue-50/50' : 'border-gray-200'
              }`}>1</span>
              <span className={step === 1 ? 'text-gray-900 font-extrabold' : ''}>Cart Summary</span>
            </div>
            <div className="h-[1px] flex-1 bg-gray-200 mx-4" />
            <div className="flex items-center space-x-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${
                step >= 2 ? 'border-brand-blue text-brand-blue bg-blue-50/50' : 'border-gray-200'
              }`}>2</span>
              <span className={step === 2 ? 'text-gray-900 font-extrabold' : ''}>Date & Time</span>
            </div>
            <div className="h-[1px] flex-1 bg-gray-200 mx-4" />
            <div className="flex items-center space-x-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${
                step >= 3 ? 'border-brand-blue text-brand-blue bg-blue-50/50' : 'border-gray-200'
              }`}>3</span>
              <span className={step === 3 ? 'text-gray-900 font-extrabold' : ''}>Address Details</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            
            {/* Step 1: Select Service & Summary */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6 text-left font-sans"
              >
                {/* Cart Details */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Selected Home Services
                  </label>

                  {cartItems.length === 0 ? (
                    <div className="p-6 sm:p-8 border border-dashed border-slate-300 rounded-2xl text-center bg-slate-50/80 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-brand-blue border border-blue-100 flex items-center justify-center mx-auto">
                        <Wrench size={22} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">Your cart is empty.</p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">Please select a service to schedule your technician slot.</p>
                      </div>
                      <Link
                        to="/services"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                      >
                        <Wrench size={14} />
                        <span>Browse &amp; Add Services</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="border border-slate-300 rounded-2xl overflow-hidden divide-y divide-slate-200 bg-white shadow-sm">
                      {cartItems.map((item) => (
                        <div key={item.serviceId + (item.brand ? `-${item.brand}` : '')} className="flex justify-between items-center p-3 text-xs sm:text-sm">
                          <div className="flex-1">
                            <span className="font-bold text-gray-900">{item.serviceName}</span>
                            {item.brand && (
                              <span className="ml-2 bg-blue-50 text-brand-blue text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-blue-100 uppercase">
                                {item.brand}
                              </span>
                            )}
                          </div>
                          <div className="text-gray-500 font-bold ml-4">
                            {item.quantity} x ₹{item.price}
                          </div>
                          <div className="text-gray-900 font-extrabold ml-6">
                            ₹{item.price * item.quantity}
                          </div>
                        </div>
                      ))}
                      
                      <div className="bg-slate-50/80 p-3 flex justify-between items-center text-xs font-semibold border-t border-slate-200">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="text-gray-900 text-sm font-extrabold">₹{cartSubtotal}</span>
                      </div>
                    </div>
                  )}

                  {errors.urgency && (
                    <p className="text-[11px] text-red-500 flex items-center mt-1 font-semibold">
                      <ShieldAlert size={12} className="mr-1 shrink-0" />
                      {errors.urgency}
                    </p>
                  )}
                </div>

                {/* Service Urgency Matrix */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Required Urgency Level
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, urgency: 'ROUTINE' })}
                      className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-semibold text-center cursor-pointer transition-all duration-200 ${
                        formData.urgency === 'ROUTINE'
                          ? 'border-brand-blue text-brand-blue bg-blue-50/70 shadow-sm'
                          : 'border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      Routine Visit (Standard Price)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, urgency: 'EMERGENCY' })}
                      className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-semibold text-center cursor-pointer transition-all duration-200 ${
                        formData.urgency === 'EMERGENCY'
                          ? 'border-red-500 text-red-650 bg-red-50/70 shadow-sm'
                          : 'border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      Emergency (45-min arrival, +₹150)
                    </button>
                  </div>
                </div>

                {/* Grand Total Bar */}
                {cartItems.length > 0 && (
                  <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3 flex justify-between items-center text-xs sm:text-sm font-semibold shadow-sm">
                    <span className="text-gray-750">Estimated Bill (incl. surcharges)</span>
                    <span className="text-brand-blue text-base font-black">₹{finalCalculatedPrice}</span>
                  </div>
                )}

                {/* Bottom Row */}
                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    disabled={cartItems.length === 0}
                    onClick={handleNext}
                    className={`px-6 py-2.5 rounded-2xl font-semibold text-xs tracking-wider uppercase flex items-center space-x-1.5 transition-all duration-200 cursor-pointer ${
                      cartItems.length === 0 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-brand-blue hover:bg-brand-blue-dark text-white shadow-button hover:shadow-card-hover'
                    }`}
                  >
                    <span>Choose Date</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Date & Time */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6 text-left font-sans"
              >
                {/* Date Grid */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center">
                    <Calendar size={13} className="mr-1.5 text-brand-blue" />
                    Select Service Date
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {datesArray.map((d) => (
                      <button
                        type="button"
                        key={d.value}
                        onClick={() => {
                          setFormData({ ...formData, date: d.value });
                          if (errors.date) setErrors({ ...errors, date: '' });
                        }}
                        className={`p-3 rounded-2xl border text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
                          formData.date === d.value
                            ? 'border-brand-blue text-brand-blue bg-blue-50/70 font-semibold shadow-sm'
                            : 'border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50 bg-white'
                        }`}
                      >
                        <span className="text-xs font-bold">{d.label.split(',')[0]}</span>
                        <span className="text-[10px] text-gray-500 font-medium mt-0.5">{d.label.split(',')[1] || ''}</span>
                      </button>
                    ))}
                  </div>
                  {errors.date && (
                    <p className="text-[11px] text-red-500 flex items-center mt-1 font-semibold">
                      <ShieldAlert size={12} className="mr-1 shrink-0" />
                      {errors.date}
                    </p>
                  )}
                </div>

                {/* Time Slots Grid */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center">
                    <Clock size={13} className="mr-1.5 text-brand-blue" />
                    Select Preferred Arrival Slot
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => {
                          setFormData({ ...formData, timeSlot: slot });
                          if (errors.timeSlot) setErrors({ ...errors, timeSlot: '' });
                        }}
                        className={`p-3 rounded-2xl border text-xs font-semibold text-left cursor-pointer transition-all duration-200 ${
                          formData.timeSlot === slot
                            ? 'border-brand-blue text-brand-blue bg-blue-50/70 shadow-sm'
                            : 'border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50 bg-white'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  {errors.timeSlot && (
                    <p className="text-[11px] text-red-500 flex items-center mt-1 font-semibold">
                      <ShieldAlert size={12} className="mr-1 shrink-0" />
                      {errors.timeSlot}
                    </p>
                  )}
                </div>

                {/* Bottom Row Buttons */}
                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-2xl font-semibold text-xs uppercase flex items-center space-x-1.5 transition-all duration-200 cursor-pointer shadow-sm"
                  >
                    <ArrowLeft size={12} />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-2xl font-semibold text-xs tracking-wider uppercase flex items-center space-x-1.5 transition-all duration-200 cursor-pointer shadow-button hover:shadow-card-hover"
                  >
                    <span>Address Details</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Address & Contact */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6 text-left font-sans"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="booking-name" className="block font-bold text-gray-700 uppercase tracking-wider">
                      Your Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-gray-400" size={14} />
                      <input
                        id="booking-name"
                        type="text"
                        placeholder="e.g. Kaushindra Singh"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        className={`w-full bg-white text-gray-800 border pl-9 pr-4 py-2.5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 text-sm font-semibold transition-all ${
                          errors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-blue-500'
                        }`}
                      />
                    </div>
                    {errors.name && <p className="text-[10px] text-red-500 font-semibold">{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label htmlFor="booking-phone" className="block font-bold text-gray-700 uppercase tracking-wider">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 text-gray-400" size={14} />
                      <input
                        id="booking-phone"
                        type="tel"
                        placeholder="e.g. 7895321472"
                        value={formData.phone}
                        onChange={(e) => handlePhoneInputChange(e.target.value)}
                        className={`w-full bg-white text-gray-800 border pl-9 pr-4 py-2.5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 text-sm font-semibold transition-all ${
                          errors.phone ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-blue-500'
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-[10px] text-red-500 font-semibold">{errors.phone}</p>}
                  </div>

                  {/* Service Location Sector (read only helper) */}
                  <div className="space-y-1.5">
                    <label htmlFor="booking-region" className="block font-bold text-gray-700 uppercase tracking-wider">
                      Service Region Scope
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400" size={14} />
                      <input
                        id="booking-region"
                        type="text"
                        disabled
                        value={selectedLocation}
                        className="w-full bg-slate-50 text-slate-600 border border-slate-300 pl-9 pr-4 py-2.5 rounded-2xl text-sm font-semibold cursor-not-allowed"
                      />
                    </div>
                  </div>

                </div>

                {/* Complete Address */}
                <div className="space-y-1.5 text-xs">
                  <label htmlFor="booking-address" className="block font-bold text-gray-700 uppercase tracking-wider">
                    Full Home Address (Flat, Block, Gaur City Society...)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 text-gray-400" size={14} />
                    <textarea
                      id="booking-address"
                      rows={3}
                      placeholder="Enter flat number, block number, society name, and landmarks..."
                      value={formData.address}
                      onChange={(e) => {
                        setFormData({ ...formData, address: e.target.value });
                        if (errors.address) setErrors({ ...errors, address: '' });
                      }}
                      className={`w-full bg-white text-gray-800 border pl-9 pr-4 py-2.5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 text-sm font-semibold transition-all ${
                        errors.address ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {errors.address && <p className="text-[10px] text-red-500 font-semibold">{errors.address}</p>}
                </div>

                {/* Order Summary Pricing Row */}
                <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3 flex justify-between items-center text-xs sm:text-sm font-semibold shadow-sm">
                  <span className="text-gray-700">Total Price Estimation:</span>
                  <span className="text-brand-blue font-black text-base">₹{finalCalculatedPrice}</span>
                </div>

                {/* Bottom Buttons */}
                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-2xl font-semibold text-xs uppercase flex items-center space-x-1.5 transition-all duration-200 cursor-pointer shadow-sm"
                  >
                    <ArrowLeft size={12} />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-2xl font-semibold text-xs tracking-wider uppercase flex items-center space-x-1.5 transition-all duration-200 cursor-pointer shadow-button hover:shadow-card-hover active:scale-98"
                  >
                    <span>Request Booking</span>
                    <CheckCircle2 size={12} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success Screen */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 text-center font-sans py-4"
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <CheckCircle2 className="text-green-500 animate-bounce" size={48} />
                  <h3 className="text-lg font-black text-gray-900 tracking-tight leading-none uppercase">
                    Booking Request Sent
                  </h3>
                  <p className="text-xs text-gray-400 font-bold">DISPATCH_ID: KS-DISP-{dispatchId || 54321}</p>
                </div>

                {/* Receipt Card */}
                <div className="bg-slate-50 border border-slate-300 rounded-[20px] p-5 text-left text-xs space-y-3 max-w-md mx-auto shadow-sm">
                  <div className="text-center font-bold text-brand-blue border-b border-gray-200 pb-2">
                    BOOKING_SUMMARY_CONFIRMATION
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-gray-600 font-bold">
                    <div>CUSTOMER NAME:</div>
                    <div className="text-gray-900 text-right font-black">{formData.name}</div>
                    
                    <div>MOBILE CONNECTION:</div>
                    <div className="text-gray-900 text-right font-black">{formData.phone}</div>
                    
                    <div>SERVICE LOCATION:</div>
                    <div className="text-gray-900 text-right font-black truncate">{selectedLocation}</div>
                    
                    <div>DISPATCH SLOT:</div>
                    <div className="text-gray-900 text-right font-black text-brand-blue">
                      {formData.date}
                    </div>
                    
                    <div>ARRIVAL TIMING:</div>
                    <div className="text-gray-900 text-right font-black">
                      {formData.timeSlot.split('(')[0]}
                    </div>
                    
                    <div>ESTIMATED TOTAL:</div>
                    <div className="text-brand-blue text-right font-black text-sm">₹{finalCalculatedPrice}</div>
                  </div>

                  <div className="border-t border-gray-200 pt-3 text-[10px] text-gray-400 text-center leading-relaxed">
                    Our lead contractor, **Kaushindra Singh**, will call you at **{formData.phone}** shortly to confirm the technician dispatch timings. For queries, contact us at **{businessConfig.contacts[0]}**.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm"
                >
                  Reset Booking Form
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </form>

      </div>
    </section>
  );
};
