import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Load external data-driven test cases (FR-12: Access Control)
const dataFilePath = path.resolve(__dirname, '../data/fr12-access-control.json');
const testCases = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

let adminToken = '';
let userToken = '';

test.describe('FR-12: Access Control - Admin Web Automation [Run by: 23120319]', () => {
  test.beforeAll(async ({ request }) => {
    try {
      // Pre-fetch authentic Admin token
      const adminRes = await request.post('http://localhost:3000/api/login', {
        data: { email: 'admin@eshop.com', password: 'Admin123!' },
      });
      if (adminRes.ok()) {
        const data = await adminRes.json();
        adminToken = data.token;
      }

      // Pre-fetch regular User token for role-based access checks
      const userRes = await request.post('http://localhost:3000/api/login', {
        data: { email: 'test@eshop.com', password: 'Test1234!' },
      });
      if (userRes.ok()) {
        const data = await userRes.json();
        userToken = data.token;
      }
    } catch {
      // Backend may be offline during static validation
    }
  });

  for (const tc of testCases) {
    test(`${tc.id}: ${tc.description}`, async ({ page, context }) => {
      await context.clearCookies();

      // Step 1: Pre-condition session setup
      if (tc.setup.injectToken === 'admin' && adminToken) {
        await context.addInitScript((token) => {
          localStorage.setItem('adminToken', token);
        }, adminToken);
      } else if (tc.setup.injectToken === 'user' && userToken) {
        await context.addInitScript((token) => {
          localStorage.setItem('adminToken', token);
        }, userToken);
      } else if (tc.setup.injectToken === 'invalid') {
        await context.addInitScript(() => {
          localStorage.setItem('adminToken', 'invalid_tampered_jwt_signature_xyz');
        });
      } else {
        await context.addInitScript(() => {
          localStorage.removeItem('adminToken');
        });
      }

      // Step 2: Open Admin Web Application (Port 5174)
      await page.goto(tc.setup.adminUrl);
      // Assertion 1: Verify URL targets Admin Web
      await expect(page).toHaveURL(/5174/);

      // Step 3: Handle UI Login Scenarios
      if (tc.inputs.email !== null && tc.inputs.password !== null) {
        const loginHeading = page.locator('h2:has-text("Admin Login")');
        // Assertion 2: Verify login heading visibility
        await expect(loginHeading).toBeVisible();

        const emailInput = page.getByPlaceholder('Email');
        const passInput = page.getByPlaceholder('Password');

        // Assertion 3: Verify password input attribute
        await expect(passInput).toHaveAttribute('type', 'password');

        await emailInput.fill(tc.inputs.email);
        // Assertion 4: Verify email value entered
        await expect(emailInput).toHaveValue(tc.inputs.email);

        await passInput.fill(tc.inputs.password);

        if (tc.expected.alertMessage) {
          // Listen for browser dialog alert
          page.once('dialog', async (dialog) => {
            expect(dialog.message()).toContain(tc.expected.alertMessage);
            await dialog.accept();
          });
        }

        const loginBtn = page.getByRole('button', { name: 'Login' });
        await loginBtn.click();

        if (tc.expected.success) {
          const adminTitle = page.locator('h1:has-text("EShop Admin")');
          await expect(adminTitle).toBeVisible();
          const revenueText = page.locator('text=Tổng doanh thu');
          // Assertion 5: Text content assertion
          await expect(revenueText).toContainText('Tổng doanh thu');
        } else if (tc.expected.stayOnLogin) {
          await expect(loginHeading).toBeVisible();
        }
      }

      // Step 4: Handle Unauthenticated access verification (TC-FR12-05)
      if (tc.expected.loginFormVisible && tc.setup.injectToken === 'none' && !tc.inputs.clickLogout) {
        const loginHeader = page.locator('h2:has-text("Admin Login")');
        await expect(loginHeader).toBeVisible();
      }

      // Step 5: Handle Admin Navigation Tabs (TC-FR12-07 .. TC-FR12-10)
      if (tc.inputs.clickTab) {
        await page.getByText(tc.inputs.clickTab, { exact: true }).click();
        const tabTitleHeader = page.locator(`h2:has-text("${tc.expected.tabTitle}")`);
        await expect(tabTitleHeader).toBeVisible();

        if (tc.expected.hasNewCategoryInput) {
          const categoryInput = page.getByPlaceholder('Tên danh mục mới');
          await expect(categoryInput).toBeVisible();
        }
        if (tc.expected.hasCsvImportSection) {
          const csvText = page.locator('text=Import sản phẩm từ CSV');
          await expect(csvText).toBeVisible();
        }
        if (tc.expected.hasCouponForm) {
          const couponInput = page.getByPlaceholder('Mã coupon (VD: SAVE10)');
          await expect(couponInput).toBeVisible();
        }
        if (tc.expected.hasOrderTable) {
          const orderTable = page.locator('table');
          await expect(orderTable).toBeVisible();
        }
      }

      // Step 6: Handle Admin Logout (TC-FR12-06)
      if (tc.inputs.clickLogout) {
        await page.getByText('Đăng xuất').click();
        const loginHeader = page.locator('h2:has-text("Admin Login")');
        await expect(loginHeader).toBeVisible();
        const storedToken = await page.evaluate(() => localStorage.getItem('adminToken'));
        expect(storedToken).toBeNull();
      }

      // Step 7: Handle Invalid Token Defense (TC-FR12-11)
      if (tc.id === 'TC-FR12-11') {
        const loginHeader = page.locator('h2:has-text("Admin Login")');
        await expect(loginHeader).toBeVisible();
      }

      // Step 8: Handle Broken Access Control Security Check (TC-FR12-12 / SUT Defect)
      if (tc.id === 'TC-FR12-12') {
        // A regular user token must be forbidden (HTTP 403) from accessing admin user list
        const res = await page.request.get('http://localhost:3000/api/admin/users', {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        // SUT Defect Check: Backend incorrectly returns 200 instead of 403
        expect(res.status()).toBe(tc.expected.expectedStatus);
      }
    });
  }
});
