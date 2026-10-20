# [BUG] [FR-20] API POST /api/login trả về mật khẩu người dùng dạng plaintext trong response JSON (Sensitive Data Exposure)

## Mô tả lỗi (Description)
API xác thực đăng nhập `POST /api/login` thực hiện truy vấn bảng cơ sở dữ liệu `users` bằng câu lệnh `SELECT * FROM users WHERE email = ?`. Khi kiểm tra mật khẩu thành công, máy chủ trả về toàn bộ đối tượng bản ghi người dùng (`user`) trong body phản hồi JSON cho client mà không loại bỏ trường `password`.

Hậu quả: Mật khẩu nguyên bản của người dùng bị rò rỉ dưới dạng văn bản thuần (plaintext) qua đường truyền HTTP. Bất kỳ trung gian mạng nào (Man-in-the-Middle), proxy ghi log hệ thống, công cụ phân tích lưu lượng, hoặc phần mềm độc hại trên thiết bị người dùng đều có thể trích xuất trực tiếp mật khẩu gốc của tài khoản. Đây là vi phạm an toàn thông tin cấp độ đặc biệt nghiêm trọng.

## Các bước tái hiện (Steps to Reproduce)
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

## Kết quả thực tế (Actual Result)
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

## Kết quả mong đợi (Expected Result)
- Máy chủ tuyệt đối không được tuần tự hóa (serialize) hoặc gửi trả trường `password` trong bất kỳ phản hồi API nào.
- Trường `password` phải được loại bỏ (destructure/strip) trước khi trả về:
  ```javascript
  const { password: _, ...safeUser } = user;
  res.json({ message: 'Login successful', token, user: safeUser });
  ```

## Phân tích nguyên nhân & Code tham chiếu
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

## Test cases liên quan
- `FR20-DT-16` (Kiểm tra bảo mật an toàn thông tin: Không rò rỉ mật khẩu trong phản hồi đăng nhập)

## Mức độ nghiêm trọng
- **Severity**: Critical
- **Priority**: Immediate
