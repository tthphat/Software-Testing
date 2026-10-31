# Usability Task Scenario Template (Kịch bản Nhiệm vụ Đánh giá Khả dụng)

## 1. Thông tin chung về Kịch bản
- **Tên kịch bản**: Luồng mua sắm và thanh toán kèm mã giảm giá (End-to-End EShop Flow)
- **Luồng chức năng**: Tìm kiếm sản phẩm → Xem chi tiết → Thêm vào giỏ → Áp dụng Coupon → Hoàn tất Thanh toán (Checkout)
- **Hệ thống thử nghiệm (SUT)**: EShop Web / Mobile
- **Đối tượng người dùng**: Khách hàng mua sắm trực tuyến (ưu tiên non-IT)

---

## 2. Đặc tả 4 thành phần nhiệm vụ (Theo chuẩn Slide 40 - CSC13003 S13)

| Thành phần | Đặc tả chi tiết |
|---|---|
| **1. Nhiệm vụ (Task)** | Bạn hãy tìm mua một sản phẩm điện thoại thông minh (giá dưới 30.000.000 ₫), xem thông tin chi tiết, thêm 1 sản phẩm vào giỏ hàng, áp dụng mã giảm giá `SAVE10` (hoặc mã hợp lệ bạn tìm thấy) và tiến hành đặt hàng thành công đến bước xác nhận đơn. |
| **2. Trạng thái máy (Machine State)** | • Hệ thống Backend & Database SQLite đã khởi chạy sẵn với dữ liệu mẫu (Seeded Products & Coupons).<br>• Trình duyệt hoặc ứng dụng mobile ở trạng thái người dùng mới (chưa đăng nhập, giỏ hàng đang rỗng). |
| **3. Tiêu chí hoàn thành (Successful Completion Criteria)** | • Sản phẩm được chọn đúng tiêu chí và hiển thị trong giỏ hàng.<br>• Mã giảm giá được áp dụng thành công và số tiền giảm giá hiển thị rõ ràng trên tổng tiền.<br>• Form thanh toán được điền đầy đủ thông tin giao hàng hợp lệ.<br>• Hệ thống tạo đơn hàng thành công, hiển thị thông báo đặt hàng và mã đơn hàng (hoặc chuyển về trang lịch sử đơn). |
| **4. Chuẩn đối sánh thời gian (Benchmark)** | Hoàn thành trong vòng **120 giây (2 phút)** mà không cần người điều phối trợ giúp kỹ thuật. |

---

## 3. Lời thoại dành cho Người điều phối (Moderator Briefing Script)

> *"Xin chào bạn! Cảm ơn bạn rất nhiều vì đã dành thời gian tham gia buổi thử nghiệm giao diện ngày hôm nay.*
>
> *Trước khi bắt đầu, mình xin nhấn mạnh một điều quan trọng nhất: **Hôm nay chúng mình đang kiểm thử phần mềm EShop, hoàn toàn không kiểm thử năng lực của bạn**. Không có bất kỳ thao tác nào là 'sai' cả. Mọi sự ngập ngừng, khó khăn hay nhầm lẫn của bạn đều là thông tin vô giá giúp đội ngũ phát triển cải tiến sản phẩm tốt hơn.*
>
> *Trong suốt quá trình làm, xin bạn hãy **nói to toàn bộ suy nghĩ trong đầu (Think-Aloud)**: Bạn đang nhìn thấy gì, đang tìm kiếm nút bấm ở đâu, cảm thấy bước này dễ hay khó, kỳ vọng điều gì sẽ xảy ra tiếp theo...*
>
> *Mình sẽ ngồi bên cạnh quan sát và ghi chép trung lập. Bạn có câu hỏi nào trước khi chúng ta bắt đầu không? Bây giờ mình xin gửi bạn mục tiêu của nhiệm vụ nhé!"*
