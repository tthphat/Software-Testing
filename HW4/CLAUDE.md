# HW04 - Web UI Automation Testing with Playwright (CSC13003) - Project Rules for Claude Code & Agents

## 1. Who and What
- **Student**: TRUONG THANH PHAT, MSSV: `23120319`, Class: Kiểm thử phần mềm - CQ2023/3 (FIT@HCMUS).
- **Email / Watermark**: `23120319@student.hcmus.edu.vn`.
- **Assignment**: HW04 - Web UI Automation Testing with Playwright TypeScript on EShop SUT (`https://github.com/ttbhanh/eshop-sut`), per `2026.HW04.Automation Testing_En.pdf`.
- **Target Features (3 Features inherited from HW02)**:
  - **Pool A**: `FR-01: Account registration` (Đăng ký tài khoản)
  - **Pool B**: `FR-08: Checkout` (Thanh toán & Đặt hàng)
  - **Pool C**: `FR-12: Access control` (Kiểm soát quyền truy cập Admin Web)

---

## 2. Artifact Destination Override (Configuring `<OUTPUT_DIR>`)
All reusable skills (`playwright-automation-testing`, `ai-audit-log`) reference `<OUTPUT_DIR>`. For this assignment, **`<OUTPUT_DIR>` is overridden strictly to `HW4/`**:

```text
OUTPUT_DIR = HW4/
```

### Destination Layout:
```text
HW4/
├── CLAUDE.md                            # Project-specific rules (this file)
├── README.md                            # Self-assessment rubric (100/100) + Test summary + Video links
├── 23120319_HW04_Main_Report.md         # Comprehensive Main Report (Markdown)
├── 23120319_HW04_Main_Report.pdf        # Comprehensive Main Report (PDF)
├── git-commit-log.txt                   # Git commit log text file (>= 8 commits modifying .spec.ts)
├── requirements/                        # Original homework specifications (En/Vi)
├── plan/
│   ├── plan.md                          # Detailed 6-phase roadmap
│   └── skill-explanation.md             # In-depth Vietnamese explanation of the Agent Skill
├── automation/                          # Playwright TypeScript Project
│   ├── package.json
│   ├── playwright.config.ts             # 3 browsers (Chromium, Firefox, WebKit) + "Run by: 23120319" + ISO time
│   ├── data/                            # External Data-Driven Test Files (Strictly decoupled from scripts)
│   │   ├── fr01-registration.json       # >= 12 test cases
│   │   ├── fr08-checkout.json           # >= 12 test cases
│   │   └── fr12-access-control.json     # >= 12 test cases
│   ├── tests/                           # Playwright test specs (>= 3 assertion patterns each)
│   │   ├── fr01-registration.spec.ts
│   │   ├── fr08-checkout.spec.ts
│   │   └── fr12-access-control.spec.ts
│   └── playwright-report/               # Generated Playwright HTML reports
├── report/                              # Analytical reports and AI audit appendices
│   ├── bugs-summary.md                  # Consolidated bug summary
│   ├── appendix-A-ai-audit.md           # Mandatory AI Audit Report (§9 - 5 columns)
│   ├── appendix-B-ai-critique.md        # Mandatory AI Critique (§10 - 200-300 words)
│   └── issues/                          # Defect reports and GitHub issue drafts
└── evidence/
    └── screenshots/                     # Test failure screenshots & GitHub issue proof
```

---

## 3. Language Rules
- Skills and reusable scripts (`.claude/skills/**`, `.agents/skills/**`): English.
- Everything written into `HW4/report/`, `HW4/plan/`, and `HW4/README.md`: **Vietnamese with full diacritics**, keeping technical terms, IDs (`FR-01`, `TC-FR01-01`, `BUG-AUTO-01`, `Chromium`, `Firefox`, `WebKit`), Playwright assertion methods, and code symbols in English.

---

## 4. Skills Workflow
1. **Agent Skill**: `playwright-automation-testing` -> Inspect DOM -> Decouple data to `data/*.json` -> Generate `.spec.ts` with >= 3 assertions -> Validate via `validate_automation.mjs` -> Execute across 3 browsers -> Human Review & Defect triage.
2. **AI Audit Log**: `ai-audit-log` records prompts, dates, and outputs after every AI generation step into `HW4/report/appendix-A-ai-audit.md`.

---

## 5. Non-Negotiable Rules
- **Strict SUT Immutability**: **NEVER modify, patch, or alter any source code inside `eshop-sut/`**. The SUT is a read-only black box. Discovered bugs are documented, never fixed in the SUT.
- **Strict Data-Driven Testing**: Test inputs and expected outcomes must reside in `HW4/automation/data/*.json` (or `.csv`). Hardcoding inline data arrays inside `.spec.ts` is strictly prohibited.
- **Multi-Browser Execution**: Every feature must execute across at least 3 browsers (`Chromium`, `Firefox`, `WebKit`) for a total of at least 9 browser runs.
- **Authorship & Anti-Cheat Metadata (§11)**: Every HTML Report must visibly display `Run by: 23120319` along with an ISO timestamp. Video demos must show face-cam or terminal running `whoami` and `hostname`.
- **Git Commit Log (§12)**: Maintain at least **8 commits** that directly modify `.spec.ts` files. Commits touching only docs or configs do not count.
- **Automated Quality Gate**: Always pass `validate_automation.mjs` before executing test suites or packaging.

