---
name: boundary-value-analysis
description: Apply Boundary Value Analysis (BVA, 2-value and 3-value variants per ISTQB, plus the course 9-point model) to the ordered equivalence classes of a feature, field, API parameter or business rule, and produce boundary test cases with expected results. Use this skill after domain-testing, and whenever the user mentions boundaries, min/max, length limits, "gia tri bien", off-by-one, LB/UB, or asks for BVA on any EShop FR-xx feature, even if they do not say "boundary".
---

# Boundary Value Analysis (CSC13003 S04 + ISTQB)

Why: defects cluster at the edges of a partition (developers confuse `<` with `<=`, forget
the first/last value, mistype the limit). A boundary test catches both "inequality
mis-specified" and "boundary value mistyped" faults; a mid-range value may catch neither.

## Language rules
- This skill is in English. Everything written into `report/` is Vietnamese (with proper
  diacritics); IDs, field names, paths, status codes and code stay in English.
- Never invent limits. Each boundary needs a source tag: `[SPEC]`, `[CODE]`, `[OBSERVED]`,
  `[ASSUMED]` (assumed ones go to Open questions).

## Working agreement
Same as domain-testing: stop for student review after Stage 3, log each artifact with the
`ai-audit-log` skill, and commit once per approved stage.

## Prerequisite
`report/<FR-xx>/01-domain-testing.vi.md` and `testcases/<FR-xx>.json` must exist. If not, run
the `domain-testing` skill first. BVA works only on **ordered** partitions.

## Stage 1 - Select the ordered partitions
From the equivalence-class table keep only classes over an ordered domain:
numbers, amounts, quantities, string/array **length**, dates/times (token expiry, coupon
expiry), counts (attempts, uses). Table: `EC | Variable | Valid interval | Unit/step | Source tag`.
- **Not ordered -> not applicable** (roles, enums, booleans, formats like "is an email").
  State "BVA not applicable" with the reason. Never fabricate boundaries to look thorough.
- Define the **smallest step** per variable: 1 for integers, 1 character for length,
  0.01 for money with cents (or 1 VND if the system uses whole dong), 1 second/day for time.
- Convert open limits to closed ones (`x < 100` over integers becomes `x <= 99`) and write
  both forms so the student can check your reading of `<` versus `<=`.

## Stage 2 - Choose the variant (state it and justify it)
For each boundary (a valid interval has a lower boundary LB and an upper boundary UB):

| Variant | Values per boundary | For interval [LB, UB] | Use when |
|---|---|---|---|
| 2-value | boundary + its closest neighbour in the **invalid** side | `LB-1, LB, UB, UB+1` | default for low-risk fields, tight time budget |
| 3-value | boundary + both neighbours | `LB-1, LB, LB+1, UB-1, UB, UB+1` | **default for this assignment** (stricter, matches the slide examples) |

Counts for the exam formula: N boundaries need 2N (2-value) or 3N (3-value) values; if two
boundaries are adjacent or coincide, remove the duplicate values and say so.
The course "9-point" model (slide "Boundary Value Analysis") adds **a nominal value inside the
interval** and the **smallest/largest value the UI or API can physically accept**
(the `-alpha` / `+alpha` extremes, e.g. an empty string, a 10,000-character string,
`Number.MAX_SAFE_INTEGER`). Add them for high-risk fields and mark them `extreme`.

## Stage 3 - Generate boundary values and test cases  -> STOP FOR REVIEW
Rules:
1. **One variable at a time**: vary the variable under test, hold every other variable at a
   valid nominal value (as in the slide: `B = 9` fixed while `A` takes `-100, -99, -98, 98, 99, 100`).
2. Values `LB-1` / `UB+1` are invalid: expected result is the rejection defined by the spec
   (status code + message, no state change). Values in `[LB, UB]` are valid.
3. Reuse test cases already in the domain-testing set if the value is identical; cross-reference
   (`same as FR01-DT-04`) instead of duplicating.
4. Add a column **"Fault it would catch"** (e.g. `<= written instead of <`, limit typed as 52
   instead of 25, off-by-one at LB).
5. Table: `TC ID | Variable | Boundary point | Value | Other inputs | Expected output | Fault it would catch | Source tag`.
   IDs: `FRxx-BVA-nn`.
6. Append the cases to `testcases/<FR-xx>.json` with `"technique": "BVA"` and
   `"result": {"status": "NOT_EXECUTED"}`. Generate string values programmatically
   (e.g. `"a".repeat(n)` or a tiny script) rather than typing them; verify the length with code.

### Per-type recipes
- **String length** (name, address, password): lengths `min-1, min, min+1, max-1, max, max+1`
  using a safe character set. Extras: empty `""` (length 0), whitespace-only, and the
  Vietnamese-diacritics case (`"Nguyen"` vs `"Nguyễn"`): characters versus bytes versus
  UTF-16 units can shift the boundary. Mark these as extras, not core BVA.
- **Money/quantity** (`total_amount`, `quantity`, `price`): `0`, `-1`, `1`, the minimum
  order amount, max, `max+1`, decimals just under/over the step, very large numbers.
- **Time** (token or coupon expiry): `exp-1s`, `exp`, `exp+1s` with an injected clock, a
  short-lived token, or by editing the DB timestamp. If time cannot be controlled, record
  the boundary as "not executable" with the reason and keep the test as NOT_EXECUTED/BLOCKED.
- **Counts** (failed attempts, coupon uses): `n-1, n, n+1` attempts.
- **Code length** (reset token, e.g. 6 digits if confirmed): lengths 5, 6, 7, and value
  range `000000`, `999999` (leading zeros are a classic defect).

## Stage 4 - Self-check
- [ ] Every boundary has a source tag and the interval reading (`<` or `<=`) is written out.
- [ ] Each test varies exactly one variable.
- [ ] No fabricated boundaries for unordered fields.
- [ ] Variant (2-value / 3-value / 9-point) is stated, counts are stated (values per boundary,
      total, duplicates removed).
- [ ] Expected results for invalid neighbours match the status/message found in the code or
      by calling the API, otherwise tagged `[ASSUMED]`.
- [ ] Report is Vietnamese; test data strings are generated and length-checked.

## Output
`report/<FR-xx>/02-boundary-value-analysis.md` with: bang phan hoach co thu tu,
bien the BVA da chon va ly do, bang gia tri bien, bang test case, danh sach "khong ap dung" (kem
ly do), cau hoi mo, han che (loi khong nam o bien, mien that su thuong khong biet truoc).

## Known pitfalls (keep updating in v2, v3, ...)
- AI computes `max+1` wrongly for strings; always generate and measure in code.
- AI treats "less than 100" as `<= 100`; write the interval reading explicitly.
- AI forgets that the UI may cap input (`maxlength`) while the API accepts more: test boundaries
  at API level too, and note UI vs API difference as an observation or a bug.
