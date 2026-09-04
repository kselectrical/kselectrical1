import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, ArrowLeft, CheckCircle2, ShieldCheck, Loader, 
  CreditCard, Banknote, User, Phone, MapPin, QrCode, Upload, X, Image as ImageIcon,
  ExternalLink, ZoomIn, Copy, Check, Smartphone, Monitor
} from 'lucide-react';
import { saveOrderToDb, saveCustomerToCloud, getCustomerByPhoneFromDb } from '../../firebase';
import type { Product, ProductOrder, OrderItem } from '../../types';

interface ShopCheckoutPageProps {
  currentUser?: { name?: string; phone?: string; address?: string; email?: string } | null;
  isLoggedIn?: boolean;
}

export const ShopCheckoutPage: React.FC<ShopCheckoutPageProps> = ({ currentUser }) => {
  const navigate = useNavigate();
  const [cartItems] = useState<{ product: Product; qty: number }[]>(() => {
    const saved = sessionStorage.getItem('shop_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Cart parse error:", e);
      }
    }
    return [];
  });

  const [name, setName] = useState(() => currentUser?.name || '');
  const [phone, setPhone] = useState(() => currentUser?.phone || '');
  const [address, setAddress] = useState(() => currentUser?.address || '');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<ProductOrder | null>(null);
  const [error, setError] = useState('');

  // UPI Modal States
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [showZoomQr, setShowZoomQr] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isMobile] = useState(() =>
    typeof navigator !== 'undefined'
      ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      : false
  );

  const handlePhoneInputChange = async (val: string) => {
    const clean = val.replace(/\D/g, '');
    setPhone(clean);
    if (clean.length === 10) {
      const existing = await getCustomerByPhoneFromDb(clean);
      if (existing) {
        if (existing.name && (!name || name.trim() === '')) setName(existing.name);
        if (existing.address && (!address || address.trim() === '')) setAddress(existing.address);
      }
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product.salePrice ?? item.product.price) * item.qty,
    0
  );
  const deliveryCharge = subtotal > 499 ? 0 : 40;
  const totalAmount = subtotal + deliveryCharge;

  // Direct UPI Deep Link for 1-Tap App Launch (Paytm / GPay / PhonePe)
  const upiPayUrl = `upi://pay?pa=Q169538958@ybl&pn=KS%20Shops&am=${totalAmount}&cu=INR&tn=Order%20Payment`;
  const paytmUrl = `paytmmp://pay?pa=Q169538958@ybl&pn=KS%20Shops&am=${totalAmount}&cu=INR`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('Q169538958@ybl');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const compressImageForUpload = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 700;
          const MAX_HEIGHT = 700;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.65);
            resolve(compressedDataUrl);
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('स्क्रीनशॉट 10MB से छोटा होना चाहिए।');
        return;
      }
      try {
        const compressedBase64 = await compressImageForUpload(file);
        setScreenshotPreview(compressedBase64);
      } catch (err) {
        console.error('Image compression error:', err);
        const reader = new FileReader();
        reader.onloadend = () => setScreenshotPreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Please enter your full name.'); return; }
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length !== 10) { setError('Please enter a valid 10-digit mobile number.'); return; }
    if (!address.trim()) { setError('Please enter your delivery address.'); return; }
    if (cartItems.length === 0) { setError('Your cart is empty.'); return; }

    setError('');
    const validPhone = cleanPhone.length >= 10 ? cleanPhone.slice(-10) : cleanPhone;
    localStorage.setItem('ks_last_customer_phone', validPhone);

    if (paymentMethod === 'UPI') {
      setShowUpiModal(true);

      // On mobile devices, automatically trigger Paytm / UPI deep link for direct 1-tap payment!
      if (isMobile) {
        window.location.assign(paytmUrl);
        setTimeout(() => {
          window.location.assign(upiPayUrl);
        }, 800);
      }
    } else {
      await executeSaveOrder('COD', 'Pending');
    }
  };

  const executeSaveOrder = async (
    method: 'COD' | 'UPI',
    payStatus: 'Pending' | 'Paid' | 'Failed',
    utr?: string,
    screenshotUrl?: string
  ) => {
    setLoading(true);
    setError('');

    const rawPhone = phone.trim().replace(/\D/g, '');
    const cleanPhone = rawPhone.length >= 10 ? rawPhone.slice(-10) : rawPhone;

    const orderItems: OrderItem[] = cartItems.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.salePrice ?? item.product.price,
      quantity: item.qty,
      imageUrl: item.product.imageUrl || '/log.webp',
    }));

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    const orderData: ProductOrder = {
      id: orderId,
      customerName: name.trim(),
      phone: cleanPhone,
      address: address.trim(),
      items: orderItems,
      subtotal,
      deliveryCharge,
      totalAmount,
      paymentMethod: method,
      paymentStatus: payStatus,
      upiTransactionId: utr || undefined,
      screenshotUrl: screenshotUrl || undefined,
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
      notes: notes.trim() ? `[${method}] ${notes.trim()}` : `[${method}]`,
    };

    // 1. Save order to Cloud Firestore AND LocalStorage fallback
    const success = await saveOrderToDb(orderData);

    // 2. Save customer record to Cloud Firestore Customers collection
    try {
      await saveCustomerToCloud({
        name: name.trim(),
        phone: cleanPhone,
        photoUrl: '/profile.webp'
      });
    } catch (err) {
      console.warn("Could not sync customer directory from order:", err);
    }

    // 3. Sync customer auth session in localStorage so Customer Dashboard finds this order immediately!
    const sessionStr = localStorage.getItem('ks_auth_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session && session.currentUser) {
          session.currentUser.phone = cleanPhone;
          session.currentUser.name = name.trim();
          session.currentUser.address = address.trim();
          localStorage.setItem('ks_auth_session', JSON.stringify(session));
        }
      } catch (e) {
        console.warn("Session update error:", e);
      }
    } else {
      localStorage.setItem('ks_auth_session', JSON.stringify({
        isLoggedIn: true,
        userRole: 'customer',
        currentUser: {
          name: name.trim(),
          phone: cleanPhone,
          address: address.trim(),
          photoUrl: '/profile.webp'
        }
      }));
    }

    setLoading(false);
    if (success) {
      sessionStorage.removeItem('shop_cart');
      setShowUpiModal(false);
      setPlacedOrder(orderData);
    } else {
      setError('Failed to save order. Please try again.');
    }
  };

  if (placedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md w-full p-6 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">Order Successfully Placed!</h2>
          <p className="text-sm text-gray-500 mb-4">
            Order ID: <span className="font-bold text-blue-600">{placedOrder.id}</span>
          </p>

          <div className="bg-gray-50 rounded-xl p-4 text-left text-xs text-gray-700 space-y-2 mb-6 border border-gray-100">
            <div className="flex justify-between">
              <span className="text-gray-500">Customer:</span>
              <span className="font-bold">{placedOrder.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phone:</span>
              <span className="font-bold">{placedOrder.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Amount:</span>
              <span className="font-black text-blue-700 text-sm">₹{placedOrder.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Mode:</span>
              <span className="font-bold text-emerald-700">
                {placedOrder.paymentMethod === 'UPI' ? 'UPI Scan & Pay' : 'Cash on Delivery'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Status:</span>
              <span className={`font-bold ${placedOrder.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                {placedOrder.paymentStatus === 'Paid' ? '✅ Paid (भुगतान प्राप्त हुआ)' : '⏳ Pay on Delivery'}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <span className="text-gray-500 block mb-1">Items ({placedOrder.items.length}):</span>
              {placedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between font-medium text-[11px]">
                  <span>{it.productName} (x{it.quantity})</span>
                  <span>₹{it.price * it.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate('/customer/dashboard')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md"
            >
              My Orders & Dashboard
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <ShoppingBag size={48} className="text-gray-300 mb-3" />
        <h2 className="text-xl font-bold text-gray-800 mb-1">आपकी Cart खाली है</h2>
        <p className="text-sm text-gray-500 mb-6">कृपया store से products पसंद करके cart में जोड़ें।</p>
        <Link
          to="/shop"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md"
        >
          Browse Shop Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/shop')}
            className="flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Store Cart</span>
          </button>
          <span className="text-sm font-black text-gray-900">Order Checkout</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6">
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Form & Address */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Delivery Details */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
                <User size={18} className="text-blue-600" />
                <span>Delivery & Customer Details</span>
              </h2>

              {error && (
                <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl mb-4 border border-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">पूरा नाम (Full Name) *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="उदा. राहुल शर्मा"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium"
                    />
                    <User size={16} className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">मोबाइल नंबर (Phone Number) *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="उदा. 9876543210"
                      value={phone}
                      onChange={e => handlePhoneInputChange(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium"
                    />
                    <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">डिलीवरी का पता (Complete Address) *</label>
                  <div className="relative">
                    <textarea
                      required
                      rows={3}
                      placeholder="घर का नंबर, स्ट्रीट, लैंडमार्क और एरिया का नाम लिखें..."
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium"
                    />
                    <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">कोई स्पेशल नोट / निर्देश (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Please deliver after 5:00 PM"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-base font-black text-gray-900 mb-3 flex items-center gap-2">
                <CreditCard size={18} className="text-blue-600" />
                <span>Payment Mode</span>
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'COD'
                      ? 'border-blue-600 bg-blue-50/60 text-blue-700 shadow-sm ring-2 ring-blue-500/20'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <Banknote size={24} />
                  <span className="text-xs font-black">Cash on Delivery</span>
                  <span className="text-[10px] text-gray-500">सामान मिलने पर नकद दें</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'UPI'
                      ? 'border-blue-600 bg-blue-50/60 text-blue-700 shadow-sm ring-2 ring-blue-500/20'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <QrCode size={24} />
                  <span className="text-xs font-black">UPI / Scan & Pay</span>
                  <span className="text-[10px] text-gray-500">Paytm / GPay से ऑनलाइन दें</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-base font-black text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Order Summary ({cartItems.length} items)
              </h2>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 mb-4 divide-y divide-gray-100">
                {cartItems.map((item, i) => (
                  <div key={i} className="pt-2 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <img 
                        src={item.product.imageUrl || '/log.webp'} 
                        alt={item.product.name}
                        className="w-10 h-10 object-contain rounded-md bg-gray-50 border border-gray-100 p-1" 
                      />
                      <div>
                        <p className="font-bold text-gray-900 line-clamp-1">{item.product.name}</p>
                        <p className="text-[10px] text-gray-500">Qty: {item.qty} × ₹{item.product.salePrice ?? item.product.price}</p>
                      </div>
                    </div>
                    <span className="font-black text-gray-900">
                      ₹{(item.product.salePrice ?? item.product.price) * item.qty}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-3 border-t border-gray-200 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-bold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges:</span>
                  {deliveryCharge === 0 ? (
                    <span className="font-bold text-emerald-600">FREE</span>
                  ) : (
                    <span className="font-bold text-gray-900">₹{deliveryCharge}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total Amount:</span>
                  <span className="text-blue-700 text-base">₹{totalAmount}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>{paymentMethod === 'UPI' ? (isMobile ? `Pay via Paytm / UPI (₹${totalAmount})` : `Scan & Pay (₹${totalAmount})`) : `Confirm Order (₹${totalAmount})`}</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck size={16} className="text-blue-600" />
                <span>100% Genuine Guaranteed</span>
              </div>
              <p className="text-[11px] text-blue-700">
                ऑर्डर कंफर्मेशन SMS और कॉल हमारे एग्जीक्यूटिव द्वारा दिया जाएगा।
              </p>
            </div>
          </div>

        </form>
      </div>

      {/* Interactive High-Res UPI Payment Modal Popup */}
      {showUpiModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200 relative animate-scale-up my-6 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setShowUpiModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                {isMobile ? <Smartphone size={26} /> : <Monitor size={26} />}
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {isMobile ? 'Paytm / UPI Direct Mobile Payment' : 'Scan & Pay via HD QR Code'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">KS Electrical & AC Services</p>
            </div>

            {/* Amount Badge */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-center flex items-center justify-between px-6">
              <span className="text-xs text-blue-700 font-bold uppercase">कुल देय राशि</span>
              <span className="text-2xl font-black text-blue-800">₹{totalAmount}</span>
            </div>

            {/* MOBILE VIEW: Direct 1-Tap App Launch Buttons */}
            {isMobile ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-center">
                <span className="text-xs font-black text-slate-800 block">📲 1-Tap Instant Payment via Paytm or any UPI App:</span>
                
                <a
                  href={paytmUrl}
                  onClick={() => {
                    setTimeout(() => { window.location.href = upiPayUrl; }, 600);
                  }}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all text-center uppercase tracking-wide cursor-pointer"
                >
                  <ExternalLink size={18} />
                  <span>Pay instantly via Paytm (₹{totalAmount})</span>
                </a>

                <a
                  href={upiPayUrl}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all text-center cursor-pointer"
                >
                  <ExternalLink size={16} />
                  <span>Pay via GPay / PhonePe / BHIM</span>
                </a>
              </div>
            ) : (
              /* DESKTOP VIEW: Large Crisp High-Contrast HD QR Code */
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center space-y-3 relative">
                <span className="text-xs font-black text-slate-800">📷 Scan QR code using Mobile Camera or Paytm App:</span>
                
                {/* Super-Large HD QR Image Box (w-72 h-72 sm:w-80 sm:h-80) */}
                <div className="relative group bg-white p-4 rounded-2xl border-4 border-blue-600 shadow-xl">
                  <img 
                    src="/upi_qr.jpeg?v=ks2026" 
                    alt="Scan High-Res UPI QR Code" 
                    onError={(e) => { (e.target as HTMLImageElement).src = '/upi_qr_poster.jpeg?v=ks2026'; }}
                    className="w-72 h-72 sm:w-80 sm:h-80 object-contain rounded-xl bg-white" 
                  />
                  
                  {/* Click to Zoom Overlay Button */}
                  <button
                    type="button"
                    onClick={() => setShowZoomQr(true)}
                    className="absolute bottom-6 right-6 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                  >
                    <ZoomIn size={16} />
                    <span>फुलस्क्रीन में देखें (Zoom)</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs font-bold text-slate-700 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 font-mono shadow-2xs">
                    UPI ID: <strong className="text-blue-700 select-all">Q169538958@ybl</strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                  >
                    {copiedUpi ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                    <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Payment Proof Section */}
            <div className="space-y-3 pt-1 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                  <Upload size={14} className="text-blue-600" />
                  <span>1. Upload Payment Receipt / Screenshot *</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-600 border border-slate-300 rounded-xl p-2 bg-slate-50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
                {screenshotPreview && (
                  <div className="mt-2 text-center bg-emerald-50/70 p-2 rounded-xl border border-emerald-200">
                    <img 
                      src={screenshotPreview} 
                      alt="Payment Proof Preview" 
                      className="w-36 h-36 object-contain mx-auto rounded-lg border border-slate-300 shadow-xs bg-white" 
                    />
                    <span className="text-[11px] text-emerald-700 font-black mt-1 block">✅ स्क्रीनशॉट लोड हो गया है</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                  <ImageIcon size={14} className="text-blue-600" />
                  <span>2. UTR / Transaction Reference ID (12 अंकों का नंबर)</span>
                </label>
                <input
                  type="text"
                  placeholder="उदा. 402398402934"
                  value={utrNumber}
                  onChange={e => setUtrNumber(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Confirm & Cancel Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => executeSaveOrder('UPI', 'Paid', utrNumber, screenshotPreview)}
                disabled={loading || (!screenshotPreview && !utrNumber.trim())}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    <span>Order Confirming...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Confirm & Complete Order (₹{totalAmount})</span>
                  </>
                )}
              </button>

              {(!screenshotPreview && !utrNumber.trim()) && (
                <p className="text-[11px] text-amber-800 font-bold text-center bg-amber-50 p-2 rounded-xl border border-amber-200">
                  ⚠️ Please upload payment screenshot or enter 12-digit UTR transaction reference after completing payment.
                </p>
              )}

              <button
                type="button"
                onClick={() => setShowUpiModal(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                वापस जाएं (Cancel)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Fullscreen Zoomed HD QR Code Modal */}
      {showZoomQr && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setShowZoomQr(false)}
        >
          <div className="bg-white p-6 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowZoomQr(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100"
            >
              <X size={22} />
            </button>

            <h4 className="text-lg font-black text-slate-900">HD Fullscreen QR Code</h4>
            <p className="text-xs text-slate-500 font-bold">KS Electrical & AC Services (₹{totalAmount})</p>

            <div className="bg-white p-4 rounded-2xl border-4 border-blue-600 shadow-2xl inline-block">
              <img 
                src="/upi_qr.jpeg?v=ks2026" 
                alt="Zoomed Scan QR Code" 
                onError={(e) => { (e.target as HTMLImageElement).src = '/upi_qr_poster.jpeg?v=ks2026'; }}
                className="w-72 h-72 sm:w-96 sm:h-96 object-contain mx-auto rounded-xl bg-white" 
              />
            </div>

            <p className="text-xs font-mono font-bold text-blue-700">UPI ID: Q169538958@ybl</p>

            <button
              type="button"
              onClick={() => setShowZoomQr(false)}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ShopCheckoutPage;
