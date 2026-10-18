# Agent Skills Changelog (v1 → v2 Improvements)

Tài liệu này ghi nhận quá trình cải tiến và tiến hóa của các Agent Skill từ **v1.0** qua **v1.1** đến **v2.0** dựa trên phản hồi của người kiểm thử (Human-in-the-loop) và kết quả **AI Gap Analysis** trong quá trình kiểm thử thực tế trên hệ thống EShop SUT.

---

## 1. Tổng quan các cải tiến (Evolution Summary)

| Phiên bản | Ngày cập nhật | Kỹ năng được nâng cấp | Nguồn gốc phát hiện (Feature) | Mục đích cải tiến |
| :---: | :---: | :--- | :---: | :--- |
| **v1.0** | 2026-10-14 | Bộ 4 skills ban đầu | Khởi tạo ban đầu | Quy trình 4 bước kiểm thử miền, BVA và bộ runner cơ bản |
| **v1.1** | 2026-10-17 | `domain-testing` (Stage 1) | **FR-01 (Account Registration)** | Bổ sung cột **"Domain Value & Constraints"** vào Bảng biến Input/Output/State; làm căn cứ chặt chẽ cho Stage 2 phân hoạch lớp tương đương |
| **v2.0** | 2026-10-18 | `domain-testing`, `boundary-value-analysis`, `test-execution-and-bugs` | **FR-01 (Account Registration)** | Bổ sung kiểm tra lệch pha đa nền tảng (Web vs Mobile vs Backend), kiểm tra Unicode UTF-8 tiếng Việt, và nguyên tắc Zero-Trust SUT |

---

## 2. Chi tiết các nâng cấp và khoảng trống AI (AI Gaps)

### 2.1. Nâng cấp v1.1 (2026-10-17): Bổ sung cột "Domain (Miền giá trị & Ràng buộc)" tại Stage 1 của Domain Testing

- **Vấn đề phát hiện:**
  - Ở phiên bản v1.0, Stage 1 chỉ yêu cầu lập bảng biến đơn giản (`Variable | Kind | Type | Source tag`).
  - Hậu quả: AI khi bước sang Stage 2 phân hoạch lớp tương đương thường tự suy đoán các khoảng giá trị hoặc bỏ sót các ràng buộc nghiệp vụ (như độ dài tối đa theo RFC, tính duy nhất của email, tính nullable).
  - Người kiểm thử (Human Review) phát hiện bảng biến thiếu căn cứ miền giá trị và yêu cầu bổ sung cột Domain value trước khi sinh các lớp tương đương.
- **Phân loại nguyên nhân:** `Prompt/input quality` & `Inherent feature complexity`.
- **Cải tiến cụ thể trong Skill v1.1:**
  - Cập nhật file `.claude/skills/domain-testing/SKILL.md` (Stage 1):
    ```markdown
    Table: Variable | Kind (input/output/state) | Type | Domain (possible values and constraints) | Source tag
    ```
  - **Quy tắc bắt buộc:** Cột "Domain" phải liệt kê tường minh toàn bộ tập giá trị khả dĩ, các ràng buộc kỹ thuật (độ dài, định dạng regex, enum, nullable, mâu thuẫn giữa code và spec). Nếu chưa rõ phải ghi `unknown` và đưa vào Câu hỏi mở.
  - **Ràng buộc quy trình:** Stage 2 chỉ được phép tạo các lớp tương đương (EC) dựa trên những gì đã được ghi nhận trong cột Domain này.

---

### 2.2. Nâng cấp v2.0 (2026-10-18): AI Gap Analysis sau khi thực thi kiểm thử và báo cáo lỗi FR-01

#### Gap 1: Bỏ sót sự lệch pha validation giữa các nền tảng (Web vs Mobile vs Backend)
- **Vấn đề phát hiện:** AI ban đầu chỉ phân tích Backend `server.js` và `api_specification.md`, bỏ sót việc Frontend Web (`Register.jsx:15`) dùng regex lỗi `flawedStrongPasswordRegex` đòi hỏi khoảng trắng `\s` thay vì ký tự đặc biệt, trong khi Frontend Mobile (`App.js:212`) dùng regex chuẩn ký tự đặc biệt `[^A-Za-z\d]`.
- **Phân loại nguyên nhân:** `Inherent feature complexity` & `Tool limitation` (Hệ thống có đa nền tảng với logic validation không đồng bộ).
- **Cải tiến cụ thể trong Skill v2.0:**
  - Bổ sung vào `domain-testing/SKILL.md` (Stage 0): **Checklist Đa nền tảng (Cross-platform Skew Checklist)**. Khi khảo sát tính năng, bắt buộc phải duyệt cả 3 nguồn: Backend API, Frontend Web JSX, và Frontend Mobile App.js để phát hiện các quy tắc validation mâu thuẫn giữa client và server.

#### Gap 2: Bỏ quên kiểm tra mã hóa Unicode tiếng Việt (UTF-8 bytes vs Character length)
- **Vấn đề phát hiện:** AI có xu hướng mặc định sinh dữ liệu kiểm thử bằng ký tự ASCII chuẩn (`"A".repeat(100)`), bỏ qua việc tiếng Việt có dấu (như `"Nguyễn"`) có kích thước byte (2-3 bytes/ký tự) lớn hơn nhiều so với ký tự không dấu. Nếu server kiểm tra độ dài bằng `Buffer.byteLength` thay vì `string.length`, lỗi biên sẽ xảy ra sớm hơn dự kiến.
- **Phân loại nguyên nhân:** `Prompt/input quality` (Prompt chưa chỉ định rõ ngữ cảnh ứng dụng thương mại điện tử Việt Nam).
- **Cải tiến cụ thể trong Skill v2.0:**
  - Bổ sung vào `boundary-value-analysis/SKILL.md` (Stage 3): **Quy tắc kiểm thử biên mã hóa (Encoding Boundary Rule)**. Mọi trường chuỗi văn bản (tên, địa chỉ) phải bổ sung ít nhất 1 ca kiểm thử chứa ký tự tiếng Việt có dấu tại đúng điểm biên trên để phân biệt độ dài byte và độ dài ký tự.

#### Gap 3: Xu hướng suy đoán hệ thống hoạt động đúng chuẩn (Bias towards standard behavior)
- **Vấn đề phát hiện:** Khi thiết kế các ca kiểm thử cho dữ liệu không hợp lệ (name rỗng, email sai cú pháp, trùng lặp email), AI tự động gán kỳ vọng là HTTP 400 / 409 theo tiêu chuẩn REST API. Nhưng khi chạy thực tế, SUT trả về HTTP 200 cho 20/30 ca kiểm thử vì backend hoàn toàn không có validation.
- **Phân loại nguyên nhân:** `Tool limitation` (Mô hình AI bị thiên kiến bởi các best practices thay vì kiểm chứng code thực tế).
- **Cải tiến cụ thể trong Skill v2.0:**
  - Bổ sung vào `test-execution-and-bugs/SKILL.md` (Stage 3): **Nguyên tắc "Zero-Trust SUT"**. Trước khi chạy test, phải kiểm tra sự hiện diện của câu lệnh `if` kiểm tra dữ liệu trong route handler. Nếu code không có câu lệnh kiểm tra, phải gắn cờ cảnh báo trước để người kiểm thử dự trù các trường hợp FAIL hàng loạt.

---

## 3. Kế hoạch áp dụng bản v2

Bản nâng cấp v2 sẽ được áp dụng cho tính năng tiếp theo để chứng minh:
1. Xác định chuẩn xác miền giá trị và ràng buộc ngay từ Stage 1.
2. Phát hiện sớm các lỗi mâu thuẫn giữa Web và Mobile.
3. Thiết kế bao quát hơn các ca kiểm thử Unicode tiếng Việt.
4. Dự báo chính xác hơn các lỗi do thiếu kiểm tra dữ liệu ở backend (Zero-Trust SUT).
