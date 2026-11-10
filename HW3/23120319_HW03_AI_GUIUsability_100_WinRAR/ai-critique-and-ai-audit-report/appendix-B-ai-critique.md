# Phụ lục B — Phản biện AI (AI Critique)
**Môn học:** CS423 / CSC13003 — Kiểm thử phần mềm (HK1/2026–2027)  
**Khoa Công nghệ Thông tin — Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM**  
**Sinh viên thực hiện:** TRƯƠNG THÀNH PHÁT — **MSSV:** 23120319 — **Lớp:** CQ2023/3  

---

Trong đồ án HW03, AI bộc lộ ba thiếu sót và thiên kiến rõ rệt: (1) Thiên kiến giả định tĩnh: tại Task 1 (A01), AI chỉ sinh checklist chung chung, bỏ sót các lỗi nghiệp vụ nghiêm trọng của EShop như sửa tổng tiền Checkout và nhân đôi doanh thu Admin; (2) Nhận định sai lầm (False Positive): tại Task 2 (A08), AI đề xuất bug sai khi khẳng định ô tìm kiếm không nhận phím Enter dù thẻ form đã xử lý chuẩn xác; (3) Bỏ quên hành vi thiết bị thật: tại Task 3 (A04), AI không tự lường trước xung đột Safe Area hay bàn phím ảo che nút bấm trên Expo Go Android.

Các hạn chế này xuất phát từ việc AI chỉ phân tích văn bản mã nguồn tĩnh, hoàn toàn thiếu trải nghiệm runtime động trên trình duyệt và thiết bị di động thật. Đồng thời, AI không thể tự vận hành như một người dùng cuối để thấu cảm các va vấp trải nghiệm thực tế.

Bài học cốt lõi là nguyên tắc "Zero-Trust và Kiểm soát bởi con người" (Human-in-the-loop). AI là trợ thủ đắc lực giúp lập trình script tự động hóa và định dạng tài liệu, nhưng kỹ sư kiểm thử phải luôn giữ tư duy phản biện, trực tiếp chạy thử trên thiết bị vật lý và đối chiếu mã nguồn để loại bỏ các ảo tưởng của mô hình.
