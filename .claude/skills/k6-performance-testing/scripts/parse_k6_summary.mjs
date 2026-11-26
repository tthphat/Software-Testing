#!/usr/bin/env node

/**
 * k6 Metric Parser & Ground Truth Extractor
 * 
 * Reads k6 JSON summary export files and outputs a clean Ground Truth table
 * containing exact mathematical values for:
 * - Samples (Total requests)
 * - Error Rate (%)
 * - Throughput (RPS)
 * - Average, Min, Max
 * - Percentiles: p50 (Median), p90, p95, p99
 * 
 * Used for Task 2 (AI Analysis & Misinterpretation Hunt) to systematically
 * detect and disprove AI hallucinated performance metrics.
 */

import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const fileArgIndex = args.indexOf('--json');

if (fileArgIndex === -1 || !args[fileArgIndex + 1]) {
  console.log('Usage: node parse_k6_summary.mjs --json <path_to_k6_summary.json>');
  process.exit(1);
}

const jsonPath = path.resolve(args[fileArgIndex + 1]);

if (!fs.existsSync(jsonPath)) {
  console.error(`❌ File not found: ${jsonPath}`);
  process.exit(1);
}

try {
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const summary = JSON.parse(rawData);

  console.log('='.repeat(72));
  console.log('📊 K6 GROUND TRUTH METRIC EXTRACTOR (TASK 2 COMPANION)');
  console.log(`📄 Source file: ${path.basename(jsonPath)}`);
  console.log('='.repeat(72));

  const metrics = summary.metrics || {};

  // Extract core metrics
  const reqs = metrics.http_reqs ? metrics.http_reqs.values.count : 0;
  const reqRate = metrics.http_reqs ? metrics.http_reqs.values.rate.toFixed(2) : '0.00';
  
  const failedReqs = metrics.http_req_failed ? metrics.http_req_failed.values.passes : 0;
  const failRate = metrics.http_req_failed ? (metrics.http_req_failed.values.rate * 100).toFixed(2) : '0.00';
  
  const duration = metrics.http_req_duration ? metrics.http_req_duration.values : {};
  const avg = duration.avg ? duration.avg.toFixed(2) : 'N/A';
  const min = duration.min ? duration.min.toFixed(2) : 'N/A';
  const med = duration.med ? duration.med.toFixed(2) : 'N/A';
  const max = duration.max ? duration.max.toFixed(2) : 'N/A';
  const p90 = duration['p(90)'] ? duration['p(90)'].toFixed(2) : 'N/A';
  const p95 = duration['p(95)'] ? duration['p(95)'].toFixed(2) : 'N/A';
  const p99 = duration['p(99)'] ? duration['p(99)'].toFixed(2) : 'N/A';

  console.log('\n📈 [1] OVERALL PERFORMANCE SUMMARY:');
  console.log(`  • Total HTTP Requests (Samples) : ${reqs.toLocaleString()}`);
  console.log(`  • Average Throughput (RPS)       : ${reqRate} req/s`);
  console.log(`  • Failed Requests                : ${failedReqs.toLocaleString()} (${failRate}%)`);
  console.log(`  • Latency - Minimum              : ${min} ms`);
  console.log(`  • Latency - Average              : ${avg} ms`);
  console.log(`  • Latency - Median (p50)         : ${med} ms`);
  console.log(`  • Latency - 90th Percentile (p90): ${p90} ms`);
  console.log(`  • Latency - 95th Percentile (p95): ${p95} ms`);
  console.log(`  • Latency - 99th Percentile (p99): ${p99} ms`);
  console.log(`  • Latency - Maximum              : ${max} ms`);

  console.log('\n📋 [2] TASK 2 GROUND TRUTH TABLE (MARKDOWN FORMAT):');
  console.log('Copy the table below into your main report to compare with AI interpretations:\n');

  console.log('| Metric Indicator | Ground Truth (k6 Log) | AI Interpretation | Discrepancy / Hallucination Reason |');
  console.log('|:---|:---:|:---:|:---|');
  console.log(`| **Total Requests** | ${reqs.toLocaleString()} reqs | *[Fill AI value]* | *[Compare accuracy]* |`);
  console.log(`| **Throughput (RPS)** | ${reqRate} req/s | *[Fill AI value]* | *[Compare accuracy]* |`);
  console.log(`| **Error Rate** | ${failRate}% | *[Fill AI value]* | *[Compare accuracy]* |`);
  console.log(`| **Avg Response Time** | ${avg} ms | *[Fill AI value]* | *[Check if AI confused with median]* |`);
  console.log(`| **Median (p50)** | ${med} ms | *[Fill AI value]* | *[Check if AI miscalculated]* |`);
  console.log(`| **95th Percentile (p95)** | ${p95} ms | *[Fill AI value]* | *[Key SLA threshold verification]* |`);
  console.log(`| **Max Response Time** | ${max} ms | *[Fill AI value]* | *[Check outlier detection]* |`);

  console.log('\n' + '='.repeat(72));
  console.log('🏁 Extraction complete. Use Ground Truth values to refute AI errors.');
} catch (err) {
  console.error(`❌ Failed to parse k6 summary JSON: ${err.message}`);
  process.exit(1);
}

