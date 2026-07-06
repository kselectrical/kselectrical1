// scripts/deploy.mjs — Robust FTP deployment script using basic-ftp
import { Client } from 'basic-ftp';
import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join, resolve, relative } from 'path';
import { createHash } from 'crypto';

const ftpHost = "ftpupload.net";
const ftpUser = "if0_42168126";
const ftpPass = "FpQLnmHHGj";
const localDir = resolve('dist');
const remotePath = "/kselectrical.in/htdocs";
const cacheFile = resolve('.last_uploaded.json');

// Load cache
let cache = {};
if (existsSync(cacheFile)) {
  try {
    cache = JSON.parse(readFileSync(cacheFile, 'utf8'));
    console.log(`Loaded upload cache with ${Object.keys(cache).length} files.`);
  } catch (e) {
    console.log('Could not load cache, starting fresh.');
  }
}

// Function to calculate MD5 hash of a file
function getFileHash(filePath) {
  const content = readFileSync(filePath);
  return createHash('md5').update(content).digest('hex').toUpperCase();
}

// Function to recursively list all files in a local directory
// NOTE: readdirSync is called WITHOUT any filter so dotfiles like .htaccess are included
function getAllFiles(dir, fileList = []) {
  const files = readdirSync(dir, { withFileTypes: true });
  for (const entry of files) {
    const filePath = join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath); // includes dotfiles like .htaccess
    }
  }
  return fileList;
}

async function deploy() {
  const client = new Client();
  // Set timeout to 30 seconds
  client.ftp.timeout = 30000;

  try {
    console.log(`Connecting to FTP server ${ftpHost}...`);
    await client.access({
      host: ftpHost,
      user: ftpUser,
      password: ftpPass,
      secure: false // ftpupload.net usually does not support secure FTPS on free tier
    });
    console.log('Connected successfully! Starting deployment...');

    const localFiles = getAllFiles(localDir);
    console.log(`Found ${localFiles.length} local files in dist.`);

    for (const filePath of localFiles) {
      const relPath = relative(localDir, filePath).replace(/\\/g, '/');
      const hash = getFileHash(filePath);

      // Check if file is already uploaded and unchanged
      if (cache[relPath] === hash) {
        console.log(`Skipping ${relPath} (unchanged)`);
        continue;
      }

      const remoteFileUrl = `${remotePath}/${relPath}`;
      const remoteDir = remoteFileUrl.substring(0, remoteFileUrl.lastIndexOf('/'));

      // Ensure remote directory exists
      try {
        await client.ensureDir(remoteDir);
      } catch (e) {
        console.log(`Creating directory ${remoteDir}...`);
        await client.ensureDir(remoteDir);
      }

      console.log(`Uploading ${relPath} to ${remoteFileUrl}...`);
      
      // Retry mechanism
      let success = false;
      let attempts = 0;
      while (!success && attempts < 3) {
        try {
          await client.uploadFrom(filePath, remoteFileUrl);
          console.log(`Uploaded ${relPath} successfully!`);
          success = true;
          
          // Update cache and save immediately
          cache[relPath] = hash;
          writeFileSync(cacheFile, JSON.stringify(cache, null, 2), 'utf8');
        } catch (err) {
          attempts++;
          console.log(`Attempt ${attempts} failed for ${relPath}: ${err.message}`);
          if (attempts >= 3) {
            throw new Error(`Failed to upload ${relPath} after 3 attempts.`);
          }
          // Wait 2 seconds before retry
          await new Promise(r => setTimeout(r, 2000));
        }
      }
    }

    console.log('\n🎉 Deployment completed successfully! All files are up to date.');
  } catch (err) {
    console.error('\n❌ Deployment failed:', err.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
