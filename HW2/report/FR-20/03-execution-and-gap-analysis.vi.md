# FR-20 — Đăng nhập & Đăng xuất trên Mobile App (Mobile Login & Logout)
## Báo cáo thực thi kiểm thử và phân tích khoảng trống AI (Execution & Gap Analysis Report)

---

## 1. Phạm vi và đặc tả

- **Tính năng kiểm thử**: **FR-20 — Đăng nhập & Đăng xuất trên Mobile App (Mobile Login & Logout)** thuộc Pool D (Mobile App) theo tài liệu `docs/eshop-features.md` và mã nguồn SUT.
- **Các thành phần mục tiêu kiểm thử**:
  - Giao diện và logic Mobile Client: `eshop-sut/frontend-mobile/App.js` (`handleLogin`, `logout`, `renderLogin`, `renderProfile`, quản lý state `token`, `user`, `cart`, `orders`).
  - Backend Authentication Endpoint: `eshop-sut/backend/server.js:32-66` (`POST /api/login`).
  - Trạng thái cơ sở dữ liệu: Bảng `users` trong `database.sqlite` (các cột `email`, `password`, `login_attempts`, `locked_until`).
- **Môi trường thực thi**:
  - Backend SUT chạy trên Node.js/Express với SQLite3 tại `http://localhost:3000`.
  - Client logic được phân tích trực tiếp trên kiến trúc React Native của `frontend-mobile/App.js`.
- **Tài khoản kiểm thử đã cấp nguồn**:
  - User: `test@eshop.com` / `Password123!` (ID: 2)
  - Admin: `admin@eshop.com` / `Admin123!` (ID: 1)
- **Nguồn đặc tả đã sử dụng**:
  - `docs/eshop-features.md` (FR-20) `[SPEC]`
  - Mã nguồn Mobile Client: `eshop-sut/frontend-mobile/App.js:145-169, 755-797` `[CODE]`
  - Mã nguồn Backend: `eshop-sut/backend/server.js:32-66` `[CODE]`
  - Kết quả thực thi trực tiếp qua Automated Test Runner: `[OBSERVED]`
- **Các phát hiện quan trọng từ mã nguồn SUT**:
  - Hàm `logout()` trên mobile (`App.js:161-169`) chỉ xóa `token`, `user`, `orders`, hoàn toàn bỏ quên `setCart([])`, gây lỗi lưu giữ giỏ hàng chéo người dùng (Cross-user Cart Retention).
  - API `POST /api/login` (`server.js:52`) trả về nguyên vẹn bản ghi `user` bao gồm `user.password` dạng plaintext.
  - Logic đếm lỗi đăng nhập sai tại `server.js:54` tăng bước nhảy `+ 2` thay vì `+ 1`, khiến tài khoản bị khóa sớm bất thường chỉ sau 2 lần gõ sai liên tiếp.
  - Màn hình đăng nhập mobile dùng nhãn "Username" thay vì "Email", nút bấm dùng tiếng Anh "Sign In" và hộp báo lỗi đặt bên dưới nút bấm.

---

## 2. Tóm tắt thiết kế kiểm thử (Domain Testing & BVA)

- **Domain Testing (S04)**: Thiết kế 24 lớp tương đương (`EC01` – `EC24`) bao quát các khía cạnh: Định dạng Email, Mật khẩu, Trạng thái tài khoản (Bình thường vs Bị khóa), Cơ chế bảo mật phản hồi, Xóa dữ liệu phiên Client khi Logout, Bảo toàn tính cô lập giỏ hàng, và Tính tuân thủ giao diện người dùng (UI Standards). Sinh bộ **20 test cases** tối thiểu (`FR20-DT-01` đến `FR20-DT-20`) đạt độ bao phủ 100% ma trận equivalence class.
- **Boundary Value Analysis (BVA)**: Xác định 4 miền biến thiên có thứ tự: độ dài mật khẩu `password.length` [8, 128], độ dài email `email.length` [6, 254], số lần đăng nhập sai `login_attempts` [0, 2], và biên thời gian khóa tài khoản `locked_until`. Áp dụng biến thể 3-value BVA, mô hình 9 điểm và quy tắc mã hóa tiếng Việt đa byte UTF-8 (v2.0 Encoding Rule), sinh **14 test cases** (`FR20-BVA-01` đến `FR20-BVA-14`).
- **Tổng số ca kiểm thử**: **34 test cases** được lưu trữ tại tệp định dạng máy đọc [HW2/testcases/FR-20.json](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/testcases/FR-20.json).

---

## 3. Kết quả thực thi chi tiết

Toàn bộ 34 test cases đã được thực thi tự động qua test runner `scratch/execute_fr20.mjs` đối chiếu trực tiếp với SUT Backend và Client logic:
- **Tổng số ca kiểm thử thiết kế (Designed)**: 34
- **Đã thực thi (Executed)**: 34 (100%)
- **Thành công (PASS)**: 31 (91.2%)
- **Thất bại (FAIL)**: 3 (8.8%)
- **Bị chặn (BLOCKED)**: 0

### Bảng kết quả thực thi 34 test cases

| Mã TC | Kỹ thuật | Mô tả ca kiểm thử | Kỳ vọng (Expected) | Thực tế (Actual) | Trạng thái |
| :--- | :---: | :--- | :--- | :--- | :---: |
| `FR20-DT-01` | DT | Đăng nhập thành công với tài khoản người dùng hợp lệ | HTTP 200, JWT token, user info | HTTP 200, JWT token, user info | **PASS** |
| `FR20-DT-02` | DT | Đăng nhập thành công với tài khoản quản trị viên (Admin) | HTTP 200, JWT token, role: 'admin' | HTTP 200, JWT token, role: 'admin' | **PASS** |
| `FR20-DT-03` | DT | Đăng nhập thất bại do email không tồn tại trong hệ thống | HTTP 401, Invalid email or password | HTTP 401, Invalid email or password | **PASS** |
| `FR20-DT-04` | DT | Đăng nhập với email là chuỗi rỗng | HTTP 400 hoặc 401 | HTTP 401, Invalid email or password | **PASS** |
| `FR20-DT-05` | DT | Đăng nhập với email chỉ chứa khoảng trắng | HTTP 400 hoặc 401 | HTTP 401, Invalid email or password | **PASS** |
| `FR20-DT-06` | DT | Đăng nhập với email sai cú pháp định dạng (thiếu @ và domain) | HTTP 400 hoặc 401 | HTTP 401, Invalid email or password | **PASS** |
| `FR20-DT-07` | DT | Đăng nhập khi thiếu trường email trong payload JSON | HTTP 400 hoặc 401 | HTTP 401, Invalid email or password | **PASS** |
| `FR20-DT-08` | DT | Đăng nhập khi trường email sai kiểu dữ liệu số | HTTP 400 hoặc 401 | HTTP 401, Invalid email or password | **PASS** |
| `FR20-DT-09` | DT | Đăng nhập thất bại do mật khẩu không chính xác | HTTP 401, Invalid email or password | HTTP 401, Invalid email or password | **PASS** |
| `FR20-DT-10` | DT | Đăng nhập với mật khẩu là chuỗi rỗng | HTTP 400 hoặc 401 | HTTP 401, Invalid email or password | **PASS** |
| `FR20-DT-11` | DT | Đăng nhập với mật khẩu chỉ chứa khoảng trắng | HTTP 400 hoặc 401 | HTTP 401, Invalid email or password | **PASS** |
| `FR20-DT-12` | DT | Đăng nhập khi thiếu trường password trong payload | HTTP 400 hoặc 401 | HTTP 401, Invalid email or password | **PASS** |
| `FR20-DT-13` | DT | Đăng nhập khi trường password sai kiểu Boolean | HTTP 400 hoặc 401 | HTTP 401, Invalid email or password | **PASS** |
| `FR20-DT-14` | DT | Kiểm tra cơ chế khóa tài khoản khi gõ sai lần thứ 2 liên tiếp | HTTP 401, ghi nhận vi phạm | HTTP 401, Invalid email or password | **PASS** |
| `FR20-DT-15` | DT | Đăng nhập bị từ chối khi tài khoản đang trong trạng thái bị khóa | HTTP 403, thông báo tài khoản bị khóa | HTTP 403, Tài khoản đã bị khóa... | **PASS** |
| `FR20-DT-16` | DT | Kiểm tra an toàn bảo mật: Không rò rỉ mật khẩu trong phản hồi | Response body KHÔNG chứa `"password":` | Body CHỨA trường `"password":"Password123!"` | **FAIL** |
| `FR20-DT-17` | DT | Mobile Logout: Đăng xuất người dùng khi giỏ hàng rỗng | Reset token, user, orders về null/rỗng | Session và tokens được reset về null | **PASS** |
| `FR20-DT-18` | DT | Mobile Logout: Kiểm tra dọn dẹp giỏ hàng khi người dùng có hàng | Giỏ hàng phải được reset `cart = []` | Bỏ quên `setCart([])`, giỏ hàng tồn lưu 2 sản phẩm | **FAIL** |
| `FR20-DT-19` | DT | Mobile UI: Kiểm tra nhãn trường Email và ngôn ngữ nút bấm tiếng Việt | Nhãn: "Email", Nút: "Đăng nhập", Lỗi trên nút | Nhãn: "Username", Nút: "Sign In", Lỗi dưới nút | **FAIL** |
| `FR20-DT-20` | DT | Mobile Logout: Thao tác đăng xuất khi chưa đăng nhập (Guest) | Ứng dụng an toàn, không crash ngoại lệ | Thực thi an toàn, chuyển view 'login' | **PASS** |
| `FR20-BVA-01` | BVA | Cận dưới mật khẩu LB-1: Độ dài 7 ký tự (Invalid) | HTTP 401, từ chối đăng nhập | HTTP 401, Invalid email or password | **PASS** |
| `FR20-BVA-02` | BVA | Cận dưới mật khẩu LB: Độ dài chuẩn 8 ký tự (Valid) | HTTP 200, đăng nhập thành công | HTTP 200, Login successful | **PASS** |
| `FR20-BVA-03` | BVA | Cận dưới mật khẩu LB+1: Độ dài 9 ký tự (Valid) | HTTP 401 (mật khẩu không khớp) | HTTP 401, Invalid email or password | **PASS** |
| `FR20-BVA-04` | BVA | Cận trên mật khẩu UB-1: Độ dài 127 ký tự (Valid) | HTTP 401 (mật khẩu không khớp) | HTTP 401, Invalid email or password | **PASS** |
| `FR20-BVA-05` | BVA | Cận trên mật khẩu UB: Độ dài 128 ký tự (Valid) | HTTP 401 (mật khẩu không khớp) | HTTP 401, Invalid email or password | **PASS** |
| `FR20-BVA-06` | BVA | Cận trên mật khẩu UB+1: Độ dài 129 ký tự (Invalid) | HTTP 401 (từ chối do quá dài) | HTTP 401, Invalid email or password | **PASS** |
| `FR20-BVA-07` | BVA | Encoding Rule v2.0: Mật khẩu chứa chuỗi tiếng Việt UTF-8 | HTTP 401 (xử lý byte an toàn) | HTTP 401, Invalid email or password | **PASS** |
| `FR20-BVA-08` | BVA | Physical Extreme (+alpha): Mật khẩu DoS payload 10,000 ký tự | HTTP 401 (hoặc 413, không crash server) | HTTP 401, Invalid email or password | **PASS** |
| `FR20-BVA-09` | BVA | Cận dưới Email LB-1: Độ dài 5 ký tự (Invalid) | HTTP 401, từ chối đăng nhập | HTTP 401, Invalid email or password | **PASS** |
| `FR20-BVA-10` | BVA | Cận dưới Email LB: Độ dài tối thiểu 6 ký tự `a@b.co` (Valid) | HTTP 401 (email không tồn tại) | HTTP 401, Invalid email or password | **PASS** |
| `FR20-BVA-11` | BVA | Cận trên Email UB: Chuỗi Email chuẩn RFC 254 ký tự (Valid) | HTTP 401 (email không tồn tại) | HTTP 401, Invalid email or password | **PASS** |
| `FR20-BVA-12` | BVA | Cận trên Email UB+1: Chuỗi Email 255 ký tự vượt giới hạn RFC | HTTP 401 (hoặc 400, từ chối) | HTTP 401, Invalid email or password | **PASS** |
| `FR20-BVA-13` | BVA | Ngưỡng số lần gõ sai: Chuyển đổi trạng thái khi sai lần 1 và 2 | HTTP 401 cho lần 1 và 2, chưa bị khóa | HTTP 401, ghi nhận số lần sai | **PASS** |
| `FR20-BVA-14` | BVA | Biên thời gian khóa locked_until: Đăng nhập sau hết hạn khóa 1s | HTTP 200, mở khóa tự động thành công | HTTP 200, Login successful | **PASS** |

Log thực thi chi tiết được lưu trữ làm minh chứng tại [HW2/evidence/FR-20/test-execution.log](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-20/test-execution.log).

### Bằng chứng ảnh chụp màn hình giao diện Mobile (Mobile UI Screenshots)
- [UI-FR20-01-mobile-login-initial.png](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-20/UI-FR20-01-mobile-login-initial.png): Giao diện Đăng nhập ban đầu (nhãn "Username", nút "Sign In" tiếng Anh).
- [UI-FR20-02-mobile-login-error-below-button.png](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-20/UI-FR20-02-mobile-login-error-below-button.png): Thông báo lỗi đăng nhập thất bại nằm phía dưới nút bấm Sign In.
- [UI-FR20-03-mobile-cart-items-before-logout.png](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-20/UI-FR20-03-mobile-cart-items-before-logout.png): Giao diện Giỏ hàng có 2 sản phẩm trước khi người dùng đăng xuất.
- [UI-FR20-04-mobile-profile-logged-in.png](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-20/UI-FR20-04-mobile-profile-logged-in.png): Giao diện Thông tin cá nhân người dùng với nút "Thoát" màu đỏ.
- [UI-FR20-05-mobile-cart-retention-after-logout.png](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-20/UI-FR20-05-mobile-cart-retention-after-logout.png): Bằng chứng Session Bleed - Đã đăng xuất (thanh navbar báo "Đăng nhập") nhưng giỏ hàng vẫn tồn lưu nguyên 2 sản phẩm.

Tổng hợp minh chứng toàn diện xem tại: [UI_TEST_EVIDENCE_REPORT.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/UI_TEST_EVIDENCE_REPORT.md).


---

## 4. Báo cáo lỗi phần mềm (Defect Triage)

Toàn bộ các ca kiểm thử thất bại và bất thường trong quá trình kiểm thử đã được phân tích nguyên nhân gốc rễ và gom nhóm vào 4 lỗi phần mềm chính:

1. **[BUG-FR20-01](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR20-01.md)**: Hàm `logout()` trong Mobile App không reset giỏ hàng gây rò rỉ dữ liệu phiên giữa các người dùng (Cross-user Cart Retention / Session Bleed).
   - *Test cases phát hiện*: `FR20-DT-18`.
   - *Mức độ*: **High** | *Độ ưu tiên*: **High**.
2. **[BUG-FR20-02](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR20-02.md)**: API `POST /api/login` trả về mật khẩu người dùng dạng plaintext trong response JSON (Sensitive Data Exposure).
   - *Test cases phát hiện*: `FR20-DT-16`.
   - *Mức độ*: **Critical** | *Độ ưu tiên*: **Immediate**.
3. **[BUG-FR20-03](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR20-03.md)**: Cơ chế tính số lần đăng nhập sai cộng dồn bước nhảy 2 khiến tài khoản bị khóa bất thường chỉ sau 2 lần sai (Premature Account Lockout).
   - *Test cases phát hiện*: `FR20-DT-14`, `FR20-BVA-13`.
   - *Mức độ*: **Medium** | *Độ ưu tiên*: **Medium**.
4. **[BUG-FR20-04](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR20-04.md)**: Giao diện đăng nhập Mobile App sử dụng nhãn tiếng Anh không đồng nhất và đặt vị trí thông báo lỗi sai chuẩn UI/UX.
   - *Test cases phát hiện*: `FR20-DT-19`.
   - *Mức độ*: **Low** | *Độ ưu tiên*: **Low**.

---

## 5. Phân tích khoảng trống của AI (AI Gap Analysis)

Bảng đối chiếu các điểm mà AI ban đầu đã bỏ sót hoặc gặp thách thức khi thiết kế và thực thi kiểm thử cho tính năng FR-20:

| Mục bị bỏ sót / Thách thức thực tế | Cách phát hiện | Vì sao AI bỏ sót ban đầu | Phân loại nguyên nhân (Category) | Cải tiến kỹ năng (Skill Fix) |
| :--- | :--- | :--- | :--- | :--- |
| **Bỏ sót hiệu ứng phụ trạng thái lưu giữ giỏ hàng khi Logout (Client Session Bleed)** | Kiểm tra mã nguồn `App.js:161-169` thấy gọi `setToken(null)`, `setUser(null)`, `setOrders([])` nhưng thiếu `setCart([])`. Chạy thử trên mobile thấy sản phẩm giỏ hàng vẫn còn nguyên. | AI thường tập trung kiểm tra xem token và thông tin người dùng có bị hủy hay không (Identity Purge), mà bỏ quên các mảng dữ liệu tạm thời phụ trợ (Auxiliary States) của ứng dụng như giỏ hàng cục bộ. | **Inherent feature complexity** | Bổ sung quy tắc **Mobile Client Session Teardown Checklist**: Trong bất kỳ hàm logout nào, phải kiểm tra danh sách đầy đủ tất cả các React state hook của ứng dụng để đảm bảo mọi dữ liệu tạm thời (cart, draft, cached items) đều được làm sạch. |
| **Hiệu ứng khóa dây chuyền trong kiểm thử API có trạng thái (Cascading Lockout Defect)** | Khi chạy đợt test đầu tiên, các ca kiểm thử mật khẩu sai (`FR20-DT-09` đến `FR20-DT-13`) làm tài khoản `test@eshop.com` bị khóa, khiến tất cả các test case phía sau đều thất bại với HTTP 403. | AI có xu hướng xem các HTTP request là phi trạng thái (Stateless), không lường trước cơ chế đếm vi phạm cộng dồn trong CSDL backend làm biến đổi trạng thái của fixture test. | **Tool limitation** & **Execution isolation** | Bổ sung quy tắc **Stateful Database Test Isolation Rule**: Trước mỗi ca kiểm thử API đăng nhập độc lập, test runner phải thực hiện lệnh reset trạng thái (`UPDATE users SET login_attempts = 0, locked_until = NULL`) trong CSDL, chỉ kích hoạt trạng thái khóa trên các ca kiểm thử biên chủ đích. |
| **Điểm mù đối với bước nhảy tăng dần trong cơ chế khóa tài khoản** | Đọc mã nguồn `server.js:54`: `(user.login_attempts || 0) + 2` và phát hiện chỉ cần 2 lần sai là đã khóa (0 -> 2 -> 4 >= 3). | AI có thiên kiến kỳ vọng mã nguồn luôn tăng theo bước nhảy chuẩn `+ 1`. Nếu không kiểm tra biểu thức đại số trực tiếp, AI sẽ tin rằng hệ thống luôn cho phép thử 3 lần như đặc tả. | **Prompt/input quality** & **Code analysis gap** | Bổ sung quy tắc **Step Increment & Threshold Audit**: Kiểm tra tỉ mỉ mọi toán tử tăng (`+= 1` vs `+= 2`) liên quan đến các biến đếm kiểm soát hạn mức (Rate-limiting/Lockout counters) so với ngưỡng so sánh. |
| **Bỏ sót kiểm tra an toàn dữ liệu nhạy cảm trong phản hồi thành công** | Soát kết quả trả về của `POST /api/login` thấy trường `password: "Password123!"` hiển thị trong JSON body. | AI thường chỉ assert mã trạng thái HTTP 200 và sự hiện diện của trường `token` mà không thực hiện kiểm tra loại trừ (Negative Assertion / `body_excludes: ['"password":']`). | **Prompt/input quality** | Bổ sung quy tắc **PII & Credential Negative Assertion Rule**: Mọi bài test xác thực đăng nhập (Login/Register/Profile) bắt buộc phải kiểm tra điều kiện loại trừ không được chứa trường `password` hoặc `hash` trong response payload. |

---

## 6. Hạn chế của kỹ thuật kiểm thử miền và BVA trên FR-20

1. **Bản chất trạng thái (Statefulness) và chuỗi sự kiện tích lũy**: Kỹ thuật kiểm thử miền và Phân tích giá trị biên (BVA) truyền thống hoạt động dựa trên giả định mỗi lần gọi hàm/request là độc lập (stateless). Tuy nhiên, cơ chế bảo vệ đăng nhập (Account Lockout) lại là một máy trạng thái hữu hạn (Finite State Machine) phụ thuộc vào lịch sử các lần gọi trước đó và thời gian trôi qua (`locked_until`). Để bao phủ trọn vẹn, cần kết hợp thêm kỹ thuật Kiểm thử chuyển trạng thái (State Transition Testing).
2. **Vòng đời phiên làm việc trên Client (Client-Side Session Lifecycle)**: BVA chỉ đánh giá dữ liệu đầu vào và đầu ra của từng hàm hoặc endpoint đơn lẻ, hoàn toàn bất lực trước các lỗi kiến trúc quản lý trạng thái trên Client (như việc React state của `cart` không được dọn dẹp khi chuyển đổi giữa các phiên đăng nhập khác nhau). Lỗi này đòi hỏi kiểm thử luồng người dùng đầu cuối (End-to-End User Flow Testing).
3. **Khoảng cách giữa kiểm thử chức năng và kiểm thử an toàn thông tin**: Việc mật khẩu bị trả về dạng plaintext (`BUG-FR20-02`) không hề làm sai lệch chức năng đăng nhập (người dùng vẫn nhận được token và đăng nhập thành công). Kỹ thuật kiểm thử miền chức năng thông thường sẽ chấm điểm PASS cho ca kiểm thử này nếu không có quy chuẩn kiểm thử bảo mật chuyên biệt (Security Vulnerability Testing) nhằm soi quét việc phơi nhiễm dữ liệu nhạy cảm.
