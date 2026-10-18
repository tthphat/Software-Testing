---
name: domain-testing
description: Apply Domain Testing (equivalence partitioning) to a feature, form, API endpoint or business rule, following the CSC13003 / S04 four-step method, and produce equivalence classes, a minimum set of test cases and a coverage matrix. Use this skill whenever the user asks to design test cases, partition inputs, find equivalence classes, or test any EShop feature (FR-01 .. FR-19) with domain testing, EP, "kiem thu mien" or "phan hoach tuong duong", even if they never say "domain testing". Always run it BEFORE boundary-value-analysis.
---

# Domain Testing (CSC13003 S04 method)

Goal: partition each input/output domain into equivalence classes (sub-domains), then pick
a small, justified set of test cases. This is a stratified-sampling strategy: two tests are in
the same class **if and only if their expected result is the same**. Extra tests inside one
class are redundant by definition.

## Language rules
- This skill is in English. **Everything you write into `report/` must be in Vietnamese**,
  keeping technical terms, IDs (EC1, TC01, FR-01), field names, HTTP verbs, paths, status
  codes and code in English.
- Never invent requirements. Every fact carries a source tag (see "Source tags").

## Working agreement (human review is mandatory)
The assignment requires the student to review every AI result. Therefore:
1. Work in the 5 stages below and **STOP for review after Stage 2 and Stage 4** (summarize
   what you produced, list your doubts, wait for the student's go-ahead).
2. After each stage, hand the artifact to the `ai-audit-log` skill (prompt, output, verdict).
3. After the student approves a stage, make one git commit (see CLAUDE.md for the format).

## Inputs you need
- Feature ID(s), e.g. `FR-01`. If missing, ask once.
- Spec sources, in priority order: (a) `api_specification.md`, (b) the SUT source code in
  the `eshop-sut` repo (routes, controllers, validators, DB schema), (c) the running UI/API.
- Read `references/eshop-features.md` for the known facts and *unverified hypotheses* per
  feature. Hypotheses are things to CHECK, never to assume.

## Source tags (put one on every expected result and every constraint)
- `[SPEC]` stated in api_specification.md or the assignment
- `[CODE]` read from SUT source code (give `path:line`)
- `[OBSERVED]` seen by calling the running system
- `[ASSUMED]` your guess; must be listed under "Open questions" for the student to confirm

## Stage 0 - Collect facts
Read the spec and the code for the feature. Output a short list: endpoint(s), request fields,
validation rules actually found, state/preconditions, possible responses (status + message).
Anything unclear goes to **Open questions**. If the code is available, grep the validation
logic: length checks, regexes, `if (!x)`, enums, role checks, `expired`, `max`, `min`.

- **Cross-platform Skew Checklist (v2.0)**:
  When investigating features, do NOT read backend code alone. You MUST check all 3 tiers:
  1. Backend API (`eshop-sut/backend/server.js`, controllers, DB schema in `database.js`).
  2. Frontend Web (`eshop-sut/frontend-web/src/pages/*.jsx`, components).
  3. Frontend Mobile (`eshop-sut/frontend-mobile/App.js` or components).
  Explicitly check for regex mismatches, client-only constraints, missing server-side checks,
  or flawed client validations (e.g. whitespace regexes vs special char regexes).
  Record any skew in the fact collection table with line numbers.


## Stage 1 - Identify Input and Output variables and their domains (slide: "Step 1")
Table: `Variable | Kind (input/output/state) | Type | Domain (possible values and constraints) | Source tag`.
- Inputs: each request field / UI field.
- **State and context inputs count as inputs**: ...
- Outputs: ...
- **Domain column**: write the full set of values the variable can take and every constraint
  found (length range, allowed characters, format, enum values, nullable or not). Put the
  constraint, not a guess: if unknown, write `unknown` and add it to Open questions.
  Stage 2 may only create classes from what is written in this column.

## Stage 2 - Identify equivalence classes (slide: "Step 2")  -> STOP FOR REVIEW
Number classes `EC1..ECn` continuously. Table:
`EC | Variable | Class description | Valid/Invalid | Guideline used | Source tag`.

Apply the course guidelines per condition:
| Condition in the spec | Classes to create |
|---|---|
| Range of values (e.g. 1..999) | 1 valid + 2 invalid (below, above) |
| Set of values handled differently (e.g. roles, statuses) | 1 valid class per value + 1 invalid (value outside the set) |
| "Must be" situation (e.g. must be an email, must be a letter) | 1 valid + 1 invalid |
| Reason to believe elements of a class are NOT handled identically | **split** the class into smaller classes |
| Output conditions | One class per distinct expected output |

Always also consider, per input variable: missing/null, empty string, whitespace-only, wrong
type (number where string expected), too short, too long, disallowed characters, and
state conflicts (duplicate, expired, already used). Create a class only if the expected
result of that class differs from the others; otherwise merge it. Include output classes
(like slide EC9/EC10: `SUM = A+B`, `Error message`).

Show the **Complete Set of Partitions** table, then list Open questions, then STOP.

Build classes from the Domain column of Stage 1. A class whose boundary or rule is not in
that column must be tagged `[ASSUMED]`.

## Stage 3 - Best representative of each class (slide: "Step 3")
For every class pick one representative value with a one-line reason.
- Ordered/ranged fields (length, quantity, amount, date): the best representative is a
  boundary value. Do NOT expand the boundaries here; note `-> BVA` and let the
  `boundary-value-analysis` skill do it.
- Unordered fields: a typical, realistic value (e.g. a valid Vietnamese address, an
  unregistered email).

## Stage 4 - Select test cases (slide: "Step 4 / Selecting test cases")  -> STOP FOR REVIEW
Rules (taken from the slides):
1. At least one test case from each equivalence class.
2. **Valid classes**: combine them so each test covers as many valid classes as possible,
   until all valid classes are covered.
3. **Invalid classes**: each test covers **one and only one** invalid class; every other
   input stays valid, otherwise you cannot tell which class caused the failure.
4. Output classes are covered by the tests that produce them (slide: TC2 covers EC2 and
   EC10).

Produce:
- **Test case table**: `TC ID | Partitions tested | inputs (one column per variable) | Precondition | Expected output | Source tag`.
  IDs follow `FRxx-DT-nn` (e.g. `FR01-DT-03`).
- **Coverage matrix**: every EC maps to >= 1 TC. A class with no TC is a defect of your
  work: fix it before showing the student. State the totals: number of classes, valid,
  invalid, number of TCs, "minimum set" size.
- Write the machine-readable file `testcases/<FR-xx>.json` (schema in
  `../test-execution-and-bugs/SKILL.md`). Every case starts with
  `"result": {"status": "NOT_EXECUTED"}`. Use `{{uniq}}` for values that must be unique
  per run (emails).

## Stage 5 - Self-check before handing over
- [ ] Each invalid TC has exactly one invalid class and all other fields valid.
- [ ] No two TCs are in the same class unless one is explicitly a cross-check (say why).
- [ ] Every expected result has a source tag; every `[ASSUMED]` is in Open questions.
- [ ] You did not add boundary values (that is the next skill) except as representatives.
- [ ] Report is Vietnamese; IDs/code/paths are English.

## Output
- `report/<FR-xx>/01-domain-testing.md` with sections: Pham vi & dac ta (Stage 0),
  Buoc 1..4 following the stages above, Bang bao phu (coverage), Cau hoi mo, Han che cua
  ky thuat (blind spots: errors not at boundaries; actual domains are often unknowable).
  Use proper Vietnamese diacritics in the report itself.
- `testcases/<FR-xx>.json`

## Known pitfalls (learned, keep updating this list in v2, v3, ...)
- AI tends to merge "empty" and "missing" fields; check whether the server treats them
  the same before merging.
- AI tends to assume validation rules from "common practice" (e.g. password >= 8 chars).
  Verify in code or by calling the API, otherwise tag `[ASSUMED]`.
- AI tends to forget state variables (token expired, order already shipped) and
  cross-field rules (e.g. `total_amount` vs cart contents).
- AI tends to test only the UI; each FR here is also reachable via the HTTP API, which
  may validate less than the UI. Create API-level cases too.
