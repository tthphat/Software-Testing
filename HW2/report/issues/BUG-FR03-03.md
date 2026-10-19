# [BUG] [FR-03] Mã đặt lại mật khẩu không có thời hạn hết hạn (Token Never Expires)

## Mô tả lỗi (Description)
Hệ thống cấp mã OTP/resetToken khi người dùng yêu cầu quên mật khẩu, nhưng mã này không có cơ chế hết hạn (expiration time). Mã OTP vẫn giữ nguyên hiệu lực vô thời hạn cho tới khi người dùng thực hiện đổi mật khẩu hoặc bị ghi đè bởi yêu cầu mới. Kẻ tấn công hoặc người khác có quyền truy cập vào thông báo/thiết bị cũ có thể sử dụng mã OTP này nhiều ngày hoặc nhiều tuần sau đó để chiếm tài khoản.

## Phân tích nguyên nhân & Code tham chiếu
- Tại `eshop-sut/backend/database.js:58`:
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
  Bảng `users` chỉ lưu trữ giá trị `reset_token TEXT` mà không có cột lưu thời điểm sinh token (ví dụ: `reset_token_created_at`) hoặc thời điểm hết hạn (`reset_token_expires_at`).
- Tại `eshop-sut/backend/server.js:84-97`:
  Backend chỉ kiểm tra sự tồn tại `WHERE email = ? AND reset_token = ?` mà không có bất kỳ logic kiểm tra thời gian hết hạn (thông thường OTP chỉ nên có hiệu lực từ 5 đến 15 phút).
- Phân loại CWE: CWE-613 (Insufficient Session Expiration).

## Kết quả mong đợi (Expected Result)
Mã `resetToken` chỉ nên có hiệu lực trong khoảng thời gian nhất định (ví dụ 10 phút). Nếu gửi token sau thời gian này, hệ thống phải từ chối với HTTP 400 Bad Request kèm thông báo `Token has expired`.

## Mức độ nghiêm trọng
- **Severity:** Major
- **Priority:** Medium
