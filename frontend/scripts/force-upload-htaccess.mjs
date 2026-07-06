// Force-upload .htaccess to the FTP server
import { Client } from 'basic-ftp';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { createHash } from 'crypto';

const ftpHost = "ftpupload.net";
const ftpUser = "if0_42168126";
const ftpPass = "FpQLnmHHGj";
const remotePath = "/kselectrical.in/htdocs";
const cacheFile = resolve('.last_uploaded.json');

const localFile = resolve('dist/.htaccess');
const remoteFile = `${remotePath}/.htaccess`;

async function uploadHtaccess() {
  const client = new Client();
  client.ftp.timeout = 30000;

  try {
    console.log(`Connecting to FTP server ${ftpHost}...`);
    await client.access({
      host: ftpHost,
      user: ftpUser,
      password: ftpPass,
      secure: false
    });
    console.log('Connected! Force-uploading .htaccess...');
    await client.ensureDir(remotePath);
    await client.uploadFrom(localFile, remoteFile);
    console.log(`✅ Successfully uploaded .htaccess to ${remoteFile}`);

    // Update cache
    const content = readFileSync(localFile);
    const hash = createHash('md5').update(content).digest('hex').toUpperCase();
    let cache = {};
    if (existsSync(cacheFile)) {
      try { cache = JSON.parse(readFileSync(cacheFile, 'utf8')); } catch(e) {}
    }
    cache['.htaccess'] = hash;
    writeFileSync(cacheFile, JSON.stringify(cache, null, 2), 'utf8');
    console.log(`Cache updated. Hash: ${hash}`);
  } catch (err) {
    console.error('❌ Upload failed:', err.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

uploadHtaccess();
