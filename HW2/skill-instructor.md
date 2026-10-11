# Bộ Agent Skills cho HW02 – Domain Testing & BVA trên EShop

Dành cho **Claude Code (CLI)**. Skill viết bằng tiếng Anh; báo cáo sinh ra bằng tiếng Việt.

## Cấu trúc
```
CLAUDE.md                                   quy ước dự án (ngôn ngữ, git, quy tắc)
.claude/skills/
├── domain-testing/                         4 bước theo slide S04 → lớp tương đương, bộ test tối thiểu
│   ├── SKILL.md
│   └── references/eshop-features.md        sự kiện đã biết + giả thuyết cần kiểm chứng (FR-01/03/08/12)
├── boundary-value-analysis/SKILL.md        BVA 2-value, 3-value, mô hình 9 điểm của môn
├── test-execution-and-bugs/                chạy test, bug report, AI gap analysis, số liệu tổng kết
│   ├── SKILL.md
│   ├── scripts/run_cases.mjs               chạy test case API từ JSON, ghi PASS/FAIL/BLOCKED
│   ├── scripts/summary.mjs                 đếm designed/executed/passed/failed/not executed
│   └── assets/{feature-report,bug-report}.vi.md
└── ai-audit-log/                           AI Audit Report (Phụ lục A) + AI Critique (Phụ lục B)
    ├── SKILL.md
    └── scripts/audit.py                    export log phiên Claude Code / add entry / build Phụ lục A
```

## Cài đặt
1. Tạo thư mục repo bài làm, copy `.claude/` và `CLAUDE.md` vào gốc repo, chạy `git init`.
2. Đặt `api_specification.md`, slide S04 và đề bài vào thư mục `docs/` (Claude Code sẽ đọc từ đó).
3. Clone `eshop-sut` cạnh repo bài làm (hoặc vào `sut/`) và chạy hệ thống theo README của nó.
4. Mở terminal tại gốc repo, chạy `claude`. Kiểm tra bằng lệnh `/skills` (hoặc hỏi "bạn có những skill nào?").
5. Cần Node 18+ (runner) và Python 3.

## Quy trình cho mỗi tính năng (ví dụ FR-01)
Gõ lần lượt (có thể gọi đích danh tên skill):
1. "Dùng skill domain-testing cho FR-01, đọc api_specification.md và mã nguồn eshop-sut." → duyệt sau Bước 2 và Bước 4.
2. "Dùng skill boundary-value-analysis cho FR-01, biến thể 3-value." → duyệt sau Stage 3.
3. "Dùng skill test-execution-and-bugs: chạy test FR-01, phân loại lỗi, viết bug report."
4. Sau mỗi artifact: "Dùng skill ai-audit-log ghi lại artifact này" (bạn quyết định verdict).
5. Mỗi bước được duyệt: commit riêng. Cuối cùng xuất `git-commit-log.txt`.
6. Cuối dự án: `ai-audit-log` → export + build Phụ lục A; tự viết phần kết luận và cam đoan; nhờ Claude nháp Phụ lục B rồi viết lại bằng giọng của bạn.

## Cải tiến v1 → v2 (ăn điểm Agent Skills)
Sau FR-01, điền AI gap analysis. Mỗi chỗ AI bỏ sót phải dẫn tới một sửa đổi cụ thể trong SKILL.md
(ví dụ thêm checklist biến trạng thái), ghi vào `skills-changelog.md`, rồi chạy lại trên FR-03 để chứng minh
bản v2 tốt hơn. Đây cũng là chất liệu cho AI Critique.

## Video demo (YouTube) – gợi ý kịch bản cho 1 tính năng hoàn chỉnh
1. Giới thiệu repo + các skill (30 giây). 2. Chạy domain-testing: lớp tương đương → bạn review, sửa.
3. Chạy BVA. 4. Chạy runner, cho thấy ít nhất một FAIL. 5. Viết bug + tạo GitHub issue có ảnh.
6. AI gap analysis và log audit. 7. Chạy summary.mjs ra số liệu.

## Giới hạn cần biết
- `audit.py export` giả định định dạng transcript JSONL của Claude Code; nếu khác, sửa hàm `extract_text`.
- Skill không biết ràng buộc thật của EShop: file `references/eshop-features.md` chỉ liệt kê *giả thuyết*,
  Claude phải kiểm chứng bằng mã nguồn hoặc gọi API.
- Runner hiện chỉ chạy được case API; case UI/mobile bạn chạy tay và ghi kết quả vào JSON.
