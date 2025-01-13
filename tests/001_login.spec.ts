import { test, expect } from '@playwright/test';


test.describe('Agent Login Flow', () => {

  test('TC_01 : should display validation errors for empty email and password fields', async ({ page }) => {
    await page.goto('https://tripvista.appxpay.in/', { waitUntil: 'load' });
    await page.getByRole('button', { name: 'Agent Login' }).click();
    await page.getByTestId('modal-wrapper').getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Please enter a valid email address.')).toBeVisible();
    await expect(page.getByText('Password must be at least 8 characters long.')).toBeVisible();
  });
  
  test('TC_02 : should display validation error for missing password', async ({ page }) => {
    await page.goto('https://tripvista.appxpay.in/', { waitUntil: 'load' });
    await page.getByRole('button', { name: 'Agent Login' }).click();
    await page.getByPlaceholder('Enter your email').fill('test@gmail.com');
    await page.getByTestId('modal-wrapper').getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Password must be at least 8 characters long.')).toBeVisible();
  });
  test('TC_03 : should display validation error for missing email', async ({ page }) => {
    await page.goto('https://tripvista.appxpay.in/', { waitUntil: 'load' });
    await page.getByRole('button', { name: 'Agent Login' }).click();
    await page.getByPlaceholder('Password').fill('SmartWork@1234');
    await page.getByTestId('modal-wrapper').getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Please enter a valid email address.')).toBeVisible();
  });

  test('TC_04 : should display login failure message for incorrect credentials', async ({ page }) => {
    await page.goto('https://tripvista.appxpay.in/', { waitUntil: 'load' });
    await page.getByRole('button', { name: 'Agent Login' }).click();
    await page.getByPlaceholder('Enter your email').fill('test@gmail.com');
    await page.getByPlaceholder('Password').fill('sample@yopmail.com');
    await page.getByTestId('modal-wrapper').getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Login Failed! Please check your credentials.')).toBeVisible();
  });
  
  test('TC_05 : should display Successful login with valid credentials', async ({ page }) => {
    await page.goto('https://tripvista.appxpay.in/', { waitUntil: 'load' });
    await page.getByRole('button', { name: 'Agent Login' }).click();
    await page.getByPlaceholder('Enter your email').fill('test@gmail.com');
    await page.getByPlaceholder('Password').fill('SmartWork@1234');
    await page.getByTestId('modal-wrapper').getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Login Successful! Welcome')).toBeVisible();
    await expect(page.getByText('test user')).toBeVisible();
  });


  test('TC_06 : should display agent login page', async ({ page }) => {
    await page.goto('https://tripvista.appxpay.in/', { waitUntil: 'load' });
    await page.getByRole('button', { name: 'Agent Login' }).click();
    await expect(page.getByRole('img', { name: 'Login Image' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByText('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(page.getByText('Password', { exact: true })).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByTestId('modal-wrapper').getByRole('button').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Forgot password?' })).toBeVisible();
    await expect(page.getByTestId('modal-wrapper').getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible();
  });

  test('TC_08 : Navigate to signup from login page', async ({ page }) => {
    await page.goto('https://tripvista.appxpay.in/', { waitUntil: 'load' });
    await page.getByRole('button', { name: 'Agent Login' }).click();
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
  });

  test('TC_09 :Toggle password visibility', async ({ page }) => {
    await page.goto('https://tripvista.appxpay.in/', { waitUntil: 'load' });
    await page.getByRole('button', { name: 'Agent Login' }).click();
    await page.getByPlaceholder('Password').fill('SmartWork@1234');

    const toggleButton = page.getByTestId('modal-wrapper').getByRole('button').first();
    for (let i = 0; i < 3; i++) {
      await toggleButton.click();
      await expect(page.getByPlaceholder('Password')).toBeVisible();
    }
  });
});