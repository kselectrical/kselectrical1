const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data });
      });
    }).on('error', reject);
  });
}

async function run() {
  try {
    const htmlRes = await fetchUrl('https://www.kselectrical.in/backend/test.html');
    console.log("HTML URL status:", htmlRes.status, "Body:", htmlRes.body.trim());
    
    const phpRes = await fetchUrl('https://www.kselectrical.in/backend/test.php');
    console.log("PHP URL status:", phpRes.status, "Body:", phpRes.body.trim());
  } catch (e) {
    console.error(e.message);
  }
}

run();
