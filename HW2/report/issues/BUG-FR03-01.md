# [BUG] [FR-03] Lộ mã xác nhận resetToken (OTP) trong HTTP Response Body

## Mô tả lỗi (Description)
API `POST /api/forgot-password` sinh mã OTP đặt lại mật khẩu ngẫu nhiên 4 chữ số, nhưng thay vì gửi bảo mật qua email hoặc SMS cho chủ sở hữu tài khoản, máy chủ lại trả thẳng giá trị `resetToken` trong thân phản hồi JSON (HTTP response body). Lỗ hổng này cho phép bất kỳ kẻ tấn công nào chỉ cần biết địa chỉ email của người dùng là có thể lấy được mã OTP và đặt lại mật khẩu của nạn nhân mà không cần quyền truy cập vào hộp thư email (Account Takeover).

## Các bước tái hiện (Steps to Reproduce)
1. Gửi request `POST /api/forgot-password` với email của tài khoản đã tồn tại:
   ```json
   {
     "email": "test@eshop.com"
   }
   ```
2. Quan sát phản hồi HTTP từ server.

## Kết quả thực tế (Actual Result)
HTTP/1.1 200 OK
```json
{
  "message": "Mã đặt lại mật khẩu đã được tạo",
  "resetToken": "9818"
}
```

## Kết quả mong đợi (Expected Result)
HTTP/1.1 200 OK với phản hồi không chứa trường `resetToken`:
```json
{
  "message": "Mã đặt lại mật khẩu đã được gửi đến email của bạn"
}
```
Mã `resetToken` chỉ được gửi qua kênh liên lạc an toàn ngoại tuyến (email/SMS) của chủ tài khoản.

## Phân tích nguyên nhân & Code tham chiếu
- Tại `eshop-sut/backend/server.js:77`:
  ```javascript
  res.json({ message: 'Mã đặt lại mật khẩu đã được tạo', resetToken });
  ```
- Phân loại CWE: CWE-200 (Exposure of Sensitive Information), CWE-640 (Weak Password Recovery Mechanism).

## Test case liên quan
- `FR03-DT-01`

## Mức độ nghiêm trọng
- **Severity:** Critical
- **Priority:** Immediate
