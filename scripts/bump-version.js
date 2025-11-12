#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJsonPath = join(__dirname, '../package.json');

try {
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

  console.log(`✓ Version bumped: ${version} → ${newVersion}`);
} catch (error) {
  console.error('Error bumping version:', error.message);
  process.exit(1);
}
