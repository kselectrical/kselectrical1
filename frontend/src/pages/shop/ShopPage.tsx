import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Filter, Tag, Package, Star, ChevronRight, ShoppingCart, Loader } from 'lucide-react';
import { getProductsFromDb } from '../../firebase';
import type { Product, ProductCategory } from '../../types';

interface ShopPageProps {
  isLoggedIn: boolean;
}

const CATEGORIES: { value: ProductCategory | 'All'; label: string; emoji: string }[] = [
  { value: 'All',           label: 'सभी Products',   emoji: '🛒' },
  { value: 'Electrical',    label: 'Electrical',     emoji: '⚡' },
  { value: 'Lighting',      label: 'Lighting',       emoji: '💡' },
  { value: 'AC Parts',      label: 'AC Parts',       emoji: '❄️' },
  { value: 'RO Parts',      label: 'RO Parts',       emoji: '💧' },
  { value: 'Wiring & Cable',label: 'Wiring & Cable', emoji: '🔌' },
  { value: 'Other',         label: 'Other',          emoji: '📦' },
];

export const ShopPage: React.FC<ShopPageProps> = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'All'>('All');
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);

  useEffect(() => {
    getProductsFromDb().then(p => {
      setProducts(p.filter(x => x.inStock));
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    return products
      .filter(p => activeCategory === 'All' || p.category === activeCategory)
      .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
  }, [products, activeCategory, search]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(c => c.product.id === product.id);
      if (exists) return prev.map(c => c.product.id === product.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { product, qty: 1 }];
    });
  };

  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);
  const cartTotal = cart.reduce((sum, c) => sum + (c.product.salePrice ?? c.product.price) * c.qty, 0);

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate('/customer/login');
      return;
    }
    // Pass cart via sessionStorage for checkout page
    sessionStorage.setItem('shop_cart', JSON.stringify(cart));
    navigate('/shop/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag size={28} className="text-blue-200" />
            <h1 className="text-2xl md:text-3xl font-black">KS Electrical Store</h1>
          </div>
          <p className="text-blue-200 text-sm md:text-base">
            Genuine electrical parts, AC components & more — Direct delivery to your door
          </p>
          {/* Search */}
          <div className="mt-5 max-w-xl">
            <div className="flex bg-white/15 backdrop-blur border border-white/20 rounded-xl overflow-hidden focus-within:border-white/40 transition-all">
              <div className="flex items-center px-3 text-white/60">
                <Search size={17} />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-white/50 py-3 pr-3 focus:outline-none text-sm font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                activeCategory === cat.value
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader size={32} className="animate-spin mb-3 text-blue-400" />
            <p className="text-sm">Products load हो रहे हैं...</p>
          </div>
        )}

        {/* No Products */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Package size={48} className="mb-3 text-gray-300" />
            <h3 className="text-[17px] font-bold text-gray-600 mb-1">
              {products.length === 0 ? 'Coming Soon!' : 'No Products Found'}
            </h3>
            <p className="text-sm text-center max-w-xs">
              {products.length === 0
                ? 'We are adding new products to our catalog. Check back soon.'
                : 'Try selecting another category or update your search terms.'}
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && filtered.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
                <Filter size={14} />
                {filtered.length} products
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {filtered.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => addToCart(product)}
                  onView={() => navigate(`/shop/product/${product.id}`)}
                  cartQty={cart.find(c => c.product.id === product.id)?.qty || 0}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Floating Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={handleCheckout}
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-2xl shadow-2xl shadow-blue-500/40 font-bold text-sm transition-all active:scale-95"
          >
            <div className="relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-black">
                {cartCount}
              </span>
            </div>
            <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            <span className="text-blue-200">·</span>
            <span>Checkout</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Product Card Component ───────────────────────────────────
const ProductCard: React.FC<{
  product: Product;
  onAddToCart: () => void;
  onView: () => void;
  cartQty: number;
}> = ({ product, onAddToCart, onView, cartQty }) => {
  const displayPrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.salePrice! / product.price) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden cursor-pointer" onClick={onView}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
        )}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-black px-1.5 py-0.5 rounded-md">
            -{discountPct}%
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-xs font-bold bg-black/60 px-2 py-1 rounded">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wide mb-0.5 flex items-center gap-1">
          <Tag size={9} /> {product.category}
        </p>
        <h3
          className="text-xs font-bold text-gray-800 leading-tight mb-1 line-clamp-2 cursor-pointer hover:text-blue-600"
          onClick={onView}
        >
          {product.name}
        </h3>
        {product.brand && (
          <p className="text-[10px] text-gray-400 mb-1">{product.brand}</p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-sm font-black text-gray-900">₹{displayPrice.toLocaleString('en-IN')}</span>
          {hasDiscount && (
            <span className="text-[10px] text-gray-400 line-through">₹{product.price.toLocaleString('en-IN')}</span>
          )}
        </div>

        {/* Ratings placeholder */}
        <div className="flex items-center gap-0.5 mb-2">
          {[1,2,3,4,5].map(i => (
            <Star key={i} size={9} className={i <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
          ))}
        </div>

        {/* Add to Cart */}
        <button
          onClick={onAddToCart}
          disabled={!product.inStock}
          className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all ${
            cartQty > 0
              ? 'bg-green-500 text-white'
              : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100'
          }`}
        >
          {cartQty > 0 ? `✓ Added (${cartQty})` : '+ Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ShopPage;
