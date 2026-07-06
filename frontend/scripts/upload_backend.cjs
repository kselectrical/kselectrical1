const ftp = require('ftp');
const fs = require('fs');
const path = require('path');

const client = new ftp();

const config = {
  host: 'ftpupload.net',
  user: 'if0_42168126',
  pass: 'FpQLnmHHGj'
};

const localBackendDir = 'c:\\Users\\A\\OneDrive\\Desktop\\ks-2.0\\backend';
const remoteBackendDir = 'kselectrical.in/htdocs/backend';

function ensureRemoteDir(dirPath) {
  return new Promise((resolve, reject) => {
    client.mkdir(dirPath, true, (err) => {
      if (err) {
        // Ignored if it already exists
        resolve();
      } else {
        console.log(`Created remote directory: ${dirPath}`);
        resolve();
      }
    });
  });
}

function uploadFile(localPath, remotePath) {
  return new Promise((resolve, reject) => {
    client.put(localPath, remotePath, (err) => {
      if (err) {
        console.error(`Error uploading ${localPath} -> ${remotePath}:`, err.message);
        reject(err);
      } else {
        console.log(`Uploaded: ${path.basename(localPath)}`);
        resolve();
      }
    });
  });
}

async function uploadDirRecursive(localDir, remoteDir) {
  await ensureRemoteDir(remoteDir);
  const items = fs.readdirSync(localDir);
  for (const item of items) {
    // Skip git and scripts
    if (item === '.git' || item === '_old_backup' || item.endsWith('.zip') || item === 'upload_php_billing.ps1') {
      continue;
    }
    const localPath = path.join(localDir, item);
    const remotePath = `${remoteDir}/${item}`;
    if (fs.statSync(localPath).isDirectory()) {
      await uploadDirRecursive(localPath, remotePath);
    } else {
      await uploadFile(localPath, remotePath);
    }
  }
}

client.on('ready', async () => {
  console.log('FTP connected. Starting upload of backend files to main site...');
  try {
    await uploadDirRecursive(localBackendDir, remoteBackendDir);
    console.log('FTP upload completed successfully!');
    client.end();
  } catch (err) {
    console.error('FTP upload failed:', err);
    client.end();
  }
});

client.on('error', (err) => {
  console.error('FTP connection error:', err);
});

client.connect(config);
