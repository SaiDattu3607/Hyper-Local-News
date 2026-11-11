import type { Article } from './api';

/** Google News titles end in " - Source"; the API already stores the source separately. */
export function cleanTitle(article: Pick<Article, 'title' | 'source'>): string {
  const { title, source } = article;
  const cut = title.lastIndexOf(' - ');
  if (cut > 0 && title.slice(cut + 3).trim() === source.trim()) return title.slice(0, cut).trim();
  return title;
}

/** The RSS description usually repeats the title and source; keep it only when it adds something. */
export function usefulDescription(article: Pick<Article, 'title' | 'description' | 'source'>): string {
  const description = (article.description || '').replace(/\s+/g, ' ').trim();
  if (!description) return '';
  const title = cleanTitle(article).toLowerCase();
  const plain = description.replace(new RegExp(`\\s*${escape(article.source)}\\s*$`, 'i'), '').trim();
  if (!plain || plain.toLowerCase() === title || title.startsWith(plain.toLowerCase())) return '';
  return plain;
}

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const storyTime = (article: Pick<Article, 'publishedAt' | 'createdAt'>) =>
  new Date(article.publishedAt || article.createdAt);

export function relativeTime(date: Date, now = Date.now()): string {
  const minutes = Math.round((now - date.getTime()) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return days === 1 ? 'yesterday' : `${days} days ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export const exactTime = (date: Date) =>
  date.toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

export const englishDate = (date: Date) =>
  date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

export const teluguDate = (date: Date) =>
  date.toLocaleDateString('te-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

/** "Today", "Yesterday", or a date, for grouping a district's stories by day. */
export function dayLabel(date: Date, now = new Date()): string {
  const start = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diff = Math.round((start(now) - start(date)) / 86400000);
  if (diff <= 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
}

export const plural = (n: number, one: string, many = `${one}s`) => `${n.toLocaleString('en-IN')} ${n === 1 ? one : many}`;
