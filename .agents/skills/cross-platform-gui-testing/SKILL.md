---
name: cross-platform-gui-testing
description: Plan, execute and document Cross-Browser and Cross-Platform GUI Testing across at least 3 platforms (e.g. Chrome, Firefox, Safari/BrowserStack or Expo Go Mobile App on real phone) as required by HW03 Task 3. Enforces student email watermark overlay on all screenshots, cross-platform UI skew analysis, and discrepancy defect logging. Use whenever verifying UI consistency across devices, testing responsive layouts, or setting up multi-platform test evidence.
---

# Cross-Platform GUI Testing (CSC13003 S13 Method)

## 1. Goal & Requirements
Execute GUI Checklist Testing across **at least three (3) distinct platforms** to detect cross-platform visual inconsistencies, functional discrepancies, and responsive layout breakages.

### Supported Platform Combinations (Pick 1 valid set of $\ge 3$):
- **Combination A (Recommended - Highest authenticity)**:
  1. Desktop Chrome (Windows / macOS)
  2. Desktop Firefox (Windows / macOS)
  3. Real Mobile Device via **Expo Go** (Android / iOS) *(Explicitly permitted by course specification to replace Safari)*
- **Combination B (Cloud Testing)**:
  1. Desktop Chrome (Windows)
  2. Desktop Firefox (Windows)
  3. Desktop Safari via BrowserStack / LambdaTest trial (macOS)
- **Combination C (Mobile Web)**:
  1. Desktop Chrome
  2. Desktop Firefox
  3. Chrome on Android / Safari on iOS (Real device)

---

## 2. SUT Immutability Rule (Strict Zero-Modification Policy)
- **DO NOT modify, edit, or patch any code inside `eshop-sut/`** (including `backend/`, `frontend-web/`, `frontend-admin/`, and `frontend-mobile/`).
- The SUT is the target under test and must be treated as a strict read-only black-box. Any cross-platform visual defect, layout breakage, or behavioral discrepancy between browsers/devices must be documented in the discrepancy matrix and logged as a bug, NEVER patched in the source code.
- All test evidence, screenshots, and cross-platform comparison reports must be placed exclusively inside the project's designated output directory (`<OUTPUT_DIR>`, configured by the workspace `CLAUDE.md`), never inside `eshop-sut/`.

---

## 3. Mandatory Evidence Rules (Anti-Fraud Constraints)
1. **Student Username Overlay**:
   - Every captured screenshot **MUST have an overlay/watermark** of your student email (e.g., `21127xxx@student.hcmus.edu.vn`).
   - The overlay can be applied via image editing tool, browser extension, or system screenshot annotation.
2. **Platform & URL Context Visibility**:
   - Web screenshots must clearly display the browser header/tab, OS window frame, and localhost/tunnel URL.
   - Mobile screenshots must display the device status bar (battery, Wi-Fi/carrier) and navigation frame.
3. **Form Submissions Evidence**:
   - When submitting forms (Register, Login, Checkout), the inputs should contain the student's name or student ID where appropriate to prove authentic manual execution.
4. **Evidence Directory & Naming Structure (Mandatory 45 Case Folders)**:
   All cross-platform screenshot evidence is strictly organized into **45 dedicated case folders** inside `<OUTPUT_DIR>/evidence/screenshots/cross-platform/` corresponding to the 45 checklist test cases:
   - **For 35 Web & Admin cases** (`CHK-ADM-01` to `CHK-ADM-20` and `CHK-WEB-01` to `CHK-WEB-15`):
     Each case folder contains 3 watermarked screenshots across Chrome, Firefox, and Safari (BrowserStack/macOS), following the naming template `<CASE_ID>-<platform>.png`:
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
   ├── CHK-WEB-01/
   │   ├── CHK-WEB-01-chrome.png
   │   ├── CHK-WEB-01-firefox.png
   │   └── CHK-WEB-01-safari.png
   ├── ...
   └── CHK-MOB-01/
       └── CHK-MOB-01-expo.jpg
   ```

---

## 4. Execution & Cross-Platform Skew Detection Protocol

### Step 1: Environment Setup
- **Web Browsers**: Launch Google Chrome (latest) and Mozilla Firefox (latest) pointing to `http://localhost:5173` (or active web port).
- **Mobile Platform**: Launch Expo Go on real smartphone pointing to the Metro Bundler tunnel or LAN URL (`exp://...`).
- Verify backend is running and accessible on all 3 targets.

### Step 2: Comparative Verification Focus Areas
Pay special attention to discrepancies between platforms:
1. **Typography & Font Rendering**:
   - Do font weights, line-heights, or Vietnamese diacritics render differently on Gecko (Firefox) vs Blink (Chrome) vs React Native (Mobile)?
2. **Form Controls & Inputs**:
   - Date pickers, select dropdowns, and button borders often render using native OS widgets on mobile vs custom CSS on web.
   - Virtual keyboard popup behavior on mobile: Does it push up the view or occlude the input/submit button?
3. **Responsive Breakpoints & Layout Flow**:
   - Flexbox wrapping differences.
   - Image scaling and aspect ratios (`placehold.co` images).
4. **Validation Discrepancies (Client-side Skew)**:
   - Does Web validate email format with HTML5 `type="email"` while Mobile uses regex?
   - Does Mobile block empty submissions via Alert while Web uses inline text?
5. **Network & Error Recovery**:
   - How does each platform behave when backend response times out?

---

## 5. Documentation & Reporting Matrix
Document execution in `<OUTPUT_DIR>/report/cross-platform-report.md` using the matrix format:

| Checklist Item ID | Tiêu chí kiểm tra | Platform 1 (Chrome Web) | Platform 2 (Firefox Web) | Platform 3 (Expo Go Mobile) | Phát hiện sai lệch (Platform Skew / Bug) | Screenshot Evidence |
|:---:|:---|:---:|:---:|:---:|:---|:---|
| CHK-IA01-02 | Font chữ & Bố cục | PASSED | PASSED | PASSED | Hiển thị đồng nhất | [Xem ảnh](file:///...) |
| CHK-IA02-01 | Trường bắt buộc | FAILED | FAILED | FAILED | Cả 3 nền tảng đều thiếu ký hiệu `*` | [Xem ảnh](file:///...) |
| CHK-IA02-07 | Che khuất bởi bàn phím | N/A | N/A | FAILED | Trên Mobile, bàn phím che khuất nút Checkout | [Xem ảnh](file:///...) |
| CHK-IA04-06 | Xử lý mất mạng | FAILED (Màn hình trắng) | FAILED (Màn hình trắng) | FAILED (Network request failed) | Lỗi lệch pha thông báo lỗi giữa Web và Mobile | [Xem ảnh](file:///...) |

---

## 6. Expected Output Artifacts

All artifacts generated by this skill are saved under `<OUTPUT_DIR>` (as configured in the project's `CLAUDE.md`, e.g., `HW3/` or `./`):

| Artifact Path | Format | Purpose & Contents |
|---|---|---|
| `<OUTPUT_DIR>/report/cross-platform-report.md` | Markdown | Comprehensive cross-platform execution matrix across $\ge 3$ platforms (Chrome, Firefox, Expo Go Mobile) detailing layout skews, validation differences, and platform-specific defects. |
| `<OUTPUT_DIR>/evidence/screenshots/cross-platform/<CASE_ID>/` | PNG / JPG | 45 case-specific subdirectories containing watermarked comparative screenshots (`<CASE_ID>-chrome.png`, `<CASE_ID>-firefox.png`, `<CASE_ID>-safari.png` for 35 Web/Admin cases, and `<CASE_ID>-expo.png` for 10 Mobile cases). |
| `<OUTPUT_DIR>/report/issues/BUG-XP-XX.md` | Markdown | Discrepancy defect reports for UI inconsistencies that only manifest on specific platforms or browsers. |

