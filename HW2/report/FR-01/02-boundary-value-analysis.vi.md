# FR-01: Phân tích giá trị biên (Boundary Value Analysis - BVA)

## Giới thiệu & Căn cứ kỹ thuật

Kỹ thuật **Phân tích giá trị biên (Boundary Value Analysis - BVA)** được áp dụng dựa trên quan sát thực tế: lỗi phần mềm thường tập trung dày đặc tại các biên của phân hoạch tương đương do lập trình viên nhầm lẫn giữa toán tử so sánh (ví dụ: `<` thay vì `<=`, `>` thay vì `>=`), sai sót lệch 1 đơn vị (*off-by-one errors*), hoặc lỗi gõ nhầm giá trị giới hạn.

- **Tài liệu tham chiếu:** Slide bài giảng môn học CSC13003 (S04), Giáo trình ISTQB Foundation Level.
- **Tiền đề:** Đã hoàn thành phân hoạch tương đương tại [`report/FR-01/01-domain-testing.vi.md`](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/FR-01/01-domain-testing.vi.md) và bộ test case [`testcases/FR-01.json`](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/testcases/FR-01.json).

---

## Stage 1: Xác định các miền có thứ tự và các trường áp dụng / không áp dụng BVA

BVA chỉ áp dụng trên **các miền giá trị có quan hệ thứ tự rõ ràng (Ordered Domains)** như độ dài chuỗi ký tự, số lượng, khoảng thời gian hoặc giá trị số học. Tuyệt đối không áp dụng hoặc ép buộc tạo biên giả tạo cho các tập giá trị rời rạc, phân loại, logic boolean hoặc định dạng chuỗi.

### 1.1 Bảng các phân hoạch có thứ tự áp dụng BVA

| EC ID liên quan | Biến kiểm thử | Thuộc tính có thứ tự | Khoảng hợp lệ `[LB, UB]` | Cách đọc dạng Đóng & Mở | Bước nhỏ nhất (Unit/Step) | Nguồn gốc | Ghi chú |
| :--- | :--- | :--- | :---: | :--- | :---: | :---: | :--- |
| **EC01, EC02** | `name` | Độ dài chuỗi (`name.length`) | `[1, 100]` | • **Dạng đóng:** `1 <= length <= 100`<br>• **Dạng mở:** `0 < length < 101` | 1 ký tự | `[SPEC]` api_spec:14<br>`[ASSUMED]` (UB=100) | LB = 1 là điều kiện bắt buộc nhập tên. UB = 100 là giới hạn độ dài thông thường của họ tên người dùng. |
| **EC10, EC11** | `password` | Độ dài mật khẩu (`password.length`) | `[8, 128]` | • **Dạng đóng:** `8 <= length <= 128`<br>• **Dạng mở:** `7 < length < 129` | 1 ký tự | `[CODE]` Register.jsx:15<br>`[CODE]` App.js:212<br>`[ASSUMED]` (UB=128) | LB = 8 được quy định rõ trong regex client và spec UI (`{8,}`). UB = 128 là giới hạn an toàn thực tế chống tấn công DoS giải thuật băm mật khẩu. |

### 1.2 Danh sách các trường KHÔNG ÁP DỤNG BVA (Kèm lý do minh bạch)

Theo nguyên tắc của môn học, không được bịa đặt các giá trị biên khi miền không có thứ tự:

| Biến / Ràng buộc | Lý do KHÔNG áp dụng BVA |
| :--- | :--- |
| **`email` (Định dạng RFC)** | Cú pháp email là bài toán nhận dạng mẫu (*Pattern matching / Syntax rule*), không phải là biến số có thứ tự liên tục. Tính hợp lệ của email được xác định bởi sự có mặt của `@`, domain, v.v. (Đã được kiểm thử đầy đủ qua Domain Testing tại `EC05, EC06`).<br>*Lưu ý về độ dài:* Theo RFC 5321 độ dài tối đa là 254 ký tự, tuy nhiên mã nguồn SUT hoàn toàn không triển khai kiểm tra độ dài email nên không xem đây là biên nghiệp vụ của hệ thống. |
| **Độ phức tạp `password`** | Các yêu cầu chứa chữ hoa, chữ thường, số, ký tự đặc biệt là các điều kiện boolean độc lập (*Có/Không*). Chúng là các tập rời rạc, không thể so sánh lớn hơn/nhỏ hơn nên không áp dụng BVA. |
| **`existing_email`** | Biến trạng thái chỉ nhận 2 giá trị logic rời rạc `{ false (chưa có), true (đã có) }`. Không có khoảng giá trị liên tục hay khái niệm "lân cận biên". |
| **`Response.status`** | Mã phản hồi HTTP `{ 200, 400, 409, 500 }` là tập phân loại rời rạc (Categorical Enum), không có ý nghĩa khi kiểm thử biên số học. |
| **`Response.message`, `Response.error`** | Chuỗi thông báo là dữ liệu định tính, không có thứ tự định lượng. |

---

## Stage 2: Lựa chọn biến thể BVA (3-value) và Thống kê số lượng điểm kiểm thử

### 2.1 Biến thể được chọn: **3-value BVA** (Khuyến nghị chuẩn của môn học)

Với một khoảng giá trị hợp lệ `[LB, UB]`, biến thể **3-value BVA** kiểm thử 3 điểm tại mỗi biên:
- **Tại cận dưới (LB):** `{ LB - 1 (Invalid), LB (Valid), LB + 1 (Valid) }`
- **Tại cận trên (UB):** `{ UB - 1 (Valid), UB (Valid), UB + 1 (Invalid) }`
$\Rightarrow$ Tổng cộng mỗi khoảng `[LB, UB]` độc lập có **6 điểm kiểm thử**.

#### Lý do chọn biến thể 3-value:
1. **Khắt khe và bao phủ tốt hơn 2-value:** Biến thể 2-value chỉ xét `{ LB-1, LB }` và `{ UB, UB+1 }`. Trong khi đó, 3-value bổ sung thêm điểm sát biên phía bên trong `{ LB+1, UB-1 }`. Điều này giúp phát hiện các lỗi lập trình sai lệch cả hai phía (ví dụ: lập trình viên gõ nhầm `<` thành `<=`, hoặc viết `> 8` thay vì `>= 8`).
2. **Phù hợp với slide môn học S04:** Slide bài giảng về BVA của môn học CSC13003 và chuẩn ISTQB Advanced đều nhấn mạnh biến thể 3-value cho các hệ thống có mức rủi ro cao hoặc logic kiểm tra chặt chẽ.
3. **Mở rộng mô hình 9 điểm (Course 9-point model):**
   - Ngoài 6 điểm của 3-value, mô hình 9 điểm của môn học bổ sung:
     - Giá trị danh định ở giữa miền (*Nominal value*): nằm sâu bên trong khoảng hợp lệ.
     - Cực trị vật lý phía dưới ($-\alpha$ Extreme): độ dài rỗng 0 ký tự (`""`).
     - Cực trị vật lý phía trên ($+\alpha$ Extreme): chuỗi cực đại vật lý (ví dụ: chuỗi 1.000 hoặc 10.000 ký tự) để kiểm thử giới hạn buffer/bộ nhớ của server.

### 2.2 Bảng chi tiết các điểm giá trị biên cần kiểm thử

#### 1. Độ dài trường `name` (`[LB = 1, UB = 100]`):
- **Cận dưới LB = 1:**
  - `LB - 1 = 0`: Chuỗi rỗng `""` (Độ dài 0) $\rightarrow$ **Invalid** (Trùng với `FR01-DT-02`)
  - `LB = 1`: Chuỗi 1 ký tự, ví dụ `"A"` $\rightarrow$ **Valid**
  - `LB + 1 = 2`: Chuỗi 2 ký tự, ví dụ `"An"` $\rightarrow$ **Valid**
- **Cận trên UB = 100:**
  - `UB - 1 = 99`: Chuỗi 99 ký tự $\rightarrow$ **Valid**
  - `UB = 100`: Chuỗi 100 ký tự $\rightarrow$ **Valid**
  - `UB + 1 = 101`: Chuỗi 101 ký tự $\rightarrow$ **Invalid** (theo giả định biên 100)
- **Điểm cực trị (Extreme values):**
  - Chuỗi cực dài 10.000 ký tự $\rightarrow$ **Extreme Invalid / Stress test**

#### 2. Độ dài trường `password` (`[LB = 8, UB = 128]`):
- **Cận dưới LB = 8:**
  - `LB - 1 = 7`: Mật khẩu 7 ký tự (có đủ hoa, thường, số, đặc biệt), ví dụ `"Pass1!a"` $\rightarrow$ **Invalid**
  - `LB = 8`: Mật khẩu 8 ký tự, ví dụ `"Pass12!a"` $\rightarrow$ **Valid**
  - `LB + 1 = 9`: Mật khẩu 9 ký tự, ví dụ `"Pass123!a"` $\rightarrow$ **Valid**
- **Cận trên UB = 128:**
  - `UB - 1 = 127`: Mật khẩu 127 ký tự (đủ yêu cầu phức tạp) $\rightarrow$ **Valid**
  - `UB = 128`: Mật khẩu 128 ký tự $\rightarrow$ **Valid**
  - `UB + 1 = 129`: Mật khẩu 129 ký tự $\rightarrow$ **Invalid** (theo giả định bảo mật)
- **Điểm cực trị (Extreme values):**
  - Mật khẩu 1.000 ký tự $\rightarrow$ **Extreme / DoS Hash test**

### 2.3 Thống kê số lượng giá trị và Test Case dự kiến

- Số biến có miền thứ tự áp dụng BVA: **2 biến** (`name.length` và `password.length`).
- Số biên độc lập: **4 biên** (LB và UB của `name`, LB và UB của `password`).
- Số giá trị kiểm thử theo 3-value: $4 \times 3 = 12$ điểm giá trị biên cốt lõi.
- Số giá trị cực trị (Extreme / Nominal): 3 giá trị (chuỗi 10.000 ký tự cho name, chuỗi 1.000 ký tự cho password, giá trị danh định trung bình).
- **Tổng số giá trị biên cần đánh giá:** **15 giá trị**.
- Một số giá trị (như `length = 0` của name) đã có trong Domain Testing sẽ được đối chiếu chéo (*cross-reference*) để tránh trùng lặp dư thừa.

---

## Stage 3: Thiết kế các ca kiểm thử giá trị biên (BVA Test Cases)

### 3.1 Quy tắc thiết kế (Theo slide môn học S04 & ISTQB)
1. **Thay đổi từng biến một (One variable at a time):** Khi kiểm thử biên của một biến, tất cả các biến đầu vào khác phải được giữ cố định ở **giá trị danh định hợp lệ (Nominal Valid Values)**:
   - `name` danh định: `"Nguyen Van A"` (hợp lệ)
   - `email` danh định: `"user_{{uniq}}@domain.com"` (hợp lệ)
   - `password` danh định: `"Password123!"` (hợp lệ)
   - `existing_email`: `false` (email chưa từng tồn tại)
2. **Độc lập nguyên nhân:** Điểm biên không hợp lệ (`LB - 1` hoặc `UB + 1`) phải kỳ vọng hệ thống từ chối (HTTP 400/422). Điểm biên hợp lệ (`LB`, `LB + 1`, `UB - 1`, `UB`) phải được hệ thống chấp nhận (HTTP 200).
3. **Mục đích bắt lỗi (*Fault it would catch*):** Mỗi test case phải chỉ rõ lỗi code cụ thể mà nó nhắm tới (nhầm `<`, `<=`, lệch 1 ký tự, không chặn DoS payload).
4. **Tránh trùng lặp:** Điểm `name.length = 0` (chuỗi rỗng) đã được kiểm thử tại `FR01-DT-02` trong phần Domain Testing.

### 3.2 Bảng danh sách ca kiểm thử BVA chi tiết (`FR01-BVA-01` -> `FR01-BVA-14`)

| TC ID | Biến kiểm thử | Điểm biên | Giá trị kiểm thử thực tế | Các biến còn lại | Kết quả kỳ vọng | Lỗi code sẽ bắt được (Fault it would catch) | Nguồn gốc |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- | :---: |
| **FR01-BVA-01** | `name.length` | **LB** (1) | `"A"` *(1 ký tự)* | `email`, `password` danh định | HTTP 200, tạo user thành công | Developer viết nhầm `length > 1` hoặc quy định tên tối thiểu 2 ký tự | `[SPEC]` |
| **FR01-BVA-02** | `name.length` | **LB + 1** (2) | `"An"` *(2 ký tự)* | `email`, `password` danh định | HTTP 200, tạo user thành công | Lỗi lệch 1 đơn vị cận dưới (off-by-one ở LB) | `[SPEC]` |
| **FR01-BVA-03** | `name.length` | **UB - 1** (99) | Chuỗi 99 ký tự `"A".repeat(99)` | `email`, `password` danh định | HTTP 200, tạo user thành công | Developer viết nhầm điều kiện `< 99` thay vì `<= 100` | `[ASSUMED]` |
| **FR01-BVA-04** | `name.length` | **UB** (100) | Chuỗi 100 ký tự `"A".repeat(100)` | `email`, `password` danh định | HTTP 200, tạo user thành công | Developer viết nhầm điều kiện `< 100` thay vì `<= 100` | `[ASSUMED]` |
| **FR01-BVA-05** | `name.length` | **UB + 1** (101) | Chuỗi 101 ký tự `"A".repeat(101)` | `email`, `password` danh định | HTTP 400/422, từ chối tạo user | Hệ thống không có giới hạn chặn độ dài họ tên tối đa | `[ASSUMED]` |
| **FR01-BVA-06** | `name.length` | **Extreme** (10.000) | Chuỗi 10.000 ký tự `"A".repeat(10000)` | `email`, `password` danh định | HTTP 400/413, từ chối payload lớn | Lỗi tràn bộ nhớ đệm, crash SQLite hoặc nghẽn mạng do payload cực lớn | `[ASSUMED]` |
| **FR01-BVA-07** | `password.length` | **LB - 1** (7) | `"Pass1!a"` *(7 ký tự, đủ 4 nhóm)* | `name`, `email` danh định | HTTP 400/422, từ chối mật khẩu yếu | Developer viết nhầm `length >= 7` hoặc `length > 6` (cho phép 7 ký tự) | `[CODE]` |
| **FR01-BVA-08** | `password.length` | **LB** (8) | `"Pass12!a"` *(8 ký tự, đủ 4 nhóm)* | `name`, `email` danh định | HTTP 200, tạo user thành công | Developer viết nhầm `length > 8` (khiến mật khẩu 8 ký tự hợp lệ bị từ chối) | `[CODE]` |
| **FR01-BVA-09** | `password.length` | **LB + 1** (9) | `"Pass123!a"` *(9 ký tự, đủ 4 nhóm)* | `name`, `email` danh định | HTTP 200, tạo user thành công | Lỗi lệch 1 đơn vị cận dưới (off-by-one) | `[CODE]` |
| **FR01-BVA-10** | `password.length` | **UB - 1** (127) | Mật khẩu 127 ký tự: `"Pass1!" + "a".repeat(121)` | `name`, `email` danh định | HTTP 200, tạo user thành công | Developer viết nhầm điều kiện `< 127` thay vì `<= 128` | `[ASSUMED]` |
| **FR01-BVA-11** | `password.length` | **UB** (128) | Mật khẩu 128 ký tự: `"Pass1!" + "a".repeat(122)` | `name`, `email` danh định | HTTP 200, tạo user thành công | Developer viết nhầm điều kiện `< 128` thay vì `<= 128` | `[ASSUMED]` |
| **FR01-BVA-12** | `password.length` | **UB + 1** (129) | Mật khẩu 129 ký tự: `"Pass1!" + "a".repeat(123)` | `name`, `email` danh định | HTTP 400/422, từ chối mật khẩu quá dài | Không chặn mật khẩu vượt ngưỡng 128 ký tự | `[ASSUMED]` |
| **FR01-BVA-13** | `password.length` | **Extreme** (1.000) | Mật khẩu 1.000 ký tự: `"Pass1!" + "a".repeat(994)` | `name`, `email` danh định | HTTP 400/413, từ chối | Tấn công DoS giải thuật băm mật khẩu (CPU exhaustion / bcrypt DoS) | `[ASSUMED]` |
| **FR01-BVA-14** | `name.encoding` | **Biên UTF-8** (100 ký tự) | `"Nguyễn " + "a".repeat(92)` *(100 ký tự Unicode, > 100 bytes)* | `email`, `password` danh định | HTTP 200, tạo user thành công | Nhầm lẫn giữa độ dài byte (UTF-8 bytes) và độ dài ký tự (character length) | `[ASSUMED]` |

---

## Stage 4: Tự kiểm tra (Self-Check Checklist)

- [x] Mọi biên đều có nhãn nguồn (`[SPEC]`, `[CODE]`, `[ASSUMED]`) và cách đọc khoảng giá trị đóng/mở được ghi rõ ràng.
- [x] Mỗi ca kiểm thử BVA chỉ thay đổi duy nhất một biến, các biến còn lại giữ ở giá trị danh định hợp lệ.
- [x] Không tự tiện bịa biên cho các trường không có thứ tự (`email`, `existing_email`, `status`).
- [x] Biến thể 3-value và mô hình 9 điểm được nêu rõ công thức, số lượng giá trị và lý do lựa chọn.
- [x] Các chuỗi dữ liệu kiểm thử được tính toán độ dài chính xác theo công thức lập trình.
- [x] Toàn bộ báo cáo được trình bày bằng tiếng Việt có dấu chuẩn mực, giữ nguyên các mã định danh kỹ thuật (BVA, TC, HTTP verbs, status codes) bằng tiếng Anh.

---

## Hạn chế của kỹ thuật Phân tích giá trị biên (BVA Blind Spots & Limitations)

1. **Hoàn toàn bất lực với các miền không có thứ tự (Unordered domain blindness):**
   - BVA chỉ phát huy hiệu quả khi biến có thứ tự số học hoặc độ dài. Các lỗi về cú pháp email, SQL injection, hoặc phân quyền vai trò không thể phát hiện qua BVA (phải phụ thuộc vào Equivalence Partitioning hoặc kịch bản chuyên biệt).
2. **Nguy cơ bùng nổ số lượng test case khi kết hợp nhiều biến (Combinatorial explosion):**
   - Nếu áp dụng kiểm thử đồng thời nhiều biến ở biên (Robust Boundary Testing), số lượng test case sẽ tăng theo cấp số nhân ($3^n$ hoặc $6^n$). Vì vậy, phương pháp chuẩn là chỉ biến thiên 1 biến tại một thời điểm (*one variable at a time*).
3. **Phụ thuộc chặt chẽ vào độ chính xác của tài liệu đặc tả:**
   - Nếu đặc tả không quy định rõ cận trên (như `name` hay `password` trong EShop không ghi max length), kiểm thử viên buộc phải đặt giả định (`[ASSUMED]`). Nếu giả định sai lệch so với ý đồ thiết kế, ca kiểm thử có thể đánh giá sai hành vi của hệ thống.

---

> [!NOTE]
> **STOP FOR REVIEW (Stage 3 & Stage 4 Complete)**:  
> Báo cáo BVA cho FR-01 đã hoàn tất đầy đủ 14 test cases và phân tích hạn chế. Dưới đây chúng ta sẽ cập nhật các ca kiểm thử BVA này vào file máy đọc được [`testcases/FR-01.json`](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/testcases/FR-01.json).

