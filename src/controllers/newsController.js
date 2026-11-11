import NewsArticle from '../models/NewsArticle.js';
import { getAllDistricts } from '../utils/districtClassifier.js';
import { runIngestion } from '../services/newsIngestion.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export async function getNews(request, response) {
  const { state, district, search } = request.query;
  const page = Math.max(Number.parseInt(request.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(request.query.limit, 10) || 10, 1), 100);
  const filter = {};

  if (state) filter.state = state;
  if (district) filter.district = district;
  if (search) {
    // Escape regex metacharacters so user input is matched literally and cannot
    // produce an invalid or catastrophically slow pattern.
    const pattern = escapeRegex(String(search).slice(0, 100));
    filter.$or = [
      { title: { $regex: pattern, $options: 'i' } },
      { description: { $regex: pattern, $options: 'i' } },
      { content: { $regex: pattern, $options: 'i' } }
    ];
  }

  const [articles, total] = await Promise.all([
    NewsArticle.find(filter).sort({ publishedAt: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    NewsArticle.countDocuments(filter)
  ]);

  response.json({ articles, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}

export function getDistricts(request, response) {
  response.json(getAllDistricts());
}

export async function triggerScrape(request, response) {
  const result = await runIngestion();
  response.status(202).json({ message: 'Scrape completed', ...result });
}

export async function getStats(request, response) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [groups, latest] = await Promise.all([
    NewsArticle.aggregate([
      {
        $group: {
          _id: { state: '$state', district: '$district' },
          total: { $sum: 1 },
          last24h: { $sum: { $cond: [{ $gte: [{ $ifNull: ['$publishedAt', '$createdAt'] }, since] }, 1, 0] } }
        }
      }
    ]),
    NewsArticle.findOne().sort({ createdAt: -1 }).select({ createdAt: 1 }).lean()
  ]);

  const states = {};
  const districts = [];
  for (const { _id, total, last24h } of groups) {
    const state = states[_id.state] || (states[_id.state] = { total: 0, last24h: 0 });
    state.total += total;
    state.last24h += last24h;
    districts.push({ state: _id.state, district: _id.district, total, last24h });
  }
  districts.sort((left, right) => right.last24h - left.last24h || right.total - left.total);

  response.json({ lastIngestedAt: latest?.createdAt ?? null, states, districts });
}
