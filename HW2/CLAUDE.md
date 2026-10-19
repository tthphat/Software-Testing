# HW02 - Domain Testing on EShop (CSC13003) - project rules for Claude Code

## Who and what
- Student: TRUONG THANH PHAT, MSSV 23120319, class Kiem thu phan mem - CQ2023/3.
- Task: apply Domain Testing and Boundary Value Analysis with AI support to the EShop SUT
  (`https://github.com/ttbhanh/eshop-sut`), per `HW02_Domain_Testing_En.pdf`.
- Features in this repo: FR-01 (registration), FR-03 (forgot/reset password), FR-08 (checkout),
  FR-12 (access control). The Mobile feature (Pool D) is still to be decided by the student.
- Course method: slides `S04_Domain_Testing.pdf` (4 steps) and ISTQB EP / BVA (2-value, 3-value).

## Language
- `.claude/skills/**` and code: English.
- Everything under `report/` and README test summary prose: **Vietnamese with full diacritics**;
  keep IDs, field names, endpoints, status codes and code in English.

## Skills (run in this order per feature)
1. `domain-testing` -> 2. `boundary-value-analysis` -> 3. `test-execution-and-bugs`;
`ai-audit-log` runs after every AI artifact. Skills are in `.claude/skills/`.

## Rules
- Human review is mandatory: stop at the review points the skills define, do not run ahead.
- Do not modify the SUT source. Do not invent requirements: tag expectations
  `[SPEC]/[CODE]/[OBSERVED]/[ASSUMED]`.
- Never create GitHub issues, push, or delete files without explicit student confirmation.
- Never fabricate results: numbers in the README come from `scripts/summary.mjs`.
- Copying between students (including prompts) gives 0 for both: write in your own words.

## Git (assignment: one commit per testing step per feature + text log)
- After the student approves a step: `git add -A && git commit -m "HW2-<type>(FR-xx): <step>"`,
  e.g. `HW2-docs(FR-01): domain testing step 2 - equivalence classes`,
  `HW2-test(FR-01): BVA 3-value test cases`, `HW2-docs(FR-01): bug reports and gap analysis`,
  `HW2-chore(skills): v2 add state-variable checklist`.
- At the end: `git log --date=iso --pretty=format:"%h | %ad | %an | %s" > git-commit-log.txt`.

## Layout
```
.claude/skills/        skills (English)
HW2/testcases/         FR-xx.json + config.json
HW2/report/           Vietnamese reports, bugs.vi.md, appendix-A/B
HW2/evidence/         screenshots (TC-ID.png)
HW2/audit/            audit-log.jsonl, raw session exports
skills-changelog.md    v1 -> v2 improvements from AI gap analysis
git-commit-log.txt
README.md              self-assessment table + test summary + demo video links
```
