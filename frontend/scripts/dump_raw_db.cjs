const https = require('https');

function getCollection(collectionName) {
  return new Promise((resolve, reject) => {
    const url = `https://firestore.googleapis.com/v1/projects/kselectrical-3db7e/databases/(default)/documents/${collectionName}?pageSize=100`;
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

async function runDump() {
  try {
    const bookings = await getCollection('bookings');
    const invoices = await getCollection('invoices');
    console.log(`--- BOOKINGS DUMP (${bookings.length} docs) ---`);
    bookings.forEach(doc => {
      console.log(`Doc ID: ${doc.name.split('/').pop()}`);
      console.log("Fields:", JSON.stringify(doc.fields, null, 2));
    });
    console.log(`\n--- INVOICES DUMP (${invoices.length} docs) ---`);
    invoices.forEach(doc => {
      console.log(`Doc ID: ${doc.name.split('/').pop()}`);
      console.log("Fields:", JSON.stringify(doc.fields, null, 2));
    });
  } catch (e) {
    console.error(e);
  }
}

runDump();
