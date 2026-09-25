import axios from 'axios';
import cron from 'node-cron';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import NewsArticle from '../models/NewsArticle.js';
import {
  ANDHRA_PRADESH_DISTRICTS,
  TELANGANA_DISTRICTS,
  classifyArticle
} from '../utils/districtClassifier.js';

const parser = new Parser();
const GOOGLE_NEWS_URL = 'https://news.google.com/rss/search';
let ingestionInProgress = false;

function buildFeedUrl(district, state) {
  const query = encodeURIComponent(`${district} ${state}`);
  return `${GOOGLE_NEWS_URL}?q=${query}&hl=en-IN&gl=IN&ceid=IN:en`;
}

function cleanHtml(value = '') {
  return cheerio.load(`<div>${value}</div>`).text().trim();
}

function sourceFromTitle(title = '') {
  const separatorIndex = title.lastIndexOf(' - ');
  return separatorIndex > 0 ? title.slice(separatorIndex + 3).trim() : 'Google News';
}

async function fetchFeed(district, state) {
  const response = await axios.get(buildFeedUrl(district, state), {
    timeout: 15000,
    responseType: 'text',
    headers: { Accept: 'application/rss+xml, application/xml, text/xml' }
  });
  return parser.parseString(response.data);
}

async function ingestFeed(district, state) {
  const feed = await fetchFeed(district, state);
  let stored = 0;

  for (const item of feed.items || []) {
    if (!item.title || !item.link) continue;

    const description = cleanHtml(item.contentSnippet || item.content || item.description || '');
    const classification = classifyArticle(item.title, description);
    const publishedAt = item.isoDate || item.pubDate ? new Date(item.isoDate || item.pubDate) : undefined;
    const article = {
      title: item.title.trim(),
      description,
      content: description,
      link: item.link.trim(),
      source: sourceFromTitle(item.title),
      state: classification.state === 'Unknown' ? state : classification.state,
      district: classification.district === 'General' ? district : classification.district,
      ...(publishedAt && !Number.isNaN(publishedAt.getTime()) ? { publishedAt } : {})
    };

    await NewsArticle.updateOne(
      { link: article.link },
      { $set: article, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
    stored += 1;
  }

  return stored;
}

export async function runIngestion() {
  if (ingestionInProgress) return { stored: 0, feeds: 0, skipped: true };

  ingestionInProgress = true;
  let stored = 0;
  let feeds = 0;
  let failedFeeds = 0;

  try {
    const feedTargets = [
      ...TELANGANA_DISTRICTS.map((district) => ({ district, state: 'Telangana' })),
      ...ANDHRA_PRADESH_DISTRICTS.map((district) => ({ district, state: 'Andhra Pradesh' }))
    ];

    for (const target of feedTargets) {
      try {
        stored += await ingestFeed(target.district, target.state);
        feeds += 1;
      } catch (error) {
        failedFeeds += 1;
        console.error(`Feed failed for ${target.district}, ${target.state}:`, error.message);
      }
    }

    return { stored, feeds, failedFeeds, skipped: false };
  } finally {
    ingestionInProgress = false;
  }
}

export function startIngestionCron() {
  cron.schedule('*/30 * * * *', async () => {
    console.log('Starting scheduled news ingestion...');
    const result = await runIngestion();
    console.log('Scheduled news ingestion finished:', result);
  });
}
