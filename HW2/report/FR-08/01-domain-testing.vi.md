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

### DỪNG LẠI TẠI CHECKPOINT STAGE 2 (STOP FOR REVIEW)
*Bảng 31 lớp tương đương trên đã phân loại đầy đủ các điều kiện hợp lệ và không hợp lệ dựa trên toàn bộ 6 kỹ thuật phân hoạch của CSC13003 S04 kèm các phát hiện dị biệt mã nguồn. Vui lòng thẩm định trước khi tôi chuyển sang Stage 3 (Chọn giá trị đại diện) và Stage 4 (Thiết kế ca kiểm thử tối thiểu).*

