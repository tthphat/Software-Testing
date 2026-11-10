# [BUG-UX-03] Giỏ hàng không tự làm trống sau khi đặt hàng thành công gây hiểu lầm đơn hàng bị lỗi

| Mục | Nội dung |
|---|---|
| Tính năng | Đồng bộ Trạng thái Giỏ hàng (Cart State Synchronization Post-Checkout) |
| Phân hệ | Customer Web (`:5173`) |
| Mức độ nghiêm trọng (Severity) | Major (Gây nhầm lẫn trạng thái đơn hàng, nguy cơ đặt trùng lặp đơn) |
| Tần suất xuất hiện (Probability) | 100% (Xảy ra sau mỗi lần thanh toán thành công) |
| Mức độ ưu tiên (Criticality) | **P1 (High Friction & User Uncertainty)** |
| Ngày phát hiện | 2026-11-04 (Quan sát phản ứng của P01, P03, P07) |
| Video Minh chứng | [YouTube: Thử nghiệm Khả dụng Trực tiếp (P02 - Nguyễn Đức Thịnh)](https://youtu.be/xlSKEIs3rRw) |
| GitHub Issue | [#97](https://github.com/tthphat/eshop-sut/issues/97) |

## 1. Mô tả Vấn đề Trải nghiệm (UX Problem Description)
Sau khi người dùng nhấn nút "Xác Nhận Thanh Toán" và màn hình hiển thị thông báo *"Thanh toán thành công! Cảm ơn bạn đã mua sắm tại EShop"*, người dùng nhấp vào nút "Quay lại trang chủ" hoặc kiểm tra biểu tượng giỏ hàng trên thanh Header. 

Kết quả: Biểu tượng giỏ hàng vẫn hiển thị badge số lượng sản phẩm cũ (ví dụ: `1`), và khi nhấp vào xem giỏ hàng (`/cart`), toàn bộ các mặt hàng vừa mua xong vẫn còn nguyên vẹn trong giỏ.

Hậu quả: 
- 100% người dùng quan sát (P01, P03, P07) đều bày tỏ sự hoài nghi: không biết hệ thống đã ghi nhận đơn hàng hay chưa, hay do mạng bị chậm chưa cập nhật.
- Người dùng có thể vô tình bấm "Tiến hành thanh toán" một lần nữa, dẫn đến việc tạo ra các đơn hàng trùng lặp không mong muốn (duplicate orders).

## 2. Các Bước Tái Hiện
1. Thêm 1 sản phẩm vào giỏ hàng (Badge giỏ hàng hiển thị `1`).
2. Tiến hành thanh toán và hoàn tất đơn hàng thành công trên trang `/checkout`.
3. Nhấp vào nút "Quay lại trang chủ".
4. Quan sát số lượng hiển thị trên biểu tượng Giỏ hàng ở góc phải thanh điều hướng.
5. Nhấp vào biểu tượng Giỏ hàng để mở lại trang `/cart`.

## 3. Kết quả Thực tế & Video Minh chứng (Observed Behavior & Evidence)
- Badge giỏ hàng vẫn giữ nguyên số lượng sản phẩm đã mua.
- Trang `/cart` vẫn hiển thị danh sách sản phẩm và tổng tiền, không hề được làm trống.
- **Video minh chứng thử nghiệm khả dụng thực tế:** [https://youtu.be/xlSKEIs3rRw](https://youtu.be/xlSKEIs3rRw) (Ghi hình phiên test của người dùng P02 - Nguyễn Đức Thịnh; minh chứng sau khi hoàn tất thanh toán thành công và kiểm tra lại giỏ hàng, sản phẩm vẫn còn nguyên và badge giỏ hàng không được làm sạch).

## 4. Kết quả Mong đợi (Expected UX Behavior)
- Ngay sau khi API thanh toán trả về thành công (`200 OK`), hệ thống phải kích hoạt hàm dọn sạch giỏ hàng (`clearCart()`).
- Badge giỏ hàng trên header phải cập nhật về `0` (hoặc ẩn đi).
- Trang giỏ hàng hiển thị trạng thái rỗng thân thiện (Empty State): *"Giỏ hàng của bạn đang trống! Hãy tiếp tục mua sắm."*

## 5. Trích dẫn Người dùng Thật (User Think-Aloud Quotes)
- **P07 (Huỳnh Thị Kim Liên - ĐH Công nghiệp):** *"Ủa lạ vậy, mình mua xong rồi mà trong giỏ hàng vẫn còn cái iPhone nãy vậy? Hay là mạng bị lag chưa trừ?"*
- **P03 (Nguyễn An Kiên - ĐH KHXH&NV):** *"Mua xong quay lại giỏ thấy đồ vẫn còn y nguyên làm mình thắc mắc không biết đã trừ tiền thật chưa."*

## 6. Phân tích Nguyên nhân Kỹ thuật (Từ mã nguồn SUT)
- `frontend-web/src/pages/Checkout.jsx:L8`: Component có lấy hàm `clearCart` từ context:
  ```javascript
  const { cart, cartTotal, clearCart } = useCart();
  ```
- Tuy nhiên, trong hàm `handleCheckout` (L40-66), sau khi gửi request thành công, lập trình viên quên gọi `clearCart()`:
  ```javascript
  await axios.post('http://localhost:3000/api/checkout', ...);
  // THIẾU: clearCart();
  setSuccess(true);
  ```

## 7. Đề xuất Cải tiến (Actionable Recommendation)
1. Bổ sung `clearCart();` ngay sau khi nhận phản hồi thành công từ API checkout:
   ```javascript
   await axios.post('http://localhost:3000/api/checkout', ...);
   clearCart();
   setSuccess(true);
   ```
2. Thiết kế màn hình cảm ơn (Order Confirmation Screen) chuyên nghiệp hơn: hiển thị Mã đơn hàng (Order ID), thời gian dự kiến giao hàng, và nút "Xem đơn hàng của tôi" thay vì chỉ có nút "Quay lại trang chủ".

