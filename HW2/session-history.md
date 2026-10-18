# Session History - 2026-10-14

## Ngày làm việc: 14/10/2026
## Sinh viên: TRUONG THANH PHAT (23120319)
## Môn: CSC13003 - Kiem thu phan mem

---

## Tổng quan

Bắt đầu thực hiện HW02 - Domain Testing trên hệ thống EShop SUT.

---

## Những gì đã làm

### 1. Thiết lập môi trường
- Đọc và phân tích cấu trúc project
- Xác định các file spec và source code cần thiết:
  - Spec: `eshop-sut/api_specification.md`
  - Code: `eshop-sut/backend/server.js`, `eshop-sut/backend/database.js`

### 2. FR-01: Account Registration - Stage 0 & 1

#### Stage 0: Thu thập thông tin
- **Endpoint**: `POST /api/register`
- **Request fields**: `name`, `email`, `password`
- **Phát hiện quan trọng**: 
  - **KHÔNG CÓ VALIDATION** trong code (`server.js:20-30`)
  - Không kiểm tra required fields
  - Không kiểm tra email format
  - Không kiểm tra password length
  - Database schema không có UNIQUE constraint cho email (`database.js:50-61`)
- **Possible responses**:
  - 200: `{ message: "User registered successfully", id: <id> }`
  - 500: `{ error: <err.message> }`

#### Stage 1: Input / Output / State Variables
| Biến | Loại | Nguồn |
|------|------|-------|
| name | Input | [SPEC] |
| email | Input | [SPEC] |
| password | Input | [SPEC] |
| Response.status | Output | [CODE] |
| Response.message | Output | [CODE] |
| Response.error | Output | [CODE] |
| Response.id | Output | [CODE] |
| existing_email | State | - |

### 3. Câu hỏi mở (Open Questions)
1. Validation rules thực tế (độ dài, format) là gì?
2. Hệ thống có xử lý email duplicate không?
3. Request body rỗng `{}` sẽ xử lý thế nào?

### 4. Cập nhật cấu trúc thư mục
- Di chuyển report vào: `HW2/report/FR-01/01-domain-testing.vi.md`
- Di chuyển audit vào: `HW2/audit/audit-log.jsonl`
- Cập nhật CLAUDE.md để output đúng đường dẫn:
  - `HW2/report/`
  - `HW2/testcases/`
  - `HW2/audit/`
  - `HW2/evidence/`

### 5. Audit Log
- Tạo A01: FR-01 / Domain Testing / Stage 0-1
- Verdict: INCOMPLETE
- Lý do: Cần xác minh thêm bằng OBSERVED, cần bổ sung chi tiết đường dẫn:dòng

---

## Trạng thái hiện tại

- **FR-01 Domain Testing**:
  - **Stage 0 - 5**: ✅ Hoàn thành đầy đủ (16 test cases: FR01-DT-01 -> FR01-DT-16; Coverage matrix 100%)
  - **Audit Log**: ✅ Đã ghi A01, A02, A03, A04
- **FR-01 Boundary Value Analysis (BVA)**:
  - **Stage 1 (Ordered Partitions)**: ✅ Hoàn thành (`name.length` [1, 100], `password.length` [8, 128]; giải thích rõ các trường không áp dụng BVA)
  - **Stage 2 (3-value Variant)**: ✅ Hoàn thành (3-value BVA + Course 9-point model: 14 điểm kiểm thử)
  - **Stage 3 (Test Case Generation)**: ✅ Hoàn thành (14 test cases: `FR01-BVA-01` -> `FR01-BVA-14` kèm "Fault it would catch")
  - **Stage 4 (Self-Check & Blind spots)**: ✅ Hoàn thành
  - **Testcases JSON**: ✅ Đã cập nhật `HW2/testcases/FR-01.json` (tổng cộng 30 test cases: 16 DT + 14 BVA)
  - **Audit Log**: ✅ Đã ghi A05, A06 trong `HW2/audit/audit-log.jsonl`
- **FR-01 Test Execution & Bugs**:
  - **Stage 1 (Environment)**: ✅ SUT Backend chạy tại `http://localhost:3000`
  - **Stage 2 (Execute)**: ✅ Thực thi 30/30 test cases qua `run_cases.mjs` (10 PASS, 20 FAIL, 0 BLOCKED)
  - **Stage 3 (Triage)**: ✅ Phân loại 20 FAIL thành 5 lỗi gốc (BUG-FR01-01 đến BUG-FR01-05)
  - **Stage 4 (Bug Reports)**: ✅ Báo cáo tổng hợp `HW2/report/bugs.vi.md` và 5 bản thảo GitHub issues tại `HW2/report/issues/`
  - **Stage 5 (AI Gap Analysis)**: ✅ Phân tích 3 khoảng trống lớn (Cross-platform skew, Unicode byte vs char, Bias towards standard behavior) và nâng cấp kỹ năng v1 -> v2 tại `skills-changelog.md`
  - **Stage 6 (Summary numbers)**: ✅ Cập nhật `HW2/report/FR-01/03-execution-and-gap-analysis.vi.md`
  - **Audit Log**: ✅ Đã ghi A07 trong `HW2/audit/audit-log.jsonl`
- **Tình trạng**: Đã hoàn thành 100% trọn vẹn toàn bộ chu trình 4 kỹ năng cho **FR-01**.

---

## Kế hoạch tiếp theo

1. Sinh viên duyệt kết quả và thực hiện Git commit:
   `git add -A && git commit -m "HW2-docs(FR-01): test execution, bug reports and AI gap analysis"`
2. **Xác định tính năng tiếp theo**:
   - Lưu ý quan trọng: Quy định đồ án yêu cầu chọn 4 tính năng từ 4 Pool khác nhau (Pool A, Pool B, Pool C, Pool D - Mobile App).
   - Trước đó dự kiến (FR-01 Pool A, FR-03 Pool A, FR-08 Pool B, FR-11 Pool C) bị trùng Pool A và thiếu Pool D (mất 15 điểm tính năng D).
   - Cần chốt chọn 1 tính năng Pool D (Mobile App: Mobile Register, Mobile Search, Mobile Cart, hoặc Mobile Forgot Password).
3. Bắt đầu áp dụng bộ skill v2 cho tính năng kế tiếp.

---

## Ghi chú
- Sử dụng skill `domain-testing` -> `boundary-value-analysis` -> `test-execution-and-bugs`
- Sau mỗi artifact, chạy skill `ai-audit-log`
- Commit sau mỗi stage được duyệt
- Báo cáo bằng tiếng Việt có dấu

---

## File đã tạo/sửa gần nhất

| File | Hành động |
|------|-----------|
| `HW2/testcases/FR-01.json` | Cập nhật kết quả thực thi (10 PASS, 20 FAIL) |
| `HW2/report/bugs.vi.md` | Báo cáo tổng hợp 5 lỗi phát hiện |
| `HW2/report/issues/BUG-FR01-01.md` đến `BUG-FR01-05.md` | 5 bản thảo GitHub issues |
| `HW2/report/FR-01/03-execution-and-gap-analysis.vi.md` | Báo cáo tổng kết thực thi và khoảng trống AI của FR-01 |
| `skills-changelog.md` | Ghi nhận cải tiến kỹ năng v1 -> v2 từ AI Gap Analysis |
| `HW2/audit/audit-log.jsonl` | Thêm entry A07 |
| `HW2/session-history.md` | Cập nhật tiến độ hoàn thành Test Execution FR-01 |

---

**Ngày cập nhật**: 18/10/2026  
**Phiên tiếp theo**: Commit Git và triển khai tính năng kế tiếp với bộ skill v2.


