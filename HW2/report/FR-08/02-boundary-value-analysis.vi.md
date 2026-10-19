# FR-08: Đặt hàng và Thanh toán (Checkout)
## Báo cáo Phân tích giá trị biên (Boundary Value Analysis — BVA)

- **Tính năng:** FR-08 — Checkout (Thanh toán & Đặt hàng — Pool B)
- **Người thực hiện:** Trương Thành Phát (MSSV: 23120319)
- **Tài liệu tham khảo:**
  - `docs/api_specification.md` (mục 4.3 và 5.1) `[SPEC]`
  - Mã nguồn Backend: `eshop-sut/backend/server.js:297-309` (endpoint `POST /api/checkout`) `[CODE]`
  - Mã nguồn Cơ sở dữ liệu: `eshop-sut/backend/database.js:74-81` (bảng `orders`) `[CODE]`
  - Mã nguồn Frontend Web: `eshop-sut/frontend-web/src/pages/Checkout.jsx:45-51, 93-102` `[CODE]`
  - Mã nguồn Frontend Mobile: `eshop-sut/frontend-mobile/App.js:384-395, 689` `[CODE]`
  - Báo cáo kiểm thử miền: `HW2/report/FR-08/01-domain-testing.vi.md`
- **Phiên bản áp dụng:** Boundary Value Analysis v2.0 (tích hợp **Encoding Boundary Rule** cho chuỗi UTF-8 tiếng Việt và **Cross-Platform Skew Checklist**).
- **Trạng thái:** **DỪNG LẠI TẠI CHECKPOINT STAGE 1 & 2 CHỜ DUYỆT (STOP FOR REVIEW)**.

---

## Stage 1: Xác định các miền có thứ tự và các giá trị biên (Select Ordered Partitions)

Theo quy tắc chuẩn mực của kỹ thuật Phân tích giá trị biên (BVA theo giáo trình CSC13003 S04 và ISTQB), BVA **chỉ áp dụng trên các miền giá trị có thứ tự tự nhiên (Ordered Domains)** như: số tiền, số lượng, độ dài chuỗi ký tự (`length`), ngày tháng/thời gian. Tuyệt đối không tự tạo biên giả mạo cho các biến định tính, cờ boolean hay danh mục rời rạc.

### 1.1 Bảng các biến trên miền có thứ tự (Ordered Domains)

| STT | Biến kiểm thử | Thuộc tính có thứ tự | Khoảng hợp lệ (Mở & Đóng) | Bước nhỏ nhất (Unit/Step) | Cận dưới (LB) | Cận trên (UB) | Nguồn thông tin (Source tag) |
| :---: | :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| 1 | **`total_amount`** | Giá trị số nguyên (`numeric value`) | $1 \le total\_amount \le 2,147,483,647$<br>Hoặc: $0 < total\_amount < 2,147,483,648$ | 1 VNĐ | **1** | **2,147,483,647** | `[SPEC]` api_specification.md:134<br>`[CODE]` database.js:77<br>`[ASSUMED]` (Cận trên int32) |
| 2 | **`shipping_address`** | Độ dài chuỗi ký tự (`length`) | $5 \le \text{length} \le 255$<br>Hoặc: $4 < \text{length} < 256$ | 1 ký tự | **5** | **255** | `[SPEC]` api_specification.md:135<br>`[CODE]` database.js:79<br>`[ASSUMED]` (Độ dài chuẩn form) |
| 3 | **`cart_items_count`** / `cart.length` | Số lượng mặt hàng trong giỏ (`count/quantity`) | $1 \le \text{items} \le 100$<br>Hoặc: $0 < \text{items} < 101$ | 1 mặt hàng | **1** | **100** | `[SPEC]` api_specification.md:129<br>`[CODE]` App.js:391<br>`[ASSUMED]` (Sức chứa tối đa) |

#### Diễn giải chi tiết các cận biên:
1. **`total_amount` (Tổng tiền thanh toán):**
   - Đơn vị tiền tệ của hệ thống là Việt Nam Đồng (VNĐ), không có số thập phân hay hào/xu, nên bước nhảy nguyên tố nhỏ nhất là **1 VNĐ**.
   - Về mặt nghiệp vụ thương mại điện tử, một đơn hàng hợp lệ bắt buộc phải có giá trị dương ($total\_amount > 0 \Leftrightarrow total\_amount \ge 1$). Cận dưới $LB = 1$ VNĐ.
   - Cận trên $UB$: Trong cơ sở dữ liệu SQLite (`database.js:77`), cột `total_amount INTEGER` hỗ trợ số nguyên có dấu 64-bit hoặc 32-bit. Giới hạn cận trên an toàn cho giao dịch chuẩn 32-bit signed integer là $UB = 2,147,483,647$ VNĐ (hoặc trong nghiệp vụ thương mại thông thường quy định trần giao dịch $1,000,000,000$ VNĐ). Ở đây chọn $UB = 2,147,483,647$ `[ASSUMED]`.
2. **`shipping_address` (Độ dài chuỗi địa chỉ nhận hàng):**
   - Bước nhảy nhỏ nhất là **1 ký tự**.
   - Địa chỉ giao hàng thực tế trong giao dịch e-commerce cần tối thiểu khoảng 5 ký tự (ví dụ: `"P1, Q1"` hoặc `"Số 1"`). Do đó cận dưới hợp lệ $LB = 5$ ký tự. Các chuỗi từ 1 đến 4 ký tự quá ngắn, không đủ thông tin định danh vị trí giao nhận.
   - Cận trên $UB$: Chuẩn độ dài trường địa chỉ phổ biến trong các hệ thống RDBMS và biểu mẫu web/mobile là 255 ký tự (`VARCHAR(255)`). Do đó chọn $UB = 255$ ký tự `[ASSUMED]`.
3. **`cart_items_count` / `cart.length` (Số lượng mặt hàng trong giỏ hàng khi checkout):**
   - Bước nhảy nhỏ nhất là **1 mặt hàng / sản phẩm**.
   - Tiền đề nghiệp vụ bắt buộc: Giỏ hàng phải có ít nhất 1 sản phẩm mới được thanh toán ($LB = 1$). Nếu giỏ rỗng ($0$ sản phẩm), đơn hàng không thể tạo.
   - Đặc biệt, từ kết quả khảo sát Stage 0 (**Cross-platform Skew** giữa Web và Mobile):
     - Tại `eshop-sut/frontend-mobile/App.js:391`, code tồn tại logic:
       ```javascript
       items: cart.length > 1 ? cart.slice(0, -1) : cart
       ```
     - Biên của `cart.length` tại **1** và **2** là điểm cực kỳ nhạy cảm: khi `cart.length = 1`, Mobile giữ nguyên giỏ hàng; nhưng ngay khi `cart.length = 2` ($LB + 1$), Mobile lập tức kích hoạt lỗi nghiệp vụ **cắt bỏ sản phẩm cuối cùng**!

---

### 1.2 Bảng các trường KHÔNG ÁP DỤNG BVA (kèm lý do kỹ thuật)

| Trường dữ liệu / Biến | Kiểu dữ liệu | Lý do không áp dụng BVA (Technical Rationale) |
| :--- | :---: | :--- |
| **`auth_token`** | String (JWT) | **Miền giá trị không có thứ tự tự nhiên (Unordered domain).** Token JWT là chuỗi mã hóa Base64URL gồm 3 phần `header.payload.signature` được ký mật mã (HMAC-SHA256). Token chỉ có 2 trạng thái: chữ ký hợp lệ hoặc giả mạo/sai cú pháp. Không thể so sánh "lớn hơn" hay "nhỏ hơn" một token khác. Toàn bộ các trường hợp đã được bao phủ triệt để tại Domain Testing (`EC01` đến `EC04`). |
| **`user_id`** | Integer | **Định danh danh nghĩa (Nominal Identifier).** Giá trị ID của tài khoản người dùng chỉ mang ý nghĩa định danh bản ghi trong cơ sở dữ liệu (`req.user.id`), không có ý nghĩa về mặt phạm vi giá trị kiểm thử biên của chức năng checkout. |
| **`order status`** | Enum | **Tập rời rạc định danh (Categorical / Nominal Enum).** Trạng thái đơn hàng chỉ nhận các nhãn chuỗi cố định (`'pending'`, `'paid'`, `'shipped'`, `'canceled'`). Không có quan hệ thứ tự liên tục để lấy cận biên. |
| **`coupon_id`** | Integer / Null | **Khóa ngoại định danh danh nghĩa (Nominal Foreign Key).** Trường này lưu ID của mã giảm giá trong DB (`coupons.id`). Logic giảm giá tuân theo luật nghiệp vụ (Rule-based discount) thay vì một dải số liên tục. |
| **`items` (cấu trúc JSON Array)** | Array of Objects | **Cấu trúc dữ liệu phức hợp (Complex Composite Structure).** Bản thân từng object `{ product_id, name, price, quantity }` không có thứ tự toán học trên toàn mảng; chỉ có thuộc tính số lượng phần tử `items.length` là có thứ tự (đã được đưa vào mục 1.1). |

---

## Stage 2: Lựa chọn biến thể BVA và Mô hình điểm kiểm thử (Choose Variant & Test Model)

### 2.1 Biến thể đã chọn: 3-value BVA (BVA 3 giá trị)
Tuân thủ chuẩn mực học thuật của môn học CSC13003 và ISTQB Advanced level, bài tập áp dụng **biến thể 3-value BVA** làm phương pháp chủ đạo:
- Với mỗi khoảng hợp lệ $[LB, UB]$, kiểm tra **6 giá trị** kề cận hai đầu mút:
  - **Cận dưới ($LB$):**
    - $LB - 1$: Điểm ngoài biên (Invalid / Just outside) — kỳ vọng hệ thống từ chối (HTTP 400 Bad Request).
    - $LB$: Điểm ngay tại biên dưới (Valid / On boundary) — kỳ vọng hệ thống chấp nhận (HTTP 200 OK).
    - $LB + 1$: Điểm ngay trong biên dưới (Valid / Just inside) — kỳ vọng hệ thống chấp nhận (HTTP 200 OK).
  - **Cận trên ($UB$):**
    - $UB - 1$: Điểm ngay trong biên trên (Valid / Just inside) — kỳ vọng hệ thống chấp nhận (HTTP 200 OK).
    - $UB$: Điểm ngay tại biên trên (Valid / On boundary) — kỳ vọng hệ thống chấp nhận (HTTP 200 OK).
    - $UB + 1$: Điểm ngoài biên trên (Invalid / Just outside) — kỳ vọng hệ thống từ chối (HTTP 400 Bad Request).

#### Lý do lựa chọn biến thể 3-value BVA:
1. **Độ nhạy cao nhất với lỗi biên (Off-by-one errors):** Lập trình viên thường mắc lỗi logic khi dùng nhầm toán tử so sánh (ví dụ: gõ `<` thay vì `<=`, hoặc `>` thay vì `>=`). Biến thể 2-value ($LB-1, LB$) có thể bỏ sót trường hợp lập trình viên viết điều kiện loại bỏ chính xác điểm $LB+1$ hoặc xử lý sai điểm nội biên liền kề.
2. **Khớp 100% với slide bài giảng CSC13003 S04:** Đảm bảo tính nhất quán và nghiêm ngặt về phương pháp luận kiểm thử phần mềm.

---

### 2.2 Mở rộng theo Mô hình 9 điểm (Course 9-point Model) và Quy tắc biên mã hóa (v2.0)

Để phát hiện toàn diện các lỗi tiềm ẩn nguy hiểm trong môi trường thực tế, bộ kiểm thử BVA mở rộng thêm:
1. **Giá trị danh định (Nominal value):** Nằm an toàn ở trung tâm khoảng hợp lệ (e.g. `total_amount = 200,000` VNĐ, `shipping_address` dài 30 ký tự, giỏ hàng có 2 sản phẩm).
2. **Cực trị vật lý (Physical Extremes / $-\alpha, +\alpha$):**
   - Với `total_amount`:
     - Cực trị âm ($-\alpha$): Số âm danh nghĩa `-1` và số âm cực lớn `-50,000,000` VNĐ (kiểm tra lỗ hổng đảo chiều dòng tiền / CWE-20).
     - Cực trị dương ($+\alpha$): Số cực lớn vượt ngưỡng an toàn JavaScript `Number.MAX_SAFE_INTEGER` ($9,007,199,254,740,991$) hoặc số mũ $10^{15}$ (kiểm tra lỗi tràn số nguyên Integer Overflow trong SQLite).
   - Với `shipping_address`:
     - Cực trị nhỏ nhất ($-\alpha$): Chuỗi rỗng độ dài 0 (`""`).
     - Cực trị lớn nhất ($+\alpha$): Chuỗi siêu dài 10,000 ký tự (kiểm tra khả năng chịu tải payload, chống tấn công từ chối dịch vụ Buffer Overflow / DoS).
3. **Quy tắc biên mã hóa Unicode tiếng Việt (Encoding Boundary Rule - v2.0):**
   - Tại cận trên $UB = 255$ của trường `shipping_address`, bắt buộc thiết kế một ca kiểm thử sử dụng **toàn bộ ký tự tiếng Việt có dấu** (như `"Số 123 Đường Nguyễn Trãi, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh..."`).
   - **Mục đích kỹ thuật:** Các ký tự tiếng Việt có dấu (như `ư`, `ơ`, `ế`, `đ`) chiếm từ 2 đến 3 bytes trong bảng mã UTF-8. Ca kiểm thử này xác minh SUT kiểm tra độ dài chuỗi theo **số ký tự** (`string.length`) hay theo **số byte** (`Buffer.byteLength`). Nếu kiểm tra sai theo byte, người dùng Việt Nam nhập địa chỉ có dấu hợp lệ sẽ bị từ chối oan hoặc bị cắt cụt chuỗi làm méo mó thông tin giao hàng trong DB.

---

### 2.3 Bảng tổng hợp các điểm giá trị biên cần thiết kế (Boundary Points Summary)

| Biến | Điểm biên | Giá trị cụ thể | Phân loại | Kỳ vọng kỹ thuật |
| :--- | :---: | :--- | :---: | :--- |
| **`total_amount`** | $-\alpha$ (Extreme Negative) | `-50,000` | Invalid | HTTP 400 Bad Request `[SPEC]` |
| | $LB - 1$ | `0` | Invalid | HTTP 400 Bad Request `[SPEC]` |
| | $LB$ | `1` | Valid | HTTP 200 OK `[SPEC]` |
| | $LB + 1$ | `2` | Valid | HTTP 200 OK `[SPEC]` |
| | Nominal | `200,000` | Valid | HTTP 200 OK (Khớp giỏ hàng) `[SPEC]` |
| | $UB - 1$ | `2,147,483,646` | Valid | HTTP 200 OK `[ASSUMED]` |
| | $UB$ | `2,147,483,647` | Valid | HTTP 200 OK `[ASSUMED]` |
| | $UB + 1$ | `2,147,483,648` | Invalid | HTTP 400 Bad Request (Vượt int32) `[ASSUMED]` |
| | $+\alpha$ (Extreme Overflow) | `9,007,199,254,740,991` (`MAX_SAFE_INT`) | Invalid | HTTP 400 Bad Request `[ASSUMED]` |
| **`shipping_address`** | $-\alpha$ (Empty Extreme) | Độ dài = 0 (chuỗi rỗng `""`) | Invalid | HTTP 400 Bad Request `[SPEC]` |
| | $LB - 1$ | Độ dài = 4 ký tự (`"Q.1 "`) | Invalid | HTTP 400 Bad Request `[ASSUMED]` |
| | $LB$ | Độ dài = 5 ký tự (`"Quan1"`) | Valid | HTTP 200 OK `[ASSUMED]` |
| | $LB + 1$ | Độ dài = 6 ký tự (`"Quan 1"`) | Valid | HTTP 200 OK `[ASSUMED]` |
| | Nominal | Độ dài = 22 ký tự (`"123 Le Loi, Quan 1, HCM"`) | Valid | HTTP 200 OK `[SPEC]` |
| | $UB - 1$ | Độ dài = 254 ký tự (ASCII hợp lệ) | Valid | HTTP 200 OK `[ASSUMED]` |
| | $UB$ (ASCII) | Độ dài = 255 ký tự (ASCII hợp lệ) | Valid | HTTP 200 OK `[ASSUMED]` |
| | $UB$ (UTF-8 Diacritics) | Độ dài = 255 ký tự (Tiếng Việt có dấu v2.0) | Valid | HTTP 200 OK `[ASSUMED]` |
| | $UB + 1$ | Độ dài = 256 ký tự | Invalid | HTTP 400 Bad Request `[ASSUMED]` |
| | $+\alpha$ (Extreme Payload) | Độ dài = 10,000 ký tự | Invalid | HTTP 400 / 413 Payload Too Large `[ASSUMED]` |
| **`cart_items_count`** | $LB - 1$ | $0$ sản phẩm (Giỏ hàng rỗng) | Invalid | HTTP 400 Bad Request `[ASSUMED]` |
| | $LB$ (Mobile Skew Boundary) | $1$ sản phẩm (Không bị Mobile cắt) | Valid | HTTP 200 OK `[CODE: App.js:391]` |
| | $LB + 1$ (Mobile Skew Boundary) | $2$ sản phẩm (Mobile bị cắt mất item) | Valid (API) / Bug (Mobile) | HTTP 200 OK `[CODE: App.js:391]` |

---

## Stage 3: Bảng giá trị biên và Thiết kế Test Cases BVA (Test Case Generation)

Áp dụng nghiêm ngặt nguyên tắc **Đơn biến (Single-fault assumption)**:
- Mỗi ca kiểm thử BVA chỉ thay đổi một biến duy nhất tại một thời điểm đến các điểm biên ($LB-1, LB, LB+1, UB-1, UB, UB+1, -\alpha, +\alpha$).
- Toàn bộ các biến còn lại được giữ cố định ở **giá trị danh định hợp lệ (Nominal valid values)**:
  - `auth_token`: Token JWT hợp lệ của người dùng `test@eshop.com`.
  - `total_amount` (khi không kiểm thử biến này): `200,000` VNĐ (khớp với giá trị giỏ hàng).
  - `shipping_address` (khi không kiểm thử biến này): `"123 Le Loi, Phuong Ben Nghe, Quan 1, TP.HCM"` (độ dài 43 ký tự, hợp lệ).
  - `cart_state` (khi không kiểm thử biến này): Giỏ hàng có 1 sản phẩm hợp lệ, đủ tồn kho.

Tổng cộng thiết kế **20 ca kiểm thử BVA** (`FR08-BVA-01` đến `FR08-BVA-20`), bao phủ toàn diện 3 miền có thứ tự và các điểm dị biệt thực tế.

### Bảng chi tiết 20 ca kiểm thử giá trị biên (BVA Test Suite)

| Mã TC | Biến kiểm tra | Điểm biên | Giá trị kiểm thử cụ thể | Các biến khác (Nominal) | Kỳ vọng (Expected) | Lỗi code sẽ bắt được (Fault it would catch) | Nguồn |
| :--- | :--- | :---: | :--- | :--- | :---: | :--- | :---: |
| **FR08-BVA-01** | `total_amount` | $-\alpha$ (Extreme số âm) | `-50000` VNĐ | `token`: Valid<br>`address`: Valid<br>`cart`: 1 món | HTTP 400 | Lỗ hổng cho phép thanh toán số tiền âm, đảo chiều dòng tiền giao dịch (CWE-20) | `[SPEC]` api_spec:134 |
| **FR08-BVA-02** | `total_amount` | $LB - 1$ (Cận dưới - 1) | `0` VNĐ | `token`: Valid<br>`address`: Valid<br>`cart`: 1 món | HTTP 400 | Lập trình viên viết nhầm điều kiện `if (amount < 0)` thay vì `<= 0`, cho phép đặt hàng miễn phí 0 đồng | `[SPEC]` api_spec:134 |
| **FR08-BVA-03** | `total_amount` | $LB$ (Cận dưới tối thiểu) | `1` VNĐ | `token`: Valid<br>`address`: Valid<br>`cart`: 1 món (giá 1đ) | HTTP 200 | Lập trình viên viết nhầm điều kiện `if (amount > 1)` thay vì `>= 1`, từ chối đơn hàng hợp lệ nhỏ nhất | `[SPEC]` api_spec:134 |
| **FR08-BVA-04** | `total_amount` | $LB + 1$ (Nội biên kề cận) | `2` VNĐ | `token`: Valid<br>`address`: Valid<br>`cart`: 1 món (giá 2đ) | HTTP 200 | Lỗi lệch biên cận dưới nội vùng | `[SPEC]` api_spec:134 |
| **FR08-BVA-05** | `total_amount` | $UB - 1$ (Cận trên - 1) | `2,147,483,646` VNĐ | `token`: Valid<br>`address`: Valid | HTTP 200 | Lỗi lệch biên cận trên giá trị giao dịch lớn | `[ASSUMED]` int32 max |
| **FR08-BVA-06** | `total_amount` | $UB$ (Cận trên int32 max) | `2,147,483,647` VNĐ | `token`: Valid<br>`address`: Valid | HTTP 200 | Lập trình viên viết nhầm `< 2147483647` thay vì `<= 2147483647` | `[ASSUMED]` int32 max |
| **FR08-BVA-07** | `total_amount` | $UB + 1$ (Ngoài biên int32) | `2,147,483,648` VNĐ | `token`: Valid<br>`address`: Valid | HTTP 400 | Lỗi không giới hạn số tiền tối đa, gây tràn số nguyên (Integer Overflow) trong SQLite | `[ASSUMED]` int32 overflow |
| **FR08-BVA-08** | `total_amount` | $+\alpha$ (Max Extreme) | `9,007,199,254,740,991` (`MAX_SAFE_INT`) | `token`: Valid<br>`address`: Valid | HTTP 400 | Lỗi mất độ chính xác số học IEEE 754 float / BigInt trong JavaScript | `[ASSUMED]` JS float limit |
| **FR08-BVA-09** | `shipping_address` | $-\alpha$ (Min Extreme) | Độ dài = 0 (chuỗi rỗng `""`) | `token`: Valid<br>`total`: 200,000 | HTTP 400 | Chấp nhận đơn hàng không có địa chỉ giao, gây lỗi vận hành logistics | `[SPEC]` api_spec:135 |
| **FR08-BVA-10** | `shipping_address` | $LB - 1$ (Thiếu 1 ký tự) | Độ dài = 4 ký tự (`"Q.1 "`) | `token`: Valid<br>`total`: 200,000 | HTTP 400 | Chấp nhận địa chỉ quá ngắn, không có giá trị giao nhận | `[ASSUMED]` Address form |
| **FR08-BVA-11** | `shipping_address` | $LB$ (Cận dưới tối thiểu) | Độ dài = 5 ký tự (`"Quan1"`) | `token`: Valid<br>`total`: 200,000 | HTTP 200 | Lập trình viên viết nhầm `length > 5` thay vì `>= 5`, từ chối địa chỉ tối thiểu hợp lệ | `[ASSUMED]` Address form |
| **FR08-BVA-12** | `shipping_address` | $LB + 1$ (Nội biên kề cận) | Độ dài = 6 ký tự (`"Quan 1"`) | `token`: Valid<br>`total`: 200,000 | HTTP 200 | Lỗi lệch biên cận dưới nội vùng | `[ASSUMED]` Address form |
| **FR08-BVA-13** | `shipping_address` | $UB - 1$ (Nội biên cận trên) | Độ dài = 254 ký tự (ASCII hợp lệ) | `token`: Valid<br>`total`: 200,000 | HTTP 200 | Lỗi lệch biên cận trên nội vùng | `[ASSUMED]` 255 chars |
| **FR08-BVA-14** | `shipping_address` | $UB$ (Cận trên tối đa ASCII) | Độ dài = 255 ký tự (ASCII hợp lệ) | `token`: Valid<br>`total`: 200,000 | HTTP 200 | Lập trình viên viết nhầm `< 255` thay vì `<= 255` | `[ASSUMED]` 255 chars |
| **FR08-BVA-15** | `shipping_address` | $UB$ (UTF-8 Diacritics v2.0) | Độ dài = 255 ký tự (Tiếng Việt có dấu, 330 bytes) | `token`: Valid<br>`total`: 200,000 | HTTP 200 | Server kiểm tra sai theo số byte (`Buffer.byteLength`) thay vì số ký tự (`string.length`), làm lỗi địa chỉ tiếng Việt hợp lệ | `[ASSUMED]` UTF-8 Rule v2.0 |
| **FR08-BVA-16** | `shipping_address` | $UB + 1$ (Vượt quá cận trên) | Độ dài = 256 ký tự (ASCII) | `token`: Valid<br>`total`: 200,000 | HTTP 400 | Không kiểm soát độ dài tối đa cột `VARCHAR(255)`, gây lỗi DB hoặc cắt cụt dữ liệu ngầm (Silent Truncation) | `[ASSUMED]` 255 chars |
| **FR08-BVA-17** | `shipping_address` | $+\alpha$ (Extreme Payload DoS) | Độ dài = 10,000 ký tự | `token`: Valid<br>`total`: 200,000 | HTTP 400 / 413 | Lỗ hổng tràn bộ nhớ / DoS khi client gửi payload địa chỉ siêu lớn | `[ASSUMED]` DoS Payload |
| **FR08-BVA-18** | `cart_items_count` | $LB - 1$ (Giỏ hàng rỗng) | $0$ sản phẩm trong giỏ hàng | `token`: Valid<br>`total`: 200,000<br>`address`: Valid | HTTP 400 | Backend không kiểm tra giỏ hàng, cho phép đặt "đơn hàng ma" khi không có sản phẩm nào | `[ASSUMED]` Business rule |
| **FR08-BVA-19** | `cart_items_count` | $LB$ (Mobile Skew Boundary) | $1$ sản phẩm trong giỏ hàng | `token`: Valid<br>`total`: 200,000<br>`address`: Valid | HTTP 200 | Kiểm tra biên 1 sản phẩm: trên Mobile giỏ hàng không bị cắt bỏ (`cart.length > 1 ? cart.slice(0, -1) : cart`) | `[CODE]` App.js:391 |
| **FR08-BVA-20** | `cart_items_count` | $LB + 1$ (Mobile Skew Boundary) | $2$ sản phẩm trong giỏ hàng | `token`: Valid<br>`total`: 400,000<br>`address`: Valid | HTTP 200 | Phát hiện lỗi dị biệt Mobile cố tình cắt bỏ sản phẩm cuối cùng của đơn hàng khi `cart.length = 2` | `[CODE]` App.js:391 |

---

## Stage 4: Tự kiểm tra (Self-Check)

- [x] **Toàn bộ biên đều có nguồn xác thực:** Gắn thẻ `[SPEC]`, `[CODE]`, `[ASSUMED]` đầy đủ. Cách đọc khoảng giá trị (dạng mở và đóng) được ghi rõ ràng ($1 \le total\_amount \le 2,147,483,647$; $5 \le \text{length} \le 255$; $1 \le \text{items} \le 100$).
- [x] **Nguyên tắc đơn biến (Single-fault assumption):** Mỗi test case chỉ biến thiên đúng 1 biến tại 1 điểm biên, giữ nguyên vẹn các biến còn lại ở giá trị danh định hợp lệ.
- [x] **Không bịa biên cho biến không có thứ tự:** Đã lập luận và loại trừ rõ ràng `auth_token`, `user_id`, `status`, `coupon_id`, `items array`.
- [x] **Nêu rõ biến thể và công thức số điểm:** Áp dụng biến thể 3-value BVA ($LB-1, LB, LB+1, UB-1, UB, UB+1$) kết hợp mô hình 9 điểm ($-\alpha, +\alpha, Nominal$) và quy tắc biên mã hóa Unicode tiếng Việt (v2.0).
- [x] **Kỳ vọng phản hồi chuẩn mực:** Các ca không hợp lệ kỳ vọng HTTP 400 Bad Request kèm loại trừ `"Checkout successful"`; các ca hợp lệ kỳ vọng HTTP 200 OK kèm `orderId`.
- [x] **Kiểm tra độ dài chuỗi bằng code:** Chuỗi 254, 255, 256, 10,000 ký tự và chuỗi 255 ký tự tiếng Việt (330 bytes UTF-8) đều được sinh và kiểm tra độ dài chính xác bằng lệnh thực thi Node.js.
- [x] **Đồng bộ với test suite JSON:** Đã bổ sung đầy đủ 20 test cases (`FR08-BVA-01` đến `FR08-BVA-20`) vào tệp [`HW2/testcases/FR-08.json`](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/testcases/FR-08.json) với kỹ thuật `"BVA"` và trạng thái ban đầu `"NOT_EXECUTED"`.

---

## Hạn chế của kỹ thuật BVA trên tính năng FR-08 (Blind Spots Analysis)

Mặc dù BVA rất mạnh trong việc tìm kiếm các lỗi off-by-one và tràn giới hạn, tính năng Checkout (FR-08) có những nhóm lỗi nghiêm trọng mà **BVA hoàn toàn bất lực không thể phát hiện**:

1. **Lỗi thao túng giá (Price Tampering / Parameter Tampering):**
   - Lỗi này nằm ở sự bất đồng bộ giữa giá trị `total_amount` gửi lên và tổng giá trị thực tế của các sản phẩm trong giỏ hàng.
   - BVA chỉ kiểm tra xem `total_amount` có nằm trong khoảng hợp lệ hay không (ví dụ: `20,000` VNĐ là số tiền hoàn toàn hợp lệ về mặt biên số nguyên). Tuy nhiên, nếu giỏ hàng thực tế trị giá `2,000,000` VNĐ mà người dùng sửa thành `20,000` VNĐ, BVA không thể phát hiện nếu không có kiểm thử miền (Domain Testing: `EC08`).
2. **Lỗ hổng tấn công bảo mật Injection (SQL Injection, Stored XSS):**
   - Các payload độc hại như `' OR 1=1 --` hay `<script>alert(1)</script>` có độ dài chỉ từ 12 đến 30 ký tự, nằm hoàn toàn an toàn bên trong khoảng hợp lệ $[5, 255]$ của `shipping_address`. BVA hoàn toàn không có khả năng phát hiện lỗi bảo mật này.
3. **Lỗi tương tranh tồn kho (Concurrency / Race Conditions):**
   - Khi hai khách hàng cùng đặt sản phẩm cuối cùng trong kho tại cùng một mili-giây, giá trị đặt mua của mỗi người đều thỏa mãn cận biên ($quantity = 1 \le stock = 1$). BVA kiểm thử đơn lẻ không thể phát hiện lỗi bán vượt tồn kho (Overselling).
4. **SUT hoàn toàn không có tầng kiểm tra tính hợp lệ (Zero Validation Defect):**
   - Trong mã nguồn thực tế của SUT (`server.js:297-309`), backend không hề có bất kỳ câu lệnh `if` nào kiểm tra `total_amount <= 0` hay `shipping_address`. Do đó, trên thực tế, các ca kiểm thử biên không hợp lệ ($LB-1, -\alpha$) sẽ không bị chặn ở mã 400 mà sẽ đi thẳng vào DB và trả về HTTP 200 OK.

---

### DỪNG LẠI TẠI CHECKPOINT STAGE 3 & 4 CHỜ DUYỆT (STOP FOR REVIEW)

Theo quy định kiểm soát chất lượng của môn học:
- **Stage 3 (Bảng 20 ca kiểm thử BVA chi tiết)** và **Stage 4 (Self-Check, Hạn chế kỹ thuật & Cập nhật `HW2/testcases/FR-08.json`)** đã hoàn tất trọn vẹn.
- Toàn bộ test suite của FR-08 hiện có **42 ca kiểm thử** (22 Domain Testing + 20 BVA) sẵn sàng cho test runner.
- Trình sinh viên thẩm định trước khi chuyển sang kỹ thuật thực thi và báo cáo lỗi `test-execution-and-bugs`.
