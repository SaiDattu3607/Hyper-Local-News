import { Link } from 'react-router-dom';
import { useQueries, useQuery } from '@tanstack/react-query';
import { fetchNews, fetchStats } from '../lib/api';
import { plural } from '../lib/format';
import { DISTRICTS, STATE_TE, editionPath, findDistrict, type StateName } from '../data/districts';
import DistrictMap from '../components/DistrictMap';
import DistrictIndex from '../components/DistrictIndex';
import Story from '../components/Story';
import { ColumnSkeleton, Notice, ServerDown } from '../components/Status';

export default function FrontPage({ state }: { state?: StateName }) {
  const stats = useQuery({ queryKey: ['stats'], queryFn: fetchStats, refetchInterval: 5 * 60000 });
  const latest = useQuery({
    queryKey: ['news', { state, limit: 13 }],
    queryFn: () => fetchNews({ state, limit: 13 })
  });

  const busiest = (stats.data?.districts ?? [])
    .filter((d) => findDistrict(d.district) && (!state || d.state === state) && d.last24h > 0)
    .slice(0, 8);

  const around = useQueries({
    queries: busiest.slice(0, 6).map((d) => ({
      queryKey: ['news', { district: d.district, limit: 3 }],
      queryFn: () => fetchNews({ district: d.district, limit: 3 })
    }))
  });

  const leadDistrict = latest.data?.articles[0]?.district;
  const related = useQuery({
    queryKey: ['news', { district: leadDistrict, limit: 16 }],
    enabled: Boolean(leadDistrict && findDistrict(leadDistrict)),
    queryFn: () => fetchNews({ district: leadDistrict, limit: 16 })
  });

  if (latest.isError) {
    return <main className="wrap page"><ServerDown message={(latest.error as Error).message} /></main>;
  }

  const articles = latest.data?.articles ?? [];
  const [lead, ...rest] = articles;
  const leadInfo = lead ? findDistrict(lead.district) : undefined;
  const shownIds = new Set(articles.map((a) => a._id));
  const relatedStories = (related.data?.articles ?? []).filter((a) => !shownIds.has(a._id)).slice(0, 3);
  const districtCount = state ? DISTRICTS.filter((d) => d.state === state).length : DISTRICTS.length;
  const stateTotals = state ? stats.data?.states[state] : undefined;

  return (
    <main className="wrap page">
      {state && (
        <header className="state-head">
          <p className="kicker">State edition</p>
          <h1>{state} <span className="te" lang="te">{STATE_TE[state]}</span></h1>
          <p className="state-head__line">
            {plural(districtCount, 'district')}
            {stateTotals ? <> · {plural(stateTotals.last24h, 'story', 'stories')} in the last 24 hours</> : null}
          </p>
        </header>
      )}

      <div className="front">
        <section className="front__news" aria-label="Latest stories">
          {latest.isPending ? (
            <ColumnSkeleton rows={5} />
          ) : !lead ? (
            <Notice title="No stories on the wire yet">
              <p>The server fetches Google News every 30 minutes. To fill the page now, send <code>POST /api/scrape/trigger</code>.</p>
            </Notice>
          ) : (
            <>
              <div className="lead">
                <Story article={lead} variant="lead" />
                {relatedStories.length > 0 && leadInfo && (
                  <div className="lead__more">
                    <h2 className="section-label">More from {leadInfo.name}</h2>
                    {relatedStories.map((a) => <Story key={a._id} article={a} variant="compact" hideDistrict />)}
                  </div>
                )}
              </div>
              <div className="columns">
                {rest.map((article) => <Story key={article._id} article={article} />)}
              </div>
            </>
          )}
        </section>

        <aside className="front__aside" aria-label="Districts">
          <h2 className="section-label">The districts today</h2>
          <DistrictMap stats={stats.data?.districts} focusState={state} />
          <DistrictIndex state={state} />
          {busiest.length > 0 && (
            <>
              <h2 className="section-label">Most reported, last 24 hours</h2>
              <ol className="busiest">
                {busiest.map((d) => {
                  const info = findDistrict(d.district)!;
                  return (
                    <li key={d.district}>
                      <Link to={editionPath(info)}>
                        <span className="busiest__name">{info.name}</span>
                        <span className="busiest__te te" lang="te">{info.te}</span>
                        <span className="busiest__n">{d.last24h}</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </>
          )}
        </aside>
      </div>

      {around.length > 0 && (
        <section className="around" aria-labelledby="around-title">
          <h2 id="around-title" className="around__title">Around the districts</h2>
          <div className="around__grid">
            {busiest.slice(0, 6).map((d, i) => {
              const info = findDistrict(d.district)!;
              const result = around[i];
              return (
                <div key={d.district} className="around__desk">
                  <h3 className="around__desk-name">
                    <Link to={editionPath(info)}>{info.name}</Link>
                    <span className="te" lang="te">{info.te}</span>
                  </h3>
                  {result?.isPending ? (
                    <ColumnSkeleton rows={2} />
                  ) : (
                    result?.data?.articles.map((a) => <Story key={a._id} article={a} variant="compact" hideDistrict />)
                  )}
                  <Link className="more-link" to={editionPath(info)}>All {info.name} stories</Link>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
