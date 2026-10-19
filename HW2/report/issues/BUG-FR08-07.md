# [BUG] [FR-08] Endpoint checkout không xác thực tính hợp lệ của mã giảm giá coupon_id

## Mô tả lỗi (Description)
Khi client gửi yêu cầu checkout kèm trường `coupon_id` (hoặc mã coupon), máy chủ Backend `POST /api/checkout` hoàn toàn không kiểm tra xem mã giảm giá này có tồn tại trong bảng `coupons`, còn hạn sử dụng, hay đã vượt quá số lượt dùng tối đa (`usage_limit`) hay chưa. Kẻ gian có thể áp dụng mã coupon tùy ý hoặc tự ý gán mức giảm giá giả mạo mà máy chủ vẫn chấp nhận tạo đơn hàng mà không có sự kiểm chứng đối chiếu.

## Các bước tái hiện (Steps to Reproduce)
1. Gửi request `POST /api/checkout` kèm `coupon_id = 9999` (ID coupon không tồn tại hoặc đã hết hạn) và số tiền đã tự giảm:
   ```json
   {
     "coupon_id": 9999,
     "total_amount": 180000,
     "shipping_address": "123 Le Loi, Quan 1, TP.HCM"
   }
   ```
2. Quan sát phản hồi từ máy chủ.

## Kết quả thực tế (Actual Result)
HTTP/1.1 200 OK
```json
{
  "message": "Checkout successful",
  "orderId": 18
}
```
Máy chủ không kiểm tra tính hợp lệ của coupon, tạo đơn hàng thành công.

## Kết quả mong đợi (Expected Result)
HTTP/1.1 400 Bad Request
```json
{
  "error": "Mã giảm giá không tồn tại hoặc đã hết hạn"
}
```

## Phân tích nguyên nhân & Code tham chiếu
- Backend `server.js:297-309`: Endpoint checkout hoàn toàn bỏ qua việc xác thực trạng thái coupon trong database.
- Phân loại CWE: CWE-840 (Business Logic Error).

## Test case liên quan
- `FR08-DT-21`

## Mức độ nghiêm trọng
- **Severity:** Minor
- **Priority:** Medium
