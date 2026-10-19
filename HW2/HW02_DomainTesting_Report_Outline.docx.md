# HW02 – Domain Testing on EShop

Report Outline and Work Checklist

**Student:** \[Full name\]

**Student ID:** \[Student ID\]

**Course:** Software Testing

**System Under Test:** EShop — https\://github.com/ttbhanh/eshop-sut

**AI tools used:** \[List tools actually used\]

**Submission deadline:** Check the Moodle submission link.

# **Important feature-selection check**

The assignment requires four features, one from each pool. Your current selection is FR-01, FR-03, FR-08, and FR-12. FR-01 and FR-03 are both in Pool A; FR-08 is in Pool B; FR-12 is in Pool C. None is from Pool D (Mobile App). Therefore, this selection does not satisfy the stated one-feature-per-pool rule. Confirm with your lecturer/TA or replace one of the Pool A features with an eligible Pool D feature. This outline retains all four selected features while you resolve this issue.

# **1\. What you need to do**

1. Read the lecture materials on Domain Testing and Boundary Value Analysis (BVA).  
2. Review the EShop repository and identify actual behavior, input fields, validation rules, roles, and preconditions for each feature.  
3. For every feature, use AI step by step to identify domains/equivalence classes, valid and invalid partitions, boundaries, and candidate test cases.  
4. Review and refine all AI output yourself; do not submit raw AI output without review.  
5. Execute test cases where possible and record actual results and evidence. Do not mark unexecuted tests as passed.  
6. Report discovered bugs in Markdown and GitHub Issues, attaching screenshots to issues.  
7. Document AI gaps and why cases or bugs were missed.  
8. Maintain an AI Audit Log for every AI interaction used.  
9. Write the mandatory 200–300-word AI Critique.  
10. Create a separate Git commit for each testing-procedure step for each feature and export the commit log to a text file.  
11. Prepare README, test summary, self-assessment, supporting evidence, and submission ZIP.

# **2\. Feature selection and scope**

| Feature | Pool in assignment | Planned scope |
| :---- | :---- | :---- |
| FR-01 — Account registration | Pool A | Registration inputs, validation, success/failure behavior |
| FR-03 — Forgot password and password reset (two steps) | Pool A | Request reset and complete password reset; token/code and password rules if implemented |
| FR-08 — Checkout | Pool B | Checkout preconditions, required data, order submission and validation |
| FR-12 — Access control | Pool C | Authorization rules for protected admin functions/pages |

Selection status: Needs confirmation or correction because Pool D is not represented and Pool A is selected twice. Do not silently assume this is acceptable.

# **3\. Main report outline**

## **3.1 Introduction**

* Purpose of the assignment  
* Brief description of EShop and tested version/environment  
* Selected features and scope  
* Tools used, including AI and test/execution tools

## **3.2 Test Environment and Approach**

* Repository/commit or version tested  
* Setup steps and test accounts/data  
* Browser, OS, database, and other relevant environment details  
* How Domain Testing and BVA were applied  
* Limitations

## **3.3 FR-01 — Account Registration**

* Feature understanding and requirements: actual registration flow, inputs, confirmed validation rules, preconditions, and expected behavior.  
* Domain Testing: identify inputs; partition valid/invalid domains; choose representative values; combine relevant classes; generate with AI; review/refine; execute and record results.  
* Boundary Value Analysis: identify real length, format, or numeric boundaries; test below/at/above values where applicable; explain choices; record results.  
* AI gap analysis: cases/defects AI missed, evidence, likely cause, and human corrections.

## **3.4 FR-03 — Forgot Password and Password Reset (Two Steps)**

* Describe confirmed behavior and requirements for both stages: (1) request reset and (2) submit reset token/code and new password.  
* Apply Domain Testing and BVA separately where appropriate; include token/code behavior only if supported by the actual SUT.  
* Record execution results, evidence, and AI gap analysis.

## **3.5 FR-08 — Checkout**

* Document prerequisites, cart/order data, and the actual checkout flow.  
* Apply Domain Testing to valid/invalid combinations and equivalence classes.  
* Apply BVA to quantities, lengths, totals, or other boundaries only where the application defines them.  
* Record execution results, evidence, and AI gap analysis.

## **3.6 FR-12 — Access Control**

* Identify roles, protected routes/actions, and expected access rules from the actual SUT.  
* Apply Domain Testing to authorized/unauthorized users, authentication states, and role/resource combinations.  
* Use BVA only where genuine boundaries exist; do not force numerical boundaries where none apply.  
* Record execution results, evidence, and AI gap analysis.

## **3.7 Consolidated Bug Reports**

* Bug ID/title and feature/environment  
* Preconditions and test data; steps to reproduce  
* Expected result vs actual result  
* Severity/priority with rationale  
* Screenshot/evidence and GitHub Issue URL  
* Status: confirmed / unable to reproduce / not yet verified

If no bugs are found, state the scope and execution performed; do not invent bugs.

## **3.8 Test Summary Report**

* Number of features covered  
* Test cases designed, executed, passed, failed, and not yet executed  
* Number of confirmed bugs  
* Test environment and major limitations  
* Links to bug issues and demo videos, if any

## **3.9 Conclusion**

Summarize coverage, main findings, unresolved risks, and lessons about Domain Testing, BVA, and human review of AI-generated output.

# **4\. Mandatory Appendix A — AI Audit Report**

If AI was used, declare: “I use AI tools for the following tasks.” For every interaction, record:

* AI tool name  
* Date and time  
* Exact prompt  
* Relevant AI output  
* Human review: accepted/rejected/corrected/added  
* Verification method/evidence

Do not fabricate prompts, timestamps, outputs, or verification. Preserve the actual conversation/log.

# **5\. Mandatory Appendix B — AI Critique (200–300 words)**

* What did the AI get wrong, bias, or leave incomplete?  
* Why did it miss the issue (prompt quality, tool limitations, unclear requirements, feature complexity, or lack of execution context)?  
* What principle did you learn about collaborating with AI?

Use concrete examples from your own work. The critique must reflect observed results, not hypothetical issues.

# **6\. Git Commit Log**

Create a commit for each testing-procedure step for each feature. Export actual repository data in a text file using a format such as:

\<commit-hash\> \<date\> \<feature\> \<step\> \<short description\>

# **7\. README.md**

* Assignment title and student details  
* Feature list and selection-status note  
* How to reproduce/review the work  
* Self-assessment table  
* Test summary counts  
* Bug report/GitHub Issues links  
* Demo video links, if any  
* List of files included in the submission

| Criterion | Maximum grade | Self-assessed grade | Evidence / rationale |
| :---- | :---- | :---- | :---- |
| Feature A — Domain \+ Boundary | 25 | \[ \] | \[ \] |
| Feature B — Domain \+ Boundary | 25 | \[ \] | \[ \] |
| Feature C — Domain \+ Boundary | 25 | \[ \] | \[ \] |
| Feature D — Mobile, Domain \+ Boundary | 15 | \[ \] | \[ \] |
| Agent Skills | 10 | \[ \] | \[ \] |
| Total | 100 | \[ \] | \[ \] |

The assessment template specifically labels Feature D as Mobile. Confirm the feature-selection rule with the lecturer/TA before deciding how your selected features map to grading rows.

# **8\. Suggested submission folder**

\<StudentID\>\_HW02\_AI\_DomainTesting\_\<SelfAssessedGrade\>/  
├── README.md  
├── report/  
│   ├── Main\_Report.md  
│   ├── Main\_Report.pdf  
│   ├── AI\_Critique.md  
│   ├── AI\_Critique.pdf  
│   ├── AI\_Audit\_Report.md  
│   └── AI\_Audit\_Report.pdf  
├── bugs/  
│   ├── Bug\_Reports.md  
│   └── screenshots/  
├── logs/  
│   └── git\_commit\_log.txt  
├── test-cases/  
│   ├── FR-01/  
│   ├── FR-03/  
│   ├── FR-08/  
│   └── FR-12/  
└── evidence/  
    └── \[screenshots, videos, other evidence\]  
Package required materials into a ZIP named \<StudentID\>\_HW02\_AI\_DomainTesting\_\<SelfAssessedGrade\>.zip. The brief explicitly requires the main report in Markdown \+ PDF, AI Critique and AI Audit Report in Markdown \+ PDF, bug reports with screenshots on GitHub Issues, a Git commit log text file, and README with self-assessment and test summary.

# **9\. Final checklist**

☐ Confirm/correct the one-feature-per-pool selection rule.

☐ Review course lecture material on Domain Testing and BVA.

☐ Confirm feature behavior from the SUT rather than assuming requirements.

☐ Complete Domain Testing for every feature.

☐ Complete BVA for every feature.

☐ Review AI output and document gaps.

☐ Execute tests and record truthful results.

☐ Report confirmed bugs in Markdown and GitHub Issues with screenshots.

☐ Complete AI Audit Report.

☐ Complete 200–300-word AI Critique.

☐ Export Git commit log.

☐ Complete README, summary counts, and self-assessment.

☐ Export required PDFs and create correctly named ZIP.

☐ Verify all required files are present before Moodle submission.