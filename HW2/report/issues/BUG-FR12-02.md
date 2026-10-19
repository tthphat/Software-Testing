# [BUG] [FR-12] Endpoint quản trị sản phẩm POST/PUT/DELETE /api/products hoàn toàn thiếu xác thực (Missing Authentication)

## Mô tả lỗi (Description)
Theo tài liệu đặc tả `docs/api_specification.md` (mục 3. Quản lý sản phẩm), các thao tác thay đổi kho hàng gồm tạo sản phẩm mới (`POST /api/products`), cập nhật sản phẩm (`PUT /api/products/:id`) và xóa sản phẩm (`DELETE /api/products/:id`) là các thao tác quản trị viên đặc quyền, bắt buộc phải có Authorization header chứa Bearer Token hợp lệ của Admin.

Tuy nhiên, trong mã nguồn backend `server.js:167`, các route này hoàn toàn được khai báo công khai không qua middleware `authenticateToken`. Hậu quả: Bất kỳ kẻ tấn công nặc danh nào ngoài Internet (unauthenticated guest) không cần đăng nhập hay có token đều có thể tạo, chỉnh sửa hoặc xóa sạch kho hàng của hệ thống. Đồng thời, API này không có validation nên kẻ tấn công có thể chèn các sản phẩm với giá âm, giá 0 đồng, tồn kho âm làm phá hoại cơ sở dữ liệu.

## Các bước tái hiện (Steps to Reproduce)
1. Chuẩn bị một HTTP request tạo sản phẩm mà KHÔNG kèm bất kỳ Authorization header nào:
   ```http
   POST /api/products HTTP/1.1
   Host: localhost:3000
   Content-Type: application/json

   {
     "name": "Hacked Product",
     "description": "Created anonymously",
     "price": -999,
     "stock": -10,
     "category_id": 1,
     "image_url": ""
   }
   ```
2. Gửi request trực tiếp tới backend API.
3. Quan sát phản hồi HTTP từ server.

## Kết quả thực tế (Actual Result)
Máy chủ trả về HTTP 201 Created và ghi nhận sản phẩm vào cơ sở dữ liệu:
```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  "message": "Product created",
  "id": 11
}
```

## Kết quả mong đợi (Expected Result)
Máy chủ phải từ chối ngay lập tức với mã lỗi HTTP 401 Unauthorized do thiếu thông tin xác thực:
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=utf-8

{
  "error": "Access token required"
}
```

## Phân tích nguyên nhân & Code tham chiếu
- Tại `eshop-sut/backend/server.js:167-200`:
  ```javascript
  app.post('/api/products', (req, res) => { // Không có authenticateToken
    const { name, description, price, stock, category_id, image_url } = req.body;
    db.run(
      'INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, stock, category_id, image_url],
      function (err) { ... }
    );
  });

  app.put('/api/products/:id', (req, res) => { ... }); // Không có authenticateToken
  app.delete('/api/products/:id', (req, res) => { ... }); // Không có authenticateToken
  ```
- Khác với các route như `/api/users/me` hay `/api/admin/users` có sử dụng `authenticateToken`, nhóm route sản phẩm bị bỏ quên middleware hoàn toàn.
- Phân loại CWE: CWE-306 (Missing Authentication for Critical Function), OWASP A01:2021-Broken Access Control.

## Test cases liên quan
- `FR12-DT-16` (Khách vãng lai gửi `POST /api/products` không có token)
- `FR12-BVA-11` (Khách gửi `price = -1` cực trị âm)
- `FR12-BVA-12` (Khách gửi `price = 0` điểm biên dưới)
- `FR12-BVA-13` (Khách gửi `price = 1` điểm biên hợp lệ)
- `FR12-BVA-14` (Khách gửi `price = 999999999` điểm cực trị dương)

## Mức độ nghiêm trọng
- **Severity:** Critical
- **Priority:** Immediate
