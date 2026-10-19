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
  - **Stage 0 (Facts Collection)**: ✅ Khảo sát đối chiếu 3 tầng (Backend, Web, Mobile). Phát hiện rò rỉ OTP qua response, token không hạn dùng, lệch pha regex password Web vs Mobile, lệch pha OTP 4 số vs 6 số.
  - **Stage 1 (Variables & Domains)**: ✅ Lập bảng biến Input / Output / State kèm miền giá trị chi tiết (Domains).
  - **Stage 2 (Equivalence Partitioning)**: ✅ Bảng 31 lớp tương đương (`EC01` đến `EC31`).
  - **Stage 3 (Representative Values)**: ✅ Xác định giá trị đại diện chuẩn cho 31 lớp EC.
  - **Stage 4 (Minimum Test Cases & Coverage Matrix)**: ✅ Thiết kế bộ 22 ca kiểm thử tối thiểu (`FR03-DT-01` đến `FR03-DT-22`), ma trận bao phủ 100%. Xuất tệp máy đọc `HW2/testcases/FR-03.json`.
  - **Stage 5 (Self-Check & Blind Spots)**: ✅ Phân tích blind spot (token expiry) và áp dụng nguyên tắc Zero-Trust SUT.
  - **Audit Log**: ✅ Đã ghi các entries A08, A09, A10 trong `HW2/audit/audit-log.jsonl`.
- **FR-03 (Forgot Password & Password Reset)**:
  - **Domain Testing (Stage 0 - 5)**: ✅ Hoàn thành trọn vẹn (22 test cases: `FR03-DT-01` đến `FR03-DT-22`, ma trận bao phủ 100%, ghi entries A08-A10).
  - **Boundary Value Analysis (Stage 1 - 4)**: ✅ Hoàn thành trọn vẹn:
    - Stage 1: Xác định 2 miền có thứ tự (`newPassword.length` [8, 128] và `resetToken.length/value`), giải thích rõ lý do không áp dụng cho email/boolean/complexity.
    - Stage 2: Biến thể 3-value BVA ($LB-1, LB, LB+1, UB-1, UB, UB+1$) kết hợp mô hình 9 điểm và quy tắc Encoding Boundary UTF-8 tiếng Việt (v2.0).
    - Stage 3: Thiết kế 15 ca kiểm thử BVA (`FR03-BVA-01` đến `FR03-BVA-15`) kèm cột "Lỗi code sẽ bắt được".
    - Stage 4: Tự kiểm tra và phân tích hạn chế.
    - Testcases JSON: Cập nhật `HW2/testcases/FR-03.json` (tổng cộng 37 test cases: 22 DT + 15 BVA).
    - Audit Log: Đã ghi entry A11 trong `HW2/audit/audit-log.jsonl`.
- **Tình trạng hiện tại**: Đã hoàn thành cả 2 kỹ thuật thiết kế kiểm thử (Domain Testing & BVA) cho **FR-03**. Đang dừng ở điểm kiểm soát **STOP FOR REVIEW** để sinh viên thẩm định trước khi chuyển sang kỹ thuật thực thi `test-execution-and-bugs`.

---

## Phiên 8: Thực thi kiểm thử (Stage 1-2) và Phân loại lỗi Triage (Stage 3) cho FR-03

- **Kỹ thuật**: `test-execution-and-bugs` (Stage 1 -> Stage 3)
- **Môi trường**: SUT backend đang chạy tại `http://localhost:3000` (Node.js/Express + SQLite3).
- **Kết quả thực thi**: Chạy thành công toàn bộ 37 ca kiểm thử API trong `HW2/testcases/FR-03.json`:
  - **PASS**: 21 ca.
  - **FAIL**: 16 ca.
  - **BLOCKED**: 0 ca.
- **Phân loại lỗi (Stage 3 Triage)**:
  - **11 ca thất bại do Backend hoàn toàn thiếu validation cho `newPassword`** (`FR03-DT-16` đến `FR03-DT-22`, `FR03-BVA-01`, `FR03-BVA-02`, `FR03-BVA-08`, `FR03-BVA-09`): Backend chấp nhận bất kỳ mật khẩu nào (kể cả chuỗi rỗng `""`, 1 ký tự, 10,000 ký tự payload), hash và lưu vào DB, trả về HTTP 200 `Password reset successfully` thay vì HTTP 400 Bad Request.
  - **5 ca thất bại do Backend thiếu validation dữ liệu đầu vào trên `POST /api/forgot-password`** (`FR03-DT-03` đến `FR03-DT-07`): Khi gửi email rỗng `""`, thiếu trường email, email sai format hoặc kiểu Boolean, backend không kiểm tra dữ liệu mà truy vấn thẳng SQLite `SELECT * FROM users WHERE email = ?` dẫn đến trả về HTTP 404 `User not found` thay vì HTTP 400 Bad Request.
  - **Lỗ hổng bảo mật nghiêm trọng phát hiện thêm**:
    1. Endpoint `POST /api/forgot-password` trả thẳng `resetToken` trong response body (CWE-200 / Information Disclosure), cho phép kẻ tấn công chiếm đoạt tài khoản mà không cần đọc email nạn nhân!
    2. Bảng `users` chỉ có cột `reset_token TEXT`, không có cột lưu thời gian tạo/hết hạn, mã OTP có hiệu lực vô thời hạn cho đến khi được dùng (CWE-613 / Insufficient Session Expiration).
- **Audit Log**: Thêm entry `A12` vào `HW2/audit/audit-log.jsonl`.

## Phiên 9: Báo cáo lỗi (Stage 4) và Phân tích khoảng trống AI Gap Analysis (Stage 5) cho FR-03

- **Kỹ thuật**: `test-execution-and-bugs` (Stage 4 -> Stage 5)
- **Hoạt động thực hiện**:
  - **Stage 4 (Soạn thảo báo cáo lỗi)**:
    - Bổ sung 4 lỗi phần mềm (`BUG-FR03-01` đến `BUG-FR03-04`) vào tài liệu tổng hợp `HW2/report/bugs.vi.md`.
    - Tạo 4 tệp dự thảo GitHub Issues trong `HW2/report/issues/`: `BUG-FR03-01.md` (Lộ OTP qua response body - Critical), `BUG-FR03-02.md` (Backend thiếu validation newPassword - Critical), `BUG-FR03-03.md` (Mã OTP vô thời hạn - Major), `BUG-FR03-04.md` (Trả 404 thay vì 400 cho invalid email - Minor).
  - **Stage 5 (AI Gap Analysis & Nâng cấp kỹ năng)**:
    - Tạo báo cáo hoàn chỉnh `HW2/report/FR-03/03-execution-and-gap-analysis.vi.md` bao gồm: tóm tắt thiết kế, bảng kết quả 37 ca kiểm thử, bảng phân loại lỗi triage, bảng phân tích 4 khoảng trống AI (Dynamic token dependency, Information disclosure blind spot, Token expiration omission, Spec vs code discrepancy), và phân tích hạn chế kỹ thuật.
    - Cập nhật nâng cấp kỹ năng v2.1 trong `skills-changelog.md` (Stateful dynamic setup hook, Sensitive field in response anti-pattern, Temporal state checklist).
- **Audit Log**: Thêm entry `A13` vào `HW2/audit/audit-log.jsonl`.
- **Tình trạng hiện tại**: Đang **DỪNG LẠI TẠI ĐIỂM KIỂM SOÁT STAGE 5 (STOP FOR REVIEW)** theo đúng yêu cầu bài tập và kỹ năng.

---

## Kế hoạch tiếp theo

1. Sinh viên thẩm định báo cáo lỗi Stage 4 và phân tích khoảng trống AI Stage 5 của FR-03.
2. Thực hiện Git commit theo định dạng: `feat(HW2): FR-03 bug reports and AI gap analysis stage 4-5`.
3. Sau khi được duyệt, chuyển sang **Stage 6 (Tổng hợp số liệu & Cập nhật Main Report)**:
   - Cập nhật phần FR-03 trong `HW2/23120319_HW02_Main_Report.md`.
   - Cập nhật bảng tổng hợp số liệu trong `HW2/README.md`.

---

## Ghi chú
- Sử dụng skill `domain-testing` -> `boundary-value-analysis` -> `test-execution-and-bugs`
- Sau mỗi artifact, chạy skill `ai-audit-log`
- Commit sau mỗi stage được duyệt theo format `feat(HW2): ...`
- Báo cáo bằng tiếng Việt có dấu
- **QUY TẮC BẮT BUỘC**: Dừng lại duyệt tại từng stage checkpoint (Stage 3 Triage và Stage 5 Gap Analysis).

---

## File đã tạo/sửa gần nhất

| File | Hành động |
|------|-----------|
| `HW2/report/bugs.vi.md` | Bổ sung 4 lỗi của FR-03 vào bảng tổng hợp và chi tiết lỗi |
| `HW2/report/issues/BUG-FR03-01.md` | Dự thảo GitHub Issue: Lộ mã OTP trong response |
| `HW2/report/issues/BUG-FR03-02.md` | Dự thảo GitHub Issue: Backend thiếu validation newPassword |
| `HW2/report/issues/BUG-FR03-03.md` | Dự thảo GitHub Issue: OTP không có thời hạn hết hạn |
| `HW2/report/issues/BUG-FR03-04.md` | Dự thảo GitHub Issue: Trả 404 thay vì 400 khi email sai |
| `HW2/report/FR-03/03-execution-and-gap-analysis.vi.md` | Tạo báo cáo thực thi và phân tích khoảng trống AI cho FR-03 |
| `skills-changelog.md` | Bổ sung mục 2.3 nâng cấp kỹ năng v2.1 từ bài học FR-03 |
| `HW2/audit/audit-log.jsonl` | Thêm entry A13 (FR-03 Stage 4-5) |
| `HW2/session-history.md` | Cập nhật tiến độ hoàn thành Stage 4-5 cho FR-03 |

---

**Ngày cập nhật**: 19/10/2026  
**Phiên hiện tại**: Đã hoàn thành Stage 4 & Stage 5 cho FR-03. DỪNG LẠI CHỜ DUYỆT (STOP FOR REVIEW).








