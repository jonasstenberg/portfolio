/**
 * Composes results/health.json from the Playwright JSON report and the
 * Lighthouse JSON report. Published to stenberg.io/health.json by CI and
 * rendered by the /health/ page. Run with Bun: `bun scripts/compose-health.ts`
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

type PlaywrightResult = { duration: number };
type PlaywrightTest = { results: PlaywrightResult[] };
type PlaywrightSpec = { title: string; ok: boolean; tests: PlaywrightTest[] };
type PlaywrightSuite = { suites?: PlaywrightSuite[]; specs?: PlaywrightSpec[] };
type PlaywrightReport = { suites?: PlaywrightSuite[] };

type LighthouseReport = { categories?: Record<string, { score: number | null }> };

type Check = { title: string; status: 'passed' | 'failed'; durationMs: number };

const read = <T>(path: string): T | null => {
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as T;
  } catch {
    return null;
  }
};

const playwright = read<PlaywrightReport>('results/playwright.json');
const lighthouse = read<LighthouseReport>('results/lighthouse.json');

const checks: Check[] = [];
const walk = (suite: PlaywrightSuite): void => {
  for (const child of suite.suites ?? []) walk(child);
  for (const spec of suite.specs ?? []) {
    const results = spec.tests.flatMap((test) => test.results);
    checks.push({
      title: spec.title,
      status: spec.ok ? 'passed' : 'failed',
      durationMs: Math.round(results.reduce((sum, result) => sum + result.duration, 0)),
    });
  }
};
for (const suite of playwright?.suites ?? []) walk(suite);

const score = (category: string): number | null => {
  const value = lighthouse?.categories?.[category]?.score;
  return value == null ? null : Math.round(value * 100);
};

const health = {
  generatedAt: new Date().toISOString(),
  commit: process.env.GITHUB_SHA?.slice(0, 7) ?? null,
  runUrl: process.env.RUN_URL ?? null,
  summary: {
    total: checks.length,
    passed: checks.filter((check) => check.status === 'passed').length,
    failed: checks.filter((check) => check.status === 'failed').length,
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
