import type { Reporter, FullResult } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';

export default class AuthorshipBannerReporter implements Reporter {
  async onEnd(result: FullResult) {
    const reportPath = path.resolve(__dirname, '../playwright-report/index.html');
    if (!fs.existsSync(reportPath)) {
      return;
    }

    try {
      let html = fs.readFileSync(reportPath, 'utf8');
      const studentId = '23120319';
      const studentName = 'Trương Thành Phát';
      const timestamp = new Date().toISOString();

      const banner = `    <div id="authorship-banner" style="background: #0f172a; color: #38bdf8; padding: 12px 24px; font-weight: bold; font-size: 15px; border-bottom: 2px solid #0284c7; display: flex; justify-content: space-between; align-items: center; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <span>👤 Run by: ${studentId} (${studentName})</span>
      <span>🕒 Timestamp: ${timestamp}</span>
      <span>🎓 CSC13003 - Software Testing HW04</span>
    </div>`;

      if (!html.includes('id="authorship-banner"')) {
        html = html.replace('<body>', `<body>\n${banner}`);
        fs.writeFileSync(reportPath, html, 'utf8');
      }
    } catch (err) {
      console.warn('Could not inject authorship banner into report:', err);
    }
  }
}

