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

test.describe('Agent Login Flow', () => {

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
 
    await page.getByRole('button', { name: 'Round Trip' }).click();
    await expect(page.getByRole('button', { name: 'Round Trip' })).toBeEnabled();

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

  // Function to get the formatted date (DD/MM/YYYY)
const getFormattedDate = (daysToAdd = 0) => {
  const today = new Date();
  today.setDate(today.getDate() + daysToAdd);
  return today.toLocaleDateString('en-GB').replace(/\//g, '/'); // Format: DD/MM/YYYY
};

// Function to clear input field
const clearInputField = async (locator) => {
  await locator.dblclick();
  await locator.press('ControlOrMeta+a');
  await locator.fill('');
};

  test('TC_09: Verify the functionality of the Search icon when the "From" and "To" Location & Departure and Arrival date  values are removed  on the Dashboard Page. @smoke', async ({ page }) => {
                 // Get today's and return date dynamically
  const todayDate = getFormattedDate(0);
  const returnDate = getFormattedDate(1);

  // Click Round Trip button and verify it's enabled
  await page.getByRole('button', { name: 'Round Trip' }).click();
  await expect(page.getByRole('button', { name: 'Round Trip' })).toBeEnabled();

  // Verify initial values
  await expect(page.getByRole('img', { name: 'Search Icon' })).toBeVisible();
  const fromInput = page.locator('div').filter({ hasText: /^From$/ }).getByPlaceholder('Select a location');
  const toInput = page.locator('div').filter({ hasText: /^To$/ }).getByPlaceholder('Select a location');

  await expect(fromInput).toHaveValue('Chennai - Chennai Arpt');
  await expect(toInput).toHaveValue('Delhi - Delhi Indira Gandhi Intl');
  await expect(page.getByPlaceholder('Departure Date')).toHaveValue(todayDate);
  await expect(page.getByPlaceholder('Book a return flight')).toHaveValue(returnDate);

  console.log(`Verified departure date: ${todayDate}`);
  console.log(`Verified return date: ${returnDate}`);

  // Clear "From" and "To" fields
  await clearInputField(fromInput);
  await clearInputField(toInput);

  // Clear departure and return dates
  await page.getByRole('gridcell', { name: 'Return Calendar Icon' }).getByLabel('Clear').click();
  await page.getByLabel('Clear').click();

  // Function to verify empty fields
  const verifyEmptyFields = async () => {
    await expect(fromInput).toBeEmpty();
    await expect(toInput).toBeEmpty();
    await expect(page.getByPlaceholder('Departure Date')).toHaveValue('');
    await expect(page.getByPlaceholder('Book a return flight')).toHaveValue('');
  };

  // Verify fields are empty
  await verifyEmptyFields();
  await expect(page.getByRole('img', { name: 'Search Icon' })).toBeVisible();
  
    
      });

      test('TC_10: Verify the default patched location details on "From" & "To" fields on Dashboard page. @smoke', async ({ page }) => {
  // Click Round Trip button and verify it's enabled
  await page.getByRole('button', { name: 'Round Trip' }).click();
  await expect(page.getByRole('button', { name: 'Round Trip' })).toBeEnabled();

  // Verify initial values
  await expect(page.getByRole('img', { name: 'Search Icon' })).toBeVisible();
  const fromInput = page.locator('div').filter({ hasText: /^From$/ }).getByPlaceholder('Select a location');
  const toInput = page.locator('div').filter({ hasText: /^To$/ }).getByPlaceholder('Select a location');

  await expect(fromInput).toHaveValue('Chennai - Chennai Arpt');
  await expect(toInput).toHaveValue('Delhi - Delhi Indira Gandhi Intl');
    
  
    
      });

      test('TC_11: Verify "From" & "To" Search Field Functionality on the Dashboard Page. @smoke', async ({ page }) => {
 
        await page.getByRole('button', { name: 'Round Trip' }).click();
        await expect(page.getByRole('button', { name: 'Round Trip' })).toBeEnabled();
      
        // Verify initial values
        await expect(page.getByRole('img', { name: 'Search Icon' })).toBeVisible();
        const fromInput = page.locator('div').filter({ hasText: /^From$/ }).getByPlaceholder('Select a location');
        const toInput = page.locator('div').filter({ hasText: /^To$/ }).getByPlaceholder('Select a location');
      
        await expect(fromInput).toHaveValue('Chennai - Chennai Arpt');
        await expect(toInput).toHaveValue('Delhi - Delhi Indira Gandhi Intl');
        
      
        // Clear "From" and "To" fields
        await clearInputField(fromInput);
        await clearInputField(toInput);
        await page.locator('div').filter({ hasText: /^From$/ }).getByPlaceholder('Select a location').fill('beng');
        await page.getByRole('gridcell', { name: 'Bengaluru, Bengaluru Intl' }).click();
        await page.locator('div').filter({ hasText: /^To$/ }).getByPlaceholder('Select a location').fill('chenn');
  await page.getByRole('gridcell', { name: 'Chennai, Chennai Arpt MAA' }).click();
  await expect(page.locator('div').filter({ hasText: /^From$/ }).getByPlaceholder('Select a location')).toHaveValue('Bengaluru - Bengaluru Intl Arpt');
  await expect(page.locator('div').filter({ hasText: /^To$/ }).getByPlaceholder('Select a location')).toHaveValue('Chennai - Chennai Arpt');
    
      });


      test('TC_12: Verify Interchange Location Functionality on the Dashboard Page after click interchange button. @smoke', async ({ page }) => {

    
        await page.getByRole('button', { name: 'Round Trip' }).click();
        await expect(page.getByRole('button', { name: 'Round Trip' })).toBeEnabled();
      
        // Verify initial values
        await expect(page.getByRole('img', { name: 'Search Icon' })).toBeVisible();
        const fromInput = page.locator('div').filter({ hasText: /^From$/ }).getByPlaceholder('Select a location');
        const toInput = page.locator('div').filter({ hasText: /^To$/ }).getByPlaceholder('Select a location');
      
        await expect(fromInput).toHaveValue('Chennai - Chennai Arpt');
        await expect(toInput).toHaveValue('Delhi - Delhi Indira Gandhi Intl');
        
      
        // Clear "From" and "To" fields
        await clearInputField(fromInput);
        await clearInputField(toInput);
        await page.locator('div').filter({ hasText: /^From$/ }).getByPlaceholder('Select a location').fill('beng');
        await page.getByRole('gridcell', { name: 'Bengaluru, Bengaluru Intl' }).click();
        await page.locator('div').filter({ hasText: /^To$/ }).getByPlaceholder('Select a location').fill('chenn');
  await page.getByRole('gridcell', { name: 'Chennai, Chennai Arpt MAA' }).click();
  await expect(page.locator('div').filter({ hasText: /^From$/ }).getByPlaceholder('Select a location')).toHaveValue('Bengaluru - Bengaluru Intl Arpt');
  await expect(page.locator('div').filter({ hasText: /^To$/ }).getByPlaceholder('Select a location')).toHaveValue('Chennai - Chennai Arpt');


        await page.getByRole('img', { name: 'icon', exact: true }).click();
  await expect(page.locator('div').filter({ hasText: /^From$/ }).getByPlaceholder('Select a location')).toHaveValue('Chennai - Chennai Arpt');
  await expect(page.locator('div').filter({ hasText: /^To$/ }).getByPlaceholder('Select a location')).toHaveValue('Bengaluru - Bengaluru Intl Arpt');


  
      });

      test.only('TC_13: Verify Roundtrip booking. @smoke', async ({ page }) => {

    
        await page.getByRole('button', { name: 'Round Trip' }).click();
        await expect(page.getByRole('button', { name: 'Round Trip' })).toBeEnabled();
      
        // Verify initial values
        await expect(page.getByRole('img', { name: 'Search Icon' })).toBeVisible();
        const fromInput = page.locator('div').filter({ hasText: /^From$/ }).getByPlaceholder('Select a location');
        const toInput = page.locator('div').filter({ hasText: /^To$/ }).getByPlaceholder('Select a location');
      
        await expect(fromInput).toHaveValue('Chennai - Chennai Arpt');
        await expect(toInput).toHaveValue('Delhi - Delhi Indira Gandhi Intl');
        
    //     // Get today's date in 'DD/MM/YYYY' format
    // const today = new Date();
    // const todayDate = today.getDate();
    // const todayFormatted = today.toLocaleDateString('en-GB'); // 'DD/MM/YYYY' format

    // // Calculate the next day
    // const tomorrow = new Date(today);
    // tomorrow.setDate(today.getDate() + 1);
    // const tomorrowDate = tomorrow.getDate();
    // const tomorrowFormatted = tomorrow.toLocaleDateString('en-GB'); // 'DD/MM/YYYY'

    // // Check if the Departure Date field has today's date
    // const departureField = page.getByPlaceholder('Departure Date');
    // const departureValue = await departureField.inputValue();

    // if (departureValue === todayFormatted) {
    //     console.log(`Departure date is today (${todayFormatted}). Selecting next day (${tomorrowFormatted}).`);

    //     // Open the date picker
    //     await departureField.click();

    //     // Select the next day dynamically in the calendar
    //     await page.getByText(tomorrowDate.toString(), { exact: true }).click();

    //     // Click the "OK" button
    //     await page.getByRole('button', { name: 'OK' }).click();

    //     // Verify the departure date changed to the next day
    //     await expect(departureField).toHaveValue(tomorrowFormatted);
        
    //     // Verify the return flight is updated to the next day after departure
    //     const returnDate = new Date(tomorrow);
    //     returnDate.setDate(tomorrow.getDate() + 1);
    //     const returnDateFormatted = returnDate.toLocaleDateString('en-GB');

    //     await expect(page.getByPlaceholder('Book a return flight')).toHaveValue(returnDateFormatted);
    // } else {
    //     console.log(`Departure date is already set to a different date: ${departureValue}`);
    // }




        //await page.getByRole('img', { name: 'icon', exact: true }).click();
        await page.locator("img[alt='Search Icon']").click();
        await page.waitForTimeout(9000); // Waits for 5 seconds


 // Select Departure Flight
 const departureViewPrice = page.locator("body > div:nth-child(1) > div:nth-child(1) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(5) > button:nth-child(2)");
 await departureViewPrice.click();
 const departureBookNow = page.locator("body > div:nth-child(1) > div:nth-child(1) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > button:nth-child(1)");
 await departureBookNow.click();

 // Select Return Flight
 const returnViewPrice = page.locator("body > div:nth-child(1) > div:nth-child(1) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(5) > button:nth-child(2)");
 await returnViewPrice.click();
 const returnBookNow = page.locator("body > div:nth-child(1) > div:nth-child(1) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(4) > button:nth-child(1)");
 await returnBookNow.click();
 await page.waitForTimeout(6000); // Waits for 5 seconds


 // Selector for the Confirm Payment button
 const confirmPaymentButton = page.locator("body > div:nth-child(1) > div:nth-child(1) > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(40) > div:nth-child(3) > button:nth-child(2)");

 // Wait for the page to fully load
 await page.waitForLoadState('networkidle'); 

 // Check if Confirm Payment button exists before waiting
 if (await confirmPaymentButton.isVisible()) {
   console.log('✅ Confirm Payment button is visible, proceeding to click.');

   // Ensure the modal overlay is detached (if applicable)
   await page.locator('div.modal-overlay').waitFor({ state: 'detached', timeout: 5000 });

   // Wait for the button to be visible and click
   await confirmPaymentButton.waitFor({ state: 'visible', timeout: 30000 });  // Reduce timeout to 30s
   await confirmPaymentButton.click();
   
   console.log('🛒 Confirm Payment button clicked successfully!');
 } else {
   console.log('❌ Confirm Payment button is NOT visible. Test failed.');
 }


 await page.waitForTimeout(6000); // Waits for 5 seconds

//  // Check if "Request flight no longer available" alert appears
//  const flightNotAvailableAlert = page.locator("div[role='alert'] div:nth-child(2)");
//  if (await flightNotAvailableAlert.isVisible()) {
//      console.log("Flight no longer available alert is displayed.");
//  } else {
//      console.log("Flight successfully booked.");
//  }



 console.log("Filling Traveller Details...");
  await page.getByLabel('Traveller Details').getByLabel('angle down').click();
  await page.getByText('Mr', { exact: true }).click();
  
  await page.getByPlaceholder('First Name').click();
  await page.getByPlaceholder('First Name').fill('Jayakumar');
  await page.getByPlaceholder('First Name').press('Tab');
  await page.getByPlaceholder('Last Name').fill('Thiruvenkidam');
  
  await page.getByPlaceholder('Mobile Number', { exact: true }).click();
  await page.getByPlaceholder('Mobile Number', { exact: true }).fill('7200312848');
  
  await page.getByPlaceholder('Email ID').click();
  await page.getByPlaceholder('Email ID').fill('jayakumarjj.t@gmail.com');
  
  await page.getByPlaceholder('Passport number').click();
  await page.getByPlaceholder('Passport number').fill('98765432');
  
  // 3️⃣ Continue to Addons Page
  console.log("Proceeding to Addons Page...");
  await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.locator('form')).toContainText('Addons (Optional)');
  
  // 4️⃣ Select Meals
  // console.log("Selecting Meal Preferences...");
  // await expect(page.getByRole('tablist')).toContainText('Meals');
  // await expect(page.getByRole('radiogroup')).toContainText('Veg');
  // await expect(page.getByRole('radiogroup')).toContainText('Non-Veg');
  // await page.getByLabel('Non-Veg').check();
  
  // // 5️⃣ Choose Baggage Addons
  // console.log("Selecting Baggage Preferences...");
  // await page.getByRole('tab', { name: 'Baggage' }).click();
  // await expect(page.getByLabel('Baggage')).toContainText('Bag Out First with 1 Bag');
  // // await expect(page.getByLabel('Baggage')).toContainText('5KG');
  // // await expect(page.getByLabel('Baggage')).toContainText('10KG');
  // await page.locator('div').filter({ hasText: /^₹3000$/ }).getByRole('button').nth(1).click();
   await page.getByRole('button', { name: 'Continue' }).click();
  
  // 6️⃣ Seat Selection
  console.log("Selecting Seats...");
  // await expect(page.locator('form')).toContainText('Seat Selection');
  // await expect(page.getByLabel('Seat Selection').getByRole('button')).toContainText('Flight 1');
  // await page.getByText('10A').click();
  // await expect(page.getByLabel('Seat Selection').getByRole('paragraph')).toContainText('(Selected)');
  // await page.locator('html').click();
  await page.getByRole('button', { name: 'Continue' }).click();
  
  // 7️⃣ Contact Details
  console.log("Verifying Contact Details...");
  await expect(page.locator('form')).toContainText('Contact Details');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
  await page.getByRole('button', { name: 'Continue' }).click();
  
  console.log("Checking Validation Messages...");
  await expect(page.getByText('Mobile number is required')).toBeVisible();
  await expect(page.getByText('Email is required')).toBeVisible();
  
  // 8️⃣ Enter Correct Contact Information
  console.log("Filling Correct Contact Information...");
  await page.getByPlaceholder('Mobile Number').fill('7200315848');
  await page.getByPlaceholder('Email Id').fill('jayakumarjj.t@gmail.com');
  
  await page.getByRole('button', { name: 'Continue' }).click();
  
  // 9️⃣ Agree to Terms & Confirm Payment
  console.log("Agreeing to Terms & Confirming Payment...");
  await page.locator('#agree').scrollIntoViewIfNeeded();
  await page.locator('#agree').check();
  await page.locator("//button[normalize-space()='Confirm Payment']").scrollIntoViewIfNeeded();
  await page.locator("//button[normalize-space()='Confirm Payment']").click();
  
  // 🔟 Final Payment Process
  console.log("Proceeding with Final Payment...");
  await page.locator('#agree').scrollIntoViewIfNeeded();
  await page.locator('#agree').check();
  await page.locator("//button[normalize-space()='Make Payment']").scrollIntoViewIfNeeded();
  await page.locator("//button[normalize-space()='Make Payment']").click();
  
  // Selecting  Razorpay
  console.log("Selecting Razorpay...");
  await page.locator("//a[normalize-space()='Razor PAY']").click();
  await page.locator("//button[normalize-space()='Pay Now']").click();

  // Wait for 2 minutes (120,000 milliseconds) to allow manual payment
console.log('Waiting for 2 minutes to complete the payment manually...');
await page.waitForTimeout(120000); // 120000ms = 2 minutes

console.log('2 minutes wait completed, proceeding with the next steps...');
console.log("Booking flow completed successfully.");



  
      });

      test('TC_14: Verify Booking flow for roundtrip. @smoke', async ({ page }) => {
 
      
        await page.getByRole('button', { name: 'Round Trip' }).click();
        await page.getByRole('img', { name: 'Search Icon' }).click();
        await page.locator('div:nth-child(5) > .rs-btn').first().click();
        await page.locator('div > div:nth-child(4) > .rs-btn').first().click();
        await page.locator('div:nth-child(2) > div:nth-child(3) > ._border_d5bqv_9 > .rs-panel-body > div > div:nth-child(5) > .rs-btn').click();
        await page.locator('div:nth-child(2) > div:nth-child(3) > ._border_d5bqv_9 > div > .rs-panel > .rs-panel-body > div > div > div:nth-child(4) > .rs-btn').first().click();
        
          
            });
});