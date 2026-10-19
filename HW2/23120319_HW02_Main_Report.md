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
| **FR-03 — Forgot password and password reset** | Pool A | Quy trình 2 bước: yêu cầu đặt lại mật khẩu và gửi mã reset token/mật khẩu mới | Kế hoạch thực hiện |
| **FR-08 — Checkout** | Pool B | Điều kiện tiên quyết giỏ hàng, thông tin thanh toán, đặt đơn hàng và kiểm tra tính toán tổng tiền | Kế hoạch thực hiện |
| **FR-12 — Access control** | Pool C | Phân quyền vai trò Admin / Customer, kiểm soát truy cập các endpoint và giao diện quản trị | Kế hoạch thực hiện |

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

*(Phần này sẽ được thực hiện kế tiếp)*

---

### **3.4 FR-08 — Checkout**

*(Phần này sẽ được thực hiện kế tiếp)*

---

### **3.5 FR-12 — Access Control**

*(Phần này sẽ được thực hiện kế tiếp)*

---

### **3.6 Consolidated Bug Reports**

Hiện tại đã ghi nhận và phân loại tổng cộng **5 lỗi phần mềm** từ tính năng FR-01. Bảng tổng hợp toàn bộ lỗi của hệ thống sẽ được hoàn thiện sau khi hoàn thành toàn bộ 4 tính năng. Xem chi tiết tại [HW2/report/bugs.vi.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/bugs.vi.md).

---

## 4. **Test Summary Report**

*(Sẽ được tổng hợp tự động từ script `summary.mjs` sau khi hoàn thành cả 4 tính năng)*

---

## 5. **Mandatory Appendix A — AI Audit Report**

*(Sẽ được kết xuất từ `HW2/audit/audit-log.jsonl` sau khi hoàn thành toàn bộ bài tập)*

---

## 6. **Mandatory Appendix B — AI Critique (200–300 words)**

*(Sẽ được hoàn thiện ở cuối bài dựa trên toàn bộ nhật ký AI Gap Analysis)*

---

## 7. **Git Commit Log**

*(Sẽ được xuất bằng lệnh `git log` ra file text trước khi nộp bài)*