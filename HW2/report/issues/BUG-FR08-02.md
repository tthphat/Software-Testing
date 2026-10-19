# [BUG] [FR-08] Lỗ hổng Parameter Tampering: Backend không tính lại tổng tiền từ giỏ hàng, Web cho phép user tự sửa giá

## Mô tả lỗi (Description)
Hệ thống tồn tại lỗ hổng thao túng tham số giá tiền nghiêm trọng (Price Tampering / Parameter Tampering) do hai khiếm khuyết kết hợp:
1. **Phía Backend (`server.js:299`):** Khi người dùng gọi `POST /api/checkout`, máy chủ tin tưởng 100% giá trị `total_amount` được gửi lên từ client mà không hề truy vấn lại giỏ hàng của người dùng (`userCarts[userId]`) hay bảng sản phẩm (`products`) để kiểm tra xem số tiền đó có khớp với giá trị thực tế của các món hàng hay không.
2. **Phía Frontend Web (`Checkout.jsx:93-102`):** Trên giao diện thanh toán, ô hiển thị tổng tiền thanh toán lại là một thẻ `<input type="number">` ở trạng thái mở cho phép sửa tự do (`editableTotal`) thay vì ở chế độ chỉ đọc (`readOnly` hoặc `disabled`). Người dùng có thể xóa số tiền 200,000 VNĐ trong giỏ và tự gõ thành 1,000 VNĐ rồi bấm thanh toán thành công!

## Các bước tái hiện (Steps to Reproduce)
1. Thêm một sản phẩm có giá trị 200,000 VNĐ vào giỏ hàng.
2. Mở trang Checkout trên Web hoặc gửi request API trực tiếp:
   ```http
   POST /api/checkout HTTP/1.1
   Authorization: Bearer <valid_token>
   Content-Type: application/json

   {
     "total_amount": 1000,
     "shipping_address": "123 Le Loi, Quan 1, TP.HCM"
   }
   ```
3. Quan sát kết quả xử lý của máy chủ.

## Kết quả thực tế (Actual Result)
HTTP/1.1 200 OK
```json
{
  "message": "Checkout successful",
  "orderId": 5
}
```
Đơn hàng được lưu thành công với tổng số tiền chỉ 1,000 VNĐ, gây thiệt hại tài chính nặng nề cho đơn vị bán hàng.

## Kết quả mong đợi (Expected Result)
HTTP/1.1 400 Bad Request
```json
{
  "error": "Số tiền thanh toán không khớp với giá trị giỏ hàng"
}
```
Máy chủ phải tự tính toán lại:
$$\text{ExpectedTotal} = \sum (\text{item.price} \times \text{item.quantity}) - \text{Discount}$$
Nếu `req.body.total_amount !== ExpectedTotal`, phải lập tức từ chối và cảnh báo gian lận.

## Phân tích nguyên nhân & Code tham chiếu
- Backend `eshop-sut/backend/server.js:299`:
  ```javascript
  const { total_amount, shipping_address } = req.body;
  // Hoàn toàn không có phép so sánh với userCarts[userId]
  ```
- Frontend Web `eshop-sut/frontend-web/src/pages/Checkout.jsx:93-102`:
  ```jsx
  <input
    type="number"
    className="form-control"
    value={editableTotal}
    onChange={(e) => setEditableTotal(e.target.value)}
  />
  ```
- Phân loại CWE: CWE-472 (External Control of Assumed-Immutable Web Parameter), CWE-840 (Business Logic Error).

## Test case liên quan
- `FR08-DT-08`

## Mức độ nghiêm trọng
- **Severity:** Critical
- **Priority:** Immediate
