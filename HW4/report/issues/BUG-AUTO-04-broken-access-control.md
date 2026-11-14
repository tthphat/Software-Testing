# [BUG-AUTO-04][FR-12] Lỗ hổng Broken Access Control tại API /api/admin/users cho phép tài khoản User thường trích xuất toàn bộ danh bạ người dùng

| Mục | Nội dung |
|---|---|
| Tính năng | Phân quyền & Quản trị hệ thống (Access Control – FR-12) – Admin Web & API |
| Test case liên quan | `TC-FR12-12` (Kiểm tra lỗ hổng Broken Access Control: Backend không được phép trả dữ liệu người dùng cho vai trò user) |
| Mức độ (Severity) | Critical (Lỗ hổng an ninh thông tin nghiêm trọng – OWASP A01:2021 Broken Access Control) |
| Độ ưu tiên (Priority) | High (P1) |
| Khả năng tái hiện | Luôn luôn (100%) trên mọi môi trường và mọi trình duyệt (Chromium, Firefox, WebKit) |
| Môi trường | Windows 11, Playwright TypeScript, Backend Express & SQLite `http://localhost:3000` |
| Ngày phát hiện | 2026-11-15 |
| GitHub Issue | [#118](https://github.com/tthphat/eshop-sut/issues/118) |

## Điều kiện tiên quyết
- Backend API (`http://localhost:3000`) đang hoạt động bình thường.
- Có sẵn một tài khoản người dùng thông thường (`role: "user"`), ví dụ `test@eshop.com` / `Test1234!`.
- Đã đăng nhập và lấy được JWT Access Token hợp lệ của vai trò `user`.

## Các bước tái hiện
1. Gửi request đăng nhập bằng tài khoản người dùng thường:
   - `POST http://localhost:3000/api/login`
   - Body: `{"email": "test@eshop.com", "password": "Test1234!"}`
   - Nhận về `userToken`.
2. Sử dụng `userToken` này để gửi HTTP GET request đến endpoint quản trị viên:
   - `GET http://localhost:3000/api/admin/users`
   - Header: `Authorization: Bearer <userToken>`
3. Quan sát HTTP Status code và dữ liệu JSON phản hồi từ máy chủ.

## Kết quả mong đợi
- Vì endpoint `/api/admin/users` là tài nguyên quản trị nhạy cảm thuộc phạm vi quản lý của Admin Web, hệ thống phải thực thi kiểm tra quyền hạn (Role-based Authorization).
- Với token có vai trò `role: "user"`, máy chủ **phải từ chối truy cập** với mã lỗi `HTTP 403 Forbidden` (hoặc `401 Unauthorized`) và thông báo lỗi rõ ràng (ví dụ: `{"error": "Forbidden: Admin access required"}`).
— Nguồn: [SPEC] (Đặc tả phân quyền hệ thống) & [SECURITY BEST PRACTICE] (OWASP Top 10).

## Kết quả thực tế
- Backend EShop trả về mã trạng thái **`HTTP 200 OK`**.
- Toàn bộ cơ sở dữ liệu danh bạ người dùng (bao gồm `id`, `name`, `email`, `role`, `login_attempts`, `locked_until`, `shipping_address`) của cả quản trị viên và tất cả khách hàng khác bị phơi bày hoàn toàn cho người dùng thông thường:
  ```json
  [
    {
      "id": 1,
      "name": "Admin User",
      "email": "admin@eshop.com",
      "role": "admin",
      "login_attempts": 0,
      "locked_until": null,
      "shipping_address": null
    },
    {
      "id": 2,
      "name": "Test User",
      "email": "test@eshop.com",
      "role": "user",
      "login_attempts": 0,
      "locked_until": null,
      "shipping_address": null
    }
  ]
  ```
- Trên kịch bản kiểm thử tự động Playwright, assertion `expect(res.status()).toBe(403)` bị FAILED vì nhận được mã trạng thái `200` (`Expected: 403, Received: 200`), phát hiện chính xác lỗ hổng bảo mật trên cả 3 trình duyệt Chromium, Firefox, WebKit.

## Bằng chứng

- **Playwright Test Runner Log:**
  ```text
  1) [chromium] › tests\fr12-access-control.spec.ts:38:5 › TC-FR12-12: Kiểm tra lỗ hổng Broken Access Control: Backend không được phép trả dữ liệu người dùng cho vai trò user
     Error: expect(received).toBe(expected) // Object.is equality

     Expected: 403
     Received: 200

       155 |         });
       156 |         // SUT Defect Check: Backend incorrectly returns 200 instead of 403
     > 157 |         expect(res.status()).toBe(tc.expected.expectedStatus);
           |                              ^
  ```
- **GitHub Issue:** https://github.com/tthphat/eshop-sut/issues/118


## Phân tích nguyên nhân (đã xác nhận trực tiếp từ mã nguồn SUT)

### Tại Backend (`eshop-sut/backend/server.js:L494-500`):
Lập trình viên chỉ gắn middleware `authenticateToken` (xác thực token có hợp lệ hay không) mà **hoàn toàn bỏ quên middleware kiểm tra quyền hạn admin**:
```javascript
app.get("/api/admin/users", authenticateToken, (req, res) => {
  db.all("SELECT id, name, email, role, login_attempts, locked_until, shipping_address FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
```

Trong khi đó, ở các endpoint quản trị chuẩn mực khác, cần phải có guard:
```javascript
if (req.user.role !== "admin") {
  return res.status(403).json({ error: "Forbidden: Admin access required" });
}
```

## Đề xuất giải pháp khắc phục (Dành cho Dev Backend)
Bổ sung kiểm tra vai trò người dùng trong middleware hoặc tạo riêng middleware `requireAdmin`:
```javascript
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Admin role required." });
  }
};

app.get("/api/admin/users", authenticateToken, requireAdmin, (req, res) => {
  // Safe execution
});
```

