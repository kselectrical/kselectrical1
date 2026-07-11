import React from 'react';
import { X, User, Phone, Calendar, LogOut, Clock, CheckCircle2, XCircle, ShoppingBag } from 'lucide-react';
import type { BookingData } from '../firebase';

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { name: string; email?: string; photoUrl: string; phone?: string } | null;
  bookings: BookingData[];
  onLogout: () => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  bookings,
  onLogout
}) => {
  if (!isOpen || !currentUser) return null;

  // Normalize phone comparison to match accurately
  const cleanPhone = currentUser.phone ? currentUser.phone.replace(/\D/g, '') : '';
  
  // Filter bookings and invoices for this customer
  const customerHistory = bookings.filter(b => {
    const bPhone = b.phone ? b.phone.replace(/\D/g, '') : '';
    // Match either complete phone or last 10 digits
    return bPhone === cleanPhone || (bPhone.length >= 10 && cleanPhone.length >= 10 && bPhone.slice(-10) === cleanPhone.slice(-10));
  });

  // Format date to local readable format
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      {/* Backdrop Close click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col relative z-10 shadow-dropdown border border-gray-100 font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-150 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center border border-blue-100">
              <User size={18} />
            </div>
            <div>
              <h2 className="text-gray-900 font-black text-base tracking-tight">My Customer Profile</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Bookings & History dashboard</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-50 transition-all cursor-pointer select-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Customer Profile Card */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-brand-blue text-white font-black text-xl flex items-center justify-center shadow-inner border border-blue-200 uppercase select-none">
                {currentUser.name ? currentUser.name[0] : 'C'}
              </div>
              <div className="space-y-1">
                <h3 className="text-gray-900 font-black text-base leading-tight tracking-tight">{currentUser.name}</h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-gray-500">
                  <span className="flex items-center gap-1">
                    <Phone size={12} className="text-gray-400" />
                    +91 {currentUser.phone || 'N/A'}
                  </span>
                  <span className="text-gray-300 hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} className="text-gray-400" />
                    Joined: {customerHistory.length > 0 ? formatDate(customerHistory[customerHistory.length - 1].createdAt) : 'Recently'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="px-4 py-2 border border-red-200 hover:bg-red-50 text-red-650 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer self-start md:self-center select-none"
            >
              <LogOut size={13} />
              <span>Log Out</span>
            </button>
          </div>

          {/* Bookings & History Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-150 pb-2">
              <h4 className="text-gray-900 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingBag size={14} className="text-brand-blue" />
                Service History ({customerHistory.length})
              </h4>
            </div>

            {customerHistory.length === 0 ? (
              /* Empty State */
              <div className="text-center py-12 px-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag size={20} />
                </div>
                <h5 className="text-gray-800 font-bold text-sm">No bookings found</h5>
                <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                  You haven't booked any electrical or AC services yet. Place your first booking to see your records here!
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer select-none"
                >
                  Book a Service Now
                </button>
              </div>
            ) : (
              /* History Table */
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wider">
                        <th className="px-4 py-3 text-center w-12">No.</th>
                        <th className="px-4 py-3">Date & ID</th>
                        <th className="px-4 py-3">Services Booked</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                        <th className="px-4 py-3 text-center w-24">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150">
                      {customerHistory.map((item, idx) => {
                        // Determine badge styling based on status
                        let statusIcon = <Clock size={11} />;
                        let statusStyle = "bg-orange-50 text-orange-700 border-orange-100";
                        
                        if (item.status === 'Completed') {
                          statusIcon = <CheckCircle2 size={11} />;
                          statusStyle = "bg-green-50 text-green-700 border-green-100";
                        } else if (item.status === 'Cancelled') {
                          statusIcon = <XCircle size={11} />;
                          statusStyle = "bg-red-50 text-red-700 border-red-100";
                        }

                        // Aggregate service names
                        const serviceNames = item.items.map(s => {
                          const brandLabel = s.brand ? ` (${s.brand})` : '';
                          return `${s.serviceName}${brandLabel} x${s.quantity}`;
                        }).join(', ');

                        return (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors font-semibold text-gray-700">
                            <td className="px-4 py-3.5 text-center text-gray-400 font-bold">
                              {idx + 1}
                            </td>
                            <td className="px-4 py-3.5 space-y-0.5">
                              <div className="text-gray-900 font-extrabold">{formatDate(item.createdAt || item.dateTime)}</div>
                              <div className="text-[10px] text-gray-400 font-mono tracking-tight font-bold">{item.id}</div>
                            </td>
                            <td className="px-4 py-3.5 max-w-[220px]">
                              <div className="truncate text-gray-800 font-bold" title={serviceNames}>
                                {serviceNames}
                              </div>
                              <div className="text-[10px] text-gray-400 truncate">
                                {item.address || 'Doorstep Service'}
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-right text-brand-blue font-black text-sm">
                              ₹{item.subtotal?.toLocaleString('en-IN') || item.items.reduce((acc, cur) => acc + (cur.price * cur.quantity), 0).toLocaleString('en-IN')}
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${statusStyle}`}>
                                {statusIcon}
                                <span>{item.status}</span>
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-150 bg-slate-50 flex items-center justify-between shrink-0 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          <span>KS Electrical & AC Services</span>
          <span>Quality Guaranteed</span>
        </div>
      </div>
    </div>
  );
};
