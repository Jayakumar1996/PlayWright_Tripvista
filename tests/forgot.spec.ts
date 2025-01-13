import { test, expect } from '@playwright/test';

test.describe('Forgot Screen Functionality', () => {

test('TC_01 : Verify "Forgot Password" functionality', async ({ page }) => {
  await page.goto('https://tripvista.appxpay.in/', { waitUntil: 'load' });
  await page.getByRole('button', { name: 'Agent Login' }).click();
  await expect(page.getByRole('link', { name: 'Forgot password?' })).toBeVisible();
  await page.getByRole('link', { name: 'Forgot password?' }).click();
  await expect(page.getByTestId('modal-wrapper').getByTestId('scroll-view').locator('div').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Forgot password' })).toBeVisible();
  await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
});

test('TC_02 : Unable to find the user email', async ({ page }) => {
  await page.goto('https://tripvista.appxpay.in/', { waitUntil: 'load' });
  await page.getByRole('button', { name: 'Agent Login' }).click();
  await page.getByRole('link', { name: 'Forgot password?' }).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Unable to identify the User')).toBeVisible();
});

test('TC_03 : Forgot sucess email', async ({ page }) => {
  await page.goto('https://tripvista.appxpay.in/', { waitUntil: 'load' });
  await page.getByRole('button', { name: 'Agent Login' }).click();
  await page.getByRole('link', { name: 'Forgot password?' }).click();
  await page.getByPlaceholder('Enter your email').fill('arya.s@twilightsoftwares.com');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('successfully sent the Email')).toBeVisible();
});

});