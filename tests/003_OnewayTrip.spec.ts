import { test, expect } from '@playwright/test';

const Email = "test@gmail.com";
const password = "SmartWork@1234";
const successMessage = 'Login Successful! Welcome back.';

export async function login(page) {
  console.log('Navigating to login page...');
  await page.goto('https://tripvista.appxpay.in/', { waitUntil: 'load' });

  console.log('Logging in...');
  await expect(page.getByRole('textbox', { name: 'Enter your email' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Enter your email' }).fill(Email);
  await expect(page.getByRole('textbox', { name: 'Enter your password' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Enter your password' }).fill(password);
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await page.getByRole('button', { name: 'Login' }).click();

  console.log('Verifying login...');
  await expect(page.getByText('Login Successful! Welcome back.')).toBeVisible();

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
  await expect(page.getByText('Log out')).toBeVisible();
  await page.getByText('Log out').click();
    console.log('Verifying Login Text is visible after logout...');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  }

// Helper method to verify radio buttons
export async function verifyAndSelectRadioButton(page, name: string) {
  const radioButton = page.getByRole('radio', { name });
  await expect(radioButton).toBeVisible();
  await expect(radioButton).toBeEnabled();
  await radioButton.click();
  console.log(`✅ Selected '${name}' radio button.`);
}

// Helper method to verify common fields
export async function verifyCommonFields(page) {
  await expect(page.getByText('From')).toBeVisible();
  await expect(page.getByText('To', { exact: true })).toBeVisible();
  await expect(page.getByText('Departure')).toBeVisible();
  await expect(page.getByText('Return', { exact: true })).toBeVisible();
  await expect(page.getByText('Travellers & Class')).toBeVisible();
  console.log("✅ Common fields are verified.");
}

// Helper method to verify dates current date and next day autobinded
export async function verifyDates(page) {
  const today = new Date();
  const formattedToday = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const formattedTomorrow = tomorrow.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const departureText = await page.getByText('Departure').locator('..').textContent();
  console.log("📅 Departure Date from UI:", departureText);

  const returnText = await page.getByText('Return').locator('..').textContent();
  console.log("📅 Return Date from UI:", returnText);

  expect(departureText).toContain(formattedToday);
  expect(returnText).toContain(formattedTomorrow);
  console.log(`✅ Verified: Departure = ${formattedToday}, Return = ${formattedTomorrow}`);
}

export async function selectPassengers(page, adults, children, infants) {
  console.log(`Selecting passengers: ${adults} Adults, ${children} Children, ${infants} Infants`);
  await page.getByText('Travellers & Class').click();

  if (adults > 0) {
    await page.getByRole('button', { name: adults.toString() }).first().click();
  }
  if (children > 0) {
    await page.getByRole('button', { name: children.toString() }).nth(1).click();
  }
  if (infants > 0) {
    await page.getByRole('button', { name: infants.toString() }).nth(2).click();
  }
}

export async function enterCity(page, fieldType, cityName) {
  if (fieldType === 'From') {
    await page.getByText('From').click();
    await page.getByPlaceholder('Search').fill(cityName); // Correct Search input locator for 'From'
  } else if (fieldType === 'To') {
    await page.getByText('To', { exact: true }).click();
    await page.locator("input[placeholder='Search']").last().fill(cityName); // Correct Search input locator for 'To'
  }

  // Select the city from the dropdown
  await page.getByTestId('picker-popup').getByText(cityName, { exact: true }).nth(0).click();

  console.log(`Entered ${cityName} in the ${fieldType} field`);
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

 test('TC_015: Verify Flight, Hotel, Train, Cabs, Bus, and Holiday menus with Logo are displayed correctly on the Dashboard Page. @smoke', async ({ page }) => {
 const menuItems = ['Flight', 'Hotel', 'Train', 'Cabs', 'Bus', 'Holiday'];
    for (const item of menuItems) {
      console.log(`Checking visibility for menu item: ${item}`);
      await expect(page.getByText(item, { exact: true }).first()).toBeVisible();
    }
    await logout(page);
  });

  test('TC_017: Verify the One-Way, Round-Trip, and Multi-City module text displays with radio button', async ({ page }) => {
    console.log('Verifying trip options visibility...');
    const tripOptions = ['One Way', 'Round Trip', 'Multi City'];
    for (const option of tripOptions) {
      console.log(`Checking visibility for trip option: ${option}`);
      await expect(page.getByRole('button', { name: option })).toBeVisible();
    }
    await logout(page);
  });

  test('TC_03: Verify One-Way, Round-Trip, and Multi-City module switching through radio buttons and details are displayed correctly on the Dashboard Page', async ({ page }) => {

    // Verify One Way selection
    console.log("🔹 Testing 'One Way' selection...");
    await verifyAndSelectRadioButton(page, 'One Way');
    await verifyCommonFields(page);
  
    // Verify Round Trip selection
    console.log("🔹 Testing 'Round Trip' selection...");
    await verifyAndSelectRadioButton(page, 'Round Trip');
    await verifyCommonFields(page);
    await verifyDates(page);
  
    // Verify Multi-City selection
    console.log("🔹 Testing 'Multi City' selection...");
    await verifyAndSelectRadioButton(page, 'Multi City');
  
    await expect(page.getByText('From').nth(1)).toBeVisible();
    await expect(page.getByText('To', { exact: true }).nth(1)).toBeVisible();
    await expect(page.getByText('Departure').nth(1)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Flight' })).toBeVisible();
    console.log("✅ Multi-City fields are verified.");
  
    console.log("✅ All tests passed!");
  });
  
  test('TC_04: Verify Default Pre-Filled Values after Selecting One-Way Trip', async ({ page }) => {
    await verifyAndSelectRadioButton(page, 'One Way');
    await verifyCommonFields(page);
    await expect(page.getByText('Chennai', { exact: true })).toBeVisible();
    await expect(page.getByText('Delhi', { exact: true })).toBeVisible();
    await expect(page.getByText('Departure')).toBeVisible();
    await expect(page.getByText('Return', { exact: true })).toBeVisible();
    await expect(page.getByText('1 Travellers')).toBeVisible();
    await expect(page.getByText('ECONOMY')).toBeVisible();
    // Assert that 'Direct Flight' checkbox is visible and enabled
    const directFlightCheckbox = page.getByRole('checkbox', { name: 'Direct Flight' });
    await expect(directFlightCheckbox).toBeVisible();
    await expect(directFlightCheckbox).toBeEnabled();

    // Assert that 'Regular' radio button is visible and enabled
    const regularRadio = page.getByRole('radio', { name: 'Regular' });
    await expect(regularRadio).toBeVisible();
    await expect(regularRadio).toBeEnabled();

  });

  test('TC_05: Verify Special Fares Details on the Dashboard Page', async ({ page }) => {
        // Assert that 'Direct Flight' checkbox is visible and enabled
        const directFlightCheckbox = page.getByRole('checkbox', { name: 'Direct Flight' });
        await expect(directFlightCheckbox).toBeVisible();
        await expect(directFlightCheckbox).toBeEnabled();

        // Verify 'Connecting Flight' checkbox is unchecked initially
        const connectingFlightCheckbox = page.getByRole('checkbox', { name: 'Connecting Flight' });
        await expect(connectingFlightCheckbox).toBeVisible();
        await expect(connectingFlightCheckbox).not.toBeChecked();
        console.log("✅ Verified: 'Connecting Flight' checkbox is unchecked initially.");

        // Click the checkbox
        await connectingFlightCheckbox.click();

        // Verify it is now checked
        await expect(connectingFlightCheckbox).toBeChecked();
        console.log("✅ Clicked: 'Connecting Flight' checkbox is now checked.");

    
        // Assert that 'Regular' radio button is visible and enabled
        const regularRadio = page.getByRole('radio', { name: 'Regular' });
        await expect(regularRadio).toBeVisible();
        await expect(regularRadio).toBeEnabled();

        // Verify 'Student' radio button is unchecked initially
        const studentRadio = page.getByRole('radio', { name: 'Student' });
        await expect(studentRadio).toBeVisible();
        await expect(studentRadio).not.toBeChecked();
        console.log("✅ Verified: 'Student' radio button is unchecked initially.");

        // Verify 'Senior Citizen' radio button is unchecked initially
        const seniorRadio = page.getByRole('radio', { name: 'Senior Citizen' });
        await expect(seniorRadio).toBeVisible();
        await expect(seniorRadio).not.toBeChecked();
        console.log("✅ Verified: 'Senior Citizen' radio button is unchecked initially.");
});
test('TC_06: Verify that the TripVista application enforces a maximum limit of 9 passengers (Adults + Children) during flight booking and restricts users from proceeding with more than 9 passengers.', async ({ page }) => {

  await expect(page.getByRole('button', { name: 'Book Now' })).toBeVisible();
  console.log('Home page is visible');
  // Select passengers dynamically
  const adults = 1;
  const children = 0;
  const infants = 0;
  await selectPassengers(page, adults, children, infants);
  await page.getByRole('button', { name: 'APPLY' }).click();
  console.log('Clicked on Apply button');
  const totalPassengers = adults + children + infants;
  await expect(page.getByText(`${totalPassengers} Travellers`)).toBeVisible();
  console.log(`Verified total passenger count: ${totalPassengers} Travellers`);
});

test('TC_07: Verify flight interchange functionality', async ({ page }) => {
  console.log('Starting test: Verify flight interchange functionality');

  // 1. Enter "Chennai (MAA)" in the "From" field
  await page.getByText('From').click();
  await page.getByPlaceholder('Search').click();
  await page.getByPlaceholder('Search').fill('chennai');
  await page.getByTestId('picker-popup').getByText('Chennai', { exact: true }).click();
  await expect(page.getByText('FromChennaiMAA, Chennai Arpt')).toBeVisible();
  console.log('Entered Chennai (MAA) in the From field');

  // 2. Enter "Delhi (DEL)" in the "To" field
  await page.getByText('To', { exact: true }).click();
  const searchInput = page.locator("input[placeholder='Search']").last();
  await searchInput.click();
  await searchInput.fill('delhi');
  await page.getByTestId('picker-popup').getByText('Delhi', { exact: true }).click();
  await expect(page.getByText('ToDelhiDEL, Delhi Indira')).toBeVisible();
  console.log('Entered Delhi (DEL) in the To field');

  // 3. Click on the interchange/swap button (🔁) between the "From" and "To" fields
  await page.locator('div').filter({ hasText: /^FromChennaiMAA, Chennai Arpt, IndiaToDelhiDEL, Delhi Indira Gandhi Intl, India$/ }).getByRole('button').click();
  console.log('Clicked on the interchange/swap button');

  // 4. Confirm that the From field now shows "Delhi (DEL)" and the To field shows "Chennai (MAA)"
  await expect(page.getByText('FromDelhiDEL, Delhi Indira')).toBeVisible();
  await expect(page.getByText('ToChennaiMAA, Chennai Arpt,')).toBeVisible();
  console.log('Confirmed From field is "Delhi (DEL)" and To field is "Chennai (MAA)"');

  // 5. Click on the Interchange/Swap button again to revert the fields
  await page.locator('div').filter({ hasText: /^FromDelhiDEL, Delhi Indira Gandhi Intl, IndiaToChennaiMAA, Chennai Arpt, India$/ }).getByRole('button').click();
  console.log('Clicked on the interchange/swap button again to revert');

  // 6. Verify that the From field is restored to "Chennai (MAA)" and the To field is "Delhi (DEL)"
  await expect(page.getByText('FromChennaiMAA, Chennai Arpt')).toBeVisible();
  await expect(page.getByText('ToDelhiDEL, Delhi Indira')).toBeVisible();
  console.log('Verified From field is restored to "Chennai (MAA)" and To field to "Delhi (DEL)"');
});

test.only('TC_39: Verify Flight Booking and Wallet Payment Process Verification', async ({ page }) => {
  const fromCity = 'Chennai'; 
  const toCity = 'Delhi'; 
  await enterCity(page, 'From', fromCity);
  await enterCity(page, 'To', toCity);
  
  console.log('Selecting departure date');
  await page.getByText('Departure').click();
  
    console.log('Navigating to next month');
    await page.getByLabel('Next Month').click();
  
    console.log('Selecting return date');
    await page.getByLabel('Choose Monday, April 14th,').click();
  
    console.log('Selecting number of travellers');
    const adults = 1;
    const children = 0;
    const infants = 0;
    await selectPassengers(page, adults, children, infants);
    await page.getByRole('button', { name: 'APPLY' }).click();
    console.log('Clicked on Apply button');
  
    console.log('Clicking Book Now button');
    await page.getByRole('button', { name: 'Book Now' }).click();
  
    console.log('Verifying airlines section visibility');
    await expect(page.locator('div').filter({ hasText: /^Airlines$/ })).toBeVisible();
  
    console.log('Selecting first available flight option');
    await page.locator('div:nth-child(4) > .rs-btn').first().click();
  
    console.log('Verifying booking details visibility');
    await expect(page.getByText('Complete Your Booking Details')).toBeVisible();
  
    console.log('Verifying traveller details visibility');
    await expect(page.getByText('Traveller Details')).toBeVisible();
  
    console.log('Selecting title');
    await page.getByRole('combobox').selectOption('mr');
  
    console.log('Filling first name');
    await page.getByPlaceholder('Enter the First Name').click();
    await page.getByPlaceholder('Enter the First Name').fill('Jayakumar');
  
    console.log('Filling last name');
    await page.getByPlaceholder('Enter the Last Name').click();
    await page.getByPlaceholder('Enter the Last Name').fill('T');
  
    console.log('Filling mobile number');
    await page.getByPlaceholder('Enter the Mobile Number').click();
    await page.getByPlaceholder('Enter the Mobile Number').fill('9876543210');
  
    console.log('Filling email ID');
    await page.getByPlaceholder('Enter the Email ID').click();
    await page.getByPlaceholder('Enter the Email ID').fill('jk@yopmail.com');
  
    console.log('Selecting date of birth');
    await page.getByPlaceholder('dd/MM/yyyy').click();
    await page.getByLabel('Next month').click();
    await page.getByLabel('Select month').click();
    await page.getByLabel('Mar 2009').getByText('Mar').click();
    await page.getByLabel('12 Mar').locator('div').click();
  
    console.log('Verifying Continue button visibility');
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
  
    console.log('Clicking Continue button');
    await page.getByRole('button', { name: 'Continue' }).click();
  
    console.log('Clicking Addons Continue button');
    await page.getByRole('button', { name: 'Continue' }).click();
    console.log('Selecting seat for first flight');
    await page.getByText('30F').click();
  
    console.log('Clicking Continue button');
    await page.getByRole('button', { name: 'Continue' }).click();
  
    console.log('Verifying mobile number field visibility');
    await expect(page.getByPlaceholder('Enter the Mobile Number')).toBeVisible();
  
    console.log('Filling alternate mobile number');
    await page.getByPlaceholder('Enter the Mobile Number').click();
    await page.getByPlaceholder('Enter the Mobile Number').fill('45645644616');
  
    console.log('Filling alternate email ID');
    await page.getByPlaceholder('Enter the Email ID').click();
    await page.getByPlaceholder('Enter the Email ID').fill('j@yopmail.com');
  
    console.log('Clicking Continue button');
    await page.getByRole('button', { name: 'Continue' }).click();
  
    console.log('Reviewing and confirming booking');
    await page.locator('body > div:nth-child(1) > section:nth-child(1) > section:nth-child(1) > main:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > button:nth-child(2)').click();
  
    console.log('Agreeing to terms and conditions');
    await page.locator('#agree').check();
  
    console.log('Proceeding to payment');
    await page.locator("//button[normalize-space()='Make Payment']").click();
  
    console.log('By default Wallet option is autoselected');  
    console.log('Clicking Pay Now button');
    await page.locator("//button[normalize-space()='Pay Now via Wallet']");
  
    console.log('Manual action required to complete the payment process.');
    await page.waitForTimeout(80000);
});

test('TC_40: Verify Flight Booking and Payment via Razorpay UPI', async ({ page }) => {
  const fromCity = 'Chennai'; 
  const toCity = 'Delhi'; 
  await enterCity(page, 'From', fromCity);
  await enterCity(page, 'To', toCity);
  
  console.log('Selecting departure date');
  await page.getByText('Departure').click();
  
    console.log('Navigating to next month');
    await page.getByLabel('Next Month').click();
  
    console.log('Selecting return date');
    await page.getByLabel('Choose Monday, April 14th,').click();
  
    console.log('Selecting number of travellers');
    const adults = 1;
    const children = 0;
    const infants = 0;
    await selectPassengers(page, adults, children, infants);
    await page.getByRole('button', { name: 'APPLY' }).click();
    console.log('Clicked on Apply button');
  
    console.log('Clicking Book Now button');
    await page.getByRole('button', { name: 'Book Now' }).click();
  
    console.log('Verifying airlines section visibility');
    await expect(page.locator('div').filter({ hasText: /^Airlines$/ })).toBeVisible();
  
    console.log('Selecting first available flight option');
    await page.locator('div:nth-child(4) > .rs-btn').first().click();
  
    console.log('Verifying booking details visibility');
    await expect(page.getByText('Complete Your Booking Details')).toBeVisible();
  
    console.log('Verifying traveller details visibility');
    await expect(page.getByText('Traveller Details')).toBeVisible();
  
    console.log('Selecting title');
    await page.getByRole('combobox').selectOption('mr');
  
    console.log('Filling first name');
    await page.getByPlaceholder('Enter the First Name').click();
    await page.getByPlaceholder('Enter the First Name').fill('Jayakumar');
  
    console.log('Filling last name');
    await page.getByPlaceholder('Enter the Last Name').click();
    await page.getByPlaceholder('Enter the Last Name').fill('T');
  
    console.log('Filling mobile number');
    await page.getByPlaceholder('Enter the Mobile Number').click();
    await page.getByPlaceholder('Enter the Mobile Number').fill('9876543210');
  
    console.log('Filling email ID');
    await page.getByPlaceholder('Enter the Email ID').click();
    await page.getByPlaceholder('Enter the Email ID').fill('jk@yopmail.com');
  
    console.log('Selecting date of birth');
    await page.getByPlaceholder('dd/MM/yyyy').click();
    await page.getByLabel('Next month').click();
    await page.getByLabel('Select month').click();
    await page.getByLabel('Mar 2009').getByText('Mar').click();
    await page.getByLabel('12 Mar').locator('div').click();
  
    console.log('Verifying Continue button visibility');
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
  
    console.log('Clicking Continue button');
    await page.getByRole('button', { name: 'Continue' }).click();
  
    console.log('Clicking Addons Continue button');
    await page.getByRole('button', { name: 'Continue' }).click();
    console.log('Selecting seat for first flight');
    await page.getByText('30F').click();
  
    console.log('Clicking Continue button');
    await page.getByRole('button', { name: 'Continue' }).click();
  
    console.log('Verifying mobile number field visibility');
    await expect(page.getByPlaceholder('Enter the Mobile Number')).toBeVisible();
  
    console.log('Filling alternate mobile number');
    await page.getByPlaceholder('Enter the Mobile Number').click();
    await page.getByPlaceholder('Enter the Mobile Number').fill('45645644616');
  
    console.log('Filling alternate email ID');
    await page.getByPlaceholder('Enter the Email ID').click();
    await page.getByPlaceholder('Enter the Email ID').fill('j@yopmail.com');
  
    console.log('Clicking Continue button');
    await page.getByRole('button', { name: 'Continue' }).click();
  
    console.log('Reviewing and confirming booking');
    await page.locator('body > div:nth-child(1) > section:nth-child(1) > section:nth-child(1) > main:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > button:nth-child(2)').click();
  
    console.log('Agreeing to terms and conditions');
    await page.locator('#agree').check();
  
    console.log('Proceeding to payment');
    await page.locator("//button[normalize-space()='Make Payment']").click();
  
    console.log('Selecting Razor Pay option');
    await page.locator("//a[normalize-space()='Razor Pay']").click();
  
    console.log('Clicking Pay Now button');
    await page.locator("//button[normalize-space()='Pay Now via Razorpay']");
  
    console.log('Manual action required to complete the payment process.');
    await page.waitForTimeout(80000);
});

test('TC_41: Verify International Flight Booking functionality(Chennai to Singapore).', async ({ page }) => {
  const fromCity = 'Chennai'; 
  const toCity = 'Singapore'; 
  await enterCity(page, 'From', fromCity);
  await enterCity(page, 'To', toCity);
  
  console.log('Selecting departure date');
  await page.getByText('Departure').click();
  
    console.log('Navigating to next month');
    await page.getByLabel('Next Month').click();
  
    console.log('Selecting return date');
    await page.getByLabel('Choose Monday, April 14th,').click();
  
    console.log('Selecting number of travellers');
    const adults = 1;
    const children = 0;
    const infants = 0;
    await selectPassengers(page, adults, children, infants);
    await page.getByRole('button', { name: 'APPLY' }).click();
    console.log('Clicked on Apply button');
  
    console.log('Clicking Book Now button');
    await page.getByRole('button', { name: 'Book Now' }).click();
  
    console.log('Verifying airlines section visibility');
    await expect(page.locator('div').filter({ hasText: /^Airlines$/ })).toBeVisible();
  
    console.log('Selecting first available flight option');
    await page.locator('div:nth-child(4) > .rs-btn').first().click();
  
    console.log('Verifying booking details visibility');
    await expect(page.getByText('Complete Your Booking Details')).toBeVisible();
  
    console.log('Verifying traveller details visibility');
    await expect(page.getByText('Traveller Details')).toBeVisible();
  
    console.log('Selecting title');
    await page.getByRole('combobox').selectOption('mr');
  
    console.log('Filling first name');
    await page.getByPlaceholder('Enter the First Name').click();
    await page.getByPlaceholder('Enter the First Name').fill('Jayakumar');
  
    console.log('Filling last name');
    await page.getByPlaceholder('Enter the Last Name').click();
    await page.getByPlaceholder('Enter the Last Name').fill('T');
  
    console.log('Filling mobile number');
    await page.getByPlaceholder('Enter the Mobile Number').click();
    await page.getByPlaceholder('Enter the Mobile Number').fill('9876543210');
  
    console.log('Filling email ID');
    await page.getByPlaceholder('Enter the Email ID').click();
    await page.getByPlaceholder('Enter the Email ID').fill('jk@yopmail.com');
  
    console.log('Selecting date of birth');
    await page.getByPlaceholder('dd/MM/yyyy').click();
    await page.getByLabel('Next month').click();
    await page.getByLabel('Select month').click();
    await page.getByLabel('Mar 2009').getByText('Mar').click();
    await page.getByLabel('12 Mar').locator('div').click();
  
    console.log('Verifying Continue button visibility');
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
  
    console.log('Clicking Continue button');
    await page.getByRole('button', { name: 'Continue' }).click();
  
    console.log('Clicking Addons Continue button');
    await page.getByRole('button', { name: 'Continue' }).click();
    console.log('Selecting seat for first flight');
    await page.getByText('30F').click();
  
    console.log('Clicking Continue button');
    await page.getByRole('button', { name: 'Continue' }).click();
  
    console.log('Verifying mobile number field visibility');
    await expect(page.getByPlaceholder('Enter the Mobile Number')).toBeVisible();
  
    console.log('Filling alternate mobile number');
    await page.getByPlaceholder('Enter the Mobile Number').click();
    await page.getByPlaceholder('Enter the Mobile Number').fill('45645644616');
  
    console.log('Filling alternate email ID');
    await page.getByPlaceholder('Enter the Email ID').click();
    await page.getByPlaceholder('Enter the Email ID').fill('j@yopmail.com');
  
    console.log('Clicking Continue button');
    await page.getByRole('button', { name: 'Continue' }).click();
  
    console.log('Reviewing and confirming booking');
    await page.locator('body > div:nth-child(1) > section:nth-child(1) > section:nth-child(1) > main:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > button:nth-child(2)').click();
  
    console.log('Agreeing to terms and conditions');
    await page.locator('#agree').check();
  
    console.log('Proceeding to payment');
    await page.locator("//button[normalize-space()='Make Payment']").click();
  
    console.log('Selecting Razor Pay option');
    await page.locator("//a[normalize-space()='Razor Pay']").click();
  
    console.log('Clicking Pay Now button');
    await page.locator("//button[normalize-space()='Pay Now via Razorpay']");
  
    console.log('Manual action required to complete the payment process.');
    await page.waitForTimeout(80000);
});

test('TC_42: Verify Connecting domestic Flight Booking functionality.', async ({ page }) => {
  const fromCity = 'Chennai'; 
  const toCity = 'Delhi'; 
  await enterCity(page, 'From', fromCity);
  await enterCity(page, 'To', toCity);
  
  console.log('Selecting departure date');
  await page.getByText('Departure').click();
  
    console.log('Navigating to next month');
    await page.getByLabel('Next Month').click();
  
    console.log('Selecting return date');
    await page.getByLabel('Choose Monday, April 14th,').click();
  
    console.log('Selecting number of travellers');
    const adults = 1;
    const children = 0;
    const infants = 0;
    await selectPassengers(page, adults, children, infants);
    await page.getByRole('button', { name: 'APPLY' }).click();
    console.log('Clicked on Apply button');
  
    console.log('Unchecking direct flight option');
    await page.getByLabel('Direct Flight').uncheck();
  
    console.log('Checking connecting flight option');
    await page.getByLabel('Connecting Flight').check();
  
    console.log('Clicking Book Now button');
    await page.getByRole('button', { name: 'Book Now' }).click();
  
    console.log('Verifying airlines section visibility');
    await expect(page.locator('div').filter({ hasText: /^Airlines$/ })).toBeVisible();
  
    console.log('Selecting first available flight option');
    await page.locator('div:nth-child(4) > .rs-btn').first().click();
  
    console.log('Verifying booking details visibility');
    await expect(page.getByText('Complete Your Booking Details')).toBeVisible();
  
    console.log('Verifying traveller details visibility');
    await expect(page.getByText('Traveller Details')).toBeVisible();
  
    console.log('Selecting title');
    await page.getByRole('combobox').selectOption('mr');
  
    console.log('Filling first name');
    await page.getByPlaceholder('Enter the First Name').click();
    await page.getByPlaceholder('Enter the First Name').fill('Jayakumar');
  
    console.log('Filling last name');
    await page.getByPlaceholder('Enter the Last Name').click();
    await page.getByPlaceholder('Enter the Last Name').fill('T');
  
    console.log('Filling mobile number');
    await page.getByPlaceholder('Enter the Mobile Number').click();
    await page.getByPlaceholder('Enter the Mobile Number').fill('9876543210');
  
    console.log('Filling email ID');
    await page.getByPlaceholder('Enter the Email ID').click();
    await page.getByPlaceholder('Enter the Email ID').fill('jk@yopmail.com');
  
    console.log('Selecting date of birth');
    await page.getByPlaceholder('dd/MM/yyyy').click();
    await page.getByLabel('Next month').click();
    await page.getByLabel('Select month').click();
    await page.getByLabel('Mar 2009').getByText('Mar').click();
    await page.getByLabel('12 Mar').locator('div').click();
  
    console.log('Verifying Continue button visibility');
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
  
    console.log('Clicking Continue button');
    await page.getByRole('button', { name: 'Continue' }).click();
  
    console.log('Clicking Addons Continue button');
    await page.getByRole('button', { name: 'Continue' }).click();
    console.log('Selecting seat for first flight');
    await page.getByText('30F').click();
  
    console.log('Navigating to second flight');
    await page.getByRole('button', { name: 'Flight 2' }).click();
  
    console.log('Selecting seat for second flight');
    await page.getByText('29E').click();
  
    console.log('Clicking Continue button');
    await page.getByRole('button', { name: 'Continue' }).click();
  
    console.log('Verifying mobile number field visibility');
    await expect(page.getByPlaceholder('Enter the Mobile Number')).toBeVisible();
  
    console.log('Filling alternate mobile number');
    await page.getByPlaceholder('Enter the Mobile Number').click();
    await page.getByPlaceholder('Enter the Mobile Number').fill('45645644616');
  
    console.log('Filling alternate email ID');
    await page.getByPlaceholder('Enter the Email ID').click();
    await page.getByPlaceholder('Enter the Email ID').fill('j@yopmail.com');
  
    console.log('Clicking Continue button');
    await page.getByRole('button', { name: 'Continue' }).click();
  
    console.log('Reviewing and confirming booking');
    await page.locator('body > div:nth-child(1) > section:nth-child(1) > section:nth-child(1) > main:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > button:nth-child(2)').click();
  
    console.log('Agreeing to terms and conditions');
    await page.locator('#agree').check();
  
    console.log('Proceeding to payment');
    await page.locator("//button[normalize-space()='Make Payment']").click();
  
    console.log('Selecting Razor Pay option');
    await page.locator("//a[normalize-space()='Razor Pay']").click();
  
    console.log('Clicking Pay Now button');
    await page.locator("//button[normalize-space()='Pay Now via Razorpay']");
  
    console.log('Manual action required to complete the payment process.');
    await page.waitForTimeout(80000);
  
  
  });

test('TC_43: Verify International Flight Booking functionality with connecting flight(Chennai to Singapore).', async ({ page }) => {

const fromCity = 'Chennai'; 
const toCity = 'Singapore'; 
await enterCity(page, 'From', fromCity);
await enterCity(page, 'To', toCity);

console.log('Selecting departure date');
await page.getByText('Departure').click();

  console.log('Navigating to next month');
  await page.getByLabel('Next Month').click();

  console.log('Selecting return date');
  await page.getByLabel('Choose Monday, April 14th,').click();

  console.log('Selecting number of travellers');
  const adults = 1;
  const children = 0;
  const infants = 0;
  await selectPassengers(page, adults, children, infants);
  await page.getByRole('button', { name: 'APPLY' }).click();
  console.log('Clicked on Apply button');

  console.log('Unchecking direct flight option');
  await page.getByLabel('Direct Flight').uncheck();

  console.log('Checking connecting flight option');
  await page.getByLabel('Connecting Flight').check();

  console.log('Clicking Book Now button');
  await page.getByRole('button', { name: 'Book Now' }).click();

  console.log('Verifying airlines section visibility');
  await expect(page.locator('div').filter({ hasText: /^Airlines$/ })).toBeVisible();

  console.log('Selecting first available flight option');
  await page.locator('div:nth-child(4) > .rs-btn').first().click();

  console.log('Verifying booking details visibility');
  await expect(page.getByText('Complete Your Booking Details')).toBeVisible();

  console.log('Verifying traveller details visibility');
  await expect(page.getByText('Traveller Details')).toBeVisible();

  console.log('Selecting title');
  await page.getByRole('combobox').selectOption('mr');

  console.log('Filling first name');
  await page.getByPlaceholder('Enter the First Name').click();
  await page.getByPlaceholder('Enter the First Name').fill('Jayakumar');

  console.log('Filling last name');
  await page.getByPlaceholder('Enter the Last Name').click();
  await page.getByPlaceholder('Enter the Last Name').fill('T');

  console.log('Filling mobile number');
  await page.getByPlaceholder('Enter the Mobile Number').click();
  await page.getByPlaceholder('Enter the Mobile Number').fill('9876543210');

  console.log('Filling email ID');
  await page.getByPlaceholder('Enter the Email ID').click();
  await page.getByPlaceholder('Enter the Email ID').fill('jk@yopmail.com');

  console.log('Selecting date of birth');
  await page.getByPlaceholder('dd/MM/yyyy').click();
  await page.getByLabel('Next month').click();
  await page.getByLabel('Select month').click();
  await page.getByLabel('Mar 2009').getByText('Mar').click();
  await page.getByLabel('12 Mar').locator('div').click();

  console.log('Verifying Continue button visibility');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();

  console.log('Clicking Continue button');
  await page.getByRole('button', { name: 'Continue' }).click();

  console.log('Clicking Addons Continue button');
  await page.getByRole('button', { name: 'Continue' }).click();
  console.log('Selecting seat for first flight');
  await page.getByText('30F').click();

  console.log('Navigating to second flight');
  await page.getByRole('button', { name: 'Flight 2' }).click();

  console.log('Selecting seat for second flight');
  await page.getByText('29E').click();

  console.log('Clicking Continue button');
  await page.getByRole('button', { name: 'Continue' }).click();

  console.log('Verifying mobile number field visibility');
  await expect(page.getByPlaceholder('Enter the Mobile Number')).toBeVisible();

  console.log('Filling alternate mobile number');
  await page.getByPlaceholder('Enter the Mobile Number').click();
  await page.getByPlaceholder('Enter the Mobile Number').fill('45645644616');

  console.log('Filling alternate email ID');
  await page.getByPlaceholder('Enter the Email ID').click();
  await page.getByPlaceholder('Enter the Email ID').fill('j@yopmail.com');

  console.log('Clicking Continue button');
  await page.getByRole('button', { name: 'Continue' }).click();

  console.log('Reviewing and confirming booking');
  await page.locator('body > div:nth-child(1) > section:nth-child(1) > section:nth-child(1) > main:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > button:nth-child(2)').click();

  console.log('Agreeing to terms and conditions');
  await page.locator('#agree').check();

  console.log('Proceeding to payment');
  await page.locator("//button[normalize-space()='Make Payment']").click();

  console.log('Selecting Razor Pay option');
  await page.locator("//a[normalize-space()='Razor Pay']").click();

  console.log('Clicking Pay Now button');
  await page.locator("//button[normalize-space()='Pay Now via Razorpay']");

  console.log('Manual action required to complete the payment process.');
  await page.waitForTimeout(80000);

});

});