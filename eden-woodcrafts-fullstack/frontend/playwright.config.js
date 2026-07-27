const { defineConfig, devices } = require("@playwright/test");

// Runs against a fully-running stack: backend on :4000, frontend on :3000.
// Start both (`npm run dev` in each folder) before `npm run test:e2e`, or
// let Playwright's webServer block below start the frontend for you —
// the backend still needs to be started separately since it owns the DB.
module.exports = defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry"
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  }
});
