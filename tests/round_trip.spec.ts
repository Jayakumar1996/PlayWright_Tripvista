import { test, expect } from '@playwright/test';

const Email = "test@gmail.com";
const password = "SmartWork@1234";
const verifyProfileName = "test user";
const successMessage = 'Login Successful! Welcome back.';

export async function login(page) {
  console.log('Navigating to login page...');
  await page.goto('https://tripvista.appxpay.in/', { waitUntil: 'load' });

  console.log('Logging in...');
  await page.getByRole('button', { name: 'Agent Login' }).click();
  await page.getByPlaceholder('Enter your email').fill(Email);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByTestId('modal-wrapper').getByRole('button', { name: 'Login' }).click();

  console.log('Verifying login...');
  await expect(page.getByText('Login Successful! Welcome back.')).toBeVisible();
  await expect(page.getByText(verifyProfileName)).toBeVisible();

  console.log('Verifying login success message...');
  try {
    await expect(page.getByText(successMessage)).toBeVisible({ timeout: 10000 });
    console.log('Login success message verified.');
    await expect(page).toHaveURL(/home/);
  } catch (e) {
    console.error('Error verifying login success message:', e);
    await page.screenshot({ path: 'error-login-message.png' });
    throw e;
  }
}
  
  export async function logout(page) {
    console.log('Clicking More button to log out...');
    await page.getByRole('button', { name: 'More' }).click();
    console.log('Clicking Log out button...');
    await page.getByText('Log out').click();
    console.log('Verifying Agent Login button is visible after logout...');
    await expect(page.getByRole('button', { name: 'Agent Login' })).toBeVisible();
  }

  export async function selectLocation(page, type, locationInput, gridcellText) {
    let locationField;
  
    // Determine the locator based on the type
    if (type === 'From') {
      locationField = page.getByPlaceholder('Select a location').first();
    } else if (type === 'To') {
      locationField = page.getByPlaceholder('Select a location').nth(1);
    } else {
      throw new Error(`Invalid type: ${type}. Use 'From' or 'To'.`);
    }
  
    // Click the field to activate it
    await locationField.click();
  
    // Select all text and clear it
    await locationField.press('ControlOrMeta+a');
    await locationField.clear();
  
    // Click again to focus and fill in the new location
    await locationField.waitFor({ state: 'visible' });
    await locationField.click();
    await locationField.fill(locationInput);
  
    // Select the appropriate suggestion from the grid
    const gridCell = page.getByRole('gridcell', { name: gridcellText });
    await expect(gridCell).toBeVisible(); // Ensures the grid cell is visible
    await gridCell.click();
  }
  
  export async function searchIcon(page) {
    console.log('Clicking on the Search Icon...');
    await page.getByRole('img', { name: 'Search Icon' }).click();
    console.log('Search initiated for flights.');
  }
  
  export async function verifyFlightList(page, from, to) {
    console.log('Verifying selected "From" and "To" locations...');
    await expect(page.getByPlaceholder('Select a location').first()).toHaveValue(from);
    await expect(page.getByPlaceholder('Select a location').nth(1)).toHaveValue(to);
    console.log('Verified that both "From" and "To" locations are set correctly.');
  
    console.log('Verifying that the flight list is displayed...');
    await expect(page.getByRole('main')).toContainText(`Flights from ${from.split(' - ')[0]} → ${to.split(' - ')[0]}`);
    console.log('Flight list displayed for the selected route.');
  }

  export async function bookFlights(page, departureFlightButtonSelector, returnFlightButtonSelector, confirmationText) {
    console.log('Booking the departure flight...');
    const departureFlightButton = page.locator(departureFlightButtonSelector);
    await expect(departureFlightButton).toBeVisible();
    await departureFlightButton.click();
    console.log('Departure flight booked successfully.');
  
    console.log('Booking the return flight...');
    const returnFlightButton = page.locator(returnFlightButtonSelector);
    await expect(returnFlightButton).toBeVisible();
    await returnFlightButton.click();
    console.log('Return flight booked successfully.');
  
    console.log('Verifying confirmation message...');
    await expect(page.getByText(confirmationText)).toBeVisible();
    console.log(`Confirmation message verified: "${confirmationText}"`);
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
      departureDate: page.getByPlaceholder('Departure Date'),
      returnDate: page.getByPlaceholder('Book a return flight'),
      passengerCountButton: page.getByRole('button', { name: 'User Adults 1, Children 0,' }),
      businessClassButton: page.getByRole('button', { name: 'Business' }),
      directFlightFilter: page.getByLabel('Direct flight'),
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
      await page.getByRole('button', { name: '+' }).nth(2).click(); // Add infant
    };

    // Test steps
    console.log('Starting test: Booking a round-trip flight...');
    await locators.roundTripButton.waitFor({ state: 'visible' });
    await locators.roundTripButton.click();
    await expect(locators.roundTripButton).toBeVisible();

    console.log('Selecting departure location...');
       await selectLocation(page, 'From', 'chennai', 'Chennai, Chennai Arpt');
    

    console.log('Selecting destination location...');
        await selectLocation(page, 'To', 'Delhi', 'Delhi Indira Gandhi Intl');
        // await selectLocation(page, 'To', 'Mumbai', 'Mumbai - Chhatrapati Shivaji');

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
    await searchIcon(page);
    await page.waitForTimeout(10000); // Use explicit waits only when necessary
    await expect(page.getByRole('heading', { name: 'Departure Flight' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Return Flight' })).toBeVisible();

    console.log('Booking flights...');
    await bookFlights(
      page,
      "//body[1]/div[1]/div[1]/main[1]/div[1]/div[2]/div[1]/div[1]/div[3]/div[1]/div[2]/div[1]/div[1]/div[1]/div[5]/button[1]", // Selector for the departure flight button
      "//body[1]/div[1]/div[1]/main[1]/div[1]/div[2]/div[1]/div[1]/div[3]/div[2]/div[2]/div[1]/div[1]/div[1]/div[5]/button[1]", // Selector for the return flight button
      'Special Return you have choosen was correct' // Confirmation text
    );

    console.log('Completing payment...');
    const paymentButton = page.locator("//body[1]/div[1]/div[1]/main[1]/div[1]/div[2]/div[1]/div[1]/div[3]/div[2]/div[15]/div[2]/div[3]/button[1]");
    await expect(paymentButton).toBeVisible();
    await paymentButton.click();
  });

});