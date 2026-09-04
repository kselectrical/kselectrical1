import React, { useState, useEffect } from 'react';
import { 
  Plus, Pencil, Trash2, Package, ToggleLeft, ToggleRight, Loader, 
  Save, X, Image as ImageIcon, AlertCircle, ShoppingBag, Filter, Upload, ZoomIn 
} from 'lucide-react';
import { 
  getProductsFromDb, saveProductToDb, deleteProductFromDb, 
  getAllOrdersFromDb, updateOrderStatusInDb 
} from '../../firebase';
import type { Product, ProductCategory, ProductOrder } from '../../types';

const CATEGORIES: ProductCategory[] = ['Electrical', 'Lighting', 'AC Parts', 'RO Parts', 'Wiring & Cable', 'Other'];

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  category: ProductCategory;
  imageUrl: string;
  images: string[];
  inStock: boolean;
  brand: string;
  sku: string;
}

const EMPTY_PRODUCT: ProductFormData = {
  name: '',
  description: '',
  price: 0,
  salePrice: undefined,
  category: 'Electrical',
  imageUrl: '',
  images: ['', '', ''],
  inStock: true,
  brand: '',
  sku: '',
};

export const AdminProducts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<ProductOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormData>(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [viewingScreenshot, setViewingScreenshot] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

  const loadProducts = async () => {
    const data = await getProductsFromDb();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    getProductsFromDb().then(data => {
      if (isMounted) {
        setProducts(data);
        setLoading(false);
      }
    });
    getAllOrdersFromDb().then(data => {
      if (isMounted) {
        setOrders(data);
        setLoadingOrders(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const openAdd = () => {
    setEditingProduct(null);
    setForm(EMPTY_PRODUCT);
    setError('');
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    const existingImgs = p.images && p.images.length > 0 ? p.images : [p.imageUrl];
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      salePrice: p.salePrice,
      category: p.category,
      imageUrl: p.imageUrl,
      images: [
        existingImgs[0] || '',
        existingImgs[1] || '',
        existingImgs[2] || '',
      ],
      inStock: p.inStock,
      brand: p.brand || '',
      sku: p.sku || '',
    });
    setError('');
    setShowForm(true);
  };

  const handleProductImageUpload = async (index: number, file?: File) => {
    if (!file) return;
    try {
      const compressedBase64 = await compressImageForUpload(file);
      setForm(prev => {
        const newImgs = [...prev.images];
        newImgs[index] = compressedBase64;
        return {
          ...prev,
          images: newImgs,
          imageUrl: index === 0 ? compressedBase64 : (prev.imageUrl || compressedBase64)
        };
      });
    } catch (err) {
      console.error("Product image upload compression failed:", err);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Product का नाम जरूरी है।'); return; }
    if (!form.price || form.price <= 0) { setError('सही price डालें।'); return; }

    setSaving(true);
    setError('');

    const cleanImages = form.images.map(img => img ? img.trim() : '').filter(img => img !== '');
    const mainImageUrl = cleanImages[0] || form.imageUrl.trim() || '';

    const now = new Date().toISOString();
    const product: Product = {
      id: editingProduct?.id || `PROD-${Date.now()}`,
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : undefined,
      category: form.category,
      imageUrl: mainImageUrl,
      images: cleanImages.length > 0 ? cleanImages : (mainImageUrl ? [mainImageUrl] : []),
      inStock: form.inStock,
      brand: form.brand?.trim() || undefined,
      sku: form.sku?.trim() || undefined,
      createdAt: editingProduct?.createdAt || now,
      updatedAt: now,
    };

    const ok = await saveProductToDb(product);
    if (ok) {
      await loadProducts();
      setShowForm(false);
    } else {
      setError('Failed to save. Please try again.');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteProductFromDb(id);
    if (ok) {
      setProducts(prev => prev.filter(p => p.id !== id));
      setDeleteConfirm(null);
    }
  };

  const handleToggleStock = async (product: Product) => {
    const updated: Product = { ...product, inStock: !product.inStock, updatedAt: new Date().toISOString() };
    await saveProductToDb(updated);
    setProducts(prev => prev.map(p => p.id === product.id ? updated : p));
  };

  const handleUpdateOrderStatus = async (orderId: string, status: ProductOrder['status']) => {
    const ok = await updateOrderStatusInDb(orderId, status);
    if (ok) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o));
    }
  };

  const handleUpdateOrderPaymentStatus = async (orderId: string, paymentStatus: ProductOrder['paymentStatus']) => {
    const target = orders.find(o => o.id === orderId);
    if (target) {
      const ok = await updateOrderStatusInDb(orderId, target.status, paymentStatus);
      if (ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus, updatedAt: new Date().toISOString() } : o));
      }
    }
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

  const handleAdminUploadScreenshot = async (orderId: string, file?: File) => {
    if (!file) return;
    try {
      const compressed = await compressImageForUpload(file);
      const target = orders.find(o => o.id === orderId);
      if (target) {
        const ok = await updateOrderStatusInDb(orderId, target.status, target.paymentStatus, compressed);
        if (ok) {
          setOrders(prev => prev.map(o => o.id === orderId ? { ...o, screenshotUrl: compressed } : o));
        }
      }
    } catch (e) {
      console.error('Admin screenshot upload error:', e);
    }
  };

  const filteredOrders = orders.filter(o => orderStatusFilter === 'All' || o.status === orderStatusFilter);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Package size={22} className="text-blue-600" />
            Product Marketplace Admin
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage shop inventory, prices, & customer product orders</p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package size={14} />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShoppingBag size={14} />
            <span>Customer Orders ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-gray-700">Inventory Catalog</h2>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-sm"
            >
              <Plus size={14} />
              Add Product
            </button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20 text-gray-400 text-xs font-bold">
              <Loader size={24} className="animate-spin mr-2 text-blue-600" />
              Loading products...
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
              <Package size={48} className="mx-auto mb-3 text-gray-200" />
              <h3 className="font-bold text-gray-500 mb-1 text-sm">No products added yet</h3>
              <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold mt-2">
                + Add First Product
              </button>
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-extrabold text-gray-600 uppercase">Product</th>
                      <th className="text-left px-4 py-3 font-extrabold text-gray-600 uppercase">Category</th>
                      <th className="text-left px-4 py-3 font-extrabold text-gray-600 uppercase">Price</th>
                      <th className="text-center px-4 py-3 font-extrabold text-gray-600 uppercase">Stock</th>
                      <th className="text-right px-4 py-3 font-extrabold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img 
                              src={product.imageUrl || '/log.webp'} 
                              alt={product.name} 
                              className="w-10 h-10 rounded-lg object-contain border border-gray-100 bg-gray-50 p-1" 
                            />
                            <div>
                              <p className="font-bold text-gray-900">{product.name}</p>
                              {product.brand && <p className="text-[10px] text-gray-500">Brand: {product.brand}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-md text-[10px]">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-black text-gray-900">₹{product.price}</p>
                            {product.salePrice && (
                              <p className="text-[10px] text-emerald-600 font-bold">Sale: ₹{product.salePrice}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleToggleStock(product)}
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${
                              product.inStock
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {product.inStock ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEdit(product)}
                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(product.id)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CUSTOMER ORDERS TAB */}
      {activeTab === 'orders' && (
        <div>
          {/* Status Filter */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-700">All Product Orders</h2>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              <select
                value={orderStatusFilter}
                onChange={e => setOrderStatusFilter(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-700 outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {loadingOrders && (
            <div className="flex items-center justify-center py-20 text-gray-400 text-xs font-bold">
              <Loader size={24} className="animate-spin mr-2 text-blue-600" />
              Loading customer orders...
            </div>
          )}

          {!loadingOrders && filteredOrders.length === 0 && (
            <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-200">
              <ShoppingBag size={48} className="mx-auto mb-3 text-gray-200" />
              <h3 className="font-bold text-gray-500 mb-1 text-sm">No orders found</h3>
              <p className="text-xs text-gray-400">There are no product orders matching the current filter.</p>
            </div>
          )}

          {!loadingOrders && filteredOrders.length > 0 && (
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
                    <div>
                      <span className="text-xs font-black text-blue-700 uppercase tracking-wider">#{order.id}</span>
                      <span className="text-xs font-bold text-gray-900 ml-3">{order.customerName}</span>
                      <span className="text-xs text-gray-500 ml-2">({order.phone})</span>
                    </div>

                    {/* Order Status Select */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-medium">Status:</span>
                      <select
                        value={order.status}
                        onChange={e => handleUpdateOrderStatus(order.id, e.target.value as ProductOrder['status'])}
                        className={`text-xs font-black px-3 py-1 rounded-xl border outline-none ${
                          order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          order.status === 'Confirmed' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                          order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2 text-xs">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-gray-800">
                        <div className="flex items-center gap-2">
                          <img src={it.imageUrl || '/log.webp'} alt={it.productName} className="w-8 h-8 object-contain rounded bg-gray-50 border p-1" />
                          <div>
                            <p className="font-bold">{it.productName}</p>
                            <p className="text-[10px] text-gray-400">Qty: {it.quantity} × ₹{it.price}</p>
                          </div>
                        </div>
                        <span className="font-black">₹{it.price * it.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer details */}
                  <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-600 gap-2">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase">Address</span>
                      <span className="font-medium text-gray-900">{order.address}</span>
                      {order.notes && <span className="text-[10px] text-blue-600 block mt-0.5">{order.notes}</span>}
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 font-bold block uppercase">Total Amount</span>
                      <span className="text-base font-black text-blue-700">₹{order.totalAmount}</span>
                    </div>
                  </div>

                  {/* Payment Proof & Screenshot in Admin Panel */}
                  <div className="mt-3 pt-3 border-t border-gray-100 bg-gray-50/80 rounded-xl p-3 space-y-2">
                    <div className="flex flex-wrap items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-600">Payment Mode:</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          order.paymentMethod === 'UPI' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {order.paymentMethod === 'UPI' ? '💳 UPI / Scan & Pay' : '💵 Cash on Delivery'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-600">Payment Status:</span>
                        <select
                          value={order.paymentStatus || 'Pending'}
                          onChange={e => handleUpdateOrderPaymentStatus(order.id, e.target.value as ProductOrder['paymentStatus'])}
                          className={`text-[10px] font-black px-2.5 py-1 rounded-lg border outline-none cursor-pointer ${
                            order.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="Paid">✅ Paid (भुगतान प्राप्त हुआ)</option>
                          <option value="Pending">⏳ Pending (भुगतान बकाया)</option>
                          <option value="Failed">❌ Failed</option>
                        </select>
                      </div>
                    </div>

                    {order.upiTransactionId && (
                      <div className="text-xs font-mono text-gray-700">
                        <span className="font-bold text-gray-500">UTR / Ref ID: </span>
                        <span className="font-black text-blue-700 bg-white px-2 py-0.5 rounded border border-gray-200">{order.upiTransactionId}</span>
                      </div>
                    )}

                    {order.screenshotUrl ? (
                      <div className="pt-1 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setViewingScreenshot(order.screenshotUrl || null)}
                          className="flex items-center gap-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 p-1.5 rounded-xl transition-all cursor-pointer group shadow-2xs"
                        >
                          <img 
                            src={order.screenshotUrl} 
                            alt="Payment Proof" 
                            className="w-11 h-11 object-cover rounded-lg border border-blue-300 group-hover:scale-105 transition-transform bg-white" 
                          />
                          <div className="text-left pr-2">
                            <span className="text-[11px] font-black text-blue-900 block leading-tight">
                              📸 पेमेंट स्क्रीनशॉट प्रमाण
                            </span>
                            <span className="text-[9px] text-blue-600 font-bold block mt-0.5">🔍 क्लिक करके फुलस्क्रीन में देखें</span>
                          </div>
                        </button>

                        <div>
                          <label className="text-[10px] font-bold text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-xl cursor-pointer transition-all inline-flex items-center gap-1 shadow-2xs">
                            <Upload size={12} />
                            <span>बदलें (Change)</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={e => handleAdminUploadScreenshot(order.id, e.target.files?.[0])} 
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-1 space-y-1.5">
                        <p className="text-[10px] text-amber-700 font-bold bg-amber-50 p-2 rounded-lg border border-amber-200">
                          ℹ️ ग्राहक ने इस ऑर्डर के साथ अभी कोई स्क्रीनशॉट इमेज अटैच नहीं की है।
                        </p>
                        <label className="text-[10px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-lg cursor-pointer transition-all inline-flex items-center gap-1 shadow-2xs">
                          <Upload size={12} />
                          <span>+ Upload Payment Screenshot / Receipt (Attach Proof)</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={e => handleAdminUploadScreenshot(order.id, e.target.files?.[0])} 
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-black text-gray-900 text-sm">
                {editingProduct ? '✏️ Edit Product' : '+ Add New Product'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-600 mb-1 uppercase">Product Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Anchor 6A Switch White"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1 uppercase">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Product specification & details..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1 uppercase">Category *</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value as ProductCategory }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-blue-500 font-bold"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-600 mb-1 uppercase">MRP Price (₹) *</label>
                  <input
                    type="number"
                    value={form.price || ''}
                    onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                    placeholder="0"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 mb-1 uppercase">Sale Price (₹)</label>
                  <input
                    type="number"
                    value={form.salePrice || ''}
                    onChange={e => setForm(f => ({ ...f, salePrice: e.target.value ? Number(e.target.value) : undefined }))}
                    placeholder="Optional"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-600 mb-1 uppercase">Brand</label>
                  <input
                    type="text"
                    value={form.brand || ''}
                    onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                    placeholder="Anchor, Havells..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 mb-1 uppercase">SKU Code</label>
                  <input
                    type="text"
                    value={form.sku || ''}
                    onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
                    placeholder="Optional"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5 uppercase flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ImageIcon size={13} className="text-blue-600" /> 
                    Product Images (Add at least 3 images)
                  </span>
                  <span className="text-[10px] text-gray-400 font-normal">Upload photo or paste image URL</span>
                </label>
                
                <div className="space-y-3">
                  {[0, 1, 2].map(idx => (
                    <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-gray-800">
                          {idx === 0 ? '📸 इमेज़ 1 (Main Cover Photo) *' : `📸 इमेज़ ${idx + 1} (Detail / Side Photo)`}
                        </span>
                        {form.images[idx] && (
                          <button
                            type="button"
                            onClick={() => {
                              setForm(f => {
                                const newImgs = [...f.images];
                                newImgs[idx] = '';
                                return { 
                                  ...f, 
                                  images: newImgs,
                                  imageUrl: idx === 0 ? (newImgs[1] || newImgs[2] || '') : f.imageUrl
                                };
                              });
                            }}
                            className="text-[10px] text-red-500 hover:text-red-700 font-bold cursor-pointer"
                          >
                            हटाएं (Remove)
                          </button>
                        )}
                      </div>

                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={form.images[idx] || ''}
                          onChange={e => {
                            const val = e.target.value;
                            setForm(f => {
                              const newImgs = [...f.images];
                              newImgs[idx] = val;
                              return { 
                                ...f, 
                                images: newImgs,
                                imageUrl: idx === 0 ? val : (f.imageUrl || val)
                              };
                            });
                          }}
                          placeholder={idx === 0 ? "https://... or upload image file" : `Image ${idx + 1} URL or upload`}
                          className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-blue-500 text-xs"
                        />

                        <label className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all shrink-0 flex items-center gap-1 shadow-2xs">
                          <Upload size={12} />
                          <span>अपलोड</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={e => handleProductImageUpload(idx, e.target.files?.[0])} 
                          />
                        </label>
                      </div>

                      {form.images[idx] && (
                        <div className="flex items-center gap-2 pt-1">
                          <img 
                            src={form.images[idx]} 
                            alt={`Preview ${idx+1}`} 
                            className="w-12 h-12 object-contain bg-white rounded-md border border-gray-200 p-0.5" 
                          />
                          <span className="text-[10px] text-emerald-600 font-bold">✓ इमेज लोड हो गई</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <div>
                  <p className="font-bold text-gray-800">Stock Available?</p>
                  <p className="text-[10px] text-gray-400">Controls visibility in shop</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, inStock: !f.inStock }))}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                    form.inStock ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {form.inStock ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  {form.inStock ? 'In Stock' : 'Out of Stock'}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-red-600">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}
            </div>

            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 rounded-xl font-bold text-xs transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {saving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
                {saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Save Product')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3 text-red-500">
              <Trash2 size={22} />
            </div>
            <h3 className="font-black text-gray-900 mb-1 text-sm">Delete Product?</h3>
            <p className="text-xs text-gray-500 mb-4">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-200 py-2 rounded-xl text-xs font-bold text-gray-600">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl text-xs font-bold">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Payment Screenshot Lightbox Modal */}
      {viewingScreenshot && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 cursor-pointer animate-fade-in"
          onClick={() => setViewingScreenshot(null)}
        >
          <div 
            className="bg-white rounded-3xl p-5 max-w-lg w-full text-center space-y-4 shadow-2xl relative animate-scale-up" 
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setViewingScreenshot(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 justify-center text-blue-700 font-black text-sm pt-1">
              <span>📸 कस्टमर पेमेंट स्क्रीनशॉट प्रमाण (Customer Payment Proof)</span>
            </div>

            <div className="bg-gray-50 p-2 rounded-2xl border border-gray-200 max-h-[70vh] overflow-auto flex items-center justify-center">
              <img 
                src={viewingScreenshot} 
                alt="Payment Proof Fullscreen" 
                className="max-w-full max-h-[65vh] object-contain rounded-xl shadow-md bg-white" 
              />
            </div>

            <div className="flex items-center justify-center gap-3 pt-1">
              <a
                href={viewingScreenshot}
                download="payment_screenshot.jpg"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <ZoomIn size={14} />
                <span>Open Original Size / Download</span>
              </a>

              <button
                type="button"
                onClick={() => setViewingScreenshot(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;
