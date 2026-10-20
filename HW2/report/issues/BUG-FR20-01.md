# [BUG] [FR-20] Hàm logout() trong Mobile App không dọn dẹp giỏ hàng gây rò rỉ dữ liệu phiên giữa các người dùng (Cross-user Cart Retention / Session Bleed)

## Mô tả lỗi (Description)
Khi người dùng thực hiện thao tác Đăng xuất (`logout`) trên ứng dụng Mobile, hàm xử lý chỉ xóa token xác thực (`setToken(null)`), thông tin người dùng (`setUser(null)`) và danh sách đơn hàng (`setOrders([])`), nhưng **hoàn toàn bỏ quên việc làm rỗng giỏ hàng** (không có lệnh `setCart([])`).

Hậu quả: Toàn bộ danh sách sản phẩm mà người dùng vừa đăng xuất đã thêm vào giỏ hàng vẫn tồn tại nguyên vẹn trong bộ nhớ trạng thái (React state) của ứng dụng. Khi một người dùng khác đăng nhập trên cùng thiết bị (hoặc người dùng mới lướt ứng dụng ở chế độ khách vãng lai), họ sẽ nhìn thấy toàn bộ giỏ hàng của người dùng trước, có thể xem được giá tiền, số lượng, điều chỉnh danh sách, và thậm chí tiến hành thanh toán với các mặt hàng đó. Đây là lỗi rò rỉ dữ liệu phiên nghiêm trọng (Session Bleed / Privacy Leak) trên thiết bị di động dùng chung.

## Các bước tái hiện (Steps to Reproduce)
1. Mở ứng dụng Mobile (`frontend-mobile/App.js`).
2. Đăng nhập với tài khoản `test@eshop.com`.
3. Duyệt danh sách sản phẩm và bấm "Thêm vào giỏ" cho 2 sản phẩm bất kỳ.
4. Chuyển sang tab Giỏ hàng để xác nhận có 2 sản phẩm trong giỏ.
5. Chuyển sang tab Tài khoản (Profile) và bấm nút "Đăng xuất" (`logout`).
6. Sau khi đăng xuất thành công và màn hình quay về Đăng nhập, đăng nhập bằng một tài khoản khác (hoặc quay lại màn hình Home xem giỏ hàng).

## Kết quả thực tế (Actual Result)
- Màn hình giỏ hàng vẫn lưu giữ nguyên vẹn 2 sản phẩm từ phiên đăng nhập của người dùng trước.
- Biến trạng thái `cart` trong React không bị reset về mảng rỗng `[]`.

## Kết quả mong đợi (Expected Result)
- Khi người dùng đăng xuất, toàn bộ dữ liệu phiên làm việc cục bộ phải bị tiêu hủy hoàn toàn.
- Hàm `logout()` phải gọi `setCart([])` để giỏ hàng trở về trạng thái rỗng cho phiên làm việc tiếp theo:
  ```javascript
  const logout = () => {
    setToken(null);
    setUser(null);
    setOrders([]);
    setCart([]); // Reset giỏ hàng
    setCurrentView('login');
  };
  ```

## Phân tích nguyên nhân & Code tham chiếu
- Tại `eshop-sut/frontend-mobile/App.js:161-169`:
  ```javascript
  const logout = () => {
    setToken(null);
    setUser(null);
    setOrders([]);
    // THIẾU: setCart([]);
    setCurrentView('login');
  };
  ```
- Phân loại lỗi bảo mật:
  - **CWE-459**: Incomplete Cleanup.
  - **CWE-200**: Exposure of Sensitive Information to an Unauthorized Actor.
  - **OWASP**: Mobile Top 10 - Insecure Data Storage & Client-Side Session Handling.

## Test cases liên quan
- `FR20-DT-18` (Mobile Logout: Kiểm tra dọn dẹp giỏ hàng khi người dùng có sản phẩm)

## Mức độ nghiêm trọng
- **Severity**: High
- **Priority**: High
