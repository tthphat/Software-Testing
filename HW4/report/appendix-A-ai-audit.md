# Phụ lục A — Báo cáo Kiểm toán AI (AI Audit Report)

**Môn học:** CS423 / CSC13003 — Kiểm thử phần mềm (HK1/2026–2027)  
**Khoa Công nghệ Thông tin (FIT) — Trường Đại học Khoa học Tự nhiên (HCMUS)**  
**CHÍNH SÁCH AI · BIỂU MẪU — 2026 v1.0 (Mẫu 5 mục cho mỗi Artifact theo quy chuẩn FIT@HCMUS)**  

---

## 1. Thông tin Sinh viên

| Mục | Giá trị |
| :--- | :--- |
| **Họ và tên sinh viên (in hoa)** | **TRƯƠNG THÀNH PHÁT** |
| **Mã số sinh viên (MSSV)** | **23120319** |
| **Lớp / Khóa** | Kiểm thử phần mềm - CQ2023/3 - Khóa 2023 |
| **Mã bài tập** | HW#04 — Web UI Automation Testing with Playwright |
| **Ngày lập báo cáo** | 15/11/2026 |
| **Công cụ AI đã sử dụng** | Antigravity (Gemini 2.5 Flash / Claude 3.7 Sonnet), Playwright Copilot |
| **Khai báo sử dụng AI** | [x] Có &nbsp;&nbsp;&nbsp;&nbsp; [ ] Không |

---

## 2. Hướng dẫn (đọc trước khi điền)
1. Thêm 1 hàng trong bảng tổng hợp và 1 mục chi tiết cho mỗi artifact do AI sinh (cấu hình, kịch bản test, dữ liệu data-driven, script kiểm định, báo cáo bug...).
2. Dán nguyên văn prompt — KHÔNG paraphrase.
3. Dán trung thực nội dung output AI đã sinh.
4. Gắn nhãn đánh giá rõ ràng: `VALID` / `INVALID` / `INCOMPLETE`.
5. Lý do đánh giá phải dẫn chiếu chuẩn kiểm thử quốc tế ISTQB FL v4.0, ISTQB AL-TAE, OWASP Top 10 hoặc IEEE 829.
6. Thể hiện rõ phần sinh viên sửa đổi, đối soát trực tiếp trên SUT thực tế và mã nguồn.

---

## 3. Bảng Audit — 1 hàng / artifact (Tổng hợp)

| # | Tác vụ / Artifact | Công cụ AI | Đánh giá (Verdict) | Ghi chú thẩm tra và hiệu chỉnh của sinh viên |
|:---:|:---|:---|:---:|:---|
| **A01** | Khởi tạo Cấu hình Playwright Multi-Browser (`playwright.config.ts`, `package.json`) | Antigravity | `VALID` | Thiết lập ma trận 3 trình duyệt (Chromium, Firefox, WebKit), metadata tác giả `Run by: 23120319`, ISO timestamp và xuất JSON kết quả `results.json`. |
| **A02** | Xây dựng Kịch bản & Data-Driven FR-01 (`fr01-registration.spec.ts`, `fr01-registration.json`) & BUG-AUTO-01 | Antigravity | `INCOMPLETE` | Chuẩn hóa cấu trúc 12 test case JSON, thay `getByLabel` bị timeout bằng locator kế cận, phát hiện lỗi sập server Backend khi trùng email (Issue #115). |
| **A03** | Xây dựng Kịch bản & Data-Driven FR-08 (`fr08-checkout.spec.ts`, `fr08-checkout.json`) & BUG-AUTO-02, BUG-03 | Antigravity | `INCOMPLETE` | Bổ sung `couponCode: null` tránh lỗi undefined, chuyển sang Client Navigation giữ state giỏ hàng, đợi coupon async; phát hiện lỗi sửa tổng tiền (Issue #116) và giỏ không xóa (Issue #117). |
| **A04** | Xây dựng Kịch bản & Data-Driven FR-12 (`fr12-access-control.spec.ts`, `fr12-access-control.json`) & BUG-AUTO-04 | Antigravity | `INCOMPLETE` | Bổ sung `expectedStatus` cho test API, thêm `{ exact: true }` sửa lỗi Strict Mode, phát hiện lỗ hổng Broken Access Control tại `/api/admin/users` (Issue #118). |
| **A05** | Xây dựng Script Thẩm định Kịch bản Kiểm thử Tự động (`validate_automation.mjs`) | Antigravity | `VALID` | Kiểm tra tự động 5 tiêu chí cốt lõi: Data-driven tách biệt, $\ge 12$ ca/tính năng, $\ge 3$ pattern assertion/spec, cấu hình 3 trình duyệt, metadata sinh viên (0 Errors, 0 Warnings). |
| **A06** | Thực thi Toàn diện Bộ Kiểm thử (108 Runs) & Xuất Báo cáo Tổng kết (`export_run_summary.mjs`) | Antigravity | `VALID` | Tự động hóa trích xuất số liệu Playwright results.json theo ma trận 3 trình duyệt, tính toán chuẩn xác Pass Rate 88.9% (96/108 runs) và xuất bảng Markdown chuẩn IEEE 829. |
| **A07** | Lập Báo cáo 4 Khiếm khuyết SUT (`BUG-AUTO-01` đến `04`) & GitHub Issues (#115 đến #118) | Antigravity | `VALID` | Cấu trúc chuẩn mực: Tiền điều kiện, Các bước tái hiện, Kỳ vọng vs Thực tế, Vị trí mã nguồn SUT, Ảnh chụp watermark email sinh viên. |

---

## 4. Chi tiết Audit từng Artifact — Mẫu 5 mục chuẩn FIT@HCMUS

### Artifact A01 — Khởi tạo Cấu hình Playwright Multi-Browser (`playwright.config.ts`, `package.json`)

- **(1) Prompt + Công cụ:**
  - *Tool:* Antigravity (Claude 3.7 Sonnet) – 14/11/2026.
  - *Prompt:* "Dựa trên yêu cầu HW04 môn Kiểm thử phần mềm (CS423 / CSC13003), hãy tạo cấu hình `playwright.config.ts` hỗ trợ 3 trình duyệt Chromium, Firefox, WebKit, có gắn metadata tác giả 'Run by: 23120319', timestamp ISO, baseURL `http://localhost:5173`, và tích hợp các reporter list, html, json."
- **(2) Output AI:** Sinh ra 2 file cấu hình nền tảng Playwright gồm:
  1. File cấu hình thực thi: `HW4/automation/playwright.config.ts`.
  2. File quản lý phụ thuộc: `HW4/automation/package.json`.
  *Nội dung chi tiết file `playwright.config.ts` do AI sinh:*
  ```typescript
  import { defineConfig, devices } from '@playwright/test';

  const STUDENT_ID = '23120319';
  const RUN_TIMESTAMP = new Date().toISOString();

  export default defineConfig({
    testDir: './tests',
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: 1,

    /* Mandatory Authorship Metadata (§6 & §11) */
    metadata: {
      'Run by': STUDENT_ID,
      'Timestamp': RUN_TIMESTAMP,
      'Course': 'CSC13003 - Software Testing HW04',
    },

    reporter: [
      ['list'],
      ['html', { outputFolder: 'playwright-report', open: 'never' }],
      ['json', { outputFile: 'test-results/results.json' }],
      ['./reporters/authorship-reporter.ts'],
    ],

    use: {
      baseURL: 'http://localhost:5173',
      trace: 'on-first-retry',
      screenshot: 'only-on-failure',
      video: 'retain-on-failure',
      actionTimeout: 10000,
      navigationTimeout: 15000,
    },

    /* Mandatory Multi-Browser Matrix: >= 3 Browsers */
    projects: [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
      },
      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
      },
      {
        name: 'webkit',
        use: { ...devices['Desktop Safari'] },
      },
    ],
  });
  ```
- **(3) Đánh giá (Verdict):** `VALID`.
- **(4) Lý do (ISTQB):**
  - Tuân thủ chuẩn **ISTQB FL v4.0 §6.1 (Test Tool Support)** và **§6.2 (Benefits and Risks of Test Automation)** về việc thiết lập môi trường thực thi kịch bản kiểm thử tự động đa nền tảng nhất quán và có khả năng tái lập (*Execution Environment Consistency & Portability*).
  - Dẫn chiếu **Đề bài HW04 Mục §6 (Authorship Metadata)** và **Mục §8 (Multi-Browser Support)**: Cấu hình ma trận 3 trình duyệt Desktop tiêu chuẩn (Blink - Chromium, Gecko - Firefox, WebKit - Safari) bảo đảm kiểm thử tương thích chéo (Cross-Browser Compatibility Testing), phục vụ phát hiện các sai lệch runtime giữa các engine render web. Cấu hình tự động kết xuất JSON và HTML đáp ứng tiêu chuẩn lưu trữ bằng chứng kiểm thử (**IEEE 829 Test Summary Report**).
- **(5) Bản SV sửa:**
  - Sinh viên giữ nguyên cấu hình nền tảng của AI và bổ sung custom reporter độc lập `HW4/automation/reporters/authorship-reporter.ts` để in tiêu đề nhận diện tác giả `Run by: 23120319` kèm timestamp ISO trực tiếp ra Terminal console khi bắt đầu và kết thúc mỗi suite kiểm thử.

---

### Artifact A02 — Kịch bản Tự động hóa & Data-Driven FR-01 (`fr01-registration.spec.ts`, `fr01-registration.json`) & Phát hiện BUG-AUTO-01

- **(1) Prompt + Công cụ:**
  - *Tool:* Antigravity (Claude 3.7 Sonnet) – 14/11/2026.
  - *Prompt:* "Áp dụng agent skill `playwright-automation-testing`, hãy đọc 12 test case từ bài tập HW02 của tính năng FR-01 (Đăng ký tài khoản), chuyển đổi sang file dữ liệu data-driven `fr01-registration.json`, gắn metadata tác giả 'Run by: 23120319', timestamp ISO, và sinh kịch bản Playwright TypeScript `fr01-registration.spec.ts` với ít nhất 3 kiểu assertion để phát hiện khiếm khuyết SUT."
- **(2) Output AI:** Sinh ra 2 file kịch bản và dữ liệu kiểm thử gồm:
  1. File dữ liệu kiểm thử Data-Driven JSON: `HW4/automation/data/fr01-registration.json` (chứa 12 test cases kế thừa từ HW02 theo cấu trúc tách biệt `id`, `name`, `inputs`, `expected`).
  2. File kịch bản kiểm thử Playwright TypeScript: `HW4/automation/tests/fr01-registration.spec.ts`.
  *Nội dung thực thi ban đầu do AI sinh:* Sinh file spec `tests/fr01-registration.spec.ts` lặp qua 12 test cases bằng vòng lặp `for (const tc of testCases)`. Để điền biểu mẫu, AI sử dụng bộ định vị nhãn `page.getByLabel('Họ và tên')`, `page.getByLabel('Email')`, `page.getByLabel('Mật khẩu')`.
- **(3) Đánh giá (Verdict):** `INCOMPLETE`.
- **(4) Lý do (ISTQB):**
  - Căn cứ **ISTQB FL v4.0 §4.2 (Black-box Test Techniques - Data-driven Testing)** và **§6.2 (Principles of Data-Driven Automation Frameworks)**: Kịch bản kiểm thử (Test Scripts) và tập dữ liệu kiểm thử (Test Datasets) phải được phân tách độc lập tuyệt đối. Toàn bộ 12 ca kiểm thử phải tuân thủ nghiêm ngặt schema dữ liệu để nạp tuần tự vào một khung thực thi duy nhất mà không hardcode dữ liệu trong file test.
  - Căn cứ **ISTQB FL v4.0 §4.2.1 (Equivalence Partitioning)**, **§4.2.2 (Boundary Value Analysis)** và **ISTQB Advanced Test Automation Engineer (AL-TAE) §3.2 (Robust Locator Strategies)**: Bộ định vị kiểm thử (Test Locators) phải có độ bền vững cao (*Resilient Locators*) trước các biến thể cấu trúc HTML thực tế.
  - **Phân loại nguyên nhân (Bloom-AI):** `Model limitation` (Điểm mù mô hình: AI mặc định mã HTML luôn tuân thủ chuẩn ngữ nghĩa W3C Semantic HTML với cặp thẻ `<label for="id">` và `<input id="...">`). Trong mã nguồn SUT `Register.jsx`, lập trình viên chỉ đặt thẻ `<label>` nằm kế bên `<input>` mà không hề có thuộc tính `id/for`. Kết quả là lệnh `getByLabel` của Playwright không thể ánh xạ tới ô nhập liệu, dẫn đến lỗi treo kịch bản và Timeout 10.000ms giả (*False Negative*). Ngoài ra, AI ban đầu bỏ qua việc kiểm tra hành vi sập server phía Backend khi dữ liệu vi phạm ràng buộc cơ sở dữ liệu.
- **(5) Bản SV sửa:**
  - Chuẩn hóa toàn bộ tập dữ liệu `fr01-registration.json`: Đảm bảo 100% không còn hardcode trong spec, định dạng chuẩn 12/12 test cases tương thích hoàn toàn với vòng lặp Data-Driven.
  - Tái cấu trúc bộ định vị sang các selector bền vững: thay `getByLabel` bằng `getByPlaceholder('Họ và tên')`, `getByPlaceholder('Email')`, và sử dụng selector kế cận `locator('input').nth(i)`.
  - Đa dạng hóa 3 kiểu assertion: `expect(page).toHaveURL(/login/)`, `expect(element).toBeVisible()`, `expect(element).toContainText()`.
  - Khởi chạy test case biên âm `TC-FR01-12` (Đăng ký với email đã tồn tại `user@example.com`): Phát hiện Backend SQLite ném lỗi `UNIQUE constraint failed: users.email` khiến server Express sập và trả về `HTTP 500 Internal Server Error` thay vì `HTTP 400/409 Conflict`.
  - Sinh viên lập hồ sơ khiếm khuyết **`BUG-AUTO-01`**, chụp ảnh màn hình đóng dấu watermark email `23120319@student.hcmus.edu.vn` và tạo GitHub Issue [#115](https://github.com/tthphat/eshop-sut/issues/115).

---

### Artifact A03 — Kịch bản Tự động hóa & Data-Driven FR-08 (`fr08-checkout.spec.ts`, `fr08-checkout.json`) & Phát hiện BUG-AUTO-02, BUG-AUTO-03

- **(1) Prompt + Công cụ:**
  - *Tool:* Antigravity (Claude 3.7 Sonnet) – 15/11/2026.
  - *Prompt:* "Áp dụng agent skill `playwright-automation-testing`. Đọc 12 test case từ HW02 cho tính năng FR-08 (Giỏ hàng & Thanh toán), chuyển đổi thành `fr08-checkout.json` và xây dựng kịch bản kiểm thử tự động `fr08-checkout.spec.ts`. Áp dụng kỹ thuật Client-side Navigation để giữ vững React Context state, chèn `waitForResponse` đón sự kiện API tính tiền bất đồng bộ và kiểm tra lỗ hổng sửa tổng tiền."
- **(2) Output AI:** Sinh ra 2 file kịch bản và dữ liệu kiểm thử gồm:
  1. File dữ liệu kiểm thử Data-Driven JSON: `HW4/automation/data/fr08-checkout.json` (chứa 12 test cases kế thừa từ HW02).
  2. File kịch bản kiểm thử Playwright TypeScript: `HW4/automation/tests/fr08-checkout.spec.ts`.
  *Khuyết tật ban đầu do AI sinh:*
  - *Về dữ liệu Data-Driven:* Cấu trúc schema không đồng nhất, ở các ca kiểm thử không dùng mã giảm giá bị thiếu thuộc tính `couponCode` hoặc để `undefined` thay vì `null`.
  - *Về kịch bản thực thi:* Nạp token qua localStorage, sau đó gọi trực tiếp `await page.goto('http://localhost:5173/checkout')` và click nút áp dụng coupon rồi assert ngay giá tiền mà không chờ phản hồi mạng bất đồng bộ.
- **(3) Đánh giá (Verdict):** `INCOMPLETE`.
- **(4) Lý do (ISTQB):**
  - Căn cứ **ISTQB FL v4.0 §4.2 (Black-box Test Techniques - Data-driven Testing)** và **§6.2 (Principles of Data-Driven Automation Frameworks)**: Nguyên lý cốt lõi của kiểm thử hướng dữ liệu là tách bạch hoàn toàn logic kịch bản và tập dữ liệu, đòi hỏi tính toàn vẹn cấu trúc dữ liệu nghiêm ngặt (*Strict Schema Integrity*). AI trích xuất các ca kiểm thử từ bảng biểu markdown dạng không cấu trúc sang JSON, xử lý các trường hợp giá trị rỗng bằng cách lược bỏ thuộc tính (`omitted property`) thay vì gán giá trị định kiểu rõ ràng (`null`). Sự thiếu nhất quán này khiến Playwright TypeScript ném ngoại lệ `TypeError: Cannot read properties of undefined` khi truy cập `tc.inputs.couponCode.trim()`.
  - Căn cứ **ISTQB FL v4.0 §2.2 (Test Levels & Test Types - State Transition & Integration Testing)** và **ISTQB AL-TAE §4.3 (Handling Asynchronous Events & Single Page Applications)**: Kiểm thử ứng dụng SPA đòi hỏi phải duy trì liên tục trạng thái bộ nhớ phiên (*In-memory Application State*) và đồng bộ hóa các sự kiện mạng bất đồng bộ (*Network Synchronization*).
  - **Phân loại nguyên nhân (Bloom-AI):**
    1. `Inherent framework complexity` (Độ phức tạp nội tại của React Virtual DOM & Context API): Trong kiến trúc của SUT, `CartContext` chỉ nạp và đồng bộ hóa sản phẩm vào giỏ hàng khi người dùng điều hướng nội bộ bằng React Router từ trang `/cart` sang `/checkout`. Khi AI dùng `page.goto('/checkout')` bằng HTTP GET cứng, toàn bộ React tree bị mount lại từ đầu khiến giỏ hàng bị rỗng (`cart = []`).
    2. `Model limitation` (Thiếu khả năng dự đoán độ trễ mạng bất đồng bộ): Hành động áp dụng mã coupon gửi request bất đồng bộ tới Backend `/api/coupons/apply`. AI assert giá tiền ngay sau lệnh click khiến kịch bản đọc giá trị cũ trước khi DOM kịp render lại, gây lỗi kiểm thử chập chờn (*Flaky Assertion Race Condition*).
- **(5) Bản SV sửa:**
  - Chuẩn hóa toàn bộ 12 test cases của `fr08-checkout.json`: Bổ sung tường minh trường `couponCode: null` và `expectedAlert: null` cho các test case không kích hoạt mã giảm giá, bảo đảm schema đồng nhất 100%.
  - Tái cấu trúc quy trình theo mô hình **Client-Side Navigation**: Kịch bản truy cập `/cart` trước, xác nhận giỏ hàng có sản phẩm, sau đó click nút *"Tiến hành thanh toán"* (`getByRole('button', { name: 'Tiến hành thanh toán' })`) để chuyển trang nội bộ, bảo tồn 100% dữ liệu giỏ hàng.
  - Bổ sung cơ chế đồng bộ mạng chủ động: Chèn `page.waitForResponse(res => res.url().includes('/api/coupons/apply') && res.status() === 200)` trước khi assert tổng tiền.
  - Đa dạng hóa 6 kiểu assertion khác nhau: `toHaveURL`, `toBeVisible`, `toContainText`, `toHaveValue`, `toBeDisabled`, `toHaveAttribute`.
  - Phát hiện **2 khiếm khuyết SUT nghiêm trọng**:
    + `TC-FR08-10`: Ô tổng tiền thanh toán cho phép người dùng sửa trực tiếp thành số âm (`-31 đ`) -> Lập **`BUG-AUTO-02`** (Issue [#116](https://github.com/tthphat/eshop-sut/issues/116)).
    + `TC-FR08-11`: Sau khi đặt hàng thành công, giỏ hàng không bị xóa rỗng do quên gọi `clearCart()` -> Lập **`BUG-AUTO-03`** (Issue [#117](https://github.com/tthphat/eshop-sut/issues/117)).

---

### Artifact A04 — Kịch bản Tự động hóa & Data-Driven FR-12 (`fr12-access-control.spec.ts`, `fr12-access-control.json`) & Phát hiện BUG-AUTO-04

- **(1) Prompt + Công cụ:**
  - *Tool:* Antigravity (Gemini 2.5 Flash) – 15/11/2026.
  - *Prompt:* "Áp dụng agent skill `playwright-automation-testing`. Đọc 12 test case từ HW02 cho tính năng FR-12 (Kiểm soát quyền Admin Web & API), chuyển đổi thành `fr12-access-control.json` và xây dựng kịch bản `fr12-access-control.spec.ts` cho Web Admin port 5174. Tinh chỉnh bộ định vị tránh xung đột Strict Mode, và bổ sung test case kiểm thử lỗ hổng Broken Access Control khi người dùng thường gọi endpoint `/api/admin/users`."
- **(2) Output AI:** Sinh ra 2 file kịch bản và dữ liệu kiểm thử gồm:
  1. File dữ liệu kiểm thử Data-Driven JSON: `HW4/automation/data/fr12-access-control.json` (chứa 12 test cases kế thừa từ HW02).
  2. File kịch bản kiểm thử Playwright TypeScript: `HW4/automation/tests/fr12-access-control.spec.ts`.
  *Khuyết tật ban đầu do AI sinh:*
  - *Về dữ liệu Data-Driven:* Dữ liệu cho test case kiểm thử vượt quyền API bị thiếu trường mã trạng thái HTTP kỳ vọng (`expectedStatus`).
  - *Về kịch bản thực thi:* Đăng nhập Admin Web và chuyển tab bằng lệnh `page.getByText(tc.inputs.clickTab).click()`. Đối với kiểm tra phân quyền, AI chỉ dừng lại ở việc assert dialog alert *"Bạn không phải là admin!"* trên giao diện web và bỏ sót hoàn toàn việc kiểm thử bảo mật tầng REST API Backend.
- **(3) Đánh giá (Verdict):** `INCOMPLETE`.
- **(4) Lý do (ISTQB):**
  - Căn cứ **ISTQB FL v4.0 §4.2 (Black-box Testing & Data-driven Testing)**, **ISTQB AL-SEC (Security Testing) §3.2 (Access Control & Authorization)** và **OWASP Top 10 (A01:2021 - Broken Access Control)**: Dữ liệu kiểm thử kiểm soát quyền truy cập phải bao hàm cả trường kiểm chứng giao diện lẫn mã trạng thái phản hồi API (`expectedStatus: 403`). Kiểm thử kiểm soát quyền truy cập bắt buộc phải kiểm tra tính toàn vẹn ở cả tầng giao diện (Client-side UI Guard) và tầng dịch vụ backend (Server-side API Enforcement).
  - **Phân loại nguyên nhân (Bloom-AI):**
    1. `Model limitation`: Lệnh `page.getByText('Đơn hàng')` vi phạm nguyên lý so khớp đơn nhất của Playwright (*Strict Mode Violation*) vì trên Admin Dashboard xuất hiện đồng thời thẻ menu `<li class="...">Đơn hàng</li>` và thẻ thống kê KPI `<h3 class="...">Tổng số đơn hàng</h3>`. AI không nhận diện được quan hệ text substring này.
    2. `Prompt quality` kết hợp `Model limitation`: AI có thiên kiến kiểm thử bề mặt giao diện (UI-only testing bias). AI tin rằng việc form Login hiển thị alert chặn là hệ thống đã an toàn, hoàn toàn bỏ sót việc kiểm tra endpoint REST API `/api/admin/users` chống lại tấn công vượt quyền bằng token người dùng thông thường (*Privilege Escalation*).
- **(5) Bản SV sửa:**
  - Bổ sung trường `expectedStatus: 403` vào `fr12-access-control.json` cho test case bảo mật `TC-FR12-12`.
  - Sửa lỗi Strict Mode: Bổ sung cờ so khớp chuỗi tuyệt đối `{ exact: true }`: `page.getByText(tc.inputs.clickTab, { exact: true }).click()`.
  - Thiết kế thêm kịch bản kiểm thử thâm nhập API `TC-FR12-12`: Sử dụng token của user thường để gửi request trực tiếp `page.request.get('http://localhost:3000/api/admin/users')` và kỳ vọng mã `403 Forbidden`.
  - **Phát hiện lỗ hổng bảo mật nghiêm trọng (BUG-AUTO-04):** Backend SUT tại `server.js:L494` chỉ kiểm tra token hợp lệ bằng `authenticateToken` mà quên kiểm tra vai trò `req.user.role === 'admin'`. Server trả về mã `HTTP 200 OK` để lộ toàn bộ danh sách người dùng và mật khẩu băm của hệ thống.
  - Lập hồ sơ **`BUG-AUTO-04`**, đóng dấu watermark email và tạo GitHub Issue [#118](https://github.com/tthphat/eshop-sut/issues/118).

---

### Artifact A05 — Script Thẩm định Kịch bản Kiểm thử Tự động (`validate_automation.mjs`)

- **(1) Prompt + Công cụ:**
  - *Tool:* Antigravity (Claude 3.7 Sonnet) – 14/11/2026.
  - *Prompt:* "Viết script Node.js `validate_automation.mjs` đặt tại `.agents/skills/playwright-automation-testing/scripts/` để tự động hóa cổng kiểm soát chất lượng (Quality Gate) của HW04: quét kiểm tra 100% data-driven tách biệt, số lượng test case >= 12/feature, độ đa dạng assertion >= 3 patterns/spec, cấu hình 3 trình duyệt, và metadata tác giả 'Run by: 23120319'."
- **(2) Output AI:** Sinh ra 1 file script kiểm định cổng chất lượng (Quality Gate):
  1. File script kiểm định: `.agents/skills/playwright-automation-testing/scripts/validate_automation.mjs`.
  *Nội dung thực thi ban đầu do AI sinh:* Sinh mã nguồn script Node.js quét cấu hình và phân tích mã nguồn Playwright test bằng Regular Expressions để tự động hóa cổng kiểm soát chất lượng (Quality Gate).
- **(3) Đánh giá (Verdict):** `VALID`.
- **(4) Lý do (ISTQB):**
  - Căn cứ **ISTQB FL v4.0 §6.1 (Tool Support for Testing - Static Code Analysis & Test Process Management)** và **ISO/IEC 25010 (Software Product Quality)**: Áp dụng công cụ kiểm thử tĩnh (Static Verification Tool) tự động hóa cổng chất lượng (*Automated Quality Gate*) giúp phát hiện sớm các vi phạm chuẩn kiến trúc trước khi bước vào giai đoạn thực thi động.
  - Script đáp ứng hoàn hảo yêu cầu Đề bài HW04 Mục §13 về Custom Agent Skill và cơ chế tự thẩm định kịch bản (*Self-Validation Mechanism*).
- **(5) Bản SV sửa:**
  - Sinh viên giữ nguyên toàn bộ kiến trúc và logic kiểm định của AI, chỉ kiểm tra lại các biểu thức Regex đối sánh cú pháp Playwright assertion để đảm bảo độ bao phủ.
  - Chạy script kiểm thử thực tế trong CI/terminal: Xác nhận đạt kết quả hoàn hảo **0 Errors, 0 Warnings** (PASS tuyệt đối 100%).

---

### Artifact A06 — Thực thi Toàn diện 108 Runs & Báo cáo Tổng kết (`export_run_summary.mjs`)

- **(1) Prompt + Công cụ:**
  - *Tool:* Antigravity (Gemini 2.5 Flash) – 15/11/2026.
  - *Prompt:* "Cập nhật script `export_run_summary.mjs` đọc file kết quả `results.json` của Playwright, tổng hợp số liệu kiểm thử trên cả 3 trình duyệt (Chromium, Firefox, WebKit) và kết xuất bảng Markdown tổng kết kỹ thuật đưa vào README.md."
- **(2) Output AI:** Sinh ra 1 file script tổng hợp báo cáo kiểm thử:
  1. File script xuất báo cáo: `.agents/skills/playwright-automation-testing/scripts/export_run_summary.mjs`.
  *Nội dung thực thi ban đầu do AI sinh:* Sinh script Node.js hoàn chỉnh đọc file `test-results/results.json` của Playwright, bóc tách cấu trúc kết quả theo ma trận 3 trình duyệt (Chromium, Firefox, WebKit), tính toán chuẩn xác tỷ lệ đạt (Pass Rate) và kết xuất trực tiếp bảng Markdown kỹ thuật đa trình duyệt tương thích chuẩn IEEE 829.
- **(3) Đánh giá (Verdict):** `VALID`.
- **(4) Lý do (ISTQB):**
  - Căn cứ **ISTQB FL v4.0 §5.3 (Test Monitoring and Control)**, **§6.1 (Tool Support for Testing - Test Reporting Tools)** và **IEEE 829 (Test Summary Report Standard)**: Báo cáo kết quả kiểm thử tự động đáp ứng đầy đủ yêu cầu giám sát chất lượng và tổng kết số liệu thực thi (*Test Metrics Accuracy: Passed, Failed, Total Runs, Execution Time*). Script bóc tách dữ liệu JSON chính xác từ cấu trúc báo cáo Playwright, phân định rõ ràng kết quả theo ma trận trình duyệt (Chromium: 32/4, Firefox: 32/4, WebKit: 32/4) và tự động tính toán tỷ lệ Pass Rate đạt **88.9%** ($96/108$ runs).
  - Script đáp ứng hoàn hảo yêu cầu Đề bài HW04 Mục §8 và Mục §11 về cơ chế trích xuất báo cáo tổng kết đa trình duyệt tự động, giảm thiểu sai sót do thao tác thủ công.
- **(5) Bản SV sửa:**
---

### Artifact A07 — Lập Hồ sơ 4 Khiếm khuyết SUT & GitHub Issues (#115 đến #118)

- **(1) Prompt + Công cụ:**
  - *Tool:* Antigravity (Claude 3.7 Sonnet) – 15/11/2026.
  - *Prompt:* "Dựa trên 4 khiếm khuyết phần mềm SUT phát hiện được trong quá trình chạy test Playwright, soạn thảo 4 hồ sơ báo cáo lỗi chi tiết theo chuẩn mực kỹ thuật (Tiền điều kiện, Các bước tái hiện, Thực tế vs Kỳ vọng, Phân tích mã nguồn SUT, Đề xuất vá lỗi) và chuẩn bị nội dung tạo 4 GitHub Issues trên repo nhóm."
- **(2) Output AI:** Sinh ra 5 file hồ sơ khiếm khuyết và tài liệu tổng hợp gồm:
  1. `HW4/report/issues/BUG-AUTO-01-duplicate-email.md`
  2. `HW4/report/issues/BUG-AUTO-02-editable-total-price.md`
  3. `HW4/report/issues/BUG-AUTO-03-cart-not-cleared.md`
  4. `HW4/report/issues/BUG-AUTO-04-broken-access-control.md`
  5. `HW4/report/bugs-summary.md`
- **(3) Đánh giá (Verdict):** `VALID`.
- **(4) Lý do (ISTQB):**
  - Tuân thủ chuẩn **ISTQB FL v4.0 §5.6 (Defect Management)**, **ISO/IEC/IEEE 29119-3 (Incident Report Outline)** và **OWASP Top 10:2021**: Mỗi báo cáo lỗi cung cấp đầy đủ thông tin phân loại mức độ nghiêm trọng (Severity), độ ưu tiên (Priority), các bước tái hiện tối giản (*Minimal Steps to Reproduce*), cô lập nguyên nhân gốc rễ trong mã nguồn (*Root Cause Analysis*), và đối chiếu chéo với các ca kiểm thử tự động thất bại tương ứng.
- **(5) Bản SV sửa:**
  - Sinh viên trực tiếp thẩm tra trên cả 3 trình duyệt, trích xuất log runtime từ console của Express backend và React frontend.
  - Chụp ảnh màn hình minh chứng thực tế, đóng dấu watermark định danh `23120319@student.hcmus.edu.vn`.
  - Tạo 4 issues chính thức trên GitHub repository nhóm:
    + Issue [#115](https://github.com/tthphat/eshop-sut/issues/115): `BUG-AUTO-01` (Backend crash 500 khi trùng email)
    + Issue [#116](https://github.com/tthphat/eshop-sut/issues/116): `BUG-AUTO-02` (Ô tổng tiền cho sửa số âm)
    + Issue [#117](https://github.com/tthphat/eshop-sut/issues/117): `BUG-AUTO-03` (Giỏ hàng không xóa sau thanh toán)
    + Issue [#118](https://github.com/tthphat/eshop-sut/issues/118): `BUG-AUTO-04` (Lỗ hổng Broken Access Control tại `/api/admin/users`)

---

## 5. Tổng kết Độ chính xác AI

Tổng hợp verdict từ Mục 3 & Mục 4 và thống kê vào bảng dưới:

| Chỉ số | Số lượng | Tỉ lệ (%) |
|:---|:---:|:---:|
| **Tổng artifact AI sinh đã audit** | **7** | **100.0%** |
| **VALID (đúng, dùng nguyên hoặc tinh chỉnh nhỏ)** | **4** | **57.1%** |
| **INCOMPLETE (chấp nhận sau khi sinh viên sửa/bổ sung)** | **3** | **42.9%** |
| **INVALID (sai hoàn toàn; loại bỏ)** | **0** | **0.0%** |

---

## 6. Kết luận — Khi nào nên / không nên dùng AI? (148 từ)

> Trong đồ án HW04, em nhận thấy AI mang lại giá trị rất lớn trong việc tăng tốc khởi tạo khung cấu hình Playwright đa trình duyệt, bóc tách cấu trúc 36 test cases sang các tệp dữ liệu Data-Driven JSON, xây dựng script kiểm định cổng chất lượng và trích xuất báo cáo tổng kết kỹ thuật 108 runs. Tuy nhiên, AI bộc lộ các điểm mù kỹ thuật nghiêm trọng: dễ lạm dụng bộ định vị mỏng manh (`getByLabel` thiếu thuộc tính `id/for`), vi phạm nguyên tắc Playwright Strict Mode, suy diễn sai lệch trạng thái lưu trữ của React Context khi điều hướng trang, và bỏ sót các kiểm thử thâm nhập REST API Backend.  
> 
> **Khuyến nghị:** Nên sử dụng AI như một trợ lý lập trình gia tốc sinh mã ban đầu, nhưng tuyệt đối không phó mặc hoàn toàn. Kỹ sư kiểm thử bắt buộc phải trực tiếp thanh tra cấu trúc DOM runtime thực tế, xử lý đồng bộ hóa bất đồng bộ, rà soát lỗ hổng logic nghiệp vụ và giữ vai trò phê duyệt quyết định tối cao (*Human-in-the-Loop*).

---

## 7. Mandatory Disclosure (dán nguyên văn)

> *"Playwright configuration files, data-driven test case JSON datasets, initial Playwright TypeScript test scripts, automated quality gate validation scripts, test summary reporting scripts, and defect report drafts were initially generated with the assistance of AI (Antigravity/Claude Code/Gemini 2.5 Flash); I conducted manual DOM code analysis to replace brittle locators with resilient selectors, fixed Playwright Strict Mode collisions, established Client-side Navigation to preserve React Context state, incorporated active network synchronization (waitForResponse), and extended security penetration test cases to detect Broken Access Control. All 108 test runs across 3 browsers (Chromium, Firefox, WebKit), local runtime services orchestration, failure triaging, root cause analysis in SQLite/Express/React source code, and 4 GitHub issue submissions (#115-#118) with watermarked evidence were conducted directly by me. The detailed AI Audit Report is attached as Appendix A. I confirm I did not use AI to fabricate any test results or execution logs."*

---

### Chữ ký xác nhận của Sinh viên
- **Họ tên sinh viên (in hoa):** TRƯƠNG THÀNH PHÁT  
- **MSSV:** 23120319  
- **Lớp / Khóa:** Kiểm thử phần mềm - CQ2023/3 - Khóa 2023  
- **Môn học:** CS423 / CSC13003 – Kiểm thử phần mềm  
- **Giảng viên:** TS. Trần Duy Hoàng, ThS. Trương Phước Lộc, ThS. Hồ Tuấn Thanh, TS. Lâm Quang Vũ  
- **Ngày:** 15/11/2026  
- **Chữ ký:** *Trương Thành Phát*

---

### Tham khảo
- Kharbach, M. (2026). *AI Use Policy Templates for Higher Education*. CC BY-NC-SA 4.0.
- ISTQB Foundation Level Syllabus (latest version 4.0.1).
- ISTQB Advanced Level Test Automation Engineer (AL-TAE) Syllabus.
- Microsoft Corporation (2026). *Playwright Documentation — Best Practices & Locators*.
- Hardman, P. (2025). *A Post-AI Learning Taxonomy*.
- OWASP Foundation (2021). *OWASP Top 10:2021 — A01: Broken Access Control*.
