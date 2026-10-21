# Báo cáo minh chứng kiểm thử giao diện Web (Web UI Test Evidence Report)

Tài liệu này tổng hợp toàn bộ các ảnh chụp màn hình (screenshots) thực tế được ghi nhận khi thực thi kiểm thử giao diện người dùng trên hệ thống EShop SUT (gồm cổng người dùng `http://localhost:5173` và cổng quản trị `http://localhost:5174`).

---

## 1. FR-01 — Đăng ký tài khoản (Account Registration)

Môi trường: Frontend Web (`http://localhost:5173/register`)

| Tên tệp ảnh | Mục đích kiểm thử / Hiện tượng ghi nhận | Liên kết kiểm thử |
| :--- | :--- | :--- |
| [UI-FR01-01-register-form-initial.png](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-01/UI-FR01-01-register-form-initial.png) | Giao diện form đăng ký mặc định gồm 3 trường: Họ tên, Email, Mật khẩu. | Giao diện ban đầu |
| [UI-FR01-02-register-filled-inputs.png](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-01/UI-FR01-02-register-filled-inputs.png) | Trực quan hóa dữ liệu người dùng nhập trên form trước khi bấm Submit. | Input testing |
| [UI-FR01-03-register-duplicate-email-error.png](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-01/UI-FR01-03-register-duplicate-email-error.png) | Kiểm tra xử lý lỗi khi đăng ký bằng email đã tồn tại (`admin@eshop.com`). Giao diện nhận phản hồi từ Backend và hiển thị banner lỗi đỏ: `"Email already registered"`. | `FR01-DT-16`, `BUG-FR01-03` |

---

## 2. FR-03 — Quên và Đặt lại mật khẩu (Forgot & Reset Password)

Môi trường: Frontend Web (`http://localhost:5173/forgot-password`)

| Tên tệp ảnh | Mục đích kiểm thử / Hiện tượng ghi nhận | Liên kết khiếm khuyết |
| :--- | :--- | :--- |
| [UI-FR03-01-forgot-form-step1.png](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-03/UI-FR03-01-forgot-form-step1.png) | Bước 1: Giao diện yêu cầu cấp mã đặt lại mật khẩu bằng email người dùng. | Bước 1 Workflow |
| [UI-FR03-02-otp-leakage-on-screen.png](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-03/UI-FR03-02-otp-leakage-on-screen.png) | **Minh chứng lỗ hổng nghiêm trọng BUG-FR03-01**: Máy chủ trả về `resetToken` trong response body và giao diện hiển thị công khai mã OTP lên màn hình: `"Mã OTP của bạn là: e1df04c4b54e7f3c"`. Bất kỳ ai nhìn vào màn hình hoặc chặn gói tin đều chiếm đoạt được tài khoản. | `FR03-DT-01`, **BUG-FR03-01** |
| [UI-FR03-03-reset-password-step2.png](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-03/UI-FR03-03-reset-password-step2.png) | Bước 2: Form cho phép điền mã OTP và đặt mật khẩu mới `NewPassword123!`. | `FR03-DT-16`, **BUG-FR03-02** |

---

## 3. FR-08 — Thanh toán & Đặt hàng (Checkout)

Môi trường: Frontend Web (`http://localhost:5173/cart` và `http://localhost:5173/checkout`)

| Tên tệp ảnh | Mục đích kiểm thử / Hiện tượng ghi nhận | Liên kết khiếm khuyết |
| :--- | :--- | :--- |
| [UI-FR08-01-cart-page.png](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-08/UI-FR08-01-cart-page.png) | Giao diện Giỏ hàng (`/cart`) với các sản phẩm được chọn (iPhone 15 Pro Max, Tai nghe AirPods Pro 2) kèm nút chuyển sang thanh toán. | Giỏ hàng hợp lệ |
| [UI-FR08-02-checkout-editable-total-tampering.png](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-08/UI-FR08-02-checkout-editable-total-tampering.png) | Giao diện Xác nhận đơn hàng (`/checkout`). Ô Tổng tiền thanh toán hiển thị số tiền lớn (42,000,000 ₫) nhưng lại là **ô input cho phép chỉnh sửa tự do (`editableTotal`)**. | **BUG-FR08-02** |
| [UI-FR08-03-price-manipulation-demonstration.png](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-08/UI-FR08-03-price-manipulation-demonstration.png) | **Minh chứng thực tế lỗ hổng Parameter Tampering**: Khách hàng trực tiếp xóa số tiền 42 triệu và gõ `1000` VNĐ vào ô input màu đỏ trước khi bấm Đặt hàng. Hệ thống Backend chấp nhận và tạo đơn hàng với giá 1,000 VNĐ. | `FR08-DT-08`, **BUG-FR08-02** |
| [UI-FR08-04-missing-shipping-address-defect.png](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-08/UI-FR08-04-missing-shipping-address-defect.png) | **Minh chứng lỗ hổng thiếu trường giao hàng**: Toàn bộ trang Checkout hoàn toàn **không có ô nhập địa chỉ giao hàng (`shipping_address`)**, dẫn đến 100% đơn hàng đặt qua Web đều bị lưu `NULL` địa chỉ giao hàng trong CSDL. | `FR08-DT-16`, **BUG-FR08-03** |

---

## 4. FR-12 — Kiểm soát truy cập (Access Control)

Môi trường: Frontend Admin (`http://localhost:5174/`) và Frontend Web (`http://localhost:5173/profile`)

| Tên tệp ảnh | Mục đích kiểm thử / Hiện tượng ghi nhận | Liên kết khiếm khuyết |
| :--- | :--- | :--- |
| [UI-FR12-01-admin-login-portal.png](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-12/UI-FR12-01-admin-login-portal.png) | Giao diện cổng đăng nhập chuyên dụng dành cho Quản trị viên tại port 5174. | Cổng Admin Auth |
| [UI-FR12-02-admin-dashboard-stats.png](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-12/UI-FR12-02-admin-dashboard-stats.png) | Giao diện Bảng điều khiển Quản trị (Admin Dashboard) hiển thị số liệu thống kê người dùng, đơn hàng và các tab chức năng. | Dashboard Overview |
| [UI-FR12-03-admin-user-management-panel.png](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-12/UI-FR12-03-admin-user-management-panel.png) | Bảng Quản lý Người dùng (`/admin/users`) hiển thị danh sách toàn bộ tài khoản, email và quyền hạn (`role`). Minh chứng người dùng thường khi có token có thể truy cập vào cổng này (BOLA / Broken Access Control). | `FR12-DT-07`, **BUG-FR12-01** |
| [UI-FR12-04-admin-orders-management-panel.png](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-12/UI-FR12-04-admin-orders-management-panel.png) | Bảng Quản lý Đơn hàng (`/admin/orders`) cho phép xem và đổi trạng thái toàn bộ đơn hàng trong hệ thống. | `FR12-DT-08`, **BUG-FR12-01** |
| [UI-FR12-05-user-profile-page.png](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-12/UI-FR12-05-user-profile-page.png) | Giao diện Thông tin cá nhân người dùng (`/profile`). Cho phép người dùng cập nhật thông tin cá nhân; tại đây nếu hacker gửi kèm trường `role: "admin"` lên API `PUT /api/users/me`, hệ thống sẽ cho phép tự nâng quyền (Mass Assignment). | `FR12-DT-11`, **BUG-FR12-03** |

---

---

## 5. FR-20 — Đăng nhập & Đăng xuất trên Mobile App (Mobile Login & Logout)

Môi trường: Frontend Mobile (React Native / Expo Web trên viewport điện thoại di động `412 x 880`)

| Tên tệp ảnh | Mục đích kiểm thử / Hiện tượng ghi nhận | Liên kết khiếm khuyết |
| :--- | :--- | :--- |
| [UI-FR20-01-mobile-login-initial.png](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-20/UI-FR20-01-mobile-login-initial.png) | Giao diện Đăng nhập ban đầu trên Mobile. Minh chứng: Nhãn trường là `"Username"` thay vì `"Email"`, nút bấm hiển thị tiếng Anh `"Sign In"` vi phạm chuẩn tiếng Việt theo FR-21. | `FR20-DT-19`, **BUG-FR20-04** |
| [UI-FR20-02-mobile-login-error-below-button.png](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-20/UI-FR20-02-mobile-login-error-below-button.png) | Kiểm tra hiển thị thông báo lỗi khi nhập sai mật khẩu. Minh chứng: Khung cảnh báo lỗi màu đỏ `"Đăng nhập thất bại. Vui lòng kiểm tra lại."` bị đặt ở **phía dưới nút Sign In** (dưới cả link đăng ký), vi phạm quy chuẩn Form UX (FR-22). | `FR20-DT-19`, **BUG-FR20-04** |
| [UI-FR20-03-mobile-cart-items-before-logout.png](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-20/UI-FR20-03-mobile-cart-items-before-logout.png) | Giao diện Giỏ hàng trên Mobile với 2 sản phẩm (iPhone 15 Pro Max, Samsung Galaxy S24 Ultra - Tổng 58,000,000 ₫) trước khi người dùng thực hiện Đăng xuất. | Giỏ hàng ban đầu |
| [UI-FR20-04-mobile-profile-logged-in.png](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-20/UI-FR20-04-mobile-profile-logged-in.png) | Giao diện Thông tin cá nhân (Profile) của người dùng đã đăng nhập thành công (`Test User`, `testuser2026@eshop.com`). Hiển thị nút Đăng xuất mang nhãn `"Thoát"` màu đỏ. | Quản lý phiên đăng nhập |
| [UI-FR20-05-mobile-cart-retention-after-logout.png](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW2/evidence/FR-20/UI-FR20-05-mobile-cart-retention-after-logout.png) | **Minh chứng lỗ hổng Session Bleed nghiêm trọng BUG-FR20-01**: Sau khi bấm nút "Thoát" (đăng xuất), thanh điều hướng đã chuyển về trạng thái khách vãng lai (`Đăng nhập`), nhưng tab Giỏ hàng vẫn hiển thị `Giỏ (2)` và toàn bộ 2 sản phẩm 58 triệu của người dùng trước vẫn tồn lưu nguyên vẹn trong bộ nhớ. | `FR20-DT-18`, **BUG-FR20-01** |

---

## 6. Tổng kết hiện trạng minh chứng kiểm thử

- **Số lượng ảnh chụp giao diện Web**: **15 ảnh PNG** (FR-01, FR-03, FR-08, FR-12).
- **Số lượng ảnh chụp giao diện Mobile**: **5 ảnh PNG** (FR-20).
- **Tổng số ảnh minh chứng giao diện**: **20 ảnh PNG** sắc nét, phản ánh trực quan 100% các khiếm khuyết giao diện và luồng người dùng.
- **Vị trí lưu trữ**: Phân bổ vào `HW2/evidence/FR-01/`, `HW2/evidence/FR-03/`, `HW2/evidence/FR-08/`, `HW2/evidence/FR-12/`, `HW2/evidence/FR-20/`.
- **Tính toàn vẹn**:
  - Không sửa đổi bất kỳ tệp báo cáo chính thức nào (`23120319_HW02_Main_Report.md`, `bugs.vi.md`, `README.md`).
  - Không thực hiện bất kỳ lệnh `git commit` hay `git push` nào theo đúng chỉ thị.

