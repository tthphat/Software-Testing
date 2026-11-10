# [BUG-UX-01] Mất ngữ cảnh điều hướng sau khi đăng nhập bắt buộc tại bước thanh toán

| Mục | Nội dung |
|---|---|
| Tính năng | Điều hướng Luồng Đặt hàng (Checkout Authentication Navigation Flow) |
| Phân hệ | Customer Web (`:5173`) |
| Mức độ nghiêm trọng (Severity) | Major (Gây đứt gãy luồng chuyển đổi người dùng - High Drop-off Risk) |
| Tần suất xuất hiện (Probability) | 100% (Xảy ra với toàn bộ người dùng chưa đăng nhập khi bấm thanh toán) |
| Mức độ ưu tiên (Criticality) | **P0 (Critical Usability Blocker)** |
| Ngày phát hiện | 2026-11-04 (Trong các phiên thử nghiệm khả dụng P01, P02, P04, P06) |
| GitHub Issue | [#95](https://github.com/tthphat/eshop-sut/issues/95) |

## 1. Mô tả Vấn đề Trải nghiệm (UX Problem Description)
Khi người dùng vãng lai (chưa đăng nhập) đã chọn sản phẩm vào giỏ và bấm nút **"Tiến hành thanh toán"** trên trang Giỏ hàng (`/cart`), hệ thống hiển thị popup `alert()` và chuyển hướng người dùng đến trang Đăng nhập (`/login`). Tuy nhiên, sau khi người dùng điền thông tin và đăng nhập thành công, hệ thống lại chuyển hướng người dùng về **Trang chủ (`/`)** thay vì đưa người dùng quay trở lại luồng thanh toán (`/checkout`).

Hậu quả: Người dùng bị mất phương hướng (disoriented), lầm tưởng đơn hàng hoặc giỏ hàng đã bị hủy, buộc phải tìm lại icon giỏ hàng và bấm lại nút "Tiến hành thanh toán" lần thứ hai. Với người dùng ít am hiểu công nghệ (như P06), họ hoàn toàn bị kẹt và tưởng rằng phiên mua sắm bị lỗi.

## 2. Các Bước Tái Hiện
1. Mở trình duyệt ở chế độ ẩn danh (chưa đăng nhập tài khoản).
2. Tìm và thêm 1 sản phẩm bất kỳ vào giỏ hàng.
3. Nhấp vào biểu tượng Giỏ hàng trên header để chuyển đến trang `/cart`.
4. Nhấp nút **"Tiến hành thanh toán"**.
5. Nhận thông báo popup: *"Bạn cần đăng nhập để thanh toán!"* $\to$ Nhấn OK.
6. Trang chuyển đến `/login`. Nhập email và mật khẩu hợp lệ $\to$ Nhấn nút **"Đăng Nhập"**.
7. Quan sát trang tiếp theo được điều hướng.

## 3. Kết quả Thực tế (Observed Behavior)
- Người dùng bị đẩy về thẳng Trang chủ (`http://localhost:5173/`).
- Toàn bộ giao diện thanh toán biến mất; không có thông báo hay banner điều hướng nào hướng dẫn người dùng quay lại giỏ hàng.

## 4. Kết quả Mong đợi (Expected UX Behavior)
- Hệ thống cần lưu trữ route dự định ban đầu của người dùng (ví dụ thông qua state hoặc query param: `navigate('/login', { state: { from: '/checkout' } })`).
- Sau khi đăng nhập thành công, hệ thống phải tự động điều hướng người dùng thẳng đến trang **Xác Nhận Đơn Hàng (`/checkout`)** để tiếp tục luồng mua sắm liền mạch mà không bắt người dùng phải thao tác lại từ đầu.

## 5. Trích dẫn Người dùng Thật (User Think-Aloud Quotes)
- **P01 (Trần Nhật Nguyên - ĐH Quốc tế):** *"Ủa đăng nhập xong nó đẩy mình về lại trang chủ luôn? Ủa rồi đơn hàng nãy đâu... để mình bấm vô lại giỏ hàng coi."*
- **P02 (Nguyễn Đức Thịnh - ĐH CNTT):** *"Đăng nhập xong quay về trang chủ, mất mạch thanh toán. Phải vào lại giỏ hàng lần nữa."*
- **P06 (Trương Thành Đạt - ĐH Công nghiệp):** *"Ủa sao đăng nhập xong nó lại ra lại trang chủ rồi? Đơn hàng đâu mất tiêu rồi?"*

## 6. Phân tích Nguyên nhân Kỹ thuật (Từ mã nguồn SUT)
- `frontend-web/src/pages/Cart.jsx:L11-15`:
  ```javascript
  const handleCheckout = () => {
    if (!token) {
      alert("Bạn cần đăng nhập để thanh toán!");
      navigate('/login'); // Chuyển hướng cứng không lưu state nguồn
      return;
    }
    navigate('/checkout');
  };
  ```
- `frontend-web/src/pages/Login.jsx:L15-17`:
  ```javascript
  const handleSubmit = async (e) => {
    // ... gọi API login thành công ...
    navigate('/'); // Cố định luôn điều hướng về trang chủ
  };
  ```

## 7. Đề xuất Cải tiến (Actionable Recommendation)
1. Thay thế popup `alert()` trình duyệt bằng modal đăng nhập mềm (in-place modal) hoặc thông báo inline/toast.
2. Truyền `location.state.from` khi redirect sang `/login`, và tại `Login.jsx` kiểm tra:
   `const from = location.state?.from || '/'; navigate(from, { replace: true });`

