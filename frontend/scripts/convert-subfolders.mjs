/**
 * convert-subfolders.mjs
 * images/services/ और images/slider/ की बची हुई JPG files को WebP में convert करता है
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, '..', 'public');

const DIRS = [
  path.join(PUBLIC, 'images', 'services'),
  path.join(PUBLIC, 'images', 'slider'),
];

async function main() {
  console.log('🔄 Converting remaining JPG/PNG → WebP\n');
  let converted = 0, deleted = 0, totalSaved = 0;

  for (const dir of DIRS) {
    const files = fs.readdirSync(dir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
    for (const file of files) {
      const srcPath = path.join(dir, file);
      const base = path.basename(file, path.extname(file));
      const dstPath = path.join(dir, `${base}.webp`);

      try {
        await sharp(srcPath)
          .resize(1200, 900, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(dstPath);

        const srcSize = fs.statSync(srcPath).size;
        const dstSize = fs.statSync(dstPath).size;
        totalSaved += (srcSize - dstSize);
        console.log(`✅ ${base}.webp [${Math.round(srcSize/1024)}KB → ${Math.round(dstSize/1024)}KB, saved ${((1-dstSize/srcSize)*100).toFixed(0)}%]`);
        fs.unlinkSync(srcPath);
        converted++;
        deleted++;
      } catch(e) {
        console.log(`❌ ${file}: ${e.message}`);
      }
    }
  }

  console.log(`\n✅ Converted & deleted: ${converted} files`);
  console.log(`💾 Space saved: ${(totalSaved/1024/1024).toFixed(2)} MB\n`);
}

main().catch(console.error);
