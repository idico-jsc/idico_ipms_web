#!/usr/bin/env node

/**
 * Rename APK Script
 *
 * Renames the built APK file to follow the naming convention: pp-<version>.apk
 *
 * Examples:
 * - app-debug.apk → pp-0.0.90-debug.apk
 * - app-release.apk → pp-0.0.90-release.apk
 * - app-release-unsigned.apk → pp-0.0.90-release-unsigned.apk
 */

import { readFileSync, renameSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read version from package.json
const packageJsonPath = join(__dirname, '../package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
const version = packageJson.version;

// Build type from command line argument (debug or release)
const buildType = process.argv[2] || 'debug';

// Construct paths
const apkDir = join(__dirname, `../build/android/app/build/outputs/apk/${buildType}`);
const oldApkName = `app-${buildType}.apk`;
const oldApkPath = join(apkDir, oldApkName);

// New APK name: pp-<version>-<buildType>.apk
// For debug: pp-0.0.90-debug.apk
// For release: pp-0.0.90-release.apk
const newApkName = `pp-${version}-${buildType}.apk`;
const newApkPath = join(apkDir, newApkName);

try {
  // Check if old APK exists
  if (!existsSync(oldApkPath)) {
    console.error(`❌ APK not found at: ${oldApkPath}`);
    console.log(`   Make sure you've built the ${buildType} APK first.`);
    process.exit(1);
  }

  // Rename APK
  renameSync(oldApkPath, newApkPath);

  console.log('✓ APK renamed successfully');
  console.log(`  From: ${oldApkName}`);
  console.log(`  To:   ${newApkName}`);
  console.log(`  Path: ${apkDir}`);
  console.log('');
  console.log(`📦 Final APK: ${newApkPath}`);

} catch (error) {
  console.error('❌ Error renaming APK:', error.message);
  process.exit(1);
}
