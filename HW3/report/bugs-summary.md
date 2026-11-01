# Tổng hợp Lỗi Giao diện (GUI Defects Summary) - EShop

## 1. Thông tin Tổng quan
- **Hệ thống kiểm thử (SUT)**: EShop Multi-Channel System (Admin Web, Customer Web, Mobile Expo Go)
- **Sinh viên thực hiện**: TRƯƠNG THÀNH PHÁT (MSSV: 23120319)
- **Lớp**: Kiểm thử phần mềm - CQ2023/3 (FIT@HCMUS)
- **Cập nhật lần cuối**: 2026-11-01

---

## 2. Bảng Thống kê Lỗi Giao diện Phát hiện (GUI Bugs Table)

| STT | Bug ID | Checklist Item | Aspect | Phân hệ (Subsystem) | Tiêu đề Lỗi (Defect Title) | Mức độ (Severity) | Trạng thái (Status) | Minh chứng (Screenshot) | Chi tiết (Report Link) | Github issues |
|:---:|:---:|:---:|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | **BUG-GUI-01** | [CHK-ADM-08](checklist.md#L27) | **IA-02** | Admin Dashboard (`:5174`) | Cho phép tạo Danh mục với tên rỗng do thiếu validation biểu mẫu | `Major` | `Open` | [BUG-GUI-01-add-category-with-empty-title.png](../evidence/screenshots/gui/BUG-GUI-01-add-category-with-empty-title.png) | [Xem báo cáo](issues/BUG-GUI-01.md) | [BUG-GUI-01](https://github.com/tthphat/eshop-sut/issues/76)|

---

## 3. Thống kê Phân bổ Lỗi (Defect Distribution)

### A. Theo Mức độ Nghiêm trọng (Severity)
- **Critical**: 0
- **Major**: 1 (BUG-GUI-01)
- **Minor**: 0
- **Trivial**: 0

### B. Theo Khía cạnh Giao diện (Interface Aspects)
- **IA-01 (Chuẩn UI chung)**: 0
- **IA-02 (Biểu mẫu - Forms)**: 1 (BUG-GUI-01)
- **IA-03 (Điều hướng - Navigation)**: 0
- **IA-04 (Phản hồi & Trạng thái)**: 0

### C. Theo Phân hệ Giao diện (SUT Subsystems)
- **Admin Dashboard**: 1 (BUG-GUI-01)
- **Customer Web**: 0
- **Mobile App**: 0
