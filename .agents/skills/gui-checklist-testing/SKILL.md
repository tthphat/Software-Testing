---
name: gui-checklist-testing
description: Design, review, execute and report comprehensive GUI Checklist Testing (>40 items) across 4 Interface Aspects (IA-01 General UI Standards, IA-02 Forms, IA-03 Navigation, IA-04 Feedback & State) following CSC13003 S13 lecture guidelines. Includes AI Gap Analysis (identifying missed accessibility WCAG, dark mode, responsive viewport, state desync), automated checklist validation via validate_checklist.mjs, and multi-platform test execution with screenshot evidence overlay. Use whenever designing GUI checklists, verifying UI elements, or reporting GUI bugs.
---

# GUI Checklist Testing (CSC13003 S13 Method)

## 1. Goal & Overview
Design an exhaustive, high-coverage GUI Checklist with **more than 40 items** covering all 4 Interface Aspects (IA) of the SUT (EShop), perform AI Gap Analysis on items missed by AI, audit checklist completeness and notes compliance using the automated validation script (`validate_checklist.mjs`), execute the checklist across target platforms, and report all discovered defects with screenshot evidence.

## 2. SUT Immutability Rule (Strict Zero-Modification Policy)
- **DO NOT modify, edit, or patch any code inside `eshop-sut/`** (including `backend/`, `frontend-web/`, `frontend-admin/`, and `frontend-mobile/`).
- The SUT is the target under test and must be treated as a strict read-only black-box. Any defect, inconsistency, or unexpected behavior discovered in the SUT must be documented as an observation or bug report, NEVER fixed in the application code.
- All test artifacts, checklists, scripts, and reports must be stored exclusively inside the project's designated output directory (`<OUTPUT_DIR>`, configured by the workspace `CLAUDE.md`), never inside `eshop-sut/`.

## 3. The 4 Interface Aspects (IA) Reference
Every checklist item must map to one of the 4 defined aspects:

| Aspect ID | Aspect Name | Scope & Core Elements (from Lecture S13) |
|---|---|---|
| **IA-01** | **Chuẩn UI chung (General UI Standards)** | • Color scheme, contrast, visual hierarchy<br>• Typography: font sizes, line heights, readability<br>• Layout & Alignment: margins, padding, grid, responsive wrapping<br>• Labels & Text: spelling, Vietnamese diacritics, clear naming<br>• Error & Warning message wording and placement |
| **IA-02** | **Form (Biểu mẫu)** | • Data validation (inline vs on-submit, empty, boundary, regex)<br>• Mandatory fields vs optional fields indicators (*)<br>• Incorrect field defaults / initial values<br>• Field order & logical Tab key focus order<br>• Input masks, placeholders, password masking/unmasking |
| **IA-03** | **Điều hướng (Navigation)** | • Main menu navigation & active tab indicators<br>• Breadcrumb trails & backtracking accuracy<br>• Links, buttons, call-to-action (CTA) destinations<br>• Form navigation (Next, Prev, Cancel, Back buttons)<br>• Browser back/forward button behavior and URL updates |
| **IA-04** | **Phản hồi / Trạng thái (Feedback & State)** | • Window & modal dialog modality (backdrop, Esc key, close button)<br>• Control state alignment with data (disable button during submit, empty cart state)<br>• Synchronization of UI object content across views<br>• Loading indicators (spinners, skeletons) during async calls<br>• Mishandling of server process failures & offline states |

---

## 4. Human-in-the-Loop Protocol
1. **Never accept raw AI output without review**: All AI-generated items must be scrutinized for shallowness, duplicates, or missing platform-specific realities.
2. **Explicit AI Gap Analysis**: For every item manually added by the human reviewer, you must document **why AI missed it** under one of 3 root causes:
   - `Prompt/input quality`: The prompt lacked UI/UX context, screenshots, or Vietnamese e-commerce specifics.
   - `Model limitation`: LLM blindspots (spatial layout, color contrast, visual clipping, dynamic state transition).
   - `Inherent UI complexity`: Complex responsive breakpoints, platform quirks (Web vs Mobile Expo), or undocumented backend states.
3. **Mandatory Automated Verification**: Always run `validate_checklist.mjs` before and after execution to prevent human oversight (e.g. failing to reach 40 items, missing an IA aspect, or omitting failure notes).
4. **Evidence Requirement**: Only Failed items require screenshots. Every screenshot must show the application clearly and include an overlay/watermark of the student's email.

---

## 5. Multi-Stage Workflow

### Stage 1: Scope & UI Fact Collection
- Identify the target screen(s) or flow (e.g., Home, Product Detail, Cart & Checkout, Admin Dashboard, Mobile App).
- Inspect the actual code:
  - Frontend Web: `eshop-sut/frontend-web/src/pages/*.jsx`
  - Frontend Mobile: `eshop-sut/frontend-mobile/App.js`
  - Frontend Admin: `eshop-sut/frontend-admin/src/pages/*.jsx`
- Document active UI elements, forms, modal dialogs, and navigation routes.

### Stage 2: AI-Generated Baseline Checklist (> 40 items)
- Prompt the AI to generate a structured table of checklist items covering IA-01 through IA-04:
  - Target minimum: **40-45 items** across multiple screens to ensure depth.
  - Columns: `Item ID | Aspect | Screen / Component | Element / Area | Verification Criteria | Expected Behavior`.

### Stage 3: Human Review & AI Gap Analysis
- Review every generated item. Remove tautological or generic items.
- Identify what AI typically ignores:
  - **Accessibility (WCAG 2.1)**: Contrast ratio, focus indicator, screen-reader labels.
  - **Vietnamese Language & Typography**: Text overflow with Vietnamese accents, unlocalized error strings.
  - **Mobile vs Desktop Skew**: Touch targets (< 48x48px), keyboard obscuring inputs, safe area padding.
  - **Edge-case States**: Double-click rapid submit, zero-price items, empty search states, network drop.
- Produce the **AI Gap Analysis Table**:
  `Added Item ID | Aspect | Missing Verification Aspect | Root Cause Category | Explanation of Why AI Missed It`.
- **Pre-Execution Automated Validation**:
  Run the automated audit script on the drafted checklist markdown file to ensure baseline compliance before conducting testing:
  ```bash
  node .claude/skills/gui-checklist-testing/scripts/validate_checklist.mjs <OUTPUT_DIR>/report/checklist.md
  # hoặc:
  node .agents/skills/gui-checklist-testing/scripts/validate_checklist.mjs <OUTPUT_DIR>/report/checklist.md
  ```
  The script automatically checks:
  - Total items $\ge 40$ (warns if under 40).
  - All 4 Interface Aspects (IA-01, IA-02, IA-03, IA-04) are represented.

### Stage 4: Test Execution & Post-Execution Audit
- Run each checklist item on the active SUT.
- Fill execution columns: `Status (PASSED / FAILED / BLOCKED) | Execution Date | Platform | Notes (Reason for failure) | Defect ID`.
- Capture screenshot for every **FAILED** item, ensuring the student username overlay is present.
- **Post-Execution Automated Audit**:
  Re-run `validate_checklist.mjs` on the executed checklist file:
  ```bash
  node .claude/skills/gui-checklist-testing/scripts/validate_checklist.mjs <OUTPUT_DIR>/report/checklist.md
  ```
  The script performs:
  - Tallying of `PASSED`, `FAILED`, and unexecuted items with percentages.
  - **Strict Notes Check for FAILED Items**: Flags any item marked `FAILED` that is missing an explanation in the `Notes` column (mandatory per grading rubric to prevent point deductions).

### Stage 5: Bug Logging & Defect Report
- For every Failed item, create a formal bug report in `<OUTPUT_DIR>/report/issues/BUG-GUI-XX.md` and prepare it for GitHub Issues.
- Format:
  - **Title**: `[GUI][<Aspect ID>] <Short description of issue>`
  - **Environment**: OS, Browser / Device, SUT URL.
  - **Steps to Reproduce**: 1, 2, 3...
  - **Expected Result**: What the UI standard / requirement dictates.
  - **Actual Result**: What actually happened (with error text / layout flaw).
  - **Severity**: Critical / Major / Minor / Trivial.
  - **Evidence**: Attached screenshot with username overlay.

---

## 6. Bundled Tooling & Scripts

The skill provides an automated audit script located in `scripts/validate_checklist.mjs`:

```bash
# Cú pháp chạy:
node <path_to_skill>/scripts/validate_checklist.mjs [đường_dẫn_tới_checklist.md]

# Ví dụ thực tế:
node .claude/skills/gui-checklist-testing/scripts/validate_checklist.mjs HW3/report/checklist.md
```

**Key Audit Checks performed by `validate_checklist.mjs`:**
1. **Quantity Verification**: Verifies total checklist criteria $\ge 40$ items per HW03 spec.
2. **Aspect Coverage**: Verifies presence of all 4 Interface Aspects (`IA-01`, `IA-02`, `IA-03`, `IA-04`).
3. **Execution Statistics**: Counts Passed, Failed, and unexecuted percentages.
4. **Missing Notes Detection**: Scans for any `FAILED` item lacking failure justification in the `Notes` column, enforcing compliance with rubric and preventing point loss.

---

## 7. Expected Output Artifacts

All artifacts generated by this skill are saved under `<OUTPUT_DIR>` (as configured in the project's `CLAUDE.md`, e.g., `HW3/` or `./`):

| Artifact Path | Format | Purpose & Contents |
|---|---|---|
| `<OUTPUT_DIR>/report/checklist.md` | Markdown | Comprehensive GUI Checklist table (> 40 items) with Passed/Failed status, failure Notes, and the AI Gap Analysis table. |
| `<OUTPUT_DIR>/report/checklist.xlsx` (or `.csv`) | Spreadsheet | Exported checklist table for submission package per course requirements. |
| `<OUTPUT_DIR>/report/bugs-summary.md` | Markdown | Summary table of all discovered GUI defects with severity and links to individual issue files. |
| `<OUTPUT_DIR>/report/issues/BUG-GUI-XX.md` | Markdown | Individual defect reports formatted for GitHub Issues (steps to reproduce, expected vs actual, severity, screenshot link). |
| `<OUTPUT_DIR>/evidence/screenshots/gui/` | PNG / JPG | Screenshot evidence for all FAILED checklist items, with mandatory student username watermark overlay. |
| `<OUTPUT_DIR>/report/appendix-A-ai-audit.md` | Markdown | AI Audit Log capturing prompts, raw AI outputs, and human review decisions. |
| `<OUTPUT_DIR>/report/appendix-B-ai-critique.md` | Markdown | 200–300 word critical evaluation of AI performance, blindspots, and collaboration lessons. |
