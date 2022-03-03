// @ts-check

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],
  repeatEach: 6,
  retries: 2,
  workers: 1,
  use: {
    headless: false,
    viewport: { width: 1366, height: 768 },
    video: {
      mode: "retain-on-failure",
      size: {
        width: 1366,
        height: 768
      }
    },
  },
};

module.exports = config;
