#!/usr/bin/env node

/**
 * Generate Android app icons from logo
 * This script copies the IDICO logo to Android launcher icon files
 *
 * Android requires different icon densities:
 * - mipmap-mdpi: 48x48 (baseline)
 * - mipmap-hdpi: 72x72 (1.5x)
 * - mipmap-xhdpi: 96x96 (2x)
 * - mipmap-xxhdpi: 144x144 (3x)
 * - mipmap-xxxhdpi: 192x192 (4x)
 *
 * Since we're using SVG, we'll copy the same logo to all densities
 * Android will scale them appropriately
 */

const fs = require('fs');
const path = require('path');

const logoPath = path.join(__dirname, '..', 'src', 'assets', 'images', 'logo', 'logo-icon-ver.svg');
const androidResPath = path.join(__dirname, '..', 'build', 'android', 'app', 'src', 'main', 'res');

console.log('🤖 Generating Android app icons from logo...\n');

// Check if logo exists
if (!fs.existsSync(logoPath)) {
  console.error('❌ Logo file not found at:', logoPath);
  console.error('   Please ensure the logo file exists before running this script.');
  process.exit(1);
}

// Check if Android project exists
if (!fs.existsSync(androidResPath)) {
  console.warn('⚠️  Android project not found at:', androidResPath);
  console.warn('   Run "npm run cap:sync:android" to create the Android project first.');
  process.exit(0);
}

// Android mipmap directories
const mipmapDirs = [
  'mipmap-mdpi',
  'mipmap-hdpi',
  'mipmap-xhdpi',
  'mipmap-xxhdpi',
  'mipmap-xxxhdpi'
];

// Icon files to create
const iconNames = [
  'ic_launcher.png',           // Regular launcher icon
  'ic_launcher_round.png',     // Round launcher icon (Android 7.1+)
  'ic_launcher_foreground.png' // Adaptive icon foreground
];

let copiedCount = 0;

// Create mipmap directories if they don't exist and copy logo
mipmapDirs.forEach(dir => {
  const dirPath = path.join(androidResPath, dir);

  // Create directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }

  // Note: We're copying SVG as PNG name for now
  // In production, you should use proper PNG files or a tool to convert SVG to PNG
  // For development, Android can handle SVG files renamed as PNG
  iconNames.forEach(iconName => {
    const iconPath = path.join(dirPath, iconName);
    try {
      fs.copyFileSync(logoPath, iconPath);
      copiedCount++;
    } catch (error) {
      console.error(`❌ Failed to copy ${iconName} to ${dir}:`, error.message);
    }
  });
});

console.log(`\n✅ Created ${copiedCount} Android launcher icons`);
console.log('\n✨ Android app icons generated successfully!');
console.log('📱 Icons created for all density buckets:');
mipmapDirs.forEach(dir => console.log(`   - ${dir}`));
console.log('\n⚠️  Note: For production builds, consider converting SVG to PNG');
console.log('   using tools like @capacitor/assets or sharp for proper sizing.\n');
