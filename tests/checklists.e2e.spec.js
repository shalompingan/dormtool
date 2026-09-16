// Cart/checklist-style tools (dorm-checklist, move-out-checklist,
// dorm-laundry-hub, first-apartment-checklist all share this pattern).
// Representative coverage on 2 of the 4 -- the rest share identical
// item-shop/cart/checkbox markup and don't need a duplicate spec.
const { test, expect } = require('@playwright/test');

test.describe('dorm-checklist', () => {
  test('adding items via "Shop" updates cart count and contents; removing decrements it', async ({ page }) => {
    await page.goto('/dorm-checklist/');
    const shopButtons = page.locator('.item-shop');
    const firstName = await page.locator('.item-card').first().locator('.item-name').innerText();
    const secondName = await page.locator('.item-card').nth(1).locator('.item-name').innerText();

    await shopButtons.nth(0).click();
    await shopButtons.nth(1).click();
    await expect(page.locator('#cartCount')).toHaveText('2 items');
    await expect(page.locator('#cartItems')).toContainText(firstName);
    await expect(page.locator('#cartItems')).toContainText(secondName);
    await expect(shopButtons.nth(0)).toHaveText(/Added/);

    await page.locator('.ci-remove').first().click();
    await expect(page.locator('#cartCount')).toHaveText('1 item');
  });

  test('checking an item updates the progress count', async ({ page }) => {
    // the real checkbox is visually hidden in favor of a custom .check-box
    // -- dispatchEvent bypasses Playwright's visibility requirement while
    // still firing the native checkbox-toggle default action + 'change'
    await page.goto('/dorm-checklist/');
    await expect(page.locator('#checkedCount')).toHaveText('0');
    await page.locator('.item-check input[type="checkbox"]').first().dispatchEvent('click');
    await expect(page.locator('#checkedCount')).toHaveText('1');
  });
});

test.describe('first-apartment-checklist', () => {
  test('estimated budget total reflects every listed item, not just checked ones', async ({ page }) => {
    // NOTE: unlike dorm-budget-calculator (where the total only counts
    // *checked* items), this tool's #budgetTotal sums estPrice across ALL
    // items on the checklist regardless of checked state -- it's an
    // "everything you might need" estimate, not a running cart total.
    // This test pins down that actual behavior; it is not asserting it's
    // the "right" UX, just that it doesn't silently change.
    await page.goto('/first-apartment-checklist/');
    const budget = page.locator('#budgetTotal');
    const initialText = await budget.innerText();
    expect(initialText).toMatch(/^~\$\d+$/);
    expect(initialText).not.toBe('~$0');

    await page.locator('.item-check input[type="checkbox"]').first().dispatchEvent('click');
    await expect(budget).toHaveText(initialText); // checking items does not change the total
  });

  test('adding items via "Shop" updates cart count', async ({ page }) => {
    await page.goto('/first-apartment-checklist/');
    await page.locator('.item-shop').first().click();
    await expect(page.locator('#cartCount')).toHaveText('1 item');
  });
});
