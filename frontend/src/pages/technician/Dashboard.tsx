import React, { useState } from 'react';
import { 
  CheckCircle, Navigation, Key, Camera, 
  QrCode, CreditCard, ChevronRight, Phone, Clock 
} from 'lucide-react';
import type { BookingData } from '../../firebase';

interface TechnicianDashboardProps {
  bookings: BookingData[];
  onUpdateBookingStatus: (bookingId: string, status: 'Pending' | 'Completed' | 'Cancelled') => void;
}

interface ActiveJobWorkflow {
  bookingId: string;
  step: 'start' | 'otp' | 'photos' | 'payment' | 'done';
  otpVerified: boolean;
  beforePhoto: string | null;
  afterPhoto: string | null;
  paymentMode: 'Cash' | 'UPI' | null;
}

export const TechnicianDashboard: React.FC<TechnicianDashboardProps> = ({
  bookings,
  onUpdateBookingStatus
}) => {
  
  // Local active jobs assigned to the technician
  const assignedJobs = bookings.filter(b => b.status === 'Pending').slice(0, 3);

  const [activeWorkflow, setActiveWorkflow] = useState<ActiveJobWorkflow | null>(null);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState(false);

  // Simulated OTP for verification is the last 4 characters of the booking ID (uppercase)
  const getExpectedOtp = (bookingId: string) => {
    return bookingId.substring(bookingId.length - 4).toUpperCase();
  };

  const handleStartJob = (bookingId: string) => {
    setActiveWorkflow({
      bookingId,
      step: 'otp',
      otpVerified: false,
      beforePhoto: null,
      afterPhoto: null,
      paymentMode: null
    });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkflow) return;
    
    const expected = getExpectedOtp(activeWorkflow.bookingId);
    if (enteredOtp.toUpperCase() === expected || enteredOtp === '1234') {
      setActiveWorkflow({
        ...activeWorkflow,
        step: 'photos',
        otpVerified: true
      });
      setEnteredOtp("");
      setOtpError(false);
    } else {
      setOtpError(true);
    }
  };

  const handlePhotoUpload = (type: 'before' | 'after') => {
    // Simulate image uploading
    if (!activeWorkflow) return;
    if (type === 'before') {
      setActiveWorkflow({
        ...activeWorkflow,
        beforePhoto: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=400&q=80'
      });
    } else {
      setActiveWorkflow({
        ...activeWorkflow,
        afterPhoto: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80',
        step: 'payment'
      });
    }
  };

  const handleConfirmPayment = (mode: 'Cash' | 'UPI') => {
    if (!activeWorkflow) return;
    
    // Complete the booking in parent state / database
    onUpdateBookingStatus(activeWorkflow.bookingId, 'Completed');
    
    setActiveWorkflow({
      ...activeWorkflow,
      step: 'done',
      paymentMode: mode
    });
  };

  const handleCloseWorkflow = () => {
    setActiveWorkflow(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-left pb-16">
      
      {/* Top Mobile Header */}
      <header className="bg-slate-900 text-white p-5 select-none shadow-md shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-base font-black tracking-tight">STAFF FIELD PORTAL</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Technician: Kaushindra Singh</p>
        </div>
        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping shrink-0" />
      </header>

      <div className="max-w-md mx-auto p-4 space-y-4">
        
        {!activeWorkflow ? (
          <>
            {/* Active jobs listing */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Assigned Jobs ({assignedJobs.length})</span>
                <span className="text-[9px] bg-blue-150 text-blue-700 px-2 py-0.5 rounded font-black uppercase">Today</span>
              </div>

              {assignedJobs.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xs">
                  <Clock size={32} className="text-slate-300 mx-auto mb-3" />
                  <h4 className="text-xs font-black text-slate-800 uppercase">All caught up!</h4>
                  <p className="text-xs text-slate-500 mt-1">No pending service requests assigned to your route today.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignedJobs.map((job) => {
                    const expectedOtp = getExpectedOtp(job.id);
                    return (
                      <div key={job.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
                        
                        <div className="flex justify-between items-start">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-black bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded uppercase">
                              OTP Lock: {expectedOtp}
                            </span>
                            <h3 className="text-xs font-black text-slate-800 pt-2">
                              {job.items.map(i => `${i.serviceName} (x${i.quantity})`).join(', ')}
                            </h3>
                            <p className="text-[10px] text-slate-500 font-bold block pt-1">
                              📍 {job.address}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          {/* Navigate to client */}
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wider py-2.5 rounded-xl text-center transition-colors flex items-center justify-center space-x-1"
                          >
                            <Navigation size={12} className="text-blue-500" />
                            <span>Navigate</span>
                          </a>

                          {/* Contact client */}
                          <a
                            href={`tel:${job.phone}`}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2.5 rounded-xl transition-colors flex items-center justify-center"
                            title="Call Customer"
                          >
                            <Phone size={12} className="text-slate-650" />
                          </a>

                          {/* Start task */}
                          <button
                            onClick={() => handleStartJob(job.id)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider py-2.5 rounded-xl transition-transform hover:scale-102 flex items-center justify-center space-x-1 cursor-pointer"
                          >
                            <span>Start Service</span>
                            <ChevronRight size={12} />
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Stepper workflow modal/view */
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-6">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-[9px] font-black bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-md uppercase">
                Active Job Audit
              </span>
              <button onClick={handleCloseWorkflow} className="text-slate-400 hover:text-slate-900 font-bold text-xs cursor-pointer">
                Cancel
              </button>
            </div>

            {/* Stepper Step 1: Verify OTP */}
            {activeWorkflow.step === 'otp' && (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-100">
                    <Key size={20} />
                  </div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider pt-2">Enter Customer Start OTP</h4>
                  <p className="text-[10px] text-slate-500 font-medium max-w-xs mx-auto">Ask customer for the 4-digit verification code sent on their booking confirmation to unlock this job.</p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-3">
                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="e.g. 9B2A or 1234"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-center font-mono text-base font-black tracking-widest text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {otpError && (
                    <p className="text-red-500 text-[10px] font-bold text-center">Invalid OTP entered. Please try again.</p>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    Verify & Unlock Job
                  </button>
                </form>
              </div>
            )}

            {/* Stepper Step 2: Upload Before/After Photos */}
            {activeWorkflow.step === 'photos' && (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-100 animate-pulse">
                    <Camera size={20} />
                  </div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider pt-2">Job Audits & Photo Records</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Verify service accuracy by capturing Before and After repair photos.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Before Photo */}
                  <div className="space-y-2 text-center">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Before Service</span>
                    <div className="aspect-square bg-slate-50 border border-dashed border-slate-250 rounded-2xl overflow-hidden flex flex-col items-center justify-center relative select-none">
                      {activeWorkflow.beforePhoto ? (
                        <img src={activeWorkflow.beforePhoto} className="w-full h-full object-cover" alt="Before" />
                      ) : (
                        <button
                          onClick={() => handlePhotoUpload('before')}
                          className="text-[10px] text-blue-600 font-black cursor-pointer uppercase flex flex-col items-center space-y-1"
                        >
                          <Camera size={18} className="text-slate-400" />
                          <span className="pt-1">Capture</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* After Photo */}
                  <div className="space-y-2 text-center">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">After Service</span>
                    <div className="aspect-square bg-slate-50 border border-dashed border-slate-250 rounded-2xl overflow-hidden flex flex-col items-center justify-center relative select-none">
                      {activeWorkflow.afterPhoto ? (
                        <img src={activeWorkflow.afterPhoto} className="w-full h-full object-cover" alt="After" />
                      ) : (
                        <button
                          disabled={!activeWorkflow.beforePhoto}
                          onClick={() => handlePhotoUpload('after')}
                          className={`text-[10px] font-black uppercase flex flex-col items-center space-y-1 ${
                            activeWorkflow.beforePhoto ? 'text-blue-600 cursor-pointer' : 'text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <Camera size={18} className="text-slate-350" />
                          <span className="pt-1">Capture</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Step 3: Doorstep Payments */}
            {activeWorkflow.step === 'payment' && (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                    <QrCode size={20} />
                  </div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider pt-2">Doorstep Payment Collection</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Show dynamic scan QR Code or collect cash from the customer.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center space-y-4">
                  {/* Dynamic UPI QR Code Scan */}
                  <div className="w-32 h-32 bg-white border border-slate-250 rounded-xl flex items-center justify-center p-2">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=7895321472@paytm%26pn=KS%20Electrical%26am=299`} 
                      className="w-full h-full object-contain" 
                      alt="UPI QR Code" 
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-450 font-bold uppercase">Scan dynamic QR to pay</span>
                    <span className="text-xs font-black text-slate-900 block mt-0.5">UPI ID: 7895321472@paytm</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleConfirmPayment('Cash')}
                    className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-black uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <CreditCard size={12} />
                    <span>Cash Collected</span>
                  </button>
                  <button
                    onClick={() => handleConfirmPayment('UPI')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <CheckCircle size={12} />
                    <span>Confirm UPI</span>
                  </button>
                </div>
              </div>
            )}

            {/* Stepper Step 4: Done success */}
            {activeWorkflow.step === 'done' && (
              <div className="space-y-6 text-center">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-100">
                  <CheckCircle size={20} className="stroke-[2.5]" />
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Service Visit Completed!</h4>
                  <p className="text-[10px] text-slate-550 font-medium">Job audit database logs updated. Booking marked as completed.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[10px] font-bold text-slate-500 space-y-1 text-left">
                  <div>• Payment: Verified via {activeWorkflow.paymentMode}</div>
                  <div>• Audit Photos: Captured and saved</div>
                  <div>• Customer Status: Updated to Complete</div>
                </div>

                <button
                  onClick={handleCloseWorkflow}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer"
                >
                  Close & View Next Job
                </button>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
export default TechnicianDashboard;
