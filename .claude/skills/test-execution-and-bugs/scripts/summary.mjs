#!/usr/bin/env node
// Aggregate test counts for the README test summary. Usage: node summary.mjs [testcases-dir]
// Counts: designed, executed (PASS+FAIL), passed, failed, blocked, not executed.
import fs from "node:fs";
import path from "node:path";

const dir = process.argv[2] || "testcases";
const files = fs.readdirSync(dir).filter((f) => /^FR-\d+\.json$/.test(f)).sort();
const rows = [];
const total = { designed: 0, executed: 0, passed: 0, failed: 0, blocked: 0, notExecuted: 0 };

for (const f of files) {
  const suite = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  const r = { feature: suite.feature || f, designed: 0, executed: 0, passed: 0, failed: 0, blocked: 0, notExecuted: 0 };
  for (const tc of suite.cases || []) {
    r.designed++;
    const s = tc.result?.status || "NOT_EXECUTED";
    if (s === "PASS") { r.executed++; r.passed++; }
    else if (s === "FAIL") { r.executed++; r.failed++; }
    else if (s === "BLOCKED") r.blocked++;
    else r.notExecuted++;
  }
  rows.push(r);
  for (const k of Object.keys(total)) total[k] += r[k];
}

const line = (r) => `| ${r.feature} | ${r.designed} | ${r.executed} | ${r.passed} | ${r.failed} | ${r.blocked} | ${r.notExecuted} |`;
console.log("| Feature | Designed | Executed | Passed | Failed | Blocked | Not executed |");
console.log("|---|---|---|---|---|---|---|");
rows.forEach((r) => console.log(line(r)));
console.log(line({ feature: "**Total**", ...total }));
console.log(`\nFeatures: ${rows.length}. Note: "Executed" = PASS + FAIL. Blocked cases could not run and are counted separately.`);
