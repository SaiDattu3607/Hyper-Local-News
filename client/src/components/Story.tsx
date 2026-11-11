import { Link } from 'react-router-dom';
import type { Article } from '../lib/api';
import { cleanTitle, exactTime, relativeTime, storyTime, usefulDescription } from '../lib/format';
import { editionPath, findDistrict } from '../data/districts';

interface Props {
  article: Article;
  variant?: 'lead' | 'column' | 'compact';
  /** Hide the district kicker (already on a district page). */
  hideDistrict?: boolean;
  highlight?: string;
}

function Highlight({ text, term }: { text: string; term?: string }) {
  if (!term) return <>{text}</>;
  const lower = text.toLowerCase();
  const needle = term.toLowerCase();
  const parts: React.ReactNode[] = [];
  let from = 0;
  for (let at = lower.indexOf(needle); at !== -1 && needle; at = lower.indexOf(needle, from)) {
    parts.push(text.slice(from, at), <mark key={at}>{text.slice(at, at + needle.length)}</mark>);
    from = at + needle.length;
  }
  parts.push(text.slice(from));
  return <>{parts}</>;
}

export default function Story({ article, variant = 'column', hideDistrict, highlight }: Props) {
  const title = cleanTitle(article);
  const description = variant === 'compact' ? '' : usefulDescription(article);
  const when = storyTime(article);
  const district = findDistrict(article.district);
  const Heading = variant === 'lead' ? 'h2' : 'h3';

  return (
    <article className={`story story--${variant}`}>
      {!hideDistrict && (
        <p className="kicker">
          {district ? <Link to={editionPath(district)}>{district.name}</Link> : <span>{article.district}</span>}
        </p>
      )}
      <Heading className="story__title">
        <a href={article.link} target="_blank" rel="noopener noreferrer">
          <Highlight text={title} term={highlight} />
        </a>
      </Heading>
      {description && (
        <p className="story__dek">
          <Highlight text={description} term={highlight} />
        </p>
      )}
      <p className="story__meta">
        <span className="story__source">{article.source}</span>
        <time dateTime={when.toISOString()} title={exactTime(when)}>{relativeTime(when)}</time>
      </p>
    </article>
  );
}
