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
