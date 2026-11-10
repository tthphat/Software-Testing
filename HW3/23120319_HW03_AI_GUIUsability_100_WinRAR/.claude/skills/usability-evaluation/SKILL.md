---
name: usability-evaluation
description: Plan, moderate, analyze and report formal Usability Testing on an end-to-end user flow with 7 real participants following CSC13003 S13 guidelines. Includes goal-oriented task scenario design, System Usability Scale (SUS) calculation, 4 qualitative probe questions (clarity, error recovery, speed, trust), severity prioritization matrix, and usability bug logging. Use whenever planning usability sessions, conducting moderated tests, calculating SUS scores, or analyzing user experience defects.
---

# Usability Evaluation (CSC13003 S13 Method)

## 1. Goal & Requirements
Conduct a small-scale, moderated usability evaluation of **one end-to-end user flow** (e.g. Register → Browse Product → Add to Cart → Apply Coupon → Checkout) with **seven (7) real participants** outside the class. Measure both performance metrics (time, completion rate) and preference metrics (System Usability Scale - SUS score, qualitative probes), prioritize UX pain points, and file actionable bug reports.

## 2. SUT Immutability Rule (Strict Zero-Modification Policy)
- **DO NOT modify, edit, or patch any code inside `eshop-sut/`** (including `backend/`, `frontend-web/`, `frontend-admin/`, and `frontend-mobile/`).
- The SUT is the target under test and must be treated as a strict read-only black-box. Any usability blocker, UI glitch, or functional defect encountered during user testing sessions must be documented and triaged as a bug report, NEVER fixed by altering SUT source code.
- All test plans, task scenarios, observation logs, and evaluation reports must reside exclusively inside the project's designated output directory (`<OUTPUT_DIR>`, configured by the workspace `CLAUDE.md`), never inside `eshop-sut/`.

## 3. Core Methodological Principles (from Lecture S13)
1. **Representative Target Population**: Participants must be real end-users (non-IT / non-testers strongly preferred to get authentic, unbiased user feedback). Contact info (Zalo, email, phone) must be verifiable with the 4 middle digits masked (e.g. `0912****89`).
2. **Goal-Oriented Tasks (Not Step-by-Step Instructions)**: Give participants a realistic business objective (e.g., *"Find a smartphone under 30,000,000 ₫ and checkout with coupon SAVE10"*), NEVER tell them what buttons to click or what inputs to type.
3. **Think-Aloud Protocol**: Encourage users to verbalize their thoughts, expectations, hesitations, and frustrations while performing the task.
4. **Neutral Moderation**: The moderator must remain completely neutral. Never explain the interface, justify designs, or guide the user unless they are 100% blocked and ask for help.
5. **Dual Data Streams**:
   - **Performance Data** (Objective): Task completion (Success / Failure / With Assistance), time to complete, error frequency.
   - **Preference Data** (Subjective): System Usability Scale (SUS 10 questions) + 4 Open Probe Questions (**Clarity, Error Recovery, Speed, Trust**).

---

## 4. The 3-Phase Execution Lifecycle

### Phase 1: Planning & Preparation
1. **Define Objective & Problem Statement**:
   - State clearly what you want to uncover (e.g., *"Where do users experience friction or drop-off during the checkout and coupon application flow?"*).
2. **Design Goal-Oriented Task Scenario**:
   Follow the 4-part structure from Lecture Slide 40:
   - `Task`: Concise user goal.
   - `Machine State`: Initial system condition (e.g., database seeded, logged out, empty cart).
   - `Successful Completion Criteria`: Concrete observable end state (e.g., Order created with status 'pending', coupon discount reflected).
   - `Benchmark`: Expected completion time under normal conditions (e.g., 2 minutes).
3. **Prepare Measurement Instruments**:
   - Standard 10-item System Usability Scale (SUS) with 5-point Likert scale (1 = Strongly Disagree to 5 = Strongly Agree).
   - 4 Qualitative Probe Questions:
     1. *Tính rõ ràng (Clarity)*: "Giao diện có điểm nào làm bạn khó hiểu hoặc phải dừng lại suy nghĩ không?"
     2. *Khôi phục lỗi (Error Recovery)*: "Khi gặp lỗi, thông báo có giúp bạn biết cách sửa ngay không?"
     3. *Tốc độ (Speed)*: "Các bước thực hiện nhanh hay chậm so với kỳ vọng của bạn?"
     4. *Sự tin cậy (Trust)*: "Bạn có cảm thấy tin tưởng khi nhập thông tin và thanh toán trên trang này không? Vì sao?"
4. **Recruit 7 Participants & Run Pilot Session**:
   - Run 1 pilot test with a volunteer to debug instructions, timing, and recording tools before launching the 7 official sessions.

---

### Phase 2: Moderating the 7 Individual Sessions
Conduct 7 separate one-on-one sessions (one per participant):
1. **Set the Stage**:
   - Welcome the user: *"We are testing the product, not testing you. There are no wrong answers. Please speak your thoughts out loud."*
2. **Observe & Take Structured Notes**:
   - Record time-to-complete, hesitations, UI misclicks, and spontaneous verbal remarks.
   - Use the `observation-notes-template.md` table: `Participant ID | Step / Area | Observed Friction / Hesitation | Exact User Quote | Task Outcome`.
3. **Administer Post-Test Questionnaire**:
   - Participant completes the 10 SUS questions independently.
   - Moderator conducts the 4 open probes to dig deeper into the observed friction points.

---

### Phase 3: Analysis, Scoring & Reporting
1. **SUS Calculation**:
   - Run `node .claude/skills/usability-evaluation/scripts/calculate_sus.mjs <data.json>`.
   - Calculate individual SUS scores (0–100), composite Mean SUS, Standard Deviation, and Bangor Grade (A/B/C/D/F).
2. **Thematic Grouping of Pain Points**:
   - Separate isolated one-off bugs (e.g., broken button) from systemic UX design flaws (e.g., confusing coupon input layout).
3. **Criticality Prioritization Matrix**:
   Evaluate each problem by `Criticality = Severity × Probability`:
   - **Critical (P0)**: Task blocker, prevents transaction completion, high frequency across users.
   - **High (P1)**: Causes severe user confusion, erroneous input, or major delay.
   - **Medium (P2)**: Annoying friction, minor hesitation, but user eventually recovers.
   - **Low (P3)**: Cosmetic suggestion or minor preference difference.
4. **Actionable Recommendations & Bug Logging**:
   - File genuine usability bugs into `<OUTPUT_DIR>/report/issues/BUG-UX-XX.md` and GitHub Issues with screenshots and user evidence.
   - Provide concrete UI/UX improvement recommendations.

---

## 5. Expected Output Artifacts

All artifacts generated by this skill are saved under `<OUTPUT_DIR>` (as configured in the project's `CLAUDE.md`, e.g., `HW3/` or `./`):

| Artifact Path | Format | Purpose & Contents |
|---|---|---|
| `<OUTPUT_DIR>/report/usability-report.md` | Markdown | Comprehensive Usability Report: Objectives, Task scenario specification, participant demographics (7 users, 4 middle digits masked), individual & composite SUS scores, statistical synthesis (Mean, Median, StdDev), Bangor Grade, and actionable UX recommendations. |
| `<OUTPUT_DIR>/data/sus-responses.json` | JSON / CSV | Raw responses of the 7 participants across the 10 SUS questions, task timings, and completion status. |
| `<OUTPUT_DIR>/report/observation-notes.md` | Markdown | Consolidated session observation logs: timelines, friction points, hesitation counts, and exact user think-aloud quotes. |
| `<OUTPUT_DIR>/report/issues/BUG-UX-XX.md` | Markdown | Individual usability defect reports prioritized by Criticality = Severity x Probability, with screenshots and user quotes. |
| `<OUTPUT_DIR>/evidence/screenshots/usability/` | PNG / JPG | Screen captures of UI friction points and task blockers encountered during sessions (with student watermark). |
| `<OUTPUT_DIR>/evidence/recordings/` | MP4 / WebM / Link | Optional screen recordings or video links of the moderated sessions with participant consent. |
