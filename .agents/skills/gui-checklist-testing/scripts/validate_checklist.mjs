#!/usr/bin/env node

/**
 * ========================================================================================
 * validate_checklist.mjs
 * 
 * 📌 MỤC ĐÍCH:
 *   Script tự động kiểm toán (Audit & Validate) file bảng Checklist kiểm thử giao diện (GUI),
 *   đảm bảo bài làm tuân thủ đầy đủ các tiêu chí và barem chấm điểm của đề bài HW03 (Task 1).
 * 
 * 🔍 CÁC CHỨC NĂNG CHÍNH:
 *   1. Kiểm tra số lượng mục: Đảm bảo tổng số tiêu chí kiểm thử đạt từ 40 mục trở lên (>= 40 items).
 *   2. Kiểm tra độ bao phủ 4 khía cạnh giao diện (Interface Aspects - IA):
 *      - IA-01: Chuẩn UI chung (General UI Standards)
 *      - IA-02: Form (Biểu mẫu)
 *      - IA-03: Điều hướng (Navigation)
 *      - IA-04: Phản hồi & Trạng thái (Feedback & State)
 *   3. Thống kê kết quả thực thi: Đếm số lượng Passed, Failed, và chưa thực thi.
 *   4. Bắt lỗi thiếu giải trình: Quét các mục bị FAILED nhưng quên ghi lý do thất bại vào cột Notes
 *      (đáp ứng quy định: mọi ca FAILED bắt buộc phải có Notes và ảnh chụp bằng chứng).
 * 
 * 💻 CÁCH SỬ DỤNG:
 *   node validate_checklist.mjs [đường_dẫn_tới_file_checklist.md]
 *   Ví dụ:
 *     node .claude/skills/gui-checklist-testing/scripts/validate_checklist.mjs HW3/report/checklist.md
 * ========================================================================================
 */

import fs from 'fs';
import path from 'path';

/**
 * Hàm phân tích cú pháp (parse) nội dung Markdown và trích xuất các hàng dữ liệu của bảng Checklist.
 * 
 * @param {string} content - Toàn bộ nội dung văn bản Markdown của file checklist.
 * @returns {Array<Array<string>>} Mảng chứa các hàng dữ liệu, mỗi hàng là một mảng các cột đã được trim khoảng trắng.
 */
function parseChecklistRows(content) {
  const lines = content.split('\n');
  const items = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Bảng Markdown bắt đầu và kết thúc bằng ký tự '|'
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      // Tách các cột theo dấu '|', bỏ phần tử rỗng ở đầu và cuối do split sinh ra
      const cols = trimmed.split('|').slice(1, -1).map(c => c.trim());

      // Bỏ qua dòng phân cách tiêu đề bảng (ví dụ: |:---|:---:|---|)
      if (cols[0].startsWith('---') || cols[0].startsWith(':---')) {
        continue;
      }

      // Nhận diện hàng chứa mã mục kiểm thử (bắt đầu bằng 'CHK-' hoặc chứa mã khía cạnh 'IA-0')
      if (cols.some(c => c.includes('CHK-') || c.includes('IA-0'))) {
        items.push(cols);
      }
    }
  }

  return items;
}

/**
 * Hàm kiểm tra và đánh giá chất lượng toàn bộ checklist theo barem đề bài HW03.
 * 
 * @param {string} filePath - Đường dẫn tới file checklist Markdown cần kiểm tra.
 */
function validateChecklist(filePath) {
  // 1. Kiểm tra sự tồn tại của tệp tin mục tiêu
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Lỗi: Không tìm thấy file checklist tại đường dẫn: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const items = parseChecklistRows(content);

  console.log('====================================================================');
  console.log(`📋 BÁO CÁO KIỂM TOÁN CHECKLIST GUI: ${path.basename(filePath)}`);
  console.log('====================================================================');

  const total = items.length;
  console.log(`\n1️⃣ TỔNG SỐ MỤC CHECKLIST: ${total}`);

  // 2. Kiểm tra chỉ tiêu số lượng (đề bài yêu cầu > 40 mục)
  if (total < 40) {
    console.warn(`⚠️ CẢNH BÁO: Số lượng mục (${total}) CHƯA ĐẠT yêu cầu tối thiểu (> 40 mục của đề bài)!`);
  } else {
    console.log(`✅ Đạt yêu cầu số lượng: ${total} mục (>= 40 mục).`);
  }

  // 3. Khởi tạo bộ đếm phân bổ theo 4 Khía cạnh giao diện (Interface Aspects)
  const aspectCounts = {
    'IA-01 (Chuẩn UI chung)': 0,
    'IA-02 (Form)': 0,
    'IA-03 (Điều hướng)': 0,
    'IA-04 (Phản hồi/Trạng thái)': 0,
    'Khác / Chưa gắn tag': 0
  };

  let passedCount = 0;
  let failedCount = 0;
  let missingNotesForFailed = [];

  // 4. Duyệt qua từng mục để kiểm tra độ phủ khía cạnh và tính hợp lệ của trạng thái
  for (const row of items) {
    const rowStr = row.join(' ');

    // Đếm số lượng theo Aspect ID
    if (rowStr.includes('IA-01')) aspectCounts['IA-01 (Chuẩn UI chung)']++;
    else if (rowStr.includes('IA-02')) aspectCounts['IA-02 (Form)']++;
    else if (rowStr.includes('IA-03')) aspectCounts['IA-03 (Điều hướng)']++;
    else if (rowStr.includes('IA-04')) aspectCounts['IA-04 (Phản hồi/Trạng thái)']++;
    else aspectCounts['Khác / Chưa gắn tag']++;

    // Kiểm tra trạng thái thực thi: PASSED hoặc FAILED
    const isPassed = row.some(c => c.toUpperCase() === 'PASSED' || c.toUpperCase() === 'PASS');
    const isFailed = row.some(c => c.toUpperCase() === 'FAILED' || c.toUpperCase() === 'FAIL');

    if (isPassed) {
      passedCount++;
    } else if (isFailed) {
      failedCount++;

      // Theo đề bài: Mỗi mục Failed bắt buộc phải giải thích lý do vào cột Notes (áp chót)
      const noteCol = row[row.length - 2];
      const itemId = row.find(c => c.includes('CHK-')) || row[0] || 'Unknown Item';

      if (!noteCol || noteCol === '-' || noteCol.trim().length < 3) {
        missingNotesForFailed.push(itemId);
      }
    }
  }

  // 5. In kết quả phân bổ 4 khía cạnh giao diện (IA)
  console.log('\n2️⃣ PHÂN BỔ THEO 4 KHÍA CẠNH GIAO DIỆN (INTERFACE ASPECTS):');
  for (const [aspect, count] of Object.entries(aspectCounts)) {
    const icon = count > 0 ? '✅' : '❌';
    console.log(`  ${icon} ${aspect}: ${count} mục`);
  }

  // Cảnh báo nếu có khía cạnh nào hoàn toàn bị bỏ quên (count === 0)
  const missingAspects = Object.entries(aspectCounts).filter(([k, v]) => !k.includes('Khác') && v === 0);
  if (missingAspects.length > 0) {
    console.warn(`⚠️ CẢNH BÁO: Bị khuyết hoàn toàn các khía cạnh: ${missingAspects.map(a => a[0]).join(', ')}`);
  }

  // 6. In tổng hợp kết quả thực thi kiểm thử
  console.log('\n3️⃣ KẾT QUẢ THỰC THI (EXECUTION SUMMARY):');
  console.log(`  • Số mục ĐẠT (Passed): ${passedCount} (${((passedCount / total) * 100 || 0).toFixed(1)}%)`);
  console.log(`  • Số mục LỖI (Failed): ${failedCount} (${((failedCount / total) * 100 || 0).toFixed(1)}%)`);
  console.log(`  • Chưa thực thi / Khác: ${total - passedCount - failedCount}`);

  // 7. Cảnh báo lỗi thiếu giải trình cột Notes cho các mục FAILED
  if (missingNotesForFailed.length > 0) {
    console.warn('\n⚠️ CẢNH BÁO QUAN TRỌNG: Các mục FAILED sau đây ĐANG THIẾU LÝ DO THẤT BẠI ở cột Notes:');
    missingNotesForFailed.forEach(id => console.warn(`    - ${id}`));
    console.warn('  👉 Theo quy định đề bài, bắt buộc phải ghi rõ lý do thất bại cho tất cả ca FAILED!');
  } else if (failedCount > 0) {
    console.log('\n✅ Toàn bộ các mục FAILED đều đã được ghi chú lý do thất bại đầy đủ vào cột Notes.');
  }

  console.log('====================================================================\n');
}

// ----------------------------------------------------------------------------------------
// Điểm khởi chạy chính: Ưu tiên đường dẫn người dùng truyền vào, nếu không sẽ tự động tìm
// file tại `HW3/report/checklist.md` hoặc `report/checklist.md`.
// ----------------------------------------------------------------------------------------
const defaultTarget = fs.existsSync('HW3/report/checklist.md')
  ? 'HW3/report/checklist.md'
  : 'report/checklist.md';

const targetPath = process.argv[2] || defaultTarget;
validateChecklist(targetPath);
