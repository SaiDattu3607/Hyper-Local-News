import NewsArticle from '../models/NewsArticle.js';
import { getAllDistricts } from '../utils/districtClassifier.js';
import { runIngestion } from '../services/newsIngestion.js';

export async function getNews(request, response) {
  const { state, district, search } = request.query;
  const page = Math.max(Number.parseInt(request.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(request.query.limit, 10) || 10, 1), 100);
  const filter = {};

  if (state) filter.state = state;
  if (district) filter.district = district;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } }
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
