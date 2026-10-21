# HW02 - Domain Testing & Boundary Value Analysis on EShop SUT

Báo cáo kiểm thử phần mềm tự động hóa kết hợp trí tuệ nhân tạo (AI-augmented Software Testing) áp dụng phương pháp **Kiểm thử miền (Domain Testing)** và **Phân tích giá trị biên (Boundary Value Analysis - BVA)** trên hệ thống thương mại điện tử **EShop SUT**.

---

## Thông tin sinh viên & Môn học

| Mục | Giá trị |
| :--- | :--- |
| **Họ và tên sinh viên** | **TRƯƠNG THÀNH PHÁT** |
| **Mã số sinh viên (MSSV)** | **23120319** |
| **Lớp sinh hoạt** | Kiểm thử phần mềm - CQ2023/3 |
| **Môn học** | CS423 / CSC13003 - Kiểm chứng Phần mềm |
| **Học kỳ** | Học kỳ 1, Năm học 2026-2027 |
| **Giảng viên hướng dẫn** | ThS. Trần Duy Hoàng, ThS. Trương Phước Lộc, TS. Hồ Tuấn Thanh, PGS.TS. Lâm Quang Vũ |
| **Hệ thống kiểm thử (SUT)** | EShop (Web, Mobile, Backend REST API) — [GitHub Repository](https://github.com/ttbhanh/eshop-sut) |
| **Ngày hoàn thành** | 20/10/2026 |

---

## 1. Bảng tự đánh giá

| No. | Criteria | Grade | Self-Assessed Grade | Feature Mapping & Evidence / Rationale |
| :---: | :--- | :---: | :---: | :--- |
| **1** | **Feature A (Domain + Boundary)** | 25 | **25** | **FR-01 (Account Registration) [Pool A]**:<br>• *Domain Testing:* 4 bước chuẩn S04, Bảng biến có miền giá trị (v1.1 Domain value), 23 lớp EC, 16 TCs DT tối thiểu, 100% bao phủ ma trận.<br>• *BVA:* 2 miền có thứ tự (`name.length`, `password.length`), biến thể 3-value BVA ($LB-1, LB, LB+1, UB-1, UB, UB+1$), biên mã hóa UTF-8 tiếng Việt, 14 TCs BVA.<br>• *Execution & Bugs:* 30/30 TCs thực thi trên SUT, 10 PASS / 20 FAIL, phát hiện 5 bugs (`BUG-FR01-01` đến `05`), 5 GitHub Issues drafts, AI Gap Analysis v2.0. |
| **2** | **Feature B (Domain + Boundary)** | 25 | **25** | **FR-03 (Forgot & Reset Password) [Pool A]**:<br>• *Domain Testing:* Khảo sát quy trình 2 bước stateful (`forgot-password` và `reset-password`), 31 lớp EC, 22 TCs DT tối thiểu, 100% bao phủ ma trận.<br>• *BVA:* 2 miền có thứ tự (`newPassword.length`, `resetToken`), 3-value BVA, biên UTF-8 UB 128, 15 TCs BVA.<br>• *Execution & Bugs:* 37/37 TCs thực thi với Dynamic Setup Hook, 21 PASS / 16 FAIL, phát hiện 4 bugs (`BUG-FR03-01` đến `04`: lộ OTP CWE-200, thiếu hạn token), 4 GitHub Issues drafts, AI Gap Analysis v2.1. |
| **3** | **Feature C (Domain + Boundary)** | 25 | **25** | **FR-08 (Checkout) [Pool B] & FR-12 (Access Control) [Pool C]**:<br>• *FR-08 Checkout (Pool B):* Khảo sát chéo Web/Mobile/Backend, 31 ECs, 22 TCs DT, 20 TCs BVA (3 miền thứ tự: `total_amount`, `shipping_address`, `cart_items`), 42/42 TCs thực thi, phát hiện 7 bugs (`BUG-FR08-01` đến `07`: Parameter Tampering sửa giá Web `editableTotal`, rỗng giỏ hàng, thiếu `order_items`), 7 GitHub Issues drafts, AI Gap Analysis v2.2.<br>• *FR-12 Access Control (Pool C):* Khảo sát 14 endpoints, 23 ECs phân quyền RBAC, 18 TCs DT, 14 TCs BVA (biến `token.exp`, `param.id`, `product.price`), 32/32 TCs thực thi, phát hiện 3 bugs (`BUG-FR12-01` đến `03`: middleware không kiểm tra role admin, bỏ quên auth route products, leo quyền Mass Assignment `PUT /api/users/me`), 3 GitHub Issues drafts, AI Gap Analysis v2.3. |
| **4** | **Feature D (Mobile, Domain + Boundary)** | 15 | **15** | **FR-20 (Mobile Login & Logout) [Pool D — Mobile App]**:<br>• *Domain Testing:* Khảo sát mã nguồn Mobile `App.js` & Backend `server.js`, 24 lớp EC bao quát đăng nhập, đăng xuất, trạng thái khóa tài khoản và dị biệt client/server, 20 TCs DT tối thiểu, ma trận bao phủ 100%.<br>• *BVA:* 4 miền thứ tự (`password.length`, `email.length`, `login_attempts`, `locked_until`), 3-value BVA, biên UTF-8, 14 TCs BVA.<br>• *Execution & Bugs:* 34/34 TCs thực thi trực tiếp trên Expo Mobile Web và live backend, 31 PASS / 3 FAIL, ghi nhận bằng chứng ảnh chụp màn hình UI Mobile thực tế , phát hiện 4 bugs (`BUG-FR20-01` đến `04`: rò rỉ giỏ hàng sau logout, lộ mật khẩu plaintext trong response login, lỗi bước nhảy khóa tài khoản +2, lỗi nhãn và nút giao diện UI), 4 GitHub Issues drafts. |
| **5** | **Agent Skills** | 10 | **10** | **Bộ Agent Skills chuyên biệt & Kiểm định AI**:<br>• *4 Skills chuẩn hóa:* `domain-testing`, `boundary-value-analysis`, `test-execution-and-bugs`, `ai-audit-log`.<br>• *Tiến hóa kỹ năng:* Tài liệu skills-changelog.md ghi nhận tiến hóa từ v1.0 qua v1.1, v2.0, v2.1, v2.2 đến v2.3 dựa trên phản hồi Human-in-the-loop và AI Gap Analysis.<br>• *Phụ lục A:* appendix-A-ai-audit.vi.md ghi nhận 32 artifacts kiểm định nguyên văn, đạt 96.9% VALID.<br>• *Phụ lục B:* appendix-B-ai-critique.vi.md phê phán AI 276 từ, trả lời trọn vẹn 3 câu hỏi với dẫn chứng thực tế. |
| | **Total** | **100** | **100 / 100** | **Hoàn thành đầy đủ mọi tiêu chí đánh giá của đề bài** |

---

## 2. Báo cáo tổng kết kiểm thử (Test Summary Report)

### 2.1 Tổng quan số liệu toàn dự án

| Chỉ số | Số lượng | Tỉ lệ (%) | Ghi chú kỹ thuật |
| :--- | :---: | :---: | :--- |
| **Tổng số tính năng kiểm thử** | **5** | 100% | Bao gồm 4 tính năng Core (FR-01, FR-03, FR-08, FR-12) + 1 tính năng Mobile Pool D (FR-20) |
| **Tổng ca kiểm thử đã thiết kế (Designed)** | **175** | 100% | 102 ca Domain Testing (DT) + 73 ca Boundary Value Analysis (BVA) |
| **Tổng ca kiểm thử đã thực thi (Executed)** | **175** | **100%** | Toàn bộ 175 ca đều được chạy đối chiếu thực tế với SUT |
| **Số ca kiểm thử VƯỢT QUA (PASS)** | **99** | 56.6% | Hoạt động đúng kỳ vọng kiểm thử |
| **Số ca kiểm thử THẤT BẠI (FAIL)** | **76** | 43.4% | Bộc lộ khiếm khuyết mã nguồn hoặc thiếu hụt validation SUT |
| **Số ca kiểm thử BỊ CHẶN (BLOCKED)** | **0** | 0.0% | Không có ca nào bị chặn nhờ cơ chế Dynamic Setup Hook |
| **Số ca kiểm thử CHƯA THỰC THI** | **0** | 0.0% | Đã thực thi 100% |
| **Tổng số khiếm khuyết phần mềm (Bugs)** | **23** | — | Đã lập báo cáo chi tiết và GitHub Issues |

### 2.2 Chi tiết số liệu theo từng tính năng

| Mã tính năng | Tên tính năng | Nhóm (Pool) | Đã thiết kế | Đã thực thi | PASS | FAIL | BLOCKED | Số lỗi (Bugs) |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **FR-01** | Đăng ký tài khoản (Account Registration) | Pool A | 30 | 30 | 10 | 20 | 0 | 5 |
| **FR-03** | Quên & Đặt lại mật khẩu (Forgot/Reset Password) | Pool A | 37 | 37 | 21 | 16 | 0 | 4 |
| **FR-08** | Thanh toán & Đặt hàng (Checkout) | Pool B | 42 | 42 | 16 | 26 | 0 | 7 |
| **FR-12** | Kiểm soát truy cập (Access Control) | Pool C | 32 | 32 | 21 | 11 | 0 | 3 |
| **FR-20** | Đăng nhập & Đăng xuất Mobile (Mobile Login/Logout) | Pool D | 34 | 34 | 31 | 3 | 0 | 4 |
| **TỔNG** | *(Toàn bộ 5 tính năng)* | **Pool A-D** | **175** | **175** | **99** | **76** | **0** | **23** |

---

## 3. Liên kết Video Demo

- **Link Video Demo tổng quan đồ án (YouTube):**  
  **[https://youtu.be/UwG5ZdukUiw?si=QXTQf37vh-NhQhOI](https://youtu.be/UwG5ZdukUiw?si=QXTQf37vh-NhQhOI)**

| STT | Phân đoạn nội dung trong Video Demo | Nội dung trình bày |
| :---: | :--- | :--- |
| **1** | **Tổng quan Repository & Bộ Agent Skills** | Giới thiệu cấu trúc đồ án, quy trình 4 bước kiểm thử miền, nâng cấp kỹ năng v1 → v2. |
| **2** | **Thực thi Domain Testing & BVA** | Minh họa thiết kế phân hoạch tương đương, chọn giá trị đại diện và các ca kiểm thử biên 3-value. |
| **3** | **Chạy Test Runner tự động trên SUT** | Thực thi runner tự động hóa `run_cases.mjs` |
| **4** | **Phát hiện Bug & GitHub Issues** | Chạy skill sinh bug report và tạo mẫu github issue |

---

## 4. Danh sách tính năng và Trạng thái hoàn thành

- [x] **FR-01 — Đăng ký tài khoản (Account Registration)**: Hoàn thành Domain Testing, BVA, Test Execution (30 TCs), 5 Bug Reports.
- [x] **FR-03 — Quên & Đặt lại mật khẩu (Forgot/Reset Password)**: Hoàn thành quy trình 2 bước stateful, BVA, Test Execution (37 TCs), 4 Bug Reports.
- [x] **FR-08 — Thanh toán & Đặt hàng (Checkout)**: Hoàn thành Domain Testing, BVA, Test Execution (42 TCs), phát hiện Parameter Tampering, 7 Bug Reports.
- [x] **FR-12 — Kiểm soát truy cập (Access Control)**: Hoàn thành phân hoạch RBAC, BVA, Test Execution (32 TCs), phát hiện Mass Assignment leo quyền, 3 Bug Reports.
- [x] **FR-20 — Đăng nhập & Đăng xuất Mobile (Mobile Login/Logout)**: Hoàn thành kiểm thử Mobile UI, Test Execution (34 TCs), phát hiện rò rỉ session giỏ hàng, 4 Bug Reports.

---

## 5. Danh mục tài liệu nộp bài (Deliverables & Appendices)

- [x] **Báo cáo chính:** report/23120319_HW02_Main_Report.md
- [x] **Phụ lục A (AI Audit Report):** report/appendix-A-ai-audit.vi.md
- [x] **Phụ lục B (AI Critique):** report/appendix-B-ai-critique.vi.md
- [x] **Nhật ký Git Commit:** git-commit-log.txt
- [x] **Bộ dữ liệu kiểm thử máy đọc:** testcases/
- [x] **Minh chứng thực thi & Báo cáo giao diện:** evidence/
- [x] **Bảng tiến hóa kỹ năng AI:** skills-changelog.md
- [x] **skills/**: chứa các kỹ năng AI được sử dụng trong đồ án
---

## 6. Danh sách Github issues

Toàn bộ **23 khiếm khuyết phần mềm** phát hiện được trong quá trình kiểm thử đã được tạo và ghi nhận đầy đủ trên kho lưu trữ nhóm [tthphat/eshop-sut/issues](https://github.com/tthphat/eshop-sut/issues):

| Issue | Mã lỗi | Tính năng | Tiêu đề lỗi (GitHub Issue Title) | Mức độ | Trạng thái |
| :---: | :---: | :---: | :--- | :---: | :---: |
| [#1](https://github.com/tthphat/eshop-sut/issues/1) | **BUG-FR01-01** | `FR-01` | [Backend thiếu kiểm tra các trường bắt buộc khi đăng ký tài khoản](https://github.com/tthphat/eshop-sut/issues/1) | **Major** | `Open` |
| [#2](https://github.com/tthphat/eshop-sut/issues/2) | **BUG-FR01-02** | `FR-01` | [Backend không kiểm tra định dạng email và kiểu dữ liệu đầu vào](https://github.com/tthphat/eshop-sut/issues/2) | **Major** | `Open` |
| [#3](https://github.com/tthphat/eshop-sut/issues/3) | **BUG-FR01-03** | `FR-01` | [Cho phép đăng ký trùng lặp email do thiếu ràng buộc UNIQUE và không kiểm tra tồn tại](https://github.com/tthphat/eshop-sut/issues/3) | **Critical** | `Open` |
| [#4](https://github.com/tthphat/eshop-sut/issues/4) | **BUG-FR01-04** | `FR-01` | [Backend hoàn toàn không kiểm tra độ dài và độ phức tạp mật khẩu](https://github.com/tthphat/eshop-sut/issues/4) | **Major** | `Open` |
| [#5](https://github.com/tthphat/eshop-sut/issues/5) | **BUG-FR01-05** | `FR-01` | [Thiếu giới hạn độ dài tối đa cho trường họ tên và mật khẩu](https://github.com/tthphat/eshop-sut/issues/5) | **Minor** | `Open` |
| [#6](https://github.com/tthphat/eshop-sut/issues/6) | **BUG-FR03-01** | `FR-03` | [Lộ mã xác nhận resetToken (OTP) trong HTTP Response Body](https://github.com/tthphat/eshop-sut/issues/6) | **Critical** | `Open` |
| [#7](https://github.com/tthphat/eshop-sut/issues/7) | **BUG-FR03-02** | `FR-03` | [Backend hoàn toàn không kiểm tra tính hợp lệ và độ phức tạp của newPassword khi đặt lại mật khẩu](https://github.com/tthphat/eshop-sut/issues/7) | **Critical** | `Open` |
| [#8](https://github.com/tthphat/eshop-sut/issues/8) | **BUG-FR03-03** | `FR-03` | [Mã đặt lại mật khẩu không có thời hạn hết hạn (Token Never Expires)](https://github.com/tthphat/eshop-sut/issues/8) | **Major** | `Open` |
| [#9](https://github.com/tthphat/eshop-sut/issues/9) | **BUG-FR03-04** | `FR-03` | [Endpoint POST /api/forgot-password trả về HTTP 404 Not Found thay vì HTTP 400 Bad Request khi email không hợp lệ](https://github.com/tthphat/eshop-sut/issues/9) | **Minor** | `Open` |
| [#10](https://github.com/tthphat/eshop-sut/issues/10) | **BUG-FR08-01** | `FR-08` | [Backend hoàn toàn thiếu validation cho trường total_amount khi checkout](https://github.com/tthphat/eshop-sut/issues/10) | **Critical** | `Open` |
| [#11](https://github.com/tthphat/eshop-sut/issues/11) | **BUG-FR08-02** | `FR-08` | [Lỗ hổng Parameter Tampering: Backend không tính lại tổng tiền từ giỏ hàng, Web cho phép user tự sửa giá](https://github.com/tthphat/eshop-sut/issues/11) | **Critical** | `Open` |
| [#12](https://github.com/tthphat/eshop-sut/issues/12) | **BUG-FR08-03** | `FR-08` | [Backend thiếu validation shipping_address; Web và Mobile không có ô nhập địa chỉ](https://github.com/tthphat/eshop-sut/issues/12) | **Major** | `Open` |
| [#13](https://github.com/tthphat/eshop-sut/issues/13) | **BUG-FR08-04** | `FR-08` | [Cho phép đặt hàng khi giỏ hàng rỗng và không xóa giỏ hàng sau khi checkout](https://github.com/tthphat/eshop-sut/issues/13) | **Major** | `Open` |
| [#14](https://github.com/tthphat/eshop-sut/issues/14) | **BUG-FR08-05** | `FR-08` | [Frontend Mobile tự ý cắt xén sản phẩm cuối cùng trong giỏ hàng khi checkout (cart.slice(0, -1))](https://github.com/tthphat/eshop-sut/issues/14) | **Critical** | `Open` |
| [#15](https://github.com/tthphat/eshop-sut/issues/15) | **BUG-FR08-06** | `FR-08` | [Không kiểm tra số lượng tồn kho (Overselling) và DB không lưu chi tiết các mặt hàng (order_items)](https://github.com/tthphat/eshop-sut/issues/15) | **Major** | `Open` |
| [#16](https://github.com/tthphat/eshop-sut/issues/16) | **BUG-FR08-07** | `FR-08` | [Endpoint checkout không xác thực tính hợp lệ của mã giảm giá coupon_id](https://github.com/tthphat/eshop-sut/issues/16) | **Minor** | `Open` |
| [#17](https://github.com/tthphat/eshop-sut/issues/17) | **BUG-FR12-01** | `FR-12` | [Middleware authenticateToken không kiểm tra vai trò admin và các route quản trị thiếu role check](https://github.com/tthphat/eshop-sut/issues/17) | **Critical** | `Open` |
| [#18](https://github.com/tthphat/eshop-sut/issues/18) | **BUG-FR12-02** | `FR-12` | [Endpoint quản trị sản phẩm POST/PUT/DELETE /api/products hoàn toàn thiếu xác thực (Missing Authentication)](https://github.com/tthphat/eshop-sut/issues/18) | **Critical** | `Open` |
| [#19](https://github.com/tthphat/eshop-sut/issues/19) | **BUG-FR12-03** | `FR-12` | [Lỗ hổng Mass Assignment tại PUT /api/users/me cho phép người dùng tự nâng quyền thành Admin](https://github.com/tthphat/eshop-sut/issues/19) | **High** | `Open` |
| [#20](https://github.com/tthphat/eshop-sut/issues/20) | **BUG-FR20-01** | `FR-20` | [Hàm logout() trong Mobile App không dọn dẹp giỏ hàng gây rò rỉ dữ liệu phiên giữa các người dùng (Cross-user Cart Retention / Session Bleed)](https://github.com/tthphat/eshop-sut/issues/20) | **High** | `Open` |
| [#21](https://github.com/tthphat/eshop-sut/issues/21) | **BUG-FR20-02** | `FR-20` | [API POST /api/login trả về mật khẩu người dùng dạng plaintext trong response JSON (Sensitive Data Exposure)](https://github.com/tthphat/eshop-sut/issues/21) | **Critical** | `Open` |
| [#22](https://github.com/tthphat/eshop-sut/issues/22) | **BUG-FR20-03** | `FR-20` | [Cơ chế tính số lần đăng nhập sai cộng dồn bước nhảy 2 khiến tài khoản bị khóa bất thường chỉ sau 2 lần sai (Premature Account Lockout)](https://github.com/tthphat/eshop-sut/issues/22) | **Medium** | `Open` |
| [#23](https://github.com/tthphat/eshop-sut/issues/23) | **BUG-FR20-04** | `FR-20` | [Giao diện đăng nhập Mobile App sử dụng nhãn tiếng Anh không đồng nhất và đặt vị trí thông báo lỗi sai chuẩn UI/UX](https://github.com/tthphat/eshop-sut/issues/23) | **Low** | `Open` |

---
**Github cá nhân(toàn bộ HW)**: https://github.com/tthphat/Software-Testing   
**Gtihub nhóm**: https://github.com/tthphat/eshop-sut   
**Họ tên sinh viên (in hoa):** TRƯƠNG THÀNH PHÁT  
**MSSV:** 23120319  
**Chữ ký cam đoan:** *Trương Thành Phát*

