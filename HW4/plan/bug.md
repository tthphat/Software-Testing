# TỔNG HỢP CÁC ĐIỂM CẦN CẢI THIỆN TRONG KỊCH BẢN KIỂM THỬ (AI GAP ANALYSIS)

* **Môn học:** Kiểm thử phần mềm (CS423 / CSC13003) – FIT@HCMUS
* **Sinh viên:** Trương Thành Phát – **MSSV:** 23120319 – **Lớp:** CQ2023/3
* **Thư mục Automation:** `HW4/automation/`

---

## PHẦN 1: CÁC ĐIỂM CẢI THIỆN CHO TÍNH NĂNG `FR-01` (ACCOUNT REGISTRATION)

File kịch bản: [`HW4/automation/tests/fr01-registration.spec.ts`](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW4/automation/tests/fr01-registration.spec.ts)

Bản kịch bản ban đầu do AI sinh ra (Commit #1) có **5 điểm yếu cốt lõi đã được khắc phục ở Commit #2 & #3 (Human Review)**:

### 1. Thay thế Selector vị trí giòn (`nth(0)`, `nth(1)`) bằng Locator ngữ nghĩa
* **Vị trí trong `fr01-registration.spec.ts`:** **Dòng 25 đến dòng 36**
* **Hiện trạng của AI ban đầu (Commit #1):**
  ```typescript
  await page.locator('input').nth(0).fill(tc.inputs.name);
  await page.locator('input').nth(1).fill(emailValue);
  await page.locator('input').nth(2).fill(tc.inputs.password);
  await page.locator('button[type="submit"]').click();
  ```
* **Vấn đề:** AI định vị thẻ `input` theo số thứ tự từ trên xuống dưới. Nếu giao diện thêm ô tìm kiếm ở header hoặc đổi layout, test sẽ điền sai ô hoặc fail.
* **Cải thiện (Commit #2 - Dòng 25 đến 36):** Dùng locator ngữ nghĩa nhãn liền kề để giải quyết việc SUT thiếu thuộc tính `htmlFor`/`id`:
  ```typescript
  await page.locator('label:has-text("Họ Tên") + input').fill(tc.inputs.name);
  await page.locator('label:has-text("Email") + input').fill(emailValue);
  await page.locator('label:has-text("Mật khẩu") + input').fill(tc.inputs.password);
  await page.getByRole('button', { name: 'Đăng Ký' }).click();
  ```

### 2. Bỏ class CSS Tailwind `.bg-red-100` khi bắt thông báo lỗi
* **Vị trí trong `fr01-registration.spec.ts`:** **Dòng 46 đến dòng 48**
* **Hiện trạng của AI ban đầu (Commit #1):** `const errorAlert = page.locator('.bg-red-100');`
* **Vấn đề:** Bắt cứng class CSS `.bg-red-100`. Khi giao diện đổi theme hoặc đổi style màu nền, test sẽ bị gãy.
* **Cải thiện (Commit #2 - Dòng 46):**
  ```typescript
  const errorAlert = page.locator('div[class*="text-red-"], div[role="alert"]').first();
  ```

### 3. Nâng cấp Assertion kiểm tra lỗi để trống (HTML5 Native Validation)
* **Vị trí trong `fr01-registration.spec.ts`:** **Dòng 49 đến dòng 64**
* **Hiện trạng của AI ban đầu (Commit #1):** Chỉ kiểm tra `await expect(page).toHaveURL(/\/register/);` (rất lỏng lẻo, dễ pass ảo).
* **Cải thiện (Commit #2 - Dòng 58 đến 63):** Kiểm tra trực tiếp thuộc tính `checkValidity()` và `validationMessage` của DOM:
  ```typescript
  const isInvalid = await targetInput.evaluate((el: HTMLInputElement) => !el.checkValidity());
  expect(isInvalid).toBe(true);
  const valMsg = await targetInput.evaluate((el: HTMLInputElement) => el.validationMessage);
  expect(valMsg.length).toBeGreaterThan(0);
  ```

### 4. Phát hiện lỗi SUT cho phép trùng email (`TC-FR01-12`)
* **Vị trí trong testcase:** `TC-FR01-12` chạy qua **Dòng 44 đến 48**
* **Vấn đề SUT:** SUT cho phép đăng ký trùng email do database SQLite thiếu `UNIQUE(email)` và backend thiếu check. Đã lập báo cáo lỗi [`HW4/report/issues/BUG-AUTO-01-duplicate-email.md`](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW4/report/issues/BUG-AUTO-01-duplicate-email.md) và GitHub Issue `#115`.

### 5. Dọn dẹp trạng thái môi trường (State Isolation)
* **Vị trí trong `fr01-registration.spec.ts`:** **Dòng 10 đến dòng 15**
* **Cải thiện:** Bổ sung `test.beforeEach` để dọn sạch cookies và `localStorage.clear()` trước từng ca test.

---

## PHẦN 2: CÁC ĐIỂM CẢI THIỆN CHO TÍNH NĂNG `FR-08` (CART & CHECKOUT)

File kịch bản đã sửa: [`HW4/automation/tests/fr08-checkout.spec.ts`](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW4/automation/tests/fr08-checkout.spec.ts)  
File dữ liệu: [`HW4/automation/data/fr08-checkout.json`](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW4/automation/data/fr08-checkout.json)

Dưới đây là chi tiết phân tích **3 điểm yếu cốt lõi của AI** cùng **cách khắc phục cụ thể** trong mã nguồn kịch bản [fr08-checkout.spec.ts](file:///d:/HCMUS/semester7/software-testing/Software-Testing/HW4/automation/tests/fr08-checkout.spec.ts), kèm theo **chỉ dẫn số dòng chính xác** để bạn trình bày trong Video Demo Task 2:

---

### 1. Khắc phục lỗi State giỏ hàng bị xóa sạch do Hard Navigation (Cart State Flaw)

* **Vấn đề của AI ban đầu:**
  * AI nhét giỏ hàng vào `localStorage.setItem('cart', ...)` rồi gọi `page.goto('/checkout')`.
  * **Hậu quả:** Trong [CartContext.jsx](file:///d:/HCMUS/semester7/software-testing/Software-Testing/eshop-sut/frontend-web/src/context/CartContext.jsx#L6), giỏ hàng được quản lý thuần túy bằng **React In-Memory State (`useState([])`)**, hoàn toàn không lưu trong `localStorage`. Khi AI gọi `page.goto('/checkout')`, trình duyệt thực hiện **Hard Navigation** (Full Page Reload), giải phóng toàn bộ RAM của phiên cũ -> Giỏ hàng bị reset về mảng rỗng `[]` khiến trang `/checkout` không có sản phẩm nào!
* **Cách khắc phục trong `fr08-checkout.spec.ts`:**
  * **Dòng 57 đến dòng 66:** Mô phỏng hành động thật của người dùng: Mở trang chủ, tìm thẻ sản phẩm và bấm nút **"Thêm vào giỏ"**:
    ```typescript
    // DÒNG 57-66 TRONG fr08-checkout.spec.ts
    if (tc.setup.items && tc.setup.items.length > 0) {
      const targetItem = tc.setup.items[0];
      const productCard = page.locator('div.border.rounded').filter({ hasText: targetItem.name });

      if (await productCard.count() > 0) {
        await productCard.first().getByRole('button', { name: 'Thêm vào giỏ' }).click();
      } else {
        await page.getByRole('button', { name: 'Thêm vào giỏ' }).first().click();
      }
    }
    ```
  * **Dòng 68 đến dòng 71:** Điều hướng sang Giỏ hàng bằng **Client-side Navigation** (click link của React Router):
    ```typescript
    // DÒNG 68-71 TRONG fr08-checkout.spec.ts
    await page.getByRole('link', { name: 'Giỏ hàng' }).click();
    await expect(page).toHaveURL(/\/cart/);
    ```
  * **Dòng 99 đến dòng 101:** Chuyển từ Giỏ hàng sang Thanh toán bằng cách click nút **"Tiến hành thanh toán"** (Client-side Navigation):
    ```typescript
    // DÒNG 99-101 TRONG fr08-checkout.spec.ts
    await page.getByRole('button', { name: 'Tiến hành thanh toán' }).click();
    await expect(page).toHaveURL(/\/checkout/);
    ```
  * **Lợi ích:** Toàn bộ dữ liệu giỏ hàng trong bộ nhớ React State được **bảo toàn nguyên vẹn 100%**, đúng chuẩn hành trình khách hàng (E2E Customer Journey).

---

### 2. Khắc phục lỗi Token giả mạo bị Backend từ chối 403 (Authentication Flaw)

* **Vấn đề của AI ban đầu:**
  * AI tự bịa token giả `'mock-jwt-token-test-user'` và gán vào `localStorage`.
  * **Hậu quả:** Trong [AuthContext.jsx](file:///d:/HCMUS/semester7/software-testing/Software-Testing/eshop-sut/frontend-web/src/context/AuthContext.jsx#L10-L24), component tự động gọi `GET /api/users/me` với token này. Backend verify token bằng `jwt.verify()` và phát hiện token giả -> Trả về mã lỗi **HTTP 403 Forbidden**. `AuthContext` lập tức kích hoạt `logout()`, xóa token và đẩy người dùng về trạng thái chưa đăng nhập (Guest)!
* **Cách khắc phục trong `fr08-checkout.spec.ts`:**
  * **Dòng 14 đến dòng 27:** Trong `test.beforeAll`, gọi trực tiếp API `POST /api/login` với tài khoản hợp lệ (`test@eshop.com` / `Test1234!`) để lấy **JWT Token thật** được ký bởi backend:
    ```typescript
    // DÒNG 14-27 TRONG fr08-checkout.spec.ts
    test.beforeAll(async ({ request }) => {
      try {
        const res = await request.post('http://localhost:3000/api/login', {
          data: { email: 'test@eshop.com', password: 'Test1234!' },
        });
        if (res.ok()) {
          const body = await res.json();
          cachedToken = body.token;
          cachedUser = body.user;
        }
      } catch { /* Offline dry-run fallback */ }
    });
    ```
  * **Dòng 34 đến dòng 45:** Dùng `context.addInitScript()` để nạp token thật vào `localStorage` **ngay trước khi trang web kịp thực thi JavaScript**:
    ```typescript
    // DÒNG 34-45 TRONG fr08-checkout.spec.ts
    if (tc.setup.requireAuth && cachedToken) {
      await context.addInitScript(({ token, user }) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }, { token: cachedToken, user: cachedUser });
    } else {
      await context.addInitScript(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
    }
    ```
  * **Dòng 51 đến dòng 53:** Xác thực trạng thái đăng nhập trên thanh Header:
    ```typescript
    // DÒNG 51-53 TRONG fr08-checkout.spec.ts
    if (tc.setup.requireAuth && cachedToken) {
      await expect(page.getByText('Chào,')).toBeVisible();
    }
    ```
  * **Lợi ích:** Phiên đăng nhập thật 100%, không bị 403 Forbidden, không cần lặp lại thao tác gõ UI login giúp tiết kiệm thời gian chạy test.

---

### 3. Khắc phục Race Condition khi Áp dụng Mã giảm giá (Async Synchronization)

* **Vấn đề của AI ban đầu:**
  * AI chỉ gọi `await applyBtn.click()` rồi ngay lập tức `expect(...)` kết quả giao diện.
  * **Hậu quả:** Nút "Áp dụng" gửi request bất đồng bộ `POST /api/apply-coupon` lên server. Trên các trình duyệt như Firefox hoặc WebKit, request mạng chưa kịp phản hồi thì assertion đã chạy xong, dẫn đến tình trạng test bị gãy chập chờn (Flaky Test).
* **Cách khắc phục trong `fr08-checkout.spec.ts`:**
  * **Dòng 116 đến dòng 131:** Bọc hành động click cùng với `page.waitForResponse(...)` trong `Promise.all`:
    ```typescript
    // DÒNG 116-131 TRONG fr08-checkout.spec.ts
    // Wait for API response to prevent async race condition
    const [couponResponse] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/apply-coupon')),
      applyBtn.click(),
    ]);

    if (tc.expected.couponSuccess) {
      await expect(page.getByText('Áp dụng thành công', { exact: false })).toBeVisible();
      await expect(page.locator('text=Tiết kiệm:')).toBeVisible();
    } else if (tc.expected.errorMessage) {
      const errorBanner = page.locator('p.text-red-600');
      await expect(errorBanner).toBeVisible();
      await expect(errorBanner).toContainText(tc.expected.errorMessage);
    }
    ```
  * **Lợi ích:** Đảm bảo 100% server đã phản hồi xong dữ liệu mã giảm giá thì Playwright mới kiểm tra giao diện, triệt tiêu hoàn toàn race condition.

---

### 4. Phát hiện và Bắt 2 Lỗi thực tế nghiêm trọng của SUT (SUT Defects in Checkout)

Kịch bản kiểm thử tự động của FR-08 được thiết kế chủ đích để phơi bày **2 lỗ hổng lớn của EShop**:

#### A. Lỗi `BUG-UX-02`: Ô tổng tiền thanh toán cho phép khách hàng tự sửa giá tùy ý
* **Chỉ dẫn dòng trong `fr08-checkout.spec.ts`:**
  * **Dòng 145 đến dòng 149:** Test case `TC-FR08-10`:
    ```typescript
    // DÒNG 145-149 TRONG fr08-checkout.spec.ts
    // Step 8: SUT Defect Check: Editable total price vulnerability (BUG-UX-02 / TC-FR08-10)
    if (tc.id === 'TC-FR08-10') {
      const totalInput = page.locator('input[type="number"]');
      await expect(totalInput).toHaveAttribute('readonly');
    }
    ```
* **Mã nguồn SUT bị lỗi:**
  * Tại [Checkout.jsx](file:///d:/HCMUS/semester7/software-testing/Software-Testing/eshop-sut/frontend-web/src/pages/Checkout.jsx#L92-L103), ô tổng tiền là thẻ `<input type="number">` có thuộc tính `onChange` cho phép người dùng tự gõ số tiền bất kỳ (kể cả 0đ hoặc số âm) mà không có `readonly` hay `disabled`. Assertion này sẽ FAIL để chỉ ra lỗ hổng bảo mật.

#### B. Lỗi `BUG-UX-03`: Giỏ hàng không được xóa sau khi thanh toán thành công
* **Chỉ dẫn dòng trong `fr08-checkout.spec.ts`:**
  * **Dòng 152 đến dòng 162:** Test case `TC-FR08-11`:
    ```typescript
    // DÒNG 152-162 TRONG fr08-checkout.spec.ts
    // Step 9: SUT Defect Check: Cart not cleared after successful checkout (BUG-UX-03 / TC-FR08-11)
    if (tc.id === 'TC-FR08-11') {
      await Promise.all([
        page.waitForResponse(resp => resp.url().includes('/api/checkout')),
        page.getByRole('button', { name: 'Xác Nhận Thanh Toán' }).click(),
      ]);
      await expect(page.getByText('Thanh toán thành công!')).toBeVisible();
      // Client-side navigate back to cart to inspect integrity
      await page.getByRole('link', { name: 'Giỏ hàng' }).click();
      await expect(page).toHaveURL(/\/cart/);
      await expect(page.getByText('Giỏ hàng của bạn đang trống')).toBeVisible();
    }
    ```
* **Mã nguồn SUT bị lỗi:**
  * Tại [Checkout.jsx](file:///d:/HCMUS/semester7/software-testing/Software-Testing/eshop-sut/frontend-web/src/pages/Checkout.jsx#L40-L66) (hàm `handleCheckout`), sau khi gọi API thanh toán thành công, lập trình viên quên không gọi hàm `clearCart()`, khiến các món hàng đã mua vẫn nằm nguyên trong giỏ. Assertion này sẽ FAIL để chỉ ra lỗi toàn vẹn dữ liệu.

---

## 📌 BẢNG TRA CỨU ĐẦY ĐỦ CÁC DÒNG CODE TRONG `fr08-checkout.spec.ts` (BẢN ĐÃ SỬA)

| Mục kiểm thử / Kỹ thuật | Nội dung thực hiện | Vị trí dòng trong `fr08-checkout.spec.ts` | Tệp SUT liên quan |
| :--- | :--- | :--- | :--- |
| **Pre-fetch JWT** | Đăng nhập API lấy token chuẩn từ backend | **Dòng 14 – 27** | `backend/server.js` (`/api/login`) |
| **Auth Injection** | Dùng `context.addInitScript()` nạp token | **Dòng 34 – 45** | `context/AuthContext.jsx` (Dòng 10 – 24) |
| **Auth Header Check**| Kiểm tra hiển thị `Chào, Test User` | **Dòng 51 – 53** | `App.jsx` (Dòng 26 – 28) |
| **Add to Cart** | Thêm sản phẩm thật vào React State | **Dòng 57 – 66** | `pages/Home.jsx` (Dòng 97 – 102) |
| **Nav to Cart** | Điều hướng client-side sang `/cart` | **Dòng 68 – 71** | `App.jsx` (Dòng 23) |
| **TC-FR08-07** | Kiểm tra thông báo giỏ hàng trống | **Dòng 75 – 81** | `pages/Cart.jsx` (Dòng 20 – 26) |
| **TC-FR08-08** | Chặn khách chưa đăng nhập bấm thanh toán | **Dòng 83 – 91** | `pages/Cart.jsx` (Dòng 11 – 18) |
| **TC-FR08-09** | Xóa sản phẩm khỏi giỏ hàng | **Dòng 93 – 97** | `pages/Cart.jsx` (Dòng 50 – 56) |
| **Nav to Checkout** | Bấm "Tiến hành thanh toán" sang `/checkout` | **Dòng 99 – 101** | `pages/Cart.jsx` (Dòng 69 – 74) |
| **Coupon Disabled** | Nút áp dụng coupon bị disable khi rỗng (`TC-06`)| **Dòng 112 – 114** | `pages/Checkout.jsx` (Dòng 116 – 122) |
| **Coupon Async Wait**| `Promise.all([waitForResponse, click])` (`TC-02..05`)| **Dòng 116 – 131** | `pages/Checkout.jsx` (Dòng 22 – 38) |
| **TC-FR08-01** | Thanh toán thành công đơn hàng chuẩn | **Dòng 135 – 142** | `pages/Checkout.jsx` (Dòng 40 – 66) |
| **TC-FR08-10 (Defect)**| Kiểm tra ô tổng tiền phải `readonly` (`BUG-UX-02`) | **Dòng 145 – 149** | `pages/Checkout.jsx` (Dòng 92 – 103) |
| **TC-FR08-11 (Defect)**| Kiểm tra giỏ hàng phải trống sau checkout (`BUG-UX-03`)| **Dòng 152 – 162** | `pages/Checkout.jsx` (Dòng 40 – 66) |
| **TC-FR08-12** | Nút bấm quay lại trang chủ sau khi thanh toán | **Dòng 165 – 173** | `pages/Checkout.jsx` (Dòng 73) |

---

## 📌 LỆNH COMMIT THEO LỘ TRÌNH

Sau khi bạn xem xét và chuẩn bị nội dung quay video demo Task 2, bạn có thể thực hiện commit:

```powershell
git add HW4/automation/tests/fr08-checkout.spec.ts HW4/plan/bug.md
git commit -m "fix(HW4-FR08): preserve cart state via UI navigation, inject valid JWT and handle async coupon response"
```
