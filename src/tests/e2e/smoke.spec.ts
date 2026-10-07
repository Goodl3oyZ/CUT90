import { test, expect } from '@playwright/test';

test.describe('Cut 90 PWA E2E Smoke Test', () => {
  test('registers new user, completes onboarding, logs morning weight, and views weight on trend chart', async ({
    page,
  }) => {
    const testUser = `smoke_${Date.now().toString().slice(-6)}`;
    const testPassword = 'Password123!';

    // 1. Register page
    await page.goto('/register');
    await page.fill('input[placeholder="username"]', testUser);
    await page.fill('input[placeholder="••••••••"]', testPassword);
    await page.click('button[type="submit"]');

    // 2. Onboarding page
    await page.waitForURL('/onboarding', { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('ตั้งค่าแผน 90 วันของคุณ');
    await page.click('button:has-text("สร้างแผน 90 วันเลย")');

    // 3. Today screen
    await page.waitForURL('/', { timeout: 10000 });
    await expect(page.locator('h1, header')).toContainText('CUT 90');

    // Fill morning weight in log form
    const weightInput = page.locator('input[placeholder="เช่น 78.5"]');
    await weightInput.fill('77.5');

    // Click manual save button
    await page.click('button:has-text("บันทึก")');
    await page.waitForTimeout(1000);

    // 4. Navigate to Trend screen via bottom nav
    await page.click('a[href="/trend"]');
    await page.waitForURL('/trend', { timeout: 10000 });

    // Verify trend screen loaded and summary or chart reflects logged data
    await expect(page.locator('h1')).toContainText('แนวโน้มและความคืบหน้า');
    await expect(page.locator('body')).toContainText('77.5');
  });
});
