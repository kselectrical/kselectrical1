import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, ArrowLeft, ShieldCheck, Truck, CheckCircle2, 
  XCircle, ShoppingCart, Plus, Minus, Loader 
} from 'lucide-react';
import { getProductById } from '../../firebase';
import type { Product } from '../../types';

interface ProductDetailProps {
  isLoggedIn?: boolean;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ isLoggedIn }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      let isMounted = true;
      getProductById(id).then(p => {
        if (isMounted) {
          setProduct(p);
          setLoading(false);
        }
      });
      return () => { isMounted = false; };
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-20 text-gray-400">
        <Loader size={36} className="animate-spin text-blue-600 mb-3" />
        <p className="text-sm font-medium">Product विवरण लोड हो रहा है...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-20 text-center px-4">
        <XCircle size={48} className="text-red-400 mb-3" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Product नहीं मिला</h2>
        <p className="text-sm text-gray-500 mb-6">यह product उपलब्ध नहीं है या हटा दिया गया है।</p>
        <Link 
          to="/shop" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md"
        >
          Store पर वापस जाएं
        </Link>
      </div>
    );
  }

  const discountPercent = product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const currentPrice = product.salePrice ?? product.price;

  const handleAddToCart = () => {
    const existing = sessionStorage.getItem('shop_cart');
    let cartArr: { product: Product; qty: number }[] = [];
    if (existing) {
      try { cartArr = JSON.parse(existing); } catch (e) { console.error(e); }
    }
    const idx = cartArr.findIndex(item => item.product.id === product.id);
    if (idx >= 0) {
      cartArr[idx].qty += quantity;
    } else {
      cartArr.push({ product, qty: quantity });
    }
    sessionStorage.setItem('shop_cart', JSON.stringify(cartArr));
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    if (!isLoggedIn) {
      navigate('/customer/login');
    } else {
      navigate('/shop/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => navigate('/shop')} 
            className="flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Store</span>
          </button>
          <span className="text-xs font-bold text-gray-400 tracking-wide uppercase">{product.category}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-6 md:p-8">
          
          {/* Left: Product Image & Gallery */}
          <div className="flex flex-col items-center justify-between bg-gray-50 rounded-2xl p-6 relative group border border-gray-100">
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 z-10 bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                {discountPercent}% OFF
              </span>
            )}
            
            {(() => {
              const allImgs = product.images && product.images.length > 0
                ? product.images.filter(img => img && img.trim() !== '')
                : [product.imageUrl || '/log.webp'];
              
              const activeImg = allImgs[selectedImageIndex] || allImgs[0] || product.imageUrl || '/log.webp';

              return (
                <div className="w-full flex flex-col items-center justify-between space-y-4">
                  <div className="w-full flex items-center justify-center min-h-[260px] max-h-80">
                    <img 
                      src={activeImg} 
                      alt={product.name}
                      className="max-h-72 object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {allImgs.length > 1 && (
                    <div className="flex items-center justify-center gap-2.5 pt-2 border-t border-gray-200/60 w-full">
                      {allImgs.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`w-14 h-14 rounded-xl border-2 overflow-hidden transition-all bg-white cursor-pointer p-0.5 ${
                            selectedImageIndex === idx
                              ? 'border-blue-600 ring-2 ring-blue-400/30 scale-105 shadow-sm'
                              : 'border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-400'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-contain rounded-lg" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Right: Details & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-2">
                <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-bold">{product.category}</span>
                {product.sku && <span>SKU: {product.sku}</span>}
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-2">
                {product.name}
              </h1>

              {product.brand && (
                <p className="text-sm font-bold text-gray-500 mb-3">
                  Brand: <span className="text-gray-800">{product.brand}</span>
                </p>
              )}

              <div className="flex items-baseline gap-3 my-4">
                <span className="text-3xl font-black text-blue-700">₹{currentPrice}</span>
                {product.salePrice && (
                  <span className="text-lg text-gray-400 line-through font-medium">₹{product.price}</span>
                )}
                <span className="text-xs text-gray-500 font-semibold">(Taxes Included)</span>
              </div>

              <div className="mb-5">
                {product.inStock ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
                    <CheckCircle2 size={14} /> Stock Available
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 border border-red-200 text-xs font-bold px-3 py-1 rounded-full">
                    <XCircle size={14} /> Out of Stock
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {product.description || 'KS Electrical का 100% genuine guaranteed product। Fast delivery और best installation support के साथ।'}
              </p>

              {product.specifications && product.specifications.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Specifications</h3>
                  <div className="bg-gray-50 rounded-xl p-3 divide-y divide-gray-200 text-xs">
                    {product.specifications.map((spec, i) => (
                      <div key={i} className="py-1.5 flex justify-between">
                        <span className="text-gray-500 font-medium">{spec.label}</span>
                        <span className="text-gray-900 font-bold">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-bold text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-2 hover:bg-gray-200 transition-colors text-gray-700 disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 text-sm font-black text-gray-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-2 hover:bg-gray-200 transition-colors text-gray-700"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold border transition-all ${
                    added
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-blue-700 border-blue-600 hover:bg-blue-50 shadow-sm'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <ShoppingCart size={18} />
                  <span>{added ? 'Cart में जोड़ा गया ✓' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={18} />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black text-gray-900">100% Genuine Parts</h4>
              <p className="text-[11px] text-gray-500">Directly sourced from trusted brands</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-600">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black text-gray-900">Fast Door Delivery</h4>
              <p className="text-[11px] text-gray-500">Same day or next day delivery</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black text-gray-900">Expert Fitting Available</h4>
              <p className="text-[11px] text-gray-500">Get fitted by KS technicians</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
