import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Load external data-driven test cases (FR-01: Account Registration)
const dataFilePath = path.resolve(__dirname, '../data/fr01-registration.json');
const testCases = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

test.describe('FR-01: Account Registration - Web UI Automation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to registration page before each test
    await page.goto('/register');
  });

  for (const tc of testCases) {
    test(`${tc.id}: ${tc.description}`, async ({ page }) => {
      // Generate unique email to prevent collision across test runs
      const uniqueSuffix = Date.now() + '_' + Math.floor(Math.random() * 1000);
      const emailValue = tc.inputs.email.replace('{{uniq}}', uniqueSuffix);

      // Fill form fields
      if (tc.inputs.name) {
        await page.locator('input').nth(0).fill(tc.inputs.name);
      }
      if (tc.inputs.email) {
        await page.locator('input').nth(1).fill(emailValue);
      }
      if (tc.inputs.password) {
        await page.locator('input').nth(2).fill(tc.inputs.password);
      }

      // Click submit button
      await page.locator('button[type="submit"]').click();

      // Assertions based on expected result
      if (tc.expected.success) {
        // Assertion 1: URL redirection to login page
        await expect(page).toHaveURL(/\/login/);
      } else if (tc.expected.errorText) {
        // Assertion 2: Error message banner visibility and content
        const errorAlert = page.locator('.bg-red-100');
        await expect(errorAlert).toBeVisible();
        await expect(errorAlert).toContainText(tc.expected.errorText);
      } else if (tc.expected.validationField) {
        // Assertion 3: Page stays on /register due to HTML5 required attribute
        await expect(page).toHaveURL(/\/register/);
      }
    });
  }
});
