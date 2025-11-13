#!/usr/bin/env node

/**
 * Google OAuth Configuration Checker
 *
 * This script helps diagnose Google OAuth setup issues by checking:
 * - Environment variables
 * - Current origin/URL
 * - Common configuration mistakes
 *
 * Run: node check-google-oauth-config.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Google OAuth Configuration Check\n');
console.log('='.repeat(50));

// Check .env files
const envFiles = ['.env.development', '.env.production', '.env'];
let clientIdFound = false;

console.log('\n📁 Checking environment files:\n');

envFiles.forEach(file => {
  const envPath = path.join(process.cwd(), file);
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/VITE_GOOGLE_CLIENT_ID=(.+)/);

    if (match && match[1] && match[1].trim() && match[1] !== 'your-google-client-id.apps.googleusercontent.com') {
      const clientId = match[1].trim();
      console.log(`✅ ${file}: Client ID found`);
      console.log(`   ${clientId.substring(0, 20)}...`);
      clientIdFound = true;
    } else if (match) {
      console.log(`⚠️  ${file}: Found but not configured (using placeholder)`);
    } else {
      console.log(`❌ ${file}: VITE_GOOGLE_CLIENT_ID not found`);
    }
  } else {
    console.log(`⚠️  ${file}: File not found`);
  }
});

if (!clientIdFound) {
  console.log('\n❌ ERROR: No valid Google Client ID found!');
  console.log('\n📝 Action required:');
  console.log('   1. Get Client ID from Google Cloud Console');
  console.log('   2. Add to .env.development:');
  console.log('      VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com');
  console.log('   3. Restart your dev server');
}

// Check origin configuration
console.log('\n🌐 Checking origin configuration:\n');
console.log('Your app will run on these origins:');
console.log('   Development (Vite): http://localhost:5173');
console.log('   Development (Alt):  http://127.0.0.1:5173');

console.log('\n⚠️  IMPORTANT: Add these EXACT URLs to Google Cloud Console:');
console.log('   1. Go to: https://console.cloud.google.com/');
console.log('   2. APIs & Services → Credentials');
console.log('   3. Click your OAuth Client ID');
console.log('   4. Under "Authorized JavaScript origins", add:');
console.log('      • http://localhost:5173');
console.log('      • http://127.0.0.1:5173');
console.log('   5. Save and wait 5-10 minutes');

// Common mistakes
console.log('\n⚠️  Common mistakes to avoid:\n');
console.log('❌ http://localhost:5173/  (has trailing slash)');
console.log('❌ http://localhost        (missing port number)');
console.log('❌ https://localhost:5173  (wrong protocol)');
console.log('✅ http://localhost:5173   (correct!)');

// Check if running on different port
console.log('\n💡 Tips:\n');
console.log('• If your app runs on a different port, add that too');
console.log('• Run this in browser console to check origin:');
console.log('  console.log(window.location.origin)');
console.log('• Changes in Google Console take 5-10 minutes');
console.log('• Clear browser cache after changing Google settings');

console.log('\n' + '='.repeat(50));
console.log('\n📚 Full setup guide: GOOGLE_OAUTH_SETUP.md\n');
