const https = require('https');

// 1. Fetch data from Firestore
function getCollection(collectionName) {
  return new Promise((resolve, reject) => {
    const url = `https://firestore.googleapis.com/v1/projects/kselectrical-3db7e/databases/(default)/documents/${collectionName}?pageSize=300`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.documents || []);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function parseFirestoreDoc(doc) {
  const fields = doc.fields || {};
  const res = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value.stringValue !== undefined) res[key] = value.stringValue;
    else if (value.integerValue !== undefined) res[key] = Number(value.integerValue);
    else if (value.doubleValue !== undefined) res[key] = Number(value.doubleValue);
    else if (value.booleanValue !== undefined) res[key] = value.booleanValue;
    else if (value.arrayValue !== undefined) {
      const arr = value.arrayValue.values || [];
      res[key] = arr.map(item => {
        if (item.mapValue) {
          const itemFields = item.mapValue.fields || {};
          const parsedItem = {};
          for (const [ik, iv] of Object.entries(itemFields)) {
            if (iv.stringValue !== undefined) parsedItem[ik] = iv.stringValue;
            else if (iv.integerValue !== undefined) parsedItem[ik] = Number(iv.integerValue);
            else if (iv.doubleValue !== undefined) parsedItem[ik] = Number(iv.doubleValue);
            else if (iv.booleanValue !== undefined) parsedItem[ik] = iv.booleanValue;
          }
          return parsedItem;
        }
        return item.stringValue || '';
      });
    } else if (value.mapValue !== undefined) {
      // Handle simple map or timestamp value
      res[key] = value.mapValue.fields || {};
    } else if (value.timestampValue !== undefined) {
      res[key] = value.timestampValue;
    } else {
      res[key] = value;
    }
  }
  // Extract ID from path
  res.id = doc.name.split('/').pop();
  return res;
}

// Helper functions from BillBook.tsx
const getSafeDate = (val) => {
  if (!val) return new Date();
  if (typeof val === 'object' && val !== null && 'toDate' in val && typeof val.toDate === 'function') {
    return val.toDate();
  }
  if (typeof val === 'object' && val !== null && 'seconds' in val && typeof val.seconds === 'number') {
    return new Date(val.seconds * 1000);
  }
  const d = new Date(val);
  return isNaN(d.getTime()) ? new Date() : d;
};

const getServiceBadgeStyle = (name) => {
  if (!name) return 'bg-slate-50 text-slate-700 border border-slate-250';
  const lower = name.toLowerCase();
  if (lower.includes('ac') || lower.includes('cooling') || lower.includes('split') || lower.includes('jet') || lower.includes('condenser') || lower.includes('gas')) {
    return 'bg-sky-50 text-sky-700 border border-sky-200';
  }
  if (lower.includes('electric') || lower.includes('switch') || lower.includes('wire') || lower.includes('fan') || lower.includes('light') || lower.includes('board') || lower.includes('socket') || lower.includes('mcb')) {
    return 'bg-orange-50 text-orange-700 border border-orange-200';
  }
  if (lower.includes('ro ') || lower.includes('water') || lower.includes('filter') || lower.includes('purifier')) {
    return 'bg-purple-50 text-purple-700 border border-purple-200';
  }
  if (lower.includes('washing') || lower.includes('machine') || lower.includes('fridge') || lower.includes('refrigerator') || lower.includes('compressor')) {
    return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
  }
  return 'bg-slate-50 text-slate-700 border border-slate-250';
};

async function testSimulate() {
  try {
    console.log("Fetching bookings and invoices from Firestore...");
    const rawBks = await getCollection('bookings');
    const rawInvs = await getCollection('invoices');
    
    console.log(`Fetched ${rawBks.length} bookings, ${rawInvs.length} invoices.`);
    
    const bookings = rawBks.map(parseFirestoreDoc);
    const invoices = rawInvs.map(parseFirestoreDoc);
    
    // Sort logic from App.tsx
    const getSafeSortDate = (val) => {
      if (!val) return new Date(0);
      if (typeof val === 'object' && val !== null && 'toDate' in val && typeof val.toDate === 'function') {
        return val.toDate();
      }
      if (typeof val === 'object' && val !== null && 'seconds' in val && typeof val.seconds === 'number') {
        return new Date(val.seconds * 1000);
      }
      const d = new Date(val);
      return isNaN(d.getTime()) ? new Date(0) : d;
    };

    const combined = [...bookings, ...invoices].sort(
      (a, b) => getSafeSortDate(b.createdAt).getTime() - getSafeSortDate(a.createdAt).getTime()
    );
    
    console.log(`Combined total: ${combined.length} records.`);
    
    // Simulate BillBook calculations and render mapping
    console.log("Simulating BillBook calculations...");
    const totalBilledVal = combined
      .filter(b => b && (b.status === 'Completed' || b.status === 'Pending'))
      .reduce((sum, b) => sum + (b.subtotal || 0), 0);
    
    const pendingBillsCount = combined.filter(b => b && b.status === 'Pending').length;
    console.log(`totalBilledVal: ${totalBilledVal}, pendingBillsCount: ${pendingBillsCount}`);

    console.log("Simulating filteredBillbook filter...");
    const billSearchQuery = '';
    const billStatusFilter = 'All';
    const filteredBillbook = combined.filter(b => {
      if (!b) return false;
      const q = billSearchQuery.toLowerCase().trim();
      const matchesQuery = q === '' ||
        (b.id || '').toLowerCase().includes(q) ||
        (b.customerName || '').toLowerCase().includes(q) ||
        (b.phone || '').includes(q) ||
        (b.address || '').toLowerCase().includes(q);
        
      const matchesStatus = billStatusFilter === 'All' || b.status === billStatusFilter;
      return matchesQuery && matchesStatus;
    });

    console.log(`filteredBillbook size: ${filteredBillbook.length}`);

    console.log("Simulating JSX loop render for each row...");
    filteredBillbook.forEach((b, idx) => {
      try {
        const base = Math.round((b.subtotal || 0) / 1.18);
        const gst = (b.subtotal || 0) - base;
        
        // Date formatting check
        const dateStr = getSafeDate(b.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = getSafeDate(b.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        
        // Client Info check
        const clientName = b.customerName;
        const phone = b.phone;
        const address = b.address;
        
        // Items Loop check
        const items = b.items || [];
        items.filter(Boolean).forEach((item, itemIdx) => {
          const style = getServiceBadgeStyle(item.serviceName);
          const name = item.serviceName;
          const brand = item.brand;
          const quantity = item.quantity;
        });

        // Price formatting check
        const subtotalStr = (b.subtotal || 0).toLocaleString('en-IN');
        const baseStr = base.toLocaleString('en-IN');
        const gstStr = gst.toLocaleString('en-IN');
        
        // Status formatting check
        const statusLabel = b.status === 'Completed' ? 'Paid' : b.status === 'Cancelled' ? 'Cancelled' : 'Unpaid';
      } catch (err) {
        console.error(`CRASH DETECTED at row index ${idx} (Booking ID: ${b.id}):`);
        console.error(err);
        console.log("Row object dump:", JSON.stringify(b, null, 2));
        process.exit(1);
      }
    });

    console.log("SUCCESS: Simulation finished. No crashes detected in the simulated render loop!");
  } catch (e) {
    console.error("Fetch/Parse failed:", e);
  }
}

testSimulate();
