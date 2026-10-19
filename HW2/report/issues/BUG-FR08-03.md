# [BUG] [FR-08] Backend thiếu validation shipping_address; Web và Mobile không có ô nhập địa chỉ

## Mô tả lỗi (Description)
1. **Thiếu kiểm tra tính hợp lệ tại Backend (`server.js:299`):** Trường `shipping_address` là thông tin bắt buộc để giao nhận hàng hóa. Tuy nhiên, Backend không kiểm tra trường này, chấp nhận lưu chuỗi rỗng `""`, chuỗi chỉ chứa khoảng trắng `"   "`, dữ liệu sai kiểu (Number `12345`), và chuỗi payload siêu lớn (10,000 ký tự gây nguy cơ tấn công từ chối dịch vụ DoS / tràn bộ nhớ). Khi client không gửi trường `shipping_address` (`undefined`), máy chủ lưu giá trị `NULL` vào SQLite mà vẫn trả về `HTTP 200 OK`.
2. **Mâu thuẫn đặc tả giữa Client và Server (Cross-layer Spec Mismatch):** Cả giao diện Web (`Checkout.jsx`) và ứng dụng Mobile (`App.js`) hoàn toàn không cung cấp ô nhập địa chỉ giao hàng cho người dùng, và khi gọi API `POST /api/checkout` đều không gửi trường `shipping_address`, dẫn đến 100% đơn hàng tạo từ ứng dụng Web và Mobile trong thực tế đều bị `NULL` địa chỉ giao hàng!

## Các bước tái hiện (Steps to Reproduce)
1. Thực hiện checkout từ giao diện Web hoặc Mobile, hoặc gửi request API thiếu `shipping_address`:
   ```http
   POST /api/checkout HTTP/1.1
   Authorization: Bearer <valid_token>
   Content-Type: application/json

   {
     "total_amount": 200000
   }
   ```
2. Kiểm tra bản ghi trong bảng `orders` của SQLite:
   ```sql
   SELECT id, user_id, total_amount, shipping_address FROM orders;
   ```

## Kết quả thực tế (Actual Result)
HTTP/1.1 200 OK
```json
{
  "message": "Checkout successful",
  "orderId": 13
}
```
Bản ghi đơn hàng có trường `shipping_address` mang giá trị `NULL` hoặc chuỗi rỗng `""`.

## Kết quả mong đợi (Expected Result)
- Backend phải trả về `HTTP 400 Bad Request` khi thiếu `shipping_address` hoặc khi độ dài không nằm trong khoảng hợp lệ $[5, 255]$:
  ```json
  {
    "error": "Địa chỉ giao hàng không được để trống và phải có độ dài từ 5 đến 255 ký tự"
  }
  ```
- Frontend Web và Mobile phải cung cấp trường nhập `shipping_address` bắt buộc trước khi cho phép bấm nút "Đặt hàng".

## Phân tích nguyên nhân & Code tham chiếu
- Backend `server.js:299`:
  ```javascript
  const { total_amount, shipping_address } = req.body;
  // Thiếu: if (!shipping_address || typeof shipping_address !== 'string' || shipping_address.trim().length < 5)
  ```
- Frontend Web `Checkout.jsx:45-50`:
  ```javascript
  await axios.post('http://localhost:3000/api/checkout', {
    items: cart,
    total_amount: finalAmount,
    coupon_id: couponResult?.coupon_id || null
    // Hoàn toàn không có shipping_address!
  });
  ```
- Phân loại CWE: CWE-20 (Improper Input Validation), CWE-400 (Uncontrolled Resource Consumption).

## Test cases liên quan
- `FR08-DT-14`, `FR08-DT-15`, `FR08-DT-16`, `FR08-DT-17`, `FR08-DT-18`, `FR08-BVA-09`, `FR08-BVA-10`, `FR08-BVA-16`, `FR08-BVA-17` (9 test cases).

## Mức độ nghiêm trọng
- **Severity:** Major
- **Priority:** High
