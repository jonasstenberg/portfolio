import { useCallback, useEffect, useRef, useState } from 'react';

type Mode = 'normal' | 'search' | 'command' | 'visual';

const SECTIONS = ['intro', 'about', 'skills', 'contact'] as const;

const HELP = [
  ['j / k', 'scroll'],
  ['Ctrl-d / Ctrl-u', 'half page down / up'],
  ['gg / G', 'top / bottom'],
  ['v', 'visual mode — j/k extend, y yank'],
  ['/text', 'search the page'],
  ['n / N', 'next / previous match'],
  [':intro :about :skills :contact', 'jump to section'],
  [':graphql', 'open the CV API playground'],
  ['Esc', 'clear'],
] as const;

const isEditable = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

const smoothScroll = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : ('smooth' as const);

/**
 * Document-space top of an element inside .main-wrapper. The wrapper is
 * position: fixed while the header is on screen, which makes rect-based
 * targets (and scrollIntoView) wrong there — but offsetTop within the
 * wrapper is stable in both states, and <main> never leaves normal flow.
 */
const docTop = (el: HTMLElement) => {
  const main = document.querySelector('main');
  if (!main) return el.getBoundingClientRect().top + window.scrollY;
  return main.getBoundingClientRect().top + window.scrollY + el.offsetTop;
};

const scrollToEl = (el: HTMLElement, center = false) => {
  const offset = center ? Math.max((window.innerHeight - el.offsetHeight) / 2, 64) : 64;
  window.scrollTo({ top: docTop(el) - offset, behavior: smoothScroll() });
};

const scrollToSection = (name: string) => {
  const heading = document.getElementById(`${name}-heading`);
  if (heading) scrollToEl(heading);
};

const scrollToRange = (range: Range) => {
  const el = range.startContainer.parentElement;
  if (!el) return;
  const delta = range.getBoundingClientRect().top - el.getBoundingClientRect().top;
  const top = docTop(el) + delta - Math.max(window.innerHeight / 2 - 24, 64);
  window.scrollTo({ top: Math.max(top, 0), behavior: smoothScroll() });
};

// Visual-mode "lines": experience entries, the about text, and top-level
// skill rows (nested skill lists select with their parent, so a range never
// contains the same text twice).
const visualItems = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>('.experiences li, .myself, .skills > div > ul > li'),
  );

const searchTargets = () =>
  Array.from(document.querySelectorAll<HTMLElement>('.experiences li, .skills li, .myself'));

const collectRanges = (el: HTMLElement, q: string, seen: Set<Node>) => {
  const ranges: Range[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (seen.has(node)) continue;
    seen.add(node);
    const text = (node.textContent ?? '').toLowerCase();
    let i = 0;
    while ((i = text.indexOf(q, i)) !== -1) {
      const range = new Range();
      range.setStart(node, i);
      range.setEnd(node, i + q.length);
      ranges.push(range);
      i += q.length;
    }
  }
  return ranges;
};

export const VimMode = () => {
  const [mode, setMode] = useState<Mode>('normal');
  const [buffer, setBuffer] = useState('');
  const [message, setMessage] = useState('');
  const [helpOpen, setHelpOpen] = useState(false);
  const [search, setSearch] = useState<{ ranges: Range[]; els: HTMLElement[] } | null>(null);
  const [current, setCurrent] = useState(0);
  const [visual, setVisual] = useState<{ anchor: number; head: number } | null>(null);
  const items = useRef<HTMLElement[]>([]);
  const pendingG = useRef(0);

  useEffect(() => {
    if (!search) return;
    const supportsHighlights = 'highlights' in CSS;
    const currentRange = search.ranges[current];
    // Word-level highlighting via the Custom Highlight API; block outlines
    // only as a fallback where the API is missing.
    if (supportsHighlights) {
      CSS.highlights.set('vim-search', new Highlight(...search.ranges));
      CSS.highlights.set(
        'vim-search-current',
        new Highlight(...(currentRange ? [currentRange] : [])),
      );
    } else {
      const currentEl = currentRange
        ? search.els.find((el) => el.contains(currentRange.startContainer))
        : undefined;
      search.els.forEach((el) => {
        el.classList.add('vim-match');
        el.classList.toggle('vim-match-current', el === currentEl);
      });
    }
    if (currentRange) scrollToRange(currentRange);
    return () => {
      search.els.forEach((el) => el.classList.remove('vim-match', 'vim-match-current'));
      if (supportsHighlights) {
        CSS.highlights.delete('vim-search');
        CSS.highlights.delete('vim-search-current');
      }
    };
  }, [search, current]);

  useEffect(() => {
    if (!visual) return;
    const [from, to] = [visual.anchor, visual.head].sort((a, b) => a - b);
    const selected = items.current.slice(from, to + 1);
    selected.forEach((el) => el.classList.add('vim-visual'));
    const head = items.current[visual.head];
    if (head) scrollToEl(head, true);
    return () => selected.forEach((el) => el.classList.remove('vim-visual'));
  }, [visual]);

  const runSearch = useCallback((input: string) => {
    const q = input.trim().toLowerCase();
    if (!q) return;
    const matching = searchTargets().filter((el) =>
      (el.textContent ?? '').toLowerCase().includes(q),
    );
    // Skills are nested lists, so a parent <li> matches whenever a child does —
    // keep the innermost elements for the fallback outlines, and dedupe the
    // occurrence ranges across overlapping subtrees via the shared `seen` set.
    const els = matching.filter(
      (el) => !matching.some((other) => other !== el && el.contains(other)),
    );
    const seen = new Set<Node>();
    const ranges = matching.flatMap((el) => collectRanges(el, q, seen));
    if (ranges.length === 0) {
      setMessage(`E486: Pattern not found: ${q}`);
      setSearch(null);
      return;
    }
    setSearch({ ranges, els });
    setCurrent(0);
    setMessage(`${ranges.length} ${ranges.length === 1 ? 'match' : 'matches'} — n/N to cycle`);
  }, []);

  const runCommand = useCallback((input: string) => {
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;
    if ((SECTIONS as readonly string[]).includes(cmd)) {
      scrollToSection(cmd);
    } else if (cmd === 'top') {
      window.scrollTo({ top: 0, behavior: smoothScroll() });
    } else if (cmd === 'bottom') {
      window.scrollTo({ top: document.body.scrollHeight, behavior: smoothScroll() });
    } else if (cmd === 'graphql' || cmd === 'api') {
      window.open('/graphiql/', '_blank', 'noopener');
    } else if (cmd === 'help' || cmd === 'h') {
      setHelpOpen(true);
    } else if (cmd === 'q' || cmd === 'quit') {
      setMessage('E37: No write since last change (add ! to override)');
    } else if (cmd === 'q!' || cmd === 'wq' || cmd === 'x') {
      setMessage('E444: Cannot close last window — try :contact instead');
    } else {
      setMessage(`E492: Not an editor command: ${cmd}`);
    }
  }, []);

  const enterVisual = useCallback(() => {
    items.current = visualItems();
    if (items.current.length === 0) return;
    const start = items.current.findIndex(
      (el) => el.getBoundingClientRect().bottom > window.innerHeight / 2,
    );
    const index = start === -1 ? items.current.length - 1 : start;
    setVisual({ anchor: index, head: index });
    setMode('visual');
    setMessage('');
  }, []);

  const yank = useCallback(() => {
    if (!visual) return;
    const [from, to] = [visual.anchor, visual.head].sort((a, b) => a - b);
    const text = items.current
      .slice(from, to + 1)
      .map((el) => el.innerText.trim())
      .join('\n\n');
    const count = to - from + 1;
    navigator.clipboard
      .writeText(text)
      .then(() => setMessage(`${count} ${count === 1 ? 'line' : 'lines'} yanked`))
      .catch(() => setMessage('E850: Invalid register name (clipboard unavailable)'));
    setVisual(null);
    setMode('normal');
  }, [visual]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditable(e.target)) return;

      if (e.ctrlKey && !e.metaKey && !e.altKey) {
        if ((mode === 'normal' || mode === 'visual') && (e.key === 'd' || e.key === 'u')) {
          e.preventDefault();
          window.scrollBy({ top: ((e.key === 'd' ? 1 : -1) * window.innerHeight) / 2 });
        }
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (mode === 'search' || mode === 'command') {
        if (e.key === 'Escape') {
          setMode('normal');
          setBuffer('');
        } else if (e.key === 'Enter') {
          if (mode === 'search') runSearch(buffer);
          else runCommand(buffer);
          setMode('normal');
          setBuffer('');
        } else if (e.key === 'Backspace') {
          if (buffer === '') setMode('normal');
          else setBuffer(buffer.slice(0, -1));
        } else if (e.key.length === 1) {
          setBuffer(buffer + e.key);
        }
        e.preventDefault();
        return;
      }

      const wantsG = pendingG.current > 0 && Date.now() - pendingG.current < 600;
      pendingG.current = 0;

      if (mode === 'visual' && visual) {
        const last = items.current.length - 1;
        switch (e.key) {
          case 'j':
            setVisual({ ...visual, head: Math.min(visual.head + 1, last) });
            break;
          case 'k':
            setVisual({ ...visual, head: Math.max(visual.head - 1, 0) });
            break;
          case 'g':
            if (wantsG) setVisual({ ...visual, head: 0 });
            else pendingG.current = Date.now();
            break;
          case 'G':
            setVisual({ ...visual, head: last });
            break;
          case 'o':
            setVisual({ anchor: visual.head, head: visual.anchor });
            break;
          case 'y':
            yank();
            break;
          case 'v':
          case 'Escape':
            setVisual(null);
            setMode('normal');
            break;
        }
        return;
      }

      switch (e.key) {
        case 'j':
          window.scrollBy({ top: 70 });
          break;
        case 'k':
          window.scrollBy({ top: -70 });
          break;
        case 'g':
          if (wantsG) window.scrollTo({ top: 0, behavior: smoothScroll() });
          else pendingG.current = Date.now();
          break;
        case 'G':
          window.scrollTo({ top: document.body.scrollHeight, behavior: smoothScroll() });
          break;
        case 'v':
          enterVisual();
          break;
        case '/':
          setMode('search');
          setMessage('');
          e.preventDefault();
          break;
        case ':':
          setMode('command');
          setMessage('');
          break;
        case 'n':
        case 'N':
          if (search && search.ranges.length > 0) {
            const delta = e.key === 'n' ? 1 : -1;
            const next = (current + delta + search.ranges.length) % search.ranges.length;
            setCurrent(next);
            setMessage(`match ${next + 1} of ${search.ranges.length}`);
          }
          break;
        case '?':
          setHelpOpen(!helpOpen);
          break;
        case 'Escape':
          setSearch(null);
          setMessage('');
          setHelpOpen(false);
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, buffer, search, current, helpOpen, visual, runSearch, runCommand, enterVisual, yank]);

  const status =
    mode === 'search'
      ? `/${buffer}`
      : mode === 'command'
        ? `:${buffer}`
        : mode === 'visual'
          ? '-- VISUAL --'
          : message || '-- NORMAL --';

  return (
    <div className='vim' aria-hidden='true'>
      {helpOpen && (
        <dl className='vim-help'>
          {HELP.map(([keys, desc]) => (
            <div key={keys}>
              <dt>{keys}</dt>
              <dd>{desc}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className='vim-status'>{status}</div>
    </div>
  );
};
