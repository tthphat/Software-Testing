import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// 1. Data-Driven: Read data from external JSON file (DO NOT hardcode inline)
const dataFilePath = path.resolve(__dirname, '../data/feature.json');
const testCases = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

test.describe('FR-XX: Feature Name - Data-Driven Automation Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Isolate state between tests: clear storage and cookies
    await page.context().clearCookies();
    await page.goto('/');
  });

  for (const tc of testCases) {
    test(`${tc.id}: ${tc.description}`, async ({ page }) => {
      // Step A: Perform Actions with Resilient Locators
      // await page.getByRole('button', { name: '...' }).click();
      // await page.getByPlaceholder('...').fill(tc.inputs.field);

      // Step B: Multi-Assertion Verification (At least 3 distinct patterns across suite)
      if (tc.expected.success) {
        // Pattern 1: URL Navigation
        await expect(page).toHaveURL(new RegExp(tc.expected.redirectUrl));

        // Pattern 2: Visibility check
        const toast = page.getByText(tc.expected.toastMessage);
        await expect(toast).toBeVisible();

        // Pattern 3: Text content verification
        await expect(toast).toContainText(tc.expected.toastMessage);
      } else {
        // Pattern 4: Input / State verification
        const errorElement = page.getByRole('alert');
        await expect(errorElement).toBeVisible();
        await expect(errorElement).toContainText(tc.expected.errorMessage);

        // Pattern 5: Button disabled / attribute state
        const submitBtn = page.getByRole('button', { name: 'Submit' });
        await expect(submitBtn).toBeDisabled();
      }
    });
  }
});

