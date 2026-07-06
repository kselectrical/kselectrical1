import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDpIRyGly2jrM0OLOhsXZ9P4tt0semol5U",
  authDomain: "kselectrical-3db7e.firebaseapp.com",
  projectId: "kselectrical-3db7e",
  storageBucket: "kselectrical-3db7e.firebasestorage.app",
  messagingSenderId: "1034425592246",
  appId: "1:1034425592246:web:51b375607c9d04d764b917",
  measurementId: "G-MJ507SBP4C"
};

async function main() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  console.log("Fetching services...");
  const snap = await getDocs(collection(db, 'services'));
  console.log(`Found ${snap.size} services.`);
  snap.forEach(doc => {
    const data = doc.data();
    console.log(`- ID: ${doc.id}, Name: ${data.name}, Category: ${data.category}`);
  });
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
