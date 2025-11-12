#!/usr/bin/env node

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJsonPath = join(__dirname, '../package.json');

try {
  // Read package.json
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const version = packageJson.version;

  // Set environment variable for Vite to use
  process.env.VITE_APP_VERSION = version;

  console.log(`✓ Version injected: ${version}`);
} catch (error) {
  console.error('Error injecting version:', error.message);
  process.exit(1);
}
