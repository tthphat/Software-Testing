# Phân tích giá trị biên (Boundary Value Analysis) — FR-20: Tính năng Mobile (Đăng nhập & Đăng xuất)

> **Tính năng:** FR-20 — Mobile App (React Native): Đăng nhập & Đăng xuất (Login & Logout)  
> **Phân nhóm (Pool):** Pool D — Mobile App  
> **Kỹ thuật:** Phân tích giá trị biên (BVA) — Biến thể 3-value BVA, Mô hình 9 điểm (9-point Model) & Quy tắc mã hóa tiếng Việt UTF-8 (Encoding Boundary Rule v2.0)  
> **Phiên bản:** Hoàn chỉnh Stage 1 đến Stage 4 (Báo cáo phân tích & 14 Test Cases BVA)

---

## Stage 1 — Lựa chọn các miền có thứ tự (Select Ordered Partitions)

Áp dụng nguyên tắc BVA từ bài giảng S04 môn học CSC13003: Chỉ áp dụng phân tích giá trị biên trên các miền biến thiên **có thứ tự (Ordered Domains)**, bao gồm số lượng, độ dài chuỗi và thời gian.

### 1.1 Bảng xác định các miền có thứ tự

| Miền kiểm thử (Variable / Attribute) | Bản chất miền | Khoảng hợp lệ đóng `[LB, UB]` | Dạng bất đẳng thức mở | Bước nhảy nhỏ nhất (Smallest Step) | Nguồn dữ kiện (Source Tag) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `password.length` (Độ dài mật khẩu) | Độ dài chuỗi (Characters) | `[8, 128]` | `8 <= length <= 128` | 1 ký tự | `[SPEC]` §1.1, §1.2 |
| `email.length` (Độ dài email) | Độ dài chuỗi (Characters) | `[6, 254]` | `6 <= length <= 254` | 1 ký tự | `[SPEC]` RFC 5321/5322 |
| `login_attempts` (Số lần đăng nhập sai) | Số nguyên đếm (Integer count) | `[0, 2]` | `0 <= attempts < 3` | 1 lần | `[CODE]` `server.js:54-58` |
| `locked_until` (Thời hạn khóa tài khoản) | Mốc thời gian (Timestamp) | `[now - ∞, now]` | `locked_until <= now` | 1 giây (1s) | `[CODE]` `server.js:40` |

---

### 1.2 Danh mục các trường KHÔNG áp dụng BVA (BVA Not Applicable)

| Tên trường | Kiểu dữ liệu | Lý do kỹ thuật không áp dụng BVA |
| :--- | :---: | :--- |
| `user.role` | Enum string (`admin`, `user`) | Miền giá trị rời rạc định danh, không có thứ tự toán học lớn hơn / nhỏ hơn. Đã được bao phủ trong Domain Testing (`EC01`, `EC02`). |
| `token` (JWT string) | Chuỗi mã hóa Base64 / SHA256 | Chuỗi mật mã học vô hướng, không có khái niệm biên số học. |
| `email format` | Biểu thức chính quy (Regex) | Ngữ pháp văn cảnh (Context-free grammar), đã phân hoạch tương đương tại DT. |
| `session_state` | Trạng thái nhị phân (`GUEST`, `AUTHENTICATED`) | Thuộc tính trạng thái nhị phân rời rạc. |

---

## Stage 2 — Lựa chọn biến thể BVA và mô hình điểm kiểm thử (Choose BVA Variant)

### 2.1 Biến thể 3-value BVA (Chuẩn CSC13003 S04 & ISTQB)
Đối với mỗi biên hợp lệ $[LB, UB]$, biến thể **3-value BVA** khảo sát chính xác 3 giá trị tại mỗi biên:
- Tại biên dưới ($LB$): $LB - 1$ (ngoài khoảng - không hợp lệ), $LB$ (ngay tại biên - hợp lệ), $LB + 1$ (trong khoảng - hợp lệ).
- Tại biên trên ($UB$): $UB - 1$ (trong khoảng - hợp lệ), $UB$ (ngay tại biên - hợp lệ), $UB + 1$ (ngoài khoảng - không hợp lệ).

### 2.2 Mô hình 9 điểm (9-point Model) và Điểm cực hạn (Physical Extremes)
Đối với các trường chuỗi có nguy cơ tấn công DoS hoặc tràn bộ đệm:
- Điểm danh định (Nominal): Giá trị điển hình nằm giữa khoảng hợp lệ.
- Điểm cực tiểu vật lý ($- \alpha$ Extreme): Chuỗi rỗng `""` (độ dài 0).
- Điểm cực đại vật lý ($+ \alpha$ Extreme): Payload DoS 10,000 ký tự để kiểm tra sức chịu tải bộ nhớ của SUT.

### 2.3 Quy tắc mã hóa chuỗi tiếng Việt UTF-8 (Encoding Boundary Rule v2.0)
Tại biên trên của chuỗi văn bản, áp dụng một ca kiểm thử chứa đầy đủ ký tự tiếng Việt có dấu UTF-8 (2–3 bytes mỗi ký tự) để kiểm chứng Backend đo lường theo số ký tự (`string.length`) hay số bytes (`Buffer.byteLength`).

---

## Stage 3 — Thiết kế Test Cases BVA (Generate Test Cases)

| Mã TC | Biến kiểm thử | Điểm biên | Giá trị kiểm thử (Value) | Các tham số cố định | Kết quả mong đợi | Lỗi phần mềm code sẽ bắt được (Fault it catches) | Nguồn |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- | :---: |
| **FR20-BVA-01** | `password.length` | $LB - 1$ (7 ký tự) | `"Pass12!"` (7 chars) | `email: "test@eshop.com"` | HTTP 400 Bad Request ("Mật khẩu tối thiểu 8 ký tự") | Backend không kiểm tra độ dài tối thiểu của mật khẩu khi đăng nhập | `[SPEC]` |
| **FR20-BVA-02** | `password.length` | $LB$ (8 ký tự) | `"Pass123!"` (8 chars) | `email: "test@eshop.com"` | HTTP 200 OK (Đăng nhập thành công) | Nhầm lẫn dấu so sánh `>` thay vì `>=` tại cận dưới | `[SPEC]` |
| **FR20-BVA-03** | `password.length` | $LB + 1$ (9 ký tự) | `"Pass1234!"` (9 chars) | `email: "test@eshop.com"` | HTTP 200/401 xử lý chuẩn | Off-by-one lỗi lệch 1 đơn vị | `[SPEC]` |
| **FR20-BVA-04** | `password.length` | $UB - 1$ (127 ký tự) | Chuỗi ASCII 127 ký tự | `email: "test@eshop.com"` | HTTP 200/401 xử lý chuẩn | Tràn cận trên chuỗi mật khẩu | `[SPEC]` |
| **FR20-BVA-05** | `password.length` | $UB$ (128 ký tự) | Chuỗi ASCII 128 ký tự | `email: "test@eshop.com"` | HTTP 200/401 xử lý chuẩn | Nhầm lẫn dấu so sánh `<` thay vì `<=` tại cận trên | `[SPEC]` |
| **FR20-BVA-06** | `password.length` | $UB + 1$ (129 ký tự) | Chuỗi ASCII 129 ký tự | `email: "test@eshop.com"` | HTTP 400 Bad Request ("Mật khẩu vượt quá 128 ký tự") | Thiếu ràng buộc chặn mật khẩu quá dài gây tốn chi phí hash Bcrypt/Argon | `[SPEC]` |
| **FR20-BVA-07** | `password.length` | Encoding UTF-8 v2.0 | Chuỗi 128 ký tự tiếng Việt có dấu (`"MậtKhẩuViệtNam..."` = 250+ bytes) | `email: "test@eshop.com"` | Xử lý an toàn UTF-8 | Backend đo byte length thay vì char length gây cắt cụt mật khẩu | `[SPEC]` v2.0 |
| **FR20-BVA-08** | `password.length` | $+ \alpha$ Extreme | Chuỗi DoS 10,000 ký tự | `email: "test@eshop.com"` | HTTP 400 Bad Request (Payload Too Large) | Lỗ hổng DoS máy chủ qua payload xác thực cực lớn | `[CODE]` |
| **FR20-BVA-09** | `email.length` | $LB - 1$ (5 ký tự) | `"a@b.c"` (5 chars) | `password: "Test1234!"` | HTTP 400 Bad Request (Email quá ngắn) | Thiếu kiểm tra độ dài email hợp lệ | `[SPEC]` |
| **FR20-BVA-10** | `email.length` | $LB$ (6 ký tự) | `"a@b.co"` (6 chars) | `password: "Test1234!"` | Xử lý định dạng tối thiểu | Lỗi cắt cụt email cận dưới | `[SPEC]` |
| **FR20-BVA-11** | `email.length` | $UB$ (254 ký tự) | Chuỗi Email RFC 254 ký tự | `password: "Test1234!"` | Xử lý hợp lệ | Lỗi kích thước trường email trong CSDL SQLite | `[SPEC]` |
| **FR20-BVA-12** | `email.length` | $UB + 1$ (255 ký tự) | Chuỗi Email 255 ký tự | `password: "Test1234!"` | HTTP 400 Bad Request (Email vượt quá giới hạn) | Thiếu validation độ dài tối đa email | `[SPEC]` |
| **FR20-BVA-13** | `login_attempts` | Ngưỡng khóa SUT | Gõ sai mật khẩu lần 2 (`newAttempts = 4 >= 3`) | `email: "test@eshop.com"` | Khóa tài khoản ngay tại lần gõ sai thứ 2 | Lỗi logic `+2` mỗi lần sai khiến ngưỡng 3 lần bị kích hoạt sớm ở lần 2 | `[CODE]` `server.js:54` |
| **FR20-BVA-14** | `locked_until` | Time Boundary (Hết khóa) | Đăng nhập sau khi hết hạn khóa 1 giây (`now - 1s`) | `email: "test@eshop.com"` | HTTP 200 OK (Mở khóa đăng nhập lại) | So sánh thời gian `<` vs `<=` khiến tài khoản bị khóa vĩnh viễn | `[CODE]` `server.js:40` |

---

## Stage 4 — Tự kiểm tra (Self-Check Checklist)

- [x] Mọi biên đều có Source tag rõ ràng (`[SPEC]`, `[CODE]`).
- [x] Mỗi ca kiểm thử chỉ thay đổi duy nhất một biến, các biến còn lại giữ ở giá trị danh định (Single-fault assumption).
- [x] Không bịa biên cho các trường phân loại rời rạc (enum, role, boolean).
- [x] Áp dụng đầy đủ biến thể 3-value BVA, mô hình 9 điểm và quy tắc Encoding UTF-8 tiếng Việt v2.0.
- [x] Dữ liệu chuỗi được tính toán độ dài chính xác bằng ký tự và bytes.
- [x] Toàn bộ 14 ca kiểm thử đã được tích hợp vào tệp máy đọc [HW2/testcases/FR-20.json](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/testcases/FR-20.json), nâng tổng số test cases của FR-20 lên **34 ca kiểm thử (20 DT + 14 BVA)**.
