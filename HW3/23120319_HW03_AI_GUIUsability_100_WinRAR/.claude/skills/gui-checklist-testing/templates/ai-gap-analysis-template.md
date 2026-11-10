# AI Gap Analysis Template (Phân tích khoảng trống của AI trong kiểm thử GUI)

## 1. Mục đích
Ghi nhận các tiêu chí kiểm thử giao diện quan trọng mà mô hình AI đã bỏ sót trong quá trình tạo Checklist GUI ban đầu, phân loại nguyên nhân cốt lõi và rút ra bài học kinh nghiệm khi phối hợp người - máy (Human-in-the-loop).

---

## 2. Bảng phân tích chi tiết các mục AI bỏ sót

| STT | Item ID bổ sung | Thuộc Aspect | Tiêu chí bị bỏ sót | Phân loại nguyên nhân (`Prompt quality` / `Model limitation` / `Inherent UI complexity`) | Phân tích chi tiết: Vì sao AI bỏ sót? | Tác động nếu không có Human Review |
|:---:|:---:|:---:|:---|:---:|:---|:---|
| 1 | CHK-IA01-07 | IA-01 | Khả năng tiếp cận: Độ tương phản màu (WCAG AA Contrast) | `Model limitation` | Mô hình ngôn ngữ lớn (LLM) chỉ xử lý mã nguồn văn bản hoặc CSS hex code, không thể "cảm nhận thị giác" được độ tương phản thực tế giữa chữ và nền trong các điều kiện ánh sáng môi trường khác nhau. | Người dùng khiếm thị hoặc môi trường chói nắng không thể đọc được nhãn nút bấm. |
| 2 | CHK-IA01-08 | IA-01 | Tràn chữ tiếng Việt (Text truncation with Vietnamese accents) | `Prompt/input quality` | Prompt ban đầu không nhấn mạnh đặc thù ngôn ngữ tiếng Việt (chữ có dấu như `ệ, ợ, ẫ` có dấu mũ và móc làm tăng chiều cao dòng, độ dài từ ngữ tiếng Việt thường dài hơn tiếng Anh). | Giao diện bị vỡ layout, chữ bị cắt cụt (ellipsis) hoặc đè lên thành phần bên dưới. |
| 3 | CHK-IA02-07 | IA-02 | Bàn phím ảo che khuất trường nhập liệu (Keyboard Occlusion on Mobile) | `Inherent UI complexity` | AI thiết kế checklist chung dựa trên màn hình desktop, bỏ quên tương tác thực tế trên thiết bị di động khi mở bàn phím ảo (Virtual Keyboard). | Người dùng trên mobile không thấy được nội dung mình đang gõ hoặc nút Submit bị bàn phím che lấp. |
| 4 | CHK-IA03-05 | IA-03 | Focus trap và điều hướng bàn phím trên Modal Dialog | `Model limitation` | AI thường chỉ kiểm tra nút đóng `X`, bỏ sót tiêu chuẩn WCAG: khi modal mở, phím Tab chỉ được duyệt bên trong modal (Focus trap) và bấm phím ESC phải đóng được modal. | Người dùng sử dụng bàn phím (không dùng chuột) bị kẹt hoàn toàn không thể thoát khỏi modal. |
| 5 | CHK-IA04-07 | IA-04 | Chống submit nhiều lần (Race condition / Double-click submit) | `Inherent UI complexity` | AI có xu hướng mặc định rằng nút bấm chỉ kích hoạt 1 lần, không hình dung được hành vi người dùng click liên tiếp khi mạng chập chờn dẫn đến gửi nhiều đơn hàng trùng lặp. | Hệ thống sinh ra nhiều đơn hàng giống hệt nhau hoặc trừ tiền tài khoản nhiều lần. |
| 6 | CHK-IA04-08 | IA-04 | Mất kết nối mạng đột ngột (Offline / Network Drop Handling) | `Model limitation` | AI mặc định server luôn online và trả về response JSON, không tính đến trường hợp mạng bị timeout hoặc mất sóng giữa chừng. | Ứng dụng mobile hoặc web văng lỗi unhandled promise rejection, màn hình trắng xóa gây hoang mang cho người dùng. |

---

## 3. Tổng kết bài học cộng tác với AI (AI Collaboration Learnings)
- **Điểm yếu cố hữu của AI**: AI thường đưa ra các tiêu chí lý thuyết tổng quát (happy paths), rất mạnh về kiểm tra cú pháp và logic cơ bản nhưng cực kỳ thiếu nhạy cảm với:
  1. Trải nghiệm xúc giác và thiết bị thực tế (Touch targets, Keyboard popups).
  2. Khả năng tiếp cận cho người khuyết tật (Accessibility WCAG).
  3. Xử lý các trạng thái bất đồng bộ và sự cố mạng thực tế (Zero-trust UI).
- **Nguyên tắc làm việc**: Luôn sử dụng AI làm khung sườn ban đầu (Draft Generator), nhưng Tester con người phải đóng vai trò là chốt chặn chất lượng (Quality Gatekeeper) bổ sung các ca kiểm thử biên giao diện, trải nghiệm người dùng thực tế và đặc thù địa phương hóa.
