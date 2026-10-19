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

## Phiên 10: Hoàn thành Stage 6 (Tổng hợp số liệu, Cập nhật Main Report & README cho FR-03)

- **Kỹ thuật**: `test-execution-and-bugs` (Stage 6 — Final Stage of Feature FR-03)
- **Hoạt động thực hiện**:
  - Cập nhật toàn diện Mục 3.3 trong `HW2/23120319_HW02_Main_Report.md` với đầy đủ 7 tiểu mục phân tích chuyên sâu cho FR-03 (Tìm hiểu đặc tả SUT, Domain Testing với 31 ECs và 22 TCs, BVA 3-value với 15 TCs, Kết quả thực thi, Phân loại 4 lỗi, AI Gap Analysis v2.1, và Hạn chế kỹ thuật).
  - Cập nhật Mục 3.6 (Consolidated Bug Reports) trong Main Report với bảng tổng hợp 9 lỗi phần mềm đã xác thực của hệ thống (5 từ FR-01, 4 từ FR-03).
  - Cập nhật Mục 4 (Test Summary Report) trong Main Report và Mục 2 trong `HW2/README.md` với bảng số liệu đồng bộ 100% từ công cụ `summary.mjs`:
    - FR-01: 30 Designed, 30 Executed, 10 PASS, 20 FAIL, 5 Bugs.
    - FR-03: 37 Designed, 37 Executed, 21 PASS, 16 FAIL, 4 Bugs.
    - Tổng cộng: **67 Designed, 67 Executed, 31 PASS, 36 FAIL, 0 BLOCKED, 9 Bugs**.
  - Đánh dấu hoàn thành các mục kiểm tra trong Checklist của `HW2/README.md`.
- **Audit Log**: Thêm entry `A14` vào `HW2/audit/audit-log.jsonl`.
- **Tình trạng hiện tại**: Đã **HOÀN THÀNH 100% TÍNH NĂNG FR-03** trên toàn bộ 4 kỹ năng (`domain-testing`, `boundary-value-analysis`, `test-execution-and-bugs`, `ai-audit-log`). Sẵn sàng chuyển sang tính năng tiếp theo: **FR-08 — Checkout (Pool B)**.

---

## Phiên 11: Khởi động tính năng FR-08 (Checkout — Pool B) với Domain Testing (Stage 0 & 1)

- **Tính năng**: **FR-08 — Checkout (Thanh toán & Đặt hàng — Pool B)**
- **Kỹ thuật**: `domain-testing` (Stage 0 -> Stage 1)
- **Hoạt động thực hiện**:
  - **Stage 0 (Thu thập sự thật & Khảo sát SUT)**:
    - Khảo sát endpoint `POST /api/checkout` (yêu cầu header `Authorization: Bearer <token>`).
    - Đối chiếu chéo 3 tầng (Backend, Web, Mobile) theo checklist v2.0, phát hiện nhiều dị biệt và lỗ hổng bảo mật cực kỳ nghiêm trọng:
      1. *Lỗ hổng thao túng giá thanh toán (Price Tampering)*: Web (`Checkout.jsx:93-102`) cho phép người dùng tự do nhập/sửa ô input `editableTotal`! Backend hoàn toàn không tự tính lại tiền từ giỏ hàng mà tin tưởng tuyệt đối số tiền client gửi lên.
      2. *Lỗi Mobile cắt bỏ sản phẩm cuối cùng*: Mobile (`App.js:391`) cài đặt logic `cart.length > 1 ? cart.slice(0, -1) : cart` khiến đơn hàng luôn bị mất món đồ cuối cùng!
      3. *Mâu thuẫn trường `shipping_address`*: Đặc tả và DB có trường địa chỉ giao hàng, nhưng cả giao diện Web và Mobile đều không có ô nhập địa chỉ này.
      4. *Hệ thống không lưu chi tiết món hàng (`order_items`)*: Bảng `orders` chỉ lưu tổng tiền, không lưu danh sách sản phẩm hay số lượng đã mua.
      5. *Backend thiếu hoàn toàn validation*: Không kiểm tra tiền âm, 0, chuỗi, không kiểm tra giỏ hàng rỗng, không trừ tồn kho.
    - Lập danh sách 4 câu hỏi mở.
  - **Stage 1 (Bảng biến và miền giá trị)**:
    - Xây dựng bảng 7 biến (Inputs, State/Context, Outputs) kèm cột Domain value & constraints (cải tiến v1.1).
    - Lưu báo cáo tiếng Việt tại `HW2/report/FR-08/01-domain-testing.vi.md`.
- **Audit Log**: Thêm entry `A15` vào `HW2/audit/audit-log.jsonl`.
- **Tình trạng hiện tại**: **DỪNG LẠI TẠI CHECKPOINT STAGE 0 & 1 CHỜ DUYỆT (STOP FOR REVIEW)** theo đúng yêu cầu bài tập.

---

## Kế hoạch tiếp theo

1. Sinh viên thẩm định kết quả khảo sát Stage 0 và Bảng biến Stage 1 của FR-08.
2. Thực hiện Git commit theo định dạng: `feat(HW2): FR-08 domain testing stage 0 and 1`.
3. Sau khi được duyệt, chuyển sang **Stage 2 (Phân hoạch các lớp tương đương Equivalence Partitioning)** cho FR-08 -> DỪNG LẠI CHỜ DUYỆT.

---

## Ghi chú
- Sử dụng skill `domain-testing` -> `boundary-value-analysis` -> `test-execution-and-bugs`
- Sau mỗi artifact, chạy skill `ai-audit-log`
- Commit sau mỗi stage được duyệt theo format `feat(HW2): ...`
- Báo cáo bằng tiếng Việt có dấu
- **QUY TẮC BẮT BUỘC**: Dừng lại duyệt tại từng stage checkpoint (Stage 0+1, Stage 2, Stage 3+5 của Domain Testing; Stage 1+2, Stage 3+4 của BVA; Stage 3, Stage 5 của Execution).

---

### 5. FR-12: Access Control (Kiểm soát truy cập) - Hoàn tất Domain Testing, BVA, Test Execution & Defect Triage (Stage 0-5)

- **Domain Testing (Stage 0 - Stage 5)**:
  - Khảo sát 14 endpoint thuộc nhóm Admin, Categories, Products, Coupons, Users.
  - Xây dựng 23 lớp tương đương (`EC01` – `EC23`) bao quát phân quyền và xác thực.
  - Thiết kế 18 test cases (`FR12-DT-01` đến `FR12-DT-18`), độ bao phủ 100%.
  - Lưu báo cáo tại `HW2/report/FR-12/01-domain-testing.vi.md`.
  - Audit log: `A16`, `A17`, `A18`.
- **Boundary Value Analysis (Stage 1 - Stage 4)**:
  - Chọn 3 miền có thứ tự: `token.exp`, `param.id`, và `product price/stock`.
  - Áp dụng biến thể 3-value BVA, mô hình 9 điểm, kiểm thử biên mã hóa UTF-8 tiếng Việt có dấu.
  - Thiết kế 14 test cases (`FR12-BVA-01` đến `FR12-BVA-14`).
  - Xuất file máy đọc tổng hợp `HW2/testcases/FR-12.json` (32 test cases).
  - Lưu báo cáo tại `HW2/report/FR-12/02-boundary-value-analysis.vi.md`.
  - Audit log: `A19`.
- **Thực thi kiểm thử, Triage lỗi & Báo cáo chính (Stage 1 - Stage 6)**:
  - Thực thi toàn bộ 32 test cases qua runner: **21 PASS, 11 FAIL, 0 BLOCKED**.
  - Triage 11 ca thất bại thành 3 lỗi phần mềm gốc rễ:
    1. `BUG-FR12-01` (Critical, P1): `authenticateToken` thiếu kiểm tra `role === 'admin'`.
    2. `BUG-FR12-02` (Critical, P1): Nhóm route `POST/PUT/DELETE /api/products` bỏ quên `authenticateToken`.
    3. `BUG-FR12-03` (High, P2): Lỗ hổng Mass Assignment tại `PUT /api/users/me` cho phép user tự nâng quyền thành admin.
  - Cập nhật tài liệu tổng hợp lỗi `HW2/report/bugs.vi.md` (nâng lên 12 bugs).
  - Tạo 3 dự thảo GitHub Issues: `BUG-FR12-01.md`, `BUG-FR12-02.md`, `BUG-FR12-03.md` tại `HW2/report/issues/`.
  - Tạo báo cáo thực thi và AI Gap Analysis tại `HW2/report/FR-12/03-execution-and-gap-analysis.vi.md`.
  - Cập nhật nâng cấp kỹ năng v2.2 trong `skills-changelog.md`.
  - Cập nhật Báo cáo chính `HW2/23120319_HW02_Main_Report.md`: hoàn thiện Mục 3.5 (7 tiểu mục FR-12), cập nhật Mục 3.6 (12 bugs), cập nhật Mục 4 (99 test cases: 52 PASS, 47 FAIL).
  - Cập nhật `HW2/README.md`: tổng hợp 99 test cases, 12 bugs và đánh dấu hoàn thành checklist cho FR-12.
  - Audit log: `A20`, `A21`.
- **Tình trạng hiện tại**: **HOÀN THÀNH TOÀN DIỆN TÍNH NĂNG FR-12 (STAGE 0 ĐẾN STAGE 6). DỪNG LẠI CHỜ DUYỆT (STOP FOR REVIEW)**.

---

## File đã tạo/sửa gần nhất

| File | Hành động |
|------|-----------|
| `HW2/report/FR-12/01-domain-testing.vi.md` | Hoàn thành báo cáo Domain Testing (Stage 0 - 5) cho FR-12 |
| `HW2/report/FR-12/02-boundary-value-analysis.vi.md` | Hoàn thành báo cáo BVA (Stage 1 - 4) cho FR-12 |
| `HW2/testcases/FR-12.json` | Bộ 32 test cases máy đọc hoàn chỉnh (18 DT + 14 BVA) |
| `HW2/evidence/FR-12/test-execution.log` | Log thực thi chi tiết 32 test cases (21 PASS, 11 FAIL) |
| `HW2/report/bugs.vi.md` | Bổ sung 3 lỗi BUG-FR12-01, BUG-FR12-02, BUG-FR12-03 (tổng 12 bugs) |
| `HW2/report/issues/BUG-FR12-01.md` | Dự thảo GitHub Issue BUG-FR12-01 (Broken Access Control) |
| `HW2/report/issues/BUG-FR12-02.md` | Dự thảo GitHub Issue BUG-FR12-02 (Missing Auth Products) |
| `HW2/report/issues/BUG-FR12-03.md` | Dự thảo GitHub Issue BUG-FR12-03 (Mass Assignment Privilege Escalation) |
| `HW2/report/FR-12/03-execution-and-gap-analysis.vi.md` | Báo cáo thực thi và phân tích khoảng trống AI Gap Analysis |
| `skills-changelog.md` | Cập nhật nâng cấp kỹ năng v2.2 |
| `HW2/23120319_HW02_Main_Report.md` | Cập nhật Mục 3.5, 3.6 (12 bugs), Mục 4 (99 test cases) |
| `HW2/README.md` | Cập nhật bảng tổng kết 99 TCs, 12 bugs, checklist FR-12 |
| `HW2/audit/audit-log.jsonl` | Thêm các entry A16, A17, A18, A19, A20, A21 |

---

**Ngày cập nhật**: 19/10/2026  
**Phiên hiện tại**: Đã hoàn thành toàn bộ Stage 0 đến Stage 6 cho FR-12 (Kiểm soát truy cập). Sẵn sàng chuyển sang FR-08 (Checkout - Stage 2 trở đi). DỪNG LẠI CHỜ DUYỆT (STOP FOR REVIEW).












