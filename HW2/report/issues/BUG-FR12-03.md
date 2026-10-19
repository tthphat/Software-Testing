# [BUG] [FR-12] Lỗ hổng Mass Assignment tại PUT /api/users/me cho phép người dùng tự nâng quyền thành Admin

## Mô tả lỗi (Description)
Endpoint `PUT /api/users/me` được thiết kế để người dùng đăng nhập cập nhật thông tin cá nhân của chính mình. Tuy nhiên, endpoint này bị lỗ hổng gán tham số hàng loạt (Mass Assignment / Over-posting): server nhận trực tiếp thuộc tính `role` từ request body mà không hề lọc bỏ (sanitize/filter) hay kiểm tra quyền hạn, sau đó thực thi cập nhật thẳng vào cột `role` trong bảng `users` của SQLite database.

Hậu quả: Bất kỳ người dùng thông thường (`role: 'user'`) nào chỉ cần gửi kèm trường `"role": "admin"` trong body là có thể lập tức nâng cấp tài khoản của mình thành tài khoản Quản trị viên tối cao (Privilege Escalation), chiếm đoạt toàn bộ quyền quản trị của hệ thống.

## Các bước tái hiện (Steps to Reproduce)
1. Đăng nhập tài khoản người dùng bình thường (`test@eshop.com` / `Password123!`) để nhận JWT token.
2. Kiểm tra thông tin hiện tại qua `GET /api/users/me`, xác nhận `role: "user"`.
3. Gửi request `PUT /api/users/me` kèm payload leo quyền:
   ```http
   PUT /api/users/me HTTP/1.1
   Host: localhost:3000
   Authorization: Bearer <regular_user_jwt>
   Content-Type: application/json

   {
     "name": "Hacked Admin",
     "email": "test@eshop.com",
     "password": "Password123!",
     "role": "admin"
   }
   ```
4. Gửi tiếp request `GET /api/users/me` để kiểm tra thuộc tính `role` sau khi cập nhật.

## Kết quả thực tế (Actual Result)
Máy chủ trả về HTTP 200 OK:
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": "Profile updated successfully"
}
```
Khi kiểm tra lại bằng `GET /api/users/me`:
```json
{
  "id": 2,
  "name": "Hacked Admin",
  "email": "test@eshop.com",
  "role": "admin"
}
```
Tài khoản người dùng thường đã biến thành tài khoản quản trị viên trong DB.

## Kết quả mong đợi (Expected Result)
Máy chủ phải từ chối request với mã lỗi HTTP 400 Bad Request, hoặc chỉ cập nhật các trường được phép (`name`, `email`, `password`) và hoàn toàn bỏ qua trường `role`:
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8

{
  "error": "Field 'role' cannot be modified by user"
}
```

## Phân tích nguyên nhân & Code tham chiếu
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
- Lập trình viên đã bóc tách trường `role` từ `req.body` và truyền thẳng vào câu truy vấn UPDATE mà không áp dụng whitelist kiểm tra quyền.
- Phân loại CWE: CWE-915 (Improperly Controlled Modification of Dynamically-Determined Object Attributes), CWE-269 (Improper Privilege Management), OWASP A04:2021-Insecure Design.

## Test cases liên quan
- `FR12-DT-11` (User gửi `PUT /api/users/me` kèm payload `role: "admin"`)

## Mức độ nghiêm trọng
- **Severity:** High
- **Priority:** High
