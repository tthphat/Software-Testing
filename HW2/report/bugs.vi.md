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
