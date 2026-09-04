export interface ServiceSpec {
  label: string;
  value: string;
}

export interface TechnicalService {
  id: string;
  name: string;
  code: string;
  category: string;
  subcategory: string;
  description: string;
  iconName: string;
  duration: string;
  rating: string;
  price: number;
  warranty: string;
  specifications: ServiceSpec[];
  imageUrl: string;
}

export interface CartItem {
  serviceId: string;
  serviceName: string;
  price: number;
  quantity: number;
  brand?: string;
}

export interface ServiceCatalogEntry {
  id: string;
  title: string;
  slug: string;
  category: string;
  keywords: string[];
  aliases: string[];
}

// ─────────────────────────────────────────────
// Product Marketplace Types
// ─────────────────────────────────────────────

export type ProductCategory =
  | 'Electrical'       // Switch, Socket, Bulb Holder, Tube Light
  | 'AC Parts'         // Capacitor, AC Wiring, Filter
  | 'RO Parts'         // RO membrane, filter cartridge, complete RO unit
  | 'Wiring & Cable'   // AC wiring, house wiring cable
  | 'Lighting'         // Bulbs, Tube Lights, LED strips
  | 'Other';           // Miscellaneous

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;           // MRP price
  salePrice?: number;      // Discounted price (optional)
  category: ProductCategory;
  imageUrl: string;        // Primary image
  images?: string[];       // Multiple product images (e.g. 3 images)
  inStock: boolean;
  stockCount?: number;     // optional quantity tracking
  brand?: string;
  sku?: string;            // Product code
  specifications?: { label: string; value: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export type OrderStatus =
  | 'Pending'        // Order placed, payment pending
  | 'Confirmed'      // Payment verified by admin
  | 'Shipped'        // Out for delivery
  | 'Delivered'      // Delivered to customer
  | 'Cancelled';     // Cancelled

export interface ProductOrder {
  id: string;                  // ORD-XXXX
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: 'UPI' | 'COD';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  upiTransactionId?: string;   // Customer fills this after payment
  screenshotUrl?: string;      // Payment proof screenshot
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

