# [BUG] [FR-12] Middleware authenticateToken không kiểm tra vai trò admin và các route quản trị thiếu role check

## Mô tả lỗi (Description)
Backend SUT hoàn toàn thiếu cơ chế phân quyền (Missing Authorization / Broken Access Control) cho các tài nguyên quản trị. Middleware `authenticateToken` (`server.js:100-110`) chỉ xác thực tính hợp lệ của JSON Web Token mà không kiểm tra trường `role`. Đồng thời, các controller/route handler quản trị (`GET /api/admin/users`, `DELETE /api/admin/users/:id`, `GET /api/admin/orders`, `POST /api/categories`, `DELETE /api/categories/:id`, `POST /api/coupons`, `DELETE /api/coupons/:id`) hoàn toàn không kiểm tra xem người dùng hiện tại có vai trò `admin` hay không (`if (req.user.role !== 'admin')`).

Hậu quả: Bất kỳ người dùng thông thường (`role: 'user'`) nào sau khi đăng nhập thành công đều có thể gửi request đến toàn bộ các API quản trị và thực hiện mọi thao tác: trích xuất danh sách tất cả người dùng hệ thống, xóa tài khoản, đổi trạng thái đơn hàng, tạo và xóa mã giảm giá coupon.

## Các bước tái hiện (Steps to Reproduce)
1. Đăng nhập với tài khoản người dùng thông thường (`test@eshop.com` / `Password123!`) để lấy JWT Bearer Token.
2. Gửi request `GET /api/admin/users` kèm header `Authorization: Bearer <regular_user_jwt>`:
   ```http
   GET /api/admin/users HTTP/1.1
   Host: localhost:3000
   Authorization: Bearer <regular_user_jwt>
   ```
3. Hoặc gửi request `POST /api/categories` để tạo danh mục:
   ```http
   POST /api/categories HTTP/1.1
   Host: localhost:3000
   Authorization: Bearer <regular_user_jwt>
   Content-Type: application/json

   { "name": "Unauthorized Category" }
   ```
4. Quan sát HTTP status code và response body từ server.

## Kết quả thực tế (Actual Result)
Máy chủ trả về HTTP 200 OK (hoặc 201 Created), thực thi hoàn tất yêu cầu và cung cấp toàn bộ dữ liệu quản trị:
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
  { "id": 1, "name": "Admin", "email": "admin@eshop.com", "role": "admin" },
  { "id": 2, "name": "Test User", "email": "test@eshop.com", "role": "user" }
]
```

## Kết quả mong đợi (Expected Result)
Máy chủ phải từ chối yêu cầu với mã lỗi HTTP 403 Forbidden:
```http
HTTP/1.1 403 Forbidden
Content-Type: application/json; charset=utf-8

{
  "error": "Forbidden: Admin privileges required"
}
```

## Phân tích nguyên nhân & Code tham chiếu
- Tại `eshop-sut/backend/server.js:100-110`:
  ```javascript
  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access token required' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ error: 'Invalid or expired token' });
      req.user = user;
      next();
    });
  };
  ```
- Tại các route quản trị (`server.js:231`, `241`, `250`, `259`, `268`, `277`, `286`, `295`), chỉ dùng `authenticateToken` mà không bổ sung middleware `requireAdmin` hoặc kiểm tra `req.user.role === 'admin'`.
- Phân loại CWE: CWE-285 (Improper Authorization), CWE-862 (Missing Authorization), OWASP A01:2021-Broken Access Control.

## Test cases liên quan
- `FR12-DT-07` (User thường gọi `GET /api/admin/users`)
- `FR12-DT-08` (User thường gọi `DELETE /api/admin/users/:id`)
- `FR12-DT-13` (User thường gọi `POST /api/categories`)
- `FR12-DT-15` (User thường gọi `GET /api/admin/orders`)
- `FR12-DT-18` (User thường gọi `POST /api/coupons`)

## Mức độ nghiêm trọng
- **Severity:** Critical
- **Priority:** Immediate
