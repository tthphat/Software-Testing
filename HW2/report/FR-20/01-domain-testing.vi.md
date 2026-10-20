# Domain Testing — FR-20: Tính năng Mobile (Đăng nhập & Đăng xuất)

> **Tính năng:** FR-20 — Mobile App (React Native): Đăng nhập & Đăng xuất (Login & Logout)  
> **Phân nhóm (Pool):** Pool D — Mobile App  
> **Kỹ thuật:** Phân hoạch tương đương (Domain Testing / Equivalence Partitioning) theo phương pháp 4 bước CSC13003/S04  
> **Phiên bản:** Hoàn chỉnh Stage 0 đến Stage 5 (Báo cáo phân tích, Bộ 20 Test Cases tối thiểu & Ma trận bao phủ 100%)

---

## Stage 0 — Thu thập dữ kiện & Khảo sát thực tế (Collect Facts)

### 0.1 Phạm vi đặc tả (Specification Scope)

Theo tài liệu đặc tả hệ thống `eshop-sut/README.md` ([README.md:L233-L237](file:///d:/HCMUS/semester7/software-testing/Software-Testing/eshop-sut/README.md#L233-L237)):

> **7. Phân hệ Mobile (React Native)**
> **### FR-20: Tính năng Mobile**
> - Đầy đủ các chức năng: Xem sản phẩm, **Đăng nhập, Đăng xuất**, Đăng ký, Giỏ hàng, Thanh toán, Hồ sơ, Lịch sử đơn hàng.
> - Yêu cầu bảo mật và giao diện: Tuân thủ các nguyên tắc giao diện tiếng Việt nhất quán (FR-21), quy chuẩn Form và thông báo lỗi (FR-22).

Theo tài liệu đặc tả API `docs/api_specification.md` (mục 1.2 Đăng nhập):
- Endpoint: `POST /api/login`
- Request Body: `{ "email": string, "password": string }`
- Thành công: HTTP 200 OK, trả về JWT Token và thông tin người dùng (`user`).
- Thất bại: HTTP 401 Unauthorized nếu sai thông tin; HTTP 403 Forbidden nếu tài khoản bị khóa.

---

### 0.2 Khảo sát mã nguồn thực tế SUT (Code Investigation)

Khảo sát đối chiếu trên cả 2 tầng: **Backend SUT** và **Frontend Mobile (React Native)**:

#### 1. Tại Backend API — [server.js:L32-L66](file:///d:/HCMUS/semester7/software-testing/Software-Testing/eshop-sut/backend/server.js#L32-L66)
```javascript
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    if (user.locked_until && new Date() < new Date(user.locked_until)) {
      return res
        .status(403)
        .json({ error: "Tài khoản đã bị khóa. Vui lòng thử lại sau." });
    }

    if (user.password === password) {
      db.run(
        "UPDATE users SET login_attempts = 0, locked_until = NULL WHERE id = ?",
        [user.id],
      );
      const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY);
      res.json({ message: "Login successful", token, user });
    } else {
      const newAttempts = user.login_attempts + 2; // BUG: Cộng 2 thay vì cộng 1 mỗi lần sai!
      let lockedUntil = null;
      if (newAttempts >= 3) {
        lockedUntil = new Date(Date.now() + 180000).toISOString(); // Khóa 3 phút
      }
      db.run(
        "UPDATE users SET login_attempts = ?, locked_until = ? WHERE id = ?",
        [newAttempts, lockedUntil, user.id],
      );
      res.status(401).json({ error: "Invalid email or password" });
    }
  });
});
```

**Phát hiện từ mã nguồn Backend:**
1. **Hoàn toàn không có validation đầu vào:** Không kiểm tra `email` và `password` bị bỏ trống (`""`), chuỗi khoảng trắng, hay sai kiểu dữ liệu (`number`, `boolean`, `null`).
2. **Cơ chế khóa tài khoản bất thường (`server.js:54`):** Mỗi lần nhập sai mật khẩu, biến `login_attempts` bị cộng dồn **+2** thay vì +1. Do ngưỡng khóa là `>= 3`, chỉ sau **2 lần nhập sai** (0 + 2 + 2 = 4 >= 3), tài khoản đã bị khóa ngay lập tức trong 180 giây (3 phút).
3. **Lộ mật khẩu trong phản hồi đăng nhập (`server.js:52`):** Trả về nguyên vẹn object `user` từ cơ sở dữ liệu (`SELECT *`), chứa trường `password` dạng plain-text truyền qua mạng về client.

---

#### 2. Tại Frontend Mobile — [App.js](file:///d:/HCMUS/semester7/software-testing/Software-Testing/eshop-sut/frontend-mobile/App.js)

**Xử lý Đăng nhập (`handleLogin`) — [App.js:L186-L207](file:///d:/HCMUS/semester7/software-testing/Software-Testing/eshop-sut/frontend-mobile/App.js#L186-L207):**
```javascript
const handleLogin = async () => {
  setLoginError("");
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Đăng nhập thất bại.");

    setToken(data.token);
    setUser(data.user);
    setName(data.user?.name || "");
    setPhone(data.user?.phone || "");
    setShippingAddress(data.user?.shipping_address || "");
    fetchOrders(data.token);
    goHome();
  } catch (error) {
    setLoginError("Đăng nhập thất bại. Vui lòng kiểm tra lại.");
  }
};
```

**Xử lý Đăng xuất (`logout`) — [App.js:L161-L169](file:///d:/HCMUS/semester7/software-testing/Software-Testing/eshop-sut/frontend-mobile/App.js#L161-L169):**
```javascript
const logout = () => {
  setToken("");
  setUser(null);
  setName("");
  setPhone("");
  setShippingAddress("");
  setOrders([]);
  goHome();
  // KHÔNG CÓ setCart([]) -> LỖ HỔNG LƯU TRỮ GIỎ HÀNG SAU ĐĂNG XUẤT!
};
```

**Bảng đối chiếu mâu thuẫn đa nền tảng (Cross-platform Skew Checklist v2.0):**

| Vấn đề / Tiêu chí | Đặc tả (`[SPEC]`) | Backend (`[CODE]`) | Frontend Mobile (`[CODE]`) | Tác động kiểm thử |
| :--- | :--- | :--- | :--- | :--- |
| **Kiểm tra rỗng `email` / `password`** | Bắt buộc nhập | Không kiểm tra (`server.js:33`) | Không kiểm tra trước khi gửi request (`App.js:189`) | Cho phép gửi request rỗng lên server |
| **Nhãn trường Email** | Email | `email` | Label hiển thị là `"Username"` ([App.js:L763](file:///d:/HCMUS/semester7/software-testing/Software-Testing/eshop-sut/frontend-mobile/App.js#L763)) | Mâu thuẫn thuật ngữ nhãn UI |
| **Ngôn ngữ nút Submit** | Tiếng Việt (`FR-21`) | N/A | Nút ghi tiếng Anh `"Sign In"` ([App.js:L783](file:///d:/HCMUS/semester7/software-testing/Software-Testing/eshop-sut/frontend-mobile/App.js#L783)) | Vi phạm tiêu chuẩn giao diện FR-21 |
| **Vị trí thông báo lỗi** | Nằm TRÊN nút Submit (`FR-22`) | N/A | Nằm DƯỚI nút Submit ([App.js:L790](file:///d:/HCMUS/semester7/software-testing/Software-Testing/eshop-sut/frontend-mobile/App.js#L790)) | Vi phạm tiêu chuẩn Form FR-22 |
| **Xử lý lỗi cụ thể** | Phân biệt rõ lỗi sai mật khẩu vs khóa tài khoản | Trả về 401 hoặc 403 có thông điệp riêng | `catch` nuốt hết lỗi, luôn hiện chuỗi chung `"Đăng nhập thất bại..."` | Người dùng không biết tài khoản bị khóa hay gõ sai |
| **Dọn giỏ hàng khi Logout** | Đăng xuất phải xóa session và dữ liệu nhạy cảm | N/A (Stateless JWT) | **Bỏ quên `setCart([])`** ([App.js:L161](file:///d:/HCMUS/semester7/software-testing/Software-Testing/eshop-sut/frontend-mobile/App.js#L161)) | Giỏ hàng của user cũ bị rò rỉ cho user/guest tiếp theo |

---

## Stage 1 — Xác định biến và miền giá trị (Variables & Domains)

| Tên biến | Loại biến | Kiểu dữ liệu | Miền giá trị và Ràng buộc (Domain Constraints) | Nguồn dữ kiện (Source Tag) |
| :--- | :---: | :---: | :--- | :---: |
| `input_email` | Input | String | Chuỗi định dạng email RFC 5322 hợp lệ; có thể là email đã đăng ký hoặc chưa đăng ký; chuỗi rỗng `""`; khoảng trắng; sai định dạng; `null`; sai kiểu (number, boolean). | `[SPEC]` §1.2, `[CODE]` `server.js:33` |
| `input_password` | Input | String | Chuỗi mật khẩu người dùng; khớp với mật khẩu tài khoản trong CSDL; sai mật khẩu; chuỗi rỗng `""`; khoảng trắng; `null`; sai kiểu dữ liệu. | `[SPEC]` §1.2, `[CODE]` `server.js:33` |
| `state_account` | State | Enum | Trạng thái của tài khoản trong CSDL: <br>• `NORMAL`: Tồn tại, không bị khóa (`login_attempts = 0`, `locked_until` is NULL). <br>• `FAILED_ONCE`: Đã gõ sai 1 lần (`login_attempts = 2`). <br>• `LOCKED`: Đang bị khóa (`locked_until > now`). <br>• `NON_EXISTENT`: Không tồn tại trong CSDL. | `[CODE]` `server.js:37-63`, `database.js:48-61` |
| `state_session` | State | Enum | Trạng thái phiên làm việc trên Mobile: <br>• `GUEST`: Chưa đăng nhập (`token = ""`, `user = null`). <br>• `AUTHENTICATED`: Đã đăng nhập (`token != ""`, `user != null`). | `[CODE]` `App.js:33-36` |
| `state_cart` | State | Array | Trạng thái giỏ hàng trước khi Đăng xuất: <br>• `EMPTY`: Giỏ hàng rỗng (`cart = []`). <br>• `HAS_ITEMS`: Giỏ hàng chứa từ 1 sản phẩm trở lên. | `[CODE]` `App.js:34, 161` |
| `output_status` | Output | Integer | Mã trạng thái HTTP trả về: `200` (OK), `401` (Unauthorized), `403` (Forbidden), `500` (Internal Error). | `[SPEC]` §1.2, `[CODE]` `server.js:36-63` |
| `output_token` | Output | String/Null | Chuỗi JWT Token hợp lệ khi đăng nhập thành công; hoặc `null` khi đăng nhập thất bại. | `[SPEC]` §1.2, `[CODE]` `server.js:51` |
| `output_user_payload`| Output | Object/Null| Đối tượng user trả về; ghi nhận lỗ hổng lộ trường `password`. | `[CODE]` `server.js:52` |
| `output_mobile_view` | Output | String | Màn hình điều hướng trên Mobile: `"home"` (khi login/logout thành công), `"login"` (khi đăng nhập thất bại), `"profile"` (nơi thực hiện logout). | `[CODE]` `App.js:203, 168` |
| `output_mobile_msg`  | Output | String | Thông báo lỗi trên Mobile UI: Rỗng `""` (thành công), hoặc chuỗi cố định `"Đăng nhập thất bại. Vui lòng kiểm tra lại."`. | `[CODE]` `App.js:205` |
| `output_cart_state`  | Output | Array | Giỏ hàng sau khi Đăng xuất: Kỳ vọng sạch `[]`; thực tế bị giữ nguyên các món cũ. | `[CODE]` `App.js:161-169` |

---

## Stage 2 — Phân hoạch các lớp tương đương (Equivalence Classes)

### Bảng phân hoạch tương đương hoàn chỉnh (Complete Set of Partitions)

| Mã lớp (EC ID) | Biến liên quan | Mô tả lớp tương đương | Phân loại | Quy tắc áp dụng | Nguồn dữ kiện (Source Tag) |
| :---: | :--- | :--- | :---: | :--- | :---: |
| **EC01** | `input_email` | Email hợp lệ đã tồn tại trong CSDL (VD: `test@eshop.com`) | **Valid** | Giá trị đại diện hợp lệ | `[SPEC]`, `[CODE]` `server.js:35` |
| **EC02** | `input_email` | Email hợp lệ nhưng chưa từng đăng ký trong CSDL (VD: `notfound@eshop.com`) | **Invalid** | Dữ liệu không tồn tại (State conflict) | `[CODE]` `server.js:37` |
| **EC03** | `input_email` | Email là chuỗi rỗng `""` | **Invalid** | Rỗng / Empty string | `[SPEC]`, `[CODE]` |
| **EC04** | `input_email` | Email chỉ chứa khoảng trắng `"   "` | **Invalid** | Whitespace-only string | `[SPEC]`, `[CODE]` |
| **EC05** | `input_email` | Email sai quy cách định dạng (thiếu `@`, thiếu tên miền) | **Invalid** | Format violation | `[SPEC]` |
| **EC06** | `input_email` | Trường `email` bị thiếu (undefined / không truyền) | **Invalid** | Missing field | `[CODE]` |
| **EC07** | `input_email` | Trường `email` sai kiểu dữ liệu (Number `12345`, Boolean `true`) | **Invalid** | Wrong data type | `[CODE]` |
| **EC08** | `input_password` | Mật khẩu chính xác khớp với mật khẩu tài khoản trong CSDL (VD: `Test1234!`) | **Valid** | Mật khẩu đúng | `[SPEC]`, `[CODE]` `server.js:46` |
| **EC09** | `input_password` | Mật khẩu không chính xác / sai mật khẩu (VD: `WrongPassword123!`) | **Invalid** | Mật khẩu sai | `[CODE]` `server.js:53` |
| **EC10** | `input_password` | Mật khẩu là chuỗi rỗng `""` | **Invalid** | Rỗng / Empty string | `[SPEC]`, `[CODE]` |
| **EC11** | `input_password` | Mật khẩu chỉ chứa khoảng trắng `"   "` | **Invalid** | Whitespace-only string | `[SPEC]`, `[CODE]` |
| **EC12** | `input_password` | Trường `password` bị thiếu (undefined / không truyền) | **Invalid** | Missing field | `[CODE]` |
| **EC13** | `input_password` | Trường `password` sai kiểu dữ liệu (Number `123456`, Boolean `false`) | **Invalid** | Wrong data type | `[CODE]` |
| **EC14** | `state_account` | Tài khoản ở trạng thái bình thường (`login_attempts = 0`, không bị khóa) | **Valid** | Trạng thái tài khoản chuẩn | `[CODE]` `server.js:40` |
| **EC15** | `state_account` | Tài khoản đang bị khóa tạm thời (`locked_until > now`) | **Invalid** | Trạng thái tài khoản bị khóa | `[CODE]` `server.js:40-44` |
| **EC16** | `state_account` | Tài khoản cận điểm khóa: Đã sai 1 lần (`login_attempts = 2`), sai thêm lần này sẽ kích hoạt khóa | **Invalid** | Trạng thái ngưỡng chuyển đổi | `[CODE]` `server.js:54-58` |
| **EC17** | `state_session` | Đăng xuất khi đang có phiên đăng nhập hợp lệ (`token != ""`) | **Valid** | Đăng xuất người dùng bình thường | `[CODE]` `App.js:161` |
| **EC18** | `state_session` | Thao tác Đăng xuất khi đang là khách vãng lai (Guest - chưa đăng nhập) | **Invalid** | Xung đột ngữ cảnh trạng thái | `[CODE]` `App.js:161` |
| **EC19** | `state_cart` | Đăng xuất khi giỏ hàng rỗng (`cart = []`) | **Valid** | Trạng thái giỏ hàng rỗng | `[CODE]` `App.js:161` |
| **EC20** | `state_cart` | Đăng xuất khi giỏ hàng đang có sản phẩm (`cart.length > 0`) | **Invalid** | Lỗ hổng rò rỉ dữ liệu phiên giỏ hàng | `[CODE]` `App.js:161-169` |
| **EC21** | Output | Đăng nhập thành công: HTTP 200, cấp Token JWT, chuyển về `home` | **Valid** | Kết quả mong đợi thành công | `[SPEC]`, `[CODE]` `server.js:52` |
| **EC22** | Output | Đăng nhập thất bại do sai thông tin: HTTP 401, không cấp token | **Invalid** | Kết quả mong đợi thất bại 401 | `[SPEC]`, `[CODE]` `server.js:63` |
| **EC23** | Output | Đăng nhập bị chặn do tài khoản bị khóa: HTTP 403, báo lỗi tài khoản bị khóa | **Invalid** | Kết quả mong đợi từ chối 403 | `[CODE]` `server.js:42` |
| **EC24** | Output | Đăng xuất thành công: Xóa sạch `token`, `user`, dọn dẹp giỏ hàng, chuyển về `home` | **Valid** | Kết quả mong đợi đăng xuất | `[SPEC]`, `[CODE]` `App.js:168` |

---

## Stage 3 — Chọn giá trị đại diện cho từng lớp tương đương (Best Representatives)

Áp dụng Bước 3 của phương pháp CSC13003 / S04, mỗi lớp tương đương được chỉ định một giá trị đại diện tiêu biểu nhất:

| Mã lớp | Biến | Giá trị đại diện tiêu biểu | Lý do lựa chọn |
| :---: | :--- | :--- | :--- |
| **EC01** | `input_email` | `"test@eshop.com"` | Email đã được seed sẵn trong CSDL SUT với vai trò Customer |
| **EC02** | `input_email` | `"unregistered_user_99@domain.com"` | Email đúng cú pháp nhưng chưa từng được đăng ký trong hệ thống |
| **EC03** | `input_email` | `""` | Chuỗi rỗng độ dài 0 ký tự |
| **EC04** | `input_email` | `"   "` | Chuỗi gồm 3 ký tự khoảng trắng |
| **EC05** | `input_email` | `"invalid-email-format"` | Chuỗi thiếu ký tự `@` và thiếu domain |
| **EC06** | `input_email` | `undefined` (omitted in payload) | Trường bị thiếu hoàn toàn trong request JSON |
| **EC07** | `input_email` | `123456` | Số nguyên thay vì chuỗi văn bản |
| **EC08** | `input_password` | `"Test1234!"` | Mật khẩu chính xác tương ứng với tài khoản `test@eshop.com` |
| **EC09** | `input_password` | `"WrongPass123!"` | Mật khẩu sai có độ dài chuẩn |
| **EC10** | `input_password` | `""` | Chuỗi rỗng |
| **EC11** | `input_password` | `"   "` | Chuỗi khoảng trắng |
| **EC12** | `input_password` | `undefined` (omitted in payload) | Trường bị thiếu trong request |
| **EC13** | `input_password` | `false` | Kiểu dữ liệu Boolean thay vì String |
| **EC14** | `state_account` | `login_attempts = 0, locked_until = null` | Trạng thái hoạt động bình thường |
| **EC15** | `state_account` | `locked_until = now + 180000ms` | Tài khoản đang trong thời hạn bị khóa |
| **EC16** | `state_account` | `login_attempts = 2` | Trạng thái cận điểm khóa (đã sai 1 lần) |
| **EC17** | `state_session` | `token = "Bearer <valid_jwt>"` | Đang có phiên đăng nhập hợp lệ |
| **EC18** | `state_session` | `token = ""` | Phiên khách vãng lai (Guest) |
| **EC19** | `state_cart` | `cart = []` | Giỏ hàng rỗng |
| **EC20** | `state_cart` | `[{"id": 1, "name": "iPhone 15", "quantity": 1}]` | Giỏ hàng có chứa sản phẩm |
| **EC21** | Output | HTTP 200 OK + JWT Token | Đăng nhập thành công |
| **EC22** | Output | HTTP 401 Unauthorized | Thông tin sai |
| **EC23** | Output | HTTP 403 Forbidden | Tài khoản bị khóa |
| **EC24** | Output | `token = "", user = null, view = "home"` | Đăng xuất hoàn tất |

---

## Stage 4 — Thiết kế bộ Test Cases tối thiểu (Select Test Cases)

Áp dụng nghiêm ngặt các nguyên tắc từ slide S04:
1. **Bao phủ toàn diện:** Mỗi lớp tương đương phải xuất hiện trong ít nhất 1 ca kiểm thử.
2. **Tối ưu hóa lớp hợp lệ (Valid Classes):** Kết hợp tối đa các lớp hợp lệ vào các ca kiểm thử tích cực (`FR20-DT-01`, `FR20-DT-02`, `FR20-DT-17`).
3. **Cô lập lỗi đơn (Single-fault Assumption):** Mỗi ca kiểm thử tiêu cực chỉ chứa duy nhất một lớp không hợp lệ để đảm bảo nguyên nhân thất bại được xác định rõ ràng.

### Danh mục 20 Test Cases tối thiểu

| Mã TC (Test ID) | Tiêu đề ca kiểm thử | Loại kiểm thử | Dữ liệu đầu vào (Payload / Input) | Trạng thái tiền điều kiện | Kết quả mong đợi | Lớp tương đương bao phủ |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| **FR20-DT-01** | Đăng nhập thành công với tài khoản User hợp lệ | API / UI | `email: "test@eshop.com"`, `password: "Test1234!"` | User tồn tại, chưa bị khóa | HTTP 200 OK, trả về Token JWT, điều hướng về Home | `EC01`, `EC08`, `EC14`, `EC21` |
| **FR20-DT-02** | Đăng nhập thành công với tài khoản Admin hợp lệ | API / UI | `email: "admin@eshop.com"`, `password: "Admin123!"` | Admin tồn tại, chưa bị khóa | HTTP 200 OK, trả về Token JWT với role='admin' | `EC01`, `EC08`, `EC14`, `EC21` |
| **FR20-DT-03** | Đăng nhập thất bại với email chưa từng đăng ký | API / UI | `email: "unregistered_user_99@domain.com"`, `password: "Test1234!"` | Email không có trong CSDL | HTTP 401 Unauthorized, thông báo lỗi xác thực | `EC02`, `EC08`, `EC22` |
| **FR20-DT-04** | Đăng nhập với email là chuỗi rỗng `""` | API / UI | `email: ""`, `password: "Test1234!"` | CSDL có sẵn | HTTP 400 Bad Request (hoặc 401 từ chối) | `EC03`, `EC08`, `EC22` |
| **FR20-DT-05** | Đăng nhập với email chỉ chứa khoảng trắng `"   "` | API / UI | `email: "   "`, `password: "Test1234!"` | CSDL có sẵn | HTTP 400 Bad Request (hoặc 401 từ chối) | `EC04`, `EC08`, `EC22` |
| **FR20-DT-06** | Đăng nhập với email sai quy cách định dạng | API / UI | `email: "invalid-email-format"`, `password: "Test1234!"` | CSDL có sẵn | HTTP 400 Bad Request (hoặc 401 từ chối) | `EC05`, `EC08`, `EC22` |
| **FR20-DT-07** | Đăng nhập khi thiếu trường `email` trong payload | API | `{ "password": "Test1234!" }` | CSDL có sẵn | HTTP 400 Bad Request | `EC06`, `EC08`, `EC22` |
| **FR20-DT-08** | Đăng nhập khi trường `email` sai kiểu dữ liệu số | API | `{ "email": 123456, "password": "Test1234!" }` | CSDL có sẵn | HTTP 400 Bad Request | `EC07`, `EC08`, `EC22` |
| **FR20-DT-09** | Đăng nhập thất bại do mật khẩu không chính xác | API / UI | `email: "test@eshop.com"`, `password: "WrongPass123!"` | User tồn tại (`login_attempts=0`) | HTTP 401 Unauthorized, tăng attempts lên 2 | `EC01`, `EC09`, `EC14`, `EC22` |
| **FR20-DT-10** | Đăng nhập với mật khẩu là chuỗi rỗng `""` | API / UI | `email: "test@eshop.com"`, `password: ""` | User tồn tại | HTTP 400 Bad Request | `EC01`, `EC10`, `EC22` |
| **FR20-DT-11** | Đăng nhập với mật khẩu chỉ chứa khoảng trắng `"   "` | API / UI | `email: "test@eshop.com"`, `password: "   "` | User tồn tại | HTTP 400 Bad Request | `EC01`, `EC11`, `EC22` |
| **FR20-DT-12** | Đăng nhập khi thiếu trường `password` trong payload | API | `{ "email": "test@eshop.com" }` | User tồn tại | HTTP 400 Bad Request | `EC01`, `EC12`, `EC22` |
| **FR20-DT-13** | Đăng nhập khi trường `password` sai kiểu Boolean | API | `{ "email": "test@eshop.com", "password": false }` | User tồn tại | HTTP 400 Bad Request | `EC01`, `EC13`, `EC22` |
| **FR20-DT-14** | Kiểm tra cơ chế khóa tài khoản khi gõ sai lần 2 liên tiếp | API / Logic | `email: "test@eshop.com"`, `password: "WrongSecondTime!"` | Tài khoản đã sai 1 lần (`attempts=2`) | HTTP 401, CSDL cập nhật `locked_until != null` | `EC01`, `EC09`, `EC16`, `EC22` |
| **FR20-DT-15** | Đăng nhập bị từ chối khi tài khoản đang bị khóa | API / UI | `email: "test@eshop.com"`, `password: "Test1234!"` | Tài khoản có `locked_until > now` | HTTP 403 Forbidden ("Tài khoản đã bị khóa") | `EC01`, `EC08`, `EC15`, `EC23` |
| **FR20-DT-16** | Kiểm tra an toàn dữ liệu: Không rò rỉ mật khẩu trong response đăng nhập | API / Sec | `email: "test@eshop.com"`, `password: "Test1234!"` | Đăng nhập thành công | Response body KHÔNG được chứa trường `password` | `EC01`, `EC08`, `EC21` |
| **FR20-DT-17** | Mobile Logout: Đăng xuất người dùng bình thường khi giỏ hàng rỗng | Mobile UI | Bấm nút Thoát (`logout()`) | User đã đăng nhập, `cart = []` | Xóa Token, User = null, chuyển về màn hình Home | `EC17`, `EC19`, `EC24` |
| **FR20-DT-18** | Mobile Logout: Kiểm tra dọn dẹp giỏ hàng khi người dùng có sản phẩm | Mobile UI | Bấm nút Thoát (`logout()`) | User đã đăng nhập, `cart.length = 2` | Giỏ hàng phải được làm sạch (`cart = []`) | `EC17`, `EC20`, `EC24` |
| **FR20-DT-19** | Mobile UI: Kiểm tra nhãn trường Email và ngôn ngữ nút bấm | Mobile UI | Xem màn hình Login | Giao diện hiển thị | Nhãn là "Email", nút bấm là "Đăng nhập" (tiếng Việt) | `EC01`, `EC08` |
| **FR20-DT-20** | Mobile Logout: Thao tác đăng xuất khi chưa có phiên đăng nhập | Mobile UI | Gọi `logout()` ở trạng thái khách | `token = "", user = null` | Không gây crash ứng dụng, duy trì trạng thái an toàn | `EC18`, `EC24` |

---

## Stage 5 — Ma trận bao phủ 100% (Coverage Matrix) & Đánh giá điểm mù (Blind Spots)

### 5.1 Ma trận bao phủ lớp tương đương (Traceability Matrix)

| Test Case ID | EC01 | EC02 | EC03 | EC04 | EC05 | EC06 | EC07 | EC08 | EC09 | EC10 | EC11 | EC12 | EC13 | EC14 | EC15 | EC16 | EC17 | EC18 | EC19 | EC20 | EC21 | EC22 | EC23 | EC24 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **FR20-DT-01** | X | | | | | | | X | | | | | | X | | | | | | | X | | | |
| **FR20-DT-02** | X | | | | | | | X | | | | | | X | | | | | | | X | | | |
| **FR20-DT-03** | | X | | | | | | X | | | | | | | | | | | | | | X | | |
| **FR20-DT-04** | | | X | | | | | X | | | | | | | | | | | | | | X | | |
| **FR20-DT-05** | | | | X | | | | X | | | | | | | | | | | | | | X | | |
| **FR20-DT-06** | | | | | X | | | X | | | | | | | | | | | | | | X | | |
| **FR20-DT-07** | | | | | | X | | X | | | | | | | | | | | | | | X | | |
| **FR20-DT-08** | | | | | | | X | X | | | | | | | | | | | | | | X | | |
| **FR20-DT-09** | X | | | | | | | | X | | | | | X | | | | | | | | X | | |
| **FR20-DT-10** | X | | | | | | | | | X | | | | | | | | | | | | X | | |
| **FR20-DT-11** | X | | | | | | | | | | X | | | | | | | | | | | X | | |
| **FR20-DT-12** | X | | | | | | | | | | | X | | | | | | | | | | X | | |
| **FR20-DT-13** | X | | | | | | | | | | | | X | | | | | | | | | X | | |
| **FR20-DT-14** | X | | | | | | | | X | | | | | | | X | | | | | | X | | |
| **FR20-DT-15** | X | | | | | | | X | | | | | | | X | | | | | | | | X | |
| **FR20-DT-16** | X | | | | | | | X | | | | | | | | | | | | | X | | | |
| **FR20-DT-17** | | | | | | | | | | | | | | | | | X | | X | | | | | X |
| **FR20-DT-18** | | | | | | | | | | | | | | | | | X | | | X | | | | X |
| **FR20-DT-19** | X | | | | | | | X | | | | | | | | | | | | | | | | |
| **FR20-DT-20** | | | | | | | | | | | | | | | | | | X | | | | | | X |

**Tỷ lệ bao phủ (Coverage Rate):** **24 / 24 Lớp tương đương = 100%**.

---

### 5.2 Đánh giá điểm mù kỹ thuật (Blind Spots Evaluation)

1. **Điểm mù về giá trị biên độ dài chuỗi:**
   - Kiểm thử miền (Domain Testing) chỉ xác định lớp hợp lệ/không hợp lệ về sự tồn tại và định dạng của `email` và `password`, chưa kiểm tra độ dài cực hạn (như email 255 ký tự, password 10,000 ký tự gây tràn bộ nhớ, hoặc biên thời gian khóa `locked_until` tính bằng giây).
   - *Biện pháp khắc phục:* Chuyển tiếp sang kỹ thuật **Boundary Value Analysis (BVA)** để kiểm thử chuyên sâu các miền có thứ tự này.
2. **Điểm mù về tấn công Brute-Force & Race Condition:**
   - Nếu kẻ tấn công gửi hàng chục request đồng thời (concurrent requests) với mật khẩu sai, cơ chế khóa tài khoản trong SQLite có thể bị xung đột ghi (database locked) hoặc không kịp khóa trước khi dò trúng mật khẩu.
3. **Điểm mù về lưu trữ phiên lâu dài (Persistent Session Leak):**
   - Ứng dụng Mobile hiện chỉ lưu token và user trong RAM (`useState`), không sử dụng SecureStore/AsyncStorage. Khi app bị crash hoặc reload, người dùng bị văng phiên đăng nhập ngoài ý muốn.
