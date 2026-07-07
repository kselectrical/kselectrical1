import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, Wrench, Calendar, Phone, 
  CheckCircle, Clock, XCircle, Star, MapPin, Plus, Trash2 
} from 'lucide-react';
import type { BookingData, CustomerUser } from '../../firebase';
import type { BusinessConfig } from '../../data';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

interface DashboardProps {
  bookings: BookingData[];
  customers: CustomerUser[];
  businessConfig: BusinessConfig;
}

interface Technician {
  id?: string;
  name: string;
  phone: string;
  specialization: string;
  status: 'Active' | 'On Service' | 'Inactive';
}

interface OfflineReview {
  id?: string;
  name: string;
  rating: number;
  service: string;
  text: string;
  date: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  bookings,
  customers,
  businessConfig
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'technicians' | 'reviews' | 'areas'>('overview');

  // Local state for Technicians
  const [technicians, setTechnicians] = useState<Technician[]>([
    { name: "Rahul Sharma", phone: "9871234560", specialization: "AC Services", status: "Active" },
    { name: "Amit Kumar", phone: "9650987123", specialization: "Electrical Services", status: "On Service" },
    { name: "Sunil Yadav", phone: "8800123987", specialization: "RO Services", status: "Active" }
  ]);
  const [showAddTechModal, setShowAddTechModal] = useState(false);
  const [newTech, setNewTech] = useState<Technician>({ name: "", phone: "", specialization: "AC Services", status: "Active" });

  // Local state for Offline Reviews
  const [reviews, setReviews] = useState<OfflineReview[]>([
    { name: "Suresh Gupta", rating: 5, service: "AC Service", text: "Very polite technician. Cleaned the split AC filters thoroughly and checked gas pressure. Satisfied.", date: "2026-06-28" },
    { name: "Ananya Dixit", rating: 5, service: "Electrician", text: "Fixed the sparking main circuit breaker within 30 minutes. Extremely prompt service.", date: "2026-06-26" }
  ]);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [newReview, setNewReview] = useState<OfflineReview>({ name: "", rating: 5, service: "AC Service", text: "", date: new Date().toISOString().split('T')[0] });

  // Local state for Service Areas
  const [serviceAreas, setServiceAreas] = useState<string[]>(businessConfig.serviceAreas || []);
  const [newArea, setNewArea] = useState("");

  // Load persistence data
  useEffect(() => {
    const loadTechsAndReviews = async () => {
      if (db) {
        try {
          const techSnap = await getDocs(collection(db, 'technicians'));
          const techList = techSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Technician));
          if (techList.length > 0) setTechnicians(techList);

          const reviewSnap = await getDocs(collection(db, 'offline_reviews'));
          const reviewList = reviewSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as OfflineReview));
          if (reviewList.length > 0) setReviews(reviewList);
        } catch (e) {
          console.warn("Could not load from Firestore, using local default states:", e);
        }
      }
    };
    loadTechsAndReviews();
  }, []);

  // Stats Calculations
  const completedBookings = bookings.filter(b => b.status === 'Completed');
  const pendingBookings = bookings.filter(b => b.status === 'Pending');

  const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.subtotal || 0), 0);
  const totalBookingsCount = bookings.length;
  const averageOrderValue = completedBookings.length > 0 ? Math.round(totalRevenue / completedBookings.length) : 0;

  // Group bookings by area
  const areaCounts: Record<string, number> = {};
  bookings.forEach(b => {
    const area = b.selectedLocation || 'Noida Extension';
    areaCounts[area] = (areaCounts[area] || 0) + 1;
  });
  const busiestArea = Object.entries(areaCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Gaur City 1';

  // Handling Technicians add
  const handleAddTechnician = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTech.name || !newTech.phone) return;
    if (db) {
      try {
        const docRef = await addDoc(collection(db, 'technicians'), newTech);
        setTechnicians([...technicians, { id: docRef.id, ...newTech }]);
      } catch (err) {
        console.error(err);
      }
    } else {
      setTechnicians([...technicians, newTech]);
    }
    setNewTech({ name: "", phone: "", specialization: "AC Services", status: "Active" });
    setShowAddTechModal(false);
  };

  const handleDeleteTechnician = async (idx: number, id?: string) => {
    if (id && db) {
      try {
        await deleteDoc(doc(db, 'technicians', id));
      } catch (err) {
        console.error(err);
      }
    }
    setTechnicians(technicians.filter((_, i) => i !== idx));
  };

  // Handling Offline Reviews Add
  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;
    if (db) {
      try {
        const docRef = await addDoc(collection(db, 'offline_reviews'), newReview);
        setReviews([...reviews, { id: docRef.id, ...newReview }]);
      } catch (err) {
        console.error(err);
      }
    } else {
      setReviews([...reviews, newReview]);
    }
    setNewReview({ name: "", rating: 5, service: "AC Service", text: "", date: new Date().toISOString().split('T')[0] });
    setShowAddReviewModal(false);
  };

  // Handling Service Areas Add
  const handleAddArea = () => {
    if (!newArea || serviceAreas.includes(newArea)) return;
    const updated = [...serviceAreas, newArea];
    setServiceAreas(updated);
    setNewArea("");
  };

  const handleDeleteArea = (areaToDelete: string) => {
    setServiceAreas(serviceAreas.filter(a => a !== areaToDelete));
  };

  return (
    <div className="space-y-6 font-sans text-left pb-12 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">ADMIN OVERVIEW</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Live metrics dashboard & technicians allocation control</p>
        </div>
        <div className="flex items-center gap-2">
          {([
            'overview',
            'technicians',
            'reviews',
            'areas'
          ] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
                activeTab === tab 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100' 
                  : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Key Metric Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Stat Card 1: Revenue */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[125px]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black tracking-wider text-slate-500 uppercase">Total Revenue</span>
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <TrendingUp size={16} />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-xl md:text-2xl font-black text-slate-900 leading-none font-mono">₹{totalRevenue.toLocaleString('en-IN')}</span>
                <div className="flex items-center space-x-1 mt-1 text-[10px] font-bold text-emerald-600">
                  <span>₹{averageOrderValue} avg booking</span>
                </div>
              </div>
            </div>

            {/* Stat Card 2: Bookings */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[125px]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black tracking-wider text-slate-500 uppercase">Bookings Log</span>
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Calendar size={16} />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-xl md:text-2xl font-black text-slate-900 leading-none">{totalBookingsCount} Total</span>
                <div className="flex items-center space-x-2 mt-1 text-[9px] font-bold text-slate-500">
                  <span className="text-blue-600">{pendingBookings.length} Pending</span>
                  <span>•</span>
                  <span className="text-green-600">{completedBookings.length} Completed</span>
                </div>
              </div>
            </div>

            {/* Stat Card 3: Customers */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[125px]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black tracking-wider text-slate-500 uppercase">Customers</span>
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <Users size={16} />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-xl md:text-2xl font-black text-slate-900 leading-none">{customers.length} Accounts</span>
                <div className="flex items-center space-x-1 mt-1 text-[10px] font-bold text-indigo-600">
                  <span>Verified phone profiles</span>
                </div>
              </div>
            </div>

            {/* Stat Card 4: Service Areas */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[125px]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black tracking-wider text-slate-500 uppercase">Busiest Area</span>
                <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                  <MapPin size={16} />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm md:text-base font-black text-slate-950 truncate block max-w-full">{busiestArea}</span>
                <div className="flex items-center space-x-1 mt-1 text-[10px] font-bold text-orange-650">
                  <span>{serviceAreas.length} Total active areas</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bookings log table list */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-150 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase">Recent Incoming Requests</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Real-time domestic bookings pipeline</p>
              </div>
              <span className="text-[10px] font-black bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-xl uppercase">
                {pendingBookings.length} Active Pending
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-150">
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-550 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-550 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-550 uppercase tracking-wider">Service Items</th>
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-550 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3.5 text-[10px] font-black text-slate-550 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {bookings.slice(0, 5).map((booking, idx) => (
                    <tr key={booking.id || idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 truncate">
                        <span className="text-xs font-black text-slate-800 block">{booking.dateTime}</span>
                        <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{booking.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-black text-slate-800 block">{booking.customerName}</span>
                        <span className="text-[10px] text-slate-500 font-bold block mt-0.5">📞 {booking.phone}</span>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate">
                        <span className="text-xs font-bold text-slate-650 block truncate">
                          {booking.items.map(i => `${i.serviceName} (x${i.quantity})`).join(', ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-black text-slate-800 font-mono">₹{booking.subtotal}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider inline-flex items-center space-x-1.5 ${
                          booking.status === 'Completed' 
                            ? 'bg-green-50 border border-green-200 text-green-700' 
                            : booking.status === 'Cancelled'
                            ? 'bg-red-50 border border-red-200 text-red-700'
                            : 'bg-blue-50 border border-blue-200 text-blue-700 animate-pulse'
                        }`}>
                          {booking.status === 'Completed' && <CheckCircle size={10} />}
                          {booking.status === 'Pending' && <Clock size={10} />}
                          {booking.status === 'Cancelled' && <XCircle size={10} />}
                          <span>{booking.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'technicians' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white border border-slate-200 p-5 rounded-3xl shadow-xs">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase">Technicians Management</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Track field technician allocation and specializations</p>
            </div>
            <button
              onClick={() => setShowAddTechModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-xs cursor-pointer flex items-center space-x-2 transition-transform hover:scale-102"
            >
              <Plus size={14} />
              <span>Add Technician</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {technicians.map((tech, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-900">{tech.name}</h4>
                    <span className="inline-block bg-slate-50 border border-slate-200 text-slate-700 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {tech.specialization}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                    tech.status === 'Active' 
                      ? 'bg-green-50 border border-green-200 text-green-700'
                      : tech.status === 'On Service'
                      ? 'bg-amber-50 border border-amber-200 text-amber-700'
                      : 'bg-slate-100 border border-slate-250 text-slate-500'
                  }`}>
                    {tech.status}
                  </span>
                </div>

                <div className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-xs font-bold text-slate-500">
                  <div className="flex items-center space-x-2">
                    <Phone size={12} className="text-slate-400" />
                    <span>+91 {tech.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wrench size={12} className="text-slate-400" />
                    <span>Noida Extension Hub</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleDeleteTechnician(idx, tech.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white border border-slate-200 p-5 rounded-3xl shadow-xs">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase">Customer Reviews Log</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Offline reviews tracker and rating logs</p>
            </div>
            <button
              onClick={() => setShowAddReviewModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-xs cursor-pointer flex items-center space-x-2 transition-transform hover:scale-102"
            >
              <Plus size={14} />
              <span>Log Offline Review</span>
            </button>
          </div>

          <div className="space-y-4">
            {reviews.map((rev, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase">{rev.name}</h4>
                    <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider block mt-0.5">
                      Service: {rev.service} • Logged: {rev.date}
                    </span>
                  </div>
                  <div className="flex items-center space-x-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} fill={s <= rev.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-650 font-medium leading-relaxed italic">
                  "{rev.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'areas' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active locations catalog */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase">Active Service Areas</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Active coverage zones listing</p>
            </div>
            
            <div className="flex flex-wrap gap-2.5 pt-2">
              {serviceAreas.map((area, idx) => (
                <div 
                  key={idx} 
                  className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 flex items-center space-x-3 text-xs font-extrabold text-slate-800 shadow-3xs"
                >
                  <MapPin size={12} className="text-blue-500" />
                  <span>{area}</span>
                  <button 
                    onClick={() => handleDeleteArea(area)}
                    className="text-slate-400 hover:text-red-500 transition-colors pl-2 border-l border-slate-200 cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add location selector panel */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4 h-fit">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase">Expand Coverage Zone</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Add a new service area / sector</p>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="e.g. Gaur City 5th Avenue"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleAddArea}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                Add Coverage Area
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Add Technician Modal */}
      {showAddTechModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900 uppercase">Register Technician</h3>
              <button onClick={() => setShowAddTechModal(false)} className="text-slate-400 hover:text-slate-950 font-black cursor-pointer">×</button>
            </div>
            
            <form onSubmit={handleAddTechnician} className="space-y-4 text-xs font-bold text-slate-650">
              <div className="space-y-1.5">
                <label className="block">Full Name</label>
                <input
                  type="text"
                  required
                  value={newTech.name}
                  onChange={(e) => setNewTech({ ...newTech, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block">Phone Number</label>
                <input
                  type="text"
                  required
                  value={newTech.phone}
                  onChange={(e) => setNewTech({ ...newTech, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block">Specialization Area</label>
                <select
                  value={newTech.specialization}
                  onChange={(e) => setNewTech({ ...newTech, specialization: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-850 focus:outline-none"
                >
                  <option value="AC Services">AC Services & Repair</option>
                  <option value="RO Services">RO & Water Purifiers</option>
                  <option value="Electrical Services">Electrical & Wiring</option>
                  <option value="Appliance Repair">Appliance Repair</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Review Modal */}
      {showAddReviewModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900 uppercase">Log Offline Review</h3>
              <button onClick={() => setShowAddReviewModal(false)} className="text-slate-400 hover:text-slate-950 font-black cursor-pointer">×</button>
            </div>
            
            <form onSubmit={handleAddReview} className="space-y-4 text-xs font-bold text-slate-650">
              <div className="space-y-1.5">
                <label className="block">Customer Name</label>
                <input
                  type="text"
                  required
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block">Rating (1 to 5 Stars)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  required
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) || 5 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block">Service Category</label>
                <input
                  type="text"
                  required
                  value={newReview.service}
                  onChange={(e) => setNewReview({ ...newReview, service: e.target.value })}
                  placeholder="e.g. Split AC Repair"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block">Review Text</label>
                <textarea
                  required
                  value={newReview.text}
                  onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-850 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Log Review
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default Dashboard;
