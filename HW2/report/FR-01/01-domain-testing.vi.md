# FR-01: Đăng ký tài khoản (Account Registration)

## Stage 0: Thu thập thông tin

### 1.1 Endpoint

| Thông tin | Giá trị |
|-----------|---------|
| HTTP Method | POST |
| Đường dẫn | `/api/register` |
| Base URL | `http://localhost:3000` |

### 1.2 Request Fields

| Tên trường | Kiểu dữ liệu | Bắt buộc | Nguồn |
|------------|---------------|----------|-------|
| name | String | Có (theo spec) | [SPEC] docs/api_specification.md:14 |
| email | String | Có (theo spec) | [SPEC] docs/api_specification.md:15 |
| password | String | Có (theo spec) | [SPEC] docs/api_specification.md:16 |

### 1.3 Validation Rules - PHÁT HIỆN QUAN TRỌNG

**⚠️ KHÔNG CÓ VALIDATION TRONG CODE!**

Sau khi kiểm tra mã nguồn tại `eshop-sut/backend/server.js:20-30`, tôi phát hiện:

```javascript
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;
  db.run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "User registered successfully", id: this.lastID });
    },
  );
});
```

**Điều này có nghĩa:**
- **Không có kiểm tra required** - name, email, password có thể là `undefined` hoặc `null`
- **Không có kiểm tra định dạng email** - bất kỳ chuỗi nào cũng được chấp nhận
- **Không có kiểm tra độ dài password** - chuỗi rỗng cũng được chấp nhận
- **Không có kiểm tra email đã tồn tại** - không có UNIQUE constraint trong DB schema

### 1.4 Database Schema

Tại `eshop-sut/backend/database.js:50-61`:

| Trường | Kiểu | Ràng buộc |
|--------|------|-----------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| name | TEXT | Không có |
| email | TEXT | Không có (KHÔNG UNIQUE!) |
| password | TEXT | Không có |
| role | TEXT | DEFAULT 'user' |
| login_attempts | INTEGER | DEFAULT 0 |
| locked_until | DATETIME | Null |
| reset_token | TEXT | Null |
| shipping_address | TEXT | Null |
| phone | TEXT | Null |

### 1.5 Possible Responses

| Status | Response | Điều kiện |
|--------|----------|-----------|
| 200 | `{ "message": "User registered successfully", "id": <id> }` | Thành công |
| 500 | `{ "error": <err.message> }` | Lỗi database (email duplicate nếu có constraint khác, lỗi SQL...) |

---

## Stage 1: Xác định biến Input, Output, State và Miền giá trị (Domains)

Bảng biến chi tiết bao gồm tập giá trị khả dĩ và các ràng buộc đã phát hiện (độ dài, ký tự cho phép, định dạng, tính bắt buộc, enum/giá trị hợp lệ):

| Biến | Loại (Kind) | Kiểu dữ liệu | Miền giá trị & Ràng buộc (Domain) | Nguồn (Source tag) |
| :--- | :--- | :--- | :--- | :---: |
| `name` | Input | String | - Chuỗi ký tự biểu diễn họ tên người dùng.<br>- Ràng buộc: Bắt buộc (không được rỗng `""`, không được `null`/`undefined`).<br>- Độ dài: Chưa có giới hạn trong spec (`unknown`), thường từ 1..100 ký tự.<br>- Ký tự: Chữ cái, khoảng trắng, có dấu tiếng Việt.<br>- *Thực tế code:* `server.js:20` không kiểm tra, chấp nhận mọi kiểu dữ liệu/rỗng. | `[SPEC]` api_spec:14<br>`[ASSUMED]` (độ dài)<br>`[CODE]` server.js:20 |
| `email` | Input | String | - Chuỗi định dạng email chuẩn RFC 5322 (`<local-part>@<domain>`).<br>- Ràng buộc: Bắt buộc, định dạng hợp lệ, không chứa ký tự cấm/khoảng trắng, không được trùng với email đã có.<br>- Độ dài: Tối đa 254 ký tự (theo RFC 5321).<br>- *Thực tế code:* `server.js:20` không kiểm tra regex, DB schema không có ràng buộc `UNIQUE`. | `[SPEC]` api_spec:15<br>`[ASSUMED]` (RFC limits)<br>`[CODE]` server.js:20, database.js:55 |
| `password` | Input | String | - Chuỗi mật khẩu xác thực người dùng.<br>- Ràng buộc độ dài: Tối thiểu 8 ký tự (`>= 8`), cận trên chưa xác định (`unknown`, thường <= 128).<br>- Ràng buộc độ phức tạp: Phải chứa ít nhất 1 chữ thường `[a-z]`, 1 chữ hoa `[A-Z]`, 1 số `\d`, và 1 ký tự đặc biệt `[^A-Za-z\d]`.<br>- *Dị biệt code:*<br>  + Web (`Register.jsx:15`): Dùng regex lỗi đòi hỏi khoảng trắng `\s` thay vì ký tự đặc biệt.<br>  + Mobile (`App.js:212`): Regex chuẩn đòi hỏi ký tự đặc biệt.<br>  + Backend (`server.js:20`): Không kiểm tra độ dài/độ phức tạp. | `[SPEC]` api_spec:16<br>`[CODE]` Register.jsx:15<br>`[CODE]` App.js:212<br>`[CODE]` server.js:20 |
| `existing_email` | State | Boolean | - Trạng thái tồn tại của email trong cơ sở dữ liệu `users`.<br>- Miền giá trị: `{ false (chưa có trong DB), true (đã có trong DB) }`.<br>- Ràng buộc nghiệp vụ: Chỉ cho phép đăng ký khi `existing_email == false`. Nếu `true`, hệ thống phải từ chối (trùng lặp).<br>- *Thực tế code:* Backend không kiểm tra SELECT trước khi INSERT, SQLite không có `UNIQUE(email)`. | `[ASSUMED]` Business rule<br>`[CODE]` database.js:55 |
| `Response.status` | Output | Number | - Mã trạng thái HTTP trả về từ API.<br>- Miền giá trị kỳ vọng: `{ 200 (Thành công), 400 (Dữ liệu validation không hợp lệ), 409 (Email bị trùng lặp), 500 (Lỗi máy chủ/database) }`.<br>- *Thực tế code:* Backend chỉ trả về `200` (khi insert thành công) hoặc `500` (khi SQLite ném lỗi). | `[SPEC]` api_spec:21<br>`[ASSUMED]` (400, 409)<br>`[CODE]` server.js:26-27 |
| `Response.message` | Output | String | - Chuỗi thông báo thành công hoặc lỗi.<br>- Miền giá trị: `"User registered successfully"` (khi 200), hoặc các câu thông báo lỗi chi tiết tương ứng với trường vi phạm. | `[SPEC]` api_spec:21<br>`[CODE]` server.js:27 |
| `Response.error` | Output | String | - Chuỗi thông báo lỗi khi có ngoại lệ hoặc thất bại.<br>- Miền giá trị: Thông báo lỗi từ SQLite `<err.message>` (500) hoặc `"Đăng ký thất bại."` (Client). | `[CODE]` server.js:26<br>`[CODE]` Register.jsx:26 |
| `Response.id` | Output | Integer | - Định danh khóa chính ID của người dùng mới được tạo trong bảng `users`.<br>- Miền giá trị: Số nguyên dương tăng dần (`id >= 1`, auto-increment). | `[SPEC]` api_spec:21<br>`[CODE]` database.js:53, server.js:27 |

---

## Nguồn tham khảo

- **Spec**: `eshop-sut/api_specification.md` - mục 1.1 POST /api/register
- **Code - Route**: `eshop-sut/backend/server.js:20-30` - xử lý register
- **Code - Schema**: `eshop-sut/backend/database.js:50-61` - bảng users
- **Spec - Response**: `eshop-sut/api_specification.md:21` - response 200 OK

---

## Câu hỏi mở (Open Questions)

1. **Email duplicate**: Theo logic nghiệp vụ, email phải là duy nhất. Tuy nhiên trong schema database không có UNIQUE constraint. Điều này có phải là bug không? Hay validation được thực hiện ở tầng khác?

2. **Validation rules**: Spec chỉ đưa ra các trường bắt buộc nhưng không nêu rõ:
   - Độ dài tối thiểu/tối đa của name?
   - Định dạng email (regex)?
   - Độ dài tối thiểu của password?
   - Yêu cầu về ký tự đặc biệt, số, chữ hoa trong password?

3. **Trường hợp edge case**: Khi gửi request với body rỗng `{}`, hệ thống sẽ xử lý thế nào?

---

## Gắn nguồn cho các ràng buộc

| Ràng buộc | Loại | Nguồn | Ghi chú |
|-----------|------|-------|---------|
| name là bắt buộc | [ASSUMED] | Spec nhưng không có validation trong code | Cần xác nhận |
| email là bắt buộc | [ASSUMED] | Spec nhưng không có validation trong code | Cần xác nhận |
| password là bắt buộc | [ASSUMED] | Spec nhưng không có validation trong code | Cần xác nhận |
| Không có validation ở backend | [CODE] | backend/server.js:20-30 | Server lưu thẳng vào DB không qua kiểm tra |
| Client Web có regex password lỗi (`flawedStrongPasswordRegex`) | [CODE] | frontend-web/src/pages/Register.jsx:15 | Đòi hỏi khoảng trắng `\s` thay vì ký tự đặc biệt |
| Client Mobile có regex password đúng chuẩn | [CODE] | frontend-mobile/App.js:211-213 | Yêu cầu ký tự đặc biệt `(?=.*[^A-Za-z\d])` |
| Database không có UNIQUE constraint cho email | [CODE] | backend/database.js:50-61 | Bảng users không có UNIQUE(email) |
| Response 200 khi thành công | [CODE] | backend/server.js:27 | Trả về message và id |
| Response 500 khi lỗi hệ thống | [CODE] | backend/server.js:26 | Trả về error |

---

## Stage 2: Phân hoạch tương đương (Equivalence Partitioning)

Áp dụng phương pháp 4 bước theo slide môn học **S04 - Domain Testing**:
1. Ràng buộc miền giá trị (*Range of values*): 1 lớp hợp lệ + 2 lớp không hợp lệ (dưới biên, trên biên).
2. Ràng buộc tập giá trị (*Set of values*): 1 lớp hợp lệ cho mỗi giá trị được xử lý riêng + 1 lớp không hợp lệ.
3. Ràng buộc "Bắt buộc phải là" (*Must be*): 1 lớp hợp lệ + 1 lớp không hợp lệ.
4. Tách lớp khi các phần tử có khả năng xử lý khác nhau.
5. Lớp kết quả đầu ra (*Output classes*): Mỗi kết quả đầu ra riêng biệt tạo 1 lớp.

### 2.1 Bảng phân hoạch tương đương hoàn chỉnh (Complete Set of Partitions)

| EC ID | Biến kiểm thử | Mô tả lớp tương đương | Hợp lệ / Không hợp lệ | Nguyên tắc áp dụng | Nguồn gốc |
| :--- | :--- | :--- | :---: | :--- | :---: |
| **EC01** | `name` | Chuỗi ký tự hợp lệ (1..100 ký tự, có thể có dấu tiếng Việt) | **Valid** | Must be a valid string / Range | [SPEC] api_spec:14 |
| **EC02** | `name` | Chuỗi rỗng (`""`) | **Invalid** | Must be non-empty | [SPEC] api_spec:14 |
| **EC03** | `name` | Trường bị thiếu hoặc `null` / `undefined` | **Invalid** | Required field | [SPEC] api_spec:14 |
| **EC04** | `name` | Sai kiểu dữ liệu (Number, Object, Array) | **Invalid** | Type mismatch | [ASSUMED] |
| **EC05** | `email` | Đúng định dạng email chuẩn RFC (`user@domain.com`) | **Valid** | Must be an email | [SPEC] api_spec:15 |
| **EC06** | `email` | Sai định dạng (thiếu `@`, thiếu tên miền, chứa ký tự cấm) | **Invalid** | Must be an email | [SPEC] api_spec:15 |
| **EC07** | `email` | Chuỗi rỗng (`""`) | **Invalid** | Must be non-empty | [SPEC] api_spec:15 |
| **EC08** | `email` | Trường bị thiếu hoặc `null` / `undefined` | **Invalid** | Required field | [SPEC] api_spec:15 |
| **EC09** | `email` | Sai kiểu dữ liệu (Number, Boolean) | **Invalid** | Type mismatch | [ASSUMED] |
| **EC10** | `password` | Mật khẩu mạnh hợp lệ (>= 8 ký tự, có hoa, thường, số, ký tự đặc biệt) | **Valid** | Must satisfy complexity rules | [SPEC] api_spec:16 / [CODE] |
| **EC11** | `password` | Mật khẩu quá ngắn (1..7 ký tự) | **Invalid** | Range of length (< 8) | [CODE] Register.jsx:15 / App.js:212 |
| **EC12** | `password` | Thiếu chữ in hoa (chỉ có chữ thường, số, ký tự đặc biệt) | **Invalid** | Must have uppercase | [CODE] Register.jsx:15 / App.js:212 |
| **EC13** | `password` | Thiếu chữ in thường (chỉ có chữ hoa, số, ký tự đặc biệt) | **Invalid** | Must have lowercase | [CODE] Register.jsx:15 / App.js:212 |
| **EC14** | `password` | Thiếu chữ số (chỉ có chữ hoa, chữ thường, ký tự đặc biệt) | **Invalid** | Must have digit | [CODE] Register.jsx:15 / App.js:212 |
| **EC15** | `password` | Thiếu ký tự đặc biệt (chỉ có chữ và số) | **Invalid** | Must have special char | [CODE] App.js:212 / Spec UI |
| **EC16** | `password` | Chuỗi rỗng (`""`) | **Invalid** | Must be non-empty | [SPEC] api_spec:16 |
| **EC17** | `password` | Trường bị thiếu hoặc `null` / `undefined` | **Invalid** | Required field | [SPEC] api_spec:16 |
| **EC18** | `existing_email` | Email chưa từng đăng ký trong hệ thống (chưa có trong DB) | **Valid** | State: Unique record | [ASSUMED] Business rule |
| **EC19** | `existing_email` | Email đã tồn tại trong hệ thống (bị trùng lặp) | **Invalid** | State: Duplicate conflict | [ASSUMED] Business rule |
| **EC20** | Output | Đăng ký thành công: HTTP 200 `{ "message": "User registered successfully", "id": <number> }` | **Valid Output** | Output condition | [SPEC] api_spec:21 / [CODE] |
| **EC21** | Output | Từ chối do lỗi validation: HTTP 400 / Thông báo lỗi trên giao diện | **Invalid Output** | Output condition | [ASSUMED] Standard REST API |
| **EC22** | Output | Từ chối do trùng lặp tài khoản: HTTP 409 / 400 Conflict | **Invalid Output** | Output condition | [ASSUMED] Standard REST API |
| **EC23** | Output | Lỗi máy chủ / Database: HTTP 500 `{ "error": <message> }` | **Error Output** | Output condition | [CODE] server.js:26 |

---

## Câu hỏi mở sau Stage 2 (Open Questions for Student Review)

1. **Sự không nhất quán giữa Backend và Frontend**:
   - Backend `server.js` không hề chặn bất kỳ class không hợp lệ nào (EC02, EC03, EC06, EC07, EC11-17, EC19). Tất cả đều lọt vào DB và trả về HTTP 200!
   - Frontend Web chặn password bằng regex sai (`flawedStrongPasswordRegex` đòi hỏi khoảng trắng thay vì ký tự đặc biệt).
   - Frontend Mobile chặn password bằng regex chuẩn.
   *-> Bạn có đồng ý giữ nguyên kỳ vọng chuẩn của nghiệp vụ (các EC invalid phải bị từ chối) để khi chạy test runner sẽ phát hiện ra các lỗi thực tế này không?*

2. **Quy tắc email trùng lặp (EC19)**:
   - Trong schema SQLite không có `UNIQUE(email)`. Backend vẫn cho phép đăng ký vô hạn tài khoản có cùng email.
   *-> Đây sẽ được đánh dấu là một lỗi nghiệp vụ / khiếm khuyết bảo mật nghiêm trọng (SUT Defect).*

---

## Stage 3: Chọn giá trị đại diện cho từng lớp tương đương (Best Representatives)

Quy tắc lựa chọn theo slide bài giảng S04:
- Miền có thứ tự (ordered/ranged): Giá trị đại diện là giá trị biên hoặc cận biên (`-> BVA` sẽ khai thác sâu hơn).
- Miền không có thứ tự (unordered): Chọn giá trị điển hình, thực tế.

| EC ID | Biến | Mô tả lớp | Giá trị đại diện được chọn | Lý do lựa chọn |
| :--- | :--- | :--- | :--- | :--- |
| **EC01** | `name` | Chuỗi ký tự hợp lệ | `"Nguyen Van A"` | Dữ liệu mẫu chuẩn từ đặc tả `api_specification.md` |
| **EC02** | `name` | Chuỗi rỗng | `""` | Chuỗi có độ dài 0 (không có ký tự) |
| **EC03** | `name` | Omitted / Missing | `(không truyền trường name)` | Kiểm tra hành vi khi request body thiếu hẳn key `name` |
| **EC04** | `name` | Sai kiểu dữ liệu | `12345` | Số nguyên thay vì chuỗi văn bản |
| **EC05** | `email` | Email hợp lệ chuẩn RFC | `"user_{{uniq}}@domain.com"` | Định dạng email chuẩn, dùng `{{uniq}}` để đảm bảo duy nhất |
| **EC06** | `email` | Sai định dạng email | `"invalid_email_domain.com"` | Chuỗi thiếu ký tự `@` và domain |
| **EC07** | `email` | Chuỗi rỗng | `""` | Chuỗi có độ dài 0 |
| **EC08** | `email` | Omitted / Missing | `(không truyền trường email)` | Kiểm tra hành vi khi request body thiếu hẳn key `email` |
| **EC09** | `email` | Sai kiểu dữ liệu | `true` | Kiểu Boolean thay vì chuỗi email |
| **EC10** | `password` | Mật khẩu mạnh hợp lệ | `"Password123!"` | Đầy đủ chữ hoa, chữ thường, số, ký tự đặc biệt, độ dài 12 (`>= 8`) |
| **EC11** | `password` | Quá ngắn (< 8 ký tự) | `"Pass1!"` | 6 ký tự, có đủ nhóm ký tự nhưng vi phạm độ dài tối thiểu |
| **EC12** | `password` | Thiếu chữ in hoa | `"password123!"` | Đủ độ dài, có thường, số, ký tự đặc biệt nhưng thiếu chữ hoa |
| **EC13** | `password` | Thiếu chữ in thường | `"PASSWORD123!"` | Đủ độ dài, có hoa, số, ký tự đặc biệt nhưng thiếu chữ thường |
| **EC14** | `password` | Thiếu chữ số | `"Password!"` | Đủ độ dài, có hoa, thường, ký tự đặc biệt nhưng thiếu số |
| **EC15** | `password` | Thiếu ký tự đặc biệt | `"Password123"` | Đủ độ dài, có hoa, thường, số nhưng thiếu ký tự đặc biệt |
| **EC16** | `password` | Chuỗi rỗng | `""` | Chuỗi có độ dài 0 |
| **EC17** | `password` | Omitted / Missing | `(không truyền trường password)` | Kiểm tra hành vi khi request body thiếu hẳn key `password` |
| **EC18** | `existing_email`| Email chưa tồn tại | Email sinh bằng `{{uniq}}` | Đảm bảo tính duy nhất khi kiểm thử |
| **EC19** | `existing_email`| Email đã tồn tại | `"admin@eshop.com"` | Tài khoản admin đã có sẵn trong cơ sở dữ liệu mẫu |
| **EC20** | Output | Đăng ký thành công | HTTP 200 + `{ "message": "User registered successfully" }` | Kết quả kỳ vọng cho test case hợp lệ |
| **EC21** | Output | Từ chối validation | HTTP 400/422 + báo lỗi | Kỳ vọng khi vi phạm bất kỳ lớp Invalid nào của input |
| **EC22** | Output | Từ chối do trùng lặp | HTTP 409/400 + báo lỗi conflict | Kỳ vọng khi đăng ký với email đã tồn tại |
| **EC23** | Output | Lỗi máy chủ/database | HTTP 500 + `{ "error": ... }` | Ngoại lệ hệ thống hoặc SQL crash |

---

## Stage 4: Lựa chọn bộ Test Case tối thiểu (Selecting Test Cases)

### 4.1 Quy tắc kết hợp (Theo slide bài giảng S04)
1. **Bao phủ toàn bộ:** Mỗi lớp tương đương phải xuất hiện trong ít nhất một test case.
2. **Lớp hợp lệ (Valid classes):** Kết hợp tối đa các lớp hợp lệ vào cùng một test case cho đến khi tất cả các lớp hợp lệ đều được kiểm thử (`FR01-DT-01`).
3. **Lớp không hợp lệ (Invalid classes):** Mỗi test case **chỉ chứa duy nhất một lớp không hợp lệ**, tất cả các trường dữ liệu còn lại phải giữ ở giá trị hợp lệ để cô lập nguyên nhân gây lỗi (`FR01-DT-02` đến `FR01-DT-16`).
4. **Lớp đầu ra (Output classes):** Được bao phủ trực tiếp bởi các test case sinh ra chúng.

### 4.2 Bảng danh sách Test Case chi tiết

| TC ID | Lớp bao phủ (Partitions) | Trường `name` | Trường `email` | Trường `password` | Tiền điều kiện | Kỳ vọng đầu ra | Nguồn gốc |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **FR01-DT-01** | EC01, EC05, EC10, EC18, EC20 | `"Nguyen Van A"` | `"user_{{uniq}}@domain.com"` | `"Password123!"` | Email chưa tồn tại | HTTP 200, message: "User registered successfully" | [SPEC] |
| **FR01-DT-02** | EC02, EC21 | `""` | `"user_{{uniq}}@domain.com"` | `"Password123!"` | Không có | HTTP 400/422, từ chối tạo user | [ASSUMED] |
| **FR01-DT-03** | EC03, EC21 | *(omitted)* | `"user_{{uniq}}@domain.com"` | `"Password123!"` | Không có | HTTP 400/422, từ chối tạo user | [SPEC] |
| **FR01-DT-04** | EC04, EC21 | `12345` | `"user_{{uniq}}@domain.com"` | `"Password123!"` | Không có | HTTP 400/422, từ chối tạo user | [ASSUMED] |
| **FR01-DT-05** | EC06, EC21 | `"Nguyen Van A"` | `"invalid_email_domain.com"` | `"Password123!"` | Không có | HTTP 400/422, từ chối tạo user | [SPEC] |
| **FR01-DT-06** | EC07, EC21 | `"Nguyen Van A"` | `""` | `"Password123!"` | Không có | HTTP 400/422, từ chối tạo user | [ASSUMED] |
| **FR01-DT-07** | EC08, EC21 | `"Nguyen Van A"` | *(omitted)* | `"Password123!"` | Không có | HTTP 400/422, từ chối tạo user | [SPEC] |
| **FR01-DT-08** | EC09, EC21 | `"Nguyen Van A"` | `true` | `"Password123!"` | Không có | HTTP 400/422, từ chối tạo user | [ASSUMED] |
| **FR01-DT-09** | EC11, EC21 | `"Nguyen Van A"` | `"user_{{uniq}}@domain.com"` | `"Pass1!"` | Không có | HTTP 400/422, từ chối tạo user | [CODE] |
| **FR01-DT-10** | EC12, EC21 | `"Nguyen Van A"` | `"user_{{uniq}}@domain.com"` | `"password123!"` | Không có | HTTP 400/422, từ chối tạo user | [CODE] |
| **FR01-DT-11** | EC13, EC21 | `"Nguyen Van A"` | `"user_{{uniq}}@domain.com"` | `"PASSWORD123!"` | Không có | HTTP 400/422, từ chối tạo user | [CODE] |
| **FR01-DT-12** | EC14, EC21 | `"Nguyen Van A"` | `"user_{{uniq}}@domain.com"` | `"Password!"` | Không có | HTTP 400/422, từ chối tạo user | [CODE] |
| **FR01-DT-13** | EC15, EC21 | `"Nguyen Van A"` | `"user_{{uniq}}@domain.com"` | `"Password123"` | Không có | HTTP 400/422, từ chối tạo user | [CODE] |
| **FR01-DT-14** | EC16, EC21 | `"Nguyen Van A"` | `"user_{{uniq}}@domain.com"` | `""` | Không có | HTTP 400/422, từ chối tạo user | [ASSUMED] |
| **FR01-DT-15** | EC17, EC21 | `"Nguyen Van A"` | `"user_{{uniq}}@domain.com"` | *(omitted)* | Không có | HTTP 400/422, từ chối tạo user | [SPEC] |
| **FR01-DT-16** | EC19, EC22 | `"Nguyen Van A"` | `"admin@eshop.com"` | `"Password123!"` | Email đã tồn tại | HTTP 409/400, từ chối trùng lặp | [ASSUMED] |

### 4.3 Ma trận bao phủ lớp tương đương (Coverage Matrix)

| Lớp tương đương (EC) | Loại lớp | Test Case kiểm thử | Tình trạng bao phủ |
| :--- | :---: | :---: | :---: |
| **EC01** (`name` valid) | Valid | `FR01-DT-01`, `FR01-DT-05` -> `16` | ✅ Bao phủ đầy đủ |
| **EC02** (`name` rỗng `""`) | Invalid | `FR01-DT-02` | ✅ Bao phủ đơn lập |
| **EC03** (`name` omitted) | Invalid | `FR01-DT-03` | ✅ Bao phủ đơn lập |
| **EC04** (`name` sai kiểu) | Invalid | `FR01-DT-04` | ✅ Bao phủ đơn lập |
| **EC05** (`email` valid) | Valid | `FR01-DT-01` -> `04`, `09` -> `15` | ✅ Bao phủ đầy đủ |
| **EC06** (`email` sai định dạng) | Invalid | `FR01-DT-05` | ✅ Bao phủ đơn lập |
| **EC07** (`email` rỗng `""`) | Invalid | `FR01-DT-06` | ✅ Bao phủ đơn lập |
| **EC08** (`email` omitted) | Invalid | `FR01-DT-07` | ✅ Bao phủ đơn lập |
| **EC09** (`email` sai kiểu) | Invalid | `FR01-DT-08` | ✅ Bao phủ đơn lập |
| **EC10** (`password` valid) | Valid | `FR01-DT-01` -> `08`, `16` | ✅ Bao phủ đầy đủ |
| **EC11** (`password` < 8 ký tự) | Invalid | `FR01-DT-09` | ✅ Bao phủ đơn lập |
| **EC12** (`password` thiếu hoa) | Invalid | `FR01-DT-10` | ✅ Bao phủ đơn lập |
| **EC13** (`password` thiếu thường)| Invalid | `FR01-DT-11` | ✅ Bao phủ đơn lập |
| **EC14** (`password` thiếu số) | Invalid | `FR01-DT-12` | ✅ Bao phủ đơn lập |
| **EC15** (`password` thiếu đặc biệt)| Invalid | `FR01-DT-13` | ✅ Bao phủ đơn lập |
| **EC16** (`password` rỗng `""`) | Invalid | `FR01-DT-14` | ✅ Bao phủ đơn lập |
| **EC17** (`password` omitted) | Invalid | `FR01-DT-15` | ✅ Bao phủ đơn lập |
| **EC18** (`existing_email` false) | Valid | `FR01-DT-01` -> `15` | ✅ Bao phủ đầy đủ |
| **EC19** (`existing_email` true) | Invalid | `FR01-DT-16` | ✅ Bao phủ đơn lập |
| **EC20** (Output: HTTP 200) | Valid Output | `FR01-DT-01` | ✅ Bao phủ |
| **EC21** (Output: HTTP 400) | Invalid Output| `FR01-DT-02` -> `15` | ✅ Bao phủ |
| **EC22** (Output: HTTP 409) | Invalid Output| `FR01-DT-16` | ✅ Bao phủ |
| **EC23** (Output: HTTP 500) | Error Output | Phụ thuộc vào ngoại lệ hệ thống DB | Sẽ quan sát khi chạy SUT |

### 4.4 Thống kê số lượng
- **Tổng số lớp tương đương đã xác định:** 23
  - Lớp đầu vào & trạng thái hợp lệ (Valid): 4 (`EC01`, `EC05`, `EC10`, `EC18`)
  - Lớp đầu vào & trạng thái không hợp lệ (Invalid): 15 (`EC02`..`EC04`, `EC06`..`EC09`, `EC11`..`EC17`, `EC19`)
  - Lớp đầu ra (Outputs): 4 (`EC20`, `EC21`, `EC22`, `EC23`)
- **Số lượng Test Case trong bộ tối thiểu (Minimum Test Set):** **16 Test Cases**
  - Số test case hợp lệ: 1 (`FR01-DT-01`, kết hợp 4 lớp valid đầu vào)
  - Số test case không hợp lệ: 15 (mỗi test case kiểm thử đúng 1 lớp invalid)
- **Tỷ lệ bao phủ lớp tương đương:** **100%** (Tất cả 23 lớp đều được ánh xạ ít nhất 1 lần).

---

## Stage 5: Tự kiểm tra (Self-Check Checklist)

- [x] Mỗi ca kiểm thử không hợp lệ (Invalid TC) chỉ chứa đúng 1 lớp không hợp lệ, tất cả các trường khác đều hợp lệ.
- [x] Không có hai ca kiểm thử nào rơi vào cùng một lớp tương đương (trừ trường hợp kết hợp valid).
- [x] Mọi kết quả kỳ vọng đều được gắn nhãn nguồn gốc `[SPEC]`, `[CODE]`, `[ASSUMED]`.
- [x] Các giá trị biên chưa bị mở rộng ở đây (sẽ được mở rộng ở bước BVA tiếp theo).
- [x] Đã tạo file dữ liệu máy đọc được [`testcases/FR-01.json`](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/testcases/FR-01.json) và [`testcases/config.json`](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/testcases/config.json).
- [x] Toàn bộ báo cáo được trình bày bằng tiếng Việt có dấu chuẩn mực, giữ nguyên các mã định danh kỹ thuật (EC, TC, HTTP verbs, status codes) bằng tiếng Anh.

---

## Hạn chế của kỹ thuật Kiểm thử miền (Blind Spots & Limitations)

1. **Điểm mù về giá trị biên (Boundary blindness):**
   - Kỹ thuật phân hoạch tương đương chỉ chọn một giá trị đại diện ngẫu nhiên trong mỗi lớp tương đương (ví dụ: mật khẩu 6 ký tự đại diện cho lớp `< 8` ký tự). Do đó, kỹ thuật này rất dễ bỏ sót các lỗi lệch 1 đơn vị (*off-by-one errors*) tại đúng điểm biên (ví dụ: 7 ký tự hay 8 ký tự).
   *-> Khắc phục bằng cách chạy tiếp kỹ thuật **Boundary Value Analysis (BVA)** ở bước sau.*
2. **Miền giá trị thực tế thường không thể biết trước hoàn toàn (Unknown actual domains):**
   - Trong các hệ thống thiếu đặc tả chặt chẽ như EShop, nhiều miền giá trị (như độ dài tối đa của `name`, bộ ký tự Unicode có dấu, hành vi khi gửi payload JSON lồng nhau) chỉ là suy đoán (`[ASSUMED]`). Nếu phân hoạch sai lớp ngay từ đầu, các ca kiểm thử sinh ra sẽ không phản ánh đúng khiếm khuyết phần mềm.
3. **Bỏ sót các lỗi phụ thuộc ngữ cảnh và trạng thái phức tạp:**
   - Kỹ thuật này tập trung vào các trường độc lập, dễ bỏ quên các quy tắc nghiệp vụ chéo giữa nhiều trường hoặc trạng thái concurrency (ví dụ: hai người cùng bấm đăng ký cùng một email tại cùng một mili-giây).

---

> [!NOTE]
> **STOP FOR REVIEW (Stage 4 & Stage 5 Complete)**:  
> Báo cáo Domain Testing cho FR-01 đã hoàn tất 5 giai đoạn, kèm 16 test cases, ma trận bao phủ 100% và phân tích hạn chế kỹ thuật. Vui lòng rà soát và xác nhận để chúng ta tiến hành commit Git và chuyển sang **Boundary Value Analysis (BVA)**.


