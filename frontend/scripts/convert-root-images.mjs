/**
 * convert-root-images.mjs
 * Root public/ folder की सभी JPG/PNG files को WebP में convert करता है
 * और source code में paths update करता है।
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SRC_DIR = path.join(__dirname, '..', 'src');

// WebP settings
const WEBP_QUALITY = 85;
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 900;

// इन files को convert नहीं करना (special files)
const SKIP_FILES = new Set([
  'favicon.png',    // favicon PNG रहना चाहिए
  'favicon.webp',
  'log.png',        // logo files
  'log.webp',
]);

// Root public folder की सभी JPG/PNG files ढूंढो
function getRootImageFiles() {
  return fs.readdirSync(PUBLIC_DIR)
    .filter(f => {
      const ext = path.extname(f).toLowerCase();
      return (ext === '.jpg' || ext === '.jpeg' || ext === '.png') && !SKIP_FILES.has(f);
    });
}

// किसी file का WebP version पहले से exists करता है?
function webpExists(filename) {
  const base = path.basename(filename, path.extname(filename));
  return fs.existsSync(path.join(PUBLIC_DIR, `${base}.webp`));
}

async function convertToWebP(srcFile) {
  const srcPath = path.join(PUBLIC_DIR, srcFile);
  const base = path.basename(srcFile, path.extname(srcFile));
  const dstPath = path.join(PUBLIC_DIR, `${base}.webp`);

  try {
    await sharp(srcPath)
      .resize(MAX_WIDTH, MAX_HEIGHT, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(dstPath);

    const srcSize = fs.statSync(srcPath).size;
    const dstSize = fs.statSync(dstPath).size;
    const savings = ((1 - dstSize / srcSize) * 100).toFixed(1);
    return { success: true, dstFile: `${base}.webp`, srcSize, dstSize, savings };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Source files में old extension को .webp से replace करो
function updateSourceReferences(conversions) {
  const sourceFiles = [];

  // Recursively find all .ts, .tsx files in src/
  function findFiles(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        findFiles(fullPath);
      } else if (/\.(ts|tsx|js|mjs)$/.test(entry.name)) {
        sourceFiles.push(fullPath);
      }
    }
  }
  findFiles(SRC_DIR);

  let totalReplaced = 0;

  for (const filePath of sourceFiles) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    for (const conv of conversions) {
      if (!conv.success) continue;
      const oldBase = path.basename(conv.srcFile, path.extname(conv.srcFile));
      const oldExt = path.extname(conv.srcFile);

      // Replace all occurrences of /filename.jpg with /filename.webp (and .jpeg, .png)
      const patterns = [
        // with quotes: '/filename.jpg' or "/filename.jpg"
        { from: new RegExp(`(['"\`])/${oldBase}\\${oldExt}(['"\`])`, 'g'), to: `$1/${oldBase}.webp$2` },
        // without leading slash in some cases
        { from: new RegExp(`(['"\`])${oldBase}\\${oldExt}(['"\`])`, 'g'), to: `$1${oldBase}.webp$2` },
        // in template literals or JSX: /${filename}.jpg
        { from: new RegExp(`(/)${oldBase}\\${oldExt}(?=['"\`\\s])`, 'g'), to: `$1${oldBase}.webp` },
      ];

      for (const pat of patterns) {
        const newContent = content.replace(pat.from, pat.to);
        if (newContent !== content) {
          content = newContent;
          changed = true;
          totalReplaced++;
        }
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  📝 Updated: ${path.relative(SRC_DIR, filePath)}`);
    }
  }

  return totalReplaced;
}

// पुरानी JPG/PNG files delete करो (जो WebP से replace हो गई हैं)
function deleteOldFiles(conversions) {
  let deleted = 0;
  for (const conv of conversions) {
    if (!conv.success) continue;
    const oldPath = path.join(PUBLIC_DIR, conv.srcFile);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
      deleted++;
    }
  }
  return deleted;
}

async function main() {
  console.log('🚀 KS Electrical - Root Images → WebP Converter\n');
  console.log('='.repeat(60));

  const files = getRootImageFiles();
  console.log(`📁 Found ${files.length} JPG/PNG files in public/ root\n`);

  const conversions = [];
  let totalSaved = 0;
  let alreadyWebP = 0;

  for (const file of files) {
    const base = path.basename(file, path.extname(file));
    const dstWebP = `${base}.webp`;

    // अगर same name का webp already है तो skip (जैसे .jpg के साथ .webp भी था)
    // लेकिन फिर भी JPG को delete करना है
    if (webpExists(file) && path.extname(file).toLowerCase() !== '.webp') {
      // WebP already exists - just mark for deletion of old file
      const srcSize = fs.statSync(path.join(PUBLIC_DIR, file)).size;
      const dstSize = fs.statSync(path.join(PUBLIC_DIR, dstWebP)).size;
      console.log(`⏭️  ALREADY EXISTS: ${dstWebP} (will delete old ${file})`);
      conversions.push({ success: true, srcFile: file, dstFile: dstWebP, srcSize, dstSize, savings: 'pre-existing' });
      alreadyWebP++;
      continue;
    }

    const result = await convertToWebP(file);
    result.srcFile = file;

    if (result.success) {
      console.log(`✅ ${base}.webp  [${(result.srcSize/1024).toFixed(0)}KB → ${(result.dstSize/1024).toFixed(0)}KB, saved ${result.savings}%]`);
      totalSaved += (result.srcSize - result.dstSize);
    } else {
      console.log(`❌ ERROR ${file}: ${result.error}`);
    }

    conversions.push(result);
  }

  console.log('\n' + '='.repeat(60));

  // Update source code references
  console.log('\n📝 Updating source code references (.jpg/.png → .webp)...');
  const replaced = updateSourceReferences(conversions);
  console.log(`✅ Updated ${replaced} references in source files`);

  // Delete old JPG/PNG files
  console.log('\n🗑️  Deleting old JPG/PNG files...');
  const deleted = deleteOldFiles(conversions);
  console.log(`✅ Deleted ${deleted} old files`);

  // Final summary
  const successful = conversions.filter(c => c.success).length;
  const errors = conversions.filter(c => !c.success).length;

  console.log('\n' + '='.repeat(60));
  console.log('📋 FINAL SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Converted: ${successful - alreadyWebP} new  |  ⏭️  Pre-existing: ${alreadyWebP}  |  ❌ Errors: ${errors}`);
  if (totalSaved > 0)
    console.log(`💾 Space saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
  console.log(`🗑️  Old files deleted: ${deleted}`);
  console.log('\n✨ Done! Now rebuild: npm run build\n');
}

main().catch(console.error);
