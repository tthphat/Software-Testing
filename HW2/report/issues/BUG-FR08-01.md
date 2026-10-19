# [BUG] [FR-08] Backend hoàn toàn thiếu validation cho trường total_amount khi checkout

## Mô tả lỗi (Description)
Khi người dùng gửi yêu cầu đặt hàng qua endpoint `POST /api/checkout`, máy chủ Backend hoàn toàn không kiểm tra tính hợp lệ của trường `total_amount`. Hệ thống chấp nhận bất kỳ giá trị bất thường nào: số tiền âm (ví dụ: `-50,000` VNĐ làm đảo chiều dòng tiền thanh toán), số tiền bằng `0` VNĐ (cho phép mua hàng miễn phí trái phép), chuỗi ký tự (`"free"`), kiểu boolean (`true`), giá trị `null`, số thực không nguyên (`199999.5`), hoặc các số cực lớn gây tràn số nguyên 32-bit trong SQLite (`2,147,483,648`). Mọi request sai trái trên đều được Backend ghi vào cơ sở dữ liệu và trả về `HTTP 200 OK` thay vì từ chối bằng `HTTP 400 Bad Request`.

## Các bước tái hiện (Steps to Reproduce)
1. Đăng nhập tài khoản hợp lệ (`test@eshop.com`) để lấy JWT Bearer token.
2. Gửi request `POST /api/checkout` với `total_amount` là số âm hoặc bằng 0:
   ```json
   {
     "total_amount": -50000,
     "shipping_address": "123 Le Loi, Phuong Ben Nghe, Quan 1, TP.HCM"
   }
   ```
3. Quan sát mã phản hồi HTTP và dữ liệu trong cơ sở dữ liệu.

## Kết quả thực tế (Actual Result)
HTTP/1.1 200 OK
```json
{
  "message": "Checkout successful",
  "orderId": 4
}
```
Bản ghi đơn hàng trong bảng `orders` của SQLite lưu giá trị `total_amount = -50000`.

## Kết quả mong đợi (Expected Result)
HTTP/1.1 400 Bad Request
```json
{
  "error": "Tổng số tiền thanh toán không hợp lệ"
}
```
Máy chủ phải từ chối giao dịch, không tạo bản ghi mới trong bảng `orders`.

## Phân tích nguyên nhân & Code tham chiếu
- Tại `eshop-sut/backend/server.js:297-309`:
  ```javascript
  app.post('/api/checkout', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { total_amount, shipping_address } = req.body;
    db.run(
      'INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES (?, ?, ?, ?)',
      [userId, total_amount, 'pending', shipping_address],
      function (err) { ... }
    );
  });
  ```
- Hoàn toàn không có câu lệnh kiểm tra:
  ```javascript
  if (typeof total_amount !== 'number' || total_amount <= 0 || !Number.isInteger(total_amount)) {
    return res.status(400).json({ error: 'Số tiền thanh toán không hợp lệ' });
  }
  ```
- Phân loại CWE: CWE-20 (Improper Input Validation), CWE-190 (Integer Overflow).

## Test cases liên quan
- `FR08-DT-06`, `FR08-DT-07`, `FR08-DT-09`, `FR08-DT-10`, `FR08-DT-11`, `FR08-DT-12`, `FR08-DT-13`, `FR08-BVA-01`, `FR08-BVA-02`, `FR08-BVA-07`, `FR08-BVA-08` (11 test cases).

## Mức độ nghiêm trọng
- **Severity:** Critical
- **Priority:** Immediate
