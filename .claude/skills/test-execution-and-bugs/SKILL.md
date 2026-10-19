---
name: test-execution-and-bugs
description: Execute the designed domain-testing and BVA test cases against the EShop SUT (API runner plus manual UI steps), record PASS/FAIL, triage failures into bug reports (Vietnamese Markdown + GitHub issue drafts), do the AI gap analysis, and compute the test summary counts for README. Use this skill after domain-testing and boundary-value-analysis, or whenever the user wants to run test cases, report bugs, file GitHub issues, compare AI-designed tests with what was found manually, or produce the test summary report.
---

# Test execution, bug reporting, AI gap analysis

## Language rules
Skill in English. Everything in `report/` is Vietnamese (proper diacritics); IDs, paths, HTTP
details, code, and log output stay in English.

## Working agreement
- Never edit the SUT source code to make a test pass. The SUT is the thing under test.
- Never decide "bug" alone: a FAIL is a **candidate**. The student confirms each bug.
- Never create GitHub issues without the student's explicit confirmation of every draft.
- Stop for review after Stage 3 (triage) and Stage 5 (gap analysis). Log artifacts with
  `ai-audit-log`. Commit once per approved stage.

## Test case file schema: `testcases/<FR-xx>.json`
```json
{
  "feature": "FR-01",
  "cases": [
    {
      "id": "FR01-DT-01",
      "technique": "DT",                       // DT | BVA | EXTRA (added by hand after AI)
      "origin": "AI",                          // AI | AI-edited | HUMAN  (for gap analysis)
      "covers": ["EC1", "EC5"],
      "title": "Valid registration",
      "type": "api",                           // api (runner) | ui (manual)
      "auth": "none",                          // none | user | admin  (roles from config.json)
      "precondition": "Email not registered",
      "request": { "method": "POST", "path": "/api/register",
                   "body": { "name": "Nguyen Van A", "email": "a{{uniq}}@x.com", "password": "Password123!" } },
      "expected": { "status": [200], "body_includes": ["registered successfully"], "body_excludes": [] },
      "expected_source": "SPEC",               // SPEC | CODE | OBSERVED | ASSUMED
      "result": { "status": "NOT_EXECUTED" }   // NOT_EXECUTED | PASS | FAIL | BLOCKED
    }
  ]
}
```
(JSON has no comments: remove the `//` notes in real files.) `{{uniq}}` becomes a unique string
per run. UI cases have `"type": "ui"`, a `steps` array, and are filled in by hand.
`testcases/config.json`: `{ "base_url": "http://localhost:3000", "users": { "user": {"email": "...", "password": "..."}, "admin": {...} } }`.
Keep real credentials out of git if they are not demo accounts.

## Stage 1 - Prepare the environment
1. Confirm the SUT is running (`GET {base_url}/api/products` returns 200). If not, read the
   repository README and start it; if you cannot, report what is missing and stop.
2. Create or confirm one normal user and one admin user; write them into `testcases/config.json`.
3. Reset or note the data state, since FR-01/FR-03/FR-08 change data. Use `{{uniq}}` emails.

## Stage 2 - Execute
- API cases: `node .claude/skills/test-execution-and-bugs/scripts/run_cases.mjs --file testcases/FR-01.json`
  (`--only ID,ID` to rerun, `--dry` to print requests). The runner writes `result` back into
  the JSON. BLOCKED means the case could not run (login failed, server down): fix the cause and rerun.
- UI cases: perform the steps in the browser. For each, save a screenshot named
  `evidence/<TC-ID>.png` and set `result` by hand (ask the student for the observed result;
  never invent it). Mobile (Pool D) cases follow the same pattern.
- Cases whose precondition cannot be arranged (e.g. controlling token expiry time): set
  `BLOCKED` with the reason in `result.error`, do not mark them PASS.
- Order matters for stateful features (FR-03: forgot-password then reset-password; FR-08:
  cart then checkout). Add `setup` notes to the case instead of relying on luck.

## Stage 3 - Triage failures  -> STOP FOR REVIEW
- **Zero-Trust SUT Principle (v2.0)**:
  Before running tests and triaging failures, verify if the backend route/controller contains actual validation logic
  (`if (!field)`, length checks, regex tests, DB constraints). Do not naively assume the SUT adheres to standard REST conventions
  (returning 400 Bad Request). If the code lacks validation and inserts blindly, proactively flag that invalid test cases
  are expected to FAIL with HTTP 200 due to backend omission, avoiding surprise mass failures.

For every FAIL, decide one of:

1. **Defect in SUT**: observed behaviour contradicts a `[SPEC]`/`[CODE]` expectation.
2. **Wrong expectation**: the expected result was `[ASSUMED]` and the SUT behaviour is
   defensible. Fix the test case (record as AI-edited), do not report a bug.
3. **Spec gap**: spec is silent or contradictory. Report as "clarification needed", low severity.
4. **Environment/test-data problem**: fix and rerun.
Deduplicate: one root cause = one bug, listing every TC that exposed it.
Rerun each FAIL once to confirm it is reproducible; record reproducibility (always / sometimes).

## Stage 4 - Write bug reports
Use `assets/bug-report.vi.md` (Vietnamese). Per bug: ID `BUG-FRxx-nn`, title, feature, TC IDs,
environment, preconditions, exact steps, request/response copied from the runner output,
expected vs actual (with source tag of the expectation), severity (Critical/Major/Minor/Trivial),
priority, evidence file paths, suggested cause only if visible in code (mark as hypothesis).
Collect all in `report/bugs.vi.md` and print a summary table.
GitHub issues: prepare one draft per bug in `report/issues/BUG-FRxx-nn.md`. After the student
confirms, create with `gh issue create --repo <group repo> --title ... --body-file ... --label bug`.
`gh` cannot upload images: tell the student to drag the screenshots into each issue in the
browser (or commit them under `evidence/` and link them), then take the required screenshot of
the GitHub Issues page for the submission.

## Stage 5 - AI gap analysis (assignment requirement)  -> STOP FOR REVIEW
Compare the test set the AI originally designed (`origin: "AI"`) with the final set and the bugs.
For each test case or bug the AI missed (`origin: "HUMAN"` / `EXTRA`), write a row:
`Missed item | How it was found | Why the AI missed it | Category | Fix to the skill`.
Category must be one of the three the assignment names:
1. **Prompt/input quality** (e.g. the prompt did not mention token expiry or state variables);
2. **Tool limitation** (e.g. the model cannot observe runtime behaviour or the real DB);
3. **Inherent feature complexity** (e.g. hidden cross-field rule, timing, concurrency).
Be honest: if the AI was correct and the student changed it unnecessarily, say that too.
Each row ends with a concrete improvement to a SKILL.md (e.g. "add state-variable checklist"),
then apply it to the skill and note the version (v1 -> v2) in `skills-changelog.md`. This
changelog is evidence for the Agent Skills grade and the AI Critique.

## Stage 6 - Summary numbers
`node .claude/skills/test-execution-and-bugs/scripts/summary.mjs testcases` prints the table
(designed, executed, passed, failed, blocked, not executed). Paste it into README.md together
with the number of features, number of bugs and demo video links. Numbers must come from the
script, never from memory.

## Output
- `testcases/<FR-xx>.json` (updated), `evidence/`, `report/bugs.vi.md`, `report/issues/*.md`,
  `report/<FR-xx>/03-execution-and-gap-analysis.vi.md` built from `assets/feature-report.vi.md`,
  `skills-changelog.md`, README test summary.

## Known pitfalls
- A 200 status with an error message in the body: check `body_includes`, not only status.
- Do not treat 401 and 403 as interchangeable unless the spec says so; record what the SUT
  returns and flag the inconsistency as an observation.
- Security-relevant findings (OTP returned in the response, role tampering, price trusted from
  client) are valid bugs even if they look "by design" for a demo app: report with severity
  reasoning and let the student decide.
