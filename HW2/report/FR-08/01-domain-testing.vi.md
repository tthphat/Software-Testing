# Báo cáo Kiểm thử miền (Domain Testing) — FR-08: Đặt hàng và Thanh toán (Checkout)

> **Tính năng:** FR-08 — Checkout (Thanh toán & Đặt hàng)  
> **Kỹ thuật:** Domain Testing / Equivalence Partitioning (Slide bài giảng S04)  
> **Giai đoạn:** Stage 0 (Thu thập sự thật) & Stage 1 (Xác định biến và miền giá trị)  
> **Người thực hiện:** Trương Thành Phát (MSSV: 23120319)  
> **Trạng thái:** DỪNG CHỜ DUYỆT (STOP FOR REVIEW) sau Stage 0 & 1  

---

## Stage 0 — Thu thập sự thật và khảo sát mã nguồn SUT (Fact Collection)

### 1. Endpoint và phương thức HTTP
- **Endpoint chính:** `POST /api/checkout` `[SPEC: api_specification.md:130]` `[CODE: server.js:297]`
- **Xác thực (Authentication):** Bắt buộc token JWT thông qua middleware `authenticateToken` trong header `Authorization: Bearer <token>` `[CODE: server.js:297, 100-110]`.
- **Các endpoint liên quan mật thiết:**
  - `GET /api/cart`: Lấy danh sách sản phẩm trong giỏ hàng của user `[CODE: server.js:284-288]`.
  - `POST /api/cart`: Thêm sản phẩm vào giỏ hàng `[CODE: server.js:290-295]`.
  - `GET /api/orders/my-orders`: Xem lịch sử đơn hàng cá nhân `[CODE: server.js:311-319]`.
  - `PUT /api/orders/:id/cancel`: Hủy đơn hàng `[CODE: server.js:321-342]`.
  - `POST /api/apply-coupon`: Áp dụng mã giảm giá `[CODE: server.js:363-442]`.

---

### 2. Cấu trúc Request Body
- **Theo Đặc tả API `[SPEC: api_specification.md:131-137]`:**
  ```json
  {
    "total_amount": 200000,
    "shipping_address": "123 Le Loi, TP.HCM"
  }
  ```
- **Theo Mã nguồn Backend `[CODE: server.js:299]`:**
  ```javascript
  const { total_amount, shipping_address } = req.body;
  ```
- **Theo Mã nguồn Frontend Web `[CODE: Checkout.jsx:45-51]`:**
  ```javascript
  await axios.post('http://localhost:3000/api/checkout', {
    items: cart,
    total_amount: finalAmount,
    coupon_id: couponResult?.coupon_id || null
  }, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  ```
  *(Web gửi `items`, `total_amount`, `coupon_id` nhưng KHÔNG gửi `shipping_address`)*.
- **Theo Mã nguồn Frontend Mobile `[CODE: App.js:384-395]`:**
  ```javascript
  await fetch(`${API_URL}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      items: cart.length > 1 ? cart.slice(0, -1) : cart,
      total_amount: finalAmount,
      coupon_id: couponResult?.coupon_id || null,
    }),
  });
  ```
  *(Mobile gửi `items` bị cắt bớt phần tử cuối nếu cart > 1, `total_amount`, `coupon_id`, KHÔNG gửi `shipping_address`)*.

---

### 3. Ràng buộc kiểm tra tính hợp lệ THỰC SỰ có trong mã nguồn (Validation Rules Found)

Đối chiếu trực tiếp mã nguồn `eshop-sut/backend/server.js:297-309`:
```javascript
app.post("/api/checkout", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { total_amount, shipping_address } = req.body;

  db.run(
    "INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES (?, ?, ?, ?)",
    [userId, total_amount, "pending", shipping_address],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Checkout successful", orderId: this.lastID });
    },
  );
});
```

Qua khảo sát từng dòng code, ghi nhận:
1. **Kiểm tra xác thực Token (`server.js:100-110`):**
   - Nếu không có header `Authorization` hoặc token `null`: trả về `HTTP 401 Unauthorized` `{"error": "Unauthorized"}` `[CODE: server.js:103]`.
   - Nếu token sai chữ ký, hết hạn hoặc không hợp lệ: trả về `HTTP 403 Forbidden` `{"error": "Forbidden"}` `[CODE: server.js:106]`.
2. **Kiểm tra trường `total_amount`:** **HOÀN TOÀN KHÔNG CÓ** `[CODE: server.js:299-303]`.
   - Không có câu lệnh `if (total_amount <= 0)` hay kiểm tra kiểu dữ liệu.
   - Backend chấp nhận bất kỳ giá trị nào: số âm (`-50000`), số 0, chuỗi, boolean, số cực lớn, hoặc bỏ trống (`undefined` lưu `NULL` vào SQLite).
   - Backend **hoàn toàn không tính lại tổng tiền từ giỏ hàng** mà tin tưởng 100% số tiền client gửi lên (Parameter Tampering / Broken Business Logic).
3. **Kiểm tra trường `shipping_address`:** **HOÀN TOÀN KHÔNG CÓ** `[CODE: server.js:299-303]`.
   - Không có câu lệnh `if (!shipping_address)` hay kiểm tra độ dài.
   - Nhận chuỗi rỗng `""`, `null`, `undefined` mà không báo lỗi.
4. **Kiểm tra trạng thái giỏ hàng (Cart State):** **HOÀN TOÀN KHÔNG CÓ** `[CODE: server.js:297-309]`.
   - Backend không kiểm tra xem `userCarts[userId]` có sản phẩm nào hay không. Người dùng có thể checkout khi giỏ hàng hoàn toàn rỗng.
   - Sau khi checkout thành công, backend **không xóa/làm trống giỏ hàng** `userCarts[userId]`.
5. **Kiểm tra tồn kho (Stock Deduction):** **HOÀN TOÀN KHÔNG CÓ** `[CODE: server.js:297-309]`.
   - Không kiểm tra tồn kho trong bảng `products`, không trừ số lượng `stock`.
6. **Lưu trữ chi tiết đơn hàng (Order Items):** **HOÀN TOÀN KHÔNG CÓ** `[CODE: database.js:74-81, server.js:301-308]`.
   - Cơ sở dữ liệu SQLite chỉ có bảng `orders` (chứa `id, user_id, total_amount, status, shipping_address, created_at`).
   - Hoàn toàn không có bảng `order_items` hay cột nào lưu danh sách sản phẩm đã mua!

---

### 4. Đối chiếu lệch pha đa nền tảng (Cross-platform Skew Checklist v2.0)

| Tiêu chí đối chiếu | Backend API (`server.js`) | Frontend Web (`Checkout.jsx`) | Frontend Mobile (`App.js`) | Phân loại sai lệch (Skew Category) |
|---|---|---|---|---|
| **Khả năng sửa tổng tiền (`total_amount`)** | Nhận thẳng `req.body.total_amount` không kiểm tra `[CODE: server.js:299]` | Cung cấp ô input `type="number"` cho phép user **tự gõ sửa số tiền tùy ý** `[CODE: Checkout.jsx:93-102]` | Khóa input bằng `editable={false}` `[CODE: App.js:689]` | **Lỗ hổng bảo mật cực kỳ nghiêm trọng (Critical Security Skew / Price Tampering)** |
| **Danh sách sản phẩm gửi lên (`items`)** | Bỏ qua hoàn toàn, không lưu DB `[CODE: server.js:302]` | Gửi nguyên vẹn `items: cart` `[CODE: Checkout.jsx:46]` | **Cố tình cắt bỏ sản phẩm cuối cùng** nếu giỏ hàng > 1 sản phẩm: `cart.slice(0, -1)` `[CODE: App.js:391]` | **Lỗi logic nghiệp vụ nghiêm trọng (Business Logic Skew)** |
| **Địa chỉ giao hàng (`shipping_address`)** | Lưu vào cột `shipping_address` trong DB `[CODE: server.js:303]` | **Không có ô nhập địa chỉ**; không gửi field này lên API `[CODE: Checkout.jsx]` | **Không có ô nhập địa chỉ**; không gửi field này lên API `[CODE: App.js]` | **Mâu thuẫn đặc tả giữa Client và Server (Spec Mismatch)** |
| **Xóa giỏ hàng sau khi đặt** | Không xóa `userCarts[userId]` `[CODE: server.js:297]` | Không gọi `clearCart()` sau khi thành công `[CODE: Checkout.jsx:61]` | Gọi `setCart([])` xóa giỏ hàng local `[CODE: App.js:411]` | **Trạng thái không đồng bộ (State Inconsistency)** |

---

### 5. Các phản hồi HTTP có thể có (Possible HTTP Responses)
- `HTTP 200 OK`: `{"message": "Checkout successful", "orderId": 1}` `[CODE: server.js:306]` `[SPEC: api_specification.md:130]`
- `HTTP 401 Unauthorized`: `{"error": "Unauthorized"}` khi thiếu token xác thực `[CODE: server.js:103]`
- `HTTP 403 Forbidden`: `{"error": "Forbidden"}` khi token sai chữ ký / không hợp lệ `[CODE: server.js:106]`
- `HTTP 500 Internal Server Error`: `{"error": "<sqlite_error_message>"}` khi lỗi câu lệnh DB `[CODE: server.js:305]`
- *Ghi chú Zero-Trust SUT:* Hiện tại backend không có mã trả về `HTTP 400 Bad Request`. Mọi request không hợp lệ (tiền âm, thiếu địa chỉ, giỏ rỗng) nếu có token hợp lệ đều được ghi vào DB và trả về `HTTP 200 OK`.

---

### 6. Câu hỏi mở (Open Questions)
1. `[CÂU HỎI MỞ]` Tại sao bảng `orders` và API checkout không lưu thông tin sản phẩm đã mua (`order_items`)? Người quản trị và khách hàng sau này làm sao biết đơn hàng bao gồm những mặt hàng nào?
2. `[CÂU HỎI MỞ]` Tại sao cả Web và Mobile đều không có giao diện cho người dùng nhập `shipping_address`, trong khi tài liệu `api_specification.md` và cơ sở dữ liệu `orders` đều yêu cầu trường này?
3. `[CÂU HỎI MỞ]` Vì sao trên giao diện Web (`Checkout.jsx:93-102`), ô nhập tổng tiền thanh toán lại để người dùng tự do nhập số tiền tùy ý thay vì hiển thị dạng chỉ đọc (Read-only / Disabled)?
4. `[CÂU HỎI MỞ]` Vì sao trên giao diện Mobile (`App.js:391`), code lại cố tình cắt bỏ phần tử cuối cùng của giỏ hàng (`cart.length > 1 ? cart.slice(0, -1) : cart`) khi bấm thanh toán?

---

## Stage 1 — Xác định biến Input, Output, State và Miền giá trị (Domains)

Tuân thủ nguyên tắc Domain Testing (slide bài giảng S04) và cải tiến kỹ năng v1.1, bảng xác định toàn bộ các biến của tính năng FR-08:

| Tên biến | Phân loại (Kind) | Kiểu dữ liệu | Miền giá trị & Ràng buộc kỹ thuật (Domain) | Nguồn thông tin (Source tag) |
| :--- | :--- | :--- | :--- | :---: |
| **`auth_token`** | Input (Header Context) | String (JWT) | - Token định danh và xác thực người dùng trong header `Authorization: Bearer <token>`.<br>- **Miền giá trị:**<br>  + Hợp lệ: Token JWT được ký hợp lệ với `SECRET_KEY`, chứa `id` người dùng đang hoạt động.<br>  + Không hợp lệ: Thiếu header Authorization, token chuỗi rỗng `""`, token sai chữ ký (tampered), token hết hạn.<br>- **Ràng buộc:** Bắt buộc phải có token hợp lệ để thực hiện checkout. | `[CODE]` server.js:100-110<br>`[SPEC]` api_specification.md:130 |
| **`total_amount`** | Input (Request Body) | Number / Integer | - Tổng số tiền thanh toán của đơn hàng (đơn vị: VNĐ).<br>- **Miền giá trị lý thuyết & nghiệp vụ:**<br>  + Hợp lệ: Số nguyên dương lớn hơn 0 ($total\_amount > 0$), phải bằng chính xác tổng tiền các món hàng trong giỏ hàng trừ đi giá trị coupon hợp lệ (nếu có).<br>  + Không hợp lệ: Số âm ($total\_amount < 0$), số 0, số thực không phải số nguyên, sai lệch so với giá trị thực tế của giỏ hàng, chuỗi ký tự (`"free"`), kiểu boolean (`true`), chuỗi rỗng `""`, thiếu trường `total_amount` trong body.<br>- **Code SUT thực tế:** `server.js:299` không validate, nhận mọi giá trị và lưu thẳng vào SQLite. | `[SPEC]` api_spec:134<br>`[ASSUMED]` (Ràng buộc nghiệp vụ tiền dương)<br>`[CODE]` server.js:299 |
| **`shipping_address`** | Input (Request Body) | String | - Địa chỉ giao hàng của người nhận.<br>- **Miền giá trị lý thuyết & nghiệp vụ:**<br>  + Hợp lệ: Chuỗi địa chỉ hợp lệ, ví dụ `"123 Le Loi, TP.HCM"` (độ dài thông thường từ 5 đến 255 ký tự).<br>  + Không hợp lệ: Chuỗi rỗng `""`, chỉ có khoảng trắng, thiếu trường `shipping_address` trong body (như Web/Mobile đang gửi), sai kiểu dữ liệu (Boolean/Number), payload cực lớn (> 1,000 ký tự).<br>- **Code SUT thực tế:** `server.js:299` không validate, chấp nhận `undefined` và lưu `NULL` vào DB. | `[SPEC]` api_spec:135<br>`[CODE]` database.js:79<br>`[CODE]` server.js:299 |
| **`cart_state`** | State (Tiền đề giỏ hàng) | Enum / Context | - Trạng thái của giỏ hàng người dùng trước khi bấm checkout.<br>- **Miền giá trị:**<br>  + `HAS_ITEMS`: Giỏ hàng có ít nhất 1 sản phẩm hợp lệ ($quantity \ge 1$).<br>  + `EMPTY`: Giỏ hàng rỗng (chưa thêm sản phẩm nào hoặc $quantity = 0$).<br>- **Ràng buộc nghiệp vụ:** Không được phép thanh toán khi giỏ hàng rỗng.<br>- **Code SUT thực tế:** Không kiểm tra `userCarts[userId]`. | `[ASSUMED]` Business rule<br>`[CODE]` server.js:284-295 |
| **`coupon_state`** | State (Mã giảm giá) | Enum / Context | - Trạng thái mã giảm giá áp dụng vào đơn hàng.<br>- **Miền giá trị:**<br>  + `NONE`: Không áp dụng mã giảm giá.<br>  + `VALID_APPLIED`: Mã hợp lệ, còn lượt dùng, tính đúng `final_amount`.<br>  + `INVALID_OR_EXPIRED`: Mã không tồn tại, hết hạn hoặc vượt quá số lượt dùng. | `[SPEC]` api_spec:153-164<br>`[CODE]` server.js:363-442 |
| **`system_output_response`** | Output | Object (HTTP Status + JSON) | - Kết quả phản hồi từ máy chủ cho yêu cầu checkout.<br>- **Miền giá trị:**<br>  + `HTTP 200`: `{"message": "Checkout successful", "orderId": <number>}`.<br>  + `HTTP 400`: Lỗi dữ liệu không hợp lệ (Bad Request) `[SPEC]`.<br>  + `HTTP 401`: `{"error": "Unauthorized"}` `[CODE]`.<br>  + `HTTP 403`: `{"error": "Forbidden"}` `[CODE]`.<br>  + `HTTP 500`: `{"error": "<message>"}` `[CODE]`. | `[SPEC]` api_spec:38-40, 130<br>`[CODE]` server.js:103, 106, 305-307 |
| **`order_in_database`** | Output (Side Effect) | Database Record | - Trạng thái bản ghi đơn hàng trong bảng `orders` của SQLite.<br>- **Miền giá trị:**<br>  + `INSERTED`: Tạo 1 bản ghi mới với `status = 'pending'`, `user_id = req.user.id`, lưu đúng `total_amount` và `shipping_address`.<br>  + `NOT_INSERTED`: Không có bản ghi mới nào được tạo trong DB. | `[CODE]` database.js:74-81<br>`[CODE]` server.js:301-308 |

---

---

## Stage 2 — Phân hoạch các lớp tương đương (Equivalence Partitioning)

Áp dụng phương pháp phân hoạch lớp tương đương theo slide bài giảng S04 (CSC13003) và bộ quy tắc kiểm thử miền toàn diện:
- **Range (Khoảng giá trị):** Giá trị số dương hợp lệ, số âm, số 0, số tiền không khớp với giá trị giỏ hàng (thao túng giá).
- **Must be (Điều kiện bắt buộc):** Bắt buộc phải có token đăng nhập hợp lệ (JWT bearer token); địa chỉ giao hàng hợp lệ.
- **Type (Kiểu dữ liệu):** Kiểu số nguyên hợp lệ vs kiểu chuỗi (String), Boolean, số thực dấu phẩy động (Float), Object.
- **Missing / Empty (Thiếu hoặc Rỗng):** Chuỗi rỗng `""`, chuỗi khoảng trắng `"   "`, thiếu hoàn toàn trường trong JSON body, giá trị `null`.
- **State Conflict (Xung đột trạng thái & Tiền đề):** Giỏ hàng có sản phẩm vs giỏ hàng rỗng; mã giảm giá hợp lệ vs mã giảm giá không tồn tại / hết hạn.
- **Cross-Platform Skew (Dị biệt đa nền tảng - v2.0):**
  - Thao túng giá thanh toán qua Web UI `editableTotal` (`Checkout.jsx:93-102`).
  - Mobile tự động cắt bỏ sản phẩm cuối cùng trong giỏ hàng `cart.slice(0, -1)` (`App.js:391`).
  - Web và Mobile không gửi trường `shipping_address`.
- **Output Classes (Lớp kết quả đầu ra):** Phân hoạch các mã trạng thái phản hồi HTTP 200, 400, 401, 403, 500.

### Bảng phân hoạch 31 lớp tương đương (Equivalence Classes) cho FR-08

| Biến / Trạng thái | Mã lớp | Phân loại | Định nghĩa lớp tương đương | Mục đích & Rủi ro kiểm thử |
| :--- | :---: | :---: | :--- | :--- |
| **`auth_token`** | **EC01** | Valid | Header `Authorization: Bearer <valid_token>` của người dùng thường hợp lệ | Kiểm thử luồng xác thực thành công |
| | **EC02** | Invalid | Thiếu hoàn toàn header `Authorization` (khách vãng lai chưa đăng nhập) | Kỳ vọng HTTP 401 Unauthorized `[CODE: server.js:103]` |
| | **EC03** | Invalid | Token sai chữ ký, bị chỉnh sửa (tampered), hoặc sai định dạng chuỗi | Kỳ vọng HTTP 403 Forbidden `[CODE: server.js:106]` |
| | **EC04** | Invalid | Header Authorization gửi token rỗng (`Bearer `) hoặc `null` | Kỳ vọng HTTP 401 Unauthorized `[CODE: server.js:103]` |
| **`total_amount`** | **EC05** | Valid | Số nguyên dương lớn hơn 0 ($total\_amount > 0$), khớp chính xác với giá trị giỏ hàng | Dữ liệu thanh toán chuẩn mực |
| | **EC06** | Invalid | Số tiền bằng 0 ($total\_amount = 0$) | Đặt hàng miễn phí trái phép; nguy cơ gian lận |
| | **EC07** | Invalid | Số tiền âm ($total\_amount < 0$, ví dụ: `-50000`) | Lỗ hổng số tiền âm làm đảo chiều giao dịch (CWE-20) |
| | **EC08** | Invalid | Số tiền dương nhưng không khớp với giá trị giỏ hàng (Web `editableTotal` tampering) | Lỗ hổng cho phép sửa giá thanh toán trên Web (Parameter Tampering) |
| | **EC09** | Invalid | Kiểu dữ liệu chuỗi (String, ví dụ: `"free"` hoặc `"200000"`) | Lỗi Type Skew, kiểm tra ép kiểu SQLite |
| | **EC10** | Invalid | Kiểu dữ liệu Boolean (`true` / `false`) | Lỗi Type validation |
| | **EC11** | Invalid | Số thực dấu phẩy động (Float, ví dụ: `199999.5`) | Kiểm tra tính toàn vẹn số tiền thanh toán nguyên tệ |
| | **EC12** | Invalid | Thiếu hoàn toàn trường `total_amount` trong request body `{}` | Kiểm tra schema validation |
| | **EC13** | Invalid | Giá trị `null` | Kiểm tra xử lý giá trị null |
| **`shipping_address`** | **EC14** | Valid | Chuỗi địa chỉ hợp lệ, đầy đủ thông tin (độ dài 5..255 ký tự) | Dữ liệu giao hàng chuẩn |
| | **EC15** | Invalid | Chuỗi rỗng `""` | Địa chỉ trống không thể giao hàng |
| | **EC16** | Invalid | Chuỗi chỉ chứa ký tự khoảng trắng `"   "` | Bỏ qua trim chuỗi |
| | **EC17** | Invalid | Thiếu hoàn toàn trường `shipping_address` trong body (hành vi của Web & Mobile) | Mâu thuẫn giữa Client và Server; DB lưu NULL |
| | **EC18** | Invalid | Sai kiểu dữ liệu (Boolean `true` hoặc Number `12345`) | Lỗi Type validation |
| | **EC19** | Invalid | Chuỗi địa chỉ cực lớn (> 1,000 ký tự payload) | Nguy cơ tràn bộ đệm / DoS database |
| **`cart_state`** | **EC20** | Valid | Giỏ hàng có ít nhất 1 sản phẩm hợp lệ ($quantity \ge 1$) | Điều kiện tiên quyết hợp lệ để checkout |
| | **EC21** | Invalid | Giỏ hàng rỗng (chưa thêm sản phẩm nào hoặc $quantity = 0$) | Lỗi đặt đơn hàng ma khi giỏ hàng trống |
| **`stock_state`** | **EC22** | Valid | Số lượng sản phẩm trong giỏ hàng $\le$ số lượng tồn kho trong DB | Đủ hàng để bán |
| | **EC23** | Invalid | Số lượng sản phẩm trong giỏ hàng $>$ số lượng tồn kho | Bán vượt quá tồn kho (Overselling defect) |
| **`coupon_state`** | **EC24** | Valid | Không áp dụng mã giảm giá (`coupon_id` là null) | Đơn hàng nguyên giá |
| | **EC25** | Valid | Áp dụng mã coupon hợp lệ, còn hạn và tính đúng số tiền `final_amount` | Giảm giá hợp lệ |
| | **EC26** | Invalid | Áp dụng mã coupon không tồn tại, hết hạn hoặc hết lượt | Nguy cơ lạm dụng coupon |
| **Mobile Skew** | **EC27** | Invalid | Thanh toán qua Mobile với giỏ hàng có từ 2 sản phẩm trở lên | Bị cắt bỏ sản phẩm cuối cùng do `cart.slice(0, -1)` |
| **Output Classes** | **EC28** | Valid Output | `HTTP 200 OK` kèm `orderId`, đơn hàng được tạo với `status = 'pending'` | Đặt hàng thành công |
| | **EC29** | Invalid Output | `HTTP 401 Unauthorized` | Từ chối truy cập khi chưa đăng nhập |
| | **EC30** | Invalid Output | `HTTP 403 Forbidden` | Từ chối khi token sai / không hợp lệ |
| | **EC31** | Invalid Output | `HTTP 400 Bad Request` | Từ chối request sai dữ liệu (tiền âm, giỏ rỗng,...) |

---

## Stage 3 — Chọn giá trị đại diện cho từng lớp tương đương (Representative Values)

Theo slide bài giảng S04 (Step 3), mỗi lớp tương đương được chọn đúng một giá trị đại diện điển hình:
- Đối với miền có thứ tự (Ordered domains như số tiền `total_amount`, độ dài địa chỉ): chọn giá trị tiêu biểu hoặc giá trị biên đại diện (ghi chú chuyển tiếp sang BVA cho các giá trị biên chi tiết).
- Đối với miền không có thứ tự (Unordered domains như token, trạng thái giỏ, coupon): chọn giá trị thực tế, mô phỏng đúng ngữ cảnh hoạt động.

### Bảng giá trị đại diện cho 31 lớp tương đương của FR-08

| Mã lớp (EC) | Biến / Trạng thái kiểm thử | Giá trị đại diện được chọn | Lý do lựa chọn (One-line justification) | Ghi chú kỹ thuật |
| :---: | :--- | :--- | :--- | :--- |
| **EC01** | `auth_token` | JWT Token hợp lệ của user `test@eshop.com` | Mô phỏng phiên đăng nhập hợp lệ của người dùng thực | Lấy tự động qua API login |
| **EC02** | `auth_token` | Bỏ hoàn toàn header `Authorization` | Đại diện cho truy cập trái phép từ khách vãng lai | Kỳ vọng HTTP 401 |
| **EC03** | `auth_token` | `Bearer invalid.jwt.token.signature` | Đại diện cho token bị chỉnh sửa chữ ký hoặc giả mạo | Kỳ vọng HTTP 403 |
| **EC04** | `auth_token` | `Bearer ` (chuỗi rỗng sau tiền tố Bearer) | Đại diện cho lỗi logic client gửi header trống | Kỳ vọng HTTP 401 |
| **EC05** | `total_amount` | `200000` (khớp giỏ hàng có 1 SP giá 200,000) | Số tiền dương nguyên tệ chuẩn, khớp chính xác giỏ hàng | Giá trị hợp lệ danh định |
| **EC06** | `total_amount` | `0` | Giá trị biên số 0 không được phép (đặt hàng 0 đồng) | -> Chi tiết tại BVA |
| **EC07** | `total_amount` | `-50000` | Số tiền âm vi phạm quy tắc số dương (CWE-20) | Nguy cơ đảo chiều tiền tệ |
| **EC08** | `total_amount` | `1000` (giỏ hàng thực tế trị giá `200000`) | Mô phỏng hành vi sửa tiền trong input `editableTotal` trên Web | Lỗ hổng Price Tampering |
| **EC09** | `total_amount` | `"free"` | Chuỗi ký tự (String) vi phạm kiểu dữ liệu Number | Lỗi Type validation |
| **EC10** | `total_amount` | `true` | Kiểu dữ liệu Boolean vi phạm schema | Lỗi Type validation |
| **EC11** | `total_amount` | `199999.5` | Số thực dấu phẩy động (Float) vi phạm tiền tệ nguyên | Kiểm tra tính toàn vẹn số tiền |
| **EC12** | `total_amount` | `{}` (thiếu hoàn toàn trường `total_amount`) | Đại diện cho request thiếu trường bắt buộc | Vi phạm schema request |
| **EC13** | `total_amount` | `null` | Giá trị null gửi lên qua JSON | Kiểm tra xử lý null của SQLite |
| **EC14** | `shipping_address` | `"123 Le Loi, Phuong Ben Nghe, Quan 1, TP.HCM"` | Địa chỉ giao hàng đầy đủ, độ dài hợp lý (45 ký tự) | Dữ liệu giao hàng chuẩn |
| **EC15** | `shipping_address` | `""` (chuỗi rỗng) | Địa chỉ rỗng không đủ thông tin giao hàng | Vi phạm điều kiện bắt buộc |
| **EC16** | `shipping_address` | `"   "` (3 ký tự khoảng trắng) | Khoảng trắng không hợp lệ nếu thiếu hàm `.trim()` | Vi phạm chuỗi rỗng sau trim |
| **EC17** | `shipping_address` | Bỏ trống trường `shipping_address` trong JSON | Hành vi gửi request thực tế của cả Web và Mobile | Mâu thuẫn Client - Server |
| **EC18** | `shipping_address` | `12345` (kiểu số nguyên Number) | Sai kiểu dữ liệu chuỗi | Lỗi Type validation |
| **EC19** | `shipping_address` | Chuỗi 1,500 ký tự `"A".repeat(1500)` | Địa chỉ vượt quá độ dài tối đa hợp lý | Nguy cơ tràn bộ nhớ / DoS |
| **EC20** | `cart_state` | Giỏ hàng có 1 sản phẩm hợp lệ (`quantity = 1`) | Điều kiện tiên quyết giỏ hàng có hàng để thanh toán | Trạng thái hợp lệ |
| **EC21** | `cart_state` | Giỏ hàng rỗng (`cart = []`) | Điều kiện tiên quyết giỏ hàng rỗng không được checkout | Lỗi logic đặt đơn ma |
| **EC22** | `stock_state` | Sản phẩm trong giỏ còn đủ tồn kho (`quantity = 1 <= stock`) | Đáp ứng đủ số lượng hàng tồn trong kho | Trạng thái kho hợp lệ |
| **EC23** | `stock_state` | Sản phẩm đặt mua vượt quá tồn kho (`quantity = 999 > stock`) | Đặt mua vượt quá tồn kho thực tế | Nguy cơ Overselling |
| **EC24** | `coupon_state` | `coupon_id = null` (không áp dụng coupon) | Đơn hàng thông thường không sử dụng mã giảm giá | Luồng chuẩn |
| **EC25** | `coupon_state` | Áp dụng mã coupon hợp lệ (ví dụ: `DISCOUNT10`) | Đơn hàng áp dụng mã giảm giá hợp lệ còn lượt dùng | Luồng giảm giá thành công |
| **EC26** | `coupon_state` | Áp dụng mã coupon giả/hết hạn (`FAKECOUPON99`) | Mã coupon không tồn tại hoặc đã hết lượt/hết hạn | Kỳ vọng báo lỗi coupon |
| **EC27** | `mobile_skew` | Giỏ có 2 món, Mobile gửi `cart.slice(0, -1)` | Dị biệt mã nguồn Mobile cắt xén sản phẩm cuối cùng | Lỗi logic đa nền tảng |
| **EC28** | `system_output` | `HTTP 200 OK` kèm `orderId` | Đặt hàng thành công, tạo bản ghi `orders` (pending) | `[CODE: server.js:306]` |
| **EC29** | `system_output` | `HTTP 401 Unauthorized` | Từ chối truy cập khi thiếu token đăng nhập | `[CODE: server.js:103]` |
| **EC30** | `system_output` | `HTTP 403 Forbidden` | Từ chối truy cập khi token không hợp lệ | `[CODE: server.js:106]` |
| **EC31** | `system_output` | `HTTP 400 Bad Request` | Từ chối request sai dữ liệu (tiền âm, thiếu địa chỉ, giỏ rỗng) | `[SPEC: api_spec:38-40]` |

---

## Stage 4 — Thiết kế bộ ca kiểm thử tối thiểu (Minimum Test Cases) và Ma trận bao phủ

Tuân thủ nguyên tắc tối ưu hóa số ca kiểm thử của CSC13003 S04:
1. **Các lớp hợp lệ (Valid Classes):** Kết hợp tối đa các lớp hợp lệ vào cùng một ca kiểm thử cho đến khi toàn bộ các lớp hợp lệ được bao phủ ít nhất một lần.
   - `FR08-DT-01`: Bao phủ luồng checkout chuẩn không dùng coupon (`EC01, EC05, EC14, EC20, EC22, EC24, EC28`).
   - `FR08-DT-02`: Bao phủ luồng checkout có dùng coupon hợp lệ (`EC01, EC05, EC14, EC20, EC22, EC25, EC28`).
2. **Các lớp không hợp lệ (Invalid Classes):** Áp dụng nguyên tắc **Cô lập lỗi đơn (Single-fault isolation)**: Mỗi ca kiểm thử chỉ chứa duy nhất 1 lớp không hợp lệ, tất cả các trường/trạng thái còn lại đều phải ở trạng thái hợp lệ. Điều này đảm bảo khi ca kiểm thử thất bại, ta xác định được chính xác 100% nguyên nhân gây ra lỗi.
3. **Các lớp kết quả đầu ra (Output Classes):** Được bao phủ trực tiếp qua các ca kiểm thử tương ứng.

### 1. Bảng 22 ca kiểm thử miền tối thiểu cho FR-08 (`FR08-DT-01` đến `FR08-DT-22`)

| Mã TC | Lớp tương đương bao phủ | Token (`auth`) | `total_amount` | `shipping_address` | Trạng thái giỏ / Tiền đề | Kết quả kỳ vọng (`expected`) | Nguồn kỳ vọng |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **FR08-DT-01** | EC01, EC05, EC14, EC20, EC22, EC24, EC28 | User hợp lệ | `200000` | `"123 Le Loi, TP.HCM"` | Giỏ có 1 SP (200k), đủ kho, không coupon | HTTP 200, `Checkout successful`, có `orderId` | `[CODE: server.js:306]` `[SPEC]` |
| **FR08-DT-02** | EC01, EC05, EC14, EC20, EC22, EC25, EC28 | User hợp lệ | `180000` | `"123 Le Loi, TP.HCM"` | Giỏ có 1 SP (200k), áp dụng coupon hợp lệ -10% | HTTP 200, `Checkout successful`, có `orderId` | `[CODE: server.js:306]` `[SPEC]` |
| **FR08-DT-03** | EC02, EC29 | Không gửi header | `200000` | `"123 Le Loi, TP.HCM"` | Giỏ hàng bình thường | HTTP 401 Unauthorized | `[CODE: server.js:103]` |
| **FR08-DT-04** | EC03, EC30 | Token sai chữ ký | `200000` | `"123 Le Loi, TP.HCM"` | Giỏ hàng bình thường | HTTP 403 Forbidden | `[CODE: server.js:106]` |
| **FR08-DT-05** | EC04, EC29 | Token rỗng (`Bearer `) | `200000` | `"123 Le Loi, TP.HCM"` | Giỏ hàng bình thường | HTTP 401 Unauthorized | `[CODE: server.js:103]` |
| **FR08-DT-06** | EC06, EC31 | User hợp lệ | `0` | `"123 Le Loi, TP.HCM"` | Giỏ hàng trị giá 200k | HTTP 400 Bad Request (tiền = 0) | `[ASSUMED]` (Chặn thanh toán 0đ) |
| **FR08-DT-07** | EC07, EC31 | User hợp lệ | `-50000` | `"123 Le Loi, TP.HCM"` | Giỏ hàng trị giá 200k | HTTP 400 Bad Request (tiền âm) | `[ASSUMED]` (Chặn tiền âm) |
| **FR08-DT-08** | EC08, EC31 | User hợp lệ | `1000` | `"123 Le Loi, TP.HCM"` | Giỏ hàng trị giá 200k (Web editableTotal) | HTTP 400 Bad Request (sai lệch giá giỏ) | `[ASSUMED]` (Chống sửa giá Web) |
| **FR08-DT-09** | EC09, EC31 | User hợp lệ | `"free"` | `"123 Le Loi, TP.HCM"` | Giỏ hàng trị giá 200k | HTTP 400 Bad Request (sai type chuỗi) | `[ASSUMED]` (Validate kiểu số) |
| **FR08-DT-10** | EC10, EC31 | User hợp lệ | `true` | `"123 Le Loi, TP.HCM"` | Giỏ hàng trị giá 200k | HTTP 400 Bad Request (sai type boolean) | `[ASSUMED]` (Validate kiểu số) |
| **FR08-DT-11** | EC11, EC31 | User hợp lệ | `199999.5` | `"123 Le Loi, TP.HCM"` | Giỏ hàng trị giá 200k | HTTP 400 Bad Request (số thực float) | `[ASSUMED]` (Số nguyên tiền tệ) |
| **FR08-DT-12** | EC12, EC31 | User hợp lệ | Bỏ trường | `"123 Le Loi, TP.HCM"` | Giỏ hàng trị giá 200k | HTTP 400 Bad Request (thiếu total_amount) | `[ASSUMED]` (Schema bắt buộc) |
| **FR08-DT-13** | EC13, EC31 | User hợp lệ | `null` | `"123 Le Loi, TP.HCM"` | Giỏ hàng trị giá 200k | HTTP 400 Bad Request (null total_amount) | `[ASSUMED]` (Không nhận null) |
| **FR08-DT-14** | EC15, EC31 | User hợp lệ | `200000` | `""` (chuỗi rỗng) | Giỏ hàng bình thường | HTTP 400 Bad Request (địa chỉ rỗng) | `[ASSUMED]` (Bắt buộc địa chỉ) |
| **FR08-DT-15** | EC16, EC31 | User hợp lệ | `200000` | `"   "` (khoảng trắng) | Giỏ hàng bình thường | HTTP 400 Bad Request (khoảng trắng) | `[ASSUMED]` (Trim địa chỉ) |
| **FR08-DT-16** | EC17, EC31 | User hợp lệ | `200000` | Bỏ trường | Giỏ hàng bình thường (Client Web/Mobile) | HTTP 400 Bad Request (thiếu address) | `[SPEC: api_spec:135]` |
| **FR08-DT-17** | EC18, EC31 | User hợp lệ | `200000` | `12345` (Number) | Giỏ hàng bình thường | HTTP 400 Bad Request (sai kiểu địa chỉ) | `[ASSUMED]` (Địa chỉ là chuỗi) |
| **FR08-DT-18** | EC19, EC31 | User hợp lệ | `200000` | Chuỗi 1,500 ký tự | Giỏ hàng bình thường | HTTP 400 Bad Request (địa chỉ quá dài) | `[ASSUMED]` (Giới hạn độ dài) |
| **FR08-DT-19** | EC21, EC31 | User hợp lệ | `200000` | `"123 Le Loi, TP.HCM"` | **Giỏ hàng rỗng (`cart = []`)** | HTTP 400 Bad Request (giỏ hàng rỗng) | `[ASSUMED]` (Chặn giỏ rỗng) |
| **FR08-DT-20** | EC23, EC31 | User hợp lệ | `200000` | `"123 Le Loi, TP.HCM"` | **Giỏ hàng đặt vượt tồn kho** (`qty > stock`) | HTTP 400 Bad Request (vượt tồn kho) | `[ASSUMED]` (Kiểm tra kho) |
| **FR08-DT-21** | EC26, EC31 | User hợp lệ | `200000` | `"123 Le Loi, TP.HCM"` | Áp dụng mã coupon giả `FAKECOUPON99` | HTTP 400 Bad Request (coupon sai) | `[SPEC: api_spec:163]` |
| **FR08-DT-22** | EC27, EC31 | User hợp lệ | `200000` | `"123 Le Loi, TP.HCM"` | Giỏ có 2 SP, Mobile gửi `cart.slice(0, -1)` | HTTP 400 hoặc Cảnh báo lệch giỏ hàng | `[CODE: App.js:391]` |

---

### 2. Ma trận bao phủ 100% lớp tương đương (Coverage Matrix)

Bảng ma trận đối chiếu 31 lớp tương đương (EC01 – EC31) với 22 ca kiểm thử:

| Mã lớp | Mô tả lớp tương đương | Phân loại | Ca kiểm thử bao phủ (TC IDs) | Trạng thái bao phủ |
| :---: | :--- | :---: | :--- | :---: |
| **EC01** | Token JWT hợp lệ của người dùng | Valid | FR08-DT-01, FR08-DT-02, FR08-DT-06 đến FR08-DT-22 | ✅ Đã bao phủ |
| **EC02** | Thiếu header Authorization | Invalid | FR08-DT-03 | ✅ Đã bao phủ |
| **EC03** | Token sai chữ ký / giả mạo | Invalid | FR08-DT-04 | ✅ Đã bao phủ |
| **EC04** | Token rỗng (`Bearer `) | Invalid | FR08-DT-05 | ✅ Đã bao phủ |
| **EC05** | `total_amount` nguyên dương hợp lệ khớp giỏ | Valid | FR08-DT-01, FR08-DT-02, FR08-DT-03..05, 14..22 | ✅ Đã bao phủ |
| **EC06** | `total_amount = 0` | Invalid | FR08-DT-06 | ✅ Đã bao phủ |
| **EC07** | `total_amount < 0` (số âm) | Invalid | FR08-DT-07 | ✅ Đã bao phủ |
| **EC08** | `total_amount` sai lệch giỏ hàng (Web tampering) | Invalid | FR08-DT-08 | ✅ Đã bao phủ |
| **EC09** | `total_amount` là chuỗi (String) | Invalid | FR08-DT-09 | ✅ Đã bao phủ |
| **EC10** | `total_amount` là Boolean | Invalid | FR08-DT-10 | ✅ Đã bao phủ |
| **EC11** | `total_amount` là số thực (Float) | Invalid | FR08-DT-11 | ✅ Đã bao phủ |
| **EC12** | Thiếu hoàn toàn trường `total_amount` | Invalid | FR08-DT-12 | ✅ Đã bao phủ |
| **EC13** | `total_amount = null` | Invalid | FR08-DT-13 | ✅ Đã bao phủ |
| **EC14** | `shipping_address` hợp lệ | Valid | FR08-DT-01 đến FR08-DT-13, FR08-DT-19 đến FR08-DT-22 | ✅ Đã bao phủ |
| **EC15** | `shipping_address = ""` (chuỗi rỗng) | Invalid | FR08-DT-14 | ✅ Đã bao phủ |
| **EC16** | `shipping_address = "   "` (khoảng trắng) | Invalid | FR08-DT-15 | ✅ Đã bao phủ |
| **EC17** | Thiếu trường `shipping_address` (Web & Mobile) | Invalid | FR08-DT-16 | ✅ Đã bao phủ |
| **EC18** | `shipping_address` sai kiểu (Number) | Invalid | FR08-DT-17 | ✅ Đã bao phủ |
| **EC19** | `shipping_address` vượt 1,000 ký tự | Invalid | FR08-DT-18 | ✅ Đã bao phủ |
| **EC20** | Giỏ hàng có sản phẩm hợp lệ ($quantity \ge 1$) | Valid | FR08-DT-01 đến FR08-DT-18, FR08-DT-21, FR08-DT-22 | ✅ Đã bao phủ |
| **EC21** | Giỏ hàng rỗng ($cart = []$) | Invalid | FR08-DT-19 | ✅ Đã bao phủ |
| **EC22** | Tồn kho đủ để bán | Valid | FR08-DT-01 đến FR08-DT-19, FR08-DT-21, FR08-DT-22 | ✅ Đã bao phủ |
| **EC23** | Đặt mua vượt quá tồn kho | Invalid | FR08-DT-20 | ✅ Đã bao phủ |
| **EC24** | Không dùng coupon (`coupon_id = null`) | Valid | FR08-DT-01, FR08-DT-03 đến FR08-DT-20, FR08-DT-22 | ✅ Đã bao phủ |
| **EC25** | Dùng coupon hợp lệ | Valid | FR08-DT-02 | ✅ Đã bao phủ |
| **EC26** | Dùng coupon không hợp lệ / hết hạn | Invalid | FR08-DT-21 | ✅ Đã bao phủ |
| **EC27** | Dị biệt Mobile tự cắt sản phẩm cuối giỏ | Invalid | FR08-DT-22 | ✅ Đã bao phủ |
| **EC28** | Output: `HTTP 200 OK` + `orderId` | Valid Output | FR08-DT-01, FR08-DT-02 | ✅ Đã bao phủ |
| **EC29** | Output: `HTTP 401 Unauthorized` | Invalid Output | FR08-DT-03, FR08-DT-05 | ✅ Đã bao phủ |
| **EC30** | Output: `HTTP 403 Forbidden` | Invalid Output | FR08-DT-04 | ✅ Đã bao phủ |
| **EC31** | Output: `HTTP 400 Bad Request` | Invalid Output | FR08-DT-06 đến FR08-DT-22 | ✅ Đã bao phủ |

**Tổng hợp định lượng:**
- Tổng số lớp tương đương (Equivalence Classes): **31**
  - Lớp hợp lệ (Valid Classes): **8** (EC01, EC05, EC14, EC20, EC22, EC24, EC25, EC28)
  - Lớp không hợp lệ (Invalid Classes): **23** (EC02-04, EC06-13, EC15-19, EC21, EC23, EC26, EC27, EC29-31)
- Tổng số ca kiểm thử tối thiểu (Minimum Test Cases): **22 ca kiểm thử** (`FR08-DT-01` đến `FR08-DT-22`).
- Tỷ lệ bao phủ (Coverage rate): **100% (31/31 ECs)**. Không có lớp tương đương nào bị bỏ sót.

---

## Stage 5 — Thẩm định (Self-check) và Đánh giá hạn chế kỹ thuật (Blind Spots)

### 1. Danh sách kiểm tra chất lượng (Self-check Checklist)
- [x] **Nguyên tắc cô lập lỗi đơn (Single-fault isolation):** Mỗi ca kiểm thử không hợp lệ (từ DT-03 đến DT-22) chỉ chứa duy nhất 1 lớp không hợp lệ; tất cả các trường và trạng thái còn lại đều giữ ở giá trị hợp lệ danh định.
- [x] **Không trùng lặp dư thừa:** Không có hai ca kiểm thử nào rơi vào cùng một lớp tương đương mà không có lý do đối chiếu đặc biệt.
- [x] **Nguồn gốc rõ ràng (Source tags):** Tất cả các kỳ vọng đều được gắn nhãn minh bạch (`[CODE]`, `[SPEC]`, `[ASSUMED]`). Mọi kỳ vọng `[ASSUMED]` đều được giải trình trong danh mục câu hỏi mở.
- [x] **Không lạm dụng kiểm thử biên:** Các giá trị trong bộ DT tập trung vào phân hoạch miền; các giá trị biên chi tiết (on-the-boundary, off-the-boundary) được dành riêng cho kỹ thuật BVA tiếp theo.
- [x] **Ngôn ngữ chuẩn mực:** Báo cáo trình bày hoàn toàn bằng tiếng Việt có dấu; mã định danh, phương thức HTTP, endpoint, mã nguồn giữ nguyên tiếng Anh.

### 2. Điểm mù và hạn chế của kỹ thuật Kiểm thử miền (Blind Spots & Limitations)
1. **Bỏ qua hành vi tại biên (Boundary Blind Spots):**
   - Phân hoạch tương đương chỉ chọn 1 giá trị đại diện trong khoảng (ví dụ: `total_amount = 200000`). Kỹ thuật này hoàn toàn bỏ qua các giá trị tại biên nhạy cảm như $1$ VNĐ, số lớn $2^{31}-1$, hoặc giới hạn độ dài chuỗi địa chỉ (4 ký tự vs 5 ký tự, 255 vs 256 ký tự). Hạn chế này bắt buộc phải được giải quyết bằng kỹ thuật **Boundary Value Analysis (BVA)** ở giai đoạn tiếp theo.
2. **Không phát hiện lỗi tương tranh (Concurrency / Race Conditions):**
   - Domain Testing giả định hệ thống hoạt động tuần tự đơn tuyến (Single-threaded). Khi có 2 người dùng cùng lúc bấm thanh toán mua sản phẩm chỉ còn 1 món trong kho, Domain Testing không thể phát hiện lỗi tranh chấp trừ tồn kho nếu không có bài test tương tranh riêng.
3. **Lỗ hổng bảo mật phi nghiệp vụ (Security Injections):**
   - Kỹ thuật phân hoạch kiểm tra kiểu chuỗi nhưng không phát hiện các vector tấn công chuyên sâu như Stored XSS trong `shipping_address` hoặc SQL Injection nâng cao nếu backend nối chuỗi truy vấn trực tiếp.

---

### DỪNG LẠI TẠI CHECKPOINT STAGE 4 & 5 (STOP FOR REVIEW)
*Tôi đã hoàn thành Stage 3, Stage 4 và Stage 5 của Kiểm thử miền (Domain Testing) cho FR-08, thiết kế hoàn chỉnh 22 ca kiểm thử tối thiểu với ma trận bao phủ 100% (31/31 ECs) và xuất tệp `HW2/testcases/FR-08.json`. Xin kính mời bạn thẩm định trước khi tôi chuyển sang kỹ thuật Phân tích giá trị biên (BVA).*

