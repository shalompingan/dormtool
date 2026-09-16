// Drives the real, shipped (minified) pages in a real browser and asserts
// on rendered output, using input/output fixtures hand-verified against the
// actual calculation code in each page.
const { test, expect } = require('@playwright/test');

test.describe('gpa-calculator', () => {
  test('single course, A / 3 credits -> GPA 4.00', async ({ page }) => {
    await page.goto('/gpa-calculator/');
    await page.locator('.gpa-credits').first().fill('3');
    await page.locator('.gpa-grade').first().selectOption('A');
    await page.click('#calcBtn');
    await expect(page.locator('#resultsArea')).toContainText('4.00');
    await expect(page.locator('#resultsArea')).toContainText('A');
  });

  test('two courses, mixed grades -> GPA 3.43 (B+)', async ({ page }) => {
    await page.goto('/gpa-calculator/');
    await page.locator('.gpa-credits').first().fill('3');
    await page.locator('.gpa-grade').first().selectOption('A');
    await page.click('#addCourseBtn');
    const credits = page.locator('.gpa-credits');
    const grades = page.locator('.gpa-grade');
    await credits.nth(1).fill('4');
    await grades.nth(1).selectOption('B');
    await page.click('#calcBtn');
    await expect(page.locator('#resultsArea')).toContainText('3.43');
    await expect(page.locator('#resultsArea')).toContainText('B+');
  });

  test('all courses with credits <= 0 -> error message, no GPA', async ({ page }) => {
    await page.goto('/gpa-calculator/');
    await page.locator('.gpa-credits').first().fill('0');
    await page.click('#calcBtn');
    await expect(page.locator('#resultsArea')).toContainText('at least one course with valid credits');
  });
});

test.describe('student-loan-calculator', () => {
  test('$10,000 @ 5% / 10yr -> $106/mo, $2,728 interest', async ({ page }) => {
    await page.goto('/student-loan-calculator/');
    await page.fill('#inputAmount', '10000');
    await page.fill('#inputRate', '5');
    await page.fill('#inputTerm', '10');
    await page.click('#calcBtn');
    await expect(page.locator('#resultsArea')).toContainText('$106');
    await expect(page.locator('#resultsArea')).toContainText('$2,728');
  });

  test('$25,000 @ 6.5% / 10yr -> $284/mo, $9,064 interest', async ({ page }) => {
    await page.goto('/student-loan-calculator/');
    await page.fill('#inputAmount', '25000');
    await page.fill('#inputRate', '6.5');
    await page.fill('#inputTerm', '10');
    await page.click('#calcBtn');
    await expect(page.locator('#resultsArea')).toContainText('$284');
    await expect(page.locator('#resultsArea')).toContainText('$9,064');
  });

  test('zero amount -> validation error, no schedule', async ({ page }) => {
    await page.goto('/student-loan-calculator/');
    await page.fill('#inputAmount', '0');
    await page.fill('#inputRate', '5');
    await page.fill('#inputTerm', '10');
    await page.click('#calcBtn');
    await expect(page.locator('#resultsArea')).toContainText('valid numbers');
  });
});

test.describe('rent-affordability', () => {
  test('income=3000, defaults -> $750/month (25% custom rule binds)', async ({ page }) => {
    await page.goto('/rent-affordability/');
    await page.fill('#inputIncome', '3000');
    await page.fill('#inputDebts', '0');
    await page.click('#calcBtn');
    await expect(page.locator('#categoryPanel')).toContainText('$750');
  });

  test('high debt relative to income -> recommendation clamped to $0, not negative', async ({ page }) => {
    await page.goto('/rent-affordability/');
    await page.fill('#inputIncome', '1000');
    await page.fill('#inputDebts', '500');
    await page.fill('#inputUtils', '150');
    await page.click('#calcBtn');
    const text = await page.locator('#categoryPanel').innerText();
    expect(text).toContain('$0');
    expect(text).not.toMatch(/-\$\d/);
  });

  test('KNOWN ISSUE regression baseline: What-If tab ignores Calculator tab custom %', async ({ page }) => {
    // rent-affordability's What-If slider hardcodes a 25% custom-rule leg
    // regardless of what the user set on the Calculator tab. This test pins
    // down that CURRENT behavior as a baseline -- it is not a statement that
    // the behavior is correct. If this test starts failing, the underlying
    // bug was fixed (or changed) and CLAUDE.md / the site-consistency notes
    // referencing it should be updated, not this assertion silently patched.
    await page.goto('/rent-affordability/');
    await page.fill('#inputIncome', '3000');
    await page.fill('#inputDebts', '0');
    await page.fill('#inputCustom', '50'); // set a non-default custom % on Calculator tab
    await page.click('#calcBtn');
    await expect(page.locator('#categoryPanel')).toContainText('$900'); // 30% DTI rule binds now, not the 50% custom
  });
});

test.describe('bill-splitter', () => {
  // Default state ships with 2 roommates (You, Roommate 2) and 3 zero-amount
  // expenses (Rent, Electricity, Internet), all paid by "You" -- fixtures
  // below just fill in those existing rows rather than adding new ones.
  test('equal split: $1200+$100+$60 paid by You -> $680/person, settlement $680.00', async ({ page }) => {
    await page.goto('/bill-splitter/');
    const amounts = page.locator('.ei-amount');
    await amounts.nth(0).fill('1200');
    await amounts.nth(1).fill('100');
    await amounts.nth(2).fill('60');
    await page.click('#calculateBtn');
    await expect(page.locator('#summaryText')).toContainText('Total: $1360.00');
    await expect(page.locator('#summaryText')).toContainText('$680.00');
    await expect(page.locator('.settlement-card')).toContainText('680.00');
  });

  test('income split: 60000/40000 income on a $1000 expense -> 60%/40% ($600.00/$400.00)', async ({ page }) => {
    await page.goto('/bill-splitter/');
    await page.locator('.ei-amount').nth(0).fill('1000');
    await page.click('.split-method-btn[data-method="income"]');
    await page.locator('.sd-pct[data-rid="rm-1"]').fill('60000');
    await page.locator('.sd-pct[data-rid="rm-2"]').fill('40000');
    await page.click('#calculateBtn');
    await expect(page.locator('#categoryPanel')).toContainText('600.00');
    await expect(page.locator('#categoryPanel')).toContainText('400.00');
  });

  test('custom split not summing to 100% -> explicit error, no results', async ({ page }) => {
    await page.goto('/bill-splitter/');
    await page.locator('.ei-amount').nth(0).fill('1000');
    await page.click('.split-method-btn[data-method="custom"]');
    await page.locator('.sd-pct[data-rid="rm-1"]').fill('50');
    await page.locator('.sd-pct[data-rid="rm-2"]').fill('40');
    await page.click('#calculateBtn');
    await expect(page.locator('#categoryPanel')).toContainText('Current total: 90.0%');
  });
});

test.describe('dorm-budget-calculator', () => {
  test('checking two items sums price*qty and updates item count', async ({ page }) => {
    await page.goto('/dorm-budget-calculator/');
    const checkboxes = page.locator('input[type="checkbox"][id^="chk-"]');
    await checkboxes.nth(0).check();
    await checkboxes.nth(1).check();
    await expect(page.locator('#itemsDisplay')).toContainText('2 item');
  });

  test('negative price input is clamped to 0 in the computed line total', async ({ page }) => {
    // the <input> keeps showing "-5" as typed -- the app clamps the
    // *internal* state used for totals, not the field's own value, so the
    // observable effect is the rendered line total staying at $0.
    await page.goto('/dorm-budget-calculator/');
    const checkbox = page.locator('input[type="checkbox"][id^="chk-"]').first();
    await checkbox.check();
    const priceInput = page.locator('input[id^="price-"]').first();
    await priceInput.fill('-5');
    await priceInput.dispatchEvent('input');
    const lineTotal = page.locator('[id^="line-"]').first();
    await expect(lineTotal).toHaveText('$0');
    await expect(page.locator('#totalDisplay')).toHaveText('$0');
  });
});

test.describe('moving-cost-calculator', () => {
  test('default local/1bed/20mi/diy -> total $157.75 -> displayed $158', async ({ page }) => {
    await page.goto('/moving-cost-calculator/');
    await page.click('#calculateCostBtn');
    await expect(page.locator('#categoryPanel')).toContainText('158');
  });

  test('deposit estimate: all condition ratings "poor" + keys missing -> 0% back, not negative', async ({ page }) => {
    await page.goto('/moving-cost-calculator/');
    await page.click('#tabsContainer >> text=Deposit Saver');
    await page.fill('#depositAmount', '500');
    for (const cond of ['walls', 'carpet', 'cleanliness', 'furniture']) {
      await page.click(`.rating-bar[data-condition="${cond}"] button[data-val="poor"]`);
    }
    await page.click('.rating-bar[data-condition="keys"] button[data-val="no"]');
    await page.click('#estimateDepositBtn');
    const text = await page.locator('#categoryPanel').innerText();
    expect(text).toContain('0%');
    expect(text).not.toMatch(/-\d+%/);
  });
});

test.describe('final-grade-calculator', () => {
  test('current=85, weight=20, desired=90 -> required 110.0% (danger)', async ({ page }) => {
    await page.goto('/final-grade-calculator/');
    await page.fill('#fg-current', '85');
    await page.fill('#fg-weight', '20');
    await page.fill('#fg-desired', '90');
    await page.click('#fgCalcBtn');
    await expect(page.locator('#fgResults')).toContainText('110.0');
  });

  test('weight=0 -> explicit error, not a division-by-zero glitch', async ({ page }) => {
    await page.goto('/final-grade-calculator/');
    await page.fill('#fg-weight', '0');
    await page.click('#fgCalcBtn');
    await expect(page.locator('#fgResults')).toContainText('cannot be 0%');
  });

  test('page auto-calculates on load with default values (no click required)', async ({ page }) => {
    await page.goto('/final-grade-calculator/');
    await expect(page.locator('#fgResults')).not.toBeEmpty();
  });
});

test.describe('college-acceptance-calculator', () => {
  test('top20 / gpa3.8 / sat1450 / rank10 -> score 83, Very High / Safety', async ({ page }) => {
    await page.goto('/college-acceptance-calculator/');
    await page.selectOption('#inputTier', 'top20');
    await page.fill('#inputGpa', '3.8');
    await page.fill('#inputSat', '1450');
    await page.selectOption('#inputRank', '10');
    await page.click('#calcBtn');
    await expect(page.locator('#resultsArea')).toContainText('83');
    await expect(page.locator('#resultsArea')).toContainText('Very High');
  });

  test('gpa out of 0-5.0 range -> validation error', async ({ page }) => {
    await page.goto('/college-acceptance-calculator/');
    await page.fill('#inputGpa', '6.0');
    await page.click('#calcBtn');
    await expect(page.locator('#resultsArea')).toContainText('between 0.0 and 5.0');
  });
});
