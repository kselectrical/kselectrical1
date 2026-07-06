// compress-images.mjs — Compress all PNG images in /public using sharp
// Run: node scripts/compress-images.mjs

import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';

const PUBLIC_DIR = new URL('../public', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const DIST_DIR   = new URL('../dist',   import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

const TARGET_DIRS = [PUBLIC_DIR, DIST_DIR];

// Only compress these extensions
const COMPRESS_EXT = ['.png', '.jpg', '.jpeg'];

let totalSaved = 0;
let totalFiles = 0;

async function compressFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (!COMPRESS_EXT.includes(ext)) return;

  const sizeBefore = statSync(filePath).size;

  try {
    if (ext === '.png') {
      const buf = await sharp(filePath)
        .png({ quality: 80, compressionLevel: 9, effort: 10 })
        .toBuffer();
      // Only overwrite if smaller
      if (buf.length < sizeBefore) {
        await sharp(buf).toFile(filePath);
        const saved = sizeBefore - buf.length;
        totalSaved += saved;
        totalFiles++;
        console.log(`✅ ${basename(filePath)}: ${(sizeBefore/1024).toFixed(0)}KB → ${(buf.length/1024).toFixed(0)}KB  (-${(saved/1024).toFixed(0)}KB)`);
      } else {
        console.log(`⏭️  ${basename(filePath)}: already optimal`);
      }
    } else {
      // JPEG
      const buf = await sharp(filePath)
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer();
      if (buf.length < sizeBefore) {
        await sharp(buf).toFile(filePath);
        const saved = sizeBefore - buf.length;
        totalSaved += saved;
        totalFiles++;
        console.log(`✅ ${basename(filePath)}: ${(sizeBefore/1024).toFixed(0)}KB → ${(buf.length/1024).toFixed(0)}KB  (-${(saved/1024).toFixed(0)}KB)`);
      } else {
        console.log(`⏭️  ${basename(filePath)}: already optimal`);
      }
    }
  } catch (e) {
    console.warn(`⚠️  Skipped ${basename(filePath)}: ${e.message}`);
  }
}

async function compressDir(dir) {
  let entries;
  try { entries = readdirSync(dir); } catch { return; }
  for (const entry of entries) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      await compressDir(full);
    } else {
      await compressFile(full);
    }
  }
}

console.log('🔧 Compressing images...\n');
for (const dir of TARGET_DIRS) {
  await compressDir(dir);
}
console.log(`\n🎉 Done! Compressed ${totalFiles} files, saved ${(totalSaved/1024).toFixed(0)} KB total.`);
