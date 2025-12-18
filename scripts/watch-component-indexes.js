#!/usr/bin/env node

/**
 * Watch component folders and auto-update index.ts files
 * Runs in the background during development
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { updateIndexFile } from './update-component-indexes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENT_FOLDERS = [
  'atoms',
  'molecules',
  'organisms',
  'templates',
  'pages',
];

const COMPONENTS_BASE_PATH = path.resolve(__dirname, '../src/components');

// Debounce timer to avoid multiple rapid updates
const debounceTimers = new Map();
const DEBOUNCE_DELAY = 500; // ms

/**
 * Debounced update function
 */
function debouncedUpdate(folderName) {
  // Clear existing timer
  if (debounceTimers.has(folderName)) {
    clearTimeout(debounceTimers.get(folderName));
  }

  // Set new timer
  const timer = setTimeout(() => {
    updateIndexFile(folderName);
    debounceTimers.delete(folderName);
  }, DEBOUNCE_DELAY);

  debounceTimers.set(folderName, timer);
}

/**
 * Watch a component folder for changes
 */
function watchFolder(folderName) {
  const folderPath = path.join(COMPONENTS_BASE_PATH, folderName);

  if (!fs.existsSync(folderPath)) {
    console.log(`⚠️  Folder not found: ${folderName}`);
    return;
  }

  console.log(`👀 Watching: ${folderName}/`);

  // Watch for changes
  fs.watch(folderPath, (eventType, filename) => {
    if (!filename) return;

    // Only watch .tsx and .ts files (but not index.ts or test files)
    if (
      (filename.endsWith('.tsx') || filename.endsWith('.ts')) &&
      filename !== 'index.ts' &&
      !filename.endsWith('.test.ts') &&
      !filename.endsWith('.test.tsx') &&
      !filename.endsWith('.spec.ts') &&
      !filename.endsWith('.spec.tsx')
    ) {
      console.log(`\n📝 Change detected: ${folderName}/${filename}`);
      debouncedUpdate(folderName);
    }
  });
}

/**
 * Start watching all component folders
 */
function startWatching() {
  console.log('🚀 Starting component index watcher...\n');

  for (const folder of COMPONENT_FOLDERS) {
    watchFolder(folder);
  }

  console.log('\n✨ Watcher is running. Press Ctrl+C to stop.\n');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Stopping watcher...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Stopping watcher...');
  process.exit(0);
});

// Start watching
startWatching();
