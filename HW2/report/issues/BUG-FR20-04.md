# [BUG] [FR-20] Giao diện đăng nhập Mobile App sử dụng nhãn tiếng Anh không đồng nhất và đặt vị trí thông báo lỗi sai chuẩn UI/UX

## Mô tả lỗi (Description)
Màn hình giao diện Đăng nhập trên ứng dụng Mobile Client (`frontend-mobile/App.js`) tồn tại ba điểm không tuân thủ quy chuẩn thiết kế giao diện (UI) và trải nghiệm người dùng (UX):
1. **Sai nhãn trường nhập liệu (Field Label Mismatch)**: Nhãn hiển thị là `"Username"` tại dòng 763, trong khi trường này nhận địa chỉ email (`loginEmail`, placeholder `"email@example.com"`) và toàn bộ luồng nghiệp vụ xác thực sử dụng email.
2. **Không nhất quán ngôn ngữ tiếng Việt (Linguistic Inconsistency)**: Nút bấm gửi form đăng nhập hiển thị chuỗi tiếng Anh `"Sign In"` tại dòng 783, vi phạm quy định thống nhất giao diện tiếng Việt xuyên suốt ứng dụng theo tiêu chuẩn FR-21.
3. **Vị trí thông báo lỗi không chuẩn (Bad Error Placement)**: Khung hiển thị thông báo lỗi đăng nhập (`errorBox`, dòng 790) được bố trí ở phía dưới nút bấm hành động Submit. Trên thiết bị di động, khi bàn phím ảo hiển thị hoặc màn hình nhỏ, thông báo lỗi đặt bên dưới nút sẽ bị đẩy ra ngoài tầm nhìn (viewport) hoặc bị bàn phím che khuất, khiến người dùng không biết lý do đăng nhập thất bại.

## Các bước tái hiện (Steps to Reproduce)
1. Khởi động ứng dụng Mobile Client (`npm start` trong thư mục `eshop-sut/frontend-mobile`).
2. Mở màn hình Đăng nhập (`renderLogin`).
3. Quan sát giao diện:
   - Đọc nhãn phía trên ô nhập email.
   - Đọc chữ hiển thị trên nút bấm đăng nhập.
4. Nhập sai thông tin đăng nhập và bấm nút để quan sát vị trí xuất hiện của khung báo lỗi đỏ.

## Kết quả thực tế (Actual Result)
- Nhãn hiển thị: `"Username"`.
- Nút bấm hiển thị: `"Sign In"`.
- Hộp thông báo lỗi đỏ nằm phía dưới nút bấm `"Sign In"`.

## Kết quả mong đợi (Expected Result)
- Nhãn trường nhập liệu phải là `"Email"` (hoặc `"Địa chỉ Email"`).
- Nút bấm hành động phải hiển thị tiếng Việt đồng nhất: `"Đăng nhập"`.
- Khung thông báo lỗi nên được đặt ở vị trí dễ quan sát: ở phía trên các trường nhập liệu hoặc nằm ngay phía trên nút bấm đăng nhập theo quy chuẩn Form UX (FR-22).

## Phân tích nguyên nhân & Code tham chiếu
- Tại `eshop-sut/frontend-mobile/App.js:762-794`:
  ```javascript
  // Dòng 763: Nhãn "Username" thay vì "Email"
  <Text style={styles.inputLabel}>Username</Text>
  <TextInput
    style={styles.input}
    placeholder="email@example.com"
    value={loginEmail}
    onChangeText={setLoginEmail}
    autoCapitalize="none"
    keyboardType="email-address"
  />

  // Dòng 783: Nhãn nút bấm "Sign In" tiếng Anh
  <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
    <Text style={styles.loginButtonText}>Sign In</Text>
  </TouchableOpacity>

  // Dòng 790: Hộp lỗi nằm dưới nút bấm
  {loginError ? (
    <View style={styles.errorBox}>
      <Text style={styles.errorBoxText}>{loginError}</Text>
    </View>
  ) : null}
  ```

## Test cases liên quan
- `FR20-DT-19` (Mobile UI: Kiểm tra nhãn trường Email và ngôn ngữ nút bấm theo chuẩn FR-21 tiếng Việt)

## Mức độ nghiêm trọng
- **Severity**: Low
- **Priority**: Low
