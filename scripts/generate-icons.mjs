import sharp from 'sharp';
import { mkdir, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const iconsDir = join(rootDir, 'public', 'icons');

// Icon sizes for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create a simple icon with the brand color and ER text
async function generateIcons() {
  // Ensure icons directory exists
  await mkdir(iconsDir, { recursive: true });

  for (const size of sizes) {
    const padding = Math.round(size * 0.15);
    const innerSize = size - padding * 2;
    const fontSize = Math.round(innerSize * 0.35);
    const strokeWidth = Math.max(1, Math.round(size * 0.02));

    // Create SVG icon
    const svg = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="#3F704D" rx="${Math.round(size * 0.15)}"/>
        <rect x="${padding}" y="${padding}" width="${innerSize}" height="${innerSize}" fill="none" stroke="#F9EFE7" stroke-width="${strokeWidth}" rx="${Math.round(innerSize * 0.1)}"/>
        <text x="${size / 2}" y="${size / 2 + fontSize * 0.35}" font-family="Georgia, serif" font-size="${fontSize}" fill="#F9EFE7" text-anchor="middle" font-weight="bold">ER</text>
      </svg>
    `;

    // Generate PNG from SVG
    await sharp(Buffer.from(svg))
      .png()
      .toFile(join(iconsDir, `icon-${size}x${size}.png`));

    console.log(`Generated icon-${size}x${size}.png`);
  }

  // Generate Apple touch icon (180x180)
  const appleSize = 180;
  const applePadding = Math.round(appleSize * 0.15);
  const appleInnerSize = appleSize - applePadding * 2;
  const appleFontSize = Math.round(appleInnerSize * 0.35);
  const appleStrokeWidth = Math.max(1, Math.round(appleSize * 0.02));

  const appleSvg = `
    <svg width="${appleSize}" height="${appleSize}" viewBox="0 0 ${appleSize} ${appleSize}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${appleSize}" height="${appleSize}" fill="#3F704D" rx="${Math.round(appleSize * 0.15)}"/>
      <rect x="${applePadding}" y="${applePadding}" width="${appleInnerSize}" height="${appleInnerSize}" fill="none" stroke="#F9EFE7" stroke-width="${appleStrokeWidth}" rx="${Math.round(appleInnerSize * 0.1)}"/>
      <text x="${appleSize / 2}" y="${appleSize / 2 + appleFontSize * 0.35}" font-family="Georgia, serif" font-size="${appleFontSize}" fill="#F9EFE7" text-anchor="middle" font-weight="bold">ER</text>
    </svg>
  `;

  await sharp(Buffer.from(appleSvg))
    .png()
    .toFile(join(iconsDir, 'apple-touch-icon.png'));

  console.log('Generated apple-touch-icon.png');

  // Generate favicon.ico (32x32)
  const faviconSize = 32;
  const faviconPadding = Math.round(faviconSize * 0.1);
  const faviconInnerSize = faviconSize - faviconPadding * 2;
  const faviconFontSize = Math.round(faviconInnerSize * 0.4);

  const faviconSvg = `
    <svg width="${faviconSize}" height="${faviconSize}" viewBox="0 0 ${faviconSize} ${faviconSize}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${faviconSize}" height="${faviconSize}" fill="#3F704D" rx="4"/>
      <text x="${faviconSize / 2}" y="${faviconSize / 2 + faviconFontSize * 0.35}" font-family="Georgia, serif" font-size="${faviconFontSize}" fill="#F9EFE7" text-anchor="middle" font-weight="bold">ER</text>
    </svg>
  `;

  await sharp(Buffer.from(faviconSvg))
    .png()
    .toFile(join(rootDir, 'public', 'favicon.png'));

  console.log('Generated favicon.png');

  console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);
