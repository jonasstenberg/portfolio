import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import './health.css';

const REPO = 'https://github.com/jonasstenberg/portfolio';

type Check = { title: string; status: 'passed' | 'failed'; durationMs: number };

type Health = {
  generatedAt: string;
  commit: string | null;
  runUrl: string | null;
  summary: { total: number; passed: number; failed: number };
  checks: Check[];
  lighthouse: {
    performance: number | null;
    accessibility: number | null;
    bestPractices: number | null;
    seo: number | null;
  };
};

const timeAgo = (iso: string) => {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours} h ago`;
  return `${Math.round(hours / 24)} days ago`;
};

const STATUS_WORDS = { good: 'Good', warn: 'Needs work', poor: 'Poor' } as const;

const Gauge = ({ label, value }: { label: string; value: number | null }) => {
  const status = value == null ? null : value >= 90 ? 'good' : value >= 50 ? 'warn' : 'poor';
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const dash = ((value ?? 0) / 100) * circumference;
  return (
    <div className='tile'>
      <svg viewBox='0 0 80 80' role='img' aria-label={`${label}: ${value ?? 'no data'} of 100`}>
        <circle className='gauge-track' cx='40' cy='40' r={radius} />
        {status && (
          <circle
            className={`gauge-fill gauge-${status}`}
            cx='40'
            cy='40'
            r={radius}
            strokeDasharray={`${dash} ${circumference}`}
            transform='rotate(-90 40 40)'
          />
        )}
        <text x='40' y='47' textAnchor='middle'>
          {value ?? '–'}
        </text>
      </svg>
      <div className='tile-label'>{label}</div>
      {status && <div className={`tile-status status-${status}`}>{STATUS_WORDS[status]}</div>}
    </div>
  );
};

const HealthPage = () => {
  const [health, setHealth] = useState<Health | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    fetch('/health.json', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then(setHealth)
      .catch(() => setMissing(true));
  }, []);

  return (
    <div className='health'>
      <a className='health-back' href='/'>
        :e stenberg.io
      </a>
      <h1>Health</h1>
      <p className='health-sub'>
        This site tests itself. I build website QA tooling for a living, so the portfolio should
        walk the walk: Playwright, axe-core and Lighthouse run against the live site daily and after
        every deploy, and this page shows the latest results.
      </p>

      {missing && (
        <p className='health-empty'>
          No health data published yet — the first run hasn't completed. Check the{' '}
          <a href={`${REPO}/actions/workflows/health.yaml`}>workflow runs</a>.
        </p>
      )}

      {health && (
        <>
          <div className='health-hero'>
            <strong className={health.summary.failed === 0 ? 'ok' : 'bad'}>
              {health.summary.failed === 0
                ? `✓ ${health.summary.passed}/${health.summary.total} checks passing`
                : `✗ ${health.summary.failed} of ${health.summary.total} checks failing`}
            </strong>
          </div>
          <p className='health-meta'>
            Last run {timeAgo(health.generatedAt)}
            {health.commit && (
              <>
                {' · '}
                commit{' '}
                <a href={`${REPO}/commit/${health.commit}`} rel='noopener noreferrer'>
                  {health.commit}
                </a>
              </>
            )}
            {health.runUrl && (
              <>
                {' · '}
                <a href={health.runUrl} rel='noopener noreferrer'>
                  run log
                </a>
              </>
            )}
          </p>

          <div className='tiles'>
            <Gauge label='Performance' value={health.lighthouse.performance} />
            <Gauge label='Accessibility' value={health.lighthouse.accessibility} />
            <Gauge label='Best practices' value={health.lighthouse.bestPractices} />
            <Gauge label='SEO' value={health.lighthouse.seo} />
          </div>

          <ul className='checks'>
            {health.checks.map((check) => (
              <li key={check.title} className={check.status}>
                <span className='check-icon' aria-hidden='true'>
                  {check.status === 'passed' ? '✓' : '✗'}
                </span>
                <span className='check-title'>
                  {check.title}
                  <span className='visually-hidden'> — {check.status}</span>
                </span>
                <span className='check-duration'>{(check.durationMs / 1000).toFixed(1)}s</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className='health-footer'>
        Powered by <a href={`${REPO}/blob/main/.github/workflows/health.yaml`}>a GitHub workflow</a>{' '}
        running <a href={`${REPO}/tree/main/apps/qa`}>the qa suite</a> — Playwright end-to-end
        checks (including the vim mode and the Konami code), an axe-core accessibility scan, and
        Lighthouse. Results land here as a static <a href='/health.json'>health.json</a>.
      </p>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<HealthPage />);
