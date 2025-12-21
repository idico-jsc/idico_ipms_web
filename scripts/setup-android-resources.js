#!/usr/bin/env node

/**
 * Setup Android Resources Script
 *
 * This script generates Android resource files with values from environment variables.
 * It runs automatically during the build process before syncing to Android.
 *
 * Purpose:
 * - Generate strings.xml with server_client_id from VITE_GOOGLE_CLIENT_ID
 * - Generate app launcher icons from IDICO logo
 * - Ensures Android native resources are always in sync with .env files and logo
 * - Prevents manual edits in build/ directory that get lost on rebuild
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envPath = join(__dirname, `../.env.${process.env.NODE_ENV || 'development'}`);
dotenv.config({ path: envPath });

// Get Google Server Client ID from environment
const serverClientId = process.env.VITE_GOOGLE_CLIENT_ID || '';

if (!serverClientId) {
  console.warn('⚠️  VITE_GOOGLE_CLIENT_ID not found in environment variables');
  console.warn('   Google login on native mobile apps may not work');
}

// Android resources path
const androidResPath = join(__dirname, '../build/android/app/src/main/res/values');

// Create directory if it doesn't exist
if (!existsSync(androidResPath)) {
  mkdirSync(androidResPath, { recursive: true });
}

// Generate strings.xml content
const stringsXml = `<?xml version='1.0' encoding='utf-8'?>
<resources>
    <string name="app_name">IDICO CRM</string>
    <string name="title_activity_main">IDICO CRM</string>
    <string name="package_name">com.idico.crm</string>
    <string name="custom_url_scheme">com.idico.crm</string>
    <string name="server_client_id">${serverClientId}</string>
</resources>
`;

// Write strings.xml file
const stringsXmlPath = join(androidResPath, 'strings.xml');
writeFileSync(stringsXmlPath, stringsXml, 'utf-8');

console.log('✓ Android resources generated');
console.log(`  - strings.xml created at ${stringsXmlPath}`);
if (serverClientId) {
  console.log(`  - server_client_id: ${serverClientId.substring(0, 20)}...`);
}

// Generate Android app icons
console.log('\n📱 Generating Android app icons...');
try {
  execSync('node scripts/generate-android-icons.cjs', {
    cwd: join(__dirname, '..'),
    stdio: 'inherit'
  });
} catch (error) {
  console.warn('⚠️  Failed to generate Android icons:', error.message);
}
