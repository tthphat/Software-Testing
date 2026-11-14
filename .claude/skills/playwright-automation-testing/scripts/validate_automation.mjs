#!/usr/bin/env node

/**
 * Automation Validation Script for CSC13003 HW04
 * Verifies that the automation project strictly adheres to:
 * 1. Data-Driven separation (data in .json/.csv, not hardcoded inline).
 * 2. At least 12 test cases per feature.
 * 3. At least 3 distinct assertion patterns per spec file.
 * 4. Multi-browser configuration (Chromium, Firefox, WebKit).
 * 5. Authorship metadata (Run by: 23120319 + ISO Timestamp).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target automation root
const projectRoot = process.argv.includes('--dir')
  ? path.resolve(process.argv[process.argv.indexOf('--dir') + 1])
  : path.resolve(__dirname, '../../../../HW4/automation');

console.log('='.repeat(70));
console.log('🔍 CSC13003 HW04 - PLAYWRIGHT AUTOMATION VALIDATOR');
console.log(`📂 Inspecting project at: ${projectRoot}`);
console.log('='.repeat(70));

let errorCount = 0;
let warningCount = 0;

// 1. Verify playwright.config.ts
console.log('\n[1/4] Checking Playwright Configuration (playwright.config.ts)...');
const configPath = path.join(projectRoot, 'playwright.config.ts');
if (!fs.existsSync(configPath)) {
  console.log(`  ❌ Missing config file: ${configPath}`);
  errorCount++;
} else {
  const configContent = fs.readFileSync(configPath, 'utf-8');
  
  // Check browsers
  const hasChromium = /name:\s*['"]chromium['"]/i.test(configContent);
  const hasFirefox = /name:\s*['"]firefox['"]/i.test(configContent);
  const hasWebkit = /name:\s*['"]webkit['"]/i.test(configContent);
  
  if (hasChromium && hasFirefox && hasWebkit) {
    console.log('  ✅ Multi-browser projects configured: Chromium, Firefox, WebKit.');
  } else {
    console.log(`  ❌ Missing required browsers! (Chromium: ${hasChromium}, Firefox: ${hasFirefox}, WebKit: ${hasWebkit})`);
    errorCount++;
  }

  // Check authorship & timestamp metadata
  const hasStudentId = /23120319/.test(configContent);
  const hasTimestamp = /timestamp|iso/i.test(configContent);
  if (hasStudentId) {
    console.log('  ✅ Authorship metadata found (Student ID: 23120319).');
  } else {
    console.log('  ❌ Missing Student ID (23120319) in report metadata or config!');
    errorCount++;
  }

  if (hasTimestamp) {
    console.log('  ✅ Timestamp / ISO metadata configured.');
  } else {
    console.log('  ⚠️ Timestamp configuration not explicitly detected in metadata.');
    warningCount++;
  }
}

// 2. Check Data Directory
console.log('\n[2/4] Checking Data-Driven Files (data/*.json or *.csv)...');
const dataDir = path.join(projectRoot, 'data');
if (!fs.existsSync(dataDir)) {
  console.log(`  ❌ Data directory does not exist: ${dataDir}`);
  errorCount++;
} else {
  const dataFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') || f.endsWith('.csv'));
  console.log(`  Found ${dataFiles.length} data file(s): ${dataFiles.join(', ')}`);
  
  for (const f of dataFiles) {
    const filePath = path.join(dataDir, f);
    if (f.endsWith('.json')) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const count = Array.isArray(content) ? content.length : (content.testCases?.length || 0);
        if (count >= 12) {
          console.log(`  ✅ [${f}]: Contains ${count} test cases (>= 12 target passed).`);
        } else {
          console.log(`  ❌ [${f}]: Contains only ${count} test cases (REQUIRED: >= 12).`);
          errorCount++;
        }
      } catch (err) {
        console.log(`  ❌ [${f}]: Invalid JSON syntax: ${err.message}`);
        errorCount++;
      }
    }
  }
}

// 3. Check Spec Files & Assertions
console.log('\n[3/4] Checking Test Spec Files & Assertion Patterns (tests/*.spec.ts)...');
const testsDir = path.join(projectRoot, 'tests');
const KNOWN_ASSERTIONS = [
  'toHaveURL',
  'toBeVisible',
  'toBeHidden',
  'toContainText',
  'toHaveText',
  'toHaveValue',
  'toBeDisabled',
  'toBeEnabled',
  'toHaveCount',
  'toBeChecked',
  'toHaveAttribute',
  'toHaveTitle'
];

if (!fs.existsSync(testsDir)) {
  console.log(`  ❌ Tests directory does not exist: ${testsDir}`);
  errorCount++;
} else {
  const specFiles = fs.readdirSync(testsDir).filter(f => f.endsWith('.spec.ts') || f.endsWith('.spec.js'));
  if (specFiles.length < 3) {
    console.log(`  ⚠️ Found ${specFiles.length} spec file(s). Recommended: 3 features (Pool A, B, C).`);
    warningCount++;
  }

  for (const f of specFiles) {
    const specPath = path.join(testsDir, f);
    const content = fs.readFileSync(specPath, 'utf-8');

    console.log(`\n  📄 Inspecting [${f}]:`);

    // Check Data-Driven import
    const readsExternalData = /import\s+.*\s+from\s+['"].*data\/.*['"]|readFileSync\(.*data/i.test(content);
    if (readsExternalData) {
      console.log('    ✅ Data-Driven: Loads test data from external data file.');
    } else {
      console.log('    ❌ Anti-Pattern: Does NOT appear to import data from external data/ directory!');
      errorCount++;
    }

    // Check for prohibited hardcoded data arrays
    const hasLargeInlineArray = /const\s+\w+\s*=\s*\[\s*\{[\s\S]{200,}\}\s*\]/m.test(content);
    if (hasLargeInlineArray) {
      console.log('    ❌ Anti-Pattern: Detected potential hardcoded inline array in test script!');
      errorCount++;
    }

    // Check for arbitrary sleep / waitForTimeout
    const hasArbitraryWait = /waitForTimeout\s*\(\s*\d{3,}\s*\)/.test(content);
    if (hasArbitraryWait) {
      console.log('    ⚠️ Flakiness Warning: Found page.waitForTimeout(...) in script. Prefer web assertions or waitForResponse.');
      warningCount++;
    }

    // Detect distinct assertion patterns
    const foundAssertions = [];
    for (const assertion of KNOWN_ASSERTIONS) {
      if (new RegExp(`expect\\s*\\([^)]+\\)\\s*\\.\\s*${assertion}\\s*\\(`, 'g').test(content)) {
        foundAssertions.push(assertion);
      }
    }

    console.log(`    📊 Found ${foundAssertions.length} distinct assertion pattern(s): ${foundAssertions.join(', ')}`);
    if (foundAssertions.length >= 3) {
      console.log('    ✅ Assertion Diversity: Meets the >= 3 distinct assertion patterns requirement.');
    } else {
      console.log(`    ❌ Insufficient Assertion Diversity: Found only ${foundAssertions.length} pattern(s). REQUIRED: >= 3 distinct patterns.`);
      errorCount++;
    }
  }
}

// 4. Summary
console.log('\n' + '='.repeat(70));
console.log(`🏁 VALIDATION COMPLETED: ${errorCount === 0 ? 'PASSED ✅' : 'FAILED ❌'}`);
console.log(`   Errors:   ${errorCount}`);
console.log(`   Warnings: ${warningCount}`);
console.log('='.repeat(70));

if (errorCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
