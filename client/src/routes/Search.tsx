import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchNews, type NewsPage } from '../lib/api';
import { plural } from '../lib/format';
import type { StateName } from '../data/districts';
import Story from '../components/Story';
import { ColumnSkeleton, Notice, ServerDown } from '../components/Status';

const STATES: (StateName | undefined)[] = [undefined, 'Telangana', 'Andhra Pradesh'];

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = (params.get('q') ?? '').trim();
  const state = (params.get('state') as StateName | null) ?? undefined;

  const results = useInfiniteQuery({
    queryKey: ['search', q, state],
    enabled: q.length > 0,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchNews({ search: q, state, page: pageParam, limit: 20 }),
    getNextPageParam: (last: NewsPage) => (last.pagination.page < last.pagination.pages ? last.pagination.page + 1 : undefined)
  });
  const articles = useMemo(() => results.data?.pages.flatMap((p) => p.articles) ?? [], [results.data]);
  const total = results.data?.pages[0]?.pagination.total ?? 0;

  const pickState = (next?: StateName) => {
    const copy = new URLSearchParams(params);
    if (next) copy.set('state', next);
    else copy.delete('state');
    setParams(copy);
  };

  return (
    <main className="wrap page">
      <header className="search-head">
        <p className="kicker">Search</p>
        <h1>{q ? <>Headlines mentioning “{q}”</> : 'Search the headlines'}</h1>
        {q && results.data && <p className="search-head__line">{plural(total, 'story', 'stories')}</p>}
      </header>

      {q && (
        <div className="filters" role="group" aria-label="Filter by state">
          {STATES.map((s) => (
            <button key={s ?? 'all'} type="button" aria-pressed={state === s} onClick={() => pickState(s)}>
              {s ?? 'Both states'}
            </button>
          ))}
        </div>
      )}

      {!q ? (
        <Notice title="Type a place, a name or a topic in the search box above" />
      ) : results.isError ? (
        <ServerDown message={(results.error as Error).message} />
      ) : results.isPending ? (
        <ColumnSkeleton rows={6} />
      ) : articles.length === 0 ? (
        <Notice title={`Nothing on file mentions “${q}”`}>
          <p>Try a district name or a shorter word.</p>
        </Notice>
      ) : (
        <div className="results">
          {articles.map((a) => <Story key={a._id} article={a} highlight={q} />)}
          {results.hasNextPage && (
            <button type="button" className="load-more" onClick={() => results.fetchNextPage()} disabled={results.isFetchingNextPage}>
              {results.isFetchingNextPage ? 'Loading…' : 'More results'}
            </button>
          )}
        </div>
      )}
    </main>
  );
}
