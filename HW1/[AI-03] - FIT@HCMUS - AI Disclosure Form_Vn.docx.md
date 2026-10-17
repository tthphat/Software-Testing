**Khoa Công nghệ Thông tin (FIT) – Trường Đại học Khoa học Tự nhiên (HCMUS)**

**CS423 / CSC15003 – Kiểm chứng Phần mềm (AI-augmented · 2026\)**

**CHÍNH SÁCH AI · BIỂU MẪU — 2026 v1.0**

# **Biểu mẫu Khai báo Sử dụng AI**

*Đính kèm cho mọi bài tập có dùng AI ở bất kỳ mức nào.*

*Tài liệu được biên soạn lại từ Med Kharbach, PhD (2026) — Mẫu Chính sách Sử dụng AI cho Giáo dục Đại học. Giấy phép CC BY-NC-SA 4.0. Phiên bản này được FIT@HCMUS điều chỉnh cho môn CS423 / CSC15003 Kiểm chứng Phần mềm.*

## **1\. Thông tin Môn học & Sinh viên**

| Mục | Giá trị |
| :---- | :---- |
| **Môn học:** | CS423 / CSC13003 – Kiểm chứng Phần mềm |
| **Mã bài tập:** | HW\#01 |
| **Tên bài tập:** | HW01 – QA/QC Jobs · 20 Defects · Test a Physical Product |
| **Cấp độ AI (1–5):** | Cấp 4 |
| **Ngày:** | 27/09/2026 |
| **Họ tên sinh viên:** | TRƯƠNG THÀNH PHÁT |
| **MSSV:** | 23120319 |

## **2\. Câu hỏi Khai báo**

### **1\. Công cụ AI đã dùng:**

*Liệt kê mọi công cụ AI dùng cho bài tập này (ví dụ AI Tool (e.g., ChatGPT, Claude, Gemini), ChatGPT, GitHub Copilot, Cursor, Gemini).*

Gemini 3.6 Flash, Chat GPT.

### **2\. Giai đoạn nào của bài tập có dùng AI:**

*Tick tất cả: \[ \] brainstorm  \[ \] outline  \[ \] viết nháp  \[ \] phản hồi  \[ \] sửa chữa  \[ \] code  \[ \] phân tích dữ liệu  \[ \] thiết kế đồ hoạ  \[ \] khác (ghi rõ).*

\[x\] brainstorm  

\[x\] outline 

\[x\] viết nháp 

\[ \] phản hồi 

\[x\] sửa chữa 

\[ \] code  

\[x\] phân tích dữ liệu 

\[x\] thiết kế đồ hoạ 

\[ \] khác (ghi rõ).

### **3\. Prompt / nhiệm vụ chính cho AI:**

*Dán nguyên văn 2–3 prompt quan trọng nhất. Để xem đầy đủ, đính kèm Phụ lục A (prompt\_log.md).*

* Hãy giúp tôi tìm 20 sự cố/lỗi phần mềm được công bố từ 2022 đến 2026\. Trong đó phải có tối thiểu 5 lỗi về AI/LLM (hallucination, prompt injection, bias). Mỗi lỗi trình bày rõ: Nguồn tham khảo, Mô tả lỗi, Mức độ nghiêm trọng, Hậu quả và Giải pháp.

* Tôi đang thực hiện bài tập kiểm thử phần cứng/thiết bị vật lý cho một chiếc quạt máy nhãn hiệu Senko, năm sản xuất 2024

  Hãy giúp tôi thiết kế 12 test case chức năng thông thường cho thiết bị này. Mỗi test case phải trình bày theo đúng định dạng bảng gồm các cột sau:

  1\. Test Case ID (VD: TC01, TC02...)

  2\. Objective (Mục tiêu kiểm thử)

  3\. Input (Dữ liệu/Thao tác đầu vào)

  4\. Steps (Các bước thực hiện chi tiết)

  5\. Expected Result (Kết quả mong đợi)

  6\. Actual Result (Kết quả thực tế \- để trống cho tôi điền)

  7\. Verdict (Đánh giá Pass/Fail \- để trống cho tôi điền)

  Lưu ý quan trọng: Hãy tập trung vào các chức năng cơ bản như: nút bấm tốc độ gió (1, 2, 3), nút tuốc-năng quay (xoay trái/phải), công tắc nguồn, và độ ổn định khi hoạt động liên tục.

* Hãy đóng vai trò là một Chuyên gia Kiểm thử Phần mềm (Principal QA/QC Architect) có chứng chỉ ISTQB. Hãy giúp tôi thiết kế một sơ đồ tư duy (Mindmap) toàn diện về "Vai trò và Trách nhiệm của QA/QC trong ngành Công nghệ phần mềm hiện đại năm 2026".

  Yêu cầu định dạng đầu ra: ảnh png

  Nội dung sơ đồ cần bao phủ các nhánh chính sau:

  \- Nhánh 1: Core Responsibilities (Trách nhiệm cốt lõi: Test Planning, Test Design, Execution, Bug Management).

  \- Nhánh 2: Modern Automation & Technical Skills (Kỹ năng kỹ thuật & Tự động hóa: Playwright/Selenium, API Testing, CI/CD Integration, Performance/Security).

  \- Nhánh 3: AI-Augmented QA & Quality Governance (Ứng dụng AI & Quản trị chất lượng: GenAI trong test generation, Risk-based testing, Shift-Left testing, Process Quality / ASPICE).

  \- Nhánh 4: Collaboration & Soft Skills (Kỹ năng mềm & Phối hợp: Làm việc với PO/Dev/Client, Root-cause analysis, Release Risk Governance).

### **4\. Phần cụ thể AI đóng góp:**

*Càng cụ thể càng tốt. Ví dụ: 'AI sinh TC01–TC15 ở Mục 3.2; tôi viết lại TC04 và TC11; AI KHÔNG đóng góp vào Mục 1, 2, 4, hoặc AI Critique.'*

AI hỗ trợ phác thảo cấu trúc 20 sự cố phần mềm (Artifact \#2), sinh danh sách 12 Test Case chức năng ban đầu cho quạt Senko (Artifact \#3) và tạo cấu trúc mindmap QA/QC (Artifact \#4). Tuy nhiên, tôi đã tự rà soát, loại bỏ các link nguồn ảo giác của AI, tự thiết kế bổ sung 3 trường hợp biên vật lý quan trọng (EC01, EC02, EC03) cho quạt Senko, tự viết toàn bộ kết quả thực tế (Actual Result), đánh giá (Verdict), phần AI Critique, đoạn Mandatory Disclosure và tự thực hiện 100% các hạng mục chống gian lận (ảnh chụp thiết bị cùng thẻ sinh viên, quay video thực thi vật lý có giọng đọc thuyết minh). AI hoàn toàn KHÔNG đóng góp vào việc quay video, chụp ảnh thiết bị, hay viết báo cáo chi tiết cuối cùng. 

### **5\. Cách tôi rà soát / chỉnh sửa / xác minh đầu ra AI:**

*Mô tả phương pháp xác minh (chạy test, kiểm tra spec, hỏi TA, tra RFC, đối chiếu ISTQB syllabus, v.v.).*

Xác minh kết quả của AI bằng cách đối chiếu trực tiếp với đặc tính vật lý thực tế của chiếc quạt Senko trên tay (kiểm tra cơ chế trượt hộp số tuốc-năng, khớp gục đầu quạt), tra cứu lại các nguồn thông tin chính thống để thay thế các liên kết nguồn bị lỗi do AI sinh ra, và soi chiếu theo các tiêu chuẩn trong Syllabus ISTQB Foundation Level (về kiểm thử hộp đen, phân tích vùng tương đương, giá trị biên và phân tích tác động hệ thống). 

### **6\. Trích dẫn (nếu môn yêu cầu):**

*Môn Kiểm chứng Phần mềm dùng phong cách IEEE. Ví dụ: Anthropic. (2026). AI Tool (e.g., ChatGPT, Claude, Gemini) \[Large language model\]. https://claude.ai*

OpenAI. (2026). *ChatGPT* \[Large language model\]. [https://chatgpt.com](https://chatgpt.com?utm_source=gemini)

Google. (2026). *Gemini* \[Large language model\]. [https://gemini.google.com](https://gemini.google.com?utm_source=gemini)

## **3\. Cam đoan Trung thực**

*Bằng việc ký tên dưới đây, tôi cam đoan thông tin khai báo ở trên là chính xác và đầy đủ. Tôi hiểu rằng việc không khai báo hoặc khai báo sai lệch về việc dùng AI sẽ bị coi là vi phạm liêm chính học thuật và có thể dẫn đến điểm 0 cho bài tập cùng việc bị chuyển lên hội đồng kỷ luật.*

## **Chữ ký**

| Họ tên sinh viên (in hoa): | TRƯƠNG THÀNH PHÁT |
| :---- | :---- |
| **MSSV:** | 23120319 |
| **Lớp / Khoá:** | Kiểm thử phần mềm \- CQ2023/3 \- Khóa 2023 |
| **Môn học:** | CS423 / CSC13003 – Kiểm chứng Phần mềm |
| **Giảng viên:** | Giảng viên: Trần Duy Hoàng Giảng viên: Trương Phước Lộc Giảng viên: Hồ Tuấn Thanh Giảng viên: Lâm Quang Vũ |
| **Ngày:** | 27/09/2026 |
| **Chữ ký:** | Phát |

## **Tham khảo**

* Kharbach, M. (2026). AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0.  
* ISTQB Foundation Level Syllabus (latest version).  
* Hardman, P. (2025). A Post-AI Learning Taxonomy.  
* Fuster Rabella, M. (2025). OECD Education Working Paper No. 338\.  
* Perkins, M., Roe, J., & Furze, L. (2025). AI Assessment Scale.  
* Anthropic (2025). Building reliable AI test agents — engineering blog.  
* DeepEval & Promptfoo documentation — testing frameworks for LLM systems.