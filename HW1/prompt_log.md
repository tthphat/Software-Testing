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

## [15:12 27/09/2026] - Requirement 3: Thiết kế Test Case cho Quạt máy 
- **Công cụ AI sử dụng:** Chat GPT
- **Prompt (Câu lệnh của tôi):**
  > 
``` text
"Tôi đang thực hiện bài tập kiểm thử phần cứng/thiết bị vật lý cho một chiếc quạt máy nhãn hiệu Senko, năm sản xuất 2024

Hãy giúp tôi thiết kế 12 test case chức năng thông thường cho thiết bị này. Mỗi test case phải trình bày theo đúng định dạng bảng gồm các cột sau:

1. Test Case ID (VD: TC01, TC02...)
2. Objective (Mục tiêu kiểm thử)
3. Input (Dữ liệu/Thao tác đầu vào)
4. Steps (Các bước thực hiện chi tiết)
5. Expected Result (Kết quả mong đợi)
6. Actual Result (Kết quả thực tế - để trống cho tôi điền)
7. Verdict (Đánh giá Pass/Fail - để trống cho tôi điền)

Lưu ý quan trọng: Hãy tập trung vào các chức năng cơ bản như: nút bấm tốc độ gió (1, 2, 3), nút tuốc-năng quay (xoay trái/phải), công tắc nguồn, và độ ổn định khi hoạt động liên tục."
```
- **Phản hồi của AI (Tóm tắt hoặc toàn văn):**
  >
  | Test Case ID | Objective | Input | Steps | Expected Result | Actual Result | Verdict |
  |:-------------|:----------|:------|:------|:----------------|:---------------|:--------|
  | TC01 | Kiểm tra bật quạt | Công tắc các nút 1,2,3 | 1. Cắm điện.<br>2. Chọn mức gió 1. | Quạt khởi động và cánh quạt quay ổn định. | | |
  | TC02 | Kiểm tra tắt quạt | Công tắc OFF | 1. Cho quạt chạy.<br>2. Ấn nút OFF hoặc mức quạt số 0. | Quạt dừng hoàn toàn. | | |
  | TC03 | Kiểm tra tốc độ gió mức 1 | Mức gió 1 | 1. Bật quạt.<br>2. Chọn mức 1.<br>3. Quan sát cánh quạt và luồng gió. | Quạt chạy ở tốc độ thấp, hoạt động ổn định. | | |
  | TC04 | Kiểm tra tốc độ gió mức 2 | Mức gió 2 | 1. Bật quạt.<br>2. Chọn mức 2.<br>3. Quan sát tốc độ quay. | Quạt chạy ở tốc độ trung bình, cao hơn mức 1. | | |
  | TC05 | Kiểm tra tốc độ gió mức 3 | Mức gió 3 | 1. Bật quạt.<br>2. Chọn mức 3.<br>3. Quan sát tốc độ quay. | Quạt chạy ở tốc độ cao, cao hơn mức 2. | | |
  | TC06 | Kiểm tra chuyển mức gió | 1 → 2 → 3 | 1. Bật quạt ở mức 1.<br>2. Chuyển sang mức 2.<br>3. Chuyển sang mức 3. | Tốc độ quạt thay đổi tương ứng, không bị dừng hoặc kẹt khi chuyển mức. | | |
  | TC07 | Kiểm tra chức năng tuốc năng | Nút tuốc-năng ON | 1. Bật quạt.<br>2. Kích hoạt nút tuốc-năng (Ấn xuống).<br>3. Quan sát đầu quạt. | Đầu quạt tự động quay qua lại, phân phối gió sang hai bên. | | |
  | TC08 | Kiểm tra dừng tuốc năng | Nút tuốc-năng OFF | 1. Bật chế độ tuốc-năng.<br>2. Chờ quạt quay.<br>3. Tắt tuốc-năng (Kéo lên). | Đầu quạt dừng quay và giữ ở vị trí hiện tại. | | |
  | TC09 | Kiểm tra hướng quay trái/phải | Tuốc năng hoạt động | 1. Bật tuốc-năng.<br>2. Quan sát đầu quạt khi quay sang trái.<br>3. Tiếp tục quan sát khi quay sang phải. | Đầu quạt chuyển hướng tuần tự trái → phải → trái, không bị kẹt. | | |
  | TC10 | Kiểm tra hoạt động kết hợp | Mức 3 + tuốc-năng | 1. Bật quạt.<br>2. Chọn mức 3.<br>3. Bật tuốc-năng.<br>4. Cho quạt hoạt động trong vài phút. | Quạt duy trì mức gió 3 và tuốc-năng hoạt động bình thường đồng thời. | | |
  | TC11 | Kiểm tra hoạt động liên tục | Mức 2, thời gian 2 giờ | 1. Bật quạt ở mức 2.<br>2. Bật tuốc-năng.<br>3. Để quạt hoạt động liên tục 2 giờ.<br>4. Quan sát trong quá trình chạy. | Quạt hoạt động liên tục, không tự tắt, không có hiện tượng bất thường như rung mạnh, kẹt hoặc dừng đột ngột. | | |
  | TC12 | Kiểm tra bật/tắt nhiều lần | ON/OFF × 10 lần | 1. Bật quạt.<br>2. Để quạt chạy vài giây.<br>3. Tắt quạt.<br>4. Lặp lại 10 lần. | Quạt bật/tắt bình thường ở tất cả các lần, không xảy ra lỗi hoặc mất chức năng. | | |

---

## [16:30 15/03/2026] - 
- **Công cụ AI sử dụng:**
- **Prompt (Câu lệnh của tôi):**
  > 
- **Phản hồi của AI (Tóm tắt hoặc toàn văn):**
  > [Dán câu trả lời của AI vào đây...]

---

## [16:30 15/03/2026] - 
- **Công cụ AI sử dụng:**
- **Prompt (Câu lệnh của tôi):**
  > 
- **Phản hồi của AI (Tóm tắt hoặc toàn văn):**
  > [Dán câu trả lời của AI vào đây...]

---
