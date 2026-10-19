# [BUG] [FR-08] Không kiểm tra số lượng tồn kho (Overselling) và DB không lưu chi tiết các mặt hàng (order_items)

## Mô tả lỗi (Description)
Hệ thống tồn tại hai lỗi kiến trúc và nghiệp vụ nghiêm trọng liên quan đến quản lý đơn hàng và tồn kho:
1. **Lỗi bán vượt tồn kho (Overselling Defect):** Backend không kiểm tra số lượng tồn kho trong cột `stock` của bảng `products`. Khi khách hàng đặt mua số lượng vượt quá số lượng hàng có sẵn trong kho (ví dụ: tồn kho còn 5 nhưng đặt 100 sản phẩm), máy chủ vẫn phê duyệt thanh toán thành công và không giảm trừ số lượng tồn kho của sản phẩm trong DB.
2. **Thiếu bảng chi tiết đơn hàng (`order_items`):** Cơ sở dữ liệu SQLite chỉ tạo bảng `orders` chứa các trường `id, user_id, total_amount, status, shipping_address, created_at` (`database.js:74-81`). Hoàn toàn không có bảng `order_items` hay trường dữ liệu nào lưu danh sách các sản phẩm và số lượng tương ứng của đơn hàng. Kết quả là sau khi đơn hàng được tạo, cả khách hàng và quản trị viên đều không thể biết đơn hàng gồm những sản phẩm nào!

## Các bước tái hiện (Steps to Reproduce)
1. Thêm 100 sản phẩm A vào giỏ hàng (trong khi tồn kho thực tế của sản phẩm A chỉ còn 5).
2. Gửi request `POST /api/checkout`.
3. Kiểm tra phản hồi HTTP và dữ liệu trong database SQLite.

## Kết quả thực tế (Actual Result)
HTTP/1.1 200 OK
```json
{
  "message": "Checkout successful",
  "orderId": 17
}
```
- Số lượng tồn kho trong bảng `products` giữ nguyên không đổi.
- Bảng `orders` chỉ lưu tổng tiền, không lưu bất kỳ thông tin nào về sản phẩm A.

## Kết quả mong đợi (Expected Result)
- Máy chủ phải kiểm tra tồn kho: nếu `quantity > product.stock`, phải từ chối bằng `HTTP 400 Bad Request`:
  ```json
  {
    "error": "Sản phẩm A không đủ số lượng tồn kho để đáp ứng đơn hàng"
  }
  ```
- Phải tạo bảng `order_items (id, order_id, product_id, quantity, price)` và lưu chi tiết từng mặt hàng của đơn hàng khi thanh toán thành công.

## Phân tích nguyên nhân & Code tham chiếu
- Backend `eshop-sut/backend/server.js:301-308`:
  ```javascript
  db.run(
    "INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES (?, ?, ?, ?)",
    [userId, total_amount, "pending", shipping_address],
    ...
  );
  // Không có UPDATE products SET stock = stock - quantity WHERE id = ?
  // Không có INSERT INTO order_items ...
  ```
- Database schema `eshop-sut/backend/database.js:74-81`.
- Phân loại CWE: CWE-840 (Business Logic Error).

## Test case liên quan
- `FR08-DT-20`

## Mức độ nghiêm trọng
- **Severity:** Major
- **Priority:** High
