---
name: ai-audit-log
description: Record and render the mandatory AI Audit Report (Appendix A, 5-column FIT@HCMUS template) and the 200-300 word AI Critique (Appendix B) for the HW02 domain-testing work. Use this skill after EVERY AI-generated artifact (equivalence classes, test cases, BVA tables, scripts, bug drafts), whenever the user mentions audit, AI log, nhat ky AI, Phu luc A/B, AI critique, disclosure, or asks to export prompts and outputs of the session, even if they do not name the skill.
---

# AI Audit Log and AI Critique

The assignment makes the audit mandatory and requires **verbatim prompts and outputs**:
tool name, date and time, prompt, AI output, plus a verdict with a reason that cites a slide,
an ISTQB section or an RFC, and the student's corrected version.

## Language rules
Skill in English. `report/appendix-*.md` is Vietnamese (the template text is already Vietnamese
inside `scripts/audit.py`). Quoted prompts and outputs stay verbatim in whatever language they were in.

## Honesty rules (non-negotiable)
- Never paraphrase, trim or "clean up" prompts/outputs. Use `audit.py export` to get them from
  the session transcript, or paste them exactly.
- You (the AI) may **propose** a verdict and a reason, but mark them as drafts. The student decides
  VALID / INVALID / INCOMPLETE after checking against the spec, the code and the executed results.
  Do not label an artifact VALID before the related tests were run or reviewed against the source.
- A reason for INVALID/INCOMPLETE must cite something concrete: slide title or number from
  S04 Domain Testing (for example "Step 3. Selecting test cases: each invalid test covers one
  and only one invalid class"), an ISTQB FL section, or an RFC. `audit.py add` refuses
  INVALID/INCOMPLETE entries without a reason.
- Never invent the student's disclosure, signature or conclusion. Leave placeholders.
- If the student used AI outside Claude Code (ChatGPT, Gemini, ...), ask them to paste those
  prompts/outputs; the audit must include every tool declared.

## Procedure

### A. After each AI artifact (every stage of domain-testing, BVA, test-execution)
1. Identify the artifact (id `A01`, `A02`, ...) and its step label, e.g. `FR-01 / Domain Testing / Stage 2`.
2. Save the exact prompt and exact output to temp files (or use the export, see C).
3. Ask the student for the verdict, or propose one with the evidence (a diff between AI version and
   final version is the best evidence: what was added, removed, corrected).
4. Record:
   ```bash
   python3 .claude/skills/ai-audit-log/scripts/audit.py add \
     --id A03 --step "FR-01 / BVA / Stage 3" --tool "Claude Code (<model name>)" \
     --prompt-file /tmp/p.txt --output-file /tmp/o.txt \
     --verdict INCOMPLETE --reason-file /tmp/r.txt --fix-file /tmp/fix.txt
   ```
   `--time` defaults to now (format `HH:MM DD/MM/YYYY`). The log is `audit/audit-log.jsonl`.
5. Use the `fix` field for the corrected artifact or the added lines, so Appendix A shows what changed.

### B. Granularity
One entry per **artifact**, not per chat turn: the equivalence-class table, the TC table, the
BVA table, the runner script, each bug-report draft are separate entries. Small clarification
chats do not need entries but must remain in the raw export.

### C. Raw export (proof of the whole session)
Claude Code stores each session as a JSONL transcript under `~/.claude/projects/<project>/`.
```bash
ls -t ~/.claude/projects/*/*.jsonl | head -3
python3 .claude/skills/ai-audit-log/scripts/audit.py export --transcript <file.jsonl> --out audit/raw/<date>-session.md
```
Include `audit/raw/` in the zip as supporting material. If the transcript format differs, read
one line and adjust `extract_text` in the script (do not hand-edit the exported content).

### D. Build Appendix A
```bash
python3 .claude/skills/ai-audit-log/scripts/audit.py build \
  --name "<HỌ TÊN IN HOA>" --mssv <MSSV> --cls "<lớp/khoá>" --hw "HW#02" --out report/appendix-A-ai-audit.md
```
It renders sections 1-6 of the FIT template: student info, instructions, audit table with one
block per artifact, accuracy summary (counts and percentages computed from the log), a
placeholder for the 80-150 word conclusion, and the mandatory disclosure. **Leave the conclusion,
the disclosure blanks and the signature for the student.** After the student writes them, run
`wc -w` on the conclusion and keep it within 80-150 words.
Convert to PDF for submission only when the student asks (use the `pdf` skill or pandoc if installed).

### E. Appendix B - AI Critique (200-300 words, Vietnamese)
Only draft it when the student asks, from evidence in the audit log and `skills-changelog.md`,
and tell the student it is a draft to rewrite in their own voice. It must answer the three
assignment questions, each with a concrete example from this project:
1. Where did the AI get something wrong, biased or incomplete?
2. Why did it fail to catch the issue (prompt quality, tool limits, feature complexity)?
3. What principle about collaborating with AI did you learn?
Check the length with `wc -w` (target 200-300) and cite artifact ids (A07 ...).
Do not write generic statements ("AI can hallucinate"); every sentence should point to something
that happened in this assignment.

## Output
`audit/audit-log.jsonl`, `audit/raw/*.md`, `report/appendix-A-ai-audit.md`,
`report/appendix-B-ai-critique.md`.

## Known pitfalls
- Entries written at the end from memory are unreliable: log as you go.
- Mixing several artifacts in one entry hides which part was wrong: split them.
- A verdict of VALID for everything is a red flag for the grader; if the AI really was right,
  say what check proved it.
