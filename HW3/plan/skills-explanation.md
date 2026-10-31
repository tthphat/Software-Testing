# Báo cáo Giải trình Kiến trúc và Nguồn gốc Bộ Agent Skills (HW03)

Tài liệu này giải trình chi tiết về kiến trúc, mục đích thiết kế, các thành phần công cụ và nguồn gốc căn cứ (từ Đề bài HW03 và Slide bài giảng CSC13003 S13) của **trọn bộ 3 Agent Skills** được xây dựng phục vụ bài tập **HW03 – GUI & Usability Testing**.

---

## 1. Tổng quan Bộ Agent Skills và Ma trận Đối chiếu Yêu cầu

| STT | Tên Skill | Thư mục lưu trữ | Ánh xạ Task đề bài | Căn cứ Đề bài (HW03 Spec) | Căn cứ Bài giảng (Slide S13) |
|:---:|:---|:---|:---:|:---|:---|
| 1 | **`gui-checklist-testing`** | `.claude/skills/gui-checklist-testing/`<br>`.agents/skills/gui-checklist-testing/` | **Task 1: Checklist GUI** (30đ) | • §4 Pool D & Khía cạnh giao diện (IA-01..04)<br>• §6 Task 1 (Checklist > 40 mục, AI Gap)<br>• §7 Agent Skill<br>• §14 File Excel checklist & Bug report | • Slide 6: Common GUI elements<br>• Slide 7-9: Purpose & Visual consistency<br>• Slide 11-14: 14 nhóm Common GUI bugs<br>• Slide 15-18: Checklist & Navigation testing<br>• Slide 28: Manual vs Automated |
| 2 | **`usability-evaluation`** | `.claude/skills/usability-evaluation/`<br>`.agents/skills/usability-evaluation/` | **Task 2: Đánh giá Usability** (40đ) | • §5 Phạm vi: Luồng End-to-End<br>• §6 Task 2: 3 giai đoạn, 7 người thật<br>• §6 Task 2: SUS + 4 câu hỏi probe<br>• §11 Chống gian lận: Thông tin 7 người | • Slide 30-31: 6 Basic components<br>• Slide 38: Typical test plan format<br>• Slide 39-40: 4 Thành phần Task Scenario<br>• Slide 42-44: Performance vs Preference data<br>• Slide 48-50: Phân tích số liệu & Criticality |
| 3 | **`cross-platform-gui-testing`** | `.claude/skills/cross-platform-gui-testing/`<br>`.agents/skills/cross-platform-gui-testing/` | **Task 3: Đa nền tảng** (20đ) | • §6 Task 3: $\ge 3$ nền tảng (Expo Go hợp lệ)<br>• §6 Task 3: Watermark email sinh viên<br>• §11 Chống gian lận ảnh chụp màn hình | • Slide 7: Visual consistency across devices<br>• Slide 15, 21: Compatibility & Platform testing<br>• Slide 22: Challenges: Diverse platforms/devices |

---

## 2. Chi tiết Skill 1: `gui-checklist-testing`

### 2.1. Mục đích thiết kế
Tự động hóa và chuẩn hóa quy trình thiết kế, phản biện, thực thi và báo cáo lỗi cho **Checklist kiểm thử giao diện người dùng** đạt quy mô **hơn 40 mục** trên hệ thống EShop SUT.

### 2.2. Căn cứ từ Đề bài HW03 (`HW03_GUI_Usability_VI.md`)
1. **Khái niệm 4 Khía cạnh Giao diện (Interface Aspect - IA)** (§4, dòng 73–81):
   - Đề bài quy định rõ kiểm thử GUI không đánh số theo FR mà chia theo 4 nhóm khía cạnh:
     - `IA-01`: Chuẩn UI chung
     - `IA-02`: Form (biểu mẫu)
     - `IA-03`: Điều hướng
     - `IA-04`: Phản hồi / trạng thái
   - *Áp dụng trong Skill*: Cấu trúc bảng checklist và mã định danh (`CHK-IA01-xx`, `CHK-IA02-xx`...) được phân loại bắt buộc theo 4 nhóm này.
2. **Quy mô và Quy trình Human-in-the-Loop** (§6 Task 1, dòng 96–102):
   - Yêu cầu checklist phải có **hơn 40 mục**.
   - Dùng AI sinh bộ mục ban đầu $\rightarrow$ Người kiểm thử review phản biện và bổ sung các mục AI bỏ sót.
   - Bắt buộc giải thích **vì sao AI bỏ sót** theo 3 nguyên nhân cốt lõi (`Prompt/input quality`, `Model limitation`, `Inherent UI complexity`).
   - Thực thi checklist đánh dấu `Passed` / `Failed`, có cột `Notes` giải thích lý do thất bại. **Chỉ chụp ảnh màn hình cho các mục Failed**.
   - Báo cáo bug cả trên Markdown và GitHub Issues kèm ảnh chụp bằng chứng.

### 2.3. Căn cứ từ Slide bài giảng (`S13_GUI Testing & Usability Testing.pdf`)
1. **Phạm vi kiểm thử Low-Level Checklist & Navigation (Slide 15, 16, 17, 18)**:
   - *Slide 16 (Checklist testing)*: Định nghĩa các thành phần của **IA-01**: GUI standards, Color scheme, Typography, Layout and alignment, Labels, Error messages.
   - *Slide 17, 18 (Navigation testing)*: Định nghĩa các thành phần của **IA-03**: Main Menu Navigation, Breadcrumb Navigation, Links and Buttons, Form Navigation (Tab order, focus order).
2. **Danh mục 14 nhóm lỗi GUI phổ biến (Slide 11, 12, 13, 14)**:
   - Toàn bộ tiêu chí kiểm tra trong template checklist được xây dựng trực tiếp từ các lỗi kinh điển trong slide:
     - *Slide 11*: Data validation, Incorrect field default, Mishandling of server process failures, Mandatory fields not mandatory, Wrong fields retrieved by queries.
     - *Slide 12*: Incorrect search criteria, Field order, Multiple database rows returned, Currency of data on screens, Window object/DB field correspondence.
     - *Slide 13*: Correct window modality, Window system commands not available/don't work, Control state alignment with state of data, Focus on objects needing it.
     - *Slide 14*: Menu options align with state of data, Action of menu commands aligns with state of data, Synchronization of window object content, State of controls aligns with state of data.

### 2.4. Các tệp thành phần đã tạo trong Skill
- **[SKILL.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/.claude/skills/gui-checklist-testing/SKILL.md)**: Hướng dẫn quy trình 5 giai đoạn (Discovery $\rightarrow$ AI Baseline $\rightarrow$ Human Review & AI Gap Analysis $\rightarrow$ Execution $\rightarrow$ Bug Logging).
- **[templates/checklist-template.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/.claude/skills/gui-checklist-testing/templates/checklist-template.md)**: Mẫu bảng checklist chuẩn 10 cột, tích hợp đầy đủ tiêu chí cho cả 4 khía cạnh IA-01..IA-04.
- **[templates/ai-gap-analysis-template.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/.claude/skills/gui-checklist-testing/templates/ai-gap-analysis-template.md)**: Mẫu bảng phân tích chi tiết các mục AI bỏ sót (WCAG contrast, text truncation tiếng Việt, bàn phím ảo che khuất nút trên mobile, focus trap modal, double-click race condition).
- **[scripts/validate_checklist.mjs](file:///d:/HCMUS/semester7/software-testing/Software-Testing/.claude/skills/gui-checklist-testing/scripts/validate_checklist.mjs)**: Script tự động phân tích file markdown checklist, đếm tổng số mục ($\ge 40$), kiểm tra độ phủ 4 khía cạnh IA, đếm tỷ lệ Pass/Fail, và cảnh báo các mục Failed thiếu cột Notes.

---

## 3. Chi tiết Skill 2: `usability-evaluation`

### 3.1. Mục đích thiết kế
Đóng gói phương pháp luận và công cụ thực thi **Đánh giá tính khả dụng có người điều phối (Moderated Usability Evaluation)** trên 1 luồng End-to-End với **7 người dùng thật** ngoài lớp, đo lường thang đo SUS chuẩn mực và phân tích phát hiện UX.

### 3.2. Căn cứ từ Đề bài HW03 (`HW03_GUI_Usability_VI.md`)
1. **Phạm vi & Người tham gia** (§5 & §6 Task 2, dòng 88–130):
   - Chọn 1 luồng end-to-end duy nhất (ví dụ: Tìm sản phẩm $\rightarrow$ Thêm giỏ hàng $\rightarrow$ Áp dụng coupon $\rightarrow$ Thanh toán).
   - Tuyển **7 người tham gia thật** ngoài lớp, ưu tiên non-IT/không phải tester, thông tin liên hệ xác minh được (che 4 số giữa SĐT/Zalo).
   - Chạy 1 phiên thử nghiệm (pilot) trước khi chạy 7 phiên chính thức.
   - Có thể bị TA gọi ngẫu nhiên 2 người để xác minh (§6 dòng 129 & §11 dòng 175).
2. **Kịch bản nhiệm vụ & Công cụ đo lường** (§6 Task 2, Giai đoạn 1):
   - Viết kịch bản nhiệm vụ hướng mục tiêu (goal-oriented, đưa mục tiêu thực tế, không chỉ từng bước click).
   - Thang đo định lượng: Thang đo chuẩn **SUS (System Usability Scale)** 10 câu.
   - Bộ 4 câu hỏi thăm dò mở (Open Probes) bắt buộc:
     1. **Tính rõ ràng (Clarity)**
     2. **Khôi phục lỗi (Error recovery)**
     3. **Tốc độ (Speed)**
     4. **Sự tin cậy (Trust)**
3. **Quy trình điều phối & Báo cáo** (§6 Task 2, Giai đoạn 2 & 3):
   - Dàn dựng bối cảnh: "Kiểm thử phần mềm, không kiểm thử người dùng", khuyến khích nói to suy nghĩ (Think-Aloud).
   - Quan sát trung lập, không can thiệp dẫn dắt.
   - Tính điểm SUS 7 người, phân loại lỗi đơn lẻ vs lỗi hệ thống, ma trận mức độ nghiêm trọng, log bug lên Markdown & GitHub Issues.

### 3.3. Căn cứ từ Slide bài giảng (`S13_GUI Testing & Usability Testing.pdf`)
1. **6 Thành phần cơ bản của Usability Testing (Slide 30, 31)**:
   - *Slide 30*: Định nghĩa kiểm thử khả dụng với người dùng đại diện (representative target population) và tiêu chí cụ thể.
   - *Slide 31*: 6 bước cấu thành: (1) Problem statements & test plans $\rightarrow$ (2) Representative sample $\rightarrow$ (3) Actual work environment $\rightarrow$ (4) Observation $\rightarrow$ (5) Quantitative & qualitative measurements $\rightarrow$ (6) Analysis & recommendations.
2. **Cấu trúc Kế hoạch & Kịch bản nhiệm vụ chuẩn (Slide 38, 39, 40)**:
   - *Slide 38 (Typical test plan format)*: Định hình cấu trúc kế hoạch gồm Mục đích, Problem statement, Nhiệm vụ, Hồ sơ người dùng, Phương pháp quan sát, Thiết bị, Vai trò người điều phối, Tiêu chí đánh giá, Báo cáo.
   - *Slide 39 (Task selection)*: Hướng mục tiêu (Focus on user view, NOT components/details), cụ thể và đo lường được.
   - *Slide 40 (Task components table)*: Quy định đúng **4 thành phần nhiệm vụ**:
     $$\text{Task Scenario} = \text{Task} + \text{Machine state} + \text{Successful completion criteria} + \text{Benchmark}$$
     $\rightarrow$ Cấu trúc này được đưa nguyên bản vào `templates/task-scenario-template.md`.
3. **Thu thập dữ liệu Hiệu năng & Sở thích (Slide 42, 43, 44)**:
   - *Slide 43 (Performance data - Khách quan)*: Thời gian hoàn thành, tỷ lệ thành công, số lỗi thao tác, thời gian phản hồi hệ thống.
   - *Slide 44 (Preference data - Chủ quan)*: Thang đo Likert 5 mức độ (Thang đo nền tảng của bảng câu hỏi SUS).
4. **Phân tích số liệu và Đánh giá mức độ nghiêm trọng (Slide 48, 49, 50)**:
   - *Slide 48 (Summarizing performance)*: Tính toán thời gian trung bình (Mean), trung vị (Median), độ lệch chuẩn (Standard deviation), tỷ lệ hoàn thành (Task accuracy %).
   - *Slide 50 (Analyzing Data)*: Nhận diện lỗi người dùng, tìm nguồn gốc lỗi, phân cấp mức độ ưu tiên:
     $$\text{Criticality} = \text{Severity} \times \text{Probability}$$

### 3.4. Các tệp thành phần đã tạo trong Skill
- **[SKILL.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/.claude/skills/usability-evaluation/SKILL.md)**: Quy trình trọn gói 3 Phase từ lập kế hoạch, kịch bản người điều phối (Moderator Guide) đến phân tích định lượng & định tính.
- **[templates/task-scenario-template.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/.claude/skills/usability-evaluation/templates/task-scenario-template.md)**: Mẫu kịch bản nhiệm vụ 4 thành phần (Task, Machine state, Success criteria, Benchmark 120s) kèm lời thoại mẫu cho người điều phối.
- **[templates/sus-questionnaire-template.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/.claude/skills/usability-evaluation/templates/sus-questionnaire-template.md)**: Phiếu khảo sát chuẩn SUS 10 câu Likert song ngữ Anh-Việt kèm công thức quy đổi điểm và 4 câu hỏi probe mở (Rõ ràng, Phục hồi lỗi, Tốc độ, Tin cậy).
- **[templates/observation-notes-template.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/.claude/skills/usability-evaluation/templates/observation-notes-template.md)**: Bảng nhật ký quan sát hành vi, thời gian, điểm vướng mắc và trích dẫn lời nói người dùng theo thời gian thực.
- **[scripts/calculate_sus.mjs](file:///d:/HCMUS/semester7/software-testing/Software-Testing/.claude/skills/usability-evaluation/scripts/calculate_sus.mjs)**: Script tự động tính điểm chuẩn SUS:
  - Công thức: Câu lẻ $(Q_i - 1)$, câu chẵn $(5 - Q_j)$, tổng nhân $2.5$.
  - Tính Mean SUS, Median SUS, Standard Deviation ($\sigma$), tỷ lệ hoàn thành.
  - Phân loại xếp hạng Bangor Grade (Grade A: $\ge 80.3$, B: $68.0-80.2$, C: $51.0-67.9$, D: $36.0-50.9$, F: $<36.0$) và chuẩn ngành ($68.0$). Xuất trực tiếp bảng Markdown/CSV cho báo cáo.

---

## 4. Chi tiết Skill 3: `cross-platform-gui-testing`

### 4.1. Mục đích thiết kế
Hướng dẫn thiết lập môi trường, thực thi kiểm thử giao diện trên **tối thiểu 3 nền tảng khác nhau**, phát hiện các điểm sai lệch hiển thị/chức năng (Platform Skew), và thực thi quy định bằng chứng có watermark chống gian lận.

### 4.2. Căn cứ từ Đề bài HW03 (`HW03_GUI_Usability_VI.md`)
1. **Yêu cầu Đa nền tảng** (§6 Task 3, dòng 131–138):
   - Chạy Task 1 trên **ít nhất ba (3) nền tảng**.
   - Trình duyệt Web: Chrome, Firefox, Safari (hoặc Chrome trên Android).
   - **Đặc cách quan trọng**: Ứng dụng di động của SUT qua **Expo Go trên điện thoại thật** được tính là một nền tảng hợp lệ và có thể thay thế Safari (thỏa mãn 1 trong 3 nền tảng bắt buộc).
2. **Quy tắc Bằng chứng Chống Gian lận (Anti-Fraud Constraints)** (§6 dòng 137 & §11 dòng 176):
   - Mọi ảnh chụp màn hình **bắt buộc phải có overlay username** theo định dạng email sinh viên (ví dụ: `21127xxx@student.hcmus.edu.vn`).
   - Ảnh chụp phải thể hiện rõ tên trình duyệt, hệ điều hành, khung thiết bị và URL SUT.
   - Khi điền form (đăng ký, thanh toán) phải thể hiện mã số sinh viên hoặc họ tên sinh viên.

### 4.3. Căn cứ từ Slide bài giảng (`S13_GUI Testing & Usability Testing.pdf`)
1. **Tính nhất quán thị giác đa nền tảng (Slide 7, 15, 21)**:
   - *Slide 7 (Visual Consistency)*: Kiểm thử GUI xác minh phần mềm duy trì tính nhất quán thị giác trên các thiết bị và nền tảng khác nhau, ngăn ngừa lỗi tràn chữ, lệch hàng, vỡ hình ảnh.
   - *Slide 15 & 21 (Non-Functional Level)*: Phân loại Compatibility testing & Platform/environment testing thuộc cấp độ phi chức năng của kiểm thử GUI.
2. **Thách thức đa thiết bị và Giải pháp (Slide 22)**:
   - *Slide 22 (Diverse Platforms and Devices)*:
     - Thách thức: Đảm bảo hiệu năng và giao diện GUI nhất quán qua nhiều hệ điều hành, trình duyệt và kích thước màn hình.
     - Giải pháp: Thực hiện kiểm thử toàn diện cross-browser và cross-device kết hợp thiết kế đáp ứng (responsive design).

### 4.4. Các tệp thành phần đã tạo trong Skill
- **[SKILL.md](file:///d:/HCMUS/semester7/software-testing/Software-Testing/.claude/skills/cross-platform-gui-testing/SKILL.md)**: Định nghĩa 3 tổ hợp nền tảng hợp lệ, trong đó khuyến nghị Tổ hợp A: **Desktop Chrome (Windows) + Desktop Firefox (Windows) + Expo Go Mobile trên điện thoại thật** (tận dụng tối đa server tunnel vừa cấu hình).
- **Quy chuẩn Watermark/Overlay**: Hướng dẫn chèn watermark email sinh viên, hiển thị thanh trạng thái thiết bị và URL.
- **Bảng ma trận so sánh sai lệch nền tảng (Platform Skew Matrix)**: Đối chiếu font chữ, widget ngày tháng, bàn phím ảo che khuất form, và cách xử lý khi mất kết nối mạng giữa Web và Mobile.

---

## 5. Tóm tắt Giá trị Kỹ thuật

1. **Khép kín quy trình kiểm thử từ Lý thuyết đến Thực hành**: Bộ skills chuyển hóa 100% các khái niệm học thuật từ slide bài giảng FIT@HCMUS (Slide 11-14 về lỗi GUI, Slide 40 về kịch bản nhiệm vụ, Slide 48 về chỉ số đo lường) thành các quy trình thực thi và tệp mã nguồn cụ thể.
2. **Tự động hóa có kiểm soát (Human-in-the-Loop)**: Trang bị sẵn các script kiểm tra chất lượng checklist (`validate_checklist.mjs`) và tính toán thống kê tự động (`calculate_sus.mjs`), giúp loại bỏ hoàn toàn các sai sót tính toán thủ công và đảm bảo đáp ứng đầy đủ barem điểm của đề bài.
3. **Tuân thủ tuyệt đối quy định học thuật**: Tích hợp chặt chẽ cơ chế phát hiện điểm yếu của AI (AI Gap Analysis), quy tắc đóng dấu email sinh viên chống giả mạo bằng chứng, và bảo toàn tính toàn vẹn của dữ liệu thử nghiệm.
4. **Nguyên tắc Bất biến SUT (SUT Immutability Rule - Strict Zero-Modification Policy)**: Thiết lập bắt buộc trong cả 3 skills: Agent kiểm thử **tuyệt đối không được sửa đổi, vá lỗi hay can thiệp vào mã nguồn của `eshop-sut/`** (backend, frontend-web, frontend-admin, frontend-mobile). Mọi lỗi phát hiện đều phải được ghi nhận trung thực thành Bug Report, giữ nguyên trạng thái SUT như một hộp đen tĩnh (Read-Only Black-Box). Toàn bộ sản phẩm kiểm thử phải lưu độc lập trong `HW3/`.
