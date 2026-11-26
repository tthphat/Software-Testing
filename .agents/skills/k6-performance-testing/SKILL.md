---
name: k6-performance-testing
description: Plan, design, execute, validate, and analyze Performance Testing with Grafana k6 (Load, Stress, Spike, Soak) on EShop SUT REST APIs following CSC13003 HW05 guidelines. Covers multi-stage VU scaling, CSV Data-Driven testing, correlation of JWT auth tokens, 3 distinct report outputs (console summary, HTML dashboard, JSON metrics), automated quality gate validation via validate_k6_plan.mjs, raw log parsing via parse_k6_summary.mjs, and AI misinterpretation hunt for Task 2.
---
# Grafana k6 Performance Testing (CSC13003 HW05 Method)

## 1. Goal & Overview

Deliver a professional, robust performance testing suite using **Grafana k6** against the **EShop REST Backend API** (`https://github.com/ttbhanh/eshop-sut`), strictly adhering to the **AI-First strategy with Human Review** across all 4 Bloom-AI levels:

* **G9.2 (Apply):** Design and execute Load, Stress, and Spike scenarios using k6 JavaScript with multi-stage virtual user (VU) scheduling.
* **G9.3 (Analyse):** Collect raw metrics, evaluate system endurance thresholds (max stable RPS, memory ceiling) with concurrent resource monitoring, and critically identify AI metric misinterpretations.
* **G9.4 (Collaborate):** Guide the AI step-by-step through test plan authoring, parameter tuning, correlation, and optimization feasibility analysis.
* **G9.6 (Disrupt):** Formulate an automated Continuous Performance Testing CI/CD proposal with p95 latency regression flagging and commit-driven gating.

---

## 2. SUT Immutability Rule (Strict Zero-Modification Policy)

- **DO NOT modify, edit, or patch any code inside `eshop-sut/`** (including `backend/`, `frontend-web/`, `frontend-admin/`, and `frontend-mobile/`).
- The SUT is the target under test and must be treated as a **strict read-only black-box**. Any performance bottleneck, slow query, memory leak, unhandled exception, crash, or latency degradation under load must be documented, analyzed in the report, and logged as a GitHub Issue, **NEVER patched or "fixed" in the source code**.
- **Strictly forbidden modifications:**
  - DO NOT alter backend route logic, controllers, database queries, ORM models, or middleware.
  - DO NOT modify database indexes, SQLite PRAGMA settings, connection pooling, or cache layers directly in the SUT source code.
  - DO NOT modify `package.json`, install extra packages in `eshop-sut/`, or disable security/lockout middlewares.
- **Allowed external runtime operations only:**
  - Standard service startup (`npm start`, `node index.js`).
  - Database state cleanup/restoration between test runs (e.g., restoring `database.sqlite` from a clean backup or running a documented unlock SQL script when the 3-fail login lockout is triggered by stress/spike tests).
- All test plans (`.js`), configuration, data files (`users.csv`), raw logs (`.json`), HTML reports, and performance evidence must be placed exclusively inside `HW5/`, **never inside `eshop-sut/`**.

---

## 3. Core Architecture of k6 Test Scripts

Every k6 test script in this suite must implement the following 6 structural components:

### 3.1. End-to-End Workflow Across 3 Endpoint Groups

All 3 scenarios (Load, Stress, Spike) must execute the **SAME unified end-to-end user journey**, traversing:

1. **Auth-heavy Endpoint:** `POST /api/login` (with JWT token capture and user ID assignment).
2. **Read-heavy Endpoint:** `GET /api/products?search=` (with search query) and `GET /api/products/${productId}` (product detail).
3. **Transactional Endpoint:** `POST /api/cart` (add item to cart), `POST /api/apply-coupon`, `POST /api/checkout` (order creation), and `GET /api/orders/my-orders`.

### 3.2. Data-Driven Testing via CSV (`SharedArray`)

* Parameterize virtual users using external CSV files (`users.csv`).
* Load CSV data efficiently into memory using `SharedArray` from `k6/data` so all VUs share memory without duplication or memory bloat:
  ```javascript
  import { SharedArray } from 'k6/data';
  const users = new SharedArray('eshop_users', function () {
    const content = open('./users.csv');
    const lines = content.split('\n').slice(1).filter((l) => l.trim().length > 0);
    return lines.map((line) => {
      const [email, password, id] = line.trim().split(',');
      return { email, password, id: parseInt(id) || 2 };
    });
  });
  ```

### 3.3. Dynamic Correlation & State Chaining

* Extract the authentication `token` from `POST /api/login`.
* Pass the Bearer token in the `Authorization: Bearer ${token}` header for all subsequent protected requests (`/api/cart`, `/api/apply-coupon`, `/api/checkout`, `/api/orders/my-orders`).
* Dynamically extract `productId` from the product list response to pass into detail views and cart payloads.

### 3.4. Realistic Pacing (Think Time)

* Virtual users must never hit the backend with zero delay.
* Stagger initial login: `if (isFirstRun) { sleep(Math.random() * 3); isFirstRun = false; }` so VUs do not flood login at the exact same millisecond.
* Insert randomized delays between actions using `sleep(Math.random() * 2 + 1)` (1s to 3s).

### 3.5. Multi-Level Checks & Thresholds

* **Checks (`check`):** Verify HTTP status codes (`status === 200`), JSON payload formats, token presence, and `orderId`.
* **Thresholds (`options.thresholds`):** Define global and per-endpoint pass/fail SLA criteria:
  ```javascript
  thresholds: {
    http_req_duration: ['p(95)<500'], // P95 latency < 500ms
    http_req_failed: ['rate<0.01'],   // Error rate < 1%
    checks: ['rate>0.99'],            // Assertion success rate > 99%
    'http_req_duration{endpoint:login}': ['p(95)<500'],
    'http_req_duration{endpoint:search}': ['p(95)<500'],
    'http_req_duration{endpoint:checkout}': ['p(95)<500'],
  }
  ```

### 3.6. Three Distinct Report Outputs (Equivalent to JMeter Report Views)

Across the 3 test plans, configure 3 distinct report outputs:

1. **Output 1 — Standalone Interactive HTML Dashboard:** Generated via `handleSummary()` with `bundle.js` (`k6-reporter`) containing interactive latency charts and distribution graphs.
2. **Output 2 — Raw JSON Metrics Summary:** Generated via `handleSummary()` or `--summary-export=summary.json` containing raw unaggregated data points for automated parsing and audit.
3. **Output 3 — CLI Stdout Summary Table:** Granular terminal summary table with per-metric breakdowns.

---

## 4. The 3 Testing Scenarios & Parameter Tuning

```text
               Load Test                     Stress Test                     Spike Test
               (Plateau)                      (Stepped)                       (Surge)
         +-------------------+           +-------------------+               +--+
        /                     \         /|                  / \             /|  |\
       /                       \       / |                 /   \           / |  | \
      /                         \     /  |                /     \         /  |  |  \
  ---+                           +---+   +---------------+       +-------+   +  +   +------
     Ramp     Steady       Down   Step 1   Step 2   Step 3   Down     Base  Peak  Base
```

### 4.1. Load Testing (`{StudentID}_Load_{YYYYMMDD}.js`)

* **Objective:** Verify system baseline performance, throughput (RPS), and latency distribution at expected peak traffic.
* **Stages Configuration:**
  ```javascript
  stages: [
    { duration: '30s', target: 50 },  // Ramp-up to 50 VUs
    { duration: '4m',  target: 50 },  // Steady load plateau
    { duration: '30s', target: 0 },   // Graceful ramp-down
  ]
  ```
* **Primary Output View:** **HTML Dashboard Report** (`23120319_Load_report.html`).

### 4.2. Stress Testing (`{StudentID}_Stress_{YYYYMMDD}.js`)

* **Objective:** Push system beyond nominal capacity step-by-step to detect breaking point, resource saturation, and recovery behavior.
* **Stages Configuration:**
  ```javascript
  stages: [
    { duration: '30s', target: 50 },   // Baseline
    { duration: '1m',  target: 100 },  // Stress level 1
    { duration: '1m',  target: 180 },  // Stress level 2 (High load)
    { duration: '1m',  target: 250 },  // Stress level 3 (Breaking point hunt)
    { duration: '30s', target: 0 },    // Recovery & ramp-down
  ]
  ```
* **Primary Output View:** **CLI Stdout Detailed Summary Table** + Resource Monitor graph capture.

### 4.3. Spike Testing (`{StudentID}_Spike_{YYYYMMDD}.js`)

* **Objective:** Simulate a sudden massive traffic surge (e.g. Flash Sale) and observe if the SUT crashes or gracefully recovers.
* **Stages Configuration:**
  ```javascript
  stages: [
    { duration: '20s', target: 10 },   // Low baseline load
    { duration: '10s', target: 150 },  // Violent surge in 10s!
    { duration: '30s', target: 150 },  // Hold at peak
    { duration: '10s', target: 10 },   // Immediate drop back to base
    { duration: '30s', target: 10 },   // Recovery observation
    { duration: '10s', target: 0 },    // Teardown
  ]
  ```
* **Primary Output View:** **Raw Metrics JSON Stream** (`23120319_Spike_summary.json`) + Time-series latency charts.

### 4.4. Endurance / Soak Testing (Threshold Discovery)

* **Objective:** Run sustained moderate load (e.g. 30–50 VUs) for **10–15 minutes**.
* **Empirical Ground Truth Metrics to Determine:**
  * Maximum Stable Throughput (`RPS`).
  * Memory Ceiling (`MB`) & Node.js garbage collection stability (absence of continuous memory leaks).
  * SQLite active lock time and disk I/O saturation point.

---

## 5. Anti-Cheat & Quality Gate Rules (§11 Enforcement)

Every generated k6 artifact must pass the automated validator `validate_k6_plan.mjs`:

1. **Filename Rule:** Must strictly match:
   $$
   \mathbf{\{StudentID\}\_\{ScenarioType\}\_\{YYYYMMDD\}.js}
   $$

   *Example:* `23120319_Load_20261125.js`, `23120319_Stress_20261125.js`, `23120319_Spike_20261125.js`.
2. **Authorship & Watermark:** Header of every `.js` script must declare:
   ```javascript
   /**
    * Student: TRƯƠNG THÀNH PHÁT - MSSV: 23120319
    * Email: 23120319@student.hcmus.edu.vn
    * Target SUT: EShop Backend API
    */
   ```
3. **Same-Frame Evidence Rule:** Video and screenshots must capture k6 terminal and **Task Manager / Resource Monitor** of `node.exe` in the exact same frame.
4. **Account Lockout Resilience:** When Stress/Spike triggers SQLite 3-fail login lockouts, execute database unlocking step and parameterize separate valid accounts in CSV.
5. **Raw Logs Preservation:** Store raw JSON logs intact for automated verification.

---

## 6. Workflow for the AI Agent

When instructed to apply this skill on the EShop SUT:

1. **Phase 1 — Parameter Calculation:** Compute realistic stage durations, VU targets, and think-times matching the student's hardware.
2. **Phase 2 — Script Generation:** Generate the 3 scripts using templates in `templates/` with CSV data-driven integration and 3 distinct output handles.
3. **Phase 3 — Quality Gate Validation:** Run `node scripts/validate_k6_plan.mjs --dir <target_dir>` and resolve all errors until 0 errors, 0 warnings.
4. **Phase 4 — Execution & Monitoring:** Guide execution via CLI with resource capture commands.
5. **Phase 5 — Metrics Extraction & AI Misinterpretation Hunt (Task 2):** Run `node scripts/parse_k6_summary.mjs --json <raw_summary.json>` to extract true mathematical percentiles (p50, p90, p95, p99, RPS, error rate) to identify and debunk AI hallucinations.
