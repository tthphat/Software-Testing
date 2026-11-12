# Tổng hợp Lỗi Giao diện (GUI Defects Summary) - EShop

## 1. Thông tin Tổng quan
- **Hệ thống kiểm thử (SUT)**: EShop Multi-Channel System (Admin Web, Customer Web, Mobile Expo Go)
- **Sinh viên thực hiện**: TRƯƠNG THÀNH PHÁT (MSSV: 23120319)
- **Lớp**: Kiểm thử phần mềm - CQ2023/3 (FIT@HCMUS)
- **Cập nhật lần cuối**: 2026-11-01

---

## 2. Bảng Thống kê Lỗi Giao diện Phát hiện (GUI Bugs Table)

| STT | Bug ID | Checklist Item | Aspect | Phân hệ (Subsystem) | Tiêu đề Lỗi (Defect Title) | Mức độ (Severity) | Trạng thái (Status) | Minh chứng (Screenshot) | Chi tiết (Report Link) | Github issues |
|:---:|:---:|:---:|:---:|:---|:---|:---:|:---:|:---|:---:|:---:|
| 1 | **BUG-GUI-01** | [CHK-ADM-08](checklist.md#L27) | **IA-02** | Admin Dashboard (`:5174`) | Cho phép tạo Danh mục với tên rỗng do thiếu validation biểu mẫu | `Major` | `Open` | [BUG-GUI-01-add-category-with-empty-title.png](../evidence/screenshots/gui/BUG-GUI-01-add-category-with-empty-title.png) | [Xem báo cáo](issues/BUG-GUI-01.md) | [BUG-GUI-01](https://github.com/tthphat/eshop-sut/issues/76) |
| 2 | **BUG-GUI-02** | [CHK-ADM-10](checklist.md#L29) | **IA-02** | Admin Dashboard (`:5174`) | Form Thêm sản phẩm không có ký hiệu đánh dấu trường bắt buộc (*) | `Minor` | `Open` | [BUG-GUI-02-no-highlight-required-field.png](../evidence/screenshots/gui/BUG-GUI-02-no-highlight-required-field.png) | [Xem báo cáo](issues/BUG-GUI-02.md) | [BUG-GUI-02](https://github.com/tthphat/eshop-sut/issues/77) |
| 3 | **BUG-GUI-03** | [CHK-ADM-11](checklist.md#L30) | **IA-02** | Admin Dashboard (`:5174`) | Form Thêm sản phẩm không chặn nhập giá tiền số âm hoặc bằng 0 | `Major` | `Open` | [BUG-GUI-03-no-prevent-negative-money.png](../evidence/screenshots/gui/BUG-GUI-03-no-prevent-negative-money.png) | [Xem báo cáo](issues/BUG-GUI-03.md) | [BUG-GUI-03](https://github.com/tthphat/eshop-sut/issues/78) |
| 4 | **BUG-GUI-04** | [CHK-ADM-12](checklist.md#L31) | **IA-02** | Admin Dashboard (`:5174`) | Form Coupon cho phép chọn ngày hết hạn trong quá khứ | `Major` | `Open` | [BUG-GUI-04-no-prevent-coupon-passed-day.png](../evidence/screenshots/gui/BUG-GUI-04-no-prevent-coupon-passed-day.png) | [Xem báo cáo](issues/BUG-GUI-04.md) | [BUG-GUI-04](https://github.com/tthphat/eshop-sut/issues/79) |
| 5 | **BUG-GUI-05** | [CHK-ADM-13](checklist.md#L32) | **IA-02** | Admin Dashboard (`:5174`) | Form Coupon cho phép nhập tỷ lệ giảm giá phần trăm vượt quá 100% | `Major` | `Open` | [BUG-GUI-05-coupon-percent-higher-than-100.png](../evidence/screenshots/gui/BUG-GUI-05-coupon-percent-higher-than-100.png) | [Xem báo cáo](issues/BUG-GUI-05.md) | [BUG-GUI-05](https://github.com/tthphat/eshop-sut/issues/80) |
| 6 | **BUG-GUI-06** | [CHK-ADM-18](checklist.md#L37) | **IA-04** | Admin Dashboard (`:5174`) | Dashboard Admin hiển thị nhân đôi tổng doanh thu (x2 Revenue Bug) | `Major` | `Open` | [BUG-GUI-06-revenue-double-p1.png](../evidence/screenshots/gui/BUG-GUI-06-revenue-double-p1.png) | [Xem báo cáo](issues/BUG-GUI-06.md) | [BUG-GUI-06](https://github.com/tthphat/eshop-sut/issues/81) |
| 7 | **BUG-GUI-07** | [CHK-ADM-19](checklist.md#L38) | **IA-04** | Admin Dashboard (`:5174`) | Chỉnh sửa sản phẩm bị lỗi lan truyền đổi tên hàng loạt toàn bộ sản phẩm | `Critical` | `Open` | [BUG-GUI-07-update-cascading.png](../evidence/screenshots/gui/BUG-GUI-07-update-cascading.png) | [Xem báo cáo](issues/BUG-GUI-07.md) | [BUG-GUI-07](https://github.com/tthphat/eshop-sut/issues/82) |
| 8 | **BUG-GUI-08** | [CHK-ADM-20](checklist.md#L39) | **IA-04** | Admin Dashboard (`:5174`) | Thao tác Xóa không hiển thị hộp thoại xác nhận trước khi xóa dữ liệu | `Major` | `Open` | [BUG-GUI-08-no-confirm-before-delete.png](../evidence/screenshots/gui/BUG-GUI-08-no-confirm-before-delete.png) | [Xem báo cáo](issues/BUG-GUI-08.md) | [BUG-GUI-08](https://github.com/tthphat/eshop-sut/issues/83) |
| 9 | **BUG-GUI-09** | [CHK-WEB-07](checklist.md#L46) | **IA-02** | Customer Web (`:5173`) | Trang Chi tiết sản phẩm không chặn nhập số lượng âm hoặc bằng 0 | `Major` | `Open` | [BUG-GUI-09-no-prevent-negative-quantity-product.png](../evidence/screenshots/gui/BUG-GUI-09-no-prevent-negative-quantity-product.png) | [Xem báo cáo](issues/BUG-GUI-09.md) | [BUG-GUI-09](https://github.com/tthphat/eshop-sut/issues/84) |
| 10 | **BUG-GUI-10** | [CHK-WEB-08](checklist.md#L47) | **IA-04** | Customer Web (`:5173`) | Giỏ hàng không được làm trống sau khi hoàn tất đặt hàng thành công | `Major` | `Open` | [BUG-GUI-10-no-clear-cart-after-checkout-p1.png](../evidence/screenshots/gui/BUG-GUI-10-no-clear-cart-after-checkout-p1.png) | [Xem báo cáo](issues/BUG-GUI-10.md) | [BUG-GUI-10](https://github.com/tthphat/eshop-sut/issues/85) |
| 11 | **BUG-GUI-11** | [CHK-WEB-10](checklist.md#L49) | **IA-02** | Customer Web (`:5173`) | Ô nhập Mật khẩu trên trang Đăng nhập hiển thị dạng văn bản thô (type="text") | `Major` | `Open` | [BUG-GUI-11-no-hide-password.png](../evidence/screenshots/gui/BUG-GUI-11-no-hide-password.png) | [Xem báo cáo](issues/BUG-GUI-11.md) | [BUG-GUI-11](https://github.com/tthphat/eshop-sut/issues/86) |
| 12 | **BUG-GUI-12** | [CHK-WEB-15](checklist.md#L54) | **IA-02** | Customer Web (`:5173`) | Trang Thanh toán cho phép người dùng tự ý chỉnh sửa tổng tiền đơn hàng (Editable Total) | `Critical` | `Open` | [BUG-GUI-12-can-edit-total-price.png](../evidence/screenshots/gui/BUG-GUI-12-can-edit-total-price.png) | [Xem báo cáo](issues/BUG-GUI-12.md) | [BUG-GUI-12](https://github.com/tthphat/eshop-sut/issues/87) |
| 13 | **BUG-GUI-13** | [CHK-MOB-04](checklist.md#L60) | **IA-02** | Mobile App (Expo Go) | Bàn phím ảo không kích hoạt tìm kiếm khi nhấn Enter/Search trên Mobile | `Minor` | `Open` | [BUG-GUI-13-can-not-use-enter-to-search-on-mobile-virtual-keyboard.jpg](../evidence/screenshots/gui/BUG-GUI-13-can-not-use-enter-to-search-on-mobile-virtual-keyboard.jpg) | [Xem báo cáo](issues/BUG-GUI-13.md) | [BUG-GUI-13](https://github.com/tthphat/eshop-sut/issues/88) |
| 14 | **BUG-GUI-14** | [CHK-MOB-06](checklist.md#L62) | **IA-02** | Mobile App (Expo Go) | Thiếu nút bấm tăng/giảm (+ / -) số lượng cảm ứng trên màn hình Chi tiết sản phẩm | `Minor` | `Open` | [BUG-GUI-14-haven't-increase-decrease-item-button.jpg](../evidence/screenshots/gui/BUG-GUI-14-haven't-increase-decrease-item-button.jpg) | [Xem báo cáo](issues/BUG-GUI-14.md) | [BUG-GUI-14](https://github.com/tthphat/eshop-sut/issues/89) |
| 15 | **BUG-GUI-15** | [CHK-MOB-07](checklist.md#L61) | **IA-03** | Mobile App (Expo Go) | Thiếu nút mũi tên quay lại (Back Arrow) trên màn hình Chi tiết sản phẩm Mobile (trang Giỏ hàng đã có nút Mua tiếp) | `Major` | `Open` | [BUG-GUI-15-haven't-back-arrow.jpg](../evidence/screenshots/gui/BUG-GUI-15-haven't-back-arrow.jpg) | [Xem báo cáo](issues/BUG-GUI-15.md) | [BUG-GUI-15](https://github.com/tthphat/eshop-sut/issues/90) |
| 16 | **BUG-GUI-16** | [CHK-MOB-08](checklist.md#L64) | **IA-03** | Mobile App (Expo Go) | Bấm phím Back phần cứng của Android làm thoát/đóng ứng dụng ngay lập tức | `Major` | `Open` | [BUG-GUI-16-quit-app-immediately-when-use-android-back-button-p1.jpg](../evidence/screenshots/gui/BUG-GUI-16-quit-app-immediately-when-use-android-back-button-p1.jpg) | [Xem báo cáo](issues/BUG-GUI-16.md) | [BUG-GUI-16](https://github.com/tthphat/eshop-sut/issues/91) |
| 17 | **BUG-GUI-17** | [CHK-MOB-09](checklist.md#L65) | **IA-01** | Mobile App (Expo Go) | Thiếu vùng an toàn Safe Area trên Android khiến Header bị đè lên Status Bar | `Major` | `Open` | [BUG-GUI-17-haven't-safe-area.jpg](../evidence/screenshots/gui/BUG-GUI-17-haven't-safe-area.jpg) | [Xem báo cáo](issues/BUG-GUI-17.md) | [BUG-GUI-17](https://github.com/tthphat/eshop-sut/issues/92) |
| 18 | **BUG-GUI-18** | [CHK-MOB-10](checklist.md#L66) | **IA-02** | Mobile App (Expo Go) | Bàn phím ảo che khuất nút bấm Thêm vào giỏ trên màn hình Chi tiết sản phẩm | `Major` | `Open` | [BUG-GUI-18-virtual-keyboard-hide-submit-button.jpg](../evidence/screenshots/gui/BUG-GUI-18-virtual-keyboard-hide-submit-button.jpg) | [Xem báo cáo](issues/BUG-GUI-18.md) | [BUG-GUI-18](https://github.com/tthphat/eshop-sut/issues/93) |
| 19 | **BUG-GUI-19** | [CHK-WEB-05](checklist.md#L44) | **IA-01** | Customer Web (`:5173`) | Trang chủ hiển thị từ khóa tìm kiếm qua dangerouslySetInnerHTML gây lỗ hổng HTML Injection / Reflected XSS | `Critical` | `Open` | [BUG-GUI-19-xss-html-injection-search.jpg](../evidence/screenshots/gui/BUG-GUI-19-xss-html-injection-search.jpg) | [Xem báo cáo](issues/BUG-GUI-19.md) | [BUG-GUI-19](https://github.com/tthphat/eshop-sut/issues/94) |

---

## 3. Thống kê Phân bổ Lỗi (Defect Distribution)

### A. Theo Mức độ Nghiêm trọng (Severity)
- **Critical**: 3 (BUG-GUI-07, BUG-GUI-12, BUG-GUI-19)
- **Major**: 13 (BUG-GUI-01, BUG-GUI-03, BUG-GUI-04, BUG-GUI-05, BUG-GUI-06, BUG-GUI-08, BUG-GUI-09, BUG-GUI-10, BUG-GUI-11, BUG-GUI-15, BUG-GUI-16, BUG-GUI-17, BUG-GUI-18)
- **Minor**: 3 (BUG-GUI-02, BUG-GUI-13, BUG-GUI-14)
- **Trivial**: 0
- **Tổng cộng**: **19 lỗi**

### B. Theo Khía cạnh Giao diện (Interface Aspects)
- **IA-01 (Chuẩn UI chung)**: 2 (BUG-GUI-17, BUG-GUI-19)
- **IA-02 (Biểu mẫu - Forms)**: 11 (BUG-GUI-01, BUG-GUI-02, BUG-GUI-03, BUG-GUI-04, BUG-GUI-05, BUG-GUI-09, BUG-GUI-11, BUG-GUI-12, BUG-GUI-13, BUG-GUI-14, BUG-GUI-18)
- **IA-03 (Điều hướng - Navigation)**: 2 (BUG-GUI-15, BUG-GUI-16)
- **IA-04 (Phản hồi & Trạng thái)**: 4 (BUG-GUI-06, BUG-GUI-07, BUG-GUI-08, BUG-GUI-10)

### C. Theo Phân hệ Giao diện (SUT Subsystems)
- **Admin Dashboard**: 8 lỗi
- **Customer Web**: 5 lỗi (BUG-GUI-09, BUG-GUI-10, BUG-GUI-11, BUG-GUI-12, BUG-GUI-19)
- **Mobile App (Expo Go)**: 6 lỗi
