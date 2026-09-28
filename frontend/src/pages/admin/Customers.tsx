import React, { useState } from 'react';
import { Users, MapPin, Search } from 'lucide-react';
import { getAssetPath } from '../../firebase';
import type { CustomerUser } from '../../firebase';

interface CustomersProps {
  customers: CustomerUser[];
}

export const Customers: React.FC<CustomersProps> = ({ customers }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(c => {
    const q = searchTerm.toLowerCase();
    const nameMatch = (c.name || '').toLowerCase().includes(q);
    const phoneMatch = (c.phone || '').includes(q);
    const addressMatch = (c.address || '').toLowerCase().includes(q);
    const emailMatch = (c.email || '').toLowerCase().includes(q);
    const serviceMatch = (c.serviceHistory || []).some(s => (s.serviceName || '').toLowerCase().includes(q));
    return nameMatch || phoneMatch || addressMatch || emailMatch || serviceMatch;
  });

  const totalBookingsAll = customers.reduce((sum, c) => sum + (c.totalBookings || 0), 0);
  const activeCustomersCount = customers.filter(c => (c.totalBookings || 0) > 0).length;

  return (
    <div className="space-y-6 text-left font-sans animate-in fade-in duration-150">
      
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Customer Directory &amp; History</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
            Complete database of all registered &amp; booking clients with past service records
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-2xl text-left">
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-wider block">Total Profiles</span>
            <span className="text-base font-black text-blue-900 leading-none">{customers.length}</span>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-2xl text-left">
            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-wider block">Active Clients</span>
            <span className="text-base font-black text-indigo-900 leading-none">{activeCustomersCount}</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl text-left">
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider block">Total Orders</span>
            <span className="text-base font-black text-emerald-900 leading-none">{totalBookingsAll}</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={16} />
        <input
          type="text"
          placeholder="Search customers by Name, Phone (+91), Society/Address, or Service..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all shadow-xs"
        />
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl py-16 px-4 text-center shadow-xs select-none">
          <Users size={48} className="text-slate-300 stroke-1 mx-auto" />
          <h3 className="text-slate-900 font-black text-sm mt-3">
            {searchTerm ? 'No matching customer profiles found' : 'No customers logged in yet'}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto font-medium">
            {searchTerm ? 'Try a different search query like phone or name.' : 'When customers enter their phone number or book a service, their profile and history will sync here live.'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs text-left">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider select-none">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Registered Address</th>
                  <th className="px-6 py-4 text-center">Orders</th>
                  <th className="px-6 py-4">Services Taken</th>
                  <th className="px-6 py-4">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                {filteredCustomers.map((c) => {
                  const safeJoined = c.joinedAt ? new Date(c.joinedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent';
                  const safeLast = c.lastBookingDate ? new Date(c.lastBookingDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : safeJoined;

                  return (
                    <tr key={c.phone} className="hover:bg-slate-50/60 transition-colors">
                      {/* Customer Details */}
                      <td className="px-6 py-4 align-top min-w-[180px]">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 select-none shadow-xs">
                            <img src={getAssetPath(c.photoUrl || '/profile.webp')} alt={c.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="text-slate-900 font-black text-sm block">{c.name || 'Customer'}</span>
                            <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                              Joined {safeJoined}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4 align-top min-w-[160px]">
                        <a
                          href={`tel:${c.phone}`}
                          className="text-xs font-black text-blue-600 block hover:underline"
                        >
                          📞 +91 {c.phone}
                        </a>
                        <span className="text-[10px] text-slate-400 font-medium block truncate max-w-[160px] mt-0.5">
                          {c.email || 'No email saved'}
                        </span>
                      </td>

                      {/* Address */}
                      <td className="px-6 py-4 align-top max-w-[220px]">
                        {c.address ? (
                          <div className="flex items-start gap-1.5">
                            <MapPin size={12} className="text-slate-400 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-slate-700 font-semibold leading-relaxed">
                              {c.address}
                            </p>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">No address on file</span>
                        )}
                      </td>

                      {/* Orders */}
                      <td className="px-6 py-4 align-top text-center min-w-[90px]">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-100">
                          {c.totalBookings || (c.serviceHistory?.length || 0)}
                        </span>
                      </td>

                      {/* Services Taken */}
                      <td className="px-6 py-4 align-top max-w-[240px]">
                        {c.serviceHistory && c.serviceHistory.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {c.serviceHistory.slice(-4).map((s, sIdx) => (
                              <span
                                key={sIdx}
                                className="inline-block text-[9px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                              >
                                {s.serviceName}
                              </span>
                            ))}
                            {c.serviceHistory.length > 4 && (
                              <span className="text-[9px] font-black text-slate-400 self-center">
                                +{c.serviceHistory.length - 4} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">No service history yet</span>
                        )}
                      </td>

                      {/* Last Activity */}
                      <td className="px-6 py-4 align-top min-w-[120px]">
                        <span className="text-xs font-bold text-slate-700 block">
                          {safeLast}
                        </span>
                        <span className="text-[9px] text-emerald-600 font-black block mt-0.5">
                          Verified Record
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
  );
};

export default Customers;
