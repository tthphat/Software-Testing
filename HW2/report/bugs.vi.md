# Báo cáo tổng hợp lỗi phần mềm (Consolidated Bug Reports)

Tài liệu này tổng hợp toàn bộ các khiếm khuyết phần mềm (bugs/defects) được phát hiện trong quá trình thực thi kiểm thử trên hệ thống EShop SUT.

---

## Bảng tổng hợp lỗi (Bug Summary Table)

| Mã lỗi (Bug ID) | Tiêu đề lỗi | Tính năng | Các TC phát hiện | Mức độ (Severity) | Độ ưu tiên (Priority) | Trạng thái |
| :--- | :--- | :---: | :--- | :---: | :---: | :---: |
| **BUG-FR01-01** | Backend thiếu kiểm tra các trường bắt buộc (`name`, `email`, `password` rỗng hoặc bị thiếu vẫn tạo user thành công) | FR-01 | FR01-DT-02, 03, 06, 07, 14, 15 | **Major** | **High** | Confirmed (Đã xác minh qua code & API) |
| **BUG-FR01-02** | Backend không kiểm tra định dạng email và kiểu dữ liệu (email thiếu `@` hoặc nhận kiểu boolean/số vẫn trả về HTTP 200) | FR-01 | FR01-DT-04, 05, 08 | **Major** | **High** | Confirmed (Đã xác minh qua code & API) |
| **BUG-FR01-03** | Cho phép đăng ký tài khoản trùng lặp email do thiếu ràng buộc UNIQUE trong DB và không kiểm tra tồn tại ở API | FR-01 | FR01-DT-16 | **Critical** | **Immediate** | Confirmed (Đã xác minh qua code & API) |
| **BUG-FR01-04** | Backend không kiểm tra độ dài tối thiểu và các tiêu chí độ phức tạp của mật khẩu | FR-01 | FR01-DT-09, 10, 11, 12, 13, FR01-BVA-07 | **Major** | **High** | Confirmed (Đã xác minh qua code & API) |
| **BUG-FR01-05** | Không có giới hạn cận trên cho độ dài họ tên và mật khẩu (chấp nhận payload cực lớn mà không chặn) | FR-01 | FR01-BVA-05, 06, 12, 13 | **Minor** | **Medium** | Confirmed (Đã xác minh qua API) |
| **BUG-FR03-01** | Lộ mã OTP (`resetToken`) trong HTTP response body của `POST /api/forgot-password` dẫn đến chiếm đoạt tài khoản | FR-03 | FR03-DT-01 | **Critical** | **Immediate** | Confirmed (Đã xác minh qua code & API) |
| **BUG-FR03-02** | Backend hoàn toàn không kiểm tra tính hợp lệ và độ phức tạp của `newPassword` trên `POST /api/reset-password` | FR-03 | FR03-DT-16..22, FR03-BVA-01, 02, 08, 09 | **Critical** | **High** | Confirmed (Đã xác minh qua code & API) |
| **BUG-FR03-03** | Mã đặt lại mật khẩu không có thời hạn hết hạn (Token never expires do thiếu trường thời gian trong DB) | FR-03 | Code analysis database.js:58 & server.js | **Major** | **Medium** | Confirmed (Đã xác minh qua code) |
| **BUG-FR03-04** | Endpoint `POST /api/forgot-password` trả về HTTP 404 Not Found thay vì HTTP 400 Bad Request khi email không hợp lệ | FR-03 | FR03-DT-03..07 | **Minor** | **Low** | Confirmed (Đã xác minh qua code & API) |
| **BUG-FR08-01** | Backend hoàn toàn thiếu validation cho trường `total_amount` (chấp nhận tiền âm, 0đ, chuỗi, boolean, float, null, tràn số int32) | FR-08 | FR08-DT-06..13, FR08-BVA-01, 02, 07, 08 | **Critical** | **Immediate** | Confirmed (Đã xác minh qua code & API) |
| **BUG-FR08-02** | Lỗ hổng Parameter Tampering: Backend không tính lại tổng tiền từ giỏ hàng; Frontend Web cung cấp ô input tự sửa tiền thanh toán | FR-08 | FR08-DT-08 | **Critical** | **Immediate** | Confirmed (Đã xác minh qua code & API) |
| **BUG-FR08-03** | Backend thiếu validation `shipping_address`; Frontend Web và Mobile không có ô nhập địa chỉ giao hàng | FR-08 | FR08-DT-14..18, FR08-BVA-09, 10, 16, 17 | **Major** | **High** | Confirmed (Đã xác minh qua code & API) |
| **BUG-FR08-04** | Backend không kiểm tra trạng thái giỏ hàng khi checkout (Cho phép đặt đơn hàng ma khi giỏ rỗng `cart = []`) | FR-08 | FR08-DT-19, FR08-BVA-18 | **Major** | **High** | Confirmed (Đã xác minh qua code & API) |
| **BUG-FR08-05** | Dị biệt logic nghiêm trọng trên Mobile: Frontend Mobile tự ý cắt xén sản phẩm cuối cùng trong giỏ hàng khi checkout (`cart.slice(0, -1)`) | FR-08 | FR08-DT-22, FR08-BVA-20 | **Critical** | **Immediate** | Confirmed (Đã xác minh qua code & API) |
| **BUG-FR08-06** | Backend không kiểm tra tồn kho (Overselling Defect) và không lưu chi tiết các mặt hàng trong đơn hàng (`order_items`) | FR-08 | FR08-DT-20 | **Major** | **High** | Confirmed (Đã xác minh qua code & API) |
| **BUG-FR08-07** | Endpoint checkout không kiểm tra tính hợp lệ của mã giảm giá `coupon_id` | FR-08 | FR08-DT-21 | **Minor** | **Medium** | Confirmed (Đã xác minh qua code & API) |
| **BUG-FR12-01** | Backend middleware `authenticateToken` không kiểm tra vai trò admin và các route quản trị (/api/admin/users, /api/admin/orders, /api/categories, /api/coupons) thiếu role check dẫn đến người dùng thường truy cập và thực thi trái phép (Broken Access Control) | FR-12 | FR12-DT-07, 08, 13, 15, 18 | **Critical** | **Immediate** | Confirmed (Đã xác minh qua code & API) |
| **BUG-FR12-02** | Endpoint quản lý sản phẩm POST /api/products, PUT /api/products/:id, DELETE /api/products/:id bỏ quên middleware `authenticateToken`, cho phép khách vãng lai (unauthenticated) tạo/sửa/xóa sản phẩm trái phép và bypass validation | FR-12 | FR12-DT-16, FR12-BVA-11, 12, 13, 14 | **Critical** | **Immediate** | Confirmed (Đã xác minh qua code & API) |
| **BUG-FR12-03** | Lỗ hổng gán tham số hàng loạt (Mass Assignment) tại PUT /api/users/me cho phép người dùng thường tự nâng quyền tài khoản thành Admin (privilege escalation) | FR-12 | FR12-DT-11 | **High** | **High** | Confirmed (Đã xác minh qua code & API) |
| **BUG-FR20-01** | Hàm logout() trong Mobile App không dọn dẹp giỏ hàng gây rò rỉ dữ liệu phiên giữa các người dùng (Cross-user Cart Retention / Session Bleed) | FR-20 | FR20-DT-18 | **High** | **High** | Confirmed (Đã xác minh qua code Mobile & UI) |
| **BUG-FR20-02** | API POST /api/login trả về mật khẩu người dùng dạng plaintext trong response JSON (Sensitive Data Exposure) | FR-20 | FR20-DT-16 | **Critical** | **Immediate** | Confirmed (Đã xác minh qua code & API) |
| **BUG-FR20-03** | Cơ chế tính số lần đăng nhập sai cộng dồn bước nhảy 2 khiến tài khoản bị khóa bất thường chỉ sau 2 lần sai (Premature Account Lockout) | FR-20 | FR20-DT-14, FR20-BVA-13 | **Medium** | **Medium** | Confirmed (Đã xác minh qua code & API) |
| **BUG-FR20-04** | Giao diện đăng nhập Mobile App sử dụng nhãn tiếng Anh không đồng nhất và đặt vị trí thông báo lỗi sai chuẩn UI/UX | FR-20 | FR20-DT-19 | **Low** | **Low** | Confirmed (Đã xác minh qua Mobile UI) |

---

## Chi tiết từng báo cáo lỗi

### BUG-FR01-01: Backend thiếu kiểm tra các trường bắt buộc khi đăng ký tài khoản

| Mục | Nội dung |
|---|---|
| **Tính năng** | FR-01 – Đăng ký tài khoản (Account Registration) |
| **Test cases liên quan** | `FR01-DT-02`, `FR01-DT-03`, `FR01-DT-06`, `FR01-DT-07`, `FR01-DT-14`, `FR01-DT-15` |
| **Mức độ (Severity)** | **Major** (Lỗi nghiêm trọng làm sai lệch dữ liệu toàn vẹn) |
| **Độ ưu tiên (Priority)** | **High** |
| **Khả năng tái hiện** | Luôn luôn (100%) |
| **Môi trường** | Windows 11, Node.js v20.x, SQLite3, Base URL `http://localhost:3000` |
| **Ngày phát hiện** | 2026-10-18 |

#### 1. Điều kiện tiên quyết
- Backend API đang chạy tại `http://localhost:3000`.

#### 2. Các bước tái hiện
1. Gửi request `POST /api/register` với body thiếu trường `name` hoặc `name` là chuỗi rỗng:
   ```json
   {
     "name": "",
     "email": "test_empty_name@domain.com",
     "password": "Password123!"
   }
   ```
2. Quan sát HTTP status và nội dung response trả về từ máy chủ.

#### 3. Request / Response thực tế từ Test Runner
```http
POST /api/register HTTP/1.1
Content-Type: application/json

{
  "name": "",
  "email": "user_17739097230002@domain.com",
  "password": "Password123!"
}

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": "User registered successfully",
  "id": 14
}
```

#### 4. Kết quả mong đợi vs Kết quả thực tế
- **Kết quả mong đợi:** Máy chủ phải từ chối request với mã lỗi HTTP 400 Bad Request hoặc 422 Unprocessable Entity kèm thông báo yêu cầu bắt buộc nhập đầy đủ các trường `[SPEC: api_specification.md:14-16]`.
- **Kết quả thực tế:** Máy chủ trả về HTTP 200 OK, tạo thành công bản ghi người dùng rỗng trong database.

#### 5. Phân tích nguyên nhân (Root Cause Analysis)
- Tại `eshop-sut/backend/server.js:20-30`:
  ```javascript
  app.post("/api/register", (req, res) => {
    const { name, email, password } = req.body;
    db.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password],
      function (err) { ... }
    );
  });
  ```
  Hàm xử lý không hề có câu lệnh kiểm tra `if (!name || !email || !password)` mà thực hiện chèn trực tiếp biến vào câu lệnh SQL. Đồng thời schema SQLite tại `database.js` không có ràng buộc `NOT NULL` cho các cột này.

---

### BUG-FR01-02: Backend không kiểm tra định dạng email và kiểu dữ liệu đầu vào

| Mục | Nội dung |
|---|---|
| **Tính năng** | FR-01 – Đăng ký tài khoản |
| **Test cases liên quan** | `FR01-DT-04`, `FR01-DT-05`, `FR01-DT-08` |
| **Mức độ (Severity)** | **Major** |
| **Độ ưu tiên (Priority)** | **High** |
| **Khả năng tái hiện** | Luôn luôn (100%) |
| **Môi trường** | Windows 11, Node.js v20.x, Base URL `http://localhost:3000` |
| **Ngày phát hiện** | 2026-10-18 |

#### 1. Điều kiện tiên quyết
- Backend API đang hoạt động.

#### 2. Các bước tái hiện
1. Gửi request `POST /api/register` với email không hợp lệ (ví dụ: thiếu ký tự `@`, chuỗi `invalid_email_domain.com`, hoặc truyền kiểu dữ liệu boolean `true`):
   ```json
   {
     "name": "Nguyen Van A",
     "email": "invalid_email_domain.com",
     "password": "Password123!"
   }
   ```
2. Quan sát kết quả phản hồi.

#### 3. Request / Response thực tế
```http
POST /api/register HTTP/1.1
Content-Type: application/json

{
  "name": "Nguyen Van A",
  "email": "invalid_email_domain.com",
  "password": "Password123!"
}

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": "User registered successfully",
  "id": 17
}
```

#### 4. Kết quả mong đợi vs Thực tế
- **Kết quả mong đợi:** HTTP 400 Bad Request, từ chối email sai định dạng `[SPEC: api_specification.md:15]`.
- **Kết quả thực tế:** HTTP 200 OK, tài khoản vẫn được tạo với chuỗi email rác.

#### 5. Phân tích nguyên nhân
- `backend/server.js:20-30` không sử dụng biểu thức chính quy (regex) để kiểm tra cú pháp email chuẩn RFC, cũng không xác thực kiểu dữ liệu (`typeof email === 'string'`).

---

### BUG-FR01-03: Cho phép đăng ký trùng lặp email do thiếu ràng buộc UNIQUE trong DB

| Mục | Nội dung |
|---|---|
| **Tính năng** | FR-01 – Đăng ký tài khoản |
| **Test cases liên quan** | `FR01-DT-16` |
| **Mức độ (Severity)** | **Critical** (Lỗ hổng bảo mật & lỗi toàn vẹn dữ liệu nghiêm trọng nhất) |
| **Độ ưu tiên (Priority)** | **Immediate** |
| **Khả năng tái hiện** | Luôn luôn (100%) |
| **Môi trường** | Windows 11, Node.js v20.x, SQLite3 |
| **Ngày phát hiện** | 2026-10-18 |

#### 1. Điều kiện tiên quyết
- Tài khoản `admin@eshop.com` đã tồn tại trong database (được tạo sẵn từ seed data).

#### 2. Các bước tái hiện
1. Gửi request `POST /api/register` đăng ký tài khoản mới với email `admin@eshop.com`:
   ```json
   {
     "name": "Admin Clone",
     "email": "admin@eshop.com",
     "password": "Password123!"
   }
   ```
2. Kiểm tra database và thử đăng nhập lại.

#### 3. Request / Response thực tế
```http
POST /api/register HTTP/1.1
Content-Type: application/json

{
  "name": "Nguyen Van A",
  "email": "admin@eshop.com",
  "password": "Password123!"
}

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": "User registered successfully",
  "id": 28
}
```

#### 4. Hậu quả & Đánh giá rủi ro
- Hệ thống cho phép nhiều tài khoản cùng mang một email. Khi người dùng đăng nhập bằng email `admin@eshop.com`, hàm `db.get("SELECT * FROM users WHERE email = ?")` tại `server.js:35` chỉ trả về bản ghi đầu tiên nó tìm thấy, dẫn đến xung đột dữ liệu nghiêm trọng và có thể chiếm quyền điều khiển tài khoản của người khác.
- **Nguyên nhân:** Bảng `users` trong `database.js:55` khai báo `email TEXT` mà thiếu từ khóa `UNIQUE`. Ngoài ra, trước khi INSERT, backend không có câu lệnh `SELECT id FROM users WHERE email = ?` để kiểm tra.

---

### BUG-FR01-04: Backend không kiểm tra độ dài và độ phức tạp của mật khẩu

| Mục | Nội dung |
|---|---|
| **Tính năng** | FR-01 – Đăng ký tài khoản |
| **Test cases liên quan** | `FR01-DT-09`, `10`, `11`, `12`, `13`, `FR01-BVA-07` |
| **Mức độ (Severity)** | **Major** |
| **Độ ưu tiên (Priority)** | **High** |
| **Khả năng tái hiện** | Luôn luôn (100%) |
| **Môi trường** | Windows 11, Node.js v20.x |
| **Ngày phát hiện** | 2026-10-18 |

#### 1. Mô tả chi tiết
- Theo đặc tả và thông báo trên giao diện Web/Mobile, mật khẩu phải có độ dài tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt `[CODE: Register.jsx:15, App.js:212]`.
- Tuy nhiên, API `POST /api/register` chấp nhận mọi mật khẩu: mật khẩu 7 ký tự (`"Pass1!a"`), mật khẩu chỉ có chữ thường (`"password123!"`), hoặc mật khẩu 1 ký tự.

#### 2. Request / Response thực tế (`FR01-BVA-07` - Password dài 7 ký tự)
```http
POST /api/register HTTP/1.1
Content-Type: application/json

{
  "name": "Nguyen Van A",
  "email": "user_17739097230025@domain.com",
  "password": "Pass1!a"
}

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": "User registered successfully",
  "id": 35
}
```

#### 3. Phân tích nguyên nhân
- Lập trình viên chỉ cài đặt regex kiểm tra mật khẩu ở Client (Frontend React/React Native) mà bỏ quên hoàn toàn việc xác thực ở Backend API. Kẻ tấn công có thể bỏ qua giao diện web bằng cách gọi thẳng API bằng curl/Postman để tạo tài khoản có mật khẩu cực yếu.
- *Lưu ý thêm:* Client Web (`Register.jsx:15`) còn có một bug nghiêm trọng khác khi regex `flawedStrongPasswordRegex` đòi hỏi khoảng trắng `\s` thay vì ký tự đặc biệt.

---

### BUG-FR01-05: Thiếu giới hạn độ dài tối đa cho trường họ tên và mật khẩu (Nguy cơ DoS)

| Mục | Nội dung |
|---|---|
| **Tính năng** | FR-01 – Đăng ký tài khoản |
| **Test cases liên quan** | `FR01-BVA-05`, `FR01-BVA-06`, `FR01-BVA-12`, `FR01-BVA-13` |
| **Mức độ (Severity)** | **Minor** |
| **Độ ưu tiên (Priority)** | **Medium** |
| **Khả năng tái hiện** | Luôn luôn (100%) |
| **Môi trường** | Windows 11, Node.js v20.x |
| **Ngày phát hiện** | 2026-10-18 |

#### 1. Mô tả chi tiết
- Khi gửi request với `name` độ dài 101 ký tự (`FR01-BVA-05`), 1.000 ký tự (`FR01-BVA-06`), hoặc `password` 1.000 ký tự (`FR01-BVA-13`), máy chủ vẫn tiếp nhận và lưu toàn bộ chuỗi cực lớn này vào database mà không trả về lỗi 400 hay 413 Payload Too Large.
- Việc lưu trữ mật khẩu có độ dài không giới hạn có thể dẫn đến tấn công cạn kiệt CPU (CPU Exhaustion DoS) khi hệ thống tính toán hàm băm mật khẩu trong tương lai.

---

### BUG-FR03-01: Lộ mã xác nhận `resetToken` (OTP) trong HTTP Response Body

| Mục | Nội dung |
|---|---|
| **Tính năng** | FR-03 – Quên mật khẩu và Đặt lại mật khẩu (Forgot & Reset Password) |
| **Test cases liên quan** | `FR03-DT-01` |
| **Mức độ (Severity)** | **Critical** (Lỗ hổng bảo mật nghiêm trọng dẫn đến chiếm đoạt tài khoản - Account Takeover) |
| **Độ ưu tiên (Priority)** | **Immediate** |
| **Khả năng tái hiện** | Luôn luôn (100%) |
| **Môi trường** | Windows 11, Node.js v20.x, SQLite3, Base URL `http://localhost:3000` |
| **Ngày phát hiện** | 2026-10-19 |

#### 1. Mô tả chi tiết
- Endpoint `POST /api/forgot-password` sinh mã ngẫu nhiên 4 chữ số nhưng thay vì gửi qua email hoặc SMS cho chủ sở hữu tài khoản, máy chủ lại trả thẳng giá trị `resetToken` trong thân phản hồi HTTP JSON `[CODE: server.js:77]`.
- Bất kỳ ai chỉ cần biết email của nạn nhân là có thể gửi request và nhận ngay mã OTP để đặt lại mật khẩu, chiếm đoạt hoàn toàn tài khoản (CWE-200: Information Disclosure, CWE-640: Weak Password Recovery Mechanism).

#### 2. Request / Response thực tế từ Test Runner
```http
POST /api/forgot-password HTTP/1.1
Content-Type: application/json

{
  "email": "test@eshop.com"
}

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": "Mã đặt lại mật khẩu đã được tạo",
  "resetToken": "9818"
}
```

#### 3. Kết quả mong đợi vs Kết quả thực tế
- **Kết quả mong đợi:** Mã OTP/reset token phải được giữ bí mật, gửi qua kênh bảo mật ngoại tuyến (Email/SMS). Response API chỉ được trả thông báo trung tính như `{"message": "Mã đặt lại mật khẩu đã được gửi đến email của bạn"}` và tuyệt đối không chứa `resetToken`.
- **Kết quả thực tế:** Response chứa trường `"resetToken": "9818"`.

#### 4. Phân tích nguyên nhân
- Tại `eshop-sut/backend/server.js:72-78`:
  ```javascript
  const resetToken = Math.floor(1000 + Math.random() * 9000).toString();
  db.run('UPDATE users SET reset_token = ? WHERE email = ?', [resetToken, email], (err) => {
      // ...
      res.json({ message: 'Mã đặt lại mật khẩu đã được tạo', resetToken });
  });
  ```
  Developer trả thẳng biến `resetToken` vào đối tượng JSON phản hồi cho client.

---

### BUG-FR03-02: Backend hoàn toàn không kiểm tra tính hợp lệ và độ phức tạp của `newPassword` khi đặt lại mật khẩu

| Mục | Nội dung |
|---|---|
| **Tính năng** | FR-03 – Quên mật khẩu và Đặt lại mật khẩu |
| **Test cases liên quan** | `FR03-DT-16`, `FR03-DT-17`, `FR03-DT-18`, `FR03-DT-19`, `FR03-DT-20`, `FR03-DT-21`, `FR03-DT-22`, `FR03-BVA-01`, `FR03-BVA-02`, `FR03-BVA-08`, `FR03-BVA-09` (11 test cases) |
| **Mức độ (Severity)** | **Critical** (Phá vỡ chính sách an toàn mật khẩu - CWE-521: Weak Password Requirements) |
| **Độ ưu tiên (Priority)** | **High** |
| **Khả năng tái hiện** | Luôn luôn (100%) |
| **Môi trường** | Windows 11, Node.js v20.x, Base URL `http://localhost:3000` |
| **Ngày phát hiện** | 2026-10-19 |

#### 1. Mô tả chi tiết
- API `POST /api/reset-password` không có bất kỳ dòng code nào kiểm tra `newPassword`. Người dùng có thể đặt mật khẩu rỗng `""`, mật khẩu 1 ký tự, mật khẩu chỉ chứa chữ thường, hoặc payload cực lớn 10,000 ký tự. Hệ thống vẫn băm mật khẩu và cập nhật vào DB, trả về HTTP 200 OK.
- Trong khi đó, tài liệu API `[SPEC: api_specification.md:38-40]` yêu cầu trả về HTTP 400 Bad Request cho dữ liệu không hợp lệ, và giao diện Web/Mobile đều có thông báo yêu cầu mật khẩu tối thiểu 8 ký tự kèm chữ hoa, thường, số, ký tự đặc biệt.

#### 2. Request / Response thực tế từ Test Runner (`FR03-DT-16` - Password `Pass1!`)
```http
POST /api/reset-password HTTP/1.1
Content-Type: application/json

{
  "email": "test@eshop.com",
  "resetToken": "9818",
  "newPassword": "Pass1!"
}

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": "Password reset successfully"
}
```

#### 3. Kết quả mong đợi vs Kết quả thực tế
- **Kết quả mong đợi:** HTTP 400 Bad Request kèm thông báo lỗi cụ thể khi mật khẩu không thỏa mãn chính sách (độ dài < 8 hoặc > 128, thiếu chữ hoa/thường/số/ký tự đặc biệt).
- **Kết quả thực tế:** HTTP 200 OK và mật khẩu yếu được lưu thành công.

#### 4. Phân tích nguyên nhân
- Tại `eshop-sut/backend/server.js:84-97`:
  ```javascript
  app.post('/api/reset-password', (req, res) => {
      const { email, resetToken, newPassword } = req.body;
      db.get('SELECT * FROM users WHERE email = ? AND reset_token = ?', [email, resetToken], (err, user) => {
          if (!user) {
              return res.status(400).json({ error: 'Invalid token or email' });
          }
          bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
              db.run('UPDATE users SET password = ?, reset_token = NULL WHERE id = ?', [hashedPassword, user.id], ...);
          });
      });
  });
  ```
  Sau khi kiểm tra `user` tồn tại khớp với `resetToken`, backend gọi thẳng `bcrypt.hash(newPassword)` mà không kiểm tra độ dài hoặc tính hợp lệ của `newPassword`.

---

### BUG-FR03-03: Mã đặt lại mật khẩu không có thời hạn hết hạn (Token Never Expires)

| Mục | Nội dung |
|---|---|
| **Tính năng** | FR-03 – Quên mật khẩu và Đặt lại mật khẩu |
| **Test cases liên quan** | Khảo sát mã nguồn SUT `database.js:58` và `server.js:68-98` |
| **Mức độ (Severity)** | **Major** (Lỗ hổng quản lý phiên/token - CWE-613: Insufficient Session Expiration) |
| **Độ ưu tiên (Priority)** | **Medium** |
| **Khả năng tái hiện** | Luôn luôn (100%) |
| **Môi trường** | Windows 11, Node.js v20.x, SQLite3 |
| **Ngày phát hiện** | 2026-10-19 |

#### 1. Mô tả chi tiết
- Trong bảng `users` (`database.js:58`), cột lưu trữ chỉ có `reset_token TEXT` mà không có cột lưu thời gian tạo (timestamp) hay thời điểm hết hạn (expires_at).
- Khi một mã OTP được tạo ra, mã này có hiệu lực vô thời hạn cho tới khi được dùng hoặc bị ghi đè bởi yêu cầu mới. Kẻ tấn công có thể sử dụng mã OTP cũ (nhiều ngày/tuần trước) để chiếm tài khoản bất cứ lúc nào nếu người dùng chưa kịp sử dụng.

#### 2. Phân tích nguyên nhân
- Schema cơ sở dữ liệu thiếu trường thời gian:
  ```sql
  CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      password TEXT,
      role TEXT DEFAULT 'user',
      reset_token TEXT
  )
  ```
- Backend không so sánh chênh lệch thời gian tạo token với thời điểm hiện tại (`Date.now() - tokenCreatedAt > EXPIRY_MS`).

---

### BUG-FR03-04: Endpoint `POST /api/forgot-password` trả về HTTP 404 Not Found thay vì HTTP 400 Bad Request khi email không hợp lệ

| Mục | Nội dung |
|---|---|
| **Tính năng** | FR-03 – Quên mật khẩu và Đặt lại mật khẩu |
| **Test cases liên quan** | `FR03-DT-03`, `FR03-DT-04`, `FR03-DT-05`, `FR03-DT-06`, `FR03-DT-07` (5 test cases) |
| **Mức độ (Severity)** | **Minor** (Inconsistent Error Status / Missing Request Validation) |
| **Độ ưu tiên (Priority)** | **Low** |
| **Khả năng tái hiện** | Luôn luôn (100%) |
| **Môi trường** | Windows 11, Node.js v20.x, Base URL `http://localhost:3000` |
| **Ngày phát hiện** | 2026-10-19 |

#### 1. Mô tả chi tiết
- Khi client gửi request `POST /api/forgot-password` với dữ liệu email không hợp lệ (chuỗi rỗng `""`, thiếu trường `email`, thiếu `@`, thiếu domain, hoặc kiểu dữ liệu Boolean `true`), backend không xác thực tính hợp lệ của request payload mà đưa trực tiếp vào câu lệnh truy vấn cơ sở dữ liệu `SELECT * FROM users WHERE email = ?`.
- Do không tìm thấy bản ghi nào khớp với giá trị rỗng/không hợp lệ này, backend trả về `HTTP 404 Not Found` (`{"error": "User not found"}`) thay vì `HTTP 400 Bad Request` `[SPEC: api_specification.md:38-40]`.

#### 2. Request / Response thực tế từ Test Runner (`FR03-DT-03` - Email rỗng)
```http
POST /api/forgot-password HTTP/1.1
Content-Type: application/json

{
  "email": ""
}

HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8

{
  "error": "User not found"
}
```

#### 3. Kết quả mong đợi vs Kết quả thực tế
- **Kết quả mong đợi:** HTTP 400 Bad Request vì request payload sai quy cách / thiếu dữ liệu bắt buộc.
- **Kết quả thực tế:** HTTP 404 Not Found.

#### 4. Phân tích nguyên nhân
- Tại `eshop-sut/backend/server.js:68-71`:
  ```javascript
  app.post('/api/forgot-password', (req, res) => {
      const { email } = req.body;
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
          if (!user) {
              return res.status(404).json({ error: 'User not found' });
          }
          // ...
      });
  });
  ```
  Thiếu bước kiểm tra định dạng và tính bắt buộc: `if (!email || typeof email !== 'string' || !isValidEmail(email)) return res.status(400)...` trước khi truy vấn database.

---

### BUG-FR08-01: Backend hoàn toàn thiếu validation cho trường `total_amount` khi checkout

| Mục | Nội dung |
|---|---|
| **Tính năng** | FR-08 – Đặt hàng và Thanh toán (Checkout) |
| **Test cases liên quan** | `FR08-DT-06` đến `FR08-DT-13`, `FR08-BVA-01`, `02`, `07`, `08` (11 test cases) |
| **Mức độ (Severity)** | **Critical** (Lỗ hổng xử lý số tiền / Tiền âm / Tràn số nguyên) |
| **Độ ưu tiên (Priority)** | **Immediate** |
| **Khả năng tái hiện** | Luôn luôn (100%) |
| **Môi trường** | Windows 11, Node.js v20.x, SQLite3, Base URL `http://localhost:3000` |
| **Ngày phát hiện** | 2026-10-19 |

#### 1. Mô tả chi tiết
Khi người dùng gửi yêu cầu đặt hàng qua endpoint `POST /api/checkout`, máy chủ Backend hoàn toàn không kiểm tra tính hợp lệ của trường `total_amount`. Hệ thống chấp nhận bất kỳ giá trị bất thường nào: số tiền âm (`-50,000` VNĐ làm đảo chiều dòng tiền), số tiền bằng `0` VNĐ (mua hàng miễn phí trái phép), chuỗi (`"free"`), kiểu boolean (`true`), giá trị `null`, số thực không nguyên (`199999.5`), hoặc các số cực lớn gây tràn số nguyên 32-bit trong SQLite (`2,147,483,648`). Mọi request sai trái trên đều được Backend ghi vào cơ sở dữ liệu và trả về `HTTP 200 OK` thay vì từ chối bằng `HTTP 400 Bad Request`.

#### 2. Request / Response thực tế từ Test Runner (`FR08-DT-07` - Số tiền âm)
```http
POST /api/checkout HTTP/1.1
Authorization: Bearer <valid_token>
Content-Type: application/json

{
  "total_amount": -50000,
  "shipping_address": "123 Le Loi, Phuong Ben Nghe, Quan 1, TP.HCM"
}

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": "Checkout successful",
  "orderId": 4
}
```

#### 3. Kết quả mong đợi vs Kết quả thực tế
- **Kết quả mong đợi:** HTTP 400 Bad Request, từ chối giao dịch.
- **Kết quả thực tế:** HTTP 200 OK, đơn hàng tạo thành công với `total_amount = -50000`.

#### 4. Phân tích nguyên nhân
Tại `eshop-sut/backend/server.js:299-304`:
```javascript
const { total_amount, shipping_address } = req.body;
db.run(
  "INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES (?, ?, ?, ?)",
  [userId, total_amount, "pending", shipping_address],
  ...
);
```
Thiếu câu lệnh kiểm tra: `if (typeof total_amount !== 'number' || total_amount <= 0 || !Number.isInteger(total_amount)) return res.status(400)...`

---

### BUG-FR08-02: Lỗ hổng Parameter Tampering: Backend không tính lại tổng tiền từ giỏ hàng, Web cho phép user tự sửa giá

| Mục | Nội dung |
|---|---|
| **Tính năng** | FR-08 – Đặt hàng và Thanh toán (Checkout) |
| **Test cases liên quan** | `FR08-DT-08` (1 test case) |
| **Mức độ (Severity)** | **Critical** (Price Manipulation / Parameter Tampering) |
| **Độ ưu tiên (Priority)** | **Immediate** |
| **Khả năng tái hiện** | Luôn luôn (100%) |
| **Môi trường** | Web UI `Checkout.jsx`, Backend `server.js` |
| **Ngày phát hiện** | 2026-10-19 |

#### 1. Mô tả chi tiết
1. **Phía Backend (`server.js:299`):** Khi người dùng gọi `POST /api/checkout`, máy chủ tin tưởng 100% giá trị `total_amount` gửi lên từ client mà không truy vấn lại giỏ hàng của người dùng (`userCarts[userId]`) hay bảng `products` để tính lại tổng tiền thực tế.
2. **Phía Frontend Web (`Checkout.jsx:93-102`):** Trên giao diện thanh toán, ô hiển thị tổng tiền lại là một thẻ `<input type="number">` ở trạng thái mở cho phép sửa tự do (`editableTotal`). Người dùng có thể tự xóa số tiền 200,000 VNĐ và gõ 1,000 VNĐ rồi bấm thanh toán thành công.

#### 2. Request / Response thực tế từ Test Runner (`FR08-DT-08`)
```http
POST /api/checkout HTTP/1.1
Authorization: Bearer <valid_token>
Content-Type: application/json

{
  "total_amount": 10000,
  "shipping_address": "123 Le Loi, Phuong Ben Nghe, Quan 1, TP.HCM"
}

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": "Checkout successful",
  "orderId": 5
}
```

#### 3. Kết quả mong đợi vs Kết quả thực tế
- **Kết quả mong đợi:** HTTP 400 Bad Request ("Số tiền không khớp với giỏ hàng").
- **Kết quả thực tế:** HTTP 200 OK, đơn hàng tạo với giá trị bị sửa đổi 10,000 VNĐ.

#### 4. Phân tích nguyên nhân
Backend không tự động tính tổng tiền từ giỏ hàng: $\text{ExpectedTotal} = \sum (\text{item.price} \times \text{item.quantity}) - \text{Discount}$. Ô input trên Web UI không có thuộc tính `readOnly`.

---

### BUG-FR08-03: Backend thiếu validation `shipping_address`; Web và Mobile không có ô nhập địa chỉ

| Mục | Nội dung |
|---|---|
| **Tính năng** | FR-08 – Đặt hàng và Thanh toán (Checkout) |
| **Test cases liên quan** | `FR08-DT-14` đến `18`, `FR08-BVA-09`, `10`, `16`, `17` (9 test cases) |
| **Mức độ (Severity)** | **Major** (Missing Required Field / Cross-Platform Spec Mismatch) |
| **Độ ưu tiên (Priority)** | **High** |
| **Khả năng tái hiện** | Luôn luôn (100%) |
| **Môi trường** | Web UI, Mobile App, Backend API |
| **Ngày phát hiện** | 2026-10-19 |

#### 1. Mô tả chi tiết
1. **Tại Backend (`server.js:299`):** Trường `shipping_address` là thông tin bắt buộc để giao hàng. Backend không kiểm tra trường này, chấp nhận chuỗi rỗng `""`, khoảng trắng `"   "`, sai kiểu (Number `12345`), và chuỗi payload siêu lớn (10,000 ký tự DoS). Khi client không gửi trường này, máy chủ lưu `NULL` vào DB và trả về HTTP 200 OK.
2. **Tại Web & Mobile:** Giao diện Web (`Checkout.jsx`) và ứng dụng Mobile (`App.js`) hoàn toàn không có ô nhập địa chỉ cho người dùng và không gửi field này lên API, khiến 100% đơn hàng thực tế đều bị `NULL` địa chỉ giao hàng.

#### 2. Request / Response thực tế từ Test Runner (`FR08-DT-16` - Thiếu field)
```http
POST /api/checkout HTTP/1.1
Authorization: Bearer <valid_token>
Content-Type: application/json

{
  "total_amount": 200000
}

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": "Checkout successful",
  "orderId": 13
}
```

#### 3. Kết quả mong đợi vs Kết quả thực tế
- **Kết quả mong đợi:** HTTP 400 Bad Request ("Địa chỉ giao hàng không được để trống").
- **Kết quả thực tế:** HTTP 200 OK, đơn hàng tạo với `shipping_address = NULL`.

---

### BUG-FR08-04: Backend không kiểm tra giỏ hàng khi checkout (Cho phép đặt đơn hàng ma khi giỏ rỗng)

| Mục | Nội dung |
|---|---|
| **Tính năng** | FR-08 – Đặt hàng và Thanh toán (Checkout) |
| **Test cases liên quan** | `FR08-DT-19`, `FR08-BVA-18` (2 test cases) |
| **Mức độ (Severity)** | **Major** (Business Logic Defect / Cart Lifecycle) |
| **Độ ưu tiên (Priority)** | **High** |
| **Khả năng tái hiện** | Luôn luôn (100%) |
| **Môi trường** | Backend API `server.js` |
| **Ngày phát hiện** | 2026-10-19 |

#### 1. Mô tả chi tiết
1. **Đặt đơn hàng ma:** Backend không kiểm tra xem giỏ hàng của người dùng (`userCarts[userId]`) có sản phẩm nào không. Một user vừa tạo tài khoản, giỏ rỗng 0 món, vẫn có thể gọi API checkout tạo đơn hàng thành công.
2. **Không dọn giỏ hàng:** Sau khi checkout thành công, backend không xóa `userCarts[userId]`, và Frontend Web cũng không gọi `clearCart()`, khiến các món đã mua vẫn nằm lại trong giỏ hàng.

#### 2. Request / Response thực tế từ Test Runner (`FR08-DT-19`)
```http
POST /api/checkout HTTP/1.1
Authorization: Bearer <valid_token>
Content-Type: application/json

{
  "total_amount": 200000,
  "shipping_address": "123 Le Loi, Phuong Ben Nghe, Quan 1, TP.HCM"
}

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": "Checkout successful",
  "orderId": 16
}
```

#### 3. Kết quả mong đợi vs Kết quả thực tế
- **Kết quả mong đợi:** HTTP 400 Bad Request ("Giỏ hàng rỗng, không thể thanh toán").
- **Kết quả thực tế:** HTTP 200 OK, đơn hàng ma được tạo trong DB.

---

### BUG-FR08-05: Frontend Mobile tự ý cắt xén sản phẩm cuối cùng trong giỏ hàng khi checkout (`cart.slice(0, -1)`)

| Mục | Nội dung |
|---|---|
| **Tính năng** | FR-08 – Đặt hàng và Thanh toán (Checkout) |
| **Test cases liên quan** | `FR08-DT-22`, `FR08-BVA-20` (2 test cases) |
| **Mức độ (Severity)** | **Critical** (Client-side Data Tampering Defect) |
| **Độ ưu tiên (Priority)** | **Immediate** |
| **Khả năng tái hiện** | Luôn luôn (100% trên Mobile) |
| **Môi trường** | Frontend Mobile `App.js:391` |
| **Ngày phát hiện** | 2026-10-19 |

#### 1. Mô tả chi tiết
Trên ứng dụng di động Mobile (`eshop-sut/frontend-mobile/App.js:391`), trong hàm `handleCheckout`, mã nguồn tồn tại logic cố ý cắt bỏ phần tử cuối cùng của mảng giỏ hàng:
```javascript
items: cart.length > 1 ? cart.slice(0, -1) : cart
```
Khi khách hàng mua từ 2 sản phẩm trở lên, sản phẩm cuối cùng sẽ bị loại bỏ khỏi danh sách gửi lên máy chủ. Khách hàng trả tiền cả 2 sản phẩm nhưng chỉ nhận được 1 sản phẩm.

#### 2. Phân tích code
Tại `App.js:384-395`:
```javascript
await fetch(`${API_URL}/checkout`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  body: JSON.stringify({
    items: cart.length > 1 ? cart.slice(0, -1) : cart,
    total_amount: finalAmount,
    coupon_id: couponResult?.coupon_id || null,
  }),
});
```

#### 3. Kết quả mong đợi vs Kết quả thực tế
- **Kết quả mong đợi:** Gửi nguyên vẹn mảng `items: cart`.
- **Kết quả thực tế:** Bị cắt bớt sản phẩm cuối cùng do `cart.slice(0, -1)`.

---

### BUG-FR08-06: Backend không kiểm tra tồn kho (Overselling Defect) và DB không lưu chi tiết đơn hàng (`order_items`)

| Mục | Nội dung |
|---|---|
| **Tính năng** | FR-08 – Đặt hàng và Thanh toán (Checkout) |
| **Test cases liên quan** | `FR08-DT-20` (1 test case) |
| **Mức độ (Severity)** | **Major** (Inventory Integrity & Architectural Defect) |
| **Độ ưu tiên (Priority)** | **High** |
| **Khả năng tái hiện** | Luôn luôn (100%) |
| **Môi trường** | Backend `server.js`, Database `database.js` |
| **Ngày phát hiện** | 2026-10-19 |

#### 1. Mô tả chi tiết
1. **Lỗi bán vượt tồn kho (Overselling):** Backend không kiểm tra số lượng tồn kho `product.stock` trong DB. Người dùng đặt số lượng lớn hơn tồn kho vẫn được phê duyệt và tồn kho không bị giảm trừ.
2. **Thiếu bảng `order_items`:** Cơ sở dữ liệu SQLite chỉ có bảng `orders`, hoàn toàn không có bảng hay cột nào lưu danh sách các sản phẩm của đơn hàng. Cả khách hàng và người quản trị đều không thể biết đơn hàng gồm những món nào.

#### 2. Phân tích code
Tại `server.js:301-308`: Chỉ có lệnh `INSERT INTO orders` với tổng tiền, không có `UPDATE products SET stock = stock - ?` và không lưu chi tiết món hàng.

---

### BUG-FR08-07: Endpoint checkout không kiểm tra tính hợp lệ của mã giảm giá `coupon_id`

| Mục | Nội dung |
|---|---|
| **Tính năng** | FR-08 – Đặt hàng và Thanh toán (Checkout) |
| **Test cases liên quan** | `FR08-DT-21` (1 test case) |
| **Mức độ (Severity)** | **Minor** (Business Logic Defect) |
| **Độ ưu tiên (Priority)** | **Medium** |
| **Khả năng tái hiện** | Luôn luôn (100%) |
| **Môi trường** | Backend `server.js` |
| **Ngày phát hiện** | 2026-10-19 |

#### 1. Mô tả chi tiết
Endpoint `POST /api/checkout` nhận trường `coupon_id` nhưng không kiểm tra lại trong bảng `coupons` xem mã coupon có tồn tại, còn hạn sử dụng, hoặc vượt số lượt dùng tối đa hay không. Kẻ gian có thể áp dụng mã tùy ý hoặc giảm giá bất hợp pháp mà máy chủ không xác thực đối chiếu.

---

### BUG-FR12-01: Backend middleware `authenticateToken` không kiểm tra vai trò admin và các route quản trị thiếu role check

| Mục | Nội dung |
|---|---|
| **Tính năng** | FR-12 – Kiểm soát truy cập (Access Control) |
| **Test cases liên quan** | `FR12-DT-07`, `FR12-DT-08`, `FR12-DT-13`, `FR12-DT-15`, `FR12-DT-18` (5 test cases) |
| **Mức độ (Severity)** | **Critical** (Broken Access Control / BOLA - Toàn bộ chức năng quản trị bị người dùng thường xâm nhập) |
| **Độ ưu tiên (Priority)** | **Immediate** |
| **Khả năng tái hiện** | Luôn luôn (100%) |
| **Môi trường** | Windows 11, Node.js v20.x, SQLite3, Base URL `http://localhost:3000` |
| **Ngày phát hiện** | 2026-10-19 |

#### 1. Mô tả chi tiết
- Theo đặc tả kiến trúc bảo mật và `api_specification.md` (mục 6. Phân quyền và Bảo mật), các endpoint thuộc nhóm Quản trị viên (`/api/admin/users`, `/api/admin/orders`, `/api/categories`, `/api/coupons`) chỉ được phép truy cập bởi tài khoản có quyền `admin` (`role === 'admin'`). Người dùng thường (`role === 'user'`) khi gửi token truy cập các tài nguyên này phải bị từ chối với mã lỗi HTTP 403 Forbidden.
- Tuy nhiên trong mã nguồn SUT, middleware `authenticateToken` (`server.js:100-110`) chỉ giải mã JWT và gán `req.user = user` mà không kiểm tra trường `role`. Đồng thời, tất cả các controller/route handler quản trị (`GET /api/admin/users`, `DELETE /api/admin/users/:id`, `GET /api/admin/orders`, `POST /api/categories`, `POST /api/coupons`, v.v.) hoàn toàn không có bất kỳ dòng lệnh nào kiểm tra `if (req.user.role !== 'admin') return res.status(403)...`.
- Hậu quả: Bất kỳ người dùng thường nào sau khi đăng nhập đều có thể xem danh sách toàn bộ người dùng, xóa người dùng khác, đổi trạng thái đơn hàng, tạo/xóa danh mục và mã giảm giá coupon tùy ý (HTTP 200 OK thay vì 403 Forbidden).

#### 2. Request / Response thực tế từ Test Runner (`FR12-DT-07` - User thường gọi GET /api/admin/users)
```http
GET /api/admin/users HTTP/1.1
Authorization: Bearer <regular_user_jwt_token>

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
  {
    "id": 1,
    "name": "Admin",
    "email": "admin@eshop.com",
    "role": "admin"
  },
  {
    "id": 2,
    "name": "Test User",
    "email": "test@eshop.com",
    "role": "user"
  }
]
```

#### 3. Kết quả mong đợi vs Kết quả thực tế
- **Kết quả mong đợi:** HTTP 403 Forbidden kèm body `{ "error": "Access denied" }` hoặc `{ "message": "Admin privileges required" }` `[SPEC: api_specification.md:120-128]`.
- **Kết quả thực tế:** HTTP 200 OK, trả về toàn bộ danh sách người dùng trong cơ sở dữ liệu.

#### 4. Phân tích nguyên nhân & Mã nguồn liên quan
- Tại `eshop-sut/backend/server.js:100-110`:
  ```javascript
  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access token required' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ error: 'Invalid or expired token' });
      req.user = user;
      next(); // Chỉ xác thực định danh (Authentication), hoàn toàn thiếu phân quyền (Authorization)
    });
  };
  ```
- Tại các route admin (`server.js:231-301`):
  ```javascript
  app.get('/api/admin/users', authenticateToken, (req, res) => {
    db.all('SELECT id, name, email, role FROM users', [], (err, rows) => { ... });
  });
  ```
  Không có middleware kiểm tra role quản trị như `requireAdmin = (req, res, next) => { if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' }); next(); }`.
- Phân loại lỗi theo CWE: CWE-285 (Improper Authorization), CWE-862 (Missing Authorization), OWASP A01:2021-Broken Access Control.

---

### BUG-FR12-02: Endpoint quản lý sản phẩm `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` bỏ quên middleware `authenticateToken`

| Mục | Nội dung |
|---|---|
| **Tính năng** | FR-12 – Kiểm soát truy cập (Access Control) & FR-04 (Product Management) |
| **Test cases liên quan** | `FR12-DT-16`, `FR12-BVA-11`, `FR12-BVA-12`, `FR12-BVA-13`, `FR12-BVA-14` (5 test cases) |
| **Mức độ (Severity)** | **Critical** (Missing Authentication for Critical Function - Bất kỳ ai ngoài Internet đều có thể tạo/sửa/xóa kho hàng) |
| **Độ ưu tiên (Priority)** | **Immediate** |
| **Khả năng tái hiện** | Luôn luôn (100%) |
| **Môi trường** | Windows 11, Node.js v20.x, SQLite3, Base URL `http://localhost:3000` |
| **Ngày phát hiện** | 2026-10-19 |

#### 1. Mô tả chi tiết
- Theo đặc tả hệ thống `api_specification.md` (mục 3. Quản lý sản phẩm), thao tác tạo sản phẩm mới (`POST /api/products`), sửa sản phẩm (`PUT /api/products/:id`) và xóa sản phẩm (`DELETE /api/products/:id`) là các thao tác quản trị viên bắt buộc phải có Authorization header chứa Bearer Token của tài khoản Admin. Khách vãng lai (unauthenticated/guest) khi gọi các API này phải bị chặn với mã lỗi HTTP 401 Unauthorized.
- Trong mã nguồn `eshop-sut/backend/server.js:167`, các route này hoàn toàn được khai báo công khai mà không gắn middleware `authenticateToken`.
- Hậu quả: Bất kỳ ai không cần đăng nhập hay có token đều có thể gửi request tạo sản phẩm mới với giá trị bất kỳ (thậm chí giá âm, giá 0 đồng, tồn kho âm), hoặc xóa sạch toàn bộ sản phẩm khỏi kho hàng của hệ thống EShop.

#### 2. Request / Response thực tế từ Test Runner (`FR12-DT-16` - Unauthenticated POST /api/products)
```http
POST /api/products HTTP/1.1
Content-Type: application/json

{
  "name": "Unauthenticated Product",
  "price": 100,
  "stock": 10,
  "category_id": 1
}

HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  "message": "Product created",
  "id": 11
}
```

#### 3. Kết quả mong đợi vs Kết quả thực tế
- **Kết quả mong đợi:** HTTP 401 Unauthorized (`{ "error": "Access token required" }`) `[SPEC: api_specification.md:60-64]`.
- **Kết quả thực tế:** HTTP 201 Created, sản phẩm được lưu trực tiếp vào cơ sở dữ liệu mà không cần xác thực người gửi.

#### 4. Phân tích nguyên nhân & Mã nguồn liên quan
- Tại `eshop-sut/backend/server.js:167`:
  ```javascript
  app.post('/api/products', (req, res) => { // THIẾU authenticateToken VÀ requireAdmin
    const { name, description, price, stock, category_id, image_url } = req.body;
    db.run(
      'INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, stock, category_id, image_url],
      function (err) { ... }
    );
  });
  ```
- Các route `PUT /api/products/:id` (`server.js:180`) và `DELETE /api/products/:id` (`server.js:192`) cũng mắc lỗi tương tự.
- Phân loại lỗi theo CWE: CWE-306 (Missing Authentication for Critical Function), OWASP A01:2021-Broken Access Control.

---

### BUG-FR12-03: Lỗ hổng gán tham số hàng loạt (Mass Assignment) tại `PUT /api/users/me` cho phép người dùng tự nâng quyền thành Admin

| Mục | Nội dung |
|---|---|
| **Tính năng** | FR-12 – Kiểm soát truy cập (Access Control) |
| **Test cases liên quan** | `FR12-DT-11` (1 test case) |
| **Mức độ (Severity)** | **High** (Privilege Escalation via Mass Assignment) |
| **Độ ưu tiên (Priority)** | **High** |
| **Khả năng tái hiện** | Luôn luôn (100%) |
| **Môi trường** | Windows 11, Node.js v20.x, SQLite3, Base URL `http://localhost:3000` |
| **Ngày phát hiện** | 2026-10-19 |

#### 1. Mô tả chi tiết
- Endpoint `PUT /api/users/me` dùng để cho phép người dùng đăng nhập cập nhật thông tin hồ sơ của chính mình (như tên, mật khẩu, email).
- Tuy nhiên trong handler xử lý, backend nhận trực tiếp trường `role` từ request body và đưa thẳng vào câu lệnh SQL `UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?`.
- Hậu quả: Một người dùng thông thường (`role: 'user'`) chỉ cần gửi một request đơn giản với payload `{"role": "admin"}` là có thể tự cấp quyền quản trị viên tối cao cho tài khoản của mình mà không cần bất kỳ sự phê duyệt nào.

#### 2. Request / Response thực tế từ Test Runner (`FR12-DT-11` - User leo quyền thành admin)
```http
PUT /api/users/me HTTP/1.1
Authorization: Bearer <regular_user_jwt_token>
Content-Type: application/json

{
  "name": "Escalated User",
  "email": "test@eshop.com",
  "role": "admin"
}

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": "Profile updated successfully"
}
```
Sau đó khi gọi `GET /api/users/me`, trường `role` trong cơ sở dữ liệu đã biến thành `"admin"`.

#### 3. Kết quả mong đợi vs Kết quả thực tế
- **Kết quả mong đợi:** Máy chủ phải từ chối request với HTTP 400 Bad Request hoặc âm thầm bỏ qua (ignore/sanitize) trường `role`, chỉ cho phép người dùng sửa đổi các trường thông tin cá nhân được phép (`name`, `password`, `email`) `[SPEC: api_specification.md:28-32]`.
- **Kết quả thực tế:** Máy chủ trả về HTTP 200 OK và cập nhật trường `role = 'admin'` vào cơ sở dữ liệu.

#### 4. Phân tích nguyên nhân & Mã nguồn liên quan
- Tại `eshop-sut/backend/server.js:124-138`:
  ```javascript
  app.put('/api/users/me', authenticateToken, (req, res) => {
    const { name, email, password, role } = req.body; // Over-posting / Mass Assignment
    db.run(
      'UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?',
      [name, email, password, role, req.user.id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Profile updated successfully' });
      }
    );
  });
  ```
- Backend không áp dụng whitelist các trường được phép cập nhật bởi người dùng thông thường (`req.body` không được sanitize).
- Phân loại lỗi theo CWE: CWE-915 (Improperly Controlled Modification of Dynamically-Determined Object Attributes), CWE-269 (Improper Privilege Management), OWASP A04:2021-Insecure Design.

---

### BUG-FR20-01: Hàm logout() trong Mobile App không dọn dẹp giỏ hàng gây rò rỉ dữ liệu phiên giữa các người dùng (Cross-user Cart Retention / Session Bleed)

| Mục | Nội dung |
|---|---|
| **Tính năng** | FR-20 – Đăng nhập & Đăng xuất Mobile (Mobile Login & Logout) |
| **Test cases liên quan** | `FR20-DT-18` |
| **Mức độ (Severity)** | **High** |
| **Độ ưu tiên (Priority)** | **High** |
| **Khả năng tái hiện** | Luôn luôn (100%) |
| **Môi trường** | Expo Mobile Web / Android / iOS, Node.js v20.x, SQLite3, Base URL `http://localhost:3000` |
| **Ngày phát hiện** | 2026-10-20 |

#### 1. Mô tả lỗi (Description)
Khi người dùng thực hiện thao tác Đăng xuất (`logout`) trên ứng dụng Mobile, hàm xử lý chỉ xóa token xác thực (`setToken(null)`), thông tin người dùng (`setUser(null)`) và danh sách đơn hàng (`setOrders([])`), nhưng **hoàn toàn bỏ quên việc làm rỗng giỏ hàng** (không có lệnh `setCart([])`).

Hậu quả: Toàn bộ danh sách sản phẩm mà người dùng vừa đăng xuất đã thêm vào giỏ hàng vẫn tồn tại nguyên vẹn trong bộ nhớ trạng thái (React state) của ứng dụng. Khi một người dùng khác đăng nhập trên cùng thiết bị (hoặc người dùng mới lướt ứng dụng ở chế độ khách vãng lai), họ sẽ nhìn thấy toàn bộ giỏ hàng của người dùng trước, có thể xem được giá tiền, số lượng, điều chỉnh danh sách, và thậm chí tiến hành thanh toán với các mặt hàng đó. Đây là lỗi rò rỉ dữ liệu phiên nghiêm trọng (Session Bleed / Privacy Leak) trên thiết bị di động dùng chung.

#### 2. Các bước tái hiện (Steps to Reproduce)
1. Mở ứng dụng Mobile (`frontend-mobile/App.js`).
2. Đăng nhập với tài khoản `test@eshop.com`.
3. Duyệt danh sách sản phẩm và bấm "Thêm vào giỏ" cho 2 sản phẩm bất kỳ.
4. Chuyển sang tab Giỏ hàng để xác nhận có 2 sản phẩm trong giỏ.
5. Chuyển sang tab Tài khoản (Profile) và bấm nút "Đăng xuất" (`logout`).
6. Sau khi đăng xuất thành công và màn hình quay về Đăng nhập, đăng nhập bằng một tài khoản khác (hoặc quay lại màn hình Home xem giỏ hàng).

#### 3. Kết quả thực tế (Actual Result)
- Màn hình giỏ hàng vẫn lưu giữ nguyên vẹn 2 sản phẩm từ phiên đăng nhập của người dùng trước.
- Biến trạng thái `cart` trong React không bị reset về mảng rỗng `[]`.

#### 4. Kết quả mong đợi (Expected Result)
- Khi người dùng đăng xuất, toàn bộ dữ liệu phiên làm việc cục bộ phải bị tiêu hủy hoàn toàn.
- Hàm `logout()` phải gọi `setCart([])` để giỏ hàng trở về trạng thái rỗng cho phiên làm việc tiếp theo:
  ```javascript
  const logout = () => {
    setToken(null);
    setUser(null);
    setOrders([]);
    setCart([]); // Reset giỏ hàng
    setCurrentView('login');
  };
  ```

#### 5. Phân tích nguyên nhân & Code tham chiếu
- Tại `eshop-sut/frontend-mobile/App.js:161-169`:
  ```javascript
  const logout = () => {
    setToken(null);
    setUser(null);
    setOrders([]);
    // THIẾU: setCart([]);
    setCurrentView('login');
  };
  ```
- Phân loại lỗi bảo mật:
  - **CWE-459**: Incomplete Cleanup.
  - **CWE-200**: Exposure of Sensitive Information to an Unauthorized Actor.
  - **OWASP**: Mobile Top 10 - Insecure Data Storage & Client-Side Session Handling.

#### 6. Test cases liên quan
- `FR20-DT-18` (Mobile Logout: Kiểm tra dọn dẹp giỏ hàng khi người dùng có sản phẩm)

#### 7. Minh chứng thực tế (Evidence Screenshots)
- [UI-FR20-03-mobile-cart-items-before-logout.png](../evidence/FR-20/UI-FR20-03-mobile-cart-items-before-logout.png) (Giao diện giỏ hàng 2 sản phẩm trước khi đăng xuất)
- [UI-FR20-05-mobile-cart-retention-after-logout.png](../evidence/FR-20/UI-FR20-05-mobile-cart-retention-after-logout.png) (Minh chứng sau khi đăng xuất, thanh điều hướng báo "Đăng nhập" nhưng giỏ hàng vẫn tồn lưu nguyên 2 sản phẩm)

#### 8. Mức độ nghiêm trọng
- **Severity**: High
- **Priority**: High

---

### BUG-FR20-02: API POST /api/login trả về mật khẩu người dùng dạng plaintext trong response JSON (Sensitive Data Exposure)

| Mục | Nội dung |
|---|---|
| **Tính năng** | FR-20 – Đăng nhập & Đăng xuất Mobile (Mobile Login & Logout) |
| **Test cases liên quan** | `FR20-DT-16` |
| **Mức độ (Severity)** | **Critical** |
| **Độ ưu tiên (Priority)** | **Immediate** |
| **Khả năng tái hiện** | Luôn luôn (100%) |
| **Môi trường** | Expo Mobile Web / Android / iOS, Node.js v20.x, SQLite3, Base URL `http://localhost:3000` |
| **Ngày phát hiện** | 2026-10-20 |

#### 1. Mô tả lỗi (Description)
API xác thực đăng nhập `POST /api/login` thực hiện truy vấn bảng cơ sở dữ liệu `users` bằng câu lệnh `SELECT * FROM users WHERE email = ?`. Khi kiểm tra mật khẩu thành công, máy chủ trả về toàn bộ đối tượng bản ghi người dùng (`user`) trong body phản hồi JSON cho client mà không loại bỏ trường `password`.

Hậu quả: Mật khẩu nguyên bản của người dùng bị rò rỉ dưới dạng văn bản thuần (plaintext) qua đường truyền HTTP. Bất kỳ trung gian mạng nào (Man-in-the-Middle), proxy ghi log hệ thống, công cụ phân tích lưu lượng, hoặc phần mềm độc hại trên thiết bị người dùng đều có thể trích xuất trực tiếp mật khẩu gốc của tài khoản. Đây là vi phạm an toàn thông tin cấp độ đặc biệt nghiêm trọng.

#### 2. Các bước tái hiện (Steps to Reproduce)
1. Gửi HTTP POST request đến endpoint đăng nhập của máy chủ SUT:
   ```http
   POST /api/login HTTP/1.1
   Host: localhost:3000
   Content-Type: application/json

   {
     "email": "test@eshop.com",
     "password": "Password123!"
   }
   ```
2. Kiểm tra chuỗi phản hồi JSON nhận được từ máy chủ trong `response body`.

#### 3. Kết quả thực tế (Actual Result)
Máy chủ trả về HTTP 200 OK với trường `password` lộ rõ trong đối tượng `user`:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "name": "Test User",
    "email": "test@eshop.com",
    "password": "Password123!",
    "role": "user",
    "login_attempts": 0,
    "locked_until": null
  }
}
```

#### 4. Kết quả mong đợi (Expected Result)
- Máy chủ tuyệt đối không được tuần tự hóa (serialize) hoặc gửi trả trường `password` trong bất kỳ phản hồi API nào.
- Trường `password` phải được loại bỏ (destructure/strip) trước khi trả về:
  ```javascript
  const { password: _, ...safeUser } = user;
  res.json({ message: 'Login successful', token, user: safeUser });
  ```

#### 5. Phân tích nguyên nhân & Code tham chiếu
- Tại `eshop-sut/backend/server.js:34-52`:
  ```javascript
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    ...
    if (user.password !== password) {
      ...
    }
    ...
    res.json({ message: 'Login successful', token, user }); // Lộ user.password
  });
  ```
- Phân loại CWE / OWASP:
  - **CWE-200**: Exposure of Sensitive Information to an Unauthorized Actor.
  - **CWE-312**: Cleartext Storage/Transmission of Sensitive Information.
  - **OWASP Top 10:2021**: A02:2021 – Cryptographic Failures / A04:2021 – Insecure Design.

#### 6. Test cases liên quan
- `FR20-DT-16` (Kiểm tra bảo mật an toàn thông tin: Không rò rỉ mật khẩu trong phản hồi đăng nhập)

#### 8. Mức độ nghiêm trọng
- **Severity**: Critical
- **Priority**: Immediate

---

### BUG-FR20-03: Cơ chế tính số lần đăng nhập sai cộng dồn bước nhảy 2 khiến tài khoản bị khóa bất thường chỉ sau 2 lần sai (Premature Account Lockout)

| Mục | Nội dung |
|---|---|
| **Tính năng** | FR-20 – Đăng nhập & Đăng xuất Mobile (Mobile Login & Logout) |
| **Test cases liên quan** | `FR20-DT-14`, `FR20-BVA-13` |
| **Mức độ (Severity)** | **Medium** |
| **Độ ưu tiên (Priority)** | **Medium** |
| **Khả năng tái hiện** | Luôn luôn (100%) |
| **Môi trường** | Expo Mobile Web / Android / iOS, Node.js v20.x, SQLite3, Base URL `http://localhost:3000` |
| **Ngày phát hiện** | 2026-10-20 |

#### 1. Mô tả lỗi (Description)
Trong logic xử lý đăng nhập thất bại tại máy chủ SUT (`POST /api/login`), biến đếm số lần đăng nhập sai `login_attempts` được cộng dồn với bước nhảy là 2 (`+ 2`) thay vì 1 (`+ 1`).

Do ngưỡng kích hoạt khóa tài khoản được quy định là `newAttempts >= 3` với thời gian khóa 3 phút:
- Ban đầu: `login_attempts = 0`.
- Lần 1 gõ sai: `newAttempts = 0 + 2 = 2` (< 3, chưa khóa).
- Lần 2 gõ sai: `newAttempts = 2 + 2 = 4` (>= 3, hệ thống lập tức khóa tài khoản và thiết lập `locked_until` sang 3 phút sau).

Hậu quả: Người dùng hợp lệ chỉ cần nhập nhầm mật khẩu 2 lần liên tiếp là đã bị tước quyền đăng nhập vào hệ thống trong vòng 3 phút. Điều này phá vỡ tiêu chuẩn thiết kế tài liệu và trải nghiệm người dùng thông thường (vốn cho phép ít nhất 3 hoặc 5 lần nhập sai), dẫn đến tình trạng từ chối dịch vụ sớm (Denial of Service) và gây ức chế lớn cho khách hàng.

#### 2. Các bước tái hiện (Steps to Reproduce)
1. Đảm bảo tài khoản `test@eshop.com` đang ở trạng thái bình thường (`login_attempts = 0`, `locked_until = NULL`).
2. Gửi request đăng nhập thất bại lần 1 với mật khẩu sai:
   ```http
   POST /api/login HTTP/1.1
   Host: localhost:3000
   Content-Type: application/json

   { "email": "test@eshop.com", "password": "WrongPassword1!" }
   ```
   Server phản hồi HTTP 401. Kiểm tra database thấy `login_attempts = 2`.
3. Gửi tiếp request đăng nhập thất bại lần 2 với mật khẩu sai:
   ```http
   POST /api/login HTTP/1.1
   Host: localhost:3000
   Content-Type: application/json

   { "email": "test@eshop.com", "password": "WrongPassword2!" }
   ```
   Server phản hồi HTTP 401. Kiểm tra database thấy `login_attempts = 4` và trường `locked_until` đã bị kích hoạt.
4. Gửi request đăng nhập lần 3 với mật khẩu đúng chuẩn `Password123!`.

#### 3. Kết quả thực tế (Actual Result)
- Ở lần thứ 3, ngay cả khi người dùng cung cấp mật khẩu chính xác, máy chủ lập tức từ chối và phản hồi HTTP 403 Forbidden:
  ```json
  {
    "error": "Tài khoản đã bị khóa. Vui lòng thử lại sau."
  }
  ```
- Người dùng bị khóa ngay sau lần sai thứ 2.

#### 4. Kết quả mong đợi (Expected Result)
- Mỗi lần đăng nhập thất bại chỉ được cộng thêm 1 đơn vị vào số lần thử sai (`+ 1`):
  ```javascript
  const newAttempts = (user.login_attempts || 0) + 1;
  ```
- Với ngưỡng khóa tài khoản `>= 3`, hệ thống phải cho phép người dùng thử sai tối thiểu 3 lần liên tiếp (Lần 1: 1, Lần 2: 2, Lần 3: 3) và chỉ khóa ở lần vi phạm thứ 4 trở đi hoặc sau khi đạt đủ 3 lần vi phạm.

#### 5. Phân tích nguyên nhân & Code tham chiếu
- Tại `eshop-sut/backend/server.js:53-56`:
  ```javascript
  if (user.password !== password) {
    const newAttempts = (user.login_attempts || 0) + 2; // BUG: Bước nhảy sai + 2
    const lockedUntil = newAttempts >= 3 ? new Date(Date.now() + 3 * 60 * 1000).toISOString() : null;
    db.run('UPDATE users SET login_attempts = ?, locked_until = ? WHERE id = ?', [newAttempts, lockedUntil, user.id]);
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  ```
- Phân loại lỗi:
  - **CWE-840**: Business Logic Errors.
  - **CWE-400**: Uncontrolled Resource Consumption / Unintended Account Lockout DoS.

#### 6. Test cases liên quan
- `FR20-DT-14` (Kiểm tra cơ chế khóa tài khoản khi gõ sai lần thứ 2 liên tiếp)
- `FR20-BVA-13` (BVA Ngưỡng số lần gõ sai: Kiểm tra chuyển đổi trạng thái khi gõ sai lần 1 và lần 2)

#### 8. Mức độ nghiêm trọng
- **Severity**: Medium
- **Priority**: Medium

---

### BUG-FR20-04: Giao diện đăng nhập Mobile App sử dụng nhãn tiếng Anh không đồng nhất và đặt vị trí thông báo lỗi sai chuẩn UI/UX

| Mục | Nội dung |
|---|---|
| **Tính năng** | FR-20 – Đăng nhập & Đăng xuất Mobile (Mobile Login & Logout) |
| **Test cases liên quan** | `FR20-DT-19` |
| **Mức độ (Severity)** | **Low** |
| **Độ ưu tiên (Priority)** | **Low** |
| **Khả năng tái hiện** | Luôn luôn (100%) |
| **Môi trường** | Expo Mobile Web / Android / iOS, Node.js v20.x, SQLite3, Base URL `http://localhost:3000` |
| **Ngày phát hiện** | 2026-10-20 |

#### 1. Mô tả lỗi (Description)
Màn hình giao diện Đăng nhập trên ứng dụng Mobile Client (`frontend-mobile/App.js`) tồn tại ba điểm không tuân thủ quy chuẩn thiết kế giao diện (UI) và trải nghiệm người dùng (UX):
1. **Sai nhãn trường nhập liệu (Field Label Mismatch)**: Nhãn hiển thị là `"Username"` tại dòng 763, trong khi trường này nhận địa chỉ email (`loginEmail`, placeholder `"email@example.com"`) và toàn bộ luồng nghiệp vụ xác thực sử dụng email.
2. **Không nhất quán ngôn ngữ tiếng Việt (Linguistic Inconsistency)**: Nút bấm gửi form đăng nhập hiển thị chuỗi tiếng Anh `"Sign In"` tại dòng 783, vi phạm quy định thống nhất giao diện tiếng Việt xuyên suốt ứng dụng theo tiêu chuẩn FR-21.
3. **Vị trí thông báo lỗi không chuẩn (Bad Error Placement)**: Khung hiển thị thông báo lỗi đăng nhập (`errorBox`, dòng 790) được bố trí ở phía dưới nút bấm hành động Submit. Trên thiết bị di động, khi bàn phím ảo hiển thị hoặc màn hình nhỏ, thông báo lỗi đặt bên dưới nút sẽ bị đẩy ra ngoài tầm nhìn (viewport) hoặc bị bàn phím che khuất, khiến người dùng không biết lý do đăng nhập thất bại.

#### 2. Các bước tái hiện (Steps to Reproduce)
1. Khởi động ứng dụng Mobile Client (`npm start` trong thư mục `eshop-sut/frontend-mobile`).
2. Mở màn hình Đăng nhập (`renderLogin`).
3. Quan sát giao diện:
   - Đọc nhãn phía trên ô nhập email.
   - Đọc chữ hiển thị trên nút bấm đăng nhập.
4. Nhập sai thông tin đăng nhập và bấm nút để quan sát vị trí xuất hiện của khung báo lỗi đỏ.

#### 3. Kết quả thực tế (Actual Result)
- Nhãn hiển thị: `"Username"`.
- Nút bấm hiển thị: `"Sign In"`.
- Hộp thông báo lỗi đỏ nằm phía dưới nút bấm `"Sign In"`.

#### 4. Kết quả mong đợi (Expected Result)
- Nhãn trường nhập liệu phải là `"Email"` (hoặc `"Địa chỉ Email"`).
- Nút bấm hành động phải hiển thị tiếng Việt đồng nhất: `"Đăng nhập"`.
- Khung thông báo lỗi nên được đặt ở vị trí dễ quan sát: ở phía trên các trường nhập liệu hoặc nằm ngay phía trên nút bấm đăng nhập theo quy chuẩn Form UX (FR-22).

#### 5. Phân tích nguyên nhân & Code tham chiếu
- Tại `eshop-sut/frontend-mobile/App.js:762-794`:
  ```javascript
  // Dòng 763: Nhãn "Username" thay vì "Email"
  <Text style={styles.inputLabel}>Username</Text>
  <TextInput
    style={styles.input}
    placeholder="email@example.com"
    value={loginEmail}
    onChangeText={setLoginEmail}
    autoCapitalize="none"
    keyboardType="email-address"
  />

  // Dòng 783: Nhãn nút bấm "Sign In" tiếng Anh
  <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
    <Text style={styles.loginButtonText}>Sign In</Text>
  </TouchableOpacity>

  // Dòng 790: Hộp lỗi nằm dưới nút bấm
  {loginError ? (
    <View style={styles.errorBox}>
      <Text style={styles.errorBoxText}>{loginError}</Text>
    </View>
  ) : null}
  ```

#### 6. Test cases liên quan
- `FR20-DT-19` (Mobile UI: Kiểm tra nhãn trường Email và ngôn ngữ nút bấm theo chuẩn FR-21 tiếng Việt)

#### 7. Minh chứng thực tế (Evidence Screenshots)
- [UI-FR20-01-mobile-login-initial.png](../evidence/FR-20/UI-FR20-01-mobile-login-initial.png) (Giao diện đăng nhập ban đầu hiển thị nhãn "Username" và nút bấm "Sign In")
- [UI-FR20-02-mobile-login-error-below-button.png](../evidence/FR-20/UI-FR20-02-mobile-login-error-below-button.png) (Giao diện hiển thị hộp lỗi màu đỏ nằm phía dưới nút bấm Sign In)

#### 8. Mức độ nghiêm trọng
- **Severity**: Low
- **Priority**: Low

---

