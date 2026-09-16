// Cross-page interaction patterns that have broken before per CLAUDE.md's
// changelog: the mobile side-panel silently not sliding in (missing CSS
// rule), and tab switching not replacing #categoryPanel content.
const { test, expect } = require('@playwright/test');

test.describe('mobile side panel', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('hamburger opens the overlay AND slides the panel into view; close button works', async ({ page }) => {
    await page.goto('/gpa-calculator/');
    const overlay = page.locator('#hubSideOverlay');
    const panel = page.locator('.hub-side-panel');

    await expect(overlay).not.toHaveClass(/is-open/);
    await page.click('#hubHamburger');
    await expect(overlay).toHaveClass(/is-open/);
    // the historical bug: overlay opens (dims background) but the panel
    // itself never gets transform:translateX(0), so it stays off-screen
    await expect(panel).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');

    await page.click('#hubSideClose');
    await expect(overlay).not.toHaveClass(/is-open/);
  });
});

test.describe('tab switching replaces #categoryPanel content', () => {
  test('rent-affordability: Calculator -> City Guide tab changes panel content', async ({ page }) => {
    await page.goto('/rent-affordability/');
    const panel = page.locator('#categoryPanel');
    const before = await panel.innerText();
    await page.click('.tab-btn:has-text("City Guide")');
    await expect(panel).not.toHaveText(before);
  });

  test('moving-cost-calculator: Cost Calculator -> Deposit Saver tab changes panel content', async ({ page }) => {
    await page.goto('/moving-cost-calculator/');
    const panel = page.locator('#categoryPanel');
    await page.click('#calculateCostBtn');
    const before = await panel.innerText();
    await page.click('#tabsContainer >> text=Deposit Saver');
    await expect(panel).not.toHaveText(before);
  });

  test('final-grade-calculator: Calculator -> What-If tab changes panel content', async ({ page }) => {
    await page.goto('/final-grade-calculator/');
    const tabs = page.locator('.tab-btn, [role="tab"]');
    const count = await tabs.count();
    test.skip(count < 2, 'final-grade-calculator has no secondary tab on this build');
    const panel = page.locator('#categoryPanel, #fgResults');
    const before = await panel.first().innerText();
    await tabs.nth(1).click();
    await expect(panel.first()).not.toHaveText(before);
  });
});
