# [BUG] [FR-01] Thiếu giới hạn độ dài tối đa cho trường họ tên và mật khẩu

## Mô tả lỗi (Description)
API `POST /api/register` không có cơ chế giới hạn độ dài tối đa của họ tên và mật khẩu. Hệ thống chấp nhận chuỗi họ tên 101 ký tự (`FR01-BVA-05`), 1.000 ký tự (`FR01-BVA-06`), và mật khẩu 129 ký tự (`FR01-BVA-12`), 1.000 ký tự (`FR01-BVA-13`) mà không từ chối hoặc giới hạn kích thước payload.

## Các bước tái hiện (Steps to Reproduce)
1. Gửi request `POST /api/register` với mật khẩu 1.000 ký tự:
   ```json
   {
     "name": "Nguyen Van A",
     "email": "user_long_pass@domain.com",
     "password": "Pass1!..."
   }
   ```
2. Quan sát phản hồi từ server.

## Kết quả thực tế (Actual Result)
HTTP/1.1 200 OK. Máy chủ lưu trữ toàn bộ chuỗi cực dài vào database SQLite.

## Kết quả mong đợi (Expected Result)
HTTP/1.1 400 Bad Request hoặc 413 Payload Too Large khi độ dài chuỗi vượt quá ngưỡng an toàn được quy định.

## Test case liên quan
- `FR01-BVA-05`, `FR01-BVA-06`, `FR01-BVA-12`, `FR01-BVA-13`

## Mức độ nghiêm trọng
- **Severity:** Minor
- **Priority:** Medium
