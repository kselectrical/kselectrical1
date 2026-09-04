// scripts/deploy.mjs — Robust FTP deployment script using basic-ftp
import { Client } from 'basic-ftp';
import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join, resolve, relative } from 'path';
import { createHash } from 'crypto';

const ftpHost = "ftpupload.net";
const ftpUser = "if0_42168126";
const ftpPass = "FpQLnmHHGj";
const localDir = resolve('dist');
const targetRoots = ["/htdocs", "/kselectrical.in/htdocs"];
const cacheFile = resolve('.last_uploaded.json');

// Load cache
let cache = {};
if (existsSync(cacheFile)) {
  try {
    cache = JSON.parse(readFileSync(cacheFile, 'utf8'));
    console.log(`Loaded upload cache with ${Object.keys(cache).length} entries.`);
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
  client.ftp.timeout = 120000;

  try {
    async function connectFTP() {
      console.log(`Connecting to FTP server ${ftpHost}...`);
      await client.access({
        host: ftpHost,
        user: ftpUser,
        password: ftpPass,
        secure: false
      });
      console.log('Connected successfully!');
    }

    await connectFTP();

    const localFiles = getAllFiles(localDir);
    console.log(`Found ${localFiles.length} local files in dist.`);

    for (const targetRoot of targetRoots) {
      console.log(`\n--- Deploying to target webroot: ${targetRoot} ---`);

      for (const filePath of localFiles) {
        const relPath = relative(localDir, filePath).replace(/\\/g, '/');
        const hash = getFileHash(filePath);
        const cacheKey = `${targetRoot}:${relPath}`;

        // Check if file is already uploaded to this target and unchanged
        if (cache[cacheKey] === hash) {
          console.log(`Skipping ${targetRoot}/${relPath} (unchanged)`);
          continue;
        }

        const remoteFileUrl = `${targetRoot}/${relPath}`;
        const remoteDir = remoteFileUrl.substring(0, remoteFileUrl.lastIndexOf('/'));

        // Retry mechanism with auto-reconnect
        let success = false;
        let attempts = 0;
        while (!success && attempts < 5) {
          try {
            await client.ensureDir(remoteDir);
            await client.uploadFrom(filePath, remoteFileUrl);
            console.log(`Uploaded ${remoteFileUrl} successfully!`);
            success = true;
            
            // Update cache and save immediately
            cache[cacheKey] = hash;
            writeFileSync(cacheFile, JSON.stringify(cache, null, 2), 'utf8');
          } catch (err) {
            attempts++;
            console.log(`Attempt ${attempts} failed for ${remoteFileUrl}: ${err.message}`);
            if (attempts >= 5) {
              throw new Error(`Failed to upload ${remoteFileUrl} after 5 attempts.`);
            }
            console.log("Reconnecting to FTP...");
            await new Promise(r => setTimeout(r, 2000));
            try {
              await connectFTP();
            } catch (connErr) {
              console.log(`Reconnect error: ${connErr.message}`);
            }
          }
        }
      }
    }

    console.log('\n🎉 Deployment completed successfully to all webroots!');
  } catch (err) {
    console.error('\n❌ Deployment failed:', err.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
