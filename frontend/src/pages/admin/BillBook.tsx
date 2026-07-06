import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Plus, Search, Printer, CheckCircle,
  AlertCircle, RefreshCw, ChevronDown, ChevronUp,
  Phone, MapPin, Calendar, Hash, Pencil, X, Clock
} from 'lucide-react';
import { updateBookingStatusInCloud } from '../../firebase';
import type { BookingData } from '../../firebase';

// ─── Types ───────────────────────────────────────────────────────────────────
interface BillBookProps {
  bookings: BookingData[];
  onUpdateBookings: (updated: BookingData[]) => void;
  handleGenerateInvoice: (booking: BookingData) => void;
  isDataLoading?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getSafeDate = (val: unknown): Date => {
  try {
    if (!val) return new Date();
    if (typeof val === 'object' && val !== null && 'toDate' in val && typeof (val as { toDate: unknown }).toDate === 'function')
      return (val as { toDate: () => Date }).toDate();
    if (typeof val === 'object' && val !== null && 'seconds' in val && typeof (val as { seconds: unknown }).seconds === 'number')
      return new Date((val as { seconds: number }).seconds * 1000);
    const d = new Date(val as string | number | Date);
    return isNaN(d.getTime()) ? new Date() : d;
  } catch { return new Date(); }
};

const isBillValid = (b: unknown): b is BookingData => {
  if (!b || typeof b !== 'object') return false;
  const bill = b as Record<string, unknown>;
  return typeof bill.id === 'string' && bill.id.trim() !== '';
};

const getServiceColor = (name: string) => {
  const lower = (name || '').toLowerCase();
  if (lower.includes('ac') || lower.includes('cooling') || lower.includes('split') || lower.includes('gas') || lower.includes('condenser'))
    return { dot: 'bg-sky-500', badge: 'bg-sky-50 text-sky-700 border-sky-200' };
  if (lower.includes('electric') || lower.includes('switch') || lower.includes('wire') || lower.includes('fan') || lower.includes('light') || lower.includes('mcb'))
    return { dot: 'bg-orange-500', badge: 'bg-orange-50 text-orange-700 border-orange-200' };
  if (lower.includes('ro') || lower.includes('water') || lower.includes('filter') || lower.includes('purifier'))
    return { dot: 'bg-purple-500', badge: 'bg-purple-50 text-purple-700 border-purple-200' };
  if (lower.includes('washing') || lower.includes('fridge') || lower.includes('refrigerator') || lower.includes('compressor'))
    return { dot: 'bg-indigo-500', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
  return { dot: 'bg-slate-400', badge: 'bg-slate-50 text-slate-600 border-slate-200' };
};

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
const BillBookSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 h-20 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0" />
          <div className="flex-1 space-y-2"><div className="h-2 bg-slate-100 rounded w-16" /><div className="h-4 bg-slate-200 rounded w-20" /></div>
        </div>
      ))}
    </div>
    <div className="bg-white border border-slate-200 rounded-xl p-5 h-20 shadow-sm" />
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 h-36 shadow-sm" />
      ))}
    </div>
    <div className="flex items-center justify-center space-x-2 py-4">
      <RefreshCw size={14} className="text-emerald-500 animate-spin" />
      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Data...</span>
    </div>
  </div>
);

// ─── Single Bill Card ─────────────────────────────────────────────────────────
interface BillCardProps {
  b: BookingData;
  onStatusChange: (id: string, status: 'Pending' | 'Completed' | 'Cancelled') => void;
  onGenerateInvoice: (b: BookingData) => void;
  onEdit: (b: BookingData) => void;
}

const BillCard: React.FC<BillCardProps> = ({ b, onStatusChange, onGenerateInvoice, onEdit }) => {
  const [expanded, setExpanded] = useState(false);

  const subtotal  = b?.subtotal ?? 0;

  // ── Correct per-item GST breakdown ─────────────────────────────────────
  const items     = Array.isArray(b?.items) ? b.items.filter(Boolean) : [];
  let totalBase = 0, totalGstAmt = 0;
  items.forEach(item => {
    const lineTotal = (item.price ?? 0) * (item.quantity ?? 1);
    const rate = (item as any).gstRate ?? 0;
    if (rate > 0) {
      const base = lineTotal / (1 + rate / 100);
      totalBase    += base;
      totalGstAmt  += lineTotal - base;
    } else {
      totalBase += lineTotal;
    }
  });
  // Fallback: if items have no gstRate data use subtotal as-is
  if (totalBase === 0 && subtotal > 0) totalBase = subtotal;
  const base = Math.round(totalBase);
  const gst  = Math.round(totalGstAmt);

  const name      = b?.customerName || 'N/A';
  const phone     = b?.phone || 'N/A';
  const address   = b?.address || 'N/A';
  const status    = b?.status ?? 'Pending';
  const date      = getSafeDate(b.createdAt);
  const PREVIEW   = 2;
  const extra     = items.length - PREVIEW;

  // Status config
  const statusCfg = {
    Completed: { label: 'Paid',      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    Pending:   { label: 'Unpaid',    cls: 'bg-amber-50  text-amber-700  border-amber-200',   dot: 'bg-amber-500'   },
    Cancelled: { label: 'Cancelled', cls: 'bg-red-50    text-red-700    border-red-200',      dot: 'bg-red-500'     },
  };
  const sc = statusCfg[status as keyof typeof statusCfg] ?? statusCfg.Pending;

  // Month / day split for the date badge
  const monthShort = date.toLocaleDateString('en-IN', { month: 'short' });
  const dayNum     = date.getDate();
  const yearNum    = date.getFullYear();
  const timeStr    = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
      {/* Top accent line — colour = status */}
      <div className={`h-0.5 w-full ${status === 'Completed' ? 'bg-emerald-400' : status === 'Cancelled' ? 'bg-red-400' : 'bg-amber-400'}`} />

      <div className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-start gap-5">

          {/* ── COL 1: Date + Invoice ID ──────────────────────────────── */}
          <div className="flex lg:flex-col items-center lg:items-center gap-3 lg:gap-1 lg:w-28 shrink-0">
            {/* Date tile */}
            <div className="flex flex-col items-center bg-slate-800 text-white rounded-xl px-3 py-2.5 shadow-sm min-w-[56px]">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">{monthShort}</span>
              <span className="text-2xl font-black leading-none">{dayNum}</span>
              <span className="text-[8px] text-slate-400 font-bold">{yearNum}</span>
            </div>
            {/* Time */}
            <div className="flex items-center space-x-1 text-[9px] text-slate-400 font-bold mt-0.5">
              <Calendar size={9} />
              <span>{timeStr}</span>
            </div>
            {/* Invoice ID */}
            <div className="lg:mt-2 flex items-center space-x-1">
              <Hash size={9} className="text-slate-400" />
              <span className="font-mono text-[9px] font-black text-slate-500 tracking-wider">{b.id}</span>
            </div>
          </div>

          {/* ── COL 2: Customer Info ──────────────────────────────────── */}
          <div className="flex-1 min-w-0 border-l border-slate-100 lg:pl-5">
            <p className="text-slate-900 font-extrabold text-sm leading-tight truncate">{name}</p>
            <div className="flex items-center space-x-1.5 mt-1.5 text-slate-500">
              <Phone size={10} className="text-slate-400 shrink-0" />
              <span className="text-[10px] font-bold">+91 {phone}</span>
            </div>
            <div className="flex items-start space-x-1.5 mt-1 text-slate-400">
              <MapPin size={10} className="shrink-0 mt-0.5 text-slate-300" />
              <span className="text-[9px] font-medium leading-relaxed line-clamp-2">{address}</span>
            </div>
          </div>

          {/* ── COL 3: Services ──────────────────────────────────────── */}
          <div className="flex-[1.4] min-w-0 border-l border-slate-100 lg:pl-5">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
              {items.length} {items.length === 1 ? 'Service' : 'Services'}
            </p>
            {items.length === 0 ? (
              <span className="text-[10px] text-slate-300 italic">No services listed</span>
            ) : (
              <div className="space-y-1.5">
                {(expanded ? items : items.slice(0, PREVIEW)).map((item, i) => {
                  const svc  = item?.serviceName ?? 'Unknown';
                  const brand = item?.brand ?? '';
                  const qty   = item?.quantity ?? 1;
                  const col   = getServiceColor(svc);
                  return (
                    <div key={i} className={`flex items-center gap-2 text-[10px] font-semibold border rounded-lg px-2.5 py-1.5 ${col.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${col.dot}`} />
                      <span className="flex-1 truncate font-bold">{svc}</span>
                      {brand && (
                        <span className="shrink-0 bg-white border border-current rounded px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide">
                          {brand}
                        </span>
                      )}
                      <span className="shrink-0 bg-black/5 rounded px-1.5 py-0.5 text-[9px] font-black">×{qty}</span>
                    </div>
                  );
                })}
                {extra > 0 && !expanded && (
                  <button
                    onClick={() => setExpanded(true)}
                    className="flex items-center space-x-1 text-[9px] font-black text-blue-600 hover:text-blue-700 mt-0.5 cursor-pointer"
                  >
                    <ChevronDown size={10} />
                    <span>+{extra} more service{extra > 1 ? 's' : ''}</span>
                  </button>
                )}
                {expanded && extra > 0 && (
                  <button
                    onClick={() => setExpanded(false)}
                    className="flex items-center space-x-1 text-[9px] font-black text-slate-400 hover:text-slate-600 mt-0.5 cursor-pointer"
                  >
                    <ChevronUp size={10} />
                    <span>Show less</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── COL 4: Amount ────────────────────────────────────────── */}
          <div className="flex flex-col items-end border-l border-slate-100 lg:pl-5 shrink-0 min-w-[110px]">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Net Amount</p>
            <p className="text-slate-900 font-black text-xl leading-tight">₹{subtotal.toLocaleString('en-IN')}</p>
            <div className="mt-2 space-y-0.5 text-right">
              <p className="text-[9px] text-slate-400 font-bold">Base: ₹{base.toLocaleString('en-IN')}</p>
              <p className="text-[9px] text-blue-500 font-bold">GST: ₹{gst.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* ── COL 5: Status + Actions ──────────────────────────────── */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 border-l border-slate-100 lg:pl-5 shrink-0">
            {/* Status badge */}
            <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${sc.cls}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
              <span>{sc.label}</span>
            </span>

            {/* Edit button — always visible */}
            <button
              type="button"
              onClick={() => onEdit(b)}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black rounded-lg shadow-sm hover:shadow-md transition-all duration-150 hover:scale-[1.02] active:scale-[0.97] cursor-pointer border-b-2 border-blue-800 active:border-b-0 whitespace-nowrap"
              title="Edit this invoice"
            >
              <Pencil size={11} className="stroke-[2.5]" />
              <span>Edit</span>
            </button>

            {/* Invoice PDF button */}
            <button
              type="button"
              onClick={() => { try { onGenerateInvoice(b); } catch (e) { console.error(e); } }}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black rounded-lg shadow-sm hover:shadow-md transition-all duration-150 hover:scale-[1.02] active:scale-[0.97] cursor-pointer border-b-2 border-slate-950 active:border-b-0 whitespace-nowrap"
              title="Download PDF Invoice"
            >
              <Printer size={11} className="stroke-[2.5]" />
              <span>Invoice PDF</span>
            </button>

            {/* Mark Paid button — only for Pending */}
            {status === 'Pending' && (
              <button
                type="button"
                onClick={() => onStatusChange(b.id, 'Completed')}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black rounded-lg shadow-sm hover:shadow-md transition-all duration-150 hover:scale-[1.02] active:scale-[0.97] cursor-pointer border-b-2 border-emerald-800 active:border-b-0 whitespace-nowrap"
                title="Mark as paid"
              >
                <CheckCircle size={11} className="stroke-[2.5]" />
                <span>Mark Paid</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const BillBook: React.FC<BillBookProps> = ({
  bookings,
  onUpdateBookings,
  handleGenerateInvoice,
  isDataLoading = false,
}) => {
  const navigate = useNavigate();
  const [billSearchQuery, setBillSearchQuery] = useState('');
  const [billStatusFilter, setBillStatusFilter] = useState<'All' | 'Pending' | 'Completed' | 'Cancelled'>('All');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // ── Date Range filter state ───────────────────────────────────────────────
  type DateRange = 'all' | 'today' | 'week' | 'month' | 'lastmonth' | 'custom';
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const handleEditInvoice = (b: BookingData) => {
    navigate('/admin/billbook/create', { state: { editBooking: b } });
  };

  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 350);
    return () => clearTimeout(t);
  }, []);

  // ── Safe + filtered bookings (newest first) ──────────────────────────────
  const safeBookings: BookingData[] = (() => {
    try {
      if (!Array.isArray(bookings)) return [];
      return [...bookings.filter(isBillValid)].sort(
        (a, b) => getSafeDate(b.createdAt).getTime() - getSafeDate(a.createdAt).getTime()
      );
    } catch { return []; }
  })();

  // ── Date range helper ─────────────────────────────────────────────────────
  const inDateRange = (b: BookingData): boolean => {
    if (dateRange === 'all') return true;
    const d = getSafeDate(b.createdAt);
    const now = new Date();
    if (dateRange === 'today') {
      return d.toDateString() === now.toDateString();
    }
    if (dateRange === 'week') {
      const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
      return d >= weekAgo;
    }
    if (dateRange === 'month') {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    if (dateRange === 'lastmonth') {
      const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
    }
    if (dateRange === 'custom' && customFrom && customTo) {
      const from = new Date(customFrom); from.setHours(0,0,0,0);
      const to   = new Date(customTo);   to.setHours(23,59,59,999);
      return d >= from && d <= to;
    }
    return true;
  };

  const filteredBillbook = (() => {
    try {
      return safeBookings.filter(b => {
        const q = (billSearchQuery ?? '').toLowerCase().trim();
        const matchesQuery =
          q === '' ||
          (b.id ?? '').toLowerCase().includes(q) ||
          (b.customerName ?? '').toLowerCase().includes(q) ||
          (b.phone ?? '').includes(q) ||
          (b.address ?? '').toLowerCase().includes(q);
        return matchesQuery && (billStatusFilter === 'All' || b.status === billStatusFilter) && inDateRange(b);
      });
    } catch { return safeBookings; }
  })();

  // ── Status change ─────────────────────────────────────────────────────────
  const handleStatusChange = async (id: string, newStatus: 'Pending' | 'Completed' | 'Cancelled') => {
    try {
      onUpdateBookings(safeBookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
      await updateBookingStatusInCloud(id, newStatus);
    } catch (err) {
      console.error('[BillBook] Status update failed:', err);
      setLocalError('Status update failed. Please try again.');
      setTimeout(() => setLocalError(null), 4000);
    }
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalVal   = safeBookings.filter(b => b.status !== 'Cancelled').reduce((s, b) => s + (b.subtotal ?? 0), 0);
  const paidCount  = safeBookings.filter(b => b.status === 'Completed').length;
  const pendCount  = safeBookings.filter(b => b.status === 'Pending').length;
  const paidVal    = safeBookings.filter(b => b.status === 'Completed').reduce((s, b) => s + (b.subtotal ?? 0), 0);

  if (isDataLoading || !isReady) return <BillBookSkeleton />;

  return (
    <div className="space-y-6 text-left font-sans animate-in fade-in duration-150">

      {/* Error toast */}
      {localError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-xs font-bold flex items-center space-x-2 shadow-sm">
          <AlertCircle size={14} className="shrink-0" />
          <span>{localError}</span>
        </div>
      )}

      {/* ── Stats Row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
        {[
          { label: 'Total Revenue',  value: `₹${totalVal.toLocaleString('en-IN')}`, icon: '₹',             accent: 'emerald', iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
          { label: 'Total Invoices', value: `${safeBookings.length} Bills`,          icon: <FileText size={16}/>, accent: 'blue',    iconBg: 'bg-blue-50 text-blue-700 border-blue-100' },
          { label: 'Pending Bills',  value: `${pendCount} Unpaid`,                  icon: <AlertCircle size={16}/>, accent: 'amber', iconBg: 'bg-amber-50 text-amber-700 border-amber-100' },
          { label: 'Amount Paid',    value: `₹${paidVal.toLocaleString('en-IN')}`,  icon: <CheckCircle size={16}/>, accent: 'green', iconBg: 'bg-green-50 text-green-700 border-green-100' },
        ].map((s, i) => (
          <div key={i} className={`bg-white border border-slate-200 border-l-4 border-l-${s.accent}-500 rounded-xl p-4 flex items-center space-x-3 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01]`}>
            <div className={`w-10 h-10 rounded-lg border flex items-center justify-center font-black text-base shrink-0 ${s.iconBg}`}>
              {s.icon}
            </div>
            <div className="truncate">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">{s.label}</span>
              <span className="text-slate-900 font-extrabold text-sm sm:text-base">{s.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Header + Create Button ─────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
            <FileText size={16} className="text-emerald-600" />
            <span>Live Invoice Ledger</span>
            <span className="ml-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
              {safeBookings.length} Bills
            </span>
          </h3>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
            Generate, track and download PDF tax invoices for all service clients.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/billbook/create')}
          className="bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.02] active:scale-[0.98] text-white rounded-lg py-2.5 px-5 text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md hover:shadow-lg border-b-2 border-emerald-800 active:border-b-0 transition-all duration-200 cursor-pointer shrink-0"
        >
          <Plus size={14} className="stroke-[3]" />
          <span>Create Manual Invoice</span>
        </button>
      </div>

      {/* ── Search + Filter ────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 flex border border-slate-200 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all bg-white w-full">
          <div className="bg-slate-50 border-r border-slate-200 px-3.5 py-2.5 text-slate-400 flex items-center shrink-0">
            <Search size={13} className="stroke-[2.5]" />
          </div>
          <input
            type="text"
            value={billSearchQuery}
            onChange={e => setBillSearchQuery(e.target.value)}
            placeholder="Search by ID, customer name, phone, or address..."
            className="w-full bg-white text-slate-700 text-xs font-semibold px-3 py-2.5 focus:outline-none placeholder:text-slate-300"
          />
          {billSearchQuery && (
            <button onClick={() => setBillSearchQuery('')} className="px-3 text-slate-300 hover:text-slate-500 transition-colors cursor-pointer">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {(['All', 'Pending', 'Completed', 'Cancelled'] as const).map(s => (
            <button
              key={s}
              onClick={() => setBillStatusFilter(s)}
              className={`px-3.5 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-150 cursor-pointer border ${
                billStatusFilter === s
                  ? s === 'All'       ? 'bg-slate-800 text-white border-slate-800'
                  : s === 'Pending'   ? 'bg-amber-500 text-white border-amber-500'
                  : s === 'Completed' ? 'bg-emerald-600 text-white border-emerald-600'
                  :                    'bg-red-500 text-white border-red-500'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {s === 'All' ? `All (${safeBookings.length})`
               : s === 'Pending' ? `Unpaid (${pendCount})`
               : s === 'Completed' ? `Paid (${paidCount})`
               : `Cancelled (${safeBookings.filter(b => b.status === 'Cancelled').length})`}
            </button>
          ))}
        </div>
      </div>

      {/* ── Date Range Filter ──────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl px-5 py-3.5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center space-x-2 shrink-0">
            <Clock size={13} className="text-slate-400" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Date Range:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {([
              { key: 'all',       label: 'All Time' },
              { key: 'today',     label: 'Today' },
              { key: 'week',      label: 'This Week' },
              { key: 'month',     label: 'This Month' },
              { key: 'lastmonth', label: 'Last Month' },
              { key: 'custom',    label: '📅 Custom Range' },
            ] as const).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setDateRange(key)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wide transition-all duration-150 cursor-pointer border ${
                  dateRange === key
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom date pickers */}
        {dateRange === 'custom' && (
          <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center space-x-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">From:</label>
              <input
                type="date"
                value={customFrom}
                onChange={e => setCustomFrom(e.target.value)}
                className="text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 cursor-pointer"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">To:</label>
              <input
                type="date"
                value={customTo}
                onChange={e => setCustomTo(e.target.value)}
                className="text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 cursor-pointer"
              />
            </div>
            {customFrom && customTo && (
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg">
                {filteredBillbook.length} invoice{filteredBillbook.length !== 1 ? 's' : ''} found
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Bill Cards ────────────────────────────────────────────────────── */}
      {filteredBillbook.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl py-20 px-4 text-center shadow-sm select-none">
          <FileText size={44} className="text-slate-200 stroke-1 mx-auto" />
          <h3 className="text-slate-700 font-extrabold text-sm mt-4">No invoices found</h3>
          <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto font-semibold">
            {billSearchQuery ? 'Try a different search term or clear the filter.' : 'Create your first invoice using the button above.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBillbook.map((b, idx) => (
            <BillCard
              key={`${b.id}-${idx}`}
              b={b}
              onStatusChange={handleStatusChange}
              onGenerateInvoice={handleGenerateInvoice}
              onEdit={handleEditInvoice}
            />
          ))}
          <p className="text-center text-[9px] text-slate-300 font-bold uppercase tracking-widest pt-2 pb-1 select-none">
            — Showing {filteredBillbook.length} of {safeBookings.length} invoice{safeBookings.length !== 1 ? 's' : ''} —
          </p>
        </div>
      )}

    </div>
  );
};

export default BillBook;
