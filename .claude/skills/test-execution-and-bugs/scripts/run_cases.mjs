#!/usr/bin/env node
// Run API test cases from testcases/<FR>.json against the EShop SUT and write results back.
// Usage: node run_cases.mjs --file testcases/FR-01.json [--config testcases/config.json] [--only ID,ID] [--dry]
// Needs Node 18+ (global fetch). No dependencies.
import fs from "node:fs";

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? def : args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : true;
};
const file = opt("file");
const configPath = opt("config", "testcases/config.json");
const only = opt("only") ? String(opt("only")).split(",") : null;
const dry = args.includes("--dry");
if (!file) {
  console.error("Usage: node run_cases.mjs --file testcases/FR-01.json [--config path] [--only ID,ID] [--dry]");
  process.exit(2);
}

const suite = JSON.parse(fs.readFileSync(file, "utf8"));
const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, "utf8")) : {};
const baseUrl = (suite.base_url || config.base_url || "http://localhost:3000").replace(/\/$/, "");

let counter = 0;
const stamp = Date.now();
const fill = (v) => {
  if (typeof v === "string") return v.replaceAll("{{uniq}}", `${stamp}${++counter}`);
  if (Array.isArray(v)) return v.map(fill);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fill(x)]));
  return v;
};

const tokens = {};
async function tokenFor(role) {
  if (role === "none" || !role) return null;
  if (tokens[role] !== undefined) return tokens[role];
  const creds = config.users?.[role];
  if (!creds) throw new Error(`No credentials for role "${role}" in ${configPath}`);
  const res = await fetch(`${baseUrl}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(creds),
  });
  const data = await res.json().catch(() => ({}));
  if (!data.token) throw new Error(`Login as "${role}" failed (HTTP ${res.status}); cannot run cases needing it`);
  return (tokens[role] = data.token);
}

function check(expected, status, bodyText) {
  const reasons = [];
  if (expected?.status && !expected.status.includes(status))
    reasons.push(`status ${status} not in [${expected.status.join(",")}]`);
  for (const s of expected?.body_includes || [])
    if (!bodyText.includes(s)) reasons.push(`body missing "${s}"`);
  for (const s of expected?.body_excludes || [])
    if (bodyText.includes(s)) reasons.push(`body must not contain "${s}"`);
  return reasons;
}

const results = [];
for (const tc of suite.cases) {
  if (only && !only.includes(tc.id)) continue;
  if (tc.type && tc.type !== "api") continue; // ui / manual cases are executed by hand
  if (!tc.request) continue;
  const started = new Date().toISOString();
  try {
    const req = fill(tc.request);
    const headers = { "Content-Type": "application/json", ...(req.headers || {}) };
    const token = tc.auth_token_override ?? (await tokenFor(tc.auth || "none"));
    if (token) headers.Authorization = `Bearer ${token}`;
    const url = `${baseUrl}${req.path}`;
    if (dry) {
      console.log(`[dry] ${tc.id} ${req.method} ${url}`, req.body ? JSON.stringify(req.body) : "");
      continue;
    }
    const res = await fetch(url, {
      method: req.method,
      headers,
      body: req.body === undefined ? undefined : typeof req.body === "string" ? req.body : JSON.stringify(req.body),
    });
    const bodyText = await res.text();
    const reasons = check(tc.expected, res.status, bodyText);
    tc.result = {
      status: reasons.length ? "FAIL" : "PASS",
      actual_status: res.status,
      actual_body: bodyText.slice(0, 500),
      fail_reasons: reasons,
      executed_at: started,
    };
  } catch (e) {
    tc.result = { status: "BLOCKED", error: String(e.message || e), executed_at: started };
  }
  results.push(tc);
  console.log(`${tc.result.status.padEnd(7)} ${tc.id}  ${tc.title || ""}${tc.result.fail_reasons?.length ? "  <- " + tc.result.fail_reasons.join("; ") : ""}`);
}

if (!dry) {
  fs.writeFileSync(file, JSON.stringify(suite, null, 2) + "\n");
  const n = (s) => results.filter((t) => t.result.status === s).length;
  console.log(`\nExecuted ${results.length}: PASS ${n("PASS")}, FAIL ${n("FAIL")}, BLOCKED ${n("BLOCKED")}. Results written to ${file}`);
}
