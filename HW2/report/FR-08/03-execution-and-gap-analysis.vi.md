# FR-08 — Đặt hàng và Thanh toán (Checkout)
## Báo cáo thực thi kiểm thử và phân tích khoảng trống AI (Execution & Gap Analysis Report)

- **Tính năng:** FR-08 — Checkout (Thanh toán & Đặt hàng — Pool B)
- **Người thực hiện:** Trương Thành Phát (MSSV: 23120319)
- **Tài liệu tham khảo:**
  - `docs/api_specification.md` (mục 4.3 và 5.1) `[SPEC]`
  - Mã nguồn Backend: `eshop-sut/backend/server.js:297-309` `[CODE]`
  - Mã nguồn Cơ sở dữ liệu: `eshop-sut/backend/database.js:74-81` `[CODE]`
  - Mã nguồn Frontend Web: `eshop-sut/frontend-web/src/pages/Checkout.jsx` `[CODE]`
  - Mã nguồn Frontend Mobile: `eshop-sut/frontend-mobile/App.js` `[CODE]`
  - Minh chứng log thực thi: `HW2/evidence/FR-08/test-execution.log` `[OBSERVED]`
- **Phiên bản áp dụng:** Test Execution & Bugs v2.1 (áp dụng **Zero-Trust SUT Principle** và **Cross-Platform Skew Checklist**).
- **Trạng thái:** **DỪNG LẠI TẠI CHECKPOINT STAGE 3 CHỜ DUYỆT (STOP FOR REVIEW)**.

---

## 1. Phạm vi và đặc tả

- **Endpoint kiểm thử chính**: `POST /api/checkout`
  - Yêu cầu xác thực: Token JWT trong header `Authorization: Bearer <token>`.
  - Body mẫu theo đặc tả `api_specification.md:131`:
    ```json
    {
      "total_amount": 200000,
      "shipping_address": "123 Le Loi, TP.HCM"
    }
    ```
- **Môi trường thực thi**:
  - SUT Backend chạy tại `http://localhost:3000` (Node.js/Express, SQLite3).
  - Tài khoản kiểm thử: `test@eshop.com` / `Password123!` (role: `user`).
- **Thực tế mã nguồn SUT (Zero-Trust SUT Assessment)**:
  - Backend `server.js:297-309` thực thi câu lệnh SQL INSERT trực tiếp mà **hoàn toàn không có bất kỳ dòng lệnh validation nào**:
    ```javascript
    const { total_amount, shipping_address } = req.body;
    db.run(
      "INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES (?, ?, ?, ?)",
      [userId, total_amount, "pending", shipping_address],
      ...
    );
    ```
  - Backend tin tưởng 100% số tiền client gửi lên, không tính lại từ giỏ hàng, không kiểm tra giỏ hàng rỗng, không trừ tồn kho, và không lưu danh sách sản phẩm (`order_items`).
  - Web UI (`Checkout.jsx:93-102`) cho phép user tự do gõ sửa số tiền thanh toán (`editableTotal`).
  - Mobile UI (`App.js:391`) cố tình cắt bỏ sản phẩm cuối cùng trong giỏ hàng nếu `cart.length > 1`.
  - Cả Web và Mobile đều không có ô nhập địa chỉ giao hàng (`shipping_address`) và không gửi field này lên API.

---

## 2. Tóm tắt thiết kế kiểm thử (Domain Testing & BVA)

- **Domain Testing (Stage 0 - 5)**: Thiết kế 31 lớp tương đương (`EC01` – `EC31`), sinh **22 ca kiểm thử miền tối thiểu (`FR08-DT-01` đến `FR08-DT-22`)**, bao phủ 100% ma trận phân hoạch.
- **Boundary Value Analysis (Stage 1 - 4)**: Xác định 3 miền có thứ tự (`total_amount`, `shipping_address.length`, `cart_items_count`), áp dụng biến thể 3-value BVA, mô hình 9 điểm và quy tắc biên mã hóa Unicode tiếng Việt UTF-8 (v2.0 Rule), sinh **20 ca kiểm thử giá trị biên (`FR08-BVA-01` đến `FR08-BVA-20`)**.
- **Tổng số ca kiểm thử trong suite**: **42 test cases** được lưu trữ đồng bộ tại [`HW2/testcases/FR-08.json`](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/testcases/FR-08.json).

---

## 3. Kết quả thực thi chi tiết (Execution Results)

Toàn bộ 42 test cases đã được thực thi tự động qua test runner `run_cases.mjs` kết nối trực tiếp với backend SUT đang chạy tại `http://localhost:3000`:

- **Tổng số ca thiết kế (Designed)**: **42**
- **Đã thực thi (Executed)**: **42 (100%)**
- **Thành công (PASS)**: **16 (38.1%)**
- **Thất bại (FAIL)**: **26 (61.9%)**
- **Bị chặn (BLOCKED)**: **0 (0%)**

### Bảng kết quả thực thi 42 test cases cho FR-08

| Mã TC | Kỹ thuật | Mô tả ca kiểm thử | Kỳ vọng (Expected) | Thực tế (Actual) | Trạng thái |
| :--- | :---: | :--- | :---: | :---: | :---: |
| `FR08-DT-01` | DT | Checkout hợp lệ chuẩn không dùng coupon | HTTP 200, orderId | HTTP 200, orderId: 1 | **PASS** |
| `FR08-DT-02` | DT | Checkout hợp lệ có mã giảm giá (-10%) | HTTP 200, orderId | HTTP 200, orderId: 2 | **PASS** |
| `FR08-DT-03` | DT | Từ chối khi thiếu header Authorization | HTTP 401 Unauthorized | HTTP 401 Unauthorized | **PASS** |
| `FR08-DT-04` | DT | Từ chối khi token sai chữ ký / tampered | HTTP 403 Forbidden | HTTP 403 Forbidden | **PASS** |
| `FR08-DT-05` | DT | Từ chối khi token rỗng (`Bearer `) | HTTP 401 Unauthorized | HTTP 401 Unauthorized | **PASS** |
| `FR08-DT-06` | DT | Từ chối khi `total_amount = 0` (mua 0 đồng) | HTTP 400 Bad Request | HTTP 200, orderId: 3 | **FAIL** |
| `FR08-DT-07` | DT | Từ chối khi `total_amount < 0` (số âm `-50,000`) | HTTP 400 Bad Request | HTTP 200, orderId: 4 | **FAIL** |
| `FR08-DT-08` | DT | Từ chối khi `total_amount` bị sửa sai giá giỏ hàng (Web skew) | HTTP 400 Bad Request | HTTP 200, orderId: 5 | **FAIL** |
| `FR08-DT-09` | DT | Từ chối khi `total_amount` là chuỗi (`"free"`) | HTTP 400 Bad Request | HTTP 200, orderId: 6 | **FAIL** |
| `FR08-DT-10` | DT | Từ chối khi `total_amount` là boolean (`true`) | HTTP 400 Bad Request | HTTP 200, orderId: 7 | **FAIL** |
| `FR08-DT-11` | DT | Từ chối khi `total_amount` là số thực (`199999.5`) | HTTP 400 Bad Request | HTTP 200, orderId: 8 | **FAIL** |
| `FR08-DT-12` | DT | Từ chối khi thiếu trường `total_amount` trong body | HTTP 400 Bad Request | HTTP 200, orderId: 9 | **FAIL** |
| `FR08-DT-13` | DT | Từ chối khi `total_amount` là `null` | HTTP 400 Bad Request | HTTP 200, orderId: 10 | **FAIL** |
| `FR08-DT-14` | DT | Từ chối khi `shipping_address` là chuỗi rỗng `""` | HTTP 400 Bad Request | HTTP 200, orderId: 11 | **FAIL** |
| `FR08-DT-15` | DT | Từ chối khi `shipping_address` chỉ chứa khoảng trắng `"   "` | HTTP 400 Bad Request | HTTP 200, orderId: 12 | **FAIL** |
| `FR08-DT-16` | DT | Từ chối khi thiếu `shipping_address` (Web & Mobile skew) | HTTP 400 Bad Request | HTTP 200, orderId: 13 | **FAIL** |
| `FR08-DT-17` | DT | Từ chối khi `shipping_address` sai kiểu (Number `12345`) | HTTP 400 Bad Request | HTTP 200, orderId: 14 | **FAIL** |
| `FR08-DT-18` | DT | Từ chối khi `shipping_address` payload lớn > 1,000 ký tự | HTTP 400 Bad Request | HTTP 200, orderId: 15 | **FAIL** |
| `FR08-DT-19` | DT | Từ chối khi giỏ hàng rỗng (`cart = []`) | HTTP 400 Bad Request | HTTP 200, orderId: 16 | **FAIL** |
| `FR08-DT-20` | DT | Từ chối khi đặt hàng vượt tồn kho (Overselling) | HTTP 400 Bad Request | HTTP 200, orderId: 17 | **FAIL** |
| `FR08-DT-21` | DT | Từ chối khi áp dụng mã coupon không tồn tại/hết hạn | HTTP 400 Bad Request | HTTP 200, orderId: 18 | **FAIL** |
| `FR08-DT-22` | DT | Kiểm tra dị biệt Mobile tự cắt sản phẩm (`cart.slice(0, -1)`) | HTTP 400 Bad Request | HTTP 200, orderId: 19 | **FAIL** |
| `FR08-BVA-01` | BVA | `total_amount = -50000` ($-\alpha$ Extreme số âm) | HTTP 400 Bad Request | HTTP 200, orderId: 20 | **FAIL** |
| `FR08-BVA-02` | BVA | `total_amount = 0` ($LB - 1$ cận dưới) | HTTP 400 Bad Request | HTTP 200, orderId: 21 | **FAIL** |
| `FR08-BVA-03` | BVA | `total_amount = 1` VNĐ ($LB$ tối thiểu) | HTTP 200 OK | HTTP 200, orderId: 22 | **PASS** |
| `FR08-BVA-04` | BVA | `total_amount = 2` VNĐ ($LB + 1$ nội biên) | HTTP 200 OK | HTTP 200, orderId: 23 | **PASS** |
| `FR08-BVA-05` | BVA | `total_amount = 2,147,483,646` VNĐ ($UB - 1$) | HTTP 200 OK | HTTP 200, orderId: 24 | **PASS** |
| `FR08-BVA-06` | BVA | `total_amount = 2,147,483,647` VNĐ ($UB$ int32 max) | HTTP 200 OK | HTTP 200, orderId: 25 | **PASS** |
| `FR08-BVA-07` | BVA | `total_amount = 2,147,483,648` VNĐ ($UB + 1$ tràn int32) | HTTP 400 Bad Request | HTTP 200, orderId: 26 | **FAIL** |
| `FR08-BVA-08` | BVA | `total_amount = 9,007,199,254,740,991` ($+\alpha$ `MAX_SAFE_INT`) | HTTP 400 Bad Request | HTTP 200, orderId: 27 | **FAIL** |
| `FR08-BVA-09` | BVA | `shipping_address` length = 0 (chuỗi rỗng $-\alpha$) | HTTP 400 Bad Request | HTTP 200, orderId: 28 | **FAIL** |
| `FR08-BVA-10` | BVA | `shipping_address` length = 4 ($LB - 1$ thiếu 1 ký tự) | HTTP 400 Bad Request | HTTP 200, orderId: 29 | **FAIL** |
| `FR08-BVA-11` | BVA | `shipping_address` length = 5 ($LB$ tối thiểu hợp lệ) | HTTP 200 OK | HTTP 200, orderId: 30 | **PASS** |
| `FR08-BVA-12` | BVA | `shipping_address` length = 6 ($LB + 1$ nội biên) | HTTP 200 OK | HTTP 200, orderId: 31 | **PASS** |
| `FR08-BVA-13` | BVA | `shipping_address` length = 254 ($UB - 1$ nội biên) | HTTP 200 OK | HTTP 200, orderId: 32 | **PASS** |
| `FR08-BVA-14` | BVA | `shipping_address` length = 255 ASCII ($UB$ cận trên) | HTTP 200 OK | HTTP 200, orderId: 33 | **PASS** |
| `FR08-BVA-15` | BVA | `shipping_address` length = 255 UTF-8 tiếng Việt có dấu (v2.0) | HTTP 200 OK | HTTP 200, orderId: 34 | **PASS** |
| `FR08-BVA-16` | BVA | `shipping_address` length = 256 ($UB + 1$ vượt chuẩn 255) | HTTP 400 Bad Request | HTTP 200, orderId: 35 | **FAIL** |
| `FR08-BVA-17` | BVA | `shipping_address` length = 10,000 ($+\alpha$ Payload DoS) | HTTP 400 / 413 | HTTP 200, orderId: 36 | **FAIL** |
| `FR08-BVA-18` | BVA | `cart_items_count = 0` ($LB - 1$ giỏ rỗng) | HTTP 400 Bad Request | HTTP 200, orderId: 37 | **FAIL** |
| `FR08-BVA-19` | BVA | `cart_items_count = 1` ($LB$ giỏ 1 món - Mobile không cắt) | HTTP 200 OK | HTTP 200, orderId: 38 | **PASS** |
| `FR08-BVA-20` | BVA | `cart_items_count = 2` ($LB + 1$ Mobile kích hoạt cắt món) | HTTP 200 OK | HTTP 200, orderId: 39 | **PASS** |

*Minh chứng log thực thi đầy đủ đã được ghi nhận tại:* [`HW2/evidence/FR-08/test-execution.log`](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-08/test-execution.log).

---

## 4. Phân loại lỗi phần mềm (Defect Triage — Stage 3)

Qua đối chiếu kết quả thực thi và phân tích nguyên nhân gốc trong mã nguồn SUT, toàn bộ **26 ca kiểm thử thất bại** được quy về **7 lỗi phần mềm cốt lõi (Defect Root Causes)**:

### Bảng phân loại lỗi (Triage Summary Table)

| Mã lỗi | Tiêu đề lỗi (Defect Title) | Các ca kiểm thử bộc lộ | Mức độ nghiêm trọng | Nguyên nhân gốc trong mã nguồn |
| :--- | :--- | :--- | :---: | :--- |
| **BUG-FR08-01** | Backend hoàn toàn thiếu validation cho trường `total_amount` (chấp nhận tiền âm, 0đ, chuỗi, boolean, float, null, tràn số int32) | `FR08-DT-06` – `13`, `FR08-BVA-01`, `02`, `07`, `08` (11 TCs) | **Critical** | `server.js:299-303`: Backend giải nén trực tiếp `req.body.total_amount` và insert thẳng vào SQLite không kiểm tra giá trị dương hay kiểu dữ liệu. |
| **BUG-FR08-02** | Lỗ hổng Parameter Tampering: Backend không tính lại tổng tiền từ giỏ hàng; Frontend Web cung cấp ô input tự sửa tiền | `FR08-DT-08` (1 TC) | **Critical** | `server.js:299` không tính lại tổng tiền từ `userCarts[userId]` hay bảng `products`; `Checkout.jsx:93-102` cung cấp input editable cho phép user tự gõ giá thanh toán. |
| **BUG-FR08-03** | Backend hoàn toàn thiếu validation cho `shipping_address`; Frontend Web và Mobile không có ô nhập địa chỉ giao hàng | `FR08-DT-14` – `18`, `FR08-BVA-09`, `10`, `16`, `17` (9 TCs) | **Major** | `server.js:299` không kiểm tra địa chỉ, chấp nhận chuỗi rỗng và null; Web & Mobile UI hoàn toàn không có form địa chỉ và không gửi field này lên API. |
| **BUG-FR08-04** | Backend không kiểm tra trạng thái giỏ hàng khi checkout (Cho phép đặt đơn hàng ma khi giỏ hàng rỗng) | `FR08-DT-19`, `FR08-BVA-18` (2 TCs) | **Major** | `server.js:297-309` không kiểm tra `userCarts[userId]`, cho phép người dùng checkout đơn hàng khi giỏ hoàn toàn rỗng và không xóa giỏ sau khi đặt. |
| **BUG-FR08-05** | Dị biệt logic nghiêm trọng trên Mobile: Frontend Mobile tự ý cắt xén sản phẩm cuối cùng trong giỏ hàng khi checkout | `FR08-DT-22`, `FR08-BVA-20` (2 TCs) | **Critical** | `App.js:391`: Frontend Mobile cố tình thực hiện `items: cart.length > 1 ? cart.slice(0, -1) : cart` làm người dùng bị mất sản phẩm khi đặt hàng. |
| **BUG-FR08-06** | Backend không kiểm tra tồn kho (Overselling Defect) và không lưu chi tiết các mặt hàng trong đơn hàng (`order_items`) | `FR08-DT-20` (1 TC) | **Major** | `server.js:301-308`: Không kiểm tra và giảm trừ cột `stock` trong bảng `products`; cơ sở dữ liệu hoàn toàn không có bảng `order_items`. |
| **BUG-FR08-07** | Endpoint checkout không kiểm tra tính hợp lệ của mã giảm giá `coupon_id` | `FR08-DT-21` (1 TC) | **Minor** | `server.js:297-309`: Không kiểm tra lại mã coupon đã hết hạn hay không tồn tại mà ghi nhận thanh toán trực tiếp. |

---

## 5. Phân tích khoảng trống của AI (AI Gap Analysis — Stage 5)

Bảng đối chiếu so sánh toàn diện giữa bộ kiểm thử AI ban đầu thiết kế và các khiếm khuyết thực tế sâu sắc được phát hiện qua quá trình khảo sát mã nguồn SUT và thực thi kiểm thử:

| STT | Mục bị bỏ sót / Thách thức thực tế | Cách phát hiện | Vì sao AI dễ bỏ sót ban đầu | Phân loại nguyên nhân (Assignment Category) | Cải tiến kỹ năng (Skill Fix) |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 1 | **Thiên kiến tin tưởng tham số tài chính client (Client-trusted Financial Parameter Bias)** | Khi kiểm tra `server.js:299`, thấy backend lấy thẳng `total_amount` từ body và insert DB, không tính lại từ giỏ hàng | AI theo quán tính coi các tham số trong Request Body là độc lập, không tự động kích hoạt nguyên tắc "Toàn vẹn giao dịch tài chính": số tiền phải luôn được tính lại ở phía server dựa trên giỏ hàng và bảng giá niêm yết | **Inherent feature complexity** & **Tool limitation** | Bổ sung **Financial Transaction Integrity Rule** (v2.2): Mọi tham số tiền bạc, giá cả gửi từ Client đều phải coi là không đáng tin cậy (Untrusted Input); server bắt buộc phải tính toán độc lập. |
| 2 | **Lỗ hổng giao diện cho phép sửa dữ liệu chỉ đọc (Frontend UI Input Defect)** | Đọc mã nguồn `Checkout.jsx:93-102` phát hiện ô input `type="number"` có gán `onChange` vào `setEditableTotal` | AI khi chỉ tập trung kiểm thử API sẽ có "điểm mù" về giao diện người dùng: không biết Web UI đang mở cho phép user tự ý sửa giá trị số tiền thay vì khóa `readOnly` | **Tool limitation** | Mở rộng quy tắc **Cross-Platform Inspection**: Khi kiểm thử tính năng liên quan đến dữ liệu nhạy cảm, phải kiểm tra các thuộc tính form (`readOnly`, `disabled`, `type`) trên cả Web và Mobile. |
| 3 | **Thiếu thực thể cốt lõi trong DB (`order_items`) & Bán vượt tồn kho (Overselling)** | Khảo sát `database.js:74-81` và `server.js:301` thấy bảng `orders` không có khóa ngoại nối với sản phẩm và không có lệnh trừ `stock` | Tài liệu đặc tả `api_specification.md` chỉ mô tả endpoint `checkout` với input cơ bản, không mô tả lược đồ CSDL; AI nếu chỉ bám theo spec sẽ bỏ qua việc xác minh dữ liệu chi tiết đơn hàng và tồn kho | **Prompt/input quality** & **Inherent feature complexity** | Bổ sung **Database Schema & Inventory Lifecycle Checklist**: Luôn đối chiếu cấu trúc bảng DB để xác nhận đơn hàng có lưu chi tiết món hàng (`order_items`) và có trừ tồn kho tương tranh hay không. |
| 4 | **Dị biệt mã nguồn cố ý làm sai lệch dữ liệu (`cart.slice(0, -1)`)** | Đọc mã nguồn `App.js:391` trên Mobile phát hiện lệnh cắt bỏ sản phẩm cuối cùng của giỏ hàng | Lỗi này không phải do lập trình viên vô tình viết nhầm điều kiện biên, mà là một dòng code cố tình can thiệp làm biến dạng giỏ hàng; AI thông thường chỉ tìm lỗi vô tình (off-by-one, thiếu check null) | **Inherent feature complexity** | Tích hợp **Client-Side Data Mutation Inspection**: Rà soát các thao tác biến đổi mảng/object (`slice`, `pop`, `filter`) trên client trước khi payload được đóng gói gửi qua mạng. |

---

## 6. Danh mục bản thảo GitHub Issues (Stage 4)

Toàn bộ 7 lỗi phần mềm của FR-08 đã được soạn thảo thành các bản thảo GitHub Issues chi tiết theo chuẩn mẫu báo cáo lỗi:

1. **[BUG-FR08-01.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR08-01.md)**: Backend hoàn toàn thiếu validation cho trường `total_amount` khi checkout *(Severity: Critical)*.
2. **[BUG-FR08-02.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR08-02.md)**: Lỗ hổng Parameter Tampering: Backend không tính lại tổng tiền từ giỏ hàng, Web cho phép user tự sửa giá *(Severity: Critical)*.
3. **[BUG-FR08-03.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR08-03.md)**: Backend thiếu validation `shipping_address`; Web và Mobile không có ô nhập địa chỉ *(Severity: Major)*.
4. **[BUG-FR08-04.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR08-04.md)**: Cho phép đặt hàng khi giỏ hàng rỗng và không xóa giỏ hàng sau khi checkout *(Severity: Major)*.
5. **[BUG-FR08-05.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR08-05.md)**: Frontend Mobile tự ý cắt xén sản phẩm cuối cùng trong giỏ hàng khi checkout (`cart.slice(0, -1)`) *(Severity: Critical)*.
6. **[BUG-FR08-06.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR08-06.md)**: Không kiểm tra số lượng tồn kho (Overselling) và DB không lưu chi tiết các mặt hàng (`order_items`) *(Severity: Major)*.
7. **[BUG-FR08-07.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/issues/BUG-FR08-07.md)**: Endpoint checkout không xác thực tính hợp lệ của mã giảm giá `coupon_id` *(Severity: Minor)*.

*Tài liệu tổng hợp lỗi toàn hệ thống đã được đồng bộ tại:* [HW2/report/bugs.vi.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/report/bugs.vi.md).

---

### DỪNG LẠI TẠI CHECKPOINT STAGE 5 CHỜ DUYỆT (STOP FOR REVIEW)

Theo quy định kiểm soát chất lượng của môn học:
- **Stage 1 (Môi trường)**, **Stage 2 (Thực thi 42 test cases)**, **Stage 3 (Triage)**, **Stage 4 (Báo cáo lỗi & GitHub Issues)** và **Stage 5 (AI Gap Analysis & Nâng cấp kỹ năng v2.2)** đã hoàn tất trọn vẹn.
- Toàn bộ 42 ca kiểm thử đã thực thi (16 PASS, 26 FAIL), 7 lỗi phần mềm nghiêm trọng đã được lập hồ sơ chi tiết.
- Trình sinh viên thẩm định trước khi chuyển sang **Stage 6 (Cập nhật số liệu tổng hợp vào README.md và Main Report)**.
