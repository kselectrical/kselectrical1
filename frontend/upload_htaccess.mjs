// upload_htaccess.mjs - Force upload .htaccess to fix SPA routing on Apache
import { Client } from 'basic-ftp';
import { resolve } from 'path';

const ftpHost = "ftpupload.net";
const ftpUser = "if0_42168126";
const ftpPass = "FpQLnmHHGj";
const localHtaccess = resolve('dist/.htaccess');
const remotePath = "/kselectrical.in/htdocs/.htaccess";

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
    console.log('Connected! Uploading .htaccess...');
    await client.uploadFrom(localHtaccess, remotePath);
    console.log('SUCCESS: .htaccess uploaded to /kselectrical.in/htdocs/.htaccess');
    console.log('Apache SPA routing is now active. /ac-on-rent should load correctly.');
  } catch (err) {
    console.error('FAILED:', err.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

uploadHtaccess();
