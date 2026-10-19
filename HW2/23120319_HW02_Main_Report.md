**CS423 – CSC15003 – Software Testing (AI-augmented · 2026)**

**HW02 – Domain Testing & Boundary Value Analysis**

# **HW02 – Domain Testing on EShop**

- **Họ và tên:** Trương Thành Phát  
- **MSSV:** 23120319  
- **Lớp:** Kiểm thử phần mềm - CQ2023/3  
- **Hệ thống kiểm thử (SUT):** EShop — [https://github.com/ttbhanh/eshop-sut](https://github.com/ttbhanh/eshop-sut)  
- **Công cụ AI hỗ trợ:** Claude Code / Antigravity (Gemini 3.8 Flash, MiniMax-M2.1)

---

## 1. **Introduction** 

### 1.1 Mục tiêu bài tập
Nắm vững và áp dụng thực tế hai kỹ thuật kiểm thử hộp đen then chốt: **Kiểm thử miền (Domain Testing / Equivalence Partitioning)** theo bài giảng slide S04 và **Phân tích giá trị biên (Boundary Value Analysis - BVA)** biến thể 3-value kết hợp mô hình 9 điểm. Quy trình thực hiện được tối ưu hóa theo mô hình **AI-First / AI-augmented testing**, trong đó AI đóng vai trò trợ lý đề xuất và sinh dữ liệu kiểm thử, còn con người (Human-in-the-loop) đóng vai trò thẩm định, rà soát mã nguồn, xác minh qua chạy thực tế và phê duyệt từng bước (stopping points).

### 1.2 Tổng quan về SUT (EShop)
Hệ thống kiểm thử EShop là một nền tảng thương mại điện tử đa nền tảng (Full-stack E-commerce system) bao gồm:
- **Backend API:** Viết bằng Node.js / Express.js, cung cấp các RESTful API tại `http://localhost:3000`.
- **Cơ sở dữ liệu:** SQLite3 (`eshop-sut/backend/database.sqlite`), khởi tạo bảng và seed data tại `database.js`.
- **Frontend Web:** Ứng dụng Single Page Application (SPA) viết bằng React (Vite) tại port 5173.
- **Frontend Admin:** Trang quản trị viết bằng React (Vite) tại port 5174.
- **Frontend Mobile:** Ứng dụng di động viết bằng React Native (`eshop-sut/frontend-mobile/App.js`).

---

## 2. **Feature selection and scope**

| Feature | Pool in assignment | Planned scope | Trạng thái hiện tại |
| :--- | :---: | :--- | :---: |
| **FR-01 — Account registration** | Pool A | Luồng đăng ký tài khoản, kiểm tra dữ liệu đầu vào (name, email, password), ràng buộc nghiệp vụ duplicate email, kiểm tra mâu thuẫn giữa Web, Mobile và Backend | **Đã hoàn thành 100%** |
| **FR-03 — Forgot password and password reset** | Pool A | Quy trình 2 bước: yêu cầu đặt lại mật khẩu và gửi mã reset token/mật khẩu mới | **Đã hoàn thành 100%** |
| **FR-08 — Checkout** | Pool B | Điều kiện tiên quyết giỏ hàng, thông tin thanh toán, đặt đơn hàng và kiểm tra tính toán tổng tiền | Kế hoạch thực hiện |
| **FR-12 — Access control** | Pool C | Phân quyền vai trò Admin / Customer, kiểm soát truy cập các endpoint và giao diện quản trị | **Đã hoàn thành 100%** |

> [!NOTE]
> *Lưu ý về danh mục Pool:* Theo yêu cầu của đề bài, 4 tính năng cần đại diện cho 4 Pool (Pool A, Pool B, Pool C, Pool D - Mobile App). Tính năng Mobile sẽ được bổ sung/thay thế phù hợp để đảm bảo đáp ứng đầy đủ tiêu chí Pool D của bài nộp.

---

## 3. **Kết Quả Kiểm Thử Theo Từng Tính Năng (Feature Test Reports)**

### **3.1 Test Environment and Approach**

#### 3.1.1 Môi trường kiểm thử
- **Hệ điều hành:** Windows 11 Home / PowerShell terminal.
- **Môi trường chạy Backend SUT:** Node.js v20.x, Express server lắng nghe tại `http://localhost:3000`.
- **Cơ sở dữ liệu:** SQLite3 (tệp `eshop-sut/backend/database.sqlite`).
- **Test Runner:** Script tự động viết bằng Node.js ES Modules (`.claude/skills/test-execution-and-bugs/scripts/run_cases.mjs`), tự động nạp test cases từ tệp JSON, gửi HTTP requests tới server và ghi nhận mã trạng thái cùng nội dung response.
- **Quy tắc cô lập dữ liệu:** Sử dụng placeholder `{{uniq}}` (timestamp mili-giây) để tạo email duy nhất cho các ca kiểm thử hợp lệ, tránh xung đột dữ liệu giữa các lần chạy lặp lại.

#### 3.1.2 Phương pháp tiếp cận kiểm thử
1. **Kiểm thử miền (Domain Testing):** Tuân thủ nghiêm ngặt 4 bước theo slide bài giảng S04:
   - *Bước 1:* Xác định biến Input, Output, State và Miền giá trị (Domains).
   - *Bước 2:* Phân hoạch các lớp tương đương hợp lệ (Valid) và không hợp lệ (Invalid) dựa trên các điều kiện Range, Must be, Type, Missing/Empty, State conflict.
   - *Bước 3:* Chọn giá trị đại diện tốt nhất cho từng lớp tương đương.
   - *Bước 4:* Thiết kế bộ test case tối thiểu (kết hợp tối đa các lớp Valid; kiểm thử đơn lập từng lớp Invalid để cô lập nguyên nhân) và lập ma trận bao phủ 100%.
2. **Phân tích giá trị biên (Boundary Value Analysis - BVA):**
   - Chỉ áp dụng cho các biến trên **miền có thứ tự** (`name.length` và `password.length`). Với các trường không có thứ tự (email, boolean), lập bảng giải thích rõ lý do không áp dụng.
   - Áp dụng **biến thể 3-value BVA** ($LB-1, LB, LB+1$ và $UB-1, UB, UB+1$) kết hợp **mô hình 9 điểm** (Nominal value + Physical Extremes).
   - Áp dụng nguyên tắc **Single-fault assumption** (chỉ thay đổi một biến tại một thời điểm, giữ cố định các biến còn lại ở giá trị danh định hợp lệ).
3. **Thực thi và báo cáo lỗi:**
   - Chạy kiểm thử tự động, đối chiếu `Expected` và `Actual`. Mọi kết quả không khớp đều được phân loại nguyên nhân gốc rễ (Defect vs Wrong expectation vs Spec gap), viết báo cáo lỗi Markdown và lập bản thảo GitHub Issues.
4. **Cải tiến kỹ năng (AI Gap Analysis):**
   - Đối chiếu những điểm AI bỏ sót hoặc thiên kiến sai lệch so với quan sát thực tế để nâng cấp bộ Agent Skills từ v1 lên v2.

---

### **3.2 FR-01 — Account Registration**

#### 3.2.1 Tìm hiểu tính năng và đặc tả thực tế
- **Endpoint:** `POST /api/register` (Base URL: `http://localhost:3000`)
- **Nguồn đặc tả đã sử dụng:**
  - `docs/api_specification.md` (mục 1.1 POST /api/register) `[SPEC]`
  - Mã nguồn Backend: `eshop-sut/backend/server.js:20-30` và `eshop-sut/backend/database.js:50-61` `[CODE]`
  - Mã nguồn Frontend Web: `eshop-sut/frontend-web/src/pages/Register.jsx:15` `[CODE]`
  - Mã nguồn Frontend Mobile: `eshop-sut/frontend-mobile/App.js:212` `[CODE]`
  - Quan sát thực thi qua HTTP Client: `[OBSERVED]`
- **Phát hiện quan trọng từ mã nguồn SUT (Code Investigation):**
  - **Backend hoàn toàn không có validation (`server.js:20-30`):** Handler nhận trực tiếp `req.body` và thực thi câu lệnh SQL `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`. Không có bất kỳ câu lệnh `if` kiểm tra trường bắt buộc, định dạng email hay độ dài mật khẩu.
  - **Cơ sở dữ liệu thiếu ràng buộc toàn vẹn (`database.js:55`):** Bảng `users` chỉ định nghĩa cột `email TEXT` mà **không có từ khóa `UNIQUE`**. Backend cũng không thực hiện truy vấn `SELECT` kiểm tra email tồn tại trước khi tạo mới. Do đó, hệ thống cho phép tạo vô số tài khoản trùng email.
  - **Mâu thuẫn lệch pha giữa Web và Mobile:** 
    - Frontend Web (`Register.jsx:15`) sử dụng regex `flawedStrongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\s).{8,}$/` đòi hỏi **khoảng trắng (`\s`)** thay vì ký tự đặc biệt.
    - Frontend Mobile (`App.js:212`) sử dụng regex chuẩn `[^A-Za-z\d]` đòi hỏi ký tự đặc biệt.

---

#### 3.2.2 Kiểm thử miền (Domain Testing)

##### Bước 1: Xác định biến Input, Output, State và Miền giá trị (Domains)

| Biến | Loại (Kind) | Kiểu dữ liệu | Miền giá trị & Ràng buộc kỹ thuật (Domain) | Nguồn (Source tag) |
| :--- | :--- | :--- | :--- | :---: |
| `name` | Input | String | - Họ và tên người dùng.<br>- Ràng buộc: Bắt buộc (không rỗng `""`, không `null`/`undefined`).<br>- Giới hạn độ dài: Chưa nêu trong spec (`unknown`), thường từ 1..100 ký tự.<br>- Ký tự: Chữ cái, khoảng trắng, ký tự Unicode tiếng Việt có dấu.<br>- *Code thực tế:* `server.js:20` không kiểm tra, chấp nhận mọi kiểu dữ liệu/rỗng. | `[SPEC]` api_spec:14<br>`[ASSUMED]` (độ dài)<br>`[CODE]` server.js:20 |
| `email` | Input | String | - Địa chỉ email định danh người dùng theo chuẩn RFC 5322 (`<local-part>@<domain>`).<br>- Ràng buộc: Bắt buộc, không rỗng, đúng định dạng email, không trùng với email đã có.<br>- Giới hạn độ dài: Tối đa 254 ký tự (RFC 5321).<br>- *Code thực tế:* `server.js:20` không kiểm tra regex, DB schema không có `UNIQUE`. | `[SPEC]` api_spec:15<br>`[ASSUMED]` (RFC limits)<br>`[CODE]` server.js:20, database.js:55 |
| `password` | Input | String | - Mật khẩu xác thực tài khoản.<br>- Ràng buộc độ dài: Tối thiểu 8 ký tự (`>= 8`), cận trên chưa xác định (`unknown`, thường <= 128).<br>- Ràng buộc phức tạp: Ít nhất 1 chữ thường `[a-z]`, 1 chữ hoa `[A-Z]`, 1 số `\d`, 1 ký tự đặc biệt.<br>- *Dị biệt code:* Web bắt khoảng trắng `\s`; Mobile bắt ký tự đặc biệt; Backend không kiểm tra. | `[SPEC]` api_spec:16<br>`[CODE]` Register.jsx:15<br>`[CODE]` App.js:212<br>`[CODE]` server.js:20 |
| `existing_email` | State | Boolean | - Trạng thái đã tồn tại của email trong bảng `users`.<br>- Miền giá trị: `{ false (chưa tồn tại), true (đã tồn tại) }`.<br>- Ràng buộc nghiệp vụ: Chỉ cho phép đăng ký khi `false`. Nếu `true`, phải từ chối (409 Conflict). | `[ASSUMED]` Business rule<br>`[CODE]` database.js:55 |
| `Response.status` | Output | Number | - Mã trạng thái HTTP trả về từ server.<br>- Miền giá trị: `{ 200 (Thành công), 400 (Dữ liệu không hợp lệ), 409 (Trùng lặp email), 500 (Lỗi server) }`. | `[SPEC]` api_spec:21<br>`[ASSUMED]` (400, 409)<br>`[CODE]` server.js:26-27 |
| `Response.message` | Output | String | - Thông điệp trả về trong JSON body: `"User registered successfully"` (khi 200) hoặc thông báo lỗi vi phạm. | `[SPEC]` api_spec:21<br>`[CODE]` server.js:27 |
| `Response.id` | Output | Integer | - Khóa chính ID người dùng được sinh tự động (`id >= 1`, auto-increment). | `[SPEC]` api_spec:21<br>`[CODE]` database.js:53 |

##### Bước 2: Phân hoạch tương đương (Equivalence Partitioning)
Hệ thống được phân hoạch thành **23 lớp tương đương** (`EC01` đến `EC23`) bao quát toàn diện các điều kiện:

| Mã EC | Biến kiểm tra | Mô tả lớp tương đương | Hợp lệ / Không hợp lệ | Quy tắc phân hoạch (Guideline) | Nguồn (Source tag) |
| :---: | :--- | :--- | :---: | :--- | :---: |
| **EC01** | `name` | Độ dài hợp lệ (1 .. 100 ký tự) | **Valid** | Range: valid range [1, 100] | `[SPEC]` + `[ASSUMED]` |
| **EC02** | `name` | Chuỗi rỗng `""` (độ dài 0) | Invalid | Missing/Empty: empty string | `[SPEC]` api_spec:14 |
| **EC03** | `name` | Thiếu trường `name` trong request body | Invalid | Missing/Empty: field omitted | `[SPEC]` api_spec:14 |
| **EC04** | `email` | Định dạng email chuẩn RFC (`user@domain.com`) | **Valid** | Must be: valid format | `[SPEC]` api_spec:15 |
| **EC05** | `email` | Email sai định dạng (thiếu ký tự `@`) | Invalid | Must be: malformed format | `[SPEC]` api_spec:15 |
| **EC06** | `email` | Email sai định dạng (thiếu tên miền/domain) | Invalid | Must be: malformed format | `[SPEC]` api_spec:15 |
| **EC07** | `email` | Chuỗi rỗng `""` | Invalid | Missing/Empty: empty string | `[SPEC]` api_spec:15 |
| **EC08** | `email` | Thiếu trường `email` trong request body | Invalid | Missing/Empty: field omitted | `[SPEC]` api_spec:15 |
| **EC09** | `email` | Sai kiểu dữ liệu (truyền Boolean `true` hoặc Số) | Invalid | Type: invalid data type | `[CODE]` server.js:20 |
| **EC10** | `password` | Mật khẩu chuẩn mạnh (>= 8 ký tự, đủ hoa, thường, số, ký tự đặc biệt) | **Valid** | Range & Complexity: valid | `[SPEC]` api_spec:16 |
| **EC11** | `password` | Độ dài quá ngắn (< 8 ký tự) | Invalid | Range: below minimum | `[SPEC]` api_spec:16 |
| **EC12** | `password` | Thiếu chữ in hoa `[A-Z]` | Invalid | Complexity: missing uppercase | `[SPEC]` api_spec:16 |
| **EC13** | `password` | Thiếu chữ in thường `[a-z]` | Invalid | Complexity: missing lowercase | `[SPEC]` api_spec:16 |
| **EC14** | `password` | Thiếu chữ số `\d` | Invalid | Complexity: missing digit | `[SPEC]` api_spec:16 |
| **EC15** | `password` | Thiếu ký tự đặc biệt `[^A-Za-z\d]` | Invalid | Complexity: missing special char | `[SPEC]` api_spec:16 |
| **EC16** | `password` | Chuỗi rỗng `""` | Invalid | Missing/Empty: empty string | `[SPEC]` api_spec:16 |
| **EC17** | `password` | Thiếu trường `password` trong request body | Invalid | Missing/Empty: field omitted | `[SPEC]` api_spec:16 |
| **EC18** | `existing_email` | Email chưa từng đăng ký trong DB | **Valid** | State: non-existent email | `[SPEC]` api_spec:21 |
| **EC19** | `existing_email` | Email đã tồn tại trong DB (trùng lặp) | Invalid | State conflict: duplicate | `[ASSUMED]` Business rule |
| **EC20** | `Response.status` | Trả về HTTP 200 OK | **Valid Output** | Normal success response | `[SPEC]` api_spec:21 |
| **EC21** | `Response.status` | Trả về HTTP 400 Bad Request (lỗi validation) | Invalid Output | Client error response | `[ASSUMED]` Standard REST |
| **EC22** | `Response.status` | Trả về HTTP 409 Conflict (trùng tài khoản) | Invalid Output | State conflict response | `[ASSUMED]` Standard REST |
| **EC23** | `Response.status` | Trả về HTTP 500 Internal Server Error | Invalid Output | Server error response | `[CODE]` server.js:26 |

##### Bước 3: Chọn giá trị đại diện và Bước 4: Thiết kế bộ test case tối thiểu
Áp dụng quy tắc kết hợp của môn học:
- **1 test case hợp lệ kết hợp tối đa các lớp valid**: `FR01-DT-01` phủ đồng thời `EC01, EC04, EC10, EC18, EC20`.
- **15 test cases không hợp lệ kiểm thử đơn lập**: Mỗi ca chỉ vi phạm duy nhất 1 lớp Invalid, các trường còn lại giữ ở giá trị hợp lệ danh định để cô lập hoàn toàn nguyên nhân gây lỗi (`FR01-DT-02` đến `FR01-DT-16`).
- **Ma trận bao phủ:** Đạt **100% độ bao phủ** cho toàn bộ 23 lớp tương đương đã xác định.

*(Chi tiết bộ 16 ca kiểm thử miền được lưu trữ tại file máy đọc `HW2/testcases/FR-01.json` và báo cáo chi tiết `HW2/report/FR-01/01-domain-testing.vi.md`).*

---

#### 3.2.3 Phân tích giá trị biên (Boundary Value Analysis - BVA)

##### 1. Xác định các miền có thứ tự và biên
- **`name.length`**: Miền hợp lệ $[1, 100]$ ký tự (Dạng khoảng đóng $[1, 100]$).
  - Bước nhỏ nhất: 1 ký tự.
  - Cận dưới: $LB = 1$ (chuỗi 1 ký tự). Điểm kiểm thử: $LB-1 = 0$ (chuỗi rỗng), $LB = 1$, $LB+1 = 2$.
  - Cận trên: $UB = 100$ ký tự. Điểm kiểm thử: $UB-1 = 99$, $UB = 100$, $UB+1 = 101$.
- **`password.length`**: Miền hợp lệ $[8, 128]$ ký tự (Dạng khoảng đóng $[8, 128]$).
  - Bước nhỏ nhất: 1 ký tự.
  - Cận dưới: $LB = 8$ ký tự. Điểm kiểm thử: $LB-1 = 7$, $LB = 8$, $LB+1 = 9$.
  - Cận trên: $UB = 128$ ký tự. Điểm kiểm thử: $UB-1 = 127$, $UB = 128$, $UB+1 = 129$.
- **Các trường không áp dụng BVA:**
  - `email`: Không có thứ tự tự nhiên (tập hợp định dạng regex).
  - `password complexity`: Thuộc tính tập hợp logic (phải chứa hoa, thường, số, ký tự đặc biệt).
  - `existing_email`: Kiểu Boolean nhị phân (`true`/`false`).

##### 2. Lựa chọn biến thể và mô hình điểm kiểm thử
- Sử dụng **biến thể 3-value BVA**: Mỗi biên kiểm tra 3 điểm kề cận ($LB-1, LB, LB+1$ và $UB-1, UB, UB+1$) nhằm phát hiện triệt để các lỗi off-by-one trong lập trình (như viết nhầm dấu `<` thành `<=`).
- Mở rộng theo **mô hình 9 điểm (Course 9-point model)**: Bổ sung các điểm cực trị vật lý mà API có thể nhận (`Extreme/Physical Limit`: chuỗi 1,000 ký tự cho name và 10,000 ký tự cho password nhằm kiểm tra tấn công từ chối dịch vụ DoS/Buffer Overflow) và **điểm biên mã hóa tiếng Việt UTF-8** (100 ký tự có dấu tại UB).

##### 3. Bộ 14 test cases BVA được thiết kế

| Mã TC | Biến kiểm tra | Điểm biên | Giá trị kiểm thử thực tế | Kỳ vọng (Expected) | Lỗi code sẽ bắt được (Fault it would catch) |
| :---: | :--- | :---: | :--- | :---: | :--- |
| `FR01-BVA-01` | `name.length` | $LB - 1$ | Độ dài = 0 (chuỗi rỗng `""`) | HTTP 400 | Lỗi cho phép người dùng không có tên |
| `FR01-BVA-02` | `name.length` | $LB$ | Độ dài = 1 (`"A"`) | HTTP 200 | Lỗi nhầm dấu `>` thay vì `>=` ở cận dưới |
| `FR01-BVA-03` | `name.length` | $LB + 1$ | Độ dài = 2 (`"An"`) | HTTP 200 | Lỗi lệch biên cận dưới |
| `FR01-BVA-04` | `name.length` | $UB - 1$ | Độ dài = 99 ký tự | HTTP 200 | Lỗi lệch biên cận trên |
| `FR01-BVA-05` | `name.length` | $UB$ | Độ dài = 100 ký tự (Unicode tiếng Việt) | HTTP 200 | Lỗi tính độ dài theo bytes thay vì ký tự UTF-8 |
| `FR01-BVA-06` | `name.length` | $UB + 1$ | Độ dài = 101 ký tự | HTTP 400 | Lỗi nhầm dấu `<` thay vì `<=` ở cận trên |
| `FR01-BVA-07` | `name.length` | Extreme | Độ dài = 1,000 ký tự | HTTP 400 | Thiếu giới hạn kích thước chuỗi ở tầng API |
| `FR01-BVA-08` | `password.length` | $LB - 1$ | Độ dài = 7 (`"Pass1!a"`) | HTTP 400 | Lỗi chấp nhận mật khẩu ngắn yếu |
| `FR01-BVA-09` | `password.length` | $LB$ | Độ dài = 8 (`"Pass1!ab"`) | HTTP 200 | Lỗi viết nhầm `> 8` thay vì `>= 8` |
| `FR01-BVA-10` | `password.length` | $LB + 1$ | Độ dài = 9 (`"Pass1!abc"`) | HTTP 200 | Lỗi lệch biên cận dưới |
| `FR01-BVA-11` | `password.length` | $UB - 1$ | Độ dài = 127 ký tự hợp lệ | HTTP 200 | Lỗi lệch biên cận trên |
| `FR01-BVA-12` | `password.length` | $UB$ | Độ dài = 128 ký tự hợp lệ | HTTP 200 | Lỗi viết nhầm `< 128` thay vì `<= 128` |
| `FR01-BVA-13` | `password.length` | $UB + 1$ | Độ dài = 129 ký tự | HTTP 400 | Lỗi không chặn mật khẩu vượt ngưỡng |
| `FR01-BVA-14` | `password.length` | Extreme | Độ dài = 10,000 ký tự | HTTP 400 | Lỗ hổng DoS băm mật khẩu (bcrypt DoS) |

---

#### 3.2.4 Kết quả thực thi kiểm thử (Test Execution Results)

Toàn bộ **30 ca kiểm thử** của FR-01 đã được thực thi tự động qua test runner đối chiếu trực tiếp với SUT Backend đang chạy tại `http://localhost:3000`.

##### Bảng tổng hợp số lượng (Test Summary Count)

| Tính năng | Thiết kế (Designed) | Thực thi (Executed) | Thành công (Passed) | Thất bại (Failed) | Bị chặn (Blocked) | Chưa thực thi |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **FR-01** | **30** | **30** | **10** | **20** | **0** | **0** |

##### Bảng kết quả chi tiết từng ca kiểm thử

| Mã TC | Kỹ thuật | Tóm tắt ca kiểm thử | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
| :--- | :---: | :--- | :---: | :---: | :---: |
| `FR01-DT-01` | DT | Đăng ký hợp lệ đầy đủ thông tin chuẩn | HTTP 200, message success | HTTP 200, message success | **PASS** |
| `FR01-DT-02` | DT | Bỏ trống trường `name` (`""`) | HTTP 400 | HTTP 200, ID sinh mới | **FAIL** |
| `FR01-DT-03` | DT | Bỏ qua hoàn toàn trường `name` | HTTP 400 | HTTP 200, ID sinh mới | **FAIL** |
| `FR01-DT-04` | DT | Email sai format (thiếu `@`) | HTTP 400 | HTTP 200, ID sinh mới | **FAIL** |
| `FR01-DT-05` | DT | Email sai format (thiếu domain) | HTTP 400 | HTTP 200, ID sinh mới | **FAIL** |
| `FR01-DT-06` | DT | Bỏ trống trường `email` (`""`) | HTTP 400 | HTTP 200, ID sinh mới | **FAIL** |
| `FR01-DT-07` | DT | Bỏ qua hoàn toàn trường `email` | HTTP 400 | HTTP 200, ID sinh mới | **FAIL** |
| `FR01-DT-08` | DT | Kiểu dữ liệu `email` là Boolean (`true`) | HTTP 400 | HTTP 200, ID sinh mới | **FAIL** |
| `FR01-DT-09` | DT | Mật khẩu ngắn dưới 8 ký tự | HTTP 400 | HTTP 200, ID sinh mới | **FAIL** |
| `FR01-DT-10` | DT | Mật khẩu thiếu chữ in hoa | HTTP 400 | HTTP 200, ID sinh mới | **FAIL** |
| `FR01-DT-11` | DT | Mật khẩu thiếu chữ in thường | HTTP 400 | HTTP 200, ID sinh mới | **FAIL** |
| `FR01-DT-12` | DT | Mật khẩu thiếu chữ số | HTTP 400 | HTTP 200, ID sinh mới | **FAIL** |
| `FR01-DT-13` | DT | Mật khẩu thiếu ký tự đặc biệt | HTTP 400 | HTTP 200, ID sinh mới | **FAIL** |
| `FR01-DT-14` | DT | Bỏ trống trường `password` (`""`) | HTTP 400 | HTTP 200, ID sinh mới | **FAIL** |
| `FR01-DT-15` | DT | Bỏ qua hoàn toàn trường `password` | HTTP 400 | HTTP 200, ID sinh mới | **FAIL** |
| `FR01-DT-16` | DT | Đăng ký với email đã tồn tại trong DB | HTTP 409 | HTTP 200, ID sinh mới | **FAIL** |
| `FR01-BVA-01` | BVA | `name.length = 0` (LB-1, chuỗi rỗng) | HTTP 400 | HTTP 200, ID sinh mới | **FAIL** |
| `FR01-BVA-02` | BVA | `name.length = 1` (LB) | HTTP 200 | HTTP 200, message success | **PASS** |
| `FR01-BVA-03` | BVA | `name.length = 2` (LB+1) | HTTP 200 | HTTP 200, message success | **PASS** |
| `FR01-BVA-04` | BVA | `name.length = 99` (UB-1) | HTTP 200 | HTTP 200, message success | **PASS** |
| `FR01-BVA-05` | BVA | `name.length = 100` (UB, tiếng Việt UTF-8) | HTTP 200 | HTTP 200, message success | **PASS** |
| `FR01-BVA-06` | BVA | `name.length = 101` (UB+1) | HTTP 400 | HTTP 200, ID sinh mới | **FAIL** |
| `FR01-BVA-07` | BVA | `name.length = 1000` (Extreme payload) | HTTP 400 | HTTP 200, ID sinh mới | **FAIL** |
| `FR01-BVA-08` | BVA | `password.length = 7` (LB-1) | HTTP 400 | HTTP 200, ID sinh mới | **FAIL** |
| `FR01-BVA-09` | BVA | `password.length = 8` (LB) | HTTP 200 | HTTP 200, message success | **PASS** |
| `FR01-BVA-10` | BVA | `password.length = 9` (LB+1) | HTTP 200 | HTTP 200, message success | **PASS** |
| `FR01-BVA-11` | BVA | `password.length = 127` (UB-1) | HTTP 200 | HTTP 200, message success | **PASS** |
| `FR01-BVA-12` | BVA | `password.length = 128` (UB) | HTTP 200 | HTTP 200, message success | **PASS** |
| `FR01-BVA-13` | BVA | `password.length = 129` (UB+1) | HTTP 400 | HTTP 200, ID sinh mới | **FAIL** |
| `FR01-BVA-14` | BVA | `password.length = 10000` (Extreme DoS) | HTTP 400 | HTTP 200, ID sinh mới | **FAIL** |

---

#### 3.2.5 Lỗi phần mềm phát hiện (Defects Discovered)

20 ca kiểm thử thất bại được tổng hợp và quy nạp về **5 lỗi phần mềm độc lập (Bugs)**:

| Mã lỗi (Bug ID) | Tóm tắt khiếm khuyết | Các TC phát hiện | Mức độ nghiêm trọng (Severity) | Độ ưu tiên (Priority) | Liên kết tài liệu |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **BUG-FR01-01** | Backend thiếu kiểm tra các trường bắt buộc (`name`, `email`, `password` rỗng/thiếu vẫn tạo tài khoản thành công) | DT-02, 03, 06, 07, 14, 15 | **Major** | **High** | [BUG-FR01-01.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR01-01.md) |
| **BUG-FR01-02** | Backend không kiểm tra định dạng email và kiểu dữ liệu (email thiếu `@`, nhận kiểu boolean/số vẫn trả về HTTP 200) | DT-04, 05, 08 | **Major** | **High** | [BUG-FR01-02.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR01-02.md) |
| **BUG-FR01-03** | Cho phép đăng ký tài khoản trùng lặp email do thiếu ràng buộc `UNIQUE` trong DB và không kiểm tra tồn tại ở API | DT-16 | **Critical** | **Immediate** | [BUG-FR01-03.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR01-03.md) |
| **BUG-FR01-04** | Backend không kiểm tra độ dài tối thiểu và các tiêu chí độ phức tạp của mật khẩu | DT-09, 10, 11, 12, 13, BVA-08 | **Major** | **High** | [BUG-FR01-04.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR01-04.md) |
| **BUG-FR01-05** | Không có giới hạn cận trên cho độ dài họ tên và mật khẩu (chấp nhận payload 1,000 - 10,000 ký tự mà không từ chối) | BVA-06, 07, 13, 14 | **Minor** | **Medium** | [BUG-FR01-05.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR01-05.md) |

*(Toàn bộ báo cáo phân tích lỗi chi tiết kèm request/response mẫu được lưu tại [HW2/report/bugs.vi.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/bugs.vi.md)).*

---

#### 3.2.6 Phân tích khoảng trống của AI (AI Gap Analysis)

Quá trình đối chiếu giữa thiết kế ban đầu của AI và kết quả thực thi thực tế đã chỉ ra **3 khoảng trống lớn**, qua đó trực tiếp thúc đẩy việc nâng cấp bộ Agent Skills từ **v1.0** lên **v2.0**:

| Mục bị bỏ sót | Cách phát hiện | Vì sao AI bỏ sót | Nhóm nguyên nhân (Category) | Hành động cải tiến Skill (v1 → v2) |
| :--- | :--- | :--- | :--- | :--- |
| **1. Lệch pha regex mật khẩu giữa Web và Mobile** | Người kiểm thử đối chiếu mã nguồn giữa `Register.jsx:15` và `App.js:212`. | AI ban đầu chỉ đọc backend `server.js` và `api_specification.md`, không tự động duyệt client UI khi phân tích API backend. | `Tool limitation` & `Inherent feature complexity` | Bổ sung **Cross-platform Skew Checklist** vào `domain-testing` skill (Stage 0), bắt buộc duyệt cả 3 nguồn Web, Mobile và Backend. |
| **2. Biên mã hóa Unicode tiếng Việt (UTF-8 bytes vs char)** | Người kiểm thử yêu cầu kiểm tra kỹ tên tiếng Việt có dấu. | AI có xu hướng mặc định sinh chuỗi ký tự ASCII (`"A".repeat(100)`), bỏ qua việc ký tự có dấu chiếm 2-3 bytes UTF-8. | `Prompt/input quality` | Bổ sung **Encoding Boundary Rule** vào `boundary-value-analysis` skill (Stage 3), bắt buộc có test case tiếng Việt có dấu tại UB. |
| **3. Thiên kiến hệ thống chạy chuẩn (Bias towards REST spec)** | Khi chạy test, 20 ca trả về HTTP 200 thay vì HTTP 400. | AI tự động gán kỳ vọng HTTP 400 theo tiêu chuẩn RESTful API mà không kiểm tra xem backend có code `if (!field)` hay không. | `Tool limitation` | Bổ sung nguyên tắc **Zero-Trust SUT** vào `test-execution-and-bugs` skill (Stage 3), kiểm tra sự hiện diện của code validation trước khi chạy. |

---

#### 3.2.7 Hạn chế của kỹ thuật
1. **Lỗi không nằm ở biên:** Hai khiếm khuyết nghiêm trọng nhất của FR-01 (`BUG-FR01-03` trùng email và `BUG-FR01-01` thiếu validation) hoàn toàn không nằm ở các giá trị biên của độ dài chuỗi, mà nằm ở logic nghiệp vụ và kiến trúc database (thiếu ràng buộc `UNIQUE`). Kỹ thuật BVA chỉ bắt được các lỗi độ dài payload cực lớn (`BUG-FR01-05`).
2. **Miền giá trị thực sự không biết trước:** Do mã nguồn Backend bỏ ngỏ hoàn toàn validation, miền giá trị thực tế của hệ thống là vô hạn ($-\infty, +\infty$). Mọi phân tích biên toán học đều phải dựa trên các đặc tả ngầm định hoặc tiêu chuẩn kỹ thuật (RFC) thay vì phản ánh giới hạn cơ học của phần mềm.

---

### **3.3 FR-03 — Forgot Password and Password Reset (Two Steps)**

#### 3.3.1 Tìm hiểu tính năng và đặc tả thực tế
- **Quy trình 2 bước phụ thuộc trạng thái (Stateful Flow):**
  - **Bước 1 (Request OTP):** `POST /api/forgot-password` (Base URL: `http://localhost:3000`). Người dùng gửi email để nhận mã OTP khôi phục mật khẩu.
  - **Bước 2 (Reset Password):** `POST /api/reset-password`. Người dùng gửi email, mã `resetToken` nhận được từ Bước 1, và `newPassword` để cập nhật mật khẩu mới.
- **Nguồn đặc tả đã sử dụng:**
  - `docs/api_specification.md` (mục 1.3 Quên mật khẩu và 1.4 Đặt lại mật khẩu) `[SPEC]`
  - Mã nguồn Backend: `eshop-sut/backend/server.js:68-98` và `eshop-sut/backend/database.js:58` `[CODE]`
  - Mã nguồn Frontend Web: `eshop-sut/frontend-web/src/pages/ForgotPassword.jsx:10-70` `[CODE]`
  - Mã nguồn Frontend Mobile: `eshop-sut/frontend-mobile/App.js:250-280` `[CODE]`
  - Quan sát thực thi qua HTTP API Runner: `[OBSERVED]`
- **Phát hiện quan trọng từ mã nguồn SUT (Code Investigation):**
  - **Lỗ hổng lộ OTP trong HTTP Response Body (`server.js:77`):** Khi người dùng gọi `POST /api/forgot-password`, server sinh mã ngẫu nhiên 4 chữ số `Math.floor(1000 + Math.random() * 9000).toString()` và **trả thẳng `resetToken` trong response body** (`res.json({ message: "...", resetToken })`). Điều này tạo ra lỗ hổng bảo mật nghiêm trọng (Information Disclosure / Account Takeover) cho phép bất kỳ ai biết email nạn nhân đều có thể lấy OTP và đổi mật khẩu mà không cần đọc email hay SMS!
  - **Mã OTP không có thời hạn hết hạn (`database.js:58`):** Bảng `users` chỉ có cột `reset_token TEXT` mà không có cột lưu thời gian tạo (`created_at`) hay thời gian hết hạn (`expires_at`). Mã OTP có hiệu lực vô thời hạn cho tới khi được dùng hoặc bị ghi đè.
  - **Cơ chế Token dùng một lần (Single-use Token):** Khi đổi mật khẩu thành công tại `server.js:90`, backend thực thi `UPDATE users SET password = ?, reset_token = NULL WHERE id = ?`. Sau khi đã reset, token cũ bị xóa về `NULL` và không thể tái sử dụng.
  - **Backend hoàn toàn không kiểm tra `newPassword` (`server.js:84-97`):** Sau khi xác thực user khớp với `resetToken`, backend gọi thẳng `bcrypt.hash(newPassword)` mà không kiểm tra độ dài tối thiểu, độ phức tạp, hay chuỗi rỗng. Chấp nhận mật khẩu rỗng `""`, 1 ký tự, hoặc payload 10,000 ký tự.
  - **Mâu thuẫn giữa Đặc tả và Mã nguồn thực tế:** Đặc tả `api_specification.md:42` ghi mẫu OTP 6 chữ số `"123456"`, nhưng backend thực tế sinh số 4 chữ số `1000..9999` (khớp với nhãn Web "Mã OTP (4 số)").
  - **Lệch pha Regex Password giữa Web và Mobile:** Web (`ForgotPassword.jsx:26`) yêu cầu khoảng trắng `\s` và cấm ký tự đặc biệt; Mobile (`App.js:262`) yêu cầu ký tự đặc biệt `[^A-Za-z\d]`.

---

#### 3.3.2 Kiểm thử miền (Domain Testing)

##### Bước 1: Xác định biến Input, Output, State và Miền giá trị (Domains)

| Biến | Loại (Kind) | Kiểu dữ liệu | Miền giá trị & Ràng buộc kỹ thuật (Domain) | Nguồn (Source tag) |
| :--- | :--- | :--- | :--- | :---: |
| `step1_email` | Input | String | - Email yêu cầu cấp OTP tại Bước 1.<br>- Ràng buộc: Bắt buộc, đúng định dạng RFC 5322, phải tồn tại trong DB.<br>- *Code thực tế:* `server.js:68` không validate; truy vấn trực tiếp SQLite; nếu không thấy trả về 404. | `[SPEC]` api_spec:31<br>`[CODE]` server.js:68 |
| `step2_email` | Input | String | - Email của tài khoản cần đổi mật khẩu tại Bước 2.<br>- Ràng buộc: Phải khớp với email đã được cấp OTP ở Bước 1.<br>- *Code thực tế:* So khớp đồng thời `WHERE email = ? AND reset_token = ?`. | `[SPEC]` api_spec:41<br>`[CODE]` server.js:84 |
| `step2_resetToken` | Input | String | - Mã xác nhận OTP khôi phục mật khẩu.<br>- Ràng buộc: Chuỗi số 4 ký tự `[1000, 9999]`. Chỉ dùng 1 lần.<br>- *Dị biệt:* Spec ghi mẫu 6 số `"123456"`; code sinh 4 số `1000..9999`. | `[CODE]` server.js:72<br>`[SPEC]` (mẫu 6 số) |
| `step2_newPassword` | Input | String | - Mật khẩu mới thiết lập cho tài khoản.<br>- Ràng buộc lý thuyết: Độ dài [8, 128], gồm chữ hoa, thường, số, ký tự đặc biệt.<br>- *Code thực tế:* Backend hoàn toàn không validate, nhận mọi giá trị/rỗng. | `[SPEC]` api_spec:43<br>`[CODE]` ForgotPassword.jsx:26<br>`[CODE]` server.js:84 |
| `user_account_state` | State | Enum | - Trạng thái tài khoản trong DB.<br>- Miền giá trị: `{ NOT_EXIST, EXIST_NO_TOKEN, EXIST_WITH_VALID_TOKEN, EXIST_TOKEN_USED }`. | `[CODE]` server.js:69-90<br>`[ASSUMED]` State Model |
| `token_validity_state` | State | Enum | - Trạng thái của mã resetToken trong DB.<br>- Miền giá trị: `{ NULL, ACTIVE_MATCH, ACTIVE_MISMATCH, EXPIRED (chưa hỗ trợ trong code) }`. | `[CODE]` database.js:58<br>`[CODE]` server.js:85 |
| `system_output_response`| Output | Object | - Mã HTTP status (200, 400, 404) và thông điệp JSON tương ứng. | `[SPEC]` api_spec:34-48<br>`[CODE]` server.js:70-95 |

---

##### Bước 2: Phân hoạch các lớp tương đương (Equivalence Partitioning)
Phân hoạch thành **31 lớp tương đương** (`EC01` đến `EC31`) bao quát 2 bước của quy trình:

| Biến / Trạng thái | Lớp tương đương hợp lệ (Valid ECs) | Lớp tương đương không hợp lệ (Invalid ECs) |
| :--- | :--- | :--- |
| **`step1_email`** | **EC01:** Email hợp lệ và đã tồn tại trong DB | **EC02:** Email hợp lệ nhưng chưa từng đăng ký (404)<br>**EC03:** Email là chuỗi rỗng `""`<br>**EC04:** Thiếu trường `email` trong body `{}`<br>**EC05:** Email sai định dạng (thiếu `@`)<br>**EC06:** Email sai định dạng (thiếu domain)<br>**EC07:** Sai kiểu dữ liệu (Boolean/Number) |
| **`step2_email`** | **EC08:** Email khớp chính xác với tài khoản đã cấp OTP | **EC09:** Email không khớp với tài khoản được cấp OTP<br>**EC10:** Email rỗng hoặc thiếu trường |
| **`step2_resetToken`** | **EC11:** Mã OTP đúng 4 chữ số và khớp giá trị trong DB | **EC12:** Mã OTP sai giá trị (4 chữ số không khớp DB)<br>**EC13:** Mã OTP sai độ dài (3 số hoặc 6 số mẫu spec)<br>**EC14:** Mã OTP rỗng `""` hoặc thiếu trường<br>**EC15:** Token đã qua sử dụng một lần (đã bị xóa về NULL)<br>**EC16:** Mã OTP hợp lệ của User B đem dùng cho User A<br>**EC17:** Gửi token cho user chưa từng gọi Bước 1 |
| **`step2_newPassword`** | **EC18:** Mật khẩu mạnh hợp lệ (8..128 ký tự, đủ hoa, thường, số, đặc biệt) | **EC19:** Mật khẩu quá ngắn (< 8 ký tự)<br>**EC20:** Thiếu chữ in hoa (`[A-Z]`)<br>**EC21:** Thiếu chữ in thường (`[a-z]`)<br>**EC22:** Thiếu chữ số (`\d`)<br>**EC23:** Có khoảng trắng, thiếu ký tự đặc biệt (Web regex skew)<br>**EC24:** Mật khẩu rỗng `""` hoặc thiếu trường<br>**EC25:** Mật khẩu quá dài (> 128 ký tự) |
| **Trạng thái & Output** | **EC26:** Cấp mã thành công (Step 1 HTTP 200)<br>**EC28:** Đổi mật khẩu thành công (Step 2 HTTP 200) | **EC27:** Step 1 từ chối (HTTP 404/400)<br>**EC29:** Step 2 từ chối do lỗi xác thực token/email (HTTP 400)<br>**EC30:** Step 2 từ chối do mật khẩu không hợp lệ (HTTP 400)<br>**EC31:** Mã OTP hết hạn theo thời gian (Code chưa hỗ trợ) |

---

##### Bước 3 & 4: Thiết kế bộ test case tối thiểu và Ma trận bao phủ 100%
Thiết kế **22 ca kiểm thử tối thiểu** (`FR03-DT-01` đến `FR03-DT-22`), gồm 1 ca kiểm thử Valid kết hợp toàn bộ quy trình và 21 ca kiểm thử Invalid đơn lập để cô lập lỗi.

- **Ma trận bao phủ Equivalence Class (Coverage Matrix):**

| Mã Test Case | Loại TC | Tóm tắt mục tiêu kiểm thử | Các lớp EC được bao phủ | Kết quả mong đợi |
| :--- | :---: | :--- | :--- | :---: |
| `FR03-DT-01` | Valid | Quy trình khôi phục hoàn chỉnh (Step 1 + Step 2) | **EC01, EC08, EC11, EC18, EC26, EC28** | HTTP 200 Success |
| `FR03-DT-02` | Invalid | Bước 1: Email chưa từng đăng ký trong DB | **EC02, EC27** | HTTP 404 User not found |
| `FR03-DT-03` | Invalid | Bước 1: Email là chuỗi rỗng `""` | **EC03, EC27** | HTTP 400 Bad Request |
| `FR03-DT-04` | Invalid | Bước 1: Thiếu hoàn toàn field `email` trong body | **EC04, EC27** | HTTP 400 Bad Request |
| `FR03-DT-05` | Invalid | Bước 1: Email sai cú pháp (thiếu `@`) | **EC05, EC27** | HTTP 400 Bad Request |
| `FR03-DT-06` | Invalid | Bước 1: Email thiếu tên miền domain sau `@` | **EC06, EC27** | HTTP 400 Bad Request |
| `FR03-DT-07` | Invalid | Bước 1: Email sai kiểu dữ liệu (Boolean `true`) | **EC07, EC27** | HTTP 400 Bad Request |
| `FR03-DT-08` | Invalid | Bước 2: Email không khớp tài khoản được cấp OTP | **EC09, EC29** | HTTP 400 Invalid token/email |
| `FR03-DT-09` | Invalid | Bước 2: Email chuỗi rỗng | **EC10, EC29** | HTTP 400 Invalid token/email |
| `FR03-DT-10` | Invalid | Bước 2: Mã OTP sai giá trị 4 chữ số | **EC12, EC29** | HTTP 400 Invalid token/email |
| `FR03-DT-11` | Invalid | Bước 2: Mã OTP sai độ dài (6 chữ số theo mẫu spec) | **EC13, EC29** | HTTP 400 Invalid token/email |
| `FR03-DT-12` | Invalid | Bước 2: Mã OTP là chuỗi rỗng `""` | **EC14, EC29** | HTTP 400 Invalid token/email |
| `FR03-DT-13` | Invalid | Bước 2: Tái sử dụng token đã dùng (Single-use test) | **EC15, EC29** | HTTP 400 Invalid token/email |
| `FR03-DT-14` | Invalid | Bước 2: Dùng OTP User B đổi mật khẩu User A | **EC16, EC29** | HTTP 400 Invalid token/email |
| `FR03-DT-15` | Invalid | Bước 2: Gửi token cho user chưa từng gọi Bước 1 | **EC17, EC29** | HTTP 400 Invalid token/email |
| `FR03-DT-16` | Invalid | Bước 2: Mật khẩu mới quá ngắn (< 8 ký tự, `Pass1!`) | **EC19, EC30** | HTTP 400 Bad Request |
| `FR03-DT-17` | Invalid | Bước 2: Mật khẩu mới thiếu chữ in hoa | **EC20, EC30** | HTTP 400 Bad Request |
| `FR03-DT-18` | Invalid | Bước 2: Mật khẩu mới thiếu chữ in thường | **EC21, EC30** | HTTP 400 Bad Request |
| `FR03-DT-19` | Invalid | Bước 2: Mật khẩu mới thiếu chữ số | **EC22, EC30** | HTTP 400 Bad Request |
| `FR03-DT-20` | Invalid | Bước 2: Mật khẩu mới có khoảng trắng, thiếu ký tự đặc biệt | **EC23, EC30** | HTTP 400 Bad Request |
| `FR03-DT-21` | Invalid | Bước 2: Mật khẩu mới là chuỗi rỗng `""` | **EC24, EC30** | HTTP 400 Bad Request |
| `FR03-DT-22` | Invalid | Bước 2: Mật khẩu mới vượt quá độ dài tối đa (> 128 ký tự) | **EC25, EC30** | HTTP 400 Bad Request |

*Độ bao phủ: 30/30 lớp EC khả thi (100%). Lớp EC31 (hết hạn token) là phát hiện kiến trúc thiếu trường thời gian trong DB.*

---

#### 3.3.3 Phân tích giá trị biên (Boundary Value Analysis - BVA)

##### Bước 1: Xác định biến có miền thứ tự
- **Biến có thứ tự áp dụng BVA:**
  1. `newPassword.length`: Miền số nguyên độ dài ký tự $[8, 128]$.
  2. `resetToken`: Miền giá trị số nguyên 4 chữ số $[1000, 9999]$ và độ dài chuỗi ký tự.
- **Biến không áp dụng BVA:**
  - `email`: Miền phi thứ tự (Unordered Domain), kiểm tra theo cấu trúc cú pháp (Domain Testing).
  - `boolean / status`: Kiểu rời rạc (Discrete Enum), không có khái niệm lân cận biên.

##### Bước 2: Xác định điểm biên (3-value BVA + Mô hình 9 điểm + Biên mã hóa UTF-8)
- **`newPassword.length` [8, 128]:**
  - Cận dưới: $LB-1 = 7$, $LB = 8$, $LB+1 = 9$.
  - Cận trên: $UB-1 = 127$, $UB = 128$, $UB+1 = 129$.
  - Điểm danh định: $Nominal = 16$.
  - Cực trị vật lý (Physical Extremes): $Min = 0$ (chuỗi rỗng), $Max = 10,000$ (phòng chống DoS payload).
  - **Quy tắc biên mã hóa (v2.0 Encoding Rule):** Bổ sung test case độ dài 128 ký tự tiếng Việt có dấu (`"KhởiTạoMậtKhẩuMới123!..."`) để kiểm chứng kích thước byte UTF-8 so với ký tự.
- **`resetToken` [1000, 9999]:**
  - Độ dài: $LB-1 = 3$ số, $LB = 4$ số, $UB+1 = 5$ số, Spec Sample = 6 số (`123456`).
  - Giá trị số: $LB = 1000$, $UB = 9999$.

##### Bước 3: Danh sách 15 ca kiểm thử BVA

| Mã Test Case | Biến kiểm thử | Giá trị biên cụ thể | Ý nghĩa kỹ thuật | Lỗi code sẽ bắt được | Kết quả mong đợi |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `FR03-BVA-01` | `newPassword.length` | `length = 0` (`""`) | Min Extreme | Bỏ sót kiểm tra chuỗi rỗng | HTTP 400 |
| `FR03-BVA-02` | `newPassword.length` | `length = 7` (`Pass12!`) | $LB-1$ | Lỗi dùng nhầm toán tử `>` thay vì `>=` | HTTP 400 |
| `FR03-BVA-03` | `newPassword.length` | `length = 8` (`Pass123!`) | $LB$ | Từ chối nhầm mật khẩu hợp lệ tối thiểu | HTTP 200 |
| `FR03-BVA-04` | `newPassword.length` | `length = 9` (`Pass1234!`) | $LB+1$ | Lỗi lệch 1 đơn vị cận dưới | HTTP 200 |
| `FR03-BVA-05` | `newPassword.length` | `length = 127` | $UB-1$ | Lỗi lệch 1 đơn vị cận trên | HTTP 200 |
| `FR03-BVA-06` | `newPassword.length` | `length = 128` (ASCII) | $UB$ | Từ chối nhầm mật khẩu hợp lệ tối đa | HTTP 200 |
| `FR03-BVA-07` | `newPassword.length` | `length = 128` (Unicode UTF-8) | $UB$ Encoding | Đếm byte UTF-8 làm tràn bộ đệm sớm | HTTP 200 |
| `FR03-BVA-08` | `newPassword.length` | `length = 129` | $UB+1$ | Lỗi dùng nhầm toán tử `<` thay vì `<=` | HTTP 400 |
| `FR03-BVA-09` | `newPassword.length` | `length = 10,000` | Max Extreme | Tấn công cạn kiệt CPU (DoS payload) | HTTP 400 |
| `FR03-BVA-10` | `resetToken.length` | `length = 0` (`""`) | Extreme | Chấp nhận token rỗng | HTTP 400 |
| `FR03-BVA-11` | `resetToken.length` | `length = 3` (`"999"`) | $LB-1$ | Bỏ qua kiểm tra độ dài token ngắn | HTTP 400 |
| `FR03-BVA-12` | `resetToken.value` | `value = 1000` | $LB$ giá trị | Sai lệch biên dưới dải OTP 4 số | HTTP 400 / 200 |
| `FR03-BVA-13` | `resetToken.value` | `value = 9999` | $UB$ giá trị | Sai lệch biên trên dải OTP 4 số | HTTP 400 / 200 |
| `FR03-BVA-14` | `resetToken.length` | `length = 5` (`"10000"`) | $UB+1$ độ dài | Chấp nhận token dài hơn 4 số | HTTP 400 |
| `FR03-BVA-15` | `resetToken.length` | `length = 6` (`"123456"`) | Spec boundary | Không phát hiện sai lệch mẫu đặc tả | HTTP 400 |

---

#### 3.3.4 Kết quả thực thi kiểm thử chi tiết

Toàn bộ 37 ca kiểm thử (22 DT + 15 BVA) đã được thực thi tự động qua test runner `run_cases.mjs` tích hợp hook cấp token động:
- **Tổng số thiết kế (Designed):** 37
- **Đã thực thi (Executed):** 37 (100%)
- **Thành công (PASS):** 21
- **Thất bại (FAIL):** 16
- **Bị chặn (BLOCKED):** 0

*Tóm tắt kết quả thực thi 16 ca FAIL:*
- **11 ca FAIL do Backend thiếu validation `newPassword`:** `FR03-DT-16` đến `FR03-DT-22`, `FR03-BVA-01`, `FR03-BVA-02`, `FR03-BVA-08`, `FR03-BVA-09`. Tất cả đều trả về `HTTP 200 OK {"message":"Password reset successfully"}` thay vì từ chối bằng HTTP 400 Bad Request.
- **5 ca FAIL do Backend thiếu validation email đầu vào:** `FR03-DT-03` đến `FR03-DT-07`. Tất cả đều trả về `HTTP 404 Not Found {"error":"User not found"}` thay vì HTTP 400 Bad Request.

Minh chứng thực thi được lưu tại: [HW2/evidence/FR-03/test-execution.log](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-03/test-execution.log).

---

#### 3.3.5 Báo cáo lỗi phần mềm (Defect Triage)

16 ca kiểm thử thất bại và các khảo sát mã nguồn được quy về **4 khiếm khuyết phần mềm**:

| Mã lỗi (Bug ID) | Tiêu đề lỗi | Test Cases phát hiện | Mức độ (Severity) | Độ ưu tiên |
| :--- | :--- | :--- | :---: | :---: |
| **BUG-FR03-01** | Lộ mã OTP (`resetToken`) trong HTTP response body của `POST /api/forgot-password` | `FR03-DT-01` | **Critical** | Immediate |
| **BUG-FR03-02** | Backend hoàn toàn không kiểm tra tính hợp lệ và độ phức tạp của `newPassword` | 11 TCs (`FR03-DT-16..22`, `FR03-BVA-01, 02, 08, 09`) | **Critical** | High |
| **BUG-FR03-03** | Mã đặt lại mật khẩu không có thời hạn hết hạn (Token Never Expires do DB thiếu timestamp) | Khảo sát `database.js:58` | **Major** | Medium |
| **BUG-FR03-04** | Endpoint `POST /api/forgot-password` trả về HTTP 404 thay vì HTTP 400 khi email sai quy cách | 5 TCs (`FR03-DT-03..07`) | **Minor** | Low |

Chi tiết báo cáo lỗi: [bugs.vi.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/bugs.vi.md) và các dự thảo GitHub Issues tại `HW2/report/issues/BUG-FR03-*.md`.

---

#### 3.3.6 Phân tích khoảng trống của AI (AI Gap Analysis & Nâng cấp v2.1)

Quá trình kiểm thử FR-03 đã làm bộc lộ 4 khoảng trống AI quan trọng, dẫn đến việc tiếp tục nâng cấp bộ kỹ năng lên **phiên bản v2.1**:

| Mục bị bỏ sót / Thách thức thực tế | Cách phát hiện | Vì sao AI bỏ sót ban đầu | Phân loại nguyên nhân (Category) | Hành động cải tiến Skill (v2.0 → v2.1) |
| :--- | :--- | :--- | :--- | :--- |
| **1. Phụ thuộc Token động trong quy trình stateful** | Runner gửi `"VALID_TOKEN"` tĩnh bị backend chặn ở bước xác thực token, che giấu lỗi password | AI coi các test case API là độc lập và phi trạng thái (stateless) | `Inherent feature complexity` | Nâng cấp runner với quy tắc **Stateful Flow Dynamic Setup Hook**: tự động gọi endpoint tiền đề lấy token động thời gian thực. |
| **2. Thiên kiến chức năng che mờ lỗ hổng bảo mật rò rỉ OTP** | Đọc mã nguồn `server.js:77` thấy `res.json({ message, resetToken })` | AI bị thiên kiến chức năng (Functional Bias): coi việc trả về token là "thành công" để assert | `Tool limitation` & `Inherent feature complexity` | Bổ sung quy tắc **Sensitive Field In Response Anti-Pattern Check** (CWE-200) vào Stage 0 và Stage 3. |
| **3. Bỏ sót biến thời gian ẩn (Token Expiration)** | Kiểm tra bảng `users` (`database.js:58`) thấy không có cột lưu thời gian tạo/hết hạn OTP | Spec không nhắc đến thời hạn token; biến thời gian là biến ẩn không nằm trong request payload | `Prompt/input quality` & `Inherent feature complexity` | Bổ sung **Temporal/Expiration State Variable Checklist** vào Stage 1 để luôn rà soát thời hạn hiệu lực của token. |
| **4. Mâu thuẫn định dạng OTP giữa Đặc tả và Mã nguồn thực tế** | Đối chiếu `api_specification.md` (6 số) với `server.js:72` (sinh 4 số) và Web JSX | AI ban đầu nếu chỉ đọc spec sẽ sinh toàn bộ test case cho OTP 6 số | `Inherent feature complexity` | Áp dụng quy tắc **Multi-Source Discrepancy Resolution** trong Stage 0: luôn ưu tiên mã nguồn thực tế kèm ghi chú sai lệch. |

---

#### 3.3.7 Hạn chế của kỹ thuật
1. **Khó khăn với quy trình phụ thuộc trạng thái (Stateful Multi-step Process):** Kỹ thuật phân hoạch tương đương và BVA giả định các biến đầu vào có thể kiểm thử độc lập. Khi áp dụng cho một quy trình 2 bước phụ thuộc token sinh ngẫu nhiên ở runtime, các ca kiểm thử Bước 2 không thể thực thi nếu không có cơ chế thiết lập trạng thái tiền đề (Dynamic Setup Hook).
2. **Lỗ hổng bảo mật nằm ngoài tầm quét của BVA:** Hai khiếm khuyết nguy hiểm nhất (`BUG-FR03-01` trả OTP qua HTTP và `BUG-FR03-03` token vô thời hạn) hoàn toàn không xuất phát từ việc vi phạm giá trị biên của dữ liệu, mà xuất phát từ lỗi thiết kế kiến trúc bảo mật.

---

### **3.4 FR-08 — Checkout**

*(Phần này sẽ được thực hiện kế tiếp)*

---

### **3.5 FR-12 — Access Control**

#### 3.5.1 Tìm hiểu tính năng và đặc tả thực tế
- **Phạm vi tính năng:** Kiểm soát quyền truy cập và phân quyền người dùng (Access control) theo `docs/eshop-features.md` và `docs/api_specification.md` (mục 6. Phân quyền và Bảo mật).
- **Các nhóm endpoint khảo sát (14 endpoints):**
  - Quản lý người dùng admin: `GET /api/admin/users`, `DELETE /api/admin/users/:id` `[SPEC: api_spec:120-128]`.
  - Quản lý đơn hàng admin: `GET /api/admin/orders`, `POST /api/admin/orders/:id/status` `[SPEC: api_spec:130-138]`.
  - Quản lý danh mục sản phẩm: `POST /api/categories`, `DELETE /api/categories/:id` `[SPEC: api_spec:100-108]`.
  - Quản lý sản phẩm: `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` `[SPEC: api_spec:60-70]`.
  - Quản lý mã giảm giá coupon: `POST /api/coupons`, `DELETE /api/coupons/:id` `[SPEC: api_spec:140-148]`.
  - Hồ sơ người dùng cá nhân: `GET /api/users/me`, `PUT /api/users/me` `[SPEC: api_spec:25-32]`.
- **Nguồn đặc tả đã sử dụng:**
  - `docs/api_specification.md` (mục 6 Phân quyền và Bảo mật) `[SPEC]`
  - Mã nguồn Backend: `eshop-sut/backend/server.js:100-301` và `database.js:45-75` `[CODE]`
  - Quan sát thực thi qua HTTP API Runner: `[OBSERVED]`
- **Phát hiện quan trọng từ mã nguồn SUT (Code Investigation):**
  - **Middleware `authenticateToken` thiếu kiểm tra phân quyền (`server.js:100-110`):** Hàm này chỉ gọi `jwt.verify(token, SECRET_KEY)` để giải mã JWT và gán `req.user = user`. Hoàn toàn không có câu lệnh kiểm tra vai trò `admin`.
  - **Tất cả các route quản trị đều thiếu kiểm tra vai trò (`server.js:231-301`):** Các route `GET /api/admin/users`, `GET /api/admin/orders`, `POST /api/categories`, `POST /api/coupons`, v.v. chỉ gắn `authenticateToken` mà không kiểm tra `if (req.user.role !== 'admin') return res.status(403)...`. Do đó, người dùng thông thường (`role: 'user'`) có thể truy cập và thao tác toàn quyền như quản trị viên tối cao.
  - **Nhóm route sản phẩm (`POST/PUT/DELETE /api/products`) bỏ quên xác thực (`server.js:167`):** Các endpoint thay đổi kho hàng hoàn toàn là public endpoints, bất kỳ ai ngoài Internet (khách vãng lai unauthenticated) cũng có thể tạo, chỉnh sửa hoặc xóa sản phẩm.
  - **Lỗ hổng gán tham số hàng loạt (Mass Assignment) tại `PUT /api/users/me` (`server.js:124-127`):** Endpoint cập nhật thông tin cá nhân nhận trực tiếp trường `role` từ request body và ghi đè vào DB, cho phép người dùng thường tự leo quyền thành Admin.

---

#### 3.5.2 Kiểm thử miền (Domain Testing)

##### Bước 1: Xác định biến Input, Output, State và Miền giá trị (Domains)

| Biến | Loại (Kind) | Kiểu dữ liệu | Miền giá trị & Ràng buộc kỹ thuật (Domain) | Nguồn (Source tag) |
| :--- | :--- | :--- | :--- | :---: |
| `Authorization` | Input | String | - Header chứa JWT Bearer token xác thực: `Bearer <token>`.<br>- Ràng buộc: Đúng tiền tố `Bearer `, đúng chữ ký HMAC Secret, đúng cấu trúc 3 phần `header.payload.sig`. | `[SPEC]` api_spec:120<br>`[CODE]` server.js:101-106 |
| `token_role` | Input | String (Claim) | - Quyền hạn lưu trong payload JWT: `{ role: 'admin' }` hoặc `{ role: 'user' }`.<br>- Ràng buộc: Các tài nguyên quản trị chỉ cho phép `admin`. Nếu là `user`, phải trả về HTTP 403 Forbidden. | `[SPEC]` api_spec:120<br>`[CODE]` server.js:106 |
| `target_endpoint` | Input | String | - Endpoint API đích được gọi trong request.<br>- Phân nhóm: Admin APIs, Category APIs, Product write APIs, Coupon APIs, User profile APIs. | `[SPEC]` api_spec:60-148<br>`[CODE]` server.js:120-301 |
| `request_body` | Input | Object | - Dữ liệu kèm theo request (danh mục, sản phẩm, coupon, profile).<br>- Rủi ro over-posting: Trường `role` gửi kèm trong `PUT /api/users/me`. | `[SPEC]` api_spec:28<br>`[CODE]` server.js:124 |
| `token_exp_state` | State | Enum | - Trạng thái thời hạn của token JWT: `{ ACTIVE (exp > now), EXPIRED (exp <= now) }`. | `[CODE]` server.js:105<br>`[SPEC]` JWT RFC 7519 |
| `user_account_status` | State | Enum | - Trạng thái tài khoản người dùng trong SQLite: `{ ACTIVE_USER, ACTIVE_ADMIN, NON_EXISTENT }`. | `[CODE]` database.js:53<br>`[ASSUMED]` State Model |
| `privilege_state` | State | Enum | - Trạng thái quyền hạn của tài khoản: `{ NORMAL_USER, ESCALATED_ADMIN }`. | `[CODE]` server.js:126 |
| `Response.status` | Output | Number | - Mã HTTP status trả về: `{ 200, 201, 400, 401, 403, 404, 500 }`. | `[SPEC]` api_spec:124<br>`[CODE]` server.js:100-301 |

##### Bước 2: Phân hoạch tương đương (Equivalence Partitioning)
Phân hoạch thành **23 lớp tương đương** (`EC01` đến `EC23`) bao quát phân quyền và xác thực:

| Mã EC | Biến / Ngữ cảnh | Mô tả lớp tương đương | Hợp lệ / Không hợp lệ | Quy tắc phân hoạch |
| :---: | :--- | :--- | :---: | :--- |
| **EC01** | `Authorization` | Header hợp lệ (`Bearer <valid_token>`) | **Valid** | Must be: valid format & signature |
| **EC02** | `Authorization` | Thiếu hoàn toàn header trong HTTP request | Invalid | Missing: header omitted |
| **EC03** | `Authorization` | Header rỗng `""` hoặc chỉ có chuỗi `"Bearer "` | Invalid | Empty: empty token value |
| **EC04** | `Authorization` | Sai tiền tố (thiếu tiền tố `"Bearer "`) | Invalid | Must be: invalid prefix |
| **EC05** | `Authorization` | Token sai chữ ký HMAC Secret (Signature Mismatch) | Invalid | Must be: invalid signature |
| **EC06** | `Authorization` | Chuỗi token hỏng cú pháp (Malformed Token) | Invalid | Type/Format: malformed JWT |
| **EC07** | `token_role` | Quyền Quản trị viên (`role: 'admin'`) | **Valid** | Set of values: admin role |
| **EC08** | `token_role` | Quyền Người dùng thường (`role: 'user'`) | Invalid (Admin APIs) | Set of values: user role |
| **EC09** | `token_role` | Role ngoài danh mục (`guest`, `moderator`, `null`) | Invalid | Set of values: unknown role |
| **EC10** | `target_endpoint`| Truy cập API quản trị người dùng (`/api/admin/users`) | Valid (Admin) / Invalid (User) | Split class: Admin User group |
| **EC11** | `target_endpoint`| Truy cập API quản trị đơn hàng (`/api/admin/orders`) | Valid (Admin) / Invalid (User) | Split class: Admin Order group |
| **EC12** | `target_endpoint`| Tạo danh mục quản trị (`POST /api/categories`) | Valid (Admin) / Invalid (User) | Split class: Category group |
| **EC13** | `target_endpoint`| Tạo sản phẩm (`POST /api/products`) | Valid (Admin) / Invalid (Guest) | Split class: Product group |
| **EC14** | `target_endpoint`| Tạo mã giảm giá coupon (`POST /api/coupons`) | Valid (Admin) / Invalid (User) | Split class: Coupon group |
| **EC15** | `target_endpoint`| Xem/sửa hồ sơ chính mình (`/api/users/me`) | **Valid (Mọi user)** | Split class: Self Profile group |
| **EC16** | `token_exp_state`| Token còn thời hạn hiệu lực (`exp > now`) | **Valid State** | Range: valid time window |
| **EC17** | `token_exp_state`| Token đã hết hạn (`exp <= now`) | Invalid State | Range: expired time window |
| **EC18** | `privilege_state`| User gửi payload chứa `role: 'admin'` vào `PUT /api/users/me` | Invalid State Mutation | Security Boundary: Mass Assignment |
| **EC19** | `Response.status`| HTTP 200 OK / 201 Created | **Valid Output** | Normal success response |
| **EC20** | `Response.status`| HTTP 401 Unauthorized (thiếu hoặc token rỗng) | Invalid Output | Authentication failure |
| **EC21** | `Response.status`| HTTP 403 Forbidden (sai quyền, token hết hạn, sai chữ ký) | Invalid Output | Authorization failure |
| **EC22** | `Response.status`| HTTP 400 Bad Request (lỗi payload/mass assignment) | Invalid Output | Client error response |
| **EC23** | `Response.status`| HTTP 404 Not Found (tài nguyên không tồn tại) | Invalid Output | Not found response |

##### Bước 3 & 4: Thiết kế bộ test case tối thiểu và Ma trận bao phủ 100%
Thiết kế bộ **18 ca kiểm thử miền tối thiểu** (`FR12-DT-01` đến `FR12-DT-18`):
- `FR12-DT-01`: Baseline Valid kết hợp tối đa các lớp Valid (`EC01, EC07, EC10, EC16, EC19`).
- `FR12-DT-02` đến `FR12-DT-06`: Kiểm tra đơn lập lỗi cấu trúc Authorization Header (thiếu, rỗng, sai tiền tố, sai chữ ký, malformed token).
- `FR12-DT-07` đến `FR12-DT-09`: Kiểm tra người dùng thường và vai trò không xác định truy cập API quản trị người dùng.
- `FR12-DT-10` đến `FR12-DT-11`: Kiểm tra truy cập hồ sơ chính mình và phát hiện lỗ hổng leo quyền Mass Assignment.
- `FR12-DT-12` đến `FR12-DT-18`: Kiểm tra chéo phân quyền trên các nhóm Category, Order, Product và Coupon APIs.
- **Độ bao phủ:** Đạt **100% độ bao phủ** cho 23/23 lớp tương đương đã phân hoạch.

---

#### 3.5.3 Phân tích giá trị biên (Boundary Value Analysis - BVA)

##### Bước 1: Xác định các miền có thứ tự
- **Biến có thứ tự áp dụng BVA:**
  1. `token.exp`: Thời hạn JWT token dạng Unix timestamp (giây). So sánh tương đối với `now = Math.floor(Date.now() / 1000)`.
  2. `param.id`: Tham số số nguyên định danh tài nguyên trên các endpoint xóa (`DELETE /api/admin/coupons/:id`).
  3. `product.price`: Thuộc tính số tiền trên endpoint tạo sản phẩm `POST /api/products`.
- **Biến không áp dụng BVA:**
  - `role`, `Authorization header prefix`, `JWT signature`: Miền rời rạc (Discrete Set/Enum) hoặc chuỗi mã hóa mật mã học, không có quan hệ thứ tự liên tục.

##### Bước 2: Xác định điểm biên (3-value BVA + Mô hình 9 điểm + Biên mã hóa UTF-8)
- **`token.exp`:** Biên so sánh $now$. Các điểm kiểm thử: $exp = now - 1$ (vừa hết hạn 1s), $exp = now$ (hết hạn tại điểm biên), $exp = now + 1$ (còn hạn 1s), $exp = now + 3600$ (danh định), $exp = now + 10\text{ năm}$ (cực trị tương lai).
- **`param.id`:** Biên số nguyên dương $[1, 2147483647]$. Các điểm kiểm thử: $LB-1 = 0$, $LB = 1$, $LB+1 = 2$, $UB = 2147483647$ (Max 32-bit INT), Extreme âm = $-1$. *(Áp dụng quy tắc v2.2 Test Fixture Immutability: sử dụng endpoint coupon để không phá hủy tài khoản Admin/User mồi cốt lõi)*.
- **`product.price`:** Miền giá sản phẩm hợp lệ $[1, +\infty)$. Các điểm kiểm thử: Extreme âm = $-1$, $LB-1 = 0$, $LB = 1$, Cực trị dương = $999,999,999$.

##### Bước 3: Danh sách 14 ca kiểm thử BVA

| Mã Test Case | Biến kiểm thử | Giá trị biên cụ thể | Ý nghĩa kỹ thuật | Lỗi code sẽ bắt được | Kết quả mong đợi |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `FR12-BVA-01` | `token.exp` | `exp = now - 1` | $LB-1$ thời gian | Lỗi dùng toán tử so sánh `>` thay vì `>=` | HTTP 403 |
| `FR12-BVA-02` | `token.exp` | `exp = now` | $LB$ thời gian | Chấp nhận token hết hạn tại đúng giây 0 | HTTP 403 |
| `FR12-BVA-03` | `token.exp` | `exp = now + 1` | $LB+1$ thời gian | Từ chối nhầm token còn hạn 1 giây | HTTP 200 |
| `FR12-BVA-04` | `token.exp` | `exp = now + 3600` | Nominal | Token danh định 1 giờ | HTTP 200 |
| `FR12-BVA-05` | `token.exp` | `exp = now + 10 năm` | Max Extreme | Lỗi tràn số nguyên timestamp 32-bit (Y2038) | HTTP 200 |
| `FR12-BVA-06` | `param.id` | `id = 0` | $LB-1$ số nguyên | Chấp nhận ID phi lý bằng 0 | HTTP 404 |
| `FR12-BVA-07` | `param.id` | `id = 1` | $LB$ biên hợp lệ | Lỗi từ chối ID nhỏ nhất | HTTP 200 / 404 |
| `FR12-BVA-08` | `param.id` | `id = 2` | $LB+1$ | Lỗi lệch 1 đơn vị cận dưới | HTTP 200 / 404 |
| `FR12-BVA-09` | `param.id` | `id = 2147483647` | $UB$ Max INT | Tràn bộ đệm kiểu dữ liệu integer | HTTP 404 |
| `FR12-BVA-10` | `param.id` | `id = -1` | Min Extreme | Không kiểm tra số nguyên âm | HTTP 404 |
| `FR12-BVA-11` | `product.price` | `price = -1` (Guest) | Min Extreme | Khách tạo sản phẩm với giá âm | HTTP 401 |
| `FR12-BVA-12` | `product.price` | `price = 0` (Guest) | $LB-1$ | Khách tạo sản phẩm với giá 0 đồng | HTTP 401 |
| `FR12-BVA-13` | `product.price` | `price = 1` (Guest) | $LB$ | Khách tạo sản phẩm giá 1 đồng | HTTP 401 |
| `FR12-BVA-14` | `product.price` | `price = 999999999` (Guest) | Max Extreme | Khách tạo sản phẩm giá cực hạn | HTTP 401 |

---

#### 3.5.4 Kết quả thực thi kiểm thử chi tiết

Toàn bộ 32 test cases (18 DT + 14 BVA) đã được thực thi tự động qua test runner `run_cases.mjs` đối chiếu trực tiếp với SUT Backend:
- **Tổng số thiết kế (Designed):** 32
- **Đã thực thi (Executed):** 32 (100%)
- **Thành công (PASS):** 21
- **Thất bại (FAIL):** 11
- **Bị chặn (BLOCKED):** 0

*Tóm tắt kết quả thực thi 11 ca FAIL:*
- **5 ca FAIL do Middleware thiếu kiểm tra vai trò Admin (Broken Access Control):** `FR12-DT-07`, `FR12-DT-08`, `FR12-DT-13`, `FR12-DT-15`, `FR12-DT-18`. Người dùng thường gửi request đến các API quản trị nhận HTTP 200/201 thay vì 403 Forbidden.
- **5 ca FAIL do Route sản phẩm bỏ quên xác thực (Missing Authentication):** `FR12-DT-16`, `FR12-BVA-11`, `FR12-BVA-12`, `FR12-BVA-13`, `FR12-BVA-14`. Khách vãng lai gửi request tạo sản phẩm nhận HTTP 201 Created thay vì bị chặn bằng 401 Unauthorized.
- **1 ca FAIL do Lỗ hổng Mass Assignment leo quyền:** `FR12-DT-11`. Người dùng gửi `PUT /api/users/me` với payload `role: 'admin'`, server trả về HTTP 200 OK và cập nhật quyền admin vào DB.

Minh chứng thực thi được lưu tại: [HW2/evidence/FR-12/test-execution.log](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-12/test-execution.log).

---

#### 3.5.5 Báo cáo lỗi phần mềm (Defect Triage)

11 ca kiểm thử thất bại được phân loại nguyên nhân gốc rễ thành **3 khiếm khuyết phần mềm**:

| Mã lỗi (Bug ID) | Tiêu đề lỗi | Test Cases phát hiện | Mức độ (Severity) | Độ ưu tiên |
| :--- | :--- | :--- | :---: | :---: |
| **BUG-FR12-01** | Backend middleware `authenticateToken` không kiểm tra vai trò admin và các route quản trị thiếu role check | 5 TCs (`FR12-DT-07, 08, 13, 15, 18`) | **Critical** | Immediate |
| **BUG-FR12-02** | Endpoint quản lý sản phẩm `POST /api/products`, `PUT/DELETE` bỏ quên middleware `authenticateToken` | 5 TCs (`FR12-DT-16, FR12-BVA-11..14`) | **Critical** | Immediate |
| **BUG-FR12-03** | Lỗ hổng gán tham số hàng loạt (Mass Assignment) tại `PUT /api/users/me` cho phép user tự nâng quyền thành Admin | `FR12-DT-11` | **High** | High |

Chi tiết báo cáo lỗi: [bugs.vi.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/bugs.vi.md) và các dự thảo GitHub Issues tại `HW2/report/issues/BUG-FR12-*.md`.

---

#### 3.5.6 Phân tích khoảng trống của AI (AI Gap Analysis & Nâng cấp v2.2)

Quá trình kiểm thử FR-12 đã làm bộc lộ 4 khoảng trống AI quan trọng, dẫn đến việc tiếp tục nâng cấp bộ kỹ năng lên **phiên bản v2.2**:

| Mục bị bỏ sót / Thách thức thực tế | Cách phát hiện | Vì sao AI bỏ sót ban đầu | Phân loại nguyên nhân (Category) | Hành động cải tiến Skill (v2.1 → v2.2) |
| :--- | :--- | :--- | :--- | :--- |
| **1. Nhầm lẫn giữa Xác thực (Authentication) và Phân quyền (Authorization)** | Thấy `authenticateToken` ở các route admin và nghĩ rằng đã được bảo vệ đầy đủ; khi chạy test thì user thường vẫn vào được 200 OK | AI bị thiên kiến ngữ nghĩa (Semantic Bias): nhìn thấy hàm mang tên "authenticate" kèm JWT thì giả định nó kiểm tra cả quyền hạn (admin vs user) | `Tool limitation` & `Inherent feature complexity` | Nâng cấp `domain-testing` và `test-execution-and-bugs` với quy tắc **Authorization vs Authentication Separation Rule**: luôn kiểm tra sự hiện diện của lệnh so khớp vai trò (`req.user.role === 'admin'`) độc lập với việc verify JWT signature. |
| **2. Nguy cơ phá hủy dữ liệu mồi cốt lõi (Destructive Test Fixture Mutation)** | Khi viết BVA cho `DELETE /api/admin/users/:id`, nếu xóa ID=1 hoặc ID=2 thì mất tài khoản Admin/User, làm gãy toàn bộ bộ test cho các lần chạy sau | AI có xu hướng áp dụng các giá trị biên danh định (1, 2) một cách cơ học mà không đánh giá tác động phụ (side effect) lên dữ liệu mồi cố định trong cơ sở dữ liệu | `Inherent feature complexity` | Bổ sung quy tắc **Test Fixture Immutability & Re-runnability Rule**: tuyệt đối không dùng ID của tài khoản test cố định cho các ca kiểm thử xóa phá hủy; chuyển mục tiêu sang các thực thể tạm thời độc lập (như coupons). |
| **3. Bỏ sót lỗ hổng leo quyền Mass Assignment ở endpoint thông thường** | Soát mã nguồn `PUT /api/users/me` thấy bóc tách biến `role` từ `req.body` đưa vào câu lệnh SQL UPDATE | Khi được giao kiểm thử FR-12 (Kiểm soát truy cập), AI có xu hướng chỉ nhìn vào các endpoint có tiền tố `/api/admin/*`, bỏ qua các endpoint thông thường của người dùng | `Prompt/input quality` & `Inherent feature complexity` | Bổ sung **Cross-Feature Privilege Escalation Audit Checklist** vào Stage 0: rà soát tất cả các endpoint cho phép cập nhật dữ liệu người dùng xem có nguy cơ over-posting/mass assignment ảnh hưởng tới trường `role` hay không. |
| **4. Lệch pha chuỗi thông báo phản hồi của SUT (SUT Specific Response String Matching)** | `POST /api/categories` trả về `{ "message": "Category created" }` nhưng spec ghi `"Category added successfully"`, khiến runner đánh giá BLOCKED giả tạo | AI ban đầu gán kỳ vọng theo ví dụ trong tài liệu đặc tả thay vì đối chiếu trực tiếp với chuỗi string thực tế trong mã nguồn backend | `Prompt/input quality` | Bổ sung quy tắc **SUT Exact String Alignment Rule**: đối chiếu chính xác chuỗi message trong route handler của mã nguồn trước khi sinh tệp JSON máy đọc, ưu tiên xác thực theo mã HTTP status và các trường cấu trúc cốt lõi thay vì chuỗi văn bản tự do. |

---

#### 3.5.7 Hạn chế của kỹ thuật
1. **Bản chất nhị phân / rời rạc của Kiểm soát truy cập:** Phân quyền hệ thống (Authorization) chủ yếu vận hành dựa trên các thuộc tính rời rạc (Role: `admin` vs `user` vs `unauthenticated`) và các quyết định nhị phân (Cho phép / Từ chối). Kỹ thuật BVA vốn thiết kế cho các miền biến thiên liên tục có thứ tự nên không phát huy được nhiều tác dụng trên các trường cốt lõi của Access Control, ngoại trừ các trường số phụ trợ (như timestamp `exp`, `price`, `id`).
2. **Lỗ hổng bắt nguồn từ tầng kiến trúc và Middleware:** Toàn bộ các lỗi nghiêm trọng nhất của FR-12 (`BUG-FR12-01`, `BUG-FR12-02`, `BUG-FR12-03`) xuất phát từ việc thiếu hụt middleware phân quyền hoặc thiết kế API lỏng lẻo (insecure design), không thể phát hiện nếu chỉ phân tích các điểm biên dữ liệu thông thường mà không có góc nhìn kiểm thử bảo mật chuyên sâu (Security Testing).
3. **Tính phụ thuộc ngữ cảnh người gọi (Caller Identity Context):** Cùng một request payload (ví dụ `GET /api/admin/users`) là hợp lệ nếu người gửi là Admin nhưng lại là hành vi xâm nhập bất hợp pháp nếu người gửi là User thường. Điều này đòi hỏi ma trận kiểm thử phải luôn gắn liền ngữ cảnh danh tính với từng ca kiểm thử.

---

### **3.6 Consolidated Bug Reports**

Hiện tại đã ghi nhận và phân loại tổng cộng **12 lỗi phần mềm** (5 lỗi từ tính năng FR-01, 4 lỗi từ tính năng FR-03, và 3 lỗi từ tính năng FR-12). Toàn bộ lỗi đều được xác thực trực tiếp qua code và HTTP runner:

| Mã lỗi (Bug ID) | Tiêu đề lỗi | Tính năng | Các TC phát hiện | Mức độ (Severity) | Độ ưu tiên | Trạng thái |
| :--- | :--- | :---: | :--- | :---: | :---: | :---: |
| **BUG-FR01-01** | Backend thiếu kiểm tra các trường bắt buộc (`name`, `email`, `password` rỗng vẫn tạo user) | FR-01 | FR01-DT-02, 03, 06, 07, 14, 15 | **Major** | **High** | Confirmed |
| **BUG-FR01-02** | Backend không kiểm tra định dạng email và kiểu dữ liệu (nhận boolean/số vẫn trả 200) | FR-01 | FR01-DT-04, 05, 08 | **Major** | **High** | Confirmed |
| **BUG-FR01-03** | Cho phép đăng ký tài khoản trùng lặp email do thiếu ràng buộc UNIQUE trong DB | FR-01 | FR01-DT-16 | **Critical** | **Immediate** | Confirmed |
| **BUG-FR01-04** | Backend không kiểm tra độ dài tối thiểu và tiêu chí độ phức tạp của mật khẩu | FR-01 | FR01-DT-09..13, FR01-BVA-07 | **Major** | **High** | Confirmed |
| **BUG-FR01-05** | Không có giới hạn cận trên cho độ dài họ tên và mật khẩu (nguy cơ DoS payload lớn) | FR-01 | FR01-BVA-05, 06, 12, 13 | **Minor** | **Medium** | Confirmed |
| **BUG-FR03-01** | Lộ mã OTP (`resetToken`) trong HTTP response body của `POST /api/forgot-password` | FR-03 | FR03-DT-01 | **Critical** | **Immediate** | Confirmed |
| **BUG-FR03-02** | Backend hoàn toàn không kiểm tra tính hợp lệ và độ phức tạp của `newPassword` | FR-03 | FR03-DT-16..22, FR03-BVA-01, 02, 08, 09 | **Critical** | **High** | Confirmed |
| **BUG-FR03-03** | Mã đặt lại mật khẩu không có thời hạn hết hạn (Token Never Expires do DB thiếu timestamp) | FR-03 | Khảo sát `database.js:58` | **Major** | **Medium** | Confirmed |
| **BUG-FR03-04** | Endpoint `POST /api/forgot-password` trả về HTTP 404 thay vì HTTP 400 khi email sai quy cách | FR-03 | FR03-DT-03..07 | **Minor** | **Low** | Confirmed |
| **BUG-FR12-01** | Backend middleware `authenticateToken` không kiểm tra vai trò admin và các route quản trị thiếu role check | FR-12 | FR12-DT-07, 08, 13, 15, 18 | **Critical** | **Immediate** | Confirmed |
| **BUG-FR12-02** | Endpoint quản lý sản phẩm `POST /api/products`, `PUT/DELETE` bỏ quên middleware `authenticateToken` | FR-12 | FR12-DT-16, FR12-BVA-11..14 | **Critical** | **Immediate** | Confirmed |
| **BUG-FR12-03** | Lỗ hổng gán tham số hàng loạt (Mass Assignment) tại `PUT /api/users/me` cho phép user tự nâng quyền thành Admin | FR-12 | FR12-DT-11 | **High** | **High** | Confirmed |

Xem chi tiết đầy đủ tại tài liệu tổng hợp [HW2/report/bugs.vi.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/bugs.vi.md) và các tệp dự thảo GitHub Issues tại [HW2/report/issues/](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/).

---

## 4. **Test Summary Report**

Bảng tổng hợp số liệu kiểm thử được kết xuất tự động từ công cụ `node .claude/skills/test-execution-and-bugs/scripts/summary.mjs HW2/testcases`:

| Feature | Designed | Executed | Passed | Failed | Blocked | Not executed |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **FR-01 (Account registration)** | 30 | 30 | 10 | 20 | 0 | 0 |
| **FR-03 (Forgot & Reset password)** | 37 | 37 | 21 | 16 | 0 | 0 |
| **FR-12 (Access control)** | 32 | 32 | 21 | 11 | 0 | 0 |
| **Tổng cộng (Total)** | **99** | **99** | **52** | **47** | **0** | **0** |

*Ghi chú: Toàn bộ 99 ca kiểm thử đã được thực thi 100% trên môi trường SUT thực tế. Không có ca kiểm thử nào bị chặn (Blocked = 0).*

---

## 5. **Mandatory Appendix A — AI Audit Report**

*(Sẽ được kết xuất từ `HW2/audit/audit-log.jsonl` sau khi hoàn thành toàn bộ bài tập)*

---

## 6. **Mandatory Appendix B — AI Critique (200–300 words)**

*(Sẽ được hoàn thiện ở cuối bài dựa trên toàn bộ nhật ký AI Gap Analysis)*

---

## 7. **Git Commit Log**

*(Sẽ được xuất bằng lệnh `git log` ra file text trước khi nộp bài)*