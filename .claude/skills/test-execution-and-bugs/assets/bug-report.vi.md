# BUG-FRxx-nn: <Tiêu đề ngắn gọn, nêu rõ hành vi sai>

| Mục | Nội dung |
|---|---|
| Tính năng | FR-xx – <tên> |
| Test case liên quan | FRxx-DT-nn, FRxx-BVA-nn |
| Mức độ (Severity) | Critical / Major / Minor / Trivial |
| Độ ưu tiên (Priority) | High / Medium / Low |
| Khả năng tái hiện | Luôn luôn / Thỉnh thoảng |
| Môi trường | OS, trình duyệt/Postman/Node, commit của eshop-sut, base URL |
| Ngày phát hiện | YYYY-MM-DD |

## Điều kiện tiên quyết
<Tài khoản, dữ liệu, trạng thái giỏ hàng...>

## Các bước tái hiện
1. ...
2. ...

## Request / Response thực tế
```http
POST /api/... HTTP/1.1
{ ... }

HTTP/1.1 xxx
{ ... }
```

## Kết quả mong đợi
<Nội dung> — nguồn: [SPEC] / [CODE] / [ASSUMED]

## Kết quả thực tế
<Nội dung>

## Bằng chứng
- `evidence/<TC-ID>.png`
- Ảnh chụp trang GitHub Issues: `evidence/issue-<n>.png`

## Phân tích nguyên nhân (giả thuyết, nếu thấy trong code)
<file:dòng — đánh dấu rõ là giả thuyết>

## Phát hiện bởi
Test case do AI thiết kế / do sinh viên bổ sung (liên kết tới phân tích AI gap).
