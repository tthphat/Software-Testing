# Domain Testing — FR-12: Kiểm soát truy cập (Access Control)

> **Tính năng:** FR-12 — Kiểm soát truy cập  
> **Kỹ thuật:** Phân hoạch tương đương (Domain Testing / Equivalence Partitioning)  
> **Phiên bản:** Stage 0 + Stage 1 + Stage 2 — Chờ duyệt Stage 2

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

> **⏸️ DỪNG TẠI ĐÂY — Chờ sinh viên duyệt Stage 2 (Bảng phân hoạch tương đương EC01 - EC23 và 4 câu hỏi mở) trước khi tiếp tục Stage 3 (Chọn giá trị đại diện) và Stage 4 (Thiết kế bộ Test Case tối thiểu).**

