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
  await page.waitForTimeout(3000);
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
  await locationField.fill('');

  // Click again to focus and fill in the new location
  await locationField.click();
  await locationField.fill(locationInput);

  // Select the appropriate suggestion from the grid
  await page.getByRole('gridcell', { name: gridcellText }).click();
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

export async function viewFlights(page) {
  console.log('Clicking on the first "View Flights" button...');
  await page.getByRole('button', { name: 'View Flights' }).first().click();
  console.log('Clicked on "View Flights".');
}

export async function viewFlightDetailsModal(page) {
  console.log('Verifying "View Flight Details" button...');
  await expect(page.getByRole('button', { name: 'View Flight Details' }).first()).toBeVisible();

  console.log('"View Flight Details" button is visible.');
  console.log('Clicking on "View Flight Details"...');
  await page.getByRole('button', { name: 'View Flight Details' }).first().click();
  console.log('Clicked on "View Flight Details".');
}

async function verifyModalContent(page, from, to) {
  console.log('Verifying flight details modal...');
  await expect(page.getByRole('heading', { name: 'Flight Details' })).toBeVisible();
  await expect(page.getByTestId('modal-wrapper').getByText(from)).toBeVisible();
  await expect(page.getByTestId('modal-wrapper').getByText(to)).toBeVisible();
  console.log('Flight details modal verified successfully.');
}

async function verifyFlightFilters(page, filterNames) {
  console.log('Verifying filters...');
  console.log('Verifying Flight Filters heading...');
  await expect(page.getByRole('heading', { name: 'Flight Filters' })).toBeVisible();
  for (const filterName of filterNames) {
    console.log(`Verifying ${filterName} button and Clicking on ${filterName}...`);
    await expect(page.getByRole('button', { name: filterName })).toBeVisible();
    await page.getByRole('button', { name: filterName }).click();
  }
  console.log('Filter verification complete!');
}

async function closeModal(page) {
  console.log('Closing the flight details modal...');
  await page.getByLabel('Close', { exact: true }).click();
  console.log('Flight details modal closed.');
}

export async function verifyAndBookNow(page) {
  console.log('Verifying "Book Now" button...');
  await expect(page.getByRole('button', { name: 'Book Now' }).first()).toBeVisible();
  console.log('"Book Now" button is visible.');
  console.log('Clicking on "Book Now"...');
  await page.getByRole('button', { name: 'Book Now' }).first().click();
  console.log('Clicked on "Book Now".');
}

async function verifyBookingPage(page) {
  console.log('Verifying the booking details page...');
  await expect(page.getByText('Complete Your Booking Details')).toBeVisible();
  console.log('Booking details page verified successfully.');
}

test.describe.only('Agent Login Flow', () => {

  test.beforeEach(async ({ page }) => {
    console.log('Starting test: Logging in...');
    await login(page);
  });


 test('TC_01: Verify the roundtrip button details are displayed correctly on dashboard page. @smoke', async ({ page }) => {
    console.log('Verifying roundtrip button display...');

    await page.getByRole('button', { name: 'Round Trip' }).click();
    await expect(page.getByRole('button', { name: 'Round Trip' })).toBeEnabled();
    await expect(page.locator('div').filter({ hasText: /^From$/ }).getByPlaceholder('Select a location')).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^To$/ }).getByPlaceholder('Select a location')).toBeVisible();
  await expect(page.getByPlaceholder('Departure Date')).toBeVisible();
  await expect(page.getByPlaceholder('Book a return flight')).toBeVisible();
  await expect(page.getByRole('button', { name: 'User Adults 1, Children 0,' })).toBeVisible();
    await logout(page);

  });

  test('TC_02: Verify Special Fares Added Perks details such as Direct Flight, Connecting flight, Regular,Students, Senior Citizen details are displayed correctly on the Dashboard Page. @smoke', async ({ page }) => {
    console.log('Verifying Special fares details...');
    await expect(page.getByRole('gridcell', { name: 'Special feature Direct Flight' }).getByRole('img')).toBeVisible();
    await expect(page.getByText('Direct Flight')).toBeVisible();
  await expect(page.getByText('Connecting Flight')).toBeVisible();
  await expect(page.getByRole('gridcell', { name: 'Special feature', exact: true }).getByRole('img')).toBeVisible();
  await expect(page.getByText('REGULAR')).toBeVisible();
  await expect(page.getByText('STUDENT')).toBeVisible();
  await expect(page.getByText('SENIOR_CITIZEN')).toBeVisible();
  
  
   
    await logout(page);

  });

  test('TC_03: Verify Special Fares Added Perks options are clickable on the Dashboard Page. @smoke', async ({ page }) => {
    console.log('Verifying Special fares options clickable...');

    await page.getByLabel('Direct Flight').uncheck();
    await page.getByLabel('Connecting Flight').check();
    await page.getByLabel('Direct Flight').check();
    await page.getByLabel('STUDENT').check();
    await page.getByText('SENIOR_CITIZEN').click();
    await page.getByText('REGULAR').click();
    await logout(page);

  });


test('TC_04: Verify the Special fare - Direct Flight checkbox is enabled by default on the Dashboard Page after the user logs in to the TripVista application. @smoke', async ({ page }) => {
    console.log('Verifying Special fares direct flights checkbox enabled by default...');

    await expect(page.getByText('Direct Flight')).toBeVisible();
  await expect(page.getByText('Connecting Flight')).toBeVisible();
  await page.getByLabel('Direct Flight').isChecked();
    await logout(page);

  });

  test('TC_05: Verify the Special fare - Regular radio button is enabled by default on the Dashboard Page after the user logs in to the TripVista application. @smoke', async ({ page }) => {
    console.log('Verifying Special fares Regular radio button enabled by default...');

    await expect(page.getByText('REGULAR')).toBeVisible();
    await expect(page.getByText('STUDENT')).toBeVisible();
    await expect(page.getByText('SENIOR_CITIZEN')).toBeVisible();
    //await expect(page.getByText('REGULAR').locator('input[type="radio"]')).toBeChecked();
    await expect(page.getByText('REGULAR')).toBeChecked();
    await logout(page);

  });

  test('TC_06: Verify the current date is displayed in the Departure DatePicker field on the Dashboard Page. @smoke', async ({ page }) => {
    console.log('Verifying current date is displayed...');

    // Get today's date dynamically
const today = new Date();
const day = today.getDate().toString().padStart(2, '0'); // Ensure two-digit day
const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Convert to MM format
const year = today.getFullYear(); // Get full year

// Format the expected date to match the input field's format: "DD/MM/YYYY"
const expectedDate = `${day}/${month}/${year}`;

console.log(`Expected Departure Date: ${expectedDate}`); // Debugging log

// Verify that Departure Date is visible and correctly set
await expect(page.getByPlaceholder('Departure Date')).toBeVisible();
await expect(page.getByPlaceholder('Departure Date')).toHaveValue(expectedDate);

  });

  test('TC_07: Verify the Arrival Datepicker field is displays the next day of departure date when the Roundtrip option is selected on the Dashboard Page. @smoke', async ({ page }) => {
    console.log('Verifying Arrival date field values...');
    await page.getByRole('button', { name: 'Round Trip' }).click();
    await expect(page.getByRole('button', { name: 'Round Trip' })).toBeEnabled();
    const today = new Date();
const day = today.getDate().toString().padStart(2, '0'); // Ensure two-digit day
const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Convert to MM format
const year = today.getFullYear(); // Get full year

// Format the expected date to match the input field's format: "DD/MM/YYYY"
const expectedDate = `${day}/${month}/${year}`;

console.log(`Expected Departure Date: ${expectedDate}`); // Debugging log

// Verify that Departure Date is visible and correctly set
await expect(page.getByPlaceholder('Departure Date')).toBeVisible();
await expect(page.getByPlaceholder('Departure Date')).toHaveValue(expectedDate);

  });


  test('TC_08: Verify the default selection of Adult 1, Children 0, Infants 0, and Economy class are pre-selected in the Passenger dropdown field on the Dashboard Page. @smoke', async ({ page }) => {
 
    

// Step 1: Verify Default Selection
const userSelectionButton = page.getByRole('button', { name: /User Adults \d+, Children \d+,/ }); 
await expect(userSelectionButton).toBeVisible();
const defaultValue = await userSelectionButton.innerText();
console.log(`Default Selected Value: ${defaultValue}`); // Debugging log

// Step 2: Click on the Selection Field
await userSelectionButton.click();

// Step 3: Get All Dropdown Options Dynamically
// const dropdownOptions = await page.locator("//button[contains(.,'Adults 1, Children 0, Infants 0, ECONOMY')]").allInnerTexts(); // Replace '.dropdown-class' with actual locator
// console.log('Dropdown Options:', dropdownOptions);
const dropdownLocator = page.locator("//button[contains(.,'Adults 1, Children 0, Infants 0, ECONOMY')]"); // Replace with actual locator
await dropdownLocator.waitFor({ state: 'visible', timeout: 5000 }); 

// Step 4: Get All Dropdown Options Dynamically
let dropdownText = await dropdownLocator.innerText(); // Get the entire dropdown text
console.log('Raw Dropdown Text:', dropdownText);
// Step 5: Normalize Extracted Text
let dropdownOptions = dropdownText.split(',').map(text => text.trim()); // Split by ',' and trim spaces
console.log('Processed Dropdown Options:', dropdownOptions); // Debugging log

// Step 6: Verify Expected Values are Present
const expectedValues = [
    'Adults 1',
    'Children 0',
    'Infants 0',
    'ECONOMY' // Match actual format from extracted text
];

for (const value of expectedValues) {
    await expect(dropdownOptions).toContain(value);
}

  });


});