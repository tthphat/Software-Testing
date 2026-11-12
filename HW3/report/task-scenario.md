# KỊCH BẢN NHIỆM VỤ ĐÁNH GIÁ KHẢ DỤNG (USABILITY TASK SCENARIO)

**Môn học:** Kiểm thử phần mềm (CSC13003) — FIT@HCMUS  
**Hệ thống thử nghiệm (SUT):** EShop Customer Web (`http://localhost:5173`)  
**Người thực hiện:** TRƯƠNG THÀNH PHÁT (MSSV: 23120319)  
**Tiêu chuẩn áp dụng:** Slide 40 bài giảng CSC13003 S13 (GUI & Usability Testing)

---

## 1. Thông tin Tổng quan về Nhiệm vụ

- **Tên kịch bản:** Mua sắm Smartphone và Thanh toán với Mã Giảm Giá (End-to-End E-Commerce Flow)
- **Luồng nghiệp vụ xuyên suốt:**
  $$\text{Trang chủ} \longrightarrow \text{Tìm kiếm Smartphone} \longrightarrow \text{Xem chi tiết sản phẩm} \longrightarrow \text{Thêm vào giỏ hàng} \longrightarrow \text{Nhập mã giảm giá SAVE10} \longrightarrow \text{Đăng nhập tài khoản} \longrightarrow \text{Xác nhận Đặt hàng thành công}$$
- **Đối tượng người tham gia:** 7 sinh viên đại học ngoài lớp học (đến từ HCMIU, UIT, USSH, IUH, UTH với trình độ công nghệ Cơ bản - Khá, thường xuyên sử dụng web/app).

---

## 2. Đặc tả 4 Thành phần Nhiệm vụ Chuẩn (Theo Slide 40 - Bài giảng S13)

Theo quy định học thuật, người điều phối **giao cho người dùng một mục tiêu kinh doanh thực tế**, tuyệt đối **không cầm tay chỉ việc hay hướng dẫn từng nút bấm**:

| Thành phần chuẩn | Mô tả Chi tiết trong Kịch bản Thử nghiệm |
|---|---|
| **1. Nhiệm vụ (Task)** | *"Bạn hãy vào trang web mua sắm EShop, tìm mua một chiếc điện thoại thông minh (smartphone) có giá dưới 30.000.000 ₫, xem thông tin chi tiết, thêm 1 sản phẩm vào giỏ hàng, áp dụng mã giảm giá `SAVE10` (được giảm 10%) và hoàn tất đặt hàng."* |
| **2. Trạng thái máy (Machine State)** | • **Backend API & Database:** Server Node.js (`http://localhost:3000`) và CSDL SQLite đang hoạt động, đã nạp sẵn danh mục điện thoại và mã giảm giá `SAVE10`.<br>• **Trình duyệt Web:** Mở trình duyệt Google Chrome ở chế độ khách mới (chưa đăng nhập tài khoản, giỏ hàng đang rỗng).<br>• **Tài khoản kiểm thử có sẵn:** Cung cấp tài khoản mẫu (`user1@eshop.com` / `Test1234!`) để người dùng đăng nhập khi hệ thống yêu cầu. |
| **3. Tiêu chí hoàn thành (Success Criteria)** | • Tìm và chọn đúng 1 sản phẩm điện thoại thông minh có giá dưới 30.000.000 ₫.<br>• Thêm sản phẩm vào giỏ hàng thành công.<br>• Áp dụng mã `SAVE10` thành công và số tiền giảm giá hiển thị rõ ràng trên tổng đơn.<br>• Đăng nhập tài khoản và bấm "Xác Nhận Thanh Toán" thành công đến khi màn hình hiển thị thông báo: *"Thanh toán thành công! Cảm ơn bạn đã mua sắm tại EShop."* |
| **4. Chuẩn đối sánh thời gian (Benchmark)** | Hoàn thành toàn bộ luồng trong vòng **120 giây (2 phút)** trong điều kiện người dùng thao tác độc lập, không cần người điều phối trợ giúp kỹ thuật. |

---

## 3. Lời thoại Dành cho Người điều phối (Moderator Briefing Script)

Trước khi bắt đầu bấm giờ, người điều phối (bạn) đọc đoạn lời thoại sau để chào đón và giải tỏa tâm lý cho người tham gia:

> *"Xin chào bạn! Cảm ơn bạn rất nhiều vì đã dành thời gian tham gia buổi thử nghiệm giao diện ngày hôm nay.*
>
> *Trước khi bắt đầu, mình xin nhấn mạnh một nguyên tắc quan trọng nhất: **Hôm nay chúng mình đang kiểm thử phần mềm EShop, hoàn toàn không kiểm thử năng lực của bạn**. Không có bất kỳ thao tác nào là 'sai' cả. Mọi sự ngập ngừng, khó khăn hay nhầm lẫn của bạn đều là thông tin vô giá giúp đội ngũ phát triển nhận ra điểm yếu của giao diện để cải tiến sản phẩm tốt hơn.*
>
> *Trong suốt quá trình thao tác, xin bạn hãy **nói to toàn bộ suy nghĩ trong đầu (Think-Aloud Protocol)**: Bạn đang nhìn thấy gì, đang tìm kiếm nút bấm ở đâu, cảm thấy bước này dễ hay khó, kỳ vọng điều gì sẽ xảy ra tiếp theo...*
>
> *Mình sẽ ngồi bên cạnh quan sát và ghi chép trung lập. Bạn có câu hỏi nào trước khi bắt đầu không? Bây giờ mình xin gửi bạn mục tiêu của nhiệm vụ nhé:  
> **'Bạn hãy tìm mua 1 chiếc smartphone giá dưới 30 triệu trên trang EShop, thêm vào giỏ, áp mã giảm giá SAVE10 và hoàn tất thanh toán giúp mình nhé!'**"*

---

## 4. Quy trình Tiếp theo Sau khi Hoàn thành Nhiệm vụ

Ngay sau khi người dùng hoàn thành hoặc dừng phiên thử nghiệm:
1. **Thu thập dữ liệu định lượng:** Người dùng tự điền phiếu khảo sát **Thang đo Khả dụng Hệ thống (SUS - 10 câu hỏi)** trên thang đo Likert 1-5 (xem tệp [`sus-questionnaire.md`](sus-questionnaire.md)).
2. **Phỏng vấn thăm dò định tính (4 Probes):** Người điều phối đặt 4 câu hỏi đào sâu về:
   - *Tính rõ ràng (Clarity)*
   - *Khôi phục lỗi (Error Recovery)*
   - *Tốc độ (Speed)*
   - *Sự tin cậy (Trust)*
3. **Ghi chép & Lưu trữ:** Toàn bộ ghi chép được tổng hợp vào [`observation-notes.md`](observation-notes.md) và báo cáo [`usability-report.md`](usability-report.md).

