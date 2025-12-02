#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJsonPath = join(__dirname, '../package.json');

/**
 * Check if there are any staged changes (excluding package.json)
 * @returns {boolean} True if there are staged files to commit
 */
function hasStagedChanges() {
  try {
    // Get list of staged files (excluding package.json)
    const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf-8' })
      .trim()
      .split('\n')
      .filter(file => file && file !== 'package.json');

    return stagedFiles.length > 0;
  } catch (error) {
    // If not in a git repo or error, assume we should bump
    return true;
  }
}

try {
  // Check if there are any real changes to commit
  if (!hasStagedChanges()) {
    console.log('ℹ No staged changes detected. Skipping version bump.');
    process.exit(0);
  }

  // Read package.json
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

  // Parse current version
  const version = packageJson.version;
  const versionParts = version.split('.');

  // Increment patch version
  const major = parseInt(versionParts[0], 10);
  const minor = parseInt(versionParts[1], 10);
  const patch = parseInt(versionParts[2], 10);

  // Increment patch by default
  const newVersion = `${major}.${minor}.${patch + 1}`;

  // Update version
  packageJson.version = newVersion;

  // Write back to package.json
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8');

  // Stage the updated package.json
  try {
    execSync('git add package.json', { stdio: 'ignore' });
  } catch (error) {
    // Ignore git add errors
  }

  console.log(`✓ Version bumped: ${version} → ${newVersion}`);
} catch (error) {
  console.error('✗ Error bumping version:', error.message);
  process.exit(1);
}
