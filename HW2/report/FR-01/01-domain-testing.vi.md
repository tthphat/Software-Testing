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

> [!NOTE]
> **STOP FOR REVIEW**: Vui lòng rà soát bảng lớp tương đương EC01 - EC23 ở trên. Nếu bạn đồng ý, chúng ta sẽ chuyển sang **Stage 3 (Chọn giá trị đại diện)** và **Stage 4 (Thiết kế bộ Test Case tối thiểu)**.
