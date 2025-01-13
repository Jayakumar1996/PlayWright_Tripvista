import { test, expect } from '@playwright/test';

test.describe('Registration Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://tripvista.appxpay.in/', { waitUntil: 'load' });
    console.log('Navigating to registration page...');
    await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
    console.log('Clicking on Register button...');
    await page.getByRole('button', { name: 'Register' }).click();
  });

  test('has the correct fields', async ({ page }) => {
    console.log('Checking visibility of required fields...');
    const placeholders = [
      'Enter your first name',
      'Enter your last name',
      'Enter your email',
      'Enter your mobile number',
      'Enter your password',
      'Enter your confirm password',
    ];

    for (const placeholder of placeholders) {
      console.log(`Verifying field: ${placeholder}`);
      await expect(page.getByPlaceholder(placeholder)).toBeVisible();
    }
    await expect(page.getByRole('combobox').first()).toBeVisible();
    await expect(page.getByRole('combobox').nth(1)).toBeVisible();
    await expect(page.getByText('I accept the Terms and')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
  });

  test('shows the correct error messages when the required fields are empty', async ({ page }) => {
    console.log('Submitting form with empty fields...');
    await page.getByRole('button', { name: 'Register' }).click();
    const errorMessages = [
      'Please fill all the required fields.',
      'First Name is required',
      'Last Name is required',
      'Valid Email is required',
      'Valid Mobile number is',
      'Please select a state',
      'Please select a city',
      'Password must be at least 8',
    ];

    for (const errorMessage of errorMessages) {
      console.log(`Verifying error message: ${errorMessage}`);
      await expect(page.getByText(errorMessage)).toBeVisible();
    }
  });

  test('valid input triggers success message', async ({ page }) => {
    console.log('Filling in valid input fields...');
    const inputFields = [
      { placeholder: 'Enter your first name', value: 'sample' },
      { placeholder: 'Enter your last name', value: 'sample' },
      { placeholder: 'Enter your email', value: 'sample@yopmail.com' },
      { placeholder: 'Enter your mobile number', value: '9876543210' },
      { placeholder: 'Enter your password', value: 'Test@123' },
      { placeholder: 'Enter your confirm password', value: 'Test@123' },
    ];

    for (const { placeholder, value } of inputFields) {
      console.log(`Filling field: ${placeholder} with value: ${value}`);
      await page.getByPlaceholder(placeholder).fill(value);
    }
    // Select state
    console.log('Selecting state...');
    await page.getByRole('combobox').first().click();
    await page.waitForTimeout(3000);
    await page.getByPlaceholder('Search').fill('Ta');
    await page.waitForTimeout(3000);
    await page.getByRole('option', { name: 'Tamil Nadu' }).locator('span').first().click();
    await page.waitForTimeout(3000);

    // Select city
    console.log('Selecting city...');
    await page.getByRole('combobox').nth(1).click();
    await page.waitForTimeout(3000);
    await page.getByPlaceholder('Search').fill('cu');
    await page.waitForTimeout(3000);

    await page.getByTestId('picker-popup').locator('span').nth(1).click();
    await page.waitForTimeout(3000);
    // Submit the form
    console.log('Submitting the form...');
    await page.getByRole('button', { name: 'Register' }).click();
    // Verify success message
    console.log('Verifying success message...');
    await page.waitForTimeout(2000);
    await expect(page.getByText('Registration successful!')).toBeVisible();
  });


  test('Get States and Union Territories', async ({ page }) => {
    await page.locator("//label[text()='State']/following-sibling::div").click();
    const state =await page.locator("//div[@role='option']").allTextContents();
    console.log(state);
  });

  test('Get States and Union Territories and city value', async ({ page }) => {
    await page.locator("//label[text()='State']/following-sibling::div").click();
    await page.waitForTimeout(3000);
    await page.getByPlaceholder('Search').fill('Ta');
    await page.waitForTimeout(3000);
    await page.getByRole('option', { name: 'Tamil Nadu' }).locator('span').first().click();
    await page.waitForTimeout(3000);
    console.log('Selecting city...');
    await page.getByRole('combobox').nth(1).click();
    await page.waitForTimeout(3000);
    const city = await  page.locator("//div[@role='option']").allTextContents();
    console.log(city);

  });
});
