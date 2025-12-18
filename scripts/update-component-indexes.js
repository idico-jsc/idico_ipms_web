#!/usr/bin/env node

/**
 * Auto-generate index.ts files for component folders
 * This script scans component folders and creates barrel exports
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

/**
 * Get all component files in a directory (excluding index.ts)
 */
function getComponentFiles(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    return files
      .filter(file => {
        // Include .tsx and .ts files, but exclude index.ts, .d.ts, and test files
        return (
          (file.endsWith('.tsx') || file.endsWith('.ts')) &&
          file !== 'index.ts' &&
          !file.endsWith('.d.ts') &&
          !file.endsWith('.test.ts') &&
          !file.endsWith('.test.tsx') &&
          !file.endsWith('.spec.ts') &&
          !file.endsWith('.spec.tsx')
        );
      })
      .map(file => file.replace(/\.(tsx|ts)$/, '')) // Remove extension
      .sort(); // Sort alphabetically
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error.message);
    return [];
  }
}

/**
 * Generate index.ts content from component files
 */
function generateIndexContent(componentFiles) {
  if (componentFiles.length === 0) {
    return '// No components found\n';
  }

  return componentFiles
    .map(file => `export * from "./${file}";`)
    .join('\n') + '\n';
}

/**
 * Update index.ts file for a component folder
 */
function updateIndexFile(folderName) {
  const folderPath = path.join(COMPONENTS_BASE_PATH, folderName);
  const indexPath = path.join(folderPath, 'index.ts');

  // Check if folder exists
  if (!fs.existsSync(folderPath)) {
    console.log(`⚠️  Folder not found: ${folderName}`);
    return false;
  }

  // Get component files
  const componentFiles = getComponentFiles(folderPath);

  // Generate new content
  const newContent = generateIndexContent(componentFiles);

  // Read existing content (if exists)
  let existingContent = '';
  if (fs.existsSync(indexPath)) {
    existingContent = fs.readFileSync(indexPath, 'utf-8');
  }

  // Only write if content changed
  if (existingContent !== newContent) {
    fs.writeFileSync(indexPath, newContent, 'utf-8');
    console.log(`✅ Updated ${folderName}/index.ts (${componentFiles.length} exports)`);
    return true;
  } else {
    console.log(`✓  ${folderName}/index.ts is up to date`);
    return false;
  }
}

/**
 * Update all component index files
 */
function updateAllIndexes() {
  console.log('🔄 Updating component index files...\n');

  let updatedCount = 0;

  for (const folder of COMPONENT_FOLDERS) {
    if (updateIndexFile(folder)) {
      updatedCount++;
    }
  }

  console.log(`\n✨ Done! Updated ${updatedCount} file(s)`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updateAllIndexes();
}

export { updateAllIndexes, updateIndexFile };
