#!/usr/bin/env node
/**
 * Generate favicon.ico and og-image.png from SVG sources
 * This script uses sharp for image conversion
 * 
 * Run: node scripts/generate-images.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('sharp not installed. Installing...');
  const { execSync } = require('child_process');
  execSync('npm install sharp --save-dev', { stdio: 'inherit' });
  sharp = require('sharp');
}

const publicDir = path.join(__dirname, '..', 'public');

async function generateFavicon() {
  const faviconSvg = path.join(publicDir, 'favicon.svg');
  const faviconIco = path.join(publicDir, 'favicon.ico');
  
  if (!fs.existsSync(faviconSvg)) {
    console.error('favicon.svg not found!');
    return;
  }
  
  console.log('Generating favicon.ico from favicon.svg...');
  
  // Generate 32x32 PNG (standard favicon size)
  const pngBuffer = await sharp(faviconSvg)
    .resize(32, 32)
    .png()
    .toBuffer();
  
  // For ICO format, we'll just use the PNG as a fallback
  // Most modern browsers accept PNG as favicon
  await sharp(faviconSvg)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  
  await sharp(faviconSvg)
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));
  
  await sharp(faviconSvg)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  
  await sharp(faviconSvg)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'android-chrome-192x192.png'));
  
  await sharp(faviconSvg)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'android-chrome-512x512.png'));
  
  console.log('Favicon variants generated successfully!');
}

async function generateOgImage() {
  const ogSvg = path.join(publicDir, 'og-image.svg');
  const ogPng = path.join(publicDir, 'og-image.png');
  
  if (!fs.existsSync(ogSvg)) {
    console.error('og-image.svg not found!');
    return;
  }
  
  console.log('Generating og-image.png from og-image.svg...');
  
  await sharp(ogSvg)
    .resize(1200, 630)
    .png()
    .toFile(ogPng);
  
  console.log('OpenGraph image generated successfully!');
}

async function main() {
  console.log('AngularPress Image Generator\n');
  
  try {
    await generateFavicon();
    await generateOgImage();
    console.log('\nAll images generated successfully!');
  } catch (error) {
    console.error('Error generating images:', error);
    process.exit(1);
  }
}

main();

