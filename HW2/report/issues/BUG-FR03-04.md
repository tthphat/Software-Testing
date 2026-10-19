# [BUG] [FR-03] Endpoint POST /api/forgot-password trả về HTTP 404 Not Found thay vì HTTP 400 Bad Request khi email không hợp lệ

## Mô tả lỗi (Description)
Khi client gửi yêu cầu `POST /api/forgot-password` với dữ liệu email không hợp lệ (ví dụ: email rỗng `""`, thiếu trường `email`, email thiếu ký tự `@`, hoặc sai kiểu dữ liệu Boolean `true`), backend không tiến hành xác thực tính hợp lệ của dữ liệu (Request Schema Validation) mà thực hiện truy vấn trực tiếp vào cơ sở dữ liệu `SELECT * FROM users WHERE email = ?`. Do không tìm thấy bản ghi nào khớp, hệ thống trả về mã lỗi HTTP 404 Not Found (`{"error": "User not found"}`) thay vì HTTP 400 Bad Request.

Điều này làm sai lệch ý nghĩa chuẩn của mã trạng thái HTTP RESTful: mã 404 chỉ nên dùng khi định dạng request hợp lệ nhưng tài nguyên không tồn tại, còn request sai định dạng phải bị từ chối bằng HTTP 400 Bad Request (theo đặc tả `api_specification.md:38-40`).

## Các bước tái hiện (Steps to Reproduce)
1. Gửi request `POST /api/forgot-password` với chuỗi rỗng:
   ```json
   {
     "email": ""
   }
   ```
2. Quan sát HTTP status trả về.

## Kết quả thực tế (Actual Result)
HTTP/1.1 404 Not Found
```json
{
  "error": "User not found"
}
```

## Kết quả mong đợi (Expected Result)
HTTP/1.1 400 Bad Request với thông báo lỗi rõ ràng yêu cầu cung cấp định dạng email hợp lệ.

## Phân tích nguyên nhân & Code tham chiếu
- Tại `eshop-sut/backend/server.js:68-72`:
  ```javascript
  app.post('/api/forgot-password', (req, res) => {
      const { email } = req.body;
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
          if (!user) {
              return res.status(404).json({ error: 'User not found' });
          }
          // ...
      });
  });
  ```
  Backend thiếu bước xác thực dữ liệu đầu vào trước khi truy vấn cơ sở dữ liệu.

## Test cases liên quan
- `FR03-DT-03`, `FR03-DT-04`, `FR03-DT-05`, `FR03-DT-06`, `FR03-DT-07`

## Mức độ nghiêm trọng
- **Severity:** Minor
- **Priority:** Low
