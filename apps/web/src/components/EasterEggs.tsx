import { useEffect, useRef, useState } from 'react';

const KONAMI = [
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

let greeted = false;

const greet = () => {
  if (greeted) return;
  greeted = true;
  console.log(
    '%cstenberg.io',
    'font: 700 20px ui-monospace, SFMono-Regular, Menlo, monospace; color: #2572a5;',
  );
  console.log(
    [
      'Nice, you inspect things too. A few things you might like:',
      '',
      '  • This CV is a real GraphQL API → https://stenberg.io/graphql',
      '    (playground at https://stenberg.io/graphiql/)',
      '  • The site speaks vim — press ? for keybindings',
      '  • There is a Konami code. You know what to do.',
      '',
      '  Source: https://github.com/jonasstenberg/portfolio',
    ].join('\n'),
  );
};

export const EasterEggs = () => {
  const [toast, setToast] = useState(false);
  const progress = useRef(0);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    greet();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === KONAMI[progress.current]) progress.current += 1;
      else progress.current = key === KONAMI[0] ? 1 : 0;
      if (progress.current < KONAMI.length) return;
      progress.current = 0;

      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('barrel-roll');
        window.setTimeout(() => document.body.classList.remove('barrel-roll'), 1600);
      }
      setToast(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setToast(false), 4000);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(timer.current);
    };
  }, []);

  if (!toast) return null;
  return (
    <div className='konami-toast' aria-hidden='true'>
      ↑↑↓↓←→←→BA — 30 extra lives
    </div>
  );
};
