import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  collection, doc, getDoc, getDocs, setDoc, deleteDoc,
  query, where
} from 'firebase/firestore';
import { 
  getAuth, GoogleAuthProvider, signOut
} from 'firebase/auth';
import type { TechnicalService } from './types';
import type { BusinessConfig } from './data';

export interface BookingData {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  selectedLocation: string;
  dateTime: string;
  items: {
    serviceId: string;
    serviceName: string;
    price: number;
    quantity: number;
    brand?: string;
    gstRate?: number;
  }[];
  subtotal: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
  createdAt: string;
  email?: string;
  termsAndConditions?: string;
  problemDescription?: string;
  photoBase64?: string;
}

export interface CustomerUser {
  name: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  address: string;
  serviceHistory: {
    serviceId: string;
    serviceName: string;
    date: string;
    price: number;
  }[];
  lastBookingDate: string;
  totalBookings: number;
  joinedAt: string;
}

export interface AuditLog {
  id: string;
  action: string;      // e.g., 'service_created', 'service_edited', 'service_deleted', 'price_changed', 'invoice_created', 'branding_changed'
  details: string;
  changedBy: string;   // admin email
  timestamp: string;
}

export interface PriceHistory {
  id: string;
  serviceId: string;
  serviceName: string;
  oldPrice: number;
  newPrice: number;
  changedBy: string;
  dateTime: string;
}

export interface InvoiceHistory {
  id: string;
  invoiceNumber: string;
  customerDetails: {
    name: string;
    phone: string;
    address: string;
    selectedLocation: string;
  };
  items: {
    serviceId: string;
    serviceName: string;
    price: number;
    quantity: number;
    brand?: string;
  }[];
  totalAmount: number;
  generatedDate: string;
  pdfMetadata: {
    printDate: string;
    operatorIdentity: string;
  };
}

export interface AdminLog {
  id: string;
  adminEmail: string;
  action: string;
  timestamp: string;
  deviceInfo: string;
}

export interface CategoryData {
  id: string;
  name: string;
  desc: string;
  img: string;
  label: string;
}

// Check if Firebase credentials are fully configured in environmental variables
export const isFirebaseConfigured = !!(
  import.meta.env.VITE_FIREBASE_PROJECT_ID && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID !== 'your-project-id' &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID !== 'YOUR_PROJECT_ID' &&
  !import.meta.env.VITE_FIREBASE_PROJECT_ID.startsWith('YOUR_') &&
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_API_KEY !== 'YOUR_API_KEY_HERE' &&
  import.meta.env.VITE_FIREBASE_API_KEY !== 'YOUR_FIREBASE_API_KEY' &&
  !import.meta.env.VITE_FIREBASE_API_KEY.startsWith('YOUR_')
);

// Asset path resolver for subdirectory hosting (e.g. GitHub Pages) & automatic path normalization
export const getAssetPath = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;

  let cleanPath = path;

  // Auto-correct outdated extension (.jpg, .png, .jpeg -> .webp for service assets)
  if (cleanPath.includes('/services/') || cleanPath.startsWith('/images/')) {
    cleanPath = cleanPath.replace(/\.(jpg|png|jpeg)$/i, '.webp');
  }

  // Only prepend images/services/ if it is a bare relative filename without leading / or images/
  if (!cleanPath.startsWith('/') && !cleanPath.startsWith('images/')) {
    if (cleanPath.endsWith('.webp') || cleanPath.endsWith('.jpg') || cleanPath.endsWith('.png')) {
      cleanPath = `images/services/${cleanPath.replace(/\.(jpg|png|jpeg)$/i, '.webp')}`;
    }
  }

  const base = import.meta.env.BASE_URL || '/';
  const finalPath = cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath;
  
  return base.endsWith('/') ? `${base}${finalPath}` : `${base}/${finalPath}`;
};

/** Helper to recursively remove undefined properties before passing to Firestore setDoc / updateDoc */
export function sanitizeForFirestore<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForFirestore) as unknown as T;
  }
  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const cleanObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleanObj[key] = sanitizeForFirestore(value);
      }
    }
    return cleanObj as T;
  }
  return obj;
};

import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';

// Firebase SDK App Instances
let app;
export let db: Firestore | null = null;
export let auth: Auth | null = null;
export let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  
  // Enable persistent local cache with multi-tab support
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
  
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  console.log("🔥 Firebase Web Client initialized with Multi-Tab Offline Cache.");
} else {
  console.warn("⚠️ Firebase environment keys are missing. Running in Simulated LocalStorage Database Mode.");
}

export const signOutUser = async (): Promise<void> => {
  if (isFirebaseConfigured && auth) {
    try {
      await signOut(auth);
      console.log("☁️ User signed out from Firebase Auth.");
    } catch (e) {
      console.error("Firebase SignOut error:", e);
    }
  }
};

/* ==========================================
   1. ADMINS COLLECTION & UTILS
   ========================================== */

/**
 * Checks if a specific email exists in the admins database log.
 * If the collection is completely empty, it seeds the first admin.
 */
export const isAdminEmail = async (email: string): Promise<boolean> => {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'admins', cleanEmail);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return true;
      }
      
      // Auto-seed current email if the collection is empty
      const adminsCol = await getDocs(collection(db, 'admins'));
      if (adminsCol.empty) {
        await setDoc(doc(db, 'admins', cleanEmail), {
          role: 'admin',
          seededAt: new Date().toISOString()
        });
        console.log(`🌱 Auto-seeded first admin in Firestore: ${cleanEmail}`);
        return true;
      }
    } catch (e) {
      console.error("Firestore Admin check failed:", e);
    }
  }

  // Simulated / Fallback local check
  return cleanEmail === 'kselectrical004@gmail.com' || cleanEmail === 'kaushindrasingh04@gmail.com';
};

/* ==========================================
   2. BRANDING SETTINGS COLLECTION
   ========================================== */

export const loadBusinessConfigFromDb = async (fallback: BusinessConfig): Promise<BusinessConfig> => {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'branding', 'current_branding');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as BusinessConfig;
        if (!data.logoUrl) {
          data.logoUrl = fallback.logoUrl || '/log.png';
        }
        return data;
      }
      
      // Seed initial configs
      await setDoc(docRef, fallback);
      return fallback;
    } catch (e) {
      console.error("Error loading branding from Firestore:", e);
    }
  }

  // Local fallback
  const local = localStorage.getItem('ks_business_config');
  if (local) {
    try {
      const data = JSON.parse(local) as BusinessConfig;
      if (!data.logoUrl) {
        data.logoUrl = fallback.logoUrl || '/log.png';
      }
      return data;
    } catch (err) {
      console.error(err);
    }
  }
  return fallback;
};

export const saveBusinessConfigToDb = async (config: BusinessConfig): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'branding', 'current_branding'), config);
      console.log("☁️ Branding synced to Firestore.");

      // Log to audit_logs
      const activeEmail = auth?.currentUser?.email || 'admin@kselectrical.in';
      const auditRef = doc(collection(db, 'audit_logs'));
      await setDoc(auditRef, {
        id: auditRef.id,
        action: 'branding_changed',
        details: `Updated company branding configuration. Name: ${config.name}, Phone: ${config.contacts[0]}`,
        changedBy: activeEmail,
        timestamp: new Date().toISOString()
      });
      return;
    } catch (e) {
      console.error("Error updating branding in Firestore:", e);
    }
  }

  // Local fallback
  localStorage.setItem('ks_business_config', JSON.stringify(config));
};

/* ==========================================
   3. SERVICES CATALOG & CATEGORIES COLLECTIONS
   ========================================== */

export const loadServicesFromDb = async (initialServices: TechnicalService[]): Promise<TechnicalService[]> => {
  const initialMap = new Map(initialServices.map(s => [s.id, s]));
  const nameMap = new Map(initialServices.map(s => [s.name?.toLowerCase(), s]));

  const getSmartFallbackImage = (serviceName: string = '', category: string = '') => {
    const name = serviceName.toLowerCase();
    const cat = category.toLowerCase();
    if (name.includes('switch') || name.includes('board') || name.includes('modular')) {
      return '/images/services/switchboard-repair-greater-noida.webp';
    }
    if (name.includes('chandelier') || name.includes('light') || cat.includes('light')) {
      return '/images/services/chandelier-installation-noida-extension.webp';
    }
    if (name.includes('fan') || cat.includes('fan')) {
      return '/images/services/ceiling-fan-repair-greater-noida.webp';
    }
    if (name.includes('ac') || cat.includes('ac')) {
      return '/images/services/ac-repair-greater-noida.webp';
    }
    return '/images/services/switchboard-repair-greater-noida.webp';
  };

  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'services'));
      if (!snap.empty && snap.size >= initialServices.length) {
        const loaded: TechnicalService[] = [];
        snap.forEach(doc => {
          const s = doc.data() as TechnicalService;
          // ALWAYS use local data.ts imageUrl — Firestore imageUrl may be stale/wrong
          const fallback = initialMap.get(s.id) || nameMap.get(s.name?.toLowerCase());
          if (fallback) {
            s.imageUrl = fallback.imageUrl;
            // Also ensure code is set for sorting
            if (!s.code) s.code = fallback.code;
          } else if (!s.imageUrl || !s.imageUrl.startsWith('/images/services/')) {
            s.imageUrl = getSmartFallbackImage(s.name, s.category);
          }
          loaded.push(s);
        });
        // Sort by code safely (handle missing code field)
        return loaded.sort((a, b) => (a.code || a.id).localeCompare(b.code || b.id));
      }
      
      // Auto-seed collection if empty
      console.log("🌱 Seeding default services in Firestore...");
      for (const service of initialServices) {
        await setDoc(doc(db, 'services', service.id), service);
      }
      return initialServices;
    } catch (e) {
      console.error("Error loading services from Firestore:", e);
    }
  }

  // Local fallback
  const local = localStorage.getItem('ks_services');
  if (local) {
    try {
      const parsed = JSON.parse(local) as TechnicalService[];
      return parsed.map(s => {
        const fallback = initialMap.get(s.id) || nameMap.get(s.name?.toLowerCase());
        if (fallback) {
          s.imageUrl = fallback.imageUrl;
        } else if (!s.imageUrl || !s.imageUrl.startsWith('/images/services/')) {
          s.imageUrl = getSmartFallbackImage(s.name, s.category);
        }
        return s;
      });
    } catch (err) {
      console.error(err);
    }
  }
  return initialServices;
};

export const loadCategoriesFromDb = async (): Promise<CategoryData[]> => {
  const defaultCats: CategoryData[] = [
    { id: 'AC Services', name: 'AC Services', desc: 'Gas leaks, jet cleaning & install', img: '/ac_service.webp', label: 'AC Services' },
    { id: 'Electrician Services', name: 'Electrician Services', desc: 'Wiring, MCBs, lighting fitting', img: '/electrical_safety_service.webp', label: 'Electrician Services' },
    { id: 'Appliance Repair', name: 'RO & Appliance Repair', desc: 'RO servicing, fridges & geysers', img: '/refrigerator_service.webp', label: 'RO & Appliance Repair' },
    { id: 'Home Installations', name: 'Home Installations', desc: 'Chimney wash, balcony nets, locks', img: '/geyser_service.webp', label: 'Home Installations' }
  ];

  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'categories'));
      if (!snap.empty) {
        const loaded: CategoryData[] = [];
        snap.forEach(doc => {
          loaded.push(doc.data() as CategoryData);
        });
        return loaded;
      }
      
      // Auto-seed categories
      console.log("🌱 Seeding default categories in Firestore...");
      for (const cat of defaultCats) {
        await setDoc(doc(db, 'categories', cat.id), cat);
      }
      return defaultCats;
    } catch (e) {
      console.error("Error loading categories from Firestore:", e);
    }
  }
  return defaultCats;
};

/**
 * Updates services catalog and logs changes in the 'price_history' and 'audit_logs' collections.
 */
export const saveServicesToDb = async (services: TechnicalService[]): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'services'));
      const oldServicesMap = new Map<string, TechnicalService>();
      snap.forEach(doc => {
        const data = doc.data() as TechnicalService;
        oldServicesMap.set(data.id, data);
      });

      const activeEmail = auth?.currentUser?.email || 'admin@kselectrical.in';
      const newIds = new Set(services.map(s => s.id));

      // 2. Scan for creations, edits, and price changes
      for (const newSrv of services) {
        const oldSrv = oldServicesMap.get(newSrv.id);
        
        if (!oldSrv) {
          // Log service creation
          const auditRef = doc(collection(db, 'audit_logs'));
          await setDoc(auditRef, {
            id: auditRef.id,
            action: 'service_created',
            details: `Created new service: ${newSrv.name} (${newSrv.code}) with price ₹${newSrv.price}`,
            changedBy: activeEmail,
            timestamp: new Date().toISOString()
          });
        } else {
          // Check for price edits
          if (oldSrv.price !== newSrv.price) {
            // Write to price_history collection
            const priceRef = doc(collection(db, 'price_history'));
            await setDoc(priceRef, {
              id: priceRef.id,
              serviceId: newSrv.id,
              serviceName: newSrv.name,
              oldPrice: oldSrv.price,
              newPrice: newSrv.price,
              changedBy: activeEmail,
              dateTime: new Date().toISOString()
            });

            // Log price change in audit_logs collection
            const auditRef = doc(collection(db, 'audit_logs'));
            await setDoc(auditRef, {
              id: auditRef.id,
              action: 'price_changed',
              details: `Changed price of ${newSrv.name} from ₹${oldSrv.price} to ₹${newSrv.price}`,
              changedBy: activeEmail,
              timestamp: new Date().toISOString()
            });
            console.log(`📝 Price history & audit logged: ${newSrv.name} (₹${oldSrv.price} -> ₹${newSrv.price})`);
          } else if (JSON.stringify(oldSrv) !== JSON.stringify(newSrv)) {
            // Log general edit in audit_logs collection
            const auditRef = doc(collection(db, 'audit_logs'));
            await setDoc(auditRef, {
              id: auditRef.id,
              action: 'service_edited',
              details: `Edited service parameters for ${newSrv.name} (${newSrv.code})`,
              changedBy: activeEmail,
              timestamp: new Date().toISOString()
            });
          }
        }
        
        // Save/Update in Firestore
        await setDoc(doc(db, 'services', newSrv.id), newSrv);
      }

      // 3. Scan for deleted services to remove them from Firestore
      for (const oldId of oldServicesMap.keys()) {
        if (!newIds.has(oldId)) {
          const oldSrv = oldServicesMap.get(oldId);
          await deleteDoc(doc(db, 'services', oldId));
          
          // Log deletion in audit_logs collection
          const auditRef = doc(collection(db, 'audit_logs'));
          await setDoc(auditRef, {
            id: auditRef.id,
            action: 'service_deleted',
            details: `Deleted service: ${oldSrv?.name || oldId} (${oldSrv?.code || ''})`,
            changedBy: activeEmail,
            timestamp: new Date().toISOString()
          });
          console.log(`🗑️ Removed deleted service ${oldId} from Firestore.`);
        }
      }
      return;
    } catch (e) {
      console.error("Error saving services to Firestore:", e);
    }
  }

  // Local fallback
  localStorage.setItem('ks_services', JSON.stringify(services));
};

/* ==========================================
   4. BOOKINGS COLLECTION (Online Reservations)
   ========================================== */

export const saveBookingToCloud = async (booking: Omit<BookingData, 'id' | 'createdAt' | 'status'>): Promise<BookingData> => {
  const newBooking: BookingData = {
    ...booking,
    id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      // 1. Save booking
      await setDoc(doc(db, 'bookings', newBooking.id), sanitizeForFirestore(newBooking));
      console.log(`☁️ Booking ${newBooking.id} saved to Firestore.`);
      
      // 2. Create/Update Customer Record (Only if authenticated to avoid guest permissions errors)
      const phoneKey = newBooking.phone.trim();
      if (phoneKey && auth?.currentUser) {
        try {
          const custRef = doc(db, 'Customers', phoneKey);
          const custSnap = await getDoc(custRef);
          
          const newServiceItems = newBooking.items.map(item => ({
            serviceId: item.serviceId,
            serviceName: item.serviceName,
            date: newBooking.createdAt,
            price: item.price
          }));

          const activeEmail = auth.currentUser.email || '';

          if (custSnap.exists()) {
            const existing = custSnap.data() as CustomerUser;
            const updatedHistory = [...(existing.serviceHistory || []), ...newServiceItems];
            await setDoc(custRef, {
              ...existing,
              name: newBooking.customerName,
              address: newBooking.address,
              serviceHistory: updatedHistory,
              lastBookingDate: newBooking.createdAt,
              totalBookings: (existing.totalBookings || 0) + 1
            }, { merge: true });
          } else {
            const newCustomer: CustomerUser = {
              name: newBooking.customerName,
              phone: phoneKey,
              email: activeEmail || undefined,
              address: newBooking.address,
              serviceHistory: newServiceItems,
              lastBookingDate: newBooking.createdAt,
              totalBookings: 1,
              joinedAt: new Date().toISOString()
            };
            await setDoc(custRef, newCustomer);
          }
          console.log(`☁️ Customer directory record synced for phone: ${phoneKey}`);
        } catch (custErr) {
          console.warn("Could not sync customer directory record (ignoring):", custErr);
        }
      }
    } catch (e) {
      console.error("Error saving booking to Firestore:", e);
    }
  }

  // PHP Backend Fallback / Local state fallback:
  // Note: BookingForm.tsx already posts directly to submit_booking.php. 
  // We just return the newBooking object to update state client-side without duplicate entries.
  return newBooking;
};

export const updateBookingStatusInCloud = async (bookingId: string, newStatus: 'Pending' | 'Completed' | 'Cancelled'): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      const activeEmail = auth?.currentUser?.email || 'admin@kselectrical.in';

      const bookingRef = doc(db, 'bookings', bookingId);
      const bookingSnap = await getDoc(bookingRef);
      if (bookingSnap.exists()) {
        await setDoc(bookingRef, { status: newStatus }, { merge: true });
        console.log(`☁️ Booking ${bookingId} status updated to ${newStatus} in Firestore.`);
        
        // Log to audit
        const auditRef = doc(collection(db, 'audit_logs'));
        await setDoc(auditRef, {
          id: auditRef.id,
          action: 'booking_status_changed',
          details: `Updated booking ${bookingId} status to ${newStatus}`,
          changedBy: activeEmail,
          timestamp: new Date().toISOString()
        });
        return;
      }
      
      const invoiceRef = doc(db, 'invoices', bookingId);
      const invoiceSnap = await getDoc(invoiceRef);
      if (invoiceSnap.exists()) {
        await setDoc(invoiceRef, { status: newStatus }, { merge: true });
        console.log(`☁️ Invoice ${bookingId} status updated to ${newStatus} in Firestore.`);
        
        // Log to audit
        const auditRef = doc(collection(db, 'audit_logs'));
        await setDoc(auditRef, {
          id: auditRef.id,
          action: 'invoice_status_changed',
          details: `Updated invoice ${bookingId} status to ${newStatus}`,
          changedBy: activeEmail,
          timestamp: new Date().toISOString()
        });
        return;
      }
    } catch (e) {
      console.error("Error updating booking/invoice status in Firestore:", e);
    }
  }

  // No-op fallback
};

export const getBookingsFromCloud = async (): Promise<BookingData[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'bookings'));
      const bookings: BookingData[] = [];
      snap.forEach(doc => {
        bookings.push(doc.data() as BookingData);
      });
      // Sort newest first
      return bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (e) {
      console.error("Error fetching bookings from Firestore:", e);
    }
  }

  // Local fallback
  const local = localStorage.getItem('ks_bookings');
  if (local) {
    try {
      return JSON.parse(local) as BookingData[];
    } catch (err) {
      console.error(err);
    }
  }
  return [];
};

export const getBookingsForCustomerFromCloud = async (phone: string, email?: string): Promise<BookingData[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const bookingsCol = collection(db, 'bookings');
      const cleanPhone = phone.trim();
      
      const queries = [];
      // 1. Query by exact phone number
      if (cleanPhone) {
        queries.push(getDocs(query(bookingsCol, where('phone', '==', cleanPhone))));
        // Also query with country code prefix (+91) if not already present
        if (!cleanPhone.startsWith('+91') && cleanPhone.length === 10) {
          queries.push(getDocs(query(bookingsCol, where('phone', '==', '+91' + cleanPhone))));
        } else if (cleanPhone.startsWith('+91') && cleanPhone.length === 13) {
          queries.push(getDocs(query(bookingsCol, where('phone', '==', cleanPhone.slice(-10)))));
        }
      }
      
      // 2. Query by email if available
      if (email && email.trim()) {
        queries.push(getDocs(query(bookingsCol, where('email', '==', email.trim()))));
      }
      
      const results = await Promise.all(queries);
      const bookingsMap = new Map<string, BookingData>();
      
      results.forEach(snap => {
        snap.forEach(doc => {
          const data = doc.data() as BookingData;
          bookingsMap.set(data.id, data);
        });
      });
      
      const bookings = Array.from(bookingsMap.values());
      // Sort newest first
      return bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (e) {
      console.error("Error fetching customer bookings from Firestore:", e);
    }
  }
  return [];
};

/* ==========================================
   5. INVOICES & INVOICE_HISTORY COLLECTIONS
   ========================================== */

export const saveInvoiceToCloud = async (invoice: BookingData): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      // 1. Save to 'invoices'
      await setDoc(doc(db, 'invoices', invoice.id), invoice);
      console.log(`☁️ Manual Invoice ${invoice.id} saved to Firestore.`);

      const activeEmail = auth?.currentUser?.email || 'admin@kselectrical.in';

      // 2. Save to 'invoice_history'
      const historyRef = doc(collection(db, 'invoice_history'));
      const historyRecord: InvoiceHistory = {
        id: historyRef.id,
        invoiceNumber: invoice.id,
        customerDetails: {
          name: invoice.customerName,
          phone: invoice.phone,
          address: invoice.address,
          selectedLocation: invoice.selectedLocation
        },
        items: invoice.items,
        totalAmount: invoice.subtotal,
        generatedDate: invoice.createdAt,
        pdfMetadata: {
          printDate: new Date().toISOString(),
          operatorIdentity: activeEmail
        }
      };
      await setDoc(historyRef, historyRecord);
      console.log(`☁️ Invoice history record created: ${historyRef.id}`);

      // 3. Create/Update Customer Record
      const phoneKey = invoice.phone.trim();
      if (phoneKey) {
        const custRef = doc(db, 'Customers', phoneKey);
        const custSnap = await getDoc(custRef);
        
        const newServiceItems = invoice.items.map(item => ({
          serviceId: item.serviceId,
          serviceName: item.serviceName,
          date: invoice.createdAt,
          price: item.price
        }));

        if (custSnap.exists()) {
          const existing = custSnap.data() as CustomerUser;
          const updatedHistory = [...(existing.serviceHistory || []), ...newServiceItems];
          await setDoc(custRef, {
            ...existing,
            name: invoice.customerName,
            address: invoice.address,
            serviceHistory: updatedHistory,
            lastBookingDate: invoice.createdAt,
            totalBookings: (existing.totalBookings || 0) + 1
          }, { merge: true });
        } else {
          const newCustomer: CustomerUser = {
            name: invoice.customerName,
            phone: phoneKey,
            address: invoice.address,
            serviceHistory: newServiceItems,
            lastBookingDate: invoice.createdAt,
            totalBookings: 1,
            joinedAt: new Date().toISOString()
          };
          await setDoc(custRef, newCustomer);
        }
        console.log(`☁️ Customer record updated via invoice for phone: ${phoneKey}`);
      }

      // 4. Log to 'audit_logs'
      const auditRef = doc(collection(db, 'audit_logs'));
      await setDoc(auditRef, {
        id: auditRef.id,
        action: 'invoice_created',
        details: `Created manual invoice ${invoice.id} for ${invoice.customerName} (Total: ₹${invoice.subtotal})`,
        changedBy: activeEmail,
        timestamp: new Date().toISOString()
      });

      return;
    } catch (e) {
      console.error("Error saving invoice to Firestore:", e);
    }
  }

  // Local fallback
  const currentInvoices = await getInvoicesFromCloud();
  currentInvoices.unshift(invoice);
  localStorage.setItem('ks_invoices', JSON.stringify(currentInvoices));
};

// ─── Update an existing invoice (edit mode) ─────────────────────────────────
export const updateInvoiceInCloud = async (invoice: BookingData): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      const activeEmail = auth?.currentUser?.email || 'admin@kselectrical.in';

      // Overwrite the invoice doc (keeping same ID)
      await setDoc(doc(db, 'invoices', invoice.id), invoice);
      console.log(`☁️ Invoice ${invoice.id} updated in Firestore.`);

      // Audit log
      const auditRef = doc(collection(db, 'audit_logs'));
      await setDoc(auditRef, {
        id: auditRef.id,
        action: 'invoice_updated',
        details: `Edited invoice ${invoice.id} for ${invoice.customerName} (Total: ₹${invoice.subtotal})`,
        changedBy: activeEmail,
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.error('Error updating invoice in Firestore:', e);
      throw e;
    }
  } else {
    // Local fallback
    const current = await getInvoicesFromCloud();
    const idx = current.findIndex(i => i.id === invoice.id);
    if (idx !== -1) current[idx] = invoice;
    localStorage.setItem('ks_invoices', JSON.stringify(current));
  }
};

export const getInvoicesFromCloud = async (): Promise<BookingData[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'invoices'));
      const invoices: BookingData[] = [];
      snap.forEach(doc => {
        invoices.push(doc.data() as BookingData);
      });
      return invoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (e) {
      console.error("Error fetching invoices from Firestore:", e);
    }
  }

  // Local fallback
  const local = localStorage.getItem('ks_invoices');
  if (local) {
    try {
      return JSON.parse(local);
    } catch (err) {
      console.error(err);
    }
  }
  return [];
};

/* ==========================================
   6. CUSTOMERS COLLECTION
   ========================================== */

export const saveCustomerToCloud = async (user: { name: string; phone: string; photoUrl?: string }): Promise<CustomerUser> => {
  const phoneKey = user.phone.trim().replace(/\D/g, '');
  const joinedAt = new Date().toISOString();
  
  const customer: CustomerUser = {
    name: user.name,
    phone: phoneKey,
    photoUrl: user.photoUrl || '/profile.webp',
    joinedAt,
    address: '',
    serviceHistory: [],
    totalBookings: 0,
    lastBookingDate: joinedAt
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'Customers', phoneKey);
      const existing = await getDoc(docRef);
      
      const currentJoinedAt = existing.exists() ? existing.data().joinedAt : joinedAt;
      const address = existing.exists() ? (existing.data().address || '') : '';
      const serviceHistory = existing.exists() ? (existing.data().serviceHistory || []) : [];
      const totalBookings = existing.exists() ? (existing.data().totalBookings || 0) : 0;
      const lastBookingDate = existing.exists() ? (existing.data().lastBookingDate || currentJoinedAt) : currentJoinedAt;

      const fullCustomer: CustomerUser = {
        name: user.name,
        phone: phoneKey,
        photoUrl: user.photoUrl || '/profile.webp',
        joinedAt: currentJoinedAt,
        address,
        serviceHistory,
        totalBookings,
        lastBookingDate
      };

      await setDoc(docRef, fullCustomer);
      console.log(`☁️ Customer ${phoneKey} synced in Firestore Customers collection.`);
      return fullCustomer;
    } catch (e) {
      console.error("Error saving customer to Firestore:", e);
    }
  }

  // No-op fallback

  return customer;
};

export const getCustomersFromCloud = (): CustomerUser[] => {
  const local = localStorage.getItem('ks_registered_customers');
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error("Error parsing local customer directory:", e);
    }
  }
  return [];
};

export const getCustomersFromFirestore = async (): Promise<CustomerUser[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'Customers'));
      const customers: CustomerUser[] = [];
      snap.forEach(doc => {
        customers.push(doc.data() as CustomerUser);
      });
      return customers;
    } catch (e) {
      console.error("Error fetching customers from Firestore:", e);
    }
  }
  
  // Local fallback
  return getCustomersFromCloud();
};

export const getCustomerProfileFromFirestore = async (phone: string): Promise<CustomerUser | null> => {
  const cleanPhone = phone.trim().replace(/\D/g, '');
  if (!cleanPhone) return null;

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'Customers', cleanPhone);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as CustomerUser;
      }
    } catch (e) {
      console.error("Error fetching single customer profile from Firestore:", e);
    }
  }
  return null;
};

/* ==========================================
   7. LOGS & HISTORY RETRIEVALS
   ========================================== */

export const saveAdminLogToCloud = async (adminEmail: string, action: 'admin_login' | 'admin_logout' | 'admin_refresh'): Promise<void> => {
  const logRecord: AdminLog = {
    id: 'log-' + Math.floor(100000 + Math.random() * 900000),
    adminEmail,
    action,
    timestamp: new Date().toISOString(),
    deviceInfo: navigator.userAgent
  };

  if (isFirebaseConfigured && db) {
    try {
      const logRef = doc(collection(db, 'admin_logs'));
      await setDoc(logRef, { ...logRecord, id: logRef.id });
      console.log(`☁️ Admin log created: ${action} for ${adminEmail}`);
    } catch (e) {
      console.error("Error saving admin log to Firestore:", e);
    }
    return;
  }

  // No-op fallback
};

export const getAuditLogsFromCloud = async (): Promise<AuditLog[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'audit_logs'));
      const logs: AuditLog[] = [];
      snap.forEach(doc => {
        logs.push(doc.data() as AuditLog);
      });
      return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (e) {
      console.error("Error fetching audit logs from Firestore:", e);
    }
  }

  // Local fallback
  const local = localStorage.getItem('ks_audit_logs');
  if (local) {
    try {
      return JSON.parse(local) as AuditLog[];
    } catch (err) {
      console.error(err);
    }
  }
  return [];
};

export const getPriceHistoryFromCloud = async (): Promise<PriceHistory[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'price_history'));
      const loaded: PriceHistory[] = [];
      snap.forEach(doc => {
        loaded.push(doc.data() as PriceHistory);
      });
      return loaded.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    } catch (e) {
      console.error("Error fetching price history:", e);
    }
  }

  // Local fallback
  return [];
};

export const getInvoiceHistoryFromCloud = async (): Promise<InvoiceHistory[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'invoice_history'));
      const loaded: InvoiceHistory[] = [];
      snap.forEach(doc => {
        loaded.push(doc.data() as InvoiceHistory);
      });
      return loaded.sort((a, b) => new Date(b.generatedDate).getTime() - new Date(a.generatedDate).getTime());
    } catch (e) {
      console.error("Error fetching invoice history:", e);
    }
  }
  return [];
};

export const getAdminLogsFromCloud = async (): Promise<AdminLog[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'admin_logs'));
      const loaded: AdminLog[] = [];
      snap.forEach(doc => {
        loaded.push(doc.data() as AdminLog);
      });
      return loaded.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (e) {
      console.error("Error fetching admin logs:", e);
    }
  }

  // Local fallback
  return [];
};

/* ==========================================
   8. MIGRATION UTILITY
   ========================================== */

export const runMigrationToFirestore = async (): Promise<{ success: boolean; migratedCount: number }> => {
  if (!isFirebaseConfigured || !db) {
    return { success: false, migratedCount: 0 };
  }

  // If already migrated, skip
  if (localStorage.getItem('ks_migration_completed') === 'true') {
    return { success: true, migratedCount: 0 };
  }

  console.log("🚀 Starting LocalStorage to Firestore data migration...");
  let count = 0;

  try {
    // 1. Migrate Branding Configuration
    const localConfig = localStorage.getItem('ks_business_config');
    if (localConfig) {
      const parsed = JSON.parse(localConfig);
      await setDoc(doc(db, 'branding', 'current_branding'), parsed);
      count++;
      console.log("✅ Config migrated.");
    }

    // 2. Migrate Services Catalog
    const localServices = localStorage.getItem('ks_services');
    if (localServices) {
      const parsed = JSON.parse(localServices) as TechnicalService[];
      for (const service of parsed) {
        await setDoc(doc(db, 'services', service.id), service);
        count++;
      }
      console.log(`✅ ${parsed.length} services migrated.`);
    }

    // 3. Migrate Bookings & populate customers
    const localBookings = localStorage.getItem('ks_bookings');
    if (localBookings) {
      const parsed = JSON.parse(localBookings) as BookingData[];
      for (const booking of parsed) {
        await setDoc(doc(db, 'bookings', booking.id), booking);
        count++;
        
        // Populate customer record for booking if possible
        const phoneKey = booking.phone.trim();
        if (phoneKey) {
          const custRef = doc(db, 'Customers', phoneKey);
          const custSnap = await getDoc(custRef);
          const newServiceItems = booking.items.map(item => ({
            serviceId: item.serviceId,
            serviceName: item.serviceName,
            date: booking.createdAt,
            price: item.price
          }));
          if (custSnap.exists()) {
            const existing = custSnap.data() as CustomerUser;
            const updatedHistory = [...(existing.serviceHistory || []), ...newServiceItems];
            await setDoc(custRef, {
              ...existing,
              serviceHistory: updatedHistory,
              totalBookings: (existing.totalBookings || 0) + 1
            }, { merge: true });
          } else {
            await setDoc(custRef, {
              name: booking.customerName,
              phone: phoneKey,
              address: booking.address,
              serviceHistory: newServiceItems,
              lastBookingDate: booking.createdAt,
              totalBookings: 1,
              joinedAt: new Date().toISOString()
            });
          }
        }
      }
      console.log(`✅ ${parsed.length} bookings migrated.`);
    }

    // 4. Migrate Invoices
    const localInvoices = localStorage.getItem('ks_invoices');
    if (localInvoices) {
      const parsed = JSON.parse(localInvoices) as BookingData[];
      for (const invoice of parsed) {
        await setDoc(doc(db, 'invoices', invoice.id), invoice);
        count++;

        // Add history log in invoice_history
        const historyRef = doc(collection(db, 'invoice_history'));
        const historyRecord: InvoiceHistory = {
          id: historyRef.id,
          invoiceNumber: invoice.id,
          customerDetails: {
            name: invoice.customerName,
            phone: invoice.phone,
            address: invoice.address,
            selectedLocation: invoice.selectedLocation
          },
          items: invoice.items,
          totalAmount: invoice.subtotal,
          generatedDate: invoice.createdAt,
          pdfMetadata: {
            printDate: new Date().toISOString(),
            operatorIdentity: 'system_migration'
          }
        };
        await setDoc(historyRef, historyRecord);
        count++;
      }
      console.log(`✅ ${parsed.length} invoices migrated.`);
    }

    // 5. Migrate Registered Customers
    const localCustomers = localStorage.getItem('ks_registered_customers');
    if (localCustomers && db) {
      const parsed = JSON.parse(localCustomers) as Partial<CustomerUser>[];
      for (const customer of parsed) {
        const phoneKey = customer.phone || (customer.email ? customer.email.split('@')[0] : '');
        if (phoneKey) {
          const custRef = doc(db, 'Customers', phoneKey);
          const snap = await getDoc(custRef);
          if (!snap.exists()) {
            await setDoc(custRef, {
              name: customer.name,
              phone: phoneKey,
              email: customer.email,
              photoUrl: customer.photoUrl,
              address: customer.address || 'Address migrated',
              serviceHistory: customer.serviceHistory || [],
              lastBookingDate: customer.lastBookingDate || customer.joinedAt,
              totalBookings: customer.totalBookings || 1,
              joinedAt: customer.joinedAt || new Date().toISOString()
            });
            count++;
          }
        }
      }
      console.log(`✅ ${parsed.length} customers migrated.`);
    }

    // 6. Migrate Audit Logs
    const localAudits = localStorage.getItem('ks_audit_logs');
    if (localAudits && db) {
      const parsed = JSON.parse(localAudits) as Partial<AuditLog & { serviceName?: string; oldPrice?: number; newPrice?: number }>[];
      for (const log of parsed) {
        const docRef = doc(collection(db, 'audit_logs'));
        await setDoc(docRef, {
          id: docRef.id,
          action: log.action || 'price_changed',
          details: log.details || `Price of ${log.serviceName || ''} changed from ₹${log.oldPrice || 0} to ₹${log.newPrice || 0}`,
          changedBy: log.changedBy || 'admin@kselectrical.in',
          timestamp: log.timestamp || new Date().toISOString()
        });
        count++;
      }
      console.log(`✅ ${parsed.length} audit logs migrated.`);
    }

    // Set migration complete
    localStorage.setItem('ks_migration_completed', 'true');
    console.log("🎉 Migration completed successfully!");

    // Clean up old items to stop using localStorage permanently
    localStorage.removeItem('ks_business_config');
    localStorage.removeItem('ks_services');
    localStorage.removeItem('ks_bookings');
    localStorage.removeItem('ks_invoices');
    localStorage.removeItem('ks_registered_customers');
    localStorage.removeItem('ks_audit_logs');
    
    return { success: true, migratedCount: count };
  } catch (e) {
    console.error("❌ Migration failed:", e);
    return { success: false, migratedCount: count };
  }
};

// ─────────────────────────────────────────────────────────────
// MARKETPLACE — Products & Orders
// ─────────────────────────────────────────────────────────────
import type { Product, ProductOrder } from './types';

/** Fetch all products from Firestore with LocalStorage fallback */
export const getProductsFromDb = async (): Promise<Product[]> => {
  let products: Product[] = [];
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'products'));
      if (!snap.empty) {
        products = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
        localStorage.setItem('ks_products_catalog', JSON.stringify(products));
        return products;
      }
    } catch (e) {
      console.error('getProductsFromDb error:', e);
    }
  }

  // Local fallback
  const local = localStorage.getItem('ks_products_catalog');
  if (local) {
    try {
      return JSON.parse(local) as Product[];
    } catch (err) {
      console.error(err);
    }
  }
  return products;
};

/** Fetch a single product by ID */
export const getProductById = async (id: string): Promise<Product | null> => {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'products', id));
      if (snap.exists()) return { id: snap.id, ...snap.data() } as Product;
    } catch (e) {
      console.error('getProductById error:', e);
    }
  }

  const all = await getProductsFromDb();
  return all.find(p => p.id === id) || null;
};

/** Save (create or update) a product — admin only */
export const saveProductToDb = async (product: Product): Promise<boolean> => {
  let cloudSaved = false;
  const updatedProduct = {
    ...product,
    updatedAt: new Date().toISOString(),
  };

  // 1. Attempt Firestore save
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'products', product.id), updatedProduct);
      cloudSaved = true;
      console.log(`☁️ Product ${product.id} saved in Firestore.`);
    } catch (e) {
      console.error('saveProductToDb Firestore error:', e);
    }
  }

  // 2. Always sync to LocalStorage
  try {
    const existingStr = localStorage.getItem('ks_products_catalog');
    const existingList: Product[] = existingStr ? JSON.parse(existingStr) : [];
    const index = existingList.findIndex(p => p.id === product.id);
    if (index >= 0) {
      existingList[index] = updatedProduct;
    } else {
      existingList.push(updatedProduct);
    }
    localStorage.setItem('ks_products_catalog', JSON.stringify(existingList));
    console.log(`💾 Product ${product.id} saved in LocalStorage.`);
    return true; // Always successful if saved locally or in cloud
  } catch (err) {
    console.error('LocalStorage save error:', err);
    return cloudSaved;
  }
};

/** Delete a product — admin only */
export const deleteProductFromDb = async (id: string): Promise<boolean> => {
  let cloudDeleted = false;
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'products', id));
      cloudDeleted = true;
    } catch (e) {
      console.error('deleteProductFromDb error:', e);
    }
  }

  try {
    const existingStr = localStorage.getItem('ks_products_catalog');
    if (existingStr) {
      let existingList: Product[] = JSON.parse(existingStr);
      existingList = existingList.filter(p => p.id !== id);
      localStorage.setItem('ks_products_catalog', JSON.stringify(existingList));
    }
    return true;
  } catch {
    return cloudDeleted;
  }
};

/** Place a new order */
export const saveOrderToDb = async (order: ProductOrder): Promise<boolean> => {
  let cloudSaved = false;
  const updatedOrder = {
    ...order,
    createdAt: order.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured && db) {
    try {
      const sanitizedDoc = sanitizeForFirestore(updatedOrder);
      await setDoc(doc(db, 'orders', order.id), sanitizedDoc);
      cloudSaved = true;

      if (order.phone) {
        const rawPhone = order.phone.trim().replace(/\D/g, '');
        const tenDigits = rawPhone.length >= 10 ? rawPhone.slice(-10) : rawPhone;
        if (tenDigits) {
          try {
            const custRef = doc(db, 'Customers', tenDigits);
            await setDoc(custRef, sanitizeForFirestore({
              name: order.customerName,
              phone: tenDigits,
              address: order.address,
              lastBookingDate: updatedOrder.createdAt
            }), { merge: true });
          } catch (custErr) {
            console.warn('Customer directory sync from order error:', custErr);
          }
        }
      }
    } catch (e) {
      console.error('saveOrderToDb cloud save error:', e);
    }
  }

  try {
    const existingStr = localStorage.getItem('ks_product_orders');
    const existingList: ProductOrder[] = existingStr ? JSON.parse(existingStr) : [];
    const index = existingList.findIndex(o => o.id === order.id);
    if (index >= 0) {
      existingList[index] = updatedOrder;
    } else {
      existingList.unshift(updatedOrder);
    }
    localStorage.setItem('ks_product_orders', JSON.stringify(existingList));
    return true;
  } catch {
    return cloudSaved;
  }
};

/** Get all orders — admin */
export const getAllOrdersFromDb = async (): Promise<ProductOrder[]> => {
  let cloudOrders: ProductOrder[] = [];
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'orders'));
      if (!snap.empty) {
        cloudOrders = snap.docs
          .map(d => ({ id: d.id, ...d.data() } as ProductOrder))
          .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      }
    } catch (e) {
      console.error('getAllOrdersFromDb error:', e);
    }
  }

  const localStr = localStorage.getItem('ks_product_orders');
  let localOrders: ProductOrder[] = [];
  if (localStr) {
    try {
      localOrders = JSON.parse(localStr) as ProductOrder[];
    } catch (err) {
      console.error(err);
    }
  }

  // Merge cloud orders and local orders by ID, with cloud taking precedence
  const mergedMap = new Map<string, ProductOrder>();
  localOrders.forEach(o => { if (o && o.id) mergedMap.set(o.id, o); });
  cloudOrders.forEach(o => { if (o && o.id) mergedMap.set(o.id, o); });

  const finalOrders = Array.from(mergedMap.values()).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  localStorage.setItem('ks_product_orders', JSON.stringify(finalOrders));
  return finalOrders;
};

/** Get orders for a specific customer by phone */
export const getOrdersByPhoneFromDb = async (phone: string): Promise<ProductOrder[]> => {
  const rawClean = phone.trim().replace(/\D/g, '');
  const targetTen = rawClean.length >= 10 ? rawClean.slice(-10) : rawClean;

  const all = await getAllOrdersFromDb();
  return all.filter(o => {
    const oClean = (o.phone || '').replace(/\D/g, '');
    const oTen = oClean.length >= 10 ? oClean.slice(-10) : oClean;
    return oTen === targetTen;
  });
};

/** Update order status — admin */
export const updateOrderStatusInDb = async (
  orderId: string,
  status: ProductOrder['status'],
  paymentStatus?: ProductOrder['paymentStatus'],
  screenshotUrl?: string
): Promise<boolean> => {
  let cloudUpdated = false;
  const updates: Partial<ProductOrder> = { status, updatedAt: new Date().toISOString() };
  if (paymentStatus) updates.paymentStatus = paymentStatus;
  if (screenshotUrl) updates.screenshotUrl = screenshotUrl;

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'orders', orderId), sanitizeForFirestore(updates), { merge: true });
      cloudUpdated = true;
    } catch (e) {
      console.error('updateOrderStatusInDb error:', e);
    }
  }

  try {
    const existingStr = localStorage.getItem('ks_product_orders');
    if (existingStr) {
      let existingList: ProductOrder[] = JSON.parse(existingStr);
      existingList = existingList.map(o => o.id === orderId ? { ...o, ...updates } : o);
      localStorage.setItem('ks_product_orders', JSON.stringify(existingList));
    }
    return true;
  } catch {
    return cloudUpdated;
  }
};

export interface CustomerRecord {
  name?: string;
  phone?: string;
  address?: string;
  email?: string;
  photoUrl?: string;
}

/** Get customer profile by 10-digit phone number from Firestore Customers, orders, bookings, or local session */
export const getCustomerByPhoneFromDb = async (phone: string): Promise<CustomerRecord | null> => {
  const rawClean = phone.trim().replace(/\D/g, '');
  const tenDigits = rawClean.length >= 10 ? rawClean.slice(-10) : rawClean;
  if (!tenDigits || tenDigits.length !== 10) return null;

  // 1. Check Cloud Firestore Customers collection
  if (isFirebaseConfigured && db) {
    try {
      let docRef = doc(db, 'Customers', tenDigits);
      let docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        docRef = doc(db, 'Customers', `+91${tenDigits}`);
        docSnap = await getDoc(docRef);
      }
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && (data.name || data.address)) {
          return {
            name: data.name || '',
            phone: tenDigits,
            address: data.address || '',
            email: data.email || `${tenDigits}@kselectrical.in`,
            photoUrl: data.photoUrl || '/profile.webp'
          };
        }
      }
    } catch (e) {
      console.warn('getCustomerByPhoneFromDb firestore lookup error:', e);
    }
  }

  // 2. Check past orders for customer name and address
  try {
    const orders = await getOrdersByPhoneFromDb(tenDigits);
    if (orders && orders.length > 0) {
      const lastOrder = orders[0];
      if (lastOrder.customerName || lastOrder.address) {
        return {
          name: lastOrder.customerName || '',
          phone: tenDigits,
          address: lastOrder.address || '',
          email: `${tenDigits}@kselectrical.in`,
          photoUrl: '/profile.webp'
        };
      }
    }
  } catch (err) {
    console.warn('getCustomerByPhoneFromDb orders lookup error:', err);
  }

  // 3. Check past bookings for customer name and address
  try {
    const bookings = await getBookingsForCustomerFromCloud(tenDigits);
    if (bookings && bookings.length > 0) {
      const lastBooking = bookings[0];
      if (lastBooking.customerName || lastBooking.address) {
        return {
          name: lastBooking.customerName || '',
          phone: tenDigits,
          address: lastBooking.address || '',
          email: lastBooking.email || `${tenDigits}@kselectrical.in`,
          photoUrl: '/profile.webp'
        };
      }
    }
  } catch (err) {
    console.warn('getCustomerByPhoneFromDb bookings lookup error:', err);
  }

  // 4. Check local session
  try {
    const sessionStr = localStorage.getItem('ks_auth_session');
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      if (session?.currentUser?.phone?.replace(/\D/g, '').slice(-10) === tenDigits) {
        return session.currentUser;
      }
    }
  } catch (err) {
    console.warn('localStorage lookup error:', err);
  }

  return null;
};

