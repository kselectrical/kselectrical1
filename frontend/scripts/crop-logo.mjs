import sharp from 'sharp';

async function processLogo() {
  const inputPath = 'C:/Users/A/OneDrive/Desktop/ks-demo/public/log.png';
  const metadata = await sharp(inputPath).metadata();
  const size = Math.min(metadata.width, metadata.height);

  // We will crop to a square of size x size centered
  const left = Math.round((metadata.width - size) / 2);
  const top = Math.round((metadata.height - size) / 2);

  console.log(`Original size: ${metadata.width}x${metadata.height}. Cropping to square ${size}x${size} at (${left}, ${top})`);

  // Create a circular SVG mask of size x size
  const circularMask = Buffer.from(
    `<svg width="${size}" height="${size}">
       <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="black" />
     </svg>`
  );

  // Apply the circular mask to log.png
  const circularImage = await sharp(inputPath)
    .extract({ left, top, width: size, height: size })
    .composite([{
      input: circularMask,
      blend: 'dest-in'
    }])
    .toBuffer();

  // Save circular log.png and log.webp
  await sharp(circularImage)
    .resize(512, 512)
    .png({ quality: 90 })
    .toFile('C:/Users/A/OneDrive/Desktop/ks-demo/public/log.png');

  await sharp(circularImage)
    .resize(512, 512)
    .webp({ quality: 90 })
    .toFile('C:/Users/A/OneDrive/Desktop/ks-demo/public/log.webp');

  // Save circular favicon.png and favicon.webp
  await sharp(circularImage)
    .resize(192, 192)
    .png()
    .toFile('C:/Users/A/OneDrive/Desktop/ks-demo/public/favicon.png');

  await sharp(circularImage)
    .resize(192, 192)
    .webp()
    .toFile('C:/Users/A/OneDrive/Desktop/ks-demo/public/favicon.webp');

  console.log('✅ Successfully cropped and saved circular logo and favicon!');
}

processLogo().catch(console.error);
