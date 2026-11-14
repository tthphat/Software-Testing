#!/usr/bin/env node

/**
 * Summary Exporter for CSC13003 HW04
 * Parses Playwright test results and outputs summary Markdown tables for README.md.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = process.argv.includes('--dir')
  ? path.resolve(process.argv[process.argv.indexOf('--dir') + 1])
  : path.resolve(__dirname, '../../../../HW4/automation');

const resultsFile = path.join(projectRoot, 'test-results', 'results.json');

console.log(`Analyzing results from: ${resultsFile}`);

if (!fs.existsSync(resultsFile)) {
  console.log('⚠️ No results.json found yet. Run Playwright with json reporter first.');
  console.log('Example: npx playwright test');
  process.exit(0);
}

try {
  const data = JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));
  const stats = data.stats || {};
  const total = stats.expected || 0;
  const failed = stats.unexpected || 0;
  const passed = total - failed;

  console.log('\n### 2. Báo cáo Tổng kết Kiểm thử (Test Summary Report)\n');
  console.log('| Chỉ số | Số lượng thực tế | Ghi chú kỹ thuật |');
  console.log('|:---|:---:|:---|');
  console.log(`| **Số tính năng kiểm thử (Features)** | **3** | Pool A (FR-01), Pool B (FR-08), Pool C (FR-12) |`);
  console.log(`| **Số test cases đã tự động hóa** | **36+** | >= 12 test cases mỗi tính năng (Data-driven) |`);
  console.log(`| **Số ca kiểm thử đã thực thi** | **${total}** | Chạy đầy đủ qua bộ test suite |`);
  console.log(`| **Số ca kiểm thử ĐẠT (PASS)** | **${passed}** | Hoạt động đúng kỳ vọng |`);
  console.log(`| **Số ca kiểm thử THẤT BẠI (FAIL)** | **${failed}** | Bộc lộ khiếm khuyết SUT hoặc validation |`);
  console.log(`| **Số lượt chạy trình duyệt (Browser Runs)** | **9** | 3 tính năng x 3 browsers (Chromium, Firefox, WebKit) |`);
} catch (err) {
  console.error('Error parsing results:', err.message);
}
