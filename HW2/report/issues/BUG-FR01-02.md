# [BUG] [FR-01] Backend không kiểm tra định dạng email và kiểu dữ liệu đầu vào

## Mô tả lỗi (Description)
API `POST /api/register` không xác thực định dạng email theo chuẩn RFC 5322. Khi gửi email không có ký tự `@` (ví dụ: `invalid_email_domain.com`) hoặc truyền sai kiểu dữ liệu (kiểu boolean `true` hoặc số `12345`), máy chủ vẫn tiếp nhận và tạo tài khoản thành công với HTTP 200 OK.

## Các bước tái hiện (Steps to Reproduce)
1. Gửi request `POST /api/register` với email không hợp lệ:
   ```json
   {
     "name": "Nguyen Van A",
     "email": "invalid_email_domain.com",
     "password": "Password123!"
   }
   ```
2. Kiểm tra phản hồi từ server.

## Kết quả thực tế (Actual Result)
HTTP/1.1 200 OK
```json
{
  "message": "User registered successfully",
  "id": 17
}
```

## Kết quả mong đợi (Expected Result)
HTTP/1.1 400 Bad Request kèm thông báo định dạng email không hợp lệ.

## Test case liên quan
- `FR01-DT-04`, `FR01-DT-05`, `FR01-DT-08`

## Mức độ nghiêm trọng
- **Severity:** Major
- **Priority:** High
