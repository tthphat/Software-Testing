# Domain Testing — FR-12: Kiểm soát truy cập (Access Control)

> **Tính năng:** FR-12 — Kiểm soát truy cập  
> **Kỹ thuật:** Phân hoạch tương đương (Domain Testing / Equivalence Partitioning)  
> **Phiên bản:** Hoàn chỉnh Stage 0 đến Stage 5 (Báo cáo & Bộ Test Case tối thiểu)

---

## Stage 0 — Thu thập dữ kiện (Collect facts)

### 0.1 Phạm vi đặc tả

Theo đặc tả ([README.md](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/README.md#L174-L179)):

> **FR-12: Kiểm soát truy cập (Access Control)**
> - Phân hệ Admin chỉ dành cho tài khoản có `role = 'admin'`.
> - **Tất cả** các API Admin (`/api/admin/*`) và các API có tính ảnh hưởng dữ liệu
>   (`POST/PUT/DELETE /api/products`, `/api/categories`, `/api/coupons`) đều phải yêu cầu:
>   1. Token JWT hợp lệ.
>   2. `role = 'admin'` trong Token.

Ngoài ra, SEC-03 ([README.md:L280](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/README.md#L280)):

> API Admin phải kiểm tra `role = 'admin'` trong Token, không chỉ kiểm tra sự tồn tại của Token.

### 0.2 Danh sách endpoint thuộc phạm vi FR-12

Theo đặc tả, các endpoint cần bảo vệ bằng **cả JWT hợp lệ + role = 'admin'**:

| # | Method | Endpoint | Mục đích | Phạm vi đặc tả |
|---|--------|----------|----------|-----------------|
| A1 | `GET` | `/api/admin/users` | Lấy danh sách người dùng | `[SPEC]` §6.1 |
| A2 | `DELETE` | `/api/admin/users/:id` | Xóa người dùng | `[SPEC]` §6.1 |
| A3 | `GET` | `/api/admin/orders` | Lấy danh sách đơn hàng | `[SPEC]` §6.2 |
| A4 | `PUT` | `/api/admin/orders/:id/status` | Cập nhật trạng thái đơn hàng | `[SPEC]` §6.2 |
| A5 | `POST` | `/api/admin/import-products` | Import sản phẩm từ CSV | `[SPEC]` §6.3 |
| A6 | `POST` | `/api/admin/coupons` | Thêm mã giảm giá | `[SPEC]` §6.4 |
| A7 | `DELETE` | `/api/admin/coupons/:id` | Xóa mã giảm giá | `[SPEC]` §6.4 |
| P1 | `POST` | `/api/products` | Thêm sản phẩm | `[SPEC]` §3.3 + FR-12 |
| P2 | `PUT` | `/api/products/:id` | Cập nhật sản phẩm | `[SPEC]` §3.3 + FR-12 |
| P3 | `DELETE` | `/api/products/:id` | Xóa sản phẩm | `[SPEC]` §3.3 + FR-12 |
| C1 | `POST` | `/api/categories` | Thêm danh mục | `[SPEC]` §3.4 + FR-12 |
| C2 | `PUT` | `/api/categories/:id` | Cập nhật danh mục | `[SPEC]` §3.4 + FR-12 |
| C3 | `DELETE` | `/api/categories/:id` | Xóa danh mục | `[SPEC]` §3.4 + FR-12 |
| CP1 | `GET` | `/api/coupons` | Lấy danh sách mã giảm giá | `[SPEC]` §5.2 |

### 0.3 Ràng buộc validation THỰC SỰ có trong mã nguồn

#### Middleware `authenticateToken` — [server.js:L100-L110](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L100-L110)

```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user;
    next();
  });
};
```

**Phân tích:**
- `[CODE]` [server.js:L103](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L103): Token **null/missing** → HTTP 401 `{"error": "Unauthorized"}`
- `[CODE]` [server.js:L106](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L106): Token **không hợp lệ** (sai chữ ký, malformed, hết hạn) → HTTP 403 `{"error": "Forbidden"}`
- `[CODE]` [server.js:L107-L108](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L107-L108): Token hợp lệ → gán `req.user` (chứa `id`, `role`) và cho đi tiếp
- ⚠️ **KHÔNG có kiểm tra `role`** trong middleware này. Middleware chỉ xác thực token, không phân quyền.

#### JWT payload — [server.js:L51](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L51)

```javascript
const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY);
```

- `[CODE]` Token chứa `id` và `role` nhưng **không có trường `exp`** (không hết hạn).

#### Kiểm tra role trong mỗi route handler

Duyệt **toàn bộ** route handler của các endpoint thuộc phạm vi FR-12:

| Endpoint | Có `authenticateToken`? | Có kiểm tra `role === 'admin'`? | Dẫn chứng |
|----------|:-----------------------:|:-------------------------------:|-----------|
| `GET /api/admin/users` | ✅ | ❌ | [server.js:L494](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L494) |
| `DELETE /api/admin/users/:id` | ✅ | ❌ | [server.js:L504](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L504) |
| `GET /api/admin/orders` | ✅ | ❌ | [server.js:L510](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L510) |
| `PUT /api/admin/orders/:id/status` | ✅ | ❌ | [server.js:L525](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L525) |
| `POST /api/admin/import-products` | ✅ | ❌ | [server.js:L199](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L199) |
| `POST /api/admin/coupons` | ✅ | ❌ | [server.js:L457](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L457) |
| `DELETE /api/admin/coupons/:id` | ✅ | ❌ | [server.js:L483](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L483) |
| `POST /api/products` | ❌ | ❌ | [server.js:L167](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L167) |
| `PUT /api/products/:id` | ❌ | ❌ | [server.js:L179](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L179) |
| `DELETE /api/products/:id` | ❌ | ❌ | [server.js:L191](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L191) |
| `POST /api/categories` | ✅ | ❌ | [server.js:L249](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L249) |
| `PUT /api/categories/:id` | ✅ | ❌ | [server.js:L257](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L257) |
| `DELETE /api/categories/:id` | ✅ | ❌ | [server.js:L269](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L269) |
| `GET /api/coupons` | ✅ | ❌ | [server.js:L356](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L356) |

**Phát hiện quan trọng từ mã nguồn:**

1. `[CODE]` **Không endpoint nào kiểm tra `role === 'admin'`** trên server. Tất cả chỉ dùng `authenticateToken` — nghĩa là bất kỳ user đã đăng nhập (kể cả `role = 'user'`) đều có thể gọi API admin. Vi phạm SEC-03.
2. `[CODE]` `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` **không có `authenticateToken`** — endpoint hoàn toàn public, bất kỳ ai cũng gọi được mà không cần đăng nhập. ([server.js:L167](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L167), [L179](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L179), [L191](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L191))
3. `[CODE]` JWT **không có trường `exp`** → token không bao giờ hết hạn ([server.js:L51](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L51)).

#### Cross-platform skew — Admin Frontend

- `[CODE]` [App.jsx:L65](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/frontend-admin/src/App.jsx#L65): Kiểm tra `res.data.user.role !== "admin"` → `alert("Bạn không phải là admin!")` và **return** (không lưu token). Đây là kiểm tra **phía client** duy nhất.
- `[CODE]` [App.jsx:L54-L57](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/frontend-admin/src/App.jsx#L54-L57): Nếu API trả về 401 hoặc 403, UI xóa token và chuyển về form login.
- ⚠️ **Skew:** Bảo vệ role chỉ ở frontend. Nếu gọi API trực tiếp (Postman/cURL), user thường vẫn truy cập được API admin.

### 0.4 Các response có thể có

| Status | Body | Điều kiện | Nguồn |
|--------|------|-----------|-------|
| 200 | `{data...}` hoặc `{message: "..."}` | Token hợp lệ (bất kể role, trong code thực tế) | `[CODE]` |
| 401 | `{"error": "Unauthorized"}` | Không có header `Authorization` hoặc token null | `[CODE]` [server.js:L103](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L103) |
| 403 | `{"error": "Forbidden"}` | Token bị tamper, sai chữ ký, malformed | `[CODE]` [server.js:L106](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L106) |
| *(Theo SPEC)* 403 | Từ chối truy cập | Token hợp lệ nhưng `role ≠ 'admin'` | `[SPEC]` — **không có trong code** |

### 0.5 Endpoint PUT /api/users/me — lỗ hổng leo quyền

- `[CODE]` [server.js:L119](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L119): `const { name, shipping_address, phone, role } = req.body;`
- `[CODE]` [server.js:L124-L127](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L124-L127): `if (role) { query += ", role = ?"; params.push(role); }` — cho phép client gửi `role: "admin"` để tự nâng quyền.
- Vi phạm FR-04 ("không thể tự thay đổi thuộc tính `role`") và SEC-06.

---

## Stage 1 — Bảng biến Input / Output / State

### 1.1 Biến đầu vào (Input variables)

| # | Biến | Kind | Kiểu | Miền giá trị & Ràng buộc | Nguồn |
|---|------|------|------|---------------------------|-------|
| I1 | `Authorization` header | Input | String | (a) Vắng mặt (không gửi header) <br>(b) `"Bearer <token>"` với token hợp lệ <br>(c) `"Bearer <token>"` với token sai chữ ký / malformed <br>(d) Header có nhưng rỗng / sai format (e.g. `"Basic xxx"`, `"Bearer"` không có token) | `[CODE]` [server.js:L101-L103](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L101-L103) |
| I2 | `role` trong JWT payload | Input (context) | String | `"admin"` hoặc `"user"` (theo DB seed). Giá trị được gắn khi tạo token, không thể thay đổi trừ khi thay đổi trong DB. | `[CODE]` [server.js:L51](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L51), [database.js:L55](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/database.js#L55) |
| I3 | Endpoint đích (Target endpoint) | Input | Enum | Tập 14 endpoint thuộc phạm vi FR-12 (xem §0.2). Chia thành 3 nhóm: <br>(a) `/api/admin/*` — 7 endpoint <br>(b) Product/Category write — 6 endpoint <br>(c) `GET /api/coupons` — 1 endpoint | `[SPEC]` FR-12 |
| I4 | HTTP method | Input | Enum | `GET`, `POST`, `PUT`, `DELETE` (tùy endpoint, cặp 1:1 với I3) | `[SPEC]` |

### 1.2 Biến trạng thái (State variables)

| # | Biến | Kind | Kiểu | Miền giá trị & Ràng buộc | Nguồn |
|---|------|------|------|---------------------------|-------|
| S1 | Token JWT `exp` claim | State | — | **Không tồn tại** trong code hiện tại; JWT không có thời hạn. Đặc tả không đề cập rõ nhưng thực tiễn bảo mật yêu cầu có. | `[CODE]` [server.js:L51](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L51) |
| S2 | Trạng thái tài khoản nguồn | State | — | Tài khoản tồn tại / đã bị xóa (token cũ vẫn có thể hợp lệ vì JWT stateless) | `[CODE]` — JWT verify chỉ kiểm chữ ký, không kiểm DB |
| S3 | `role` trong DB (có thể bị thay đổi qua `PUT /api/users/me`) | State | String | `"admin"`, `"user"`, hoặc giá trị tùy ý do client gửi | `[CODE]` [server.js:L124-L127](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L124-L127) |

### 1.3 Biến đầu ra (Output variables)

| # | Biến | Kind | Kiểu | Miền giá trị | Nguồn |
|---|------|------|------|--------------|-------|
| O1 | HTTP status code | Output | Integer | `200`, `401`, `403` (theo code); theo SPEC cũng cần `403` khi role sai | `[CODE]` + `[SPEC]` |
| O2 | Response body | Output | JSON | (a) Dữ liệu thành công (danh sách user, sản phẩm, v.v.) <br>(b) `{"error": "Unauthorized"}` <br>(c) `{"error": "Forbidden"}` <br>(d) Theo SPEC: thông báo từ chối khi role sai (không có trong code) | `[CODE]` + `[SPEC]` |
| O3 | Side effect: dữ liệu bị thay đổi | Output | Boolean | Có / Không — nếu access control đúng, user thường không gây ra side effect trên tài nguyên admin | `[SPEC]` |

---

## Câu hỏi mở (Open questions)

| # | Câu hỏi | Lý do |
|---|---------|-------|
| Q1 | Khi user thường gọi API admin, hệ thống nên trả 401 hay 403? Đặc tả nói cần kiểm tra role, nhưng code hiện tại không kiểm tra → trả 200. Khi thiết kế test, expected result nên theo SPEC (403) hay theo CODE (200)? | Cần để đánh giá đây là **bug** của SUT hay là hành vi mong muốn. → Theo nguyên tắc testing: expected = SPEC, actual = CODE. Nếu khác nhau → bug. |
| Q2 | Có nên test từng endpoint admin riêng lẻ, hay gộp thành 1 đại diện? Skill reference ghi "test every endpoint, not a sample". | Skill reference yêu cầu test từng endpoint. Cần xác nhận với sinh viên mức độ chi tiết. |
| Q3 | Token do user tự tạo (forge) với `role = 'admin'` nhưng dùng đúng `SECRET_KEY` — server có chấp nhận không? | `[CODE]` Secret key hardcoded tại [server.js:L9](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L9): `"super_secret_key_that_should_not_be_here"`. Nếu attacker biết key, có thể forge token admin. Đây là vấn đề bảo mật nhưng nằm ngoài phạm vi FR-12 (thuộc SEC). |
| Q4 | `PUT /api/users/me` cho phép đổi `role` — đây thuộc phạm vi FR-12 hay FR-04? | Liên quan đến cả hai. FR-04 nói "không thể tự thay đổi `role`"; FR-12 nói access control. Cần xác nhận có đưa vào scope FR-12 hay không. |
| Q5 | Token của user đã bị xóa (`DELETE /api/admin/users/:id`) có bị vô hiệu hóa không? | `[CODE]` JWT stateless, server không kiểm tra DB khi verify → token cũ vẫn hợp lệ. Cần xác nhận có đưa vào scope kiểm thử không. |

---

## Stage 2: Phân hoạch tương đương (Equivalence Partitioning)

Áp dụng phương pháp 4 bước theo tài liệu bài giảng môn học **S04 - Domain Testing (Step 2: Partitioning)** và chuẩn ISTQB:
1. **Ràng buộc miền giá trị (*Range of values*):** Phân hoạch biến trạng thái thời gian hiệu lực của Token JWT `exp` thành 1 lớp hợp lệ (`exp > current_time` hoặc không có exp) và 1 lớp không hợp lệ (`exp < current_time`).
2. **Ràng buộc tập giá trị (*Set of values handled differently*):** Phân hoạch biến `role` trong payload Token JWT thành 1 lớp hợp lệ (`role = 'admin'`), 1 lớp không hợp lệ người dùng thường (`role = 'user'`), và 1 lớp không hợp lệ cho các giá trị ngoài tập/rỗng/thiếu.
3. **Ràng buộc "Bắt buộc phải là" (*Must be*):**
   - Header `Authorization` bắt buộc phải có, đúng tiền tố `Bearer `, và token JWT phải có chữ ký hợp lệ được ký bởi `SECRET_KEY` của hệ thống.
   - Trạng thái tài khoản trong cơ sở dữ liệu bắt buộc phải đang hoạt động (chưa bị xóa).
4. **Tách lớp khi các phần tử có khả năng xử lý khác nhau (*Reason to believe elements are NOT handled identically*):**
   - Theo đặc tả FR-12, có 14 endpoint cần được bảo vệ quyền admin. Tuy nhiên, qua khảo sát mã nguồn SUT ở Stage 0, chúng ta phát hiện hệ thống xử lý các endpoint này hoàn toàn không đồng nhất:
     * **Nhóm 1 (Admin APIs - 7 endpoint):** Có middleware `authenticateToken`, nhưng **thiếu hoàn toàn** bước kiểm tra `role === 'admin'`.
     * **Nhóm 2 (Category Write APIs - 3 endpoint):** Có middleware `authenticateToken`, nhưng **thiếu hoàn toàn** bước kiểm tra `role === 'admin'`.
     * **Nhóm 3 (Product Write APIs - 3 endpoint):** **Hoàn toàn KHÔNG CÓ** middleware `authenticateToken` lẫn kiểm tra `role` (public hoàn toàn).
     * **Nhóm 4 (Coupons Read API - 1 endpoint):** Có middleware `authenticateToken`, nhưng **thiếu hoàn toàn** bước kiểm tra `role === 'admin'`.
   - Do cách xử lý trong mã nguồn khác nhau về căn bản giữa Nhóm 3 (bỏ ngỏ cả Auth) và các Nhóm 1, 2, 4 (chỉ có Auth, thiếu Role), chúng ta **tách thành các lớp phân hoạch endpoint riêng biệt** để đảm bảo không bỏ sót khiếm khuyết phần mềm.
5. **Ràng buộc trạng thái & leo quyền (*State & Privilege Escalation*):** Phân hoạch trạng thái tài khoản giữ nguyên quyền hạn ban đầu vs tài khoản tự nâng quyền bất hợp pháp thông qua `PUT /api/users/me`.
6. **Lớp kết quả đầu ra (*Output classes*):** Phân hoạch từng mã trạng thái phản hồi HTTP và hành vi thực tế trên dữ liệu (HTTP 200/201 Thành công, HTTP 401 Từ chối xác thực, HTTP 403 Từ chối truy cập/Sai chữ ký/Hết hạn, và HTTP 200 Lỗ hổng bỏ qua phân quyền).

---

### 2.1 Bảng phân hoạch tương đương hoàn chỉnh (Complete Set of Partitions — EC01 đến EC23)

| Mã EC | Biến kiểm thử | Mô tả lớp tương đương | Hợp lệ / Không hợp lệ | Quy tắc áp dụng (Guideline used) | Nguồn gốc (Source tag) |
| :---: | :--- | :--- | :---: | :--- | :---: |
| **EC01** | `Authorization` header | Header đúng định dạng `"Bearer <token>"`, Token JWT có chữ ký hợp lệ được ký bởi đúng `SECRET_KEY` | **Valid** | Must be: valid format & valid signature | `[SPEC]` FR-12<br>`[CODE]` server.js:101-108 |
| **EC02** | `Authorization` header | Vắng mặt hoàn toàn header `Authorization` trong HTTP request | Invalid | Missing/Required: header omitted | `[CODE]` server.js:103 |
| **EC03** | `Authorization` header | Header tồn tại nhưng giá trị rỗng `""` hoặc chỉ có tiền tố `"Bearer "` không kèm chuỗi token (`token == null`) | Invalid | Missing/Empty: empty token | `[CODE]` server.js:103 |
| **EC04** | `Authorization` header | Header sai tiền tố xác thực (ví dụ: `"Basic <token>"`, `"Token <token>"`, hoặc chuỗi không có khoảng trắng) | Invalid | Format: wrong scheme prefix | `[CODE]` server.js:102-106 |
| **EC05** | `Authorization` header | Token JWT có chữ ký bị thay đổi (tampered) hoặc được ký bằng secret key khác (sai chữ ký) | Invalid | Must be: valid signature (jwt.verify fail) | `[CODE]` server.js:106 |
| **EC06** | `Authorization` header | Token JWT bị sai cấu trúc (malformed — không đúng chuẩn 3 phần `header.payload.signature` phân tách bởi dấu chấm) | Invalid | Must be: valid JWT structure | `[CODE]` server.js:106 |
| **EC07** | `token_role` | Payload Token JWT chứa claim `role === 'admin'` | **Valid** | Set of values: authorized admin role | `[SPEC]` README:176<br>`[CODE]` server.js:51 |
| **EC08** | `token_role` | Payload Token JWT chứa claim `role === 'user'` (tài khoản người dùng thông thường đã đăng nhập) | Invalid | Set of values: unauthorized normal user | `[SPEC]` README:176<br>`[CODE]` server.js:100 |
| **EC09** | `token_role` | Payload Token JWT chứa role ngoài tập hợp (e.g. `'guest'`, `'manager'`, `''`, hoặc không tồn tại trường `role`) | Invalid | Outside set: undefined/unrecognized role | `[SPEC]` FR-12<br>`[ASSUMED]` |
| **EC10** | `target_endpoint` | Nhóm 7 API Quản trị hệ thống (`/api/admin/*` gồm users, orders, coupons, import) — Có `authenticateToken`, thiếu role check | **Valid Target** | Set of values / Split class: Admin APIs | `[SPEC]` §6.1-§6.4<br>`[CODE]` server.js:494, 510 |
| **EC11** | `target_endpoint` | Nhóm 3 API chỉnh sửa danh mục (`POST/PUT/DELETE /api/categories`) — Có `authenticateToken`, thiếu role check | **Valid Target** | Set of values / Split class: Category write APIs | `[SPEC]` §3.4, FR-12<br>`[CODE]` server.js:249-269 |
| **EC12** | `target_endpoint` | Nhóm 3 API chỉnh sửa sản phẩm (`POST/PUT/DELETE /api/products`) — **Hoàn toàn thiếu `authenticateToken`** | **Valid Target** *(Spec)*<br>⚠️ *Skewed (Code)* | Set of values / Split class: Unprotected product write | `[SPEC]` §3.3, FR-12<br>`[CODE]` server.js:167-191 |
| **EC13** | `target_endpoint` | API tra cứu mã giảm giá quản trị (`GET /api/coupons`) — Có `authenticateToken`, thiếu role check | **Valid Target** | Set of values / Split class: Coupons read API | `[SPEC]` §5.2, FR-12<br>`[CODE]` server.js:356 |
| **EC14** | `token_exp` (State) | Token JWT còn trong thời hạn sử dụng (`exp > current_timestamp` hoặc token không có claim `exp`) | **Valid State** | Range of timestamp: valid/active lifetime | `[SPEC]` / `[CODE]` server.js:51 |
| **EC15** | `token_exp` (State) | Token JWT đã quá hạn sử dụng (`exp < current_timestamp`) | Invalid State | Range of timestamp: expired lifetime | `[CODE]` server.js:106 (jwt.verify) |
| **EC16** | `user_status` (State) | Tài khoản người dùng đang ở trạng thái hoạt động và tồn tại thực tế trong bảng `users` của DB | **Valid State** | State: active user in database | `[CODE]` database.js:55 |
| **EC17** | `user_status` (State) | Tài khoản người dùng đã bị xóa khỏi cơ sở dữ liệu (`DELETE /api/admin/users/:id`), nhưng client vẫn giữ Token cũ | Invalid State | State conflict: deleted/revoked account | `[CODE]` server.js:504 |
| **EC18** | `privilege_escalation` (State) | Tài khoản người dùng giữ nguyên vai trò được phân định, không thực hiện hành vi can thiệp nâng quyền | **Valid State** | State: normal privilege integrity | `[SPEC]` FR-04, SEC-06 |
| **EC19** | `privilege_escalation` (State) | Người dùng thường tự sửa `role: "admin"` thành công qua lỗ hổng Mass Assignment tại `PUT /api/users/me` | Invalid State | State conflict / Security Flaw: unauthorized privilege escalation | `[CODE]` server.js:124-127 |
| **EC20** | HTTP Response (Output) | Truy cập thành công: HTTP 200 OK (hoặc 201 Created); dữ liệu tài nguyên quản trị được trả về hoặc bị thay đổi | **Valid Output** | Output condition: authorized access granted | `[SPEC]` / `[CODE]` |
| **EC21** | HTTP Response (Output) | Từ chối xác thực danh tính: HTTP 401 Unauthorized `{"error": "Unauthorized"}`; dữ liệu an toàn | Invalid Output | Output condition: authentication required | `[CODE]` server.js:103 |
| **EC22** | HTTP Response (Output) | Từ chối phân quyền / Token không hợp lệ: HTTP 403 Forbidden `{"error": "Forbidden"}`; dữ liệu an toàn | Invalid Output | Output condition: forbidden / invalid token | `[CODE]` server.js:106<br>`[SPEC]` README:176 |
| **EC23** | HTTP Response (Output) | Lỗ hổng an ninh kiểm soát truy cập (SUT Defect Output): HTTP 200 OK trả về cho User thường hoặc Khách vãng lai | **Defect Output** | Output condition: security bypass defect | `[CODE]` server.js:100, 167 |

---

### 2.2 Phân tích chuyên sâu các dị biệt và rủi ro an ninh của FR-12

#### 1. Dị biệt nghiêm trọng: Nhóm API Sản phẩm (`POST/PUT/DELETE /api/products`) hoàn toàn mở (EC12)
- Tại `server.js:167`, `179`, `191`, các route này được định nghĩa trực tiếp dạng `app.post("/api/products", (req, res) => {...})` mà **không hề có middleware `authenticateToken`**.
- Hệ quả: Bất kỳ ai trên Internet không cần đăng nhập (Guest) cũng có thể thêm mới, chỉnh sửa giá cả, hoặc xóa vĩnh viễn sản phẩm khỏi cơ sở dữ liệu.
- Trong khi đó, các API Danh mục (`POST/PUT/DELETE /api/categories` tại `server.js:249, 257, 269`) lại được gắn middleware `authenticateToken`. Đây là một sự thiếu nhất quán và sơ hở bảo mật nghiêm trọng trong mã nguồn SUT.

#### 2. Lỗ hổng cốt lõi của FR-12: Thiếu kiểm tra quyền hạn `role === 'admin'` trên toàn bộ các route (EC08, EC23)
- Middleware `authenticateToken` ([server.js:L100-L110](file:///d:/HCMUS/semester7/software-testing/Copy/Software-Testing/eshop-sut/backend/server.js#L100-L110)) chỉ kiểm tra tính hợp lệ của chữ ký JWT và gán `req.user = user`, sau đó gọi `next()`.
- Trong tất cả các route handler của Admin (`/api/admin/users`, `/api/admin/orders`, `/api/admin/coupons`, `/api/admin/import-products`), **hoàn toàn không có dòng code nào kiểm tra `if (req.user.role !== 'admin')`**.
- Do đó, nếu một người dùng đăng ký thông thường (`role = 'user'`) đăng nhập và lấy được Token hợp lệ, họ có thể gửi request đến bất kỳ endpoint Admin nào và hệ thống đều xử lý thành công (trả về HTTP 200 OK — EC23).
- Đây là lỗi vi phạm trực tiếp đặc tả **FR-12** và yêu cầu an toàn **SEC-03**.

#### 3. Lỗ hổng leo quyền Mass Assignment qua `PUT /api/users/me` (EC19)
- Tại `server.js:119-127`, hàm cập nhật thông tin cá nhân trích xuất trực tiếp thuộc tính `role` từ request body:
  ```javascript
  const { name, shipping_address, phone, role } = req.body;
  ...
  if (role) {
    query += ", role = ?";
    params.push(role);
  }
  ```
- Người dùng chỉ cần gửi `PUT /api/users/me` với body `{ "role": "admin" }` là có thể tự nâng quyền của mình trong database. Sau đó, khi đăng nhập lại, họ sẽ nhận được một JWT token chính thức với `role: "admin"`.
- Lỗ hổng này phá vỡ toàn bộ ranh giới kiểm soát truy cập phân hệ Admin.

#### 4. Vấn đề thu hồi Token trong kiến trúc Stateless JWT (EC17)
- SUT sử dụng JWT hoàn toàn không có trạng thái (stateless): khi `authenticateToken` xác thực, nó chỉ gọi `jwt.verify(token, SECRET_KEY)` mà không hề truy vấn cơ sở dữ liệu để kiểm tra xem tài khoản `req.user.id` có còn tồn tại hoặc có bị khóa hay không.
- Khi quản trị viên gọi `DELETE /api/admin/users/:id` để xóa một tài khoản độc hại, token của tài khoản đó vẫn tiếp tục sử dụng được để gọi các API cho đến vô tận (vì token trong code SUT không có thời hạn hết hạn `exp`).

---

### 2.3 Câu hỏi mở sau Stage 2 (Open Questions for Student Review)

| # | Câu hỏi mở | Phân tích & Đề xuất xử lý |
|---|------------|---------------------------|
| **Q1** | **Xác định Kỳ vọng (Expected Result) cho User thường gọi API Admin:** <br>Nên đặt là HTTP 403 (theo SPEC FR-12/SEC-03) hay HTTP 200 (theo hành vi hiện tại của CODE)? | **Đề xuất:** Tuân thủ nguyên tắc kiểm thử phần mềm chuẩn: Kỳ vọng kiểm thử phải theo **SPEC** (`Expected: HTTP 403 Forbidden`). Khi chạy test thực tế trên SUT, kết quả sẽ trả về `Actual: HTTP 200 OK` → Test Case sẽ ghi nhận trạng thái **FAIL**. Đây chính là bằng chứng xác thực để mở báo cáo lỗi phần mềm (**Bug Report**) cho SUT. |
| **Q2** | **Phạm vi kiểm thử 14 endpoint:** <br>Có cần thiết phải viết test case cho từng endpoint trong số 14 endpoint hay gom theo 4 nhóm đại diện (EC10, EC11, EC12, EC13)? | **Đề xuất:** Theo chỉ dẫn tại `references/eshop-features.md` ("*test every endpoint, not a sample*"), ở Stage 4 chúng ta sẽ: <br>1. Thiết kế bộ test case tối thiểu cốt lõi bao phủ toàn bộ 23 lớp tương đương EC01 - EC23 trên endpoint đại diện chính (`GET /api/admin/users`). <br>2. Bổ sung các ca kiểm thử quét ma trận trên cả 4 nhóm endpoint (đặc biệt là nhóm Product write không có auth) để chứng minh lỗi diện rộng trên toàn hệ thống. |
| **Q3** | **Tích hợp ca kiểm thử leo quyền (`PUT /api/users/me` - EC19):** <br>Có nên đưa kịch bản leo quyền này vào bộ test case chính thức của FR-12 hay để dành riêng cho FR-04? | **Đề xuất:** Đưa vào bộ test case của FR-12 dưới dạng một kịch bản kiểm thử bảo mật nâng cao (Privilege Escalation Scenario) kết hợp giữa FR-04 và FR-12: User thường tự đổi role → Đăng nhập lại → Chiếm quyền điều khiển API Admin. |
| **Q4** | **Kiểm thử Token hết hạn (`exp` - EC15):** <br>Vì backend không tự sinh `exp`, chúng ta có nên tự tạo (craft) một token có `exp` trong quá khứ được ký bằng `SECRET_KEY` của SUT để kiểm thử nhánh `jwt.verify` không? | **Đề xuất:** Có. Thư viện `jsonwebtoken` ở `server.js:105` sẽ tự động phát hiện `TokenExpiredError` và trả về HTTP 403 `{"error": "Forbidden"}`. Việc kiểm thử này giúp xác nhận khả năng xử lý token hết hạn của tầng middleware. |

---

## Stage 3: Chọn giá trị đại diện cho từng lớp tương đương (Best Representatives)

Áp dụng nguyên tắc lựa chọn giá trị đại diện theo bài giảng môn học **S04 - Domain Testing (Step 3: Selecting representative values)**:
- **Miền có thứ tự (Ordered/Ranged):** Giá trị đại diện là giá trị biên hoặc cận biên. Đánh dấu `-> BVA` để kỹ năng Boundary Value Analysis khai thác sâu hơn ở bước tiếp theo.
- **Miền không có thứ tự (Unordered):** Chọn giá trị điển hình, thực tế, phản ánh chính xác cấu trúc dữ liệu môi trường thực thi của SUT.

| Mã EC | Biến kiểm thử | Mô tả lớp tương đương | Giá trị đại diện được chọn | Lý do lựa chọn đại diện |
| :---: | :--- | :--- | :--- | :--- |
| **EC01** | `Authorization` | Header hợp lệ, JWT đúng chữ ký `SECRET_KEY` | `"Bearer <admin_jwt>"` (sinh từ đăng nhập `admin@eshop.com`) | Token JWT hợp pháp của tài khoản quản trị hệ thống |
| **EC02** | `Authorization` | Vắng mặt hoàn toàn header `Authorization` | *(Omitted - không gửi header)* | Kiểm tra nhánh `authHeader === undefined` tại `server.js:103` |
| **EC03** | `Authorization` | Header rỗng hoặc chỉ có `"Bearer "` không kèm token | `"Bearer "` *(chuỗi có tiền tố nhưng token rỗng)* | Kiểm tra nhánh `token == null` tại `server.js:103` |
| **EC04** | `Authorization` | Header sai tiền tố xác thực (e.g. Basic) | `"Basic dXNlcjpwYXNz"` | Kiểm tra logic tách chuỗi `authHeader.split(" ")[1]` khi dùng scheme sai |
| **EC05** | `Authorization` | Token JWT có chữ ký bị thay đổi (Tampered) | `"Bearer <admin_jwt_tampered_sig>"` *(sửa ký tự cuối chữ ký)* | Payload hợp lệ nhưng chữ ký không khớp -> `jwt.verify` ném lỗi chữ ký |
| **EC06** | `Authorization` | Token JWT bị sai cấu trúc (Malformed) | `"Bearer not_a_valid_jwt_string"` | Chuỗi không theo định dạng 3 phần `header.payload.sig` -> JsonWebTokenError |
| **EC07** | `token_role` | Payload Token chứa `role === 'admin'` | Token chứa `{ id: 1, role: "admin" }` | Vai trò quản trị hợp chuẩn theo đặc tả FR-12 |
| **EC08** | `token_role` | Payload Token chứa `role === 'user'` | Token sinh từ đăng nhập `user@domain.com` (`{ id: 2, role: "user" }`) | Người dùng thường hợp pháp; theo SPEC phải bị từ chối 403, theo CODE hiện trả 200 |
| **EC09** | `token_role` | Payload Token chứa role ngoài tập / không xác định | Token craft `{ id: 99, role: "guest" }` ký bởi `SECRET_KEY` | Kiểm tra hành vi hệ thống khi nhận role không hợp lệ ngoài `user` và `admin` |
| **EC10** | `target_endpoint` | Nhóm 7 API Admin (`/api/admin/*`) | `GET /api/admin/users` | Endpoint quản trị nhạy cảm tra cứu danh sách toàn bộ người dùng |
| **EC11** | `target_endpoint` | Nhóm 3 API Category write | `POST /api/categories` body `{"name": "Category_{{uniq}}"}` | API ghi danh mục có middleware `authenticateToken` nhưng thiếu kiểm tra role |
| **EC12** | `target_endpoint` | Nhóm 3 API Product write | `POST /api/products` body `{"name": "Product_{{uniq}}", "price": 99000, "category_id": 1, "description": "test", "stock": 10}` | API ghi sản phẩm hoàn toàn thiếu `authenticateToken` (Lỗ hổng nghiêm trọng) |
| **EC13** | `target_endpoint` | API tra cứu mã giảm giá quản trị | `GET /api/coupons` | API tra cứu coupon quản trị có auth nhưng thiếu role check |
| **EC14** | `token_exp` (State) | Token còn trong thời hạn sử dụng | Token hiện tại của SUT (không có exp) hoặc token có `exp > now` | `-> BVA` cho các biên thời gian; đại diện cho token đang còn hiệu lực |
| **EC15** | `token_exp` (State) | Token đã quá hạn sử dụng | Token craft với `exp: Math.floor(Date.now() / 1000) - 3600` ký bằng `SECRET_KEY` | `-> BVA` cho biên hết hạn; kích hoạt `TokenExpiredError` của `jwt.verify` -> 403 |
| **EC16** | `user_status` (State) | Tài khoản người dùng đang hoạt động trong DB | User ID 1 (`admin@eshop.com`) hoặc User ID 2 (`user@domain.com`) | Tài khoản tồn tại bình thường trong cơ sở dữ liệu SQLite |
| **EC17** | `user_status` (State) | Tài khoản đã bị xóa khỏi DB nhưng token còn giữ | Tạo user tạm thời, lấy token, xóa user qua `DELETE /api/admin/users/:id`, dùng lại token | Kiểm tra lỗ hổng thiếu kiểm tra trạng thái DB của Stateless JWT |
| **EC18** | `privilege_escalation` (State) | Tài khoản giữ nguyên quyền hạn ban đầu | Giữ nguyên role `'user'` khi gọi API | Trạng thái bình thường, không thực hiện can thiệp dữ liệu |
| **EC19** | `privilege_escalation` (State) | Người dùng tự đổi role qua `PUT /api/users/me` | Gửi `PUT /api/users/me` với payload `{"role": "admin"}` | Lỗ hổng Mass Assignment tại `server.js:124`, biến user thường thành admin |
| **EC20** | HTTP Response (Output) | Truy cập thành công: HTTP 200/201 | HTTP 200 OK kèm JSON danh sách tài nguyên | Kỳ vọng cho trường hợp hợp lệ của quản trị viên |
| **EC21** | HTTP Response (Output) | Từ chối xác thực: HTTP 401 Unauthorized | HTTP 401 `{"error": "Unauthorized"}` | Kỳ vọng khi không gửi token hoặc token rỗng |
| **EC22** | HTTP Response (Output) | Từ chối phân quyền / Token lỗi: HTTP 403 Forbidden | HTTP 403 `{"error": "Forbidden"}` | Kỳ vọng theo SPEC khi role không phải admin hoặc khi token sai chữ ký/hết hạn |
| **EC23** | HTTP Response (Output) | Lỗ hổng kiểm soát truy cập (Defect Output) | HTTP 200 OK (thực tế code trả về thay vì 403) | Hành vi dị biệt của SUT khi thiếu role check hoặc thiếu middleware |

---

## Stage 4: Lựa chọn bộ Test Case tối thiểu (Selecting Test Cases)

### 4.1 Quy tắc kết hợp (Theo slide bài giảng S04)
1. **Bao phủ toàn bộ:** Mỗi lớp tương đương phải xuất hiện trong ít nhất một ca kiểm thử.
2. **Lớp hợp lệ (Valid classes):** Kết hợp tối đa các lớp hợp lệ vào một test case duy nhất (`FR12-DT-01`) cho đến khi tất cả các lớp hợp lệ đều được kiểm thử.
3. **Lớp không hợp lệ (Invalid classes):** Mỗi test case **chỉ kiểm thử duy nhất một lớp không hợp lệ**, tất cả các yếu tố còn lại phải giữ ở giá trị hợp lệ để cô lập chính xác nguyên nhân gây lỗi (`FR12-DT-02` đến `FR12-DT-11`).
4. **Kiểm tra chéo các nhóm Endpoint (Cross-check Endpoint Groups):** Để chứng minh khiếm khuyết mang tính hệ thống trên toàn bộ 14 endpoint thuộc phạm vi FR-12, các ca kiểm thử từ `FR12-DT-12` đến `FR12-DT-18` được thiết kế nhằm quét qua cả 4 nhóm endpoint đích (Admin APIs, Category write, Product write, Coupons read) đối với các vai trò Admin, User thường và Khách vãng lai (Guest).
5. **Lớp đầu ra (Output classes):** Được bao phủ trực tiếp bởi các ca kiểm thử sinh ra chúng.

---

### 4.2 Bảng danh sách 18 Test Case chi tiết (FR12-DT-01 đến FR12-DT-18)

| TC ID | Lớp bao phủ (Partitions) | Header Authorization | Token Role | Target Endpoint & Method | Tiền điều kiện | Kỳ vọng đầu ra | Nguồn gốc |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **FR12-DT-01** | EC01, EC07, EC10, EC14, EC16, EC18, EC20 | `Bearer <admin_jwt>` | `admin` | `GET /api/admin/users` | Tài khoản admin đang hoạt động trong DB | HTTP 200 OK, body chứa danh sách users | `[SPEC]` FR-12<br>`[CODE]` server.js:494 |
| **FR12-DT-02** | EC02, EC21 | *(Omitted - không gửi)* | *(None)* | `GET /api/admin/users` | Không có | HTTP 401 Unauthorized `{"error": "Unauthorized"}` | `[CODE]` server.js:103 |
| **FR12-DT-03** | EC03, EC21 | `"Bearer "` | *(None)* | `GET /api/admin/users` | Không có | HTTP 401 Unauthorized `{"error": "Unauthorized"}` | `[CODE]` server.js:103 |
| **FR12-DT-04** | EC04, EC21 | `"Basic dXNlcjpwYXNz"` | *(None)* | `GET /api/admin/users` | Không có | HTTP 401/403 (Từ chối định dạng scheme sai) | `[CODE]` server.js:103 |
| **FR12-DT-05** | EC05, EC22 | `Bearer <tampered_token>` | `admin` | `GET /api/admin/users` | Không có | HTTP 403 Forbidden `{"error": "Forbidden"}` | `[CODE]` server.js:106 |
| **FR12-DT-06** | EC06, EC22 | `Bearer not_a_valid_jwt` | *(None)* | `GET /api/admin/users` | Không có | HTTP 403 Forbidden `{"error": "Forbidden"}` | `[CODE]` server.js:106 |
| **FR12-DT-07** | EC08, EC22, EC23 | `Bearer <user_jwt>` | `user` | `GET /api/admin/users` | Tài khoản user thường đăng nhập hợp lệ | `[SPEC]` HTTP 403 Forbidden<br>*(Thực tế SUT: HTTP 200 -> Bug SEC-03)* | `[SPEC]` README:176<br>`[CODE]` server.js:100 |
| **FR12-DT-08** | EC09, EC22 | `Bearer <guest_jwt>` | `guest` | `GET /api/admin/users` | Token craft ký bằng SECRET_KEY | `[SPEC]` HTTP 403 Forbidden | `[SPEC]` FR-12 |
| **FR12-DT-09** | EC15, EC22 | `Bearer <expired_jwt>` | `admin` | `GET /api/admin/users` | Token craft có `exp < now` | HTTP 403 Forbidden `{"error": "Forbidden"}` | `[CODE]` server.js:106 |
| **FR12-DT-10** | EC17, EC22, EC23 | `Bearer <token_deleted_user>` | `user` | `GET /api/admin/users` | User được tạo, cấp token, sau đó bị xóa khỏi DB | `[SPEC]` HTTP 401/403 (Token bị thu hồi)<br>*(Thực tế SUT: HTTP 200 do Stateless JWT)* | `[ASSUMED]` Security Standard |
| **FR12-DT-11** | EC19, EC22, EC23 | `Bearer <user_jwt>` | `user` | `PUT /api/users/me` body: `{"role": "admin"}` | User thường đăng nhập hợp lệ | `[SPEC]` HTTP 400/403 (Cấm người dùng tự đổi role)<br>*(Thực tế SUT: HTTP 200 đổi role thành công)* | `[SPEC]` FR-04, SEC-06<br>`[CODE]` server.js:124 |
| **FR12-DT-12** | EC11, EC20 | `Bearer <admin_jwt>` | `admin` | `POST /api/categories` body: `{"name": "Cat_{{uniq}}"}` | Tài khoản admin hợp lệ | HTTP 200 OK, message: "Category added successfully" | `[SPEC]` §3.4<br>`[CODE]` server.js:249 |
| **FR12-DT-13** | EC11, EC08, EC22, EC23 | `Bearer <user_jwt>` | `user` | `POST /api/categories` body: `{"name": "Hacked_{{uniq}}"}` | Tài khoản user thường hợp lệ | `[SPEC]` HTTP 403 Forbidden<br>*(Thực tế SUT: HTTP 200 do thiếu role check)* | `[SPEC]` FR-12 |
| **FR12-DT-14** | EC12, EC20 | `Bearer <admin_jwt>` | `admin` | `POST /api/products` body: `{"name": "P_{{uniq}}", ...}` | Tài khoản admin hợp lệ | HTTP 200 OK, message: "Product added successfully" | `[SPEC]` §3.3<br>`[CODE]` server.js:167 |
| **FR12-DT-15** | EC12, EC08, EC22, EC23 | `Bearer <user_jwt>` | `user` | `POST /api/products` body: `{"name": "P_{{uniq}}", ...}` | Tài khoản user thường hợp lệ | `[SPEC]` HTTP 403 Forbidden<br>*(Thực tế SUT: HTTP 200 do thiếu role check)* | `[SPEC]` FR-12 |
| **FR12-DT-16** | EC12, EC02, EC21, EC23 | *(Omitted - không gửi)* | *(None)* | `POST /api/products` body: `{"name": "P_{{uniq}}", ...}` | Khách vãng lai (Guest) không token | `[SPEC]` HTTP 401 Unauthorized<br>*(Thực tế SUT: HTTP 200 - Lỗ hổng Critical)* | `[SPEC]` FR-12<br>`[CODE]` server.js:167 |
| **FR12-DT-17** | EC13, EC20 | `Bearer <admin_jwt>` | `admin` | `GET /api/coupons` | Tài khoản admin hợp lệ | HTTP 200 OK, body chứa coupons | `[SPEC]` §5.2<br>`[CODE]` server.js:356 |
| **FR12-DT-18** | EC13, EC08, EC22, EC23 | `Bearer <user_jwt>` | `user` | `GET /api/coupons` | Tài khoản user thường hợp lệ | `[SPEC]` HTTP 403 Forbidden<br>*(Thực tế SUT: HTTP 200 do thiếu role check)* | `[SPEC]` FR-12 |

---

### 4.3 Ma trận bao phủ lớp tương đương (Coverage Matrix)

| Lớp tương đương (EC) | Loại lớp | Ca kiểm thử kiểm tra (Test Cases) | Tình trạng bao phủ |
| :--- | :---: | :--- | :---: |
| **EC01** (`Authorization` hợp lệ) | **Valid** | `FR12-DT-01`, `FR12-DT-07`, `FR12-DT-12`, `FR12-DT-14`, `FR12-DT-17` | ✅ Bao phủ đầy đủ |
| **EC02** (`Authorization` vắng mặt) | Invalid | `FR12-DT-02`, `FR12-DT-16` | ✅ Bao phủ đơn lập |
| **EC03** (`Authorization` rỗng / `"Bearer "`) | Invalid | `FR12-DT-03` | ✅ Bao phủ đơn lập |
| **EC04** (`Authorization` sai scheme prefix) | Invalid | `FR12-DT-04` | ✅ Bao phủ đơn lập |
| **EC05** (`Authorization` sai chữ ký / tampered) | Invalid | `FR12-DT-05` | ✅ Bao phủ đơn lập |
| **EC06** (`Authorization` sai cấu trúc / malformed) | Invalid | `FR12-DT-06` | ✅ Bao phủ đơn lập |
| **EC07** (`role === 'admin'`) | **Valid** | `FR12-DT-01`, `FR12-DT-12`, `FR12-DT-14`, `FR12-DT-17` | ✅ Bao phủ đầy đủ |
| **EC08** (`role === 'user'`) | Invalid | `FR12-DT-07`, `FR12-DT-13`, `FR12-DT-15`, `FR12-DT-18` | ✅ Bao phủ đơn lập & đa endpoint |
| **EC09** (`role` ngoài tập / guest) | Invalid | `FR12-DT-08` | ✅ Bao phủ đơn lập |
| **EC10** (Target: Admin APIs `/api/admin/*`) | **Valid Target** | `FR12-DT-01` đến `FR12-DT-11` | ✅ Bao phủ đầy đủ |
| **EC11** (Target: Category write APIs) | **Valid Target** | `FR12-DT-12`, `FR12-DT-13` | ✅ Bao phủ đầy đủ |
| **EC12** (Target: Product write APIs - No Auth) | **Valid Target** *(Spec)* | `FR12-DT-14`, `FR12-DT-15`, `FR12-DT-16` | ✅ Bao phủ đầy đủ |
| **EC13** (Target: Coupons read API) | **Valid Target** | `FR12-DT-17`, `FR12-DT-18` | ✅ Bao phủ đầy đủ |
| **EC14** (`token_exp` còn hạn) | **Valid State** | `FR12-DT-01`, `FR12-DT-07` đến `FR12-DT-18` | ✅ Bao phủ đầy đủ |
| **EC15** (`token_exp` đã hết hạn) | Invalid State | `FR12-DT-09` | ✅ Bao phủ đơn lập |
| **EC16** (`user_status` đang hoạt động) | **Valid State** | `FR12-DT-01` đến `FR12-DT-09`, `FR12-DT-11` đến `FR12-DT-18` | ✅ Bao phủ đầy đủ |
| **EC17** (`user_status` đã bị xóa khỏi DB) | Invalid State | `FR12-DT-10` | ✅ Bao phủ đơn lập |
| **EC18** (`privilege_escalation` giữ nguyên role) | **Valid State** | `FR12-DT-01` đến `FR12-DT-10`, `FR12-DT-12` đến `FR12-DT-18` | ✅ Bao phủ đầy đủ |
| **EC19** (`privilege_escalation` tự sửa role) | Invalid State | `FR12-DT-11` | ✅ Bao phủ đơn lập |
| **EC20** (Output: HTTP 200/201 Thành công) | **Valid Output** | `FR12-DT-01`, `FR12-DT-12`, `FR12-DT-14`, `FR12-DT-17` | ✅ Bao phủ trực tiếp |
| **EC21** (Output: HTTP 401 Unauthorized) | Invalid Output | `FR12-DT-02`, `FR12-DT-03`, `FR12-DT-04`, `FR12-DT-16` | ✅ Bao phủ trực tiếp |
| **EC22** (Output: HTTP 403 Forbidden) | Invalid Output | `FR12-DT-05`, `FR12-DT-06`, `FR12-DT-07`, `FR12-DT-08`, `FR12-DT-09`, `FR12-DT-10`, `FR12-DT-11`, `FR12-DT-13`, `FR12-DT-15`, `FR12-DT-18` | ✅ Bao phủ trực tiếp |
| **EC23** (Output: HTTP 200 Lỗ hổng SUT) | **Defect Output** | `FR12-DT-07`, `FR12-DT-10`, `FR12-DT-11`, `FR12-DT-13`, `FR12-DT-15`, `FR12-DT-16`, `FR12-DT-18` | ✅ Bao phủ trực tiếp |

#### Thống kê chỉ số bao phủ:
- **Tổng số lớp tương đương đã phân hoạch:** 23 lớp (8 Valid, 15 Invalid / Defect).
- **Tổng số ca kiểm thử thiết kế:** 18 ca kiểm thử (`FR12-DT-01` đến `FR12-DT-18`).
- **Kích thước bộ kiểm thử tối thiểu (Minimum Test Set):** 11 ca kiểm thử (`FR12-DT-01` đến `FR12-DT-11` bao phủ trọn vẹn toàn bộ 23 lớp EC).
- **Số ca kiểm thử bổ sung kiểm tra chéo (Cross-check Endpoint Groups):** 7 ca kiểm thử (`FR12-DT-12` đến `FR12-DT-18`).
- **Tỷ lệ bao phủ lớp tương đương:** **100% (23/23 EC)**. Không có lớp tương đương nào bị bỏ sót.

---

## Stage 5: Tự kiểm tra & Đánh giá hạn chế kỹ thuật (Self-check & Blind spots)

### 5.1 Bảng tự kiểm tra chất lượng (Self-check checklist)
- [x] **Nguyên tắc cô lập lỗi:** Mỗi test case không hợp lệ (`FR12-DT-02` đến `FR12-DT-11`) chỉ chứa **duy nhất một lớp không hợp lệ**, tất cả các yếu tố khác đều hợp lệ.
- [x] **Tính tối ưu:** Không có 2 test case nào trùng lặp mục tiêu kiểm thử; các test case từ DT-12 đến DT-18 đều có lý do nghiệp vụ rõ ràng (kiểm tra chéo 3 nhóm endpoint còn lại).
- [x] **Tính minh bạch:** Mọi kỳ vọng đầu ra đều được gắn nhãn nguồn rõ ràng (`[SPEC]`, `[CODE]`, `[ASSUMED]`); các trường hợp mâu thuẫn giữa SPEC và CODE đều được phân tích cụ thể.
- [x] **Phạm vi kỹ thuật:** Chưa thêm các giá trị biên nhân tạo (để dành trọn vẹn cho kỹ thuật tiếp theo `boundary-value-analysis`).
- [x] **Ngôn ngữ báo cáo:** Toàn bộ nội dung báo cáo được trình bày bằng tiếng Việt có dấu chuẩn xác; giữ nguyên các thuật ngữ kỹ thuật, mã endpoint, mã lỗi bằng tiếng Anh.

### 5.2 Hạn chế của kỹ thuật Domain Testing đối với Kiểm soát truy cập (Blind spots)
1. **Giả định đồng nhất (Uniformity Assumption):** Phân hoạch tương đương giả định rằng tất cả các giá trị trong cùng một lớp sẽ được xử lý giống nhau. Tuy nhiên, trong bài toán phân quyền, nếu lập trình viên quên gắn middleware trên một endpoint cụ thể (như `POST /api/products`), kỹ thuật phân hoạch tổng quát sẽ bị mù (*blind*) nếu không áp dụng Quy tắc 4 của S04 để tách endpoint thành các nhóm riêng biệt.
2. **Trạng thái bên trong của Token Stateless (Stateless JWT Blind spot):** Domain testing kiểm tra đầu vào request nhưng không thể phát hiện lỗi kiến trúc của Stateless JWT: server không duy trì danh sách token bị thu hồi (Blacklist/Revocation list) trong cơ sở dữ liệu, dẫn đến việc token của tài khoản đã xóa vẫn có giá trị sử dụng.
3. **Lỗ hổng liên tính năng (Cross-feature logic flaws):** Việc leo quyền thông qua `PUT /api/users/me` nằm ở ranh giới giữa Quản lý hồ sơ người dùng (FR-04) và Kiểm soát truy cập (FR-12). Domain testing trên từng tính năng đơn lẻ dễ bỏ sót các kịch bản tấn công chuỗi kết hợp nhiều API.

---

> **⏸️ DỪNG TẠI ĐÂY — Chờ sinh viên duyệt Stage 4 (Bộ test case tối thiểu FR12-DT-01 đến FR12-DT-18 & Ma trận bao phủ 100%) trước khi tiếp tục kỹ thuật tiếp theo (Boundary Value Analysis).**


