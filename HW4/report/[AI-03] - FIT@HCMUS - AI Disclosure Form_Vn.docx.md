**Khoa Công nghệ Thông tin (FIT) – Trường Đại học Khoa học Tự nhiên (HCMUS)**

**CS423 / CSC13003 – Kiểm chứng Phần mềm (AI-augmented · 2026)**

**CHÍNH SÁCH AI · BIỂU MẪU — 2026 v1.0**

# **Biểu mẫu Khai báo Sử dụng AI**

*Đính kèm cho mọi bài tập có dùng AI ở bất kỳ mức nào.*

*Tài liệu được biên soạn lại từ Med Kharbach, PhD (2026) — Mẫu Chính sách Sử dụng AI cho Giáo dục Đại học. Giấy phép CC BY-NC-SA 4.0. Phiên bản này được FIT@HCMUS điều chỉnh cho môn CS423 / CSC13003 Kiểm chứng Phần mềm.*

## **1. Thông tin Môn học & Sinh viên**

| Mục | Giá trị |
| :---- | :---- |
| **Môn học:** | CS423 / CSC13003 – Kiểm thử phần mềm |
| **Mã bài tập:** | HW#04 |
| **Tên bài tập:** | HW04 – Web UI Automation Testing with Playwright |
| **Cấp độ AI (1–5):** | Cấp 4 |
| **Ngày:** | 15/11/2026 |
| **Họ tên sinh viên:** | TRƯƠNG THÀNH PHÁT |
| **MSSV:** | 23120319 |

## **2. Câu hỏi Khai báo**

### **1. Công cụ AI đã dùng:**

*Liệt kê mọi công cụ AI dùng cho bài tập này (ví dụ AI Tool (e.g., ChatGPT, Claude, Gemini), ChatGPT, GitHub Copilot, Cursor, Gemini).*

**Antigravity (Gemini 2.5 Flash, Claude 3.7 Sonnet), Claude Code.**

### **2. Giai đoạn nào của bài tập có dùng AI:**

*Tick tất cả: [ ] brainstorm  [ ] outline  [ ] viết nháp  [ ] phản hồi  [ ] sửa chữa  [ ] code  [ ] phân tích dữ liệu  [ ] thiết kế đồ hoạ  [ ] khác (ghi rõ).*

[x] brainstorm

[x] outline

[x] viết nháp

[ ] phản hồi

[x] sửa chữa

[x] code (viết kịch bản Playwright TypeScript fr01/fr08/fr12, validate_automation.mjs, export_run_summary.mjs, authorship-reporter.ts)

[x] phân tích dữ liệu (phân tích kết quả test 108 runs từ results.json, đối soát mã nguồn SUT tìm nguyên nhân 4 bugs)

[x] thiết kế đồ hoạ (định dạng bảng ma trận kiểm thử đa trình duyệt, sơ đồ phân bổ khiếm khuyết)

[ ] khác (ghi rõ).

### **3. Prompt / nhiệm vụ chính cho AI:**

*Dán nguyên văn 2–3 prompt quan trọng nhất. Để xem đầy đủ, đính kèm Phụ lục A (prompt_log.md).*

**Prompt 1 — Áp dụng Agent Skill playwright-automation-testing & Kế thừa Test Case HW02 cho FR-01:**

*“Áp dụng agent skill playwright-automation-testing, hãy đọc 12 test case từ bài tập HW02 của tính năng FR-01 (Đăng ký tài khoản), chuyển đổi sang file dữ liệu data-driven fr01-registration.json, đồng thời tạo cấu hình playwright.config.ts hỗ trợ 3 trình duyệt Chromium, Firefox, WebKit có gắn metadata tác giả 'Run by: 23120319', timestamp ISO, và sinh kịch bản Playwright TypeScript fr01-registration.spec.ts với ít nhất 3 kiểu assertion để phát hiện khiếm khuyết SUT.”*

**Prompt 2 — Kế thừa Test Case HW02 cho Kịch bản FR-08 & Xử lý Trạng thái Bất đồng bộ:**

*“Áp dụng agent skill playwright-automation-testing. Đọc 12 test case từ HW02 cho tính năng FR-08 (Giỏ hàng & Thanh toán), chuyển đổi thành fr08-checkout.json và xây dựng kịch bản kiểm thử tự động fr08-checkout.spec.ts. Áp dụng kỹ thuật Client-side Navigation để giữ vững React Context state, chèn waitForResponse đón sự kiện API tính tiền bất đồng bộ và kiểm tra lỗ hổng sửa tổng tiền.”*

**Prompt 3 — Kế thừa Test Case HW02 cho Kịch bản FR-12 & Kiểm thử Bảo mật API:**

*“Áp dụng agent skill playwright-automation-testing. Đọc 12 test case từ HW02 cho tính năng FR-12 (Kiểm soát quyền Admin Web & API), chuyển đổi thành fr12-access-control.json và xây dựng kịch bản fr12-access-control.spec.ts cho Web Admin port 5174. Tinh chỉnh bộ định vị tránh xung đột Strict Mode, và bổ sung test case kiểm thử lỗ hổng Broken Access Control khi người dùng thường gọi endpoint /api/admin/users.”*

### **4. Phần cụ thể AI đóng góp:**

*Càng cụ thể càng tốt. Ví dụ: 'AI sinh TC01–TC15 ở Mục 3.2; tôi viết lại TC04 và TC11; AI KHÔNG đóng góp vào Mục 1, 2, 4, hoặc AI Critique.'*

AI hỗ trợ sinh khung cấu hình playwright.config.ts, chuyển đổi 36 test cases từ HW02 sang 3 file data-driven JSON (fr01-registration.json, fr08-checkout.json, fr12-access-control.json), viết bản thảo kịch bản Playwright TypeScript cho 3 tính năng, và hỗ trợ viết 2 script kỹ thuật tự động hóa (validate_automation.mjs, export_run_summary.mjs). Tuy nhiên, tôi đã trực tiếp phân tích DOM thực tế để thay thế các locator mỏng manh (getByLabel không có id/for) bằng locator kế cận và getByPlaceholder, giải quyết xung đột Strict Mode tại tab Đơn hàng của FR-12 với exact match, xử lý cơ chế Client Navigation và waitForResponse cho giỏ hàng ở FR-08. Tôi cũng trực tiếp phân tích mã nguồn backend/server.js và frontend-web/Checkout.jsx để xác định nguyên nhân gốc rễ và lập hồ sơ 4 lỗi SUT (BUG-AUTO-01 đến 04) cùng 4 GitHub Issues (#115 đến #118). AI hoàn toàn KHÔNG tham gia vào việc cấu hình môi trường runtime (khởi động 3 server), chạy test trên thiết bị thật, chụp ảnh màn hình đóng dấu watermark hay tạo issue trên GitHub.

### **5. Cách tôi rà soát / chỉnh sửa / xác minh đầu ra AI:**

*Mô tả phương pháp xác minh (chạy test, kiểm tra spec, hỏi TA, tra RFC, đối chiếu ISTQB syllabus, v.v.).*

Xác minh kết quả của AI bằng cách trực tiếp chạy bộ test suite Playwright trên 3 trình duyệt thực tế (Chromium, Firefox, WebKit) qua lệnh npx playwright test, đối chiếu kết quả từng assertion với hành vi runtime của SUT. Chạy script validate_automation.mjs kiểm tra cú pháp và độ đa dạng assertion. Đọc trực tiếp mã nguồn SQLite, Express backend và React frontend để kiểm chứng tính xác thực của các khiếm khuyết được phát hiện thay vì tin tưởng mù quáng vào kết quả fail của test case.

### **6. Trích dẫn (nếu môn yêu cầu):**

*Môn Kiểm chứng Phần mềm dùng phong cách IEEE. Ví dụ: Anthropic. (2026). AI Tool (e.g., ChatGPT, Claude, Gemini) [Large language model]. https://claude.ai*

Anthropic. (2026). Claude Code & Claude 3.7 Sonnet [Large language model]. https://claude.ai

Google DeepMind. (2026). Antigravity & Gemini 2.5 Flash [AI Assistant]. https://gemini.google.com

## **3. Cam đoan Trung thực**

*Bằng việc ký tên dưới đây, tôi cam đoan thông tin khai báo ở trên là chính xác và đầy đủ. Tôi hiểu rằng việc không khai báo hoặc khai báo sai lệch về việc dùng AI sẽ bị coi là vi phạm liêm chính học thuật và có thể dẫn đến điểm 0 cho bài tập cùng việc bị chuyển lên hội đồng kỷ luật.*

## **Chữ ký**

| Họ tên sinh viên (in hoa): | TRƯƠNG THÀNH PHÁT |
| :---- | :---- |
| **MSSV:** | 23120319 |
| **Lớp / Khoá:** | Kiểm thử phần mềm - CQ2023/3 - Khóa 2023 |
| **Môn học:** | CS423 / CSC13003 – Kiểm thử phần mềm |
| **Giảng viên:** | Giảng viên: Trần Duy Hoàng<br>Giảng viên: Trương Phước Lộc<br>Giảng viên: Hồ Tuấn Thanh<br>Giảng viên: Lâm Quang Vũ |
| **Ngày:** | 15/11/2026 |
| **Chữ ký:** | Trương Thành Phát |

## **Tham khảo**

* Kharbach, M. (2026). AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0.  
* ISTQB Foundation Level Syllabus (latest version).  
* Hardman, P. (2025). A Post-AI Learning Taxonomy.  
* Fuster Rabella, M. (2025). OECD Education Working Paper No. 338.  
* Perkins, M., Roe, J., & Furze, L. (2025). AI Assessment Scale.  
* Anthropic (2025). Building reliable AI test agents — engineering blog.  
* DeepEval & Promptfoo documentation — testing frameworks for LLM systems.

