const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

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
  const snap = await getDocs(collection(db, 'services'));
  let ok = true;
  snap.forEach(doc => {
    const s = doc.data();
    if (s.specifications) {
      if (!Array.isArray(s.specifications)) {
        console.log(`Service ${s.id} has specifications that is not an array:`, s.specifications);
        ok = false;
      } else {
        s.specifications.forEach((spec, idx) => {
          if (spec === null || typeof spec !== 'object') {
            console.log(`Service ${s.id} has invalid spec at index ${idx}:`, spec);
            ok = false;
          } else {
            if (typeof spec.label !== 'string') {
              console.log(`Service ${s.id} has non-string label at index ${idx}:`, spec.label);
              ok = false;
            }
            if (typeof spec.value !== 'string') {
              console.log(`Service ${s.id} has non-string value at index ${idx}:`, spec.value);
              ok = false;
            }
          }
        });
      }
    }
  });
  if (ok) {
    console.log("All services have perfectly valid specifications structure!");
  }
  process.exit(0);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
