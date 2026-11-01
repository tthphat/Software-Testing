# Bảng Checklist Kiểm thử Giao diện (GUI Checklist Testing) - EShop

## 1. Metadata
- **Hệ thống được kiểm thử (SUT)**: EShop Multi-Channel System
- **Phạm vi giao diện kiểm thử (3 Phân hệ UI chính)**:
  - **Giao diện Quản trị (Admin UI)**: `http://localhost:5174/` (20 mục)
  - **Giao diện Web Khách hàng (Customer Web UI)**: `http://localhost:5173/` (15 mục)
  - **Giao diện Ứng dụng Di động (Mobile App UI)**: Expo Go trên thiết bị di động (10 mục)
- **Người thực hiện**: TRƯƠNG THÀNH PHÁT
- **Mã số sinh viên (MSSV)**: 23120319
- **Lớp học phần**: Kiểm thử phần mềm - CQ2023/3 (FIT@HCMUS)
- **Phương pháp luận**: Áp dụng chuẩn CSC13003 S13 qua Agent Skill `gui-checklist-testing` (Bao phủ cả 4 khía cạnh IA-01 đến IA-04)

---

## 2. Bảng Checklist Đánh giá Giao diện EShop (45 mục: Admin 20, Web 15, Mobile 10)

| STT | Item ID | Aspect ID | Giao diện / Màn hình | Phần tử kiểm tra | Tiêu chí kiểm tra | Kết quả mong đợi | Trạng thái | Ghi chú (Notes / Lý do lỗi) | Defect ID |
|:---:|:---:|:---:|:---|:---|:---|:---|:---:|:---|:---|
| 1 | CHK-ADM-01 | IA-01 | Admin - Màn hình Login | Form Đăng nhập | Căn giữa hộp thoại đăng nhập (horizontal & vertical) trên các kích thước màn hình | Hộp thoại nằm chính giữa màn hình, padding và border cân đối | - | | |
| 2 | CHK-ADM-02 | IA-01 | Admin - Sidebar | Thanh Sidebar & Brand | Thanh sidebar màu tối (bg-gray-800), tiêu đề "EShop Admin" cỡ 2xl font bold phân tách thị giác rõ ràng | Sidebar tối màu tương phản tốt với text trắng, nhận diện thương hiệu rõ ràng | - | | |
| 3 | CHK-ADM-03 | IA-01 | Admin - Dashboard | Thẻ KPI Thống kê | 2 thẻ KPI (Tổng doanh thu, Tổng đơn hàng) xếp trong lưới 2 cột, đổ bóng nhẹ, padding cân đối | Thẻ hiển thị cân đối, số liệu doanh thu màu xanh lá nổi bật | - | | |
| 4 | CHK-ADM-04 | IA-01 | Admin - Bảng chung | Tiêu đề Bảng (Header) | Hàng header bảng màu xám (bg-gray-200), chữ đậm, phân cách rõ ràng với các hàng dữ liệu | Header nổi bật, căn lề đồng bộ ở tất cả các tab quản trị | - | | |
| 5 | CHK-ADM-05 | IA-01 | Admin - Đơn hàng | Huy hiệu Trạng thái (Badges) | Các trạng thái đơn hàng (pending, confirmed, shipping, delivered, canceled) có màu sắc tương ứng | Màu sắc chuẩn WCAG: Vàng (pending), Chàm (confirmed), Xanh (shipping), Xanh lá (delivered), Đỏ (canceled) | - | | |
| 6 | CHK-ADM-06 | IA-01 | Admin - Mã giảm giá | Định dạng Mã Coupon | Mã coupon trong bảng hiển thị kiểu font monospace, in đậm, màu cam nổi bật | Mã coupon dễ nhận diện, phân biệt rõ với text thông thường | - | | |
| 7 | CHK-ADM-07 | IA-02 | Admin - Màn hình Login | Validation Email & Password | Bấm nút Login khi để trống Email hoặc Password hiển thị cảnh báo validation | Chặn gửi request rỗng lên server, yêu cầu điền đủ thông tin | - | | |
| 8 | CHK-ADM-08 | IA-02 | Admin - Danh mục | Validation Tên Danh Mục | Bấm "Thêm mới" khi ô tên danh mục để trống hoặc chỉ chứa khoảng trắng thì chặn submit | Không cho phép tạo danh mục có tên rỗng trong cơ sở dữ liệu | - | | |
| 9 | CHK-ADM-09 | IA-02 | Admin - Danh mục | Reset Form sau Submit | Thêm danh mục thành công thì ô nhập tự động xóa rỗng (clear text) | Sẵn sàng cho người quản trị nhập tiếp danh mục mới | - | | |
| 10 | CHK-ADM-10 | IA-02 | Admin - Sản phẩm | Ký hiệu Trường Bắt buộc (*) | Có đánh dấu trực quan để phân biệt trường bắt buộc (Tên, Giá, Danh mục) vs trường tùy chọn | Người quản trị biết rõ thông tin tiên quyết cần điền trước khi lưu | - | | |
| 11 | CHK-ADM-11 | IA-02 | Admin - Sản phẩm | Validation Giá tiền Số âm | Nhập giá trị âm (ví dụ: -50,000) hoặc số 0 vào trường Giá tiền sẽ bị chặn hoặc báo lỗi | Ngăn tạo ra sản phẩm có giá trị âm trong hệ thống | - | | |
| 12 | CHK-ADM-12 | IA-02 | Admin - Coupon | Ràng buộc Ngày Hết hạn | Trường ngày hết hạn (type="date") không cho phép chọn ngày trong quá khứ | Ngăn tạo mã giảm giá đã hết hạn ngay từ thời điểm tạo | - | | |
| 13 | CHK-ADM-13 | IA-02 | Admin - Coupon | Giới hạn % Giảm giá Hợp lệ | Khi chọn loại phần trăm, giá trị nhập vào bắt buộc nằm trong khoảng 1% đến 100% | Ngăn chặn cấu hình coupon giảm quá 100% gây âm tiền đơn hàng | - | | |
| 14 | CHK-ADM-14 | IA-03 | Admin - Sidebar | Highlight Tab Đang chọn | Mục menu đang kích hoạt trong sidebar (activeTab) có màu chữ xanh nổi bật (text-blue-400) | Quản trị viên luôn biết rõ mình đang thao tác ở phân hệ nào | - | | |
| 15 | CHK-ADM-15 | IA-03 | Admin - Sidebar | Chuyển đổi qua lại các Tab | Bấm vào từng mục menu (Dashboard, Danh mục, SP, Coupon, Đơn hàng, Users) chuyển view mượt mà | Nội dung khu vực chính thay đổi tức thì theo tab được chọn | - | | |
| 16 | CHK-ADM-16 | IA-03 | Admin - Sidebar | Đăng xuất Quản trị | Bấm "Đăng xuất" xóa sạch adminToken khỏi localStorage và quay về màn hình Login | Hủy bỏ quyền quản trị an toàn, chặn Back lại trang cũ | - | | |
| 17 | CHK-ADM-17 | IA-03 | Admin - Import CSV | Tải File Mẫu (Template) | Bấm link tải mẫu tự động tải xuống tệp template_import.csv đúng cấu trúc cột | File CSV tải về máy mở được và đúng định dạng UTF-8 | - | | |
| 18 | CHK-ADM-18 | IA-04 | Admin - Dashboard | Đồng bộ Doanh thu Đơn hàng | Doanh thu chỉ tính trên các đơn "Delivered" và phản ánh chính xác 100% tiền thực tế | Không bị lỗi nhân đôi doanh thu (x2 bug), cập nhật ngay khi đổi trạng thái | - | | |
| 19 | CHK-ADM-19 | IA-04 | Admin - Sản phẩm | Phạm vi Cập nhật Sản phẩm | Chỉnh sửa tên 1 sản phẩm chỉ thay đổi duy nhất sản phẩm đó trong danh sách | Không bị lỗi lan truyền (mass-update làm đổi tên toàn bộ sản phẩm khác) | - | | |
| 20 | CHK-ADM-20 | IA-04 | Admin - Thao tác Xóa | Hộp thoại Xác nhận Xóa | Bấm nút Xóa (Danh mục, Sản phẩm, Coupon) hiển thị confirm dialog trước khi xóa cứng | Bảo vệ dữ liệu khỏi các cú click chuột vô ý | - | | |
| 21 | CHK-WEB-01 | IA-01 | Web - Trang chủ | Lưới Sản phẩm (Product Grid) | Danh sách sản phẩm hiển thị dạng lưới (grid 3 cột trên desktop), khoảng cách giữa các thẻ đều đặn | Thẻ sản phẩm không bị méo, xếp hàng thẳng thớm, padding cân đối | - | | |
| 22 | CHK-WEB-02 | IA-01 | Web - Trang chủ | Cắt ngắn Tiêu đề (Truncation) | Tên sản phẩm quá dài được xử lý cắt ngắn gọn gàng (truncate), không làm vỡ độ cao thẻ | Thẻ giữ nguyên chiều cao chuẩn, text không tràn ra ngoài | - | | |
| 23 | CHK-WEB-03 | IA-01 | Web - Trang chủ | Định dạng Tiền tệ | Giá sản phẩm hiển thị phân cách hàng nghìn và ký hiệu tiền tệ thống nhất | Hiển thị dạng "150,000 VND" hoặc "150,000 ₫", font bold màu đỏ | - | | |
| 24 | CHK-WEB-04 | IA-01 | Web - Giỏ hàng | Trạng thái Giỏ hàng Trống | Khi giỏ hàng rỗng, hiển thị thông báo rõ ràng kèm link điều hướng tiếp tục mua sắm | Thông báo "Giỏ hàng của bạn đang trống" căn giữa trang | - | | |
| 25 | CHK-WEB-05 | IA-01 | Web - Tìm kiếm | Hiển thị Từ khóa Tìm kiếm | Hiển thị an toàn xâu ký tự tìm kiếm, mã hóa HTML entities ngăn ngừa tấn công XSS | Không thực thi mã script hoặc tag HTML khi người dùng tìm kiếm payload lạ | - | | |
| 26 | CHK-WEB-06 | IA-02 | Web - Tìm kiếm | Form Tìm kiếm Sản phẩm | Ô tìm kiếm có placeholder rõ ràng, bấm Enter hoặc nút "Tìm" gửi truy vấn lên server | Tìm kiếm trả về kết quả lọc tương ứng với từ khóa | - | | |
| 27 | CHK-WEB-07 | IA-02 | Web - Chi tiết SP | Nhập Số lượng (Quantity Boundary) | Ô nhập số lượng chỉ nhận số nguyên dương, chặn nhập số 0, số âm hoặc ký tự chữ | Tự động đưa về giá trị 1 nếu nhập số không hợp lệ | - | | |
| 28 | CHK-WEB-08 | IA-04 | Web - Thanh toán | Màn hình Xác nhận Đặt hàng | Thanh toán xong hiển thị màn hình chúc mừng "Thanh toán thành công" và làm trống giỏ | Trạng thái giỏ hàng reset về 0, không cho phép thanh toán lặp lại | - | | |
| 29 | CHK-WEB-09 | IA-02 | Web - Thanh toán | Tự động Viết hoa Mã Coupon | Ký tự nhập vào ô mã giảm giá tự động chuyển thành chữ hoa (VD: "save10" -> "SAVE10") | Đảm bảo tính nhất quán của mã ưu đãi trong cơ sở dữ liệu | - | | |
| 30 | CHK-WEB-10 | IA-02 | Web - Đăng nhập | Che giấu Mật khẩu & Tab Order | Trường Password có kiểu type="password", phím Tab chuyển tuần tự Email -> Pass -> Submit | Bảo mật thông tin xác thực, điều hướng phím chuẩn mực | - | | |
| 31 | CHK-WEB-11 | IA-03 | Web - Header | Menu Điều hướng Chính | Các link trên header (Trang chủ, Giỏ hàng, Đăng nhập, Tài khoản) chuyển hướng đúng trang | Bấm vào link nào chuyển ngay đến đúng route tương ứng | - | | |
| 32 | CHK-WEB-12 | IA-03 | Web - Trang chủ | Link Xem Chi tiết Sản phẩm | Bấm vào ảnh hoặc nút "Xem chi tiết" mở đúng trang chi tiết của sản phẩm đó | URL cập nhật thành `/product/:id`, hiển thị đúng dữ liệu sản phẩm | - | | |
| 33 | CHK-WEB-13 | IA-03 | Web - Giỏ hàng | Nút Tiến hành Thanh toán | Bấm "Tiến hành thanh toán" chuyển sang trang checkout (nếu đã login) hoặc nhắc login | Điều hướng đúng luồng nghiệp vụ mua sắm | - | | |
| 34 | CHK-WEB-14 | IA-04 | Web - Chi tiết SP | Phản hồi Thêm vào Giỏ hàng | Bấm "Thêm vào giỏ hàng" hiển thị thông báo thành công hoặc badge số lượng cập nhật | Người dùng biết sản phẩm đã được đưa vào giỏ hàng | - | | |
| 35 | CHK-WEB-15 | IA-02 | Web - Thanh toán | Khóa Ô Tổng tiền Thanh toán | Tổng tiền đơn hàng là trường chỉ đọc (Read-only), tuyệt đối không cho phép người dùng sửa tay | Ngăn chặn gian lận tự ý sửa đổi tổng tiền cần trả của đơn hàng | - | | |
| 36 | CHK-MOB-01 | IA-04 | Mobile - Danh sách SP | Chỉ báo Đang tải (Loading) | Hiển thị vòng xoay spinner khi đang fetch danh sách sản phẩm từ backend | Người dùng nhận biết ứng dụng đang nạp dữ liệu | - | | |
| 37 | CHK-MOB-02 | IA-01 | Mobile - Trang chủ | Vùng chạm Cảm ứng (Touch Target) | Các nút bấm và icon tương tác có kích thước tối thiểu đạt chuẩn ngón tay (>= 48x48px) | Dễ chạm bằng ngón tay cái, không bấm nhầm phần tử liền kề | - | | |
| 38 | CHK-MOB-03 | IA-01 | Mobile - Toàn app | Hiển thị Dấu tiếng Việt | Phông chữ hệ thống hiển thị mượt mà các ký tự tiếng Việt có dấu, không bị vỡ font | Các từ tiếng Việt như "Đăng ký", "Giỏ hàng", "Thanh toán" hiển thị chuẩn | - | | |
| 39 | CHK-MOB-04 | IA-02 | Mobile - Tìm kiếm | Nút Tìm trên Bàn phím Ảo | Bấm nút Search/Enter trên bàn phím ảo điện thoại kích hoạt tìm kiếm mà không cần bấm icon | Thao tác tìm kiếm một chạm tiện lợi trên di động | - | | |
| 40 | CHK-MOB-05 | IA-04 | Mobile - Đặt hàng | Bảo toàn Số lượng Sản phẩm khi Đặt | Khi bấm Đặt hàng với giỏ có nhiều sản phẩm, hệ thống gửi đầy đủ toàn bộ mặt hàng | Không bị lỗi mất mặt hàng cuối cùng trong giỏ (loại bỏ bug slice(0, -1)) | - | | |
| 41 | CHK-MOB-06 | IA-02 | Mobile - Chi tiết SP | Tăng giảm Số lượng Chạm | Các nút tăng/giảm số lượng (+ / -) dễ chạm trên màn hình cảm ứng, phản hồi nhạy | Tăng/giảm đúng 1 đơn vị sau mỗi cú chạm | - | | |
| 42 | CHK-MOB-07 | IA-03 | Mobile - Header | Nút Quay lại (Back Arrow) | Khi đang ở màn hình Chi tiết sản phẩm hoặc Giỏ hàng, nút Back đưa về Trang chủ | Điều hướng quay lui mượt mà, không bị văng ứng dụng | - | | |
| 43 | CHK-MOB-08 | IA-03 | Mobile - Điều hướng | Nút Back Cứng của Android | Bấm phím Back vật lý/cử chỉ trên Android xử lý back màn hình con trước khi thoát app | Trải nghiệm điều hướng chuẩn native Android | - | | |
| 44 | CHK-MOB-09 | IA-01 | Mobile - Trang chủ | Vùng an toàn Tai thỏ (Safe Area) | Giao diện tự động căn lề né camera tai thỏ (notch) và thanh điều hướng dưới đáy màn hình | Nội dung không bị đè lên thanh trạng thái pin/sóng của điện thoại | - | | |
| 45 | CHK-MOB-10 | IA-02 | Mobile - Đăng nhập | Tránh Bàn phím Che Khuất | Khi mở bàn phím ảo để nhập thông tin, form đăng nhập tự động đẩy lên tránh bị che nút Submit | Người dùng luôn nhìn thấy ô đang gõ và nút Submit | - | | |

---

## 3. Bảng Phân tích Khoảng trống AI (AI Gap Analysis Table - Stage 3)

| Added Item ID | Aspect ID | Tiêu chí Bổ sung (Missing Verification Aspect) | Nhóm Nguyên nhân (Root Cause Category) | Giải trình Chi tiết vì sao AI bỏ sót (Explanation of Why AI Missed It) |
|:---:|:---:|:---|:---:|:---|
| **CHK-MOB-09** | **IA-01** | Tràn lề giao diện vào camera tai thỏ (Notch) & Thanh điều hướng Mobile | `Model limitation` | Mô hình ngôn ngữ mặc định hình dung giao diện hiển thị trên một khung chữ nhật phẳng chuẩn (viewport desktop), hoàn toàn không nhận thức được phần cứng vật lý của điện thoại thật (camera notch, tai thỏ, viền cong góc màn hình) nếu không có sự can thiệp của người kiểm thử. **Lý do gốc rễ**: Trong React Native, thẻ <SafeAreaView> của gói react-native gốc chỉ có tác dụng né tai thỏ trên iOS. Trên Android, nó hoàn toàn vô tác dụng và không hề tự động cộng thêm khoảng cách chiều cao của thanh trạng thái (StatusBar.currentHeight). Do đó, thanh navBar màu xanh bị kéo tràn lên tận $y=0$ làm đè toàn bộ nút bấm vào thanh trạng thái.|
| **CHK-WEB-15** | **IA-02** | Lỗ hổng cho phép người dùng tự sửa tổng tiền thanh toán (Editable Total) | `Inherent UI complexity` | Logic cho phép sửa ô input tổng tiền là một lỗ hổng thiết kế nghiệp vụ dị biệt trong `Checkout.jsx`. AI kiểm thử thông thường luôn mặc định tổng tiền là trường chỉ đọc (read-only text), bỏ qua việc kiểm tra xem thẻ `<input>` có bị gán state sửa đổi được hay không. |
| **CHK-MOB-10** | **IA-02** | Bàn phím ảo che khuất form nhập liệu và nút Submit trên Mobile | `Inherent UI complexity` | Hiện tượng bàn phím ảo (Soft Keyboard) tự động trồi lên khi focus input và che mất nút CTA hành động là đặc thù động của hệ điều hành di động. AI không thể phát hiện lỗi này nếu chỉ phân tích mã nguồn JSX tĩnh mà không thực thi trên thiết bị thật. |

---

## 4. Báo cáo Tóm tắt Phân bổ Khía cạnh & Giao diện (Aspect & Screen Distribution)

### A. Phân bổ theo 3 Giao diện Người dùng (SUT UI Distribution):
- **Giao diện Quản trị (Admin UI `http://localhost:5174/`)**: **20 mục** (44.4%)
- **Giao diện Web Khách hàng (Customer Web `http://localhost:5173/`)**: **15 mục** (33.3%)
- **Giao diện Ứng dụng Di động (Mobile App Expo Go)**: **10 mục** (22.2%)
- **Tổng cộng**: **45 mục** (Đạt chuẩn $> 40$ mục theo yêu cầu đề bài HW03).

### B. Phân bổ theo 4 Khía cạnh Giao diện (Interface Aspects Coverage):
- **IA-01 (Chuẩn UI chung - General UI Standards)**: 14 mục (31.1%)
- **IA-02 (Form - Biểu mẫu)**: 15 mục (33.3%)
- **IA-03 (Điều hướng - Navigation)**: 9 mục (20.0%)
- **IA-04 (Phản hồi & Trạng thái - Feedback & State)**: 7 mục (15.6%)
