# [BUG] [FR-01] Backend hoàn toàn không kiểm tra độ dài và độ phức tạp mật khẩu

## Mô tả lỗi (Description)
API `POST /api/register` tại backend không kiểm tra bất kỳ tiêu chí nào về mật khẩu: chấp nhận mật khẩu dưới 8 ký tự (`"Pass1!a"` - 7 ký tự), mật khẩu không có chữ in hoa, không có chữ thường, không có số, hoặc không có ký tự đặc biệt. Lập trình viên chỉ cài đặt kiểm tra ở giao diện Client (Web/Mobile) mà bỏ quên tầng Backend.

## Các bước tái hiện (Steps to Reproduce)
1. Gửi request `POST /api/register` với mật khẩu 7 ký tự:
   ```json
   {
     "name": "Nguyen Van A",
     "email": "user_test_weak_pass@domain.com",
     "password": "Pass1!a"
   }
   ```
2. Kiểm tra phản hồi từ server.

## Kết quả thực tế (Actual Result)
HTTP/1.1 200 OK
```json
{
  "message": "User registered successfully",
  "id": 35
}
```

## Kết quả mong đợi (Expected Result)
HTTP/1.1 400 Bad Request từ chối mật khẩu không đạt độ dài tối thiểu 8 ký tự hoặc không đủ độ phức tạp theo yêu cầu.

## Test case liên quan
- `FR01-DT-09`, `FR01-DT-10`, `FR01-DT-11`, `FR01-DT-12`, `FR01-DT-13`, `FR01-BVA-07`

## Mức độ nghiêm trọng
- **Severity:** Major
- **Priority:** High
