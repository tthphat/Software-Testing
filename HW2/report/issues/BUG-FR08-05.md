# [BUG] [FR-08] Frontend Mobile tự ý cắt xén sản phẩm cuối cùng trong giỏ hàng khi checkout (cart.slice(0, -1))

## Mô tả lỗi (Description)
Trên ứng dụng di động Frontend Mobile (`eshop-sut/frontend-mobile/App.js:391`), trong hàm xử lý sự kiện đặt hàng (`handleCheckout`), mã nguồn tồn tại một dòng code dị biệt cố ý làm sai lệch đơn hàng:
```javascript
items: cart.length > 1 ? cart.slice(0, -1) : cart
```
Hành vi này dẫn đến khi khách hàng chọn mua từ 2 món hàng trở lên trong giỏ hàng (ví dụ: Điện thoại và Tai nghe), ứng dụng di động sẽ tự động cắt bỏ món hàng cuối cùng (Tai nghe) trước khi gửi yêu cầu lên máy chủ. Khách hàng vẫn phải trả nguyên vẹn số tiền của cả 2 món nhưng chỉ nhận được 1 món hàng.

## Các bước tái hiện (Steps to Reproduce)
1. Trên ứng dụng Mobile, thêm 2 sản phẩm khác nhau vào giỏ hàng:
   - Sản phẩm A: 200,000 VNĐ (số lượng 1).
   - Sản phẩm B: 100,000 VNĐ (số lượng 1).
   - Tổng tiền hiển thị: 300,000 VNĐ.
2. Bấm nút "Thanh toán" (Checkout).
3. Bắt gói tin HTTP POST gửi lên `/api/checkout`.

## Kết quả thực tế (Actual Result)
Body của request gửi đi từ Mobile:
```json
{
  "items": [
    { "id": 1, "name": "Sản phẩm A", "price": 200000, "quantity": 1 }
  ],
  "total_amount": 300000
}
```
Sản phẩm B đã bị cắt bỏ hoàn toàn khỏi danh sách đặt hàng do lệnh `cart.slice(0, -1)`.

## Kết quả mong đợi (Expected Result)
Request phải giữ nguyên vẹn toàn bộ các mặt hàng trong giỏ hàng:
```json
{
  "items": cart,
  "total_amount": 300000
}
```

## Phân tích nguyên nhân & Code tham chiếu
- Tại `eshop-sut/frontend-mobile/App.js:384-395`:
  ```javascript
  const handleCheckout = async () => {
    ...
    await fetch(`${API_URL}/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        items: cart.length > 1 ? cart.slice(0, -1) : cart, // <-- BUG CỐ Ý
        total_amount: finalAmount,
        coupon_id: couponResult?.coupon_id || null,
      }),
    });
  };
  ```
- Phân loại CWE: CWE-840 (Business Logic Error), CWE-670 (Always-Incorrect Control Flow Implementation).

## Test case liên quan
- `FR08-DT-22`, `FR08-BVA-20` (2 test cases).

## Mức độ nghiêm trọng
- **Severity:** Critical
- **Priority:** Immediate
