import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 1,
  fullyParallel: true,
  reporter: [['list'], ['json', { outputFile: 'results/playwright.json' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://stenberg.io',
    // The site honors prefers-reduced-motion, which makes scrolling
    // assertions deterministic.
    contextOptions: { reducedMotion: 'reduce' },
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
