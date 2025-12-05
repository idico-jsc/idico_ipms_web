/**
 * Copy Configuration Files Script
 * Copies config files (like google-services.json) to their target locations
 */

const fs = require('fs');
const path = require('path');

// Color output helpers
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function copyFile(source, destination) {
  try {
    // Ensure destination directory exists
    const destDir = path.dirname(destination);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Copy file
    fs.copyFileSync(source, destination);
    return true;
  } catch (error) {
    console.error(`Error copying ${source}: ${error.message}`);
    return false;
  }
}

function main() {
  log('\n📦 Copying configuration files...', 'yellow');

  const configs = [
    {
      name: 'google-services.json (Android)',
      source: path.join(__dirname, '../config/service-files/google-services.json'),
      destination: path.join(__dirname, '../build/android/app/google-services.json'),
      required: true,
    },
    // Add more config files here as needed
    // {
    //   name: 'GoogleService-Info.plist (iOS)',
    //   source: path.join(__dirname, '../config/service-files/GoogleService-Info.plist'),
    //   destination: path.join(__dirname, '../build/ios/App/App/GoogleService-Info.plist'),
    //   required: false,
    // },
  ];

  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;

  configs.forEach((config) => {
    // Check if source exists
    if (!fs.existsSync(config.source)) {
      if (config.required) {
        log(`✗ ${config.name} - Source not found: ${config.source}`, 'red');
        failCount++;
      } else {
        log(`⊘ ${config.name} - Skipped (optional, source not found)`, 'yellow');
        skipCount++;
      }
      return;
    }

    // Check if destination directory exists
    const destDir = path.dirname(config.destination);
    if (!fs.existsSync(destDir)) {
      log(`⊘ ${config.name} - Skipped (destination directory not found: ${destDir})`, 'yellow');
      log(`   Run 'npx cap sync' first to create the directory structure`, 'yellow');
      skipCount++;
      return;
    }

    // Copy file
    if (copyFile(config.source, config.destination)) {
      log(`✓ ${config.name} copied successfully`, 'green');
      successCount++;
    } else {
      log(`✗ ${config.name} - Failed to copy`, 'red');
      failCount++;
    }
  });

  // Summary
  log('\n📊 Summary:', 'yellow');
  log(`  ✓ Successful: ${successCount}`, 'green');
  if (skipCount > 0) log(`  ⊘ Skipped: ${skipCount}`, 'yellow');
  if (failCount > 0) log(`  ✗ Failed: ${failCount}`, 'red');

  // Exit with error if any required files failed
  if (failCount > 0) {
    log('\n❌ Some required configuration files failed to copy!', 'red');
    process.exit(1);
  } else {
    log('\n✅ Configuration files copied successfully!', 'green');
  }
}

main();
