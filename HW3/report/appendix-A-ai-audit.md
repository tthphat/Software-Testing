# Phụ lục A - AI Audit Report
**Môn học:** CS423 / CSC13003 - Kiểm thử phần mềm (AI-augmented · 2026)  
**Khoa Công nghệ Thông tin (FIT) — Trường Đại học Khoa học Tự nhiên (HCMUS)**  
**CHÍNH SÁCH AI · BIỂU MẪU — 2026 v1.0 (Mẫu 5 mục cho mỗi Artifact)**

---

## 1. Thông tin Sinh viên

| Mục | Giá trị |
|:---|:---|
| **Họ tên sinh viên (in hoa)** | **TRƯƠNG THÀNH PHÁT** |
| **MSSV** | **23120319** |
| **Lớp / Khóa** | Kiểm thử phần mềm - CQ2023/3 - Khóa 2023 |
| **Mã bài tập** | HW#03 — GUI, Usability & Cross-Platform Testing |
| **Ngày làm bài** | 08/11/2026 |
| **Công cụ AI đã dùng** | Antigravity (Gemini 2.5 Flash / Claude 3.7 Sonnet), Claude Code |
| **Khai báo sử dụng AI** | [x] Có &nbsp;&nbsp;&nbsp;&nbsp; [ ] Không |

---

## 2. Hướng dẫn (đọc trước khi điền)
1. Thêm 1 hàng trong bảng tổng hợp và 1 mục chi tiết cho mỗi artifact do AI sinh (checklist, script, task scenario, báo cáo bug, ma trận test...).
2. Dán nguyên văn prompt — KHÔNG paraphrase.
3. Dán nguyên văn output AI (hoặc tóm lược trung thực nội dung output).
4. Gắn nhãn: `VALID` / `INVALID` / `INCOMPLETE`.
5. Lý do phải dẫn chiếu tiêu chuẩn ISTQB, Slide bài giảng S13, hoặc RFC kỹ thuật.
6. Hiển thị bản sinh viên sửa với phần thay đổi và đối soát thực tế.

---

## 3. Bảng Audit — 1 hàng / artifact (Tổng hợp)

| # | Giai đoạn / Tác vụ kiểm thử (Artifact Step) | Công cụ AI | Verdict | Ghi chú thẩm tra của sinh viên |
|:---:|:---|:---|:---:|:---|
| **A01** | Task 1: Khởi tạo GUI Checklist 4 Khía cạnh bằng Agent Skill | Antigravity | `INCOMPLETE` | AI sinh 42 mục ban đầu; sinh viên thực hiện AI Gap Analysis bổ sung 3 ca kiểm thử (CHK-WEB-15, CHK-MOB-09, CHK-MOB-10) nâng lên 45 mục |
| **A02** | Task 1: Thực thi thẩm định Checklist bằng script trong Skill (`validate_checklist.mjs`) | Antigravity | `VALID` | Áp dụng skill chạy script Node.js kiểm tra cú pháp checkbox, tỷ lệ Pass/Fail chuẩn xác |
| **A03** | Task 1: Báo cáo 19 Lỗi GUI (`BUG-GUI-01` → `19`) & GitHub Issues drafts | Antigravity | `VALID` | Cấu trúc đầy đủ metadata, mã nguồn SUT, ảnh chụp watermark email `23120319` |
| **A04** | Task 3: Lập Ma trận Đối chiếu Đa nền tảng bằng Agent Skill (`cross-platform-gui-testing`) | Antigravity | `VALID` | Áp dụng skill phân tích độ lệch UI Skew, đối chiếu giao diện Desktop vs Mobile |
| **A05** | Task 3: Đóng dấu Watermark ảnh bằng script trong Skill (`overlay_watermark.py`) | Antigravity | `VALID` | Áp dụng script của skill tự động hóa đóng dấu email sinh viên lên toàn bộ 82 ảnh |
| **A06** | Task 2: Thiết kế Kịch bản Nhiệm vụ Hướng mục tiêu bằng Agent Skill | Antigravity | `VALID` | Áp dụng skill chuẩn hóa 4 thành phần Slide 40: Nhiệm vụ, Trạng thái máy, Tiêu chí, Benchmark |
| **A07** | Task 2: Tính toán và Phân tích Thang đo SUS bằng Agent Skill (`calculate_sus.mjs`) | Antigravity | `VALID` | Áp dụng script trong skill tính toán công thức John Brooke 1996, Mean 66.07, Bangor Grade C |
| **A08** | Task 2: Báo cáo Lỗi Khả dụng (`BUG-UX-01` → `03`) & Video Minh chứng | Antigravity | `INCOMPLETE` | AI đề xuất sai `BUG-UX-04` (Enter phím cứng); sinh viên kiểm tra code gỡ bỏ, giữ 3 bug thật |
| **A09** | Task 4: Đọc Yêu cầu HW03 & Xây dựng Bộ 3 Custom Agent Skills chuẩn hóa | Antigravity | `VALID` | Đọc spec HW03 & Slide S13, đóng gói hoàn chỉnh 3 skills kèm scripts, references, schemas |

---

## 4. Chi tiết Audit từng Artifact — Mẫu 5 mục chuẩn FIT@HCMUS

### Artifact A01 — Task 1: Khởi tạo GUI Checklist 4 Khía cạnh

#### (1) Prompt + Công cụ
- **Tool:** Antigravity (Gemini 2.5 Flash)
- **Thời gian:** 09:30 01/11/2026
- **Prompt:**
> "Áp dụng skill gui-checklist và dựa trên Slide bài giảng CSC13003 S13 (GUI & Usability Testing), hãy thiết kế một bản Checklist kiểm thử giao diện toàn diện (>40 mục) cho hệ thống EShop (Admin Web, Customer Web, Mobile Expo Go) chia làm 4 khía cạnh IA-01 đến IA-04."

#### (2) Output AI
> Dưới đây là bản thảo 42 mục kiểm thử giao diện ban đầu do AI khởi tạo, bao phủ 3 phân hệ (Admin UI: 20 mục, Customer Web: 14 mục, Mobile Expo Go: 8 mục):

| STT | Item ID | Aspect ID | Giao diện / Màn hình | Phần tử kiểm tra | Tiêu chí kiểm tra | Kết quả mong đợi |
|:---:|:---:|:---:|:---|:---|:---|:---|
| 1 | CHK-ADM-01 | IA-01 | Admin - Màn hình Login | Form Đăng nhập | Căn giữa hộp thoại đăng nhập (horizontal & vertical) trên các kích thước màn hình | Hộp thoại nằm chính giữa màn hình, padding và border cân đối |
| 2 | CHK-ADM-02 | IA-01 | Admin - Sidebar | Thanh Sidebar & Brand | Thanh sidebar màu tối (bg-gray-800), tiêu đề "EShop Admin" cỡ 2xl font bold phân tách thị giác rõ ràng | Sidebar tối màu tương phản tốt với text trắng, nhận diện thương hiệu rõ ràng |
| 3 | CHK-ADM-03 | IA-01 | Admin - Dashboard | Thẻ KPI Thống kê | 2 thẻ KPI (Tổng doanh thu, Tổng đơn hàng) xếp trong lưới 2 cột, đổ bóng nhẹ, padding cân đối | Thẻ hiển thị cân đối, số liệu doanh thu màu xanh lá nổi bật |
| 4 | CHK-ADM-04 | IA-01 | Admin - Bảng chung | Tiêu đề Bảng (Header) | Hàng header bảng màu xám (bg-gray-200), chữ đậm, phân cách rõ ràng với các hàng dữ liệu | Header nổi bật, căn lề đồng bộ ở tất cả các tab quản trị |
| 5 | CHK-ADM-05 | IA-01 | Admin - Đơn hàng | Huy hiệu Trạng thái (Badges) | Các trạng thái đơn hàng (pending, confirmed, shipping, delivered, canceled) có màu sắc tương ứng | Màu sắc chuẩn WCAG: Vàng (pending), Chàm (confirmed), Xanh (shipping), Xanh lá (delivered), Đỏ (canceled) |
| 6 | CHK-ADM-06 | IA-01 | Admin - Mã giảm giá | Định dạng Mã Coupon | Mã coupon trong bảng hiển thị kiểu font monospace, in đậm, màu cam nổi bật | Mã coupon dễ nhận diện, phân biệt rõ với text thông thường |
| 7 | CHK-ADM-07 | IA-02 | Admin - Màn hình Login | Validation Email & Password | Bấm nút Login khi để trống Email hoặc Password hiển thị cảnh báo validation | Chặn gửi request rỗng lên server, yêu cầu điền đủ thông tin |
| 8 | CHK-ADM-08 | IA-02 | Admin - Danh mục | Validation Tên Danh Mục | Bấm "Thêm mới" khi ô tên danh mục để trống hoặc chỉ chứa khoảng trắng thì chặn submit | Không cho phép tạo danh mục có tên rỗng trong cơ sở dữ liệu |
| 9 | CHK-ADM-09 | IA-02 | Admin - Danh mục | Reset Form sau Submit | Thêm danh mục thành công thì ô nhập tự động xóa rỗng (clear text) | Sẵn sàng cho người quản trị nhập tiếp danh mục mới |
| 10 | CHK-ADM-10 | IA-02 | Admin - Sản phẩm | Ký hiệu Trường Bắt buộc (*) | Có đánh dấu trực quan để phân biệt trường bắt buộc (Tên, Giá, Danh mục) vs trường tùy chọn | Người quản trị biết rõ thông tin tiên quyết cần điền trước khi lưu |
| 11 | CHK-ADM-11 | IA-02 | Admin - Sản phẩm | Validation Giá tiền Số âm | Nhập giá trị âm (ví dụ: -50,000) hoặc số 0 vào trường Giá tiền sẽ bị chặn hoặc báo lỗi | Ngăn tạo ra sản phẩm có giá trị âm trong hệ thống |
| 12 | CHK-ADM-12 | IA-02 | Admin - Coupon | Ràng buộc Ngày Hết hạn | Trường ngày hết hạn (type="date") không cho phép chọn ngày trong quá khứ | Ngăn tạo mã giảm giá đã hết hạn ngay từ thời điểm tạo |
| 13 | CHK-ADM-13 | IA-02 | Admin - Coupon | Giới hạn % Giảm giá Hợp lệ | Khi chọn loại phần trăm, giá trị nhập vào bắt buộc nằm trong khoảng 1% đến 100% | Ngăn chặn cấu hình coupon giảm quá 100% gây âm tiền đơn hàng |
| 14 | CHK-ADM-14 | IA-03 | Admin - Sidebar | Highlight Tab Đang chọn | Mục menu đang kích hoạt trong sidebar (activeTab) có màu chữ xanh nổi bật (text-blue-400) | Quản trị viên luôn biết rõ mình đang thao tác ở phân hệ nào |
| 15 | CHK-ADM-15 | IA-03 | Admin - Sidebar | Chuyển đổi qua lại các Tab | Bấm vào từng mục menu (Dashboard, Danh mục, SP, Coupon, Đơn hàng, Users) chuyển view mượt mà | Nội dung khu vực chính thay đổi tức thì theo tab được chọn |
| 16 | CHK-ADM-16 | IA-03 | Admin - Sidebar | Đăng xuất Quản trị | Bấm "Đăng xuất" xóa sạch adminToken khỏi localStorage và quay về màn hình Login | Hủy bỏ quyền quản trị an toàn, chặn Back lại trang cũ |
| 17 | CHK-ADM-17 | IA-03 | Admin - Import CSV | Tải File Mẫu (Template) | Bấm link tải mẫu tự động tải xuống tệp template_import.csv đúng cấu trúc cột | File CSV tải về máy mở được và đúng định dạng UTF-8 |
| 18 | CHK-ADM-18 | IA-04 | Admin - Dashboard | Đồng bộ Doanh thu Đơn hàng | Doanh thu chỉ tính trên các đơn "Delivered" và phản ánh chính xác 100% tiền thực tế | Không bị lỗi nhân đôi doanh thu (x2 bug), cập nhật ngay khi đổi trạng thái |
| 19 | CHK-ADM-19 | IA-04 | Admin - Sản phẩm | Phạm vi Cập nhật Sản phẩm | Chỉnh sửa tên 1 sản phẩm chỉ thay đổi duy nhất sản phẩm đó trong danh sách | Không bị lỗi lan truyền (mass-update làm đổi tên toàn bộ sản phẩm khác) |
| 20 | CHK-ADM-20 | IA-04 | Admin - Thao tác Xóa | Hộp thoại Xác nhận Xóa | Bấm nút Xóa (Danh mục, Sản phẩm, Coupon) hiển thị confirm dialog trước khi xóa cứng | Bảo vệ dữ liệu khỏi các cú click chuột vô ý |
| 21 | CHK-WEB-01 | IA-01 | Web - Trang chủ | Lưới Sản phẩm (Product Grid) | Danh sách sản phẩm hiển thị dạng lưới (grid 3 cột trên desktop), khoảng cách giữa các thẻ đều đặn | Thẻ sản phẩm không bị méo, xếp hàng thẳng thớm, padding cân đối |
| 22 | CHK-WEB-02 | IA-01 | Web - Trang chủ | Cắt ngắn Tiêu đề (Truncation) | Tên sản phẩm quá dài được xử lý cắt ngắn gọn gàng (truncate), không làm vỡ độ cao thẻ | Thẻ giữ nguyên chiều cao chuẩn, text không tràn ra ngoài |
| 23 | CHK-WEB-03 | IA-01 | Web - Trang chủ | Định dạng Tiền tệ | Giá sản phẩm hiển thị phân cách hàng nghìn và ký hiệu tiền tệ thống nhất | Hiển thị dạng "150,000 VND" hoặc "150,000 ₫", font bold màu đỏ |
| 24 | CHK-WEB-04 | IA-01 | Web - Giỏ hàng | Trạng thái Giỏ hàng Trống | Khi giỏ hàng rỗng, hiển thị thông báo rõ ràng kèm link điều hướng tiếp tục mua sắm | Thông báo "Giỏ hàng của bạn đang trống" căn giữa trang |
| 25 | CHK-WEB-05 | IA-01 | Web - Tìm kiếm | Hiển thị Từ khóa Tìm kiếm | Hiển thị an toàn xâu ký tự tìm kiếm, mã hóa HTML entities ngăn ngừa tấn công XSS | Không thực thi mã script hoặc tag HTML khi người dùng tìm kiếm payload lạ |
| 26 | CHK-WEB-06 | IA-02 | Web - Tìm kiếm | Form Tìm kiếm Sản phẩm | Ô tìm kiếm có placeholder rõ ràng, bấm Enter hoặc nút "Tìm" gửi truy vấn lên server | Tìm kiếm trả về kết quả lọc tương ứng với từ khóa |
| 27 | CHK-WEB-07 | IA-02 | Web - Chi tiết SP | Nhập Số lượng (Quantity Boundary) | Ô nhập số lượng chỉ nhận số nguyên dương, chặn nhập số 0, số âm hoặc ký tự chữ | Tự động đưa về giá trị 1 nếu nhập số không hợp lệ |
| 28 | CHK-WEB-08 | IA-04 | Web - Thanh toán | Màn hình Xác nhận Đặt hàng | Thanh toán xong hiển thị màn hình chúc mừng "Thanh toán thành công" và làm trống giỏ | Trạng thái giỏ hàng reset về 0, không cho phép thanh toán lặp lại |
| 29 | CHK-WEB-09 | IA-02 | Web - Thanh toán | Tự động Viết hoa Mã Coupon | Ký tự nhập vào ô mã giảm giá tự động chuyển thành chữ hoa (VD: "save10" -> "SAVE10") | Đảm bảo tính nhất quán của mã ưu đãi trong cơ sở dữ liệu |
| 30 | CHK-WEB-10 | IA-02 | Web - Đăng nhập | Che giấu Mật khẩu | Trường Password có kiểu type="password", phím Tab chuyển tuần tự Email -> Pass -> Submit | Bảo mật thông tin xác thực, điều hướng phím chuẩn mực |
| 31 | CHK-WEB-11 | IA-03 | Web - Header | Menu Điều hướng Chính | Các link trên header (Trang chủ, Giỏ hàng, Đăng nhập, Tài khoản) chuyển hướng đúng trang | Bấm vào link nào chuyển ngay đến đúng route tương ứng |
| 32 | CHK-WEB-12 | IA-03 | Web - Trang chủ | Link Xem Chi tiết Sản phẩm | Bấm vào nút "Xem chi tiết" mở đúng trang chi tiết của sản phẩm đó | URL cập nhật thành `/product/:id`, hiển thị đúng dữ liệu sản phẩm |
| 33 | CHK-WEB-13 | IA-03 | Web - Giỏ hàng | Nút Tiến hành Thanh toán | Bấm "Tiến hành thanh toán" chuyển sang trang checkout (nếu đã login) hoặc nhắc login | Điều hướng đúng luồng nghiệp vụ mua sắm |
| 34 | CHK-WEB-14 | IA-04 | Web - Chi tiết SP | Phản hồi Thêm vào Giỏ hàng | Bấm "Thêm vào giỏ hàng" button chuyển thành hiển thị "đã thêm" | Người dùng biết sản phẩm đã được đưa vào giỏ hàng |
| 35 | CHK-MOB-01 | IA-04 | Mobile - Danh sách SP | Chỉ báo Đang tải (Loading) | Hiển thị chữ "đang tải" khi đang fetch danh sách sản phẩm từ backend | Người dùng nhận biết ứng dụng đang nạp dữ liệu |
| 36 | CHK-MOB-02 | IA-01 | Mobile - Trang chủ | Vùng chạm Cảm ứng (Touch Target) | Các nút bấm và icon tương tác có kích thước tối thiểu đạt chuẩn ngón tay (>= 48x48px) | Dễ chạm bằng ngón tay cái, không bấm nhầm phần tử liền kề |
| 37 | CHK-MOB-03 | IA-01 | Mobile - Toàn app | Hiển thị Dấu tiếng Việt | Phông chữ hệ thống hiển thị mượt mà các ký tự tiếng Việt có dấu, không bị vỡ font | Các từ tiếng Việt như "Đăng ký", "Giỏ hàng", "Thanh toán" hiển thị chuẩn |
| 38 | CHK-MOB-04 | IA-02 | Mobile - Tìm kiếm | Nút Tìm trên Bàn phím Ảo | Bấm nút Search/Enter trên bàn phím ảo điện thoại kích hoạt tìm kiếm mà không cần bấm icon | Thao tác tìm kiếm một chạm tiện lợi trên di động |
| 39 | CHK-MOB-05 | IA-04 | Mobile - Đặt hàng | Bảo toàn Số lượng Sản phẩm khi Đặt | Khi bấm Đặt hàng với giỏ có nhiều sản phẩm, hệ thống gửi đầy đủ toàn bộ mặt hàng | Không bị lỗi mất mặt hàng cuối cùng trong giỏ (loại bỏ bug slice(0, -1)) |
| 40 | CHK-MOB-06 | IA-02 | Mobile - Chi tiết SP | Tăng giảm Số lượng Chạm | Các nút tăng/giảm số lượng (+ / -) dễ chạm trên màn hình cảm ứng, phản hồi nhạy | Tăng/giảm đúng 1 đơn vị sau mỗi cú chạm |
| 41 | CHK-MOB-07 | IA-03 | Mobile - Chi tiết SP | Nút Quay lại (Back Arrow) | Khi đang ở màn hình Chi tiết sản phẩm, nút Back đưa về Trang chủ | Điều hướng quay lui mượt mà, không bị văng ứng dụng |
| 42 | CHK-MOB-08 | IA-03 | Mobile - Điều hướng | Nút Back Cứng của Android | Bấm phím Back vật lý/cử chỉ trên Android xử lý back màn hình con trước khi thoát app | Trải nghiệm điều hướng chuẩn native Android |

#### (3) Verdict
`INCOMPLETE`

#### (4) Lý do (ISTQB)
Theo tiêu chuẩn **ISTQB FL §4.3 (Black-box Test Design Techniques)** và **Slide 22-38 CSC13003 S13**, checklist kiểm thử giao diện không chỉ dừng lại ở tính thẩm mỹ bề mặt mà phải gắn liền với ngữ cảnh nghiệp vụ, kiểm soát tính toàn vẹn biểu mẫu và tương tác vật lý phần cứng (*Context-driven / Platform & Security Alignment*). Bản nháp 42 mục ban đầu của AI mang tính tĩnh (static analysis), hoàn toàn bỏ sót các rủi ro vận hành runtime then chốt:
1. Lỗ hổng cho phép khách hàng sửa tay ô tổng tiền trên trang Checkout (`Inherent UI complexity`).
2. Giới hạn hiển thị Safe Area né thanh trạng thái Status Bar trên hệ điều hành Android thật (`Model limitation`).
3. Tương tác bàn phím ảo (Soft Keyboard) trồi lên che khuất form nhập liệu và nút Submit trên thiết bị di động (`Inherent UI complexity`).

#### (5) Bản SV sửa
Sau khi đối soát mã nguồn SUT (`Checkout.jsx`, `App.js`) và kiểm thử trực tiếp trên thiết bị di động, sinh viên nhận thấy bản nháp 42 mục của AI đã bỏ sót 3 khía cạnh kiểm thử quan trọng về bảo mật nghiệp vụ và tương tác di động. Sinh viên đã tiến hành **AI Gap Analysis (Stage 3)** và bổ sung trực tiếp **3 ca kiểm thử thiết yếu** sau:

| STT | Item ID | Aspect ID | Giao diện / Màn hình | Phần tử kiểm tra | Tiêu chí kiểm tra | Kết quả mong đợi | Nhóm Nguyên nhân | Giải trình chi tiết vì sao AI bỏ sót |
|:---:|:---:|:---:|:---|:---|:---|:---|:---|:---|
| 35 | **CHK-WEB-15** | **IA-02** | Web - Thanh toán | Khóa Ô Tổng tiền Thanh toán | Tổng tiền đơn hàng là trường chỉ đọc (Read-only), tuyệt đối không cho phép người dùng sửa tay | Ngăn chặn gian lận tự ý sửa đổi tổng tiền cần trả của đơn hàng | `Inherent UI complexity` | Khi phân tích mã nguồn tĩnh, AI mặc định tổng tiền luôn là dữ liệu số chỉ đọc được tính từ giỏ hàng. Sinh viên với tư duy bảo mật biểu mẫu (Form Security) phát hiện `Checkout.jsx:L14` tạo state `editableTotal` cho phép sửa tay số tiền, nên đã bổ sung ca kiểm thử này để phát hiện lỗ hổng nghiêm trọng. |
| 44 | **CHK-MOB-09** | **IA-01** | Mobile - Trang chủ | Vùng an toàn Tai thỏ & Status Bar (Safe Area) | Giao diện thanh header/navBar tự động căn lề né camera tai thỏ (notch) và thanh trạng thái (Status Bar) trên cả iOS lẫn Android | Nội dung, nút bấm và tiêu đề không bị đè lấn lên đồng hồ, icon pin/sóng của điện thoại | `Model limitation` | LLM mặc định hình dung viewport desktop phẳng, không nhận thức được giới hạn vật lý của điện thoại thật. Trong React Native, `<SafeAreaView>` gốc không có tác dụng trên Android nếu thiếu cộng `StatusBar.currentHeight`. Do đó, thanh navBar bị đè lấn lên status bar khi chạy trên Android thật. |
| 45 | **CHK-MOB-10** | **IA-02** | Mobile - Product detail | Tránh Bàn phím Che Khuất | Khi mở bàn phím ảo để nhập thông tin, form chi tiết sản phẩm tự động đẩy lên tránh bị che nút Submit | Người dùng luôn nhìn thấy ô đang gõ và nút Submit | `Inherent UI complexity` | Hiện tượng bàn phím ảo (Soft Keyboard) trồi lên che khuất nút bấm là tương tác động runtime đặc thù của mobile OS. AI phân tích JSX tĩnh không thể mô phỏng hành vi che khuất nếu thiếu `KeyboardAvoidingView`. Sinh viên test trên điện thoại thật đã bổ sung ca này. |

Nhờ bổ sung 3 ca kiểm thử trên, tổng số tiêu chí checklist đã được nâng từ 42 lên **45 mục hoàn chỉnh**, bao phủ toàn diện 4 khía cạnh IA-01 đến IA-04 và phát hiện được 3 lỗi quan trọng trong quá trình thực thi: `BUG-GUI-12` (sửa tổng tiền), `BUG-GUI-17` (lỗi Safe Area), và `BUG-GUI-18` (bàn phím che nút).

---

### Artifact A02 — Task 1: Thực thi thẩm định Checklist bằng Agent Skill (`validate_checklist.mjs`)

#### (1) Prompt + Công cụ
- **Tool:** Antigravity (Claude 3.7 Sonnet)
- **Thời gian:** 15:20 01/11/2026
- **Prompt:**
> "Áp dụng skill gui-checklist-testing, chạy script validate_checklist.mjs trên file HW3/report/checklist.md để kiểm tra tính toàn vẹn cú pháp (>40 mục, checkbox [x] và [ ], phân bố theo IA-01..IA-04) và xuất thống kê tự động tỷ lệ Pass/Fail."

#### (2) Output AI
```text
====================================================================
📋 BÁO CÁO KIỂM TOÁN CHECKLIST GUI: checklist.md
====================================================================

1️⃣ TỔNG SỐ MỤC CHECKLIST CHÍNH: 45 mục
✅ Đạt yêu cầu số lượng: 45 mục (>= 40 mục của đề bài).
   • Phân hệ Admin UI: 20 mục
   • Phân hệ Web Khách hàng: 15 mục
   • Phân hệ Mobile App: 10 mục

💡 BẢNG PHÂN TÍCH KHOẢNG TRỐNG AI (AI GAP ANALYSIS):
   ✅ Ghi nhận 3 ca phản biện chuyên sâu do con người bổ sung.

2️⃣ PHÂN BỔ THEO 4 KHÍA CẠNH GIAO DIỆN (INTERFACE ASPECTS):
  ✅ IA-01 (Chuẩn UI chung): 14 mục
  ✅ IA-02 (Form): 15 mục
  ✅ IA-03 (Điều hướng): 9 mục
  ✅ IA-04 (Phản hồi/Trạng thái): 7 mục
  ❌ Khác / Chưa gắn tag: 0 mục

3️⃣ KẾT QUẢ THỰC THI (EXECUTION SUMMARY):
  • Số mục ĐẠT (Passed): 26 (57.8%)
  • Số mục LỖI (Failed): 19 (42.2%)
  • Chưa thực thi / Khác: 0 mục

✅ Toàn bộ các mục FAILED đều đã được ghi chú lý do thất bại đầy đủ vào cột Notes.
====================================================================
```

#### (3) Verdict
`VALID`

#### (4) Lý do (ISTQB)
Đáp ứng chuẩn **ISTQB FL §6.1 (Test Tool Support)** về công cụ tự động hóa kiểm tra tính toàn vẹn tài liệu (*Automated Quality Gate*). Script trong skill bảo đảm tính nhất quán cú pháp và tính truy vết (Traceability) cho toàn bộ 45 mục checklist.

#### (5) Bản SV sửa

---

### Artifact A03 — Task 1: Báo cáo 19 Lỗi GUI & Bản thảo GitHub Issues

#### (1) Prompt + Công cụ
- **Tool:** Antigravity (Gemini 2.5 Flash)
- **Thời gian:** 22:00 01/11/2026
- **Prompt:**
> "Soạn thảo 19 báo cáo lỗi giao diện chi tiết trong HW3/report/issues/BUG-GUI-01.md đến BUG-GUI-19.md theo template chuẩn học thuật: Phân hệ, Severity, Bước tái hiện, Kết quả thực tế, Kết quả mong đợi, Phân tích mã nguồn SUT và đề xuất khắc phục."

#### (2) Output AI
> Dưới đây là danh sách 19 báo cáo lỗi giao diện chi tiết do AI soạn thảo kèm các đường link GitHub Issues tương ứng:

| STT | Mã Bug | Phân hệ (Subsystem) | Tiêu đề Khiếm khuyết Giao diện | Mức độ (Severity) | GitHub Issue Link |
|:---:|:---|:---|:---|:---:|:---|
| 1 | **BUG-GUI-01** | Admin Dashboard (`:5174`) | Cho phép tạo Danh mục với tên rỗng do thiếu validation biểu mẫu | Major | [#76](https://github.com/tthphat/eshop-sut/issues/76) |
| 2 | **BUG-GUI-02** | Admin Dashboard (`:5174`) | Form Thêm sản phẩm không có ký hiệu đánh dấu trường bắt buộc (*) | Minor | [#77](https://github.com/tthphat/eshop-sut/issues/77) |
| 3 | **BUG-GUI-03** | Admin Dashboard (`:5174`) | Form Thêm sản phẩm không chặn nhập giá tiền số âm hoặc bằng 0 | Major | [#78](https://github.com/tthphat/eshop-sut/issues/78) |
| 4 | **BUG-GUI-04** | Admin Dashboard (`:5174`) | Form Coupon cho phép chọn ngày hết hạn trong quá khứ | Major | [#79](https://github.com/tthphat/eshop-sut/issues/79) |
| 5 | **BUG-GUI-05** | Admin Dashboard (`:5174`) | Form Coupon cho phép nhập tỷ lệ giảm giá phần trăm vượt quá 100% | Major | [#80](https://github.com/tthphat/eshop-sut/issues/80) |
| 6 | **BUG-GUI-06** | Admin Dashboard (`:5174`) | Dashboard Admin hiển thị nhân đôi tổng doanh thu (x2 Revenue Bug) | Major | [#81](https://github.com/tthphat/eshop-sut/issues/81) |
| 7 | **BUG-GUI-07** | Admin Dashboard (`:5174`) | Chỉnh sửa sản phẩm bị lỗi lan truyền đổi tên hàng loạt toàn bộ sản phẩm | Critical | [#82](https://github.com/tthphat/eshop-sut/issues/82) |
| 8 | **BUG-GUI-08** | Admin Dashboard (`:5174`) | Thao tác Xóa không hiển thị hộp thoại xác nhận trước khi xóa dữ liệu | Major | [#83](https://github.com/tthphat/eshop-sut/issues/83) |
| 9 | **BUG-GUI-09** | Customer Web (`:5173`) | Trang Chi tiết sản phẩm không chặn nhập số lượng âm hoặc bằng 0 | Major | [#84](https://github.com/tthphat/eshop-sut/issues/84) |
| 10 | **BUG-GUI-10** | Customer Web (`:5173`) | Giỏ hàng không được làm trống sau khi hoàn tất đặt hàng thành công | Major | [#85](https://github.com/tthphat/eshop-sut/issues/85) |
| 11 | **BUG-GUI-11** | Customer Web (`:5173`) | Ô nhập Mật khẩu trên trang Đăng nhập hiển thị dạng văn bản thô (type="text") | Major | [#86](https://github.com/tthphat/eshop-sut/issues/86) |
| 12 | **BUG-GUI-12** | Customer Web (`:5173`) | Trang Thanh toán cho phép người dùng tự ý chỉnh sửa tổng tiền đơn hàng | Critical | [#87](https://github.com/tthphat/eshop-sut/issues/87) |
| 13 | **BUG-GUI-13** | Mobile App (Expo Go) | Bàn phím ảo không kích hoạt tìm kiếm khi nhấn Enter/Search trên Mobile | Minor | [#88](https://github.com/tthphat/eshop-sut/issues/88) |
| 14 | **BUG-GUI-14** | Mobile App (Expo Go) | Thiếu nút bấm tăng/giảm (+ / -) số lượng cảm ứng trên màn hình Chi tiết sản phẩm | Minor | [#89](https://github.com/tthphat/eshop-sut/issues/89) |
| 15 | **BUG-GUI-15** | Mobile App (Expo Go) | Thiếu nút mũi tên quay lại (Back Arrow) trên màn hình Chi tiết sản phẩm Mobile | Major | [#90](https://github.com/tthphat/eshop-sut/issues/90) |
| 16 | **BUG-GUI-16** | Mobile App (Expo Go) | Bấm phím Back phần cứng của Android làm thoát/đóng ứng dụng ngay lập tức | Major | [#91](https://github.com/tthphat/eshop-sut/issues/91) |
| 17 | **BUG-GUI-17** | Mobile App (Expo Go) | Thiếu vùng an toàn Safe Area trên Android khiến Header bị đè lên Status Bar | Major | [#92](https://github.com/tthphat/eshop-sut/issues/92) |
| 18 | **BUG-GUI-18** | Mobile App (Expo Go) | Bàn phím ảo che khuất nút bấm Thêm vào giỏ trên màn hình Chi tiết sản phẩm | Major | [#93](https://github.com/tthphat/eshop-sut/issues/93) |
| 19 | **BUG-GUI-19** | Customer Web (`:5173`) | Trang chủ hiển thị từ khóa tìm kiếm qua dangerouslySetInnerHTML gây lỗ hổng XSS | Critical | [#94](https://github.com/tthphat/eshop-sut/issues/94) |

#### (3) Verdict
`VALID`

#### (4) Lý do (ISTQB)
Tuân thủ đầy đủ chuẩn **ISTQB FL §5.6 (Defect Management)** và **IEEE 829 (Standard for Software Test Documentation)** về báo cáo sự cố phần mềm: cung cấp đầy đủ thông tin nhận diện, mức độ nghiêm trọng (Severity), các bước tái hiện (Steps to Reproduce), hành vi thực tế vs kỳ vọng, và cô lập nguyên nhân gốc rễ (Root Cause Isolation).

#### (5) Bản SV sửa
Sinh viên trực tiếp thẩm tra trên trình duyệt và thiết bị thật, chụp ảnh bằng chứng có gắn watermark email sinh viên `23120319@student.hcmus.edu.vn`, rà soát các bước tái hiện và tạo đồng bộ 19 issues trên GitHub repository (`https://github.com/tthphat/eshop-sut/issues`) từ Issue #76 đến #94.

---

### Artifact A04 — Task 3: Lập Ma trận Đối chiếu Đa nền tảng bằng Agent Skill (`cross-platform-gui-testing`)

#### (1) Prompt + Công cụ
- **Tool:** Antigravity (Claude 3.7 Sonnet)
- **Thời gian:** 16:00 03/11/2026
- **Prompt:**
> "Áp dụng skill cross-platform-gui-testing, phân tích độ lệch giao diện (UI Skew Analysis) và đối chiếu kết quả kiểm thử trên 3 nền tảng: Google Chrome 157 (Desktop), Mozilla Firefox 159 (Desktop) và Expo Go Android 15 (Realme C53) dựa trên dữ liệu thực tế."

#### (2) Output AI
> Dưới đây là các bảng kết quả đối chiếu và ma trận đánh giá đa nền tảng do AI trích xuất và tổng hợp:

**1. Bảng Tổng hợp Đánh giá 3 Nền tảng (Platform Summary):**

| Nền tảng (Platform) | Phân hệ kiểm thử | Công cụ / Môi trường thực thi | Tổng số mục chạy | Số mục Đạt (Passed) | Số mục Lỗi (Failed) | Tỷ lệ Lỗi (%) | Số mục sai lệch so với Chrome |
|---|---|---|:---:|:---:|:---:|:---:|:---:|
| **Google Chrome (Blink)** | Web & Admin | Máy trạm Windows 11 cục bộ | 35 | 22 | 13 | 37.1% | *Mốc chuẩn (Baseline)* |
| **Mozilla Firefox (Gecko)** | Web & Admin | Máy trạm Windows 11 cục bộ | 35 | 22 | 13 | 37.1% | 1 *(Khác biệt UI date picker)* |
| **Expo Go (Android)** | Mobile App | Điện thoại thật Realme C53 | 10 | 4 | 6 | 60.0% | *Phân hệ độc lập (Mobile Native)* |
| **TỔNG CỘNG 3 NỀN TẢNG** | **Đầy đủ SUT** | **Multi-device environment** | **80** | **48** | **32** | **40.0%** | **Đạt chuẩn Task 3** |

**2. Bảng Đối chiếu Kiểm thử Ứng dụng Di động trên Điện thoại thật (Realme C53 - Android 15):**

| Item ID | Màn hình di động | Tiêu chí kiểm tra tóm tắt | Kết quả Android (Expo Go) | Ghi chú hành vi quan sát thực tế / Lỗi phát hiện |
|:---:|:---|:---|:---:|:---|
| **CHK-MOB-01** | Mobile - Danh sách SP | Thông báo chữ "Đang tải..." khi nạp dữ liệu | **Passed** | Văn bản thông báo "Đang tải..." hiển thị rõ ràng khi fetch danh sách sản phẩm. |
| **CHK-MOB-02** | Mobile - Trang chủ | Kích thước vùng chạm cảm ứng ($\ge 48\times 48\text{ px}$) | **Passed** | Các thẻ sản phẩm và nút chuyển tab bottom navigation có diện tích chạm rộng rãi. |
| **CHK-MOB-03** | Mobile - Toàn app | Phông chữ tiếng Việt hiển thị đủ dấu | **Passed** | Phông chữ Roboto Android hiển thị sắc nét các từ "Đăng ký", "Giỏ hàng", "Thanh toán". |
| **CHK-MOB-04** | Mobile - Tìm kiếm | Phím Enter trên bàn phím ảo kích hoạt tìm kiếm | **Failed** | Thiếu `returnKeyType="search"` và `onSubmitEditing` ([BUG-GUI-13 - Issue #88](https://github.com/tthphat/eshop-sut/issues/88)). |
| **CHK-MOB-05** | Mobile - Đặt hàng | Bảo toàn toàn bộ mặt hàng trong giỏ khi đặt hàng | **Passed** | Giỏ hàng gửi đầy đủ toàn bộ mặt hàng lên backend, không bị mất mặt hàng cuối. |
| **CHK-MOB-06** | Mobile - Chi tiết SP | Cặp nút tăng/giảm (+/-) số lượng cảm ứng | **Failed** | Thiếu cặp nút +/- cảm ứng, buộc người dùng phải gõ số thủ công ([BUG-GUI-14 - Issue #89](https://github.com/tthphat/eshop-sut/issues/89)). |
| **CHK-MOB-07** | Mobile - Chi tiết SP | Nút mũi tên quay lại (Back arrow) trên màn hình | **Failed** | Màn hình Chi tiết sản phẩm thiếu nút Back về Trang chủ ([BUG-GUI-15 - Issue #90](https://github.com/tthphat/eshop-sut/issues/90)). |
| **CHK-MOB-08** | Mobile - Điều hướng | Bắt sự kiện phím Back phần cứng / cử chỉ Android | **Failed** | Ứng dụng thiếu `BackHandler`, bấm Back bị thoát văng khỏi app ([BUG-GUI-16 - Issue #91](https://github.com/tthphat/eshop-sut/issues/91)). |
| **CHK-MOB-09** | Mobile - Trang chủ | Vùng an toàn (Safe Area) né camera & Status Bar | **Failed** | Thanh navBar bị tràn lên đỉnh, đè lấn lên Status Bar và camera ([BUG-GUI-17 - Issue #92](https://github.com/tthphat/eshop-sut/issues/92)). |
| **CHK-MOB-10** | Mobile - Product detail | Tránh bàn phím ảo che khuất nút bấm Submit | **Failed** | Bàn phím số trồi lên che khuất hoàn toàn nút "Thêm vào giỏ hàng" ([BUG-GUI-18 - Issue #93](https://github.com/tthphat/eshop-sut/issues/93)). |

**3. Tóm tắt Phân tích Sai lệch Giao diện (UI Skew Analysis):**
- *Chrome vs Firefox*: 13 lỗi trên Web & Admin tái hiện đồng nhất 100% trên cả Blink và Gecko do lỗi logic React chung; sai khác thị giác duy nhất là hộp chọn lịch HTML5 Date Picker (`CHK-ADM-12`) dùng native popup của từng engine.
- *Web Desktop vs Native Mobile*: Tỷ lệ lỗi trên Expo Go Android cao vượt trội (**60.0%** so với **37.1%** trên web), xuất phát từ việc thiếu tối ưu hóa cho màn hình cảm ứng, vùng an toàn phần cứng (Safe Area) và bàn phím ảo hệ điều hành.

#### (3) Verdict
`VALID`

#### (4) Lý do (ISTQB)
Theo tiêu chuẩn **ISTQB FL §2.2 (Compatibility Testing & Portability)**, kiểm thử tương thích nền tảng nhằm đánh giá khả năng vận hành của phần mềm trên các môi trường phần cứng, trình duyệt và hệ điều hành khác nhau, nhận diện các khiếm khuyết đặc thù nền tảng (*Platform-specific defects*).

#### (5) Bản SV sửa
Sinh viên trực tiếp thực thi đối chiếu trên 3 nền tảng vật lý (Chrome 157, Firefox 159 trên Windows 11 và Expo Go SDK 54 trên Realme C53 Android 15), chụp 82 ảnh bằng chứng thực tế có gắn watermark email sinh viên, rà soát và xác nhận toàn bộ 13 lỗi chung trên web cũng như 6 lỗi đặc thù trên mobile trong file báo cáo `cross-platform-report.md`.

---

### Artifact A05 — Task 3: Đóng dấu Watermark ảnh bằng script trong Skill (`overlay_watermark.py` / `overlay_username.py`)

#### (1) Prompt + Công cụ
- **Tool:** Antigravity (Gemini 2.5 Flash)
- **Thời gian:** 10:15 03/11/2026
- **Prompt:**
> "Sử dụng script đóng dấu có sẵn trong skill cross-platform-gui-testing (scripts/overlay_username.py), quét toàn bộ ảnh chụp màn hình trong thư mục HW3/evidence/screenshots/, tự động overlay watermark email sinh viên '23120319@student.hcmus.edu.vn', MSSV '23120319' và họ tên 'TRƯƠNG THÀNH PHÁT' với dải banner nhận diện nền đen chữ trắng bán trong suốt để không che lấp giao diện SUT."

#### (2) Output AI
```text
$ python .agents/skills/cross-platform-gui-testing/scripts/overlay_username.py HW3/evidence/screenshots/ --email 23120319@student.hcmus.edu.vn --id 23120319 --name "TRƯƠNG THÀNH PHÁT" --recursive --in-place
Stamped [Chrome 157 / Windows 11] -> HW3/evidence/screenshots/gui/CHK-ADM-01-chrome.png
Stamped [Firefox 159 / Windows 11] -> HW3/evidence/screenshots/gui/CHK-ADM-01-firefox.png
Stamped [Expo Go SDK 52 / Android] -> HW3/evidence/screenshots/gui/CHK-MOB-01-expo.png
Stamped [Chrome 157 / Windows 11] -> HW3/evidence/screenshots/usability/P01-desktop-chrome.png
Stamped [Firefox 159 / Windows 11] -> HW3/evidence/screenshots/cross-platform/CP-01-firefox.png
...
Total stamped 82 images into HW3/evidence/screenshots/
```

#### (3) Verdict
`VALID`

#### (4) Lý do (ISTQB)
Theo **ISTQB FL §6.1 (Test Execution Tools & Testware Integrity)**, việc áp dụng công cụ đóng dấu watermark tự động bảo đảm tính xác thực không thể chối bỏ (*Non-repudiation*) và tuân thủ ràng buộc chống gian lận của đề bài (§11).

#### (5) Bản SV sửa

---

### Artifact A06 — Task 2: Thiết kế Kịch bản Nhiệm vụ Hướng mục tiêu (Slide 40 - S13)

#### (1) Prompt + Công cụ
- **Tool:** Antigravity (Gemini 2.5 Flash)
- **Thời gian:** 14:00 04/11/2026
- **Prompt:**
> "Áp dụng skill usability-evaluation để thiết kế Task Scenario cho đợt Usability Testing trên EShop theo đúng cấu trúc chuẩn Slide 40 bài giảng CSC13003 S13: (1) Nhiệm vụ hướng mục tiêu, (2) Trạng thái máy ban đầu, (3) Tiêu chí hoàn thành, (4) Chuẩn đối sánh thời gian."

#### (2) Output AI
> Dưới đây là đặc tả kịch bản nhiệm vụ đánh giá khả dụng (Task Scenario) theo chuẩn Slide 40 bài giảng CSC13003 S13 do AI khởi tạo:

**Đặc tả 4 Thành phần Nhiệm vụ Chuẩn (Slide 40 - S13):**

| Thành phần chuẩn | Mô tả Chi tiết trong Kịch bản Thử nghiệm |
|---|---|
| **1. Nhiệm vụ (Task)** | *"Bạn hãy vào trang web mua sắm EShop, tìm mua một chiếc điện thoại thông minh (smartphone) có giá dưới 30.000.000 ₫, xem thông tin chi tiết, thêm 1 sản phẩm vào giỏ hàng, áp dụng mã giảm giá `SAVE10` (được giảm 10%) và hoàn tất đặt hàng."* |
| **2. Trạng thái máy (Machine State)** | • **Backend API & Database:** Server Node.js (`http://localhost:3000`) và CSDL SQLite đang hoạt động, đã nạp sẵn danh mục điện thoại và mã giảm giá `SAVE10`.<br>• **Trình duyệt Web:** Mở trình duyệt Google Chrome ở chế độ khách mới (chưa đăng nhập tài khoản, giỏ hàng đang rỗng).<br>• **Tài khoản kiểm thử có sẵn:** Cung cấp tài khoản mẫu (`user1@eshop.com` / `Test1234!`) để người dùng đăng nhập khi hệ thống yêu cầu. |
| **3. Tiêu chí hoàn thành (Success Criteria)** | • Tìm và chọn đúng 1 sản phẩm điện thoại thông minh có giá dưới 30.000.000 ₫.<br>• Thêm sản phẩm vào giỏ hàng thành công.<br>• Áp dụng mã `SAVE10` thành công và số tiền giảm giá hiển thị rõ ràng trên tổng đơn.<br>• Đăng nhập tài khoản và bấm "Xác Nhận Thanh Toán" thành công đến khi màn hình hiển thị thông báo: *"Thanh toán thành công! Cảm ơn bạn đã mua sắm tại EShop."* |
| **4. Chuẩn đối sánh thời gian (Benchmark)** | Hoàn thành toàn bộ luồng trong vòng **120 giây (2 phút)** trong điều kiện người dùng thao tác độc lập, không cần người điều phối trợ giúp kỹ thuật. |

**Luồng nghiệp vụ mục tiêu:**
$$\text{Trang chủ} \longrightarrow \text{Tìm Smartphone} \longrightarrow \text{Xem chi tiết SP} \longrightarrow \text{Thêm vào giỏ} \longrightarrow \text{Áp mã SAVE10} \longrightarrow \text{Đăng nhập} \longrightarrow \text{Xác nhận Thanh toán}$$

#### (3) Verdict
`VALID`

#### (4) Lý do (ISTQB)
Theo **Slide 40 bài giảng CSC13003 S13** và tiêu chuẩn **ISO 9241-11 (Usability Definition)**, kịch bản kiểm thử khả dụng phải mang tính định hướng mục tiêu (*Goal-oriented*), cung cấp bối cảnh thực tế cho người tham gia và tuyệt đối không chỉ dẫn từng bước (*No step-by-step clues*) để bảo đảm tính khách quan khi đo lường thời gian và lỗi thao tác.

#### (5) Bản SV sửa
---

### Artifact A07 — Task 2: Tính toán và Phân tích Thang đo SUS bằng Agent Skill (`calculate_sus.mjs`)

#### (1) Prompt + Công cụ
- **Tool:** Antigravity (Claude 3.7 Sonnet)
- **Thời gian:** 18:30 04/11/2026
- **Prompt:**
> "Áp dụng skill usability-evaluation, chạy script calculate_sus.mjs trên file dữ liệu HW3/data/sus-responses.json để tính điểm SUS cho 7 người dùng theo công thức John Brooke (1996), xuất Mean, Median, Độ lệch chuẩn, xếp loại Bangor Grade (A/B/C/D/F) và so sánh với mốc chuẩn ngành 68.0."

#### (2) Output AI
```text
========================================================================================
📊 SYSTEM USABILITY SCALE (SUS) ANALYSIS REPORT (CSC13003 S13)
========================================================================================

| ID | Họ và tên | SĐT/Zalo | Thời gian (s) | Hoàn thành | Điểm SUS | Xếp loại (Grade) | Đánh giá tính từ |
|:--:|:---|:---:|:---:|:---:|:---:|:---:|:---|
| P01 | Trần Nhật Nguyên | 0397****83 | 50s | Thành công | **62.5** | Grade C | OK |
| P02 | Nguyễn Đức Thịnh | 0387****27 | 70s | Thành công | **62.5** | Grade C | OK |
| P03 | Nguyễn An Kiên | 038****541 | 112s | Thành công | **80.0** | Grade B | Good |
| P04 | Phạm Thị Kim Tuyến | 036****457 | 115s | Thành công | **50.0** | Grade D | Poor |
| P05 | Nguyễn Thanh Tuyền | 083****252 | 88s | Thành công | **85.0** | Grade A | Excellent |
| P06 | Trương Thành Đạt | 035****074 | 120s | Thành công | **45.0** | Grade D | Poor |
| P07 | Huỳnh Thị Kim Liên | 039****284 | 104s | Thành công | **77.5** | Grade B | Good |

----------------------------------------------------------------------------------------
📈 TỔNG HỢP KẾT QUẢ ĐO LƯỜNG (METRICS SUMMARY):
----------------------------------------------------------------------------------------
• Tổng số người tham gia (Sample Size): 7
• Tỷ lệ hoàn thành nhiệm vụ (Completion Rate): 100.0%
• Thời gian hoàn thành trung bình (Mean Time): 94.1 giây (Benchmark: 120s)
• Điểm SUS trung bình (Mean SUS): 66.07 / 100
• Trung vị SUS (Median SUS): 62.50
• Độ lệch chuẩn (Standard Deviation): ±15.33
• Điểm thấp nhất / cao nhất (Range): 45.0 - 85.0
• Chuẩn ngành (Industry Benchmark): 68.0
• Xếp loại tổng thể (Bangor Grade): Grade C (OK) - Marginal
========================================================================================
```

#### (3) Verdict
`VALID`

#### (4) Lý do (ISTQB)
Theo **Slide 42-45 bài giảng CSC13003 S13** và phương pháp luận **System Usability Scale (Brooke, 1996)**, công thức quy đổi thang đo Likert 1-5 sang thang điểm 0-100 và đối chiếu phân vị Bangor et al. (2008) được script tính toán chính xác tuyệt đối (Mean = 66.07, Median = 62.50, StdDev = ±15.33, Grade C).

#### (5) Bản SV sửa
Sinh viên đối chiếu kết quả tính toán với dữ liệu gốc của 7 sinh viên, bổ sung bảng thống kê định dạng Markdown table vào báo cáo `usability-report.md`.

---

### Artifact A08 — Task 2: Báo cáo Lỗi Khả dụng (`BUG-UX-01` → `03`) & Video Minh chứng

#### (1) Prompt + Công cụ
- **Tool:** Antigravity (Gemini 2.5 Flash)
- **Thời gian:** 22:15 04/11/2026
- **Prompt:**
> "Lập các file báo cáo lỗi khả dụng trong HW3/report/issues/ dựa trên quan sát người dùng: BUG-UX-01 (Mất ngữ cảnh đăng nhập), BUG-UX-02 (Ô tổng tiền cho sửa tay), BUG-UX-03 (Không làm sạch giỏ hàng), và đề xuất thêm các lỗi UX khác nếu có."

#### (2) Output AI
> Dưới đây là bảng tổng hợp các lỗi trải nghiệm người dùng (UX Bugs) do AI soạn thảo kèm liên kết GitHub Issues và Video minh chứng:

| STT | Mã Bug | Mức độ ưu tiên | Tên khiếm khuyết khả dụng | Tần suất xuất hiện | GitHub Issue Link | Video Minh chứng |
|:---:|:---:|:---:|:---|:---:|:---|:---:|
| 1 | **BUG-UX-01** | **P0 (Critical)** | Mất ngữ cảnh điều hướng sau khi đăng nhập bắt buộc tại bước thanh toán (redirect về Home thay vì Checkout) | **100%** (7/7 người) | [#95](https://github.com/tthphat/eshop-sut/issues/95) | - |
| 2 | **BUG-UX-02** | **P0 (Critical)** | Trường Tổng tiền thanh toán trên trang Checkout là ô input cho phép chỉnh sửa giá trị tùy ý | **100%** (7/7 người) | [#96](https://github.com/tthphat/eshop-sut/issues/96) | [Xem Video (~00:48)](https://youtu.be/xlSKEIs3rRw) |
| 3 | **BUG-UX-03** | **P1 (High)** | Giỏ hàng không tự động làm trống sau khi đặt hàng thành công gây hiểu lầm đơn hàng bị lỗi | **100%** (7/7 người) | [#97](https://github.com/tthphat/eshop-sut/issues/97) | [Xem Video (~01:05)](https://youtu.be/xlSKEIs3rRw) |
| 4 | *BUG-UX-04* | *P2 (Medium)* | *Ô tìm kiếm không kích hoạt khi nhấn phím Enter trên máy tính (Đề xuất lỗi sai - False Positive)* | *71.4%* | *Bị loại bỏ (Đã xác minh không có lỗi)* | - |

#### (3) Verdict
`INCOMPLETE`

#### (4) Lý do (ISTQB)
Theo chuẩn **ISTQB FL §5.6 (False-Positive Defect Elimination)**, kiểm thử viên phải loại bỏ các báo cáo lỗi giả (False Positives) trước khi phát hành. Đề xuất `BUG-UX-04` của AI là nhận định sai lầm do AI suy diễn tĩnh; khi kiểm tra mã nguồn `Home.jsx:L44`, ô input tìm kiếm đã được bọc bên trong thẻ `<form onSubmit={handleSearch}>`, do đó phím Enter hoạt động hoàn toàn bình thường trên môi trường runtime thực tế.

#### (5) Bản SV sửa
Sinh viên trực tiếp kiểm tra lại trên bàn phím máy tính và mã nguồn `Home.jsx:L44`, xác nhận ô tìm kiếm nằm trong thẻ `<form onSubmit={handleSearch}>` nên phím Enter hoạt động bình thường $\rightarrow$ sinh viên quyết định loại bỏ hoàn toàn `BUG-UX-04.md`. Đồng thời, sinh viên tạo 3 GitHub Issues chính thức ([#95](https://github.com/tthphat/eshop-sut/issues/95), [#96](https://github.com/tthphat/eshop-sut/issues/96), [#97](https://github.com/tthphat/eshop-sut/issues/97)) và gắn link 2 video minh chứng thực tế trên YouTube ([P01 - Trần Nhật Nguyên: https://youtu.be/fdyj0m0Ezck](https://youtu.be/fdyj0m0Ezck) và [P02 - Nguyễn Đức Thịnh: https://youtu.be/xlSKEIs3rRw](https://youtu.be/xlSKEIs3rRw)), ghi chú rõ chỉ có 2 bạn này đồng ý chấp thuận quay video.

---

### Artifact A09 — Task 4: Đọc Yêu cầu HW03 & Xây dựng Bộ 3 Custom Agent Skills

#### (1) Prompt + Công cụ
- **Tool:** Antigravity (Claude 3.7 Sonnet)
- **Thời gian:** 11:00 05/11/2026
- **Prompt:**
> "Đọc kỹ tài liệu yêu cầu đồ án HW03 (requirements/HW03_GUI_Usability_VI.md) và Slide bài giảng CSC13003 S13 (GUI & Usability Testing), hãy thiết kế và xây dựng 3 Agent Skills chuẩn hóa cho Antigravity/Claude Code trong thư mục .claude/skills/ và .agents/skills/:
> 1. gui-checklist-testing: Thiết kế và đối soát checklist 4 khía cạnh IA-01..IA-04 chuẩn Slide S13, tích hợp script tự động hóa validate_checklist.mjs.
> 2. usability-evaluation: Hướng dẫn kịch bản nhiệm vụ Slide 40, tích hợp script calculate_sus.mjs tính điểm SUS chuẩn John Brooke (1996) và phân loại lỗi theo ma trận Criticality (Slide 50).
> 3. cross-platform-gui-testing: Hướng dẫn kiểm thử đa nền tảng (Web desktop vs Expo Go Mobile), đối chiếu UI skew, tích hợp script overlay_watermark.py tự động đóng dấu email sinh viên.
> Mỗi skill phải có cấu trúc chuẩn: file SKILL.md đầy đủ YAML frontmatter, các workflows chi tiết, thư mục scripts/, references/ và schemas/."

#### (2) Output AI
> Bộ 3 Agent Skills đã được AI thiết kế và khởi tạo hoàn chỉnh trong cả hai thư mục `.claude/skills/` và `.agents/skills/`:
> 
> ```text
> .agents/skills/ (và .claude/skills/)
> ├── gui-checklist-testing/
> │   ├── SKILL.md (Hướng dẫn đối soát 4 khía cạnh IA-01..IA-04)
> │   ├── scripts/validate_checklist.mjs (Bộ thẩm định cú pháp & tỷ lệ đạt/lỗi)
> │   ├── schemas/checklist.schema.json (JSON Schema kiểm toán cấu trúc)
> │   └── references/s13-guidelines.md (Tóm tắt lý thuyết bài giảng CSC13003 S13)
> ├── usability-evaluation/
> │   ├── SKILL.md (Hướng dẫn kịch bản Slide 40 & phân loại lỗi Slide 50)
> │   ├── scripts/calculate_sus.mjs (Bộ tính toán tự động chỉ số SUS & Bangor grade)
> │   ├── schemas/sus-data.schema.json (JSON Schema cấu trúc dữ liệu người tham gia)
> │   └── references/sus-methodology.md (Tài liệu phương pháp luận John Brooke 1996)
> └── cross-platform-gui-testing/
>     ├── SKILL.md (Hướng dẫn đối chiếu đa nền tảng Chrome, Firefox, Expo Go Android)
>     ├── scripts/overlay_username.py (Script tự động gắn watermark email 23120319)
>     └── references/cross-platform-matrix.md (Ma trận tham chiếu độ lệch giao diện)
> ```

#### (3) Verdict
`VALID`

#### (4) Lý do (ISTQB)
Theo **ISTQB FL §6.2 (Success Factors for Tools)**, việc mô-đun hóa các quy trình kiểm thử thành các Agent Skills có thể tái sử dụng giúp chuẩn hóa quy trình kiểm thử, duy trì tính nhất quán chất lượng và giảm thiểu rủi ro sai sót do thao tác thủ công lặp lại.

#### (5) Bản SV sửa
Sinh viên kiểm tra thực thi các script trong skill, chạy thử trên dữ liệu thực tế của HW03 và bổ sung tài liệu giải thích kiến trúc `HW3/plan/skills-explanation.md`.

---

## 5. Tổng kết Độ chính xác AI

Tổng hợp verdict từ Mục 3 & Mục 4 và thống kê vào bảng dưới:

| Chỉ số | Số lượng | Tỉ lệ (%) |
|:---|:---:|:---:|
| **Tổng artifact AI sinh đã audit** | **9** | **100.0%** |
| **VALID (đúng, dùng nguyên hoặc tinh chỉnh nhỏ)** | **7** | **77.8%** |
| **INCOMPLETE (chấp nhận sau khi sinh viên sửa/bổ sung)** | **2** | **22.2%** |
| **INVALID (sai; loại bỏ hoàn toàn)** | **0** | **0.0%** |

---

## 6. Kết luận — Khi nào nên / không nên dùng AI? (141 từ)

> Trong đồ án HW03, em nhận thấy AI mang lại giá trị rất lớn trong việc tăng tốc viết script kỹ thuật tự động hóa (Node.js tính điểm SUS, Python đóng dấu watermark), định dạng báo cáo chuẩn và lập ma trận kiểm thử đa nền tảng. Tuy nhiên, AI bộc lộ điểm mù lớn khi đánh giá tương tác runtime động, dễ đưa ra lỗi giả (như đề xuất sai phím Enter `BUG-UX-04`) hoặc chỉ sinh tiêu chí kiểm thử bề mặt, bỏ sót lỗi logic nghiệp vụ sâu.  
> 
> **Khuyến nghị:** Nên dùng AI như trợ thủ hỗ trợ tự động hóa và định dạng, nhưng tuyệt đối không phó mặc. Người kiểm thử bắt buộc phải trực tiếp kiểm chứng mã nguồn SUT, chạy thử trên thiết bị vật lý và giữ vai trò quyết định tối cao (*Human-in-the-loop*).

---

## 7. Mandatory Disclosure (dán nguyên văn)

> *"GUI checklist drafts, automated validation and watermarking scripts, SUS calculation tools, bug report templates, and cross-platform comparison matrices were initially generated with the assistance of AI (Antigravity/Claude Code); I conducted the AI Gap Analysis to add critical business-logic checklist items, removed the false-positive bug BUG-UX-04, and verified all source code references in the SUT. All 45 checklist executions across 3 platforms (Chrome, Firefox, Expo Go Android 15), 7 real usability test sessions with masked contacts, and 82 watermarked evidence screenshots were conducted directly by me. The detailed AI Audit Report is attached as Appendix A. I confirm I did not use AI to fabricate any participant data or test evidence."*

---

### Chữ ký xác nhận của Sinh viên
- **Họ tên sinh viên (in hoa):** TRƯƠNG THÀNH PHÁT  
- **MSSV:** 23120319  
- **Lớp / Khóa:** Kiểm thử phần mềm - CQ2023/3 - Khóa 2023  
- **Môn học:** CS423 / CSC13003 – Kiểm thử phần mềm  
- **Giảng viên:** TS. Trần Duy Hoàng, ThS. Trương Phước Lộc, ThS. Hồ Tuấn Thanh, TS. Lâm Quang Vũ  
- **Ngày:** 08/11/2026  
- **Chữ ký:** *Trương Thành Phát*

---

### Tham khảo
- Kharbach, M. (2026). *AI Use Policy Templates for Higher Education*. CC BY-NC-SA 4.0.
- ISTQB Foundation Level Syllabus (latest version 4.0.1).
- Slide bài giảng CSC13003 - S13 (GUI & Usability Testing), FIT@HCMUS.
- Hardman, P. (2025). *A Post-AI Learning Taxonomy*.
- Brooke, J. (1996). *SUS: A quick and dirty usability scale*.
- Bangor, A., Kortum, P., & Miller, J. (2008). *An Empirical Evaluation of the System Usability Scale*.
