/**
 * billing.js - Modular Invoicing and Billing History Logic
 * Encapsulates all Firestore transactions for customer invoices and receipts.
 */

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js";

const defaultFirebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

const firebaseConfig = window.firebaseConfig || JSON.parse(localStorage.getItem('ks_firebase_config')) || defaultFirebaseConfig;

let app;
let db = null;

export function initializeFirebase() {
    const isConfigured = firebaseConfig.projectId && 
                         firebaseConfig.projectId !== "" && 
                         firebaseConfig.projectId !== "YOUR_PROJECT_ID" && 
                         !firebaseConfig.projectId.startsWith("YOUR_") &&
                         firebaseConfig.apiKey &&
                         firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY" &&
                         !firebaseConfig.apiKey.startsWith("YOUR_");
    if (isConfigured) {
        try {
            app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
            db = getFirestore(app);
            console.log("🔥 Firestore initialized in billing.js");
        } catch (e) {
            console.error("Error initializing Firebase in billing.js:", e);
        }
    } else {
        console.warn("⚠️ Firebase credentials missing or placeholder in billing.js. Running in Simulated LocalStorage Mode.");
    }
}

// Initialize
initializeFirebase();

/**
 * Saves a digital invoice to Firestore under the 'invoices' collection
 * @param {Object} invoiceData - Full details of the generated invoice
 * @returns {Promise<Object>} The saved invoice object
 */
export async function saveInvoiceToFirestore(invoiceData) {
    if (!invoiceData.invoiceNumber) {
        throw new Error("Invoice Number is required to save an invoice.");
    }
    if (!invoiceData.customerDetails || !invoiceData.customerDetails.phone) {
        throw new Error("Customer phone number is required to save an invoice.");
    }

    const cleanPhone = invoiceData.customerDetails.phone.trim().replace(/\D/g, '');
    invoiceData.customerDetails.phone = cleanPhone;
    
    // Ensure chronological timestamp format
    if (!invoiceData.generatedDate) {
        invoiceData.generatedDate = new Date().toISOString();
    }

    // 1. Live Firestore Sync
    if (db) {
        try {
            const docRef = doc(db, "invoices", invoiceData.invoiceNumber);
            await setDoc(docRef, invoiceData);
            console.log(`☁️ Firestore: Invoice ${invoiceData.invoiceNumber} saved for customer ${cleanPhone}.`);
        } catch (e) {
            console.error("Error saving invoice to Firestore:", e);
            simulateInvoiceSave(invoiceData);
        }
    } else {
        // 2. Simulated LocalStorage Mode
        simulateInvoiceSave(invoiceData);
    }

    return invoiceData;
}

/**
 * Fetches the billing history (all digital invoices) associated with a customer's mobile number
 * @param {string} phone - 10-digit customer mobile number
 * @returns {Promise<Array>} List of customer invoices sorted newest to oldest
 */
export async function fetchBillingHistory(phone) {
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
        throw new Error("Please enter a valid 10-digit mobile number to fetch billing history.");
    }

    // 1. Live Firestore Query
    if (db) {
        try {
            const q = query(
                collection(db, "invoices"),
                where("customerDetails.phone", "==", cleanPhone)
            );
            const querySnapshot = await getDocs(q);
            const invoices = [];
            querySnapshot.forEach((doc) => {
                invoices.push(doc.data());
            });

            // Sort newest to oldest in-memory to prevent indexing requirements crashing search
            return invoices.sort((a, b) => new Date(b.generatedDate).getTime() - new Date(a.generatedDate).getTime());
        } catch (e) {
            console.error("Error fetching invoices from Firestore:", e);
            return fetchSimulatedInvoices(cleanPhone);
        }
    }

    // 2. Simulated LocalStorage Fallback
    return fetchSimulatedInvoices(cleanPhone);
}

/**
 * Simulates saving an invoice to LocalStorage
 * @param {Object} invoiceData 
 */
function simulateInvoiceSave(invoiceData) {
    const localDbName = 'ks_simulated_invoices';
    let invoices = JSON.parse(localStorage.getItem(localDbName)) || [];
    
    // Check if invoice already exists
    const index = invoices.findIndex(inv => inv.invoiceNumber === invoiceData.invoiceNumber);
    if (index !== -1) {
        invoices[index] = invoiceData;
    } else {
        invoices.push(invoiceData);
    }
    
    localStorage.setItem(localDbName, JSON.stringify(invoices));
    console.log(`💾 LocalStorage: Invoice ${invoiceData.invoiceNumber} saved in simulated database.`);
}

/**
 * Retrieves simulated invoices from LocalStorage
 * @param {string} phone 
 * @returns {Array}
 */
function fetchSimulatedInvoices(phone) {
    const localDbName = 'ks_simulated_invoices';
    const invoices = JSON.parse(localStorage.getItem(localDbName)) || [];
    
    return invoices
        .filter(inv => inv.customerDetails && inv.customerDetails.phone.replace(/\D/g, '') === phone)
        .sort((a, b) => new Date(b.generatedDate).getTime() - new Date(a.generatedDate).getTime());
}

// Export references to global window object
if (typeof window !== 'undefined') {
    window.ksBilling = {
        saveInvoiceToFirestore,
        fetchBillingHistory
    };
}
