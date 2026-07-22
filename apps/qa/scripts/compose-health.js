/**
 * Composes results/health.json from the Playwright JSON report and the
 * Lighthouse JSON report. Published to stenberg.io/health.json by CI and
 * rendered by the /health/ page.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const read = (path) => {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
};

const playwright = read('results/playwright.json');
const lighthouse = read('results/lighthouse.json');

const checks = [];
const walk = (suite) => {
  for (const child of suite.suites ?? []) walk(child);
  for (const spec of suite.specs ?? []) {
    const results = spec.tests.flatMap((t) => t.results);
    checks.push({
      title: spec.title,
      status: spec.ok ? 'passed' : 'failed',
      durationMs: Math.round(results.reduce((sum, r) => sum + r.duration, 0)),
    });
  }
};
for (const suite of playwright?.suites ?? []) walk(suite);

const score = (category) =>
  lighthouse?.categories?.[category]?.score != null
    ? Math.round(lighthouse.categories[category].score * 100)
    : null;

const health = {
  generatedAt: new Date().toISOString(),
  commit: process.env.GITHUB_SHA?.slice(0, 7) ?? null,
  runUrl: process.env.RUN_URL ?? null,
  summary: {
    total: checks.length,
    passed: checks.filter((c) => c.status === 'passed').length,
    failed: checks.filter((c) => c.status === 'failed').length,
  },
  checks,
  lighthouse: {
    performance: score('performance'),
    accessibility: score('accessibility'),
    bestPractices: score('best-practices'),
    seo: score('seo'),
  },
};

mkdirSync('results', { recursive: true });
writeFileSync('results/health.json', JSON.stringify(health, null, 2));
console.log(
  `health.json: ${health.summary.passed}/${health.summary.total} checks passed, ` +
    `lighthouse ${Object.values(health.lighthouse).join('/')}`,
);
