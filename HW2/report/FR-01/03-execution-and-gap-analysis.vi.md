# FR-01 — Đăng ký tài khoản (Account Registration)
## Báo cáo thực thi kiểm thử và phân tích khoảng trống AI (Execution & Gap Analysis Report)

---

## 1. Phạm vi và đặc tả
- **Endpoint kiểm thử**: `POST /api/register`
- **Môi trường**: Backend SUT chạy tại `http://localhost:3000` (Node.js/Express, SQLite3).
- **Nguồn đặc tả đã sử dụng**:
  - `eshop-sut/api_specification.md` (mục 1.1 POST /api/register) `[SPEC]`
  - Mã nguồn Backend: `eshop-sut/backend/server.js:20-30` và `eshop-sut/backend/database.js:50-61` `[CODE]`
  - Mã nguồn Frontend Web: `eshop-sut/frontend-web/src/pages/Register.jsx:15` `[CODE]`
  - Mã nguồn Frontend Mobile: `eshop-sut/frontend-mobile/App.js:212` `[CODE]`
  - Quan sát thực thi qua HTTP API Runner: `[OBSERVED]`
- **Giải quyết câu hỏi mở**:
  - Thực tế Backend không hề có bất kỳ câu lệnh `if` kiểm tra tính hợp lệ của dữ liệu đầu vào nào trước khi insert vào database SQLite.
  - Cột `email` trong bảng `users` không có ràng buộc `UNIQUE`, dẫn đến việc cho phép đăng ký vô hạn tài khoản trùng email.

---

## 2. Tóm tắt thiết kế kiểm thử (Domain Testing & BVA)
- **Domain Testing (S04)**: Thiết kế 23 lớp tương đương (EC01 – EC23), sinh 16 ca kiểm thử tối thiểu (`FR01-DT-01` đến `FR01-DT-16`), đạt độ bao phủ 100% ma trận equivalence class.
- **Boundary Value Analysis**: Áp dụng mô hình 3-value BVA và 9-point model cho 2 biến có thứ tự (`name.length` [1, 100] và `password.length` [8, 128]), sinh 14 ca kiểm thử (`FR01-BVA-01` đến `FR01-BVA-14`).
- **Tổng số ca kiểm thử**: **30 test cases** được lưu trữ tại `HW2/testcases/FR-01.json`.

---

## 3. Kết quả thực thi chi tiết

Toàn bộ 30 test cases đã được thực thi tự động qua test runner `run_cases.mjs` đối chiếu trực tiếp với SUT Backend:
- **Tổng số thiết kế (Designed)**: 30
- **Đã thực thi (Executed)**: 30 (100%)
- **Thành công (PASS)**: 10
- **Thất bại (FAIL)**: 20
- **Bị chặn (BLOCKED)**: 0

### Bảng kết quả thực thi 30 test cases

| Mã TC | Kỹ thuật | Mô tả ca kiểm thử | Kỳ vọng (Expected) | Thực tế (Actual) | Trạng thái |
| :--- | :---: | :--- | :---: | :---: | :---: |
| `FR01-DT-01` | DT | Đăng ký hợp lệ với đầy đủ thông tin chuẩn | HTTP 200, message success | HTTP 200, message success | **PASS** |
| `FR01-DT-02` | DT | Bỏ trống trường `name` | HTTP 400 | HTTP 200 | **FAIL** |
| `FR01-DT-03` | DT | Thiếu hoàn toàn field `name` trong JSON | HTTP 400 | HTTP 200 | **FAIL** |
| `FR01-DT-04` | DT | Email sai format (thiếu ký tự `@`) | HTTP 400 | HTTP 200 | **FAIL** |
| `FR01-DT-05` | DT | Email sai format (thiếu tên miền domain) | HTTP 400 | HTTP 200 | **FAIL** |
| `FR01-DT-06` | DT | Bỏ trống trường `email` | HTTP 400 | HTTP 200 | **FAIL** |
| `FR01-DT-07` | DT | Thiếu hoàn toàn field `email` trong JSON | HTTP 400 | HTTP 200 | **FAIL** |
| `FR01-DT-08` | DT | Kiểu dữ liệu `email` là Boolean (`true`) | HTTP 400 | HTTP 200 | **FAIL** |
| `FR01-DT-09` | DT | Mật khẩu ngắn dưới 8 ký tự (`Pass1!`) | HTTP 400 | HTTP 200 | **FAIL** |
| `FR01-DT-10` | DT | Mật khẩu thiếu chữ hoa (`password123!`) | HTTP 400 | HTTP 200 | **FAIL** |
| `FR01-DT-11` | DT | Mật khẩu thiếu chữ thường (`PASSWORD123!`) | HTTP 400 | HTTP 200 | **FAIL** |
| `FR01-DT-12` | DT | Mật khẩu thiếu chữ số (`Password!@#`) | HTTP 400 | HTTP 200 | **FAIL** |
| `FR01-DT-13` | DT | Mật khẩu thiếu ký tự đặc biệt (`Password123`) | HTTP 400 | HTTP 200 | **FAIL** |
| `FR01-DT-14` | DT | Bỏ trống trường `password` | HTTP 400 | HTTP 200 | **FAIL** |
| `FR01-DT-15` | DT | Thiếu hoàn toàn field `password` trong JSON | HTTP 400 | HTTP 200 | **FAIL** |
| `FR01-DT-16` | DT | Đăng ký với email đã tồn tại trong hệ thống | HTTP 409 | HTTP 200 | **FAIL** |
| `FR01-BVA-01` | BVA | `name.length = 0` (LB-1, chuỗi rỗng) | HTTP 400 | HTTP 200 | **FAIL** |
| `FR01-BVA-02` | BVA | `name.length = 1` (LB, 1 ký tự) | HTTP 200 | HTTP 200 | **PASS** |
| `FR01-BVA-03` | BVA | `name.length = 2` (LB+1, 2 ký tự) | HTTP 200 | HTTP 200 | **PASS** |
| `FR01-BVA-04` | BVA | `name.length = 99` (UB-1, 99 ký tự) | HTTP 200 | HTTP 200 | **PASS** |
| `FR01-BVA-05` | BVA | `name.length = 100` (UB, 100 ký tự tiếng Việt UTF-8) | HTTP 200 | HTTP 200 | **PASS** |
| `FR01-BVA-06` | BVA | `name.length = 101` (UB+1, 101 ký tự) | HTTP 400 | HTTP 200 | **FAIL** |
| `FR01-BVA-07` | BVA | `name.length = 1000` (Physical extreme payload) | HTTP 400 | HTTP 200 | **FAIL** |
| `FR01-BVA-08` | BVA | `password.length = 7` (LB-1, thiếu 1 ký tự) | HTTP 400 | HTTP 200 | **FAIL** |
| `FR01-BVA-09` | BVA | `password.length = 8` (LB, đúng 8 ký tự hợp lệ) | HTTP 200 | HTTP 200 | **PASS** |
| `FR01-BVA-10` | BVA | `password.length = 9` (LB+1, 9 ký tự hợp lệ) | HTTP 200 | HTTP 200 | **PASS** |
| `FR01-BVA-11` | BVA | `password.length = 127` (UB-1, 127 ký tự hợp lệ) | HTTP 200 | HTTP 200 | **PASS** |
| `FR01-BVA-12` | BVA | `password.length = 128` (UB, 128 ký tự hợp lệ) | HTTP 200 | HTTP 200 | **PASS** |
| `FR01-BVA-13` | BVA | `password.length = 129` (UB+1, 129 ký tự) | HTTP 400 | HTTP 200 | **FAIL** |
| `FR01-BVA-14` | BVA | `password.length = 10000` (Physical extreme DoS payload) | HTTP 400 | HTTP 200 | **FAIL** |

---

## 4. Báo cáo lỗi phần mềm (Defect Triage)
20 ca kiểm thử thất bại được quy về 5 nguyên nhân gốc rễ (Root Causes):
1. **[BUG-FR01-01](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR01-01.md)**: Backend thiếu kiểm tra các trường bắt buộc (`name`, `email`, `password` rỗng/thiếu vẫn tạo tài khoản thành công). *(Severity: Major)*
2. **[BUG-FR01-02](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR01-02.md)**: Backend không kiểm tra định dạng email và kiểu dữ liệu (email thiếu `@`, boolean, số vẫn nhận). *(Severity: Major)*
3. **[BUG-FR01-03](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR01-03.md)**: Cho phép đăng ký tài khoản trùng lặp email do thiếu ràng buộc UNIQUE trong DB SQLite. *(Severity: Critical)*
4. **[BUG-FR01-04](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR01-04.md)**: Backend không kiểm tra độ dài tối thiểu và tiêu chí phức tạp của mật khẩu. *(Severity: Major)*
5. **[BUG-FR01-05](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR01-05.md)**: Backend không giới hạn độ dài cận trên (nhận payload 1,000 - 10,000 ký tự mà không từ chối). *(Severity: Minor)*

Tài liệu tổng hợp lỗi chi tiết: [bugs.vi.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/bugs.vi.md).

---

## 5. Phân tích khoảng trống của AI (AI Gap Analysis)

| Mục bị bỏ sót | Cách phát hiện | Vì sao AI bỏ sót | Nhóm nguyên nhân | Cải tiến skill (v1 → v2) |
| :--- | :--- | :--- | :--- | :--- |
| **Lệch pha regex password giữa Web và Mobile** | Rà soát chéo giữa `Register.jsx:15` và `App.js:212` | AI chỉ đọc file backend và tài liệu API `api_specification.md`, không tự động duyệt client UI files khi thiết kế test backend | `Tool limitation` & `Inherent feature complexity` | Bổ sung **Cross-platform Skew Checklist** vào `domain-testing` skill (Stage 0) bắt buộc đối chiếu cả 3 client/server. |
| **Biên mã hóa UTF-8 tiếng Việt có dấu** | Sinh viên yêu cầu kiểm tra kỹ tên tiếng Việt có dấu | AI mặc định sinh chuỗi ký tự ASCII (`A`), không tính đến độ dài byte của ký tự UTF-8 nhiều byte | `Prompt/input quality` | Bổ sung **Encoding Boundary Rule** vào `boundary-value-analysis` skill (Stage 3). |
| **Thiên kiến hệ thống hoạt động đúng chuẩn (Bias towards standard behavior)** | Chạy test runner thấy 20 ca trả về HTTP 200 thay vì HTTP 400 | AI giả định SUT tuân theo RESTful API chuẩn mực, gán kỳ vọng HTTP 400 mà không kiểm tra xem backend có code validation hay không | `Tool limitation` | Thêm nguyên tắc **Zero-Trust SUT** vào `test-execution-and-bugs` skill (Stage 3). |

Chi tiết nâng cấp kỹ năng được lưu trữ tại [skills-changelog.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/skills-changelog.md).

---

## 6. Hạn chế của kỹ thuật kiểm thử miền và BVA trên FR-01
1. **Lỗi không nằm ở biên**: Lỗi nghiêm trọng nhất của FR-01 (`BUG-FR01-03` trùng email và `BUG-FR01-01` thiếu validation) hoàn toàn không nằm ở các giá trị biên của độ dài, mà nằm ở logic nghiệp vụ và kiến trúc database (thiếu UNIQUE constraint).
2. **Miền giá trị thực sự không được định nghĩa rõ ràng**: Backend không áp bất kỳ ràng buộc nào, khiến "miền giá trị thực tế" của SUT là vô hạn ($-\infty, +\infty$), mọi phân tích biên toán học đều mang tính đối chiếu với tiêu chuẩn kỹ thuật (RFC/Spec) hơn là đối chiếu với giới hạn của phần mềm.
