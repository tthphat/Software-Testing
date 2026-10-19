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
- **Tình trạng hiện tại**: Đã hoàn thành Stage 0 & 1, chuyển tiếp Stage 2.

## Phiên 12: Phân hoạch tương đương (Stage 2) cho tính năng FR-08 (Checkout)

- **Tính năng**: **FR-08 — Checkout (Thanh toán & Đặt hàng — Pool B)**
- **Kỹ thuật**: `domain-testing` (Stage 2)
- **Hoạt động thực hiện**:
  - Áp dụng đầy đủ 6 kỹ thuật phân hoạch lớp tương đương theo slide bài giảng S04.
  - Xây dựng bảng **31 lớp tương đương (`EC01` đến `EC31`)**.
  - Cập nhật báo cáo `HW2/report/FR-08/01-domain-testing.vi.md`.
- **Audit Log**: Thêm entry `A16` vào `HW2/audit/audit-log.jsonl`.

---

## Phiên 13: Thiết kế ca kiểm thử miền tối thiểu (Stage 3-5) cho FR-08 (Checkout)

- **Tính năng**: **FR-08 — Checkout (Thanh toán & Đặt hàng — Pool B)**
- **Kỹ thuật**: `domain-testing` (Stage 3, Stage 4, Stage 5)
- **Hoạt động thực hiện**:
  - **Stage 3 (Representative Values)**: Chọn đúng 1 giá trị đại diện cho từng lớp tương đương (tất cả 31 ECs từ EC01 đến EC31) kèm lý do giải trình ngắn gọn và ghi chú kỹ thuật.
  - **Stage 4 (Minimum Test Cases & Coverage Matrix)**:
    - Thiết kế bộ **22 ca kiểm thử miền tối thiểu (`FR08-DT-01` đến `FR08-DT-22`)**:
      - 2 ca kiểm thử hợp lệ kết hợp tối đa các valid classes: `FR08-DT-01` (checkout chuẩn không coupon) và `FR08-DT-02` (checkout có coupon hợp lệ).
      - 20 ca kiểm thử không hợp lệ tuân thủ nghiêm ngặt nguyên tắc **Cô lập lỗi đơn (Single-fault isolation)**: mỗi ca chỉ chứa đúng 1 lỗi đơn lẻ, các trường còn lại giữ hợp lệ danh định.
    - Xây dựng ma trận bao phủ **100% (31/31 ECs)**.
    - Cập nhật thông tin cấu hình tài khoản `test@eshop.com` trong `HW2/testcases/config.json`.
    - Xuất tệp dữ liệu test ca hoàn chỉnh `HW2/testcases/FR-08.json` (22 test cases, status `NOT_EXECUTED`).
  - **Stage 5 (Self-check & Blind spots)**: Rà soát 5 tiêu chí tự kiểm tra chất lượng; phân tích 3 điểm mù của kỹ thuật kiểm thử miền (hành vi tại biên, lỗi tương tranh race conditions, và tấn công injection).
  - Cập nhật báo cáo `HW2/report/FR-08/01-domain-testing.vi.md`.
- **Audit Log**: Thêm entry `A17` vào `HW2/audit/audit-log.jsonl`.
- **Tình trạng hiện tại**: **DỪNG LẠI TẠI CHECKPOINT STAGE 4 & 5 CHỜ DUYỆT (STOP FOR REVIEW)**.

---

## Phiên 14: Phân tích giá trị biên (Stage 1-2) cho tính năng FR-08 (Checkout)

- **Tính năng**: **FR-08 — Checkout (Thanh toán & Đặt hàng — Pool B)**
- **Kỹ thuật**: `boundary-value-analysis` (Stage 1 & Stage 2)
- **Hoạt động thực hiện**:
  - **Stage 1 (Ordered Partitions)**:
    - Xác định 3 miền có thứ tự: `total_amount` ($1 \le \text{amount} \le 2,147,483,647$), `shipping_address` ($5 \le \text{length} \le 255$), `cart_items_count` ($1 \le \text{items} \le 100$).
    - Nêu rõ bước nhảy nhỏ nhất (1 VNĐ, 1 ký tự, 1 sản phẩm).
    - Lập bảng loại trừ 5 trường không áp dụng BVA (`auth_token`, `user_id`, `status`, `coupon_id`, `items array`) kèm lý do kỹ thuật chi tiết.
  - **Stage 2 (Variant & Test Model)**:
    - Lựa chọn biến thể **3-value BVA** ($LB-1, LB, LB+1, UB-1, UB, UB+1$) khớp chuẩn giáo trình CSC13003 S04.
    - Mở rộng mô hình 9 điểm: Giá trị danh định (Nominal), Cực trị vật lý ($-\alpha, +\alpha$ như số âm `-50,000`, `MAX_SAFE_INT`, chuỗi rỗng `""`, payload 10,000 ký tự).
    - Tích hợp **Encoding Boundary Rule (v2.0)**: Ca kiểm thử địa chỉ tiếng Việt UTF-8 có dấu tại cận trên 255 ký tự để kiểm tra lỗi đo độ dài `Buffer.byteLength` vs `string.length`.
    - Tích hợp **Cross-Platform Skew Boundary**: Điểm biên `cart.length = 1` vs `2` kích hoạt bug cắt bỏ sản phẩm trên Mobile (`App.js:391`).
    - Lập bảng tổng hợp các điểm biên dự kiến cho Stage 3.
  - **Tài liệu tạo mới**: `HW2/report/FR-08/02-boundary-value-analysis.vi.md`.
- **Audit Log**: Thêm entry `A18` vào `HW2/audit/audit-log.jsonl`.
- **Tình trạng hiện tại**: **DỪNG LẠI TẠI CHECKPOINT STAGE 1 & 2 CHỜ DUYỆT (STOP FOR REVIEW)**.

---

## Phiên 15: Thiết kế ca kiểm thử giá trị biên và tự kiểm tra (Stage 3-4) cho FR-08 (Checkout)

- **Tính năng**: **FR-08 — Checkout (Thanh toán & Đặt hàng — Pool B)**
- **Kỹ thuật**: `boundary-value-analysis` (Stage 3 & Stage 4)
- **Hoạt động thực hiện**:
  - **Stage 3 (Test Case Generation)**:
    - Thiết kế bộ **20 ca kiểm thử BVA (`FR08-BVA-01` đến `FR08-BVA-20`)** tuân thủ nguyên tắc đơn biến (Single-fault assumption):
      - 8 ca cho `total_amount`: $-\alpha$ (-50k), $LB-1$ (0đ), $LB$ (1đ), $LB+1$ (2đ), $UB-1$ (2,147,483,646đ), $UB$ (2,147,483,647đ int32 max), $UB+1$ (2,147,483,648đ), $+\alpha$ (`MAX_SAFE_INT`).
      - 9 ca cho `shipping_address`: $-\alpha$ (rỗng 0 ký tự), $LB-1$ (4 ký tự), $LB$ (5 ký tự), $LB+1$ (6 ký tự), $UB-1$ (254 ký tự), $UB$ (255 ký tự ASCII), $UB$ (255 ký tự tiếng Việt UTF-8 có dấu 330 bytes theo v2.0 rule), $UB+1$ (256 ký tự), $+\alpha$ (payload 10,000 ký tự DoS).
      - 3 ca cho `cart_items_count`: $LB-1$ (0 món giỏ rỗng), $LB$ (1 món - Mobile không cắt), $LB+1$ (2 món - Mobile kích hoạt bug cắt bỏ sản phẩm cuối `cart.slice(0, -1)`).
    - Bổ sung cột "Lỗi code sẽ bắt được (Fault it would catch)" giải trình chi tiết lỗi off-by-one, tràn số nguyên, tràn bộ nhớ, và đo sai byte/char.
    - Cập nhật **20 ca BVA vào `HW2/testcases/FR-08.json`** (nâng tổng số test cases của FR-08 lên **42 ca: 22 DT + 20 BVA**).
  - **Stage 4 (Self-Check & Blind spots)**:
    - Rà soát 6 tiêu chí tự kiểm tra của kỹ năng BVA.
    - Phân tích 4 điểm mù của BVA (Price tampering giỏ hàng vs total, SQLi/XSS trong address, Concurrency overselling tồn kho, và SUT Zero-Validation Defect).
  - **Tài liệu hoàn thiện**: `HW2/report/FR-08/02-boundary-value-analysis.vi.md`.
- **Audit Log**: Thêm entry `A19` vào `HW2/audit/audit-log.jsonl`.
- **Tình trạng hiện tại**: **DỪNG LẠI TẠI CHECKPOINT STAGE 3 & 4 CHỜ DUYỆT (STOP FOR REVIEW)**.

---

## Phiên 16: Thực thi kiểm thử (Stage 1-2) và Phân loại lỗi Triage (Stage 3) cho FR-08 (Checkout)

- **Tính năng**: **FR-08 — Checkout (Thanh toán & Đặt hàng — Pool B)**
- **Kỹ thuật**: `test-execution-and-bugs` (Stage 1, Stage 2, Stage 3)
- **Môi trường**: SUT backend đang chạy tại `http://localhost:3000` (Node.js/Express + SQLite3).
- **Kết quả thực thi**: Chạy thành công toàn bộ **42 ca kiểm thử API** trong `HW2/testcases/FR-08.json`:
  - **PASS**: **16 ca (38.1%)**
  - **FAIL**: **26 ca (61.9%)**
  - **BLOCKED**: **0 ca (0%)**
- **Minh chứng thực thi**: Lưu trữ tệp log đầy đủ tại `HW2/evidence/FR-08/test-execution.log`.
- **Phân loại lỗi (Stage 3 Triage)**: Toàn bộ 26 ca FAIL quy về **7 lỗi phần mềm cốt lõi**:
  1. `BUG-FR08-01` (Critical): Backend hoàn toàn thiếu validation cho `total_amount` (chấp nhận tiền âm, 0đ, chuỗi, boolean, float, null, tràn số int32) — 11 ca test.
  2. `BUG-FR08-02` (Critical): Lỗ hổng Parameter Tampering / Thao túng giá đơn hàng (Backend tin tưởng 100% số tiền client gửi lên, không tính lại từ giỏ hàng; Web UI cho phép user tự sửa giá trong ô input) — 1 ca test.
  3. `BUG-FR08-03` (Major): Backend hoàn toàn thiếu validation cho `shipping_address` (chấp nhận rỗng, null, chuỗi dài) và cả Web/Mobile đều không có ô nhập địa chỉ — 9 ca test.
  4. `BUG-FR08-04` (Major): Backend không kiểm tra giỏ hàng khi checkout (Cho phép đặt hàng khi giỏ rỗng `cart = []`) — 2 ca test.
  5. `BUG-FR08-05` (Critical): Dị biệt logic nghiêm trọng trên Mobile: Frontend Mobile tự ý cắt xén sản phẩm cuối cùng trong giỏ hàng (`cart.slice(0, -1)`) — 1 ca test.
  6. `BUG-FR08-06` (Major): Backend không kiểm tra tồn kho (Overselling Defect) và không lưu chi tiết các mặt hàng trong đơn hàng (`order_items`) — 1 ca test.
  7. `BUG-FR08-07` (Minor): Endpoint checkout không kiểm tra tính hợp lệ của mã giảm giá `coupon_id` — 1 ca test.
- **Tài liệu tạo mới**: `HW2/report/FR-08/03-execution-and-gap-analysis.vi.md`.
- **Audit Log**: Thêm entry `A20` vào `HW2/audit/audit-log.jsonl`.
- **Tình trạng hiện tại**: **DỪNG LẠI TẠI CHECKPOINT STAGE 3 CHỜ DUYỆT (STOP FOR REVIEW)**.

---

## Phiên 17: Báo cáo lỗi (Stage 4) và Phân tích khoảng trống AI Gap Analysis (Stage 5) cho FR-08 (Checkout)

- **Tính năng**: **FR-08 — Checkout (Thanh toán & Đặt hàng — Pool B)**
- **Kỹ thuật**: `test-execution-and-bugs` (Stage 4, Stage 5)
- **Hoạt động thực hiện**:
  - **Stage 4 (Bug Reports & GitHub Issues)**:
    - Bổ sung 7 lỗi phần mềm (`BUG-FR08-01` đến `BUG-FR08-07`) vào báo cáo tổng hợp `HW2/report/bugs.vi.md`.
    - Tạo 7 bản thảo GitHub Issues hoàn chỉnh trong `HW2/report/issues/`:
      - `BUG-FR08-01.md`: Backend thiếu validation `total_amount` (Critical).
      - `BUG-FR08-02.md`: Lỗ hổng Parameter Tampering, Web cho phép sửa giá tiền (Critical).
      - `BUG-FR08-03.md`: Backend thiếu validation `shipping_address`, Web/Mobile thiếu trường địa chỉ (Major).
      - `BUG-FR08-04.md`: Checkout khi giỏ hàng rỗng và không dọn giỏ sau đặt hàng (Major).
      - `BUG-FR08-05.md`: Mobile tự ý cắt xén sản phẩm cuối cùng `cart.slice(0, -1)` (Critical).
      - `BUG-FR08-06.md`: Không kiểm tra tồn kho Overselling và DB thiếu bảng `order_items` (Major).
      - `BUG-FR08-07.md`: Không kiểm tra tính hợp lệ của coupon khi checkout (Minor).
  - **Stage 5 (AI Gap Analysis & Nâng cấp kỹ năng v2.2)**:
    - Phân tích 4 khoảng trống AI lớn đối chiếu với 3 phân loại bắt buộc của đề bài (Prompt/input quality, Tool limitation, Inherent feature complexity).
    - Cập nhật nâng cấp bộ kỹ năng lên **v2.2** trong `skills-changelog.md`: Quy tắc toàn vẹn giao dịch tài chính (Financial Transaction Integrity Rule), Kiểm tra thuộc tính input form client nhạy cảm (Cross-Platform Inspection), và Checklist đối chiếu CSDL chi tiết (Database Schema Checklist).
    - Hoàn thiện tài liệu `HW2/report/FR-08/03-execution-and-gap-analysis.vi.md`.
- **Audit Log**: Thêm entry `A21` vào `HW2/audit/audit-log.jsonl`.
- **Tình trạng hiện tại**: **DỪNG LẠI TẠI CHECKPOINT STAGE 5 CHỜ DUYỆT (STOP FOR REVIEW)**.

---

## Phiên 18: Hoàn tất Stage 6 tính năng FR-08 (Checkout) & Đồng bộ Main Report

- **Tính năng**: **FR-08 — Checkout (Thanh toán & Đặt hàng — Pool B)**
- **Kỹ thuật**: `test-execution-and-bugs` (Stage 6) & Main Report Synchronization
- **Hoạt động thực hiện**:
  - **Đồng bộ Main Report (`HW2/23120319_HW02_Main_Report.md`)**:
    - *Mục 2 (Feature selection and scope)*: Đánh dấu hoàn thành 100% cho tính năng **FR-08 — Checkout (Pool B)**.
    - *Mục 3.4 (FR-08 — Checkout)*: Bổ sung toàn diện nội dung kiểm thử chuyên sâu gồm 7 tiểu mục:
      - 3.4.1: Khảo sát thực tế mã nguồn SUT, bóc tách các lỗ hổng Parameter Tampering (`server.js:299`), Web input `editableTotal` (`Checkout.jsx:93`), Mobile skew tự ý cắt xén giỏ hàng (`App.js:391`), thiếu trường `shipping_address`, cho phép đặt hàng khi giỏ rỗng, và CSDL thiếu bảng `order_items`.
      - 3.4.2: Kiểm thử miền (Domain Testing) với 6 biến, 31 lớp tương đương (`EC01`–`EC31`), 22 ca kiểm thử tối thiểu (`FR08-DT-01`–`FR08-DT-22`), ma trận bao phủ 100%.
      - 3.4.3: Phân tích giá trị biên (BVA) trên 3 miền thứ tự (`total_amount`, `shipping_address.length`, `cart.item_count`), biến thể 3-value BVA, mô hình 9 điểm và quy tắc Encoding Boundary Rule UTF-8 tiếng Việt (v2.0), bộ 20 test cases BVA (`FR08-BVA-01`–`FR08-BVA-20`).
      - 3.4.4: Bảng kết quả thực thi 42 test cases đầy đủ (16 PASS, 26 FAIL, 0 BLOCKED).
      - 3.4.5: Phân loại 26 ca FAIL về 7 lỗi phần mềm độc lập (`BUG-FR08-01` đến `BUG-FR08-07`) kèm bảng tổng hợp mức độ nghiêm trọng và liên kết issue drafts.
      - 3.4.6: Phân tích khoảng trống AI Gap Analysis theo 3 nhóm nguyên nhân của đề bài và các quy tắc cải tiến bộ kỹ năng v2.2.
      - 3.4.7: Đánh giá các hạn chế kỹ thuật của phương pháp kiểm thử hộp đen.
    - *Mục 3.6 (Consolidated Bug Reports)*: Cập nhật danh mục lên **16 lỗi phần mềm toàn hệ thống** (5 lỗi FR-01, 4 lỗi FR-03, 7 lỗi FR-08).
    - *Mục 4 (Test Summary Report)*: Cập nhật bảng tổng hợp số liệu kết xuất từ `summary.mjs`:
      - FR-01: 30 Designed, 30 Executed, 10 PASS, 20 FAIL.
      - FR-03: 37 Designed, 37 Executed, 21 PASS, 16 FAIL.
      - FR-08: 42 Designed, 42 Executed, 16 PASS, 26 FAIL.
      - Tổng cộng: **109 Designed, 109 Executed, 47 PASS, 62 FAIL, 0 BLOCKED, 0 NOT EXECUTED**.
  - **Audit Log**: Thêm entry `A22` vào `HW2/audit/audit-log.jsonl`.
- **Tình trạng hiện tại**: Đã **HOÀN THÀNH 100% TÍNH NĂNG FR-08 (Pool B)** trên toàn bộ 4 kỹ năng (`domain-testing`, `boundary-value-analysis`, `test-execution-and-bugs`, `ai-audit-log`).

---

## Kế hoạch tiếp theo

1. Học viên thẩm định kết quả hoàn tất tính năng FR-08 và việc đồng bộ Main Report.
2. Thực hiện Git commit theo định dạng: `feat(HW2): FR-08 finalize stage 6 and update main report`.
3. Chuyển sang tính năng tiếp theo: **FR-12 — Access Control (Phân quyền vai trò Admin / Customer — Pool C)**, bắt đầu bằng kỹ năng `domain-testing` (Stage 0 & 1).

---

## Ghi chú
- Sử dụng skill `domain-testing` -> `boundary-value-analysis` -> `test-execution-and-bugs`
- Sau mỗi artifact, chạy skill `ai-audit-log`
- Commit sau mỗi stage được duyệt theo format `feat(HW2): ...`
- Báo cáo bằng tiếng Việt có dấu
- **QUY TẮC BẮT BUỘC**: Dừng lại duyệt tại từng stage checkpoint (Stage 0+1, Stage 2, Stage 3+5 của Domain Testing; Stage 1+2, Stage 3+4 của BVA; Stage 3, Stage 5 của Execution).

---

## File đã tạo/sửa gần nhất

| File | Hành động |
|------|-----------|
| `HW2/23120319_HW02_Main_Report.md` | Tích hợp hoàn tất FR-08 (Section 3.4), 16 bugs (Section 3.6), 109 TCs (Section 4) |
| `HW2/audit/audit-log.jsonl` | Thêm entry A22 (FR-08 Main Report Update) |
| `HW2/session-history.md` | Cập nhật Phiên 18 hoàn tất Stage 6 và tính năng FR-08 |

---

**Ngày cập nhật**: 19/10/2026  
**Phiên hiện tại**: Đã hoàn thành 100% tính năng FR-08. DỪNG LẠI CHỜ DUYỆT (STOP FOR REVIEW) trước khi sang FR-12.











