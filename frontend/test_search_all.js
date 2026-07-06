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

function getEditDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[&\/\\#,+()$~%.'":*?<>{}\[\]-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 0);
}

function scoreService(service, query) {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return { service, score: 0, matchedWords: [] };
  }

  const nameTokens = tokenize(service.name);
  const categoryTokens = tokenize(service.category);
  const subcategoryTokens = tokenize(service.subcategory || '');
  const descTokens = tokenize(service.description);
  const specTokens = (service.specifications || [])
    .flatMap(spec => [...tokenize(spec.label), ...tokenize(spec.value)]);

  let score = 0;
  const matchedWords = [];

  for (const qToken of queryTokens) {
    let bestTokenScore = 0;

    const checkMatch = (targetTokens, weight) => {
      for (const tToken of targetTokens) {
        let currentTokenScore = 0;

        if (qToken === tToken) {
          currentTokenScore = 10 * weight;
        } else if (tToken.includes(qToken) || qToken.includes(tToken)) {
          currentTokenScore = 5 * weight;
        } else if (qToken.length > 2 && tToken.length > 2) {
          const dist = getEditDistance(qToken, tToken);
          const maxDist = qToken.length > 5 ? 2 : 1;
          if (dist <= maxDist) {
            currentTokenScore = (10 - dist * 3) * 0.5 * weight;
          }
        }

        if (currentTokenScore > bestTokenScore) {
          bestTokenScore = currentTokenScore;
        }
      }
    };

    checkMatch(nameTokens, 3.0);
    checkMatch(subcategoryTokens, 2.0);
    checkMatch(categoryTokens, 1.5);
    checkMatch(descTokens, 1.0);
    checkMatch(specTokens, 0.8);

    if (bestTokenScore > 0) {
      score += bestTokenScore;
      matchedWords.push(qToken);
    }
  }

  const matchRatio = matchedWords.length / queryTokens.length;
  score = score * (1 + matchRatio * 0.5);

  return { service, score, matchedWords };
}

async function main() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const snap = await getDocs(collection(db, 'services'));
  const services = [];
  snap.forEach(doc => {
    services.push(doc.data());
  });

  const queries = [
    "AC Repair",
    "AC Service",
    "Split AC Jet Cleaning",
    "Washing Machine Repair",
    "RO Repair",
    "Refrigerator Repair",
    "Electrician",
    "Chimney"
  ];

  for (const q of queries) {
    console.log(`\n=================== QUERY: "${q}" ===================`);
    const scored = services
      .map(service => scoreService(service, q))
      .filter(item => item.score > 0);

    scored.sort((a, b) => b.score - a.score);

    console.log(`Found ${scored.length} matching services:`);
    scored.slice(0, 5).forEach(item => {
      console.log(`- Score: ${item.score.toFixed(2)}, Name: "${item.service.name}", Matched: ${JSON.stringify(item.matchedWords)}`);
    });
  }

  process.exit(0);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
