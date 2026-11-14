import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Load external data-driven test cases (FR-08: Cart & Checkout)
const dataFilePath = path.resolve(__dirname, '../data/fr08-checkout.json');
const testCases = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

test.describe('FR-08: Cart & Checkout Automation [Run by: 23120319]', () => {
  for (const tc of testCases) {
    test(`${tc.id}: ${tc.description}`, async ({ page, context }) => {
      // Step 1: Pre-condition setup (Auth & Cart state in localStorage)
      await context.clearCookies();
      await page.goto('/');

      if (tc.setup.requireAuth) {
        await page.evaluate(() => {
          const mockUser = { id: 2, name: 'Test User', email: 'test@eshop.com', role: 'user' };
          localStorage.setItem('user', JSON.stringify(mockUser));
          localStorage.setItem('token', 'mock-jwt-token-test-user');
        });
      } else {
        await page.evaluate(() => {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        });
      }

      // Populate cart items
      await page.evaluate((items) => {
        localStorage.setItem('cart', JSON.stringify(items));
      }, tc.setup.items);

      // Step 2: Navigate based on test category
      if (tc.id === 'TC-FR08-07' || tc.id === 'TC-FR08-08' || tc.id === 'TC-FR08-09') {
        // Test Cart page interactions
        await page.goto('/cart');

        if (tc.expected.emptyCartMessage) {
          // Assertion 1: Empty cart notification message
          await expect(page.getByText(tc.expected.emptyCartMessage)).toBeVisible();
          if (tc.expected.hasContinueLink) {
            await expect(page.getByRole('link', { name: 'Tiếp tục mua sắm' })).toBeVisible();
          }
        }

        if (tc.id === 'TC-FR08-08') {
          // Unauthenticated user attempts checkout
          page.on('dialog', async (dialog) => {
            expect(dialog.message()).toContain(tc.expected.alertMessage);
            await dialog.accept();
          });
          await page.getByRole('button', { name: 'Tiến hành thanh toán' }).click();
          await expect(page).toHaveURL(/\/login/);
        }

        if (tc.id === 'TC-FR08-09') {
          // Remove item from cart
          await page.getByRole('button', { name: 'Xóa' }).first().click();
          await expect(page.getByText(tc.expected.emptyCartMessage)).toBeVisible();
        }
      } else {
        // Test Checkout page flow
        await page.goto('/checkout');

        // Coupon interaction
        if (tc.inputs.couponCode !== null) {
          const couponInput = page.getByPlaceholder('Nhập mã giảm giá...');
          await couponInput.fill(tc.inputs.couponCode);

          const applyBtn = page.getByRole('button', { name: 'Áp dụng' });

          if (tc.expected.buttonDisabled) {
            // Assertion 2: Disabled coupon button when empty
            await expect(applyBtn).toBeDisabled();
          } else {
            await applyBtn.click();

            if (tc.expected.couponSuccess) {
              // Assertion 3: Coupon success details
              await expect(page.getByText(tc.expected.couponMessage, { exact: false })).toBeVisible();
              await expect(page.getByText(tc.expected.discountAmount.toLocaleString())).toBeVisible();
            } else if (tc.expected.errorMessage) {
              // Assertion 4: Coupon failure message
              await expect(page.getByText(tc.expected.errorMessage, { exact: false })).toBeVisible();
            }
          }
        }

        // Checkout execution
        if (tc.expected.success) {
          await page.getByRole('button', { name: 'Xác Nhận Thanh Toán' }).click();
          // Assertion 5: Order success confirmation
          await expect(page.getByText(tc.expected.successMessage)).toBeVisible();
        }

        // Boundary check: Total price field editable defect (BUG-UX-02)
        if (tc.id === 'TC-FR08-10') {
          const totalInput = page.locator('input[type="number"]');
          await expect(totalInput).toHaveAttribute('readonly');
        }

        // Integrity check: Cart cleared after checkout (BUG-UX-03)
        if (tc.id === 'TC-FR08-11') {
          await page.getByRole('button', { name: 'Xác Nhận Thanh Toán' }).click();
          await expect(page.getByText('Thanh toán thành công!')).toBeVisible();
          await page.goto('/cart');
          await expect(page.getByText('Giỏ hàng của bạn đang trống')).toBeVisible();
        }

        // Navigation check: Back to home button
        if (tc.id === 'TC-FR08-12') {
          await page.getByRole('button', { name: 'Xác Nhận Thanh Toán' }).click();
          await page.getByRole('button', { name: 'Quay lại trang chủ' }).click();
          await expect(page).toHaveURL('/');
        }
      }
    });
  }
});
