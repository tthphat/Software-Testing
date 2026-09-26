# NHẬT KÝ PROMPT - BÀI TẬP HW01 (AI-FIRST EDITION)

- **Họ và tên:** Trương Thành Phát
- **Mã số sinh viên (MSSV):** 23120319
- **Lớp:** Kiểm thử phần mềm - CQ2023/3
- **Công cụ AI chủ đạo sử dụng:** ChatGPT / Claude / Gemini

---

## [22:30 26/09/2026] - AI phân tích software defect để đánh giá mức độ hallucination, bias
- **Công cụ AI sử dụng:** ChatGPT
- **Prompt (Câu lệnh của tôi):**
  > 
``` text
Hãy phân tích lỗi phần mềm 7. CrowdStrike Falcon Agent Channel File 291 Crash (07/2024)
trình bày theo cấu trúc sau:
  - Source Link:
  - Description:
  - Severity:
  - Consequences:
  - Solution:
```
- **Phản hồi của AI (Tóm tắt hoặc toàn văn):**
  >
``` text
- Source Link: CrowdStrike – Root Cause Analysis
- Description: Ngày 19/07/2024, bản cập nhật Channel File 291 của CrowdStrike Falcon có dữ liệu lỗi. Falcon Sensor xử lý dữ liệu này gây out-of-bounds memory read, dẫn đến Windows BSOD.
- Severity: Critical – ảnh hưởng diện rộng đến hệ thống Windows.
- Consequences: Máy tính bị BSOD/reboot loop, nhiều hệ thống doanh nghiệp ngừng hoạt động, phải khôi phục thủ công.
- Solution: CrowdStrike revert bản cập nhật. Với máy bị BSOD, cần vào Recovery/Safe Mode và xóa file Channel 291 lỗi trong:
 C:\Windows\System32\drivers\CrowdStrike\
 Sau đó khởi động lại và cập nhật Falcon.

```

---

## [14:45 15/03/2026] - Yêu cầu 3: Thiết kế Test Case cho Quạt máy (G9.3)
- **Công cụ AI sử dụng:** Claude 3.5 Sonnet
- **Prompt (Câu lệnh của tôi):**
  > Tôi đang sở hữu một chiếc quạt đứng nhãn hiệu Panasonic, model F-CW32D, sản xuất năm 2024. Hãy thiết kế cho tôi 15 ca kiểm thử (Test Cases) chi tiết gồm các trường hợp: Mục tiêu, Dữ liệu đầu vào, Các bước thực hiện, Kết quả mong đợi, Kết quả thực tế, Đánh giá (Verdict). Hãy cố gắng đưa vào các trường hợp biên khó mà một công cụ AI thông thường dễ bỏ sót liên quan đến điện áp biến động hoặc tình trạng quá nhiệt.
- **Phản hồi của AI (Tóm tắt hoặc toàn văn):**
  > [Dán toàn bộ 15 test case do AI tạo ra vào đây...]

---

## [16:30 15/03/2026] - Hỗ trợ phân tích lỗi phần mềm (Yêu cầu 2)
- **Công cụ AI sử dụng:** Gemini Pro
- **Prompt (Câu lệnh của tôi):**
  > Hãy liệt kê giúp tôi 3 lỗi ảo giác (hallucination) hoặc thiên vị (bias) tiêu biểu xảy ra trong các hệ thống LLM / AI được công khai từ năm 2022 đến 2026, kèm theo nguồn mô tả, mức độ nghiêm trọng và giải pháp khắc phục.
- **Phản hồi của AI (Tóm tắt hoặc toàn văn):**
  > [Dán câu trả lời của AI vào đây...]

