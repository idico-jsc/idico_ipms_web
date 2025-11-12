#!/usr/bin/env node

/**
 * Generate PWA icons from favicon
 * This is a simple helper script to create placeholder PWA icons
 */

const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

// Create simple SVG placeholders for PWA icons
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#000000"/>
  <text
    x="50%"
    y="50%"
    font-family="Arial, sans-serif"
    font-size="${size / 8}"
    fill="#ffffff"
    text-anchor="middle"
    dominant-baseline="middle"
  >
    PWA
  </text>
  <text
    x="50%"
    y="70%"
    font-family="Arial, sans-serif"
    font-size="${size / 16}"
    fill="#ffffff"
    text-anchor="middle"
    dominant-baseline="middle"
  >
    ${size}x${size}
  </text>
</svg>
`.trim();

console.log('🎨 Generating PWA icon placeholders...\n');

// Generate 192x192 icon
const icon192 = path.join(publicDir, 'pwa-192x192.svg');
fs.writeFileSync(icon192, createSVGIcon(192));
console.log('✅ Created: public/pwa-192x192.svg');

// Generate 512x512 icon
const icon512 = path.join(publicDir, 'pwa-512x512.svg');
fs.writeFileSync(icon512, createSVGIcon(512));
console.log('✅ Created: public/pwa-512x512.svg');

console.log('\n⚠️  Note: These are placeholder SVG icons for development.');
console.log('📝 For production, please replace with proper PNG icons.');
console.log('💡 See PWA_SETUP.md for instructions on creating proper icons.\n');
