**Khoa Công nghệ Thông tin (FIT) – Trường Đại học Khoa học Tự nhiên (HCMUS)**

**CS423 / CSC15003 – Kiểm chứng Phần mềm (AI-augmented · 2026\)**

**CHÍNH SÁCH AI · BIỂU MẪU — 2026 v1.0**

# **Biểu mẫu Khai báo Sử dụng AI**

*Đính kèm cho mọi bài tập có dùng AI ở bất kỳ mức nào.*

*Tài liệu được biên soạn lại từ Med Kharbach, PhD (2026) — Mẫu Chính sách Sử dụng AI cho Giáo dục Đại học. Giấy phép CC BY-NC-SA 4.0. Phiên bản này được FIT@HCMUS điều chỉnh cho môn CS423 / CSC15003 Kiểm chứng Phần mềm.*

## **1\. Thông tin Môn học & Sinh viên**

| Mục | Giá trị |
| :---- | :---- |
| **Môn học:** | CS423 / CSC13003 – Kiểm thử phần mềm |
| **Mã bài tập:** | HW\#03 |
| **Tên bài tập:** | HW03 – GUI, Usability & Cross-Platform Testing |
| **Cấp độ AI (1–5):** | Cấp 4 |
| **Ngày:** | 08/11/2026 |
| **Họ tên sinh viên:** | TRƯƠNG THÀNH PHÁT |
| **MSSV:** | 23120319 |

## **2\. Câu hỏi Khai báo**

### **1\. Công cụ AI đã dùng:**

*Liệt kê mọi công cụ AI dùng cho bài tập này (ví dụ AI Tool (e.g., ChatGPT, Claude, Gemini), ChatGPT, GitHub Copilot, Cursor, Gemini).*

**Antigravity (Gemini 2.5 Flash, Claude 3.7 Sonnet), Claude Code.**

### **2\. Giai đoạn nào của bài tập có dùng AI:**

*Tick tất cả: \[ \] brainstorm  \[ \] outline  \[ \] viết nháp  \[ \] phản hồi  \[ \] sửa chữa  \[ \] code  \[ \] phân tích dữ liệu  \[ \] thiết kế đồ hoạ  \[ \] khác (ghi rõ).*

\[x\] brainstorm

\[x\] outline

\[x\] viết nháp

\[ \] phản hồi

\[x\] sửa chữa

\[x\] code (viết script tự động hóa: validate\_checklist.mjs, calculate\_sus.mjs, overlay\_username.py)

\[x\] phân tích dữ liệu (tính toán chỉ số SUS, phân tích độ lệch UI Skew giữa các nền tảng)

\[x\] thiết kế đồ hoạ (định dạng bảng ma trận kiểm thử, đối chiếu UI)

\[ \] khác (ghi rõ).

### **3\. Prompt / nhiệm vụ chính cho AI:**

*Dán nguyên văn 2–3 prompt quan trọng nhất. Để xem đầy đủ, đính kèm Phụ lục A (prompt\_log.md).*

**Prompt 1 — Thiết kế GUI Checklist 4 Khía cạnh (Task 1):**

*“Hãy đóng vai trò Principal QA Engineer, dựa vào mã nguồn frontend (React web, React admin, Expo mobile) và Slide bài giảng S13 môn Kiểm thử phần mềm, hãy thiết kế một GUI Checklist toàn diện với tối thiểu 40 mục kiểm thử, bao phủ đầy đủ 4 khía cạnh giao diện (IA-01 General UI Standards, IA-02 Forms, IA-03 Navigation, IA-04 Feedback & State). Xuất định dạng bảng Markdown có Item ID, Phân hệ, Khía cạnh, Tiêu chí kiểm tra.”*

**Prompt 2 — Thiết kế Kịch bản Nhiệm vụ & Phân tích Thang đo SUS (Task 2):**

*“Áp dụng skill usability-evaluation để thiết kế Task Scenario cho đợt Usability Testing trên EShop theo đúng cấu trúc chuẩn Slide 40 bài giảng CSC13003 S13: (1) Nhiệm vụ hướng mục tiêu, (2) Trạng thái máy ban đầu, (3) Tiêu chí hoàn thành, (4) Chuẩn đối sánh thời gian; và chạy script calculate\_sus.mjs trên file dữ liệu HW3/data/sus-responses.json để tính điểm SUS cho 7 người dùng theo công thức John Brooke (1996), xuất Mean, Median, Độ lệch chuẩn, xếp loại Bangor Grade (A/B/C/D/F) và so sánh với mốc chuẩn ngành 68.0.”*

**Prompt 3 — Ma trận Đối chiếu Đa nền tảng & Đóng dấu Watermark Email (Task 3 & 4):**

*“Áp dụng skill cross-platform-gui-testing, phân tích độ lệch giao diện (UI Skew Analysis) và đối chiếu kết quả kiểm thử trên 3 nền tảng: Google Chrome 157, Mozilla Firefox 159 và Expo Go Android 15 (Realme C53). Chạy script overlay\_username.py quét toàn bộ thư mục ảnh chụp màn hình, tự động đóng dấu email sinh viên 23120319@student.hcmus.edu.vn lên 82 ảnh bằng chứng minh chứng chống gian lận.”*

### **4\. Phần cụ thể AI đóng góp:**

*Càng cụ thể càng tốt. Ví dụ: 'AI sinh TC01–TC15 ở Mục 3.2; tôi viết lại TC04 và TC11; AI KHÔNG đóng góp vào Mục 1, 2, 4, hoặc AI Critique.'*

AI hỗ trợ sinh bản thảo ban đầu 42 mục GUI checklist (Artifact A01), viết mã nguồn 3 script kỹ thuật tự động hóa trong các Agent Skills (validate\_checklist.mjs, calculate\_sus.mjs, overlay\_username.py), cấu trúc hóa kịch bản Task Scenario theo Slide 40, và lập khung ma trận đối chiếu đa nền tảng. Tuy nhiên, tôi đã tự tiến hành AI Gap Analysis để bổ sung 3 ca kiểm thử logic chuyên sâu (CHK-WEB-15, CHK-MOB-09, CHK-MOB-10), loại bỏ lỗi giả BUG-UX-04 do AI suy diễn sai. Đặc biệt, tôi trực tiếp điều phối 7 phiên thử nghiệm khả dụng với người dùng thật, ghi chép nhật ký think-aloud, quay video thực tế có đối chứng, và trực tiếp thực thi kiểm thử trên thiết bị thật (Realme C53). AI hoàn toàn KHÔNG đóng góp vào việc thu thập dữ liệu người dùng thật, thực thi kiểm thử vật lý hay quay video minh chứng.

### **5\. Cách tôi rà soát / chỉnh sửa / xác minh đầu ra AI:**

*Mô tả phương pháp xác minh (chạy test, kiểm tra spec, hỏi TA, tra RFC, đối chiếu ISTQB syllabus, v.v.).*

Xác minh kết quả của AI bằng cách trực tiếp đọc và phân tích mã nguồn SUT (React.js trong frontend-web, frontend-admin, App.js trong frontend-mobile), chạy thực nghiệm trên máy trạm Windows 11 (Google Chrome 157, Mozilla Firefox 159\) và điện thoại thật Realme C53 (Android 15 / Expo Go). Soi chiếu các lỗi giao diện theo tiêu chuẩn ISTQB Foundation Level (Compatibility Testing, Defect Management) và Slide 40, 50 bài giảng S13 FIT@HCMUS. Chạy kiểm chứng độc lập script Node.js / Python trên terminal cục bộ để bảo đảm tính toàn vẹn cú pháp checklist và kết quả tính điểm SUS.

### **6\. Trích dẫn (nếu môn yêu cầu):**

*Môn Kiểm chứng Phần mềm dùng phong cách IEEE. Ví dụ: Anthropic. (2026). AI Tool (e.g., ChatGPT, Claude, Gemini) \[Large language model\]. https\://claude.ai*

Anthropic. (2026). Claude Code & Claude 3.7 Sonnet \[Large language model\]. https\://claude.ai

Google DeepMind. (2026). Antigravity & Gemini 2.5 Flash \[AI Assistant\]. https\://gemini.google.com

## **3\. Cam đoan Trung thực**

*Bằng việc ký tên dưới đây, tôi cam đoan thông tin khai báo ở trên là chính xác và đầy đủ. Tôi hiểu rằng việc không khai báo hoặc khai báo sai lệch về việc dùng AI sẽ bị coi là vi phạm liêm chính học thuật và có thể dẫn đến điểm 0 cho bài tập cùng việc bị chuyển lên hội đồng kỷ luật.*

## **Chữ ký**

| Họ tên sinh viên (in hoa): | TRƯƠNG THÀNH PHÁT |
| :---- | :---- |
| **MSSV:** | 23120319 |
| **Lớp / Khoá:** | Kiểm thử phần mềm \- CQ2023/3 \- Khóa 2023 |
| **Môn học:** | CS423 / CSC13003 – Kiểm thử phần mềm |
| **Giảng viên:** | Giảng viên: Trần Duy Hoàng Giảng viên: Trương Phước Lộc Giảng viên: Hồ Tuấn Thanh Giảng viên: Lâm Quang Vũ |
| **Ngày:** | 08/11/2026 |
| **Chữ ký:** | Trương Thành Phát |

## **Tham khảo**

* Kharbach, M. (2026). AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0.  
* ISTQB Foundation Level Syllabus (latest version).  
* Hardman, P. (2025). A Post-AI Learning Taxonomy.  
* Fuster Rabella, M. (2025). OECD Education Working Paper No. 338\.  
* Perkins, M., Roe, J., & Furze, L. (2025). AI Assessment Scale.  
* Anthropic (2025). Building reliable AI test agents — engineering blog.  
* DeepEval & Promptfoo documentation — testing frameworks for LLM systems.