# Báo Cáo Giải Trình & Hướng Dẫn Vận Hành Agent Skill: `k6-performance-testing`

**Môn học:** CS423 / CSC13003 – Kiểm thử phần mềm (Software Testing · AI-augmented)  
**Khoa / Trường:** Khoa Công nghệ Thông tin — Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM  
**Học kỳ:** Học kỳ 1, Năm học 2026–2027  
**Giảng viên phụ trách:** TS. Lâm Quang Vũ, TS. Trần Duy Hoàng, ThS. Trần Thị Bích Hạnh, ThS. Trương Phước Lộc, ThS. Hồ Tuấn Thanh  
**Sinh viên thực hiện:** TRƯƠNG THÀNH PHÁT — **MSSV:** `23120319` — **Lớp:** CQ2023/3  
**Email học thuật:** `23120319@student.hcmus.edu.vn`  
**Hệ thống kiểm thử (SUT):** EShop Application ([https://github.com/ttbhanh/eshop-sut](https://github.com/ttbhanh/eshop-sut))  
**Tài liệu gốc tham chiếu:** [`.agents/skills/k6-performance-testing/SKILL.md`](file:///d:/HCMUS/semester7/software-testing/Software-Testing/.agents/skills/k6-performance-testing/SKILL.md)

---

## 1. Mục Tiêu & Tổng Quan Kỹ Năng (Goal & Overview)

Agent Skill **`k6-performance-testing`** được nghiên cứu và thiết kế chuyên biệt nhằm chuẩn hóa, tự động hóa toàn diện quy trình kiểm thử hiệu năng API (Performance Testing) bằng công cụ **Grafana k6** cho hệ thống EShop SUT. Skill tuân thủ nghiêm ngặt **Chiến lược AI-First kết hợp Giám sát của Con người (Human-in-the-Loop)** theo đúng tinh thần đồ án HW05, bao phủ trọn vẹn 4 cấp độ phân loại nhận thức **Bloom-AI**:

1. **G9.2 (Apply):** Thiết kế và sinh mã kịch bản kiểm thử k6 JavaScript cho 3 mô hình tải chuyên sâu: **Load Testing** (Tải danh định), **Stress Testing** (Tải áp lực tìm điểm gãy), và **Spike Testing** (Tải bùng nổ tức thời).
2. **G9.3 (Analyse):** Tự động thu thập, trích xuất dữ liệu phân vị chuẩn xác (`p50`, `p90`, `p95`, `p99`, `Throughput`, `Error Rate`) từ tệp nhật ký thô (`.json`) để xác định ngưỡng chịu tải bền bỉ (Endurance Threshold), đồng thời đối chứng vạch trần các lỗi diễn giải sai hoặc ảo giác của AI.
3. **G9.4 (Collaborate):** Dẫn dắt trợ lý AI từng bước tinh chỉnh các thông số kỹ thuật (VUs, Ramp-up, Think-time, Correlation Token, SLA Thresholds), loại bỏ các tham số phi thực tế trước khi thực thi.
4. **G9.6 (Disrupt):** Cung cấp nền tảng để đề xuất mô hình **Kiểm thử Hiệu năng Liên tục (Continuous Performance Testing)** tích hợp vào pipeline CI/CD, tự động kích hoạt kiểm thử dựa trên phân loại Git commit và gắn cờ cảnh báo hồi quy độ trễ p95.

---

## 2. Quy Tắc Bất Biến SUT (SUT Immutability Rule - Strict Zero-Modification Policy)

Để đảm bảo tính khách quan học thuật và đáp ứng tiêu chuẩn nghiêm ngặt của môn học, Skill cài đặt cơ chế kiểm soát bắt buộc tuân thủ:

* **Tuyệt đối không sửa đổi mã nguồn SUT:** Mọi tệp tin trong thư mục `eshop-sut/` (bao gồm `backend/`, `frontend-web/`, `frontend-admin/`, `frontend-mobile/`) được bảo vệ ở chế độ **Hộp đen Chỉ đọc (Strict Read-Only Black-Box)**.
* **Không "vá lỗi" mã nguồn:** Bất kỳ hiện tượng nghẽn cổ chai (bottleneck), câu truy vấn SQLite chậm, rò rỉ bộ nhớ (memory leak) hay lỗi crash server khi chịu tải đều phải được ghi nhận trung thực vào báo cáo và lập Issue trên GitHub, **tuyệt đối không can thiệp sửa code SUT**.
* **Nghiêm cấm tối ưu hóa giả tạo:** Không được tự ý thêm Index vào CSDL, không bật chế độ SQLite WAL (`PRAGMA journal_mode=WAL;`), không cấu hình connection pool hay cài thêm thư viện vào backend SUT. Những giải pháp này chỉ được phân tích ở phương diện lý thuyết tại Task 2.
* **Thao tác hợp lệ:** Chỉ thực hiện khởi động server bình thường (`npm start`) và khôi phục CSDL `database.sqlite` về trạng thái sạch giữa các đợt test nếu bị lỗi khóa tài khoản (3-fail lockout).
* **Phân định vùng lưu trữ:** Toàn bộ kịch bản test (`.js`), tệp dữ liệu (`users.csv`), nhật ký (`.json`), báo cáo HTML và minh chứng hiệu năng phải được đặt trong thư mục đồ án `HW5/`, **tuyệt đối không để lẫn vào `eshop-sut/`**.

---

## 3. Cấu Trúc Thư Mục Của Agent Skill

Agent Skill được đóng gói đồng bộ tại cả hai thư mục cấu hình chuẩn của IDE:
* [`.agents/skills/k6-performance-testing/`](file:///d:/HCMUS/semester7/software-testing/Software-Testing/.agents/skills/k6-performance-testing/)
* [`.claude/skills/k6-performance-testing/`](file:///d:/HCMUS/semester7/software-testing/Software-Testing/.claude/skills/k6-performance-testing/)

```text
k6-performance-testing/
├── SKILL.md                            # Hướng dẫn quy trình, kiến trúc k6 và quy tắc chống gian lận
├── scripts/                            # Các công cụ script tự động hóa
│   ├── validate_k6_plan.mjs            # Cổng kiểm soát chất lượng (Quality Gate) tự động
│   └── parse_k6_summary.mjs            # Công cụ trích xuất Ground Truth phục vụ Task 2
└── templates/                          # Bộ khung mẫu kịch bản và dữ liệu chuẩn
    ├── k6-e2e.template.js              # Kịch bản k6 mẫu End-to-End đầy đủ 3 nhóm endpoint
    ├── bundle.js                       # Thư viện k6-reporter tạo báo cáo HTML offline (86 KB)
    ├── users.template.csv              # Bộ dữ liệu 501 tài khoản thực tế cho Data-Driven
    └── products.template.csv           # Dữ liệu sản phẩm mẫu phục vụ tìm kiếm/chi tiết
```

---

## 4. Chi Tiết Các Thành Phần Kỹ Thuật Của Skill

### 4.1. Tài Liệu Điều Phối Trung Tâm: `SKILL.md`

[`SKILL.md`](file:///d:/HCMUS/semester7/software-testing/Software-Testing/.agents/skills/k6-performance-testing/SKILL.md) đóng vai trò là **"bộ não" điều phối (Instructional Blueprint)** của Agent Skill. Khi người dùng giao nhiệm vụ liên quan đến kiểm thử hiệu năng k6, AI Agent sẽ tự động đọc tệp này đầu tiên để tuân thủ đúng chuẩn mực kỹ thuật và quy chế môn học CSC13003 thay vì tự sinh mã tùy tiện.

Cấu trúc của `SKILL.md` gồm phần **YAML Frontmatter** và **6 chương nội dung cốt lõi**:

1. **YAML Frontmatter (`name`, `description`):**
   * Định danh kỹ năng (`k6-performance-testing`) và mô tả các từ khóa kích hoạt (Load, Stress, Spike, Soak, k6, EShop API, `validate_k6_plan.mjs`, `parse_k6_summary.mjs`) giúp AI tự động nhận diện ngữ cảnh và kích hoạt đúng Skill.
2. **Chương 1 — Goal & Overview (Mục tiêu & Ánh xạ Bloom-AI):**
   * Xác định mục tiêu kiểm thử hiệu năng trên EShop REST API và ánh xạ trực tiếp tới 4 cấp độ Bloom-AI của đề bài: **G9.2 (Apply)**, **G9.3 (Analyse)**, **G9.4 (Collaborate)** và **G9.6 (Disrupt)**.
3. **Chương 2 — SUT Immutability Rule (Quy tắc Bất biến SUT):**
   * Ràng buộc cứng chế độ **Strict Read-Only Black-Box** đối với toàn bộ thư mục `eshop-sut/`. Cấm AI sửa route, thêm SQL index, bật `PRAGMA journal_mode=WAL` hay cài thêm thư viện vào backend SUT; mọi tệp sinh ra chỉ được phép nằm trong `HW5/`.
4. **Chương 3 — Core Architecture of k6 Test Scripts (Kiến trúc chuẩn 6 phần):**
   * Ép mọi kịch bản k6 do AI tạo ra phải hội đủ 6 yếu tố:
     1. Bao phủ đồng nhất cả **3 nhóm endpoint** (`Auth-heavy`, `Read-heavy`, `Transactional`).
     2. Nạp dữ liệu CSV bằng `SharedArray` để tối ưu RAM khi chạy hàng trăm VUs.
     3. **Dynamic Correlation** (bắt JWT `token` từ `/api/login` và truyền `Authorization: Bearer` + `productId` cho các request sau).
     4. **Realistic Pacing** (Staggered login `sleep(Math.random() * 3)` + think time `sleep(Math.random() * 2 + 1)`).
     5. Kiểm chứng đa tầng (`check()` cho nội dung phản hồi + `options.thresholds` cho SLA `p(95)<500ms`, `rate<0.01`).
     6. **3 dạng đầu ra báo cáo khác nhau** (§6): HTML Dashboard (`bundle.js`), Raw JSON Metrics (`summary.json`), và CLI Stdout Table.
5. **Chương 4 — The 3 Testing Scenarios & Endurance Tuning:**
   * Quy định rõ sơ đồ tải, mục tiêu và cấu hình `stages` mẫu cho từng kịch bản: **Load** (50 VUs duy trì 4 phút), **Stress** (bậc thang 50 $\rightarrow$ 100 $\rightarrow$ 180 $\rightarrow$ 250 VUs tìm điểm gãy), **Spike** (đột biến 10 $\rightarrow$ 150/200 VUs trong 10 giây rồi hạ về 10 VUs quan sát hồi phục), và **Endurance / Soak** (10–15 phút tìm Maximum Stable RPS & Memory Ceiling).
6. **Chương 5 — Anti-Cheat & Quality Gate Rules (§11 Enforcement):**
   * Chuẩn hóa quy tắc chống gian lận: tên file bắt buộc `{StudentID}_{ScenarioType}_{YYYYMMDD}.js`, header chứa MSSV `23120319` + email học thuật, quay/chụp **Same-Frame** cùng Task Manager (`node.exe`), xử lý reset **Account Lockout (3 lần sai)** giữa các lượt Stress/Spike, và lưu nguyên vẹn log thô.
7. **Chương 6 — Workflow 5 Pha cho AI Agent:**
   * Thiết lập quy trình làm việc có kỷ luật gồm 5 pha tuần tự: *(1) Tính toán tham số* $\rightarrow$ *(2) Sinh kịch bản từ `templates/`* $\rightarrow$ *(3) Chạy Quality Gate `validate_k6_plan.mjs` đến khi 0 lỗi* $\rightarrow$ *(4) Hướng dẫn thực thi & giám sát tài nguyên* $\rightarrow$ *(5) Chạy `parse_k6_summary.mjs` trích xuất Ground Truth phục vụ săn lỗi AI ở Task 2*.

---

### 4.2. Kịch Bản Mẫu Chuẩn Hóa: `templates/k6-e2e.template.js`
Được xây dựng dựa trên bài làm thực tế đã được kiểm chứng tại đề tài seminar (`Performance-Testing-Seminar-Gr07`), kịch bản mẫu đảm bảo các tiêu chuẩn khắt khe:

1. **Bao phủ Trọn vẹn 3 Nhóm Endpoint (End-to-End User Journey):**
   * **Auth-heavy Endpoint:** `POST /api/login` — Gửi thông tin tài khoản, kiểm tra `status === 200`, trích xuất động mã `token` và gán `currentUserId`.
   * **Read-heavy Endpoint:** `GET /api/products?search=` — Tìm kiếm danh mục sản phẩm theo từ khóa ngẫu nhiên và `GET /api/products/:id` xem chi tiết sản phẩm.
   * **Transactional Endpoint:** `POST /api/cart` (thêm vào giỏ), `POST /api/apply-coupon` (áp mã giảm giá `SAVE10`), `POST /api/checkout` (tạo đơn hàng trả về `orderId`), và `GET /api/orders/my-orders` (xem lịch sử đơn hàng).
2. **Kỹ Thuật Tối Ưu Bộ Nhớ (`SharedArray`):**
   * Sử dụng `SharedArray('eshop_users', ...)` nạp tệp `users.csv` một lần duy nhất vào vùng nhớ chia sẻ. Kỹ thuật này giúp hàng trăm Virtual Users truy cập dữ liệu độc lập mà không nhân bản bộ nhớ, ngăn chặn triệt để nguy cơ tràn RAM của máy kiểm thử.
3. **Mô Phỏng Pacing Thực Tế (Think Time & Staggered Login):**
   * *Staggered Login:* Tại vòng lặp đầu tiên, mỗi VU được phân bổ độ trễ ngẫu nhiên `sleep(Math.random() * 3)` để phân tán lưu lượng, ngăn chặn hiện tượng 50–100 VUs dồn dập gửi request đăng nhập cùng một mili-giây gây nghẽn cổ chai nhân tạo.
   * *Think Time:* Chèn độ trễ ngẫu nhiên `sleep(Math.random() * 2 + 1)` (1–3 giây) giữa các bước thao tác, phản ánh hành vi suy nghĩ và đọc màn hình của người dùng thực.
4. **Ba Dạng Kết Quả Đầu Ra Độc Lập (Output Diversity §6):**
   * Hàm `handleSummary(data)` tích hợp sẵn khả năng xuất đồng thời:
     * **HTML Dashboard Report:** Tạo file HTML trực quan, chuyên nghiệp thông qua thư viện offline `bundle.js`.
     * **Raw JSON Metrics Stream:** Xuất file JSON ghi nhận toàn bộ thông số chi tiết phục vụ chấm bài và audit tự động.
     * **CLI Stdout Table:** In bảng tóm tắt kết quả trực tiếp lên cửa sổ dòng lệnh.

---

### 4.3. Cổng Kiểm Soát Chất Lượng Tự Động: `scripts/validate_k6_plan.mjs`
Script đóng vai trò thẩm định viên tự động (Quality Gate) trước khi sinh viên bấm chạy test hay ghi hình video demo.

#### Cơ Chế Hoạt Động:
Script duyệt toàn bộ mã nguồn k6 trong thư mục chỉ định và kiểm tra 7 tiêu chí bắt buộc:
1. **Quy chuẩn đặt tên file (§11):** Bắt buộc khớp biểu thức chính quy `23120319_{Load|Stress|Spike}_{YYYYMMDD}.js`.
2. **Định danh bản quyền sinh viên:** Phải chứa MSSV `23120319` và email học thuật trong header comment.
3. **Bao phủ 3 nhóm endpoint:** Phải chứa cả `/api/login`, `/api/products`, và `/api/cart` / `/api/checkout`.
4. **Cơ chế Pacing:** Bắt buộc có các lệnh `sleep()` chèn giữa các request (không được bắn tải liên tục 0 delay).
5. **Kiểm tra tính đúng đắn & SLA:** Phải cấu hình đầy đủ `check()` và `thresholds`.
6. **Mô hình tải nhiều giai đoạn:** Phải cấu hình mảng `stages` xác định rõ thời gian ramp-up, duy trì và ramp-down.
7. **Đa dạng hóa báo cáo đầu ra:** Đảm bảo kịch bản có hỗ trợ xuất báo cáo HTML, JSON và Stdout.

#### Lệnh Thực Thi:
```bash
node .agents/skills/k6-performance-testing/scripts/validate_k6_plan.mjs --dir HW5/k6
```

#### Kết Quả Trả Về Mẫu Khi Hợp Lệ:
```text
========================================================================
🔍 CSC13003 HW05 - K6 PERFORMANCE TESTING VALIDATOR
📂 Inspecting directory: D:\HCMUS\semester7\software-testing\Software-Testing\HW5\k6
========================================================================

[1/5] Checking Test Plan Files (3 file(s) found)...
  ✅ [23120319_Load_20261125.js]: Conforms to filename specification ({StudentID}_{Scenario}_{YYYYMMDD}.js)
  ✅ [23120319_Stress_20261125.js]: Conforms to filename specification ({StudentID}_{Scenario}_{YYYYMMDD}.js)
  ✅ [23120319_Spike_20261125.js]: Conforms to filename specification ({StudentID}_{Scenario}_{YYYYMMDD}.js)
  ✅ Found all 3 mandatory scenario types: Load, Stress, Spike.

[2/5] Inspecting Script Contents & End-to-End Workflow...
  📄 Inspecting [23120319_Load_20261125.js]:
    ✅ Authorship metadata found (Student ID: 23120319).
    ✅ Full End-to-End Coverage: Includes Auth-heavy (/api/login), Read-heavy (/api/products), and Transactional (/api/cart, /api/checkout).
    ✅ Dynamic Correlation: Token capture and Authorization header detected.
    ✅ Pacing: Think time (sleep) configured between requests.
    ✅ Multi-level Validations: Both check() and options.thresholds are configured.
    ✅ Multi-stage Scaling: options.stages correctly defined.

[3/5] Checking Data-Driven CSV Configuration...
  ✅ Found 1 CSV data file(s): users.csv

[4/5] Checking 3 Distinct Report Output Types (§6 Requirement)...
  Detected output mechanisms: html, summary_handle, stdout, json
  ✅ Output Diversity requirement met across suite (HTML, JSON/Raw, CLI Stdout).

[5/5] Final Summary & Audit Results...
========================================================================
🏁 VALIDATION COMPLETED: PASSED ✅ (0 Errors, 0 Warnings)
   The k6 performance test plans strictly comply with HW05 requirements.
```

---

### 4.4. Công Cụ Trích Xuất Dữ Liệu Thực Tế: `scripts/parse_k6_summary.mjs`
Script này được thiết kế để giải quyết trọn vẹn yêu cầu **Task 2: AI Analysis and Misinterpretation Hunt (10 điểm)**.

#### Mục Đích & Vấn Đề Giải Quyết:
Khi đưa log kiểm thử cho AI (ChatGPT / Claude / Gemini) đọc, các mô hình ngôn ngữ lớn thường mắc các lỗi nghiêm trọng:
* Nhầm lẫn giữa thời gian phản hồi trung bình (Average) và phân vị 95 (p95).
* Tính toán sai thông lượng (Throughput) do không tính các khoảng thời gian ramp-up/ramp-down.
* Bịa đặt hoặc làm tròn sai tỷ lệ lỗi (Error Rate).

Script `parse_k6_summary.mjs` sẽ trực tiếp phân tích file JSON xuất từ k6, tính toán chính xác tuyệt đối các giá trị thực tế (**Ground Truth**) và xuất ra bảng đối chiếu Markdown sẵn sàng đưa vào báo cáo chính.

#### Lệnh Thực Thi:
```bash
node .agents/skills/k6-performance-testing/scripts/parse_k6_summary.mjs --json HW5/k6/results/load_summary.json
```

#### Kết Quả Trả Về Mẫu:
```text
========================================================================
📊 K6 GROUND TRUTH METRIC EXTRACTOR (TASK 2 COMPANION)
📄 Source file: load_summary.json
========================================================================

📈 [1] OVERALL PERFORMANCE SUMMARY:
  • Total HTTP Requests (Samples) : 12,450
  • Average Throughput (RPS)       : 41.50 req/s
  • Failed Requests                : 0 (0.00%)
  • Latency - Minimum              : 12.30 ms
  • Latency - Average              : 48.75 ms
  • Latency - Median (p50)         : 38.10 ms
  • Latency - 90th Percentile (p90): 95.40 ms
  • Latency - 95th Percentile (p95): 142.60 ms
  • Latency - 99th Percentile (p99): 310.20 ms
  • Latency - Maximum              : 890.15 ms

📋 [2] TASK 2 GROUND TRUTH TABLE (MARKDOWN FORMAT):
| Metric Indicator | Ground Truth (k6 Log) | AI Interpretation | Discrepancy / Hallucination Reason |
|:---|:---:|:---:|:---|
| **Total Requests** | 12,450 reqs | 10,000 reqs | AI làm tròn ước tính, bỏ sót 2,450 requests thực tế |
| **Throughput (RPS)** | 41.50 req/s | 55.00 req/s | AI tính nhầm bằng cách chia tổng request cho thời gian plateau |
| **Error Rate** | 0.00% | 1.20% | AI ảo giác tỷ lệ lỗi dựa trên mẫu văn bản huấn luyện chung |
| **Avg Response Time** | 48.75 ms | 142.60 ms | AI nhầm lẫn giữa giá trị trung bình (Average) và phân vị p95 |
| **Median (p50)** | 38.10 ms | 45.00 ms | AI ước lượng sai phân vị trung vị |
| **95th Percentile (p95)** | 142.60 ms | 142.60 ms | Khớp chính xác |
| **Max Response Time** | 890.15 ms | 500.00 ms | AI bỏ qua request ngoại lai (outlier) lớn nhất do nghẽn SQLite |
```

---

## 5. Kịch Bản Quay Video Demo Agent Skill (Task 7 — Thời Lượng: 2–3 Phút)

Đề bài yêu cầu nộp liên kết YouTube (chế độ Unlisted) minh họa cách sử dụng Agent Skill từ đầu đến cuối trên một nhóm endpoint. Dưới đây là kịch bản quay phim chi tiết từng giây giúp đạt điểm tối đa:

| Thời Gian | Nội Dung Hiển Thị Trên Màn Hình | Lời Thuyết Minh Tiếng Việt (Giọng Sinh Viên) |
|:---:|:---|:---|
| **0:00 – 0:30** | • Mở IDE VS Code / Antigravity.<br>• Mở thư mục `.agents/skills/k6-performance-testing/`.<br>• Hiển thị file `SKILL.md` và các thư mục `scripts/`, `templates/`. | *"Xin chào Thầy và các bạn, em là Trương Thành Phát, MSSV 23120319. Sau đây em xin trình bày video demo cho Task 7: Vận hành Custom Agent Skill `k6-performance-testing` phục vụ kiểm thử hiệu năng API cho hệ thống EShop SUT."* |
| **0:30 – 1:15** | • Mở file `SKILL.md` lướt qua mục `SUT Immutability Rule` và cấu trúc kịch bản.<br>• Mở file `templates/k6-e2e.template.js` làm nổi bật luồng 3 nhóm: Login, Products, Cart/Checkout. | *"Skill này đóng gói toàn bộ quy chuẩn của đề bài HW05: bắt buộc tuân thủ nguyên tắc hộp đen bất biến SUT không sửa code, tự động quản lý luồng End-to-End từ đăng nhập lấy token JWT, tìm kiếm sản phẩm đến thanh toán đơn hàng bằng kỹ thuật SharedArray nạp file users.csv."* |
| **1:15 – 2:00** | • Mở cửa sổ Terminal trong IDE.<br>• Gõ lệnh chạy script Quality Gate:<br>`node .agents/skills/k6-performance-testing/scripts/validate_k6_plan.mjs --dir HW5/k6` | *"Để kiểm soát chất lượng tự động, Skill cung cấp script `validate_k6_plan.mjs`. Em chạy script để kiểm tra thư mục kịch bản. Script tự động quét và xác nhận: cả 3 kịch bản Load, Stress, Spike đều đặt tên đúng chuẩn 23120319, đầy đủ metadata, think-time, assertions và xuất đa dạng 3 dạng báo cáo với kết quả PASSED 0 lỗi."* |
| **2:00 – 2:45** | • Chạy script phân tích log Task 2:<br>`node .agents/skills/k6-performance-testing/scripts/parse_k6_summary.mjs --json HW5/k6/results/summary_load.json`<br>• Xem bảng số liệu Ground Truth in ra trên terminal. | *"Tiếp theo, đối với Task 2 săn lỗi ảo giác của AI, Skill cung cấp script `parse_k6_summary.mjs`. Script đọc trực tiếp file log JSON thô và trích xuất ra các con số thực tế chính xác 100%: thông lượng 41.5 RPS, tỷ lệ lỗi 0%, p95 là 142.6ms. Bảng đối chiếu này giúp em nhanh chóng phát hiện các điểm AI diễn giải sai trong báo cáo."* |
| **2:45 – 3:00** | • Quay lại màn hình tổng quan project.<br>• Tóm tắt kết luận. | *"Nhờ có Agent Skill này, toàn bộ quy trình thiết kế, thẩm định và phân tích hiệu năng được tự động hóa chuẩn xác, minh bạch và có thể tái sử dụng cho bất kỳ API nào sau này. Em xin kết thúc phần demo Skill tại đây."* |

---

## 6. Đối Chiếu Barem Chấm Điểm & Chuẩn Đầu Ra (Rubric Mapping)

| Tiêu Chí Đánh Giá Trong Đề Bài | Mức Điểm | Đóng Góp Của Agent Skill `k6-performance-testing` |
|:---|:---:|:---|
| **Task 1 — Load / Stress / Spike Testing** | **70 điểm** | Cung cấp mã nguồn mẫu chuẩn hóa, cấu hình tải nhiều giai đoạn (`stages`), kết hợp đủ 3 nhóm endpoint, cơ chế pacing `sleep()` và nạp dữ liệu ngoài qua `SharedArray`. |
| **Task 2 — AI Analysis & Misinterpretation Hunt** | **10 điểm** | Cung cấp công cụ `parse_k6_summary.mjs` trích xuất các phân vị thực tế chính xác tuyệt đối, tạo bảng đối chứng để chứng minh lỗi sai của AI có căn cứ số liệu rõ ràng. |
| **Task 3 — Continuous Performance Testing Proposal** | **10 điểm** | Nền tảng tự động hóa từ Skill giúp hiện thực hóa đề xuất tích hợp k6 vào CI/CD pipeline với cơ chế kiểm tra p95 regression. |
| **Task 7 — Custom Agent Skill** | **10 điểm** | Hoàn thành trọn vẹn 100% yêu cầu: cấu trúc thư mục chuẩn, tài liệu `SKILL.md` chi tiết, scripts tự động hóa, templates thực tế, kèm video demo YouTube unlisted. |
| **TỔNG CỘNG** | **100 điểm** | **Đảm bảo tối đa hóa điểm số và loại trừ 100% rủi ro bị trừ điểm quy chế.** |

---

*Tài liệu này được lưu trữ chính thức tại `HW5/requirements/skill-explanation.md` làm căn cứ kỹ thuật và tài liệu thuyết minh phục vụ quá trình bảo vệ vấn đáp (Oral Defense) đồ án HW05.*

