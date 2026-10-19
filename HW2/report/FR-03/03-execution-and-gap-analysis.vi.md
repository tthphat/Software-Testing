# FR-03 — Quên mật khẩu và Đặt lại mật khẩu (Forgot Password & Password Reset)
## Báo cáo thực thi kiểm thử và phân tích khoảng trống AI (Execution & Gap Analysis Report)

---

## 1. Phạm vi và đặc tả
- **Endpoint kiểm thử**:
  - Bước 1: `POST /api/forgot-password` (Yêu cầu cấp mã OTP đặt lại mật khẩu)
  - Bước 2: `POST /api/reset-password` (Xác thực OTP và đặt mật khẩu mới)
- **Môi trường**: Backend SUT chạy tại `http://localhost:3000` (Node.js/Express, SQLite3).
- **Nguồn đặc tả đã sử dụng**:
  - `docs/api_specification.md` (mục 1.3 Quên mật khẩu và 1.4 Đặt lại mật khẩu) `[SPEC]`
  - Mã nguồn Backend: `eshop-sut/backend/server.js:68-98` và `eshop-sut/backend/database.js:58` `[CODE]`
  - Mã nguồn Frontend Web: `eshop-sut/frontend-web/src/pages/ForgotPassword.jsx:10-70` `[CODE]`
  - Mã nguồn Frontend Mobile: `eshop-sut/frontend-mobile/App.js:250-280` `[CODE]`
  - Quan sát thực thi qua HTTP API Runner: `[OBSERVED]`
- **Giải quyết các câu hỏi mở & Bất cập đặc tả**:
  - Đặc tả `api_specification.md:42` đưa ví dụ OTP 6 chữ số `"123456"`, nhưng thực tế mã nguồn backend `server.js:72` sinh ngẫu nhiên số có 4 chữ số `Math.floor(1000 + Math.random() * 9000).toString()`, khớp với nhãn giao diện Web "Mã OTP (4 số)".
  - Backend hoàn toàn không có bất kỳ dòng code validation nào cho trường `newPassword` ở Bước 2.
  - Bảng cơ sở dữ liệu `users` không có trường lưu thời gian hết hạn của OTP (Token never expires).
  - Endpoint `POST /api/forgot-password` trả thẳng `resetToken` trong response body.

---

## 2. Tóm tắt thiết kế kiểm thử (Domain Testing & BVA)
- **Domain Testing (S04)**: Thiết kế 31 lớp tương đương (EC01 – EC31) bao quát toàn bộ 2 bước của quy trình khôi phục mật khẩu, sinh 22 ca kiểm thử tối thiểu (`FR03-DT-01` đến `FR03-DT-22`), đạt độ bao phủ 100% ma trận equivalence class.
- **Boundary Value Analysis**: Xác định 2 miền có thứ tự (`newPassword.length` [8, 128] và `resetToken.length/value` [1000, 9999]), áp dụng biến thể 3-value BVA, mô hình 9 điểm (extremes 0 và 10,000) và quy tắc mã hóa tiếng Việt có dấu UTF-8 (v2.0 Encoding Rule), sinh 15 ca kiểm thử (`FR03-BVA-01` đến `FR03-BVA-15`).
- **Tổng số ca kiểm thử**: **37 test cases** được lưu trữ tại `HW2/testcases/FR-03.json`.

---

## 3. Kết quả thực thi chi tiết

Toàn bộ 37 test cases đã được thực thi tự động qua test runner `run_cases.mjs` (kèm cơ chế cấp token động cho các test case Bước 2) đối chiếu trực tiếp với SUT Backend:
- **Tổng số thiết kế (Designed)**: 37
- **Đã thực thi (Executed)**: 37 (100%)
- **Thành công (PASS)**: 21
- **Thất bại (FAIL)**: 16
- **Bị chặn (BLOCKED)**: 0

### Bảng kết quả thực thi 37 test cases

| Mã TC | Kỹ thuật | Mô tả ca kiểm thử | Kỳ vọng (Expected) | Thực tế (Actual) | Trạng thái |
| :--- | :---: | :--- | :---: | :---: | :---: |
| `FR03-DT-01` | DT | Quy trình khôi phục hoàn chỉnh thành công (Step 1 + Step 2) | HTTP 200, có resetToken | HTTP 200, resetToken: "9818" | **PASS** |
| `FR03-DT-02` | DT | Bước 1: Yêu cầu OTP với email chưa từng đăng ký trong DB | HTTP 404, User not found | HTTP 404, User not found | **PASS** |
| `FR03-DT-03` | DT | Bước 1: Yêu cầu OTP với email chuỗi rỗng `""` | HTTP 400 | HTTP 404 | **FAIL** |
| `FR03-DT-04` | DT | Bước 1: Yêu cầu OTP thiếu trường email trong body `{}` | HTTP 400 | HTTP 404 | **FAIL** |
| `FR03-DT-05` | DT | Bước 1: Yêu cầu OTP với email thiếu ký tự `@` | HTTP 400 | HTTP 404 | **FAIL** |
| `FR03-DT-06` | DT | Bước 1: Yêu cầu OTP với email thiếu tên miền domain | HTTP 400 | HTTP 404 | **FAIL** |
| `FR03-DT-07` | DT | Bước 1: Yêu cầu OTP với email kiểu dữ liệu Boolean (`true`) | HTTP 400 | HTTP 404 | **FAIL** |
| `FR03-DT-08` | DT | Bước 2: Đổi mật khẩu với email không khớp tài khoản cấp OTP | HTTP 400, Invalid token/email | HTTP 400, Invalid token/email | **PASS** |
| `FR03-DT-09` | DT | Bước 2: Đổi mật khẩu với email chuỗi rỗng | HTTP 400, Invalid token/email | HTTP 400, Invalid token/email | **PASS** |
| `FR03-DT-10` | DT | Bước 2: Đổi mật khẩu với mã OTP sai giá trị 4 chữ số | HTTP 400, Invalid token/email | HTTP 400, Invalid token/email | **PASS** |
| `FR03-DT-11` | DT | Bước 2: Đổi mật khẩu với mã OTP sai độ dài (6 chữ số mẫu spec) | HTTP 400, Invalid token/email | HTTP 400, Invalid token/email | **PASS** |
| `FR03-DT-12` | DT | Bước 2: Đổi mật khẩu với mã OTP là chuỗi rỗng | HTTP 400, Invalid token/email | HTTP 400, Invalid token/email | **PASS** |
| `FR03-DT-13` | DT | Bước 2: Tái sử dụng token đã được sử dụng thành công (Single-use) | HTTP 400, Invalid token/email | HTTP 400, Invalid token/email | **PASS** |
| `FR03-DT-14` | DT | Bước 2: Dùng OTP của User B để đổi mật khẩu User A | HTTP 400, Invalid token/email | HTTP 400, Invalid token/email | **PASS** |
| `FR03-DT-15` | DT | Bước 2: Gửi token cho user chưa từng gọi Step 1 (token IS NULL) | HTTP 400, Invalid token/email | HTTP 400, Invalid token/email | **PASS** |
| `FR03-DT-16` | DT | Bước 2: Mật khẩu mới quá ngắn (< 8 ký tự, `Pass1!`) | HTTP 400 | HTTP 200, reset success | **FAIL** |
| `FR03-DT-17` | DT | Bước 2: Mật khẩu mới thiếu chữ in hoa (`password123!`) | HTTP 400 | HTTP 200, reset success | **FAIL** |
| `FR03-DT-18` | DT | Bước 2: Mật khẩu mới thiếu chữ in thường (`PASSWORD123!`) | HTTP 400 | HTTP 200, reset success | **FAIL** |
| `FR03-DT-19` | DT | Bước 2: Mật khẩu mới thiếu chữ số (`Password!`) | HTTP 400 | HTTP 200, reset success | **FAIL** |
| `FR03-DT-20` | DT | Bước 2: Mật khẩu mới có khoảng trắng, thiếu ký tự đặc biệt | HTTP 400 | HTTP 200, reset success | **FAIL** |
| `FR03-DT-21` | DT | Bước 2: Mật khẩu mới là chuỗi rỗng `""` | HTTP 400 | HTTP 200, reset success | **FAIL** |
| `FR03-DT-22` | DT | Bước 2: Mật khẩu mới vượt quá độ dài tối đa (> 128 ký tự) | HTTP 400 | HTTP 200, reset success | **FAIL** |
| `FR03-BVA-01` | BVA | `newPassword.length = 0` (Min Extreme, chuỗi rỗng) | HTTP 400 | HTTP 200, reset success | **FAIL** |
| `FR03-BVA-02` | BVA | `newPassword.length = 7` (LB-1, thiếu 1 ký tự) | HTTP 400 | HTTP 200, reset success | **FAIL** |
| `FR03-BVA-03` | BVA | `newPassword.length = 8` (LB, đúng 8 ký tự hợp lệ) | HTTP 200, reset success | HTTP 200, reset success | **PASS** |
| `FR03-BVA-04` | BVA | `newPassword.length = 9` (LB+1, 9 ký tự hợp lệ) | HTTP 200, reset success | HTTP 200, reset success | **PASS** |
| `FR03-BVA-05` | BVA | `newPassword.length = 127` (UB-1, 127 ký tự hợp lệ) | HTTP 200, reset success | HTTP 200, reset success | **PASS** |
| `FR03-BVA-06` | BVA | `newPassword.length = 128` (UB, 128 ký tự hợp lệ) | HTTP 200, reset success | HTTP 200, reset success | **PASS** |
| `FR03-BVA-07` | BVA | `newPassword.length = 128` (UB, Unicode tiếng Việt có dấu UTF-8) | HTTP 200, reset success | HTTP 200, reset success | **PASS** |
| `FR03-BVA-08` | BVA | `newPassword.length = 129` (UB+1, 129 ký tự) | HTTP 400 | HTTP 200, reset success | **FAIL** |
| `FR03-BVA-09` | BVA | `newPassword.length = 10000` (Max Extreme DoS payload) | HTTP 400 | HTTP 200, reset success | **FAIL** |
| `FR03-BVA-10` | BVA | `resetToken.length = 0` (Extreme chuỗi rỗng) | HTTP 400, Invalid token/email | HTTP 400, Invalid token/email | **PASS** |
| `FR03-BVA-11` | BVA | `resetToken.length = 3` / value = 999 (LB-1) | HTTP 400, Invalid token/email | HTTP 400, Invalid token/email | **PASS** |
| `FR03-BVA-12` | BVA | `resetToken` value = 1000 (LB 4 số nhỏ nhất) | HTTP 400 / 200 | HTTP 400, Invalid token/email | **PASS** |
| `FR03-BVA-13` | BVA | `resetToken` value = 9999 (UB 4 số lớn nhất) | HTTP 400 / 200 | HTTP 400, Invalid token/email | **PASS** |
| `FR03-BVA-14` | BVA | `resetToken.length = 5` / value = 10000 (UB+1) | HTTP 400, Invalid token/email | HTTP 400, Invalid token/email | **PASS** |
| `FR03-BVA-15` | BVA | `resetToken.length = 6` (Spec sample 123456) | HTTP 400, Invalid token/email | HTTP 400, Invalid token/email | **PASS** |

Log thực thi chi tiết được lưu trữ làm minh chứng tại [HW2/evidence/FR-03/test-execution.log](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-03/test-execution.log).

---

## 4. Báo cáo lỗi phần mềm (Defect Triage)
Toàn bộ 16 ca kiểm thử thất bại cùng với các phát hiện khảo sát mã nguồn được quy về 4 lỗi phần mềm chính:
1. **[BUG-FR03-01](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR03-01.md)**: Lộ mã xác nhận `resetToken` (OTP) trong HTTP Response Body của `POST /api/forgot-password` dẫn đến chiếm đoạt tài khoản (Account Takeover). *(Severity: Critical)*
2. **[BUG-FR03-02](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR03-02.md)**: Backend hoàn toàn không kiểm tra tính hợp lệ và độ phức tạp của `newPassword` khi đặt lại mật khẩu (chấp nhận mật khẩu rỗng, 1 ký tự, 10,000 ký tự payload). *(Severity: Critical)*
3. **[BUG-FR03-03](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR03-03.md)**: Mã đặt lại mật khẩu không có thời hạn hết hạn (Token Never Expires do bảng `users` thiếu trường thời gian). *(Severity: Major)*
4. **[BUG-FR03-04](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR03-04.md)**: Endpoint `POST /api/forgot-password` trả về HTTP 404 Not Found thay vì HTTP 400 Bad Request khi email không hợp lệ (truy vấn thẳng SQLite khi thiếu validation). *(Severity: Minor)*

Tài liệu tổng hợp lỗi chi tiết: [bugs.vi.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/bugs.vi.md).

---

## 5. Phân tích khoảng trống của AI (AI Gap Analysis)

Bảng đối chiếu các điểm mà AI ban đầu đã bỏ sót hoặc gặp khó khăn khi thiết kế và thực thi kiểm thử cho tính năng FR-03:

| Mục bị bỏ sót / Thách thức thực tế | Cách phát hiện | Vì sao AI bỏ sót ban đầu | Phân loại nguyên nhân (Category) | Cải tiến kỹ năng (Skill Fix) |
| :--- | :--- | :--- | :--- | :--- |
| **Phụ thuộc token động trong tính năng stateful (Dynamic Token Dependency)** | Runner chạy thất bại các test case `newPassword` do gửi chuỗi cố định `"VALID_TOKEN"` bị ngắt ở bước xác thực token | AI coi các test case API là độc lập và phi trạng thái (stateless), không tự động thiết lập cơ chế gọi Bước 1 để lấy token động cho Bước 2 | **Inherent feature complexity** | Nâng cấp test runner với quy tắc **Stateful Flow Dynamic Setup Hook**: tự động gọi endpoint tiền đề lấy token thời gian thực khi phát hiện case phụ thuộc state. |
| **Lỗ hổng bảo mật lộ OTP trong Response (Security Information Disclosure)** | Đọc mã nguồn `server.js:77` thấy `res.json({ message, resetToken })` | AI bị thiên kiến chức năng (Functional Bias): coi việc API trả về token là "tính năng thành công" để assert, không nhận thức được đây là lỗi rò rỉ thông tin nghiêm trọng theo chuẩn an ninh | **Tool limitation** & **Inherent feature complexity** | Bổ sung quy tắc **Sensitive Field In Response Anti-Pattern**: kiểm tra cảnh báo nếu public endpoint trả về OTP/token trong response body. |
| **Thời hạn hiệu lực của OTP (Token Expiration / Temporal Boundary)** | Kiểm tra cấu trúc bảng SQLite `database.js:58` thấy không có cột timestamp lưu thời gian tạo/hết hạn của OTP | Prompt và tài liệu `api_specification.md` không đề cập đến thời gian hết hạn; biến thời gian là biến ẩn (implicit state variable) không nằm trong request body | **Prompt/input quality** & **Inherent feature complexity** | Thêm mục **Temporal/Expiration State Variable Checklist** vào `domain-testing` Stage 1 để luôn rà soát thời hạn hiệu lực của token/session. |
| **Mâu thuẫn định dạng OTP giữa Đặc tả và Mã nguồn thực tế** | Đối chiếu chéo giữa `api_specification.md` (mẫu 6 số) với `server.js:72` (sinh 4 số) và `ForgotPassword.jsx` (nhãn 4 số) | AI ban đầu nếu chỉ đọc đặc tả sẽ thiết kế toàn bộ giá trị đại diện là 6 chữ số, dẫn đến kiểm thử sai lệch hoàn toàn so với SUT thực tế | **Inherent feature complexity** | Áp dụng quy tắc **Multi-Source Discrepancy Resolution** (v2.0) trong Stage 0: luôn ưu tiên mã nguồn thực tế kèm ghi chú sai lệch tài liệu. |

---

## 6. Hạn chế của kỹ thuật kiểm thử miền và BVA trên FR-03
1. **Tính chất đa bước và có trạng thái (Multi-step Stateful Process)**: Kỹ thuật phân hoạch tương đương và BVA truyền thống chủ yếu áp dụng hiệu quả cho các hàm đơn biến hoặc form nhập liệu đơn lập. Khi áp dụng cho một quy trình nghiệp vụ 2 bước phụ thuộc token sinh ngẫu nhiên ở runtime, các ca kiểm thử Bước 2 không thể thực thi nếu không có sự phối hợp trạng thái với Bước 1.
2. **Lỗi bảo mật không phụ thuộc giá trị biên**: Hai lỗ hổng nguy hiểm nhất của FR-03 (`BUG-FR03-01` trả OTP qua HTTP và `BUG-FR03-03` token vô thời hạn) hoàn toàn không xuất phát từ việc vi phạm biên dữ liệu, mà xuất phát từ kiến trúc bảo mật kém và thiết kế thiếu trường trong cơ sở dữ liệu.
3. **Mã nguồn thiếu hoàn toàn logic nghiệp vụ (Blanket Missing Validation)**: Việc backend không kiểm tra bất kỳ tiêu chí nào của `newPassword` biến mọi phân tích biên toán học (LB-1, LB, UB, UB+1) thành bài kiểm tra phơi bày sự thiếu sót hoàn toàn của code hơn là kiểm tra xem code có xử lý đúng các điểm biên hay không.
