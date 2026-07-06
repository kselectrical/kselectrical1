/**
 * admin.js - Advanced Customer History Search and Timeline Renderer
 * Concurrently queries Firestore for registration, bookings, and billing histories,
 * sorting them chronologically to render an interactive, beautiful timeline.
 */

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js";

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
            console.log("🔥 Firestore initialized in admin.js");
        } catch (e) {
            console.error("Error initializing Firebase in admin.js:", e);
        }
    } else {
        console.warn("⚠️ Firebase credentials missing or placeholder in admin.js. Running in Simulated LocalStorage Mode.");
    }
}

// Initialize
initializeFirebase();

/**
 * Searches and consolidates all customer interactions from Firestore
 * @param {string} phone - 10-digit customer mobile number
 * @returns {Promise<Object>} An object containing customer profile and sorted timeline events
 */
export async function searchCustomerHistory(phone) {
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
        throw new Error("Please enter a valid 10-digit mobile number to search.");
    }

    let customerProfile = null;
    let timelineEvents = [];

    if (db) {
        try {
            // Run Firestore queries concurrently for maximum efficiency
            const [customerSnap, bookingsSnap, invoicesSnap] = await Promise.all([
                getDoc(doc(db, "Customers", cleanPhone)),
                getDocs(query(collection(db, "bookings"), where("phone", "==", cleanPhone))),
                getDocs(query(collection(db, "invoices"), where("customerDetails.phone", "==", cleanPhone)))
            ]);

            // 1. Process Customer Profile & Registration
            if (customerSnap.exists()) {
                customerProfile = customerSnap.data();
                timelineEvents.push({
                    type: 'registration',
                    title: 'Joined Website (रजिस्ट्रेशन)',
                    description: `Customer account registered under mobile number ${cleanPhone}.`,
                    date: customerProfile.joinedAt || new Date().toISOString(),
                    status: 'Completed',
                    meta: { name: customerProfile.name }
                });
            }

            // 2. Process Booking History
            bookingsSnap.forEach((doc) => {
                const booking = doc.data();
                timelineEvents.push({
                    type: 'booking',
                    title: `Service Booking: ${booking.service_type || 'General Service'}`,
                    description: `Service requested for address: ${booking.address || 'N/A'} (${booking.area || 'N/A'}). Preferred Time: ${booking.preferred_time || 'N/A'}`,
                    date: booking.created_at || booking.preferred_date,
                    status: booking.status || 'Pending',
                    meta: { 
                        id: doc.id,
                        subtotal: booking.subtotal || 0,
                        items: booking.items_json ? JSON.parse(booking.items_json) : []
                    }
                });
            });

            // 3. Process Billing History
            invoicesSnap.forEach((doc) => {
                const invoice = doc.data();
                // Reconstruct items summary
                const itemsSummary = invoice.items 
                    ? invoice.items.map(i => `${i.serviceName} (${i.quantity}x)`).join(', ') 
                    : 'Digital Invoice';

                timelineEvents.push({
                    type: 'invoice',
                    title: `Invoice Generated: #${invoice.invoiceNumber}`,
                    description: `Items: ${itemsSummary}. Paid via: ${invoice.payment_method || 'Cash'}`,
                    date: invoice.generatedDate || invoice.created_at,
                    status: invoice.payment_status || 'Paid',
                    meta: { 
                        id: doc.id,
                        amount: invoice.totalAmount || invoice.grand_total || 0,
                        balance: invoice.balance || 0
                    }
                });
            });
        } catch (e) {
            console.error("Firestore query failed. Falling back to Simulated Database.", e);
            return searchSimulatedCustomerHistory(cleanPhone);
        }
    } else {
        // Fallback to simulated local database
        return searchSimulatedCustomerHistory(cleanPhone);
    }

    // Sort all events chronologically (newest to oldest)
    timelineEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // If no profile found in Firestore but we have events, create a dummy profile from events
    if (!customerProfile && timelineEvents.length > 0) {
        const regEvent = timelineEvents.find(e => e.type === 'registration');
        const bookingEvent = timelineEvents.find(e => e.type === 'booking');
        const name = regEvent ? regEvent.meta.name : (bookingEvent ? 'Customer' : 'Valued Customer');
        customerProfile = {
            name: name,
            phone: cleanPhone,
            joinedAt: regEvent ? regEvent.date : new Date().toISOString()
        };
    }

    return {
        profile: customerProfile,
        events: timelineEvents
    };
}

/**
 * Searches the simulated LocalStorage database for customer history
 * @param {string} phone 
 * @returns {Object}
 */
function searchSimulatedCustomerHistory(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Fetch simulated data
    const customers = JSON.parse(localStorage.getItem('ks_simulated_customers')) || {};
    const bookings = JSON.parse(localStorage.getItem('ks_simulated_bookings')) || [];
    const invoices = JSON.parse(localStorage.getItem('ks_simulated_invoices')) || [];

    let customerProfile = customers[cleanPhone] || null;
    let timelineEvents = [];

    // 1. Account registration event
    if (customerProfile) {
        timelineEvents.push({
            type: 'registration',
            title: 'Joined Website (रजिस्ट्रेशन)',
            description: `Customer account registered under mobile number ${cleanPhone}.`,
            date: customerProfile.joinedAt,
            status: 'Completed',
            meta: { name: customerProfile.name }
        });
    }

    // 2. Bookings
    bookings.forEach((booking) => {
        if (booking.phone.replace(/\D/g, '') === cleanPhone || (booking.alternate_phone && booking.alternate_phone.replace(/\D/g, '') === cleanPhone)) {
            timelineEvents.push({
                type: 'booking',
                title: `Service Booking: ${booking.service_type}`,
                description: `Service requested for address: ${booking.address} (${booking.area}). Preferred Time: ${booking.preferred_time}`,
                date: booking.created_at || new Date().toISOString(),
                status: booking.status || 'Pending',
                meta: { 
                    id: booking.id || 'BK-Sim', 
                    subtotal: booking.subtotal || 0,
                    items: booking.items_json ? JSON.parse(booking.items_json) : []
                }
            });
        }
    });

    // 3. Invoices
    invoices.forEach((invoice) => {
        if (invoice.customerDetails && invoice.customerDetails.phone.replace(/\D/g, '') === cleanPhone) {
            const itemsSummary = invoice.items 
                ? invoice.items.map(i => `${i.serviceName} (${i.quantity}x)`).join(', ') 
                : 'Digital Invoice';

            timelineEvents.push({
                type: 'invoice',
                title: `Invoice Generated: #${invoice.invoiceNumber}`,
                description: `Items: ${itemsSummary}. Paid via: ${invoice.payment_method || 'Cash'}`,
                date: invoice.generatedDate || new Date().toISOString(),
                status: invoice.payment_status || 'Paid',
                meta: { 
                    id: invoice.invoiceNumber,
                    amount: invoice.totalAmount || invoice.grand_total || 0,
                    balance: invoice.balance || 0
                }
            });
        }
    });

    // Sort events
    timelineEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Create profile if missing
    if (!customerProfile && timelineEvents.length > 0) {
        customerProfile = {
            name: 'Customer',
            phone: cleanPhone,
            joinedAt: timelineEvents[timelineEvents.length - 1].date
        };
    }

    return {
        profile: customerProfile,
        events: timelineEvents
    };
}

/**
 * Renders the consolidated customer history into a beautiful, chronological timeline UI
 * @param {Array} events - Chronological array of events
 * @param {string} containerId - DOM container ID to inject the timeline
 */
export function renderTimeline(events, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!events || events.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #94a3b8; font-weight: bold;">
                <div style="font-size: 40px; margin-bottom: 10px;">🔍</div>
                No records found. This customer has no registrations, service bookings, or invoices logged.
            </div>
        `;
        return;
    }

    let html = `
        <div class="timeline-wrapper" style="position: relative; padding: 10px 0; margin-top: 10px; font-family: inherit;">
            <!-- Center Line -->
            <div class="timeline-line" style="position: absolute; left: 20px; top: 0; bottom: 0; width: 2px; background: #e2e8f0; z-index: 1;"></div>
    `;

    events.forEach((event) => {
        const eventDate = new Date(event.date);
        const dateFormatted = eventDate.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        const timeFormatted = eventDate.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });

        // Styling tokens based on event type
        let badgeColor = '';
        let badgeBg = '';
        let badgeBorder = '';
        let badgeIcon = '';
        let statusBadge = '';
        let extraMarkup = '';

        if (event.type === 'registration') {
            badgeColor = '#16a34a'; // Green
            badgeBg = '#f0fdf4';
            badgeBorder = '#bbf7d0';
            badgeIcon = '👤';
            statusBadge = `<span style="background: #dcfce7; color: #15803d; font-size: 10px; padding: 2px 8px; border-radius: 9999px; font-weight: bold;">Registered</span>`;
        } else if (event.type === 'booking') {
            badgeColor = '#2563eb'; // Blue
            badgeBg = '#eff6ff';
            badgeBorder = '#bfdbfe';
            badgeIcon = '🛠️';
            
            const isCompleted = event.status === 'Completed';
            const isCancelled = event.status === 'Cancelled';
            let statusBg = '#fef3c7'; // Amber (Pending)
            let statusText = '#d97706';
            if (isCompleted) {
                statusBg = '#dcfce7'; // Green
                statusText = '#15803d';
            } else if (isCancelled) {
                statusBg = '#fee2e2'; // Red
                statusText = '#b91c1c';
            }
            
            statusBadge = `<span style="background: ${statusBg}; color: ${statusText}; font-size: 10px; padding: 2px 8px; border-radius: 9999px; font-weight: bold;">${event.status}</span>`;
            
            if (event.meta.subtotal > 0) {
                extraMarkup = `
                    <div style="margin-top: 8px; font-size: 11px; font-weight: bold; color: #475569;">
                        Estimated Value: <span style="color: #2563eb;">₹${event.meta.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                `;
            }
        } else if (event.type === 'invoice') {
            badgeColor = '#d97706'; // Amber/Gold
            badgeBg = '#fffbeb';
            badgeBorder = '#fef3c7';
            badgeIcon = '📄';

            const isPaid = event.status === 'Paid';
            const statusBg = isPaid ? '#dcfce7' : '#fee2e2';
            const statusText = isPaid ? '#15803d' : '#b91c1c';

            statusBadge = `<span style="background: ${statusBg}; color: ${statusText}; font-size: 10px; padding: 2px 8px; border-radius: 9999px; font-weight: bold;">Invoice ${event.status}</span>`;

            extraMarkup = `
                <div style="margin-top: 8px; font-size: 12px; font-weight: 850; color: #0f172a;">
                    Amount Invoiced: <span style="color: #0284c7; font-size: 14px;">₹${event.meta.amount.toLocaleString('en-IN')}</span>
                    ${event.meta.balance > 0 ? `<span style="color: #b91c1c; font-size: 11px; margin-left: 10px;">(Pending: ₹${event.meta.balance.toLocaleString('en-IN')})</span>` : ''}
                </div>
            `;
        }

        html += `
            <!-- Timeline Item -->
            <div class="timeline-item" style="position: relative; margin-bottom: 25px; padding-left: 50px; z-index: 2; transition: all 0.2s ease;">
                <!-- Timeline Dot Icon -->
                <div class="timeline-dot" style="
                    position: absolute; 
                    left: 2px; 
                    top: 2px; 
                    width: 38px; 
                    height: 38px; 
                    border-radius: 50%; 
                    background: ${badgeBg}; 
                    border: 2px solid ${badgeBorder}; 
                    color: ${badgeColor}; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-size: 16px; 
                    z-index: 3;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                ">
                    ${badgeIcon}
                </div>
                
                <!-- Timeline Content Card -->
                <div class="timeline-card" style="
                    background: white; 
                    border: 1px solid #e2e8f0; 
                    border-radius: 12px; 
                    padding: 15px 20px; 
                    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                ">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px; margin-bottom: 6px;">
                        <span style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">
                            📅 ${dateFormatted} • 🕒 ${timeFormatted}
                        </span>
                        ${statusBadge}
                    </div>
                    
                    <h4 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 800; color: #1e293b;">
                        ${event.title}
                    </h4>
                    
                    <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5; font-weight: 500;">
                        ${event.description}
                    </p>
                    
                    ${extraMarkup}
                </div>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;

    // Add CSS animations dynamically to make it feel extremely premium
    if (!document.getElementById('timeline-premium-styles')) {
        const style = document.createElement('style');
        style.id = 'timeline-premium-styles';
        style.innerHTML = `
            .timeline-item:hover .timeline-card {
                transform: translateX(5px);
                border-color: #cbd5e1;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }
            .timeline-item:hover .timeline-dot {
                transform: scale(1.1);
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .timeline-dot {
                transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
            }
        `;
        document.head.appendChild(style);
    }
}

// Export references to global window object
if (typeof window !== 'undefined') {
    window.ksAdmin = {
        searchCustomerHistory,
        renderTimeline
    };
}
