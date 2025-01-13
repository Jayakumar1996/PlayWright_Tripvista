import { test, expect } from '@playwright/test';
 

const Email = "test@gmail.com";
const password = "SmartWork@1234";
const verifyProfileName = "test user";

export async function login(page) {
    console.log('Navigating to login page...');
    await page.goto('https://tripvista.appxpay.in/', { waitUntil: 'load' });
    console.log('Clicking Agent Login button...');
    await page.getByRole('button', { name: 'Agent Login' }).click();
    console.log('Filling login credentials...');
    await page.getByPlaceholder('Enter your email').fill(Email);
    await page.getByPlaceholder('Password').fill(password);
    console.log('Submitting login form...');
    await page.getByTestId('modal-wrapper').getByRole('button', { name: 'Login' }).click();
    console.log('Verifying login success message...');
    await expect(page.getByText('Login Successful! Welcome back.')).toBeVisible();
    await expect(page.getByText(verifyProfileName)).toBeVisible();
  }
  
  export async function logout(page) {
    console.log('Clicking More button to log out...');
    await page.getByRole('button', { name: 'More' }).click();
    console.log('Clicking Log out button...');
    await page.getByText('Log out').click();
    console.log('Verifying Agent Login button is visible after logout...');
    await expect(page.getByRole('button', { name: 'Agent Login' })).toBeVisible();
  }
 
test.describe('RoundTrip testing functionality', () => {
 
    test.beforeEach(async ({ page }) => {
      console.log('Starting test: Logging in...');
      await login(page);
    });
 
    test('TC_25: Verify and Validate the seat selection functionality on the "Complete Your Booking" details page.', async ({ page }) => {
      // Reusable locators
      const locators = {
          roundTripButton: page.getByRole('button', { name: 'Round Trip' }),
          departureLocation: page.getByPlaceholder('Select a location').first(),
          destinationLocation: page.locator('div').filter({ hasText: /^To$/ }).getByPlaceholder('Select a location'),
          departureDate: page.getByPlaceholder('Departure Date'),
          returnDate: page.getByPlaceholder('Book a return flight'),
          passengerCountButton: page.getByRole('button', { name: 'User Adults 1, Children 0,' }),
          businessClassButton: page.getByRole('button', { name: 'Business' }),
          directFlightFilter: page.getByLabel('Direct flight'),
          searchButton: page.getByRole('img', { name: 'Search Icon' }),
          bookNowButtons: page.getByRole('button', { name: 'Book Now' }),
      };
  
      // Helper functions
      const selectLocation = async (locator, location, code) => {
          await locator.click();
          await locator.clear();
          await locator.fill(location);
          await page.getByText(code).click();
      };
  
        const selectDate = async (dateLocator, monthLabel, day) => {
            await dateLocator.click();
            await page.getByLabel(monthLabel).click();
            await page.getByText(day).click();
            await page.getByRole('button', { name: 'OK' }).click();
        };
  
      const updatePassengerCount = async () => {
          await locators.passengerCountButton.click();
          await page.getByRole('button', { name: '+' }).first().click(); // Add adult
          await page.getByRole('button', { name: '+' }).nth(2).click();  // Add infant
      };
  
      // Test steps
      console.log('Starting test: Booking a round-trip flight...');
      await locators.roundTripButton.click();
      await expect(locators.roundTripButton).toBeVisible();
  
      console.log('Selecting departure location...');
      await selectLocation(locators.departureLocation, 'chennai', 'MAA');
      await expect(locators.departureLocation).toHaveValue('Chennai - Chennai Arpt');
  
      console.log('Selecting destination location...');
      await selectLocation(locators.destinationLocation, 'delhi', 'DEL');
      await expect(locators.destinationLocation).toHaveValue('Delhi - Delhi Indira Gandhi Intl');
  
      console.log('Selecting dates...');
      await selectDate(locators.departureDate, 'Next month', '01');
      await selectDate(locators.returnDate, 'Next month', '15');
  
      console.log('Updating passenger count...');
      await updatePassengerCount();
      await expect(page.getByText('2', { exact: true })).toBeVisible();
  
      console.log('Selecting travel class...');
      await locators.businessClassButton.click();
      await expect(page.locator('[id="menubutton-\\:ro\\:"]')).toContainText('Adults 2, Children 0, Infants 1, BUSINESS');
  
      console.log('Verifying "Direct flight" filter is visible...');
      await expect(locators.directFlightFilter).toBeVisible();
  
      console.log('Searching for flights...');
      await locators.searchButton.click();
      await page.waitForTimeout(10000); // Use explicit waits only when necessary
      await expect(page.getByRole('heading', { name: 'Departure Flight' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Return Flight' })).toBeVisible();
  
      console.log('Booking flights...');
      await page.locator("//body[1]/div[1]/div[1]/main[1]/div[1]/div[2]/div[1]/div[1]/div[3]/div[1]/div[2]/div[1]/div[1]/div[1]/div[5]/button[1]").click();
      await locators.bookNowButtons.first().click(); // Departure flight
      await page.locator("//body[1]/div[1]/div[1]/main[1]/div[1]/div[2]/div[1]/div[1]/div[3]/div[2]/div[2]/div[1]/div[1]/div[1]/div[5]/button[1]").click();
      await locators.bookNowButtons.nth(2).click(); // Return flight
      await expect(page.getByText('Special Return you have choosen was correct')).toBeVisible();

      console.log('Completing payment...');
      await expect(page.locator("//body[1]/div[1]/div[1]/main[1]/div[1]/div[2]/div[1]/div[1]/div[3]/div[2]/div[15]/div[2]/div[3]/button[1]")).toBeVisible();
      await page.locator("//body[1]/div[1]/div[1]/main[1]/div[1]/div[2]/div[1]/div[1]/div[3]/div[2]/div[15]/div[2]/div[3]/button[1]").click();
      // await expect(page.getByRole('button', { name: 'Confirm Payment' })).toBeVisible();
      // await page.getByRole('button', { name: 'Confirm Payment' }).click();
  
      // console.log('Test completed: Round-trip booking workflow successfully verified.');
      // await logout(page);
  });
  
 
  });