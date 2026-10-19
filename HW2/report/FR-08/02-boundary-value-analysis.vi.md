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

### DỪNG LẠI TẠI CHECKPOINT STAGE 1 & 2 CHỜ DUYỆT (STOP FOR REVIEW)

Theo thỏa thuận làm việc và quy định kiểm soát chất lượng của môn học:
- **Stage 1 (Xác định miền có thứ tự)** và **Stage 2 (Lựa chọn biến thể BVA 3-value + Mô hình 9 điểm + UTF-8 Encoding v2.0)** đã hoàn tất.
- Trình sinh viên thẩm định các miền có thứ tự, các lý do loại trừ biến không áp dụng, và danh sách các điểm biên trước khi tiến hành Stage 3 (Sinh dữ liệu kiểm thử, thiết kế bảng ca kiểm thử BVA chi tiết và cập nhật `HW2/testcases/FR-08.json`).
