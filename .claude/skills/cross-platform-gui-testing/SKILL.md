---
name: cross-platform-gui-testing
description: Plan, execute and document HW03 Task 3 (cross-browser / cross-platform GUI testing) for the EShop SUT. Splits the GUI checklist by surface (Customer Web, Admin UI, Mobile Expo Go), runs web and admin items on Chrome, Firefox and Safari (BrowserStack/LambdaTest or real machines) and mobile items on a real phone via Expo Go, then builds the comparison tables, discrepancy bugs and watermarked evidence. Use this skill whenever the user mentions Task 3, cross-browser, cross-platform, BrowserStack, LambdaTest, Expo Go evidence, screenshot overlay with student email, platform comparison matrix, or asks which checklist items to run on which platform, even if they do not say "cross-platform" explicitly.
---

# Cross-Platform GUI Testing (HW03 Task 3)

## 1. What the assignment requires
Re-run the Task 1 GUI checklist on **at least three (3) platforms**.
- Web frontend: Chrome, Firefox, and Safari (or Android Chrome).
- Expo Go on a real phone is a valid platform and may replace one of the three browser platforms (for example Safari). It is a full platform, not a bonus.
- BrowserStack or LambdaTest trial is strongly preferred. If unavailable, another cloud tool (Sauce Labs, CrossBrowserTesting) or real devices are allowed, as long as screenshots clearly show browser / OS / device name next to the SUT's localhost URL.
- Every screenshot carries an overlay with the student identity (see section 3).
- Cross-platform screenshots must be genuine. Never generate, edit or invent evidence, and never record a result that the student did not observe.

## 2. Platform plan (decide this first)
The checklist has three surfaces. Browsers cannot test the native mobile app, and the mobile-only items (hardware Back, safe area, soft keyboard, touch targets) only mean something on a real device. So split the work by surface:

| Surface | Checklist items | Platforms | Where it runs |
|---|---|---|---|
| Customer Web (`http://localhost:5173`) | `CHK-WEB-*` | Chrome, Firefox, Safari | Student's machine for Chrome/Firefox; BrowserStack/LambdaTest for Safari (needs macOS) |
| Admin UI (`http://localhost:5174`) | `CHK-ADM-*` | Chrome, Firefox, Safari | Same as above |
| Mobile app | `CHK-MOB-*` | Expo Go on Android | Student's real phone |

Counting platforms: Chrome + Firefox + Safari + Expo Go = 4. The minimum valid set is Chrome + Firefox + Expo Go (Expo Go replaces Safari), but include Safari when the cloud trial is available because it is the only WebKit engine in the set.

Rules for choosing and describing platforms:
- Chrome, Edge, Brave and Cốc Cốc all use the Chromium engine, so they rarely differ. Treat Edge/Brave/Cốc Cốc as optional extras, not as separate required platforms. Brave Shields and Cốc Cốc built-in features may reveal real issues worth a note.
- If the student has no iPhone, test mobile on Android only. Do not write iOS results, and do not claim "iOS would pass". If the report mentions iOS at all, label it as an untested technical remark.
- Do not assume trial limits of BrowserStack/LambdaTest; they change over time. Tell the student to check the signup page and to prepare scripts and data before opening a session.

## 3. Evidence rules
1. **Identity overlay on every screenshot**: student email, student ID (MSSV) and full name, for example `<email> | <MSSV> - <Full name>`. The course asks for the email as username and, in the anti-cheat section, for ID and full name. Include all three. Read them from the workspace `CLAUDE.md` or ask the student; never invent them.
   Apply the overlay to real screenshots with `scripts/overlay_username.py` or any annotation tool.
2. **Platform and URL visibility** for web shots: browser name and tab/URL bar with `localhost:<port>` and the OS or cloud-session frame must be visible. For BrowserStack/LambdaTest, keep the session frame showing browser, version and OS in the shot.
3. **Mobile shots**: show the device status bar and the Expo Go / app frame. Add a terminal screenshot of the running Metro server if the TA accepts it as URL evidence.
4. **Evidence Directory & Naming Structure (Mandatory 45 Case Folders)**:
   All cross-platform screenshot evidence is strictly organized into **45 dedicated case folders** inside `<OUTPUT_DIR>/evidence/screenshots/cross-platform/` corresponding to the 45 checklist test cases:
   - **For 35 Web & Admin cases** (`CHK-ADM-01` to `CHK-ADM-20` and `CHK-WEB-01` to `CHK-WEB-15`):
     Each case folder contains 3 watermarked screenshots across Chrome, Firefox, and Safari (BrowserStack/macOS), following the exact naming template `<CASE_ID>-<platform>.png`:
     - `<CASE_ID>/<CASE_ID>-chrome.png` (Google Chrome / Windows 11)
     - `<CASE_ID>/<CASE_ID>-firefox.png` (Mozilla Firefox / Windows 11)
     - `<CASE_ID>/<CASE_ID>-safari.png` (Apple Safari / macOS on BrowserStack)
   - **For 10 Mobile App cases** (`CHK-MOB-01` to `CHK-MOB-10`):
     Each case folder contains the watermarked Expo Go mobile screenshot on real Android device:
     - `<CASE_ID>/<CASE_ID>-expo.png` (or `.jpg`)

   Folder structure visualization:
   ```text
   HW3/evidence/screenshots/cross-platform/
   ├── CHK-ADM-01/
   │   ├── CHK-ADM-01-chrome.png
   │   ├── CHK-ADM-01-firefox.png
   │   └── CHK-ADM-01-safari.png
   ├── ...
   ├── CHK-ADM-20/
   │   ├── CHK-ADM-20-chrome.png
   │   ├── CHK-ADM-20-firefox.png
   │   └── CHK-ADM-20-safari.png
   ├── CHK-WEB-01/
   │   ├── CHK-WEB-01-chrome.png
   │   ├── CHK-WEB-01-firefox.png
   │   └── CHK-WEB-01-safari.png
   ├── ...
   ├── CHK-WEB-15/
   │   ├── CHK-WEB-15-chrome.png
   │   ├── CHK-WEB-15-firefox.png
   │   └── CHK-WEB-15-safari.png
   ├── CHK-MOB-01/
   │   └── CHK-MOB-01-expo.jpg
   ├── ...
   └── CHK-MOB-10/
       └── CHK-MOB-10-expo.jpg
   ```
5. **Recommended, not required by the course**: when submitting forms, type the student's name or ID into the inputs to show authentic manual execution.

## 4. Execution protocol

### Step 1: Environment
- Backend and both frontends running on the student's machine. Web and Admin call the backend API, so the backend must stay up during every cloud session.
- Cloud browsers cannot see `localhost` by themselves. Start the provider's tunnel first (BrowserStack Local or LambdaTest Tunnel) so the remote browser can open `localhost:5173`, `localhost:5174` and the API.
- Phone on the same Wi-Fi as the dev machine, app calling the API through the machine's LAN IP, not `localhost`.
- Record the environment in the report: browser and version, OS, device model, Android version, Expo Go version, tunnel tool.

### Step 2: Run the checklist per surface
- Use the student's existing Task 1 checklist (IDs, criteria, expected results) as the single source of items. Do not rewrite items for Task 3.
- Chrome column: copy a result from Task 1 only if Task 1 was actually executed on Chrome against the same build. Otherwise re-run it.
- For each item the student reports Passed or Failed, and the assistant records it. Never fill in cells the student has not observed.
- Capture a screenshot for every Failed item and for every item whose result differs from Chrome.

### Step 3: Compare and classify
For each item that fails or differs, classify:
- **Common defect**: fails on every platform. Link the existing Task 1 bug (`BUG-GUI-XX`), do not open a duplicate.
- **Platform-specific defect**: fails or looks different on some platforms only. Create a `BUG-XP-XX` entry.
- **Environment artifact**: caused by the cloud session or test setup (tunnel latency, trial viewport). Note it, do not file it as a bug.

### Step 4: Focus areas where platforms really differ
Web and Admin (Blink vs Gecko vs WebKit):
- Font rendering, line height, Vietnamese diacritics, currency format (`150,000 ₫`).
- Native form controls: `type="date"`, `type="number"`, select dropdowns, scrollbars, focus rings.
- Flexbox/grid wrapping, sticky headers, image aspect ratios, responsive breakpoints.
- Client-side validation differences (HTML5 validation messages differ per browser).
- Download behaviour (admin CSV template) and file dialogs.

Mobile (Expo Go on Android):
- Hardware/gesture Back (`CHK-MOB-08`), safe area and status bar (`CHK-MOB-09`), soft keyboard covering the submit button (`CHK-MOB-10`), touch targets, return key behaviour.
- Network failure behaviour compared with the web error handling.

## 5. Report structure
Write `<OUTPUT_DIR>/report/cross-platform-report.md` in Vietnamese (keep IDs, identifiers and code in English). Use two main tables plus a summary. Status values are exactly `Passed` or `Failed`, matching Task 1. The rows below only illustrate the format, they are not results.

### 5.1 Environment
| Platform | Tool | OS / Device | Browser / App version | Tunnel |
|---|---|---|---|---|
| Chrome | Local machine | `<OS>` | `<version>` | none |
| Firefox | `<Local or cloud>` | `<OS>` | `<version>` | `<tool or none>` |
| Safari | `<BrowserStack or LambdaTest>` | macOS `<version>` | `<version>` | `<tool>` |
| Expo Go | Real phone | Android `<version>`, `<model>` | Expo Go `<version>` | LAN |

### 5.2 Table 1: Web + Admin (one row per `CHK-WEB-*` and `CHK-ADM-*`)
| Item ID | Surface | Criterion (short) | Chrome | Firefox | Safari | Differs? | Notes / Screenshot |
|:---:|:---|:---|:---:|:---:|:---:|:---:|:---|
| `<ID>` | Admin Login | `<criterion>` | Passed | Passed | Failed | Yes | `<what differs>`, `safari-<ID>.png` |
| `<ID>` | Admin Category | `<criterion>` | Failed | Failed | Failed | No | Common defect, see `BUG-GUI-XX` |

### 5.3 Table 2: Mobile (one row per `CHK-MOB-*`, single Android column)
Header lines: device model, Android version, Expo Go version.

| Item ID | Screen | Criterion (short) | Android (Expo Go) | Notes / Screenshot |
|:---:|:---|:---|:---:|:---|
| `<ID>` | Navigation | `<criterion>` | Failed | `<observed behaviour>`, `expo-<ID>.png` |

### 5.4 Table 3: Platform summary
| Platform | Tool | Items run | Passed | Failed | Items differing from Chrome |
|---|---|---|---:|---:|---:|
| Chrome | | | | | n/a |
| Firefox | | | | | |
| Safari | | | | | |
| Expo Go (Android) | | | | | n/a |

### 5.5 Findings
List platform-specific defects (`BUG-XP-XX`), environment artifacts, and the answers the student received from the TA for the open questions in section 2.

## 6. SUT immutability rule
Do not modify any code inside `eshop-sut/` (`backend/`, `frontend-web/`, `frontend-admin/`, `frontend-mobile/`). The SUT is a read-only black box. Visual or behavioural discrepancies are documented and logged as bugs, never patched. Write all evidence and reports under `<OUTPUT_DIR>` (from the workspace `CLAUDE.md`), never inside `eshop-sut/`.

## 7. Expected artifacts
| Path | Purpose |
|---|---|
| `<OUTPUT_DIR>/report/cross-platform-report.md` | Environment, Table 1, Table 2, Table 3, findings |
| `<OUTPUT_DIR>/evidence/screenshots/cross-platform/<CASE_ID>/` | 45 case subdirectories containing watermarked screenshots (`<CASE_ID>-chrome.png`, `<CASE_ID>-firefox.png`, `<CASE_ID>-safari.png` for 35 Web/Admin cases, and `<CASE_ID>-expo.png` for 10 Mobile cases) |
| `<OUTPUT_DIR>/report/issues/BUG-XP-XX.md` | Platform-specific discrepancy bugs, each with screenshot (also create a GitHub issue when the course expects bugs there) |
| Git commit | One commit per step: environment setup, each platform run, comparison analysis |

## 8. Honesty rules
- Record only what the student executed and saw. Leave a cell empty instead of guessing.
- Never create, alter or reuse a screenshot from another platform to fill a gap.
- Never state results for hardware the student does not have (no iOS results without an iPhone).
- Keep platform names accurate: Edge, Brave and Cốc Cốc are Chromium browsers, not independent engines.
