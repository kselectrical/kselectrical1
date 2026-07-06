import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trash2, ArrowLeft, FileText, Plus, Keyboard, ShoppingCart, Pencil } from 'lucide-react';
import type { TechnicalService } from '../../types';
import { saveInvoiceToCloud, updateInvoiceInCloud } from '../../firebase';
import type { BookingData } from '../../firebase';
import type { BusinessConfig } from '../../data';

interface CreateManualInvoiceProps {
  services: TechnicalService[];
  bookings: BookingData[];
  onUpdateBookings: (updated: BookingData[]) => void;
  businessConfig: BusinessConfig;
  handleGenerateInvoice: (booking: BookingData) => void;
}

export const CreateManualInvoice: React.FC<CreateManualInvoiceProps> = ({
  services,
  bookings,
  onUpdateBookings,
  businessConfig,
  handleGenerateInvoice
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ── Detect edit mode: location.state carries the booking to edit ──────────
  const editBooking = (location.state as { editBooking?: BookingData } | null)?.editBooking ?? null;
  const isEditMode = editBooking !== null;

  // ── Form States (pre-filled in edit mode) ────────────────────────────────
  const [manualCustomerName, setManualCustomerName] = useState(editBooking?.customerName ?? '');
  const [manualPhone, setManualPhone] = useState(editBooking?.phone ?? '');
  const [manualAddress, setManualAddress] = useState(editBooking?.address ?? '');
  const [manualLocation, setManualLocation] = useState(editBooking?.selectedLocation ?? businessConfig.serviceAreas[0] ?? 'Delhi NCR');
  const [manualDateTime, setManualDateTime] = useState(editBooking?.dateTime ?? '');
  const [manualTerms, setManualTerms] = useState(
    editBooking?.termsAndConditions ??
    `1. 30-Day doorstep warranty applies on AC repairs.\n2. Kindly check all fittings and cooling before final handoff.\n3. Physical damage or third-party repair voids warranty.`
  );
  const [manualStatus, setManualStatus] = useState<'Pending' | 'Completed' | 'Cancelled'>(
    (editBooking?.status as 'Pending' | 'Completed' | 'Cancelled') ?? 'Completed'
  );

  // ── Pre-fill items in edit mode ───────────────────────────────────────────
  const [manualItems, setManualItems] = useState<{
    serviceId: string;
    serviceName: string;
    price: number;
    quantity: number;
    brand?: string;
    gstRate?: number;
  }[]>(
    editBooking?.items?.filter(Boolean).map(item => ({
      serviceId: item.serviceId ?? 'manual-' + Date.now(),
      serviceName: item.serviceName ?? '',
      price: item.price ?? 0,
      quantity: item.quantity ?? 1,
      brand: item.brand ?? 'Generic',
      gstRate: (item as any).gstRate ?? 0,
    })) ?? []
  );

  // ── Line Item Builder States ──────────────────────────────────────────────
  const [itemName, setItemName] = useState('');
  const [itemBrand, setItemBrand] = useState('Generic');
  const [itemPrice, setItemPrice] = useState('');
  const [itemQty, setItemQty] = useState('1');
  const [itemGst, setItemGst] = useState('0');
  const [isSaving, setIsSaving] = useState(false);

  const itemNameRef = useRef<HTMLInputElement>(null);

  // Re-populate if the editBooking reference changes (e.g. navigation)
  useEffect(() => {
    if (editBooking) {
      setManualCustomerName(editBooking.customerName ?? '');
      setManualPhone(editBooking.phone ?? '');
      setManualAddress(editBooking.address ?? '');
      setManualLocation(editBooking.selectedLocation ?? businessConfig.serviceAreas[0] ?? '');
      setManualDateTime(editBooking.dateTime ?? '');
      setManualTerms(editBooking.termsAndConditions ?? '');
      setManualStatus((editBooking.status as 'Pending' | 'Completed' | 'Cancelled') ?? 'Completed');
      setManualItems(
        editBooking.items?.filter(Boolean).map(item => ({
          serviceId: item.serviceId ?? 'manual-' + Date.now(),
          serviceName: item.serviceName ?? '',
          price: item.price ?? 0,
          quantity: item.quantity ?? 1,
          brand: item.brand ?? 'Generic',
          gstRate: (item as any).gstRate ?? 0,
        })) ?? []
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editBooking?.id]);

  // ── Catalog quick-select ──────────────────────────────────────────────────
  const handleQuickSelectCatalog = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceId = e.target.value;
    if (!serviceId) return;
    const found = services.find(s => s.id === serviceId);
    if (found) {
      setItemName(found.name);
      setItemPrice(found.price.toString());
      setItemBrand('Generic');
      setItemGst('0');
      setTimeout(() => itemNameRef.current?.focus(), 50);
    }
    e.target.value = '';
  };

  // ── Add item ──────────────────────────────────────────────────────────────
  const handleAddInvoiceItem = () => {
    if (!itemName.trim()) { alert('Please enter item/service name.'); itemNameRef.current?.focus(); return; }
    const priceNum = Number(itemPrice);
    if (isNaN(priceNum) || priceNum <= 0) { alert('Please enter a valid price greater than 0.'); return; }
    const qtyNum = Number(itemQty);
    if (isNaN(qtyNum) || qtyNum <= 0) { alert('Please enter a valid quantity greater than 0.'); return; }
    const gstNum = Number(itemGst);
    if (isNaN(gstNum) || gstNum < 0) { alert('Please enter a valid GST percentage (0 or more).'); return; }

    setManualItems([...manualItems, {
      serviceId: 'manual-' + Date.now() + Math.floor(Math.random() * 100),
      serviceName: itemName.trim(),
      price: priceNum,
      quantity: qtyNum,
      brand: itemBrand.trim() || 'Generic',
      gstRate: gstNum,
    }]);
    setItemName(''); setItemBrand('Generic'); setItemPrice(''); setItemQty('1'); setItemGst('0');
    setTimeout(() => itemNameRef.current?.focus(), 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAddInvoiceItem(); }
  };

  const handleRemoveManualItem = (index: number) => setManualItems(manualItems.filter((_, i) => i !== index));

  // ── Submit (Create OR Update) ─────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCustomerName.trim()) { alert('Please enter customer name.'); return; }
    if (!manualPhone.trim() || manualPhone.length < 10) { alert('Please enter a valid 10-digit phone number.'); return; }
    if (!manualAddress.trim()) { alert('Please enter customer address.'); return; }
    if (manualItems.length === 0) { alert('Please add at least one item or service to the invoice.'); return; }

    const subtotal = manualItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const invoicePayload: BookingData = {
      // In edit mode keep the same ID + original createdAt; in create mode generate new ones
      id: isEditMode ? editBooking!.id : ('BK-' + Math.floor(100000 + Math.random() * 900000)),
      customerName: manualCustomerName.trim(),
      phone: manualPhone,
      address: manualAddress.trim(),
      selectedLocation: manualLocation,
      dateTime: manualDateTime.trim() || 'Instant Handover',
      items: manualItems.map(item => ({
        serviceId: item.serviceId,
        serviceName: item.serviceName,
        price: item.price,
        quantity: item.quantity,
        brand: item.brand,
        gstRate: item.gstRate ?? 0,
      })),
      subtotal,
      status: isEditMode ? manualStatus : 'Completed',
      createdAt: isEditMode ? editBooking!.createdAt : new Date().toISOString(),
      termsAndConditions: manualTerms.trim(),
    };

    setIsSaving(true);
    try {
      if (isEditMode) {
        // UPDATE existing invoice
        const updated = bookings.map(b => b.id === invoicePayload.id ? invoicePayload : b);
        onUpdateBookings(updated);
        await updateInvoiceInCloud(invoicePayload);
        alert(`Invoice ${invoicePayload.id} updated successfully!`);
      } else {
        // CREATE new invoice
        const updated = [invoicePayload, ...bookings];
        onUpdateBookings(updated);
        await saveInvoiceToCloud(invoicePayload);
        alert(`Invoice ${invoicePayload.id} created successfully! Opening print dialog...`);
        handleGenerateInvoice(invoicePayload);
      }
      navigate('/admin/billbook');
    } catch (err) {
      console.error('Failed to save invoice:', err);
      alert('Failed to save the invoice. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left font-sans animate-in fade-in duration-150">

      {/* Header */}
      <div className="flex items-center space-x-4 select-none">
        <button
          onClick={() => navigate('/admin/billbook')}
          className="p-2.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-slate-700 transition-all duration-150 hover:scale-[1.05] active:scale-[0.95] cursor-pointer shadow-sm border-b-2 border-b-slate-400 active:border-b-0 flex items-center justify-center"
        >
          <ArrowLeft size={16} className="stroke-[2.5]" />
        </button>
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
            {isEditMode ? <Pencil size={15} className="text-blue-600" /> : <FileText size={15} className="text-emerald-600" />}
            <span>{isEditMode ? `Edit Invoice — ${editBooking!.id}` : 'Create Manual Client Invoice'}</span>
          </h3>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
            {isEditMode
              ? 'Update customer details, services, and invoice status below.'
              : 'Generate tax invoice ledger records manually for walk-in or offline bookings.'}
          </p>
        </div>
      </div>

      {/* Edit-mode banner */}
      {isEditMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 flex items-center space-x-3 text-blue-700 shadow-sm">
          <Pencil size={14} className="shrink-0" />
          <div>
            <p className="text-xs font-black">You are editing an existing invoice.</p>
            <p className="text-[10px] font-semibold mt-0.5 text-blue-500">The Invoice ID and creation date will stay the same. Only updated fields will be saved.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-300 rounded-2xl p-6 space-y-6 shadow-md">

        {/* Title Badge row */}
        <div className="border-b border-slate-200 pb-3 flex justify-between items-center select-none">
          <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
            <FileText size={15} className="text-emerald-600" />
            <span>Invoice Information</span>
          </h4>
          <span className={`text-[9px] font-black tracking-wider uppercase px-3 py-1 rounded-full border shadow-xs ${isEditMode ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200'}`}>
            {isEditMode ? '✏️ Edit Mode' : 'Tax Invoice Mode'}
          </span>
        </div>

        {/* Customer Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Customer Name *</label>
            <input type="text" required value={manualCustomerName} onChange={e => setManualCustomerName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full bg-white text-slate-800 text-xs font-semibold px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Phone Number (+91) *</label>
            <input type="tel" inputMode="numeric" pattern="[0-9]*" required value={manualPhone}
              onChange={e => setManualPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="e.g. 9876543210"
              className="w-full bg-white text-slate-800 text-xs font-semibold px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Coverage Zone *</label>
            <select value={manualLocation} onChange={e => setManualLocation(e.target.value)}
              className="w-full bg-white text-slate-800 text-xs font-semibold px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-xs">
              {businessConfig.serviceAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Customer Service Address *</label>
            <textarea required rows={2} value={manualAddress} onChange={e => setManualAddress(e.target.value)}
              placeholder="Detailed apartment number, street details..."
              className="w-full bg-white text-slate-800 text-xs font-semibold px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Schedule Slot / Date-Time</label>
            <input type="text" value={manualDateTime} onChange={e => setManualDateTime(e.target.value)}
              placeholder="e.g. Instant / Today (4 PM)"
              className="w-full bg-white text-slate-800 text-xs font-semibold px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs" />
          </div>

          {/* Invoice Status — editable in Edit Mode */}
          {isEditMode && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Invoice Status</label>
              <select value={manualStatus} onChange={e => setManualStatus(e.target.value as 'Pending' | 'Completed' | 'Cancelled')}
                className="w-full bg-white text-slate-800 text-xs font-semibold px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-xs">
                <option value="Completed">✅ Paid / Completed</option>
                <option value="Pending">⏳ Unpaid / Pending</option>
                <option value="Cancelled">❌ Cancelled</option>
              </select>
            </div>
          )}
        </div>

        {/* LINE ITEM BUILDER */}
        <div className="border border-slate-300 rounded-xl p-5 bg-slate-50 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 select-none">
            <div className="flex items-center space-x-2">
              <Keyboard size={16} className="text-blue-600" />
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Quick Keyboard-Friendly Line Item Builder</h4>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-[10px] font-black text-slate-500 whitespace-nowrap">Catalog Prefill:</label>
              <select onChange={handleQuickSelectCatalog}
                className="bg-white text-slate-750 text-[11px] font-extrabold px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 cursor-pointer shadow-xs">
                <option value="">-- Choose Catalog Service --</option>
                {services.map(srv => (
                  <option key={srv.id} value={srv.id}>{srv.name} (₹{srv.price})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-4 space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Item Description / Service Name *</label>
              <input ref={itemNameRef} type="text" value={itemName} onChange={e => setItemName(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="e.g. Split AC Jet Wash"
                className="w-full bg-white text-slate-800 text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm" />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Brand / Make</label>
              <input type="text" value={itemBrand} onChange={e => setItemBrand(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Generic / LG"
                className="w-full bg-white text-slate-800 text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm" />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Rate (Price ₹) *</label>
              <input type="number" inputMode="decimal" value={itemPrice} onChange={e => setItemPrice(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="e.g. 399"
                className="w-full bg-white text-slate-800 text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm" />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Quantity *</label>
              <input type="number" inputMode="numeric" min="1" value={itemQty} onChange={e => setItemQty(e.target.value)} onKeyDown={handleKeyDown}
                className="w-full bg-white text-slate-800 text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm" />
            </div>
            <div className="sm:col-span-1 space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">GST %</label>
              <input type="number" inputMode="numeric" min="0" value={itemGst} onChange={e => setItemGst(e.target.value)} onKeyDown={handleKeyDown}
                className="w-full bg-white text-slate-800 text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm" />
            </div>
            <div className="sm:col-span-1">
              <button type="button" onClick={handleAddInvoiceItem} title="Add Item (Or press Enter)"
                className="w-full bg-blue-600 hover:bg-blue-500 hover:scale-[1.05] active:scale-[0.95] transition-all duration-150 text-white rounded-lg py-2 flex items-center justify-center shadow-md border-b-2 border-blue-800 active:border-b-0 cursor-pointer h-[34px]">
                <Plus size={18} className="stroke-[3]" />
              </button>
            </div>
          </div>
          <p className="text-[9px] text-slate-500 font-bold tracking-wide select-none">💡 Tip: Type details and press Enter inside any input to instantly add the item.</p>
        </div>

        {/* LINE ITEMS TABLE */}
        <div className="border border-slate-300 rounded-xl overflow-x-auto bg-white shadow-md">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="bg-slate-800 border-b border-slate-950 text-[9.5px] font-black text-slate-100 uppercase tracking-wider select-none">
                <th className="px-4 py-3.5 text-center w-10">#</th>
                <th className="px-4 py-3.5">
                  Job / Service Description
                  <span className="ml-2 text-[8px] font-bold text-slate-400 normal-case tracking-normal">✏️ click to edit</span>
                </th>
                <th className="px-4 py-3.5 text-center w-20">Qty ✏️</th>
                <th className="px-4 py-3.5 text-right w-32">Rate (₹) ✏️</th>
                <th className="px-4 py-3.5 text-center w-24">GST % ✏️</th>
                <th className="px-4 py-3.5 text-right w-32">Total (₹)</th>
                <th className="px-4 py-3.5 text-center w-14">Del</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs font-bold text-slate-700">
              {manualItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400 italic font-semibold select-none">
                    No services added yet. Use the Quick Builder above to add items.
                  </td>
                </tr>
              ) : (
                manualItems.map((item, idx) => (
                  <tr key={item.serviceId} className="even:bg-white odd:bg-slate-50/60 hover:bg-blue-50/30 transition-colors border-b border-slate-200 group">

                    {/* S.No */}
                    <td className="px-4 py-2.5 text-center text-slate-400 font-black select-none text-xs">{idx + 1}</td>

                    {/* Service Name + Brand — inline editable */}
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={item.serviceName}
                        onChange={e => {
                          const updated = [...manualItems];
                          updated[idx] = { ...updated[idx], serviceName: e.target.value };
                          setManualItems(updated);
                        }}
                        className="w-full bg-transparent hover:bg-white focus:bg-white text-slate-900 font-extrabold text-xs px-2 py-1 border border-transparent hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 rounded-lg outline-none transition-all"
                        placeholder="Service name"
                      />
                      <input
                        type="text"
                        value={item.brand ?? ''}
                        onChange={e => {
                          const updated = [...manualItems];
                          updated[idx] = { ...updated[idx], brand: e.target.value };
                          setManualItems(updated);
                        }}
                        className="mt-0.5 w-full bg-transparent hover:bg-white focus:bg-white text-blue-600 font-black text-[9px] uppercase tracking-wide px-2 py-0.5 border border-transparent hover:border-slate-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 rounded outline-none transition-all"
                        placeholder="Brand (e.g. Generic)"
                      />
                    </td>

                    {/* Qty — inline editable */}
                    <td className="px-2 py-2 text-center">
                      <input
                        type="number"
                        inputMode="numeric"
                        min="1"
                        value={item.quantity}
                        onChange={e => {
                          const val = Math.max(1, Number(e.target.value) || 1);
                          const updated = [...manualItems];
                          updated[idx] = { ...updated[idx], quantity: val };
                          setManualItems(updated);
                        }}
                        className="w-16 text-center bg-transparent hover:bg-white focus:bg-white text-slate-900 font-black text-xs px-2 py-1 border border-transparent hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 rounded-lg outline-none transition-all"
                      />
                    </td>

                    {/* Rate — inline editable */}
                    <td className="px-2 py-2 text-right">
                      <div className="flex items-center justify-end space-x-0.5">
                        <span className="text-slate-400 text-[10px] font-bold shrink-0">₹</span>
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          value={item.price}
                          onChange={e => {
                            const val = Math.max(0, Number(e.target.value) || 0);
                            const updated = [...manualItems];
                            updated[idx] = { ...updated[idx], price: val };
                            setManualItems(updated);
                          }}
                          className="w-24 text-right bg-transparent hover:bg-white focus:bg-white text-slate-900 font-bold text-xs px-2 py-1 border border-transparent hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 rounded-lg outline-none transition-all"
                        />
                      </div>
                    </td>

                    {/* GST % — inline editable */}
                    <td className="px-2 py-2 text-center">
                      <div className="flex items-center justify-center space-x-0.5">
                        <input
                          type="number"
                          inputMode="numeric"
                          min="0"
                          max="100"
                          value={item.gstRate ?? 0}
                          onChange={e => {
                            const val = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                            const updated = [...manualItems];
                            updated[idx] = { ...updated[idx], gstRate: val };
                            setManualItems(updated);
                          }}
                          className="w-14 text-center bg-transparent hover:bg-white focus:bg-white text-blue-600 font-black text-xs px-1.5 py-1 border border-transparent hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 rounded-lg outline-none transition-all"
                        />
                        <span className="text-blue-400 text-[10px] font-bold">%</span>
                      </div>
                    </td>

                    {/* Total Price — calculated, read-only */}
                    <td className="px-4 py-2.5 text-right font-black text-slate-950 text-xs select-none">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </td>

                    {/* Remove */}
                    <td className="px-4 py-2.5 text-center">
                      <button type="button" onClick={() => handleRemoveManualItem(idx)}
                        className="text-red-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-colors cursor-pointer active:scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>

          {/* Totals */}
          {manualItems.length > 0 && (() => {
            const subtotal = manualItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
            let totalBase = 0, totalGst = 0;
            manualItems.forEach(item => {
              const itemTotal = item.price * item.quantity;
              const rate = item.gstRate ?? 0;
              const base = itemTotal / (1 + rate / 100);
              totalBase += base; totalGst += itemTotal - base;
            });
            const cgst = Math.round(totalGst / 2);
            const sgst = Math.round(totalGst - cgst);
            return (
              <div className="bg-slate-50 border-t border-slate-200 p-5 flex justify-end select-none">
                <div className="w-80 space-y-2 text-xs text-left font-extrabold text-slate-600">
                  <div className="flex justify-between"><span>Total Taxable Base (Excl. GST):</span><span className="text-slate-900 font-black">₹{Math.round(totalBase).toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>CGST (Central Tax):</span><span className="text-slate-900 font-black">₹{cgst.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>SGST (State Tax):</span><span className="text-slate-900 font-black">₹{sgst.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-black text-emerald-700 bg-emerald-50/20 px-2 py-1 rounded">
                    <span>Grand Invoice Total (Incl. GST):</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Terms & Conditions */}
        <div className="space-y-2 border-t border-slate-200 pt-5 text-left">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block select-none">
            Terms & Conditions / Special Warranty Remarks
          </label>
          <textarea rows={3} value={manualTerms} onChange={e => setManualTerms(e.target.value)}
            placeholder="Type custom warranty details, parts exclusions, or general business terms..."
            className="w-full bg-white text-slate-800 text-xs font-semibold px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs" />
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3 pt-5 border-t border-slate-200 select-none">
          <button type="button" onClick={() => navigate('/admin/billbook')}
            className="px-5 py-2.5 border border-slate-300 bg-white hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 text-slate-700 rounded-lg text-xs font-black shadow-sm cursor-pointer border-b-2 border-b-slate-400 active:border-b-0">
            Cancel
          </button>
          <button type="submit" disabled={isSaving}
            className={`px-6 py-2.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 text-white rounded-lg text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg border-b-2 active:border-b-0 cursor-pointer flex items-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed ${
              isEditMode
                ? 'bg-blue-600 hover:bg-blue-500 border-blue-800'
                : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-800'
            }`}>
            {isEditMode
              ? <><Pencil size={13} className="stroke-[3]" /><span>{isSaving ? 'Saving...' : 'Save Changes'}</span></>
              : <><ShoppingCart size={13} className="stroke-[3]" /><span>{isSaving ? 'Saving...' : 'Generate & Download Invoice'}</span></>
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateManualInvoice;
