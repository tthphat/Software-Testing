# FR-12: Phân tích giá trị biên (Boundary Value Analysis - BVA) — Kiểm soát truy cập (Access Control)

## Giới thiệu & Căn cứ kỹ thuật

Kỹ thuật **Phân tích giá trị biên (Boundary Value Analysis - BVA)** được áp dụng dựa trên quan sát thực nghiệm trong kiểm thử phần mềm: lỗi lập trình thường tập trung dày đặc tại các điểm biên của phân hoạch tương đương (do nhầm lẫn giữa `<` và `<=`, lỗi lệch 1 đơn vị *off-by-one*, hoặc gõ nhầm cận giá trị).

- **Tài liệu tham chiếu:** Slide bài giảng môn học CSC13003 (S04), Giáo trình ISTQB Foundation Level, Tài liệu đặc tả kỹ thuật `eshop-features.md`.
- **Đặc thù tính năng FR-12:** Theo tài liệu chỉ dẫn `references/eshop-features.md`:
  > *"Tính năng này chủ yếu là bài toán 'tập các giá trị được xử lý khác nhau' (vai trò roles) và bài toán 'bắt buộc phải là' (mang token hợp lệ). Tính năng có rất ít miền có thứ tự, do đó phân tích giá trị biên chủ yếu áp dụng cho thời gian hết hạn của token (`token.exp`) và tham số ID của tài nguyên quản trị. Cần nêu rõ điều này trong báo cáo thay vì ép buộc tạo ra các biên giả tạo."*
- **Tiền đề:** Đã hoàn thành phân hoạch tương đương tại [`report/FR-12/01-domain-testing.vi.md`](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/HW2/report/FR-12/01-domain-testing.vi.md) và bộ test case cơ sở tại [`testcases/FR-12.json`](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/HW2/testcases/FR-12.json).

---

## Stage 1: Xác định các miền có thứ tự và các trường áp dụng / không áp dụng BVA

BVA chỉ áp dụng trên **các miền giá trị có quan hệ thứ tự rõ ràng (Ordered Domains)** như mốc thời gian (timestamp), số nguyên ID, số lượng, hoặc độ dài chuỗi. Tuyệt đối không ép buộc tạo biên giả tạo cho các tập giá trị rời rạc, phân loại hoặc logic boolean.

### 1.1 Bảng các phân hoạch có thứ tự áp dụng BVA

| EC ID liên quan | Biến kiểm thử | Thuộc tính có thứ tự | Khoảng hợp lệ `[LB, UB]` | Cách đọc dạng Đóng & Mở | Bước nhỏ nhất (Unit/Step) | Nguồn gốc | Ghi chú kỹ thuật |
| :--- | :--- | :--- | :---: | :--- | :---: | :---: | :--- |
| **EC14, EC15** | `token.exp` | Mốc thời gian hết hạn JWT (UNIX Timestamp tính bằng giây) | `[T_now, +inf)` | • **Dạng đóng:** `exp >= T_now`<br>• **Dạng mở:** `exp > T_now - 1` | 1 giây (1s) | `[CODE]` server.js:106<br>`[SPEC]` JWT RFC 7519 | $T_{\text{now}}$ là thời điểm server xác thực token. Token có `exp < T_now` sẽ bị thư viện `jsonwebtoken` từ chối bằng `TokenExpiredError` $\rightarrow$ HTTP 403 Forbidden. |
| **EC10, EC13** | `param.id` | Mã định danh coupon trong URL (`DELETE /api/admin/coupons/:id`) | `[1, +inf)` | • **Dạng đóng:** `id >= 1`<br>• **Dạng mở:** `id > 0` | 1 đơn vị | `[CODE]` server.js:483<br>`[SPEC]` §6.4 | ID coupon là số nguyên tự tăng (`id >= 1`). LB = 1 là coupon đầu tiên. LB - 1 = 0 là ID không hợp lệ. |
| **EC12** *(Mở rộng)* | `product.price` | Giá sản phẩm khi tạo qua `POST /api/products` (Route không có Auth) | `[0, +inf)` | • **Dạng đóng:** `price >= 0`<br>• **Dạng mở:** `price > -1` | 1 VND | `[SPEC]` §3.3<br>`[CODE]` server.js:167 | Kiểm thử biên của lỗ hổng bỏ quên xác thực trên Product Write: kẻ tấn công có thể chèn giá âm (`-1`) hoặc giá 0. |
| **EC12** *(Mở rộng)* | `product.stock` | Số lượng tồn kho khi tạo qua `POST /api/products` | `[0, +inf)` | • **Dạng đóng:** `stock >= 0`<br>• **Dạng mở:** `stock > -1` | 1 đơn vị | `[SPEC]` §3.3<br>`[CODE]` server.js:167 | Kiểm thử cận dưới số lượng hàng tồn kho. |
| **EC12** *(Mở rộng)* | `product.name.length` | Độ dài tên sản phẩm bằng tiếng Việt UTF-8 | `[1, 100]` | • **Dạng đóng:** `1 <= length <= 100`<br>• **Dạng mở:** `0 < length < 101` | 1 ký tự | `[ASSUMED]` (v2.0 Encoding Rule) | Áp dụng quy tắc UTF-8 Encoding Rule v2.0: kiểm tra xử lý chuỗi tiếng Việt có dấu tại cận trên UB = 100. |

---

### 1.2 Danh sách các trường KHÔNG ÁP DỤNG BVA (Kèm lý do minh bạch)

Tuân thủ hướng dẫn tại `SKILL.md` và `eshop-features.md`, không tự bịa đặt các biên không có cơ sở thứ tự:

| Biến / Ràng buộc | Lý do KHÔNG áp dụng BVA |
| :--- | :--- |
| **`role` (admin, user, guest)** | Vai trò là tập phân loại rời rạc (Categorical Enum), không có quan hệ thứ tự hơn/kém toán học. Đã được kiểm thử đầy đủ qua Domain Testing tại `EC07, EC08, EC09`. |
| **Định dạng `Authorization` Header** | Tiền tố `"Bearer "` hay `"Basic "` là bài toán so khớp mẫu chuỗi (Pattern matching / Scheme syntax), không có miền số học liên tục. Đã kiểm thử tại `EC01, EC03, EC04`. |
| **Chữ ký JWT Signature** | Chữ ký số HMAC-SHA256 là chuỗi mã hóa mật mã học (Cryptographic hash); một sự thay đổi nhỏ cũng làm hỏng chữ ký, không có khái niệm "lân cận biên chữ ký". Đã kiểm thử tại `EC05`. |
| **Cấu trúc JWT (3 phần)** | Định dạng phân tách bởi 2 dấu chấm (`header.payload.signature`) là cú pháp định dạng cố định, không có thứ tự. Đã kiểm thử tại `EC06`. |
| **HTTP Methods (`GET, POST, PUT, DELETE`)** | Các phương thức HTTP là các động từ giao thức rời rạc, không áp dụng thứ tự số học. |
| **`user_status` (Active / Deleted)** | Biến trạng thái nhị phân chỉ nhận giá trị tồn tại hoặc đã bị xóa khỏi database, không có quan hệ thứ tự. |

---

## Stage 2: Lựa chọn biến thể BVA (3-value) và Thống kê số lượng điểm kiểm thử

### 2.1 Biến thể được chọn: **3-value BVA** kết hợp Mô hình 9 điểm và Quy tắc mã hóa UTF-8

Với một khoảng giá trị hợp lệ `[LB, UB]`, kỹ thuật **3-value BVA** xét 3 điểm tại mỗi biên:
- **Cận dưới (LB):** `{ LB - 1 (Invalid), LB (Valid), LB + 1 (Valid) }`
- **Cận trên (UB):** `{ UB - 1 (Valid), UB (Valid), UB + 1 (Invalid) }`

#### Lý do chọn biến thể 3-value:
1. **Phát hiện lỗi sai toán tử hai phía:** Khác với 2-value (chỉ xét 1 điểm ngoài và 1 điểm tại biên), 3-value xét thêm điểm lân cận bên trong (`LB + 1` và `UB - 1`), giúp bắt gọn các lỗi lập trình so sánh nhầm (ví dụ: `exp > now` thay vì `exp >= now`, hoặc `id > 1` thay vì `id >= 1`).
2. **Tuân thủ chuẩn môn học CSC13003:** Khớp với slide bài giảng S04 và chuẩn ISTQB Advanced.
3. **Mở rộng mô hình 9 điểm (9-point model) & Quy tắc mã hóa tiếng Việt UTF-8 (v2.0):**
   - Bổ sung điểm cực trị $-\alpha$ (ví dụ: `exp = 0` Epoch 1970, `id = -1`, `price = -1`).
   - Bổ sung điểm cực trị $+\alpha$ (ví dụ: `exp = 2147483647` - Year 2038 Problem, `id = 999999999`).
   - Bổ sung ca kiểm thử chuỗi tiếng Việt có dấu UTF-8 tại cận trên UB để kiểm tra sự khác biệt giữa `Buffer.byteLength` (số byte) và `string.length` (số ký tự).

---

### 2.2 Bảng chi tiết các điểm giá trị biên cần kiểm thử

#### 1. Thời gian hiệu lực Token `token.exp` (Biên tại thời điểm kiểm tra $T_{\text{now}}$):
- `LB - 1 = T_now - 1s`: Token vừa hết hạn cách đây đúng 1 giây $\rightarrow$ **Invalid** (HTTP 403 Forbidden).
- `LB = T_now`: Token có thời điểm hết hạn trùng khớp giây hiện tại $\rightarrow$ **Boundary Point** (Kiểm tra xem dấu so sánh là `>` hay `>=`).
- `LB + 1 = T_now + 1s`: Token còn hiệu lực đúng 1 giây $\rightarrow$ **Valid** (HTTP 200 OK nếu là Admin).
- **Điểm cực trị $-\alpha$:** `exp = 0` (00:00:00 UTC 01/01/1970 - Mốc Unix Epoch) $\rightarrow$ **Extreme Invalid** (Hết hạn sâu trong quá khứ).
- **Điểm cực trị $+\alpha$:** `exp = 2147483647` (03:14:07 UTC 19/01/2038 - Giới hạn số nguyên 32-bit có dấu) $\rightarrow$ **Extreme Valid** (Hiệu lực vĩnh cửu trong tương lai).

#### 2. Tham số `id` trong URL Admin (`DELETE /api/admin/coupons/:id`):
- `LB - 1 = 0`: `id = 0` (ID không hợp lệ) $\rightarrow$ **Invalid**.
- `LB = 1`: `id = 1` (Coupon ID đầu tiên) $\rightarrow$ **Valid Boundary** (Xóa coupon thành công).
- `LB + 1 = 2`: `id = 2` (Coupon ID kế tiếp) $\rightarrow$ **Valid** (Xóa coupon thành công).
- **Điểm cực trị $-\alpha$:** `id = -1` (Số nguyên âm) $\rightarrow$ **Extreme Invalid**.
- **Điểm cực trị $+\alpha$:** `id = 999999999` (ID cực lớn không tồn tại) $\rightarrow$ **Extreme Non-existent**.

#### 3. Các tham số nghiệp vụ trên Route ghi sản phẩm mở (`POST /api/products`):
- `price` tại cận dưới 0: `price = -1` (LB-1, Invalid), `price = 0` (LB, Valid), `price = 1` (LB+1, Valid).
- `stock` tại cận dưới 0: `stock = 0` (LB, Hết hàng), `stock = -1` (LB-1, Invalid).
- `name.length` tại UB = 100 với tiếng Việt có dấu: Chuỗi 100 ký tự có dấu `"Sản phẩm thử nghiệm kiểm tra mã hóa tiếng Việt chất lượng cao dành cho quản trị viên hệ thống..."` để kiểm chứng giới hạn buffer.

---

### 2.3 Thống kê số lượng điểm biên

- **Số biến có miền thứ tự áp dụng:** 4 biến (`token.exp`, `param.id`, `product.price`, `product.name.length`).
- **Tổng số ca kiểm thử BVA thiết kế:** **14 ca kiểm thử** (`FR12-BVA-01` đến `FR12-BVA-14`).
- Tích hợp trực tiếp vào tệp máy đọc [`testcases/FR-12.json`](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/HW2/testcases/FR-12.json) nâng tổng số ca kiểm thử của FR-12 lên **32 ca kiểm thử** (18 DT + 14 BVA).

---

## Stage 3: Thiết kế các ca kiểm thử giá trị biên (BVA Test Cases)

### 3.1 Quy tắc thiết kế (Theo slide môn học S04 & ISTQB)
1. **Biến thiên từng biến một (One variable at a time):** Khi biến thiên giá trị biên của một trường mục tiêu, tất cả các trường dữ liệu còn lại được giữ nguyên ở giá trị danh định hợp lệ (Nominal Valid Values).
2. **Bắt lỗi cụ thể (Fault it would catch):** Mỗi ca kiểm thử biên đều chỉ rõ khiếm khuyết lập trình hoặc lỗi cấu hình mà ca kiểm thử đó có khả năng bẫy được.

---

### 3.2 Bảng danh sách 14 Test Case BVA chi tiết (FR12-BVA-01 đến FR12-BVA-14)

| TC ID | Biến kiểm thử | Điểm biên | Giá trị kiểm thử | Các tham số khác (Danh định) | Kỳ vọng đầu ra | Lỗi code sẽ bắt được (Fault it would catch) | Nguồn gốc |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- | :---: |
| **FR12-BVA-01** | `token.exp` | $T_{\text{now}} - 1s$ | Token có `exp = now - 1` | `GET /api/admin/users`, header Bearer | HTTP 403 Forbidden `{"error": "Forbidden"}` | Lập trình viên nhầm toán tử so sánh `exp <= now` thành `<` khiến token vừa hết hạn 1s vẫn lọt qua | `[CODE]` server.js:106 |
| **FR12-BVA-02** | `token.exp` | $T_{\text{now}}$ | Token có `exp = now` | `GET /api/admin/users`, header Bearer | HTTP 403 hoặc 200 (Tùy giải thuật so sánh JWT) | Bắt lỗi xử lý thời gian chính xác tại giây chuyển giao giữa hiệu lực và hết hạn | `[CODE]` server.js:106 |
| **FR12-BVA-03** | `token.exp` | $T_{\text{now}} + 1s$ | Token có `exp = now + 1` | `GET /api/admin/users`, header Bearer, role admin | HTTP 200 OK | Token còn hiệu lực 1s bị từ chối sớm do đồng hồ hệ thống bị lệch (Clock skew defect) | `[CODE]` server.js:106 |
| **FR12-BVA-04** | `token.exp` | Cực trị $-\alpha$ | Token có `exp = 0` (Epoch 1970) | `GET /api/admin/users`, header Bearer | HTTP 403 Forbidden | Server coi giá trị `0` là falsy rồi bỏ qua bước kiểm tra hết hạn | `[CODE]` server.js:106 |
| **FR12-BVA-05** | `token.exp` | Cực trị $+\alpha$ | Token có `exp = 2147483647` (Năm 2038) | `GET /api/admin/users`, header Bearer, role admin | HTTP 200 OK | Lỗi tràn số nguyên 32-bit (Year 2038 problem) làm timestamp chuyển thành số âm và bị hiểu nhầm là hết hạn | `[CODE]` server.js:106 |
| **FR12-BVA-06** | `param.id` | $LB - 1 = 0$ | `:id = 0` | `DELETE /api/admin/coupons/0`, auth admin | HTTP 200, 400 hoặc 404 | SQL UPDATE/DELETE thực thi với ID=0 gây lỗi logic hoặc cập nhật nhầm bản ghi không mong muốn | `[CODE]` server.js:483 |
| **FR12-BVA-07** | `param.id` | $LB = 1$ | `:id = 1` (Coupon 1) | `DELETE /api/admin/coupons/1`, auth admin | HTTP 200 OK `{"message": "Coupon deleted"}` | Xác nhận chức năng xóa coupon hoạt động bình thường tại cận dưới hợp lệ đầu tiên | `[CODE]` server.js:483 |
| **FR12-BVA-08** | `param.id` | $LB + 1 = 2$ | `:id = 2` (Coupon 2) | `DELETE /api/admin/coupons/2`, auth admin | HTTP 200 OK `{"message": "Coupon deleted"}` | Xác nhận chức năng xóa coupon hoạt động bình thường tại cận trên lân cận | `[CODE]` server.js:483 |
| **FR12-BVA-09** | `param.id` | Cực trị $-\alpha$ | `:id = -1` | `DELETE /api/admin/coupons/-1`, auth admin | HTTP 200, 400 hoặc 404 | Không kiểm tra số âm trong route param, SQLite nhận câu lệnh xóa không an toàn | `[CODE]` server.js:483 |
| **FR12-BVA-10** | `param.id` | Cực trị $+\alpha$ | `:id = 999999999` | `DELETE /api/admin/coupons/999999999`, auth admin | HTTP 200 hoặc 404 | Lỗi tràn số nguyên trong tầng controller hoặc SQLite | `[CODE]` server.js:483 |
| **FR12-BVA-11** | `product.price` | $LB = 0$ | `price = 0` | `POST /api/products`, body JSON không auth | `[SPEC]` HTTP 401<br>*(SUT: 200, tạo sp 0đ)* | Bắt lỗi nghiệp vụ cho phép tạo sản phẩm miễn phí 0 đồng trên route không có bảo vệ xác thực | `[SPEC]` §3.3 |
| **FR12-BVA-12** | `product.price` | $LB - 1 = -1$ | `price = -1` | `POST /api/products`, body JSON không auth | `[SPEC]` HTTP 400/401<br>*(SUT: 200, tạo sp giá âm)* | Thiếu kiểm tra số âm kết hợp với thiếu xác thực, cho phép hacker tạo sản phẩm phá hoại hệ thống | `[SPEC]` §3.3 |
| **FR12-BVA-13** | `product.stock` | $LB = 0$ | `stock = 0` | `POST /api/products`, body JSON không auth | `[SPEC]` HTTP 401<br>*(SUT: 200, tạo sp hết hàng)* | Bắt lỗi xử lý trạng thái hết hàng ban đầu | `[SPEC]` §3.3 |
| **FR12-BVA-14** | `name.length` (UTF-8) | $UB = 100$ | Chuỗi tiếng Việt 100 ký tự có dấu | `POST /api/products`, body JSON không auth | `[SPEC]` HTTP 401<br>*(SUT: 200, lưu trọn vẹn chuỗi)* | Phân biệt Buffer.byteLength (chiếm 200+ bytes) vs string.length (100 ký tự), chống lỗi cắt cụt chuỗi tiếng Việt | `[ASSUMED]` v2.0 Encoding Rule |

---

## Stage 4: Tự kiểm tra & Đánh giá hạn chế kỹ thuật (Self-check & Blind spots)

### 4.1 Bảng tự kiểm tra chất lượng BVA
- [x] **Tính độc lập của biến:** Mỗi ca kiểm thử chỉ biến thiên một giá trị biên duy nhất; các trường dữ liệu khác đều được giữ ở trạng thái danh định.
- [x] **Không bịa đặt biên cho miền không thứ tự:** Đã giải thích rõ ràng và minh bạch trong Mục 1.2 về các trường không áp dụng BVA (`role`, JWT signature, Scheme header).
- [x] **Tuân thủ biến thể 3-value và mô hình 9 điểm:** Kiểm thử đầy đủ các điểm $LB-1, LB, LB+1, UB-1, UB, UB+1$ và cực trị $-\alpha, +\alpha$.
- [x] **Tích hợp quy tắc mã hóa Unicode tiếng Việt (v2.0):** Ca kiểm thử `FR12-BVA-14` kiểm tra xử lý chuỗi UTF-8 có dấu tại cận trên 100 ký tự.
- [x] **Gắn nhãn nguồn và bắt lỗi cụ thể:** Cột "Lỗi code sẽ bắt được" chỉ rõ các lỗ hổng off-by-one, nhầm lẫn toán tử hoặc thiếu xác thực.

### 4.2 Hạn chế của BVA đối với bài toán Phân quyền & Kiểm soát truy cập
1. **Bản chất của bài toán Kiểm soát truy cập là Phân loại (Categorical), không phải Số học (Arithmetic):** Hầu hết các lỗi phân quyền nghiêm trọng nhất (như thiếu kiểm tra `role === 'admin'` hay bỏ quên middleware trên route `POST /api/products`) đều xuất phát từ lỗi kiến trúc và phân loại, vốn được phát hiện hiệu quả nhất bởi Domain Testing chứ không phải BVA.
2. **Sự phụ thuộc vào đồng hồ hệ thống (Clock-skew Limitation):** Các ca kiểm thử thời gian hết hạn (`token.exp` tại `now-1s` và `now+1s`) có thể chịu ảnh hưởng bởi độ lệch mili-giây giữa máy chạy kiểm thử và máy chủ SUT nếu không có cơ chế đóng băng thời gian (time-mocking).

---

> **⏸️ DỪNG TẠI ĐÂY — Chờ sinh viên duyệt BVA Stage 1 đến Stage 4 (Bộ 14 ca kiểm thử BVA FR12-BVA-01 đến FR12-BVA-14) trước khi chuyển sang kỹ thuật tiếp theo: Test Execution & Bugs.**
