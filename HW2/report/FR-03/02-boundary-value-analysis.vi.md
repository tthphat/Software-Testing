# FR-03: Quên mật khẩu và Đặt lại mật khẩu (Forgot Password & Password Reset)
## Báo cáo Phân tích giá trị biên (Boundary Value Analysis — BVA)

- **Tính năng:** FR-03 — Quên mật khẩu và đặt lại mật khẩu
- **Người thực hiện:** Trương Thành Phát (MSSV: 23120319)
- **Tài liệu tham khảo:**
  - `docs/api_specification.md` (mục 1.3 và 1.4) `[SPEC]`
  - Mã nguồn Backend: `eshop-sut/backend/server.js:68-98` `[CODE]`
  - Mã nguồn Frontend Web: `eshop-sut/frontend-web/src/pages/ForgotPassword.jsx` `[CODE]`
  - Báo cáo kiểm thử miền: `HW2/report/FR-03/01-domain-testing.vi.md`
- **Phiên bản kỹ năng:** Boundary Value Analysis v2.0 (áp dụng **Encoding Boundary Rule** cho ký tự UTF-8 tiếng Việt).

---

## Stage 1: Xác định các miền có thứ tự và các giá trị biên

Theo nguyên tắc BVA của môn học, kỹ thuật phân tích giá trị biên **CHỈ ĐƯỢC ÁP DỤNG TRÊN CÁC MIỀN GIÁ TRỊ CÓ THỨ TỰ (ORDERED DOMAINS)**: độ dài chuỗi ký tự (length), số nguyên, khoảng giá trị số, ngày tháng/thời gian. Tuyệt đối không tự bịa biên cho các biến định tính hoặc không có thứ tự.

### 1.1 Bảng các biến trên miền có thứ tự

| Biến kiểm thử | Thuộc tính có thứ tự | Khoảng hợp lệ (Mở & Đóng) | Bước nhỏ nhất (Unit/Step) | Cận dưới (LB) | Cận trên (UB) | Nguồn (Source tag) |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| `Step2.newPassword` | Độ dài chuỗi (`length`) | $8 \le \text{length} \le 128$<br>Hoặc: $7 < \text{length} < 129$ | 1 ký tự | **8** | **128** | `[SPEC]` api_spec:51<br>`[ASSUMED]` (cận trên 128) |
| `Step2.resetToken` | Độ dài chuỗi (`length`) | $\text{length} = 4$<br>(Chính xác 4 chữ số) | 1 ký tự | **4** | **4** | `[CODE]` server.js:72<br>`[CODE]` ForgotPassword.jsx:69 |
| `Step2.resetToken` | Giá trị số nguyên (`numeric value`) | $1000 \le \text{value} \le 9999$<br>Hoặc: $999 < \text{value} < 10000$ | 1 đơn vị | **1000** | **9999** | `[CODE]` server.js:72 (`1000 + random * 9000`) |

### 1.2 Bảng các trường KHÔNG ÁP DỤNG BVA (kèm lý do kỹ thuật)

| Trường dữ liệu | Kiểu dữ liệu | Lý do không áp dụng BVA |
| :--- | :---: | :--- |
| `Step1.email` & `Step2.email` | Chuỗi ký tự | **Không có quan hệ thứ tự tự nhiên (Unordered domain).** Email là cấu trúc định danh tuân theo biểu thức chính quy (Regex RFC 5322), không thể so sánh "lớn hơn" hay "nhỏ hơn". Đã được bao phủ triệt để bằng kỹ thuật Phân hoạch tương đương (Domain Testing: EC01 - EC07). |
| `password complexity` | Thuộc tính logic | **Thuộc tính tập hợp logic (Set property).** Yêu cầu mật khẩu phải có đủ chữ hoa, chữ thường, số, ký tự đặc biệt là một tập hợp các điều kiện boolean logic rời rạc, không có giá trị biên toán học. |
| `user_exists` | Boolean | **Miền nhị phân rời rạc (Binary domain).** Chỉ có 2 giá trị `{ true, false }`, không có khoảng giá trị kề cận. |
| `token_match_state` | Enum | **Tập rời rạc không thứ tự (Nominal category).** Các trạng thái `{ MATCH_VALID, WRONG_TOKEN, CROSS_ACCOUNT, ALREADY_USED }` là các nhãn định danh logic nghiệp vụ. |
| `token_expiry` | Thời gian (Time) | **Không áp dụng được do mã nguồn SUT thiếu tính năng.** Về mặt lý thuyết, thời gian hết hạn OTP có biên $T-1\text{s}, T, T+1\text{s}$. Tuy nhiên trong mã nguồn SUT (`database.js:58`), bảng `users` không lưu timestamp tạo token và `server.js` không có logic kiểm tra thời gian, token có hiệu lực vĩnh viễn nên không thể thiết kế ca kiểm thử biên thời gian. |

---

## Stage 2: Lựa chọn biến thể BVA và Mô hình điểm kiểm thử

### 2.1 Biến thể đã chọn: 3-value BVA (BVA 3 giá trị)
Bài tập lựa chọn **biến thể 3-value BVA** làm phương pháp chủ đạo:
- Với mỗi biên (cận dưới $LB$ hoặc cận trên $UB$), kiểm tra **3 điểm kề cận**:
  - Tại cận dưới: $LB - 1$ (ngoài biên - không hợp lệ), $LB$ (ngay tại biên - hợp lệ), $LB + 1$ (ngay trong biên - hợp lệ).
  - Tại cận trên: $UB - 1$ (ngay trong biên - hợp lệ), $UB$ (ngay tại biên - hợp lệ), $UB + 1$ (ngoài biên - không hợp lệ).
- **Lý do lựa chọn:**
  - Biến thể 3-value có độ nhạy rất cao với các lỗi **Off-by-one** (như lập trình viên gõ nhầm dấu `>` thành `>=`, hoặc `<` thành `<=`).
  - Phù hợp với bài giảng và tiêu chuẩn học thuật của môn học CSC13003.

### 2.2 Mở rộng theo Mô hình 9 điểm (Course 9-point model) và Quy tắc biên mã hóa (v2.0)
Nhằm tăng cường khả năng phát hiện khiếm khuyết trong môi trường thực tế, bộ kiểm thử mở rộng thêm:
1. **Giá trị danh định (Nominal value):** Nằm an toàn giữa khoảng hợp lệ (e.g. mật khẩu dài 15 ký tự).
2. **Cực trị vật lý (Physical Extremes / $-\alpha, +\alpha$):**
   - Chuỗi rỗng độ dài 0 (`""`).
   - Chuỗi siêu dài 10,000 ký tự gửi lên `newPassword` nhằm kiểm tra lỗ hổng tấn công từ chối dịch vụ (Denial of Service - DoS) khi server băm mật khẩu.
3. **Quy tắc biên mã hóa Unicode (Encoding Boundary Rule - v2.0):**
   - Tại cận trên $UB = 128$ của `newPassword`, bổ sung ca kiểm thử chứa **ký tự tiếng Việt có dấu** (như `"Nguyễn..."`). Vì mỗi ký tự tiếng Việt chiếm 2–3 bytes UTF-8, ca kiểm thử này giúp xác minh server kiểm tra độ dài chuỗi theo ký tự (`string.length`) hay theo số byte (`Buffer.byteLength`).

---

## Stage 3: Bảng giá trị biên và Thiết kế Test Cases BVA

Áp dụng nguyên tắc **Single-fault assumption** (biến thiên một biến duy nhất tại một thời điểm, giữ cố định các biến còn lại ở giá trị danh định hợp lệ).

Tổng cộng thiết kế **15 ca kiểm thử BVA** (`FR03-BVA-01` đến `FR03-BVA-15`).

### Bảng chi tiết 15 ca kiểm thử giá trị biên

| Mã TC | Biến kiểm tra | Điểm biên | Giá trị kiểm thử cụ thể | Các biến khác (Nominal) | Kỳ vọng (Expected) | Lỗi code sẽ bắt được (Fault it would catch) | Nguồn |
| :--- | :--- | :---: | :--- | :--- | :---: | :--- | :---: |
| **FR03-BVA-01** | `newPassword` | $-\alpha$ (Min Extreme) | Độ dài = 0 (chuỗi rỗng `""`) | `email`: test@eshop.com<br>`token`: valid | HTTP 400 | Lỗi cho phép đặt mật khẩu rỗng | `[SPEC]` api_spec:51 |
| **FR03-BVA-02** | `newPassword` | $LB - 1$ | Độ dài = 7 ký tự (`"Pass1!a"`) | `email`: test@eshop.com<br>`token`: valid | HTTP 400 | Lỗi chấp nhận mật khẩu ngắn yếu | `[SPEC]` api_spec:51 |
| **FR03-BVA-03** | `newPassword` | $LB$ | Độ dài = 8 ký tự (`"Pass1!ab"`) | `email`: test@eshop.com<br>`token`: valid | HTTP 200 | Lỗi viết nhầm `> 8` thay vì `>= 8` | `[SPEC]` api_spec:51 |
| **FR03-BVA-04** | `newPassword` | $LB + 1$ | Độ dài = 9 ký tự (`"Pass1!abc"`) | `email`: test@eshop.com<br>`token`: valid | HTTP 200 | Lỗi lệch biên cận dưới | `[SPEC]` api_spec:51 |
| **FR03-BVA-05** | `newPassword` | $UB - 1$ | Độ dài = 127 ký tự hợp lệ | `email`: test@eshop.com<br>`token`: valid | HTTP 200 | Lỗi lệch biên cận trên | `[ASSUMED]` 128 chars |
| **FR03-BVA-06** | `newPassword` | $UB$ | Độ dài = 128 ký tự (ASCII hợp lệ) | `email`: test@eshop.com<br>`token`: valid | HTTP 200 | Lỗi viết nhầm `< 128` thay vì `<= 128` | `[ASSUMED]` 128 chars |
| **FR03-BVA-07** | `newPassword` | $UB$ (UTF-8 Encoding) | Độ dài = 128 ký tự (chuỗi tiếng Việt có dấu) | `email`: test@eshop.com<br>`token`: valid | HTTP 200 | Lỗi tính độ dài theo số byte UTF-8 thay vì số ký tự (v2.0 Rule) | `[ASSUMED]` UTF-8 rule |
| **FR03-BVA-08** | `newPassword` | $UB + 1$ | Độ dài = 129 ký tự | `email`: test@eshop.com<br>`token`: valid | HTTP 400 | Lỗi không giới hạn độ dài mật khẩu tối đa | `[ASSUMED]` 128 chars |
| **FR03-BVA-09** | `newPassword` | $+\alpha$ (Max Extreme) | Độ dài = 10,000 ký tự | `email`: test@eshop.com<br>`token`: valid | HTTP 400 | Lỗ hổng tấn công DoS khi băm mật khẩu lớn | `[ASSUMED]` DoS extreme |
| **FR03-BVA-10** | `resetToken` | $-\alpha$ (Extreme) | Độ dài = 0 (chuỗi rỗng `""`) | `email`: test@eshop.com<br>`password`: Valid | HTTP 400 | Lỗi chấp nhận token rỗng | `[CODE]` server.js:94 |
| **FR03-BVA-11** | `resetToken` | $LB - 1$ (Length & Value) | Độ dài = 3 ký tự / Giá trị `"999"` | `email`: test@eshop.com<br>`password`: Valid | HTTP 400 | Lỗi chấp nhận mã OTP thiếu số | `[CODE]` server.js:72 |
| **FR03-BVA-12** | `resetToken` | $LB$ (Min Value) | Giá trị số nhỏ nhất `"1000"` (nếu khớp DB) | `email`: test@eshop.com<br>`password`: Valid | HTTP 200/400 | Kiểm tra biên giá trị tối thiểu của thuật toán sinh mã OTP | `[CODE]` server.js:72 |
| **FR03-BVA-13** | `resetToken` | $UB$ (Max Value) | Giá trị số lớn nhất `"9999"` (nếu khớp DB) | `email`: test@eshop.com<br>`password`: Valid | HTTP 200/400 | Kiểm tra biên giá trị tối đa của thuật toán sinh mã OTP | `[CODE]` server.js:72 |
| **FR03-BVA-14** | `resetToken` | $UB + 1$ (Length & Value) | Độ dài = 5 ký tự / Giá trị `"10000"` | `email`: test@eshop.com<br>`password`: Valid | HTTP 400 | Lỗi chấp nhận mã OTP thừa số | `[CODE]` server.js:72 |
| **FR03-BVA-15** | `resetToken` | Spec Boundary | Độ dài = 6 ký tự (`"123456"` theo spec) | `email`: test@eshop.com<br>`password`: Valid | HTTP 400 | Lỗi lệch pha giữa tài liệu đặc tả (6 số) và code thực tế (4 số) | `[SPEC]` api_spec:42<br>`[CODE]` server.js:72 |

---

## Stage 4: Tự kiểm tra (Self-Check)

- [x] **Miền có thứ tự hợp lệ:** Toàn bộ các ca kiểm thử BVA đều áp dụng trên các thuộc tính có thứ tự (`newPassword.length`, `resetToken.length`, `resetToken.value`). Không bịa biên cho email hay boolean.
- [x] **Nguyên tắc đơn biến:** Mỗi test case chỉ thay đổi 1 biến tại 1 thời điểm, các biến còn lại giữ danh định hợp lệ.
- [x] **Ghi rõ cách đọc biên:** Các giới hạn đóng/mở ($8 \le \text{length} \le 128$) được giải thích rõ ràng và có bước nhảy 1 ký tự.
- [x] **Có cột "Lỗi code sẽ bắt được":** Giải thích rõ mục đích tìm lỗi off-by-one của từng ca kiểm thử.
- [x] **Áp dụng quy tắc v2.0:** Đã tích hợp ca kiểm thử mã hóa tiếng Việt UTF-8 tại biên trên của mật khẩu (`FR03-BVA-07`).

---

## Hạn chế của kỹ thuật BVA trên tính năng FR-03
1. **Lỗi quan trọng nhất không nằm ở biên:**
   - Khiếm khuyết nghiêm trọng nhất của FR-03 là **lỗ hổng rò rỉ mã OTP trực tiếp trong response body** (`server.js:78-81`) và **không có cơ chế hết hạn token**. Hai lỗi an ninh này hoàn toàn không thể phát hiện được bằng kỹ thuật phân tích biên độ dài hay giá trị số, mà phải nhờ vào rà soát mã nguồn (Code review) và kiểm thử miền có trạng thái.
2. **Miền giá trị thực tế không bị chặn ở server:**
   - Backend `server.js:89-98` nhận `newPassword` mà không hề có câu lệnh `if (newPassword.length < 8)` hay `if (newPassword.length > 128)`. Do đó, server trên thực tế chấp nhận cả chuỗi 1 ký tự lẫn chuỗi 10,000 ký tự mà không từ chối, khiến các ca kiểm thử $LB-1$ hay $UB+1$ sẽ FAIL so với kỳ vọng HTTP 400.
