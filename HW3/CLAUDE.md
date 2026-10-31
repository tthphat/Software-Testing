# HW03 - GUI & Usability Testing on EShop (CSC13003) - Project Rules for Claude Code & Agents

## 1. Who and What
- **Student**: TRUONG THANH PHAT, MSSV: 23120319, Class: Kiểm thử phần mềm - CQ2023/3.
- **Task**: Apply GUI Checklist Testing (>40 items), Usability Evaluation (7 real participants, SUS + Probes), and Cross-Platform Testing (>= 3 platforms) with AI support to the EShop SUT (`https://github.com/ttbhanh/eshop-sut`), per `HW03_GUI_Usability_VI.md`.
- **Course Method**: Lecture slides `S13_GUI Testing & Usability Testing.pdf` (FIT@HCMUS) and Bangor et al. (2008) SUS benchmark.

---

## 2. Artifact Destination Override (Configuring <OUTPUT_DIR>)
All reusable skills (`gui-checklist-testing`, `usability-evaluation`, `cross-platform-gui-testing`) reference `<OUTPUT_DIR>`. For this assignment, **`<OUTPUT_DIR>` is overridden strictly to `HW3/`**:

```
OUTPUT_DIR = HW3/
```

### Destination Layout:
```
HW3/
├── plan/                    Test plans, task scenarios, skills explanation
├── report/                  Main reports, checklist, SUS evaluation, cross-platform
│   ├── checklist.md         GUI Checklist (> 40 items across IA-01..04) & AI Gap Analysis
│   ├── checklist.xlsx       Exported Excel checklist for submission (§14)
│   ├── usability-report.md  Usability report: SUS scores, statistics, UX recommendations
│   ├── cross-platform.md    Cross-browser/platform comparison matrix
│   ├── bugs-summary.md      Consolidated list of discovered bugs
│   ├── appendix-A-ai-audit.md  AI Audit Report (§9)
│   ├── appendix-B-ai-critique.md AI Critique 200-300 words (§10)
│   └── issues/              Individual GitHub Issue drafts (BUG-GUI-xx, BUG-UX-xx, BUG-XP-xx)
├── evidence/
│   └── screenshots/         Screenshots with MANDATORY student email watermark overlay
│       ├── gui/             Failed checklist item evidence
│       ├── usability/       Friction point / blocker evidence from user sessions
│       └── cross-platform/  Comparative platform skew evidence
├── data/                    Raw test data (SUS responses JSON, test fixtures)
└── README.md                Self-assessment grade table + test summary + demo video links
```

---

## 3. Language Rules
- Skills and reusable scripts (`.claude/skills/**`): English.
- Everything written into `HW3/report/` and `README.md`: **Vietnamese with full diacritics**, keeping technical terms, IDs (`IA-01`, `CHK-IA01-01`, `BUG-GUI-01`, `SUS`), field names, HTTP status codes, and code symbols in English.

---

## 4. Skills Workflow
1. **Task 1**: `gui-checklist-testing` -> Generate baseline -> Human Review & AI Gap -> Execute on SUT -> Log bugs.
2. **Task 2**: `usability-evaluation` -> Goal-oriented task scenario -> 7 Moderated sessions -> `calculate_sus.mjs` -> Prioritize criticality.
3. **Task 3**: `cross-platform-gui-testing` -> Run across Chrome, Firefox, Expo Go Mobile -> Watermark overlay on screenshots.
4. `ai-audit-log` runs after every AI generation step.

---

## 5. Non-Negotiable Rules
- **Strict SUT Immutability**: **NEVER modify, patch, or alter any source code inside `eshop-sut/`**. The SUT is a read-only black box. Discovered bugs are documented, never fixed in the SUT.
- **Human-in-the-Loop**: Stop for review after each major stage. Never proceed without student confirmation.
- **Anti-Fraud Proof**: Every screenshot MUST have an overlay of the student's email (`23120319@student.hcmus.edu.vn`). The 7 usability participants must be real people outside class (phone/Zalo masked 4 middle digits).
- **No Fabricated Numbers**: SUS scores, completion times, and checklist counts must be derived from actual execution data via `calculate_sus.mjs` and `validate_checklist.mjs`.

---

## 6. Git Commit Protocol (One commit per testing step)
Format: `HW3-<type>(<scope>): <step description>`
- `HW3-docs(checklist): design GUI checklist baseline and AI gap analysis`
- `HW3-test(gui): execute checklist on Chrome and log failed items`
- `HW3-test(cross-platform): execute GUI checklist on Mobile Expo Go and Firefox`
- `HW3-docs(usability): prepare goal-oriented task scenario and SUS questionnaire`
- `HW3-test(usability): record 7 participant sessions and calculate SUS scores`
- `HW3-docs(bugs): file GitHub issues and consolidate defect report`
- `HW3-docs(audit): generate AI audit log and critique`
