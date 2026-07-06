/**
 * auth.js - Modular Customer Authentication and Signup Logic
 * Strictly driven by 10-digit Mobile Number, eliminating Email entirely.
 */

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js";
import { getAuth, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";

// Global Firebase configuration with robust fallback options
const defaultFirebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

// Retrieve configuration from window object, local storage, or default
const firebaseConfig = window.firebaseConfig || JSON.parse(localStorage.getItem('ks_firebase_config')) || defaultFirebaseConfig;

let app;
let db = null;
let auth = null;

export function isFirebaseConfigured() {
    return firebaseConfig.projectId && 
           firebaseConfig.projectId !== "" && 
           firebaseConfig.projectId !== "YOUR_PROJECT_ID" && 
           !firebaseConfig.projectId.startsWith("YOUR_") &&
           firebaseConfig.apiKey &&
           firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY" &&
           !firebaseConfig.apiKey.startsWith("YOUR_");
}

export function initializeFirebase() {
    if (isFirebaseConfigured()) {
        try {
            app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
            db = getFirestore(app);
            auth = getAuth(app);
            console.log("🔥 Firebase Auth & Firestore initialized in auth.js");
        } catch (e) {
            console.error("Error initializing Firebase in auth.js:", e);
        }
    } else {
        console.warn("⚠️ Firebase credentials missing in auth.js. Running in Simulated LocalStorage Mode.");
    }
}

// Immediately attempt initialization
initializeFirebase();

/**
 * Handles Customer Login or Signup strictly via Mobile Number
 * @param {string} name - Full Name of the customer
 * @param {string} phone - 10-digit mobile number
 * @returns {Promise<Object>} The authenticated customer user object
 */
export async function signUpOrLoginCustomer(name, phone) {
    const cleanPhone = phone.trim().replace(/\D/g, '');
    const cleanName = name.trim();

    if (cleanPhone.length !== 10) {
        throw new Error("Please enter a valid 10-digit mobile number.");
    }
    if (cleanName.length < 2) {
        throw new Error("Please enter a valid name (at least 2 characters).");
    }

    const joinedAt = new Date().toISOString();
    const userObj = {
        name: cleanName,
        phone: cleanPhone,
        joinedAt: joinedAt,
        address: "",
        serviceHistory: [],
        totalBookings: 0,
        lastBookingDate: joinedAt
    };

    // 1. Live Firestore Sync (if configured)
    if (db) {
        try {
            const docRef = doc(db, "Customers", cleanPhone);
            const existingDoc = await getDoc(docRef);

            if (existingDoc.exists()) {
                const data = existingDoc.data();
                userObj.joinedAt = data.joinedAt || joinedAt;
                userObj.address = data.address || "";
                userObj.serviceHistory = data.serviceHistory || [];
                userObj.totalBookings = data.totalBookings || 0;
                userObj.lastBookingDate = data.lastBookingDate || userObj.joinedAt;
                
                // Update name if changed, keeping other fields intact
                userObj.name = cleanName;
                await setDoc(docRef, userObj, { merge: true });
                console.log(`☁️ Firestore: Existing customer ${cleanPhone} logged in and profile synced.`);
            } else {
                // Create new customer document
                await setDoc(docRef, userObj);
                console.log(`☁️ Firestore: New customer ${cleanPhone} registered.`);
            }
        } catch (e) {
            console.error("Error syncing customer with Firestore:", e);
            // Fallback to local storage simulation if Firestore fails
            simulateLocalStorageSync(userObj);
        }
    } else {
        // 2. Simulated LocalStorage Mode (fallback)
        simulateLocalStorageSync(userObj);
    }

    // 3. Sync to PHP MySQL Backend
    try {
        const formData = new URLSearchParams();
        formData.append('customer_name', userObj.name);
        formData.append('phone', userObj.phone);
        // Note: Email is completely eliminated from forms. Pass blank to backend for compatibility.
        formData.append('email', '');

        const response = await fetch('submit_customer.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            credentials: 'include',
            body: formData.toString()
        });
        const syncResult = await response.json();
        console.log("MySQL Backend Sync Success:", syncResult);
    } catch (err) {
        console.error("MySQL Backend Sync Failed:", err);
    }

    // 4. Persist Session in LocalStorage
    localStorage.setItem('ks_customer_session', JSON.stringify(userObj));
    return userObj;
}

/**
 * Simulates Firestore using LocalStorage when Firebase is unconfigured
 * @param {Object} userObj 
 */
function simulateLocalStorageSync(userObj) {
    const localDbName = 'ks_simulated_customers';
    let customers = JSON.parse(localStorage.getItem(localDbName)) || {};
    
    if (customers[userObj.phone]) {
        const existing = customers[userObj.phone];
        userObj.joinedAt = existing.joinedAt;
        userObj.address = existing.address || "";
        userObj.serviceHistory = existing.serviceHistory || [];
        userObj.totalBookings = existing.totalBookings || 0;
        userObj.lastBookingDate = existing.lastBookingDate || userObj.joinedAt;
    }
    
    customers[userObj.phone] = userObj;
    localStorage.setItem(localDbName, JSON.stringify(customers));
    console.log(`💾 LocalStorage: Customer ${userObj.phone} synced in simulated database.`);
}

/**
 * Retrieves the currently logged-in customer session
 * @returns {Object|null}
 */
export function getCachedCustomerSession() {
    const session = localStorage.getItem('ks_customer_session');
    if (session) {
        try {
            return JSON.parse(session);
        } catch (e) {
            console.error("Error parsing cached customer session:", e);
            return null;
        }
    }
    return null;
}

/**
 * Logs out the current customer and clears the session
 */
export function logoutCustomer() {
    localStorage.removeItem('ks_customer_session');
    console.log("Logged out customer session.");
}

// Export references to global window object for standard script access
if (typeof window !== 'undefined') {
    window.ksAuth = {
        signUpOrLoginCustomer,
        getCachedCustomerSession,
        logoutCustomer,
        isFirebaseConfigured,
        db: () => db,
        auth: () => auth
    };
}
