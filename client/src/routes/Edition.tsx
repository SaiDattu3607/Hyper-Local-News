import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchNews, fetchStats, type Article } from '../lib/api';
import { dayLabel, plural, storyTime } from '../lib/format';
import { STATE_TE, fromSlug, stateSlug } from '../data/districts';
import DistrictMap from '../components/DistrictMap';
import Story from '../components/Story';
import { ColumnSkeleton, Notice, ServerDown } from '../components/Status';
import NotFound from './NotFound';

const PAGE = 20;

export default function Edition() {
  const { state: stateParam, district: districtParam } = useParams();
  const district = districtParam ? fromSlug(districtParam) : undefined;
  const [source, setSource] = useState<string | null>(null);

  const stats = useQuery({ queryKey: ['stats'], queryFn: fetchStats, refetchInterval: 5 * 60000 });
  const news = useInfiniteQuery({
    queryKey: ['edition', district?.name],
    enabled: Boolean(district),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchNews({ district: district!.name, page: pageParam, limit: PAGE }),
    getNextPageParam: (last) => (last.pagination.page < last.pagination.pages ? last.pagination.page + 1 : undefined)
  });

  const articles = useMemo(() => news.data?.pages.flatMap((p) => p.articles) ?? [], [news.data]);
  const sources = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of articles) counts.set(a.source, (counts.get(a.source) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [articles]);
  const days = useMemo(() => {
    const groups: { label: string; items: Article[] }[] = [];
    for (const a of articles) {
      if (source && a.source !== source) continue;
      const label = dayLabel(storyTime(a));
      const last = groups[groups.length - 1];
      if (last?.label === label) last.items.push(a);
      else groups.push({ label, items: [a] });
    }
    return groups;
  }, [articles, source]);

  if (!district || stateParam !== stateSlug(district.state)) return <NotFound />;

  const stat = stats.data?.districts.find((d) => d.district === district.name);
  const total = news.data?.pages[0]?.pagination.total;

  return (
    <main className="wrap page">
      <header className="edition-head">
        <div className="edition-head__text">
          <p className="kicker">
            <Link to={`/${stateSlug(district.state)}`}>{district.state} <span className="te" lang="te">{STATE_TE[district.state]}</span></Link>
            {' · '}District edition
          </p>
          <h1 className="edition-head__name">{district.name}</h1>
          <p className="edition-head__te te" lang="te">{district.te}</p>
          <p className="edition-head__line">
            {total !== undefined && <>{plural(total, 'story', 'stories')} on file</>}
            {stat && <> · {stat.last24h} in the last 24 hours</>}
          </p>
        </div>
        <div className="edition-head__map">
          <DistrictMap stats={stats.data?.districts} active={district.name} focusState={district.state} compact />
        </div>
      </header>

      {sources.length > 1 && (
        <div className="filters" role="group" aria-label="Filter by source">
          <button type="button" aria-pressed={source === null} onClick={() => setSource(null)}>All sources</button>
          {sources.map(([name, n]) => (
            <button key={name} type="button" aria-pressed={source === name} onClick={() => setSource(source === name ? null : name)}>
              {name} <span className="filters__n">{n}</span>
            </button>
          ))}
        </div>
      )}

      {news.isError ? (
        <ServerDown message={(news.error as Error).message} />
      ) : news.isPending ? (
        <ColumnSkeleton rows={6} />
      ) : articles.length === 0 ? (
        <Notice title={`No stories filed from ${district.name} yet`}>
          <p>New headlines arrive every 30 minutes. The neighbouring districts on the map may have news in the meantime.</p>
        </Notice>
      ) : (
        <div className="days">
          {days.map((day) => (
            <section key={day.label} className="day">
              <h2 className="day__label">{day.label}</h2>
              <div className="day__stories">
                {day.items.map((a) => <Story key={a._id} article={a} hideDistrict />)}
              </div>
            </section>
          ))}
          {news.hasNextPage && (
            <button type="button" className="load-more" onClick={() => news.fetchNextPage()} disabled={news.isFetchingNextPage}>
              {news.isFetchingNextPage ? 'Loading…' : 'Older stories'}
            </button>
          )}
        </div>
      )}
    </main>
  );
}
