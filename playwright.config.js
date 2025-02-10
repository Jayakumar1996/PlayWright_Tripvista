const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  timeout: 60000,
  use: {
    viewport: { width: 1920, height: 1080 },
  },
  reporter: [
    ["line"],
    ['html'],
    ['junit', { outputFile: 'results.xml' }],
    ['monocart-reporter', {
      name: "Trip Vista Test Report",
      outputFile: './monocart-report/index.html'
    }]
  ],


  projects: [
    {
      name: 'chrome',
      use: {
        browserName: `chromium`,
        channel: `chrome`,
        headless: true,
        screenshot: `only-on-failure`,
        video: `retain-on-failure`,
        trace: `retain-on-failure`,
        actionTimeout: 60000,
        viewport: null,
        deviceScaleFactor: undefined,
         launchOptions: { args: ['--start-maximized'] }
      },
    },
  ]
});

