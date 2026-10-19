# FR-12 — Kiểm soát truy cập (Access Control)
## Báo cáo thực thi kiểm thử và phân tích khoảng trống AI (Execution & Gap Analysis Report)

---

## 1. Phạm vi và đặc tả

- **Tính năng kiểm thử**: **FR-12 — Kiểm soát truy cập (Access control)** theo tài liệu `docs/eshop-features.md` và `docs/api_specification.md` (mục 6. Phân quyền và Bảo mật).
- **Các nhóm endpoint kiểm thử**:
  - Nhóm 1: Admin User Management (`GET /api/admin/users`, `DELETE /api/admin/users/:id`).
  - Nhóm 2: Admin Order Management (`GET /api/admin/orders`, `POST /api/admin/orders/:id/status`).
  - Nhóm 3: Category Management (`POST /api/categories`, `DELETE /api/categories/:id`).
  - Nhóm 4: Product Management (`POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`).
  - Nhóm 5: Coupon Management (`POST /api/coupons`, `DELETE /api/coupons/:id`).
  - Nhóm 6: User Profile & Privilege Escalation (`GET /api/users/me`, `PUT /api/users/me`).
- **Môi trường thực thi**: Backend SUT chạy trên Node.js/Express với SQLite3 tại `http://localhost:3000`.
- **Tài khoản kiểm thử đã cấp nguồn**:
  - Admin: `admin@eshop.com` / `Admin123!` (`role: 'admin'`, ID: 1)
  - User: `test@eshop.com` / `Password123!` (`role: 'user'`, ID: 2)
- **Nguồn đặc tả đã sử dụng**:
  - `docs/api_specification.md` (mục 6.1 đến 6.4) `[SPEC]`
  - Mã nguồn Backend: `eshop-sut/backend/server.js:100-301` và `database.js:45-75` `[CODE]`
  - Kết quả thực thi trực tiếp qua HTTP API Runner: `[OBSERVED]`
- **Các phát hiện quan trọng từ mã nguồn SUT**:
  - Middleware `authenticateToken` (`server.js:100-110`) chỉ kiểm tra chữ ký JWT, hoàn toàn không kiểm tra `user.role === 'admin'`.
  - Các route quản trị (`/api/admin/users`, `/api/admin/orders`, `/api/categories`, `/api/coupons`) hoàn toàn không có câu lệnh kiểm tra vai trò admin.
  - Các route quản trị sản phẩm (`POST/PUT/DELETE /api/products`) hoàn toàn bỏ quên middleware `authenticateToken`.
  - Endpoint `PUT /api/users/me` bị lỗ hổng Mass Assignment cho phép cập nhật trực tiếp cột `role` trong SQLite database.

---

## 2. Tóm tắt thiết kế kiểm thử (Domain Testing & BVA)

- **Domain Testing (S04)**: Thiết kế 23 lớp tương đương (`EC01` – `EC23`) bao quát các khía cạnh: Authorization Header format, JWT signature/claims, Role context (Admin vs Regular User), Target API groups, và Privilege Escalation state. Sinh bộ 18 test cases tối thiểu (`FR12-DT-01` đến `FR12-DT-18`) đạt độ bao phủ 100% ma trận equivalence class.
- **Boundary Value Analysis (BVA)**: Xác định các miền có thứ tự liên quan đến kiểm soát truy cập (thời hạn token `exp`, tham số định danh `param.id`, và thuộc tính sản phẩm `price/stock/name.length` trên route quản trị). Áp dụng biến thể 3-value BVA, mô hình 9 điểm và quy tắc mã hóa tiếng Việt UTF-8 (v2.0 Encoding Rule), sinh 14 test cases (`FR12-BVA-01` đến `FR12-BVA-14`).
- **Tổng số ca kiểm thử**: **32 test cases** được lưu trữ tại file máy đọc `HW2/testcases/FR-12.json`.

---

## 3. Kết quả thực thi chi tiết

Toàn bộ 32 test cases đã được thực thi tự động qua test runner `run_cases.mjs` đối chiếu trực tiếp với SUT Backend:
- **Tổng số ca kiểm thử thiết kế (Designed)**: 32
- **Đã thực thi (Executed)**: 32 (100%)
- **Thành công (PASS)**: 21
- **Thất bại (FAIL)**: 11
- **Bị chặn (BLOCKED)**: 0

### Bảng kết quả thực thi 32 test cases

| Mã TC | Kỹ thuật | Mô tả ca kiểm thử | Kỳ vọng (Expected) | Thực tế (Actual) | Trạng thái |
| :--- | :---: | :--- | :---: | :---: | :---: |
| `FR12-DT-01` | DT | Admin token hợp lệ truy cập `GET /api/admin/users` | HTTP 200, mảng users | HTTP 200, mảng users | **PASS** |
| `FR12-DT-02` | DT | Thiếu Authorization header khi gọi `GET /api/admin/users` | HTTP 401, Access token required | HTTP 401, Access token required | **PASS** |
| `FR12-DT-03` | DT | Authorization header rỗng khi gọi `GET /api/admin/users` | HTTP 401, Access token required | HTTP 401, Access token required | **PASS** |
| `FR12-DT-04` | DT | Token sai tiền tố (thiếu 'Bearer ') | HTTP 403, Invalid or expired | HTTP 403, Invalid or expired | **PASS** |
| `FR12-DT-05` | DT | Token sai chữ ký HMAC Secret (Signature Mismatch) | HTTP 403, Invalid or expired | HTTP 403, Invalid or expired | **PASS** |
| `FR12-DT-06` | DT | Chuỗi JWT hỏng cú pháp (Malformed Token) | HTTP 403, Invalid or expired | HTTP 403, Invalid or expired | **PASS** |
| `FR12-DT-07` | DT | User thường truy cập `GET /api/admin/users` | HTTP 403, Forbidden | HTTP 200, mảng users | **FAIL** |
| `FR12-DT-08` | DT | User thường gọi `DELETE /api/admin/users/999` | HTTP 403, Forbidden | HTTP 200, User deleted | **FAIL** |
| `FR12-DT-09` | DT | Token chứa role không xác định (`guest`) | HTTP 403, Forbidden | HTTP 200, mảng users | **FAIL** |
| `FR12-DT-10` | DT | User thường truy cập hồ sơ chính mình `GET /api/users/me` | HTTP 200, user profile | HTTP 200, user profile | **PASS** |
| `FR12-DT-11` | DT | User tự nâng quyền thành admin qua `PUT /api/users/me` | HTTP 400 hoặc role ignored | HTTP 200, role: 'admin' | **FAIL** |
| `FR12-DT-12` | DT | Admin tạo danh mục mới qua `POST /api/categories` | HTTP 200/201, Category created | HTTP 200, Category created | **PASS** |
| `FR12-DT-13` | DT | User thường tạo danh mục qua `POST /api/categories` | HTTP 403, Forbidden | HTTP 200, Category created | **FAIL** |
| `FR12-DT-14` | DT | Admin xem toàn bộ đơn hàng `GET /api/admin/orders` | HTTP 200, orders array | HTTP 200, orders array | **PASS** |
| `FR12-DT-15` | DT | User thường xem danh sách đơn hàng `GET /api/admin/orders` | HTTP 403, Forbidden | HTTP 200, orders array | **FAIL** |
| `FR12-DT-16` | DT | Khách vãng lai (no auth) tạo sản phẩm `POST /api/products` | HTTP 401, Access token required | HTTP 201, Product created | **FAIL** |
| `FR12-DT-17` | DT | Admin tạo mã giảm giá `POST /api/coupons` | HTTP 201, Coupon created | HTTP 201, Coupon created | **PASS** |
| `FR12-DT-18` | DT | User thường tạo mã giảm giá `POST /api/coupons` | HTTP 403, Forbidden | HTTP 201, Coupon created | **FAIL** |
| `FR12-BVA-01` | BVA | JWT token đã hết hạn 1 giây (`exp = now - 1`) | HTTP 403, Invalid or expired | HTTP 403, Invalid or expired | **PASS** |
| `FR12-BVA-02` | BVA | JWT token vừa hết hạn đúng thời điểm (`exp = now`) | HTTP 403, Invalid or expired | HTTP 403, Invalid or expired | **PASS** |
| `FR12-BVA-03` | BVA | JWT token còn hạn 1 giây (`exp = now + 1`) | HTTP 200, mảng users | HTTP 200, mảng users | **PASS** |
| `FR12-BVA-04` | BVA | JWT token còn hạn 3600 giây (`exp = now + 3600`) | HTTP 200, mảng users | HTTP 200, mảng users | **PASS** |
| `FR12-BVA-05` | BVA | JWT token cực hạn tương lai (`exp = now + 10 năm`) | HTTP 200, mảng users | HTTP 200, mảng users | **PASS** |
| `FR12-BVA-06` | BVA | Admin xóa coupon với ID = 0 (LB-1 phi lý) | HTTP 404, Coupon not found | HTTP 404, Coupon not found | **PASS** |
| `FR12-BVA-07` | BVA | Admin xóa coupon với ID = 1 (LB biên hợp lệ) | HTTP 200 / 404 | HTTP 200 / 404 | **PASS** |
| `FR12-BVA-08` | BVA | Admin xóa coupon với ID = 2 (LB+1) | HTTP 200 / 404 | HTTP 200 / 404 | **PASS** |
| `FR12-BVA-09` | BVA | Admin xóa coupon với ID = 2147483647 (Max 32-bit INT) | HTTP 404, Coupon not found | HTTP 404, Coupon not found | **PASS** |
| `FR12-BVA-10` | BVA | Admin xóa coupon với ID = -1 (Extreme âm) | HTTP 404, Coupon not found | HTTP 404, Coupon not found | **PASS** |
| `FR12-BVA-11` | BVA | Khách tạo sản phẩm với `price = -1` (Extreme âm) | HTTP 401 hoặc 400 | HTTP 201, Product created | **FAIL** |
| `FR12-BVA-12` | BVA | Khách tạo sản phẩm với `price = 0` (LB-1 không hợp lệ) | HTTP 401 hoặc 400 | HTTP 201, Product created | **FAIL** |
| `FR12-BVA-13` | BVA | Khách tạo sản phẩm với `price = 1` (LB biên hợp lệ) | HTTP 401 Unauthorized | HTTP 201, Product created | **FAIL** |
| `FR12-BVA-14` | BVA | Khách tạo sản phẩm với `price = 999999999` (Extreme) | HTTP 401 Unauthorized | HTTP 201, Product created | **FAIL** |

Log thực thi chi tiết được lưu trữ làm minh chứng tại [HW2/evidence/FR-12/test-execution.log](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-12/test-execution.log).

---

## 4. Báo cáo lỗi phần mềm (Defect Triage)

Toàn bộ 11 ca kiểm thử thất bại được phân tích nguyên nhân gốc rễ và gom nhóm vào 3 lỗi phần mềm:

1. **[BUG-FR12-01](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR12-01.md)**: Backend middleware `authenticateToken` không kiểm tra vai trò admin và các route quản trị (`/api/admin/users`, `/api/admin/orders`, `/api/categories`, `/api/coupons`) thiếu role check dẫn đến người dùng thường truy cập và thực thi trái phép (Broken Access Control).
   - *Test cases phát hiện*: `FR12-DT-07`, `FR12-DT-08`, `FR12-DT-09`, `FR12-DT-13`, `FR12-DT-15`, `FR12-DT-18`.
   - *Mức độ*: **Critical** | *Độ ưu tiên*: **Immediate**.
2. **[BUG-FR12-02](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR12-02.md)**: Endpoint quản lý sản phẩm `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` bỏ quên middleware `authenticateToken`, cho phép khách vãng lai (unauthenticated) tạo/sửa/xóa sản phẩm trái phép và bypass validation.
   - *Test cases phát hiện*: `FR12-DT-16`, `FR12-BVA-11`, `FR12-BVA-12`, `FR12-BVA-13`, `FR12-BVA-14`.
   - *Mức độ*: **Critical** | *Độ ưu tiên*: **Immediate**.
3. **[BUG-FR12-03](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR12-03.md)**: Lỗ hổng gán tham số hàng loạt (Mass Assignment) tại `PUT /api/users/me` cho phép người dùng thường tự nâng quyền tài khoản thành Admin (`privilege escalation`).
   - *Test cases phát hiện*: `FR12-DT-11`.
   - *Mức độ*: **High** | *Độ ưu tiên*: **High**.

Tài liệu tổng hợp lỗi chi tiết: [bugs.vi.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/bugs.vi.md).

---

## 5. Phân tích khoảng trống của AI (AI Gap Analysis)

Bảng đối chiếu các điểm mà AI ban đầu đã bỏ sót hoặc gặp thách thức khi thiết kế và thực thi kiểm thử cho tính năng FR-12:

| Mục bị bỏ sót / Thách thức thực tế | Cách phát hiện | Vì sao AI bỏ sót ban đầu | Phân loại nguyên nhân (Category) | Cải tiến kỹ năng (Skill Fix) |
| :--- | :--- | :--- | :--- | :--- |
| **Nhầm lẫn giữa Xác thực (Authentication) và Phân quyền (Authorization)** | Thấy `authenticateToken` ở các route admin và nghĩ rằng đã được bảo vệ đầy đủ; khi chạy test thì user thường vẫn vào được 200 OK | AI bị thiên kiến ngữ nghĩa (Semantic Bias): nhìn thấy hàm mang tên "authenticate" kèm JWT thì giả định nó kiểm tra cả quyền hạn (admin vs user) | **Tool limitation** & **Inherent feature complexity** | Nâng cấp `domain-testing` và `test-execution-and-bugs` với quy tắc **Authorization vs Authentication Separation Rule**: luôn kiểm tra sự hiện diện của lệnh so khớp vai trò (`req.user.role === 'admin'`) độc lập với việc verify JWT signature. |
| **Nguy cơ phá hủy dữ liệu mồi cốt lõi (Destructive Test Fixture Mutation)** | Khi viết BVA cho `DELETE /api/admin/users/:id`, nếu xóa ID=1 hoặc ID=2 thì mất tài khoản Admin/User, làm gãy toàn bộ bộ test cho các lần chạy sau | AI có xu hướng áp dụng các giá trị biên danh định (1, 2) một cách cơ học mà không đánh giá tác động phụ (side effect) lên dữ liệu mồi cố định trong cơ sở dữ liệu | **Inherent feature complexity** | Bổ sung quy tắc **Test Fixture Immutability & Re-runnability Rule**: tuyệt đối không dùng ID của tài khoản test cố định cho các ca kiểm thử xóa phá hủy; chuyển mục tiêu sang các thực thể tạm thời độc lập (như coupons). |
| **Bỏ sót lỗ hổng leo quyền Mass Assignment ở endpoint thông thường** | Soát mã nguồn `PUT /api/users/me` thấy bóc tách biến `role` từ `req.body` đưa vào câu lệnh SQL UPDATE | Khi được giao kiểm thử FR-12 (Kiểm soát truy cập), AI có xu hướng chỉ nhìn vào các endpoint có tiền tố `/api/admin/*`, bỏ qua các endpoint thông thường của người dùng | **Prompt/input quality** & **Inherent feature complexity** | Bổ sung **Cross-Feature Privilege Escalation Audit Checklist** vào Stage 0: rà soát tất cả các endpoint cho phép cập nhật dữ liệu người dùng xem có nguy cơ over-posting/mass assignment ảnh hưởng tới trường `role` hay không. |
| **Lệch pha chuỗi thông báo phản hồi của SUT (SUT Specific Response String Matching)** | `POST /api/categories` trả về `{ "message": "Category created" }` nhưng spec ghi `"Category added successfully"`, khiến runner đánh giá BLOCKED giả tạo | AI ban đầu gán kỳ vọng theo ví dụ trong tài liệu đặc tả thay vì đối chiếu trực tiếp với chuỗi string thực tế trong mã nguồn backend | **Prompt/input quality** | Bổ sung quy tắc **SUT Exact String Alignment Rule**: đối chiếu chính xác chuỗi message trong route handler của mã nguồn trước khi sinh tệp testcase JSON để tránh lỗi assert sai biệt ngữ nghĩa nhỏ. |

---

## 6. Hạn chế của kỹ thuật kiểm thử miền và BVA trên FR-12

1. **Bản chất nhị phân / rời rạc của Kiểm soát truy cập**: Phân quyền hệ thống (Authorization) chủ yếu vận hành dựa trên các thuộc tính rời rạc (Role: `admin` vs `user` vs `unauthenticated`) và các quyết định nhị phân (Cho phép / Từ chối). Kỹ thuật Phân tích giá trị biên (BVA) vốn thiết kế cho các miền biến thiên liên tục có thứ tự nên không phát huy được sức mạnh trên các trường cốt lõi của Access Control, ngoại trừ các trường số phụ trợ (như timestamp `exp`, `price`, `id`).
2. **Lỗ hổng bắt nguồn từ tầng kiến trúc và Middleware**: Toàn bộ các lỗi nghiêm trọng nhất của FR-12 (`BUG-FR12-01`, `BUG-FR12-02`, `BUG-FR12-03`) xuất phát từ việc thiếu hụt middleware phân quyền hoặc thiết kế API lỏng lẻo (insecure design), không thể phát hiện nếu chỉ phân tích các điểm biên dữ liệu thông thường mà không có góc nhìn kiểm thử bảo mật chuyên sâu (Security Testing).
3. **Tính phụ thuộc ngữ cảnh người gọi (Caller Identity Context)**: Trong kiểm thử truy cập, cùng một request payload (ví dụ `GET /api/admin/users`) có thể là hợp lệ nếu người gửi là Admin nhưng lại là hành vi xâm nhập bất hợp pháp nếu người gửi là User thường. Điều này đòi hỏi ma trận kiểm thử phải luôn gắn liền ngữ cảnh danh tính với từng ca kiểm thử.
