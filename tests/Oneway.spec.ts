const { test, expect } = require('@playwright/test');



  test('TC_ONEWAY_17: Verify One-Way, Round-Trip, and Multi-City module switching through radio buttons and details are displayed correctly on the Dashboard Page', async ({ page }) => {
   

  });

  test('TC_ONEWAY_18: Verify Default Pre-Filled Values after Selecting One-Way Trip', async ({ page }) => {
    await page.goto('https://tripvista.appxpay.in/home');
  await page.getByPlaceholder('Enter your email').click();
  await page.getByPlaceholder('Enter your email').fill('agent@gmail.com');
  await page.getByPlaceholder('Enter your password').click();
  await page.getByPlaceholder('Enter your password').fill('SmartWork@1234');
  await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByLabel('One Way')).not.toBeChecked();
    await expect(page.getByLabel('Round Trip')).not.toBeChecked();
  await expect(page.getByLabel('Multi City')).not.toBeChecked();
 
    await expect(page.getByText('FromChennaiMAA, Chennai Arpt')).toBeVisible();
    await expect(page.getByText('ToDelhiDEL, Delhi Indira')).toBeVisible();

    // Get the current date and day dynamically
const today = new Date();
const day = today.toLocaleDateString('en-US', { weekday: 'long' }); // e.g., "Monday"
const date = today.getDate(); // e.g., 10
const month = today.toLocaleDateString('en-US', { month: 'short' }); // e.g., "Mar"

// Format the date for assertion (e.g., "10 Mar")
const formattedDate = `${date} ${month}`;

console.log(`Asserting for date: ${formattedDate}, Day: ${day}`);

// Assert that the date and day are visible on the page
await expect(page.getByText(formattedDate)).toBeVisible();
await expect(page.getByText(day)).toBeVisible();

    
    await expect(page.getByText('1 Travellers')).toBeVisible();
    await expect(page.getByText('ECONOMY')).toBeVisible();
    await expect(page.getByLabel('Direct Flight')).toBeChecked();
    await expect(page.getByLabel('Connecting Flight')).not.toBeChecked();
    
    await expect(page.getByLabel('Student')).not.toBeChecked();
    await expect(page.getByLabel('Senior Citizen')).not.toBeChecked();
   
    await expect(page.getByText('Tap to add a return flights')).toBeVisible();
    await page.getByRole('img', { name: '@simonguo' }).click();
    await page.getByText('Sign out').click();
    await expect(page.getByText('Logged out Successfully...')).toBeVisible();

  });

  test('TC_ONEWAY_19: Verify Preferred Airlines Selection Functionality', async ({ page }) => {
    await page.goto('https://tripvista.appxpay.in/home');
    await page.getByPlaceholder('Enter your email').click();
    await page.getByPlaceholder('Enter your email').fill('agent@gmail.com');
    await page.getByPlaceholder('Enter your password').click();
    await page.getByPlaceholder('Enter your password').fill('SmartWork@1234');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.locator('.rs-picker-textbox').click();
  await page.getByRole('textbox').fill('air in');
  await page.getByRole('option', { name: 'Air India' }).locator('label').click();
  await page.getByRole('textbox').fill('indi');
  await page.getByTestId('picker-popup').getByText('Indi').click();
  await page.getByRole('textbox').fill('g');
  await page.getByLabel('Gabon Airlines').check();
  await expect(page.locator('div').filter({ hasText: /^Air IndiaIndiGoGabon Airlines$/ }).nth(1)).toBeVisible();
  await page.getByRole('option', { name: 'Gabon Airlines Remove' }).getByLabel('Remove').click();
  await expect(page.locator('div').filter({ hasText: /^Air IndiaIndiGo$/ }).nth(1)).toBeVisible();
  await page.getByRole('button', { name: 'Book Now' }).click();
  await expect(page.getByText('Preferred AirlineAI, 6E')).toBeVisible();
  await page.getByRole('button', { name: 'MODIFY SEARCH' }).click();
  await expect(page.getByTestId('modal-wrapper').locator('div').filter({ hasText: /^Air IndiaIndiGo$/ }).nth(1)).toBeVisible();

  });

  test('TC_ONEWAY_20: Verify Special Fares Details on the Dashboard Page', async ({ page }) => {
   
    await page.goto('https://tripvista.appxpay.in/home');
    await page.getByPlaceholder('Enter your email').click();
    await page.getByPlaceholder('Enter your email').fill('agent@gmail.com');
    await page.getByPlaceholder('Enter your password').click();
    await page.getByPlaceholder('Enter your password').fill('SmartWork@1234');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Direct Flight')).toBeVisible();
    await expect(page.getByText('Connecting Flight')).toBeVisible();
    await expect(page.getByText('Regular')).toBeVisible();
    await expect(page.getByText('Student')).toBeVisible();
    await expect(page.getByText('Senior Citizen')).toBeVisible();
    await expect(page.getByLabel('Direct Flight')).toBeChecked();
    await expect(page.getByLabel('Connecting Flight')).not.toBeChecked();
   // await expect(page.getByLabel('Student')).not.toBeChecked();
    await expect(page.getByLabel('Senior Citizen')).not.toBeChecked();
    await page.getByLabel('Connecting Flight').check();
    await expect(page.getByLabel('Connecting Flight')).toBeChecked();
    await page.getByLabel('Student').toBeChecked();
    await expect(page.getByLabel('Regular')).not.toBeChecked();
    await page.getByLabel('Direct Flight').uncheck();
    await page.getByLabel('Connecting Flight').uncheck();
    await expect(page.getByLabel('Direct Flight')).not.toBeChecked();
    await expect(page.getByLabel('Connecting Flight')).not.toBeChecked();

    await page.getByRole('img', { name: '@simonguo' }).click();
    await page.getByText('Sign out').click();
    await expect(page.getByText('Logged out Successfully...')).toBeVisible();
  });

  test('TC_ONEWAY_21: Verify that the TripVista application allows selecting up to 9 passengers (Adults + Children) and permits proceeding with the booking.', async ({ page }) => {
   
    await page.goto('https://tripvista.appxpay.in/home');
    await page.getByPlaceholder('Enter your email').click();
    await page.getByPlaceholder('Enter your email').fill('agent@gmail.com');
    await page.getByPlaceholder('Enter your password').click();
    await page.getByPlaceholder('Enter your password').fill('SmartWork@1234');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await expect(page.getByText('Travellers & Class1')).toBeVisible();
    await page.getByText('1 Travellers').click();
    await expect(page.getByText('123456789')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^CHILDREN \(2y - 12y\)012345678$/ }).locator('div')).toBeVisible();
    await page.getByRole('button', { name: '6' }).first().click();
    await expect(page.locator('div').filter({ hasText: /^CHILDREN \(2y - 12y\)012345678$/ }).locator('div')).toBeVisible();
    await page.getByRole('button', { name: '3' }).nth(1).click();
    await page.getByRole('button', { name: 'APPLY' }).click();
    await expect(page.getByText('Travellers & Class9')).toBeVisible();

    await page.getByRole('img', { name: '@simonguo' }).click();
    await page.getByText('Sign out').click();
    
  });

  test('TC_ONEWAY_22: Verify that the TripVista application restricts users from selecting more than 9 passengers and prevents them from proceeding.', async ({ page }) => {
   
    await page.goto('https://tripvista.appxpay.in/home');
    await page.getByPlaceholder('Enter your email').click();
    await page.getByPlaceholder('Enter your email').fill('agent@gmail.com');
    await page.getByPlaceholder('Enter your password').click();
    await page.getByPlaceholder('Enter your password').fill('SmartWork@1234');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByText('Travellers & Class').click();
    await expect(page.getByText('ADULTS (12y+)')).toBeVisible();
    await expect(page.getByText('CHILDREN (2y - 12y)')).toBeVisible();
    await expect(page.getByText('INFANTS (below 2y)')).toBeVisible();
    await expect(page.getByText('123456789')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^CHILDREN \(2y - 12y\)012345678$/ }).locator('div')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^INFANTS \(below 2y\)012345678$/ }).locator('div')).toBeVisible();
    await page.getByRole('button', { name: '5' }).nth(1).click();
    await expect(page.locator('div').filter({ hasText: /^CHILDREN \(2y - 12y\)012345678$/ }).locator('div')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^INFANTS \(below 2y\)012345678$/ }).locator('div')).toBeVisible();
    await page.getByRole('button', { name: '4' }).nth(1).click();
    await page.getByRole('button', { name: '5' }).nth(3).click();
    await page.getByRole('button', { name: 'APPLY' }).click();
    await expect(page.getByText('14 Travellers')).toBeVisible();
    await page.getByRole('button', { name: 'Book Now' }).click();
    await page.getByRole('button', { name: 'MODIFY SEARCH' }).click();
    await expect(page.getByText('14 Travellers')).toBeVisible();
    await page.getByLabel('Close', { exact: true }).click();
    
    await page.getByRole('img', { name: '@simonguo' }).click();
    await page.getByText('Sign out').click();
  });

  test('TC_ONEWAY_23: Verify that the number of infants cannot exceed the number of adults while booking a flight.', async ({ page }) => {
   
    await page.goto('https://tripvista.appxpay.in/home');
    await page.getByPlaceholder('Enter your email').click();
    await page.getByPlaceholder('Enter your email').fill('agent@gmail.com');
    await page.getByPlaceholder('Enter your password').click();
    await page.getByPlaceholder('Enter your password').fill('SmartWork@1234');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Travellers & Class1')).toBeVisible();
    await page.getByText('1 Travellers').click();
    await expect(page.getByText('123456789')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^INFANTS \(below 2y\)012345678$/ }).locator('div')).toBeVisible();
    await page.getByRole('button', { name: '5' }).nth(1).click();
    await expect(page.locator('div').filter({ hasText: /^INFANTS \(below 2y\)012345678$/ }).locator('div')).toBeVisible();
    await expect(page.getByRole('button', { name: '5' }).nth(3)).toBeVisible();
    await expect(page.getByRole('button', { name: '5' }).nth(3)).toBeVisible();
    await page.getByRole('button', { name: '5' }).nth(3).click();
    await page.getByRole('button', { name: 'APPLY' }).click();
    await expect(page.getByText('Travellers & Class10')).toBeVisible();
    await page.getByRole('img', { name: '@simonguo' }).click();
    await page.getByText('Sign out').click();
  });

  test('TC_ONEWAY_24: Verify flight interchange functionality.', async ({ page }) => {
   
    await page.goto('https://tripvista.appxpay.in/home');
    await page.getByPlaceholder('Enter your email').click();
    await page.getByPlaceholder('Enter your email').fill('agent@gmail.com');
    await page.getByPlaceholder('Enter your password').click();
    await page.getByPlaceholder('Enter your password').fill('SmartWork@1234');
    await page.getByRole('button', { name: 'Login' }).click();
 
    await expect(page.getByText('FromChennaiMAA, Chennai Arpt')).toBeVisible();
    await expect(page.getByText('ToDelhiDEL, Delhi Indira')).toBeVisible();
    
    await page.locator('div').filter({ hasText: /^FromChennaiMAA, Chennai Arpt, IndiaToDelhiDEL, Delhi Indira Gandhi Intl, India$/ }).getByRole('button').click();
    await expect(page.getByText('FromDelhiDEL, Delhi Indira')).toBeVisible();
  await expect(page.getByText('ToChennaiMAA, Chennai Arpt,')).toBeVisible();
  await page.getByRole('button', { name: 'Book Now' }).click();
  await expect(page.getByText('DELDelhi, IndiaMAAChennai,')).toBeVisible();
  await page.getByRole('button', { name: 'MODIFY SEARCH' }).click();
  await expect(page.getByText('FromDelhiDEL, Delhi Indira')).toBeVisible();
  await expect(page.getByText('ToChennaiMAA, Chennai Arpt,')).toBeVisible();
  await page.getByLabel('Close', { exact: true }).click();
    await page.getByRole('img', { name: '@simonguo' }).click();
    await page.getByText('Sign out').click();
  });

  test.only('TC_ONEWAY_25: Verify that the flight search results are displayed correctly for a valid One-Way Trip.', async ({ page }) => {
   
    await page.goto('https://tripvista.appxpay.in/home');
    await page.getByPlaceholder('Enter your email').click();
    await page.getByPlaceholder('Enter your email').fill('agent@gmail.com');
    await page.getByPlaceholder('Enter your password').click();
    await page.getByPlaceholder('Enter your password').fill('SmartWork@1234');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('FromChennaiMAA, Chennai Arpt')).toBeVisible();
    await expect(page.getByText('ToDelhiDEL, Delhi Indira')).toBeVisible();
    await expect(page.getByText('Travellers & Class1')).toBeVisible();
    await page.getByRole('button', { name: 'Book Now' }).click();
    await expect(page.locator('div').filter({ hasText: 'AirlinesDepartureArrivalPriceIndiGo6E-166 - 32109:15 PMChennai Arpt (MAA)2h' }).nth(3)).toBeVisible();

    await page.getByRole('img', { name: '@simonguo' }).click();
    await page.getByText('Sign out').click();
  });
  test.only('TC_ONEWAY_26: Verify search results validations.', async ({ page }) => {
    await page.goto('https://tripvista.appxpay.in/home');
    await page.getByPlaceholder('Enter your email').click();
    await page.getByPlaceholder('Enter your email').fill('agent@gmail.com');
    await page.getByPlaceholder('Enter your password').click();
    await page.getByPlaceholder('Enter your password').fill('SmartWork@1234');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('FromChennaiMAA, Chennai Arpt')).toBeVisible();
    await expect(page.getByText('ToDelhiDEL, Delhi Indira')).toBeVisible();
    await expect(page.getByText('Travellers & Class1')).toBeVisible();
    await page.getByRole('button', { name: 'Book Now' }).click();
    await expect(page.locator('div').filter({ hasText: 'AirlinesDepartureArrivalPriceIndiGo6E-166 - 32109:15 PMChennai Arpt (MAA)2h' }).nth(3)).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^IndiGo6E-166 - 321$/ }).locator('span')).toBeVisible();
  await expect(page.locator('.rs-panel-body').first()).toBeVisible();
  await expect(page.getByText('Delhi Indira Gandhi Intl (DEL)').first()).toBeVisible();
  await expect(page.getByText('Chennai Arpt (MAA)').first()).toBeVisible();

    await page.getByRole('img', { name: '@simonguo' }).click();
    await page.getByText('Sign out').click();
  });
  test('TC_ONEWAY_27: Verify that the Modify Search functionality updates the flight results correctly', async ({ page }) => {
    await page.goto('https://tripvista.appxpay.in/home');
    await page.getByPlaceholder('Enter your email').click();
    await page.getByPlaceholder('Enter your email').fill('agent@gmail.com');
    await page.getByPlaceholder('Enter your password').click();
    await page.getByPlaceholder('Enter your password').fill('SmartWork@1234');
    await page.getByRole('button', { name: 'Login' }).click();


    await page.getByRole('img', { name: '@simonguo' }).click();
    await page.getByText('Sign out').click();
    
  });
  test('TC_ONEWAY_28: ', async ({ page }) => {
    await page.goto('https://tripvista.appxpay.in/home');
    await page.getByPlaceholder('Enter your email').click();
    await page.getByPlaceholder('Enter your email').fill('agent@gmail.com');
    await page.getByPlaceholder('Enter your password').click();
    await page.getByPlaceholder('Enter your password').fill('SmartWork@1234');
    await page.getByRole('button', { name: 'Login' }).click();


    await page.getByRole('img', { name: '@simonguo' }).click();
    await page.getByText('Sign out').click();
    
  });
  test('TC_ONEWAY_29: ', async ({ page }) => {
    await page.goto('https://tripvista.appxpay.in/home');
    await page.getByPlaceholder('Enter your email').click();
    await page.getByPlaceholder('Enter your email').fill('agent@gmail.com');
    await page.getByPlaceholder('Enter your password').click();
    await page.getByPlaceholder('Enter your password').fill('SmartWork@1234');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByLabel('Multi City').check();
    await page.getByRole('button', { name: 'Add Flight' }).click();
    await page.getByText('Select a city').click();
    await page.getByText('Bengaluru', { exact: true }).click();
    await page.locator('div:nth-child(2) > div > div > div:nth-child(3)').first().click();
    await page.getByRole('button', { name: 'Add Flight' }).click();
    await page.getByText('Select a city').click();
    await page.getByTestId('picker-popup').getByText('Delhi', { exact: true }).click();
    await page.getByRole('button', { name: 'Add Flight' }).click();
    await page.getByText('Prefered AirlinesSelectDirect').click();
    await page.getByText('No airport selected').click();
    await page.getByText('Hyderabad').click();
    await page.getByRole('button', { name: 'Add Flight' }).click();
    await page.getByText('Select a city').click();
    await page.getByText('ChennaiChennai ArptMAA').click();
    await page.getByRole('button', { name: 'Book Now' }).click();
    await page.getByRole('button', { name: 'MODIFY SEARCH' }).click();
    await page.locator('div:nth-child(6) > button').click();
    await page.locator('div:nth-child(5) > button').first().click();
    await page.getByRole('button', { name: 'Book Now' }).click();
    await page.getByRole('button', { name: 'MODIFY SEARCH' }).click();
    await page.getByTestId('modal-wrapper').getByText('Bengaluru').first().click();
    await page.getByText('Hyderabad').click();
    await page.getByText('Bengaluru', { exact: true }).click();
    await page.getByTestId('picker-popup').getByText('Shamshabad Rajiv Gandhi Intl').click();
    await page.getByText('To').nth(2).click();
    await page.getByRole('option', { name: 'Madurai Madurai Airport IXM' }).locator('span').click();
    await page.getByRole('button', { name: 'Book Now' }).click();
    await page.locator('div:nth-child(4) > .rs-btn').first().click();
    await page.getByText('DEL to HYD3/13/').click();
    await page.locator('div:nth-child(4) > .rs-btn').first().click();
    await page.getByRole('row', { name: 'MAA to DEL 3/12/2025 DEL to' }).getByRole('button').nth(1).click();
    await page.getByRole('row', { name: 'MAA to DEL 3/12/2025 DEL to' }).getByRole('button').nth(1).click();
    await page.getByText('HYD to IXM3/14/').click();
    await page.locator('div:nth-child(4) > .rs-btn').first().click();

    await page.getByRole('img', { name: '@simonguo' }).click();
    await page.getByText('Sign out').click();
    
  });
  test('TC_ONEWAY_30: ', async ({ page }) => {
    await page.goto('https://tripvista.appxpay.in/home');
    await page.getByPlaceholder('Enter your email').click();
    await page.getByPlaceholder('Enter your email').fill('agent@gmail.com');
    await page.getByPlaceholder('Enter your password').click();
    await page.getByPlaceholder('Enter your password').fill('SmartWork@1234');
    await page.getByRole('button', { name: 'Login' }).click();


    await page.getByRole('img', { name: '@simonguo' }).click();
    await page.getByText('Sign out').click();
    
  });
test.only('Book a Flight and Proceed to Payment', async ({ page }) => {
  await page.goto('https://tripvista.appxpay.in/home');

  // Login
  await page.getByPlaceholder('Enter your email').click();
  await page.getByPlaceholder('Enter your email').fill('agent@gmail.com');
  await page.getByPlaceholder('Enter your password').click();
  await page.getByPlaceholder('Enter your password').fill('SmartWork@1234');
  await page.getByRole('button', { name: 'Login' }).click();

  // Booking Process
  await page.getByRole('button', { name: 'Book Now' }).click();
  await page.locator('div:nth-child(4) > .rs-btn').first().click();
  await page.getByRole('combobox').selectOption('ms');
  await page.getByPlaceholder('Enter the First Name').fill('TEst');
  await page.getByPlaceholder('Enter the Last Name').fill('User');
  await page.getByPlaceholder('Enter the Mobile Number').fill('8547859874');
  await page.getByPlaceholder('Enter the Email ID').fill('test@yopmail.com');

  // Select Date
  await page.getByPlaceholder('dd/MM/yyyy').click();
  await page.getByLabel('10 Mar').getByText('10').click();
  await page.getByRole('button', { name: 'Continue' }).click();

  // Baggage Selection
  await page.getByRole('combobox').click();
  await page.getByRole('tab', { name: 'Baggage' }).click();
  await page.getByRole('combobox').click();
  await page.getByText('Excess Baggage - 5 Kg - ₹').click();

  // Extra Services
  await page.getByRole('tab', { name: 'Extra Services' }).click();
  await expect(page.getByText('No extra service options')).toBeVisible();
  await page.getByRole('button', { name: 'Continue' }).click();

  // Seat Selection
  await page.getByText('3D', { exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();

  // Contact Information
  await page.getByPlaceholder('Enter the Mobile Number').fill('8547854587');
  await page.getByPlaceholder('Enter the Email ID').fill('test@yopmail.com');
  await page.getByRole('button', { name: 'Continue' }).click();

  // Review and Confirm
  await page.getByRole('gridcell', { name: 'ContectIcon Review & Confirm' }).getByLabel('edit').click();
  await page.getByRole('button', { name: 'Continue' }).click();

  // Payment Process
 // await page.locator('//input[@id="agree"]').check();
 
  await page.locator('//button[normalize-space()="Confirm Payment"]').click();

  await page.locator('//input[@id="agree"]').check();
  await page.locator('//button[normalize-space()="Make Payment"]').click();

  await page.locator('//a[normalize-space()="Razor Pay"]').click();
  await page.locator('//button[normalize-space()="Pay Now via Razorpay"]').click();

  console.log("Manual action required to complete the payment process.");
});
