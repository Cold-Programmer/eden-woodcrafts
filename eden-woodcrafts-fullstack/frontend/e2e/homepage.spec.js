const { test, expect } = require("@playwright/test");

test("homepage loads and shows key navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Eden Woodcrafts/);
  await expect(page.getByRole("link", { name: "Shop" })).toBeVisible();
  await expect(page.getByRole("link", { name: "About" })).toBeVisible();
});

test("shop page renders the product grid or an empty state", async ({ page }) => {
  await page.goto("/shop");
  await expect(page.getByRole("heading", { name: "Shop" })).toBeVisible();
});
