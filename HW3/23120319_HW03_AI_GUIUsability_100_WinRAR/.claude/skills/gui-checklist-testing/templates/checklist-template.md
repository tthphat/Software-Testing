# GUI Checklist Template (CSC13003 S13)

## 1. Metadata
- **Hệ thống được kiểm thử (SUT)**: EShop
- **Màn hình / Phạm vi**: [Ví dụ: Cart & Checkout / Product Detail / Mobile App]
- **Người thực hiện**: [Họ tên - MSSV]
- **Nền tảng kiểm thử**: [Chrome / Firefox / Safari / Expo Go Mobile]
- **Ngày thực thi**: [YYYY-MM-DD]

---

## 2. Bảng Checklist Đánh giá Giao diện (> 40 mục)

| STT | Item ID | Aspect ID | Màn hình / Component | Phần tử kiểm tra | Tiêu chí kiểm tra | Kết quả mong đợi | Trạng thái (Passed/Failed) | Ghi chú (Notes / Lý do lỗi) | Screenshot / Bug ID |
|:---:|:---:|:---:|:---|:---|:---|:---|:---:|:---|:---|
| 1 | CHK-IA01-01 | IA-01 | Chung (Header/Footer) | Logo & Branding | Hiển thị rõ nét, đúng tỷ lệ, không bị vỡ hình trên mọi độ phân giải | Logo hiển thị chuẩn vector/png sắc nét | PASSED | | |
| 2 | CHK-IA01-02 | IA-01 | Toàn màn hình | Phông chữ & Cỡ chữ | Cỡ chữ đồng nhất, dễ đọc, khoảng cách dòng (line-height) hợp lý | Font thống nhất toàn trang, không lỗi font tiếng Việt | PASSED | | |
| 3 | CHK-IA01-03 | IA-01 | Toàn màn hình | Tương phản màu sắc | Độ tương phản giữa chữ và nền đạt chuẩn WCAG AA (>= 4.5:1) | Text dễ đọc trên nền sáng/tối | FAILED | Nút text màu vàng nhạt trên nền trắng khó đọc | `BUG-GUI-01` |
| 4 | CHK-IA01-04 | IA-01 | Toàn màn hình | Căn lề & Khoảng cách | Các khối nội dung canh lề đồng trục (grid alignment), padding cân đối | Không bị lệch lề, không dính sát viền | PASSED | | |
| 5 | CHK-IA01-05 | IA-01 | Toàn màn hình | Chính tả tiếng Việt | Không sai chính tả, dấu câu chuẩn, không bị lỗi font Unicode UTF-8 | Tiếng Việt hiển thị chuẩn xác | PASSED | | |
| 6 | CHK-IA01-06 | IA-01 | Thông báo lỗi | Định dạng thông báo | Thông báo lỗi có màu đỏ/cảnh báo rõ ràng, biểu tượng trực quan | Màu đỏ đặc trưng cho thông báo lỗi | PASSED | | |
| 7 | CHK-IA02-01 | IA-02 | Form nhập liệu | Trường bắt buộc | Có ký hiệu `*` hoặc ghi chú rõ ràng cho các trường bắt buộc | Người dùng phân biệt rõ bắt buộc vs không bắt buộc | FAILED | Form không có dấu * đánh dấu trường bắt buộc | `BUG-GUI-02` |
| 8 | CHK-IA02-02 | IA-02 | Form nhập liệu | Thứ tự Tab (Focus Order) | Bấm phím Tab di chuyển con trỏ tuần tự từ trên xuống, trái sang phải | Focus đi đúng thứ tự logic | PASSED | | |
| 9 | CHK-IA02-03 | IA-02 | Form nhập liệu | Placeholder | Placeholder gợi ý định dạng hợp lý và biến mất khi gõ nội dung | Placeholder rõ ràng, không gây nhầm với giá trị thật | PASSED | | |
| 10 | CHK-IA02-04 | IA-02 | Form nhập liệu | Validation rỗng (Empty) | Bấm Submit khi để trống trường bắt buộc thì báo lỗi ngay tại trường đó | Hiển thị thông báo lỗi tương ứng | PASSED | | |
| 11 | CHK-IA02-05 | IA-02 | Form nhập liệu | Giá trị mặc định | Giá trị mặc định (Default) hợp lý, không gán giá trị sai nghiệp vụ | Default chuẩn hoặc để trống | PASSED | | |
| 12 | CHK-IA02-06 | IA-02 | Mật khẩu | Ẩn/hiện mật khẩu | Có icon mắt để toggle xem mật khẩu khi cần thiết | Mật khẩu mặc định che bằng dấu chấm, có thể mở | PASSED | | |
| 13 | CHK-IA03-01 | IA-03 | Header | Menu chính (Navigation) | Các tab menu dẫn đúng trang đích, có highlight tab đang hoạt động | Active tab nổi bật, URL đổi tương ứng | PASSED | | |
| 14 | CHK-IA03-02 | IA-03 | Chi tiết / Giỏ hàng | Breadcrumb Navigation | Hiển thị đường dẫn phân cấp chính xác và bấm quay lại được | Breadcrumb dẫn link đúng cấu trúc danh mục | FAILED | Breadcrumb thiếu link quay về trang danh mục cha | `BUG-GUI-03` |
| 15 | CHK-IA03-03 | IA-03 | Nút bấm & Link | Hiệu ứng Hover / Focus | Có trạng thái hover (đổi màu, con trỏ pointer) khi rê chuột vào nút | Người dùng nhận biết phần tử có thể tương tác | PASSED | | |
| 16 | CHK-IA03-04 | IA-03 | Trình duyệt | Nút Back / Forward | Bấm Back trên trình duyệt quay về đúng màn hình trước mà không vỡ state | Trạng thái ứng dụng giữ nguyên hoặc cập nhật đúng | PASSED | | |
| 17 | CHK-IA04-01 | IA-04 | Modal / Popup | Tính Modal (Modality) | Popup mở ra có lớp nền mờ (backdrop), khóa tương tác nền dưới | Không bấm nhầm được vào các nút phía dưới popup | PASSED | | |
| 18 | CHK-IA04-02 | IA-04 | Modal / Popup | Đóng Modal | Đóng được bằng icon X, bấm ra ngoài backdrop hoặc bấm phím ESC | Popup đóng mượt mà | FAILED | Bấm phím ESC không đóng được modal | `BUG-GUI-04` |
| 19 | CHK-IA04-03 | IA-04 | Nút hành động | Disable khi đang xử lý | Nút bấm bị vô hiệu hóa (disabled) khi đang gửi request để tránh click đúp | Ngăn chặn duplicate request hiệu quả | FAILED | Nút không bị disable khi đang submit | `BUG-GUI-05` |
| 20 | CHK-IA04-04 | IA-04 | Thao tác bất đồng bộ | Trạng thái Loading | Hiển thị spinner / skeleton loader khi đang tải dữ liệu | Người dùng biết hệ thống đang xử lý | PASSED | | |
| 21 | CHK-IA04-05 | IA-04 | Giỏ hàng / Dữ liệu | Đồng bộ trạng thái (Sync) | Thay đổi số lượng sản phẩm thì tổng tiền cập nhật tức thì | Tổng tiền khớp ngay lập tức không cần F5 | PASSED | | |
| 22 | CHK-IA04-06 | IA-04 | Lỗi mạng / Server | Xử lý sự cố backend | Khi server ngắt kết nối, hiển thị banner báo lỗi thân thiện thay vì văng trắng | Thông báo rõ ràng, cho phép thử lại (Retry) | FAILED | Màn hình trắng xóa khi backend ngắt kết nối | `BUG-GUI-06` |
