# [BUG] [FR-20] Cơ chế tính số lần đăng nhập sai cộng dồn bước nhảy 2 khiến tài khoản bị khóa bất thường chỉ sau 2 lần sai (Premature Account Lockout)

## Mô tả lỗi (Description)
Trong logic xử lý đăng nhập thất bại tại máy chủ SUT (`POST /api/login`), biến đếm số lần đăng nhập sai `login_attempts` được cộng dồn với bước nhảy là 2 (`+ 2`) thay vì 1 (`+ 1`).

Do ngưỡng kích hoạt khóa tài khoản được quy định là `newAttempts >= 3` với thời gian khóa 3 phút:
- Ban đầu: `login_attempts = 0`.
- Lần 1 gõ sai: `newAttempts = 0 + 2 = 2` (< 3, chưa khóa).
- Lần 2 gõ sai: `newAttempts = 2 + 2 = 4` (>= 3, hệ thống lập tức khóa tài khoản và thiết lập `locked_until` sang 3 phút sau).

Hậu quả: Người dùng hợp lệ chỉ cần nhập nhầm mật khẩu 2 lần liên tiếp là đã bị tước quyền đăng nhập vào hệ thống trong vòng 3 phút. Điều này phá vỡ tiêu chuẩn thiết kế tài liệu và trải nghiệm người dùng thông thường (vốn cho phép ít nhất 3 hoặc 5 lần nhập sai), dẫn đến tình trạng từ chối dịch vụ sớm (Denial of Service) và gây ức chế lớn cho khách hàng.

## Các bước tái hiện (Steps to Reproduce)
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

## Kết quả thực tế (Actual Result)
- Ở lần thứ 3, ngay cả khi người dùng cung cấp mật khẩu chính xác, máy chủ lập tức từ chối và phản hồi HTTP 403 Forbidden:
  ```json
  {
    "error": "Tài khoản đã bị khóa. Vui lòng thử lại sau."
  }
  ```
- Người dùng bị khóa ngay sau lần sai thứ 2.

## Kết quả mong đợi (Expected Result)
- Mỗi lần đăng nhập thất bại chỉ được cộng thêm 1 đơn vị vào số lần thử sai (`+ 1`):
  ```javascript
  const newAttempts = (user.login_attempts || 0) + 1;
  ```
- Với ngưỡng khóa tài khoản `>= 3`, hệ thống phải cho phép người dùng thử sai tối thiểu 3 lần liên tiếp (Lần 1: 1, Lần 2: 2, Lần 3: 3) và chỉ khóa ở lần vi phạm thứ 4 trở đi hoặc sau khi đạt đủ 3 lần vi phạm.

## Phân tích nguyên nhân & Code tham chiếu
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

## Test cases liên quan
- `FR20-DT-14` (Kiểm tra cơ chế khóa tài khoản khi gõ sai lần thứ 2 liên tiếp)
- `FR20-BVA-13` (BVA Ngưỡng số lần gõ sai: Kiểm tra chuyển đổi trạng thái khi gõ sai lần 1 và lần 2)

## Mức độ nghiêm trọng
- **Severity**: Medium
- **Priority**: Medium
