/**
 * organize-and-convert.mjs
 * 
 * यह script:
 * 1. सभी service images को public/images/services/ में organize करती है
 * 2. सभी images को WebP format में convert करती है (sharp से)
 * 3. data.ts में imageUrl paths update करती है
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SERVICES_DIR = path.join(PUBLIC_DIR, 'images', 'services');
const DATA_TS_PATH = path.join(__dirname, '..', 'src', 'data.ts');

// सभी service image mappings: पुरानी path → नई filename (without extension)
const SERVICE_IMAGE_MAP = [
  // AC Services
  { oldPath: '/ac-repair-greater-noida.jpg',           newName: 'ac-repair-greater-noida' },
  { oldPath: '/ac-installation-noida-extension.jpg',   newName: 'ac-installation-noida-extension' },
  { oldPath: '/svc_ac_uninstall.jpg',                  newName: 'svc_ac_uninstall' },
  { oldPath: '/ac-service-gaur-city.jpg',              newName: 'ac-service-gaur-city' },
  { oldPath: '/svc_ac_gas_refill.jpg',                 newName: 'svc_ac_gas_refill' },

  // Fan Services
  { oldPath: '/ceiling-fan-repair-greater-noida.jpg',  newName: 'ceiling-fan-repair-greater-noida' },
  { oldPath: '/svc_fan_basic_uninstall.jpg',           newName: 'svc_fan_basic_uninstall' },
  { oldPath: '/svc_fan_basic_repair.jpg',              newName: 'svc_fan_basic_repair' },
  { oldPath: '/bldc-fan-service-gaur-city.jpg',        newName: 'bldc-fan-service-gaur-city' },
  { oldPath: '/svc_fan_bldc_uninstall.jpg',            newName: 'svc_fan_bldc_uninstall' },
  { oldPath: '/svc_fan_bldc_service.jpg',              newName: 'svc_fan_bldc_service' },
  { oldPath: '/fancy-fan-installation-noida-extension.jpg', newName: 'fancy-fan-installation-noida-extension' },
  { oldPath: '/svc_fan_fancy_uninstall.jpg',           newName: 'svc_fan_fancy_uninstall' },
  { oldPath: '/svc_fan_fancy_repair.jpg',              newName: 'svc_fan_fancy_repair' },

  // Light Services
  { oldPath: '/bulb-holder-repair-greater-noida.jpg',  newName: 'bulb-holder-repair-greater-noida' },
  { oldPath: '/svc_light_bulb_repair.jpg',             newName: 'svc_light_bulb_repair' },
  { oldPath: '/tube-light-installation-greater-noida.jpg', newName: 'tube-light-installation-greater-noida' },
  { oldPath: '/svc_light_tube_repair.jpg',             newName: 'svc_light_tube_repair' },
  { oldPath: '/svc_light_tube_uninstall.jpg',          newName: 'svc_light_tube_uninstall' },
  { oldPath: '/fancy-light-repair-noida-extension.jpg',newName: 'fancy-light-repair-noida-extension' },
  { oldPath: '/svc_light_fancy_repair.jpg',            newName: 'svc_light_fancy_repair' },
  { oldPath: '/ceiling-panel-light-installation-gaur-city.jpg', newName: 'ceiling-panel-light-installation-gaur-city' },
  { oldPath: '/chandelier-installation-noida-extension.jpg', newName: 'chandelier-installation-noida-extension' },
  { oldPath: '/svc_light_ceiling_repair.jpg',          newName: 'svc_light_ceiling_repair' },

  // Electrician Services
  { oldPath: '/switchboard-repair-greater-noida.jpg',  newName: 'switchboard-repair-greater-noida' },
  { oldPath: '/svc_elec_switchboard_repair.jpg',       newName: 'svc_elec_switchboard_repair' },
  { oldPath: '/svc_elec_newbox_install.jpg',           newName: 'svc_elec_newbox_install' },
  { oldPath: '/svc_mcb_upgrade.jpg',                   newName: 'svc_mcb_upgrade' },
  { oldPath: '/svc_house_wiring.jpg',                  newName: 'svc_house_wiring' },
  { oldPath: '/doorbell-repair-greater-noida.jpg',     newName: 'doorbell-repair-greater-noida' },
  { oldPath: '/inverter-battery-service-greater-noida.jpg', newName: 'inverter-battery-service-greater-noida' },

  // Appliance - RO
  { oldPath: '/ro-water-purifier-repair-noida-extension.jpg', newName: 'ro-water-purifier-repair-noida-extension' },
  { oldPath: '/svc_ro_filter_service.jpg',             newName: 'svc_ro_filter_service' },
  { oldPath: '/best-ro-service-greater-noida.jpg',     newName: 'best-ro-service-greater-noida' },
  { oldPath: '/svc_app_ro_uninstall.jpg',              newName: 'svc_app_ro_uninstall' },

  // Appliance - Washing Machine
  { oldPath: '/washing-machine-repair-gaur-city.jpg',  newName: 'washing-machine-repair-gaur-city' },
  { oldPath: '/washing-machine-service-greater-noida.jpg', newName: 'washing-machine-service-greater-noida' },
  { oldPath: '/svc_app_washing_uninstall.jpg',         newName: 'svc_app_washing_uninstall' },
  { oldPath: '/svc_washing_tub_clean.jpg',             newName: 'svc_washing_tub_clean' },

  // Appliance - Geyser
  { oldPath: '/geyser-repair-noida-extension.jpg',     newName: 'geyser-repair-noida-extension' },
  { oldPath: '/svc_geyser_descaling.jpg',              newName: 'svc_geyser_descaling' },
  { oldPath: '/geyser-service-greater-noida.jpg',      newName: 'geyser-service-greater-noida' },
  { oldPath: '/svc_app_geyser_uninstall.jpg',          newName: 'svc_app_geyser_uninstall' },

  // Appliance - Refrigerator
  { oldPath: '/fridge-repair-greater-noida.jpg',       newName: 'fridge-repair-greater-noida' },
  { oldPath: '/svc_fridge_gas_charging.jpg',           newName: 'svc_fridge_gas_charging' },
  { oldPath: '/refrigerator-gas-charging-greater-noida.jpg', newName: 'refrigerator-gas-charging-greater-noida' },
  { oldPath: '/refrigerator-service-gaur-city.jpg',    newName: 'refrigerator-service-gaur-city' },

  // Appliance - Microwave
  { oldPath: '/microwave-repair-greater-noida.webp',   newName: 'microwave-repair-greater-noida' },
  { oldPath: '/svc_microwave_cleaning.jpg',            newName: 'svc_microwave_cleaning' },

  // Appliance - Chimney
  { oldPath: '/kitchen-chimney-repair-gaur-city.jpg',  newName: 'kitchen-chimney-repair-gaur-city' },
  { oldPath: '/kitchen-chimney-installation-gaur-city.jpg', newName: 'kitchen-chimney-installation-gaur-city' },
  { oldPath: '/svc_app_chimney_uninstall.jpg',         newName: 'svc_app_chimney_uninstall' },
  { oldPath: '/chimney-cleaning-service-greater-noida.jpg', newName: 'chimney-cleaning-service-greater-noida' },

  // Home Installations
  { oldPath: '/balcony-pigeon-net-installation-greater-noida.jpg', newName: 'balcony-pigeon-net-installation-greater-noida' },
  { oldPath: '/images/services/plumbing-services-greater-noida.jpg', newName: 'plumbing-services-greater-noida' },
  { oldPath: '/images/services/carpentry-work-gaur-city.jpg',      newName: 'carpentry-work-gaur-city' },
  { oldPath: '/images/services/gypsum-false-ceiling-noida-extension.jpg', newName: 'gypsum-false-ceiling-noida-extension' },
];

// Output quality for WebP
const WEBP_QUALITY = 85;
// Max dimension (resize if larger)
const MAX_WIDTH = 800;
const MAX_HEIGHT = 600;

async function convertToWebP(srcPath, dstPath) {
  try {
    await sharp(srcPath)
      .resize(MAX_WIDTH, MAX_HEIGHT, { fit: 'cover', withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(dstPath);
    const srcSize = fs.statSync(srcPath).size;
    const dstSize = fs.statSync(dstPath).size;
    const savings = ((1 - dstSize / srcSize) * 100).toFixed(1);
    return { success: true, srcSize, dstSize, savings };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function main() {
  console.log('🚀 KS Electrical - Image Organize & Convert to WebP\n');
  console.log('='.repeat(60));

  // Step 1: Ensure output directory exists
  if (!fs.existsSync(SERVICES_DIR)) {
    fs.mkdirSync(SERVICES_DIR, { recursive: true });
    console.log(`✅ Created directory: images/services/\n`);
  } else {
    console.log(`📁 Directory exists: images/services/\n`);
  }

  // Step 2: Process each image
  const results = [];
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  let totalSaved = 0;

  for (const item of SERVICE_IMAGE_MAP) {
    const newWebPName = `${item.newName}.webp`;
    const dstPath = path.join(SERVICES_DIR, newWebPName);
    const newUrlPath = `/images/services/${newWebPName}`;

    // Resolve source path
    let srcPath;
    if (item.oldPath.startsWith('/images/')) {
      srcPath = path.join(PUBLIC_DIR, item.oldPath.replace(/^\//, ''));
    } else {
      srcPath = path.join(PUBLIC_DIR, item.oldPath.replace(/^\//, ''));
    }

    // Check if already converted (skip if up to date)
    if (fs.existsSync(dstPath) && fs.existsSync(srcPath)) {
      const dstStat = fs.statSync(dstPath);
      const srcStat = fs.statSync(srcPath);
      // If destination is newer than source and is webp, skip
      if (dstPath.endsWith('.webp') && dstStat.mtime > srcStat.mtime) {
        console.log(`⏭️  SKIP (already converted): ${newWebPName}`);
        results.push({ ...item, newPath: newUrlPath, status: 'skipped' });
        skipCount++;
        continue;
      }
    }

    if (!fs.existsSync(srcPath)) {
      console.log(`❌ NOT FOUND: ${item.oldPath}`);
      results.push({ ...item, newPath: newUrlPath, status: 'missing' });
      errorCount++;
      continue;
    }

    const result = await convertToWebP(srcPath, dstPath);
    if (result.success) {
      console.log(`✅ ${item.newName}.webp  [${(result.srcSize/1024).toFixed(0)}KB → ${(result.dstSize/1024).toFixed(0)}KB, saved ${result.savings}%]`);
      totalSaved += (result.srcSize - result.dstSize);
      results.push({ ...item, newPath: newUrlPath, status: 'converted' });
      successCount++;
    } else {
      console.log(`❌ ERROR ${item.oldPath}: ${result.error}`);
      results.push({ ...item, newPath: newUrlPath, status: 'error', error: result.error });
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Converted: ${successCount} | ⏭️  Skipped: ${skipCount} | ❌ Errors: ${errorCount}`);
  console.log(`💾 Total space saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);

  // Step 3: Update data.ts
  console.log('\n📝 Updating data.ts image paths...');
  let dataTs = fs.readFileSync(DATA_TS_PATH, 'utf8');
  let dataUpdated = 0;

  for (const item of results) {
    if (item.status === 'missing' || item.status === 'error') continue;
    
    // Escape special regex chars in old path
    const escapedOld = item.oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`"imageUrl":\\s*"${escapedOld}"`, 'g');
    const newValue = `"imageUrl": "${item.newPath}"`;
    
    if (regex.test(dataTs)) {
      dataTs = dataTs.replace(regex, newValue);
      dataUpdated++;
    }
  }

  fs.writeFileSync(DATA_TS_PATH, dataTs, 'utf8');
  console.log(`✅ Updated ${dataUpdated} imageUrl paths in data.ts`);

  // Step 4: Summary report
  console.log('\n' + '='.repeat(60));
  console.log('📋 SUMMARY REPORT');
  console.log('='.repeat(60));
  console.log(`📁 All service images → public/images/services/`);
  console.log(`🖼️  Format: WebP (quality: ${WEBP_QUALITY}%, max: ${MAX_WIDTH}x${MAX_HEIGHT}px)`);
  console.log(`📝 data.ts: Updated ${dataUpdated} imageUrl paths`);
  console.log('\n✨ Done! Now run: npm run dev to verify\n');
}

main().catch(console.error);
