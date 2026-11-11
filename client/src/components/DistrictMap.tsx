import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DistrictStat } from '../lib/api';
import { DISTRICTS, GRID, editionPath, type District, type StateName } from '../data/districts';

interface Props {
  stats?: DistrictStat[];
  /** Highlight one district (the edition being read). */
  active?: string;
  /** Dim the other state's tiles. */
  focusState?: StateName;
  compact?: boolean;
}

/** Five ink levels; 0 means no stories in the last 24 hours. */
function level(count: number, max: number) {
  if (!count || !max) return 0;
  return Math.min(4, 1 + Math.floor(Math.sqrt(count / max) * 3.999));
}

export default function DistrictMap({ stats, active, focusState, compact }: Props) {
  const navigate = useNavigate();
  const [hover, setHover] = useState<District | null>(null);
  const refs = useRef(new Map<string, HTMLAnchorElement>());

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of stats ?? []) map.set(s.district, s.last24h);
    return map;
  }, [stats]);
  const max = Math.max(0, ...counts.values());
  const shown = hover ?? DISTRICTS.find((d) => d.name === active) ?? null;

  const grid = useMemo(() => {
    const cells = new Map<string, District>();
    for (const d of DISTRICTS) cells.set(`${d.col},${d.row}`, d);
    return cells;
  }, []);

  /** Arrow keys move to the nearest tile in that direction. */
  const onKey = (event: KeyboardEvent, d: District) => {
    const step: Record<string, [number, number]> = {
      ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0]
    };
    const move = step[event.key];
    if (!move) return;
    event.preventDefault();
    for (let i = 1; i <= Math.max(GRID.cols, GRID.rows); i++) {
      const next = grid.get(`${d.col + move[0] * i},${d.row + move[1] * i}`);
      if (next) {
        refs.current.get(next.name)?.focus();
        return;
      }
    }
  };

  return (
    <figure className={`dmap${compact ? ' dmap--compact' : ''}`}>
      <div
        className="dmap__grid"
        style={{ gridTemplateColumns: `repeat(${GRID.cols}, 1fr)`, gridTemplateRows: `repeat(${GRID.rows}, 1fr)` }}
        onMouseLeave={() => setHover(null)}
      >
        {DISTRICTS.map((d) => {
          const count = counts.get(d.name) ?? 0;
          const classes = [
            'dmap__tile',
            `ink-${level(count, max)}`,
            d.state === 'Telangana' ? 'is-ts' : 'is-ap',
            d.name === active ? 'is-active' : '',
            focusState && d.state !== focusState ? 'is-dim' : ''
          ].join(' ');
          return (
            <a
              key={d.name}
              ref={(el) => { if (el) refs.current.set(d.name, el); }}
              href={editionPath(d)}
              className={classes}
              style={{ gridColumn: d.col + 1, gridRow: d.row + 1 }}
              aria-label={`${d.name}, ${d.state}: ${count} ${count === 1 ? 'story' : 'stories'} in the last 24 hours`}
              onClick={(event) => { event.preventDefault(); navigate(editionPath(d)); }}
              onMouseEnter={() => setHover(d)}
              onFocus={() => setHover(d)}
              onKeyDown={(event) => onKey(event, d)}
            >
              <span aria-hidden="true">{d.code}</span>
            </a>
          );
        })}
      </div>
      <figcaption className="dmap__readout" aria-live="polite">
        {shown ? (
          <>
            <strong>{shown.name}</strong> <span className="te" lang="te">{shown.te}</span>
            <span className="dmap__count">
              {(counts.get(shown.name) ?? 0).toLocaleString('en-IN')} in 24 hrs · {shown.state}
            </span>
          </>
        ) : (
          <span className="dmap__hint">Point at a district, or use the arrow keys</span>
        )}
      </figcaption>
      {!compact && (
        <div className="dmap__legend" aria-hidden="true">
          <span>Fewer</span>
          {[0, 1, 2, 3, 4].map((n) => <i key={n} className={`ink-${n}`} />)}
          <span>More stories, last 24 hrs</span>
        </div>
      )}
    </figure>
  );
}
