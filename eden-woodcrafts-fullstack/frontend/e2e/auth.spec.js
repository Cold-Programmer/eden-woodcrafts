const { test, expect } = require("@playwright/test");

// Requires the backend to be running and seeded (npm run seed in backend/).
test("a registered customer can log in and reach their dashboard", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("customer@example.com");
  await page.getByLabel("Password").fill("Customer@123");
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page).toHaveURL("/");
});

test("registration form rejects a short password", async ({ page }) => {
  await page.goto("/register");
  await page.getByLabel("Full name").fill("Test User");
  await page.getByLabel("Email").fill(`test-${Date.now()}@example.com`);
  await page.getByLabel("Password").fill("short");
  await page.getByRole("button", { name: "Sign up" }).click();

  // HTML5 minLength validation blocks submission client-side
  await expect(page).toHaveURL("/register");
});
