#!/usr/bin/env node

/**
 * Generate PWA icons from logo
 * This script copies the IDICO logo to PWA icon files
 */

const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const logoPath = path.join(__dirname, '..', 'src', 'assets', 'images', 'logo', 'logo-icon-ver.svg');

console.log('🎨 Generating PWA icons from logo...\n');

// Check if logo exists
if (!fs.existsSync(logoPath)) {
  console.error('❌ Logo file not found at:', logoPath);
  console.error('   Please ensure the logo file exists before running this script.');
  process.exit(1);
}

// Copy logo to PWA icon files
const icon192 = path.join(publicDir, 'pwa-192x192.svg');
const icon512 = path.join(publicDir, 'pwa-512x512.svg');
const favicon = path.join(publicDir, 'favicon.svg');

fs.copyFileSync(logoPath, icon192);
console.log('✅ Created: public/pwa-192x192.svg');

fs.copyFileSync(logoPath, icon512);
console.log('✅ Created: public/pwa-512x512.svg');

fs.copyFileSync(logoPath, favicon);
console.log('✅ Created: public/favicon.svg');

console.log('\n✨ PWA icons generated successfully from IDICO logo!');
console.log('📱 These icons will be used for:');
console.log('   - Progressive Web App (PWA) home screen icons');
console.log('   - Browser favicon');
console.log('   - App manifest icons\n');
