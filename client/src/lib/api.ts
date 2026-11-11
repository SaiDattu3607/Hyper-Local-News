import type { StateName } from '../data/districts';

export interface Article {
  _id: string;
  title: string;
  description: string;
  link: string;
  source: string;
  state: StateName | 'Unknown';
  district: string;
  publishedAt?: string;
  createdAt: string;
}

export interface NewsPage {
  articles: Article[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export interface DistrictStat {
  state: StateName | 'Unknown';
  district: string;
  total: number;
  last24h: number;
}

export interface Stats {
  lastIngestedAt: string | null;
  states: Partial<Record<StateName | 'Unknown', { total: number; last24h: number }>>;
  districts: DistrictStat[];
}

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
  }
}

async function get<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, { headers: { Accept: 'application/json' } });
  } catch {
    throw new ApiError('The news server could not be reached.');
  }
  if (!response.ok) {
    throw new ApiError(response.status >= 500 ? 'The news server ran into a problem.' : `Request failed (${response.status}).`, response.status);
  }
  return response.json() as Promise<T>;
}

export interface NewsQuery {
  state?: StateName;
  district?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function fetchNews(query: NewsQuery): Promise<NewsPage> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') params.set(key, String(value));
  }
  return get<NewsPage>(`/api/news?${params}`);
}

export const fetchStats = () => get<Stats>('/api/stats');
