# Phụ lục B — Phản biện AI (AI Critique)
**Môn học:** CS423 / CSC13003 — Kiểm thử phần mềm (HK1/2026–2027)  
**Khoa Công nghệ Thông tin — Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM**  
**Sinh viên thực hiện:** TRƯƠNG THÀNH PHÁT — **MSSV:** 23120319 — **Lớp:** CQ2023/3  

---

Trong quá trình xây dựng bộ kiểm thử tự động hóa Playwright TypeScript cho bài tập HW04, AI đã hỗ trợ đắc lực trong việc tách bạch kiến trúc dữ liệu (Data-Driven Testing) và phân tích mã nguồn SUT. Tuy nhiên, AI bộc lộ ba hạn chế kỹ thuật rõ rệt:

1. **Thiên kiến tạo bộ định vị mỏng manh (Brittle Locators & Strict Mode Ambiguity):** Tại kịch bản FR-01, AI ban đầu sử dụng `getByLabel` cho các trường biểu mẫu không hề có thuộc tính liên kết `id/for`, dẫn đến lỗi timeout. Tương tự tại FR-12 (`TC-FR12-10`), AI chỉ định `getByText('Đơn hàng')` thiếu cờ `{ exact: true }`, gây xung đột Playwright Strict Mode do trùng khớp đồng thời với menu điều hướng và thẻ thống kê trên Dashboard.
2. **Ảo tưởng về trạng thái bất đồng bộ và Client-side State:** Tại kịch bản FR-08, AI giả định truy cập trực tiếp `page.goto('/checkout')` sẽ tự động hiển thị giỏ hàng, bỏ quên cơ chế React Context chỉ đồng bộ state khi điều hướng nội bộ (client-side click). Đồng thời, AI không tự chèn `waitForResponse` để đón sự kiện tính toán mã giảm giá bất đồng bộ, gây ra lỗi Assertion Race Condition.
3. **Bỏ qua ngữ cảnh Runtime đa trình duyệt:** AI mặc định các sự kiện kích hoạt trên Chromium sẽ hoạt động y hệt trên Firefox và WebKit, dẫn đến việc phải hiệu chỉnh thủ công cơ chế lắng nghe hộp thoại alert và điều hướng trang.

**Bài học cốt lõi:** Nguyên tắc **"Human-in-the-Loop"** (Con người giữ quyền kiểm soát) là bất biến trong kiểm thử tự động. AI chỉ là công cụ gia tốc sinh mã thô; kỹ sư kiểm thử phải trực tiếp thanh tra DOM thực tế, xử lý bẫy đa luồng/bất đồng bộ, và đối soát chặt chẽ từng assertion để bảo đảm độ tin cậy tuyệt đối của hệ thống kiểm thử.

