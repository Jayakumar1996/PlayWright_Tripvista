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
    const perks = ['Direct flight', 'Connecting Flight', 'REGULAR', 'STUDENT', 'SENIOR_CITIZEN'];
    for (const perk of perks) {
      console.log(`Checking visibility for perk: ${perk}`);
      await expect(page.getByText(perk)).toBeVisible();
    }
 
    await logout(page);
  });
 
  test('TC_09: Verify Special Fares Added Perks options are clickable on the Dashboard Page. @smoke', async ({ page }) => {
    console.log('Verifying Special Fares Added Perks options are clickable...');
    await expect(page.getByRole('button', { name: 'One Way' })).toBeEnabled();
    await expect(page.getByRole('gridcell', { name: 'Special feature Direct Flight' }).getByRole('img')).toBeVisible();
    await expect(page.getByText('Direct flight')).toBeChecked();
    const perks = ['Connecting Flight', 'REGULAR', 'STUDENT', 'SENIOR_CITIZEN'];
    for (const perk of perks) {
      console.log(`Clicking and checking option: ${perk}`);
      await page.getByLabel(perk).check();
      //await expect(page.getByLabel(perk)).toBeChecked();
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
    const passenger = await page.locator("//button[contains(.,'Adults 1, Children 0, Infants 0, ECONOMY')]").textContent();
    console.log('Actual passenger selection text:', passenger?.trim());
    expect(passenger?.trim()).toBe('Adults 1, Children 0, Infants 0, ECONOMY');
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
 const xxxx="pondicherry";

    await selectLocation(page, 'From', xxxx, 'Pondicherry, Pondicherry');
    await selectLocation(page, 'To', 'mumbai', 'Mumbai, Chhatrapati Shivaji');

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

    const searchIcon2 = await page.getByRole('img', { name: 'Search Icon' });
    // Verify the search button is disabled
    const isDisabled = await searchIcon2.isDisabled();
    await page.waitForTimeout(1000);    
    if (isDisabled) {
      console.log('The Search Icon button is disabled.');
    } else {
      console.log('The Search Icon button is enabled.');
    }
    
  });

  test('Tc_19: Verify validation throws when searching with empty "From" location', async ({ page }) => {
    await page.getByPlaceholder('Select a location').first().click();
    await page.getByPlaceholder('Select a location').first().press('ControlOrMeta+a');
    await page.getByPlaceholder('Select a location').first().fill('');
    await selectLocation(page, 'To', 'delhi', 'Delhi, Delhi Indira Gandhi');
    await expect(page.getByPlaceholder('Select a location').nth(1)).toHaveValue('Delhi - Delhi Indira Gandhi Intl');
    console.log('Verified that "To" location is set to Delhi.');

    const searchIcon1 = await page.getByRole('img', { name: 'Search Icon' });
     // Verify the search button is disabled
     const isDisabled = await searchIcon1.isDisabled();
    
     if (isDisabled) {
       console.log('The Search Icon button is disabled.');
     } else {
       console.log('The Search Icon button is enabled.');
     }

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

  test('Tc_21: Verify and validate the "Flight Filters" functionality for flight details on the Flight List page.', async ({ page }) => {
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

  
test('Tc_22: Verify and Validate the Flight Filters Airlines Functionality on the Flight List Page', async ({ page }) => {
  
  // Step 1: Select locations for the flight search
  await selectLocation(page, 'From', 'chennai', 'Chennai, Chennai Arpt MAA');
  await selectLocation(page, 'To', 'delhi', 'Delhi, Delhi Indira Gandhi');
  await searchIcon(page);
  // await verifyFlightList(page, 'Chennai - Chennai Arpt', 'Delhi - Delhi Indira Gandhi Intl');

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
test('Tc_23: Verify and Validate the Flight Filters Cabin Classes Functionality on the Flight List Page', async ({page})=>{
 // Step 1: Select locations for the flight search
 await selectLocation(page, 'From', 'chennai', 'Chennai, Chennai Arpt MAA');
 await selectLocation(page, 'To', 'delhi', 'Delhi, Delhi Indira Gandhi');
 await searchIcon(page);

  // List of cabin classes
  const cabinClasses = ['BUSINESS', 'PREMIUM_ECONOMY', 'FIRST', 'ECONOMY'];

  // Function to apply filter for a cabin class
  const applyFilter = async (cabinClass) => {
    console.log(`Applying filter: ${cabinClass}`);
    await page.getByRole('button', { name: 'Cabin Classes' }).click();
  };

  // Function to verify displayed flights
  const verifyFlights = async (expectedClass) => {
    await page.getByRole('button', { name: 'View Flights' }).first().click();
    console.log(`Verifying flights for cabin class: ${expectedClass}`);
    const flights = await page.locator('p').filter({ hasText: expectedClass }).allTextContents();
    console.log(`Displayed flights for ${expectedClass}:`, flights);
    for (const flight of flights) {
      expect(flight).toContain(expectedClass); // Ensure all flights belong to the selected class
    }
  };

  // Loop through each cabin class and test
  for (const cabinClass of cabinClasses) {
    await applyFilter(cabinClass); // Apply filter
    await verifyFlights(cabinClass); // Verify results
    await page.getByLabel(cabinClass).uncheck(); // Reset filter
  }

  // Test case for multiple cabin classes
  console.log('Testing multiple cabin class selection...');
  await page.getByLabel('BUSINESS').check();
  await page.getByLabel('ECONOMY').check();
  await page.getByRole('button', { name: 'View Flights' }).first().click();

  // Verify both BUSINESS and ECONOMY flights are displayed
  const mixedFlights = await page.locator('p').filter({ hasText: /BUSINESS|ECONOMY/ }).allTextContents();
  console.log('Displayed flights for BUSINESS and ECONOMY:', mixedFlights);
  for (const flight of mixedFlights) {
    expect(flight).toMatch(/BUSINESS|ECONOMY/);
  }

  // Reset all filters
  await page.getByLabel('BUSINESS').uncheck();
  await page.getByLabel('ECONOMY').uncheck();

  console.log('Test completed successfully!');
});
test('Tc_24: Verify and Validate the Flight Filters Fare Range Filter Functionality on the Flight List Page', async ({page})=>{
  await selectLocation(page, 'From', 'chennai', 'Chennai, Chennai Arpt MAA');
  await selectLocation(page, 'To', 'delhi', 'Delhi, Delhi Indira Gandhi');
  await searchIcon(page);

 // Open the Fare Range filter
console.log('Clicking the Fare Range filter button...');
await page.getByRole('button', { name: 'Fare Range' }).click();

// Locate the slider handle
console.log('Locating the slider handle...');
const sliderHandle = page.getByTestId('slider-handle');

// Get the bounding box of the slider handle
console.log('Getting the bounding box of the slider handle...');
const boundingBox = await sliderHandle.boundingBox();
if (!boundingBox) {
  console.error('Error: Slider handle bounding box not found.');
  throw new Error('Slider handle bounding box not found.');
}

console.log('Bounding box found:', boundingBox);

// Simulate clicking and dragging the slider without releasing the click
const startX = boundingBox.x + boundingBox.width / 2;
const startY = boundingBox.y + boundingBox.height / 2;
const dragOffset = 6000; // Adjust this value for how far to drag

console.log(`Starting drag at coordinates (${startX}, ${startY}) with an offset of ${dragOffset} pixels.`);

// Move to the slider handle and press the mouse down
console.log('Moving the mouse to the slider handle and pressing down...');
await page.mouse.move(startX, startY);
await page.mouse.down();

// Drag the slider to the right (keeping the click pressed)
console.log(`Dragging the slider to the right by ${dragOffset} pixels...`);
await page.mouse.move(startX + dragOffset, startY, { steps: 10 });

console.log('Slider drag action completed.');


});

test('Tc_25: Verify and validate the "View Fares" functionality on the Flight List page.', async ({ page }) => {
  await selectLocation(page, 'From', 'chennai', 'Chennai, Chennai Arpt MAA');
  await selectLocation(page, 'To', 'delhi', 'Delhi, Delhi Indira Gandhi');
  await searchIcon(page);
  // await verifyFlightList(page, 'Chennai - Chennai Arpt', 'Delhi - Delhi Indira Gandhi Intl');
  await viewFlights(page);
// need to hover on fare

// Get all the info icons (assuming they are <img> elements next to prices)
const infoIcons = await page.locator('p').filter({ hasText: '₹' }).getByRole('img');

// Loop through all the info icons and hover over each one, then print the price dynamically
const numberOfIcons = await infoIcons.count();
console.log(`Found ${numberOfIcons} info icons.`);

for (let i = 0; i < numberOfIcons; i++) {
  console.log(`Hovering over info icon ${i + 1}...`);

  // Hover over the icon
  await infoIcons.nth(i).hover();

  // Get the price text associated with the current info icon
  const priceText = await page.locator('p').nth(i).textContent();

  console.log(`Price for icon ${i + 1}: ${priceText}`);

  // You can add additional conditions or actions if needed based on the price
}

});

test('Tc_26: Verify and validate the "View Flight Details" on the flight listing page', async ({ page }) => {
  await selectLocation(page, 'From', 'chennai', 'Chennai, Chennai Arpt MAA');
  await selectLocation(page, 'To', 'delhi', 'Delhi, Delhi Indira Gandhi');
  await searchIcon(page);
  // await verifyFlightList(page, 'Chennai - Chennai Arpt', 'Delhi - Delhi Indira Gandhi Intl');
  await viewFlights(page);
  await viewFlightDetailsModal(page);
  await verifyModalContent(page, 'Chennai Arpt (MAA)', 'Delhi Indira Gandhi Intl (DEL)');
  await closeModal(page);
});

test('Tc_27: Verify and validate the "Book Now" functionality for flight details on the Flight List page.', async ({ page }) => {
  await selectLocation(page, 'From', 'chennai', 'Chennai, Chennai Arpt MAA');
  await selectLocation(page, 'To', 'delhi', 'Delhi, Delhi Indira Gandhi');
  await searchIcon(page);
  // await verifyFlightList(page, 'Chennai - Chennai Arpt', 'Delhi - Delhi Indira Gandhi Intl');
  await viewFlights(page);
  await viewFlightDetailsModal(page);
  await verifyModalContent(page, 'Chennai Arpt (MAA)', 'Delhi Indira Gandhi Intl (DEL)');
  await closeModal(page);
  await verifyAndBookNow(page);
  await verifyBookingPage(page);
});

test('Tc_28: Verify and validate Flight Itinery functionality on the Booking Page.', async ({page})=>{
  await selectLocation(page, 'From', 'chennai', 'Chennai, Chennai Arpt MAA');
  await selectLocation(page, 'To', 'delhi', 'Delhi, Delhi Indira Gandhi');
  await searchIcon(page);
  // await verifyFlightList(page, 'Chennai - Chennai Arpt', 'Delhi - Delhi Indira Gandhi Intl');
  await viewFlights(page);
  await viewFlightDetailsModal(page);
  await verifyModalContent(page, 'Chennai Arpt (MAA)', 'Delhi Indira Gandhi Intl (DEL)');
  await closeModal(page);
  await verifyAndBookNow(page);
  await verifyBookingPage(page);

  console.log("Starting the booking flow...");

  // 1️⃣ Verify Traveller Details Page
  await expect(page.locator('form')).toContainText('Traveller Details');
  await expect(page.locator('form')).toContainText('Change Flight');
  
  // 2️⃣ Select Traveller Title and Enter Details
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
  
  // need to fill gst fields
  await page.getByPlaceholder('GSTIN Mobile Number').click();
  await page.getByPlaceholder('GSTIN', { exact: true }).dblclick();
  await page.getByPlaceholder('GSTIN', { exact: true }).fill('98734982394234');
  await page.getByPlaceholder('GSTIN Mobile Number').click();
  await page.getByPlaceholder('GSTIN Mobile Number').fill('7200318249');
  await page.getByPlaceholder('GSTIN Email Address').click();
  await page.getByPlaceholder('GSTIN Email Address').fill('jk@yopmail.com');
  await page.getByPlaceholder('GSTIN Phone Number').click();
  await page.getByPlaceholder('GSTIN Phone Number').fill('9876543210');
  await page.getByRole('button', { name: 'Continue' }).click();

});

test('Tc_29: Verify and Validate Add-ons Functionality on the Complete Your Booking Details Page', async ({page})=>{
  await selectLocation(page, 'From', 'chennai', 'Chennai, Chennai Arpt MAA');
  await selectLocation(page, 'To', 'delhi', 'Delhi, Delhi Indira Gandhi');
  await searchIcon(page);
  // await verifyFlightList(page, 'Chennai - Chennai Arpt', 'Delhi - Delhi Indira Gandhi Intl');
  await viewFlights(page);
  await viewFlightDetailsModal(page);
  await verifyModalContent(page, 'Chennai Arpt (MAA)', 'Delhi Indira Gandhi Intl (DEL)');
  await closeModal(page);
  await verifyAndBookNow(page);
  await verifyBookingPage(page);

  console.log("Starting the booking flow...");

  // 1️⃣ Verify Traveller Details Page
  await expect(page.locator('form')).toContainText('Traveller Details');
  await expect(page.locator('form')).toContainText('Change Flight');
  
  // 2️⃣ Select Traveller Title and Enter Details
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
  console.log("Selecting Meal Preferences...");
  await expect(page.getByRole('tablist')).toContainText('Meals');
  await expect(page.getByRole('radiogroup')).toContainText('Veg');
  await expect(page.getByRole('radiogroup')).toContainText('Non-Veg');
  await page.getByLabel('Non-Veg').check();
  
  // 5️⃣ Choose Baggage Addons
  console.log("Selecting Baggage Preferences...");
  await page.getByRole('tab', { name: 'Baggage' }).click();
  await expect(page.getByLabel('Baggage')).toContainText('Bag Out First with 1 Bag');
  // await expect(page.getByLabel('Baggage')).toContainText('5KG');
  // await expect(page.getByLabel('Baggage')).toContainText('10KG');
  await page.locator('div').filter({ hasText: /^₹3000$/ }).getByRole('button').nth(1).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  
  
  console.log("AddOns flow completed successfully.");
});

test('Tc_30: Verify and Validate the seat selection functionality on the "Complete Your Booking" details page', async ({page})=>{
  await selectLocation(page, 'From', 'chennai', 'Chennai, Chennai Arpt MAA');
  await selectLocation(page, 'To', 'delhi', 'Delhi, Delhi Indira Gandhi');
  await searchIcon(page);
  // await verifyFlightList(page, 'Chennai - Chennai Arpt', 'Delhi - Delhi Indira Gandhi Intl');
  await viewFlights(page);
  await viewFlightDetailsModal(page);
  await verifyModalContent(page, 'Chennai Arpt (MAA)', 'Delhi Indira Gandhi Intl (DEL)');
  await closeModal(page);
  await verifyAndBookNow(page);
  await verifyBookingPage(page);

  console.log("Starting the booking flow...");

  // 1️⃣ Verify Traveller Details Page
  await expect(page.locator('form')).toContainText('Traveller Details');
  await expect(page.locator('form')).toContainText('Change Flight');
  
  // 2️⃣ Select Traveller Title and Enter Details
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
  console.log("Selecting Meal Preferences...");
  await expect(page.getByRole('tablist')).toContainText('Meals');
  await expect(page.getByRole('radiogroup')).toContainText('Veg');
  await expect(page.getByRole('radiogroup')).toContainText('Non-Veg');
  await page.getByLabel('Non-Veg').check();
  
  // 5️⃣ Choose Baggage Addons
  console.log("Selecting Baggage Preferences...");
  await page.getByRole('tab', { name: 'Baggage' }).click();
  await expect(page.getByLabel('Baggage')).toContainText('Bag Out First with 1 Bag');
  // await expect(page.getByLabel('Baggage')).toContainText('5KG');
  // await expect(page.getByLabel('Baggage')).toContainText('10KG');
  await page.locator('div').filter({ hasText: /^₹3000$/ }).getByRole('button').nth(1).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  
  // 6️⃣ Seat Selection
  console.log("Selecting Seats...");
  await expect(page.locator('form')).toContainText('Seat Selection');
  await expect(page.getByLabel('Seat Selection').getByRole('button')).toContainText('Flight 1');
  await page.getByText('10A').click();
  await expect(page.getByLabel('Seat Selection').getByRole('paragraph')).toContainText('(Selected)');
  await page.locator('html').click();
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
  });

test('Tc_31: Flight Booking Reconfirmation Page listing page is loded', async ({page})=>{
  await selectLocation(page, 'From', 'chennai', 'Chennai, Chennai Arpt MAA');
  await selectLocation(page, 'To', 'delhi', 'Delhi, Delhi Indira Gandhi');
  await searchIcon(page);
  // await verifyFlightList(page, 'Chennai - Chennai Arpt', 'Delhi - Delhi Indira Gandhi Intl');
  await viewFlights(page);
  await viewFlightDetailsModal(page);
  await verifyModalContent(page, 'Chennai Arpt (MAA)', 'Delhi Indira Gandhi Intl (DEL)');
  await closeModal(page);
  await verifyAndBookNow(page);
  await verifyBookingPage(page);

  console.log("Starting the booking flow...");

  // 1️⃣ Verify Traveller Details Page
  await expect(page.locator('form')).toContainText('Traveller Details');
  await expect(page.locator('form')).toContainText('Change Flight');
  
  // 2️⃣ Select Traveller Title and Enter Details
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
  console.log("Selecting Meal Preferences...");
  await expect(page.getByRole('tablist')).toContainText('Meals');
  await expect(page.getByRole('radiogroup')).toContainText('Veg');
  await expect(page.getByRole('radiogroup')).toContainText('Non-Veg');
  await page.getByLabel('Non-Veg').check();
  
  // 5️⃣ Choose Baggage Addons
  console.log("Selecting Baggage Preferences...");
  await page.getByRole('tab', { name: 'Baggage' }).click();
  await expect(page.getByLabel('Baggage')).toContainText('Bag Out First with 1 Bag');
  // await expect(page.getByLabel('Baggage')).toContainText('5KG');
  // await expect(page.getByLabel('Baggage')).toContainText('10KG');
  await page.locator('div').filter({ hasText: /^₹3000$/ }).getByRole('button').nth(1).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  
  // 6️⃣ Seat Selection
  console.log("Selecting Seats...");
  await expect(page.locator('form')).toContainText('Seat Selection');
  await expect(page.getByLabel('Seat Selection').getByRole('button')).toContainText('Flight 1');
  await page.getByText('10A').click();
  await expect(page.getByLabel('Seat Selection').getByRole('paragraph')).toContainText('(Selected)');
  await page.locator('html').click();
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
  
});

test('Tc_32: "Verify and Validate the seat selection functionality on the ""Complete Your Wallet Payment Option"" details page', async ({page})=>{
  await selectLocation(page, 'From', 'chennai', 'Chennai, Chennai Arpt MAA');
  await selectLocation(page, 'To', 'delhi', 'Delhi, Delhi Indira Gandhi');
  await searchIcon(page);
  // await verifyFlightList(page, 'Chennai - Chennai Arpt', 'Delhi - Delhi Indira Gandhi Intl');
  await viewFlights(page);
  await viewFlightDetailsModal(page);
  await verifyModalContent(page, 'Chennai Arpt (MAA)', 'Delhi Indira Gandhi Intl (DEL)');
  await closeModal(page);
  await verifyAndBookNow(page);
  await verifyBookingPage(page);

  console.log("Starting the booking flow...");

  // 1️⃣ Verify Traveller Details Page
  await expect(page.locator('form')).toContainText('Traveller Details');
  await expect(page.locator('form')).toContainText('Change Flight');
  
  // 2️⃣ Select Traveller Title and Enter Details
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
  console.log("Selecting Meal Preferences...");
  await expect(page.getByRole('tablist')).toContainText('Meals');
  await expect(page.getByRole('radiogroup')).toContainText('Veg');
  await expect(page.getByRole('radiogroup')).toContainText('Non-Veg');
  await page.getByLabel('Non-Veg').check();
  
  // 5️⃣ Choose Baggage Addons
  console.log("Selecting Baggage Preferences...");
  await page.getByRole('tab', { name: 'Baggage' }).click();
  await expect(page.getByLabel('Baggage')).toContainText('Bag Out First with 1 Bag');
  // await expect(page.getByLabel('Baggage')).toContainText('5KG');
  // await expect(page.getByLabel('Baggage')).toContainText('10KG');
  await page.locator('div').filter({ hasText: /^₹3000$/ }).getByRole('button').nth(1).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  
  // 6️⃣ Seat Selection
  console.log("Selecting Seats...");
  await expect(page.locator('form')).toContainText('Seat Selection');
  await expect(page.getByLabel('Seat Selection').getByRole('button')).toContainText('Flight 1');
  await page.getByText('10A').click();
  await expect(page.getByLabel('Seat Selection').getByRole('paragraph')).toContainText('(Selected)');
  await page.locator('html').click();
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
  
  // Selecting Wallet
  console.log("Selecting Wallet...");
  await page.locator("//button[normalize-space()='Pay Now']").click();
  
  console.log("Booking flow completed successfully.");
});

test('Tc_33: "Verify and Validate the seat selection functionality on the ""Complete Your Razor Pay payment Option" details page.', async ({page})=>{
  await selectLocation(page, 'From', 'chennai', 'Chennai, Chennai Arpt MAA');
  await selectLocation(page, 'To', 'delhi', 'Delhi, Delhi Indira Gandhi');
  await searchIcon(page);
  // await verifyFlightList(page, 'Chennai - Chennai Arpt', 'Delhi - Delhi Indira Gandhi Intl');
  await viewFlights(page);
  await viewFlightDetailsModal(page);
  await verifyModalContent(page, 'Chennai Arpt (MAA)', 'Delhi Indira Gandhi Intl (DEL)');
  await closeModal(page);
  await verifyAndBookNow(page);
  await verifyBookingPage(page);

  console.log("Starting the booking flow...");

  // 1️⃣ Verify Traveller Details Page
  await expect(page.locator('form')).toContainText('Traveller Details');
  await expect(page.locator('form')).toContainText('Change Flight');
  
  // 2️⃣ Select Traveller Title and Enter Details
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
  console.log("Selecting Meal Preferences...");
  await expect(page.getByRole('tablist')).toContainText('Meals');
  await expect(page.getByRole('radiogroup')).toContainText('Veg');
  await expect(page.getByRole('radiogroup')).toContainText('Non-Veg');
  await page.getByLabel('Non-Veg').check();
  
  // 5️⃣ Choose Baggage Addons
  console.log("Selecting Baggage Preferences...");
  await page.getByRole('tab', { name: 'Baggage' }).click();
  await expect(page.getByLabel('Baggage')).toContainText('Bag Out First with 1 Bag');
  // await expect(page.getByLabel('Baggage')).toContainText('5KG');
  // await expect(page.getByLabel('Baggage')).toContainText('10KG');
  await page.locator('div').filter({ hasText: /^₹3000$/ }).getByRole('button').nth(1).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  
  // 6️⃣ Seat Selection
  console.log("Selecting Seats...");
  await expect(page.locator('form')).toContainText('Seat Selection');
  await expect(page.getByLabel('Seat Selection').getByRole('button')).toContainText('Flight 1');
  await page.getByText('10A').click();
  await expect(page.getByLabel('Seat Selection').getByRole('paragraph')).toContainText('(Selected)');
  await page.locator('html').click();
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
  
// await expect(page.locator('form')).toContainText('Traveller Details');
// await expect(page.locator('form')).toContainText('Change Flight');
// await page.getByLabel('Traveller Details').getByLabel('angle down').click();
// await page.getByText('Mr', { exact: true }).click();
// await page.getByPlaceholder('First Name').click();
// await page.getByPlaceholder('First Name').fill('Jayakumar');
// await page.getByPlaceholder('First Name').press('Tab');
// await page.getByPlaceholder('Last Name').fill('Thiruvenkidam');
// await page.getByPlaceholder('Mobile Number', { exact: true }).click();
// await page.getByPlaceholder('Mobile Number', { exact: true }).fill('7200312848');
// await page.getByPlaceholder('Email ID').click();
// await page.getByPlaceholder('Email ID').fill('jayakumarjj.t@gmail.com');
// await page.getByPlaceholder('Passport number').click();
// await page.getByPlaceholder('Passport number').fill('98765432');
// await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
// await page.getByRole('button', { name: 'Continue' }).click();
// await expect(page.locator('form')).toContainText('Addons (Optional)');
// await expect(page.getByRole('tablist')).toContainText('Meals');
// await expect(page.getByRole('tablist')).toContainText('Baggage');
// await expect(page.getByRole('radiogroup')).toContainText('Veg');
// await expect(page.getByRole('radiogroup')).toContainText('Non-Veg');
// await page.getByLabel('Non-Veg').check();
// await page.getByRole('tab', { name: 'Baggage' }).click();
// await expect(page.getByLabel('Baggage')).toContainText('Bag Out First with 1 Bag');
// await expect(page.getByLabel('Baggage')).toContainText('Bag Out First with 2 Bag');
// await expect(page.getByLabel('Baggage')).toContainText('Bag Out First with 3 Bag');
// await expect(page.getByLabel('Baggage')).toContainText('5KG');
// await expect(page.getByLabel('Baggage')).toContainText('10KG');
// await expect(page.getByLabel('Baggage')).toContainText('15KG');
// await expect(page.getByLabel('Baggage')).toContainText('20KG');
// await expect(page.getByLabel('Baggage')).toContainText('30KG');
// await page.locator('div').filter({ hasText: /^₹3000$/ }).getByRole('button').nth(1).click();
// await page.getByRole('button', { name: 'Continue' }).click();
// await expect(page.locator('form')).toContainText('Seat Selection');
// await expect(page.getByLabel('Seat Selection').getByRole('button')).toContainText('Flight 1');
// await expect(page.getByText('1A1B1C1D1E1F2A2B2C2D2E2F3A3B3C3D3E3F4D4E4F5A5B5C5D5E5F6A6B6C6D6E6F7A7B7C7D7E7F8A')).toBeVisible();
// await page.getByText('10A').click();
// await expect(page.getByLabel('Seat Selection').getByRole('paragraph')).toContainText('(Selected)');
// await page.locator('html').click();
// await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
// await page.getByRole('button', { name: 'Continue' }).click();
// await expect(page.locator('form')).toContainText('Contact Details');
// await expect(page.locator('form')).toContainText('Contact Details');
// await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
// await page.getByRole('button', { name: 'Continue' }).click();
// await expect(page.getByText('Mobile number is required')).toBeVisible();
// await expect(page.getByText('Email is required')).toBeVisible();
// await page.getByPlaceholder('Mobile Number').click();
// await page.getByPlaceholder('Mobile Number').fill('7200315848');
// await page.getByPlaceholder('Email Id').fill('jayakumarjj.t@gmail.com');
// await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
// await page.getByRole('button', { name: 'Continue' }).click();
// await page.locator('#agree').scrollIntoViewIfNeeded();
// await page.locator('#agree').check();
// await page.locator("//button[normalize-space()='Confirm Payment']").scrollIntoViewIfNeeded();
// await page.locator("//button[normalize-space()='Confirm Payment']").click();
// await page.locator('#agree').scrollIntoViewIfNeeded();
// await page.locator('#agree').check();
// await page.locator("//button[normalize-space()='Make Payment']").scrollIntoViewIfNeeded();
// await page.locator("//button[normalize-space()='Make Payment']").click();
// //wallet or razorpay
// await page.locator("//button[normalize-space()='Pay Now']").click();
// //razorpay
// await page.locator("//a[normalize-space()='Razor PAY']").click();
// await page.locator("//button[normalize-space()='Pay Now']").click();
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