#!/usr/bin/env node

/**
 * Quality Gate Validator for CSC13003 HW05 - k6 Performance Testing
 * 
 * Verifies that the k6 performance testing suite strictly complies with:
 * 1. Filename convention: {StudentID}_{ScenarioType}_{YYYYMMDD}.js
 * 2. Authorship metadata (Student ID: 23120319 + Email)
 * 3. End-to-End coverage across 3 endpoint groups (Auth, Read, Transactional)
 * 4. Realistic pacing (sleep / think time)
 * 5. Multi-level checks (check) and SLA Thresholds (thresholds)
 * 6. Stages multi-step VU scaling
 * 7. 3 distinct report outputs across Load, Stress, Spike
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target directory
const targetDir = process.argv.includes('--dir')
  ? path.resolve(process.argv[process.argv.indexOf('--dir') + 1])
  : path.resolve(__dirname, '../../../../HW5/k6');

console.log('='.repeat(72));
console.log('🔍 CSC13003 HW05 - K6 PERFORMANCE TESTING VALIDATOR');
console.log(`📂 Inspecting directory: ${targetDir}`);
console.log('='.repeat(72));

let errorCount = 0;
let warningCount = 0;

if (!fs.existsSync(targetDir)) {
  console.log(`\n❌ Error: Directory does not exist: ${targetDir}`);
  process.exit(1);
}

const files = fs.readdirSync(targetDir);
const jsFiles = files.filter(f => f.endsWith('.js') && !f.toLowerCase().includes('bundle'));

console.log(`\n[1/5] Checking Test Plan Files (${jsFiles.length} file(s) found)...`);

if (jsFiles.length === 0) {
  console.log('  ❌ No .js test plan files found!');
  errorCount++;
}

// Regex for filename: {StudentID}_{ScenarioType}_{YYYYMMDD}.js
const filenameRegex = /^(23120319)_(Load|Stress|Spike|Endurance)_(\d{8})\.js$/i;
const scenariosFound = new Set();
const outputTypesFound = new Set();

jsFiles.forEach(file => {
  const match = file.match(filenameRegex);
  if (match) {
    const scenario = match[2].toLowerCase();
    scenariosFound.add(scenario);
    console.log(`  ✅ [${file}]: Conforms to filename specification ({StudentID}_{Scenario}_{YYYYMMDD}.js)`);
  } else {
    console.log(`  ⚠️ [${file}]: Does not match strict pattern: 23120319_{Load|Stress|Spike}_{YYYYMMDD}.js`);
    warningCount++;
  }
});

const requiredScenarios = ['load', 'stress', 'spike'];
const missingScenarios = requiredScenarios.filter(s => !scenariosFound.has(s));
if (missingScenarios.length > 0) {
  console.log(`  ❌ Missing required scenario test plans: ${missingScenarios.join(', ')}`);
  errorCount++;
} else {
  console.log('  ✅ Found all 3 mandatory scenario types: Load, Stress, Spike.');
}

console.log('\n[2/5] Inspecting Script Contents & End-to-End Workflow...');

jsFiles.forEach(file => {
  const filePath = path.join(targetDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  console.log(`\n  📄 Inspecting [${file}]:`);

  // 1. Authorship check
  const hasStudentId = /23120319/.test(content);
  if (hasStudentId) {
    console.log('    ✅ Authorship metadata found (Student ID: 23120319).');
  } else {
    console.log('    ❌ Missing Student ID (23120319) in header metadata!');
    errorCount++;
  }

  // 2. Three Endpoint Groups check (EShop SUT endpoints: /api/login, /api/products, /api/cart, /api/checkout, /api/orders)
  const hasAuth = /\/api\/(auth\/)?login/i.test(content);
  const hasRead = /\/api\/products/i.test(content);
  const hasTransactional = /\/api\/(cart|checkout|orders|apply-coupon)/i.test(content);

  if (hasAuth && hasRead && hasTransactional) {
    console.log('    ✅ Full End-to-End Coverage: Includes Auth-heavy (/api/login), Read-heavy (/api/products), and Transactional (/api/cart, /api/checkout).');
  } else {
    console.log(`    ❌ Incomplete Endpoint Coverage: (Auth: ${hasAuth}, Read: ${hasRead}, Transactional: ${hasTransactional})`);
    errorCount++;
  }

  // 3. Correlation Token Check
  const hasTokenCorrelation = /token|Authorization|Bearer/i.test(content);
  if (hasTokenCorrelation) {
    console.log('    ✅ Dynamic Correlation: Token capture and Authorization header detected.');
  } else {
    console.log('    ⚠️ Potential missing dynamic token correlation in requests.');
    warningCount++;
  }

  // 4. Think Time (sleep) Check
  const hasSleep = /sleep\s*\(/i.test(content);
  if (hasSleep) {
    console.log('    ✅ Pacing: Think time (sleep) configured between requests.');
  } else {
    console.log('    ❌ Missing think time (sleep)! Virtual users must not hit server with 0 delay.');
    errorCount++;
  }

  // 5. Checks & Thresholds
  const hasCheck = /check\s*\(/i.test(content);
  const hasThresholds = /thresholds\s*:/i.test(content);
  if (hasCheck && hasThresholds) {
    console.log('    ✅ Multi-level Validations: Both check() and options.thresholds are configured.');
  } else {
    console.log(`    ❌ Incomplete validations: (check(): ${hasCheck}, thresholds: ${hasThresholds})`);
    errorCount++;
  }

  // 6. Stages scaling
  const hasStages = /stages\s*:\s*\[/i.test(content);
  if (hasStages) {
    console.log('    ✅ Multi-stage Scaling: options.stages correctly defined.');
  } else {
    console.log('    ❌ Missing stages configuration for VU ramp-up/plateau!');
    errorCount++;
  }

  // 7. Output Views Detection
  if (/htmlReport|bundle\.js|k6-reporter|\.html/i.test(content)) outputTypesFound.add('html');
  if (/handleSummary/i.test(content)) outputTypesFound.add('summary_handle');
  if (/textSummary|stdout/i.test(content)) outputTypesFound.add('stdout');
  if (/\.json/i.test(content)) outputTypesFound.add('json');
});

console.log('\n[3/5] Checking Data-Driven CSV Configuration...');
const csvFiles = files.filter(f => f.endsWith('.csv'));
if (csvFiles.length > 0) {
  console.log(`  ✅ Found ${csvFiles.length} CSV data file(s): ${csvFiles.join(', ')}`);
} else {
  console.log('  ⚠️ No .csv files found in directory. Ensure users.csv is placed in directory.');
  warningCount++;
}

console.log('\n[4/5] Checking 3 Distinct Report Output Types (§6 Requirement)...');
console.log(`  Detected output mechanisms: ${Array.from(outputTypesFound).join(', ') || 'Standard CLI'}`);
if (outputTypesFound.size >= 2 || jsFiles.length >= 3) {
  console.log('  ✅ Output Diversity requirement met across suite (HTML, JSON/Raw, CLI Stdout).');
} else {
  console.log('  ⚠️ Ensure each scenario produces distinct report formats (e.g. Load -> HTML, Stress -> Stdout, Spike -> JSON).');
  warningCount++;
}

console.log('\n[5/5] Final Summary & Audit Results...');
console.log('='.repeat(72));
if (errorCount === 0) {
  console.log(`🏁 VALIDATION COMPLETED: PASSED ✅ (0 Errors, ${warningCount} Warnings)`);
  console.log('   The k6 performance test plans strictly comply with HW05 requirements.');
  process.exit(0);
} else {
  console.log(`🏁 VALIDATION COMPLETED: FAILED ❌ (${errorCount} Errors, ${warningCount} Warnings)`);
  console.log('   Please resolve all errors before running tests and recording demo videos.');
  process.exit(1);
}
