const fs = require('fs');
const path = require('path');

const dataContent = fs.readFileSync(path.join(__dirname, '../src/data.ts'), 'utf8');

const blocks = dataContent.split(/{\s*id:\s*'/);

const services = [];
const imageToServices = {};

for (let i = 1; i < blocks.length; i++) {
  const block = blocks[i];
  const idMatch = block.match(/^([^']+)'/);
  if (!idMatch) continue;
  const id = idMatch[1];

  const nameMatch = block.match(/name:\s*'([^']+)'/);
  const name = nameMatch ? nameMatch[1] : 'Unknown';

  const catMatch = block.match(/category:\s*'([^']+)'/);
  const category = catMatch ? catMatch[1] : 'Unknown';

  const imgMatch = block.match(/imageUrl:\s*'([^']+)'/);
  const imageUrl = imgMatch ? imgMatch[1] : null;

  services.push({ id, name, category, imageUrl });
  if (imageUrl) {
    if (!imageToServices[imageUrl]) {
      imageToServices[imageUrl] = [];
    }
    imageToServices[imageUrl].push({ id, name, category });
  }
}

console.log("\n--- Services Grouped by Image ---");
Object.entries(imageToServices).forEach(([img, svcs]) => {
  if (svcs.length > 1) {
    console.log(`\nImage: ${img} (${svcs.length} services)`);
    svcs.forEach(s => {
      console.log(`  - [${s.id}] ${s.name} (${s.category})`);
    });
  }
});
