import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env file
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim().replace(/^"(.*)"$/, '$1');
    env[key] = value;
  }
});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

try {
  const snap = await getDocs(collection(db, 'services'));
  console.log(`Firestore has ${snap.size} services.`);
  
  const services = [];
  snap.forEach(doc => {
    services.push({ id: doc.id, ...doc.data() });
  });

  // Verify specifications structure
  services.forEach(s => {
    if (s.specifications) {
      if (!Array.isArray(s.specifications)) {
        console.log(`Service ${s.id} specifications is NOT an array:`, typeof s.specifications, s.specifications);
      } else {
        s.specifications.forEach((spec, idx) => {
          if (!spec || typeof spec !== 'object') {
            console.log(`Service ${s.id} specification at index ${idx} is not an object:`, spec);
          } else {
            if (spec.label === undefined || spec.label === null) {
              console.log(`Service ${s.id} specification at index ${idx} is missing label:`, spec);
            } else if (typeof spec.label !== 'string') {
              console.log(`Service ${s.id} specification at index ${idx} label is not a string:`, typeof spec.label, spec.label);
            }
            if (spec.value === undefined || spec.value === null) {
              console.log(`Service ${s.id} specification at index ${idx} is missing value:`, spec);
            } else if (typeof spec.value !== 'string' && typeof spec.value !== 'number') {
              console.log(`Service ${s.id} specification at index ${idx} value is not a string/number:`, typeof spec.value, spec.value);
            }
          }
        });
      }
    }
  });
  console.log("Specification verification complete.");
  
} catch (e) {
  console.error("Error reading Firestore:", e);
}

process.exit(0);
