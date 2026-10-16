# Session History - 2026-10-14

## Ngày làm việc: 14/10/2026
## Sinh viên: TRUONG THANH PHAT (23120319)
## Môn: CSC13003 - Kiem thu phan mem

---

## Tổng quan

Bắt đầu thực hiện HW02 - Domain Testing trên hệ thống EShop SUT.

---

## Những gì đã làm

### 1. Thiết lập môi trường
- Đọc và phân tích cấu trúc project
- Xác định các file spec và source code cần thiết:
  - Spec: `eshop-sut/api_specification.md`
  - Code: `eshop-sut/backend/server.js`, `eshop-sut/backend/database.js`

### 2. FR-01: Account Registration - Stage 0 & 1

#### Stage 0: Thu thập thông tin
- **Endpoint**: `POST /api/register`
- **Request fields**: `name`, `email`, `password`
- **Phát hiện quan trọng**: 
  - **KHÔNG CÓ VALIDATION** trong code (`server.js:20-30`)
  - Không kiểm tra required fields
  - Không kiểm tra email format
  - Không kiểm tra password length
  - Database schema không có UNIQUE constraint cho email (`database.js:50-61`)
- **Possible responses**:
  - 200: `{ message: "User registered successfully", id: <id> }`
  - 500: `{ error: <err.message> }`

#### Stage 1: Input / Output / State Variables
| Biến | Loại | Nguồn |
|------|------|-------|
| name | Input | [SPEC] |
| email | Input | [SPEC] |
| password | Input | [SPEC] |
| Response.status | Output | [CODE] |
| Response.message | Output | [CODE] |
| Response.error | Output | [CODE] |
| Response.id | Output | [CODE] |
| existing_email | State | - |

### 3. Câu hỏi mở (Open Questions)
1. Validation rules thực tế (độ dài, format) là gì?
2. Hệ thống có xử lý email duplicate không?
3. Request body rỗng `{}` sẽ xử lý thế nào?

### 4. Cập nhật cấu trúc thư mục
- Di chuyển report vào: `HW2/report/FR-01/01-domain-testing.vi.md`
- Di chuyển audit vào: `HW2/audit/audit-log.jsonl`
- Cập nhật CLAUDE.md để output đúng đường dẫn:
  - `HW2/report/`
  - `HW2/testcases/`
  - `HW2/audit/`
  - `HW2/evidence/`

### 5. Audit Log
- Tạo A01: FR-01 / Domain Testing / Stage 0-1
- Verdict: INCOMPLETE
- Lý do: Cần xác minh thêm bằng OBSERVED, cần bổ sung chi tiết đường dẫn:dòng

---

## Trạng thái hiện tại

- **Stage 0-1 FR-01**: ✅ Hoàn thành, chờ duyệt
- **Stage 2 FR-01**: Chưa làm (cần duyệt Stage 0-1 trước)

---

## Kế hoạch tiếp theo

1. Chờ sinh viên duyệt Stage 0-1 FR-01
2. Tiến hành Stage 2: Identify Equivalence Classes
   - Liệt kê các equivalence classes cho name, email, password
   - Xác định valid/invalid classes
   - Tạo Complete Set of Partitions table
3. Tiến hành Stage 3: Best representative
4. Tiến hành Stage 4: Select test cases

---

## Ghi chú
- Sử dụng skill `domain-testing` cho mỗi FR
- Sau mỗi artifact, chạy skill `ai-audit-log`
- Commit sau mỗi stage được duyệt
- Báo cáo bằng tiếng Việt có dấu

---

## File đã tạo/sửa

| File | Hành động |
|------|-----------|
| `HW2/report/FR-01/01-domain-testing.vi.md` | Tạo mới |
| `HW2/audit/audit-log.jsonl` | Di chuyển |
| `HW2/CLAUDE.md` | Sửa (cập nhật layout) |
| `HW2/session-history.md` | Tạo mới |

---

**Ngày cập nhật**: 14/10/2026
**Phiên tiếp theo**: Tiếp tục Stage 2 FR-01 sau khi được duyệt
