const { test, expect } = require('@playwright/test');

test.describe('UI end-to-end flow', () => {
  test('renders and updates the checkout summary in the browser', async ({ page }) => {
    await page.setContent(`
      <main>
        <h1 data-testid="title">Playwright UI + API E2E</h1>
        <button data-testid="add-item">Add item</button>
        <p data-testid="summary">Items in cart: 0</p>
      </main>
      <script>
        const summary = document.querySelector('[data-testid="summary"]');
        const button = document.querySelector('[data-testid="add-item"]');
        let count = 0;
        button.addEventListener('click', () => {
          count += 1;
          summary.textContent = 'Items in cart: ' + count;
        });
      </script>
    `);

    await expect(page.getByTestId('title')).toHaveText('Playwright UI + API E2E');
    await page.getByTestId('add-item').click();
    await expect(page.getByTestId('summary')).toHaveText('Items in cart: 1');
  });
});
