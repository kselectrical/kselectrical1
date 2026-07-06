const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../src/data.ts');
let content = fs.readFileSync(dataFile, 'utf8');

// Target service ID to new image URL mappings
const mappings = {
  "ac-gas-refill": "/ac-gas-refill-greater-noida.jpg",
  "ac-uninstallation": "/ac-uninstallation-greater-noida.jpg",
  "fan-bldc-install": "/bldc-fan-installation-gaur-city.jpg",
  "light-chandelier-install": "/chandelier-installation-noida-extension.jpg",
  "app-ro-install": "/ro-purifier-installation-greater-noida.jpg",
  "app-washing-service": "/washing-machine-tub-deep-clean-greater-noida.jpg",
  "app-geyser-install": "/geyser-installation-noida-extension.jpg",
  "app-fridge-gas-single": "/refrigerator-gas-charging-greater-noida.jpg",
  "app-fridge-gas-double": "/refrigerator-gas-charging-greater-noida.jpg",
  "app-microwave-service": "/microwave-deep-clean-greater-noida.jpg",
  "app-chimney-install": "/kitchen-chimney-installation-gaur-city.jpg",
  "elec-doorbell": "/doorbell-repair-greater-noida.jpg",
  "elec-inverter": "/inverter-battery-service-greater-noida.jpg"
};

// Split by "id: '"
const parts = content.split(/id:\s*'/);
console.log(`Split file into ${parts.length} parts.`);

for (let i = 1; i < parts.length; i++) {
  const part = parts[i];
  // Find the ID (characters up to the closing quote)
  const idEndIndex = part.indexOf("'");
  if (idEndIndex === -1) continue;
  const id = part.substring(0, idEndIndex);
  
  if (mappings[id]) {
    const targetUrl = mappings[id];
    console.log(`Matching service ID: ${id} -> target: ${targetUrl}`);
    
    // We need to replace the imageUrl in this specific block.
    // Let's find "imageUrl: '" in this part
    const imgKey = "imageUrl: '";
    const imgIndex = part.indexOf(imgKey);
    if (imgIndex !== -1) {
      const urlStartIndex = imgIndex + imgKey.length;
      const urlEndIndex = part.indexOf("'", urlStartIndex);
      
      if (urlEndIndex !== -1) {
        const oldUrl = part.substring(urlStartIndex, urlEndIndex);
        // Replace it!
        parts[i] = part.substring(0, urlStartIndex) + targetUrl + part.substring(urlEndIndex);
        console.log(`  Successfully replaced oldUrl: "${oldUrl}" with "${targetUrl}"`);
      }
    }
  }
}

// Join back and write to file
const newContent = parts.join("id: '");
fs.writeFileSync(dataFile, newContent, 'utf8');
console.log("Successfully wrote updated data.ts!");
