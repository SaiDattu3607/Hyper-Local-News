import { useEffect, useState, type FormEvent } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchStats } from '../lib/api';
import { englishDate, relativeTime, teluguDate } from '../lib/format';

type Theme = 'day' | 'night';

function useTheme(): [Theme, () => void] {
  const initial = (): Theme => {
    const set = document.documentElement.dataset.theme;
    if (set === 'day' || set === 'night') return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
  };
  const [theme, setTheme] = useState<Theme>(initial);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  const toggle = () =>
    setTheme((current) => {
      const next = current === 'day' ? 'night' : 'day';
      try { localStorage.setItem('hln-theme', next); } catch { /* storage blocked */ }
      return next;
    });
  return [theme, toggle];
}

function useNow(intervalMs = 60000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

export default function Masthead() {
  const [theme, toggleTheme] = useTheme();
  const now = useNow();
  const today = new Date(now);
  const stats = useQuery({ queryKey: ['stats'], queryFn: fetchStats, refetchInterval: 5 * 60000 });
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const updated = stats.data?.lastIngestedAt ? new Date(stats.data.lastIngestedAt) : null;

  return (
    <header className="masthead">
      <div className="masthead__strip wrap">
        <span>{englishDate(today)}</span>
        <span className="te" lang="te">{teluguDate(today)}</span>
        <span className="masthead__live">
          {stats.isError ? (
            <>Server offline</>
          ) : updated ? (
            <>
              <i className="live-dot" aria-hidden="true" />
              Wire updated <time dateTime={updated.toISOString()}>{relativeTime(updated, now)}</time>
            </>
          ) : (
            <>Waiting for the first wire</>
          )}
        </span>
        <button type="button" className="theme-toggle" onClick={toggleTheme} aria-pressed={theme === 'night'}>
          {theme === 'night' ? 'Day edition' : 'Night edition'}
        </button>
      </div>

      <div className="masthead__title wrap" data-enter>
        <Link to="/" className="masthead__name">Hyper Local News</Link>
        <p className="masthead__te te" lang="te">స్థానిక వార్తలు</p>
        <p className="masthead__tag">Every district of Telangana and Andhra Pradesh, on one page</p>
      </div>

      <nav className="masthead__nav wrap" aria-label="Editions">
        <div className="masthead__editions">
          <NavLink to="/" end>Front page</NavLink>
          <NavLink to="/telangana">Telangana <span className="te" lang="te">తెలంగాణ</span></NavLink>
          <NavLink to="/andhra-pradesh">Andhra Pradesh <span className="te" lang="te">ఆంధ్రప్రదేశ్</span></NavLink>
        </div>
        <form className="search" role="search" onSubmit={submit}>
          <label htmlFor="q" className="sr-only">Search headlines</label>
          <input
            id="q"
            type="search"
            placeholder="Search headlines"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            maxLength={100}
          />
          <button type="submit">Search</button>
        </form>
      </nav>
    </header>
  );
}
