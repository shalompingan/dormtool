// roommate-agreement is not a calculator -- it's a radio-driven questionnaire
// that generates a printable text agreement. These tests cover the
// multi-step interaction (cross-tab answers, name-required guard, the
// toggle-off-a-selected-radio affordance, and the zero-answers confirm()).
const { test, expect } = require('@playwright/test');

test('generate blocked with an alert until both roommate names are filled', async ({ page }) => {
  await page.goto('/roommate-agreement/');
  let alertMessage = '';
  page.once('dialog', async (dialog) => {
    alertMessage = dialog.message();
    await dialog.accept();
  });
  await page.click('#generateBtn');
  expect(alertMessage).toContain('roommate names');
  await expect(page.locator('#agreementOutput')).not.toHaveClass(/is-visible/);
});

test('answers across 2 tabs appear in the generated agreement, by label not raw value', async ({ page }) => {
  await page.goto('/roommate-agreement/');
  await page.fill('#rm1Name', 'Alex');
  await page.fill('#rm2Name', 'Jordan');

  // The real <input type="radio"> is display:none (custom-styled label is
  // the visible control), so dispatchEvent('click') is used instead of
  // click()/check() -- Playwright's actionability checks refuse to click a
  // display:none element, but a dispatched click still triggers the
  // browser's native radio-activation default action plus the page's own
  // 'click'/'change' listeners on the input.

  // Tab 1: Rent & Bills -- "How will rent be split?" -> Equally(50/50)
  await page.click('.tab-btn[data-category="rent-bills"]');
  await page.locator('input[name="aq_rent-bills_rent-split"][value="equally"]').dispatchEvent('click');

  // Tab 2: Cleaning -- "How often will you clean?" -> Weekly rotation
  await page.click('.tab-btn[data-category="cleaning"]');
  await page.locator('input[name="aq_cleaning_cleaning-schedule"][value="weekly"]').dispatchEvent('click');

  await page.click('#generateBtn');
  await expect(page.locator('#agreementOutput')).toHaveClass(/is-visible/);
  const outputText = await page.locator('#agreementOutput').innerText();
  expect(outputText).toContain('Equally(50/50)');
  expect(outputText).toContain('Weekly rotation');
});

test('clicking an already-selected radio deselects it', async ({ page }) => {
  await page.goto('/roommate-agreement/');
  await page.click('.tab-btn[data-category="rent-bills"]');
  const radio = page.locator('input[name="aq_rent-bills_rent-split"][value="equally"]');
  await radio.dispatchEvent('click');
  await expect(radio).toBeChecked();
  await expect(page.locator('#answeredCount')).toHaveText('1');

  await radio.dispatchEvent('click'); // click it again
  await expect(radio).not.toBeChecked();
  await expect(page.locator('#answeredCount')).toHaveText('0');
});

test('generating with zero answers shows a confirm() dialog first', async ({ page }) => {
  await page.goto('/roommate-agreement/');
  await page.fill('#rm1Name', 'Alex');
  await page.fill('#rm2Name', 'Jordan');

  let dialogSeen = false;
  let dialogType = '';
  page.once('dialog', async (dialog) => {
    dialogSeen = true;
    dialogType = dialog.type();
    await dialog.dismiss();
  });
  await page.click('#generateBtn');
  await page.waitForTimeout(200);
  expect(dialogSeen).toBe(true);
  expect(dialogType).toBe('confirm');
});
