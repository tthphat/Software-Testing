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
| **BUG-FR12-01** | Backend middleware `authenticateToken` không kiểm tra vai trò admin và các route quản trị (`/api/admin/users`, `/api/admin/orders`, `/api/categories`, `/api/coupons`) thiếu role check dẫn đến người dùng thường truy cập và thực thi trái phép (Broken Access Control) | FR-12 | FR12-DT-07, 08, 13, 15, 18 | **Critical** | **Immediate** | Confirmed (Đã xác minh qua code & API) |
| **BUG-FR12-02** | Endpoint quản lý sản phẩm `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` bỏ quên middleware `authenticateToken`, cho phép khách vãng lai (unauthenticated) tạo/sửa/xóa sản phẩm trái phép và bypass validation | FR-12 | FR12-DT-16, FR12-BVA-11, 12, 13, 14 | **Critical** | **Immediate** | Confirmed (Đã xác minh qua code & API) |
| **BUG-FR12-03** | Lỗ hổng gán tham số hàng loạt (Mass Assignment) tại `PUT /api/users/me` cho phép người dùng thường tự nâng quyền tài khoản thành Admin (`privilege escalation`) | FR-12 | FR12-DT-11 | **High** | **High** | Confirmed (Đã xác minh qua code & API) |

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


