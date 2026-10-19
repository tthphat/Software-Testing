# [BUG] [FR-03] Backend hoàn toàn không kiểm tra tính hợp lệ và độ phức tạp của newPassword khi đặt lại mật khẩu

## Mô tả lỗi (Description)
API `POST /api/reset-password` không thực hiện bất kỳ kiểm tra nào đối với trường `newPassword`. Người dùng có thể gửi mật khẩu rỗng `""`, mật khẩu 1 ký tự, mật khẩu chỉ có chữ thường, mật khẩu thiếu chữ số/ký tự đặc biệt, hoặc payload cực lớn 10,000 ký tự. Hệ thống vẫn băm mật khẩu và cập nhật vào cơ sở dữ liệu SQLite, trả về HTTP 200 OK. Điều này phá vỡ hoàn toàn chính sách bảo mật mật khẩu của hệ thống và mâu thuẫn với yêu cầu validation trên giao diện Web/Mobile.

## Các bước tái hiện (Steps to Reproduce)
1. Lấy mã `resetToken` hợp lệ qua endpoint `POST /api/forgot-password` cho email `test@eshop.com`.
2. Gửi request `POST /api/reset-password` với `newPassword` không hợp lệ (ví dụ: quá ngắn `Pass1!`, hoặc chuỗi rỗng `""`):
   ```json
   {
     "email": "test@eshop.com",
     "resetToken": "<VALID_TOKEN>",
     "newPassword": "123"
   }
   ```
3. Quan sát phản hồi HTTP từ server.

## Kết quả thực tế (Actual Result)
HTTP/1.1 200 OK
```json
{
  "message": "Password reset successfully"
}
```

## Kết quả mong đợi (Expected Result)
HTTP/1.1 400 Bad Request kèm thông báo lỗi chi tiết giải thích mật khẩu mới không đáp ứng yêu cầu chính sách bảo mật (tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt).

## Phân tích nguyên nhân & Code tham chiếu
- Tại `eshop-sut/backend/server.js:84-97`:
  ```javascript
  app.post('/api/reset-password', (req, res) => {
      const { email, resetToken, newPassword } = req.body;
      db.get('SELECT * FROM users WHERE email = ? AND reset_token = ?', [email, resetToken], (err, user) => {
          if (!user) {
              return res.status(400).json({ error: 'Invalid token or email' });
          }
          bcrypt.hash(newPassword, 10, (err, hashedPassword) => { ... });
      });
  });
  ```
- Hoàn toàn thiếu tầng xác thực dữ liệu đầu vào (Input Validation) cho `newPassword`.
- Phân loại CWE: CWE-521 (Weak Password Requirements).

## Test cases liên quan
- Domain Testing: `FR03-DT-16`, `FR03-DT-17`, `FR03-DT-18`, `FR03-DT-19`, `FR03-DT-20`, `FR03-DT-21`, `FR03-DT-22`
- BVA: `FR03-BVA-01`, `FR03-BVA-02`, `FR03-BVA-08`, `FR03-BVA-09`

## Mức độ nghiêm trọng
- **Severity:** Critical
- **Priority:** High
