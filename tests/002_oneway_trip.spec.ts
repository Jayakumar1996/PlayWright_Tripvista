import { test, expect } from '@playwright/test';
import exp from 'constants';

const Email = "test@gmail.com";
const password = "SmartWork@1234";
const verifyProfileName = "test user";
const successMessage = 'Login Successful! Welcome back.';

export async function login(page) {
  console.log('Navigating to login page...');
  await page.goto('https://tripvista.appxpay.in/', { waitUntil: 'load', timeout: 60000 });

  console.log('Waiting for the Agent Login button...');
  await page.locator('button', { hasText: 'Agent Login' }).waitFor({ state: 'visible', timeout: 30000 });

  console.log('Clicking the Agent Login button...');
  await page.getByRole('button', { name: 'Agent Login' }).click();

  console.log('Filling login credentials...');
  await page.getByPlaceholder('Enter your email').fill(Email);
  await page.getByPlaceholder('Password').fill(password);

  console.log('Submitting login form...');
  await page.getByTestId('modal-wrapper').getByRole('button', { name: 'Login' }).click();

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

  console.log('Verifying profile name...');
  try {
    await expect(page.getByText(verifyProfileName)).toBeVisible({ timeout: 5000 });
    console.log('Profile name verified.');
  } catch (e) {
    console.error('Error verifying profile name:', e);
    await page.screenshot({ path: 'error-profile-name.png' });
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

async function selectLocation(page, type, locationInput, gridcellText) {
  let locationField;

  // Determine the locator based on the type
  if (type === 'From') {
    locationField = page.getByPlaceholder('Select a location').first();
  } else if (type === 'To') {
    locationField = page
      .locator('div')
      .filter({ hasText: /^To$/ })
      .getByPlaceholder('Select a location');
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

async function searchIcon(page) {
  console.log('Clicking on the Search Icon...');
  await page.getByRole('img', { name: 'Search Icon' }).click();
  console.log('Search initiated for flights.');
}

async function verifyFlightList(page, from, to) {
  console.log('Verifying selected "From" and "To" locations...');
  await expect(page.getByPlaceholder('Select a location').first()).toHaveValue(from);
  await expect(page.getByPlaceholder('Select a location').nth(1)).toHaveValue(to);
  console.log('Verified that both "From" and "To" locations are set correctly.');

  console.log('Verifying that the flight list is displayed...');
  await expect(page.getByRole('main')).toContainText(`Flights from ${from.split(' - ')[0]} → ${to.split(' - ')[0]}`);
  console.log('Flight list displayed for the selected route.');
}

async function viewFlights(page) {
  console.log('Clicking on the first "View Flights" button...');
  await page.getByRole('button', { name: 'View Flights' }).first().click();
  console.log('Clicked on "View Flights".');
}

async function viewFlightDetailsModal(page) {
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

async function verifyAndBookNow(page) {
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

  test('TC_01: Verify usernames are displayed correctly in the right-side corner of the Page. @smoke', async ({ page }) => {
    console.log('Verifying username display...');
    await expect(page.getByText(verifyProfileName)).toBeVisible();
    await logout(page);

  });

  test('TC_02: Verify MyBalance details are correctly displayed in the right-side corner of the Page. @smoke', async ({ page }) => {
    console.log('Verifying MyBalance display...');
    await expect(page.getByText('MyBalance :')).toBeVisible();
    await logout(page);

  });

  test('TC_03: Verify Flight, Hotel, Train, Cabs, Bus, and Holiday menus with Logo are displayed correctly @smoke', async ({ page }) => {
    const menuItems = ['Flight', 'Hotel', 'Train', 'Cabs', 'Bus', 'Holiday'];
    for (const item of menuItems) {
      console.log(`Checking visibility for menu item: ${item}`);
      await expect(page.getByText(item, { exact: true }).first()).toBeVisible();
    }
    await logout(page);
  });

  test('TC_04: Verify OneWay, Round Trip, and Multi City details are displayed correctly on the Page. @smoke', async ({ page }) => {
    console.log('Verifying trip options visibility...');
    const tripOptions = ['One Way', 'Round Trip', 'Multi City'];
    for (const option of tripOptions) {
      console.log(`Checking visibility for trip option: ${option}`);
      await expect(page.getByRole('button', { name: option })).toBeVisible();
    }
    await logout(page);
  });

  test('TC_05: Verify the OneWay button is enabled by default on the page after the user logs in the TripVista application. @smoke', async ({ page }) => {
    console.log('Verifying OneWay button is enabled by default...');
    await expect(page.getByRole('button', { name: 'One Way' })).toBeEnabled();
    await logout(page);
  });

  test('TC_06: Verify the OneWay button details are displayed correctly on the OneWay Page. @smoke', async ({ page }) => {
    console.log('Verifying OneWay page details visibility...');
    await expect(page.getByRole('button', { name: 'One Way' })).toBeEnabled();
    const oneWayDetails = ['From', 'To', 'Departure', 'Return', 'Passengers'];
    for (const detail of oneWayDetails) {
      console.log(`Checking visibility for detail: ${detail}`);
      await expect(page.getByText(detail, { exact: true })).toBeVisible();
    }
    await logout(page);
  });

  test('TC_07: Verify the Direct Flight button is enabled by default on the Dashboard Page after the user logs in to the TripVista application. @smoke', async ({ page }) => {
    console.log('Verifying Direct Flight button is enabled by default...');
    await expect(page.getByRole('button', { name: 'One Way' })).toBeEnabled();
    await expect(page.getByText('Direct flight')).toBeEnabled();
    await logout(page);
  });

  test('TC_08: Verify Special Fares Added Perks details are displayed correctly on the Dashboard Page. @smoke', async ({ page }) => {
    console.log('Verifying Special Fares Added Perks details visibility...');
    await expect(page.getByRole('button', { name: 'One Way' })).toBeEnabled();
    const perks = ['Direct flight', 'Near By Airports', 'Students Fare', 'Senior Citizen Fare'];
    for (const perk of perks) {
      console.log(`Checking visibility for perk: ${perk}`);
      await expect(page.getByText(perk)).toBeVisible();
    }
    await logout(page);
  });

  test('TC_09: Verify Special Fares Added Perks options are clickable on the Dashboard Page. @smoke', async ({ page }) => {
    console.log('Verifying Special Fares Added Perks options are clickable...');
    await expect(page.getByRole('button', { name: 'One Way' })).toBeEnabled();
    await expect(page.getByRole('img', { name: 'Special feature' })).toBeVisible();
    await expect(page.getByText('Direct flight')).toBeChecked();
    const perks = ['Near By Airports', 'Students Fare', 'Senior Citizen Fare'];
    for (const perk of perks) {
      console.log(`Clicking and checking option: ${perk}`);
      await page.getByLabel(perk).check();
      await expect(page.getByLabel(perk)).toBeChecked();
    }
    await logout(page);
  });

  test('Tc_10: Verify the Return DatePicker is enabled  when the OneWay option is selected on the Dashboard Page.', async ({ page }) => {
    console.log('Verifying a specific locator is disabled...');
    await expect(page.locator('div:nth-child(4) > div > div > .rs-picker')).toBeEnabled();
    await logout(page);

  });

  test('Tc_11: Verify current date is selected by default in Date Picker', async ({ page }) => {
    console.log('Starting test: Verifying the current date is selected by default in the Date Picker...');

    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    console.log('Expected formatted date (current date):', formattedDate);

    const presentDate = await page.locator("//p[text()='Departure']/following-sibling::div").textContent();
    console.log('Present Date from Page:', presentDate?.trim());

    if (presentDate?.trim() === formattedDate) {
      console.log('The dates match!');
    } else {
      console.log('The dates do not match.');
    }
    console.log('Test completed: Date verification process finished.');

  });

  test('Tc_12: Verify default values in location dropdowns and departure date field', async ({ page }) => {
    console.log('Starting test: Verifying the default passenger selection in the dropdown...');
    const passenger = await page.locator("//button[contains(.,'Adults 1, Children 0, Infants 0, Economy')]").textContent();
    console.log('Actual passenger selection text:', passenger?.trim());
    expect(passenger?.trim()).toBe('Adults 1, Children 0, Infants 0, Economy');
    console.log('Test completed: Default passenger selection verified successfully.');
  });

  test('Tc_13: Verify the functionality of the Search icon when the "From" and "To" Location are not entered and the Search button is clicked on the Dashboard Page.', async ({ page }) => {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    await page.getByRole('img', { name: 'Search Icon' }).click();
    console.log('Clicked on the Search Icon.');

    // Retrieve the first and second location values
    const firstLocation = await page.getByPlaceholder('Select a location').first().inputValue();
    const secondLocation = await page.getByPlaceholder('Select a location').nth(1).inputValue();

    // Assert the values
    await expect(page.getByPlaceholder('Select a location').first()).toHaveValue('Chennai - Chennai Arpt');
    await expect(page.getByPlaceholder('Select a location').nth(1)).toHaveValue('Delhi - Delhi Indira Gandhi Intl');
    await expect(page.getByPlaceholder('Departure Date')).toHaveValue(formattedDate);
    console.log(`Verified that first location: "${firstLocation}" and second location: "${secondLocation}" have value, and departure date has value "${formattedDate}".`);

    await expect(page.getByText('Flights from')).toBeVisible();
    console.log('Verified that "Flights from" is visible.');

    // Use a regular expression to match the dynamic number
    await expect(page.getByText(/Showing \d+ Flights/)).toBeVisible();
    console.log('Verified that "Showing X Flights" is visible, where X is dynamic.');

    await expect(page.locator("//div[@class='_header_d5bqv_14']")).toBeVisible();
    console.log('Verified that "Search results table" is visible.');
  });

  test('Tc_14: Verify "From" Search Field Functionality on the Dashboard Page', async ({ page }) => {
    const defaultValue = await page.getByPlaceholder('Select a location').first().inputValue();
    console.log(`Default value in "From" field: ${defaultValue}`);
    expect(defaultValue).toContain('Chennai - Chennai Arpt');

  });

  test('Tc_15: Verify "To" Search Field Functionality on the Dashboard Page', async ({ page }) => {
    const defaultValue = await page
      .locator('div', { hasText: /^To$/ })
      .getByPlaceholder('Select a location')
      .inputValue();
    console.log(`Default value in "To" field: ${defaultValue}`);
    expect(defaultValue).toContain('Delhi - Delhi Indira Gandhi Intl');

  });

  test('Tc_16: Verify Interchange Location Functionality on the Dashboard Page after click interchange button.', async ({ page }) => {
    // Locate the From and To fields
    const fromField = page.getByPlaceholder('Select a location').nth(0); // Assuming the first is From
    const toField = page.getByPlaceholder('Select a location').nth(1);   // Assuming the second is To

    // Get initial values
    const initialFromValue = await fromField.inputValue();
    const initialToValue = await toField.inputValue();
    console.log(`Initial From Value: ${initialFromValue}`);
    console.log(`Initial To Value: ${initialToValue}`);

    // Click the icon to interchange values
    await page.getByRole('img', { name: 'icon', exact: true }).click();

    // Verify the values are interchanged
    const updatedFromValue = await fromField.inputValue();
    const updatedToValue = await toField.inputValue();
    console.log(`Updated From Value: ${updatedFromValue}`);
    console.log(`Updated To Value: ${updatedToValue}`);

    expect(updatedFromValue).toBe(initialToValue);
    expect(updatedToValue).toBe(initialFromValue);
  });

  test('Tc_17: Verify redirection from Flight List to Dashboard when "Search Again" is clicked with missing date(automatically patches todays date)', async ({ page }) => {
    await selectLocation(page, 'From', 'pondicherry', 'Pondicherry, Pondicherry');
    await selectLocation(page, 'To', 'bengaluru', 'Bengaluru, Bengaluru Intl');

    // Search for flights
    await searchIcon(page);

    await expect(page.getByRole('heading', { name: 'Flight Not Found' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'There were no flights found for this date & route combination' })).toBeVisible();
    console.log('Verified that "Flight Not Found" and "There were no flights found" headings are visible.');

    await page.getByRole('button', { name: 'Search again' }).click();
    console.log('Clicked on the "Search again" button.');
    await expect(page.getByRole('button', { name: 'One Way' })).toBeEnabled();
    await expect(page).toHaveURL(/home/);
    console.log('Verified redirection to the Home page and "One Way" button is enabled.');

  });

  test('Tc_18: Verify validation throws when searching with empty "To" location', async ({ page }) => {

    await selectLocation(page, 'From', 'chennai', 'Chennai, Chennai Arpt MAA');
    await expect(page.getByPlaceholder('Select a location').first()).toHaveValue('Chennai - Chennai Arpt');
    console.log('Verified that "From" location is set to Chennai.');

    const loc = page.locator('div').filter({ hasText: /^To$/ }).getByPlaceholder('Select a location')
    await loc.click();
    await loc.press('ControlOrMeta+a');
    await loc.fill('');
    await searchIcon(page);

    await expect(page.getByText('To city is required')).toBeVisible();

  });

  test('Tc_19: Verify validation throws when searching with empty "From" location', async ({ page }) => {
    await page.getByPlaceholder('Select a location').first().click();
    await page.getByPlaceholder('Select a location').first().press('ControlOrMeta+a');
    await page.getByPlaceholder('Select a location').first().fill('');
    await selectLocation(page, 'To', 'delhi', 'Delhi, Delhi Indira Gandhi');
    await expect(page.getByPlaceholder('Select a location').nth(1)).toHaveValue('Delhi - Delhi Indira Gandhi Intl');
    console.log('Verified that "To" location is set to Delhi.');
    await searchIcon(page);
    await expect(page.getByText('From city is required')).toBeVisible();

  });

  test('Tc_20: Verify flight list after selecting "From" and "To" locations', async ({ page }) => {
    try {
      console.log('Step 1: Selecting "From" location...');
      await selectLocation(page, 'From', 'chennai', 'Chennai, Chennai Arpt MAA');

      console.log('Step 2: Selecting "To" location...');
      await selectLocation(page, 'To', 'delhi', 'Delhi, Delhi Indira Gandhi');

      console.log('Step 3: Clicking search icon...');
      await searchIcon(page);

      console.log('Step 4: Verifying flight list...');
      await verifyFlightList(page, 'Chennai - Chennai Arpt', 'Delhi - Delhi Indira Gandhi Intl');

      console.log('Test passed: Flight list verified successfully.');

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  test('Tc_21: Verify and validate the "Book Now" functionality for flight details on the Flight List page.', async ({ page }) => {
    await selectLocation(page, 'From', 'chennai', 'Chennai, Chennai Arpt MAA');
    await selectLocation(page, 'To', 'delhi', 'Delhi, Delhi Indira Gandhi');
    await searchIcon(page);
    await verifyFlightList(page, 'Chennai - Chennai Arpt', 'Delhi - Delhi Indira Gandhi Intl');
    await viewFlights(page);
    await viewFlightDetailsModal(page);
    await verifyModalContent(page, 'Chennai Arpt (MAA)', 'Delhi Indira Gandhi Intl (DEL)');
    await closeModal(page);
    await verifyAndBookNow(page);
    await verifyBookingPage(page);
  });

  test('Tc_22: Verify and validate the "Flight Filters" functionality for flight details on the Flight List page.', async ({ page }) => {
    await selectLocation(page, 'From', 'chennai', 'Chennai, Chennai Arpt MAA');
    await selectLocation(page, 'To', 'delhi', 'Delhi, Delhi Indira Gandhi');
    await searchIcon(page);
    await verifyFlightList(page, 'Chennai - Chennai Arpt', 'Delhi - Delhi Indira Gandhi Intl');
    await viewFlights(page);
    const filterNames = ['Airlines', 'Cabin Classes', 'Fare Range', 'Stops', 'Departure Times'];
    await verifyFlightFilters(page, filterNames);

    const airlinesNames = await page.locator("//div[@id='rs-:r8b:-panel']//div[1]//label").allTextContents();
    console.log('Extracted Airlines Names from the filters:' + airlinesNames);
  });

//   test.only('Tc_23: Verify Filters list ', async ({ page }) => {
//     await selectLocation(page, 'From', 'chennai', 'Chennai, Chennai Arpt MAA');
//     await selectLocation(page, 'To', 'delhi', 'Delhi, Delhi Indira Gandhi');
//     await searchIcon(page);
//     await verifyFlightList(page, 'Chennai - Chennai Arpt', 'Delhi - Delhi Indira Gandhi Intl');

//     console.log('Open Airlines filter and apply the "SpiceJet" filter');
//     await page.getByRole('button', { name: 'Airlines' }).click();
//     await page.getByLabel('SpiceJet').check();
//     await page.getByRole('button', { name: 'Airlines' }).click(); // Close filter dropdown
//     await page.waitForTimeout(2000);

//     console.log('Verify SpiceJet is present');
//     const isSpiceJetPresent = page.locator("//span[text()='SpiceJet']");
//     // Retrieve all the text contents of the matching elements
// const texts = await isSpiceJetPresent.allTextContents();

// // Assert that each of the texts is "SpiceJet"
// texts.forEach(text => {
//   expect(text).toBe('SpiceJet');
// });
//     console.log('Is SpiceJet present after applying filter:', isSpiceJetPresent);
//     expect(isSpiceJetPresent).toBeTruthy();


//     console.log('Verify Air India is not present');
//     const isAirIndiaNotPresent = await page.locator("//span[text()='Air India']").isVisible();
//     console.log('Is Air India present after applying filter:', isAirIndiaNotPresent);
//     expect(isAirIndiaNotPresent).toBeFalsy();

//     console.log('Open Airlines filter and uncheck "SpiceJet", then check "Air India"');
//     await page.getByRole('button', { name: 'Airlines' }).click();
//     await page.getByLabel('SpiceJet').uncheck();
//     await page.getByLabel('Air India').check();
//     await page.getByRole('button', { name: 'Airlines' }).click(); // Close filter dropdown
//     await page.waitForTimeout(2000);

//     console.log('Verify Air India is present');
//     const isAirIndiaPresent = await page.locator("//span[text()='Air India']");
//     const texts1 = await isAirIndiaPresent.allTextContents();
//     texts1.forEach(text1 =>{
//       expect(text1).toBe('Air India')
//     })
//     console.log('Is Air India present after applying filter:', isAirIndiaPresent);
//     expect(isAirIndiaPresent).toBeTruthy();

//     console.log('Verify SpiceJet is no longer present');
//     const isSpiceJetStillPresent = await page.locator("//span[text()='SpiceJet']").isVisible();
//     console.log('Is SpiceJet still present after switching to Air India filter:', isSpiceJetStillPresent);
//     expect(isSpiceJetStillPresent).toBeFalsy();
//   });


test.only('Tc_23: Verify Filters list and airline availability after applying filters', async ({ page }) => {
  
  // Step 1: Select locations for the flight search
  await selectLocation(page, 'From', 'chennai', 'Chennai, Chennai Arpt MAA');
  await selectLocation(page, 'To', 'delhi', 'Delhi, Delhi Indira Gandhi');
  await searchIcon(page);
  await verifyFlightList(page, 'Chennai - Chennai Arpt', 'Delhi - Delhi Indira Gandhi Intl');

  console.log('Open Airlines filter and apply the "SpiceJet" filter');
  
  // Step 2: Open Airlines filter and select SpiceJet
  await page.getByRole('button', { name: 'Airlines' }).click();
  await page.getByLabel('SpiceJet').check();
  await page.getByRole('button', { name: 'Airlines' }).click(); // Close filter dropdown
  await page.waitForSelector("//span[text()='SpiceJet']"); // Wait for the filter to apply

  console.log('Verify SpiceJet is present');
  
  // Step 3: Check that "SpiceJet" is present after applying the filter using a for loop
  const isSpiceJetPresent = page.locator("//span[text()='SpiceJet']");
  const texts = await isSpiceJetPresent.allTextContents();

  // Use the for loop to check that each element's text is "SpiceJet"
  for (let text of texts) {
    expect(text).toBe('SpiceJet');
  }

  console.log('Is SpiceJet present after applying filter:', texts.length > 0);

  console.log('Verify Air India is not present');
  
  // Step 4: Verify that "Air India" is not present
  const isAirIndiaNotPresent = await page.locator("//span[text()='Air India']").isVisible();
  console.log('Is Air India present after applying filter:', isAirIndiaNotPresent);
  expect(isAirIndiaNotPresent).toBeFalsy();

  console.log('Open Airlines filter and uncheck "SpiceJet", then check "Air India"');
  
  // Step 5: Open Airlines filter again, uncheck "SpiceJet" and check "Air India"
  await page.getByRole('button', { name: 'Airlines' }).click();
  await page.getByLabel('SpiceJet').uncheck();
  await page.getByLabel('Air India').check();
  await page.getByRole('button', { name: 'Airlines' }).click(); // Close filter dropdown
  await page.waitForSelector("//span[text()='Air India']"); // Wait for Air India to appear

  console.log('Verify Air India is present');
  
  // Step 6: Check that "Air India" is present after applying the filter using a for loop
  const isAirIndiaPresent = page.locator("//span[text()='Air India']");
  const texts1 = await isAirIndiaPresent.allTextContents();

  // Use the for loop to check that each element's text is "Air India"
  for (let text1 of texts1) {
    expect(text1).toBe('Air India');
  }

  console.log('Is Air India present after applying filter:', texts1.length > 0);

  console.log('Verify SpiceJet is no longer present');
  
  // Step 7: Verify that "SpiceJet" is no longer present after switching to Air India filter
  const isSpiceJetStillPresent = await page.locator("//span[text()='SpiceJet']").isVisible();
  console.log('Is SpiceJet still present after switching to Air India filter:', isSpiceJetStillPresent);
  expect(isSpiceJetStillPresent).toBeFalsy();

});

});
// wait page.getByPlaceholder('Select a location').first().click();
//   await page.getByPlaceholder('Select a location').first().press('ControlOrMeta+a');
//   await page.getByPlaceholder('Select a location').first().fill('');
//   await page.getByPlaceholder('Select a location').first().click();
//   await page.getByPlaceholder('Select a location').first().fill('pondicherry');
//   await page.getByRole('gridcell', { name: 'Pondicherry, Pondicherry' }).click();
//   await page.locator('div').filter({ hasText: /^To$/ }).getByPlaceholder('Select a location').click();
//   await page.locator('div').filter({ hasText: /^To$/ }).getByPlaceholder('Select a location').press('ControlOrMeta+a');
//   await page.locator('div').filter({ hasText: /^To$/ }).getByPlaceholder('Select a location').fill('');
//   await page.locator('div').filter({ hasText: /^To$/ }).getByPlaceholder('Select a location').click();
//   await page.locator('div').filter({ hasText: /^To$/ }).getByPlaceholder('Select a location').fill('bengaluru');
//   await page.getByRole('gridcell', { name: 'Bengaluru, Bengaluru Intl' }).click();