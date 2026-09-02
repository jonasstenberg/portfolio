import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// The vim keydown listener attaches on React mount, which can lag the load
// event on slow runners — wait for the status chip before typing.
const gotoVimReady = async (page: Page) => {
  await page.goto('/');
  await expect(page.locator('.vim-status')).toBeVisible();
};

test('home page renders', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Jonas Stenberg/);
  await expect(page.locator('h1')).toContainText('Jonas Stenberg');
});

test('security headers are in place', async ({ request }) => {
  const res = await request.get('/');
  expect(res.headers()['strict-transport-security']).toContain('max-age');
  expect(res.headers()['content-security-policy']).toContain("default-src 'self'");
  expect(res.headers()['x-content-type-options']).toBe('nosniff');
});

test('CV GraphQL API answers the canonical query', async ({ request }) => {
  const res = await request.post('/graphql', {
    data: { query: '{ experience { company role highlights } }' },
  });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.data.experience.length).toBeGreaterThan(5);
  expect(body.data.experience[0].company).toBe('Lime Technologies');
});

test('GraphQL schema supports filter arguments', async ({ request }) => {
  const res = await request.post('/graphql', {
    data: { query: '{ experience(current: true) { company } skills(category: HARD) { name } }' },
  });
  const body = await res.json();
  expect(body.data.experience).toHaveLength(1);
  expect(body.data.skills.length).toBeGreaterThan(5);
});

test('GraphiQL playground is served', async ({ page }) => {
  await page.goto('/graphiql/');
  await expect(page.locator('.graphiql-container')).toBeVisible({ timeout: 15_000 });
});

test('vim mode: ? opens the help panel', async ({ page }) => {
  await gotoVimReady(page);
  await page.keyboard.press('?');
  await expect(page.locator('.vim-help')).toBeVisible();
});

test('vim mode: /vue finds the skill', async ({ page }) => {
  await gotoVimReady(page);
  await page.keyboard.press('/');
  await page.keyboard.type('vue');
  await page.keyboard.press('Enter');
  await expect(page.locator('.vim-status')).toContainText('match');
});

test('vim mode: :contact jumps to the contact section', async ({ page }) => {
  await gotoVimReady(page);
  await page.keyboard.press(':');
  await page.keyboard.type('contact');
  await page.keyboard.press('Enter');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
});

test('konami code grants 30 extra lives', async ({ page }) => {
  await gotoVimReady(page);
  const sequence = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ];
  for (const key of sequence) {
    await page.keyboard.press(key);
  }
  await expect(page.locator('.konami-toast')).toContainText('30 extra lives');
});

test('missing pages get the vim-style 404', async ({ request }) => {
  const res = await request.get('/this-page-does-not-exist');
  expect(res.status()).toBe(404);
  expect(await res.text()).toContain('E404: Not Found');
});

test('alternate domains redirect to stenberg.io', async ({ request }) => {
  const res = await request.get('https://jonasstenberg.com/cv', { maxRedirects: 0 });
  expect(res.status()).toBe(301);
  expect(res.headers()['location']).toBe('https://stenberg.io/cv');
});

test('accessibility: no serious or critical axe violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((v) =>
    ['serious', 'critical'].includes(v.impact ?? ''),
  );
  expect(
    serious.map((v) => `${v.id}: ${v.nodes.length} node(s)`),
    serious.map((v) => v.help).join('; '),
  ).toEqual([]);
});
