import { test, expect } from '@playwright/test';


test.describe('Home Page screen', () => {

  test('TC_01 : agent login page', async ({ page }) => {
    await page.goto('https://tripvista.appxpay.in/', { waitUntil: 'load' });
    await expect(page.getByRole('button', { name: 'Agent Login' })).toBeVisible();
  });

});