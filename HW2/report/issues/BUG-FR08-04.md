# [BUG] [FR-08] Cho phép đặt hàng khi giỏ hàng rỗng và không xóa giỏ hàng sau khi checkout

## Mô tả lỗi (Description)
Hệ thống tồn tại hai lỗi logic nghiệp vụ liên quan đến trạng thái giỏ hàng (Cart State Lifecycle):
1. **Đặt đơn hàng ma (Ghost Orders):** Backend không kiểm tra xem giỏ hàng của người dùng hiện tại (`userCarts[userId]`) có chứa sản phẩm nào hay không. Một người dùng vừa đăng ký tài khoản, chưa từng thêm bất kỳ sản phẩm nào vào giỏ (`cart = []`), vẫn có thể gọi endpoint `POST /api/checkout` và tạo thành công một đơn hàng trong cơ sở dữ liệu.
2. **Không dọn dẹp giỏ hàng sau khi đặt (Missing Cart Cleanup):** Sau khi câu lệnh `INSERT INTO orders` thành công, Backend không hề thực hiện thao tác xóa giỏ hàng `userCarts[userId] = []` hay gọi hàm dọn dẹp. Hơn nữa, trên Frontend Web (`Checkout.jsx:61`), sau khi nhận thông báo thành công từ máy chủ, code cũng không gọi `clearCart()`, khiến các món hàng đã thanh toán vẫn tiếp tục nằm lại trong giỏ hàng.

## Các bước tái hiện (Steps to Reproduce)
1. Đăng nhập tài khoản với giỏ hàng hoàn toàn trống (`GET /api/cart` trả về mảng rỗng `[]`).
2. Gửi request `POST /api/checkout`:
   ```json
   {
     "total_amount": 200000,
     "shipping_address": "123 Le Loi, Quan 1, TP.HCM"
   }
   ```
3. Quan sát phản hồi và kiểm tra bảng `orders`.

## Kết quả thực tế (Actual Result)
HTTP/1.1 200 OK
```json
{
  "message": "Checkout successful",
  "orderId": 16
}
```
Máy chủ tạo đơn hàng mới dù giỏ hàng rỗng 0 món hàng.

## Kết quả mong đợi (Expected Result)
HTTP/1.1 400 Bad Request
```json
{
  "error": "Giỏ hàng rỗng, không thể thực hiện thanh toán"
}
```
Nếu giỏ hàng hợp lệ và thanh toán thành công, máy chủ và client phải lập tức dọn sạch giỏ hàng của người dùng.

## Phân tích nguyên nhân & Code tham chiếu
- Backend `eshop-sut/backend/server.js:297-309`:
  ```javascript
  app.post('/api/checkout', authenticateToken, (req, res) => {
    const userId = req.user.id;
    // Thiếu hoàn toàn kiểm tra:
    // const cart = userCarts[userId] || [];
    // if (!cart || cart.length === 0) return res.status(400).json({ error: 'Giỏ hàng rỗng' });
    ...
    // Sau khi insert DB thành công, thiếu:
    // delete userCarts[userId];
  });
  ```
- Phân loại CWE: CWE-840 (Business Logic Error).

## Test cases liên quan
- `FR08-DT-19`, `FR08-BVA-18` (2 test cases).

## Mức độ nghiêm trọng
- **Severity:** Major
- **Priority:** High
