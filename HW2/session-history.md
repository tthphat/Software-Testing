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
- **FR-01 (Account Registration)**: ✅ Hoàn thành 100% trọn vẹn toàn bộ chu trình 4 kỹ năng (Domain Testing, BVA, Execution, Bug Reports, v2 Changelog, Main Report).
- **FR-03 (Forgot Password & Password Reset)**:
  - **Stage 0 (Facts Collection)**: ✅ Hoàn thành khảo sát đối chiếu 3 tầng (Backend, Web, Mobile). Phát hiện lỗi rò rỉ OTP qua response, token không có thời hạn, lệch pha regex password Web vs Mobile, lệch pha OTP 4 số vs 6 số.
  - **Stage 1 (Variables & Domains)**: ✅ Lập bảng biến Input / Output / State kèm miền giá trị chi tiết (Domains) tại `HW2/report/FR-03/01-domain-testing.vi.md`.
  - **Audit Log**: ✅ Đã ghi entry A08 trong `HW2/audit/audit-log.jsonl`.
- **Tình trạng hiện tại**: Đang dừng ở điểm kiểm soát **STOP FOR REVIEW** sau Stage 0 & Stage 1 của FR-03 để sinh viên thẩm định và phê duyệt trước khi sang Stage 2 (Equivalence Partitioning).

---

## Kế hoạch tiếp theo

1. Sinh viên thẩm định kết quả Stage 0 và Stage 1 của FR-03.
2. Tiến hành **Stage 2: Phân hoạch tương đương (Equivalence Partitioning)** cho FR-03 theo slide S04 (phân hoạch cho cả 2 bước: yêu cầu OTP và đặt lại mật khẩu).
3. Đề xuất commit Git sau khi hoàn thành các chặng được duyệt.

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
| `HW2/report/FR-03/01-domain-testing.vi.md` | Tạo báo cáo Stage 0 và Stage 1 cho FR-03 |
| `HW2/audit/audit-log.jsonl` | Thêm entry A08 (FR-03 Stage 0-1) |
| `HW2/session-history.md` | Cập nhật tiến độ bắt đầu FR-03 |
| `HW2/23120319_HW02_Main_Report.md` | Hoàn thiện toàn bộ nội dung FR-01 trong Báo cáo chính |

---

**Ngày cập nhật**: 19/10/2026  
**Phiên hiện tại**: Đang chờ sinh viên duyệt Stage 0 & Stage 1 của FR-03.



