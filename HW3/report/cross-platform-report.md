# Báo cáo Kiểm thử Giao diện Đa trình duyệt & Đa nền tảng (Cross-Platform GUI Testing Report)

**Môn học:** Kiểm thử phần mềm (CSC13003) — Học kỳ 1, Năm học 2026–2027  
**Giảng viên phụ trách:** TS. Trần Duy Hoàng, ThS. Trương Phước Lộc, ThS. Hồ Tuấn Thanh, TS. Lâm Quang Vũ — Khoa CNTT, Trường ĐH KHTN (HCMUS)  
**Sinh viên thực hiện:** TRƯƠNG THÀNH PHÁT — **MSSV:** 23120319 — **Lớp:** CQ2023/3  
**Email sinh viên:** `23120319@student.hcmus.edu.vn`  
**Hệ thống kiểm thử (SUT):** EShop Multi-Channel System (`https://github.com/ttbhanh/eshop-sut`)  

---

## 1. Mục tiêu & Phương pháp luận

Báo cáo này tài liệu hóa kết quả thực thi kiểm thử giao diện người dùng (GUI Checklist) của Task 1 trên **đa nền tảng và đa trình duyệt** theo yêu cầu của **Task 3 (HW03)**. Mục tiêu nhằm:
1. **Đánh giá tính nhất quán thị giác (Visual Consistency) và chức năng giữa 2 engine web máy tính:** Engine Blink (Google Chrome) và Engine Gecko (Mozilla Firefox) trên 35 ca kiểm thử phân hệ Web & Admin.
2. **Đối chiếu trải nghiệm tương tác giữa Web Desktop và Native Mobile:** Chạy 10 ca kiểm thử di động trực tiếp trên điện thoại thật thông qua ứng dụng **Expo Go**.
3. **Căn cứ lựa chọn nền tảng chính thức theo Đề bài (§6 Task 3):**
   > *"Bao phủ web frontend trên Chrome, Firefox và Safari... Bạn cũng có thể kiểm thử ứng dụng di động của SUT qua Expo Go trên điện thoại thật. **Expo Go được tính là một nền tảng hợp lệ và có thể thay thế một trong ba nền tảng trình duyệt bắt buộc (ví dụ thay cho Safari)**; nó không chỉ là phần thưởng thêm: sử dụng nó thỏa mãn một trong ba nền tảng bắt buộc."*
   Do các công cụ đám mây (BrowserStack / LambdaTest) bị giới hạn nghiêm ngặt thời gian phiên chạy thử nghiệm đối với macOS/Safari (chỉ 2 phút/phiên), sinh viên chính thức lựa chọn **Tổ hợp 3 Nền tảng Độc lập**:
   - **Nền tảng 1:** Google Chrome (Windows 11) — Đại diện Blink / Chromium Engine.
   - **Nền tảng 2:** Mozilla Firefox (Windows 11) — Đại diện Gecko Engine.
   - **Nền tảng 3:** Expo Go Mobile trên Realme C53 (Android 15) — Đại diện Native Mobile Platform.
4. **Quy định bằng chứng minh bạch:** 100% ảnh chụp màn hình kiểm thử đều được đóng dấu dải banner watermark định danh sinh viên (`23120319@student.hcmus.edu.vn | 23120319 - Trương Thành Phát | Platform | Timestamp`).

---

## 2. Thông số Môi trường Kiểm thử (5.1 Environment)

| Nền tảng (Platform) | Phân hệ kiểm thử | Công cụ / Thiết bị | Hệ điều hành / Môi trường | Phiên bản Trình duyệt / App | Cơ chế kết nối (Tunnel/Network) |
|---|---|---|---|---|---|
| **Google Chrome** | Customer Web & Admin UI | Máy trạm cục bộ (Local PC) | Windows 11, Version 25H2 (64-bit) | Version 157.0.8103.39 (Official Build) (64-bit) | Localhost (`:5173`, `:5174`) |
| **Mozilla Firefox** | Customer Web & Admin UI | Máy trạm cục bộ (Local PC) | Windows 11, Version 25H2 (64-bit) | Version 159.0.1 (64-bit) | Localhost (`:5173`, `:5174`) |
| **Expo Go Mobile** | Mobile App | Điện thoại thật (Realme C53) | Android 15 (Realme UI T Edition) | Expo Go SDK 54 | Wi-Fi LAN / Expo Tunnel |

---

## 3. Bảng 1: Kiểm thử Đa trình duyệt trên Web & Admin (5.2 Table 1: Web + Admin)

*Bảng đối chiếu 35 mục kiểm thử trên Giao diện Quản trị (`CHK-ADM-01` → `CHK-ADM-20`) và Giao diện Web Khách hàng (`CHK-WEB-01` → `CHK-WEB-15`) giữa Google Chrome (Blink) và Mozilla Firefox (Gecko):*

| Item ID | Phân hệ / Màn hình | Tiêu chí kiểm tra tóm tắt | Chrome (Blink) | Firefox (Gecko) | Khác biệt? (Differs?) | Ghi chú quan sát / Minh chứng ảnh |
|:---:|:---|:---|:---:|:---:|:---:|:---|
| **CHK-ADM-01** | Admin - Login | Căn giữa hộp thoại đăng nhập ngang/dọc | Passed | Passed | No | Bố cục flexbox căn giữa hoàn hảo trên cả 2 trình duyệt. `CHK-ADM-01-chrome.png`, `CHK-ADM-01-firefox.png` |
| **CHK-ADM-02** | Admin - Sidebar | Sidebar màu tối, text tương phản cao | Passed | Passed | No | Nền `bg-gray-800` tương phản chữ trắng rõ ràng, đồng nhất. `CHK-ADM-02-chrome.png`, `CHK-ADM-02-firefox.png` |
| **CHK-ADM-03** | Admin - Dashboard | 2 thẻ KPI hiển thị lưới 2 cột cân đối | Passed | Passed | No | Grid 2 cột responsive chuẩn xác. `CHK-ADM-03-chrome.png`, `CHK-ADM-03-firefox.png` |
| **CHK-ADM-04** | Admin - Bảng chung | Hàng header bảng chữ đậm, nền xám | Passed | Passed | No | Nền `bg-gray-200` hiển thị sắc nét trên cả Blink và Gecko. `CHK-ADM-04-chrome.png`, `CHK-ADM-04-firefox.png` |
| **CHK-ADM-05** | Admin - Đơn hàng | Huy hiệu trạng thái đơn hàng đủ màu | Passed | Passed | No | Màu sắc huy hiệu (pending, confirmed, delivered, v.v.) đồng bộ. `CHK-ADM-05-chrome.png`, `CHK-ADM-05-firefox.png` |
| **CHK-ADM-06** | Admin - Mã giảm giá | Mã coupon font monospace, in đậm cam | Passed | Passed | No | Font monospace hiển thị đúng thuộc tính CSS trên cả 2 nền tảng. `CHK-ADM-06-chrome.png`, `CHK-ADM-06-firefox.png` |
| **CHK-ADM-07** | Admin - Login | Validation chặn rỗng Email & Password | Passed | Passed | No | Form chặn submit rỗng hợp lệ. `CHK-ADM-07-chrome.png`, `CHK-ADM-07-firefox.png` |
| **CHK-ADM-08** | Admin - Danh mục | Chặn submit khi tên danh mục rỗng | **Failed** | **Failed** | No | **Lỗi chung (Common defect)**: Client thiếu validation kiểm tra khoảng trắng; tạo danh mục rỗng. Xem [BUG-GUI-01](issues/BUG-GUI-01.md). |
| **CHK-ADM-09** | Admin - Danh mục | Tự động xóa rỗng ô nhập sau khi thêm | Passed | Passed | No | State reset ô input về chuỗi rỗng mượt mà sau khi submit thành công. `CHK-ADM-09-chrome.png`, `CHK-ADM-09-firefox.png` |
| **CHK-ADM-10** | Admin - Sản phẩm | Ký hiệu phân biệt trường bắt buộc (*) | **Failed** | **Failed** | No | **Lỗi chung (Common defect)**: Không có ký hiệu (*) phân biệt bắt buộc/tùy chọn trên cả 2 browser. Xem [BUG-GUI-02](issues/BUG-GUI-02.md). |
| **CHK-ADM-11** | Admin - Sản phẩm | Validation chặn nhập giá tiền số âm | **Failed** | **Failed** | No | **Lỗi chung (Common defect)**: Cho phép tạo sản phẩm giá tiền âm (-50.000 ₫). Xem [BUG-GUI-03](issues/BUG-GUI-03.md). |
| **CHK-ADM-12** | Admin - Coupon | Chặn chọn ngày hết hạn trong quá khứ | **Failed** | **Failed** | Yes *(UI)* | **Lỗi chung logic**: Cả 2 đều cho phép chọn ngày quá khứ do thiếu thuộc tính `min` (Xem [BUG-GUI-04](issues/BUG-GUI-04.md)). **Sai lệch UI**: Hộp chọn lịch (Date picker popup) của Firefox mở giao diện native của Gecko, khác với dropdown popup của Chrome Blink. |
| **CHK-ADM-13** | Admin - Coupon | Ràng buộc % giảm giá trong 1%–100% | **Failed** | **Failed** | No | **Lỗi chung (Common defect)**: Thiếu `max="100"`, cho phép nhập coupon 150%. Xem [BUG-GUI-05](issues/BUG-GUI-05.md). |
| **CHK-ADM-14** | Admin - Sidebar | Highlight tab đang kích hoạt (active) | Passed | Passed | No | Chữ màu xanh `text-blue-400` hiển thị chính xác tab đang mở. `CHK-ADM-14-chrome.png`, `CHK-ADM-14-firefox.png` |
| **CHK-ADM-15** | Admin - Sidebar | Chuyển đổi tab mượt mà không tải lại | Passed | Passed | No | Client-side tab navigation chuyển đổi tức thì. `CHK-ADM-15-chrome.png`, `CHK-ADM-15-firefox.png` |
| **CHK-ADM-16** | Admin - Sidebar | Đăng xuất xóa token, chặn Back | Passed | Passed | No | Xóa sạch token xác thực và chuyển hướng về màn hình đăng nhập. `CHK-ADM-16-chrome.png`, `CHK-ADM-16-firefox.png` |
| **CHK-ADM-17** | Admin - Import CSV | Tải file template_import.csv đúng chuẩn | Passed | Passed | No | Trình duyệt kích hoạt tải file CSV đúng định dạng UTF-8. `CHK-ADM-17-chrome.png`, `CHK-ADM-17-firefox.png` |
| **CHK-ADM-18** | Admin - Dashboard | Doanh thu không bị nhân đôi (x2 bug) | **Failed** | **Failed** | No | **Lỗi chung (Common defect)**: Logic tính toán dashboard nhân đôi doanh thu hiển thị trên cả 2 browser. Xem [BUG-GUI-06](issues/BUG-GUI-06.md). |
| **CHK-ADM-19** | Admin - Sản phẩm | Sửa 1 sản phẩm không lan truyền tên | **Failed** | **Failed** | No | **Lỗi chung (Common defect)**: Lỗi cập nhật state làm đổi tên hàng loạt sản phẩm. Xem [BUG-GUI-07](issues/BUG-GUI-07.md). |
| **CHK-ADM-20** | Admin - Thao tác Xóa | Hộp thoại xác nhận trước khi xóa dữ liệu | **Failed** | **Failed** | No | **Lỗi chung (Common defect)**: Bấm nút Xóa thực thi ngay lập tức, không có modal confirm. Xem [BUG-GUI-08](issues/BUG-GUI-08.md). |
| **CHK-WEB-01** | Web - Trang chủ | Lưới sản phẩm (Product Grid 3 cột) | Passed | Passed | No | Grid chia 3 cột đều đặn, khoảng cách padding thẳng hàng. `CHK-WEB-01-chrome.png`, `CHK-WEB-01-firefox.png` |
| **CHK-WEB-02** | Web - Trang chủ | Cắt ngắn tiêu đề tên sản phẩm quá dài | Passed | Passed | No | Xử lý `truncate` CSS đều hiển thị dấu ba chấm (`...`) bảo toàn độ cao thẻ card. `CHK-WEB-02-chrome.png`, `CHK-WEB-02-firefox.png` |
| **CHK-WEB-03** | Web - Trang chủ | Định dạng tiền tệ phân cách hàng nghìn | Passed | Passed | No | Chuỗi số tiền hiển thị chuẩn dạng `150,000 VND` màu đỏ. `CHK-WEB-03-chrome.png`, `CHK-WEB-03-firefox.png` |
| **CHK-WEB-04** | Web - Giỏ hàng | Trạng thái thông báo giỏ hàng trống | Passed | Passed | No | Hiển thị thông báo giỏ trống kèm link quay lại mua sắm. `CHK-WEB-04-chrome.png`, `CHK-WEB-04-firefox.png` |
| **CHK-WEB-05** | Web - Tìm kiếm | Hiển thị chuỗi tìm kiếm an toàn (No XSS) | **Failed** | **Failed** | No | **Lỗi chung (Common defect)**: Trang chủ dùng `dangerouslySetInnerHTML` gây lỗ hổng HTML Injection / Reflected XSS. Xem [BUG-GUI-19](issues/BUG-GUI-19.md). `CHK-WEB-05-chrome.jpg`, `CHK-WEB-05-firefox.png` |
| **CHK-WEB-06** | Web - Tìm kiếm | Nhập từ khóa và bấm Enter tìm kiếm | Passed | Passed | No | Bắt sự kiện bàn phím phím Enter gửi query lọc sản phẩm chính xác. `CHK-WEB-06-chrome.png`, `CHK-WEB-06-firefox.png` |
| **CHK-WEB-07** | Web - Chi tiết SP | Ô số lượng chặn số 0, số âm, chữ | **Failed** | **Failed** | No | **Lỗi chung (Common defect)**: Thiếu ràng buộc `min="1"`, cho phép nhập số lượng âm vào giỏ. Xem [BUG-GUI-09](issues/BUG-GUI-09.md). |
| **CHK-WEB-08** | Web - Thanh toán | Làm trống giỏ hàng sau khi thanh toán | **Failed** | **Failed** | No | **Lỗi chung (Common defect)**: Hệ thống thiếu lệnh `clearCart()`, hàng vẫn còn trong giỏ. Xem [BUG-GUI-10](issues/BUG-GUI-10.md). |
| **CHK-WEB-09** | Web - Thanh toán | Tự động viết hoa ký tự mã coupon | Passed | Passed | No | Hàm chuyển `toUpperCase()` hoạt động đồng nhất khi gõ phím. `CHK-WEB-09-chrome.png`, `CHK-WEB-09-firefox.png` |
| **CHK-WEB-10** | Web - Đăng nhập | Ẩn mật khẩu (`type="password"`) | **Failed** | **Failed** | No | **Lỗi chung (Common defect)**: Gán nhầm `type="text"`, mật khẩu lộ rõ văn bản thô. Xem [BUG-GUI-11](issues/BUG-GUI-11.md). |
| **CHK-WEB-11** | Web - Header | Điều hướng menu header chính xác | Passed | Passed | No | Các liên kết chuyển đúng route React Router trên cả 2 browser. `CHK-WEB-11-chrome.png`, `CHK-WEB-11-firefox.png` |
| **CHK-WEB-12** | Web - Trang chủ | Click sản phẩm mở đúng trang chi tiết | Passed | Passed | No | Chuyển hướng URL dạng `/product/:id` tải đúng dữ liệu sản phẩm. `CHK-WEB-12-chrome.png`, `CHK-WEB-12-firefox.png` |
| **CHK-WEB-13** | Web - Giỏ hàng | Nút Tiến hành thanh toán chuyển checkout | Passed | Passed | No | Chuyển đúng luồng thanh toán đơn hàng. `CHK-WEB-13-chrome.png`, `CHK-WEB-13-firefox.png` |
| **CHK-WEB-14** | Web - Chi tiết SP | Phản hồi thông báo thêm vào giỏ | Passed | Passed | No | Alert/Toast thông báo thêm giỏ hàng thành công hiển thị mượt mà. `CHK-WEB-14-chrome.png`, `CHK-WEB-14-firefox.png` |
| **CHK-WEB-15** | Web - Thanh toán | Khóa ô Tổng tiền thanh toán (Read-only) | **Failed** | **Failed** | No | **Lỗi chung (Common defect)**: Ô Tổng tiền là ô input mở, người dùng tự ý sửa đổi số tiền thanh toán. Xem [BUG-GUI-12](issues/BUG-GUI-12.md). |

---

## 4. Bảng 2: Kiểm thử Ứng dụng Di động trên Điện thoại thật (5.3 Table 2: Mobile)

- **Thiết bị kiểm thử:** Realme C53 (Màn hình IPS LCD 6.74", độ phân giải HD+ 90Hz, thiết kế giọt nước Mini Capsule).
- **Hệ điều hành:** Android 15 (Realme UI T Edition).
- **Môi trường thực thi:** Expo Go SDK 54.
- **Phương thức kết nối:** Wi-Fi Local Area Network

| Item ID | Màn hình di động | Tiêu chí kiểm tra tóm tắt | Kết quả trên Android (Expo Go) | Ghi chú hành vi quan sát thực tế / Minh chứng ảnh |
|:---:|:---|:---|:---:|:---|
| **CHK-MOB-01** | Mobile - Danh sách SP | Thông báo chữ "Đang tải..." khi nạp dữ liệu | **Passed** | Văn bản thông báo "Đang tải..." hiển thị rõ ràng trên màn hình trong khi đang gọi API fetch danh sách sản phẩm từ backend (không dùng vòng xoay spinner). `CHK-MOB-01-expo.jpg` |
| **CHK-MOB-02** | Mobile - Trang chủ | Kích thước vùng chạm cảm ứng ($\ge 48\times 48\text{ px}$) | **Passed** | Các thẻ sản phẩm và nút chuyển tab dưới bottom navigation có diện tích chạm rộng rãi, không bị bấm nhầm. `CHK-MOB-02-expo.jpg` |
| **CHK-MOB-03** | Mobile - Toàn app | Phông chữ tiếng Việt hiển thị đủ dấu | **Passed** | Hệ thống font Roboto của Android hiển thị sắc nét các từ "Đăng ký", "Giỏ hàng", "Thanh toán", không bị lỗi ô vuông hay vỡ chữ. `CHK-MOB-03-expo.jpg` |
| **CHK-MOB-04** | Mobile - Tìm kiếm | Phím Enter trên bàn phím ảo kích hoạt tìm kiếm | **Failed** | **Lỗi đặc thù di động**: Thẻ TextInput thiếu thuộc tính `returnKeyType="search"` và `onSubmitEditing`; khi gõ từ khóa xong bấm nút Enter/Check trên bàn phím ảo Realme C53 không kích hoạt tìm kiếm, buộc phải bấm vào icon tìm kiếm. Xem [BUG-GUI-13 (#88)](https://github.com/tthphat/eshop-sut/issues/88). `CHK-MOB-04-expo.jpg` |
| **CHK-MOB-05** | Mobile - Đặt hàng | Bảo toàn toàn bộ mặt hàng trong giỏ khi đặt hàng | **Passed** | Giỏ hàng gửi đầy đủ toàn bộ mặt hàng lên backend, không bị lỗi mất mặt hàng cuối cùng. `CHK-MOB-05-expo.jpg` |
| **CHK-MOB-06** | Mobile - Chi tiết SP | Cặp nút tăng/giảm (+/-) số lượng cảm ứng | **Failed** | **Lỗi giao diện di động**: Giao diện thiếu cặp nút bấm tăng/giảm số lượng cảm ứng; người dùng bị bắt buộc phải nhấp mở bàn phím số để gõ tay số lượng. Xem [BUG-GUI-14 (#89)](https://github.com/tthphat/eshop-sut/issues/89). `CHK-MOB-06-expo.jpg` |
| **CHK-MOB-07** | Mobile - Chi tiết SP | Nút mũi tên quay lại (Back arrow) trên màn hình Chi tiết sản phẩm | **Failed** | **Lỗi điều hướng di động**: Màn hình Chi tiết sản phẩm thiếu nút mũi tên Back trên Header để quay về Trang chủ (trong khi màn hình Giỏ hàng đã có sẵn nút "Mua tiếp"). Xem [BUG-GUI-15 (#90)](https://github.com/tthphat/eshop-sut/issues/90). `CHK-MOB-07-expo-p1.jpg` (Chi tiết SP) & `CHK-MOB-07-expo-p2.jpg` (Giỏ hàng đối chứng) |
| **CHK-MOB-08** | Mobile - Điều hướng | Bắt sự kiện phím Back phần cứng / cử chỉ Android | **Failed** | **Lỗi tương tác hệ điều hành Android**: Ứng dụng không khai báo `BackHandler`; khi người dùng vuốt cử chỉ Back cạnh màn hình hoặc bấm phím Back cảm ứng, ứng dụng bị đóng (thoát ra màn hình chính điện thoại) ngay lập tức thay vì quay lui màn hình trước. Xem [BUG-GUI-16 (#91)](https://github.com/tthphat/eshop-sut/issues/91). `CHK-MOB-08-expo-p1.jpg` (Trong app) & `CHK-MOB-08-expo-p2.jpg` (Bị văng ra Launcher) |
| **CHK-MOB-09** | Mobile - Trang chủ | Vùng an toàn (Safe Area) né camera & Status Bar | **Failed** | **Lỗi giao diện phần cứng Android**: Thẻ `SafeAreaView` mặc định của React Native không tự tính padding đỉnh trên Android; thanh tiêu đề và thanh tìm kiếm bị tràn lên sát đỉnh màn hình, đè lấn lên cụm camera giọt nước Mini Capsule, đồng hồ và icon pin/sóng của Realme C53. Xem [BUG-GUI-17 (#92)](https://github.com/tthphat/eshop-sut/issues/92). `CHK-MOB-09-expo.jpg` |
| **CHK-MOB-10** | Mobile - Product detail | Tránh bàn phím ảo che khuất nút hành động Submit | **Failed** | **Lỗi hiển thị runtime di động**: Form Chi tiết sản phẩm không được bọc `KeyboardAvoidingView`; khi chạm vào ô nhập số lượng, bàn phím số Android trồi lên chiếm 45% diện tích màn hình và che khuất hoàn toàn nút bấm "Thêm vào giỏ hàng". Xem [BUG-GUI-18 (#93)](https://github.com/tthphat/eshop-sut/issues/93). `CHK-MOB-10-expo.jpg` |

---

## 5. Bảng 3: Tổng hợp Đánh giá Nền tảng (5.4 Table 3: Platform Summary)

| Nền tảng (Platform) | Phân hệ kiểm thử | Công cụ / Môi trường thực thi | Tổng số mục chạy | Số mục Đạt (Passed) | Số mục Lỗi (Failed) | Tỷ lệ Lỗi (%) | Số mục sai lệch so với Chrome |
|---|---|---|:---:|:---:|:---:|:---:|:---:|
| **Google Chrome (Blink)** | Web & Admin | Máy trạm Windows 11 cục bộ | 35 | 22 | 13 | 37.1% | *Mốc chuẩn (Baseline)* |
| **Mozilla Firefox (Gecko)** | Web & Admin | Máy trạm Windows 11 cục bộ | 35 | 22 | 13 | 37.1% | 1 *(Khác biệt UI date picker)* |
| **Expo Go (Android)** | Mobile App | Điện thoại thật Realme C53 | 10 | 4 | 6 | 60.0% | *Phân hệ độc lập (Mobile Native)* |
| **TỔNG CỘNG 3 NỀN TẢNG** | **Đầy đủ SUT** | **Multi-device environment** | **80** | **48** | **32** | **40.0%** | **Đạt chuẩn Task 3** |

---

## 6. Phân tích Sai lệch Nền tảng & Phát hiện Kiểm thử (5.5 Findings)

### 6.1. Nhóm Lỗi Khiếm khuyết Chung (Common Defects - 13 lỗi trên Web & Admin)
Toàn bộ 13 lỗi giao diện và form logic phát hiện trên Chrome đều tái hiện chính xác 100% trên Firefox:
1. **Bảo mật & Biểu mẫu**: Lỗ hổng HTML Injection / Reflected XSS tại ô tìm kiếm ([BUG-GUI-19](issues/BUG-GUI-19.md)), form đăng nhập lộ mật khẩu văn bản thô ([BUG-GUI-11](issues/BUG-GUI-11.md)), form thanh toán cho phép người dùng tự sửa tổng tiền ([BUG-GUI-12](issues/BUG-GUI-12.md)), thiếu thuộc tính `min="1"` cho phép nhập số lượng âm ([BUG-GUI-09](issues/BUG-GUI-09.md)).
2. **Logic Quản trị Admin**: Thiếu kiểm tra rỗng tên danh mục ([BUG-GUI-01](issues/BUG-GUI-01.md)), cho phép giá sản phẩm âm ([BUG-GUI-03](issues/BUG-GUI-03.md)), cho phép tạo coupon quá hạn trong quá khứ ([BUG-GUI-04](issues/BUG-GUI-04.md)), giảm giá vượt 100% ([BUG-GUI-05](issues/BUG-GUI-05.md)), lỗi nhân đôi doanh thu KPI Dashboard ([BUG-GUI-06](issues/BUG-GUI-06.md)), lỗi đổi tên hàng loạt sản phẩm ([BUG-GUI-07](issues/BUG-GUI-07.md)), thiếu modal xác nhận xóa ([BUG-GUI-08](issues/BUG-GUI-08.md)).
3. **Quản lý Giỏ hàng**: Không dọn sạch giỏ hàng sau khi đặt hàng thành công ([BUG-GUI-10](issues/BUG-GUI-10.md)).

*Kết luận:* Các lỗi trên bắt nguồn từ mã nguồn frontend React dùng chung (`frontend-web` và `frontend-admin`) và thiếu sót trong khâu validation client-side, hoàn toàn độc lập với engine xử lý đồ họa của trình duyệt.

### 6.2. Sai lệch Hiển thị Giữa Engine Blink (Chrome) và Gecko (Firefox)
- **HTML5 Date Picker Control (`CHK-ADM-12`)**:
  - *Trên Chrome (Blink)*: Trường `<input type="date">` hiển thị icon lịch ở mép phải. Khi bấm, mở ra popup dropdown dạng Material Design của Chromium.
  - *Trên Firefox (Gecko)*: Giao diện mở ra bảng chọn ngày tích hợp native của Gecko. Mặc dù giao diện khác nhau nhưng cả hai đều không ngăn chặn được việc người dùng chọn ngày trong quá khứ do thiếu thuộc tính `min`.
- **Hiển thị Form & Font Rendering**:
  - Thư viện Tailwind CSS xử lý rất tốt việc chuẩn hóa CSS reset (`box-sizing: border-box`, normalize), do đó hệ thống font chữ tiếng Việt, khoảng cách padding và lưới Grid 3 cột trên cả Chrome và Firefox hiển thị đồng nhất, không ghi nhận hiện tượng vỡ layout nghiêm trọng.

### 6.3. Điểm Yếu Giao diện Trọng tâm trên Ứng dụng Di động (Mobile App Skews)
Tỷ lệ lỗi trên phân hệ di động (Realme C53 Android 15) lên tới **60.0% (6/10 mục Failed)**, phản ánh sự thiếu hụt trong việc tối ưu hóa cho màn hình cảm ứng và tương tác native của hệ điều hành:
1. **Phần cứng & Tai thỏ (`CHK-MOB-09`)**: Thiếu tính toán chiều cao StatusBar trên Android làm nội dung bị camera giọt nước Mini Capsule che khuất.
2. **Bàn phím ảo trồi lên (`CHK-MOB-10`)**: Thiếu `KeyboardAvoidingView` che mất nút bấm Submit, gây gián đoạn luồng mua hàng.
3. **Phím Back phần cứng / Cử chỉ (`CHK-MOB-08`)**: Bỏ qua `BackHandler` khiến người dùng bị thoát văng khỏi app khi thực hiện cử chỉ quay lại quen thuộc trên Android.
4. **Trải nghiệm cảm ứng (`CHK-MOB-04`, `CHK-MOB-06`, `CHK-MOB-07`)**: Thiếu nút tăng giảm số lượng (+/-) một chạm, thiếu điều hướng Back trên Header màn hình Chi tiết SP (trang Giỏ hàng đã có nút Mua tiếp), và không hỗ trợ phím Search trên bàn phím ảo.

---

## 7. Cấu trúc Lưu trữ Bằng chứng Đóng dấu Watermark

Toàn bộ ảnh chụp màn hình minh chứng cho các ca kiểm thử được lưu trữ phân cấp tại thư mục:  
`HW3/evidence/screenshots/cross-platform/<CASE_ID>/`

Cấu trúc gồm:
- **35 thư mục Web & Admin** (`CHK-ADM-01` → `CHK-ADM-20` và `CHK-WEB-01` → `CHK-WEB-15`):
  - `<CASE_ID>/<CASE_ID>-chrome.png` (hoặc `.jpg`)
  - `<CASE_ID>/<CASE_ID>-firefox.png`
- **10 thư mục Mobile App** (`CHK-MOB-01` → `CHK-MOB-10`):
  - `<CASE_ID>/<CASE_ID>-expo.jpg` (ảnh chụp thực tế trên Realme C53, Android 15; riêng `CHK-MOB-07` và `CHK-MOB-08` có thêm `-p1.jpg` & `-p2.jpg` ghi nhận 2 trạng thái / đối chứng)

Tất cả các ảnh đều được xử lý đóng dấu dải banner watermark định danh sinh viên:
```powershell
python .claude/skills/cross-platform-gui-testing/scripts/overlay_username.py HW3/evidence/screenshots/cross-platform/ --email 23120319@student.hcmus.edu.vn --id 23120319 --name "Trương Thành Phát" --recursive --in-place
```
Dải banner ở chân ảnh thể hiện đầy đủ: **`23120319@student.hcmus.edu.vn | 23120319 - Trương Thành Phát | <Platform Name> | <Timestamp>`**, đảm bảo tuân thủ 100% quy định chống gian lận của đề bài HW03.
