# [BUG] [FR-01] Cho phép đăng ký trùng lặp email do thiếu ràng buộc UNIQUE và không kiểm tra tồn tại

## Mô tả lỗi (Description)
Hệ thống cho phép đăng ký tài khoản mới với email đã tồn tại trong cơ sở dữ liệu (kể cả email của admin như `admin@eshop.com`). Nguyên nhân là bảng `users` trong `database.js` không có ràng buộc `UNIQUE` cho cột `email`, và route `POST /api/register` không kiểm tra `SELECT` trước khi `INSERT`.

## Nguy cơ bảo mật
- **Xung đột tài khoản:** Khi đăng nhập bằng email bị trùng, hàm đăng nhập chỉ lấy bản ghi đầu tiên, có thể khiến người dùng truy cập nhầm tài khoản của người khác hoặc khóa tài khoản của người khác.

## Các bước tái hiện (Steps to Reproduce)
1. Gửi request `POST /api/register` với email đã có sẵn trong DB (`admin@eshop.com`):
   ```json
   {
     "name": "Admin Clone",
     "email": "admin@eshop.com",
     "password": "Password123!"
   }
   ```
2. Kiểm tra phản hồi từ server.

## Kết quả thực tế (Actual Result)
HTTP/1.1 200 OK
```json
{
  "message": "User registered successfully",
  "id": 28
}
```

## Kết quả mong đợi (Expected Result)
HTTP/1.1 409 Conflict hoặc 400 Bad Request kèm thông báo email đã tồn tại trong hệ thống.

## Test case liên quan
- `FR01-DT-16`

## Mức độ nghiêm trọng
- **Severity:** Critical
- **Priority:** Immediate
