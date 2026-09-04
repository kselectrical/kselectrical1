import { Client } from 'basic-ftp';

const ftpHost = "ftpupload.net";
const ftpUser = "if0_42168126";
const ftpPass = "FpQLnmHHGj";

async function inspectFtp() {
  const client = new Client();
  client.ftp.timeout = 30000;

  try {
    console.log("Connecting...");
    await client.access({ host: ftpHost, user: ftpUser, password: ftpPass, secure: false });
    
    console.log("\n--- Listing Root Directory '/' ---");
    const rootList = await client.list('/');
    rootList.forEach(item => console.log(`${item.isDirectory ? '[DIR]' : '[FILE]'} ${item.name}`));

    console.log("\n--- Listing '/htdocs' ---");
    try {
      const htdocsList = await client.list('/htdocs');
      htdocsList.forEach(item => console.log(`${item.isDirectory ? '[DIR]' : '[FILE]'} ${item.name}`));
    } catch (e) {
      console.log("Error listing /htdocs:", e.message);
    }

    console.log("\n--- Listing '/kselectrical.in' ---");
    try {
      const ksList = await client.list('/kselectrical.in');
      ksList.forEach(item => console.log(`${item.isDirectory ? '[DIR]' : '[FILE]'} ${item.name}`));
    } catch (e) {
      console.log("Error listing /kselectrical.in:", e.message);
    }

    console.log("\n--- Listing '/kselectrical.in/htdocs' ---");
    try {
      const ksHtdocsList = await client.list('/kselectrical.in/htdocs');
      ksHtdocsList.forEach(item => console.log(`${item.isDirectory ? '[DIR]' : '[FILE]'} ${item.name}`));
    } catch (e) {
      console.log("Error listing /kselectrical.in/htdocs:", e.message);
    }

  } catch (err) {
    console.error("FTP Error:", err);
  } finally {
    client.close();
  }
}

inspectFtp();
