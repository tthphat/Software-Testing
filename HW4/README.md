# HW04 — Web UI Automation Testing with Playwright TypeScript on EShop SUT

---

## Thông tin Sinh viên & Môn học

| Mục | Nội dung chi tiết |
|:---|:---|
| **Họ và tên sinh viên** | **TRƯƠNG THÀNH PHÁT** |
| **Mã số sinh viên (MSSV)** | **23120319** |
| **Lớp sinh hoạt** | Kiểm thử phần mềm - CQ2023/3 |
| **Môn học** | CS423 / CSC13003 — Kiểm thử phần mềm |
| **Học kỳ** | Học kỳ 1, Năm học 2026–2027 |
| **Khoa / Trường** | Khoa Công nghệ Thông tin — Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM |
| **Giảng viên phụ trách** | TS. Trần Duy Hoàng, ThS. Trương Phước Lộc, ThS. Hồ Tuấn Thanh, TS. Lâm Quang Vũ |
| **Hệ thống kiểm thử (SUT)** | EShop Web & Admin System ([GitHub Repo gốc eshop-sut](https://github.com/ttbhanh/eshop-sut)) |
| **GitHub Repo cá nhân (chứa HW)** | [https://github.com/tthphat/Software-Testing](https://github.com/tthphat/Software-Testing) |
| **GitHub Repo nhóm (chứa Issues)** | [https://github.com/tthphat/eshop-sut](https://github.com/tthphat/eshop-sut) (Toàn bộ Issues #115 → #118) |
| **Email học thuật / Watermark** | `23120319@student.hcmus.edu.vn` |
| **Ngày hoàn thành** | 15/11/2026 |

---

## 1. Bảng Tự Đánh giá Kết quả (Self-Assessment Rubric)

| STT | Tiêu chí đánh giá (Criteria) | Điểm tối đa | Điểm tự chấm | Minh chứng thực hiện & Chi tiết đối chiếu |
|:---:|:---|:---:|:---:|:---|
| **1** | **Kiến trúc Data-Driven & Tách biệt Dữ liệu (§5)** | 20 | **20** | • 100% test cases được tách biệt hoàn toàn vào `HW4/automation/data/*.json` (`fr01-registration.json`, `fr08-checkout.json`, `fr12-access-control.json`).<br>• Không hardcode inline data mảng trong spec.<br>• Mỗi tính năng chứa đúng **12 test cases** (tổng cộng 36 test cases), kế thừa và chuyển đổi chuẩn xác từ HW02.<br>• Vượt qua kiểm tra tự động bởi script `validate_automation.mjs`. |
| **2** | **Thiết kế Kịch bản & Đa dạng hóa Assertion (§7)** | 25 | **25** | • Xây dựng đầy đủ 3 file test spec Playwright TypeScript cho 3 tính năng: FR-01, FR-08, FR-12.<br>• **Đa dạng hóa Assertions:** Mỗi spec đều chứa $\ge 3$ kiểu assertion khác nhau (FR-01: 3 patterns; FR-08: 6 patterns; FR-12: 5 patterns: `toHaveURL`, `toBeVisible`, `toContainText`, `toHaveValue`, `toBeDisabled`, `toHaveAttribute`).<br>• Xử lý resilient locators qua role, placeholder, text exact match, và client-side navigation. |
| **3** | **Thực thi Đa trình duyệt (Multi-Browser Execution §8)** | 15 | **15** | • Cấu hình ma trận 3 trình duyệt desktop chuẩn: **Chromium**, **Firefox**, **WebKit** trong `playwright.config.ts`.<br>• Chạy toàn bộ 36 test cases x 3 trình duyệt = **108 browser runs**.<br>• Kết quả thực tế: **96 PASS (88.9%)**, **12 FAIL (11.1%)** đồng nhất trên cả 3 trình duyệt do 4 lỗi SUT thực tế. |
| **4** | **Phát hiện Khiếm khuyết SUT & Lập Bug Report (§10)** | 20 | **20** | • Phát hiện **4 khiếm khuyết phần mềm thực tế** (100% tái hiện trên cả 3 trình duyệt):<br>&nbsp;&nbsp;1. `BUG-AUTO-01`: Backend crash HTTP 500 khi email trùng lặp (Issue [#115](https://github.com/tthphat/eshop-sut/issues/115)).<br>&nbsp;&nbsp;2. `BUG-AUTO-02`: Lỗ hổng ô tổng tiền cho sửa trực tiếp số âm `-31 đ` (Issue [#116](https://github.com/tthphat/eshop-sut/issues/116)).<br>&nbsp;&nbsp;3. `BUG-AUTO-03`: Giỏ hàng không làm sạch sau thanh toán thành công (Issue [#117](https://github.com/tthphat/eshop-sut/issues/117)).<br>&nbsp;&nbsp;4. `BUG-AUTO-04`: Broken Access Control lộ database user tại `/api/admin/users` (Issue [#118](https://github.com/tthphat/eshop-sut/issues/118)).<br>• Lập 4 hồ sơ bug Markdown chi tiết, kèm ảnh chụp màn hình minh chứng có watermark email `23120319@student.hcmus.edu.vn`. |
| **5** | **Custom Agent Skill & Thẩm định Tự động (§13)** | 10 | **10** | • Xây dựng hoàn chỉnh Agent Skill `playwright-automation-testing` với tài liệu `SKILL.md` và mã script tiện ích.<br>• Tự động hóa cổng kiểm soát chất lượng qua `validate_automation.mjs` (0 lỗi, 0 cảnh báo).<br>• Xuất báo cáo tổng kết chạy test tự động qua `export_run_summary.mjs`. |
| **6** | **Chống gian lận, Git Log & Báo cáo Kiểm toán AI (§6, §9, §11, §12)** | 10 | **10** | • **Chống gian lận (§6, §11):** Báo cáo HTML và console runner hiển thị banner bắt buộc `Run by: 23120319` kèm timestamp ISO.<br>• **Git Commit Log (§12):** Đạt **10 commits** trực tiếp sửa đổi file `.spec.ts` (vượt chuẩn $\ge 8$ commits của đề bài), được xuất lưu tại `HW4/git-commit-log.txt`.<br>• **Phụ lục AI (§9):** Đầy đủ Báo cáo kiểm toán AI 5 cột chuẩn FIT@HCMUS (`[AI-02] - FIT@HCMUS - AI Audit Report_Vn.md` / `.pdf`) và bài luận phản biện 270 từ (`appendix-B-ai-critique.md` / `.pdf`). |
| | **TỔNG ĐIỂM TỰ CHẤM** | **100** | **100 / 100** | **Hoàn thành trọn vẹn 100% tất cả các yêu cầu khắt khe của Đề bài** |

---

## 2. Báo cáo Tổng kết Kiểm thử (Test Summary Report)

*(Số liệu được trích xuất tự động từ file kết quả kiểm thử `HW4/automation/test-results/results.json` thông qua script `export_run_summary.mjs`)*

| Chỉ số kiểm định | Số lượng thực tế | Tỉ lệ (%) | Diễn giải kỹ thuật |
|:---|:---:|:---:|:---|
| **Số tính năng kiểm thử (Features)** | **3 tính năng** | 100% | Pool A: FR-01 (Đăng ký), Pool B: FR-08 (Checkout), Pool C: FR-12 (Admin Access Control) |
| **Số test cases đã tự động hóa** | **36 test cases** | 100% | 12 test cases mỗi tính năng, tách biệt hoàn toàn dạng Data-Driven JSON |
| **Tổng số lượt chạy trình duyệt (Executions)** | **108 lượt** | 100% | 36 test cases x 3 trình duyệt (Chromium, Firefox, WebKit) |
| **Số lượt kiểm thử ĐẠT (PASS)** | **96 lượt** | **88.9%** | Đáp ứng đúng quy chuẩn và kỳ vọng chức năng |
| **Số lượt kiểm thử THẤT BẠI (FAIL)** | **12 lượt** | **11.1%** | 100% do bộc lộ 4 khiếm khuyết SUT (3 trình duyệt x 4 bugs = 12 fails) |
| **Số khiếm khuyết SUT phát hiện (Defects)** | **4 lỗi** | — | `BUG-AUTO-01` đến `BUG-AUTO-04` (GitHub Issues #115 → #118) |
| **Số kiểu mẫu Assertion độc lập (Patterns)** | **6 patterns** | — | `toHaveURL`, `toBeVisible`, `toContainText`, `toHaveValue`, `toBeDisabled`, `toHaveAttribute` |
| **Số commit chỉnh sửa file `.spec.ts`** | **10 commits** | — | Vượt mức tối thiểu 8 commits theo quy định Mục §12 |

---

## 3. Bảng Tổng hợp Khiếm khuyết Phát hiện (Bug Matrix)

| STT | Mã Bug | Tính năng | Test Case phát hiện | Tên lỗi & Mô tả khiếm khuyết | Severity | Priority | GitHub Issue |
|:---:|:---|:---|:---|:---|:---:|:---:|:---:|
| 1 | **BUG-AUTO-01** | FR-01 (Đăng ký) | `TC-FR01-12` | Đăng ký email đã tồn tại làm Backend crash `HTTP 500` do lỗi UNIQUE constraint trong SQLite | **High** | P1 | [#115](https://github.com/tthphat/eshop-sut/issues/115) |
| 2 | **BUG-AUTO-02** | FR-08 (Checkout) | `TC-FR08-10` | Lỗ hổng ô tổng tiền cho phép người mua sửa trực tiếp số âm (`-31 đ`) trên giao diện | **Critical** | P1 | [#116](https://github.com/tthphat/eshop-sut/issues/116) |
| 3 | **BUG-AUTO-03** | FR-08 (Checkout) | `TC-FR08-11` | Giỏ hàng không được xóa (`clearCart`) sau khi hoàn tất thanh toán thành công | **Medium** | P2 | [#117](https://github.com/tthphat/eshop-sut/issues/117) |
| 4 | **BUG-AUTO-04** | FR-12 (Admin Guard) | `TC-FR12-12` | Lỗ hổng Broken Access Control (OWASP A01:2021) tại API `/api/admin/users` lộ cơ sở dữ liệu user cho vai trò user | **Critical** | P1 | [#118](https://github.com/tthphat/eshop-sut/issues/118) |

---

## 4. Hướng dẫn Cài đặt & Thực thi Kịch bản Kiểm thử

### 4.1 Khởi động Hệ thống EShop SUT
Cần mở 3 cửa sổ terminal riêng biệt để chạy 3 phân hệ của EShop SUT:

```powershell
# Terminal 1: Backend API (Port 3000)
cd eshop-sut/backend
npm install
npm start

# Terminal 2: Customer Frontend Web (Port 5173)
cd eshop-sut/frontend-web
npm install
npm run dev

# Terminal 3: Admin Frontend Web (Port 5174)
cd eshop-sut/frontend-admin
npm install
npm run dev
```

### 4.2 Cài đặt dependencies kiểm thử tự động
Tại thư mục `HW4/automation`:
```powershell
cd HW4/automation
npm install
npx playwright install --with-deps
```

### 4.3 Thẩm tra chất lượng dự án (Quality Gate)
Chạy script tự động thẩm tra các tiêu chí đề bài:
```powershell
node ../../.agents/skills/playwright-automation-testing/scripts/validate_automation.mjs
```
*(Kết quả yêu cầu: Errors: 0, Warnings: 0)*

### 4.4 Chạy Bộ Kiểm thử Tự động Playwright
```powershell
# Chạy trong thư mục /automation, nơi config playwright

# Chạy toàn bộ 3 tính năng trên cả 3 trình duyệt (108 test runs)
npx playwright test

# Hoặc chạy từng tính năng riêng lẻ:
npx playwright test tests/fr01-registration.spec.ts
npx playwright test tests/fr08-checkout.spec.ts
npx playwright test tests/fr12-access-control.spec.ts

# Mở giao diện xem báo cáo HTML trực quan:
npx playwright show-report
```

---

## 5. Cấu trúc Hồ sơ Bài nộp (`23120319_HW04_AI_Automation_100/`)

```text
23120319_HW04_AI_Automation_100/
├── .claude/                                   # Cấu hình Custom Agent Skills theo chuẩn đề bài (§13)
│   └── skills/
│       ├── ai-audit-log/                      # Skill ghi nhận báo cáo kiểm toán AI
│       │   ├── SKILL.md
│       │   └── scripts/audit.py
│       └── playwright-automation-testing/     # Skill Playwright TypeScript E2E & Quality Gate
│           ├── SKILL.md
│           ├── scripts/
│           │   ├── export_run_summary.mjs     # Script trích xuất số liệu test tự động
│           │   └── validate_automation.mjs    # Script thẩm định cấu trúc automation
│           └── templates/
│               ├── playwright.config.template.ts
│               └── spec.template.ts
├── automation/                                # Toàn bộ mã nguồn dự án Playwright TypeScript
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── playwright.config.ts                   # Ma trận 3 trình duyệt, banner Run by: 23120319
│   ├── data/                                  # Dữ liệu kiểm thử Data-Driven (tách biệt 100%)
│   │   ├── fr01-registration.json             # 12 test cases
│   │   ├── fr08-checkout.json                 # 12 test cases
│   │   └── fr12-access-control.json           # 12 test cases
│   ├── tests/                                 # Kịch bản kiểm thử tự động (>= 3 assertions)
│   │   ├── fr01-registration.spec.ts
│   │   ├── fr08-checkout.spec.ts
│   │   └── fr12-access-control.spec.ts
│   ├── reporters/
│   │   └── authorship-reporter.ts             # Reporter in thông tin nhận diện tác giả
│   ├── test-results/                          # Kết quả 108 test runs, traces và video/ảnh failure
│   │   └── results.json
│   └── playwright-report/                     # Thư mục chứa báo cáo HTML runtime của Playwright
├── evidence/                                  # Minh chứng kiểm thử thực tế có Watermark sinh viên
│   ├── github-issues/                         # Ảnh chụp 4 Issues (#115 -> #118) trên GitHub repo SUT
│   │   ├── BUG-AUTO-01-issue-115.png
│   │   ├── BUG-AUTO-02-issue-116.png
│   │   ├── BUG-AUTO-03-issue-117.png
│   │   └── BUG-AUTO-04-issue-118.png
│   └── screenshots/                           # 5 ảnh chụp lỗi SUT kèm Watermark email sinh viên
│       ├── BUG-FR01-01-duplicate-email-p1.png
│       ├── BUG-FR01-01-duplicate-email-p2.png
│       ├── BUG-FR08-02-editable-total.png
│       ├── BUG-FR08-03-cart-not-cleared.png
│       └── BUG-FR12-04-broken-access-control.png
├── report/                                    # Toàn bộ báo cáo và phụ lục chính thức (MD + PDF)
│   ├── 23120319_HW04_Main_Report.md           # Báo cáo chính toàn diện HW04 (Markdown)
│   ├── 23120319_HW04_Main_Report.pdf          # Báo cáo chính toàn diện HW04 (PDF 19 trang hoàn chỉnh)
│   ├── [AI-02] - FIT@HCMUS - AI Audit Report_Vn.md  # Báo cáo kiểm toán AI 5 cột chuẩn FIT@HCMUS
│   ├── [AI-02] - FIT@HCMUS - AI Audit Report_Vn.pdf # Báo cáo kiểm toán AI (PDF 10 trang)
│   ├── [AI-03] - FIT@HCMUS - AI Disclosure Form_Vn.docx.md # Biểu mẫu công bố AI (Markdown)
│   ├── [AI-03] - FIT@HCMUS - AI Disclosure Form_Vn.pdf     # Biểu mẫu công bố AI (PDF 4 trang)
│   ├── [AI-05] - FIT@HCMUS - AI Privacy Checklist_Vn.docx.md # Bảng kiểm tra quyền riêng tư AI (MD)
│   ├── [AI-05] - FIT@HCMUS - AI Privacy Checklist_Vn.pdf     # Bảng kiểm tra quyền riêng tư AI (PDF 2 trang)
│   ├── appendix-B-ai-critique.md              # Bài luận phản biện AI 270 từ (Markdown)
│   ├── appendix-B-ai-critique.pdf             # Bài luận phản biện AI (PDF 1 trang)
│   ├── bugs-summary.md                        # Báo cáo tổng hợp 4 khiếm khuyết SUT (Markdown)
│   ├── bugs-summary.pdf                       # Báo cáo tổng hợp khiếm khuyết SUT (PDF)
│   ├── issues/                                # 4 hồ sơ khiếm khuyết phần mềm chi tiết
│   │   ├── BUG-AUTO-01-duplicate-email.md
│   │   ├── BUG-AUTO-02-editable-total-price.md
│   │   ├── BUG-AUTO-03-cart-not-cleared.md
│   │   └── BUG-AUTO-04-broken-access-control.md
│   └── playwright-report/                     # Báo cáo Playwright HTML đa trình duyệt lưu trữ
│       ├── playwright-report-fr01.html
│       ├── playwright-report-fr08.html
│       ├── playwright-report-fr12.html
│       └── playwright-report-full.html
├── CLAUDE.md                                  # Hướng dẫn cấu hình và quy chuẩn kịch bản kiểm thử
├── git-commit-log.txt                         # Nhật ký Git commit minh chứng 20 commits HW04
└── README.md                                  # Báo cáo tổng kết, bảng tự chấm 100/100, số liệu kiểm thử
```

---

## 6. Danh sách Video Demo (YouTube)

| Tên Video / Nội dung | Đường dẫn YouTube | Mô tả chi tiết |
|:---|:---:|:---|
| **Video 1: Demo Custom Agent Skill (FR-01) & Quality Gate (§13)** | [https://youtu.be/jkY-9PJzVOA](https://youtu.be/jkY-9PJzVOA) | Thuyết minh kiến trúc Custom Skill `playwright-automation-testing` áp dụng cho tính năng **FR-01 (Đăng ký tài khoản)**, cấu trúc `SKILL.md`, chạy thẩm định tự động `validate_automation.mjs` (0 errors, 0 warnings) và xuất tổng kết `export_run_summary.mjs`. |
| **Video 2: Demo Playwright E2E Multi-Browser (FR-08) & SUT Defect Analysis (§8, §10)** | [https://youtu.be/awARwEi7ZAk](https://youtu.be/awARwEi7ZAk) | Thực thi kiểm thử tự động đa trình duyệt E2E cho tính năng **FR-08 (Giỏ hàng & Checkout)** trên Chromium, Firefox, WebKit, mở báo cáo HTML và phân tích chi tiết lỗi SUT (`BUG-AUTO-02`, `BUG-AUTO-03`) cùng khoảng trống AI. |

