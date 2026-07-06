const fs = require('fs');
const path = require('path');

// Mock types so we can evaluate the file
const dataContent = fs.readFileSync(path.join(__dirname, '../src/data.ts'), 'utf8');

// Strip imports and type definitions to safely evaluate in node
const evalContent = dataContent
  .replace(/import type[\s\S]*?;/g, '')
  .replace(/export type[\s\S]*?;/g, '')
  .replace(/:[\s]*?[A-Za-z0-9_\[\]<>|]+[\s]*?=/g, ' =');

// Evaluate the javascript
const sandbox = { console, exports: {} };
try {
  // Simple regex extraction or eval
  const servicesMatch = dataContent.match(/export const servicesData[\s\S]*?=\s*?(\[[\s\S]*?\]);/);
  if (!servicesMatch) {
    console.error("Could not find servicesData in data.ts");
    process.exit(1);
  }
  
  // Clean type annotations for evaluation
  let arrayStr = servicesMatch[1]
    .replace(/:\s*[A-Za-z0-9_<>\[\]|]+/g, ''); // strip type annotations
  
  const services = eval(`(${arrayStr})`);
  console.log(`Successfully parsed ${services.length} services.`);
  
  const missingImages = [];
  const imageCounts = {};
  
  services.forEach(s => {
    if (!s.imageUrl) {
      missingImages.push(s);
    } else {
      imageCounts[s.imageUrl] = (imageCounts[s.imageUrl] || 0) + 1;
    }
  });
  
  console.log("\n--- Services with Missing Images ---");
  if (missingImages.length === 0) {
    console.log("None! All services have an imageUrl defined.");
  } else {
    missingImages.forEach(s => console.log(`- [${s.id}] ${s.name} (Category: ${s.category})`));
  }
  
  console.log("\n--- Image Usage Count (to find fallbacks/duplicates) ---");
  Object.entries(imageCounts).forEach(([img, count]) => {
    if (count > 1) {
      console.log(`- ${img}: used by ${count} services`);
    }
  });
  
} catch (e) {
  console.error("Error evaluating data.ts:", e);
}
