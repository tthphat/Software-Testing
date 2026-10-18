# [BUG] [FR-01] Backend thiếu kiểm tra các trường bắt buộc khi đăng ký tài khoản

## Mô tả lỗi (Description)
API `POST /api/register` cho phép người dùng đăng ký tài khoản thành công ngay cả khi các trường bắt buộc (`name`, `email`, `password`) bị thiếu hoặc gửi lên chuỗi rỗng `""`. Hệ thống vẫn trả về HTTP 200 OK và tạo người dùng rỗng trong cơ sở dữ liệu.

## Các bước tái hiện (Steps to Reproduce)
1. Gửi request `POST /api/register` với body rỗng hoặc thiếu trường:
   ```json
   {
     "name": "",
     "email": "user@domain.com",
     "password": "Password123!"
   }
   ```
2. Kiểm tra phản hồi từ server.

## Kết quả thực tế (Actual Result)
HTTP/1.1 200 OK
```json
{
  "message": "User registered successfully",
  "id": 14
}
```

## Kết quả mong đợi (Expected Result)
HTTP/1.1 400 Bad Request hoặc 422 Unprocessable Entity kèm thông báo lỗi cụ thể yêu cầu nhập đầy đủ họ tên, email và mật khẩu hợp lệ.

## Test case liên quan
- `FR01-DT-02`, `FR01-DT-03`, `FR01-DT-06`, `FR01-DT-07`, `FR01-DT-14`, `FR01-DT-15`

## Mức độ nghiêm trọng
- **Severity:** Major
- **Priority:** High
