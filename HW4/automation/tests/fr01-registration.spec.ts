import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Load external data-driven test cases (FR-01: Account Registration)
const dataFilePath = path.resolve(__dirname, '../data/fr01-registration.json');
const testCases = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

test.describe('FR-01: Account Registration - Web UI Automation', () => {
  test.beforeEach(async ({ page, context }) => {
    // Isolate browser context and clear storage before each test
    await context.clearCookies();
    await page.goto('/register');
    await page.evaluate(() => localStorage.clear());
  });

  for (const tc of testCases) {
    test(`${tc.id}: ${tc.description}`, async ({ page }) => {
      // Generate unique email to prevent collision across test runs
      const uniqueSuffix = Date.now() + '_' + Math.floor(Math.random() * 1000);
      const emailValue = tc.inputs.email.replace('{{uniq}}', uniqueSuffix);

      // Fill form fields using resilient semantic locators (getByLabel)
      if (tc.inputs.name) {
        await page.getByLabel('Họ Tên').fill(tc.inputs.name);
      }
      if (tc.inputs.email) {
        await page.getByLabel('Email').fill(emailValue);
      }
      if (tc.inputs.password) {
        await page.getByLabel('Mật khẩu').fill(tc.inputs.password);
      }

      // Click submit button using accessible role
      await page.getByRole('button', { name: 'Đăng Ký' }).click();

      // Multi-assertion patterns based on expected outcome
      if (tc.expected.success) {
        // Assertion 1: URL redirection to login page
        await expect(page).toHaveURL(/\/login/);
        // Assertion 2: Verify login form is fully rendered and actionable
        await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
      } else if (tc.expected.errorText) {
        // Assertion 3 & 4: Error message banner visibility and exact content match
        const errorAlert = page.locator('div[class*="text-red-"], div[role="alert"]').first();
        await expect(errorAlert).toBeVisible();
        await expect(errorAlert).toContainText(tc.expected.errorText);
      } else if (tc.expected.validationField) {
        // Assertion 5, 6 & 7: Native HTML5 validation flag, non-empty message, and URL integrity
        const fieldLabelMap: Record<string, string> = {
          name: 'Họ Tên',
          email: 'Email',
          password: 'Mật khẩu',
        };
        const targetInput = page.getByLabel(fieldLabelMap[tc.expected.validationField]);
        
        const isInvalid = await targetInput.evaluate((el: HTMLInputElement) => !el.checkValidity());
        expect(isInvalid).toBe(true);

        const valMsg = await targetInput.evaluate((el: HTMLInputElement) => el.validationMessage);
        expect(valMsg.length).toBeGreaterThan(0);

        await expect(page).toHaveURL(/\/register/);
      }
    });
  }
});
