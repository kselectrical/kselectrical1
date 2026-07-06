import sharp from 'sharp';

async function check() {
  try {
    const faviconMeta = await sharp('C:/Users/A/OneDrive/Desktop/ks-demo/public/favicon.png').metadata();
    console.log('Favicon.png metadata:', faviconMeta);
  } catch (e) {
    console.error('Error reading favicon.png:', e.message);
  }

  try {
    const logMeta = await sharp('C:/Users/A/OneDrive/Desktop/ks-demo/public/log.png').metadata();
    console.log('Log.png metadata:', logMeta);
  } catch (e) {
    console.error('Error reading log.png:', e.message);
  }
}

check();
