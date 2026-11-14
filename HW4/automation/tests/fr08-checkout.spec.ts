import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Load external data-driven test cases (FR-08: Cart & Checkout)
const dataFilePath = path.resolve(__dirname, '../data/fr08-checkout.json');
const testCases = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

let cachedToken = '';
let cachedUser: any = null;

test.describe('FR-08: Cart & Checkout Automation [Run by: 23120319]', () => {
  // Pre-fetch genuine authentication token once to avoid UI login race conditions
  test.beforeAll(async ({ request }) => {
    try {
      const res = await request.post('http://localhost:3000/api/login', {
        data: { email: 'test@eshop.com', password: 'Test1234!' },
      });
      if (res.ok()) {
        const body = await res.json();
        cachedToken = body.token;
        cachedUser = body.user;
      }
    } catch {
      // Backend may be offline during static analysis or validation
    }
  });

  for (const tc of testCases) {
    test(`${tc.id}: ${tc.description}`, async ({ page, context }) => {
      // Step 1: State Isolation & Authentication Setup
      await context.clearCookies();

      if (tc.setup.requireAuth && cachedToken) {
        // Human Review Fix #2: Inject authentic signed JWT token prior to page initialization
        await context.addInitScript(({ token, user }) => {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }, { token: cachedToken, user: cachedUser });
      } else {
        await context.addInitScript(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        });
      }

      // Step 2: Open Home Page
      await page.goto('/');

      // Verify authenticated header state if required
      if (tc.setup.requireAuth && cachedToken) {
        await expect(page.getByText('Chào,')).toBeVisible();
      }

      // Step 3: Populate Cart via Genuine User Action (Avoids Hard Reload state wipe)
      // Human Review Fix #1: Preserves React In-Memory State in CartContext
      if (tc.setup.items && tc.setup.items.length > 0) {
        const targetItem = tc.setup.items[0];
        const productCard = page.locator('div.border.rounded').filter({ hasText: targetItem.name });

        if (await productCard.count() > 0) {
          await productCard.first().getByRole('button', { name: 'Thêm vào giỏ' }).click();
        } else {
          await page.getByRole('button', { name: 'Thêm vào giỏ' }).first().click();
        }
      }

      // Step 4: Client-Side Navigation to Cart page
      await page.getByRole('link', { name: 'Giỏ hàng' }).click();
      // Assertion 1: Verify URL after client-side navigation
      await expect(page).toHaveURL(/\/cart/);

      // Handle Cart Page Specific Test Scenarios
      if (tc.id === 'TC-FR08-07' || tc.id === 'TC-FR08-08' || tc.id === 'TC-FR08-09') {
        if (tc.id === 'TC-FR08-07') {
          // Assertion 2 & 3: Empty cart notification and return shopping link
          await expect(page.getByText(tc.expected.emptyCartMessage)).toBeVisible();
          if (tc.expected.hasContinueLink) {
            await expect(page.getByRole('link', { name: 'Tiếp tục mua sắm' })).toBeVisible();
          }
        }

        if (tc.id === 'TC-FR08-08') {
          // Unauthenticated checkout guard check
          page.once('dialog', async (dialog) => {
            expect(dialog.message()).toContain(tc.expected.alertMessage);
            await dialog.accept();
          });
          await page.getByRole('button', { name: 'Tiến hành thanh toán' }).click();
          await expect(page).toHaveURL(/\/login/);
        }

        if (tc.id === 'TC-FR08-09') {
          // Remove item from cart FIRST, then verify empty notification
          await page.getByRole('button', { name: 'Xóa' }).first().click();
          await expect(page.getByText(tc.expected.emptyCartMessage)).toBeVisible();
        }
      } else {
        // Step 5: Proceed to Checkout page via Client-Side Navigation (Memory Preserved)
        await page.getByRole('button', { name: 'Tiến hành thanh toán' }).click();
        await expect(page).toHaveURL(/\/checkout/);

        // Step 6: Coupon Interaction
        if (typeof tc.inputs.couponCode === 'string') {
          const couponInput = page.getByPlaceholder('Nhập mã giảm giá...');
          await couponInput.fill(tc.inputs.couponCode);
          // Assertion 4: Input value verification
          await expect(couponInput).toHaveValue(tc.inputs.couponCode);

          const applyBtn = page.getByRole('button', { name: 'Áp dụng' });

          if (tc.expected.buttonDisabled) {
            // Assertion 5: Disabled button pattern for empty input
            await expect(applyBtn).toBeDisabled();
          } else {
            // Human Review Fix #3: Wait for API response to prevent async race condition
            const [couponResponse] = await Promise.all([
              page.waitForResponse(resp => resp.url().includes('/api/apply-coupon')),
              applyBtn.click(),
            ]);

            if (tc.expected.couponSuccess) {
              await expect(page.getByText('Áp dụng thành công', { exact: false })).toBeVisible();
              await expect(page.locator('text=Tiết kiệm:')).toBeVisible();
            } else if (tc.expected.errorMessage) {
              const errorBanner = page.locator('p.text-red-600');
              // Assertion 6: Error banner visibility and content check
              await expect(errorBanner).toBeVisible();
              await expect(errorBanner).toContainText(tc.expected.errorMessage);
            }
          }
        }

        // Step 7: Standard Checkout Execution (TC-FR08-01)
        if (tc.expected.success) {
          const [checkoutRes] = await Promise.all([
            page.waitForResponse(resp => resp.url().includes('/api/checkout')),
            page.getByRole('button', { name: 'Xác Nhận Thanh Toán' }).click(),
          ]);
          expect(checkoutRes.status()).toBe(200);
          await expect(page.getByText(tc.expected.successMessage)).toBeVisible();
        }

        // Step 8: SUT Defect Check: Editable total price vulnerability (BUG-UX-02 / TC-FR08-10)
        if (tc.id === 'TC-FR08-10') {
          const totalInput = page.locator('input[type="number"]');
          // Assertion 7: Readonly attribute check on financial field
          await expect(totalInput).toHaveAttribute('readonly');
        }

        // Step 9: SUT Defect Check: Cart not cleared after successful checkout (BUG-UX-03 / TC-FR08-11)
        if (tc.id === 'TC-FR08-11') {
          await Promise.all([
            page.waitForResponse(resp => resp.url().includes('/api/checkout')),
            page.getByRole('button', { name: 'Xác Nhận Thanh Toán' }).click(),
          ]);
          await expect(page.getByText('Thanh toán thành công!')).toBeVisible();
          // Client-side navigate back to cart to inspect integrity
          await page.getByRole('link', { name: 'Giỏ hàng' }).click();
          await expect(page).toHaveURL(/\/cart/);
          await expect(page.getByText('Giỏ hàng của bạn đang trống')).toBeVisible();
        }

        // Step 10: Navigation Check: Back to home button (TC-FR08-12)
        if (tc.id === 'TC-FR08-12') {
          await Promise.all([
            page.waitForResponse(resp => resp.url().includes('/api/checkout')),
            page.getByRole('button', { name: 'Xác Nhận Thanh Toán' }).click(),
          ]);
          await expect(page.getByText('Thanh toán thành công!')).toBeVisible();
          await page.getByRole('button', { name: 'Quay lại trang chủ' }).click();
          await expect(page).toHaveURL('/');
        }
      }
    });
  }
});
