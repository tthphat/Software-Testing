#!/usr/bin/env python3
"""AI Audit helper for HW02 (CSC13003 AI Audit Report template).

Subcommands
  export  Dump prompts and AI outputs VERBATIM from a Claude Code session transcript (.jsonl)
          into a Markdown file, so the audit never relies on paraphrase.
  add     Append one audit entry (one AI artifact) to audit/audit-log.jsonl.
  build   Render report/appendix-A-ai-audit.vi.md (Vietnamese) with the accuracy summary.

Claude Code transcripts live in ~/.claude/projects/<project-dir>/<session-id>.jsonl.
The format is not a public contract: if export finds nothing, open one line of the file and
adjust `extract_text`.
"""
import argparse
import json
import os
import sys
from collections import Counter
from datetime import datetime

VERDICTS = ("VALID", "INVALID", "INCOMPLETE")


def extract_text(content):
    """Return only the human-visible text from a message `content` (str or block list)."""
    if isinstance(content, str):
        return content.strip()
    parts = []
    if isinstance(content, list):
        for block in content:
            if isinstance(block, dict) and block.get("type") == "text" and block.get("text"):
                parts.append(block["text"].strip())
    return "\n\n".join(p for p in parts if p)


def fence(text):
    ticks = "````"
    while ticks in text:
        ticks += "`"
    return f"{ticks}text\n{text}\n{ticks}"


def cmd_export(a):
    turns = []  # list of dicts: role, time, text
    with open(a.transcript, encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
            except json.JSONDecodeError:
                continue
            msg = obj.get("message") if isinstance(obj.get("message"), dict) else None
            role = (msg or {}).get("role") or obj.get("type")
            if role not in ("user", "assistant") or obj.get("isMeta"):
                continue
            text = extract_text((msg or {}).get("content", obj.get("content", "")))
            if not text:
                continue  # tool calls / tool results carry no visible text
            turns.append({"role": role, "time": obj.get("timestamp", ""), "text": text})

    out, p = [], 0
    out.append(f"# Raw AI session export\n\nSource: `{a.transcript}`  \nExported: {datetime.now().isoformat(timespec='seconds')}\n")
    i = 0
    while i < len(turns):
        t = turns[i]
        if t["role"] == "user":
            p += 1
            out.append(f"\n## [P{p:02d}] Prompt - {t['time']}\n\n{fence(t['text'])}\n")
            replies = []
            j = i + 1
            while j < len(turns) and turns[j]["role"] == "assistant":
                replies.append(turns[j]["text"])
                j += 1
            if replies:
                out.append(f"\n### [P{p:02d}-OUT] AI output\n\n{fence(chr(10).join(replies))}\n")
            i = j
        else:
            i += 1
    os.makedirs(os.path.dirname(a.out) or ".", exist_ok=True)
    with open(a.out, "w", encoding="utf-8") as fh:
        fh.write("\n".join(out))
    print(f"Exported {p} prompts to {a.out}")


def read_arg_text(value, file_value):
    if file_value:
        with open(file_value, encoding="utf-8") as fh:
            return fh.read().strip()
    return (value or "").strip()


def cmd_add(a):
    if a.verdict not in VERDICTS:
        sys.exit(f"verdict must be one of {VERDICTS}")
    entry = {
        "id": a.id,
        "step": a.step,
        "tool": a.tool,
        "time": a.time or datetime.now().strftime("%H:%M %d/%m/%Y"),
        "prompt": read_arg_text(a.prompt, a.prompt_file),
        "output": read_arg_text(a.output, a.output_file),
        "verdict": a.verdict,
        "reason": read_arg_text(a.reason, a.reason_file),
        "fix": read_arg_text(a.fix, a.fix_file),
    }
    if not entry["prompt"] or not entry["output"]:
        sys.exit("prompt and output are required (verbatim); use --prompt-file / --output-file")
    if a.verdict != "VALID" and not entry["reason"]:
        sys.exit("INVALID/INCOMPLETE entries need a reason that cites a slide, ISTQB section, or RFC")
    os.makedirs(os.path.dirname(a.log) or ".", exist_ok=True)
    with open(a.log, "a", encoding="utf-8") as fh:
        fh.write(json.dumps(entry, ensure_ascii=False) + "\n")
    print(f"Added {a.id} ({a.verdict}) to {a.log}")


def cmd_build(a):
    entries = []
    with open(a.log, encoding="utf-8") as fh:
        for line in fh:
            if line.strip():
                entries.append(json.loads(line))
    total = len(entries)
    c = Counter(e["verdict"] for e in entries)
    pct = lambda n: f"{(100 * n / total):.0f}%" if total else "0%"
    tools = sorted({e["tool"] for e in entries})
    L = []
    L.append("# Phụ lục A - AI Audit Report\n")
    L.append("CS423 / CSC13003 - Kiểm chứng Phần mềm (AI-augmented · 2026) - Biểu mẫu 5 mục cho mỗi artifact\n")
    L.append("## 1. Thông tin sinh viên\n")
    L.append("| Mục | Giá trị |\n|---|---|")
    L.append(f"| Họ tên sinh viên (in hoa) | {a.name} |")
    L.append(f"| MSSV | {a.mssv} |")
    L.append(f"| Lớp / Khoá | {a.cls} |")
    L.append(f"| Mã bài tập | {a.hw} |")
    L.append(f"| Ngày làm bài | {a.date} |")
    L.append(f"| Công cụ AI đã dùng | {', '.join(tools) if tools else 'Không'} |")
    L.append(f"| Có dùng AI | {'[x] Có [ ] Không' if total else '[ ] Có [x] Không'} |\n")
    L.append("## 2. Hướng dẫn\nMỗi artifact do AI sinh có một mục bên dưới, gồm: (1) prompt + công cụ, (2) output AI, "
             "(3) verdict, (4) lý do (dẫn chiếu slide/ISTQB/RFC), (5) bản sinh viên sửa. Prompt và output được dán nguyên văn.\n")
    L.append("## 3. Bảng audit - 1 mục / artifact\n")
    L.append("| # | Bước | Công cụ | Verdict |\n|---|---|---|---|")
    for e in entries:
        L.append(f"| {e['id']} | {e['step']} | {e['tool']} | {e['verdict']} |")
    L.append("")
    for e in entries:
        L.append(f"### Artifact {e['id']} - {e['step']}\n")
        L.append(f"**(1) Prompt + Công cụ** - Tool: {e['tool']} - Thời gian: {e['time']}\n\n{fence(e['prompt'])}\n")
        L.append(f"**(2) Output AI**\n\n{fence(e['output'])}\n")
        L.append(f"**(3) Verdict:** {e['verdict']}\n")
        L.append(f"**(4) Lý do (ISTQB / slide):** {e['reason'] or '(không cần: dùng nguyên)'}\n")
        L.append(f"**(5) Bản sinh viên sửa:**\n\n{fence(e['fix']) if e['fix'] else '(không sửa)'}\n")
    L.append("## 4. Tổng kết độ chính xác AI\n")
    L.append("| Chỉ số | Số lượng | Tỉ lệ |\n|---|---|---|")
    L.append(f"| Tổng artifact AI sinh đã audit | {total} | 100% |")
    L.append(f"| VALID (đúng, dùng nguyên) | {c['VALID']} | {pct(c['VALID'])} |")
    L.append(f"| INVALID (sai; loại bỏ) | {c['INVALID']} | {pct(c['INVALID'])} |")
    L.append(f"| INCOMPLETE (chấp nhận sau khi sửa) | {c['INCOMPLETE']} | {pct(c['INCOMPLETE'])} |\n")
    L.append("## 5. Kết luận - Khi nào nên / không nên dùng AI?\n")
    L.append("<!-- SINH VIÊN TỰ VIẾT 80-150 chữ: AI mạnh ở đâu, sai ở đâu, khuyến nghị. Xoá dòng này sau khi viết. -->\n")
    L.append("## 6. Mandatory Disclosure\n")
    L.append("> Test case / script / báo cáo này được sinh phiên bản đầu bởi " + (", ".join(tools) or "[tên công cụ AI]") +
             "; tôi đã rà soát và chỉnh sửa [phần X], bổ sung [edge case Y, Z]; [phần W] do tôi tự viết. "
             "AI Audit Report chi tiết đính kèm ở Phụ lục A. Tôi cam đoan không dùng AI để sinh bất kỳ artifact nào thuộc danh mục bị cấm.\n")
    L.append("<!-- SINH VIÊN điền [phần X], [Y, Z], [phần W] bằng nội dung thật; ký tên: -->\n")
    L.append(f"Họ tên sinh viên (in hoa): {a.name}  \nMSSV: {a.mssv}  \nLớp / Khoá: {a.cls}  \n"
             "Môn học: CS423 / CSC13003 - Kiểm chứng Phần mềm  \nGiảng viên:  \nNgày:  \nChữ ký:\n")
    os.makedirs(os.path.dirname(a.out) or ".", exist_ok=True)
    with open(a.out, "w", encoding="utf-8") as fh:
        fh.write("\n".join(L))
    print(f"Built {a.out}: {total} artifacts (VALID {c['VALID']}, INVALID {c['INVALID']}, INCOMPLETE {c['INCOMPLETE']})")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = ap.add_subparsers(dest="cmd", required=True)

    e = sp.add_parser("export")
    e.add_argument("--transcript", required=True)
    e.add_argument("--out", default="audit/raw/session.md")
    e.set_defaults(fn=cmd_export)

    d = sp.add_parser("add")
    d.add_argument("--log", default="audit/audit-log.jsonl")
    d.add_argument("--id", required=True, help="e.g. A01")
    d.add_argument("--step", required=True, help="e.g. 'FR-01 / Domain Testing / Stage 2'")
    d.add_argument("--tool", required=True, help="e.g. 'Claude Code (Claude Sonnet 5.5)'")
    d.add_argument("--time", help="HH:MM DD/MM/YYYY (defaults to now)")
    for f in ("prompt", "output", "reason", "fix"):
        d.add_argument(f"--{f}")
        d.add_argument(f"--{f}-file")
    d.add_argument("--verdict", required=True, choices=VERDICTS)
    d.set_defaults(fn=cmd_add)

    b = sp.add_parser("build")
    b.add_argument("--log", default="audit/audit-log.jsonl")
    b.add_argument("--out", default="report/appendix-A-ai-audit.vi.md")
    b.add_argument("--name", default="[HỌ TÊN]")
    b.add_argument("--mssv", default="[MSSV]")
    b.add_argument("--cls", default="[LỚP / KHOÁ]")
    b.add_argument("--hw", default="HW#02")
    b.add_argument("--date", default=datetime.now().strftime("%d/%m/%Y"))
    b.set_defaults(fn=cmd_build)

    a = ap.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
