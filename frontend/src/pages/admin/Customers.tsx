import React, { useState } from 'react';
import { 
  Users, MapPin, Search, RefreshCw, MessageSquare, 
  Globe, FileText, X, ChevronRight
} from 'lucide-react';
import { getAssetPath } from '../../firebase';
import type { CustomerUser, BookingData } from '../../firebase';

interface CustomersProps {
  customers: CustomerUser[];
  bookings?: BookingData[];
  invoices?: BookingData[];
  onRefresh?: () => Promise<void>;
}

export const Customers: React.FC<CustomersProps> = ({ 
  customers, 
  bookings = [],
  invoices = [],
  onRefresh 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'booking' | 'invoice'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerUser | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Manual refresh handler
  const handleRefresh = async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  };

  // Helper to normalize phone
  const cleanPhone = (p: string) => (p || '').replace(/\D/g, '').slice(-10);

  // Filter customers by search term and record type
  const filteredCustomers = customers.filter(c => {
    // Tab filter
    const isBooking = (c.totalBookings || 0) > 0 || c.recordType === 'booking' || c.recordType === 'both';
    const isInvoice = (c.totalInvoices || 0) > 0 || c.recordType === 'invoice' || c.recordType === 'both';

    if (filterType === 'booking' && !isBooking) return false;
    if (filterType === 'invoice' && !isInvoice) return false;

    // Search query
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;

    const nameMatch = (c.name || '').toLowerCase().includes(q);
    const phoneMatch = (c.phone || '').includes(q);
    const addressMatch = (c.address || '').toLowerCase().includes(q);
    const emailMatch = (c.email || '').toLowerCase().includes(q);
    const serviceMatch = (c.serviceHistory || []).some(s => (s.serviceName || '').toLowerCase().includes(q));
    const refMatch = (c.serviceHistory || []).some(s => (s.referenceId || '').toLowerCase().includes(q));

    return nameMatch || phoneMatch || addressMatch || emailMatch || serviceMatch || refMatch;
  });

  // Accurate breakdown counts
  const totalProfiles = customers.length;
  const onlineBookingClients = customers.filter(c => (c.totalBookings || 0) > 0 || c.recordType === 'booking' || c.recordType === 'both').length;
  const billedClients = customers.filter(c => (c.totalInvoices || 0) > 0 || c.recordType === 'invoice' || c.recordType === 'both').length;
  const totalOnlineRequestsAll = customers.reduce((sum, c) => sum + (c.totalBookings || 0), 0);
  const totalBillsAll = customers.reduce((sum, c) => sum + (c.totalInvoices || 0), 0);

  // Customer specific bookings from raw list
  const getCustomerBookingsAndInvoices = (phone: string) => {
    const cp = cleanPhone(phone);
    const relevantBookings = (bookings || []).filter(b => cleanPhone(b.phone) === cp);
    const relevantInvoices = (invoices || []).filter(i => cleanPhone(i.phone) === cp);

    const onlineRequests = relevantBookings;
    const bills = relevantInvoices;
    return { onlineRequests, bills, all: [...onlineRequests, ...bills] };
  };

  return (
    <div className="space-y-6 text-left font-sans animate-in fade-in duration-150">
      
      {/* ── Top Header & Stats ── */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                Customer Directory &amp; Records
              </h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                ग्राहक निर्देशिका
              </span>
            </div>
            <p className="text-xs text-slate-500 font-bold tracking-wide mt-1">
              वेबसाइट ऑनलाइन रिक्वेस्ट्स और बिल-बुक टैक्स चालान का स्पष्ट अलग-अलग रिकॉर्ड
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onRefresh && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                title="लाइव डेटा ताज़ा करें"
              >
                <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-blue-600' : ''} />
                <span>{isRefreshing ? 'रिफ्रेशिंग...' : 'रिफ्रेश डेटा'}</span>
              </button>
            )}

            <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-2xl text-left">
              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider block">🌐 ऑनलाइन बुकिंग्स</span>
              <span className="text-sm font-black text-emerald-900 leading-none">{totalOnlineRequestsAll} ऑर्डर्स</span>
            </div>

            <div className="bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-2xl text-left">
              <span className="text-[9px] font-black text-blue-600 uppercase tracking-wider block">🧾 टैक्स बिल</span>
              <span className="text-sm font-black text-blue-900 leading-none">{totalBillsAll} चालान</span>
            </div>
          </div>
        </div>

        {/* ── Segment Tabs for Clean Distinction ── */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-100">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users size={13} />
            <span>सभी ग्राहक ({totalProfiles})</span>
          </button>

          <button
            onClick={() => setFilterType('booking')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              filterType === 'booking'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Globe size={13} />
            <span>🌐 ऑनलाइन बुकिंग्स ({onlineBookingClients})</span>
          </button>

          <button
            onClick={() => setFilterType('invoice')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              filterType === 'invoice'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            <FileText size={13} />
            <span>🧾 बिल / चालान ग्राहक ({billedClients})</span>
          </button>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={16} />
        <input
          type="text"
          placeholder="ग्राहक खोजें: नाम, मोबाइल नंबर (+91), सोसाइटी/फ्लैट, सर्विस या बुकिंग ID..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all shadow-xs"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* ── Customer Table ── */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl py-16 px-4 text-center shadow-xs select-none">
          <Users size={48} className="text-slate-300 stroke-1 mx-auto" />
          <h3 className="text-slate-900 font-black text-sm mt-3">
            {searchTerm ? 'कोई मैचिंग ग्राहक नहीं मिला' : 'इस श्रेणी में अभी कोई रिकॉर्ड नहीं है'}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto font-medium">
            {searchTerm 
              ? 'कृपया मोबाइल नंबर या नाम बदलकर सर्च करें।' 
              : 'जब भी ग्राहक वेबसाइट से सर्विस बुक करेगा या एडमिन बिल बनाएगा, उसका पूरा विवरण यहां लाइव दिखाई देगा।'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs text-left">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider select-none">
                  <th className="px-6 py-4">ग्राहक (Customer)</th>
                  <th className="px-6 py-4">स्रोत (Source Type)</th>
                  <th className="px-6 py-4">संपर्क (Contact)</th>
                  <th className="px-6 py-4">पता (Registered Address)</th>
                  <th className="px-6 py-4 text-center">ऑर्डर / बिल (Summary)</th>
                  <th className="px-6 py-4">सर्विस हिस्ट्री (History)</th>
                  <th className="px-6 py-4 text-center">एक्शन (Action)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                {filteredCustomers.map((c) => {
                  const safeJoined = c.joinedAt ? new Date(c.joinedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent';
                  const safeLast = c.lastBookingDate ? new Date(c.lastBookingDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : safeJoined;

                  // Determine source badges
                  const bCount = c.totalBookings || 0;
                  const iCount = c.totalInvoices || 0;
                  const hasBoth = (bCount > 0 && iCount > 0) || c.recordType === 'both';
                  const isOnlyInvoice = (iCount > 0 && bCount === 0) || c.recordType === 'invoice';

                  return (
                    <tr key={c.phone} className="hover:bg-slate-50/70 transition-colors">
                      {/* Customer Details */}
                      <td className="px-6 py-4 align-top min-w-[190px]">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 select-none shadow-xs flex items-center justify-center font-black text-slate-700 text-sm">
                            {c.photoUrl && c.photoUrl !== '/profile.webp' ? (
                              <img src={getAssetPath(c.photoUrl)} alt={c.name} className="w-full h-full object-cover" />
                            ) : (
                              <span>{(c.name || 'C').charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <span className="text-slate-900 font-black text-sm block">{c.name || 'Customer'}</span>
                            <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                              जुड़े: {safeJoined}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Source Type Badge */}
                      <td className="px-6 py-4 align-top min-w-[140px]">
                        {hasBoth ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-200">
                            ⭐ ऑनलाइन + बिल
                          </span>
                        ) : isOnlyInvoice ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200">
                            <FileText size={10} />
                            🧾 टैक्स बिल
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Globe size={10} />
                            🌐 वेबसाइट बुकिंग
                          </span>
                        )}
                        <span className="text-[9px] text-slate-400 font-semibold block mt-1">
                          अंतिम: {safeLast}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4 align-top min-w-[170px]">
                        <a
                          href={`tel:${c.phone}`}
                          className="text-xs font-black text-blue-600 block hover:underline"
                        >
                          📞 +91 {c.phone}
                        </a>
                        <div className="flex items-center gap-2 mt-1">
                          <a
                            href={`https://wa.me/91${cleanPhone(c.phone)}?text=${encodeURIComponent(`नमस्ते ${c.name || ''}, KS Electrical & AC Services से संपर्क कर रहे हैं।`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                          >
                            <MessageSquare size={11} />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </td>

                      {/* Address */}
                      <td className="px-6 py-4 align-top max-w-[210px]">
                        {c.address ? (
                          <div className="flex items-start gap-1.5">
                            <MapPin size={12} className="text-slate-400 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-slate-700 font-semibold leading-relaxed line-clamp-2" title={c.address}>
                              {c.address}
                            </p>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">पता उपलब्ध नहीं</span>
                        )}
                      </td>

                      {/* Orders & Bills Summary */}
                      <td className="px-6 py-4 align-top text-center min-w-[130px]">
                        <div className="flex flex-col items-center gap-1">
                          {bCount > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-100">
                              <Globe size={10} /> {bCount} ऑनलाइन
                            </span>
                          )}
                          {iCount > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-800 border border-blue-100">
                              <FileText size={10} /> {iCount} बिल
                            </span>
                          )}
                          {bCount === 0 && iCount === 0 && (
                            <span className="text-[10px] text-slate-400 italic">रजिस्ट्रेशन</span>
                          )}
                        </div>
                      </td>

                      {/* Services Taken */}
                      <td className="px-6 py-4 align-top max-w-[240px]">
                        {c.serviceHistory && c.serviceHistory.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {c.serviceHistory.slice(-3).map((s, sIdx) => {
                              const isInv = s.source === 'invoice';
                              return (
                                <span
                                  key={sIdx}
                                  className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                                    isInv 
                                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  }`}
                                  title={`${s.serviceName} (${isInv ? 'बिल' : 'वेबसाइट बुकिंग'})`}
                                >
                                  {isInv ? <FileText size={9} /> : <Globe size={9} />}
                                  <span className="truncate max-w-[130px]">{s.serviceName}</span>
                                </span>
                              );
                            })}
                            {c.serviceHistory.length > 3 && (
                              <span className="text-[9px] font-black text-slate-400 self-center">
                                +{c.serviceHistory.length - 3} और
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">कोई सर्विस हिस्ट्री नहीं</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 align-top text-center min-w-[100px]">
                        <button
                          onClick={() => setSelectedCustomer(c)}
                          className="inline-flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        >
                          <span>विवरण</span>
                          <ChevronRight size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Detailed Customer History Modal ── */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 text-left">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center">
                  {(selectedCustomer.name || 'C').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedCustomer.name || 'Customer'}</h3>
                  <p className="text-xs text-blue-600 font-bold">📞 +91 {selectedCustomer.phone}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              
              {/* Address Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">पंजीकृत पता (Registered Address)</span>
                <p className="text-xs font-semibold text-slate-800 mt-1 flex items-start gap-1.5">
                  <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <span>{selectedCustomer.address || 'पता उपलब्ध नहीं है'}</span>
                </p>
              </div>

              {/* Breakdown of this Customer's specific Bookings & Invoices */}
              {(() => {
                const { onlineRequests, bills } = getCustomerBookingsAndInvoices(selectedCustomer.phone);

                return (
                  <div className="space-y-4">
                    {/* Online Requests Section */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-emerald-800 flex items-center gap-1.5">
                          <Globe size={14} />
                          <span>वेबसाइट ऑनलाइन बुकिंग्स ({onlineRequests.length})</span>
                        </span>
                      </div>

                      {onlineRequests.length === 0 ? (
                        <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-slate-150">
                          कोई ऑनलाइन वेबसाइट बुकिंग नहीं मिली।
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {onlineRequests.map((b) => (
                            <div key={b.id} className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-black text-slate-900 block">{b.id} • {b.dateTime}</span>
                                <span className="text-[11px] text-slate-600 font-medium block mt-0.5">
                                  {b.items.map(i => `${i.serviceName} x${i.quantity}`).join(', ')}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="font-black text-emerald-700 block text-sm">₹{b.subtotal}</span>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  b.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {b.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bills Section */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-blue-800 flex items-center gap-1.5">
                          <FileText size={14} />
                          <span>बिल-बुक टैक्स चालान ({bills.length})</span>
                        </span>
                      </div>

                      {bills.length === 0 ? (
                        <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-slate-150">
                          कोई टैक्स बिल नहीं बना।
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {bills.map((inv) => (
                            <div key={inv.id} className="bg-blue-50/50 border border-blue-200 rounded-xl p-3 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-black text-slate-900 block">{inv.id} • {inv.dateTime}</span>
                                <span className="text-[11px] text-slate-600 font-medium block mt-0.5">
                                  {inv.items.map(i => `${i.serviceName} x${i.quantity}`).join(', ')}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="font-black text-blue-700 block text-sm">₹{inv.subtotal}</span>
                                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                  {inv.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-150 bg-slate-50 flex items-center justify-end shrink-0">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                बंद करें (Close)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Customers;
