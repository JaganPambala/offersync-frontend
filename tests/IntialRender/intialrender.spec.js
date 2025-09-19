import { test, expect } from "@playwright/test";

test("Initial rendering and navigation", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  const signInHeading = page.getByRole("heading", {
    name: "Sign in to your account",
  });

  const greeting = page.getByRole("heading", {
    name: "Good evening, Welcome to OfferSync! 👋",
  });

  const totalOffersText = page.getByText("Total Offers", { exact: true });
  const activeOffers = page.getByText("Active Offers", { exact: true });
  const loginButton = page.getByRole("button", { name: "Login" });
  const signUpHeading = page.getByText("Create your HR account");

  const quickactionsCandidate = page.getByRole("heading", {
    name: "Check Candidate",
    exact: true,
  });

  await expect(greeting).toHaveText("Good evening, Welcome to OfferSync! 👋");

  await page.getByRole("link", { name: "Candidate Check" }).click();
  await expect(signInHeading).toHaveText("Sign in to your account");

  await page.getByRole("link", { name: "create a new account" }).click();
  await expect(signUpHeading).toHaveText("Create your HR account");

  await page.goBack();
  await page.goBack();

  await page.getByRole("link", { name: "Offers", exact: true }).click();
  await expect(signInHeading).toHaveText("Sign in to your account");

  await page.goBack();

  await page.getByRole("link", { name: "Communications", exact: true }).click();
  await expect(signInHeading).toHaveText("Sign in to your account");

  await page.goBack();

  await expect(activeOffers).toHaveText("Active Offers");
  await expect(totalOffersText).toHaveText("Total Offers");

  await quickactionsCandidate.click();
  await expect(signInHeading).toHaveText("Sign in to your account");

  await page.goBack();
  await loginButton.click();
  await expect(signInHeading).toHaveText("Sign in to your account");
});
