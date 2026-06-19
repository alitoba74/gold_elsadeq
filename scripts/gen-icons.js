/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require("sharp");
const path = require("path");

const sizes = [192, 512];

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFE875" />
      <stop offset="50%" stop-color="#FFD700" />
      <stop offset="100%" stop-color="#B8941F" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="20" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="512" height="512" rx="120" fill="#0a0a0a" />
  <rect width="512" height="512" rx="120" fill="url(#g)" opacity="0.95" />
  <rect x="40" y="40" width="432" height="432" rx="100" fill="rgba(0,0,0,0.25)" />
  <path d="M120 96h208a16 16 0 0 1 16 16v48a16 16 0 0 1-16 16h-144v48h112a16 16 0 0 1 16 16v40a16 16 0 0 1-16 16H192v48h136a16 16 0 0 1 16 16v48a16 16 0 0 1-16 16H120a16 16 0 0 1-16-16V112a16 16 0 0 1 16-16Z" fill="#0a0a0a" filter="url(#glow)" />
</svg>
`;

async function main() {
  for (const size of sizes) {
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(path.join("/home/z/my-project/public", `icon-${size}.png`));
    console.log(`Generated icon-${size}.png`);
  }
  // Apple touch icon (180)
  await sharp(Buffer.from(svg))
    .resize(180, 180)
    .png()
    .toFile(path.join("/home/z/my-project/public", "apple-touch-icon.png"));
  console.log("Generated apple-touch-icon.png");

  // OG image 1200x630
  const ogSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0a0a0a" />
        <stop offset="100%" stop-color="#1a1a1a" />
      </linearGradient>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#FFE875" />
        <stop offset="50%" stop-color="#FFD700" />
        <stop offset="100%" stop-color="#B8941F" />
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)" />
    <circle cx="950" cy="315" r="280" fill="url(#gold)" opacity="0.15" />
    <text x="100" y="280" font-family="Arial, sans-serif" font-size="120" font-weight="900" fill="url(#gold)">ELSADEQ</text>
    <text x="100" y="360" font-family="Arial, sans-serif" font-size="36" fill="#aaa">أسعار الذهب والسبائك لحظة بلحظة</text>
    <text x="100" y="420" font-family="Arial, sans-serif" font-size="24" fill="#888">Live Gold and Bullion Prices - Refreshed on Every Visit</text>
  </svg>
  `;
  await sharp(Buffer.from(ogSvg))
    .jpeg({ quality: 90 })
    .toFile(path.join("/home/z/my-project/public", "og-image.jpg"));
  console.log("Generated og-image.jpg");
}

main().catch(console.error);
