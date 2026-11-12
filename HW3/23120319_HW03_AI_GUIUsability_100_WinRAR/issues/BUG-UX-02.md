# [BUG-UX-02] Trường Tổng tiền thanh toán hiển thị dưới dạng ô input cho phép chỉnh sửa gây hoang mang và suy giảm niềm tin

| Mục | Nội dung |
|---|---|
| Tính năng | Xác nhận Đơn hàng & Tính tiền (Order Checkout & Total Display) |
| Phân hệ | Customer Web (`:5173`) |
| Mức độ nghiêm trọng (Severity) | Critical (Ảnh hưởng nghiêm trọng đến tính toàn vẹn nghiệp vụ và sự tin cậy tài chính) |
| Tần suất xuất hiện (Probability) | 100% (Mọi người dùng khi vào trang Checkout đều nhìn thấy) |
| Mức độ ưu tiên (Criticality) | **P0 (Critical Security & Trust Blocker)** |
| Ngày phát hiện | 2026-11-04 (Quan sát phản ứng gay gắt của người dùng P02, P04) |
| Video Minh chứng | [YouTube: Thử nghiệm Khả dụng Trực tiếp (P02 - Nguyễn Đức Thịnh)](https://youtu.be/xlSKEIs3rRw) |
| GitHub Issue | [#96](https://github.com/tthphat/eshop-sut/issues/96) |

## 1. Mô tả Vấn đề Trải nghiệm (UX Problem Description)
Tại trang **Xác Nhận Đơn Hàng (`/checkout`)**, mục **"Tổng tiền thanh toán (VND):"** không được hiển thị dưới dạng văn bản chỉ đọc (read-only text/summary) mà lại được render dưới dạng một **ô nhập số (`<input type="number">`)** có viền viền bao quanh và cho phép người dùng nhấp chuột vào tự do chỉnh sửa giá trị.

Dưới góc nhìn trải nghiệm người dùng (UX) và tâm lý mua sắm:
- Người dùng có chuyên môn kinh tế/kế toán (P04) lập tức nghi ngờ về tính minh bạch và an toàn của hệ thống, đặt câu hỏi liệu đây có phải là website giả mạo (phishing) hay không.
- Người dùng bình thường bị hoang mang: không hiểu ô này là để "khách nhập số tiền muốn trả" hay "số tiền hệ thống tính", gây ngập ngừng và sợ bị trừ sai tiền khi thanh toán.

## 2. Các Bước Tái Hiện
1. Thêm một sản phẩm có giá trị (ví dụ: iPhone 15 trị giá 26.990.000 ₫) vào giỏ hàng.
2. Điều hướng đến trang Thanh toán (`/checkout`).
3. Quan sát mục **"Tổng tiền thanh toán (VND):"**.
4. Thử click chuột vào ô hiển thị số tiền và gõ một con số bất kỳ (ví dụ: `1000` hoặc `0`).

## 3. Kết quả Thực tế & Video Minh chứng (Observed Behavior & Evidence)
- Ô tổng tiền là một thẻ input cho phép sửa giá trị trực tiếp.
- Người dùng có thể xóa số tiền thật và nhập bất kỳ con số nào. Khi bấm "Xác Nhận Thanh Toán", hệ thống gửi đúng con số người dùng tự gõ lên backend.
- **Video minh chứng thử nghiệm khả dụng thực tế:** [https://youtu.be/xlSKEIs3rRw](https://youtu.be/xlSKEIs3rRw) (Ghi hình phiên test của người dùng P02 - Nguyễn Đức Thịnh; thao tác phát hiện ô input và sửa số tiền trực tiếp trên trang Checkout).

## 4. Kết quả Mong đợi (Expected UX Behavior)
- Tổng tiền thanh toán bắt buộc phải là một trường chỉ đọc (Read-only/Static Text) hiển thị rõ ràng, nổi bật với font chữ đậm, định dạng phân cách hàng nghìn chuẩn tiền tệ Việt Nam (`26.990.000 ₫`).
- Cần có bảng phân rã chi phí chi tiết (Cost Breakdown):
  - Tiền hàng (Subtotal)
  - Giảm giá (Coupon Discount)
  - Phí vận chuyển (Shipping Fee)
  - **Tổng thanh toán (Final Total)**

## 5. Trích dẫn Người dùng Thật (User Think-Aloud Quotes)
- **P01 (Trần Nhật Nguyên - ĐH Quốc tế):** *"Không dám nhập thông tin hay thanh toán vì giao diện quá đơn giản, không có cam kết bảo mật và thông tin uy tín."*
- **P04 (Phạm Thị Kim Tuyến - ĐH Công nghiệp):** *"Ủa sao tổng tiền lại là ô input cho sửa tay thế này? Nhìn ô này lạ quá làm mình sợ web không an toàn."*
- **P02 (Nguyễn Đức Thịnh - ĐH CNTT):** *"Ủa ô này có thể sửa được?"* (phát hiện ô tổng tiền có viền input và trực tiếp sửa thử số tiền trên màn hình Checkout).

## 6. Phân tích Nguyên nhân Kỹ thuật (Từ mã nguồn SUT)
- `frontend-web/src/pages/Checkout.jsx:L14`: Khởi tạo state cho phép sửa:
  ```javascript
  const [editableTotal, setEditableTotal] = useState(cartTotal);
  ```
- `frontend-web/src/pages/Checkout.jsx:L93-102`: Render trực tiếp thẻ `<input type="number">`:
  ```jsx
  <input
    type="number"
    value={editableTotal}
    onChange={(e) => {
      setEditableTotal(Number(e.target.value));
      setCouponResult(null);
      setCouponError('');
    }}
    className="border p-2 rounded text-red-600 font-bold"
  />
  ```

## 7. Đề xuất Cải tiến (Actionable Recommendation)
1. Chuyển đổi thẻ `<input>` thành phần tử hiển thị tĩnh:
   ```jsx
   <span className="text-2xl font-bold text-red-600">
     {finalAmount.toLocaleString('vi-VN')} ₫
   </span>
   ```
2. Khóa cứng tổng tiền trên client-side và backend bắt buộc phải tự tính lại tổng tiền dựa trên danh sách sản phẩm trong database, tuyệt đối không tin tưởng giá trị `total_amount` gửi lên từ client.

