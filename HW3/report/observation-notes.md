# Nhật ký Quan sát Thực địa Đánh giá Khả dụng (Structured Usability Observation Notes)

**Môn học:** Kiểm thử phần mềm (CSC13003) — FIT@HCMUS  
**Sinh viên thực hiện:** TRƯƠNG THÀNH PHÁT (MSSV: 23120319)  
**Luồng kiểm thử (End-to-End Flow):** Tìm kiếm Smartphone $\to$ Xem chi tiết SP $\to$ Thêm vào giỏ $\to$ Nhập mã giảm giá SAVE10 $\to$ Đăng nhập bắt buộc $\to$ Hoàn tất Thanh toán  
**Môi trường thử nghiệm:** Customer Web (`http://localhost:5173`) trên Google Chrome  
**Thời gian chuẩn đối sánh (Benchmark):** 120 giây (2 phút)

---

## 1. Phiên 1 (P01) — Trần Nhật Nguyên (20 tuổi - Sinh viên ĐH Quốc tế ĐHQG TP.HCM)

- **Thời gian thực hiện:** 20:20 - 20:30, Ngày 2026-11-08
- **Kênh:** Google Form & Thử nghiệm trực tiếp
- **Thiết bị:** Laptop Windows 11, Google Chrome
- **Thông tin liên hệ (Mã hóa):** `0397****83` (Zalo/SĐT)

### A. Nhật ký dòng thời gian & Điểm nghẽn (Friction Log)
| Thời điểm (m:s) | Bước / Màn hình | Hành vi quan sát được | Vấn đề / Điểm vướng mắc (Friction Point) | Lời nói Think-Aloud của người dùng (User Quotes) | Can thiệp? |
|:---:|:---|:---|:---|:---|:---:|
| 00:10 | Danh sách SP | Chọn "Samsung Galaxy S24 Ultra" giá 28,000,000 VND | Bấm "Xem chi tiết" | - | Không |
| 00:25 | Chi tiết SP | Bấm "Thêm vào giỏ hàng" | Chuyển qua Giỏ hàng | - | Không |
| 00:35 | Checkout | Nhập mã `SAVE10`, bấm "Áp dụng" | Thông báo áp dụng thành công | - | Không |
| 00:50 | Checkout | Bấm "Xác Nhận Thanh Toán" | Màn hình hiện "Thanh toán thành công!" | - | Không |

### B. Phản hồi 4 Câu hỏi Thăm dò (Qualitative Probes)
1. **Probe 1 — Tính rõ ràng (Clarity):** *"Không có"*
2. **Probe 2 — Khôi phục lỗi (Error Recovery):** *"Có"*
3. **Probe 3 — Tốc độ cảm nhận (Speed):** *"Phản hồi nhanh chóng"*
4. **Probe 4 — Sự tin cậy (Trust):** *"Không, vì giao diện quá đơn giản. Không có logo, thông tin nhà phát triển, chủ sở hữu, không thể hiện độ uy tín. Không có cam kết bảo mật thông tin người dùng."*

- **Tổng thời gian:** 50 giây (Rất nhanh, vượt chuẩn Benchmark 120s) | **Điểm SUS:** 62.5 (Grade C - OK) | **Kết quả:** Thành công độc lập 100%.

---

## 2. Phiên 2 (P02) — Nguyễn Đức Thịnh (20 tuổi - Sinh viên ĐH Công nghệ Thông tin ĐHQG TP.HCM)

- **Thời gian thực hiện:** 20:40 - 20:50, Ngày 2026-11-08
- **Kênh:** Google Form & Thử nghiệm trực tiếp
- **Thiết bị:** Laptop Windows 11, Google Chrome
- **Thông tin liên hệ (Mã hóa):** `0387****27` (Zalo/SĐT)

### A. Nhật ký dòng thời gian & Điểm nghẽn (Friction Log)
| Thời điểm (m:s) | Bước / Màn hình | Hành vi quan sát được | Vấn đề / Điểm vướng mắc (Friction Point) | Lời nói Think-Aloud của người dùng (User Quotes) | Can thiệp? |
|:---:|:---|:---|:---|:---|:---:|
| 00:00 | Trang chủ | Mở web, nhập từ khóa tìm kiếm smartphone, click nút Tìm kiếm | Thao tác tìm kiếm nhanh | - | Không |
| 00:15 | Danh sách SP | Chọn smartphone giá dưới 30 triệu (iPhone 15 Pro Max) | Đọc thông tin | - | Không |
| 00:28 | Chi tiết SP | Nhấn "Thêm vào giỏ hàng", chuyển ngay sang Giỏ hàng | Không có | - | Không |
| 00:36 | Checkout | Nhập mã `SAVE10`, bấm "Áp dụng" | Giảm 10% thành công | - | Không |
| 00:48 | Checkout | Ô Tổng tiền thanh toán (VND) có thể chỉnh sửa | Sửa số tiền | *"Ủa ô này có thể sửa được?"* | Không |
| 00:57 | Checkout | Bấm "Xác Nhận Thanh Toán" | Đặt hàng thành công trong 70 giây | - | Không |
| 01:05 | Giỏ hàng | Bấm "Giỏ hàng" để xem | Giỏ hàng vẫn còn sản phẩm vừa mua | *"Sao lại còn sản phẩm này ở đây, vừa mới thanh toán rồi mà?"* | Không |

### B. Phản hồi 4 Câu hỏi Thăm dò (Qualitative Probes)
1. **Probe 1 — Tính rõ ràng (Clarity):** *"Không"*
2. **Probe 2 — Khôi phục lỗi (Error Recovery):** *"Có"*
3. **Probe 3 — Tốc độ cảm nhận (Speed):** *"Nhanh"*
4. **Probe 4 — Sự tin cậy (Trust):** *"Chưa hoàn toàn tin tưởng vì thương hiệu chưa chắc uy tín."*

- **Tổng thời gian:** 70 giây (Vượt chuẩn Benchmark 120s) | **Điểm SUS:** 62.5 (Grade C - OK) | **Kết quả:** Thành công độc lập 100%.

---

## 3. Phiên 3 (P03) — Nguyễn An Kiên (21 tuổi - Sinh viên ĐH KHXH&NV ĐHQG TP.HCM)

- **Thời gian thực hiện:** 19:30 - 19:48, Ngày 2026-11-08
- **Kênh:** Google Form & Thử nghiệm trực tiếp
- **Thiết bị:** Laptop ASUS Windows 11
- **Thông tin liên hệ (Mã hóa):** `038****541` (Zalo/SĐT)

### A. Nhật ký dòng thời gian & Điểm nghẽn (Friction Log)
| Thời điểm (m:s) | Bước / Màn hình | Hành vi quan sát được | Vấn đề / Điểm vướng mắc (Friction Point) | Lời nói Think-Aloud của người dùng (User Quotes) | Can thiệp? |
|:---:|:---|:---|:---|:---|:---:|
| 00:00 | Trang chủ | Tìm thanh search, gõ "điện thoại", bấm icon kính lúp | Không có | - | Không |
| 00:20 | Danh sách SP | Chọn "Xiaomi 14 256GB" giá 19.990.000 ₫ | Bấm "Xem chi tiết" | - | Không |
| 00:35 | Chi tiết SP | Bấm "Thêm vào giỏ hàng" | Chuyển qua Giỏ hàng | - | Không |
| 00:50 | Giỏ hàng | Bấm "Tiến hành thanh toán" | Nhận alert bắt đăng nhập | *"Bắt đăng nhập trước nè"* | Không |
| 01:05 | Đăng nhập | Đăng nhập tài khoản | Bị chuyển về trang chủ | *"Ủa sao về trang chủ rồi"* | Không |
| 01:25 | Checkout | Nhập mã `SAVE10`, bấm "Áp dụng" | Thông báo áp dụng thành công | - | Không |
| 01:52 | Checkout | Bấm "Xác Nhận Thanh Toán" | Màn hình hiện "Thanh toán thành công!" | *"Xong rồi nè"* | Không |

### B. Phản hồi 4 Câu hỏi Thăm dò (Qualitative Probes)
1. **Probe 1 — Tính rõ ràng (Clarity):** *"Không"*
2. **Probe 2 — Khôi phục lỗi (Error Recovery):** *"Có, thông báo mã giảm giá rõ"*
3. **Probe 3 — Tốc độ cảm nhận (Speed):** *"Khá nhanh"*
4. **Probe 4 — Sự tin cậy (Trust):** *"Chưa dám mua thật, web nhìn hơi lạ"*

- **Tổng thời gian:** 112 giây (Đạt chuẩn < 120s) | **Lỗi:** 1 lần | **Kết quả:** Thành công độc lập.

---

## 4. Phiên 4 (P04) — Phạm Thị Kim Tuyến (21 tuổi - Sinh viên ĐH Công nghiệp TP.HCM - IUH)

- **Thời gian thực hiện:** 20:30 - 20:50, Ngày 2026-11-08
- **Kênh:** Google Form & Thử nghiệm trực tiếp
- **Thiết bị:** Laptop Windows 11, Google Chrome
- **Thông tin liên hệ (Mã hóa):** `036****457` (Zalo/SĐT)

### A. Nhật ký dòng thời gian & Điểm nghẽn (Friction Log)
| Thời điểm (m:s) | Bước / Màn hình | Hành vi quan sát được | Vấn đề / Điểm vướng mắc (Friction Point) | Lời nói Think-Aloud của người dùng (User Quotes) | Can thiệp? |
|:---:|:---|:---|:---|:---|:---:|
| 00:00 | Trang chủ | Gõ "iPhone", bấm Enter tìm kiếm | Thao tác tìm kiếm bình thường | - | Không |
| 00:18 | Danh sách SP | Chọn iPhone 15, thêm vào giỏ | Thao tác chọn sản phẩm | - | Không |
| 00:35 | Giỏ hàng $\to$ Login | Bấm thanh toán, nhận thông báo alert bắt đăng nhập | Điền tài khoản đăng nhập | - | Không |
| 00:52 | Đăng nhập xong | Bị đưa về trang chủ | Bối rối tìm đường quay lại giỏ hàng | - | Không |
| 01:10 | Checkout | Nhìn thấy ô "Tổng tiền thanh toán (VND):" | Thấy ô có viền input lạ | *"Ủa sao ô tổng tiền có viền sửa tay lạ vậy?"* | Không |
| 01:30 | Checkout | Nhập mã `SAVE10`, bấm Áp dụng | Tiền giảm cập nhật 10% | - | Không |
| 01:55 | Hoàn tất | Bấm thanh toán thành công | Hoàn thành trong 115 giây | *"Xong rồi"* | Không |

### B. Phản hồi 4 Câu hỏi Thăm dò (Qualitative Probes)
1. **Probe 1 — Tính rõ ràng (Clarity):** *"Chỗ tổng tiền tự nhiên sửa được số, còn lại bình thường"*
2. **Probe 2 — Khôi phục lỗi (Error Recovery):** *"Tạm được"*
3. **Probe 3 — Tốc độ cảm nhận (Speed):** *"Bình thường"*
4. **Probe 4 — Sự tin cậy (Trust):** *"Không, nhìn không an toàn"*

- **Tổng thời gian:** 115 giây (Đạt chuẩn Benchmark 120s) | **Lỗi:** 1 lần | **Kết quả:** Thành công độc lập.

---

## 5. Phiên 5 (P05) — Nguyễn Thanh Tuyền (21 tuổi - Sinh viên ĐH Giao thông Vận tải TP.HCM - UTH)

- **Thời gian thực hiện:** 10:00 - 10:15, Ngày 2026-11-08
- **Kênh:** Google Form & Thử nghiệm trực tiếp
- **Thiết bị:** Laptop Windows 11
- **Thông tin liên hệ (Mã hóa):** `083****252` (Zalo/SĐT)

### A. Nhật ký dòng thời gian & Điểm nghẽn (Friction Log)
| Thời điểm (m:s) | Bước / Màn hình | Hành vi quan sát được | Vấn đề / Điểm vướng mắc (Friction Point) | Lời nói Think-Aloud của người dùng (User Quotes) | Can thiệp? |
|:---:|:---|:---|:---|:---|:---:|
| 00:00 | Trang chủ | Bấm vào sản phẩm điện thoại trên trang chủ luôn không cần search | Thao tác rất nhanh nhẹn | - | Không |
| 00:20 | Chi tiết SP | Bấm "Thêm vào giỏ hàng" | Chuyển qua Giỏ hàng | - | Không |
| 00:35 | Giỏ hàng | Bấm thanh toán, đăng nhập tài khoản | Nhập mật khẩu | *"Ủa mật khẩu hiện chữ luôn nè"* | Không |
| 00:55 | Checkout | Vào giỏ bấm thanh toán, áp mã `SAVE10` | Áp mã mượt mà | - | Không |
| 01:28 | Đặt hàng | Bấm "Xác Nhận Thanh Toán" | Thành công | *"Xong rồi nha"* | Không |

### B. Phản hồi 4 Câu hỏi Thăm dò (Qualitative Probes)
1. **Probe 1 — Tính rõ ràng (Clarity):** *"Không có"*
2. **Probe 2 — Khôi phục lỗi (Error Recovery):** *"Có"*
3. **Probe 3 — Tốc độ cảm nhận (Speed):** *"Rất nhanh"*
4. **Probe 4 — Sự tin cậy (Trust):** *"Hơi sợ lộ mật khẩu thôi, mà web thiếu thông tin công ty nên cũng hơi rén"*

- **Tổng thời gian:** 88 giây (Vượt trội Benchmark 120s) | **Lỗi:** 0 lần | **Kết quả:** Thành công xuất sắc.

---

## 6. Phiên 6 (P06) — Trương Thành Đạt (21 tuổi - Sinh viên ĐH Công nghiệp TP.HCM - IUH)

- **Thời gian thực hiện:** 15:30 - 15:55, Ngày 2026-11-08
- **Kênh:** Google Form & Thử nghiệm trực tiếp
- **Thiết bị:** Laptop Windows 11
- **Thông tin liên hệ (Mã hóa):** `035****074` (Zalo/SĐT)

### A. Nhật ký dòng thời gian & Điểm nghẽn (Friction Log)
| Thời điểm (m:s) | Bước / Màn hình | Hành vi quan sát được | Vấn đề / Điểm vướng mắc (Friction Point) | Lời nói Think-Aloud của người dùng (User Quotes) | Can thiệp? |
|:---:|:---|:---|:---|:---|:---:|
| 00:00 | Trang chủ | Gõ tìm kiếm, bấm Enter | Thao tác tìm kiếm bình thường | - | Không |
| 00:22 | Danh sách SP | Chọn sản phẩm, bấm xem chi tiết | Đọc thông số | - | Không |
| 00:40 | Chi tiết SP | Thêm vào giỏ, bấm vào giỏ hàng | Chuyển trang | - | Không |
| 00:55 | Giỏ hàng $\to$ Login | Bấm thanh toán, nhận thông báo alert | Bối rối với alert trình duyệt | - | Không |
| 01:15 | Đăng nhập xong | Bị đưa về trang chủ | Bị ngắt mạch, bấm lại giỏ hàng | *"Ủa sao nhảy về lại trang chủ rồi"* | Không |
| 01:38 | Checkout | Nhập mã `SAVE10` | Áp dụng thành công | - | Không |
| 02:00 | Hoàn tất | Bấm xác nhận đặt hàng | Thành công trong 120 giây | *"Xong rồi"* | Không |

### B. Phản hồi 4 Câu hỏi Thăm dò (Qualitative Probes)
1. **Probe 1 — Tính rõ ràng (Clarity):** *"Không"*
2. **Probe 2 — Khôi phục lỗi (Error Recovery):** *"Không"*
3. **Probe 3 — Tốc độ cảm nhận (Speed):** *"Tạm được"*
4. **Probe 4 — Sự tin cậy (Trust):** *"Không, web nhìn đơn sơ quá"*

- **Tổng thời gian:** 120 giây (Đạt chuẩn đối sánh Benchmark 120s) | **Lỗi:** 1 lần | **Kết quả:** Thành công độc lập.

---

## 7. Phiên 7 (P07) — Huỳnh Thị Kim Liên (21 tuổi - Sinh viên ĐH Công nghiệp TP.HCM - IUH)

- **Thời gian thực hiện:** 17:00 - 17:20, Ngày 2026-11-08
- **Kênh:** Google Form & Thử nghiệm trực tiếp
- **Thiết bị:** Laptop Windows 11
- **Thông tin liên hệ (Mã hóa):** `039****284` (Zalo/SĐT)

### A. Nhật ký dòng thời gian & Điểm nghẽn (Friction Log)
| Thời điểm (m:s) | Bước / Màn hình | Hành vi quan sát được | Vấn đề / Điểm vướng mắc (Friction Point) | Lời nói Think-Aloud của người dùng (User Quotes) | Can thiệp? |
|:---:|:---|:---|:---|:---|:---:|
| 00:00 | Trang chủ | Gõ tìm kiếm, rê chuột click nút tìm | Tìm kiếm bình thường | - | Không |
| 00:25 | Chi tiết SP | Chọn iPhone 15, thêm vào giỏ | Thêm thành công | - | Không |
| 00:45 | Giỏ hàng | Bấm thanh toán, đăng nhập | Đăng nhập tài khoản | - | Không |
| 01:00 | Bị về trang chủ | Nhận ra ngay và chủ động bấm lại giỏ hàng | Phản xạ nhanh | - | Không |
| 01:20 | Checkout | Nhập mã `SAVE10`, bấm Áp dụng | Áp dụng thành công | - | Không |
| 01:44 | Thanh toán | Xác nhận thanh toán thành công | Thành công | *"Xong rồi nè bạn"* | Không |

### B. Phản hồi 4 Câu hỏi Thăm dò (Qualitative Probes)
1. **Probe 1 — Tính rõ ràng (Clarity):** *"Không"*
2. **Probe 2 — Khôi phục lỗi (Error Recovery):** *"Có"*
3. **Probe 3 — Tốc độ cảm nhận (Speed):** *"Nhanh"*
4. **Probe 4 — Sự tin cậy (Trust):** *"Chưa tin lắm vì mua xong mà giỏ hàng vẫn còn nguyên"*

- **Tổng thời gian:** 104 giây (Đạt chuẩn < 120s) | **Lỗi:** 1 lần | **Kết quả:** Thành công độc lập.
